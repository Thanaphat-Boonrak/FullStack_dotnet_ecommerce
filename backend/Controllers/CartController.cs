using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

public class CartController(ICartRepository cartRepository) : BaseController
{
    [HttpGet]
    public async Task<ActionResult<ShoppingCart>> GetCartItems(string id)
    {
        var cart = await cartRepository.GetCartAsync(id);
        return Ok(cart ?? new ShoppingCart{Id = id});
    }

    [HttpPost]
    public async Task<ActionResult<ShoppingCart>> CreateCart(ShoppingCart cart)
    {
        var updateCart = await cartRepository.SetCartAsync(cart);
        if (updateCart == null) return BadRequest("Problem with cart");
        return updateCart;
    }


    [HttpDelete]
    public async Task<ActionResult<ShoppingCart>> DeleteCart(string id)
    {
        var data = await cartRepository.DeleteCartAsync(id);
        if(!data) return BadRequest("Delete Problem with cart");
        return Ok();
    }
}