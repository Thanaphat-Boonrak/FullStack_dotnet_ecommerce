using System.Reflection;
using System.Text.Json;
using Core.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Protocols;

namespace Infrastructure.Data;

public class StoreContextSeed
{
    public static async Task SeedAsync(StoreContext storeContext,UserManager<AppUser> userManager,RoleManager<IdentityRole> roleManager)
    {
        
        if (!await roleManager.RoleExistsAsync("Admin"))
        {
            await roleManager.CreateAsync(new IdentityRole("Admin"));
        }

        if (!await roleManager.RoleExistsAsync("Customer"))
        {
            await roleManager.CreateAsync(new IdentityRole("Customer"));
        }
        if (!userManager.Users.Any(x => x.UserName == "admin@test.com"))
        {
            var user = new AppUser()
            {
                UserName = "admin@test.com",
                Email = "admin@test.com"
            };
            
            await userManager.CreateAsync(user, "Pa$$w0rd");
            await userManager.AddToRoleAsync(user, "Admin");
        }
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