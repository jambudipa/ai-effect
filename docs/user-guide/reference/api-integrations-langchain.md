---
title: "Integration API — langchain"
doc-type: reference
sources: [src/integrations/langchain.ts, package.json]
---

# langchain

> **TL;DR:** The `@jambudipa/ai-effect/langchain` entry provides the public declarations listed below.

## Import

`@jambudipa/ai-effect/langchain`

## `convertModelMessages`

Convert model messages to the native LangChain message representation without starting a request.

```text
export declare const convertModelMessages: (messages: ModelMessage[]) => Effect.Effect<import("@langchain/core/messages").BaseMessage<import("@langchain/core/messages").MessageStructure<import("@langchain/core/messages").MessageToolSet>, import("@langchain/core/messages").MessageType>[], AiSdkError, never>;
```

## `LangSmithDeploymentTransport`

Construct a wrapped chat transport against a configured LangSmith deployment.
Effect chat transport produced by the LangSmith deployment factory.

```text
export declare const LangSmithDeploymentTransport: {
    make: <M extends UIMessage = UIMessage<unknown, import("ai").UIDataTypes, import("ai").UITools>>(options: LangSmithDeploymentTransportOptions) => Effect.Effect<import("../internal/chat-transport.js").ChatTransport<M>, AiSdkError, never>;
};

export type LangSmithDeploymentTransport<M extends UIMessage = UIMessage> = Effect.Success<ReturnType<typeof LangSmithDeploymentTransport.make<M>>>;
```

## `LangSmithDeploymentTransportOptions`

Graph options for a LangSmith deployment. The SDK defaults the graph ID to `agent`.

```text
export type LangSmithDeploymentTransportOptions = Omit<PregelParams<Record<string, PregelNode>, Record<string, BaseChannel>>, 'channels' | 'nodes' | 'inputChannels' | 'outputChannels'> & {
    graphId?: string;
    client?: Client;
    url?: string;
    apiKey?: string;
    headers?: Record<string, string>;
    streamResumable?: boolean;
};
```

## `StreamCallbacks`

Lifecycle callbacks for the native LangChain protocol.

```text
export interface StreamCallbacks<TState = unknown, R = never, E = never> extends BaseCallbacks<R, E> {
    /** Observe final graph state, which can be absent on streams that emit no state. */
    readonly onFinish?: (state: TState | undefined) => Effect.Effect<void, E, R>;
    /** Observe SDK stream failure as a tagged error in the reader's scope. */
    readonly onError?: (error: AiSdkError) => Effect.Effect<void, E, R>;
    /** Observe native stream cancellation using the reader's captured context. */
    readonly onAbort?: () => Effect.Effect<void, E, R>;
}
```

## `toBaseMessages`

Convert SDK UI messages to LangChain base messages through the asynchronous native converter.

```text
export declare const toBaseMessages: (messages: UIMessage[]) => Effect.Effect<import("@langchain/core/messages").BaseMessage<import("@langchain/core/messages").MessageStructure<import("@langchain/core/messages").MessageToolSet>, import("@langchain/core/messages").MessageType>[], AiSdkError, never>;
```

## `toUIMessageStream`

Convert LangChain messages or graph events to an ordered UI stream.

```text
export declare const toUIMessageStream: <TState = unknown, R = never, E = never, RI = never, EI = never>(input: Stream.Stream<AIMessageChunk, EI, RI> | AsyncIterable<AIMessageChunk> | ReadableStream, options?: ToUIMessageStreamOptions<TState, R, E>) => Stream.Stream<import("ai").UIMessageChunk, AiSdkError, Exclude<R, import("effect/Scope").Scope> | Exclude<RI, import("effect/Scope").Scope>>;
```

## `ToUIMessageStreamOptions`

Configure lifecycle callbacks and which terminal markers the UI stream emits.

```text
export interface ToUIMessageStreamOptions<TState = unknown, R = never, E = never> extends StreamCallbacks<TState, R, E> {
    /** Allow the native adapter to emit or omit the UI start marker. */
    readonly sendStart?: boolean;
    /** Allow the native adapter to emit or omit the UI finish marker. */
    readonly sendFinish?: boolean;
}
```

