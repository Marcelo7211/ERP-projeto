using ErpApi.Application.Common;
using ErpApi.Application.Interfaces;
using ErpApi.Application.Models;
using ErpApi.Domain.Entities;
using ErpApi.Domain.Enums;
using ErpApi.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ErpApi.Application.Services;

public class PipelineService(IUnitOfWork unitOfWork, ErpDbContext dbContext) : IPipelineService
{
    public async Task<PagedResult<PipelineDealResponse>> GetPagedAsync(PipelineQueryParameters query, CancellationToken cancellationToken)
    {
        var (page, pageSize, skip) = PaginationHelper.Normalize(query.Page, query.PageSize);
        PipelineStage? parsedStage = string.IsNullOrWhiteSpace(query.Stage) ? null : EnumTextMapper.ToPipelineStage(query.Stage);
        var search = query.Search?.ToLower() ?? string.Empty;

        var baseQuery = dbContext.PipelineDeals
            .AsNoTracking()
            .Include(x => x.Client)
            .Include(x => x.Property)
            .Where(x =>
                (!parsedStage.HasValue || x.Stage == parsedStage) &&
                (string.IsNullOrWhiteSpace(search) ||
                    x.Title.ToLower().Contains(search) ||
                    (x.Client != null && x.Client.Name.ToLower().Contains(search))));

        baseQuery = (query.OrderBy ?? "lastInteractionAt:desc").ToLower() switch
        {
            "value:asc" => baseQuery.OrderBy(x => x.Value),
            "value:desc" => baseQuery.OrderByDescending(x => x.Value),
            "createdat:asc" => baseQuery.OrderBy(x => x.CreatedAt),
            "createdat:desc" => baseQuery.OrderByDescending(x => x.CreatedAt),
            "lastinteractionat:asc" => baseQuery.OrderBy(x => x.LastInteractionAt),
            _ => baseQuery.OrderByDescending(x => x.LastInteractionAt)
        };

        var total = await baseQuery.CountAsync(cancellationToken);
        var items = await baseQuery.Skip(skip).Take(pageSize).ToListAsync(cancellationToken);

        return PaginationHelper.Build(items.Select(Map).ToList(), total, page, pageSize);
    }

    public async Task<PipelineDealResponse?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var entity = await dbContext.PipelineDeals
            .AsNoTracking()
            .Include(x => x.Client)
            .Include(x => x.Property)
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        return entity is null ? null : Map(entity);
    }

    public async Task<PipelineDealResponse> CreateAsync(PipelineDealRequest request, CancellationToken cancellationToken)
    {
        await EnsureReferencesAsync(request.ClientId, request.PropertyId, cancellationToken);
        var entity = new PipelineDeal(
            request.Title,
            request.ClientId,
            request.PropertyId,
            request.Value,
            EnumTextMapper.ToPipelineStage(request.Stage),
            request.LastInteractionAt);
        await unitOfWork.PipelineDeals.AddAsync(entity, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        var mapped = await GetByIdAsync(entity.Id, cancellationToken);
        return mapped!;
    }

    public async Task<PipelineDealResponse?> UpdateAsync(Guid id, PipelineDealRequest request, CancellationToken cancellationToken)
    {
        var entity = await unitOfWork.PipelineDeals.GetByIdAsync(id, cancellationToken);
        if (entity is null)
        {
            return null;
        }

        await EnsureReferencesAsync(request.ClientId, request.PropertyId, cancellationToken);
        entity.Update(
            request.Title,
            request.ClientId,
            request.PropertyId,
            request.Value,
            EnumTextMapper.ToPipelineStage(request.Stage),
            request.LastInteractionAt);
        unitOfWork.PipelineDeals.Update(entity);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return await GetByIdAsync(id, cancellationToken);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var entity = await unitOfWork.PipelineDeals.GetByIdAsync(id, cancellationToken);
        if (entity is null)
        {
            return false;
        }

        unitOfWork.PipelineDeals.Remove(entity);
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

    private static PipelineDealResponse Map(PipelineDeal entity)
    {
        return new PipelineDealResponse(
            entity.Id,
            entity.Title,
            entity.ClientId,
            entity.Client?.Name ?? string.Empty,
            entity.PropertyId,
            entity.Property?.Title ?? string.Empty,
            entity.Value,
            EnumTextMapper.ToText(entity.Stage),
            entity.LastInteractionAt,
            entity.CreatedAt,
            entity.UpdatedAt);
    }
}
