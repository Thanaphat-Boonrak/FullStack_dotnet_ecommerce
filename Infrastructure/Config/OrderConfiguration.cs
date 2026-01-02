using Core.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Config;

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.OwnsOne(order => order.ShippingAddress, o => o.WithOwner());
        builder.OwnsOne(order => order.PaymentSummary, o => o.WithOwner());
        builder.Property(order => order.Status).HasConversion(o => o.ToString(), 
            o => (OrderStatus)Enum.Parse(typeof(OrderStatus), o));
        builder.Property(order => order.Subtotal).HasColumnType("decimal(18,2)");
        builder.HasMany(order => order.OrderItems).WithOne().OnDelete(DeleteBehavior.Cascade);
        builder.Property(x => x.OrderDate).HasConversion(d => d.ToUniversalTime(),d => DateTime.SpecifyKind(d, DateTimeKind.Utc));
    }
}