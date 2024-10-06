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

        public User(string email, string password, string first_name = "", string last_name = "", int recurring_days = 0)
        {
            Id = Guid.NewGuid();
            Email = email;
            Password = password;
            First_name = first_name;
            Last_name = last_name;
            Recurring_days = recurring_days;
        }
    }

    public interface IUserService
    {
        Task<bool> CheckUser(User user);
        bool ActiveSession(out string username);
    }

    public class JsonUserService : IUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public JsonUserService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<bool> CheckUser(User user)
        {
            string path = $"Data/users.json";
            List<User> users = new List<User>();

            if (File.Exists(path))
            {
                users = JsonSerializer.Deserialize<List<User>>(await System.IO.File.ReadAllTextAsync(path));
            }

            // Check if the user exists in the file
            if (users.FirstOrDefault(_ => _.Email == user.Email && _.Password == user.Password) != null)
            {
                // Create session with user details
                var session = _httpContextAccessor.HttpContext.Session;
                session.SetString("IsLoggedIn", "true");
                session.SetString("Username", user.Email);
                session.SetString("Role", "user");    // User is not an admin
                return true;
            }

            return false;
        }

        public bool ActiveSession(out string username)
        {
            var session = _httpContextAccessor.HttpContext.Session;
            string role = session.GetString("Role");
            if (role == "user")
            {
                username = session.GetString("Username");
                return true;
            }

            username = "";
            return false;
        }
    }
}
