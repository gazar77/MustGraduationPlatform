namespace MustGraduationPlatform.Application.Dtos;

public record IdeaCategoryDto(int Id, string Name, int SortOrder);

public record IdeaCategoryCreateUpdateDto(string Name, int SortOrder);
