using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace Services
{
    public interface IEventStorage
    {
        Task<List<Event>> ReadEvents();
        Task CreateEvent(Event e);
        Task<bool> DeleteEvent(Guid Id);
        Task<bool> Put(Guid Id, Event e);
    }

    public class JsonEventStorage : IEventStorage
    {
        public string path = "Data/events.json";
        public async Task<List<Event>> ReadEvents()
        {
            List<Event> events = new List<Event>();
            if (File.Exists(path))
            {
                events = JsonSerializer.Deserialize<List<Event>>(await File.ReadAllTextAsync(path));
            }
            return events;
        }

        public async Task CreateEvent(Event e)
        {
            List<Event> events = new List<Event>();
            if (File.Exists(path))
            {
                events = JsonSerializer.Deserialize<List<Event>>(await File.ReadAllTextAsync(path));
            }
            events.Add(e);
            await File.WriteAllTextAsync(path, JsonSerializer.Serialize(events));
        }

        public async Task<bool> DeleteEvent(Guid Id)
        {
            var events = JsonSerializer.Deserialize<List<Event>>(await File.ReadAllTextAsync(path));
            if (events.FirstOrDefault(e => e.Id == Id) != null)
            {
                events.Remove(events.FirstOrDefault(e => e.Id == Id));
                return true;
            }
            return false;
        }

        public async Task<bool> Put(Guid Id, Event e)
        {
            var events = JsonSerializer.Deserialize<List<Event>>(await File.ReadAllTextAsync(path));
            if (events.FirstOrDefault(e => e.Id == Id) != null)
            {
                events[events.IndexOf(events.FirstOrDefault(e => e.Id == Id))] = e;
                return true;
            }
            return false;
        }
    }
}