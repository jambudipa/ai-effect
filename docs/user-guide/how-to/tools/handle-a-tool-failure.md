---
title: How to handle a failed tool call
doc-type: how-to
sources: [src/core.ts, src/internal/tool.ts, src/core-tools.ts]
---

# How to handle a failed tool call

> **TL;DR:** Return a normal value for a lookup that finds no match. When a tool operation fails, inspect the generation steps for `tool-error` parts.

Use a lookup whose return value indicates a missing order. Wrap a failing I/O operation in `Effect.tryPromise` so it uses the failure channel.

```ts
import {
  generateText,
  stepCountIs,
  tool,
  type LanguageModel,
} from '@jambudipa/ai-effect/ai';
import { Effect, Schema } from 'effect';

type Lookup = (id: string) => Promise<{ status: string } | undefined>;

export const answerOrderQuestion = (
  model: LanguageModel,
  lookup: Lookup,
  prompt: string,
) => {
  const lookupOrder = tool({
    description: 'Read the status of an order by ID.',
    inputSchema: Schema.Struct({ orderId: Schema.String }),
    execute: ({ orderId }) =>
      Effect.tryPromise(() => lookup(orderId)).pipe(
        Effect.map((order) =>
          order ? { found: true, status: order.status } : { found: false },
        ),
      ),
  });

  return generateText({
    model,
    tools: { lookupOrder },
    prompt,
    stopWhen: stepCountIs(2),
  }).pipe(
    Effect.map(({ text, steps }) => ({
      text,
      failedTools: steps.flatMap((step) =>
        step.content.flatMap((part) =>
          part.type === 'tool-error' ? [part.toolName] : [],
        ),
      ),
    })),
  );
};
```

If `failedTools` contains `lookupOrder`, show a generic lookup error and decide if the underlying operation is safe to retry. Handle failure of the generation request through its Effect error channel. Log application errors in your own system with sensitive inputs removed.

See [The Effect and SDK boundary](../../explanation/effect-and-sdk-boundary.md) and the [core API reference](../../reference/core.md).
