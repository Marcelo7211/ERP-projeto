using ErpApi.Application.Interfaces;
using ErpApi.Application.Models;
using ErpApi.Domain.Entities;

namespace ErpApi.Application.Services;

public class AuthService(IUnitOfWork unitOfWork, IPasswordHasher passwordHasher, IJwtTokenService jwtTokenService) : IAuthService
{
    public async Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken)
    {
        var existing = await unitOfWork.Users.ListAsync(
            filter: x => x.Email == request.Email.Trim().ToLower(),
            take: 1,
            cancellationToken: cancellationToken);

        if (existing.Count > 0)
        {
            throw new InvalidOperationException("Usuário já cadastrado para este email.");
        }

        var user = new AppUser(
            request.Name,
            request.Email,
            passwordHasher.Hash(request.Password),
            "Admin",
            true);

        await unitOfWork.Users.AddAsync(user, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        var token = jwtTokenService.GenerateToken(user);
        return new AuthResponse(token, DateTime.UtcNow.AddMinutes(120), user.Name, user.Email, user.Role);
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken)
    {
        var users = await unitOfWork.Users.ListAsync(
            filter: x => x.Email == request.Email.Trim().ToLower(),
            take: 1,
            asNoTracking: false,
            cancellationToken: cancellationToken);

        var user = users.FirstOrDefault();
        if (user is null || !user.IsActive || !passwordHasher.Verify(request.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Credenciais inválidas.");
        }

        var token = jwtTokenService.GenerateToken(user);
        return new AuthResponse(token, DateTime.UtcNow.AddMinutes(120), user.Name, user.Email, user.Role);
    }
}
