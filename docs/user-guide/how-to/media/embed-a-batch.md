---
title: How to embed a batch of documents for an index
doc-type: how-to
sources: [src/AiSdk.ts, src/core-models.ts, src/core-contracts.ts]
---

# How to embed a batch of documents for an index

> **TL;DR:** Send a batch of document text to `embedMany`. Match the vectors to the input IDs by position and store the model identity with the index.

Supply an embedding model and a batch within your application's size limits. Keep your original document IDs beside the text.

```ts
import { embedMany, type EmbeddingModel } from '@jambudipa/ai-effect/ai';
import { Effect } from 'effect';

type Document = { id: string; text: string };

export const vectorsForIndex = (model: EmbeddingModel, documents: Document[]) =>
  embedMany({
    model,
    values: documents.map((document) => document.text),
  }).pipe(
    Effect.map(({ embeddings, usage }) => ({
      records: documents.map(({ id }, index) => ({
        id,
        vector: embeddings[index],
      })),
      tokens: usage.tokens,
    })),
  );
```

Store the vectors in `records` with their IDs. Use the same model and dimensions for newly indexed documents and query vectors. Create a separate index if you change model or vector size. Use `tokens` to record embedding usage when the provider reports it.

Run the [two-note embedding lesson](../../tutorials/generation/rank-short-notes.md) to see query scoring with fixed vectors. See the [core API reference](../../reference/core.md).
