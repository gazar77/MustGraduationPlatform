namespace MustGraduationPlatform.Infrastructure.Options;

public class JwtOptions
{
    public const string SectionName = "Jwt";

    public string Issuer { get; set; } = "MustGraduationPlatform";
    public string Audience { get; set; } = "MustGraduationPlatform";
    public string SigningKey { get; set; } = "";
    public int ExpiresMinutes { get; set; } = 120;
}
