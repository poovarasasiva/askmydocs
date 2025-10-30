---
id: ai-engine
title: AI Engine
sidebar_label: AI Engine
---

# 🤖 AI Engine Architecture

How AskMyDocs uses embeddings, vector search, and LLMs for intelligent document Q&A.

---

## Overview

The AI engine is designed as a modular, horizontally scalable service that processes, embeds, and retrieves document intelligence efficiently.  
It consists of three main components:

1. **Document Processing** — Extract, chunk, and embed text data  
2. **Semantic Search** — Retrieve relevant context via vector similarity  
3. **Answer Generation** — Generate contextual answers with LLMs

---

Got it — you don’t want the full implementations, just the essential logic that shows *how* the system works. Here’s the condensed version focusing only on the main concepts and structure (still markdown + C# style):

---
## Document Processing Pipeline

### 1. Text Extraction (Main Flow)

```csharp
UploadDocsAsync(file, name, tenantId)
{
    var processor = _orchestrator.GetProcessor(extension);
    var content = await processor.ExtractTextAsync(file);
    var chunks = content.ChunkBySentences(1000, 10);

    foreach (var chunk in chunks)
        SaveChunk(chunk, await _embedding.GetEmbedding(chunk));

    await _metadata.Add(new UploadRequest { ... });
    return documentId;
}
````

---

### 2. Text Chunking (Concept)

```csharp
ChunkBySentences(text, max=1000, overlap=200)
{
    foreach (var sentence in SplitByRegex(text))
        BuildChunksWithOverlap(sentence);
    yield return finalChunk;
}
```

*Sentence-based segmentation + overlap ensures contextual continuity.*

---

### 3. Embedding Generation (Core Logic)

```csharp
GetEmbedding(text)
{
    var payload = Json({ text });
    var response = await _fastApi.Post("/embed", payload);
    return ParseEmbedding(response);
}
```

*Custom FastAPI vector service returning normalized float arrays.*

---

### 4. Vector Search (Concept)

```csharp
GetRelevantChunks(question)
{
    var qEmbed = await _embedding.GetEmbedding(question);
    return await _repo.VectorSearch(qEmbed, limit:3);
}
```

*Finds top N semantically closest chunks.*

---

### 5. Answer Generation (Flow)

```csharp
GenerateAnswer(context)
{
    var payload = { model, messages = context };
    var response = await _llmClient.PostAsync(payload);
    return ExtractText(response);
}
```

*RAG-style LLM answering using Mistral model.*

---

### 6. Prompt Engineering (Structure)

```csharp
DefaultPrompts
{
    System = "You are a helpful assistant.";
    TechnicalExpert = "Explain with precision and clarity.";
    DocWriter = "Write structured, professional docs.";
}
```

*Reusable roles defining model behavior.*

---

## Vector Search

### MongoDB Vector Index

```javascript
db.documents.createIndex(
  { "chunks.embedding": "vector" },
  {
    name: "vector_index",
    vectorOptions: {
      type: "Ann",
      numDimensions: 768,
      similarity: "cosine"
    }
  }
);
```

---

## Semantic Retrieval

```csharp
public class DocumentRepository
{
    public async Task<List<ChunkWithScore>> SearchSimilarChunksAsync(
        float[] queryEmbedding, string documentId, int topK = 5)
    {
        var pipeline = new[]
        {
            new BsonDocument("$vectorSearch", new BsonDocument
            {
                { "queryVector", new BsonArray(queryVector) },
                { "path", "Embedding" },
                { "numCandidates", 100 },
                { "limit", limit },
                { "index", "vector_index" }
            }),
        };
    }
}
```

---

## Optimization Strategies

### 1. **Embedding Caching**

Avoid redundant vector generation for identical text.

```csharp
public class CachedEmbeddingService
{
    private readonly IMemoryCache _cache;
    private readonly EmbeddingService _embeddingService;

    public async Task<float[]> GenerateEmbeddingAsync(string text)
    {
        var key = $"embedding:{ComputeHash(text)}";
        if (_cache.TryGetValue(key, out float[] cached)) return cached;

        var embedding = await _embeddingService.GenerateEmbeddingAsync(text);
        _cache.Set(key, embedding, TimeSpan.FromHours(24));
        return embedding;
    }

    private static string ComputeHash(string input)
    {
        using var sha = SHA256.Create();
        var hash = sha.ComputeHash(Encoding.UTF8.GetBytes(input));
        return Convert.ToHexString(hash);
    }
}
```

### 2. **Batch Embedding**
Generate embeddings in parallel batches to reduce network latency.

### 3. **Connection Pooling**
Reuse HTTP and DB connections to prevent resource exhaustion under high concurrency.

### 4. **Sharding-Ready Schema**
Design database with a `TenantId` or `DocumentId` partition key to support future horizontal scaling of embeddings and conversations.

---

## Summary

| Layer                    | Responsibility                   | Key Techniques                                    |
| ------------------------ | -------------------------------- | ------------------------------------------------- |
| **Document Processing**  | Clean & chunk input text         | Sliding window, tokenization                      |
| **Embedding Generation** | Convert text to semantic vectors | Sentence Transformers                             |
| **Vector Search**        | Retrieve top-matching chunks     | MongoDB vector index (HNSW)                       |
| **Answer Generation**    | LLM-based reasoning              | Prompt engineering, Hugging Face API              |
| **Optimization**         | Performance & scale              | Caching, batching, pooling, sharding-ready schema |

---

> **AskMyDocs AI Engine** — a modular, fault-tolerant, and horizontally scalable system combining retrieval-augmented generation with engineering-grade efficiency.
