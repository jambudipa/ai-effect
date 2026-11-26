---
title: How to define an Effect tool
doc-type: how-to
sources:
  [
    src/core.ts,
    src/core-tools.ts,
    src/internal/tool.ts,
    src/protocols/provider-utils.ts,
  ]
---

# How to define an Effect tool

> **TL;DR:** Declare the input schema and return an Effect from `execute`.
> Pass the tool in `generateText` and provide its services on the request.

1. Define a tool with an input schema the model can follow.
2. Return an Effect from `execute`. Use application services inside that
   Effect when the operation needs them.
3. Pass the tool by name and select a stop condition for additional tool steps.

   ```ts
   import { generateText, stepCountIs, tool } from '@jambudipa/ai-effect/ai';
   import { Effect, Schema } from 'effect';

   const double = tool({
     description: 'Multiply a number by two.',
     inputSchema: Schema.Struct({ value: Schema.Number }),
     execute: ({ value }) => Effect.succeed(value * 2),
   });

   const request = Effect.gen(function* () {
     return yield* generateText({
       model: 'openai/gpt-5-mini',
       prompt: 'Use double to multiply 21 by two.',
       tools: { double },
       stopWhen: stepCountIs(2),
     });
   });
   ```

Use a tool-capable model and configure its credentials before running the
request. If the tool or an approval callback needs an Effect service, apply
its layer to `request` before running it. See
[The boundary between Effect and the SDK](../explanation/effect-and-sdk-boundary.md).
