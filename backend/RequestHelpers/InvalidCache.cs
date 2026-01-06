using Core.Interfaces;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Caching.Distributed;

namespace backend.RequestHelpers;

[AttributeUsage(AttributeTargets.Method)]
public class InvalidCache(string p) : Attribute,IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var result = await next();

        if (result.Exception == null || result.ExceptionHandled)
        {
            var cacheService = context.HttpContext.RequestServices.GetRequiredService<IResponseServiceCache>();
            await cacheService.RemoveCacheByPattern(p);
        }
    }
}