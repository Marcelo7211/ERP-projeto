using ErpApi.Domain.Common;
using ErpApi.Domain.Enums;

namespace ErpApi.Domain.Entities;

public class Property : BaseEntity
{
    public string Title { get; private set; } = string.Empty;
    public PropertyType Type { get; private set; }
    public string Address { get; private set; } = string.Empty;
    public decimal Price { get; private set; }
    public decimal RentPrice { get; private set; }
    public PropertyStatus Status { get; private set; }
    public string Image { get; private set; } = string.Empty;
    public string? Description { get; private set; }
    public int Bedrooms { get; private set; }
    public int Bathrooms { get; private set; }
    public int Parking { get; private set; }
    public decimal Area { get; private set; }

    public ICollection<Contract> Contracts { get; private set; } = new List<Contract>();
    public ICollection<PipelineDeal> PipelineDeals { get; private set; } = new List<PipelineDeal>();

    private Property()
    {
    }

    public Property(string title, PropertyType type, string address, decimal price, decimal rentPrice, PropertyStatus status, string image, string? description, int bedrooms, int bathrooms, int parking, decimal area)
    {
        SetData(title, type, address, price, rentPrice, status, image, description, bedrooms, bathrooms, parking, area);
    }

    public void Update(string title, PropertyType type, string address, decimal price, decimal rentPrice, PropertyStatus status, string image, string? description, int bedrooms, int bathrooms, int parking, decimal area)
    {
        SetData(title, type, address, price, rentPrice, status, image, description, bedrooms, bathrooms, parking, area);
        Touch();
    }

    private void SetData(string title, PropertyType type, string address, decimal price, decimal rentPrice, PropertyStatus status, string image, string? description, int bedrooms, int bathrooms, int parking, decimal area)
    {
        if (string.IsNullOrWhiteSpace(title) || title.Trim().Length < 5)
        {
            throw new DomainValidationException("Título do imóvel inválido.");
        }

        if (string.IsNullOrWhiteSpace(address) || address.Trim().Length < 10)
        {
            throw new DomainValidationException("Endereço do imóvel inválido.");
        }

        if (price <= 0 || rentPrice < 0 || area <= 0)
        {
            throw new DomainValidationException("Dados financeiros e de área do imóvel inválidos.");
        }

        if (bedrooms < 0 || bathrooms < 0 || parking < 0)
        {
            throw new DomainValidationException("Características do imóvel inválidas.");
        }

        Title = title.Trim();
        Type = type;
        Address = address.Trim();
        Price = price;
        RentPrice = rentPrice;
        Status = status;
        Image = image.Trim();
        Description = description?.Trim();
        Bedrooms = bedrooms;
        Bathrooms = bathrooms;
        Parking = parking;
        Area = area;
    }
}
