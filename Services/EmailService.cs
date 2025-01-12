using MimeKit;
using MimeKit.Text;
using MailKit.Net.Smtp;
using MailKit.Security;
using System.Threading.Tasks;

namespace Services {
    public class EmailService : IEmailService
    {
        public async Task<bool> SendEmail(string to, string body)
        {
            try
            {
                var email = new MimeMessage();
                email.From.Add(MailboxAddress.Parse("office@boendermaker.com"));
                email.To.Add(MailboxAddress.Parse(to));
                email.Subject = "Account Verification";
                email.Body = new TextPart(TextFormat.Html) { Text = body };

                using var smtp = new SmtpClient();
                smtp.Connect("boendermaker.com", 465, SecureSocketOptions.SslOnConnect);
                smtp.Authenticate("office@boendermaker.com", "4kp9Ky@18!");
                await smtp.SendAsync(email);
                smtp.Disconnect(true);

                return true;
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to send email: {ex.Message}");
            }
        }

        public async Task<bool> SendVerificationCode(string to, string code)
        {
            var htmlBody = $@"
                <html>
                    <body style='font-family: Arial, sans-serif;'>
                        <h2>Verify Your Email Address</h2>
                        <p>Thank you for registering! Please use the following verification code:</p>
                        <h1 style='color: #4CAF50; font-size: 32px; letter-spacing: 2px;'>{code}</h1>
                        <p>This code will expire in 15 minutes.</p>
                        <p>If you didn't request this verification, please ignore this email.</p>
                    </body>
                </html>";

            return await SendEmail(to, htmlBody);
        }

        public async Task<bool> SendPasswordResetCode(string to, string code)
        {
            var htmlBody = $@"
                <html>
                    <body style='font-family: Arial, sans-serif;'>
                        <h2>Password Reset Request</h2>
                        <p>You requested to reset your password. Use the following code:</p>
                        <h1 style='color: #2196F3; font-size: 32px; letter-spacing: 2px;'>{code}</h1>
                        <p>This code will expire in 15 minutes.</p>
                        <p>If you didn't request this reset, please secure your account.</p>
                    </body>
                </html>";

            return await SendEmail(to, htmlBody);
        }
    }
}
