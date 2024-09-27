using System.Text.Json;

namespace Services
{
    public class Admin
    {
        public Guid Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }

        public Admin(string username, string password, string email = "")
        {
            Id = Guid.NewGuid();
            Username = username;
            Password = password;
            Email = email;
        }
    }

    public interface IAdminService
    {
        Task<bool> CheckAdmin(Admin admin);
        bool ActiveSession(out string adminUsername);

    }

    public class JsonAdminService : IAdminService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        public JsonAdminService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }
        public async Task<bool> CheckAdmin(Admin admin)
        {
            string path = $"Data/admins.json";
            List<Admin> admins = new List<Admin>();
            if (File.Exists(path))
            {
                admins = JsonSerializer.Deserialize<List<Admin>>(await System.IO.File.ReadAllTextAsync(path));
            }

            if (admins.FirstOrDefault(_ => _.Username == admin.Username && _.Password == admin.Password) != null)
            {
                // maakt sessie met admin username en logged in
                var session = _httpContextAccessor.HttpContext.Session;
                session.SetString("IsLoggedIn", "true");
                session.SetString("AdminUsername", admin.Username);
                return true;
            }
            return false;
        }

        public bool ActiveSession(out string adminUsername)
        {
            var session = _httpContextAccessor.HttpContext.Session;
            string LoggedIn = session.GetString("IsLoggedIn");

            // kijkt of de sessie logged in is
            if (LoggedIn != null && LoggedIn == "true")
            {
                adminUsername = session.GetString("AdminUsername");
                return true;
            }
            adminUsername = "";
            return false;
        }
    }
}