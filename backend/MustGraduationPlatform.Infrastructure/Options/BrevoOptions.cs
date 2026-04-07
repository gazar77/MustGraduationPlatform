namespace MustGraduationPlatform.Infrastructure.Options;

/// <summary>Brevo (Sendinblue) transactional email API — https://developers.brevo.com/reference/sendtransacemail </summary>
public class BrevoOptions
{
    public const string SectionName = "Brevo";

    /// <summary>API key from Brevo dashboard (SMTP &amp; API).</summary>
    public string ApiKey { get; set; } = "";

    /// <summary>Verified sender email in Brevo.</summary>
    public string FromEmail { get; set; } = "";

    /// <summary>Display name for the sender.</summary>
    public string FromName { get; set; } = "MUST Graduation Portal";
}
