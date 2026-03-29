using ErpApi.Application.Common;
using ErpApi.Application.Interfaces;
using ErpApi.Application.Models;
using ErpApi.Domain.Entities;

namespace ErpApi.Application.Services;

public class SettingService(IUnitOfWork unitOfWork) : ISettingService
{
    public async Task<PagedResult<CompanySettingResponse>> GetPagedAsync(QueryParameters query, CancellationToken cancellationToken)
    {
        var (page, pageSize, skip) = PaginationHelper.Normalize(query.Page, query.PageSize);
        var search = query.Search?.ToLower() ?? string.Empty;

        var items = await unitOfWork.CompanySettings.ListAsync(
            filter: s => string.IsNullOrWhiteSpace(search) || s.CompanyName.ToLower().Contains(search),
            orderBy: q => (query.OrderBy ?? "createdAt:desc").ToLower() switch
            {
                "companyname:asc" => q.OrderBy(x => x.CompanyName),
                "companyname:desc" => q.OrderByDescending(x => x.CompanyName),
                "createdat:asc" => q.OrderBy(x => x.CreatedAt),
                _ => q.OrderByDescending(x => x.CreatedAt)
            },
            skip: skip,
            take: pageSize,
            cancellationToken: cancellationToken);

        var total = await unitOfWork.CompanySettings.CountAsync(
            s => string.IsNullOrWhiteSpace(search) || s.CompanyName.ToLower().Contains(search),
            cancellationToken);

        return PaginationHelper.Build(items.Select(Map).ToList(), total, page, pageSize);
    }

    public async Task<CompanySettingResponse?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var entity = await unitOfWork.CompanySettings.GetByIdAsync(id, cancellationToken);
        return entity is null ? null : Map(entity);
    }

    public async Task<CompanySettingResponse> CreateAsync(CompanySettingRequest request, CancellationToken cancellationToken)
    {
        var entity = new CompanySetting(request.CompanyName, request.PrimaryColor, request.LogoUrl, request.IsActive);
        await unitOfWork.CompanySettings.AddAsync(entity, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return Map(entity);
    }

    public async Task<CompanySettingResponse?> UpdateAsync(Guid id, CompanySettingRequest request, CancellationToken cancellationToken)
    {
        var entity = await unitOfWork.CompanySettings.GetByIdAsync(id, cancellationToken);
        if (entity is null)
        {
            return null;
        }

        entity.Update(request.CompanyName, request.PrimaryColor, request.LogoUrl, request.IsActive);
        unitOfWork.CompanySettings.Update(entity);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return Map(entity);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var entity = await unitOfWork.CompanySettings.GetByIdAsync(id, cancellationToken);
        if (entity is null)
        {
            return false;
        }

        unitOfWork.CompanySettings.Remove(entity);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<CompanySettingResponse?> GetCurrentAsync(CancellationToken cancellationToken)
    {
        var item = await unitOfWork.CompanySettings.ListAsync(
            filter: x => x.IsActive,
            orderBy: q => q.OrderByDescending(x => x.UpdatedAt).ThenByDescending(x => x.CreatedAt),
            take: 1,
            cancellationToken: cancellationToken);

        return item.Count == 0 ? null : Map(item[0]);
    }

    private static CompanySettingResponse Map(CompanySetting entity)
    {
        return new CompanySettingResponse(entity.Id, entity.CompanyName, entity.PrimaryColor, entity.LogoUrl, entity.IsActive, entity.CreatedAt, entity.UpdatedAt);
    }
}
