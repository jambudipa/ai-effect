---
title: How to extract a list of action items
doc-type: how-to
sources: [src/core.ts, src/core-schema.ts, src/internal/output.ts]
---

# How to extract a list of action items

> **TL;DR:** Use an array output when a transcript can yield zero or more records. Give each record a schema and read the validated list from `result.output`.

Pass a transcript and a model that supports structured output. See [Choose a provider and model](../providers/choose-a-provider.md).

Use the transcript as the prompt. Keep the extraction rule separate so the same function works for different meetings.

```ts
import {
  generateText,
  Output,
  type LanguageModel,
} from '@jambudipa/ai-effect/ai';
import { Effect, Schema } from 'effect';

const Action = Schema.Struct({
  owner: Schema.String,
  task: Schema.String,
});

export const extractActions = (model: LanguageModel, transcript: string) =>
  Effect.gen(function* () {
    const output = yield* Output.array({ element: Action });
    const result = yield* generateText({
      model,
      system:
        'Extract only explicit commitments. Return an empty list if there are none.',
      prompt: transcript,
      output,
    });
    return result.output;
  });
```

For a transcript with no commitments, expect `[]`. Route a failed request through your application's error handler. Keep an empty successful list distinct from a failed extraction.

Start with [a fixture-backed schema lesson](../../tutorials/generation/triage-a-support-ticket.md) to see the same request shape with one object. See the [core API reference](../../reference/core.md).
