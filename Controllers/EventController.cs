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

        [HttpPost()]
        public async Task<IActionResult> CreateEvent([FromBody] Event e)
        {
            //nog bezig met dit
            /*
            if (!HttpContext.Session.GetString("IsAdmin", out var isAdmin) || isAdmin != "true")
            {
                return Unauthorized("Admin session is required.");
            }
            */

            await JsonEventStorage.CreateEvent(e);
            return Ok("Event has been created");
        }
    }
}