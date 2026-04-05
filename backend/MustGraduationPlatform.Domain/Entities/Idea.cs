namespace MustGraduationPlatform.Domain.Entities;

public class Idea
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Difficulty { get; set; } = "Medium";
    public string RequiredSkillsJson { get; set; } = "[]";
    public int MaxTeamSize { get; set; }
    public int? SupervisorDoctorId { get; set; }
    public string SupervisorName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string Status { get; set; } = "Open";
    public bool IsVisible { get; set; } = true;
    public int DisplayOrder { get; set; }
}
