using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Services;

namespace Filters{
    public class NotificationFilter : Attribute, IAsyncActionFilter
    {
        private readonly IAttendanceService _att;
        private readonly IEmailService _mail;

        public NotificationFilter(IAttendanceService att, IEmailService mail)
        {
            _att = att;
            _mail = mail;
        }
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            if (context.HttpContext.Request.Method == "PUT"){
                Console.WriteLine("Attendees are being notified of update.");
            }
            await next();
        }
    }
}