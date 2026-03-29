using ErpApi.Domain.Enums;
using System.Text;

namespace ErpApi.Application.Common;

public static class EnumTextMapper
{
    public static string ToText(ClientType value) => value switch
    {
        ClientType.Buyer => "Comprador",
        ClientType.Seller => "Vendedor",
        ClientType.Tenant => "Locatário",
        ClientType.Landlord => "Locador",
        ClientType.Investor => "Investidor",
        _ => "Comprador"
    };

    public static ClientType ToClientType(string value) => Normalize(value) switch
    {
        "comprador" => ClientType.Buyer,
        "vendedor" => ClientType.Seller,
        "tenant" => ClientType.Tenant,
        "seller" => ClientType.Seller,
        "buyer" => ClientType.Buyer,
        "landlord" => ClientType.Landlord,
        "investor" => ClientType.Investor,
        "locatario" => ClientType.Tenant,
        "locatário" => ClientType.Tenant,
        "locador" => ClientType.Landlord,
        "investidor" => ClientType.Investor,
        _ => throw new ArgumentException("Tipo de cliente inválido.")
    };

    public static string ToText(PropertyType value) => value switch
    {
        PropertyType.House => "Casa",
        PropertyType.Apartment => "Apartamento",
        PropertyType.Commercial => "Comercial",
        PropertyType.Land => "Terreno",
        PropertyType.Penthouse => "Cobertura",
        _ => "Casa"
    };

    public static PropertyType ToPropertyType(string value) => Normalize(value) switch
    {
        "casa" => PropertyType.House,
        "apartamento" => PropertyType.Apartment,
        "comercial" => PropertyType.Commercial,
        "terreno" => PropertyType.Land,
        "cobertura" => PropertyType.Penthouse,
        "house" => PropertyType.House,
        "apartment" => PropertyType.Apartment,
        "commercial" => PropertyType.Commercial,
        "land" => PropertyType.Land,
        "penthouse" => PropertyType.Penthouse,
        _ => throw new ArgumentException("Tipo de imóvel inválido.")
    };

    public static string ToText(PropertyStatus value) => value switch
    {
        PropertyStatus.Available => "Disponível",
        PropertyStatus.Sold => "Vendido",
        PropertyStatus.Rented => "Alugado",
        PropertyStatus.Negotiating => "Em Negociação",
        _ => "Disponível"
    };

    public static PropertyStatus ToPropertyStatus(string value) => Normalize(value) switch
    {
        "disponivel" => PropertyStatus.Available,
        "disponível" => PropertyStatus.Available,
        "vendido" => PropertyStatus.Sold,
        "alugado" => PropertyStatus.Rented,
        "available" => PropertyStatus.Available,
        "sold" => PropertyStatus.Sold,
        "rented" => PropertyStatus.Rented,
        "em negociacao" => PropertyStatus.Negotiating,
        "em negociação" => PropertyStatus.Negotiating,
        "negotiating" => PropertyStatus.Negotiating,
        _ => throw new ArgumentException("Status do imóvel inválido.")
    };

    public static string ToText(ContractType value) => value switch
    {
        ContractType.Sale => "Venda",
        ContractType.Rent => "Aluguel",
        _ => "Venda"
    };

    public static ContractType ToContractType(string value) => Normalize(value) switch
    {
        "venda" => ContractType.Sale,
        "aluguel" => ContractType.Rent,
        "sale" => ContractType.Sale,
        "rent" => ContractType.Rent,
        _ => throw new ArgumentException("Tipo de contrato inválido.")
    };

    public static string ToText(ContractStatus value) => value switch
    {
        ContractStatus.PendingSignature => "Pendente Assinatura",
        ContractStatus.Active => "Ativo",
        ContractStatus.Finalized => "Finalizado",
        ContractStatus.Cancelled => "Cancelado",
        _ => "Pendente Assinatura"
    };

    public static ContractStatus ToContractStatus(string value) => Normalize(value) switch
    {
        "pendente assinatura" => ContractStatus.PendingSignature,
        "ativo" => ContractStatus.Active,
        "finalizado" => ContractStatus.Finalized,
        "cancelado" => ContractStatus.Cancelled,
        "pending signature" => ContractStatus.PendingSignature,
        "active" => ContractStatus.Active,
        "finalized" => ContractStatus.Finalized,
        "cancelled" => ContractStatus.Cancelled,
        _ => throw new ArgumentException("Status do contrato inválido.")
    };

    public static string ToText(PipelineStage value) => value switch
    {
        PipelineStage.Leads => "leads",
        PipelineStage.Visits => "visitas",
        PipelineStage.Proposals => "propostas",
        PipelineStage.Closing => "fechamento",
        _ => "leads"
    };

    public static PipelineStage ToPipelineStage(string value) => Normalize(value) switch
    {
        "leads" => PipelineStage.Leads,
        "visitas" => PipelineStage.Visits,
        "propostas" => PipelineStage.Proposals,
        "fechamento" => PipelineStage.Closing,
        "visits" => PipelineStage.Visits,
        "proposals" => PipelineStage.Proposals,
        "closing" => PipelineStage.Closing,
        _ => throw new ArgumentException("Etapa do pipeline inválida.")
    };

    private static string Normalize(string value)
    {
        var normalized = value.Trim().ToLowerInvariant().Normalize(NormalizationForm.FormD);
        var builder = new StringBuilder(normalized.Length);
        foreach (var c in normalized)
        {
            if (System.Globalization.CharUnicodeInfo.GetUnicodeCategory(c) != System.Globalization.UnicodeCategory.NonSpacingMark)
            {
                builder.Append(c);
            }
        }

        return builder.ToString().Normalize(NormalizationForm.FormC);
    }
}
