using Microsoft.AspNetCore.Hosting;
using MustGraduationPlatform.Application.Abstractions;

namespace MustGraduationPlatform.Infrastructure.Storage;

public class WwwRootFileStorageService : IFileStorage
{
    public const string UploadsUrlPrefix = "/uploads";
    private readonly IWebHostEnvironment _env;

    public WwwRootFileStorageService(IWebHostEnvironment env)
    {
        _env = env;
    }

    public async Task<string> SaveAsync(string relativePath, Stream content, CancellationToken ct = default)
    {
        var webRoot = _env.WebRootPath;
        if (string.IsNullOrEmpty(webRoot))
            webRoot = Path.Combine(_env.ContentRootPath, "wwwroot");

        Directory.CreateDirectory(webRoot);

        var normalized = relativePath.Replace('/', Path.DirectorySeparatorChar).TrimStart(Path.DirectorySeparatorChar);
        var uploadsRelative = Path.Combine("uploads", normalized);
        var fullPath = Path.Combine(webRoot, uploadsRelative);
        var directory = Path.GetDirectoryName(fullPath);
        if (!string.IsNullOrEmpty(directory))
            Directory.CreateDirectory(directory);

        await using (var fs = new FileStream(fullPath, FileMode.Create, FileAccess.Write, FileShare.None, 81920, useAsync: true))
            await content.CopyToAsync(fs, ct);

        var urlPath = relativePath.Replace('\\', '/').TrimStart('/');
        return $"{UploadsUrlPrefix}/{urlPath}";
    }
}
