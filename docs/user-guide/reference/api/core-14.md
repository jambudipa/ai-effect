---
title: Core API reference 14
doc-type: reference
sources:
  [
    src/core-contracts.ts,
    src/core-data.ts,
    src/core-errors.ts,
    src/core-message-schema.ts,
    src/core-models.ts,
    src/core-tools.ts,
    src/core.ts,
    src/index.ts,
    src/internal/chat-ui-stream.ts,
    src/internal/chat-validation.ts,
    src/protocols/provider-errors.ts,
    src/testing.ts,
  ]
---

# Core API reference 14

> **TL;DR:** Public core and test declarations from `toolSearch` to `UITools`. Each entry lists its package import and declaration.

## `toolSearch`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Construct a search tool with optional result limits and an Effect lookup callback.

```text
declare const toolSearch: <R = never>(options?: {
    readonly search?: ToolSearchFunction<R>;
    readonly maxResults?: number;
}) => Effect.Effect<{
    inputSchema: Schema.Struct<{
        readonly query: Schema.String;
    }>;
    outputSchema: Schema.Struct<{
        readonly tools: Schema.$Array<Schema.Struct<{
            readonly name: Schema.String;
            readonly description: Schema.optional<Schema.String>;
        }>>;
    }>;
    execute: (_input: typeof searchInput.Type) => Effect.Effect<typeof searchOutput.Type, unknown, R>;
    description?: string;
    type: "function";
}, import("./internal/operation.js").AiSdkError, never>;
```

## `ToolSearchFunction`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Search for eligible tools through Effect in the operation's service context.

```text
export type ToolSearchFunction<R = never> = (...args: Parameters<NativeSearch>) => Effect.Effect<Awaited<ReturnType<NativeSearch>>, unknown, R>;
```

## `ToolSet`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Register tools keyed by the names that the model may request.

```text
export type ToolSet = EffectTools;
```

## `ToolUIPart`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type ToolUIPart<TOOLS extends UITools = UITools> = ValueOf<{ [NAME in keyof TOOLS & string]: {
  type: `tool-${NAME}`;
} & UIToolInvocation<TOOLS[NAME]>; }>;
```

## `TooManyEmbeddingValuesForCallError`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Wrap an embedding request that exceeds the model input count per call with the native
arguments and expose its SDK type guard.
Use the shared `AiSdkError` type for an embedding request that exceeds the model input
count per call. `TooManyEmbeddingValuesForCallError.isInstance` checks its SDK cause.

```text
declare const TooManyEmbeddingValuesForCallError: {
    new (options: {
        provider: string;
        modelId: string;
        maxEmbeddingsPerCall: number;
        values: Array<unknown>;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
};
```

```text
export type TooManyEmbeddingValuesForCallError = AiSdkError;
```

## `toTextStream`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Extract text deltas from an event stream without changing its error or service types.

```text
declare const toTextStream: <E, R>({ stream, }: {
    readonly stream: Stream.Stream<TextEvent, E, R>;
}) => Stream.Stream<string, E, R>;
```

## `toUIMessageChunk`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Convert one model event. Return None for events without a UI representation.

```text
declare const toUIMessageChunk: <T extends EffectTools = {}, Message extends UIMessage = UIMessage>(part: TextStreamPart<BoundTools<T>>, { tools, onError, ...options }?: ToUIMessageChunkOptions<T, Message>) => Effect.Effect<Option.Option<{
    type: "text-start";
    id: string;
    providerMetadata?: import("ai").ProviderMetadata;
} | {
    type: "text-delta";
    delta: string;
    id: string;
    providerMetadata?: import("ai").ProviderMetadata;
} | {
    type: "text-end";
    citations?: Array<import("ai").Citation>;
    id: string;
    providerMetadata?: import("ai").ProviderMetadata;
} | {
    type: "reasoning-start";
    id: string;
    providerMetadata?: import("ai").ProviderMetadata;
} | {
    type: "reasoning-delta";
    id: string;
    delta: string;
    providerMetadata?: import("ai").ProviderMetadata;
} | {
    type: "reasoning-end";
    id: string;
    providerMetadata?: import("ai").ProviderMetadata;
} | {
    type: "custom";
    kind: `${string}.${string}`;
    providerMetadata?: import("ai").ProviderMetadata;
} | {
    type: "error";
    errorText: string;
} | {
    type: "tool-input-available";
    toolCallId: string;
    toolName: string;
    input: unknown;
    providerExecuted?: boolean;
    providerMetadata?: import("ai").ProviderMetadata;
    toolMetadata?: import("@ai-sdk/provider").JSONObject;
    dynamic?: boolean;
    title?: string;
} | {
    type: "tool-input-error";
    toolCallId: string;
    toolName: string;
    input: unknown;
    providerExecuted?: boolean;
    providerMetadata?: import("ai").ProviderMetadata;
    toolMetadata?: import("@ai-sdk/provider").JSONObject;
    dynamic?: boolean;
    errorText: string;
    title?: string;
} | {
    type: "tool-approval-request";
    approvalId: string;
    toolCallId: string;
    approvalDescriptor?: unknown;
    inputSchemaInput?: unknown;
    reason?: string;
    isAutomatic?: boolean;
    signature?: string;
} | {
    type: "tool-approval-response";
    approvalId: string;
    approved: boolean;
    reason?: string;
    providerExecuted?: boolean;
    providerMetadata?: import("ai").ProviderMetadata;
} | {
    type: "tool-output-available";
    toolCallId: string;
    output: unknown;
    providerExecuted?: boolean;
    providerMetadata?: import("ai").ProviderMetadata;
    toolMetadata?: import("@ai-sdk/provider").JSONObject;
    dynamic?: boolean;
    preliminary?: boolean;
} | {
    type: "tool-output-error";
    toolCallId: string;
    errorText: string;
    providerExecuted?: boolean;
    providerMetadata?: import("ai").ProviderMetadata;
    toolMetadata?: import("@ai-sdk/provider").JSONObject;
    dynamic?: boolean;
} | {
    type: "tool-output-denied";
    toolCallId: string;
} | {
    type: "tool-input-start";
    toolCallId: string;
    toolName: string;
    inputEncoding?: "json" | "text";
    providerExecuted?: boolean;
    providerMetadata?: import("ai").ProviderMetadata;
    toolMetadata?: import("@ai-sdk/provider").JSONObject;
    dynamic?: boolean;
    title?: string;
} | {
    type: "tool-input-delta";
    toolCallId: string;
    inputTextDelta: string;
} | {
    type: "source-url";
    sourceId: string;
    url: string;
    title?: string;
    providerMetadata?: import("ai").ProviderMetadata;
} | {
    type: "source-document";
    sourceId: string;
    mediaType: string;
    title: string;
    filename?: string;
    providerMetadata?: import("ai").ProviderMetadata;
} | {
    type: "file";
    url: string;
    mediaType: string;
    providerMetadata?: import("ai").ProviderMetadata;
} | {
    type: "reasoning-file";
    url: string;
    mediaType: string;
    providerMetadata?: import("ai").ProviderMetadata;
} | {
    type: "steering-message";
    id: string;
    parts: Array<import("ai").TextUIPart | import("ai").FileUIPart>;
} | {
    type: "start-step";
} | {
    type: "finish-step";
} | {
    type: "reset-step";
} | {
    type: "abort";
    reason?: string;
} | {
    type: "start";
    messageId?: string;
    messageMetadata?: Message extends UIMessage<infer METADATA, import("ai").UIDataTypes, import("ai").UITools> ? METADATA : unknown;
} | {
    type: "finish";
    finishReason?: import("ai").FinishReason;
    messageMetadata?: Message extends UIMessage<infer METADATA, import("ai").UIDataTypes, import("ai").UITools> ? METADATA : unknown;
} | {
    type: "message-metadata";
    messageMetadata: Message extends UIMessage<infer METADATA, import("ai").UIDataTypes, import("ai").UITools> ? METADATA : unknown;
} | Exclude<{ [NAME in keyof (Message extends UIMessage<unknown, infer DATA_TYPES extends import("ai").UIDataTypes, import("ai").UITools> ? DATA_TYPES : import("ai").UIDataTypes) & string]: {
    type: `data-${NAME}`;
    id?: string;
    data: (Message extends UIMessage<unknown, infer DATA_TYPES extends import("ai").UIDataTypes, import("ai").UITools> ? DATA_TYPES : import("ai").UIDataTypes)[NAME];
    transient?: boolean;
}; }[keyof (Message extends UIMessage<unknown, infer DATA_TYPES extends import("ai").UIDataTypes, import("ai").UITools> ? DATA_TYPES : import("ai").UIDataTypes) & string], undefined>>, AiSdkError, Exclude<import("./tool.js").ToolRequirements<T[keyof T]>, import("effect/Scope").Scope>>;
```

## `ToUIMessageChunkOptions`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Keep the UI stream options relevant to converting typed model events into one UI chunk sequence.

```text
export type ToUIMessageChunkOptions<T extends EffectTools = {}, Message extends UIMessage = UIMessage> = Pick<UIMessageStreamOptions<Message, never>, 'sendReasoning' | 'sendSources' | 'sendStart' | 'sendFinish' | 'redactToolErrors' | 'onError'> & {
    readonly tools?: T;
    readonly messageMetadata?: MessageMetadata<Message>;
    readonly responseMessageId?: string;
};
```

## `toUIMessageStream`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Convert model stream events into UI chunks with scoped callbacks.

```text
declare const toUIMessageStream: <T extends EffectTools = {}, Message extends UIMessage = UIMessage, StreamServices = never, CallbackServices = never>({ stream, tools, ...options }: UIMessageStreamOptions<Message, CallbackServices> & {
    readonly stream: StreamInput<TextStreamPart<BoundTools<T>>, StreamServices>;
    readonly tools?: T;
}) => Stream.Stream<InferUIMessageChunk<Message>, AiSdkError, Exclude<StreamServices, import("effect/Scope").Scope> | Exclude<CallbackServices, import("effect/Scope").Scope> | Exclude<import("./tool.js").ToolRequirements<T[keyof T]>, import("effect/Scope").Scope>>;
```

## `transcribe`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Transcribe audio and preserve native segments and response metadata.

```text
declare const transcribe: <R = never>(options: Options<Parameters<typeof sdk.transcribe>[0], TranscriptionModel, R>) => Effect.Effect<sdk.TranscriptionResult, AiSdkError, R>;
```

## `TranscriptionEndEvent`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type TranscriptionEndEvent = TranscriptionEndEventFor<'ai.transcribe'> & {
  /** Word timings returned by the provider, whether requested or returned by default. */
  readonly words?: Array<{
    readonly text: string;
    readonly startSecond: number;
    readonly endSecond: number;
  }>;
};
```

## `TranscriptionModel`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Accept a model registry ID or a supported transcription model handle.

```text
export type TranscriptionModel = string | TranscriptionModelV4 | legacy.TranscriptionModelV3 | legacy.TranscriptionModelV2;
```

## `TranscriptionModelResponseMetadata`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type TranscriptionModelResponseMetadata = {
  /**
   * Timestamp for the start of the generated response.
   */
  timestamp: Date;
  /**
   * The ID of the response model that was used to generate the response.
   */
  modelId: string;
  /**
   * Response headers.
   */
  headers?: Record<string, string>;
};
```

## `TranscriptionResult`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

The result of a `transcribe` call.
It contains the transcript and additional information.

```text
interface TranscriptionResult {
  /**
   * The complete transcribed text from the audio.
   */
  readonly text: string;
  /**
   * Array of transcript segments with timing information.
   * Each segment represents a portion of the transcribed text with start and end times.
   * Segments retain the provider's behavior and may represent individual words.
   */
  readonly segments: Array<{
    /**
     * The text content of this segment.
     */
    readonly text: string;
    /**
     * The start time of this segment in seconds.
     */
    readonly startSecond: number;
    /**
     * The end time of this segment in seconds.
     */
    readonly endSecond: number;
  }>;
  /**
   * Word-level timings returned by the provider, whether explicitly requested
   * or returned by default. Undefined when the provider does not return them.
   */
  readonly words?: Array<{
    /**
     * The text of this word.
     */
    readonly text: string;
    /**
     * The start time of this word in seconds.
     */
    readonly startSecond: number;
    /**
     * The end time of this word in seconds.
     */
    readonly endSecond: number;
  }>;
  /**
   * The detected language of the audio content, as an ISO-639-1 code (e.g., 'en' for English).
   * May be undefined if the language couldn't be detected.
   */
  readonly language: string | undefined;
  /**
   * The total duration of the audio file in seconds.
   * May be undefined if the duration couldn't be determined.
   */
  readonly durationInSeconds: number | undefined;
  /**
   * Warnings for the call, e.g. unsupported settings.
   */
  readonly warnings: Array<Warning>;
  /**
   * Response metadata from the provider. There may be multiple responses if we made multiple calls to the model.
   */
  readonly responses: Array<TranscriptionModelResponseMetadata>;
  /**
   * Provider metadata from the provider.
   */
  readonly providerMetadata: Record<string, JSONObject>;
}
```

## `TranscriptionStartEvent`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type TranscriptionStartEvent = TranscriptionStartEventFor<'ai.transcribe'> & {
  /** Requested shared timing granularities, when specified. */
  readonly timestampGranularities?: Array<TranscriptionModelV4TimestampGranularity>;
};
```

## `TranscriptionStreamPart`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type TranscriptionStreamPart = {
  type: 'transcript-delta';
  id?: string;
  delta: string;
  providerMetadata?: SharedV4ProviderMetadata;
} | {
  type: 'transcript-partial';
  id?: string;
  text: string;
  startSecond?: number;
  durationInSeconds?: number;
  channelIndex?: number;
  providerMetadata?: SharedV4ProviderMetadata;
} | {
  type: 'transcript-final';
  id?: string;
  text: string;
  startSecond?: number;
  endSecond?: number;
  channelIndex?: number;
  providerMetadata?: SharedV4ProviderMetadata;
} | {
  type: 'raw';
  rawValue: unknown;
} | {
  type: 'error';
  error: unknown;
};
```

## `TypedToolCall`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

A tool call returned by text generation, either statically typed from the
declared tool set or dynamically typed when the tool cannot be inferred.

```text
type TypedToolCall<TOOLS extends ToolSet> = StaticToolCall<TOOLS> | DynamicToolCall;
```

## `TypedToolError`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type TypedToolError<TOOLS extends ToolSet> = StaticToolError<TOOLS> | DynamicToolError;
```

## `TypedToolOutputDenied`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Tool output when the tool execution has been denied.

```text
type TypedToolOutputDenied<TOOLS extends ToolSet> = StaticToolOutputDenied<TOOLS>;
```

## `TypedToolResult`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type TypedToolResult<TOOLS extends ToolSet> = StaticToolResult<TOOLS> | DynamicToolResult;
```

## `TypeValidationError`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Construct or wrap a validation failure while preserving the SDK cause for the type
guard.
Use the shared `AiSdkError` type for validation failures. Inspect the cause with
`TypeValidationError.isInstance`.

```text
declare const TypeValidationError: {
    new (args_0: {
        value: unknown;
        cause: unknown;
        context?: sdk.TypeValidationContext;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
} & {
    wrap: (options: Parameters<typeof sdk.TypeValidationError.wrap>[0]) => import("effect/Effect").Effect<AiSdkError, AiSdkError, never>;
};
```

```text
export type TypeValidationError = AiSdkError;
```

## `UI_MESSAGE_STREAM_HEADERS`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Supply the standard UI stream headers as an immutable snapshot.

```text
declare const UI_MESSAGE_STREAM_HEADERS: Readonly<{
    'content-type': string;
    'cache-control': string;
    connection: string;
    'x-vercel-ai-ui-message-stream': string;
    'x-accel-buffering': string;
}>;
```

## `UIDataPartSchemas`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Associate a validation schema with each named application data part.

```text
export type UIDataPartSchemas<Data extends UIDataTypes = UIDataTypes, R = never> = {
    readonly [Name in keyof Data & string]?: FlexibleSchema<Data[Name], R>;
};
```

## `UIDataTypes`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

The data types that can be used in the UI message for the UI message data parts.

```text
type UIDataTypes = Record<string, unknown>;
```

## `UIMessage`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

AI SDK UI Messages. They are used in the client and to communicate between the frontend and the API routes.

```text
interface UIMessage<METADATA = unknown, DATA_PARTS extends UIDataTypes = UIDataTypes, TOOLS extends UITools = UITools> {
  /**
   * A unique identifier for the message.
   */
  id: string;
  /**
   * The role of the message.
   */
  role: 'system' | 'user' | 'assistant';
  /**
   * The metadata of the message.
   */
  metadata?: METADATA;
  /**
   * The parts of the message. Use this for rendering the message in the UI.
   *
   * System messages should be avoided (set the system prompt on the server instead).
   * They can have text parts.
   *
   * User messages can have text parts and file parts.
   *
   * Assistant messages can have text, reasoning, tool invocation, and file parts.
   */
  parts: Array<UIMessagePart<DATA_PARTS, TOOLS>>;
}
```

## `UIMessageChunk`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type UIMessageChunk<METADATA = unknown, DATA_TYPES extends UIDataTypes = UIDataTypes> = {
  type: 'text-start';
  id: string;
  providerMetadata?: ProviderMetadata;
} | {
  type: 'text-delta';
  delta: string;
  id: string;
  providerMetadata?: ProviderMetadata;
} | {
  type: 'text-end';
  citations?: Array<Citation>;
  id: string;
  providerMetadata?: ProviderMetadata;
} | {
  type: 'reasoning-start';
  id: string;
  providerMetadata?: ProviderMetadata;
} | {
  type: 'reasoning-delta';
  id: string;
  delta: string;
  providerMetadata?: ProviderMetadata;
} | {
  type: 'reasoning-end';
  id: string;
  providerMetadata?: ProviderMetadata;
} | {
  type: 'custom';
  kind: `${string}.${string}`;
  providerMetadata?: ProviderMetadata;
} | {
  type: 'error';
  errorText: string;
} | {
  type: 'tool-input-available';
  toolCallId: string;
  toolName: string;
  input: unknown;
  providerExecuted?: boolean;
  providerMetadata?: ProviderMetadata;
  toolMetadata?: JSONObject;
  dynamic?: boolean;
  title?: string;
} | {
  type: 'tool-input-error';
  toolCallId: string;
  toolName: string;
  input: unknown;
  providerExecuted?: boolean;
  providerMetadata?: ProviderMetadata;
  toolMetadata?: JSONObject;
  dynamic?: boolean;
  errorText: string;
  title?: string;
} | {
  type: 'tool-approval-request';
  approvalId: string;
  toolCallId: string;
  approvalDescriptor?: unknown;
  inputSchemaInput?: unknown;
  reason?: string;
  isAutomatic?: boolean;
  signature?: string;
} | {
  type: 'tool-approval-response';
  approvalId: string;
  approved: boolean;
  reason?: string;
  providerExecuted?: boolean;
  providerMetadata?: ProviderMetadata;
} | {
  type: 'tool-output-available';
  toolCallId: string;
  output: unknown;
  providerExecuted?: boolean;
  providerMetadata?: ProviderMetadata;
  toolMetadata?: JSONObject;
  dynamic?: boolean;
  preliminary?: boolean;
} | {
  type: 'tool-output-error';
  toolCallId: string;
  errorText: string;
  providerExecuted?: boolean;
  providerMetadata?: ProviderMetadata;
  toolMetadata?: JSONObject;
  dynamic?: boolean;
} | {
  type: 'tool-output-denied';
  toolCallId: string;
} | {
  type: 'tool-input-start';
  toolCallId: string;
  toolName: string;
  /** Encoding of the input deltas. Defaults to JSON when omitted. */
  inputEncoding?: 'json' | 'text';
  providerExecuted?: boolean;
  providerMetadata?: ProviderMetadata;
  toolMetadata?: JSONObject;
  dynamic?: boolean;
  title?: string;
} | {
  type: 'tool-input-delta';
  toolCallId: string;
  inputTextDelta: string;
} | {
  type: 'source-url';
  sourceId: string;
  url: string;
  title?: string;
  providerMetadata?: ProviderMetadata;
} | {
  type: 'source-document';
  sourceId: string;
  mediaType: string;
  title: string;
  filename?: string;
  providerMetadata?: ProviderMetadata;
} | {
  type: 'file';
  url: string;
  mediaType: string;
  providerMetadata?: ProviderMetadata;
} | {
  type: 'reasoning-file';
  url: string;
  mediaType: string;
  providerMetadata?: ProviderMetadata;
} | DataUIMessageChunk<DATA_TYPES> | {
  /**
   * Experimental. A user message that was added to the run with steering.
   */
  type: 'steering-message';
  id: string;
  parts: Array<TextUIPart | FileUIPart>;
} | {
  type: 'start-step';
} | {
  type: 'finish-step';
} | {
  /**
   * Removes all message parts added during the current step.
   */
  type: 'reset-step';
} | {
  type: 'start';
  messageId?: string;
  messageMetadata?: METADATA;
} | {
  type: 'finish';
  finishReason?: FinishReason;
  messageMetadata?: METADATA;
} | {
  type: 'abort';
  reason?: string;
} | {
  type: 'message-metadata';
  messageMetadata: METADATA;
};
```

## `uiMessageChunkSchema`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Resolve the native UI chunk schema only when the caller runs this effect.

```text
declare const uiMessageChunkSchema: () => Effect.Effect<import("./core-schema.js").Schema<sdk.UIMessageChunk<unknown, sdk.UIDataTypes>, never>, never, never>;
```

## `UIMessagePart`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type UIMessagePart<DATA_TYPES extends UIDataTypes, TOOLS extends UITools> = TextUIPart | CustomContentUIPart | ReasoningUIPart | ToolUIPart<TOOLS> | DynamicToolUIPart | SourceUrlUIPart | SourceDocumentUIPart | FileUIPart | ReasoningFileUIPart | DataUIPart<DATA_TYPES> | SteeringMessageUIPart | StepStartUIPart;
```

## `UIMessageStreamError`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Construct or identify the wrapped SDK failure for a failure while processing a UI message stream.
Shared Effect error type used for a failure while processing a UI message stream.

```text
declare const UIMessageStreamError: {
    new (args_0: {
        chunkType: string;
        chunkId: string;
        message: string;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
};
```

```text
export type UIMessageStreamError = AiSdkError;
```

## `UIMessageStreamOnEndCallback`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Observe the UI stream's final state and adapted success or failure outcome.

```text
export type UIMessageStreamOnEndCallback<Message extends UIMessage = UIMessage, R = never> = (event: EndEvent<Message>) => CallbackResult<void, R>;
```

## `UIMessageStreamOnFinishCallback`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
export type UIMessageStreamOnFinishCallback<Message extends UIMessage = UIMessage, R = never> = UIMessageStreamOnEndCallback<Message, R>;
```

## `UIMessageStreamOnStepEndCallback`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Observe the UI stream state after a generation step finishes.

```text
export type UIMessageStreamOnStepEndCallback<Message extends UIMessage = UIMessage, R = never> = (event: StepEvent<Message>) => CallbackResult<void, R>;
```

## `UIMessageStreamOnStepFinishCallback`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
export type UIMessageStreamOnStepFinishCallback<Message extends UIMessage = UIMessage, R = never> = UIMessageStreamOnStepEndCallback<Message, R>;
```

## `UIMessageStreamOptions`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Configure how the SDK reconstructs messages and emits UI chunks.

```text
export type UIMessageStreamOptions<Message extends UIMessage = UIMessage, R = never> = UiLifecycle<Message, R> & {
    readonly generateMessageId?: () => string;
    readonly messageMetadata?: (options: {
        part: TextStreamPart<ToolSet>;
    }) => MessageMetadata<Message> | undefined;
    readonly sendReasoning?: boolean;
    readonly sendSources?: boolean;
    readonly sendStart?: boolean;
    readonly sendFinish?: boolean;
    readonly redactToolErrors?: boolean;
};
```

## `UIMessageStreamOutcome`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

The operation-level outcome of a UI message stream.

This is separate from model finish reasons and individual stream chunks.
Fatal stream-processing failures override outcomes declared by the stream
owner.

Consumer cancellation before an outcome is declared keeps the `unknown`
status and is reported separately through the end callback's `isCancelled`
property.

```text
type UIMessageStreamOutcome = {
  status: 'completed';
} | {
  status: 'failed';
  error?: unknown;
} | {
  status: 'aborted';
} | {
  status: 'unknown';
};
```

## `UIMessageStreamWriter`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Expose an Effect writer for producing or merging typed UI chunks.

```text
export interface UIMessageStreamWriter<Message extends UIMessage = UIMessage> {
    /** Enqueue one typed part in the UI message stream. */
    readonly write: (part: InferUIMessageChunk<Message>) => Effect.Effect<void, AiSdkError>;
    /** Copy another stream's chunks into the current native writer with its Effect services available. */
    readonly merge: <R>(stream: StreamInput<InferUIMessageChunk<Message>, R>) => Effect.Effect<void, AiSdkError, R>;
    /** Offer the native writer's error handler when the SDK provides one. */
    readonly onError?: (cause: unknown) => Effect.Effect<void, AiSdkError>;
}
```

## `UIMessageStreamWriterWithOutcome`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Allow a producer to record its terminal outcome along with its UI chunks.

```text
export interface UIMessageStreamWriterWithOutcome<Message extends UIMessage = UIMessage> extends UIMessageStreamWriter<Message> {
    /** Set the outcome the SDK lifecycle hook observes when the writer finishes. */
    readonly setOutcome: (outcome: UIMessageStreamOutcome) => Effect.Effect<void, AiSdkError>;
}
```

## `UITool`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type UITool = {
  input: unknown;
  output: unknown | undefined;
};
```

## `UIToolInvocation`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

A UI tool invocation contains all the information needed to render a tool invocation in the UI.
It can be derived from a tool without knowing the tool name, and can be used to define
UI components for the tool.

```text
type UIToolInvocation<TOOL extends UITool | Tool> = {
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
  input?: DeepPartial<asUITool<TOOL>['input']> | undefined;
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
  input: asUITool<TOOL>['input'];
  output?: never;
  errorText?: never;
  callProviderMetadata?: ProviderMetadata;
  approval?: never;
} | {
  state: 'approval-requested';
  input: asUITool<TOOL>['input'];
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
  input: asUITool<TOOL>['input'];
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
  input: asUITool<TOOL>['input'];
  output: asUITool<TOOL>['output'];
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
  input: asUITool<TOOL>['input'] | undefined;
  /**
   * @deprecated Use `input` instead. This field will be removed in the next
   * major version.
   */
  rawInput?: unknown;
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
  input: asUITool<TOOL>['input'];
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

## `UITools`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type UITools = Record<string, UITool>;
```
