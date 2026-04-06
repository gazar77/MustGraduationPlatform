namespace MustGraduationPlatform.Api.Models;

public class GraduationRequirementFormModel
{
    public string RequirementKey { get; set; } = string.Empty;
    public IFormFile? File { get; set; }
}
