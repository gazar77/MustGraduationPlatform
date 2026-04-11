using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MustGraduationPlatform.Application.Abstractions;
using MustGraduationPlatform.Application.Dtos;

namespace MustGraduationPlatform.Api.Controllers.V1;

[ApiController]
[Route("api/v1/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _auth;

    public AuthController(IAuthService auth)
    {
        _auth = auth;
    }

    [HttpPost("identify")]
    [AllowAnonymous]
    public async Task<ActionResult<IdentifyResponseDto>> Identify([FromBody] IdentifyRequestDto request, CancellationToken ct)
        => Ok(await _auth.IdentifyAsync(request, ct));

    [HttpPost("admin/login")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthSuccessDto>> AdminLogin([FromBody] AdminLoginRequestDto request, CancellationToken ct)
        => Ok(await _auth.AdminLoginAsync(request, ct));

    [HttpPost("student/send-code")]
    [AllowAnonymous]
    public async Task<IActionResult> SendStudentCode([FromBody] StudentSendCodeRequestDto request, CancellationToken ct)
    {
        await _auth.SendStudentActivationCodeAsync(request, ct);
        return NoContent();
    }

    [HttpPost("student/login")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthSuccessDto>> StudentLogin([FromBody] StudentLoginRequestDto request, CancellationToken ct)
        => Ok(await _auth.StudentLoginAsync(request, ct));

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthSuccessDto>> Register([FromBody] StudentRegisterRequestDto request, CancellationToken ct)
        => Ok(await _auth.RegisterStudentAsync(request, ct));

    [HttpGet("me")]
    [AllowAnonymous]
    public async Task<ActionResult<UserDto?>> Me(CancellationToken ct)
    {
        if (User.Identity?.IsAuthenticated != true)
            return Ok((UserDto?)null);

        var user = await _auth.GetCurrentUserAsync(User, ct);
        return Ok(user);
    }

    [HttpPost("logout")]
    [AllowAnonymous]
    public async Task<IActionResult> Logout(CancellationToken ct)
    {
        await _auth.LogoutAsync(ct);
        return NoContent();
    }
}
