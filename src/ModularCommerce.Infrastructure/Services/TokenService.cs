using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using ModularCommerce.Application.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ModularCommerce.Infrastructure.Services;

public class TokenService: ITokenService
{
    private readonly IConfiguration _config;

    public TokenService(IConfiguration config)
    {
        _config = config;
    }

    public string CreateToken(User user)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role)
        };

        return GenerateTokenFromClaims(claims, expires: DateTime.Now.AddHours(2));

    }
    public string CreateOrderAccessToken(string email)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Email, email),
            new Claim(ClaimTypes.Role, "Customer"),
            new Claim("purpose", "OrderLookup") // Para que este token no sirva para el Admin
        };

        // Usa una expiración corta, por ejemplo 2 horas
        return GenerateTokenFromClaims(claims, expires: DateTime.Now.AddHours(2));
    }

    private string GenerateTokenFromClaims(List<Claim> claims, DateTime expires)
    {
        var key = new SymmetricSecurityKey(
           Encoding.UTF8.GetBytes(_config["Jwt:Key"]!)
       );

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            _config["Jwt:Issuer"],
            _config["Jwt:Audience"],
            claims,
            expires: expires,
            signingCredentials: creds
        );
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    
}
