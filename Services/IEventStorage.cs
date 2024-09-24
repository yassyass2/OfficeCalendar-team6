namespace Services
{
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
    }
    public interface IEventStorage
    {
        Task<List<Event>> ReadEvents();
    }
}