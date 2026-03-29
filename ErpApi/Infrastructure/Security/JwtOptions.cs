namespace ErpApi.Infrastructure.Security;

public class JwtOptions
{
    public const string SectionName = "Jwt";
    public string Issuer { get; init; } = "ErpApi";
    public string Audience { get; init; } = "ErpApi.Client";
    public string SecretKey { get; init; } = "super-secret-development-key-at-least-32-chars";
    public int ExpiresInMinutes { get; init; } = 120;
}
