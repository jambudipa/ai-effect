---
title: How to rerank a shortlist of search results
doc-type: how-to
sources: [src/AiSdk.ts, src/core-models.ts, src/core-contracts.ts]
---

# How to rerank a shortlist of search results

> **TL;DR:** Pass your existing shortlist to a reranking model with the user's query. Use each ranking item's original index to recover your application's document ID.

Build a nonempty shortlist in your search layer. Supply a reranking model handle from a provider that supports reranking. If your search returns no hits, return an empty result before you call the model.

```ts
import { rerank, type RerankingModel } from '@jambudipa/ai-effect/ai';
import { Effect } from 'effect';

type Hit = { id: string; excerpt: string };

export const reorderHits = (
  model: RerankingModel,
  query: string,
  hits: Hit[],
) =>
  rerank({
    model,
    query,
    documents: hits.map((hit) => hit.excerpt),
    topN: Math.min(3, hits.length),
  }).pipe(
    Effect.map(({ ranking }) =>
      ranking.map(({ originalIndex, score }) => ({
        hit: hits[originalIndex],
        score,
      })),
    ),
  );
```

Present the returned hits in ranking order. Use `topN` to fit the space available in your UI. If the reranking request fails and your product allows a fallback, use the original search order and record the failed request.

See the [core API reference](../../reference/core.md).
