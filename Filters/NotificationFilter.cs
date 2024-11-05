using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Services;

namespace Filters{
    public class NotificationFilter : Attribute, IAsyncActionFilter
    {
        private readonly IUserService _user;
        private readonly IEmailService _mail;
        private readonly IAttendanceService _att;

        public NotificationFilter(IUserService user, IEmailService mail, IAttendanceService attendanceService)
        {
            _user = user;
            _mail = mail;
            _att = attendanceService;
        }
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            if (context.HttpContext.Request.Method == "PUT"){
                Console.WriteLine("Attendees are being notified of update.");
                string lastSegment = context.HttpContext.Request.Path.ToString().TrimEnd('/').Split('/').Last();
                var attendees = await _att.GetAttending(Guid.Parse(lastSegment));
                attendees = attendees.ToList();

                for (int i = 0; i < attendees.Count(); i++){
                    var mail = await _user.GetEmail(attendees.ElementAt(i));
                    await _mail.SendEmail(mail, $"event with ID {lastSegment} has changed, log into your account to see changes!");
                }
            }
            await next();
        }
    }
}