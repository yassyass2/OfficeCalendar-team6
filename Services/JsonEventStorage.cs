namespace Services
{
    public class JsonEventStorage : IEventStorage
    {
        public async Task<List<Event>> ReadEvents()
        {
            var path = $"events.json";
            if (System.IO.File.Exists(path))
            {
                var events = JsonSerializer.Deserialize<Event>(await System.IO.File.ReadAllTextAsync(path));
            }
            return events;
        }
    }