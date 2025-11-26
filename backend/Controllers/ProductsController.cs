using Core.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;



public class ProductsController(StoreContext storeContext) : BaseController
{
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetAllProduct()
    {
        return  await storeContext.Products.ToListAsync();
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {   
        var product = await storeContext.Products.FindAsync(id);

        if (product == null) return NotFound($"Product {id} not found");
        return product;
    }

    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct(Product product)
    {
        storeContext.Products.Add(product);
        await storeContext.SaveChangesAsync();
        return product;
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult> UpdateProduct(int id, Product product)
    {
        if(!ProductExists(id)) return BadRequest($"Product {id} not found");
        
        storeContext.Entry(product).State = EntityState.Modified;
        
        await storeContext.SaveChangesAsync();
        return NoContent();
    }


    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteProduct(int id)
    {
        var product = await storeContext.Products.FindAsync(id);
        if (product == null) return NotFound($"Product {id} not found");
        storeContext.Products.Remove(product);
        await storeContext.SaveChangesAsync(); 
        return  NoContent();
    }

    private bool ProductExists(int id)
    {
        return storeContext.Products.Any(e => e.Id == id);
    }
}