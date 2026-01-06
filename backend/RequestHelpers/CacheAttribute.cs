using System.Text;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace backend.RequestHelpers;

[AttributeUsage(AttributeTargets.All)]
public class CacheAttribute(int timeToLiveSecond) : Attribute, IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {

        var cacheService = context.HttpContext.RequestServices.GetRequiredService<IResponseServiceCache>();
        
        var cacheKey = GenerateCacheKeyFromRequest(context.HttpContext.Request);
        
        var cacheResponse = await cacheService.GetCacheResponseAsync(cacheKey);
        if (!string.IsNullOrEmpty(cacheResponse))
        {
            var contentResult = new ContentResult
            {
                Content = cacheResponse,
                ContentType = "application/json",
                StatusCode = 200
            };
            
            context.Result = contentResult;
            return;
        }
        

        var executedContext = await next();

        if (executedContext.Result is OkObjectResult okObjectResult)
        {
            if (okObjectResult.Value != null)
            {
                await cacheService.CacheResponseAsync(cacheKey, okObjectResult.Value,TimeSpan.FromSeconds(timeToLiveSecond));
            }
        }
    }


    private static string GenerateCacheKeyFromRequest(HttpRequest request)
    {
        var keyBuilder = new StringBuilder();
        keyBuilder.Append($"{request.Path}");

        foreach (var (key,value) in request.Query.OrderBy(x => x.Key) )
        {
            keyBuilder.Append($"|{key}-{value}");
        }
        
        return keyBuilder.ToString();
    }
}
