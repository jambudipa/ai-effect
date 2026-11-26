---
title: How to return structured output
doc-type: how-to
sources:
  [src/core.ts, src/core-object.ts, src/core-schema.ts, src/internal/output.ts]
---

# How to return structured output

> **TL;DR:** Build an output specification with `Output.object`, then pass it
> to `generateText`. Read the validated object from `result.output`.

1. Select a model that supports the structured output mode you need.
2. Define the fields and construct the output specification inside Effect.
3. Pass the specification to the request. Use the output field after the
   request succeeds.

   ```ts
   import { generateText, Output } from '@jambudipa/ai-effect/ai';
   import { Effect, Schema } from 'effect';

   const request = Effect.gen(function* () {
     const output = yield* Output.object({
       schema: Schema.Struct({ summary: Schema.String }),
     });
     const result = yield* generateText({
       model: 'openai/gpt-5-mini',
       prompt: 'Summarize lexical scope in one sentence.',
       output,
     });
     return result.output.summary;
   });
   ```

   The gateway model ID requires gateway credentials. See
   [How to choose a provider and model](choose-a-provider.md) for model handles.

Use `Output.array({ element })` for a list or `Output.choice({ options })`
for one of several strings. Use the Effect error channel to handle provider
or validation failures. See the [Core API reference](../reference/core.md).
