---
title: Look up an order with a local tool
doc-type: tutorial
sources: [src/core.ts, src/core-tools.ts, src/internal/tool.ts, src/testing.ts]
---

# Look up an order with a local tool

> **TL;DR:** Run a model request that asks your application for shipment status. Print the tool result, the number of model calls, and the final reply.

Use the Node.js project from [Get your first text result](../getting-started/first-text-result.md). Run this lesson without provider credentials.

An in-memory map contains one order. The fixture asks `getOrder` for that order, then returns a final sentence on the next model call.

1. Create `lookup-order.mjs` in that project.

   ```js
   import { generateText, stepCountIs, tool } from '@jambudipa/ai-effect/ai';
   import { MockLanguageModelV4 } from '@jambudipa/ai-effect/ai/test';
   import { Effect, Schema } from 'effect';

   const orders = new Map([['A102', 'shipped']]);
   const getOrder = tool({
     description: 'Read the current shipment status by order ID.',
     inputSchema: Schema.Struct({ orderId: Schema.String }),
     execute: ({ orderId }) =>
       Effect.succeed({ status: orders.get(orderId) ?? 'unknown' }),
   });

   const usage = {
     inputTokens: { total: 12, noCache: 12 },
     outputTokens: { total: 8, text: 8 },
   };

   const program = Effect.gen(function* () {
     const model = yield* MockLanguageModelV4({
       doGenerate: [
         {
           content: [
             {
               type: 'tool-call',
               toolCallId: 'lookup-1',
               toolName: 'getOrder',
               input: '{"orderId":"A102"}',
             },
           ],
           finishReason: { unified: 'tool-calls', raw: undefined },
           usage,
           warnings: [],
         },
         {
           content: [{ type: 'text', text: 'Order A102 shipped.' }],
           finishReason: { unified: 'stop', raw: undefined },
           usage,
           warnings: [],
         },
       ],
     });

     const result = yield* generateText({
       model,
       tools: { getOrder },
       prompt: 'Look up order A102 and tell me its shipment status.',
       stopWhen: stepCountIs(2),
     });

     const lookup = result.steps[0].toolResults[0];
     console.log('Lookup:', lookup.output.status);
     console.log('Model calls:', model.doGenerateCalls.length);
     console.log(result.text);
   }).pipe(Effect.scoped);

   await Effect.runPromise(program);
   ```

2. Run the program.

   ```sh
   node lookup-order.mjs
   ```

   ```text
   Lookup: shipped
   Model calls: 2
   Order A102 shipped.
   ```

   Find `Lookup:` first. The tool gets that value from the map. The two model calls cover the tool request and the final reply.

You gave a model a small, read-only application tool and collected the result from its first step. Use [a step limit in an application](../../how-to/tools/continue-after-a-tool-call.md). Read [how the Effect and SDK boundary works](../../explanation/effect-and-sdk-boundary.md).
