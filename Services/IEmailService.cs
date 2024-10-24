public interface IEmailService
{
    Task<bool> SendEmail(string to, string body);
}
