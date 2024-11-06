using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services;
using System;
using System.Threading.Tasks;

namespace Controllers
{
    [Route("api/ModifyAttendance")]
    [ApiController]
    public class ModifyAttendanceController : Controller
    {
        private readonly IAttendanceService _attendanceService;

        public ModifyAttendanceController(IAttendanceService attendanceService)
        {
            _attendanceService = attendanceService;
        }

        // PUT: api/ModifyAttendance
        [HttpPut]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> ModifyAttendance([FromBody] EventAttendance newAttendance)
        {
            if (newAttendance == null) return BadRequest("No body given");

            if (await _attendanceService.ModifyEventAttendance(newAttendance))
            {
                return Ok("Attendance successfully modified.");
            }
            return BadRequest("Failed to modify attendance.");
        }
    }
}
