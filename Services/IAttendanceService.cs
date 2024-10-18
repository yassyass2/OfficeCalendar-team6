using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Services
{
    public interface IAttendanceService
    {
        Task<bool> CheckAttendance(Guid userId, Guid eventId);
        Task<bool> CreateAttendance(EventAttendance request);
        Task<IEnumerable<Guid>> GetAttending(Guid event_Id);
        Task<bool> DeleteAttendance(EventAttendance request);
        Task<bool> ModifyAttendance(EventAttendance request);
    }

    public class AttendanceService : IAttendanceService
    {
        private readonly MyContext _context;

        public AttendanceService(MyContext context)
        {
            _context = context;
        }

        public async Task<bool> CheckAttendance(Guid userId, Guid eventId)
        {
            return await _context.Attendances.FirstOrDefaultAsync(x => x.UserId == userId && x.EventId == eventId) == null;
        }
        public async Task<bool> CreateAttendance([FromBody] EventAttendance request)
        {
            // Attendances moet nog in MyContext
            var eventToAttend = _context.Events.FirstOrDefault(e => e.Id == request.EventId);
            if (eventToAttend == null)
            {
                //event niet gevonden
                return false;
            }

            // Check event availability (based on date and start time)
            DateTime eventDate = DateTime.Parse(eventToAttend.Date);
            TimeSpan eventStartTime = TimeSpan.Parse(eventToAttend.Start_time);
            DateTime start = eventDate + eventStartTime;

            if (start < DateTime.Now)
            {
                // event is al begonnen
                return false;
            }

            // Add attendance
            await Task.Run(() => _context.Attendances.Add(request));
            await _context.SaveChangesAsync();
            return true; // Attendance modification succeeded
        }

        public async Task<IEnumerable<Guid>> GetAttending(Guid event_Id)
        {
            return await _context.Attendances
                .Where(a => a.EventId == event_Id).Select(_ => _.UserId).ToListAsync();
        }

        public async Task<bool> DeleteAttendance(EventAttendance request)
        {
            var attendance = await _context.Attendances.FirstOrDefaultAsync(a => a.UserId == request.UserId && a.EventId == request.EventId);

            if (attendance == null)
            {
                return false;
            }

            _context.Attendances.Remove(attendance);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ModifyAttendance(EventAttendance request)
        {
            await _context.Attendances.AddAsync(request);
            return true;
        }
    }
}