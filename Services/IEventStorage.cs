using System.Text.Json;

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

    public class JsonEventStorage : IEventStorage
    {
        public async Task<List<Event>> ReadEvents()
        {
            string path = $"Data/events.json";
            List<Event> events = new List<Event>();
            if (File.Exists(path))
            {
                events = JsonSerializer.Deserialize<List<Event>>(await System.IO.File.ReadAllTextAsync(path));
            }
            return events;
        }
    }
}