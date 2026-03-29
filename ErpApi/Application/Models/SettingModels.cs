namespace ErpApi.Application.Models;

public sealed record CompanySettingRequest(
    string CompanyName,
    string PrimaryColor,
    string LogoUrl,
    bool IsActive);

public sealed record CompanySettingResponse(
    Guid Id,
    string CompanyName,
    string PrimaryColor,
    string LogoUrl,
    bool IsActive,
    DateTime CreatedAt,
    DateTime? UpdatedAt);
