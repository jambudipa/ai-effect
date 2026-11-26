---
title: "Integration API — workflow/client"
doc-type: reference
sources: [src/integrations/workflow/client.ts, package.json]
---

# workflow/client

> **TL;DR:** The `@jambudipa/ai-effect/workflow/client` entry provides the public declarations listed below.

## Import

`@jambudipa/ai-effect/workflow/client`

## `ReconnectToStreamOptions`

```text
interface ReconnectToStreamOptions {
  chatId: string;
  abortSignal?: AbortSignal;
  /**
   * Override the `startIndex` for this reconnection.
   * Negative values read from the end when the server's durable stream and
   * tail-index header use the same UIMessageChunk index space.
   * When omitted, falls back to the constructor's `initialStartIndex`.
   */
  startIndex?: number;
}
```

## `SendMessagesOptions`

```text
interface SendMessagesOptions<UI_MESSAGE extends UIMessage> {
  trigger: 'submit-message' | 'regenerate-message';
  chatId: string;
  messageId?: string;
  messages: UI_MESSAGE[];
  abortSignal?: AbortSignal;
}
```

## `WorkflowChatTransport`

Construct a workflow transport with scoped request and stream callbacks.
Effect chat transport handle returned by `make` after it captures the callback scope.

```text
export declare const WorkflowChatTransport: {
    make: <M extends UIMessage = UIMessage<unknown, import("ai").UIDataTypes, import("ai").UITools>, E = never, R = never>(options?: WorkflowChatTransportOptions<M, E, R>) => Effect.Effect<import("../../internal/chat-transport.js").ChatTransport<M>, import("../../internal/operation.js").AiSdkError, import("effect/Scope").Scope | R>;
};

export type WorkflowChatTransport<M extends UIMessage = UIMessage> = Effect.Success<ReturnType<typeof WorkflowChatTransport.make<M>>>;
```

## `WorkflowChatTransportOptions`

Workflow request options with Effect callbacks for request preparation and completion.

```text
export type WorkflowChatTransportOptions<M extends UIMessage = UIMessage, E = never, R = never> = WithEffectCallbacks<NativeOptions<M>, (typeof callbacks)[number], E, R>;
```

