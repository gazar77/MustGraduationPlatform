using MustGraduationPlatform.Application.Exceptions;

namespace MustGraduationPlatform.Infrastructure.Storage;

internal static class SubmissionFileValidation
{
    private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".pdf", ".doc", ".docx", ".zip", ".rar", ".7z", ".png", ".jpg", ".jpeg", ".ppt", ".pptx"
    };

    private const long MaxBytes = 25L * 1024 * 1024;

    public static void ValidateOrThrow(string fileName, long length)
    {
        if (length > MaxBytes)
            throw new AppException("FILE_TOO_LARGE", "File exceeds 25 MB.");

        var ext = Path.GetExtension(fileName);
        if (string.IsNullOrEmpty(ext) || !AllowedExtensions.Contains(ext))
            throw new AppException("FILE_TYPE_NOT_ALLOWED", "File type not allowed. Use PDF, Office, archive, or image files.");
    }

    public static string SanitizeFileName(string fileName)
    {
        var name = Path.GetFileName(fileName);
        foreach (var c in Path.GetInvalidFileNameChars())
            name = name.Replace(c, '_');
        return string.IsNullOrWhiteSpace(name) ? "upload.bin" : name;
    }
}
