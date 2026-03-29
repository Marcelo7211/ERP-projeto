using ErpApi.Domain.Common;
using System.Text.Json;

namespace ErpApi.Presentation.Middleware;

public class ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
{
    public async Task Invoke(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            var (statusCode, title) = ex switch
            {
                DomainValidationException => (StatusCodes.Status400BadRequest, "Erro de validação de domínio"),
                ArgumentException => (StatusCodes.Status400BadRequest, "Parâmetro inválido"),
                InvalidOperationException => (StatusCodes.Status400BadRequest, "Operação inválida"),
                KeyNotFoundException => (StatusCodes.Status404NotFound, "Recurso não encontrado"),
                UnauthorizedAccessException => (StatusCodes.Status401Unauthorized, "Não autorizado"),
                _ => (StatusCodes.Status500InternalServerError, "Erro interno")
            };

            logger.LogError(ex, "Erro não tratado na requisição {Method} {Path}", context.Request.Method, context.Request.Path);

            context.Response.StatusCode = statusCode;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync(JsonSerializer.Serialize(new
            {
                title,
                detail = ex.Message,
                status = statusCode,
                traceId = context.TraceIdentifier
            }));
        }
    }
}
