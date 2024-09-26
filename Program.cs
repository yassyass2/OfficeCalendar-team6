using Services;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();

/*
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/login";
        options.ExpireTimeSpan = TimeSpan.FromMinutes(60);  // hoe lang sessie blijft
    });
*/

// services van Swagger UI toevoegen
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<IEventStorage, JsonEventStorage>();
builder.Services.AddScoped<IAdminService, JsonAdminService>();
// builder.Services.AddDbContext<naam van je class>(options => 
//options.UsePostGresSql(builder.Configuration.GetConnectionString("DefaultConnection")))
//^^^ toevoegen voor database gebruiken ^^^

var app = builder.Build();
app.Urls.Add("http://localhost:5000");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapControllers();

app.Run();
