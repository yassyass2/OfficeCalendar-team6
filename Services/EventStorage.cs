using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SQLitePCL;

namespace Services
{

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

        public async Task<Event> OneEvent(Guid eventId){
            if (eventId == null) return null;
            return await _context.Events.FirstOrDefaultAsync(x => x.Id == eventId);
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

            var allEvents = await _context.Events.ToListAsync();
            Console.WriteLine("Events in the database:");
            foreach (var evt in allEvents)
            {
                Console.WriteLine($"Id: {evt.Id}, Title: {evt.Title}, Date: {evt.Date}");
            }

            var to_update = await _context.Events.FindAsync(Id);
            if (to_update == null)
            {
                Console.WriteLine($"Event with Id {Id} not found.");
                return false;
            }

            to_update.Title = ev.Title;
            to_update.Description = ev.Description;
            to_update.Date = ev.Date;
            to_update.Start_time = ev.Start_time;
            to_update.End_time = ev.End_time;
            to_update.Location = ev.Location;
            _context.Entry(to_update).State = EntityState.Modified;

            try
            {
                var result = await _context.SaveChangesAsync() > 0;
                Console.WriteLine(result ? "Update successful." : "Update failed.");
                return result;
            }
            catch (DbUpdateConcurrencyException ex)
            {
                Console.WriteLine($"Concurrency conflict detected: {ex.Message}. Please try again.");
                return false;
            }
        }
    }
}