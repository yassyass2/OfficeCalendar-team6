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