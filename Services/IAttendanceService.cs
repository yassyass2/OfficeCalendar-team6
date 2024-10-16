using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Services
{
    public interface IAttendanceService
    {
        Task<bool> CreateAttendance(EventAttendance request);
        Task<IEnumerable<Guid>> GetAttending(Guid event_Id);
        Task<bool> DeleteAttendance(EventAttendance request);
    }

    public class AttendanceService : IAttendanceService
    {
        private readonly MyContext _context;

        public AttendanceService(MyContext context)
        {
            _context = context;
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
                .Where(a => a.Event_Id == event_Id).Select(_ => _.User_Id);
        }

        public async Task<bool> DeleteAttendance(EventAttendance request)
        {
            var attendance = await _context.Attendances.FirstOrDefault(a => a.UserId == request.UserId && a.EventId == request.EventId);

            if (attendance == null)
            {
                return false;
            }

            await _context.Attendances.Remove(attendance);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}