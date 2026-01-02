using Core.Entities;

namespace Core.Interfaces;

public interface IProductRespository
{
    Task<IReadOnlyList<Product>> GetAllProductsAsync(string? brand,string? type,string? sort);
    
    Task<Product?> GetProductAsync(int id);
    
    
    Task<IReadOnlyList<string>> GetTypeAsync();
    
    
    Task<IReadOnlyList<string>> GetBrandAsync();

    
    void AddProduct(Product product);
    
    void UpdateProduct(Product product);
    
    void DeleteProduct(Product product);
    
    
    bool ProductExists(int id);
    
    Task<bool> SaveChangeAsync();
    
    
}