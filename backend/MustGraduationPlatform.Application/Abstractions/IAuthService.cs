using System.Security.Claims;
using MustGraduationPlatform.Application.Dtos;

namespace MustGraduationPlatform.Application.Abstractions;

public interface IAuthService
{
    Task<IdentifyResponseDto> IdentifyAsync(IdentifyRequestDto request, CancellationToken ct = default);
    Task<AuthSuccessDto> AdminLoginAsync(AdminLoginRequestDto request, CancellationToken ct = default);
    Task SendStudentActivationCodeAsync(StudentSendCodeRequestDto request, CancellationToken ct = default);
    Task<AuthSuccessDto> StudentLoginAsync(StudentLoginRequestDto request, CancellationToken ct = default);
    Task<AuthSuccessDto> RegisterStudentAsync(StudentRegisterRequestDto request, CancellationToken ct = default);
    Task<UserDto?> GetCurrentUserAsync(ClaimsPrincipal principal, CancellationToken ct = default);
    Task LogoutAsync(CancellationToken ct = default);
}
