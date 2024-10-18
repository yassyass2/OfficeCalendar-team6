using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Services
{
    public interface IAttendanceService
    {
        Task<bool> CreateAttendance(EventAttendance request);
        Task<IEnumerable<Guid>> GetAttending(Guid eventId);
        Task<bool> DeleteAttendance(EventAttendance request);
        Task<(bool, string)> ModifyAttendance(EventAttendance request);
    }

    public class AttendanceService : IAttendanceService
    {
        private readonly MyContext _context;

        public AttendanceService(MyContext context)
        {
            _context = context;
        }

        public async Task<bool> CreateAttendance(EventAttendance request)
        {
            var eventToAttend = await _context.Events.FirstOrDefaultAsync(e => e.Id == request.EventId);
            if (eventToAttend == null || DateTime.Parse(eventToAttend.Date) < DateTime.Now)
            {
                return false;
            }

            var existingAttendance = await _context.Attendances
                .FirstOrDefaultAsync(a => a.EventId == request.EventId && a.UserId == request.UserId);
            if (existingAttendance != null)
            {
                return false; // User has already signed up
            }

            await _context.Attendances.AddAsync(request);
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

        public async Task<bool> DeleteAttendance(EventAttendance request)
        {
            var attendance = await _context.Attendances
                .FirstOrDefaultAsync(a => a.UserId == request.UserId && a.EventId == request.EventId);

            if (attendance == null)
            {
                return false;
            }

            _context.Attendances.Remove(attendance);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<(bool, string)> ModifyAttendance(EventAttendance request)
        {
            // Check if the user is trying to modify their own attendance
            var existingAttendance = await _context.Attendances
                .FirstOrDefaultAsync(a => a.EventId == request.EventId && a.UserId == request.UserId);

            if (existingAttendance == null)
            {
                return (false, "Attendance not found.");
            }

            var eventToAttend = await _context.Events.FirstOrDefaultAsync(e => e.Id == request.EventId);
            if (eventToAttend == null || DateTime.Parse(eventToAttend.Date) < DateTime.Now)
            {
                return (false, "Event not found or has already started.");
            }

            var isDateConflict = await _context.Attendances
                .AnyAsync(a => a.EventId != request.EventId
                    && a.UserId == request.UserId
                    && _context.Events.Any(e => e.Id == a.EventId && e.Date == eventToAttend.Date)); // Fetch the event separately

            if (isDateConflict)
            {
                return (false, "Date is already occupied by another event.");
            }

            existingAttendance.EventId = request.EventId;
            await _context.SaveChangesAsync();

            return (true, null);
        }
    }
}
