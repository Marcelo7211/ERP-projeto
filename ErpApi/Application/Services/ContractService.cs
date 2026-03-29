using ErpApi.Application.Common;
using ErpApi.Application.Interfaces;
using ErpApi.Application.Models;
using ErpApi.Domain.Entities;
using ErpApi.Domain.Enums;
using ErpApi.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ErpApi.Application.Services;

public class ContractService(IUnitOfWork unitOfWork, ErpDbContext dbContext) : IContractService
{
    public async Task<PagedResult<ContractResponse>> GetPagedAsync(ContractQueryParameters query, CancellationToken cancellationToken)
    {
        var (page, pageSize, skip) = PaginationHelper.Normalize(query.Page, query.PageSize);
        var parsedType = string.IsNullOrWhiteSpace(query.Type) ? (ContractType?)null : EnumTextMapper.ToContractType(query.Type);
        var parsedStatus = string.IsNullOrWhiteSpace(query.Status) ? (ContractStatus?)null : EnumTextMapper.ToContractStatus(query.Status);
        var search = query.Search?.ToLower() ?? string.Empty;

        var baseQuery = dbContext.Contracts
            .AsNoTracking()
            .Include(x => x.Client)
            .Include(x => x.Property)
            .Where(x =>
                (!parsedType.HasValue || x.Type == parsedType) &&
                (!parsedStatus.HasValue || x.Status == parsedStatus) &&
                (string.IsNullOrWhiteSpace(search) ||
                    (x.Client != null && x.Client.Name.ToLower().Contains(search)) ||
                    (x.Property != null && x.Property.Title.ToLower().Contains(search))));

        baseQuery = (query.OrderBy ?? "createdAt:desc").ToLower() switch
        {
            "value:asc" => baseQuery.OrderBy(x => x.Value),
            "value:desc" => baseQuery.OrderByDescending(x => x.Value),
            "startdate:asc" => baseQuery.OrderBy(x => x.StartDate),
            "startdate:desc" => baseQuery.OrderByDescending(x => x.StartDate),
            "createdat:asc" => baseQuery.OrderBy(x => x.CreatedAt),
            _ => baseQuery.OrderByDescending(x => x.CreatedAt)
        };

        var total = await baseQuery.CountAsync(cancellationToken);
        var items = await baseQuery.Skip(skip).Take(pageSize).ToListAsync(cancellationToken);

        return PaginationHelper.Build(items.Select(Map).ToList(), total, page, pageSize);
    }

    public async Task<ContractResponse?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var entity = await dbContext.Contracts
            .AsNoTracking()
            .Include(x => x.Client)
            .Include(x => x.Property)
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        return entity is null ? null : Map(entity);
    }

    public async Task<ContractResponse> CreateAsync(ContractRequest request, CancellationToken cancellationToken)
    {
        await EnsureReferencesAsync(request.ClientId, request.PropertyId, cancellationToken);
        var entity = new Contract(
            EnumTextMapper.ToContractType(request.Type),
            request.PropertyId,
            request.ClientId,
            request.Value,
            EnumTextMapper.ToContractStatus(request.Status),
            request.StartDate,
            request.EndDate,
            request.SignedAt);
        await unitOfWork.Contracts.AddAsync(entity, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        var mapped = await GetByIdAsync(entity.Id, cancellationToken);
        return mapped!;
    }

    public async Task<ContractResponse?> UpdateAsync(Guid id, ContractRequest request, CancellationToken cancellationToken)
    {
        var entity = await unitOfWork.Contracts.GetByIdAsync(id, cancellationToken);
        if (entity is null)
        {
            return null;
        }

        await EnsureReferencesAsync(request.ClientId, request.PropertyId, cancellationToken);
        entity.Update(
            EnumTextMapper.ToContractType(request.Type),
            request.PropertyId,
            request.ClientId,
            request.Value,
            EnumTextMapper.ToContractStatus(request.Status),
            request.StartDate,
            request.EndDate,
            request.SignedAt);
        unitOfWork.Contracts.Update(entity);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return await GetByIdAsync(id, cancellationToken);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var entity = await unitOfWork.Contracts.GetByIdAsync(id, cancellationToken);
        if (entity is null)
        {
            return false;
        }

        unitOfWork.Contracts.Remove(entity);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return true;
    }

    private async Task EnsureReferencesAsync(Guid clientId, Guid propertyId, CancellationToken cancellationToken)
    {
        var clientExists = await dbContext.Clients.AnyAsync(x => x.Id == clientId, cancellationToken);
        var propertyExists = await dbContext.Properties.AnyAsync(x => x.Id == propertyId, cancellationToken);

        if (!clientExists || !propertyExists)
        {
            throw new InvalidOperationException("Cliente ou imóvel informado não existe.");
        }
    }

    private static ContractResponse Map(Contract entity)
    {
        return new ContractResponse(
            entity.Id,
            EnumTextMapper.ToText(entity.Type),
            entity.PropertyId,
            entity.Property?.Title ?? string.Empty,
            entity.ClientId,
            entity.Client?.Name ?? string.Empty,
            entity.Value,
            EnumTextMapper.ToText(entity.Status),
            entity.StartDate,
            entity.EndDate,
            entity.SignedAt,
            entity.CreatedAt,
            entity.UpdatedAt);
    }
}
