namespace MustGraduationPlatform.Application.Dtos;

public record UserDto(
    Guid Id,
    string Name,
    string Email,
    string Role,
    string? DepartmentCode);
