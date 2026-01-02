using System.Reflection;
using System.Text.Json;
using Core.Entities;
using Microsoft.IdentityModel.Protocols;

namespace Infrastructure.Data;

public class StoreContextSeed
{
    public static async Task SeedAsync(StoreContext storeContext)
    {
        
        var basePath = AppContext.BaseDirectory;
        if (!storeContext.Products.Any())
        {
            var filePath = Path.Combine(
                basePath,
                "Data",
                "SeedData",
                "products.json"
            );
            var productRespository = await File.ReadAllTextAsync(filePath);
            var products = JsonSerializer.Deserialize<List<Product>>(productRespository);
            
            if (products ==  null) return;
            
            storeContext.Products.AddRange(products);
            await storeContext.SaveChangesAsync();
        }

        if (!storeContext.DeliveryMethods.Any())
        {
            var filePath = Path.Combine(
                basePath,
                "Data",
                "SeedData",
                "delivery.json"
            );
            var deliveryMethodRepository = await File.ReadAllTextAsync(filePath);
            var deliveryMethods = JsonSerializer.Deserialize<List<DeliveryMethod>>(deliveryMethodRepository);
            if (deliveryMethods ==null) return;
            storeContext.DeliveryMethods.AddRange(deliveryMethods);
            await storeContext.SaveChangesAsync();
            
        }
    }
}