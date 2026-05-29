using Microsoft.EntityFrameworkCore;
using Server.Infra;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
  options.UseNpgsql(connectionString));

builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddCors(options => {
  options.AddPolicy("AllowAngular", policy => {
    policy.AllowAnyOrigin()
      .AllowAnyHeader()
      .AllowAnyMethod();
  });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope()) {
  try{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    if(db.Database.GetPendingMigrations().Any()){
      db.Database.Migrate();
    }
  }
  catch (Exception ex){
    Console.WriteLine($"Erro ao migrar {ex.Message}");
  }
}

if (app.Environment.IsDevelopment()) {
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("AllowAngular");
app.UseAuthorization();
app.MapControllers();
app.Run();
