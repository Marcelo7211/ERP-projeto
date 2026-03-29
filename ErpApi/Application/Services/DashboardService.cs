using ErpApi.Application.Interfaces;
using ErpApi.Application.Models;
using ErpApi.Domain.Enums;
using ErpApi.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ErpApi.Application.Services;

public class DashboardService(ErpDbContext dbContext) : IDashboardService
{
    public async Task<DashboardSummaryResponse> GetSummaryAsync(CancellationToken cancellationToken)
    {
        var totalProperties = await dbContext.Properties.CountAsync(cancellationToken);
        var totalClients = await dbContext.Clients.CountAsync(cancellationToken);
        var totalContracts = await dbContext.Contracts.CountAsync(cancellationToken);
        var activeDeals = await dbContext.PipelineDeals.CountAsync(cancellationToken);
        var activeContracts = await dbContext.Contracts.CountAsync(x => x.Status == ContractStatus.Active, cancellationToken);
        var totalPipelineValue = await dbContext.PipelineDeals.SumAsync(x => (decimal?)x.Value, cancellationToken) ?? 0;

        return new DashboardSummaryResponse(totalProperties, totalClients, totalContracts, totalPipelineValue, activeDeals, activeContracts);
    }
}
