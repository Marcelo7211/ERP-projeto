using ErpApi.Application.Common;

namespace ErpApi.Application.Models;

public sealed record PropertyRequest(
    string Title,
    string Type,
    string Address,
    decimal Price,
    decimal RentPrice,
    string Status,
    string Image,
    string? Description,
    int Bedrooms,
    int Bathrooms,
    int Parking,
    decimal Area);

public sealed record PropertyResponse(
    Guid Id,
    string Title,
    string Type,
    string Address,
    decimal Price,
    decimal RentPrice,
    string Status,
    string Image,
    string? Description,
    FeatureResponse Features,
    DateTime CreatedAt,
    DateTime? UpdatedAt);

public sealed record FeatureResponse(int Bedrooms, int Bathrooms, int Parking, decimal Area);

public sealed class PropertyQueryParameters : QueryParameters
{
    public string? Type { get; init; }
    public string? Status { get; init; }
    public decimal? MinPrice { get; init; }
    public decimal? MaxPrice { get; init; }
    public int? Bedrooms { get; init; }
}
