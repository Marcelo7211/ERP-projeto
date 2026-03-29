using ErpApi.Application.Common;

namespace ErpApi.Application.Models;

public sealed record ContractRequest(
    string Type,
    Guid PropertyId,
    Guid ClientId,
    decimal Value,
    string Status,
    DateTime StartDate,
    DateTime EndDate,
    DateTime? SignedAt);

public sealed record ContractResponse(
    Guid Id,
    string Type,
    Guid PropertyId,
    string PropertyTitle,
    Guid ClientId,
    string ClientName,
    decimal Value,
    string Status,
    DateTime StartDate,
    DateTime EndDate,
    DateTime? SignedAt,
    DateTime CreatedAt,
    DateTime? UpdatedAt);

public sealed class ContractQueryParameters : QueryParameters
{
    public string? Type { get; init; }
    public string? Status { get; init; }
}
