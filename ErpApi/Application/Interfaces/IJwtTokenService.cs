using ErpApi.Domain.Entities;

namespace ErpApi.Application.Interfaces;

public interface IJwtTokenService
{
    string GenerateToken(AppUser user);
}
