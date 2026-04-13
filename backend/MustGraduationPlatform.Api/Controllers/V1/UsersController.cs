using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MustGraduationPlatform.Application.Dtos;
using MustGraduationPlatform.Domain.Enums;
using MustGraduationPlatform.Infrastructure.Identity;

namespace MustGraduationPlatform.Api.Controllers.V1;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize(Roles = "Admin,SuperAdmin")]
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

    [HttpPatch("{id:guid}")]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<ActionResult<UserDto>> Update(Guid id, [FromBody] UserUpdateDto dto, CancellationToken ct)
    {
        if (!Enum.TryParse<UserRole>(dto.Role, true, out var newRole) || newRole == UserRole.SuperAdmin)
            return BadRequest(new { message = "Invalid role." });

        var user = await _users.Users.Include(u => u.Department).FirstOrDefaultAsync(u => u.Id == id, ct);
        if (user is null) return NotFound();

        if (user.UserRole == UserRole.SuperAdmin)
            return BadRequest(new { message = "Cannot modify super admin accounts." });

        if (!string.IsNullOrWhiteSpace(dto.FullName))
            user.FullName = dto.FullName.Trim();

        user.UserRole = newRole;
        var result = await _users.UpdateAsync(user);
        if (!result.Succeeded)
            return BadRequest(new { message = string.Join("; ", result.Errors.Select(e => e.Description)) });

        await _users.UpdateSecurityStampAsync(user);
        return Ok(new UserDto(user.Id, user.FullName, user.Email ?? "", user.UserRole.ToString(), user.Department?.Code));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var user = await _users.FindByIdAsync(id.ToString());
        if (user is null) return NotFound();

        if (user.UserRole == UserRole.SuperAdmin)
            return BadRequest(new { message = "Cannot delete a super admin account." });

        var currentIsSuper = User.IsInRole("SuperAdmin");
        if (!currentIsSuper && user.UserRole != UserRole.Student)
            return Forbid();

        var result = await _users.DeleteAsync(user);
        return result.Succeeded ? NoContent() : BadRequest(new { message = string.Join("; ", result.Errors.Select(e => e.Description)) });
    }
}
