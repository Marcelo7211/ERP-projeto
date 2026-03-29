namespace ErpApi.Application.Common;

public class QueryParameters
{
    public int Page { get; init; } = 1;
    public int PageSize { get; init; } = 20;
    public string? Search { get; init; }
    public string? OrderBy { get; init; }
}
