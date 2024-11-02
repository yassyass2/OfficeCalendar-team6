public class Event
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string Date { get; set; }
    public string Start_time { get; set; }
    public string End_time { get; set; }
    public string Location { get; set; }
    public bool Admin_approval { get; set; }

    public Event(Guid id, string title, string description, string date, string start_time, string end_time, string location)
    {
        Id = id;
        Title = title;
        Description = description;
        Date = date;
        Start_time = start_time;
        End_time = end_time;
        Location = location;
        Admin_approval = false;
    }
}