using ErpApi.Domain.Common;

namespace ErpApi.Domain.Entities;

public class CompanySetting : BaseEntity
{
    public string CompanyName { get; private set; } = string.Empty;
    public string PrimaryColor { get; private set; } = "#0F172A";
    public string LogoUrl { get; private set; } = string.Empty;
    public bool IsActive { get; private set; }

    private CompanySetting()
    {
    }

    public CompanySetting(string companyName, string primaryColor, string logoUrl, bool isActive)
    {
        SetData(companyName, primaryColor, logoUrl, isActive);
    }

    public void Update(string companyName, string primaryColor, string logoUrl, bool isActive)
    {
        SetData(companyName, primaryColor, logoUrl, isActive);
        Touch();
    }

    private void SetData(string companyName, string primaryColor, string logoUrl, bool isActive)
    {
        if (string.IsNullOrWhiteSpace(companyName) || companyName.Trim().Length < 3)
        {
            throw new DomainValidationException("Nome da imobiliária inválido.");
        }

        if (string.IsNullOrWhiteSpace(primaryColor) || !primaryColor.StartsWith('#') || primaryColor.Length != 7)
        {
            throw new DomainValidationException("Cor principal inválida.");
        }

        CompanyName = companyName.Trim();
        PrimaryColor = primaryColor.Trim().ToUpperInvariant();
        LogoUrl = logoUrl.Trim();
        IsActive = isActive;
    }
}
