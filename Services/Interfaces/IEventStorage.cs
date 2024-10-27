public interface IEventStorage
{
    Task<List<Event>> ReadEvents();
    Task CreateEvent(Event e);
    Task<bool> DeleteEvent(Guid Id);
    Task<bool> Put(Guid Id, Event e);
}