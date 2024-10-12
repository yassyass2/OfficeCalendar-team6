using System.Text.Json;

namespace Services
{
    public interface IAdminService
    {
        Task<bool> CheckAdmin(Admin admin);

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
                session.SetString("Username", admin.Username);
                session.SetString("Role", "admin");
                return true;
            }
            return false;
        }

        
    }

    public class DbAdminService : IAdminService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly MyContext _context;
        public DbAdminService(IHttpContextAccessor httpContextAccessor, MyContext context)
        {
            _httpContextAccessor = httpContextAccessor;
            _context = context;
        }
        public async Task<bool> CheckAdmin(Admin admin)
        {
            try
            {
                if (_context.Admins.FirstOrDefault(x => x.Username == admin.Username && x.Password == admin.Password) != null)
                {
                    var session = _httpContextAccessor.HttpContext.Session;
                    session.SetString("IsLoggedIn", "true");
                    session.SetString("Username", admin.Username);
                    session.SetString("Role", "admin");
                    return true;
                }
                return false;
            }
            catch
            {
                return false;
            }
        }

        public bool ActiveSession(out string adminUsername)
        {
            var session = _httpContextAccessor.HttpContext.Session;
            string role = session.GetString("Role");
            if (role == "admin")
            {
                adminUsername = session.GetString("Username");
                return true;
            }
            adminUsername = "";
            return false;
        }
    }
}