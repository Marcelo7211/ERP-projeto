using ErpApi.Application.Common;

namespace ErpApi.Application.Models;

public sealed record ClientRequest(
    string Name,
    string Email,
    string Phone,
    string Type,
    string? InterestPropertyType,
    decimal? InterestMaxPrice);

public sealed record ClientResponse(
    Guid Id,
    string Name,
    string Email,
    string Phone,
    string Type,
    InterestResponse? Interest,
    DateTime CreatedAt,
    DateTime? UpdatedAt);

public sealed record InterestResponse(string PropertyType, decimal MaxPrice);

public sealed class ClientQueryParameters : QueryParameters
{
    public string? Type { get; init; }
    public string? PropertyType { get; init; }
}
