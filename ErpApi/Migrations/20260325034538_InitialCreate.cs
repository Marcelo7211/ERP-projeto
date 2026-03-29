using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ErpApi.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Clients",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(160)", maxLength: 160, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(160)", maxLength: 160, nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    InterestPropertyType = table.Column<int>(type: "int", nullable: true),
                    InterestMaxPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Clients", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CompanySettings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CompanyName = table.Column<string>(type: "nvarchar(180)", maxLength: 180, nullable: false),
                    PrimaryColor = table.Column<string>(type: "nvarchar(7)", maxLength: 7, nullable: false),
                    LogoUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CompanySettings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Properties",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    Address = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    RentPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Image = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    Bedrooms = table.Column<int>(type: "int", nullable: false),
                    Bathrooms = table.Column<int>(type: "int", nullable: false),
                    Parking = table.Column<int>(type: "int", nullable: false),
                    Area = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Properties", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(160)", maxLength: 160, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(160)", maxLength: 160, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Role = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Contracts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    PropertyId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ClientId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Value = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    SignedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Contracts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Contracts_Clients_ClientId",
                        column: x => x.ClientId,
                        principalTable: "Clients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Contracts_Properties_PropertyId",
                        column: x => x.PropertyId,
                        principalTable: "Properties",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PipelineDeals",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    ClientId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PropertyId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Value = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Stage = table.Column<int>(type: "int", nullable: false),
                    LastInteractionAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PipelineDeals", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PipelineDeals_Clients_ClientId",
                        column: x => x.ClientId,
                        principalTable: "Clients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PipelineDeals_Properties_PropertyId",
                        column: x => x.PropertyId,
                        principalTable: "Properties",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Clients_Email",
                table: "Clients",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Contracts_ClientId",
                table: "Contracts",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_Contracts_PropertyId",
                table: "Contracts",
                column: "PropertyId");

            migrationBuilder.CreateIndex(
                name: "IX_PipelineDeals_ClientId",
                table: "PipelineDeals",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_PipelineDeals_PropertyId",
                table: "PipelineDeals",
                column: "PropertyId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.Sql("""
                DECLARE @baseDate DATETIME2 = '2026-01-01T08:00:00';
                DECLARE @i INT = 1;

                WHILE @i <= 20
                BEGIN
                    INSERT INTO [Clients] ([Id], [Name], [Email], [Phone], [Type], [InterestPropertyType], [InterestMaxPrice], [CreatedAt], [UpdatedAt])
                    VALUES (
                        NEWID(),
                        CONCAT(N'Cliente ', FORMAT(@i, '00')),
                        CONCAT(N'cliente', @i, N'@imobiliariapro.com.br'),
                        CONCAT(N'(11) 98', RIGHT(CONCAT('000000', @i), 6)),
                        ((@i - 1) % 5) + 1,
                        ((@i - 1) % 5) + 1,
                        200000 + (@i * 15000),
                        DATEADD(DAY, -@i, @baseDate),
                        NULL
                    );
                    SET @i = @i + 1;
                END;

                SET @i = 1;
                WHILE @i <= 20
                BEGIN
                    INSERT INTO [Properties] ([Id], [Title], [Type], [Address], [Price], [RentPrice], [Status], [Image], [Description], [Bedrooms], [Bathrooms], [Parking], [Area], [CreatedAt], [UpdatedAt])
                    VALUES (
                        NEWID(),
                        CONCAT(N'Imóvel ', FORMAT(@i, '00')),
                        ((@i - 1) % 5) + 1,
                        CONCAT(N'Rua ', @i, N', Bairro Central'),
                        250000 + (@i * 20000),
                        1200 + (@i * 120),
                        ((@i - 1) % 4) + 1,
                        N'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
                        CONCAT(N'Imóvel de demonstração ', @i),
                        ((@i - 1) % 4) + 1,
                        ((@i - 1) % 3) + 1,
                        ((@i - 1) % 2) + 1,
                        70 + (@i * 6),
                        DATEADD(DAY, -@i, @baseDate),
                        NULL
                    );
                    SET @i = @i + 1;
                END;

                SET @i = 1;
                WHILE @i <= 20
                BEGIN
                    INSERT INTO [Users] ([Id], [Name], [Email], [PasswordHash], [Role], [IsActive], [CreatedAt], [UpdatedAt])
                    VALUES (
                        NEWID(),
                        CONCAT(N'Usuário ', FORMAT(@i, '00')),
                        CONCAT(N'usuario', @i, N'@imobiliariapro.com.br'),
                        N'AQIDBAUGBwgJCgsMDQ4PEA==.WRG/UtQxtS+ciEKwgD1fn9XCDbelJWM/JTpwKmdRcmI=',
                        N'Admin',
                        1,
                        DATEADD(DAY, -@i, @baseDate),
                        NULL
                    );
                    SET @i = @i + 1;
                END;

                SET @i = 1;
                WHILE @i <= 20
                BEGIN
                    INSERT INTO [CompanySettings] ([Id], [CompanyName], [PrimaryColor], [LogoUrl], [IsActive], [CreatedAt], [UpdatedAt])
                    VALUES (
                        NEWID(),
                        CONCAT(N'Imobiliária Pro ', FORMAT(@i, '00')),
                        CASE (@i % 4)
                            WHEN 1 THEN N'#2563EB'
                            WHEN 2 THEN N'#16A34A'
                            WHEN 3 THEN N'#DC2626'
                            ELSE N'#7C3AED'
                        END,
                        N'https://dummyimage.com/200x80/0f172a/ffffff&text=Imobiliaria+Pro',
                        CASE WHEN @i = 1 THEN 1 ELSE 0 END,
                        DATEADD(DAY, -@i, @baseDate),
                        NULL
                    );
                    SET @i = @i + 1;
                END;

                ;WITH RankedClients AS (
                    SELECT [Id], ROW_NUMBER() OVER (ORDER BY [CreatedAt], [Id]) AS rn
                    FROM [Clients]
                ),
                RankedProperties AS (
                    SELECT [Id], ROW_NUMBER() OVER (ORDER BY [CreatedAt], [Id]) AS rn
                    FROM [Properties]
                ),
                Pairs AS (
                    SELECT c.[Id] AS ClientId, p.[Id] AS PropertyId, c.rn
                    FROM RankedClients c
                    INNER JOIN RankedProperties p ON c.rn = p.rn
                    WHERE c.rn <= 20
                )
                INSERT INTO [Contracts] ([Id], [Type], [PropertyId], [ClientId], [Value], [Status], [StartDate], [EndDate], [SignedAt], [CreatedAt], [UpdatedAt])
                SELECT
                    NEWID(),
                    CASE WHEN rn % 2 = 0 THEN 2 ELSE 1 END,
                    PropertyId,
                    ClientId,
                    180000 + (rn * 12000),
                    CASE ((rn - 1) % 4)
                        WHEN 0 THEN 1
                        WHEN 1 THEN 2
                        WHEN 2 THEN 3
                        ELSE 4
                    END,
                    DATEADD(DAY, -rn, @baseDate),
                    DATEADD(MONTH, 12 + rn, DATEADD(DAY, -rn, @baseDate)),
                    CASE WHEN rn % 3 = 0 THEN NULL ELSE DATEADD(DAY, -rn + 2, @baseDate) END,
                    DATEADD(DAY, -rn, @baseDate),
                    NULL
                FROM Pairs;

                ;WITH RankedClients AS (
                    SELECT [Id], ROW_NUMBER() OVER (ORDER BY [CreatedAt], [Id]) AS rn
                    FROM [Clients]
                ),
                RankedProperties AS (
                    SELECT [Id], ROW_NUMBER() OVER (ORDER BY [CreatedAt], [Id]) AS rn
                    FROM [Properties]
                ),
                Pairs AS (
                    SELECT c.[Id] AS ClientId, p.[Id] AS PropertyId, c.rn
                    FROM RankedClients c
                    INNER JOIN RankedProperties p ON c.rn = p.rn
                    WHERE c.rn <= 20
                )
                INSERT INTO [PipelineDeals] ([Id], [Title], [ClientId], [PropertyId], [Value], [Stage], [LastInteractionAt], [CreatedAt], [UpdatedAt])
                SELECT
                    NEWID(),
                    CONCAT(N'Negócio ', FORMAT(rn, '00')),
                    ClientId,
                    PropertyId,
                    190000 + (rn * 10000),
                    CASE ((rn - 1) % 4)
                        WHEN 0 THEN 1
                        WHEN 1 THEN 2
                        WHEN 2 THEN 3
                        ELSE 4
                    END,
                    DATEADD(DAY, -rn + 1, @baseDate),
                    DATEADD(DAY, -rn, @baseDate),
                    NULL
                FROM Pairs;
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CompanySettings");

            migrationBuilder.DropTable(
                name: "Contracts");

            migrationBuilder.DropTable(
                name: "PipelineDeals");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Clients");

            migrationBuilder.DropTable(
                name: "Properties");
        }
    }
}
