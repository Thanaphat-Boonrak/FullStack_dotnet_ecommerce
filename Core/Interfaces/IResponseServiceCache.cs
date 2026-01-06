namespace Core.Interfaces;

public interface IResponseServiceCache
{
    Task CacheResponseAsync(string cacheKey,object response,TimeSpan timeToLive);
    Task<string?> GetCacheResponseAsync(string cacheKey);
    Task RemoveCacheByPattern(string pattern);
}