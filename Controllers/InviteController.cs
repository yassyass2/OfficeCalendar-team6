using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services;

namespace Controllers
{
    [Route("invite")]
    [ApiController]
    public class InviteController : Controller
    {
        private readonly IInviteService _invitation;
        public InviteController(IInviteService invitationService)
        {
            _invitation = invitationService;
        }

        [HttpPost()]
        public IActionResult SendInvite(EventAttendance invitation)
        {
            if (invitation is null)
            {
                return BadRequest("");
            }
            if (!_invitation.SendInvitation(invitation))
            {
                return NotFound("Employee not found or already attending event");
            }
            return Ok("Invitation to the Event has been sent");
        }
    }
}