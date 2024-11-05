public class EventAttendance
{
    public Guid UserId { get; set; }
    public Guid EventId { get; set; }
    public string AttendAt { get; set; }

    public EventAttendance(Guid userId, Guid eventId, string attendAt)
    {
        UserId = userId;
        EventId = eventId;
        AttendAt = attendAt;
    }
}