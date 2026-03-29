using ErpApi.Domain.Common;

namespace ErpApi.Domain.Entities;

public class AppUser : BaseEntity
{
    public string Name { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string PasswordHash { get; private set; } = string.Empty;
    public string Role { get; private set; } = "Admin";
    public bool IsActive { get; private set; } = true;

    private AppUser()
    {
    }

    public AppUser(string name, string email, string passwordHash, string role, bool isActive)
    {
        SetData(name, email, passwordHash, role, isActive);
    }

    public void Update(string name, string email, string role, bool isActive)
    {
        SetData(name, email, PasswordHash, role, isActive);
        Touch();
    }

    public void UpdatePasswordHash(string passwordHash)
    {
        if (string.IsNullOrWhiteSpace(passwordHash))
        {
            throw new DomainValidationException("Hash de senha inválido.");
        }

        PasswordHash = passwordHash;
        Touch();
    }

    private void SetData(string name, string email, string passwordHash, string role, bool isActive)
    {
        if (string.IsNullOrWhiteSpace(name) || name.Trim().Length < 3)
        {
            throw new DomainValidationException("Nome do usuário inválido.");
        }

        if (string.IsNullOrWhiteSpace(email) || !email.Contains('@'))
        {
            throw new DomainValidationException("Email do usuário inválido.");
        }

        if (string.IsNullOrWhiteSpace(passwordHash))
        {
            throw new DomainValidationException("Hash de senha inválido.");
        }

        Name = name.Trim();
        Email = email.Trim().ToLowerInvariant();
        PasswordHash = passwordHash;
        Role = string.IsNullOrWhiteSpace(role) ? "Admin" : role.Trim();
        IsActive = isActive;
    }
}
