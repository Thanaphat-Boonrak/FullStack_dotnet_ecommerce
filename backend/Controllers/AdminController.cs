using backend.Dtos;
using backend.Extensions;
using Core;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[Authorize(Roles = "Admin")]
public class AdminController(IUnitOfWork uow,IPaymentService paymentService) : BaseController
{
    [HttpGet("orders")]
    public async Task<ActionResult<List<OrderDto>>> GetOrders([FromQuery] OrderSpecParam specParams)
    {
        var spec = new OrderSpecification(specParams);
        return await CreatePageResult(uow.Repository<Order>(),spec,specParams.PageNumber,specParams.PageSize,o => o.ToOrderDto());
    }


    [HttpGet("orders/{id:int}")]
    public async Task<ActionResult<OrderDto>> GetOrderById(int id)
    {
        var spec = new OrderSpecification(id);
        var order =  await uow.Repository<Order>().GetEntityWithSpec(spec);
        if(order == null) return BadRequest("No order With that id");
        return order.ToOrderDto();
    }

    [HttpPost("orders/refund/{id:int}")]
    public async Task<ActionResult<OrderDto>> RefundOrder([FromRoute] int id)
    {
        var spec = new OrderSpecification(id);
        
        var order = await uow.Repository<Order>().GetEntityWithSpec(spec);
        
        if(order == null) return BadRequest("No order With that id");

        if (order.Status == OrderStatus.Pending)
        {
            return BadRequest("Payment not recived for this order");
        }

        var result = await paymentService.RefundPayment(order.PaymentIntentId);

        if (result == "succeeded")
        {
            order.Status = OrderStatus.PaymentRefund;
            await uow.Complete();
            return order.ToOrderDto();
        }
        return BadRequest("Payment Refund failed");
    }
    
}