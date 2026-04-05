using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace MustGraduationPlatform.Infrastructure.Persistence;

/// <summary>
/// Lets <c>dotnet ef</c> create <see cref="AppDbContext"/> at design time without the web app's DI container.
/// </summary>
public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var apiContentRoot = ResolveApiProjectDirectory();
        var configuration = new ConfigurationBuilder()
            .SetBasePath(apiContentRoot)
            .AddJsonFile("appsettings.json", optional: false, reloadOnChange: false)
            .AddJsonFile("appsettings.Development.json", optional: true, reloadOnChange: false)
            .AddEnvironmentVariables()
            .Build();

        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException(
                "Connection string 'DefaultConnection' was not found. " +
                "Set it in MustGraduationPlatform.Api/appsettings.json or environment variable ConnectionStrings__DefaultConnection.");

        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
        optionsBuilder.UseSqlServer(connectionString, SqlServerRetryConfiguration.ConfigureRetry);

        return new AppDbContext(optionsBuilder.Options);
    }

    /// <summary>
    /// Walks up from the current directory until <c>MustGraduationPlatform.Api/appsettings.json</c> exists
    /// (supports repo root with <c>backend/</c>, or running from the <c>backend</c> folder).
    /// </summary>
    private static string ResolveApiProjectDirectory()
    {
        var dir = new DirectoryInfo(Directory.GetCurrentDirectory());
        while (dir != null)
        {
            foreach (var relativeApiRoot in new[]
                     {
                         Path.Combine("MustGraduationPlatform.Api"),
                         Path.Combine("backend", "MustGraduationPlatform.Api")
                     })
            {
                var candidate = Path.Combine(dir.FullName, relativeApiRoot, "appsettings.json");
                if (File.Exists(candidate))
                    return Path.Combine(dir.FullName, relativeApiRoot);
            }

            dir = dir.Parent;
        }

        throw new InvalidOperationException(
            "Could not locate MustGraduationPlatform.Api/appsettings.json. " +
            "Run EF from the repository or backend folder, e.g. " +
            "`dotnet ef database update --project backend/MustGraduationPlatform.Infrastructure --startup-project backend/MustGraduationPlatform.Api` " +
            "(adjust paths to match your layout).");
    }
}
