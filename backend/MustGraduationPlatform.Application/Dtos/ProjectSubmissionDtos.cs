namespace MustGraduationPlatform.Application.Dtos;

public record ProjectSubmissionDto(
    int Id,
    string Type,
    string? StudentName,
    string? Email,
    string? ProjectNumber,
    string? ProjectTitle,
    string? SupervisorName,
    string? TeamLeaderName,
    string FileName,
    string Notes,
    string Status,
    DateTime SubmissionDate);

public record ProjectSubmissionCreateDto(
    string Type,
    string? StudentName,
    string? Email,
    string? ProjectNumber,
    string? ProjectTitle,
    string? SupervisorName,
    string? TeamLeaderName,
    string FileName,
    string Notes);

public record ProjectSubmissionStatusUpdateDto(string Status);
