namespace ErpApi.Application.Models;

public sealed record DashboardSummaryResponse(
    int TotalProperties,
    int TotalClients,
    int TotalContracts,
    decimal TotalPipelineValue,
    int ActiveDeals,
    int ActiveContracts);
