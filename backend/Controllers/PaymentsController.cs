using backend.Extensions;
using backend.SignalR;
using Core;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Stripe;

namespace backend.Controllers;

public class PaymentsController(IPaymentService paymentService,IConfiguration config ,  IUnitOfWork uow,ILogger<PaymentsController> logger,IHubContext<NotificationHub> hubContext) : BaseController
{
    private readonly string _whSecret = config["StripeSettings:WebKey"]!;
    
    [Authorize]
    [HttpPost("{cartId}")]
    public async Task<ActionResult<ShoppingCart>> CreateOrUpdatePaymentIntent(string cartId)
    {
        var cart = await paymentService.CreateOrUpdatePaymentIntent(cartId);

        if (cart == null) return BadRequest("Cart has problem");
        
        return Ok(cart);
    }


    [HttpGet("delivery-methods")]
    public async Task<ActionResult<IReadOnlyList<DeliveryMethod>>> GetDeliveryMethods()
    {
        return Ok(await uow.Repository<DeliveryMethod>().ListAllAsync());
    }


    [HttpPost("webhooks")]
    public async Task<IActionResult> StripeWebhooks()
    {
        var json = await new StreamReader(Request.Body).ReadToEndAsync();
        try
        {
            var stripeEvent = ConstructStripEvent(json);
            if (stripeEvent.Data.Object is not PaymentIntent stripeEventData)
            {
                return BadRequest("Webhook event was not a PaymentIntent");
            }
            await HandlePaymentIntentSucceeded(stripeEventData);
            return Ok();
        }
        catch (Exception e)
        {
            logger.LogError(e, "An error occured while constructing event");
            throw;
        }
    }

    private async Task HandlePaymentIntentSucceeded(PaymentIntent stripeEventData)
    {
        if (stripeEventData.Status == "succeeded")
        {
            var spec = new OrderSpecification(stripeEventData.Id,true);
            var order = await uow.Repository<Order>().GetEntityWithSpec(spec) ?? throw new KeyNotFoundException("Order not found");
            order.Status = (long)(order.GetTotal()) * 100 != stripeEventData.Amount ? OrderStatus.PaymentMisMatch : OrderStatus.PaymentReceived;

            await uow.Complete();

            var connectionId = NotificationHub.GetConnectionByEmail(order.BuyerEmail);

            if (!string.IsNullOrEmpty(connectionId))
            {
                await hubContext.Clients.Client(connectionId).SendAsync("OrderCompleteNotification",order.ToOrderDto());
            }
        }
    }

    private Event ConstructStripEvent(string json)
    {
        try
        {
        return EventUtility.ConstructEvent(json,Request.Headers["Stripe-Signature"],_whSecret);
        }
        catch (Exception e)
        {
            logger.LogError(e, "An error occured while constructing event");
            throw new StripeException("Invalid Signature ", e);
        }
    }
}