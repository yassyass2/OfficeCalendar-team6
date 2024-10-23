using MimeKit;
using MimeKit.Text;
using MailKit.Net.Smtp;
using MailKit.Security;
using System.Threading.Tasks;

public class EmailService : IEmailService
{
    public async Task<bool> SendEmail(string to, string body)
    {
        try
        {
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse("office@shithosting.net"));
            email.To.Add(MailboxAddress.Parse(to));
            email.Subject = "Account Verification";
            email.Body = new TextPart(TextFormat.Html) { Text = body };

            using var smtp = new SmtpClient();
            smtp.Connect("shithosting.net", 465, SecureSocketOptions.SslOnConnect); // Correct port and secure socket option
            smtp.Authenticate("office@shithosting.net", "Rfwr96&48");
            await smtp.SendAsync(email);
            smtp.Disconnect(true);

            return true;
        }
        catch (Exception ex)
        {
            // Return or log the exception for troubleshooting
            throw new Exception($"Failed to send email: {ex.Message}");
        }
    }
}
