---
title: How to route a ticket into a fixed set of categories
doc-type: how-to
sources: [src/core.ts, src/core-schema.ts, src/internal/output.ts]
---

# How to route a ticket into a fixed set of categories

> **TL;DR:** Use `Output.choice` when your application needs one label from a known list. Include a manual route for tickets that do not fit a category.

Select a model that supports structured output. See [Choose a provider and model](../providers/choose-a-provider.md). Pass the resulting label to your own queue selection code.

```ts
import {
  generateText,
  Output,
  type LanguageModel,
} from '@jambudipa/ai-effect/ai';
import { Effect } from 'effect';

export const routeTicket = (model: LanguageModel, message: string) =>
  Effect.gen(function* () {
    const output = yield* Output.choice({
      options: ['billing', 'delivery', 'manual-review'] as const,
    });
    const result = yield* generateText({
      model,
      system:
        'Route the ticket. Choose manual-review if its purpose is unclear.',
      prompt: message,
      output,
    });
    return result.output;
  });
```

For a clear billing complaint, send a successful `billing` result to the billing queue. Use `manual-review` when the result is ambiguous. Handle an Effect failure separately so you can still detect provider and validation errors.

Use [a list of records](extract-a-list.md) when several items can match. See the [core API reference](../../reference/core.md).
