using System.Text.Json;
using Core.Interfaces;
using StackExchange.Redis;

namespace Infrastructure.Services;

public class ResponseServiceCache(IConnectionMultiplexer redis) : IResponseServiceCache
{
    
    private readonly IDatabase _database =  redis.GetDatabase(1);
    public async Task CacheResponseAsync(string cacheKey, object response, TimeSpan timeToLive)
    {
        var options = new JsonSerializerOptions{PropertyNamingPolicy = JsonNamingPolicy.CamelCase};
        var serialized = JsonSerializer.Serialize(response, options);
        
        await _database.StringSetAsync(cacheKey, serialized, timeToLive);
    }

    public async Task<string?> GetCacheResponseAsync(string cacheKey)
    {
        var cachedResponse = await _database.StringGetAsync(cacheKey);
        if (cachedResponse.IsNullOrEmpty)
        {
            return null;
        }

        return cachedResponse;
    }

    public async Task RemoveCacheByPattern(string pattern)
    {
        var server = redis.GetServer(redis.GetEndPoints().First());
        var keys = server.Keys(database:1,pattern: $"*{pattern}*").ToArray();
        if (keys.Length != 0)
        {
            await _database.KeyDeleteAsync(keys);
        }
    }
}