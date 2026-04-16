using ModularCommerce.Application.DTOs;
using ModularCommerce.Infrastructure.Persistence;
using ModularCommerce.Application.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ModularCommerce.Domain.Exceptions;

namespace ModularCommerce.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly ITokenService _tokenService;
    private readonly PasswordHasher<User> _hasher = new();

    public AuthService(AppDbContext context, ITokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    public async Task<string> Login(LoginDto dto)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (user == null)
            throw new BusinessException("Invalid credentials");

        var result = _hasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);

        if (result == PasswordVerificationResult.Failed)
            throw new BusinessException("Invalid credentials");

        return _tokenService.CreateToken(user);
    }
}
