---
title: Scopes and cancellation
doc-type: explanation
sources:
  [
    src/AiSdk.ts,
    src/core.ts,
    src/internal/operation.ts,
    src/internal/text-stream.ts,
    src/internal/stream-aborted.ts,
  ]
---

# Scopes and cancellation

> **TL;DR:** A request starts when its Effect runs or when its stream is consumed.
> Keeping consumption inside the operation's scope lets Effect stop native work
> and callback fibers when the application exits early.

A request has two potential sources of cancellation. The caller can pass an
`AbortSignal` through SDK options. Effect can also interrupt the fiber that
owns the request. The wrapper passes a combined signal to native operations
that support it. Providers still decide how that signal affects remote work.

The `AiSdk` service opens a text stream when a consumer starts reading it.
Each additional consumption starts its own request. Scope closure releases
the SDK reader and interrupts callback fibers. The stream tracks normal
completion so completion does not abort the finished request.

The direct core `streamText` function gives the caller more control. Its
Effect acquires a scoped result. That result exposes event streams and SDK
metadata. The result must stay inside the scope that acquired it for its
consumers to use the native stream safely.

An SDK `abort` event produces `AiSdkStreamAborted`. An SDK failure part produces
an error in the stream. A tool execution failure can remain a `tool-error`
event because the SDK's tool loop may need to send it back to the model.

See [Consume a text stream](../how-to/streaming/consume-a-text-stream.md) and the
[Core API reference](../reference/core.md).
