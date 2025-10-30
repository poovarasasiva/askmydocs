---
id: backend
title: Backend Architecture
sidebar_label: Backend
---

# 🔧 Backend Architecture

Production-grade **.NET 10 Web API** built with **Clean Architecture + CQRS**, optimized for scalability, maintainability, and AI integration.

---

## Project Structure

```
AskMyDocs/
├── AskMyDocs.API/              # Presentation
│   ├── Controllers/
│   ├── Middleware/
│   └── Filters/
├── AskMyDocs.Application/      # Business Logic
│   ├── Commands/
│   ├── Queries/
│   ├── Handlers/
│   └── DTOs/
├── AskMyDocs.Domain/           # Core
│   ├── Entities/
│   ├── ValueObjects/
│   └── Interfaces/
├── AskMyDocs.Infrastructure/   # External
│   ├── Repositories/
│   ├── Services/
│   └── Data/
└── AskMyDocs.Shared/           # Common
    ├── Exceptions/
    └── Extensions/
```

---  
## Middleware Pipeline  

### 1. Global Error Handling  
```csharp
public sealed class GlobalErrorHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalErrorHandlingMiddleware> _logger;
    private readonly IWebHostEnvironment _env;

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var statusCode = exception switch
        {
            ApiException apiEx => apiEx.StatusCode,
            UnauthorizedAccessException => StatusCodes.Status401Unauthorized,
            _ => StatusCodes.Status500InternalServerError
        };

        var errorResponse = new ErrorResponse(false, statusCode, exception.Message, context.TraceIdentifier, DateTime.UtcNow);
        await context.Response.WriteAsJsonAsync(errorResponse);
    }
}
````

### 2. JWT Token Validation

```csharp
public sealed class TokenValidationMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ITokenHasher _tokenHasher;

    public async Task InvokeAsync(HttpContext context, IServiceProvider serviceProvider)
    {
        var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();
        if (string.IsNullOrWhiteSpace(authHeader))
        {
            await RespondUnauthorized(context, "Missing token");
            return;
        }

        var token = authHeader.Replace("Bearer ", "", StringComparison.OrdinalIgnoreCase);
        var hashedToken = _tokenHasher.Hash(token);

        var dbContext = serviceProvider.GetRequiredService<MongoDbContext>();
        var tokenDoc = await dbContext.UserToken
            .Find(t => t.Token == hashedToken)
            .FirstOrDefaultAsync();

        if (tokenDoc == null || tokenDoc.IsRevoked)
        {
            await RespondUnauthorized(context, "Invalid or expired token");
            return;
        }

        context.Request.Headers["TenantId"] = tokenDoc.TenantId;
        await _next(context);
    }

    private static async Task RespondUnauthorized(HttpContext context, string message)
    {
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        await context.Response.WriteAsync(message);
    }
}
```

### 3. Rate Limiting

```csharp
public sealed class InMemoryTenantRateLimiter : ITenantRateLimiter
{
    private readonly IMemoryCache _cache;
    private const int Limit = 10;
    private static readonly TimeSpan Window = TimeSpan.FromMinutes(1);

    public Task<bool> AllowRequestAsync(string tenantId)
    {
        var counter = _cache.GetOrCreate($"rate-{tenantId}", e =>
        {
            e.AbsoluteExpirationRelativeToNow = Window;
            return new Counter();
        });

        lock (counter)
        {
            if (counter.Count >= Limit) return Task.FromResult(false);
            counter.Count++;
            return Task.FromResult(true);
        }
    }

    private sealed class Counter { public int Count { get; set; } }
}
```

---

## 🧩 Database Schema (MongoDB)

### Users Collection

```json
{
  "_id": "string",
  "email": "user@example.com",
  "passwordHash": "bcrypt_hash",
  "firstName": "John",
  "lastName": "Doe",
  "roles": ["User"],
  "createdAt": "2025-10-30T12:00:00Z"
}
```

### Roles Collection

```json
{
  "_id": "string",
  "name": "Admin",
  "description": "Full system access",
  "createdAt": "2025-10-30T12:00:00Z"
}
```

### ChatHistory Collection

```json
{
  "_id": "ObjectId",
  "sessionId": "session_abc123",
  "userId": "user_123",
  "messages": [
    { "role": "user", "content": "Summarize this document." },
    { "role": "assistant", "content": "This document discusses AI-based document processing." }
  ]
}
```

### DocumentChunks Collection

```json
{
  "_id": "string",
  "documentId": "doc_123",
  "chunkIndex": 0,
  "text": "AI enables document understanding...",
  "embedding": [0.12, -0.43, 0.88, ...],
  "userId": "user_123",
  "uploadedAt": "2025-10-30T12:00:00Z"
}
```

### DocumentMetadata Collection

```json
{
  "_id": "string",
  "tenantId": "tenant_001",
  "fileName": "project_spec.pdf",
  "fileType": "application/pdf",
  "uploadedAt": "2025-10-30T12:00:00Z"
}
```

### UserTokens Collection

```json
{
  "_id": "string",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tenantId": "tenant_001",
  "documentId": "doc_123",
  "expiresAt": "2025-11-06T12:00:00Z",
  "isRevoked": false
}
```

---

## ⚙️ Configuration (appsettings.json)

```json
{
  "OpenAI": { "ApiKey": "<OpenAIKey>" },
  "HuggingFace": {
    "Token": "<HuggingFaceKey>",
    "EmbeddingUrl": "<EmbeddingURL>",
    "GenerateAnswerUrl": "<AnswerURL>"
  },
  "MongoDbSettings": {
    "ConnectionString": "<MongoConn>",
    "DatabaseName": "<MainDB>",
    "IdentityDatabaseName": "<AuthDB>"
  },
  "JwtSettings": {
    "SecretKey": "<Secret>",
    "Issuer": "<Issuer>",
    "Audience": "<Audience>",
    "TokenExpiryInMinutes": 60
  }
}
```