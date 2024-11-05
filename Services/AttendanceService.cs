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
            var eventToAttend = await _context.Events
                .FirstOrDefaultAsync(e => e.Id == request.EventId);

            if (eventToAttend == null || DateTime.Parse(eventToAttend.Date) < DateTime.Now)
            {
                return false; // Event not found or has already started
            }

            var existingAttendance = await _context.Attendances
                .FirstOrDefaultAsync(a => a.UserId == request.UserId && a.EventId == request.EventId);
            if (existingAttendance != null)
            {
                return false; // User already attending the event
            }

            await _context.Attendances.AddAsync(request);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ModifyEventAttendance(Guid userId, Guid newEventId)
        {
            var existingAttendance = await _context.Attendances
                .FirstOrDefaultAsync(a => a.UserId == userId);

            if (existingAttendance == null)
            {
                return false; // No existing attendance to modify
            }

            var eventToAttend = await _context.Events
                .FirstOrDefaultAsync(e => e.Id == newEventId);

            if (eventToAttend == null || DateTime.Parse(eventToAttend.Date) < DateTime.Now)
            {
                return false; // New event not found or has already started
            }

            existingAttendance.EventId = newEventId;
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
