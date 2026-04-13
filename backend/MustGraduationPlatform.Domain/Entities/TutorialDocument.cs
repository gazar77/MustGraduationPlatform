namespace MustGraduationPlatform.Domain.Entities;

public class TutorialDocument
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string FileUrl { get; set; } = string.Empty;
    public string FileSize { get; set; } = string.Empty;
    public DateTime LastUpdate { get; set; }
    public bool IsVisible { get; set; } = true;
    public int DisplayOrder { get; set; }
}
