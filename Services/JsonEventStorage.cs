using System.Text.Json;

namespace Services
{
    public class JsonEventStorage : IEventStorage
    {
        public async Task<List<Event>> ReadEvents()
        {
            string path = $"events.json";
            List<Event> events = new List<Event>();
            if (System.IO.File.Exists(path))
            {
                events = JsonSerializer.Deserialize<List<Event>>(await System.IO.File.ReadAllTextAsync(path));
            }
            return events;
        }
    }
}