using backend.Middleware;
using backend.SignalR;
using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;
using Infrastructure.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddDbContext<StoreContext>
    (options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"), sqlOptions =>
    {
            sqlOptions.EnableRetryOnFailure(
                maxRetryCount: 5,
                maxRetryDelay: TimeSpan.FromSeconds(30),
                errorNumbersToAdd: null
            );
    }));

builder.Services.AddScoped<IProductRespository, ProductRepository>();
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddSingleton<IResponseServiceCache, ResponseServiceCache>();
builder.Services.AddSignalR();
builder.Services.AddCors();
builder.Services.AddSingleton<IConnectionMultiplexer>(config =>
{
    var connString = builder.Configuration.GetConnectionString("RedisConnection");
    if (connString == null) throw new Exception("redis connection string is null");
    var configuration = ConfigurationOptions.Parse(connString);
    return ConnectionMultiplexer.Connect(configuration);
});
builder.Services.AddSingleton<ICartRepository, CartService>();
builder.Services.AddAuthorization();
builder.Services.AddIdentityApiEndpoints<AppUser>().AddRoles<IdentityRole>().AddEntityFrameworkStores<StoreContext>();
var app = builder.Build();


app.UseMiddleware<ExceptionMiddleware>();
app.UseCors(options => options.AllowAnyMethod().AllowAnyHeader().AllowCredentials().WithOrigins("http://localhost:4200","https://localhost:4200"));
app.UseAuthentication();
app.UseAuthorization();

app.UseDefaultFiles();
app.UseStaticFiles();
app.MapControllers();
app.MapGroup("/api").MapIdentityApi<AppUser>();
app.MapHub<NotificationHub>("/hub/notification");
app.MapFallbackToController("Index", "Fallback");
try
{
    using var scope = app.Services.CreateScope() ;
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<StoreContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
    await context.Database.MigrateAsync();
    
    await StoreContextSeed.SeedAsync(context,userManager,roleManager);
}
catch (Exception ex)
{
   Console.WriteLine(ex.Message);
    throw;
}

app.Run();
