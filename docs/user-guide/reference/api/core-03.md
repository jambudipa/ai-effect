---
title: Core API reference 03
doc-type: reference
sources:
  [
    src/core-contracts.ts,
    src/core-experimental.ts,
    src/core-middleware.ts,
    src/core-models.ts,
    src/core-providers.ts,
    src/core-realtime.ts,
    src/core.ts,
    src/index.ts,
    src/internal/steering.ts,
    src/internal/tool.ts,
    src/protocols/provider-errors.ts,
    src/testing.ts,
  ]
---

# Core API reference 03

> **TL;DR:** Public core and test declarations from `DynamicToolError` to `Experimental_DecisionModelCallEndEvent`. Each entry lists its package import and declaration.

## `DynamicToolError`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type DynamicToolError = {
  type: 'tool-error';
  toolCallId: string;
  toolName: string;
  input: unknown;
  error: unknown;
  providerExecuted?: boolean;
  providerMetadata?: ProviderMetadata;
  toolMetadata?: JSONObject;
  dynamic: true;
  title?: string;
};
```

## `DynamicToolResult`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type DynamicToolResult = {
  type: 'tool-result';
  toolCallId: string;
  toolName: string;
  input: unknown;
  output: unknown;
  providerExecuted?: boolean;
  providerMetadata?: ProviderMetadata;
  toolMetadata?: JSONObject;
  dynamic: true;
  preliminary?: boolean;
  title?: string;
};
```

## `DynamicToolUIPart`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type DynamicToolUIPart = {
  type: 'dynamic-tool';
  /**
   * `false` when a static tool part was normalized to a dynamic tool part
   * because its current tool schema was unavailable or incompatible.
   *
   * This preserves its static origin across persistence boundaries.
   */
  dynamic?: false;
  /**
   * Name of the tool that is being called.
   */
  toolName: string;
  /**
   * ID of the tool call.
   */
  toolCallId: string;
  title?: string;
  toolMetadata?: JSONObject;
  /**
   * Whether the tool call was executed by the provider.
   */
  providerExecuted?: boolean;
} & ({
  state: 'input-streaming';
  input?: unknown;
  /**
   * The raw tool input text received so far.
   *
   * This is used to continue input streaming when a message is persisted
   * and later resumed.
   */
  rawInput?: string;
  /** Encoding of `rawInput`. Defaults to JSON when omitted. */
  inputEncoding?: 'json' | 'text';
  output?: never;
  errorText?: never;
  callProviderMetadata?: ProviderMetadata;
  approval?: never;
} | {
  state: 'input-available';
  input: unknown;
  output?: never;
  errorText?: never;
  callProviderMetadata?: ProviderMetadata;
  approval?: never;
} | {
  state: 'approval-requested';
  input: unknown;
  output?: never;
  errorText?: never;
  callProviderMetadata?: ProviderMetadata;
  approval: {
    id: string;
    approved?: never;
    descriptor?: unknown;
    requestReason?: string;
    reason?: never;
    isAutomatic?: boolean;
    signature?: string;
    inputSchemaInput?: unknown;
  };
} | {
  state: 'approval-responded';
  input: unknown;
  output?: never;
  errorText?: never;
  callProviderMetadata?: ProviderMetadata;
  approval: {
    id: string;
    approved: boolean;
    descriptor?: unknown;
    requestReason?: string;
    reason?: string;
    isAutomatic?: boolean;
    signature?: string;
    inputSchemaInput?: unknown;
  };
} | {
  state: 'output-available';
  input: unknown;
  output: unknown;
  errorText?: never;
  callProviderMetadata?: ProviderMetadata;
  resultProviderMetadata?: ProviderMetadata;
  preliminary?: boolean;
  approval?: {
    id: string;
    approved: true;
    descriptor?: unknown;
    requestReason?: string;
    reason?: string;
    isAutomatic?: boolean;
    signature?: string;
    inputSchemaInput?: unknown;
  };
} | {
  state: 'output-error';
  input: unknown;
  output?: never;
  errorText: string;
  callProviderMetadata?: ProviderMetadata;
  resultProviderMetadata?: ProviderMetadata;
  approval?: {
    id: string;
    approved: true;
    descriptor?: unknown;
    requestReason?: string;
    reason?: string;
    isAutomatic?: boolean;
    signature?: string;
    inputSchemaInput?: unknown;
  };
} | {
  state: 'output-denied';
  input: unknown;
  output?: never;
  errorText?: never;
  callProviderMetadata?: ProviderMetadata;
  approval: {
    id: string;
    approved: false;
    descriptor?: unknown;
    requestReason?: string;
    reason?: string;
    isAutomatic?: boolean;
    signature?: string;
    inputSchemaInput?: unknown;
  };
});
```

## `EffectToolOptions`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Define a public Effect tool with schema, execution, and lifecycle callbacks.

```text
export type EffectToolOptions<Input, Output, Failure, Services, Context = ContextData> = ToolOptions<Input, Output, Failure, Services, Context> & ToolTypes<Input, Output, Context, Services>;
```

## `embed`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Request an embedding for one value with scoped start and end callbacks.

```text
declare const embed: <R extends Runtime = Runtime, Services = never>(options: HookOptions<Parameters<typeof sdk.embed<R>>[0], EmbeddingModel, sdk.EmbedStartEvent<R>, sdk.EmbedEndEvent<R>, Services>) => Effect.Effect<sdk.EmbedResult, AiSdkError, Services>;
```

## `Embedding`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Embedding.

```text
type Embedding = EmbeddingModelV4Embedding;
```

## `EmbeddingModel`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Accept a model registry ID or a supported embedding model handle.

```text
export type EmbeddingModel = string | EmbeddingModelV4 | legacy.EmbeddingModelV3 | legacy.EmbeddingModelV2<string>;
```

## `EmbeddingModelCallEndEvent`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Event fired when an individual embedding model call (doEmbed) completes.

Contains the embeddings, usage, and any warnings from the model response.

```text
type EmbeddingModelCallEndEvent = {
  /** Unique identifier for this embed call, used to correlate events. */
  readonly callId: string;
  /** Unique identifier for this individual doEmbed invocation, used to correlate start/finish within parallel chunks. */
  readonly embedCallId: string;
  /** Identifies the inner operation (e.g. 'ai.embed.doEmbed' or 'ai.embedMany.doEmbed'). */
  readonly operationId: string;
  /** The provider identifier. */
  readonly provider: string;
  /** The specific model identifier. */
  readonly modelId: string;
  /** The values that were embedded in this particular model call. */
  readonly values: Array<string>;
  /** The resulting embeddings from the model call. */
  readonly embeddings: Array<Embedding>;
  /** Token usage for this model call. */
  readonly usage: EmbeddingModelUsage;
};
```

## `EmbeddingModelCallStartEvent`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Event fired when an individual embedding model call (inner operation doEmbed) begins.

For `embed`, there is one call. For `embedMany`, there may be multiple
calls when values are chunked.

```text
type EmbeddingModelCallStartEvent = {
  /** Unique identifier for this embed call, used to correlate events. */
  readonly callId: string;
  /** Unique identifier for this individual doEmbed invocation, used to correlate start/finish within parallel chunks. */
  readonly embedCallId: string;
  /** Identifies the inner operation (e.g. 'ai.embed.doEmbed' or 'ai.embedMany.doEmbed'). */
  readonly operationId: string;
  /** The provider identifier. */
  readonly provider: string;
  /** The specific model identifier. */
  readonly modelId: string;
  /** The values being embedded in this particular model call. */
  readonly values: Array<string>;
  /** Requested output dimensions, when specified. */
  readonly dimensions?: number;
};
```

## `EmbeddingModelMiddleware`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Transform embedding parameters and override native call limits or execution.

```text
export type EmbeddingModelMiddleware<R = never> = Identity<EmbeddingModelV4> & {
    readonly overrideMaxEmbeddingsPerCall?: (options: {
        model: EmbeddingModelV4;
    }) => Middleware<R, number | undefined>;
    readonly overrideSupportsParallelCalls?: (options: {
        model: EmbeddingModelV4;
    }) => Middleware<R, boolean>;
    readonly transformParams?: (options: EmbeddingArgs) => Middleware<R, EmbeddingArgs['params']>;
    readonly wrapEmbed?: (options: EmbeddingArgs & {
        doEmbed: () => Effect.Effect<native.EmbeddingModelV4Result, AiSdkError>;
    }) => Middleware<R, native.EmbeddingModelV4Result>;
};
```

## `EmbeddingModelUsage`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Represents the number of tokens used in an embedding.

```text
type EmbeddingModelUsage = {
  /**
   * The number of tokens used in the embedding.
   */
  tokens: number;
};
```

## `EmbedEndEvent`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Event passed to the `onEnd` callback for embed and embedMany operations.

Called when the operation completes, after the embedding model returns.

```text
type EmbedEndEvent<RUNTIME_CONTEXT extends Context = Context> = {
  /** User-defined runtime context. */
  readonly runtimeContext: RUNTIME_CONTEXT;
  /** Unique identifier for this embed call, used to correlate events. */
  readonly callId: string;
  /** Identifies the operation type (e.g. 'ai.embed' or 'ai.embedMany'). */
  readonly operationId: string;
  /** The provider identifier (e.g., 'openai', 'anthropic'). */
  readonly provider: string;
  /** The specific model identifier (e.g., 'text-embedding-3-small'). */
  readonly modelId: string;
  /** The value(s) that were embedded. A string for embed, an array for embedMany. */
  readonly value: string | Array<string>;
  /** The resulting embedding(s). A single vector for embed, an array for embedMany. */
  readonly embedding: Embedding | Array<Embedding>;
  /** Token usage for the embedding operation. */
  readonly usage: EmbeddingModelUsage;
  /** Warnings from the embedding model, e.g. unsupported settings. */
  readonly warnings: Array<Warning>;
  /** Optional provider-specific metadata. */
  readonly providerMetadata: ProviderMetadata | undefined;
  /** Response data including headers and body. A single response for embed, an array for embedMany. */
  readonly response: {
    headers?: Record<string, string>;
    body?: unknown;
  } | Array<{
    headers?: Record<string, string>;
    body?: unknown;
  } | undefined> | undefined;
};
```

## `embedMany`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Request embeddings for a batch while preserving the SDK's input-order correspondence.

```text
declare const embedMany: <R extends Runtime = Runtime, Services = never>(options: HookOptions<Parameters<typeof sdk.embedMany<R>>[0], EmbeddingModel, sdk.EmbedStartEvent<R>, sdk.EmbedEndEvent<R>, Services>) => Effect.Effect<sdk.EmbedManyResult, AiSdkError, Services>;
```

## `EmbedManyResult`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

The result of an `embedMany` call.
It contains the embeddings, the values, and additional information.

```text
interface EmbedManyResult {
  /**
   * The values that were embedded.
   */
  readonly values: Array<string>;
  /**
   * The embeddings. They are in the same order as the values.
   */
  readonly embeddings: Array<Embedding>;
  /**
   * The embedding token usage.
   */
  readonly usage: EmbeddingModelUsage;
  /**
   * Warnings for the call, e.g. unsupported settings.
   */
  readonly warnings: Array<Warning>;
  /**
   * Optional provider-specific metadata.
   */
  readonly providerMetadata?: ProviderMetadata;
  /**
   * Optional raw response data.
   */
  readonly responses?: Array<{
    /**
     * Response headers.
     */
    headers?: Record<string, string>;
    /**
     * The response body.
     */
    body?: unknown;
  } | undefined>;
}
```

## `EmbedResult`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

The result of an `embed` call.
It contains the embedding, the value, and additional information.

```text
interface EmbedResult {
  /**
   * The value that was embedded.
   */
  readonly value: string;
  /**
   * The embedding of the value.
   */
  readonly embedding: Embedding;
  /**
   * The embedding token usage.
   */
  readonly usage: EmbeddingModelUsage;
  /**
   * Warnings for the call, e.g. unsupported settings.
   */
  readonly warnings: Array<Warning>;
  /**
   * Optional provider-specific metadata.
   */
  readonly providerMetadata?: ProviderMetadata;
  /**
   * Optional response data.
   */
  readonly response?: {
    /**
     * Response headers.
     */
    headers?: Record<string, string>;
    /**
     * The response body.
     */
    body?: unknown;
  };
}
```

## `EmbedStartEvent`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Event passed to the `onStart` callback for embed and embedMany operations.

Called when the operation begins, before the embedding model is called.

```text
type EmbedStartEvent<RUNTIME_CONTEXT extends Context = Context> = {
  /** User-defined runtime context. */
  readonly runtimeContext: RUNTIME_CONTEXT;
  /** Unique identifier for this embed call, used to correlate events. */
  readonly callId: string;
  /** Identifies the operation type (e.g. 'ai.embed' or 'ai.embedMany'). */
  readonly operationId: string;
  /** The provider identifier (e.g., 'openai', 'anthropic'). */
  readonly provider: string;
  /** The specific model identifier (e.g., 'text-embedding-3-small'). */
  readonly modelId: string;
  /** The value(s) being embedded. A string for embed, an array for embedMany. */
  readonly value: string | Array<string>;
  /** Requested output dimensions, when specified. */
  readonly dimensions?: number;
  /** Maximum number of retries for failed requests. */
  readonly maxRetries: number;
  /** Additional HTTP headers sent with the request. */
  readonly headers: Record<string, string | undefined> | undefined;
  /** Additional provider-specific options. */
  readonly providerOptions: ProviderOptions | undefined;
};
```

## `EmptyResponseBodyError`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Wrap a provider response with no body with the native arguments and expose its SDK type
guard.
Use the shared `AiSdkError` type for a provider response with no body.
`EmptyResponseBodyError.isInstance` checks its SDK cause.

```text
declare const EmptyResponseBodyError: {
    new (args_0?: {
        message?: string;
    } | undefined): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
};
```

```text
export type EmptyResponseBodyError = AiSdkError;
```

## `ErrorHandler`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Handle SDK errors through the operation's bound Effect context.

```text
export type ErrorHandler<S = never> = CoreCallback<sdk.ErrorHandler, S>;
```

## `Experimental_AbstractRealtimeSession`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Extend this wrapper to publish state changes while Effect owns connection setup and cleanup.

```text
export declare abstract class Experimental_AbstractRealtimeSession<R = never> {
    #private;
    private readonly options;
    /** Start with an empty disconnected snapshot before any native state updates arrive. */
    protected state: RealtimeState;
    /** Limit how many native session events the state snapshot retains. */
    protected maxEvents: number;
    /** Handle a native tool call with access to the current connection context. */
    onToolCall: Experimental_RealtimeSessionOptions<R>['onToolCall'];
    /** Observe realtime server events as they arrive on the active connection. */
    onEvent: Experimental_RealtimeSessionOptions<R>['onEvent'];
    /** Report native session errors through the caller's Effect handler. */
    onError: Experimental_RealtimeSessionOptions<R>['onError'];
    /** Store session options and initial callbacks without opening a transport. */
    constructor(options: Experimental_RealtimeSessionOptions<R>);
    /** Implement the notification path for native session state changes in a host adapter. */
    protected abstract setState<Key extends keyof RealtimeState>(key: Key, value: RealtimeState[Key]): void;
    /** Open one connection with native defaults under the caller's scope. */
    connect(): ConnectResult<R>;
    /** Open a connection with explicit transport options under the caller's scope. */
    connect(options: ConnectOptions): ConnectResult<R>;
    /** Disconnect the current transport and release its callback scope. */
    disconnect(): Effect.Effect<void, AiSdkError, never>;
    /** Close the native session with optional close settings and release its scope. */
    close(options?: CloseOptions): Effect.Effect<void, AiSdkError, never>;
    /** Send a native protocol event and expose any rejection through the Effect error channel. */
    sendEvent(event: ClientEvent): Effect.Effect<void, AiSdkError, never>;
    /** Add user text to the current realtime conversation. */
    sendTextMessage(text: string): Effect.Effect<void, AiSdkError, never>;
    /** Send one encoded audio chunk to the server's current input buffer. */
    sendAudio(audio: string): Effect.Effect<void, AiSdkError, never>;
    /** Commit buffered input audio to the server conversation. */
    commitAudio(): Effect.Effect<void, AiSdkError, never>;
    /** Clear the current server input buffer before sending replacement audio. */
    clearAudioBuffer(): Effect.Effect<void, AiSdkError, never>;
    /** Ask the server to generate a response with optional output settings. */
    requestResponse(options?: ResponseOptions): Effect.Effect<void, AiSdkError, never>;
    /** Request cancellation of the active server response. */
    cancelResponse(): Effect.Effect<void, AiSdkError, never>;
    /** Send a tool result to the server under the originating call identifier. */
    addToolOutput(callId: string, result: unknown): Effect.Effect<void, AiSdkError, never>;
    /** Capture audio from the supplied browser media stream. */
    startAudioCapture(stream: MediaStream): Effect.Effect<void, AiSdkError, never>;
    /** Resume native audio capture and report initialization failures through Effect. */
    resumeAudioCapture(): Effect.Effect<void, AiSdkError, never>;
    /** Stop the native input capture operation. */
    stopAudioCapture(): Effect.Effect<void, AiSdkError, never>;
    /** Stop playing the received realtime audio locally. */
    stopPlayback(): Effect.Effect<void, AiSdkError, never>;
    /** Resume local playback and expose native playback rejection through Effect. */
    resumePlayback(): Effect.Effect<void, AiSdkError, never>;
    /** Dispose of native session resources and close the callback scope. */
    dispose(): Effect.Effect<void, AiSdkError, never>;
}
```

## `Experimental_Agent`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

A tool loop that creates a private SDK agent for each execution.

```text
export declare class ToolLoopAgent<C = never, T extends EffectTools = {}, R extends RuntimeContext = RuntimeContext, A = string, P = A, I = never, Hook = never, Provided extends object = {}> {
    #private;
    /** Advertise the SDK protocol version used by consumers of an agent. */
    readonly version = "agent-v1";
    /** Register an agent factory that binds a fresh owner for each native consumer. */
    constructor(settings: AgentSettings<C, T, R, A, P, I, unknown> & Provided);
    /** Forward the configured agent identifier for host and UI adapters. */
    get id(): Omit<ToolLoopAgentSettings<C, BoundTools<T>, R, BoundOutput<A, P, I>>, "callOptionsSchema">["id"] | Omit<Omit<ToolLoopAgentSettings<C, BoundTools<T>, R, BoundOutput<A, P, I>>, "callOptionsSchema">, "output" | "model" | "tools">["id"] | undefined;
    /** Expose the public tool set so adapters can infer tool input and output. */
    get tools(): T;
    /** Run the configured agent to completion in a scope and return the adapted SDK result. */
    generate<CallHook = never, Call extends object = {}>(options: CoreOptions<Parameters<SdkToolLoopAgent<C, BoundTools<T>, R, BoundOutput<A, P, I>>['generate']>[0], unknown, T> & Call): Effect.Effect<import("ai").GenerateTextResult<BoundTools<T>, R, BoundOutput<A, P, I>>, import("./internal/operation.js").AiSdkError, Exclude<Hook, import("effect/Scope").Scope> | Exclude<CoreServices<Provided>, import("effect/Scope").Scope> | Exclude<import("./internal/tool.js").ToolRequirements<T[keyof T]>, import("effect/Scope").Scope> | Exclude<CallHook, import("effect/Scope").Scope> | Exclude<CoreServices<Call>, import("effect/Scope").Scope>>;
    /** Start a scoped generation and retain the owner until the stream ends or the caller closes it. */
    stream<CallHook = never, Call extends object = {}>(options: CoreOptions<Parameters<SdkToolLoopAgent<C, BoundTools<T>, R, BoundOutput<A, P, I>>['stream']>[0], unknown, T> & Call): Effect.Effect<import("./internal/text-stream.js").TextStreamResult<BoundTools<T>, R, BoundOutput<A, P, I>, import("ai").StreamTextResult<BoundTools<T>, R, BoundOutput<A, P, I>>>, import("./internal/operation.js").AiSdkError, import("effect/Scope").Scope | (Hook | CoreServices<Provided> | import("./internal/tool.js").ToolRequirements<T[keyof T]> | CallHook | CoreServices<Call>)>;
}
```

## `Experimental_AgentSettings`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Infer the reusable agent settings from the constructor's public adapter boundary.

```text
export type ToolLoopAgentSettings<C = never, T extends EffectTools = {}, R extends Context = Context, O extends Output = Output, S = never> = ConstructorParameters<typeof ToolLoopAgent<C, T, R, O extends OutputSpecification<infer A, unknown, unknown, unknown> ? A : never, O extends OutputSpecification<unknown, infer P, unknown, unknown> ? P : never, O extends OutputSpecification<unknown, unknown, infer I, unknown> ? I : never, S>>[0];
```

## `Experimental_Batch`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

A batch and its latest normalized lifecycle status.

```text
type Batch = BatchReference & BatchStatus;
```

## `Experimental_BatchError`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Serializable error information for a batch or batch item.

```text
type BatchError = Experimental_BatchV4Error;
```

## `Experimental_BatchItemResult`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Expose one batch outcome with Effect-adapted stream or deferred result fields.

```text
export type Experimental_BatchItemResult<Tools extends EffectTools = {}, Output = undefined> = PublicStreamPart<sdk.Experimental_BatchItemResult<BoundTools<Tools>, AppliedOutput<Output>>>;
```

## `Experimental_BatchProvider`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Accept a batch API handle directly or resolve it lazily from a provider.

```text
export type Experimental_BatchProvider<Ids extends BatchIds = BatchIds> = BatchV4<Ids> | {
    experimental_batch(): Effect.Effect<BatchV4<Ids>, AiSdkError>;
};
```

## `Experimental_BatchReference`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

The persisted reference for a batch.

```text
type BatchReference = {
  readonly version: 2;
  readonly id: string;
  readonly provider: string;
};
```

## `Experimental_BatchRequest`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Represent one request from the union of the SDK's batch request kinds.

```text
export type Experimental_BatchRequest<Ids extends BatchIds = BatchIds, Tools extends EffectTools = {}> = BatchInput<sdk.Experimental_BatchRequest<Ids, BoundTools<Tools>>, Tools>;
```

## `Experimental_BatchStatus`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

The latest normalized lifecycle status for a batch.

```text
type BatchStatus = Experimental_BatchV4Status;
```

## `experimental_cancelBatch`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Ask the configured batch provider to cancel a submitted job.

```text
declare const experimental_cancelBatch: (options: BatchOptions<NativeBatchCancelOptions>) => Effect.Effect<sdk.Experimental_CancelBatchResult, AiSdkError, never>;
```

## `Experimental_CancelBatchOptions`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Accept a batch provider handle or accessor alongside the native cancellation options.

```text
export type Experimental_CancelBatchOptions = BatchOptions<NativeBatchCancelOptions>;
```

## `Experimental_CancelBatchResult`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Result of requesting cancellation of a batch.

```text
type CancelBatchResult = {
  readonly providerMetadata?: ProviderMetadata;
};
```

## `experimental_createProviderRegistry`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Keep the original experimental spelling available for registry consumers.

```text
declare const experimental_createProviderRegistry: CreateProviderRegistry;
```

## `experimental_createSteering`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Create an Effect handle for a single generation's steering queue.

```text
declare const createSteering: () => Effect.Effect<Steering, AiSdkError, never>;
```

## `experimental_decide`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Evaluate keyed questions through a registered model and retain the inferred answer keys.

```text
declare const experimental_decide: <const Q extends Questions, C extends SdkContext = SdkContext, R = never>(options: ExperimentalOptions<NativeDecisionOptions<Q, C>, Experimental_DecisionModel, R>) => Effect.Effect<sdk.Experimental_DecisionResult<Q>, AiSdkError, R>;
```

## `Experimental_DecideEndEvent`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Event passed to the `onEnd` callback for decision operations.

Called when the operation completes successfully.

```text
type DecideEndEvent<RUNTIME_CONTEXT extends Context = Context> = DecideStartEvent<RUNTIME_CONTEXT> & {
  /** Exactly one typed answer per question ID. */
  readonly answers: DecisionResult<Record<string, Experimental_DecisionModelV4Question>>['answers'];
  /** Token usage for the decision operation. */
  readonly usage: DecisionResult<Record<string, Experimental_DecisionModelV4Question>>['usage'];
  /** Warnings from the decision model. */
  readonly warnings: DecisionResult<Record<string, Experimental_DecisionModelV4Question>>['warnings'];
  /** Provider-declared decimal precision for probabilities and scores. */
  readonly rounding: DecisionResult<Record<string, Experimental_DecisionModelV4Question>>['rounding'];
  /** Optional provider-specific metadata. */
  readonly providerMetadata: DecisionResult<Record<string, Experimental_DecisionModelV4Question>>['providerMetadata'];
  /** Response metadata, including the resolved model ID and timestamp. */
  readonly response: DecisionResult<Record<string, Experimental_DecisionModelV4Question>>['response'];
};
```

## `Experimental_DecideStartEvent`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Event passed to the `onStart` callback for decision operations.

Called when the operation begins, before the decision model is called.

```text
type DecideStartEvent<RUNTIME_CONTEXT extends Context = Context> = {
  /** User-defined runtime context. */
  readonly runtimeContext: RUNTIME_CONTEXT;
  /** Unique identifier for this decision call, used to correlate events. */
  readonly callId: string;
  /** Identifies the operation type (`ai.decide`). */
  readonly operationId: 'ai.decide';
  /** The provider identifier. */
  readonly provider: string;
  /** The decision model identifier. */
  readonly modelId: string;
  /** The shared state used to make decisions. */
  readonly state: DecisionState;
  /** The questions to decide against the shared state. */
  readonly questions: Readonly<Record<string, Experimental_DecisionModelV4Question>>;
  /** Maximum output tokens requested for the decision. */
  readonly maxOutputTokens?: number;
  /** Reasoning effort requested for the decision. */
  readonly reasoning?: Experimental_DecisionModelV4CallOptions['reasoning'];
  /** Maximum number of retries for the decision model call. */
  readonly maxRetries: number;
  /** Additional HTTP headers sent with the request. */
  readonly headers: Record<string, string> | undefined;
  /** Additional provider-specific options. */
  readonly providerOptions: ProviderOptions;
};
```

## `Experimental_DecisionAnswer`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type DecisionAnswer<QUESTION extends Experimental_DecisionModelV4Question> = QUESTION extends {
  type: 'choice';
  criteria: infer CRITERIA;
} ? {
  type: 'choice';
  choice: Extract<keyof CRITERIA, string>;
  probabilities?: Record<Extract<keyof CRITERIA, string>, number>;
} : QUESTION extends {
  type: 'score';
} ? {
  type: 'score';
  score: number;
  probabilities?: Record<string, number>;
} : QUESTION extends {
  type: 'box';
} ? {
  type: 'box';
  box: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
} : {
  type: 'boolean';
  probability: number;
};
```

## `Experimental_DecisionMockModelV4`

**Import:** `@jambudipa/ai-effect/ai/test`.
**Kind:** value, type.

Simulate decision model responses without requesting a remote model.
Use the registered decision test model when testing a decision request.

```text
declare const Experimental_DecisionMockModelV4: <Services = never>(options?: MockOptions<{
    provider?: string;
    modelId?: string;
    supportedQuestionTypes?: import("@ai-sdk/provider").Experimental_DecisionModelV4["supportedQuestionTypes"];
    doDecide?: import("@ai-sdk/provider").Experimental_DecisionModelV4["doDecide"];
    doEvaluate?: import("@ai-sdk/provider").Experimental_DecisionModelV4["doDecide"];
}, Services> | undefined) => Effect.Effect<{
    supportedQuestionTypes: readonly ("boolean" | "choice" | "score" | "box")[];
    doDecide: (options: models.Experimental_DecisionModelV4CallOptions) => Effect.Effect<models.Experimental_DecisionModelV4Result, AiSdkError, never>;
    specificationVersion: "v4";
    provider: string;
    modelId: string;
} & {
    doEvaluate: (options: models.Experimental_DecisionModelV4CallOptions) => Effect.Effect<models.Experimental_DecisionModelV4Result, AiSdkError, never>;
} & {
    readonly model: {
        supportedQuestionTypes: readonly ("boolean" | "choice" | "score" | "box")[];
        doDecide: (options: models.Experimental_DecisionModelV4CallOptions) => Effect.Effect<models.Experimental_DecisionModelV4Result, AiSdkError, never>;
        specificationVersion: "v4";
        provider: string;
        modelId: string;
    } & {
        doEvaluate: (options: models.Experimental_DecisionModelV4CallOptions) => Effect.Effect<models.Experimental_DecisionModelV4Result, AiSdkError, never>;
    };
} & Readonly<Pick<sdk.Experimental_DecisionMockModelV4, never>>, AiSdkError, import("effect/Scope").Scope | Services>;
```

```text
export type Experimental_DecisionMockModelV4 = Effect.Success<ReturnType<typeof Experimental_DecisionMockModelV4>>;
```

## `Experimental_DecisionModel`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Select a decision model by registry ID or by a registered version 4 handle.

```text
export type Experimental_DecisionModel = string | DecisionModelV4;
```

## `Experimental_DecisionModelCallEndEvent`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Event fired after the decision model response has been validated.

Contains the result of the logical model call, including any retries.

```text
type DecisionModelCallEndEvent = DecisionModelCallStartEvent & {
  /** Exactly one answer per question ID. */
  readonly answers: Experimental_DecisionModelV4Result['answers'];
  /** Token usage reported by the decision model. */
  readonly usage?: Experimental_DecisionModelV4Result['usage'];
  /** Warnings from the decision model. */
  readonly warnings: Experimental_DecisionModelV4Result['warnings'];
  /** Provider-declared decimal precision for probabilities and scores. */
  readonly rounding?: Experimental_DecisionModelV4Result['rounding'];
  /** Optional provider-specific metadata. */
  readonly providerMetadata?: Experimental_DecisionModelV4Result['providerMetadata'];
  /** Optional raw response metadata from the provider. */
  readonly response?: Experimental_DecisionModelV4Result['response'];
};
```
