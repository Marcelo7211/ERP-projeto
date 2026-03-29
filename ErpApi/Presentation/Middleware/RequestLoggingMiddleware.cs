namespace ErpApi.Presentation.Middleware;

public class RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
{
    public async Task Invoke(HttpContext context)
    {
        var start = DateTime.UtcNow;
        await next(context);
        var elapsed = (DateTime.UtcNow - start).TotalMilliseconds;

        logger.LogInformation(
            "HTTP {Method} {Path} respondeu {StatusCode} em {ElapsedMs} ms",
            context.Request.Method,
            context.Request.Path,
            context.Response.StatusCode,
            Math.Round(elapsed, 2));
    }
}
