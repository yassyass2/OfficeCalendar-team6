using Microsoft.AspNetCore.Http;
using System.Text;

public class JwtSessionMiddleware
{
    private readonly RequestDelegate _next;

    public JwtSessionMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Check if the session has a JWT token stored
        if (context.Session.TryGetValue("JwtToken", out var tokenBytes))
        {
            // Convert the token bytes back to string and add it to the Authorization header
            var token = Encoding.UTF8.GetString(tokenBytes);
            context.Request.Headers["Authorization"] = $"Bearer {token}";
        }

        await _next(context); // Proceed to the next middleware
    }
}
