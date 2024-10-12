using Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;


var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();

//Configuring the JWT authenticationn
var key = Encoding.ASCII.GetBytes("12345"); // we need to change this later to a better key, can be generated online
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false, // Set to true if you want to validate the issuer
        ValidateAudience = false, // Set to true if you want to validate the audience
        ValidateLifetime = true, // Ensure token is not expired
        ClockSkew = TimeSpan.Zero // Eliminate delay of token expiration
    };
});


builder.Services.AddDistributedMemoryCache(); // sessie data in memory, niet persistent

builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30); // Hoe lang de sessie duurt
    options.Cookie.HttpOnly = true; // sessie cookie alleen via http
    options.Cookie.IsEssential = true; // sessie cookie altijd gestuurd
});


// services van Swagger UI toevoegen (optioneel)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// dependency injection voor services
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IEventStorage, DbEventStorage>();
builder.Services.AddScoped<IAdminService, DbAdminService>();
builder.Services.AddScoped<IUserService, DbUserService>();

builder.Services.AddDbContext<MyContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();
app.Urls.Add("http://localhost:5000");

app.UseSession(); // voor sessie handelen
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
