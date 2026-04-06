using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MustGraduationPlatform.Application.Dtos;
using MustGraduationPlatform.Infrastructure.Identity;

namespace MustGraduationPlatform.Api.Controllers.V1;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize(Roles = "Admin")]
public class UsersController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _users;

    public UsersController(UserManager<ApplicationUser> users)
    {
        _users = users;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<UserDto>>> List(CancellationToken ct)
    {
        var list = await _users.Users
            .Include(u => u.Department)
            .OrderBy(u => u.Email)
            .ToListAsync(ct);
        var dtos = list.Select(u => new UserDto(
            u.Id,
            u.FullName,
            u.Email ?? "",
            u.UserRole.ToString(),
            u.Department?.Code)).ToList();
        return Ok(dtos);
    }
}
