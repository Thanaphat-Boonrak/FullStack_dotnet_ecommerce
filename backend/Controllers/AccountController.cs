using System.Security.Claims;
using backend.Dtos;
using backend.Extensions;
using Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

public class AccountController(SignInManager<AppUser> signInManager) : BaseController
{

    [HttpPost("register")]
    public async Task<ActionResult> Register(RegisterDto registerDto)
    {
        var user = new AppUser()
        {
            FirstName = registerDto.FirstName,
            LastName = registerDto.LastName,
            Email = registerDto.Email,
            UserName = registerDto.Email,
        };
        var result = await signInManager.UserManager.CreateAsync(user, registerDto.Password!);
        await signInManager.UserManager.AddToRoleAsync(user, "Customer");
        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }
            return ValidationProblem();
        }
        
        return Ok();
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<ActionResult> Logout()
    {
        await signInManager.SignOutAsync();
        return Ok();
    }

    [HttpGet("user-info")]
    public async Task<ActionResult> GetUserInfo()
    {
        if (User.Identity?.IsAuthenticated == false) return NoContent();
        
        var user = await signInManager.UserManager.GetUserByEmailWithAddress(User);

        return Ok(new
        {
            user.FirstName,
            user.LastName,
            user.Email,
            address = user.Address?.ToDto(),
            roles = User.FindFirstValue(ClaimTypes.Role)
        });
    }

    [HttpGet]
    public ActionResult GetAuthState()
    {
        return Ok(new {isAuthenticated = User.Identity?.IsAuthenticated ?? false});
    }
    
    
    [Authorize]
    [HttpPost("address")]
    public async Task<ActionResult<Address>> AddAddress(AddressDto addressDto)
    {
        var user = await signInManager.UserManager.GetUserByEmailWithAddress(User);
        if (user.Address == null)
        {
            user.Address = addressDto.ToEntity();
        }
        else
        {
            user.Address.UpdateFromDto(addressDto);
        }
        
        var result = await signInManager.UserManager.UpdateAsync(user);
        if(!result.Succeeded) return  BadRequest("Problem update address");
        return Ok(user.Address.ToDto());
        
    }
}