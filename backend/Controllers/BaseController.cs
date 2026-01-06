
using backend.Dtos;
using backend.RequestHelpers;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Http.Features;
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
    
    protected async Task<ActionResult> CreatePageResult<T,TDto>(IGenericRepository<T> repo,
        ISpecification<T> spec, int pageIndex, int pageSize,Func<T,TDto> toDto) where T : BaseEntity ,IDtoConvertible
    {
        var count = await repo.CountAsync(spec);
        var data = await repo.ListAsync(spec);
        
        var dtoItems = data.Select(toDto).ToList();
        var pagination = new Paginations<TDto>(pageIndex,pageSize,count,dtoItems);
        return Ok(pagination);
    }
    
}