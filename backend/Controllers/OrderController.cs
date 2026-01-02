using backend.Dtos;
using backend.Extensions;
using Core;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[Authorize]
public class OrdersController(ICartRepository cartRepository,IUnitOfWork uow) : BaseController
{
    [HttpPost]
    public async Task<ActionResult<Order>> CreateOrder([FromBody] OrderCreatedDto orderCreated)
    {
        var email = User.GetEmail();
        var cart = await cartRepository.GetCartAsync(orderCreated.CartId);
        if(cart == null) return BadRequest("Cart Not Found");
        
        if(cart.PaymentIntentId == null) return BadRequest("No Payment intent for this order");
        var items = new List<OrderItem>();
        foreach (var item in cart.Items)
        {
            var productItem = await uow.Repository<Product>().GetByIdAsync(item.ProductId);
            if(productItem == null) return BadRequest("No Product Found");

            var itemOrder = new ProductItemOrdered()
            {
                ProductId = item.ProductId,
                ProductName = productItem.Name,
                PictureUrl = productItem.PictureUrl,
            };

            var orderItem = new OrderItem()
            {
                ItemOrdered = itemOrder,
                Price = productItem.Price,
                Quantity = item.Quantity,
            };
            items.Add(orderItem);
        }

        var deliveryMethod = await uow.Repository<DeliveryMethod>().GetByIdAsync(orderCreated.DeliveryMethodId);
        if (deliveryMethod == null) return BadRequest("No Delivery method selected");
        var orders = new Order()
        {
            OrderItems = items,
            DeliveryMethod = deliveryMethod,
            ShippingAddress = orderCreated.ShippingAddress,
            Subtotal = items.Sum(item => item.Price * item.Quantity),
            PaymentSummary = orderCreated.PaymentSummary,
            PaymentIntentId = cart.PaymentIntentId,
            BuyerEmail = email,
        };
        
        uow.Repository<Order>().Add(orders);
        if (await uow.Complete()) return Ok(orders);
        
        return BadRequest("Order Failed");
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<OrderItem>>> ListOrderItems()
    {
        var spec = new OrderSpecification(User.GetEmail());
        var order = await uow.Repository<Order>().ListAsync(spec);

        var ordersToReturn = order.Select(item => item.ToOrderDto());
        return Ok(ordersToReturn);
    }
    
    [HttpGet("{id:int}")]
    public async Task<ActionResult<IReadOnlyList<OrderItem>>> getOrderItem(int id)
    {
        var spec = new OrderSpecification(User.GetEmail(),id);
        var order = await uow.Repository<Order>().GetEntityWithSpec(spec);
        
        if(order == null) return BadRequest("Order Not Found");

        return Ok(order.ToOrderDto());
    }
}