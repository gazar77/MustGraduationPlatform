using MustGraduationPlatform.Application.Exceptions;

namespace MustGraduationPlatform.Infrastructure.Storage;

internal static class ImageUploadValidation
{
    private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".jpg", ".jpeg", ".png", ".webp", ".gif"
    };

    private const long MaxBytes = 5L * 1024 * 1024;

    public static void ValidateOrThrow(string fileName, long length)
    {
        if (length > MaxBytes)
            throw new AppException("FILE_TOO_LARGE", "Image exceeds 5 MB.");

        var ext = Path.GetExtension(fileName);
        if (string.IsNullOrEmpty(ext) || !AllowedExtensions.Contains(ext))
            throw new AppException("FILE_TYPE_NOT_ALLOWED", "Use JPG, PNG, WEBP, or GIF.");
    }
}
