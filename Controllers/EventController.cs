using Microsoft.AspNetCore.Mvc;
using Services;

namespace Controllers
{
    [Route("events")]
    public class EventController : Controller
    {
        private readonly IEventStorage EventStorage;
        public EventController(IEventStorage eventStorage)
        {
            EventStorage = eventStorage;
        }

        [HttpGet()]
        public async Task<IActionResult> GetEvents()
        {
            await EventStorage.ReadEvents();
            return Ok();
        }
    }
}