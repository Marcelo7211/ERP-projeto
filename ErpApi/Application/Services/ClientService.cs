using ErpApi.Application.Common;
using ErpApi.Application.Interfaces;
using ErpApi.Application.Models;
using ErpApi.Domain.Entities;
using ErpApi.Domain.Enums;

namespace ErpApi.Application.Services;

public class ClientService(IUnitOfWork unitOfWork) : IClientService
{
    public async Task<PagedResult<ClientResponse>> GetPagedAsync(ClientQueryParameters query, CancellationToken cancellationToken)
    {
        var (page, pageSize, skip) = PaginationHelper.Normalize(query.Page, query.PageSize);
        var search = query.Search?.ToLower() ?? string.Empty;
        var parsedType = string.IsNullOrWhiteSpace(query.Type) ? (ClientType?)null : EnumTextMapper.ToClientType(query.Type);
        var parsedPropertyType = string.IsNullOrWhiteSpace(query.PropertyType) ? (PropertyType?)null : EnumTextMapper.ToPropertyType(query.PropertyType);

        var items = await unitOfWork.Clients.ListAsync(
            filter: c =>
                (string.IsNullOrWhiteSpace(search) || c.Name.ToLower().Contains(search) || c.Email.ToLower().Contains(search)) &&
                (!parsedType.HasValue || c.Type == parsedType) &&
                (!parsedPropertyType.HasValue || c.InterestPropertyType == parsedPropertyType),
            orderBy: q => (query.OrderBy ?? "createdAt:desc").ToLower() switch
            {
                "name:asc" => q.OrderBy(x => x.Name),
                "name:desc" => q.OrderByDescending(x => x.Name),
                "email:asc" => q.OrderBy(x => x.Email),
                "email:desc" => q.OrderByDescending(x => x.Email),
                "createdat:asc" => q.OrderBy(x => x.CreatedAt),
                _ => q.OrderByDescending(x => x.CreatedAt)
            },
            skip: skip,
            take: pageSize,
            cancellationToken: cancellationToken);

        var total = await unitOfWork.Clients.CountAsync(
            c =>
                (string.IsNullOrWhiteSpace(search) || c.Name.ToLower().Contains(search) || c.Email.ToLower().Contains(search)) &&
                (!parsedType.HasValue || c.Type == parsedType) &&
                (!parsedPropertyType.HasValue || c.InterestPropertyType == parsedPropertyType),
            cancellationToken);

        return PaginationHelper.Build(items.Select(Map).ToList(), total, page, pageSize);
    }

    public async Task<ClientResponse?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var entity = await unitOfWork.Clients.GetByIdAsync(id, cancellationToken);
        return entity is null ? null : Map(entity);
    }

    public async Task<ClientResponse> CreateAsync(ClientRequest request, CancellationToken cancellationToken)
    {
        var interestType = string.IsNullOrWhiteSpace(request.InterestPropertyType) ? (PropertyType?)null : EnumTextMapper.ToPropertyType(request.InterestPropertyType);
        var entity = new Client(request.Name, request.Email, request.Phone, EnumTextMapper.ToClientType(request.Type), interestType, request.InterestMaxPrice);
        await unitOfWork.Clients.AddAsync(entity, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return Map(entity);
    }

    public async Task<ClientResponse?> UpdateAsync(Guid id, ClientRequest request, CancellationToken cancellationToken)
    {
        var entity = await unitOfWork.Clients.GetByIdAsync(id, cancellationToken);
        if (entity is null)
        {
            return null;
        }

        var interestType = string.IsNullOrWhiteSpace(request.InterestPropertyType) ? (PropertyType?)null : EnumTextMapper.ToPropertyType(request.InterestPropertyType);
        entity.Update(request.Name, request.Email, request.Phone, EnumTextMapper.ToClientType(request.Type), interestType, request.InterestMaxPrice);
        unitOfWork.Clients.Update(entity);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return Map(entity);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var entity = await unitOfWork.Clients.GetByIdAsync(id, cancellationToken);
        if (entity is null)
        {
            return false;
        }

        unitOfWork.Clients.Remove(entity);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        return true;
    }

    private static ClientResponse Map(Client entity)
    {
        var interest = entity.InterestPropertyType.HasValue && entity.InterestMaxPrice.HasValue
            ? new InterestResponse(EnumTextMapper.ToText(entity.InterestPropertyType.Value), entity.InterestMaxPrice.Value)
            : null;

        return new ClientResponse(entity.Id, entity.Name, entity.Email, entity.Phone, EnumTextMapper.ToText(entity.Type), interest, entity.CreatedAt, entity.UpdatedAt);
    }
}
