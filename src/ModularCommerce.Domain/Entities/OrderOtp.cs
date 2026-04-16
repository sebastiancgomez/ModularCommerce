using ModularCommerce.Domain.Exceptions;

namespace ModularCommerce.Domain.Entities;

public class OrderOtp
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid OrderId { get; set; }

    public string Code { get; set; } = string.Empty;

    public DateTime Expiration { get; set; }

    public bool IsUsed { get; set; } = false;

    public int Attempts { get; set; } = 0;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public void Verify(string code)
    {
        if (IsUsed)
            throw new BusinessException("Código ya utilizado");

        if (Expiration < DateTime.UtcNow)
            throw new BusinessException("Código expirado");

        if (Attempts >= 5)
            throw new BusinessException("Máximo de intentos alcanzado");

        Attempts++;

        if (Code != code)
            throw new BusinessException("Código incorrecto");

        IsUsed = true;
    }
}
