---
title: How to summarize a local PDF
doc-type: how-to
sources: [src/core.ts, src/core-contracts.ts]
---

# How to summarize a local PDF

> **TL;DR:** Load the PDF as bytes and add it as a file part in a user message. Use a model whose provider accepts PDF input.

Select a platform and model that accept PDFs as file parts. See [Choose a provider and model](../providers/choose-a-provider.md). Pass the path of an existing file to the function.

```ts
import { readFile } from 'node:fs/promises';
import { generateText, type LanguageModel } from '@jambudipa/ai-effect/ai';
import { Effect } from 'effect';

export const summarizePdf = (model: LanguageModel, path: string) =>
  Effect.gen(function* () {
    const data = yield* Effect.tryPromise(() => readFile(path));
    const result = yield* generateText({
      model,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Summarize the main terms in three short bullets.',
            },
            { type: 'file', data, mediaType: 'application/pdf' },
          ],
        },
      ],
    });
    return result.text;
  });
```

If your provider rejects the file for size or format, split it into supported documents or submit extracted text instead. Check the source file first if the local read fails. Set your own file limits before loading user uploads.

See the [core API reference](../../reference/core.md).
