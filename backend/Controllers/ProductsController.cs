using backend.Dtos;
using backend.RequestHelpers;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;



public class ProductsController(IUnitOfWork unitOfWork) : BaseController
{
    [Cache(600)]
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Product>>> GetAllProduct([FromQuery]ProductSpecParams specParams)
    {
        var spec = new ProductSpecification(specParams);
 
        return await CreatePageResult(unitOfWork.Repository<Product>(), spec,specParams.PageNumber, specParams.PageSize);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await unitOfWork.Repository<Product>().GetByIdAsync(id);

        if (product == null) return NotFound($"Product {id} not found");
        return product;
    }
    
    [InvalidCache("api/products|")]
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct(Product product)
    {
        unitOfWork.Repository<Product>().Add(product);
        if (await unitOfWork.Complete())
        {
            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }
        
        return BadRequest($"Product {product.Id} not found");
    }
    
    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}")]
    public async Task<ActionResult> UpdateProduct(int id, Product product)
    {
        if(!unitOfWork.Repository<Product>().Exists(id) || product.Id != id) return BadRequest($"Product {id} not found");
        
        
        unitOfWork.Repository<Product>().Update(product);


        if (await unitOfWork.Complete())        {
            return NoContent();
        }
        return BadRequest($"Product {id} not updated");
    }
    
    [InvalidCache("api/products|")]
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteProduct(int id)
    {
        var product = await unitOfWork.Repository<Product>().GetByIdAsync(id);
        if (product == null) return NotFound($"Product {id} not found");
        unitOfWork.Repository<Product>().Delete(product);
        if (await unitOfWork.Complete())
        {
            return NoContent();
        }
        return  BadRequest($"Product {id} not deleted");
    }

    [HttpGet("brands")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetBrands()
    {

        var spec = new BrandListSpecification();
        return Ok(await unitOfWork.Repository<Product>().ListAsync(spec));
    }


    [HttpGet("types")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetTypes()
    {
        var spec = new TypeListSpecification();
        return Ok(await unitOfWork.Repository<Product>().ListAsync(spec));
    }

  
    
 
    
}