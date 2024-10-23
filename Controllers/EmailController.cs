// using Microsoft.AspNetCore.Mvc;
// using MimeKit;
// using MimeKit.Text;
// using MailKit.Net.Smtp;
// using MailKit.Security;
// using System.Threading.Tasks;

// namespace Controllers
// {
//     [ApiController]
//     [Route("api/[controller]")]
//     public class EmailController : ControllerBase
//     {
//         [HttpPost]
//         public async Task<IActionResult> SendEmail(string body)
//         {
//             try
//             {
//                 var email = new MimeMessage();
//                 email.From.Add(MailboxAddress.Parse("foreverbusiness333@gmail.com"));
//                 email.To.Add(MailboxAddress.Parse("mauriceboendermaker@gmail.com")); // Replace with your recipient
//                 email.Subject = "Test Email Subject";
//                 email.Body = new TextPart(TextFormat.Html) { Text = body };

//                 using var smtp = new SmtpClient();
//                 smtp.Connect("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
//                 smtp.Authenticate("foreverbusiness333@gmail.com", "ForeverLiving123!");
//                 await smtp.SendAsync(email);
//                 smtp.Disconnect(true);

//                 return Ok("Email sent successfully");
//             }
//             catch (Exception ex)
//             {
//                 return StatusCode(500, $"Internal server error: {ex.Message}");
//             }
//         }
//     }
// }
