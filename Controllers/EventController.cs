using Microsoft.AspNetCore.Mvc;
using Services;

namespace Controllers
{
    [Route("events")]
    public class EventController : Controller
    {
        private readonly IEventStorage JsonEventStorage;
        public EventController(IEventStorage eventStorage)
        {
            JsonEventStorage = eventStorage;
        }

        [HttpGet()]
        public async Task<IActionResult> GetEvents()
        {
            var events = await JsonEventStorage.ReadEvents();
            return Ok(events);
        }
    }
}