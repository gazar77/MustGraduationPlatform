namespace MustGraduationPlatform.Application.Dtos;

public record DashboardStatsDto(
    int TotalIdeas,
    int ReservedIdeas,
    int ApprovedIdeas,
    int TotalDoctors,
    int TotalProposals,
    int VisibleContentCount);

public record ActivityDto(
    int Id,
    string Type,
    string Description,
    DateTime Timestamp,
    string User);

public record ActivityCreateDto(string Type, string Description, string User);
