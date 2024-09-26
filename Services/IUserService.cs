using System.Text.Json;

namespace Services
{

    public class User
    {
        public Guid Id { get; set; }
        public string First_name { get; set; }
        public string Last_name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public int Recurring_days { get; set; }
    }

    public interface IUserService
    {
        Task<bool> CheckUser(Admin admin);
    }

}