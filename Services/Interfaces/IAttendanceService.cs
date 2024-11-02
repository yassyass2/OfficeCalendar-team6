namespace Services{
    public interface IAttendanceService
    {
        Task<bool> CreateAttendance(EventAttendance request);
        Task<IEnumerable<Guid>> GetAttending(Guid eventId);
        Task<bool> DeleteAttendance(EventAttendance request);
        Task<(bool, string)> ModifyAttendance(EventAttendance request);
    }
}