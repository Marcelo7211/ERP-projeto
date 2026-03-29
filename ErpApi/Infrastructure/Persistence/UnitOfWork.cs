using ErpApi.Application.Interfaces;
using ErpApi.Domain.Entities;

namespace ErpApi.Infrastructure.Persistence;

public class UnitOfWork(ErpDbContext dbContext) : IUnitOfWork
{
    private IRepository<Client>? _clients;
    private IRepository<Property>? _properties;
    private IRepository<Contract>? _contracts;
    private IRepository<PipelineDeal>? _pipelineDeals;
    private IRepository<CompanySetting>? _companySettings;
    private IRepository<AppUser>? _users;

    public IRepository<Client> Clients => _clients ??= new Repository<Client>(dbContext);
    public IRepository<Property> Properties => _properties ??= new Repository<Property>(dbContext);
    public IRepository<Contract> Contracts => _contracts ??= new Repository<Contract>(dbContext);
    public IRepository<PipelineDeal> PipelineDeals => _pipelineDeals ??= new Repository<PipelineDeal>(dbContext);
    public IRepository<CompanySetting> CompanySettings => _companySettings ??= new Repository<CompanySetting>(dbContext);
    public IRepository<AppUser> Users => _users ??= new Repository<AppUser>(dbContext);

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await dbContext.SaveChangesAsync(cancellationToken);
    }
}
