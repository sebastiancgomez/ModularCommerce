using Microsoft.AspNetCore.Mvc;
using ModularCommerce.Application.DTOs;
using ModularCommerce.Application.Services;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _service;

    public AuthController(IAuthService service)
    {
        _service = service;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var token = await _service.Login(dto);
        return Ok(new { token });
    }
}