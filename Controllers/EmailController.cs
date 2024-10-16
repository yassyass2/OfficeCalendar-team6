using Microsoft.AspNetCore.Mvc;
using MimeKit;
using MimeKit.Text;
using MailKit.Net.Smtp;
using MailKit.Security;

namespace Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmailController : ControllerBase
    {
        [HttpPost]
<<<<<<< HEAD
        public async Task<IActionResult> SendEmail(string body)
        {
            try
            {
                var email = new MimeMessage();
                email.From.Add(MailboxAddress.Parse("shaniya.gulgowski48@ethereal.email"));
                email.To.Add(MailboxAddress.Parse("Mohamaadflaha2014@gmail.com"));
                email.Subject = "Test Email Subject";
                email.Body = new TextPart(TextFormat.Html) { Text = body };

                using var smtp = new SmtpClient();
                smtp.Connect("smtp.ethereal.email", 587, SecureSocketOptions.StartTls);
                smtp.Authenticate("shaniya.gulgowski48@ethereal.email", "77QXuJ16tfcvGYgfE2");
                await smtp.SendAsync(email);
                smtp.Disconnect(true);

                return Ok("Email sent successfully");
            }
            catch (SmtpCommandException ex)
            {
                // Log specific SMTP errors
                return StatusCode(500, $"SMTP error: {ex.Message} (StatusCode: {ex.StatusCode})");
            }
            catch (SmtpProtocolException ex)
            {
                // Log protocol errors
                return StatusCode(500, $"Protocol error while sending email: {ex.Message}");
            }
            catch (Exception ex)
            {
                // Log generic exceptions
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
=======
        public IActionResult SendEmail(string body)
        {
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse("wallace3@ethereal.email"));
            email.To.Add(MailboxAddress.Parse("Mohamaadflaha2014@gmail.com"));
            email.Subject = "Test Email Subject";
            email.Body = new TextPart(TextFormat.Html) { Text = body };

            using var smtp = new SmtpClient();
            smtp.Connect("smtp.ethereal.email", 587, SecureSocketOptions.StartTls);
            smtp.Authenticate("wallace3@ethereal.email", "ySk78MnE6pkexvBkz1");
            smtp.Send(email);
            smtp.Disconnect(true);

            return Ok();
>>>>>>> 4770a6ef70e412674a60d49b3af4eb79eb20cec6
        }
    }

}