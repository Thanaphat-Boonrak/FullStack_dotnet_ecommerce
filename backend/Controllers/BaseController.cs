
using backend.Dtos;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;


[ApiController]
[Route("api/[controller]")]
public class BaseController : ControllerBase
{
    protected async Task<ActionResult> CreatePageResult<T>(IGenericRepository<T> repo,
        ISpecification<T> spec, int pageIndex, int pageSize) where T : BaseEntity
    {
        var count = await repo.CountAsync(spec);
        var data = await repo.ListAsync(spec);
        var pagination = new Paginations<T>(pageIndex,pageSize,count, data);
        return Ok(pagination);
    }
}