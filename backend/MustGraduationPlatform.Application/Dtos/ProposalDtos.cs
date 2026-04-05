namespace MustGraduationPlatform.Application.Dtos;

public record ProposalDto(
    int Id,
    string ProjectName,
    string TeamName,
    string[] Members,
    string Department,
    string ProposedSupervisor,
    string Idea,
    string Goals,
    string Description,
    string[] Tools,
    string? Notes,
    string? Attachment,
    string Status,
    DateTime SubmissionDate);

public record ProposalCreateDto(
    string ProjectName,
    string TeamName,
    string[] Members,
    string Department,
    string ProposedSupervisor,
    string Idea,
    string Goals,
    string Description,
    string[] Tools,
    string? Notes);

public record ProposalStatusUpdateDto(string Status);
