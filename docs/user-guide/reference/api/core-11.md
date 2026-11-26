---
title: Core API reference 11
doc-type: reference
sources:
  [
    src/core-chat.ts,
    src/core-contracts.ts,
    src/core-data.ts,
    src/core-errors.ts,
    src/core-models.ts,
    src/core-providers.ts,
    src/core-telemetry.ts,
    src/core.ts,
    src/index.ts,
    src/internal/chat-agent.ts,
    src/internal/chat-ui-stream.ts,
    src/internal/chat-validation.ts,
    src/internal/output.ts,
    src/protocols/provider-utils-operations.ts,
    src/testing.ts,
  ]
---

# Core API reference 11

> **TL;DR:** Public core and test declarations from `OnToolExecutionStartCallback` to `SafeValidateUIMessagesResult`. Each entry lists its package import and declaration.

## `OnToolExecutionStartCallback`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Observe a tool call before its handler begins, with typed tool input.

```text
export type OnToolExecutionStartCallback<T extends EffectTools = EffectTools, S = never> = CoreCallback<sdk.OnToolExecutionStartCallback<BoundTools<T>>, S, T>;
```

## `Output`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Construct the SDK's output modes without exposing the SDK parser.

```text
declare const Output: {
    text: () => Effect.Effect<OutputSpecification<string, string, never, never>, AiSdkError, never>;
    json: (options?: NamedOutput) => Effect.Effect<OutputSpecification<import("@ai-sdk/provider").JSONValue, import("@ai-sdk/provider").JSONValue, never, never>, AiSdkError, never>;
    choice: <Choice extends string>(options: NamedOutput & {
        readonly options: Array<Choice>;
    }) => Effect.Effect<OutputSpecification<Choice, Choice, never, never>, AiSdkError, never>;
    object: StructuredOutput<"object">;
    array: StructuredOutput<"array">;
};
```

## `OutputChunkTimingStats`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Timing statistics for the gaps between generated output chunks.

```text
type OutputChunkTimingStats = {
  /** Shortest observed time between output chunks in milliseconds. */
  readonly min: number;
  /** 10th percentile time between output chunks in milliseconds. */
  readonly p10: number;
  /** Median time between output chunks in milliseconds. */
  readonly median: number;
  /** Average time between output chunks in milliseconds. */
  readonly avg: number;
  /** 90th percentile time between output chunks in milliseconds. */
  readonly p90: number;
  /** Longest observed time between output chunks in milliseconds. */
  readonly max: number;
};
```

## `OutputInterface`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Describe output parsing for complete values, partial values, and stream items.

```text
export type OutputInterface<A = unknown, P = A, I = never, R = never> = OutputSpecification<A, P, I, R>;
```

## `OutputSpecification`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

An output format with Effect operations for its parser and lazy values.

```text
export interface OutputSpecification<Complete, Partial = Complete, Element = never, Services = never> {
    /** Identify the output strategy by the name the SDK uses when parsing a response. */
    readonly name: string;
    /** Resolve the provider response format in the caller's Effect context. */
    readonly responseFormat: Effect.Effect<Awaited<OutputInterface['responseFormat']>, AiSdkError, Services>;
    /** Parse a completed native response and map adapter failure to `AiSdkError`. */
    readonly parseCompleteOutput: (...args: Parameters<OutputInterface['parseCompleteOutput']>) => Effect.Effect<Complete, AiSdkError, Services>;
    /** Parse the current response prefix and preserve the native indication that it is incomplete. */
    readonly parsePartialOutput: (...args: Parameters<OutputInterface['parsePartialOutput']>) => Effect.Effect<{
        partial: Partial;
    } | undefined, AiSdkError, Services>;
    /** Create the optional native transform that emits complete elements during streaming. */
    readonly createElementStreamTransform: () => Effect.Effect<ReturnType<OutputInterface<Complete, Partial, Element>['createElementStreamTransform']>, AiSdkError, Scope.Scope | Services>;
}
```

## `parseJsonEventStream`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Decode JSON events against an Effect schema and keep the schema environment for the
stream lifetime.

```text
declare const parseJsonEventStream: <A, R = never>(options: {
    readonly stream: ReadableStream<Uint8Array>;
    readonly schema: Schema.ConstraintDecoder<A, R>;
}) => Stream.Stream<EventResult<A>, AiSdkError, Exclude<R, import("effect/Scope").Scope>>;
```

## `parsePartialJson`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Parse an incomplete JSON response and preserve the SDK repair outcome for streaming callers.

```text
declare const parsePartialJson: (jsonText?: string) => Effect.Effect<{
    value: import("@ai-sdk/provider").JSONValue | undefined;
    state: "undefined-input" | "successful-parse" | "repaired-parse" | "failed-parse";
}, AiSdkError, never>;
```

## `pipeAgentUIStreamToResponse`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Pipe agent UI events to a Node response and keep the operation alive until streaming ends.

```text
declare const pipeAgentUIStreamToResponse: <C = never, T extends EffectTools = {}, R extends Runtime = Runtime, A = string, P = A, I = never, Message extends AgentMessage<T> = AgentMessage<T>, Services = never>({ response, headers, status, statusText, keepAliveMs, consumeSseStream, ...options }: AgentUIMessageStreamOptions<C, T, R, A, P, I, Message, Services> & Omit<UiHostOptions<never, Services>, "stream"> & {
    readonly response: ServerResponse;
}) => Effect.Effect<void, import("./operation.js").AiSdkError, Exclude<Services, import("effect/Scope").Scope> | Exclude<import("./tool.js").ToolRequirements<T[keyof T]>, import("effect/Scope").Scope> | Exclude<Exclude<Services, import("effect/Scope").Scope>, import("effect/Scope").Scope>>;
```

## `pipeTextStreamToResponse`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Write a text stream to a Node response under the pipe's scope.

```text
declare const pipeTextStreamToResponse: <R>({ stream, ...options }: TextHostOptions<R> & {
    readonly response: ServerResponse;
}) => Effect.Effect<void, AiSdkError, Exclude<R, import("effect/Scope").Scope>>;
```

## `pipeUIMessageStreamToResponse`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Pipe UI chunks to a Node response and retain the optional SSE consumer until completion.

```text
declare const pipeUIMessageStreamToResponse: <R, CallbackServices>({ stream, consumeSseStream, ...options }: UiHostOptions<R, CallbackServices> & {
    readonly response: ServerResponse;
}) => Effect.Effect<void, AiSdkError, Exclude<R, import("effect/Scope").Scope> | Exclude<CallbackServices, import("effect/Scope").Scope>>;
```

## `PrepareReconnectToStreamRequest`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Customize an HTTP reconnect request in the same context as the transport.

```text
export type PrepareReconnectToStreamRequest<R = never> = (options: HttpRequest) => CallbackResult<HttpReconfiguration, R>;
```

## `PrepareSendMessagesRequest`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Customize an outgoing message request using its trigger, history, and optional Effect services.

```text
export type PrepareSendMessagesRequest<Message extends UIMessage = UIMessage, R = never> = (options: HttpSend<Message>) => CallbackResult<HttpReconfiguration & {
    readonly body: object;
}, R>;
```

## `PrepareStepFunction`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Compute per-step settings before the agent loop submits its next request.

```text
export type PrepareStepFunction<T extends EffectTools, R extends Context = Context, S = never> = CoreCallback<sdk.PrepareStepFunction<BoundTools<T>, R>, S, T>;
```

## `PrepareStepResult`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Apply a step-specific settings override while preserving public model and tool inputs.

```text
export type PrepareStepResult<T extends EffectTools, R extends Context = Context> = CoreEvent<sdk.PrepareStepResult<BoundTools<T>, R>, T>;
```

## `PrepareWebSocketChatTransportReconnectToStreamRequest`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Adapt the socket request when reconnecting to a previous response stream.

```text
export type PrepareWebSocketChatTransportReconnectToStreamRequest<R = never> = (request: SocketSettings) => CallbackResult<{
    body?: object;
    headers?: HeadersInit;
}, R>;
```

## `PrepareWebSocketChatTransportSendMessagesRequest`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Adapt the outgoing socket request before sending UI history and its triggering message ID.

```text
export type PrepareWebSocketChatTransportSendMessagesRequest<Message extends UIMessage = UIMessage, R = never> = (request: SocketSend<Message>) => CallbackResult<{
    messages?: Message[];
    body?: object;
    headers?: HeadersInit;
}, R>;
```

## `Prompt`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Prompt part of the AI function options.
It contains instructions, a simple text prompt, or a list of messages.

```text
type Prompt = {
  /**
   * Instructions to include in the prompt. Can be used with `prompt` or `messages`.
   */
  instructions?: Instructions;
  /**
   * Instructions to include in the prompt. Can be used with `prompt` or `messages`.
   *
   * @deprecated Use `instructions` instead.
   */
  system?: Instructions;
  /**
   * Whether system messages are allowed in the `prompt` or `messages` fields.
   *
   * When disabled, system messages must be provided through the `instructions`
   * option.
   *
   * @default false
   */
  allowSystemInMessages?: boolean;
} & ({
  /**
   * A prompt. It can be either a text prompt or a list of messages.
   *
   * You can either use `prompt` or `messages` but not both.
   */
  prompt: string | Array<ModelMessage>;
  /**
   * A list of messages.
   *
   * You can either use `prompt` or `messages` but not both.
   */
  messages?: never;
} | {
  /**
   * A list of messages.
   *
   * You can either use `prompt` or `messages` but not both.
   */
  messages: Array<ModelMessage>;
  /**
   * A prompt. It can be either a text prompt or a list of messages.
   *
   * You can either use `prompt` or `messages` but not both.
   */
  prompt?: never;
});
```

## `Provider`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Accept the native provider protocol versions that the adapters can bind.

```text
export type Provider = ProviderV2 | ProviderV3 | ProviderV4;
```

## `ProviderMetadata`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Additional provider-specific metadata that is returned from the provider.

This is needed to enable provider-specific functionality that can be
fully encapsulated in the provider.

```text
type ProviderMetadata = SharedV4ProviderMetadata;
```

## `ProviderReference`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type ProviderReference = SharedV4ProviderReference;
```

## `ProviderRegistryProvider`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Route model IDs by provider prefix and expose file or skill lookups by provider name.

```text
export interface ProviderRegistryProvider<Providers extends ProviderMap = ProviderMap, Separator extends string = ':'> {
    /** Resolve a provider-qualified language model ID under the registry's separator rules. */
    readonly languageModel: RegistrySelector<Providers, Separator, 'languageModel', ReturnType<typeof wrapLanguageModel>>;
    /** Resolve a provider-qualified embedding model ID before sending values to the model. */
    readonly embeddingModel: RegistrySelector<Providers, Separator, 'embeddingModel', ReturnType<typeof wrapEmbeddingModel>>;
    /** Resolve a provider-qualified image model ID before image generation. */
    readonly imageModel: RegistrySelector<Providers, Separator, 'imageModel', ReturnType<typeof wrapImageModel>>;
    /** Resolve a provider-qualified transcription model ID for an audio-to-text request. */
    readonly transcriptionModel: RegistrySelector<Providers, Separator, 'transcriptionModel', ReturnType<typeof wrapTranscriptionModel>>;
    /** Resolve a provider-qualified speech model ID for synthesized audio. */
    readonly speechModel: RegistrySelector<Providers, Separator, 'speechModel', ReturnType<typeof wrapSpeechModel>>;
    /** Resolve a provider-qualified reranking model ID for document scoring. */
    readonly rerankingModel: RegistrySelector<Providers, Separator, 'rerankingModel', ReturnType<typeof wrapRerankingModel>>;
    /** Resolve a provider-qualified video model ID before starting generation. */
    readonly videoModel: RegistrySelector<Providers, Separator, 'videoModel', ReturnType<typeof wrapVideoModel>>;
    /** Resolve the named provider's registered file API without a model ID. */
    readonly files: (provider: Names<Providers>) => Effect.Effect<FilesV4Handle, AiSdkError>;
    /** Resolve the named provider's registered skill API without a model ID. */
    readonly skills: (provider: Names<Providers>) => Effect.Effect<SkillsV4Handle, AiSdkError>;
}
```

## `pruneMessages`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Trim message context with the SDK's reasoning, tool, and empty-message rules.

```text
declare const pruneMessages: (options: Parameters<typeof sdk.pruneMessages>[0]) => Effect.Effect<sdk.ModelMessage[], AiSdkError, never>;
```

## `readUIMessageStream`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Reconstruct UI messages from a Web or Effect message stream.

```text
declare const readUIMessageStream: <Message extends UIMessage = UIMessage, R = never, CallbackServices = never>({ stream, onError, ...options }: {
    readonly message?: Message;
    readonly stream: StreamInput<UIMessageChunk, R>;
    readonly onError?: (cause: AiSdkError) => CallbackResult<void, CallbackServices>;
    readonly terminateOnError?: boolean;
}) => Stream.Stream<Message, AiSdkError, Exclude<R, import("effect/Scope").Scope> | Exclude<CallbackServices, import("effect/Scope").Scope>>;
```

## `ReasoningFileOutput`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Reasoning file output of a text generation.
It contains a file generated as part of reasoning.

```text
interface ReasoningFileOutput {
  type: 'reasoning-file';
  /**
   * The generated file.
   */
  file: GeneratedFile;
  /**
   * Additional provider-specific metadata. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerMetadata?: ProviderMetadata;
}
```

## `ReasoningFileUIPart`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

A reasoning file part of a message.

```text
type ReasoningFileUIPart = {
  type: 'reasoning-file';
  /**
   * IANA media type of the file.
   *
   * @see https://www.iana.org/assignments/media-types/media-types.xhtml
   */
  mediaType: string;
  /**
   * The URL of the file.
   * It can either be a URL to a hosted file or a [Data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs).
   */
  url: string;
  /**
   * The provider metadata.
   */
  providerMetadata?: ProviderMetadata;
};
```

## `ReasoningOutput`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Reasoning output of a text generation. It contains a reasoning.

```text
interface ReasoningOutput {
  type: 'reasoning';
  /**
   * The reasoning text.
   */
  text: string;
  /**
   * Additional provider-specific metadata. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerMetadata?: ProviderMetadata;
}
```

## `ReasoningUIPart`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

A reasoning part of a message.

```text
type ReasoningUIPart = {
  type: 'reasoning';
  /**
   * The reasoning part ID.
   */
  id?: string;
  /**
   * The reasoning text.
   */
  text: string;
  /**
   * The state of the reasoning part.
   */
  state?: 'streaming' | 'done';
  /**
   * The provider metadata.
   */
  providerMetadata?: ProviderMetadata;
};
```

## `registerTelemetry`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Register telemetry hooks for the lifetime of the caller's Scope.

```text
export declare function registerTelemetry(...integrations: readonly Telemetry[]): Effect.Effect<void, import("./internal/operation.js").AiSdkError, import("effect/Scope").Scope>;
```

## `RepairTextFunction`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Repair text before structured parsing retries, using the bound Effect context if needed.

```text
export type RepairTextFunction<S = never> = CoreCallback<sdk.RepairTextFunction, S>;
```

## `RequestOptions`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Preserve SDK request options and bind tool-related fields to the public tool set.

```text
export type RequestOptions<T extends EffectTools = EffectTools> = CoreOptions<sdk.RequestOptions<BoundTools<T>>, never, T>;
```

## `rerank`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Rank documents by their relevance to a query and retain their inferred document type.

```text
declare const rerank: <Document extends string | JSONObject, R extends Runtime = Runtime, Services = never>(options: HookOptions<Parameters<typeof sdk.rerank<Document, R>>[0], RerankingModel, sdk.RerankStartEvent<R>, sdk.RerankEndEvent<R>, Services>) => Effect.Effect<sdk.RerankResult<Document>, AiSdkError, Services>;
```

## `RerankEndEvent`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Event passed to the `onEnd` callback for rerank operations.

Called when the operation completes, after the reranking model returns.

```text
type RerankEndEvent<RUNTIME_CONTEXT extends Context = Context> = {
  /** User-defined runtime context. */
  readonly runtimeContext: RUNTIME_CONTEXT;
  /** Unique identifier for this rerank call, used to correlate events. */
  readonly callId: string;
  /** Identifies the operation type ('ai.rerank'). */
  readonly operationId: string;
  readonly provider: string;
  /** The specific model identifier (e.g., 'gpt-4o'). */
  readonly modelId: string;
  /** The documents that were reranked. */
  readonly documents: Array<JSONObject | string>;
  /** The query that documents were reranked against. */
  readonly query: string;
  /** The reranked results sorted by relevance score in descending order. */
  readonly ranking: Array<{
    originalIndex: number;
    score: number;
    document: JSONObject | string;
  }>;
  /** Warnings from the reranking model. */
  readonly warnings: Array<Warning>;
  /** Optional provider-specific metadata. */
  readonly providerMetadata: ProviderMetadata | undefined;
  /** Response data including headers and body. */
  readonly response: {
    id?: string;
    timestamp: Date;
    modelId: string;
    headers?: Record<string, string>;
    body?: unknown;
  };
};
```

## `RerankingModel`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Accept a model registry ID or a supported document reranking handle.

```text
export type RerankingModel = string | RerankingModelV4 | legacy.RerankingModelV3;
```

## `RerankingModelCallEndEvent`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Event fired when an individual reranking model call (doRerank) completes.

Contains the ranking results from the model response.

```text
type RerankingModelCallEndEvent = {
  /** Unique identifier for this rerank call, used to correlate events. */
  readonly callId: string;
  /** Identifies the inner operation ('ai.rerank.doRerank'). */
  readonly operationId: string;
  /** The provider identifier. */
  readonly provider: string;
  /** The specific model identifier. */
  readonly modelId: string;
  /** The type of documents ('text' or 'object'). */
  readonly documentsType: string;
  /** The ranking results from the model. */
  readonly ranking: Array<{
    index: number;
    relevanceScore: number;
  }>;
};
```

## `RerankingModelCallStartEvent`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Event fired when an individual reranking model call (inner doRerank) begins.

```text
type RerankingModelCallStartEvent = {
  /** Unique identifier for this rerank call, used to correlate events. */
  readonly callId: string;
  /** Identifies the inner operation ('ai.rerank.doRerank'). */
  readonly operationId: string;
  /** The provider identifier. */
  readonly provider: string;
  /** The specific model identifier. */
  readonly modelId: string;
  /** The documents being reranked. */
  readonly documents: Array<JSONObject | string>;
  /** The type of documents ('text' or 'object'). */
  readonly documentsType: string;
  /** The query to rerank against. */
  readonly query: string;
  /** Number of top documents to return. */
  readonly topN: number | undefined;
};
```

## `RerankResult`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

The result of a `rerank` call.
It contains the original documents, the reranked documents, and additional information.

```text
interface RerankResult<VALUE> {
  /**
   * The original documents that were reranked.
   */
  readonly originalDocuments: Array<VALUE>;
  /**
   * Reranked documents.
   *
   * Sorted by relevance score in descending order.
   *
   * Can be less than the original documents if there was a topN limit.
   */
  readonly rerankedDocuments: Array<VALUE>;
  /**
   * The ranking is a list of objects with the original index,
   * relevance score, and the reranked document.
   *
   * Sorted by relevance score in descending order.
   *
   * Can be less than the original documents if there was a topN limit.
   */
  readonly ranking: Array<{
    originalIndex: number;
    score: number;
    document: VALUE;
  }>;
  /**
   * Optional provider-specific metadata.
   */
  readonly providerMetadata?: ProviderMetadata;
  /**
   * Optional raw response data.
   */
  readonly response: {
    /**
     * ID for the generated response if the provider sends one.
     */
    id?: string;
    /**
     * Timestamp of the generated response.
     */
    timestamp: Date;
    /**
     * The ID of the model that was used to generate the response.
     */
    modelId: string;
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

## `RerankStartEvent`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Event passed to the `onStart` callback for rerank operations.

Called when the operation begins, before the reranking model is called.

```text
type RerankStartEvent<RUNTIME_CONTEXT extends Context = Context> = {
  /** User-defined runtime context. */
  readonly runtimeContext: RUNTIME_CONTEXT;
  /** Unique identifier for this rerank call, used to correlate events. */
  readonly callId: string;
  /** Identifies the operation type ('ai.rerank'). */
  readonly operationId: string;
  readonly provider: string;
  /** The specific model identifier (e.g., 'gpt-4o'). */
  readonly modelId: string;
  /** The documents being reranked. */
  readonly documents: Array<JSONObject | string>;
  /** The query to rerank the documents against. */
  readonly query: string;
  /** Number of top documents to return. */
  readonly topN: number | undefined;
  /** Maximum number of retries for failed requests. */
  readonly maxRetries: number;
  /** Additional HTTP headers sent with the request. */
  readonly headers: Record<string, string | undefined> | undefined;
  /** Additional provider-specific options. */
  readonly providerOptions: ProviderOptions | undefined;
};
```

## `RetryError`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Construct or identify the wrapped SDK failure for a request failure after the SDK stops retrying.
Shared Effect error type used for a request failure after the SDK stops retrying.

```text
declare const RetryError: {
    new (args_0: {
        message: string;
        reason: "abort" | "maxRetriesExceeded" | "errorNotRetryable";
        errors: Array<unknown>;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
};
```

```text
export type RetryError = AiSdkError;
```

## `safeValidateUIMessages`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Validate saved or submitted UI messages using the active Effect services.

```text
declare const safeValidateUIMessages: <Message extends UIMessage = UIMessage, R = never>({ messages, metadataSchema, dataSchemas, tools, experimental_refineToolInput, }: ValidateUIMessagesOptions<Message, R>) => Effect.Effect<SafeValidateUIMessagesResult<Message>, AiSdkError, Exclude<R, import("effect/Scope").Scope>>;
```

## `SafeValidateUIMessagesResult`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Keep validation failure in a result value while retaining successful typed messages.

```text
export type SafeValidateUIMessagesResult<Message extends UIMessage = UIMessage> = {
    readonly success: true;
    readonly data: Message[];
} | {
    readonly success: false;
    readonly error: AiSdkError;
};
```
