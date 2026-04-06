namespace MustGraduationPlatform.Domain.Entities;

public class GraduationRequirementFile
{
    public int Id { get; set; }
    public Guid UserId { get; set; }
    /// <summary>Route segment, e.g. "1" for requirements-1.</summary>
    public string RequirementKey { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public string FileUrl { get; set; } = string.Empty;
    public DateTime UploadedAt { get; set; }
}
