namespace MustGraduationPlatform.Application.Dtos;

public record GraduationTeamMemberDto(string StudentId, string Name, string Department);

public record GraduationProjectDto(
    string Title,
    string Department,
    string SupervisorName,
    IReadOnlyList<GraduationTeamMemberDto> Students);

public record GraduationRequirementFileDto(
    int Id,
    string RequirementKey,
    string FileName,
    string FileUrl,
    DateTime UploadedAt);

public record DoctorDashboardDto(
    int SupervisedIdeasCount,
    int PendingProposalsCount,
    IReadOnlyList<IdeaDto> Ideas);
