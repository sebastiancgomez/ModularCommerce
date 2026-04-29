using ModularCommerce.Domain.Exceptions;

public class UserOtp // Nombre más genérico
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Email { get; set; } = string.Empty; // Identificador clave
    public string Code { get; set; } = string.Empty;
    public DateTime Expiration { get; set; }
    public bool IsUsed { get; set; } = false;
    public int Attempts { get; set; } = 0;
    public string Purpose { get; set; } = OtpPurpose.OrderConfirmation.ToString(); // Por si mañana lo usas para Login
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public void Verify(string code)
    {
        if (IsUsed) throw new BusinessException("Código ya utilizado");
        if (DateTime.UtcNow > Expiration) throw new BusinessException("Código expirado");
        if (Attempts >= 5) throw new BusinessException("Máximo de intentos alcanzado");

        Attempts++;

        if (Code != code) throw new BusinessException("Código incorrecto");

        IsUsed = true;
    }
}
public enum OtpPurpose
{
    OrderLookup,
    OrderConfirmation,
}