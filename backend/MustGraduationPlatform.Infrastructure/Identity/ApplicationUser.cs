using Microsoft.AspNetCore.Identity;
using MustGraduationPlatform.Domain.Entities;
using MustGraduationPlatform.Domain.Enums;

namespace MustGraduationPlatform.Infrastructure.Identity;

public class ApplicationUser : IdentityUser<Guid>
{
    public string FullName { get; set; } = string.Empty;
    public UserRole UserRole { get; set; }
    public int? DepartmentId { get; set; }
    public Department? Department { get; set; }
}
