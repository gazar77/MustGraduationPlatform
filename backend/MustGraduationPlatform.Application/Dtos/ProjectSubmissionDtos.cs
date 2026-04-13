namespace MustGraduationPlatform.Application.Dtos;

public record SubmissionAttachmentDto(string FileName, string FileUrl);

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
    string? FileUrl,
    string Notes,
    string? RegistrationPayloadJson,
    string Status,
    DateTime SubmissionDate,
    IReadOnlyList<SubmissionAttachmentDto>? Attachments);

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
