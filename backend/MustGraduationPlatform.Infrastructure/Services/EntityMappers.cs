using System.Text.Json;
using MustGraduationPlatform.Application.Dtos;
using MustGraduationPlatform.Domain.Entities;

namespace MustGraduationPlatform.Infrastructure.Services;

internal static class EntityMappers
{
    public static IdeaCategoryDto ToDto(IdeaCategory e) => new(e.Id, e.Name, e.SortOrder);

    private static readonly JsonSerializerOptions Json = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

    public static IdeaDto ToDto(Idea e) => new(
        e.Id,
        e.Title,
        e.Description,
        e.Category,
        e.Difficulty,
        JsonSerializer.Deserialize<string[]>(e.RequiredSkillsJson, Json) ?? Array.Empty<string>(),
        e.MaxTeamSize,
        e.SupervisorDoctorId,
        e.SupervisorName,
        e.CreatedAt,
        e.Status,
        e.IsVisible,
        e.DisplayOrder);

    public static NewsDto ToDto(NewsArticle e) => new(
        e.Id,
        e.Title,
        e.Content,
        e.Author,
        e.PublishDate,
        e.Category,
        e.ImagePath,
        e.IsVisible,
        e.DisplayOrder);

    public static EventDto ToDto(CalendarEvent e) => new(
        e.Id,
        e.Title,
        e.Description,
        e.Date.ToString("yyyy-MM-dd"),
        e.Time,
        e.ImagePath,
        e.Location,
        e.Organizer,
        e.Category,
        e.IsVisible,
        e.DisplayOrder);

    public static TemplateDto ToDto(DocumentTemplate e) => new(
        e.Id,
        e.Title,
        e.Description,
        e.FileUrl,
        e.FileSize,
        e.LastUpdate,
        e.IsVisible,
        e.DisplayOrder);

    public static TutorialDocumentDto ToTutorialDto(TutorialDocument e) => new(
        e.Id,
        e.Title,
        e.Description,
        e.FileUrl,
        e.FileSize,
        e.LastUpdate,
        e.IsVisible,
        e.DisplayOrder);

    public static ProposalDto ToDto(Proposal e) => new(
        e.Id,
        e.ProjectName,
        e.TeamName,
        JsonSerializer.Deserialize<string[]>(e.MembersJson, Json) ?? Array.Empty<string>(),
        e.Department,
        e.ProposedSupervisor,
        e.Idea,
        e.Goals,
        e.Description,
        JsonSerializer.Deserialize<string[]>(e.ToolsJson, Json) ?? Array.Empty<string>(),
        e.Notes,
        e.AttachmentUrl,
        e.Status,
        e.SubmissionDate);

    public static ProjectSubmissionDto ToDto(ProjectSubmission e) => new(
        e.Id,
        e.Type,
        e.StudentName,
        e.Email,
        e.ProjectNumber,
        e.ProjectTitle,
        e.SupervisorName,
        e.TeamLeaderName,
        e.FileName,
        e.FileStoragePath,
        e.Notes,
        e.RegistrationPayloadJson,
        e.Status,
        e.SubmissionDate,
        BuildSubmissionAttachmentsList(e));

    internal static IReadOnlyList<SubmissionAttachmentDto>? BuildSubmissionAttachmentsList(ProjectSubmission e)
    {
        if (!string.IsNullOrWhiteSpace(e.AttachmentsJson))
        {
            try
            {
                var list = JsonSerializer.Deserialize<List<SubmissionAttachmentDto>>(e.AttachmentsJson, Json);
                if (list is { Count: > 0 }) return list;
            }
            catch
            {
                // ignore
            }
        }

        if (!string.IsNullOrWhiteSpace(e.FileStoragePath) && !string.IsNullOrWhiteSpace(e.FileName) && e.FileName != "-")
            return new[] { new SubmissionAttachmentDto(e.FileName, e.FileStoragePath) };
        return null;
    }

    public static ContactMessageDto ToDto(ContactMessage e) => new(
        e.Id,
        e.Name,
        e.Email,
        e.Subject,
        e.Message,
        e.Status,
        e.SubmissionDate);

    public static ActivityDto ToDto(DashboardActivity e) => new(
        e.Id,
        e.Type,
        e.Description,
        e.Timestamp,
        e.UserDisplayName);
}
