using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Services
{
    public class AttendanceService : IAttendanceService
    {
        private readonly MyContext _context;

        public AttendanceService(MyContext context)
        {
            _context = context;
        }

        public async Task<bool> CreateAttendance(EventAttendance request)
        {
            Event? eventToAttend = _context.Events
                .FirstOrDefault(e => e.Id == request.EventId);
            if (eventToAttend == null)
            {
                return false;
            }

            DateTime? date = DateTime.ParseExact(eventToAttend.Date, "dd-MM-yyyy", null);
            if (date == null) return false;

            if (date < DateTime.Now)
            {
                return false; // Event has already started
            }

            var existingAttendance = await _context.Attendances
                .FirstOrDefaultAsync(a => a.UserId == request.UserId && a.EventId == request.EventId);
            if (existingAttendance != null)
            {
                return false; // User already attending the event
            }

            var at = TimeSpan.Parse(request.AttendAt);
            if (!(at >= TimeSpan.Parse(eventToAttend.Start_time) && at <= TimeSpan.Parse(eventToAttend.End_time))){
                return false;
            }

            await _context.Attendances.AddAsync(request);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ModifyEventAttendance(EventAttendance newAtt)
        {
            var existingAttendance = await _context.Attendances
                .FirstOrDefaultAsync(a => a.UserId == newAtt.UserId && a.EventId == newAtt.EventId);

            if (existingAttendance == null)
            {
                return false; // No existing attendance to modify
            }

            existingAttendance.EventId = newAtt.EventId;

            if (!string.IsNullOrEmpty(newAtt.AttendAt))
            {
                existingAttendance.AttendAt = newAtt.AttendAt;
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAttendance(EventAttendance request)
        {
            var attendance = await _context.Attendances
                .FirstOrDefaultAsync(a => a.UserId == request.UserId && a.EventId == request.EventId);

            if (attendance == null)
            {
                return false; // Attendance not found
            }

            _context.Attendances.Remove(attendance);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Guid>> GetAttending(Guid eventId)
        {
            return await _context.Attendances
                .Where(a => a.EventId == eventId)
                .Select(a => a.UserId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Guid>> GetAttendedEvents(Guid userId)
        {
            return await _context.Attendances
                .Where(a => a.UserId == userId)
                .Select(a => a.EventId)
                .ToListAsync();
        }
    }
}
