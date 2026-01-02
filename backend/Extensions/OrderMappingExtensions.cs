using backend.Dtos;
using Core.Entities.OrderAggregate;

namespace backend.Extensions;

public static class OrderMappingExtensions
{
    public static OrderDto ToOrderDto(this Order order)
    {
        return new OrderDto
        {
            Id = order.Id,
            BuyerEmail = order.BuyerEmail,
            OrderDate = order.OrderDate,
            PaymentSummary = order.PaymentSummary,
            DeliveryMethod = order.DeliveryMethod.Description,
            ShippingPrice = order.DeliveryMethod.Price,
            ShippingAddress = order.ShippingAddress,
            OrderItems = order.OrderItems.Select(x => x.ToOrderItemDto())
                .ToList(),
            Subtotal = order.Subtotal,
            Total = order.Subtotal + order.DeliveryMethod.Price,
            Status = order.Status.ToString(),
            PaymentIntentId = order.PaymentIntentId,
        };
    }

    public static OrderItemDto ToOrderItemDto(this OrderItem orderItem)
    {
        return new OrderItemDto()
        {
            ProductId = orderItem.ItemOrdered.ProductId,
            ProductName = orderItem.ItemOrdered.ProductName,
            PictureUrl = orderItem.ItemOrdered.PictureUrl,
            Price = orderItem.Price,
            Quantity = orderItem.Quantity,
        };
    }
}