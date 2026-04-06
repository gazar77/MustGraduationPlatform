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

/// <summary>Student-submitted idea pending admin review (not visible until toggled).</summary>
public record IdeaStudentSubmitDto(
    string Title,
    string Description,
    string Category,
    int MaxTeamSize,
    string SupervisorName);
