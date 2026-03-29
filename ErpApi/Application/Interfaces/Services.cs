using ErpApi.Application.Common;
using ErpApi.Application.Models;

namespace ErpApi.Application.Interfaces;

public interface IClientService
{
    Task<PagedResult<ClientResponse>> GetPagedAsync(ClientQueryParameters query, CancellationToken cancellationToken);
    Task<ClientResponse?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<ClientResponse> CreateAsync(ClientRequest request, CancellationToken cancellationToken);
    Task<ClientResponse?> UpdateAsync(Guid id, ClientRequest request, CancellationToken cancellationToken);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
}

public interface IPropertyService
{
    Task<PagedResult<PropertyResponse>> GetPagedAsync(PropertyQueryParameters query, CancellationToken cancellationToken);
    Task<PropertyResponse?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<PropertyResponse> CreateAsync(PropertyRequest request, CancellationToken cancellationToken);
    Task<PropertyResponse?> UpdateAsync(Guid id, PropertyRequest request, CancellationToken cancellationToken);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
}

public interface IContractService
{
    Task<PagedResult<ContractResponse>> GetPagedAsync(ContractQueryParameters query, CancellationToken cancellationToken);
    Task<ContractResponse?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<ContractResponse> CreateAsync(ContractRequest request, CancellationToken cancellationToken);
    Task<ContractResponse?> UpdateAsync(Guid id, ContractRequest request, CancellationToken cancellationToken);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
}

public interface IPipelineService
{
    Task<PagedResult<PipelineDealResponse>> GetPagedAsync(PipelineQueryParameters query, CancellationToken cancellationToken);
    Task<PipelineDealResponse?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<PipelineDealResponse> CreateAsync(PipelineDealRequest request, CancellationToken cancellationToken);
    Task<PipelineDealResponse?> UpdateAsync(Guid id, PipelineDealRequest request, CancellationToken cancellationToken);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
}

public interface ISettingService
{
    Task<PagedResult<CompanySettingResponse>> GetPagedAsync(QueryParameters query, CancellationToken cancellationToken);
    Task<CompanySettingResponse?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<CompanySettingResponse> CreateAsync(CompanySettingRequest request, CancellationToken cancellationToken);
    Task<CompanySettingResponse?> UpdateAsync(Guid id, CompanySettingRequest request, CancellationToken cancellationToken);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
    Task<CompanySettingResponse?> GetCurrentAsync(CancellationToken cancellationToken);
}

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken);
    Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken);
}

public interface IDashboardService
{
    Task<DashboardSummaryResponse> GetSummaryAsync(CancellationToken cancellationToken);
}
