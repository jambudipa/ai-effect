---
title: "Integration API — llamaindex"
doc-type: reference
sources: [src/integrations/llamaindex.ts, package.json]
---

# llamaindex

> **TL;DR:** The `@jambudipa/ai-effect/llamaindex` entry provides the public declarations listed below.

## Import

`@jambudipa/ai-effect/llamaindex`

## `EngineResponse`

The text delta in a LlamaIndex response.

```text
export interface EngineResponse {
    /** Incremental response text forwarded to the UI message stream. */
    readonly delta: string;
}
```

## `StreamCallbacks`

Lifecycle callbacks run in the scope and context of each reader.

```text
export interface StreamCallbacks<R = never, E = never> {
    /** Run an Effect when the native stream conversion starts. */
    readonly onStart?: () => Effect.Effect<void, E, R>;
    /** Observe the complete accumulated text at stream completion. */
    readonly onFinal?: (completion: string) => Effect.Effect<void, E, R>;
    /** Observe each token reported by the native stream adapter. */
    readonly onToken?: (token: string) => Effect.Effect<void, E, R>;
    /** Observe text as the stream's native text callback receives it. */
    readonly onText?: (text: string) => Effect.Effect<void, E, R>;
}
```

## `toUIMessageStream`

Convert an ordered sequence of LlamaIndex deltas to AI SDK UI chunks.

```text
export declare const toUIMessageStream: <R = never, E = never, RI = never, EI = never>(input: Stream.Stream<EngineResponse, EI, RI> | AsyncIterable<EngineResponse>, callbacks?: StreamCallbacks<R, E>) => Stream.Stream<import("ai").UIMessageChunk, import("../internal/operation.js").AiSdkError, Exclude<R, import("effect/Scope").Scope> | Exclude<RI, import("effect/Scope").Scope>>;
```
