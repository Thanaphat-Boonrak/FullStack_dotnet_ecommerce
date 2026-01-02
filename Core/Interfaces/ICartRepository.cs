using Core.Entities;

namespace Core.Interfaces;

public interface ICartRepository
{
    Task<ShoppingCart?> GetCartAsync(string key);
    
    Task<ShoppingCart?> SetCartAsync(ShoppingCart cart);
    
    Task<bool> DeleteCartAsync(string key);
}