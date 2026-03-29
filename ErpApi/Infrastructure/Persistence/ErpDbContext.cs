using ErpApi.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ErpApi.Infrastructure.Persistence;

public class ErpDbContext(DbContextOptions<ErpDbContext> options) : DbContext(options)
{
    public DbSet<Client> Clients => Set<Client>();
    public DbSet<Property> Properties => Set<Property>();
    public DbSet<Contract> Contracts => Set<Contract>();
    public DbSet<PipelineDeal> PipelineDeals => Set<PipelineDeal>();
    public DbSet<CompanySetting> CompanySettings => Set<CompanySetting>();
    public DbSet<AppUser> Users => Set<AppUser>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Client>(builder =>
        {
            builder.ToTable("Clients");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Name).HasMaxLength(160).IsRequired();
            builder.Property(x => x.Email).HasMaxLength(160).IsRequired();
            builder.Property(x => x.Phone).HasMaxLength(40).IsRequired();
            builder.Property(x => x.InterestMaxPrice).HasColumnType("decimal(18,2)");
            builder.HasIndex(x => x.Email).IsUnique();
        });

        modelBuilder.Entity<Property>(builder =>
        {
            builder.ToTable("Properties");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Title).HasMaxLength(200).IsRequired();
            builder.Property(x => x.Address).HasMaxLength(255).IsRequired();
            builder.Property(x => x.Image).HasMaxLength(500).IsRequired();
            builder.Property(x => x.Description).HasMaxLength(2000);
            builder.Property(x => x.Price).HasColumnType("decimal(18,2)");
            builder.Property(x => x.RentPrice).HasColumnType("decimal(18,2)");
            builder.Property(x => x.Area).HasColumnType("decimal(18,2)");
        });

        modelBuilder.Entity<Contract>(builder =>
        {
            builder.ToTable("Contracts");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Value).HasColumnType("decimal(18,2)");
            builder.HasOne(x => x.Client)
                .WithMany(x => x.Contracts)
                .HasForeignKey(x => x.ClientId)
                .OnDelete(DeleteBehavior.Restrict);
            builder.HasOne(x => x.Property)
                .WithMany(x => x.Contracts)
                .HasForeignKey(x => x.PropertyId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<PipelineDeal>(builder =>
        {
            builder.ToTable("PipelineDeals");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Title).HasMaxLength(200).IsRequired();
            builder.Property(x => x.Value).HasColumnType("decimal(18,2)");
            builder.HasOne(x => x.Client)
                .WithMany(x => x.PipelineDeals)
                .HasForeignKey(x => x.ClientId)
                .OnDelete(DeleteBehavior.Restrict);
            builder.HasOne(x => x.Property)
                .WithMany(x => x.PipelineDeals)
                .HasForeignKey(x => x.PropertyId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<CompanySetting>(builder =>
        {
            builder.ToTable("CompanySettings");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.CompanyName).HasMaxLength(180).IsRequired();
            builder.Property(x => x.PrimaryColor).HasMaxLength(7).IsRequired();
            builder.Property(x => x.LogoUrl).HasMaxLength(500);
        });

        modelBuilder.Entity<AppUser>(builder =>
        {
            builder.ToTable("Users");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Name).HasMaxLength(160).IsRequired();
            builder.Property(x => x.Email).HasMaxLength(160).IsRequired();
            builder.Property(x => x.PasswordHash).HasMaxLength(500).IsRequired();
            builder.Property(x => x.Role).HasMaxLength(50).IsRequired();
            builder.HasIndex(x => x.Email).IsUnique();
        });
    }
}
