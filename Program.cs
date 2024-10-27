using Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using Extensions;


var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();


//Configuring the JWT authenticationn
builder.Services.ConfigureJwtAuthentication(builder.Configuration["JwtSettings:SecretKey"]);


builder.Services.AddDistributedMemoryCache(); // sessie data in memory, niet persistent

builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30); // Hoe lang de sessie duurt
    options.Cookie.HttpOnly = true; // sessie cookie alleen via http
    options.Cookie.IsEssential = true; // sessie cookie altijd gestuurd
});


// services van Swagger UI toevoegen (optioneel)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "OfficeCalendar", Version = "v1" });
});

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IEventStorage, EventStorage>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IAttendanceService, AttendanceService>();
builder.Services.AddScoped<IEmailService, EmailService>();


builder.Services.AddDbContext<MyContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));


var app = builder.Build();
app.Urls.Add("http://localhost:5000");

app.UseSession();
app.UseMiddleware<JwtSessionMiddleware>();
app.UseAuthentication();
app.UseAuthorization();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection(); // hoort bij swagger

app.MapControllers();

app.Run();
