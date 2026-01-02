using System.ComponentModel.DataAnnotations;
using Core.Entities.OrderAggregate;

namespace backend.Dtos;

public class OrderCreatedDto
{
    [Required]
    public string CartId { get; set; } = string.Empty;
    [Required]
    public int DeliveryMethodId { get; set; }
    [Required]
    public ShippingAddress ShippingAddress { get; set; } = null!;
    [Required]
    public PaymentSummary PaymentSummary { get; set; } = null!;
}