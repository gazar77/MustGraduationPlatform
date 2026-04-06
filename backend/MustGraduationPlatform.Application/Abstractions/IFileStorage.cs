namespace MustGraduationPlatform.Application.Abstractions;

/// <summary>Saves uploaded files under the web app wwwroot and returns a public URL path (e.g. /uploads/...).</summary>
public interface IFileStorage
{
    /// <param name="relativePath">Path under the uploads folder, using forward slashes (e.g. proposal/2026/04/guid_file.pdf).</param>
    /// <returns>Request-relative URL beginning with /uploads/</returns>
    Task<string> SaveAsync(string relativePath, Stream content, CancellationToken ct = default);
}
