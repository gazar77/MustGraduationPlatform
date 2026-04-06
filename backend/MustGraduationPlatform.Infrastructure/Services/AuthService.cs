using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using MustGraduationPlatform.Application.Abstractions;
using MustGraduationPlatform.Application.Common;
using MustGraduationPlatform.Application.Dtos;
using MustGraduationPlatform.Application.Exceptions;
using MustGraduationPlatform.Domain.Entities;
using MustGraduationPlatform.Domain.Enums;
using MustGraduationPlatform.Infrastructure.Identity;
using MustGraduationPlatform.Infrastructure.Options;
using MustGraduationPlatform.Infrastructure.Persistence;
using MustGraduationPlatform.Infrastructure.Security;

namespace MustGraduationPlatform.Infrastructure.Services;

public class AuthService : IAuthService
{
    public const string AccessTokenCookieName = "access_token";

    private readonly UserManager<ApplicationUser> _userManager;
    private readonly AppDbContext _db;
    private readonly JwtTokenService _jwt;
    private readonly IHttpContextAccessor _http;
    private readonly IEmailSender _email;
    private readonly JwtOptions _jwtOptions;
    private readonly IHostEnvironment _env;

    public AuthService(
        UserManager<ApplicationUser> userManager,
        AppDbContext db,
        JwtTokenService jwt,
        IHttpContextAccessor http,
        IEmailSender email,
        IOptions<JwtOptions> jwtOptions,
        IHostEnvironment env)
    {
        _userManager = userManager;
        _db = db;
        _jwt = jwt;
        _http = http;
        _email = email;
        _jwtOptions = jwtOptions.Value;
        _env = env;
    }

    public async Task<IdentifyResponseDto> IdentifyAsync(IdentifyRequestDto request, CancellationToken ct = default)
    {
        if (!MustEmailRules.IsValidMustEmail(request.Email))
            throw new AppException("VALIDATION_EMAIL_DOMAIN", "Email must be a MUST address.");

        var normalized = MustEmailRules.Normalize(request.Email);
        var user = await _userManager.FindByEmailAsync(normalized);
        if (user is null)
            return new IdentifyResponseDto(false, null);

        return new IdentifyResponseDto(true, user.UserRole.ToString());
    }

    public async Task<AuthSuccessDto> AdminLoginAsync(AdminLoginRequestDto request, CancellationToken ct = default)
    {
        if (!MustEmailRules.IsValidMustEmail(request.Email))
            throw new AppException("VALIDATION_EMAIL_DOMAIN", "Email must be a MUST address.");

        var normalized = MustEmailRules.Normalize(request.Email);
        var user = await _userManager.FindByEmailAsync(normalized)
                   ?? throw new AppException("AUTH_INVALID_CREDENTIALS", "Invalid credentials.");

        if (user.UserRole != UserRole.Admin)
            throw new AppException("AUTH_NOT_ADMIN", "This account is not an administrator.");

        if (!await _userManager.CheckPasswordAsync(user, request.Password))
            throw new AppException("AUTH_INVALID_CREDENTIALS", "Invalid credentials.");

        var full = await _db.Users.Include(u => u.Department).FirstAsync(u => u.Id == user.Id, ct);
        AppendAuthCookie(full);
        return new AuthSuccessDto(MapUser(full));
    }

    public async Task SendStudentActivationCodeAsync(StudentSendCodeRequestDto request, CancellationToken ct = default)
    {
        if (!MustEmailRules.IsValidMustEmail(request.Email))
            throw new AppException("VALIDATION_EMAIL_DOMAIN", "Email must be a MUST address.");

        var normalized = MustEmailRules.Normalize(request.Email);
        var user = await _userManager.FindByEmailAsync(normalized);

        if (user is not null && user.UserRole != UserRole.Student)
            throw new AppException("AUTH_OTP_NOT_ALLOWED", "Activation codes are only for student accounts.");

        var code = GenerateNumericCode(6);
        var expires = DateTime.UtcNow.AddMinutes(15);

        if (user is not null)
        {
            await _db.StudentLoginOtps
                .Where(x => x.UserId == user.Id && !x.Consumed)
                .ExecuteDeleteAsync(ct);

            _db.StudentLoginOtps.Add(new StudentLoginOtp
            {
                UserId = user.Id,
                Code = code,
                ExpiresAtUtc = expires,
                Consumed = false,
                CreatedAtUtc = DateTime.UtcNow
            });
        }
        else
        {
            await _db.RegistrationOtps
                .Where(x => x.NormalizedEmail == normalized && !x.Consumed)
                .ExecuteDeleteAsync(ct);

            _db.RegistrationOtps.Add(new RegistrationOtp
            {
                NormalizedEmail = normalized,
                Code = code,
                ExpiresAtUtc = expires,
                Consumed = false,
                CreatedAtUtc = DateTime.UtcNow
            });
        }

        await _db.SaveChangesAsync(ct);

        await _email.SendAsync(
            normalized,
            "MUST Graduation Portal — activation code",
            $"<p>Your activation code is: <strong>{code}</strong></p><p>It expires in 15 minutes.</p>",
            ct);
    }

    public async Task<AuthSuccessDto> StudentLoginAsync(StudentLoginRequestDto request, CancellationToken ct = default)
    {
        if (!MustEmailRules.IsValidMustEmail(request.Email))
            throw new AppException("VALIDATION_EMAIL_DOMAIN", "Email must be a MUST address.");

        var normalized = MustEmailRules.Normalize(request.Email);
        var user = await _userManager.FindByEmailAsync(normalized)
                   ?? throw new AppException("AUTH_USER_NOT_FOUND", "User not found.");

        if (user.UserRole != UserRole.Student)
            throw new AppException("AUTH_NOT_STUDENT", "This account is not a student account.");

        var codeInput = request.Code.Trim();
        var otp = await _db.StudentLoginOtps
            .Where(x => x.UserId == user.Id && x.Code == codeInput && !x.Consumed && x.ExpiresAtUtc > DateTime.UtcNow)
            .OrderByDescending(x => x.CreatedAtUtc)
            .FirstOrDefaultAsync(ct);

        if (otp is null)
            throw new AppException("AUTH_INVALID_OTP", "Invalid or expired activation code.");

        if (!await _userManager.CheckPasswordAsync(user, request.Password))
            throw new AppException("AUTH_INVALID_CREDENTIALS", "Invalid password.");

        otp.Consumed = true;
        await _db.SaveChangesAsync(ct);

        var full = await _db.Users.Include(u => u.Department).FirstAsync(u => u.Id == user.Id, ct);
        AppendAuthCookie(full);
        return new AuthSuccessDto(MapUser(full));
    }

    public async Task<AuthSuccessDto> RegisterStudentAsync(StudentRegisterRequestDto request, CancellationToken ct = default)
    {
        if (!MustEmailRules.IsValidMustEmail(request.Email))
            throw new AppException("VALIDATION_EMAIL_DOMAIN", "Email must be a MUST address.");

        var normalized = MustEmailRules.Normalize(request.Email);
        var existing = await _userManager.FindByEmailAsync(normalized);
        if (existing is not null)
            throw new AppException("AUTH_EMAIL_TAKEN", "An account with this email already exists.");

        var codeInput = request.ActivationCode.Trim();
        var reg = await _db.RegistrationOtps
            .Where(x => x.NormalizedEmail == normalized && x.Code == codeInput && !x.Consumed && x.ExpiresAtUtc > DateTime.UtcNow)
            .OrderByDescending(x => x.CreatedAtUtc)
            .FirstOrDefaultAsync(ct);

        if (reg is null)
            throw new AppException("AUTH_INVALID_OTP", "Invalid or expired activation code.");

        var dept = await _db.Departments.FindAsync(new object[] { request.DepartmentId }, ct)
                   ?? throw new AppException("VALIDATION_DEPARTMENT", "Invalid department.");

        var user = new ApplicationUser
        {
            Id = Guid.NewGuid(),
            UserName = normalized,
            Email = normalized,
            NormalizedUserName = normalized.ToUpperInvariant(),
            NormalizedEmail = normalized.ToUpperInvariant(),
            EmailConfirmed = true,
            FullName = request.FullName,
            UserRole = UserRole.Student,
            DepartmentId = dept.Id
        };

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
            throw new AppException("AUTH_REGISTER_FAILED", string.Join("; ", result.Errors.Select(e => e.Description)));

        reg.Consumed = true;
        await _db.SaveChangesAsync(ct);

        var full = await _db.Users.Include(u => u.Department).FirstAsync(u => u.Id == user.Id, ct);
        AppendAuthCookie(full);
        return new AuthSuccessDto(MapUser(full));
    }

    public async Task<UserDto?> GetCurrentUserAsync(ClaimsPrincipal principal, CancellationToken ct = default)
    {
        var idStr = principal.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(idStr) || !Guid.TryParse(idStr, out var id))
            return null;

        var user = await _db.Users.Include(u => u.Department).FirstOrDefaultAsync(u => u.Id == id, ct);
        return user is null ? null : MapUser(user);
    }

    public Task LogoutAsync(CancellationToken ct = default)
    {
        var response = _http.HttpContext?.Response;
        if (response is null) return Task.CompletedTask;

        response.Cookies.Delete(AccessTokenCookieName, AccessTokenCookieOptions(expiresMinutes: null));

        return Task.CompletedTask;
    }

    private void AppendAuthCookie(ApplicationUser user)
    {
        var response = _http.HttpContext?.Response
                       ?? throw new InvalidOperationException("No HTTP context.");

        var token = _jwt.CreateAccessToken(user);
        response.Cookies.Append(AccessTokenCookieName, token, AccessTokenCookieOptions(_jwtOptions.ExpiresMinutes));
    }

    // Production: SameSite=None + Secure so cross-origin SPA (e.g. Vercel) sends access_token with withCredentials.
    private CookieOptions AccessTokenCookieOptions(double? expiresMinutes)
    {
        var isProd = !_env.IsDevelopment();
        var options = new CookieOptions
        {
            HttpOnly = true,
            Path = "/",
            SameSite = isProd ? SameSiteMode.None : SameSiteMode.Lax,
            Secure = isProd,
        };
        if (expiresMinutes.HasValue)
            options.MaxAge = TimeSpan.FromMinutes(expiresMinutes.Value);
        return options;
    }

    private static UserDto MapUser(ApplicationUser u) =>
        new(
            u.Id,
            u.FullName,
            u.Email ?? "",
            u.UserRole.ToString(),
            u.Department?.Code);

    private static string GenerateNumericCode(int digits)
    {
        var bytes = RandomNumberGenerator.GetBytes(4);
        var n = BitConverter.ToUInt32(bytes, 0) % (uint)Math.Pow(10, digits);
        return n.ToString($"D{digits}");
    }
}
