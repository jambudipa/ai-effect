---
title: Triage a support ticket with a schema
doc-type: tutorial
sources:
  [src/AiSdk.ts, src/core-schema.ts, src/internal/output.ts, src/testing.ts]
---

# Triage a support ticket with a schema

> **TL;DR:** Turn a ticket into an order ID and a priority. Run the lesson with a local model fixture and print the two validated fields.

Use the Node.js project from [Get your first text result](../getting-started/first-text-result.md). Run this lesson without provider credentials.

The ticket asks for order `A102` to ship today. The fixture supplies the response that the model would return for this exercise.

1. Create `triage-ticket.mjs` in that project.

   ```js
   import { AiSdk } from '@jambudipa/ai-effect';
   import { Output } from '@jambudipa/ai-effect/ai';
   import { MockLanguageModelV4 } from '@jambudipa/ai-effect/ai/test';
   import { Effect, Schema } from 'effect';

   const Ticket = Schema.Struct({
     orderId: Schema.String,
     priority: Schema.Literals(['normal', 'urgent']),
   });

   const program = Effect.gen(function* () {
     const ai = yield* AiSdk;
     const model = yield* MockLanguageModelV4({
       doGenerate: {
         content: [
           { type: 'text', text: '{"orderId":"A102","priority":"urgent"}' },
         ],
         finishReason: { unified: 'stop', raw: undefined },
         usage: {
           inputTokens: { total: 12, noCache: 12 },
           outputTokens: { total: 8, text: 8 },
         },
         warnings: [],
       },
     });
     const output = yield* Output.object({ schema: Ticket });
     const result = yield* ai.generateText({
       model,
       prompt: 'Extract the order ID and priority: Order A102 must ship today.',
       output,
     });

     console.log('Order:', result.output.orderId);
     console.log('Priority:', result.output.priority);
   }).pipe(Effect.scoped, Effect.provide(AiSdk.layer));

   await Effect.runPromise(program);
   ```

2. Run the program.

   ```sh
   node triage-ticket.mjs
   ```

   ```text
   Order: A102
   Priority: urgent
   ```

   Find `Order:` and `Priority:` on separate lines. The program reads each field from `result.output` after the schema accepts the response.

You took a text reply through a schema and read two fields from the result. Try [extracting a list of action items](../../how-to/generation/extract-a-list.md) or [look up an order with a tool](look-up-an-order.md). Read [how the Effect and SDK boundary works](../../explanation/effect-and-sdk-boundary.md).
