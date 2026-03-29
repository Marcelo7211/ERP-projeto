using ErpApi.Domain.Common;
using ErpApi.Domain.Enums;

namespace ErpApi.Domain.Entities;

public class PipelineDeal : BaseEntity
{
    public string Title { get; private set; } = string.Empty;
    public Guid ClientId { get; private set; }
    public Guid PropertyId { get; private set; }
    public decimal Value { get; private set; }
    public PipelineStage Stage { get; private set; }
    public DateTime LastInteractionAt { get; private set; }

    public Client? Client { get; private set; }
    public Property? Property { get; private set; }

    private PipelineDeal()
    {
    }

    public PipelineDeal(string title, Guid clientId, Guid propertyId, decimal value, PipelineStage stage, DateTime lastInteractionAt)
    {
        SetData(title, clientId, propertyId, value, stage, lastInteractionAt);
    }

    public void Update(string title, Guid clientId, Guid propertyId, decimal value, PipelineStage stage, DateTime lastInteractionAt)
    {
        SetData(title, clientId, propertyId, value, stage, lastInteractionAt);
        Touch();
    }

    private void SetData(string title, Guid clientId, Guid propertyId, decimal value, PipelineStage stage, DateTime lastInteractionAt)
    {
        if (string.IsNullOrWhiteSpace(title) || title.Trim().Length < 3)
        {
            throw new DomainValidationException("Título da negociação inválido.");
        }

        if (clientId == Guid.Empty || propertyId == Guid.Empty)
        {
            throw new DomainValidationException("Cliente e imóvel são obrigatórios para a negociação.");
        }

        if (value <= 0)
        {
            throw new DomainValidationException("Valor da negociação deve ser maior que zero.");
        }

        Title = title.Trim();
        ClientId = clientId;
        PropertyId = propertyId;
        Value = value;
        Stage = stage;
        LastInteractionAt = lastInteractionAt;
    }
}
