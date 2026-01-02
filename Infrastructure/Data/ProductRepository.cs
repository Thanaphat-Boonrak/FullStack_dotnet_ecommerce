using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class ProductRepository(StoreContext context) : IProductRespository
{
    public async Task<IReadOnlyList<Product>> GetAllProductsAsync(string? brand,string? type,string? sort)
    {
        var query = context.Products.AsQueryable();

        if (!string.IsNullOrWhiteSpace(brand))
        {
            query = query.Where(p => p.Brand == brand);
        }

        if (!string.IsNullOrWhiteSpace(type))
        {
            query = query.Where(p => p.Type == type);
        }

        if (!string.IsNullOrWhiteSpace(sort))
        {
            query = sort switch
            {
                "priceAsc" => query.OrderBy(x => x.Price),
                "priceDesc" => query.OrderByDescending(x => x.Price),
                _ => query
            };
        }

     
        
        return await query.ToListAsync();

    }

    public async Task<Product?> GetProductAsync(int id)
    {
        return await context.Products.FindAsync(id);
    }

    public async Task<IReadOnlyList<string>> GetTypeAsync()
    {
        return await context.Products.Select(p => p.Type).Distinct().ToListAsync();
    }

    public async Task<IReadOnlyList<string>> GetBrandAsync()
    {
        return await context.Products.Select(p => p.Brand).Distinct().ToListAsync();
    }

    
    

    public void AddProduct(Product product)
    {
        context.Products.Add(product);
    }

    public void UpdateProduct(Product product)
    {
        context.Entry(product).State = EntityState.Modified;
    }

    public void DeleteProduct(Product product)
    {
        context.Products.Remove(product);
    }

    public bool ProductExists(int id)
    {
        return context.Products.Any(p => p.Id == id);
    }

    public async Task<bool> SaveChangeAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }

   
}