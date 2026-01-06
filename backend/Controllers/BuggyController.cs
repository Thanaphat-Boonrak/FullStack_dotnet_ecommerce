using System.Security.Claims;
using backend.Dtos;
using Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

public class BuggyController : BaseController
{
    [HttpGet("unauthorized")]
    public IActionResult GetUnauthorized()
    {
        return Unauthorized();
    }

    [HttpGet("badrequest")]
    public IActionResult GetBadRequest()
    {
        return BadRequest("Bad Request");
    }
    
    [HttpGet("notfound")]
    public IActionResult GetNotFound()
    {
        return NotFound("Not Found");
    }
    
    
    [HttpGet("internalerror")]
    public IActionResult GetInternalError()
    {
        throw new Exception("Internal Error");
    }
    
    [HttpPost("validationerror")]
    public IActionResult GetValidationError(CreateProductDto product)
    {
        return Ok();
    }


    [HttpGet("admin-secret")]
    [Authorize(Roles = "Admin")]
    public IActionResult GetSecret()
    {
        return Ok(User.FindFirst(ClaimTypes.Name).Value + " " + User.FindFirst(ClaimTypes.NameIdentifier).Value + " " + User.FindFirst(ClaimTypes.Email).Value + " " + User.FindFirst(ClaimTypes.Role).Value);
    }
}