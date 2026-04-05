namespace MustGraduationPlatform.Application.Dtos;

public record ContactMessageDto(
    int Id,
    string Name,
    string Email,
    string Subject,
    string Message,
    string Status,
    DateTime SubmissionDate);

public record ContactMessageCreateDto(string Name, string Email, string Subject, string Message);

public record ContactMessageStatusUpdateDto(string Status);
