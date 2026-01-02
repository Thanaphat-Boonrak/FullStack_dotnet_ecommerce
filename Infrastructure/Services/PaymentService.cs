using Core.Entities;
using Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Stripe;
using Product = Core.Entities.Product;

namespace Infrastructure.Services;

public class PaymentService(IConfiguration config, ICartRepository cartRepository, IUnitOfWork uow) : IPaymentService
{
    public async Task<ShoppingCart?> CreateOrUpdatePaymentIntent
        (string cartId)
    {
        StripeConfiguration.ApiKey = config["StripeSettings:SecretKey"];
        var cart = await cartRepository.GetCartAsync(cartId);
        if (cart == null) return null;
        var shippingPrice = 0m;
        if (cart.DeliveryMethodId.HasValue)
        {
            var deliveryMethod = await uow.Repository<DeliveryMethod>().GetByIdAsync((int)cart.DeliveryMethodId);
            if(deliveryMethod == null) return null;

            shippingPrice = deliveryMethod.Price;
        }

        foreach (var item in cart.Items)
        {
            var productItem = await uow.Repository<Product>().GetByIdAsync(item.ProductId);
            if (productItem == null) return null;
            if (item.Price != productItem.Price)
            {
                item.Price = productItem.Price;
            } 
        }
        
        
        var service = new PaymentIntentService();
        var itemsTotal = cart.Items.Sum(x => x.Quantity * x.Price);
        var total = (itemsTotal + shippingPrice) * 100;
        var amount = (long) total;
        PaymentIntent? intent = null;
        if (string.IsNullOrEmpty(cart.PaymentIntentId))
        {
            var option = new PaymentIntentCreateOptions
            {
                Amount = amount,
                Currency = "usd",
                PaymentMethodTypes = ["card"],
            };
            intent = await service.CreateAsync(option);
            cart.PaymentIntentId = intent.Id;
            cart.ClientSecret = intent.ClientSecret;
        }
        else
        {
            var options = new PaymentIntentUpdateOptions
            {
                Amount = amount,
                Currency = "usd",
                PaymentMethodTypes = ["card"],
            };
            await service.UpdateAsync(cart.PaymentIntentId, options);
        }

        await cartRepository.SetCartAsync(cart);
        return cart;
    }
}