using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Services
{
    public interface IAttendanceService
    {
        Task<bool> CreateAttendance(EventAttendance request);
        Task<bool> ModifyEventAttendance(Guid userId, Guid newEventId);
        Task<bool> DeleteAttendance(EventAttendance request);
        Task<IEnumerable<Guid>> GetAttending(Guid eventId);
        Task<IEnumerable<Guid>> GetAttendedEvents(Guid userId);
    }
}
