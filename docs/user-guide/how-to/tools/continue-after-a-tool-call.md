---
title: How to let a model continue after a tool call
doc-type: how-to
sources: [src/core.ts, src/core-tools.ts, src/internal/tool.ts]
---

# How to let a model continue after a tool call

> **TL;DR:** Set a step limit when a model needs to read tool output before it answers. Inspect the final reply to see if the loop still needs another step.

Use a tool-capable model and pass the tool under a stable name. See [Choose a provider and model](../providers/choose-a-provider.md). This stock example gives the model a maximum of three generation steps.

```ts
import {
  generateText,
  stepCountIs,
  tool,
  type LanguageModel,
} from '@jambudipa/ai-effect/ai';
import { Effect, Schema } from 'effect';

const inventory = new Map([['B20', 8]]);

const stockLevel = tool({
  description: 'Read the available units for a SKU.',
  inputSchema: Schema.Struct({ sku: Schema.String }),
  execute: ({ sku }) =>
    Effect.succeed({
      units: inventory.get(sku) ?? null,
    }),
});

export const answerAvailability = (model: LanguageModel, sku: string) =>
  generateText({
    model,
    tools: { stockLevel },
    prompt: 'Use stockLevel to check availability for ' + sku,
    stopWhen: stepCountIs(3),
  }).pipe(
    Effect.map(({ text, steps, finishReason }) => ({
      answer: text,
      steps: steps.length,
      needsFollowUp: finishReason === 'tool-calls' || !text.trim(),
    })),
  );
```

Use `needsFollowUp` to detect an incomplete reply. Return a useful status to the caller or start a new turn with an explicit budget. The step limit counts model rounds. A round can request multiple tools, so enforce limits on expensive actions in their own implementations.

Run the [local order lookup lesson](../../tutorials/generation/look-up-an-order.md) to watch two model calls complete. See the [core API reference](../../reference/core.md).
