using MustGraduationPlatform.Application.Exceptions;

namespace MustGraduationPlatform.Infrastructure.Storage;

/// <summary>Validates template document uploads (Word or PowerPoint).</summary>
internal static class PdfUploadValidation
{
    private const long MaxBytes = 25L * 1024 * 1024;

    private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".doc",
        ".docx",
        ".ppt",
        ".pptx"
    };

    public static void ValidateOrThrow(string fileName, long length)
    {
        if (length > MaxBytes)
            throw new AppException("FILE_TOO_LARGE", "File exceeds 25 MB.");

        var ext = Path.GetExtension(fileName);
        if (string.IsNullOrEmpty(ext) || !AllowedExtensions.Contains(ext))
            throw new AppException("FILE_TYPE_NOT_ALLOWED", "Template file must be Word (.doc, .docx) or PowerPoint (.ppt, .pptx).");
    }
}
