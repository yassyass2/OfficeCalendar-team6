using Microsoft.EntityFrameworkCore;

public class MyContext : DbContext
{
    public MyContext(DbContextOptions<MyContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Event> Events { get; set; }
    public DbSet<Admin> Admins { get; set; }
    public DbSet<EventAttendance> Attendances { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlite("Data Source=Data/app.db");
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Event>().HasKey(e => e.Id);
        modelBuilder.Entity<Admin>().HasKey(e => e.Id);
        modelBuilder.Entity<User>().HasKey(e => e.Id);
        modelBuilder.Entity<EventAttendance>()
        .HasKey(ea => new { ea.UserId, ea.EventId });
    }
}