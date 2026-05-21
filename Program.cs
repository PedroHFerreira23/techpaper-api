using Microsoft.EntityFrameworkCore;
using TechPaperAPI.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

var mysqlHost = Environment.GetEnvironmentVariable("MYSQLHOST");

if (!string.IsNullOrEmpty(mysqlHost))
{
    var mysqlPort = Environment.GetEnvironmentVariable("MYSQLPORT");
    var mysqlUser = Environment.GetEnvironmentVariable("MYSQLUSER");
    var mysqlPassword = Environment.GetEnvironmentVariable("MYSQLPASSWORD");
    var mysqlDatabase = Environment.GetEnvironmentVariable("MYSQLDATABASE");

    connectionString =
        $"server={mysqlHost};port={mysqlPort};database={mysqlDatabase};user={mysqlUser};password={mysqlPassword};";
}

if (string.IsNullOrEmpty(connectionString))
{
    throw new Exception("A string de conexão com o banco de dados não foi encontrada.");
}

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString))
);

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("login.html");

app.Run();