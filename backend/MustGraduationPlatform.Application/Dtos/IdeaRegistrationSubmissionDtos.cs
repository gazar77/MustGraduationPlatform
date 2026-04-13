namespace MustGraduationPlatform.Application.Dtos;

public record IdeaRegistrationStudentRowDto(string StudentName, string UniversityId, string MobileNumber);

public record IdeaRegistrationSubmitDto(
    string AcademicYear,
    string Semester,
    string Department,
    string TitleEn,
    string TitleAr,
    string Category,
    string SupervisorName,
    string AssistantSupervisorName,
    string? ExternalOrg,
    IReadOnlyList<IdeaRegistrationStudentRowDto> Students);
