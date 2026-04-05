using Microsoft.EntityFrameworkCore.Infrastructure;

namespace MustGraduationPlatform.Infrastructure.Persistence;

/// <summary>
/// Shared SQL Server options (retries for transient failures in cloud / busy servers).
/// </summary>
public static class SqlServerRetryConfiguration
{
    public static void ConfigureRetry(SqlServerDbContextOptionsBuilder sql)
    {
        sql.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(30),
            errorNumbersToAdd: null);
    }
}
