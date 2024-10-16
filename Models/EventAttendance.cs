public class EventAttendance
{
    public Guid UserId { get; set; }
    public Guid EventId { get; set; }

    public EventAttendance(Guid userId, Guid eventId)
    {
        UserId = userId;
        EventId = eventId;
    }
}