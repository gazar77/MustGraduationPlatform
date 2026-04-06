using System.Security.Claims;
using MustGraduationPlatform.Application.Dtos;

namespace MustGraduationPlatform.Application.Abstractions;

public interface IGraduationService
{
    Task<GraduationProjectDto?> GetMyProjectAsync(ClaimsPrincipal principal, CancellationToken ct = default);
    Task<IReadOnlyList<GraduationRequirementFileDto>> GetMyRequirementFilesAsync(ClaimsPrincipal principal, CancellationToken ct = default);
    Task<GraduationRequirementFileDto> UploadRequirementAsync(
        ClaimsPrincipal principal,
        string requirementKey,
        Stream fileStream,
        long fileLength,
        string fileName,
        string? contentType,
        CancellationToken ct = default);
}
