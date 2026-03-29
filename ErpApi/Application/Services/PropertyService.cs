using ErpApi.Application.Common;
using ErpApi.Application.Interfaces;
using ErpApi.Application.Models;
using ErpApi.Domain.Entities;
using ErpApi.Domain.Enums;

namespace ErpApi.Application.Services;

public class PropertyService(IUnitOfWork unitOfWork) : IPropertyService
{
    public async Task<PagedResult<PropertyResponse>> GetPagedAsync(PropertyQueryParameters query, CancellationToken cancellationToken)
    {
        var (page, pageSize, skip) = PaginationHelper.Normalize(query.Page, query.PageSize);
        var parsedType = string.IsNullOrWhiteSpace(query.Type) ? (PropertyType?)null : EnumTextMapper.ToPropertyType(query.Type);
        var parsedStatus = string.IsNullOrWhiteSpace(query.Status) ? (PropertyStatus?)null : EnumTextMapper.ToPropertyStatus(query.Status);
        var search = query.Search?.ToLower() ?? string.Empty;

        var items = await unitOfWork.Properties.ListAsync(
            filter: p =>
                (string.IsNullOrWhiteSpace(search) || p.Title.ToLower().Contains(search) || p.Address.ToLower().Contains(search)) &&
                (!parsedType.HasValue || p.Type == parsedType) &&
                (!parsedStatus.HasValue || p.Status == parsedStatus) &&
                (!query.MinPrice.HasValue || p.Price >= query.MinPrice.Value) &&
                (!query.MaxPrice.HasValue || p.Price <= query.MaxPrice.Value) &&
                (!query.Bedrooms.HasValue || p.Bedrooms >= query.Bedrooms.Value),
            orderBy: q => (query.OrderBy ?? "createdAt:desc").ToLower() switch
            {
                "price:asc" => q.OrderBy(x => x.Price),
                "price:desc" => q.OrderByDescending(x => x.Price),
                "title:asc" => q.OrderBy(x => x.Title),
                "title:desc" => q.OrderByDescending(x => x.Title),
                "createdat:asc" => q.OrderBy(x => x.CreatedAt),
                _ => q.OrderByDescending(x => x.CreatedAt)
            },
            skip: skip,
            take: pageSize,
            cancellationToken: cancellationToken);

        var total = await unitOfWork.Properties.CountAsync(
            p =>
                (string.IsNullOrWhiteSpace(search) || p.Title.ToLower().Contains(search) || p.Address.ToLower().Contains(search)) &&
                (!parsedType.HasValue || p.Type == parsedType) &&
                (!parsedStatus.HasValue || p.Status == parsedStatus) &&
                (!query.MinPrice.HasValue || p.Price >= query.MinPrice.Value) &&
                (!query.MaxPrice.HasValue || p.Price <= query.MaxPrice.Value) &&
                (!query.Bedrooms.HasValue || p.Bedrooms >= query.Bedrooms.Value),
            cancellationToken);

        return PaginationHelper.Build(items.Select(Map).ToList(), total, page, pageSize);
    }

    public async Task<PropertyResponse?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var entity = await unitOfWork.Properties.GetByIdAsync(id, cancellationToken);
        return entity is null ? null : Map(entity);
    }

    public async Task<PropertyResponse> CreateAsync(PropertyRequest request, CancellationToken cancellationToken)
    {
        var entity = new Property(
            request.Title,
            EnumTextMapper.ToPropertyType(request.Type),
            request.Address,
            request.Price,
            request.RentPrice,
            EnumTextMapper.ToPropertyStatus(request.Status),
            request.Image,
            request.Description,
            request.Bedrooms,
            request.Bathrooms,
            request.Parking,
            request.Area);
        await unitOfWork.Properties.AddAsync(entity, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return Map(entity);
    }

    public async Task<PropertyResponse?> UpdateAsync(Guid id, PropertyRequest request, CancellationToken cancellationToken)
    {
        var entity = await unitOfWork.Properties.GetByIdAsync(id, cancellationToken);
        if (entity is null)
        {
            return null;
        }

        entity.Update(
            request.Title,
            EnumTextMapper.ToPropertyType(request.Type),
            request.Address,
            request.Price,
            request.RentPrice,
            EnumTextMapper.ToPropertyStatus(request.Status),
            request.Image,
            request.Description,
            request.Bedrooms,
            request.Bathrooms,
            request.Parking,
            request.Area);
        unitOfWork.Properties.Update(entity);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return Map(entity);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var entity = await unitOfWork.Properties.GetByIdAsync(id, cancellationToken);
        if (entity is null)
        {
            return false;
        }

        unitOfWork.Properties.Remove(entity);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return true;
    }

    private static PropertyResponse Map(Property entity)
    {
        return new PropertyResponse(
            entity.Id,
            entity.Title,
            EnumTextMapper.ToText(entity.Type),
            entity.Address,
            entity.Price,
            entity.RentPrice,
            EnumTextMapper.ToText(entity.Status),
            entity.Image,
            entity.Description,
            new FeatureResponse(entity.Bedrooms, entity.Bathrooms, entity.Parking, entity.Area),
            entity.CreatedAt,
            entity.UpdatedAt);
    }
}
