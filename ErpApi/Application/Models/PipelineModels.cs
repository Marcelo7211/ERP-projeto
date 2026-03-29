using ErpApi.Application.Common;

namespace ErpApi.Application.Models;

public sealed record PipelineDealRequest(
    string Title,
    Guid ClientId,
    Guid PropertyId,
    decimal Value,
    string Stage,
    DateTime LastInteractionAt);

public sealed record PipelineDealResponse(
    Guid Id,
    string Title,
    Guid ClientId,
    string ClientName,
    Guid PropertyId,
    string PropertyTitle,
    decimal Value,
    string Stage,
    DateTime LastInteractionAt,
    DateTime CreatedAt,
    DateTime? UpdatedAt);

public sealed class PipelineQueryParameters : QueryParameters
{
    public string? Stage { get; init; }
}
