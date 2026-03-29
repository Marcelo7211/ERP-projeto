using ErpApi.Domain.Entities;

namespace ErpApi.Application.Interfaces;

public interface IUnitOfWork
{
    IRepository<Client> Clients { get; }
    IRepository<Property> Properties { get; }
    IRepository<Contract> Contracts { get; }
    IRepository<PipelineDeal> PipelineDeals { get; }
    IRepository<CompanySetting> CompanySettings { get; }
    IRepository<AppUser> Users { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
