using ErpApi.Domain.Entities;
using ErpApi.Domain.Enums;
using ErpApi.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ErpApi.Infrastructure.Persistence;

public static class DbSeeder
{
    private const int TargetCountPerTable = 20;

    public static async Task SeedAsync(ErpDbContext dbContext, IPasswordHasher passwordHasher, CancellationToken cancellationToken = default)
    {
        await dbContext.Database.EnsureCreatedAsync(cancellationToken);

        var clientsCount = await dbContext.Clients.CountAsync(cancellationToken);
        if (clientsCount < TargetCountPerTable)
        {
            var clientsToAdd = BuildClients(clientsCount, TargetCountPerTable - clientsCount);
            await dbContext.Clients.AddRangeAsync(clientsToAdd, cancellationToken);
        }

        var propertiesCount = await dbContext.Properties.CountAsync(cancellationToken);
        if (propertiesCount < TargetCountPerTable)
        {
            var propertiesToAdd = BuildProperties(propertiesCount, TargetCountPerTable - propertiesCount);
            await dbContext.Properties.AddRangeAsync(propertiesToAdd, cancellationToken);
        }

        var usersCount = await dbContext.Users.CountAsync(cancellationToken);
        if (usersCount < TargetCountPerTable)
        {
            var usersToAdd = BuildUsers(usersCount, TargetCountPerTable - usersCount, passwordHasher);
            await dbContext.Users.AddRangeAsync(usersToAdd, cancellationToken);
        }

        var settingsCount = await dbContext.CompanySettings.CountAsync(cancellationToken);
        if (settingsCount < TargetCountPerTable)
        {
            var settingsToAdd = BuildCompanySettings(settingsCount, TargetCountPerTable - settingsCount);
            await dbContext.CompanySettings.AddRangeAsync(settingsToAdd, cancellationToken);
        }

        if (dbContext.ChangeTracker.HasChanges())
        {
            await dbContext.SaveChangesAsync(cancellationToken);
        }

        var clients = await dbContext.Clients
            .OrderBy(x => x.CreatedAt)
            .ThenBy(x => x.Id)
            .Take(TargetCountPerTable)
            .ToListAsync(cancellationToken);

        var properties = await dbContext.Properties
            .OrderBy(x => x.CreatedAt)
            .ThenBy(x => x.Id)
            .Take(TargetCountPerTable)
            .ToListAsync(cancellationToken);

        var contractsCount = await dbContext.Contracts.CountAsync(cancellationToken);
        if (contractsCount < TargetCountPerTable)
        {
            var contractsToAdd = BuildContracts(clients, properties, contractsCount, TargetCountPerTable - contractsCount);
            await dbContext.Contracts.AddRangeAsync(contractsToAdd, cancellationToken);
        }

        var pipelineDealsCount = await dbContext.PipelineDeals.CountAsync(cancellationToken);
        if (pipelineDealsCount < TargetCountPerTable)
        {
            var pipelineDealsToAdd = BuildPipelineDeals(clients, properties, pipelineDealsCount, TargetCountPerTable - pipelineDealsCount);
            await dbContext.PipelineDeals.AddRangeAsync(pipelineDealsToAdd, cancellationToken);
        }

        if (dbContext.ChangeTracker.HasChanges())
        {
            await dbContext.SaveChangesAsync(cancellationToken);
        }
    }

    private static List<Client> BuildClients(int startIndex, int count)
    {
        if (count <= 0)
        {
            return new List<Client>();
        }

        var names = new[]
        {
            "Ana Paula Gomes","Bruno Henrique Souza","Carla Mendes Lima","Daniel Ribeiro Costa","Eduarda Nunes Martins",
            "Felipe Araujo Castro","Gabriela Rocha Silva","Henrique Barbosa Dias","Isabela Teixeira Alves","João Pedro Cunha",
            "Karina Duarte Melo","Lucas Viana Freitas","Marina Cardoso Ramos","Nicolas Pires Andrade","Olivia Fernandes Prado",
            "Paulo Cesar Moreira","Queila Santana Oliveira","Rafael Pinto Borges","Sabrina Farias Monteiro","Thiago Lemos Vieira"
        };

        var result = new List<Client>(count);
        for (var i = 0; i < count; i++)
        {
            var index = startIndex + i;
            var type = (ClientType)((index % 5) + 1);
            var interestType = (PropertyType)((index % 5) + 1);
            var name = index < names.Length ? names[index] : $"Cliente {index + 1}";
            result.Add(new Client(
                name,
                $"cliente{index + 1}@imobiliariapro.com.br",
                $"1199{(100000 + index):D6}",
                type,
                interestType,
                250000 + (index * 35000)));
        }

        return result;
    }

    private static List<Property> BuildProperties(int startIndex, int count)
    {
        if (count <= 0)
        {
            return new List<Property>();
        }

        var result = new List<Property>(count);
        var bairros = new[]
        {
            "Jardins","Moema","Pinheiros","Vila Mariana","Perdizes",
            "Tatuapé","Santana","Brooklin","Itaim Bibi","Vila Madalena",
            "Aclimação","Saúde","Morumbi","Butantã","Lapa",
            "Ipiranga","Campo Belo","Vila Olímpia","Consolação","Bela Vista"
        };

        for (var i = 0; i < count; i++)
        {
            var index = startIndex + i;
            var bairro = index < bairros.Length ? bairros[index] : $"Bairro {index + 1}";
            var type = (PropertyType)((index % 5) + 1);
            var status = (PropertyStatus)((index % 4) + 1);
            result.Add(new Property(
                $"Imóvel {index + 1} - {bairro}",
                type,
                $"Rua {bairro}, {100 + index}, São Paulo - SP",
                350000 + (index * 50000),
                2200 + (index * 250),
                status,
                $"https://images.imobiliariapro.com/imoveis/{index + 1}.jpg",
                $"Imóvel localizado em {bairro} com ótima infraestrutura.",
                1 + (index % 4),
                1 + (index % 3),
                index % 3,
                45 + (index * 4)));
        }

        return result;
    }

    private static List<AppUser> BuildUsers(int startIndex, int count, IPasswordHasher passwordHasher)
    {
        if (count <= 0)
        {
            return new List<AppUser>();
        }

        var result = new List<AppUser>(count);
        for (var i = 0; i < count; i++)
        {
            var index = startIndex + i;
            var role = index < 4 ? "Admin" : "Agent";
            result.Add(new AppUser(
                $"Usuário {index + 1}",
                $"usuario{index + 1}@imobiliariapro.com.br",
                passwordHasher.Hash("Senha@123"),
                role,
                true));
        }

        return result;
    }

    private static List<CompanySetting> BuildCompanySettings(int startIndex, int count)
    {
        if (count <= 0)
        {
            return new List<CompanySetting>();
        }

        var colors = new[]
        {
            "#0F172A","#1D4ED8","#0EA5E9","#334155","#7C3AED",
            "#BE123C","#0F766E","#14532D","#78350F","#1F2937",
            "#111827","#0369A1","#1E40AF","#065F46","#9A3412",
            "#3F3F46","#4C1D95","#9F1239","#0C4A6E","#374151"
        };

        var result = new List<CompanySetting>(count);
        for (var i = 0; i < count; i++)
        {
            var index = startIndex + i;
            var color = index < colors.Length ? colors[index] : colors[index % colors.Length];
            result.Add(new CompanySetting(
                $"Imobiliária Pro {index + 1}",
                color,
                $"https://cdn.imobiliariapro.com/logo-{index + 1}.png",
                startIndex == 0 && i == 0));
        }

        return result;
    }

    private static List<Contract> BuildContracts(IReadOnlyList<Client> clients, IReadOnlyList<Property> properties, int startIndex, int count)
    {
        if (count <= 0 || clients.Count == 0 || properties.Count == 0)
        {
            return new List<Contract>();
        }

        var result = new List<Contract>(count);
        for (var i = 0; i < count; i++)
        {
            var index = startIndex + i;
            var client = clients[index % clients.Count];
            var property = properties[index % properties.Count];
            var contractType = index % 2 == 0 ? ContractType.Sale : ContractType.Rent;
            var status = (ContractStatus)((index % 4) + 1);
            var startDate = DateTime.UtcNow.Date.AddDays(-(30 + (index * 4)));
            var endDate = startDate.AddMonths(12);
            DateTime? signedAt = status is ContractStatus.Active or ContractStatus.Finalized ? startDate.AddDays(2) : null;

            result.Add(new Contract(
                contractType,
                property.Id,
                client.Id,
                contractType == ContractType.Sale ? property.Price : property.RentPrice * 12,
                status,
                startDate,
                endDate,
                signedAt));
        }

        return result;
    }

    private static List<PipelineDeal> BuildPipelineDeals(IReadOnlyList<Client> clients, IReadOnlyList<Property> properties, int startIndex, int count)
    {
        if (count <= 0 || clients.Count == 0 || properties.Count == 0)
        {
            return new List<PipelineDeal>();
        }

        var result = new List<PipelineDeal>(count);
        for (var i = 0; i < count; i++)
        {
            var index = startIndex + i;
            var client = clients[index % clients.Count];
            var property = properties[index % properties.Count];
            var stage = (PipelineStage)((index % 4) + 1);
            result.Add(new PipelineDeal(
                $"Negociação {index + 1}",
                client.Id,
                property.Id,
                property.Price,
                stage,
                DateTime.UtcNow.AddDays(-index)));
        }

        return result;
    }
}
