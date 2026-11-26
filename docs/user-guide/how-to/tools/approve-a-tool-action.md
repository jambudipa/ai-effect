---
title: How to ask for approval before a tool writes data
doc-type: how-to
sources: [src/core.ts, src/internal/tool.ts, src/core-contracts.ts]
---

# How to ask for approval before a tool writes data

> **TL;DR:** Mark a tool with `needsApproval` and show the pending action to the user. Append their decision to the saved message history before you continue the model request.

Use a tool-capable model and store the message history on the server. In this example the tool writes an order note to an in-memory map. Supply the same tools on both calls.

```ts
import {
  generateText,
  tool,
  type LanguageModel,
  type ModelMessage,
} from '@jambudipa/ai-effect/ai';
import { Effect, Schema } from 'effect';

const orderNotes = new Map<string, string>();
const tools = {
  saveNote: tool({
    description: 'Save an internal note on an order.',
    inputSchema: Schema.Struct({
      orderId: Schema.String,
      note: Schema.String,
    }),
    needsApproval: true,
    execute: ({ orderId, note }) =>
      Effect.sync(() => {
        orderNotes.set(orderId, note);
        return { saved: true };
      }),
  }),
};

export const requestApproval = (
  model: LanguageModel,
  messages: ModelMessage[],
) =>
  generateText({ model, messages, tools }).pipe(
    Effect.map((result) => ({
      history: [...messages, ...result.response.messages],
      requests: result.steps.flatMap((step) =>
        step.content.filter((part) => part.type === 'tool-approval-request'),
      ),
    })),
  );

type Decision = { approvalId: string; approved: boolean };

export const resumeWithDecisions = (
  model: LanguageModel,
  history: ModelMessage[],
  decisions: Decision[],
) =>
  generateText({
    model,
    tools,
    messages: [
      ...history,
      {
        role: 'tool',
        content: decisions.map(({ approvalId, approved }) => ({
          type: 'tool-approval-response',
          approvalId,
          approved,
        })),
      },
    ],
  });
```

Show the target order and exact note from the pending tool call. Use the `approvalId` from that request when you record the answer. Set `approved: false` when the user declines. Confirm ownership and authorization before you accept a decision, and resolve every pending request from the same turn before you resume. Handle any further approval requests in the result the same way.

Use [a step limit](continue-after-a-tool-call.md) if you also let the model continue through several rounds. See the [core API reference](../../reference/core.md).
