using MustGraduationPlatform.Application.Exceptions;

namespace MustGraduationPlatform.Infrastructure.Storage;

internal static class PdfUploadValidation
{
    private const long MaxBytes = 25L * 1024 * 1024;

    public static void ValidateOrThrow(string fileName, long length)
    {
        if (length > MaxBytes)
            throw new AppException("FILE_TOO_LARGE", "PDF exceeds 25 MB.");

        var ext = Path.GetExtension(fileName);
        if (!string.Equals(ext, ".pdf", StringComparison.OrdinalIgnoreCase))
            throw new AppException("FILE_TYPE_NOT_ALLOWED", "Template file must be a PDF.");
    }
}
