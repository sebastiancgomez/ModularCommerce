using ModularCommerce.Application.DTOs;

namespace ModularCommerce.Application.Services;

public interface IAuthService
{
    Task<string> Login(LoginDto dto);
}
