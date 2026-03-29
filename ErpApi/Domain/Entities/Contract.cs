using ErpApi.Domain.Common;
using ErpApi.Domain.Enums;

namespace ErpApi.Domain.Entities;

public class Contract : BaseEntity
{
    public ContractType Type { get; private set; }
    public Guid PropertyId { get; private set; }
    public Guid ClientId { get; private set; }
    public decimal Value { get; private set; }
    public ContractStatus Status { get; private set; }
    public DateTime StartDate { get; private set; }
    public DateTime EndDate { get; private set; }
    public DateTime? SignedAt { get; private set; }

    public Property? Property { get; private set; }
    public Client? Client { get; private set; }

    private Contract()
    {
    }

    public Contract(ContractType type, Guid propertyId, Guid clientId, decimal value, ContractStatus status, DateTime startDate, DateTime endDate, DateTime? signedAt)
    {
        SetData(type, propertyId, clientId, value, status, startDate, endDate, signedAt);
    }

    public void Update(ContractType type, Guid propertyId, Guid clientId, decimal value, ContractStatus status, DateTime startDate, DateTime endDate, DateTime? signedAt)
    {
        SetData(type, propertyId, clientId, value, status, startDate, endDate, signedAt);
        Touch();
    }

    private void SetData(ContractType type, Guid propertyId, Guid clientId, decimal value, ContractStatus status, DateTime startDate, DateTime endDate, DateTime? signedAt)
    {
        if (propertyId == Guid.Empty || clientId == Guid.Empty)
        {
            throw new DomainValidationException("Cliente e imóvel do contrato são obrigatórios.");
        }

        if (value <= 0)
        {
            throw new DomainValidationException("Valor do contrato deve ser maior que zero.");
        }

        if (endDate <= startDate)
        {
            throw new DomainValidationException("Data final deve ser maior que a data inicial.");
        }

        Type = type;
        PropertyId = propertyId;
        ClientId = clientId;
        Value = value;
        Status = status;
        StartDate = startDate;
        EndDate = endDate;
        SignedAt = signedAt;
    }
}
