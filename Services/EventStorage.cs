using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Services
{
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

    public class EventStorage : IEventStorage
    {
        private readonly MyContext _context;
        public EventStorage(MyContext context)
        {
            _context = context;
        }
        public async Task<List<Event>> ReadEvents()
        {
            return await _context.Events.ToListAsync();
        }

        public async Task CreateEvent(Event e)
        {
            _context.Events.Add(e);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> DeleteEvent(Guid Id)
        {
            try
            {
                var load = await _context.Events.ToListAsync();
                var eventToRemove = await _context.Events.FirstOrDefaultAsync(e => e.Id == Id);

                if (eventToRemove != null)
                {
                    _context.Events.Remove(eventToRemove);
                    return await _context.SaveChangesAsync() > 0;
                }
                return false;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> Put(Guid Id, Event ev)
        {
            var to_update = await _context.Events.FindAsync(Id);
            if (to_update == null) return false;
            _context.Entry(to_update).CurrentValues.SetValues(ev);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}