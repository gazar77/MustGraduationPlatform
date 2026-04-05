namespace MustGraduationPlatform.Application.Dtos;

public record IdeaDto(
    int Id,
    string Title,
    string Description,
    string Category,
    string Difficulty,
    string[] RequiredSkills,
    int MaxTeamSize,
    int? SupervisorDoctorId,
    string SupervisorName,
    DateTime CreatedAt,
    string Status,
    bool IsVisible,
    int? Order);

public record IdeaCreateUpdateDto(
    string Title,
    string Description,
    string Category,
    string Difficulty,
    string[] RequiredSkills,
    int MaxTeamSize,
    int? SupervisorDoctorId,
    string SupervisorName,
    string Status,
    bool IsVisible,
    int DisplayOrder);
