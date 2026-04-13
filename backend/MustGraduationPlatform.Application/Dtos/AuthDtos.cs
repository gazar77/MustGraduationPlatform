namespace MustGraduationPlatform.Application.Dtos;

public record IdentifyRequestDto(string Email);

public record IdentifyResponseDto(bool Exists, string? UserType);

public record AdminLoginRequestDto(string Email, string Password);

public record StudentSendCodeRequestDto(string Email);

public record StudentLoginRequestDto(string Email, string Password);

public record StudentRegisterRequestDto(
    string Email,
    string Password,
    string FirstName,
    string LastName,
    int DepartmentId,
    string ActivationCode);

public record AuthSuccessDto(UserDto User);
