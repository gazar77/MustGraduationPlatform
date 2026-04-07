using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Options;
using MustGraduationPlatform.Application.Abstractions;
using MustGraduationPlatform.Infrastructure.Options;

namespace MustGraduationPlatform.Infrastructure.Email;

public class BrevoEmailSender : IEmailSender
{
    public const string HttpClientName = "Brevo";

    private readonly IHttpClientFactory _httpClientFactory;
    private readonly BrevoOptions _options;

    public BrevoEmailSender(IHttpClientFactory httpClientFactory, IOptions<BrevoOptions> options)
    {
        _httpClientFactory = httpClientFactory;
        _options = options.Value;
    }

    public async Task SendAsync(string to, string subject, string htmlBody, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(_options.ApiKey))
            throw new InvalidOperationException("Brevo API key is not configured.");

        if (string.IsNullOrWhiteSpace(_options.FromEmail))
            throw new InvalidOperationException("Brevo FromEmail is not configured (must be a verified sender in Brevo).");

        if (string.IsNullOrWhiteSpace(to))
            throw new ArgumentException("Recipient email is required.", nameof(to));

        var client = _httpClientFactory.CreateClient(HttpClientName);

        var payload = new BrevoSendEmailRequest(
            new BrevoSender(_options.FromName, _options.FromEmail),
            new[] { new BrevoRecipient(to.Trim()) },
            subject,
            htmlBody);

        using var response = await client.PostAsJsonAsync("v3/smtp/email", payload, JsonOptions, ct);

        if (response.IsSuccessStatusCode)
            return;

        var body = await response.Content.ReadAsStringAsync(ct);
        throw new InvalidOperationException(
            $"Brevo API error {(int)response.StatusCode}: {response.ReasonPhrase}. {body}");
    }

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
    };

    private sealed record BrevoSender(string Name, string Email);

    private sealed record BrevoRecipient(string Email);

    private sealed record BrevoSendEmailRequest(
        BrevoSender Sender,
        BrevoRecipient[] To,
        string Subject,
        string HtmlContent);
}
