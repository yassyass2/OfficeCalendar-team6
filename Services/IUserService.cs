using System.Text.Json;

namespace Services
{
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

    public class DbUserService : IUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly MyContext _context;

        public DbUserService(IHttpContextAccessor httpContextAccessor, MyContext context)
        {
            _httpContextAccessor = httpContextAccessor;
            _context = context;
        }

        public async Task<bool> CheckUser(User user)
        {
            try
            {
                if (_context.Users.FirstOrDefault(x => x.Email == user.Email && x.Password == user.Password) != null)
                {
                    var session = _httpContextAccessor.HttpContext.Session;
                    session.SetString("IsLoggedIn", "true");
                    session.SetString("Username", user.Email);
                    session.SetString("Role", "user");
                    return true;
                }
                return false;
            }
            catch
            {
                return false;
            }
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
