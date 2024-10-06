using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

public class AdminAuthorizationFilter : IAuthorizationFilter
{
    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var isAdmin = context.HttpContext.Session.GetString("IsAdmin");

        if (string.IsNullOrEmpty(isAdmin) || isAdmin != "true")
        {
            context.Result = new UnauthorizedResult();
        }
    }
}