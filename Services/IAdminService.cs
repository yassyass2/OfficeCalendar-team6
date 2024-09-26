using System.Text.Json;

namespace Services
{
    public class Admin
    {
        public Guid Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }

        public Admin(string username = "", string password = "")
        {
            Username = username;
            Password = password;
            Id = Guid.NewGuid();
            Email = "";
        }
    }

    public interface IAdminService
    {
        Task<bool> CheckAdmin(Admin admin);
    }

    public class JsonAdminService : IAdminService
    {
        public async Task<bool> CheckAdmin(Admin admin)
        {
            string path = $"Data/admins.json";
            List<Admin> admins = new List<Admin>();
            if (File.Exists(path))
            {
                admins = JsonSerializer.Deserialize<List<Admin>>(await System.IO.File.ReadAllTextAsync(path));
            }
            return (admins.FirstOrDefault(_ => _.Username == admin.Username && _.Password == admin.Password) != null);
        }
    }
}