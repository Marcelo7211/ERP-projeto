namespace ErpApi.Domain.Common;

public sealed class DomainValidationException(string message) : Exception(message)
{
}
