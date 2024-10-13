using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Services
{
    public interface IAttendanceService
    {
        Task<bool> ModifyAttendance(Guid userId, OfficeAttendanceRequest request);
        Task<OfficeAttendance> GetAttendance(Guid userId, DateTime date);
    }

    public class AttendanceService : IAttendanceService
    {
        private readonly MyContext _context;

        public AttendanceService(MyContext context)
        {
            _context = context;
        }

        public async Task<bool> ModifyAttendance(Guid userId, OfficeAttendanceRequest request)
        {
            // Check if attendance for the specified date already exists
            var existingAttendance = await _context.OfficeAttendances
                .FirstOrDefaultAsync(a => a.UserId == userId && a.Date.Date == request.Date.Date);

            if (existingAttendance != null)
            {
                // If it exists, you can choose to either update or return false
                return false; // Indicating that the date is already occupied
            }

            // Create a new attendance record
            var newAttendance = new OfficeAttendance
            {
                UserId = userId,
                Date = request.Date,
                IsPresent = request.IsPresent
            };

            _context.OfficeAttendances.Add(newAttendance);
            await _context.SaveChangesAsync();
            return true; // Attendance modification succeeded
        }

        public async Task<OfficeAttendance> GetAttendance(Guid userId, DateTime date)
        {
            return await _context.OfficeAttendances
                .FirstOrDefaultAsync(a => a.UserId == userId && a.Date.Date == date.Date);
        }
    }
}