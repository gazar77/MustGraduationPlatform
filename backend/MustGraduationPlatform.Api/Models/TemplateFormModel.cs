namespace MustGraduationPlatform.Api.Models;

public class TemplateFormModel
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsVisible { get; set; } = true;
    public int DisplayOrder { get; set; }
    public IFormFile? File { get; set; }
}
