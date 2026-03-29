using ErpApi.Domain.Common;
using ErpApi.Domain.Enums;

namespace ErpApi.Domain.Entities;

public class Client : BaseEntity
{
    public string Name { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string Phone { get; private set; } = string.Empty;
    public ClientType Type { get; private set; }
    public PropertyType? InterestPropertyType { get; private set; }
    public decimal? InterestMaxPrice { get; private set; }

    public ICollection<Contract> Contracts { get; private set; } = new List<Contract>();
    public ICollection<PipelineDeal> PipelineDeals { get; private set; } = new List<PipelineDeal>();

    private Client()
    {
    }

    public Client(string name, string email, string phone, ClientType type, PropertyType? interestPropertyType, decimal? interestMaxPrice)
    {
        SetData(name, email, phone, type, interestPropertyType, interestMaxPrice);
    }

    public void Update(string name, string email, string phone, ClientType type, PropertyType? interestPropertyType, decimal? interestMaxPrice)
    {
        SetData(name, email, phone, type, interestPropertyType, interestMaxPrice);
        Touch();
    }

    private void SetData(string name, string email, string phone, ClientType type, PropertyType? interestPropertyType, decimal? interestMaxPrice)
    {
        if (string.IsNullOrWhiteSpace(name) || name.Trim().Length < 3)
        {
            throw new DomainValidationException("Nome do cliente inválido.");
        }

        if (string.IsNullOrWhiteSpace(email) || !email.Contains('@'))
        {
            throw new DomainValidationException("Email do cliente inválido.");
        }

        if (string.IsNullOrWhiteSpace(phone) || phone.Trim().Length < 8)
        {
            throw new DomainValidationException("Telefone do cliente inválido.");
        }

        if (interestMaxPrice is < 0)
        {
            throw new DomainValidationException("Valor máximo de interesse não pode ser negativo.");
        }

        Name = name.Trim();
        Email = email.Trim().ToLowerInvariant();
        Phone = phone.Trim();
        Type = type;
        InterestPropertyType = interestPropertyType;
        InterestMaxPrice = interestMaxPrice;
    }
}
