using Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using Extensions;
using Filters;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();

// Configuring the JWT authentication
builder.Services.ConfigureJwtAuthentication(builder.Configuration["JwtSettings:SecretKey"]);

// Comment out session-related lines
// builder.Services.AddDistributedMemoryCache(); // session data in memory, not persistent

// builder.Services.AddSession(options =>
// {
//     options.IdleTimeout = TimeSpan.FromMinutes(30); // session timeout
//     options.Cookie.HttpOnly = true; // session cookie only via http
//     options.Cookie.IsEssential = true; // session cookie always sent
// });

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Swagger services (optional)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "OfficeCalendar", Version = "v1" });
});

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IEmailService, EmailService>();

builder.Services.AddScoped<IEventStorage, EventStorage>();
builder.Services.AddScoped<IAttendanceService, AttendanceService>();
builder.Services.AddScoped<NotificationFilter>();
builder.Services.AddScoped<IInviteService, InviteService>();

builder.Services.AddDbContext<MyContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();
app.Urls.Add("http://localhost:5000");

// Comment out session usage
// app.UseSession();
// app.UseMiddleware<JwtSessionMiddleware>();

app.UseAuthentication();
app.UseAuthorization();
app.UseCors("AllowReactApp");

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection(); // belongs to swagger

app.MapControllers();

app.Run();
