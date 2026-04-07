namespace MustGraduationPlatform.Api.Models;

public class NewsFormModel
{
    public string Title { get; set; } = string.Empty;
    public string? Content { get; set; }
    public string Author { get; set; } = string.Empty;
    public string Category { get; set; } = "Announcement";
    public bool IsVisible { get; set; } = true;
    public int DisplayOrder { get; set; }
    public IFormFile? Image { get; set; }
}
