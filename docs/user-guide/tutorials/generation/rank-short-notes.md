---
title: Rank two notes with embeddings
doc-type: tutorial
sources: [src/AiSdk.ts, src/core-models.ts, src/testing.ts]
---

# Rank two notes with embeddings

> **TL;DR:** Embed two support notes and a query with a local fixture. Score each note against the query and print the matching note first.

Use the Node.js project from [Get your first text result](../getting-started/first-text-result.md). Run this lesson without provider credentials.

The fixture gives the password note and the query the same two-number vector. It gives the delivery note a different vector.

1. Create `rank-notes.mjs` in that project.

   ```js
   import { AiSdk } from '@jambudipa/ai-effect';
   import { MockEmbeddingModelV4 } from '@jambudipa/ai-effect/ai/test';
   import { Effect } from 'effect';

   const notes = ['Reset a password.', 'Change a delivery address.'];
   const query = 'I forgot my password.';
   const program = Effect.gen(function* () {
     const ai = yield* AiSdk;
     const model = yield* MockEmbeddingModelV4({
       maxEmbeddingsPerCall: 2,
       doEmbed: [
         {
           embeddings: [
             [1, 0],
             [0, 1],
           ],
           usage: { tokens: 2 },
           warnings: [],
         },
         {
           embeddings: [[1, 0]],
           usage: { tokens: 1 },
           warnings: [],
         },
       ],
     });
     const { embeddings } = yield* ai.embedMany({ model, values: notes });
     const { embedding } = yield* ai.embed({ model, value: query });

     const ranked = notes.map((note, index) => ({
       note,
       score: embeddings[index].reduce(
         (total, value, dimension) => total + value * embedding[dimension],
         0,
       ),
     }));
     ranked.sort((left, right) => right.score - left.score);

     for (const hit of ranked) console.log(hit.score + ' ' + hit.note);
   }).pipe(Effect.scoped, Effect.provide(AiSdk.layer));

   await Effect.runPromise(program);
   ```

2. Run the program.

   ```sh
   node rank-notes.mjs
   ```

   ```text
   1 Reset a password.
   0 Change a delivery address.
   ```

   Find the password note first. Its score is `1` because its vector matches the query. The delivery note scores `0`.

You kept each vector with its input and ranked a tiny set of documents. Use [batch embeddings for an index](../../how-to/media/embed-a-batch.md) or [rerank search results](../../how-to/media/rerank-search-results.md). See the [core API reference](../../reference/core.md).
