---
title: Core API reference 06
doc-type: reference
sources:
  [
    src/core-contracts.ts,
    src/core-experimental.ts,
    src/core-middleware.ts,
    src/core-models.ts,
    src/core-schema.ts,
    src/core-stream-operations.ts,
    src/core-tools.ts,
    src/core.ts,
    src/index.ts,
    src/internal/steering.ts,
    src/protocols/provider-utils-operations.ts,
    src/testing.ts,
  ]
---

# Core API reference 06

> **TL;DR:** Public core and test declarations from `Experimental_SandboxProcess` to `FlexibleSchema`. Each entry lists its package import and declaration.

## `Experimental_SandboxProcess`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Type the process handle produced by spawning in an acquired sandbox session.

```text
export type Experimental_SandboxProcess = Effect.Success<ReturnType<SandboxSession['spawn']>>;
```

## `Experimental_SandboxSession`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Use an acquired sandbox session through Effect-managed operations.

```text
export type Experimental_SandboxSession = SandboxSession;
```

## `Experimental_SpeechResult`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type Experimental_SpeechResult = SpeechResult;
```

## `Experimental_SpeechStreamPart`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type SpeechStreamPart = {
  /**
   * Audio chunk in generation order. Chunks are not necessarily
   * standalone files; concatenate them to reconstruct the audio. A chunk
   * is empty only when it carries `providerMetadata` (e.g. a turn marker).
   */
  type: 'audio';
  id?: string;
  audio: Uint8Array;
  audioFormat: SharedV4AudioFormat;
  providerMetadata?: SharedV4ProviderMetadata;
} | {
  type: 'raw';
  rawValue: unknown;
} | {
  type: 'error';
  error: unknown;
};
```

## `Experimental_SpeechStreamUsage`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type SpeechStreamUsage = Experimental_SpeechModelV4StreamUsage;
```

## `Experimental_SpeechTextPart`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

A piece of text to synthesize. Pass a stream of these (or mix them with
plain strings) to give parts their own voice, e.g. for dialogue.

```text
type SpeechTextPart = {
  type: 'text';
  text: string;
  /**
   * The voice that speaks this part (provider-specific, like the call's
   * `voice`). Single-voice providers reject a voice that differs from the
   * call's voice.
   */
  voice?: string;
  /**
   * Additional provider-specific options for this part.
   */
  providerOptions?: ProviderOptions;
};
```

## `experimental_startBatch`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Submit batch requests after binding tools and optional structured output within a shared scope.

```text
declare const experimental_startBatch: <Ids extends BatchIds = BatchIds, Tools extends EffectTools = {}, A = string, P = string, I = never, R = never>(options: StartBatchOptions<Ids, Tools, A, P, I, R>) => Effect.Effect<sdk.Experimental_BatchReference & import("@ai-sdk/provider").Experimental_BatchV4Status & {
    readonly warnings: import("@ai-sdk/provider").Experimental_BatchV4StartResult["warnings"];
}, AiSdkError, R | import("./internal/tool.js").ToolRequirements<Tools[keyof Tools]>>;
```

## `Experimental_StartBatchOptions`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Infer valid batch submission options from the selected provider, tools, and output parser.

```text
export type Experimental_StartBatchOptions<Tools extends EffectTools = {}, Provider = Experimental_BatchProvider, R = never> = StartBatchOptions<ProviderModelIds<Provider>, Tools, unknown, unknown, unknown, R>;
```

## `Experimental_StartBatchResult`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

The acknowledged batch and warnings produced while starting it.

```text
type StartBatchResult = Batch & {
  readonly warnings: Experimental_BatchV4StartResult['warnings'];
};
```

## `experimental_startVideo`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Submit a video generation job and return the SDK reference for subsequent status calls.

```text
declare const experimental_startVideo: (options: ExperimentalOptions<NativeStartVideoOptions, VideoModel, never>) => Effect.Effect<sdk.StartVideoResult, AiSdkError, never>;
```

## `Experimental_Steering`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Expose SDK steering operations for an active generation or stream.

```text
export interface Steering {
    /** Submit a message for the next decision point with optional current-step interruption. */
    readonly steer: (message: string | UserModelMessage, options?: {
        readonly id?: string;
        readonly interrupt?: boolean;
    }) => Effect.Effect<SteeringOutcome, AiSdkError>;
    /** Queue a message for processing without requesting an immediate interruption. */
    readonly queue: (message: string | UserModelMessage, options?: {
        readonly id?: string;
    }) => Effect.Effect<SteeringOutcome, AiSdkError>;
}
```

## `Experimental_SteeringMessageUIPart`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Experimental. A user message that was added to the run with steering while
the assistant message was generated. It is placed before the output of the
step that received it.

```text
type SteeringMessageUIPart = {
  type: 'steering-message';
  /**
   * The id of the steering message.
   */
  id: string;
  /**
   * The content of the user message.
   */
  parts: Array<TextUIPart | FileUIPart>;
};
```

## `Experimental_SteeringNotDeliveredReason`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Why a steering message was not delivered:

- `finished`: the run ended before the message could be delivered.
- `removed-by-prepare-step`: `prepareStep` returned messages without it.
- `stop-condition`: a stop condition ended the run.
- `waiting-for-tool-results`: the run ended to wait for tool results,
  e.g. a tool approval or a tool without an `execute` function.
- `aborted`: the run was aborted.
- `error`: the run failed.

```text
type SteeringNotDeliveredReason = 'finished' | 'removed-by-prepare-step' | 'stop-condition' | 'waiting-for-tool-results' | 'aborted' | 'error';
```

## `Experimental_SteeringOutcome`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

The outcome of a steering message.

```text
type SteeringOutcome = {
  readonly type: 'delivered';
  /** The id of the steering message. */
  readonly id: string;
  /** The user message that was added to the run. */
  readonly message: UserModelMessage;
  /** The number of the step whose model call received the message. */
  readonly stepNumber: number;
} | {
  readonly type: 'not-delivered';
  /** The id of the steering message. */
  readonly id: string;
  /** The user message that was not added to the run. */
  readonly message: UserModelMessage;
  /** Why the message was not delivered. */
  readonly reason: SteeringNotDeliveredReason;
};
```

## `experimental_streamLanguageModelCall`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Stream one native model call without a tool execution loop.

```text
declare const experimental_streamLanguageModelCall: <T extends EffectTools = {}, A = string, P = A, I = never, R = never, OutputServices = never>({ model, tools, output, download, experimental_sandbox, repairToolCall, refineToolInput, executeLanguageModelCallInTelemetryContext, onStart, onLanguageModelCallStart, onLanguageModelCallEnd, ...options }: StreamLanguageModelCallOptions<T, A, P, I, R, OutputServices>) => Effect.Effect<{
    stream: Stream.Stream<{
        type: "text-start";
        id: string;
        providerMetadata?: import("ai").ProviderMetadata;
    } | {
        type: "text-end";
        citations?: Array<import("ai").Citation>;
        id: string;
        providerMetadata?: import("ai").ProviderMetadata;
    } | {
        type: "text-delta";
        id: string;
        providerMetadata?: import("ai").ProviderMetadata;
        text: string;
    } | {
        type: "reasoning-start";
        id: string;
        providerMetadata?: import("ai").ProviderMetadata;
    } | {
        type: "reasoning-end";
        id: string;
        providerMetadata?: import("ai").ProviderMetadata;
    } | {
        type: "reasoning-delta";
        providerMetadata?: import("ai").ProviderMetadata;
        id: string;
        text: string;
    } | {
        type: "custom";
        kind: `${string}.${string}`;
        providerMetadata?: import("ai").ProviderMetadata;
    } | {
        type: "tool-input-start";
        id: string;
        toolName: string;
        inputEncoding?: "json" | "text";
        providerMetadata?: import("ai").ProviderMetadata;
        toolMetadata?: import("@ai-sdk/provider").JSONObject;
        providerExecuted?: boolean;
        dynamic?: boolean;
        title?: string;
    } | {
        type: "tool-input-end";
        id: string;
        providerMetadata?: import("ai").ProviderMetadata;
    } | {
        type: "tool-input-delta";
        id: string;
        delta: string;
        providerMetadata?: import("ai").ProviderMetadata;
    } | ({
        type: "source";
    } & import("@ai-sdk/provider").LanguageModelV4Source) | {
        type: "file";
        file: import("ai").GeneratedFile;
        providerMetadata?: import("ai").ProviderMetadata;
    } | {
        type: "reasoning-file";
        file: import("ai").GeneratedFile;
        providerMetadata?: import("ai").ProviderMetadata;
    } | {
        type: "ping";
    } | {
        type: "raw";
        rawValue: unknown;
    } | {
        type: "model-call-end";
        finishReason: import("ai").FinishReason;
        rawFinishReason: string | undefined;
        usage: import("ai").LanguageModelUsage;
        providerMetadata?: import("ai").ProviderMetadata;
        performance: {
            responseTimeMs: number;
            effectiveOutputTokensPerSecond: number;
            outputTokensPerSecond: number | undefined;
            inputTokensPerSecond: number | undefined;
            effectiveTotalTokensPerSecond: number;
            timeToFirstOutputMs: number | undefined;
            timeBetweenOutputChunksMs?: import("ai").OutputChunkTimingStats;
        };
    } | {
        type: "model-call-start";
        warnings: Array<import("ai").CallWarning>;
    } | {
        type: "model-call-response-metadata";
        id?: string;
        timestamp?: Date;
        modelId?: string;
    } | ({
        type: "tool-call";
    } & import("ai").TypedToolCall<BoundTools<T>>) | ({
        type: "tool-result";
    } & import("ai").TypedToolResult<BoundTools<T>>) | ({
        type: "tool-error";
    } & import("ai").TypedToolError<BoundTools<T>>) | {
        type: "tool-approval-request";
        approvalId: string;
        toolCall: import("ai").TypedToolCall<BoundTools<T>>;
        reason?: string;
        isAutomatic?: boolean;
        signature?: string;
    } | {
        type: "tool-approval-response";
        approvalId: string;
        toolCall: import("ai").TypedToolCall<BoundTools<T>>;
        approved: boolean;
        reason?: string;
        providerExecuted?: boolean;
    }, AiSdkError, never>;
    request?: {
        url?: string;
        body?: unknown;
    };
    response?: {
        headers?: import("@ai-sdk/provider").SharedV4Headers;
    };
}, AiSdkError, import("effect/Scope").Scope | R | OutputServices | import("./internal/tool.js").ToolRequirements<T[keyof T]>>;
```

## `experimental_streamSpeech`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Open a scoped speech synthesis stream using the requested registered model.

```text
declare const experimental_streamSpeech: <R = never>(options: ExperimentalOptions<NativeStreamSpeechOptions, SpeechModel, R>) => Effect.Effect<Experimental_StreamSpeechResult, AiSdkError, R | Scope.Scope>;
```

## `Experimental_StreamSpeechResult`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Expose incremental speech data and deferred synthesis metadata through Effect.

```text
export type Experimental_StreamSpeechResult = PublicStreamResult<ReturnType<typeof sdk.experimental_streamSpeech>>;
```

## `experimental_streamTextLowMemory`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Stream text with the SDK's single-consumer buffering mode.

```text
declare const experimental_streamTextLowMemory: <T extends EffectTools = {}, R extends RuntimeContext = RuntimeContext, A = string, P = A, I = never, Hook = never, Provided extends object = {}>(options: StreamOptions<T, R, A, P, I, unknown> & Provided) => Effect.Effect<import("./internal/text-stream.js").StreamTextSingleConsumerResult<BoundTools<T>, R, BoundOutput<A, P, I>>, import("./internal/operation.js").AiSdkError, import("effect/Scope").Scope | (Hook | CoreServices<Provided>) | import("./internal/tool.js").ToolRequirements<T[keyof T]>>;
```

## `experimental_streamTranscribe`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Open a scoped transcription stream and preserve the SDK's audio input options.

```text
declare const experimental_streamTranscribe: <R = never>(options: ExperimentalOptions<NativeStreamTranscribeOptions, TranscriptionModel, R>) => Effect.Effect<StreamTranscriptionResult, AiSdkError, R | Scope.Scope>;
```

## `Experimental_StreamTranscriptionEndEvent`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type StreamTranscriptionEndEvent = TranscriptionEndEventFor<'ai.streamTranscribe'>;
```

## `Experimental_StreamTranscriptionStartEvent`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type StreamTranscriptionStartEvent = TranscriptionStartEventFor<'ai.streamTranscribe'>;
```

## `experimental_streamTranslate`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Open a scoped audio translation stream through a supported translation model.

```text
declare const experimental_streamTranslate: <R = never>(options: ExperimentalOptions<NativeStreamTranslateOptions, SpeechTranslationModel, R>) => Effect.Effect<Experimental_StreamTranslationResult, AiSdkError, R | Scope.Scope>;
```

## `Experimental_StreamTranslationResult`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Expose live translation data and deferred metadata through Effect.

```text
export type Experimental_StreamTranslationResult = PublicStreamResult<ReturnType<typeof sdk.experimental_streamTranslate>>;
```

## `Experimental_TextBatchGenerationResult`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Preserve typed tool data in the SDK's text generation result for a batch item.

```text
export type Experimental_TextBatchGenerationResult<Tools extends EffectTools = {}> = sdk.Experimental_TextBatchGenerationResult<BoundTools<Tools>>;
```

## `Experimental_TextBatchItemResult`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Retain text batch result typing for the tools and parser used during submission.

```text
export type Experimental_TextBatchItemResult<Tools extends EffectTools = {}, Output = undefined> = sdk.Experimental_TextBatchItemResult<BoundTools<Tools>, AppliedOutput<Output>>;
```

## `Experimental_TextBatchRequest`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Retain the public tool definition type on an individual text request.

```text
export type Experimental_TextBatchRequest<Id extends string = string, Tools extends EffectTools = {}> = BatchInput<sdk.Experimental_TextBatchRequest<Id, BoundTools<Tools>>, Tools>;
```

## `experimental_toolCaller`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Attach caller hooks that complete synchronously during native tool setup.

```text
declare const experimental_toolCaller: <A extends EffectTools[string], R = never, Bound extends EffectTools[string] = EffectTools[string], Prepare = R>(tool: A, definition: ToolCaller<R, Bound, Prepare>) => Effect.Effect<ToolWithCaller<A, R, Bound, Prepare>, AiSdkError, never>;
```

## `Experimental_ToolCallers`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type Experimental_ToolCallers<TOOLS extends ToolSet> = { [NAME in keyof TOOLS]?: ReadonlyArray<'AI_SDK_DIRECT_TOOL_CALL' | ToolCallerName<TOOLS>>; };
```

## `Experimental_ToolCallerTool`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Retain the sandbox tool caller's bindings and its preparation requirements.

```text
export type Experimental_ToolCallerTool<T extends object = Tool, R = never, Bound extends EffectTools[string] = EffectTools[string], Prepare = R> = import('./protocols/provider-utils.js').Experimental_ToolCallerTool<T, R, Bound, Prepare>;
```

## `experimental_transcribe`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Transcribe audio and preserve native segments and response metadata.

```text
declare const transcribe: <R = never>(options: Options<Parameters<typeof sdk.transcribe>[0], TranscriptionModel, R>) => Effect.Effect<sdk.TranscriptionResult, AiSdkError, R>;
```

## `Experimental_TranscriptionResult`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type Experimental_TranscriptionResult = TranscriptionResult;
```

## `Experimental_TranslationStreamPart`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Stream parts emitted by `experimental_streamTranslate`.

Speech translation model stream parts are passed through unchanged, except
for `stream-start`, `response-metadata`, and `finish`, which are consumed
internally and surfaced via the result promises.

```text
type TranslationStreamPart = {
  /**
   * Translated audio chunk in the target language.
   *
   * `Uint8Array` chunks contain raw audio bytes. `string` chunks contain
   * base64-encoded raw audio bytes.
   */
  type: 'audio';
  id?: string;
  audio: Uint8Array | string;
  providerMetadata?: SharedV4ProviderMetadata;
} | {
  /**
   * Append-only translated text delta.
   */
  type: 'output-text-delta';
  id?: string;
  delta: string;
  providerMetadata?: SharedV4ProviderMetadata;
} | {
  /**
   * Final translated text for a provider-defined segment or utterance.
   */
  type: 'output-text-final';
  id?: string;
  text: string;
  providerMetadata?: SharedV4ProviderMetadata;
} | {
  /**
   * Append-only source transcript delta.
   */
  type: 'source-transcript-delta';
  id?: string;
  delta: string;
  providerMetadata?: SharedV4ProviderMetadata;
} | {
  /**
   * Non-final source transcript text. The text may be revised by later parts.
   */
  type: 'source-transcript-partial';
  id?: string;
  text: string;
  startSecond?: number;
  endSecond?: number;
  channelIndex?: number;
  providerMetadata?: SharedV4ProviderMetadata;
} | {
  /**
   * Final source transcript text for a provider-defined segment or utterance.
   */
  type: 'source-transcript-final';
  id?: string;
  text: string;
  startSecond?: number;
  endSecond?: number;
  channelIndex?: number;
  providerMetadata?: SharedV4ProviderMetadata;
} | {
  /**
   * Raw provider chunks if enabled via `includeRawChunks`.
   */
  type: 'raw';
  rawValue: unknown;
} | {
  /**
   * Error parts are streamed, allowing for multiple errors.
   */
  type: 'error';
  error: unknown;
};
```

## `extractJsonMiddleware`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Extract JSON text before downstream parsing using an optional transformation.

```text
declare const extractJsonMiddleware: (options?: {
    readonly transform?: (text: string) => string;
}) => LanguageModelMiddleware<never>;
```

## `extractReasoningMiddleware`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Move tagged reasoning text into the SDK's reasoning result fields.

```text
declare const extractReasoningMiddleware: (options: Parameters<typeof sdk.extractReasoningMiddleware>[0]) => LanguageModelMiddleware<never>;
```

## `FilePart`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

File content part of a prompt. It contains a file.

```text
interface FilePart {
  type: 'file';
  /**
   * File data. Either a tagged shape or a bare shorthand:
   *
   * - `{ type: 'data', data }` or bare `DataContent`: raw bytes
   *   (base64 string, Uint8Array, ArrayBuffer, Buffer)
   * - `{ type: 'url', url }` or bare `URL`: a URL that points to the file
   * - `{ type: 'reference', reference }` or bare `ProviderReference`:
   *   a provider reference from `uploadFile`
   * - `{ type: 'text', text }`: inline text content (tagged only)
   */
  data: FileData | DataContent | URL | ProviderReference;
  /**
   * Optional filename of the file.
   */
  filename?: string;
  /**
   * Either a full IANA media type (`type/subtype`, e.g. `image/png`) or just
   * the top-level IANA segment (e.g. `image`, `audio`, `video`, `text`).
   *
   * `*`-subtype wildcards (e.g. `image/*`) are normalized as equivalent to the
   * top-level segment alone (e.g. `image`). Providers can use the helpers in
   * `@ai-sdk/provider-utils` (`isFullMediaType`, `getTopLevelMediaType`,
   * `detectMediaType`) to resolve the field according to their API
   * requirements.
   *
   * @see https://www.iana.org/assignments/media-types/media-types.xhtml
   */
  mediaType: string;
  /**
   * Additional provider-specific metadata. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerOptions?: ProviderOptions;
}
```

## `FileUIPart`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

A file part of a message.

```text
type FileUIPart = {
  type: 'file';
  /**
   * Either a full IANA media type (`type/subtype`, e.g. `image/png`) or just
   * the top-level IANA segment (e.g. `image`, `audio`, `video`, `text`).
   *
   * `*`-subtype wildcards (e.g. `image/*`) are normalized as equivalent to the
   * top-level segment alone (e.g. `image`). Providers can use the helpers in
   * `@ai-sdk/provider-utils` (`isFullMediaType`, `getTopLevelMediaType`,
   * `detectMediaType`) to resolve the field according to their API
   * requirements.
   *
   * @see https://www.iana.org/assignments/media-types/media-types.xhtml
   */
  mediaType: string;
  /**
   * Optional filename of the file.
   */
  filename?: string;
  /**
   * The URL of the file.
   * It can either be a URL to a hosted file or a [Data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs).
   */
  url: string;
  /**
   * Provider reference for files uploaded via `uploadFile`.
   * Maps provider names to provider-specific file identifiers.
   * When present, takes precedence over `url` in model messages.
   */
  providerReference?: ProviderReference;
  /**
   * The provider metadata.
   */
  providerMetadata?: ProviderMetadata;
};
```

## `filterActiveTools`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Remove inactive tool definitions without cloning the original set when no restriction applies.

```text
export declare function filterActiveTools<Tools extends EffectTools | undefined, Active extends ActiveTools<NonNullable<Tools>>>({ tools, activeTools, }: {
    readonly tools: Tools;
    readonly activeTools: Active;
}): ActiveToolSubset<Tools, Active>;
```

## `fingerprintTools`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Bind tools in a scope before computing SDK fingerprints for compatibility comparisons.

```text
declare const fingerprintTools: <Tools extends EffectTools>(tools: Tools) => Effect.Effect<Record<string, string>, import("./internal/operation.js").AiSdkError, Exclude<import("./internal/tool.js").ToolRequirements<Tools[keyof Tools]>, import("effect/Scope").Scope>>;
```

## `FinishReason`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Reason why a language model finished generating a response.

Can be one of the following:

- `stop`: model generated stop sequence
- `length`: model generated maximum number of tokens
- `content-filter`: content filter violation stopped the model
- `tool-calls`: model triggered tool calls
- `error`: model stopped because of an error
- `interrupted`: provider stream ended without a completion signal; output may be incomplete
- `other`: model stopped for other reasons

```text
type FinishReason = 'stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'interrupted' | 'other';
```

## `FlexibleSchema`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Accept native, Effect, Standard Schema, and effectful schema inputs at one boundary.

```text
export type FlexibleSchema<A, R = never> = Schema<A, R> | EffectSchema.ConstraintDecoder<A, R> | ExternalSchema<A> | LazySchema<A, R>;
```
