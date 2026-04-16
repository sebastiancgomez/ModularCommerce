using Microsoft.Extensions.Configuration;
using ModularCommerce.Application.Services;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace ModularCommerce.Infrastructure.Services;

public class EmailService: IEmailService
{
    private readonly IConfiguration _config;

    public EmailService(IConfiguration config)
    {
        _config = config;
    }

    public async Task SendOtp(string toEmail, string code)
    {
        // 1. Cargar y preparar el Template
        string filePath = Path.Combine(AppContext.BaseDirectory, "EmailTemplates", "OtpTemplate.html");
        // Leer el archivo asegurando codificación UTF-8
        string htmlBody = await File.ReadAllTextAsync(filePath, System.Text.Encoding.UTF8);

        htmlBody = htmlBody.Replace("{OTP_CODE}", code);

        // 2. Configurar el mensaje
        var email = new MimeMessage();
        email.From.Add(new MailboxAddress("Mis Bellas", _config["Smtp:User"]));
        email.To.Add(MailboxAddress.Parse(toEmail));
        email.Subject = "Tu código de acceso - Mis Bellas";

        var bodyBuilder = new BodyBuilder { HtmlBody = htmlBody };
        email.Body = bodyBuilder.ToMessageBody();
        
        // 3. Enviar con MailKit
        using var smtp = new SmtpClient();
        try
        {
            // 'Auto' elegirá SSL para 465 o TLS para 587 automáticamente
            await smtp.ConnectAsync(
                _config["Smtp:Host"]!,
                int.Parse(_config["Smtp:Port"]!),
                SecureSocketOptions.Auto
            );

            await smtp.AuthenticateAsync(_config["Smtp:User"]!, _config["Smtp:Pass"]!);
            await smtp.SendAsync(email);
        }
        finally
        {
            await smtp.DisconnectAsync(true);
        }
    }
}
