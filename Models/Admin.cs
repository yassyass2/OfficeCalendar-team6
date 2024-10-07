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