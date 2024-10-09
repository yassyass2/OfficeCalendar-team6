using Services;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();


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

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IEventStorage, JsonEventStorage>();
builder.Services.AddScoped<IAdminService, JsonAdminService>();
builder.Services.AddScoped<IUserService, JsonUserService>();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"))
);

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
