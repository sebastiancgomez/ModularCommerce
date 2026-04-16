namespace ModularCommerce.Application.Services
{
    public interface IEmailService
    {
        Task SendOtp(string toEmail, string code);
    }
}
