---
title: Core API reference 12
doc-type: reference
sources:
  [
    src/core-chat.ts,
    src/core-contracts.ts,
    src/core-errors.ts,
    src/core-middleware.ts,
    src/core-models.ts,
    src/core-object.ts,
    src/core-schema.ts,
    src/core-stream-operations.ts,
    src/core-tools.ts,
    src/core-utilities.ts,
    src/core.ts,
    src/index.ts,
    src/internal/simulate-readable.ts,
    src/testing.ts,
  ]
---

# Core API reference 12

> **TL;DR:** Public core and test declarations from `safeValidateWebSocketChatTransportRequest` to `StreamTextResult`. Each entry lists its package import and declaration.

## `safeValidateWebSocketChatTransportRequest`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Check an untrusted socket request before accepting its chat protocol fields.

```text
declare const safeValidateWebSocketChatTransportRequest: <Message extends UIMessage = UIMessage>({ value, }: {
    readonly value: unknown;
}) => Effect.Effect<SafeValidateWebSocketChatTransportRequestResult<Message>, AiSdkError, never>;
```

## `SafeValidateWebSocketChatTransportRequestResult`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Distinguish a decoded socket chat request from a recoverable validation failure.

```text
export type SafeValidateWebSocketChatTransportRequestResult<Message extends UIMessage = UIMessage> = {
    readonly success: true;
    readonly data: WebSocketChatTransportRequest<Message>;
} | {
    readonly success: false;
    readonly error: AiSdkError;
};
```

## `Schema`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

A schema whose conversion and validation run through Effect.

```text
export interface Schema<A, R = never> {
    /** Render the provider-facing JSON Schema document under an owned operation scope. */
    readonly jsonSchema: Effect.Effect<JSONSchema7, AiSdkError, R>;
    /** Validate an unknown input and carry the SDK's validation result separately from runtime failures. */
    readonly validate: (value: unknown) => Effect.Effect<ValidationResult<A>, AiSdkError, R>;
}
```

## `SerialJobExecutor`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Create an executor that runs one job at a time and lets callers await the current queue draining.
Expose the executor interface without its semaphore and pending-job state.

```text
declare const SerialJobExecutor: Effect.Effect<{
    run: <A, E, R>(job: Effect.Effect<A, E, R>) => Effect.Effect<A, E, R>;
    waitForIdle: () => Effect.Effect<void, never, never>;
}, never, never>;
```

```text
export type SerialJobExecutor = Effect.Success<typeof SerialJobExecutor>;
```

## `simulateReadableStream`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`, `@jambudipa/ai-effect/ai/test`.
**Kind:** value.

Create a test Web Stream from a list of chunks.

```text
declare const simulateReadableStream: <A>(options: Omit<Parameters<typeof simulate<A>>[0], "_internal">) => import("effect/Effect").Effect<ReadableStream<A>, import("./operation.js").AiSdkError, never>;
```

## `simulateStreamingMiddleware`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Produce simulated stream events from a completed native model response.

```text
declare const simulateStreamingMiddleware: () => LanguageModelMiddleware<never>;
```

## `SingleToolApprovalFunction`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Type an approval predicate for one tool's input and context.

```text
export type SingleToolApprovalFunction<I, C, R, S = never> = CoreCallback<sdk.SingleToolApprovalFunction<I, C, R>, S>;
```

## `smoothStream`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Split and pace the SDK's text and reasoning deltas.

```text
declare const smoothStream: <R = never>({ _internal, ...options }?: SmoothStreamOptions<R>) => Effect.Effect<SmoothStream, never, R>;
```

## `SmoothStream`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Expose an Effect stream transform with an SDK binding for native text operations.

```text
export interface SmoothStream {
    /** Apply smoothing to text events and preserve the source stream's Effect requirements. */
    readonly apply: <T extends EffectTools, E, R>(source: Stream.Stream<TextStreamPart<BoundTools<T>>, E, R>) => Stream.Stream<TextStreamPart<BoundTools<T>>, AiSdkError, R>;
}
```

## `SmoothStreamOptions`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Set the smoothing delay in milliseconds and choose a built-in or custom chunk boundary.

```text
export type SmoothStreamOptions<R = never> = {
    readonly delayInMs?: number | null;
    readonly chunking?: 'word' | 'line' | RegExp | ChunkDetector | Intl.Segmenter;
    readonly _internal?: {
        readonly delay?: (delayInMs: number | null) => Effect.Effect<void, unknown, R>;
    };
};
```

## `SourceDocumentUIPart`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

A document source part of a message.

```text
type SourceDocumentUIPart = {
  type: 'source-document';
  sourceId: string;
  mediaType: string;
  title: string;
  filename?: string;
  providerMetadata?: ProviderMetadata;
};
```

## `SourceUrlUIPart`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

A source part of a message.

```text
type SourceUrlUIPart = {
  type: 'source-url';
  sourceId: string;
  url: string;
  title?: string;
  providerMetadata?: ProviderMetadata;
};
```

## `SpeechModel`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Accept a model registry ID or a supported speech synthesis handle.

```text
export type SpeechModel = string | SpeechModelV4 | legacy.SpeechModelV3 | legacy.SpeechModelV2;
```

## `SpeechModelResponseMetadata`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type SpeechModelResponseMetadata = {
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
  /**
   * Response body.
   */
  body?: unknown;
};
```

## `SpeechResult`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

The result of a `generateSpeech` call.
It contains the audio data and additional information.

```text
interface SpeechResult {
  /**
   * The generated audio file with the audio data.
   */
  readonly audio: GeneratedAudioFile;
  /**
   * Warnings for the call, e.g. unsupported settings.
   */
  readonly warnings: Array<Warning>;
  /**
   * Response metadata from the provider. There may be multiple responses if we made multiple calls to the model.
   */
  readonly responses: Array<SpeechModelResponseMetadata>;
  /**
   * Provider metadata from the provider.
   */
  readonly providerMetadata: Record<string, JSONObject>;
}
```

## `StartVideoResult`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

The result of an `experimental_startVideo` call.

```text
interface StartVideoResult {
  /**
   * JSON-serializable opaque reference to the started generation.
   * Persist it and pass it to `experimental_getVideoStatus` to retrieve the
   * status and result later — from any process.
   */
  readonly operation: JSONValue;
  /**
   * Warnings for the call, e.g. unsupported settings.
   */
  readonly warnings: Array<Warning>;
  /**
   * Provider-specific metadata passed through from the provider.
   * Carries the provider's own job identifiers (e.g. the AI Gateway's
   * `providerMetadata.gateway.asyncJob.jobId` and, when `webhookUrl` was
   * given, its `webhookSigningSecret`).
   */
  readonly providerMetadata?: VideoModelProviderMetadata;
  /**
   * Response metadata from the provider.
   */
  readonly response: VideoModelResponseMetadata;
}
```

## `StaticToolCall`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

A tool call whose `toolName` maps to a tool in the declared tool set,
with an `input` type inferred from that tool's input schema.

```text
type StaticToolCall<TOOLS extends ToolSet> = ValueOf<{ [NAME in keyof TOOLS]-?: BaseToolCall & {
  toolName: NAME & string;
  input: InferToolInput<TOOLS[NAME]>;
  dynamic?: false | undefined;
  invalid?: false | undefined;
  error?: never;
  title?: string;
}; }>;
```

## `StaticToolError`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type StaticToolError<TOOLS extends ToolSet> = ValueOf<{ [NAME in keyof TOOLS]-?: {
  type: 'tool-error';
  toolCallId: string;
  toolName: NAME & string;
  input: InferToolInput<TOOLS[NAME]>;
  error: unknown;
  providerExecuted?: boolean;
  providerMetadata?: ProviderMetadata;
  toolMetadata?: JSONObject;
  dynamic?: false | undefined;
  title?: string;
}; }>;
```

## `StaticToolOutputDenied`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Tool output when the tool execution has been denied (for static tools).

```text
type StaticToolOutputDenied<TOOLS extends ToolSet> = ValueOf<{ [NAME in keyof TOOLS]-?: {
  type: 'tool-output-denied';
  toolCallId: string;
  toolName: NAME & string;
  providerExecuted?: boolean;
  dynamic?: false | undefined;
}; }>;
```

## `StaticToolResult`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type StaticToolResult<TOOLS extends ToolSet> = ValueOf<{ [NAME in keyof TOOLS]-?: {
  type: 'tool-result';
  toolCallId: string;
  toolName: NAME & string;
  input: InferToolInput<TOOLS[NAME]>;
  output: InferToolOutput<TOOLS[NAME]>;
  providerExecuted?: boolean;
  providerMetadata?: ProviderMetadata;
  toolMetadata?: JSONObject;
  dynamic?: false | undefined;
  preliminary?: boolean;
  title?: string;
}; }>;
```

## `stepCountIs`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Retain the SDK-compatible alias for the exact step-count predicate.

```text
declare const stepCountIs: (stepCount: number) => ({ steps }: Steps) => boolean;
```

## `StepResult`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Inspect the output, metadata, and tool activity for one model step.

```text
export type StepResult<T extends EffectTools, R extends Context = Context> = sdk.StepResult<BoundTools<T>, R>;
```

## `StepResultPerformance`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Performance metrics for a single step in the generation process.

```text
type StepResultPerformance = {
  /**
   * Effective number of output tokens per second over the full language model
   * response.
   *
   * Calculated as `outputTokens / requestSeconds`.
   */
  readonly effectiveOutputTokensPerSecond: number;
  /**
   * Number of output tokens per second after the first generated output chunk
   * was received.
   *
   * Only available for streaming steps.
   *
   * Calculated as `outputTokens / outputStreamSeconds`.
   */
  readonly outputTokensPerSecond: number | undefined;
  /**
   * Number of input tokens processed per second before the first generated
   * output chunk was received.
   *
   * Only available for streaming steps.
   *
   * Calculated as `inputTokens / ttftSeconds`.
   */
  readonly inputTokensPerSecond: number | undefined;
  /**
   * Effective number of input and output tokens per second over the full
   * language model response.
   *
   * Calculated as `(inputTokens + outputTokens) / requestSeconds`.
   */
  readonly effectiveTotalTokensPerSecond: number;
  /**
   * Total time spent on the step in milliseconds.
   */
  readonly stepTimeMs: number;
  /**
   * Time spent waiting for the language model response in milliseconds.
   */
  readonly responseTimeMs: number;
  /**
   * Time spent executing each client-side tool call in milliseconds, keyed by
   * tool call ID.
   */
  readonly toolExecutionMs: Readonly<Record<string, number>>;
  /**
   * Time until the first generated output chunk was received in milliseconds.
   *
   * This includes text deltas, reasoning deltas, generated files, reasoning
   * files, tool input deltas, and tool calls.
   *
   * Only available for streaming steps.
   */
  readonly timeToFirstOutputMs: number | undefined;
  /**
   * Timing statistics for the gaps between generated output chunks in
   * milliseconds.
   *
   * Only available for streaming steps with at least two generated output
   * chunks.
   */
  readonly timeBetweenOutputChunksMs?: OutputChunkTimingStats;
};
```

## `StepStartUIPart`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

A step boundary part of a message.

```text
type StepStartUIPart = {
  type: 'step-start';
};
```

## `StopCondition`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Return a stopping decision directly or compute it in the operation's Effect context.

```text
export type StopCondition<T extends EffectTools, R extends Context = Context, S = never> = (...args: Parameters<sdk.StopCondition<BoundTools<T>, R>>) => boolean | Effect.Effect<boolean, unknown, S>;
```

## `StoppedBy`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Why a generation stopped its tool loop:

- `model`: the model finished without tool calls that continue the loop,
  e.g. it gave a final answer, hit the output limit, or its call was
  interrupted. `finishReason` tells how the last model call finished.
- `stop-condition`: a `stopWhen` condition was met.
- `tool-without-execute`: a tool call needs a result from a tool without an
  `execute` function.
- `approval`: a tool call needs an approval.

```text
type StoppedBy = 'model' | 'stop-condition' | 'tool-without-execute' | 'approval';
```

## `StreamLanguageModelCallOptions`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Describe a low-level language model stream with typed hooks, tools, and output parsing services.

```text
export type StreamLanguageModelCallOptions<T extends EffectTools = {}, A = string, P = A, I = never, R = never, OutputServices = never> = ModelCallData<T> & {
    readonly model: LanguageModel;
    readonly tools?: T;
    readonly output?: OutputSpecification<A, P, I, OutputServices>;
    readonly experimental_sandbox?: SandboxSession;
    readonly download?: (requests: Parameters<NativeDownload>[0]) => CallbackResult<Awaited<ReturnType<NativeDownload>>, R>;
    readonly repairToolCall?: (context: {
        readonly instructions: RepairContext<T>['instructions'];
        readonly system: RepairContext<T>['system'];
        readonly messages: RepairContext<T>['messages'];
        readonly toolCall: RepairContext<T>['toolCall'];
        readonly abortSignal?: AbortSignal;
        readonly tools: T;
        readonly inputSchema: (...args: Parameters<RepairContext<T>['inputSchema']>) => Effect.Effect<Awaited<ReturnType<RepairContext<T>['inputSchema']>>, AiSdkError>;
        readonly error: AiSdkError;
    }) => CallbackResult<Awaited<ReturnType<Repair<T>>>, R>;
    readonly refineToolInput?: {
        readonly [Name in keyof T]?: (input: ToolInput<T, Name>) => CallbackResult<ToolInput<T, Name>, R>;
    };
    readonly executeLanguageModelCallInTelemetryContext?: <Value>(event: TraceContext<Value>) => Effect.Effect<Value, unknown, R>;
    readonly onStart?: (event: InitialEvent) => CallbackResult<void, R>;
    readonly onLanguageModelCallStart?: Lifecycle<StepStart, R>;
    readonly onLanguageModelCallEnd?: Lifecycle<StepEnd<T>, R>;
    readonly _internal?: {
        readonly generateId?: () => string;
        readonly generateCallId?: () => string;
        readonly now?: () => number;
        readonly collectContent?: boolean;
    };
};
```

## `streamObject`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Open a scoped stream of partial values for schema-validated object output.
Open a scoped stream that exposes completed array elements as well as partial output.
Open a scoped stream whose final value is one of the specified literals.
Open a scoped stream of partial JSON values without a validator schema.

```text
export declare function streamObject<A, R = never>(options: ObjectInput<A, R>): Effect.Effect<StreamObjectResult<sdk.DeepPartial<A>, A>, AiSdkError, Scope.Scope | R>;
```

```text
export declare function streamObject<A, R = never>(options: ArrayInput<A, R>): Effect.Effect<StreamObjectResult<A[], A[], A>, AiSdkError, Scope.Scope | R>;
```

```text
export declare function streamObject<const A extends string, R = never>(options: EnumInput<A, R>): Effect.Effect<StreamObjectResult<string, A>, AiSdkError, Scope.Scope | R>;
```

```text
export declare function streamObject<R = never>(options: UntypedInput<R>): Effect.Effect<StreamObjectResult<JSONValue, JSONValue>, AiSdkError, Scope.Scope | R>;
```

## `StreamObjectOnFinishCallback`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Run an Effect hook for the terminal event of an object stream.

```text
export type StreamObjectOnFinishCallback<Result, S = never> = CoreCallback<sdk.StreamObjectOnFinishCallback<Result>, S>;
```

## `StreamObjectResult`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Expose partial data, complete output, and available array elements from a scoped SDK stream.

```text
export type StreamObjectResult<P, A, I = never> = StreamObjectData<P, A, I> & {
    readonly partialObjectStream: Stream.Stream<P, AiSdkError>;
    readonly elementStream: Stream.Stream<I, AiSdkError>;
    readonly textStream: Stream.Stream<string, AiSdkError>;
    readonly fullStream: Stream.Stream<ReadableValue<NativeStream<P, A, I>['fullStream']>, AiSdkError>;
    readonly pipeTextStreamToResponse: (...args: Parameters<NativeStream<P, A, I>['pipeTextStreamToResponse']>) => Effect.Effect<void, AiSdkError>;
    readonly toTextStreamResponse: (init?: ResponseInit) => Effect.Effect<Response, AiSdkError>;
};
```

## `StreamProviderError`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Construct or identify the wrapped SDK failure for a stream failure reported by the provider.
Shared Effect error type used for a stream failure reported by the provider.

```text
declare const StreamProviderError: {
    new (args_0: {
        message: string;
        type?: string;
        code?: string | number;
        statusCode?: number;
        isRetryable?: boolean;
        data?: unknown;
        cause?: unknown;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
};
```

```text
export type StreamProviderError = AiSdkError;
```

## `streamText`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Acquire a text stream and release its request when the scope closes.

```text
declare const streamText: <T extends EffectTools = {}, R extends RuntimeContext = RuntimeContext, A = string, P = A, I = never, Hook = never, Provided extends object = {}>(options: StreamOptions<T, R, A, P, I, unknown> & Provided) => Effect.Effect<import("./internal/text-stream.js").TextStreamResult<BoundTools<T>, R, BoundOutput<A, P, I>, import("ai").StreamTextResult<BoundTools<T>, R, BoundOutput<A, P, I>>>, import("./internal/operation.js").AiSdkError, import("effect/Scope").Scope | (Hook | CoreServices<Provided>) | import("./internal/tool.js").ToolRequirements<T[keyof T]>>;
```

## `StreamTextEndEvent`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Observe the completed stream with its final output and steps.

```text
export type StreamTextEndEvent<T extends EffectTools = EffectTools, R extends Context = Context, O extends Output = Output> = CoreEvent<sdk.StreamTextEndEvent<BoundTools<T>, R, Native<O>>, T>;
```

## `StreamTextInclude`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type StreamTextInclude = {
  /**
   * Whether to retain the request body in step results.
   * The request body can be large when sending images or files.
   *
   * @default false
   */
  requestBody?: boolean;
  /**
   * Whether to retain the request messages in step results.
   * The request messages can be large when sending images or files.
   *
   * @default false
   */
  requestMessages?: boolean;
  /**
   * Whether to include raw chunks from the provider in the stream.
   *
   * When enabled, you will receive raw chunks with type 'raw' that contain
   * the unprocessed data from the provider.
   *
   * This allows access to cutting-edge provider features not yet wrapped by
   * the AI SDK.
   *
   * @default false
   */
  rawChunks?: boolean;
};
```

## `StreamTextOnChunkCallback`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Inspect incoming native chunks with the operation's registered tool types.

```text
export type StreamTextOnChunkCallback<T extends EffectTools, S = never> = CoreCallback<sdk.StreamTextOnChunkCallback<BoundTools<T>>, S, T>;
```

## `StreamTextOnEndCallback`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Handle completion of text streaming and its final adapted outputs.

```text
export type StreamTextOnEndCallback<T extends EffectTools = EffectTools, R extends Context = Context, O extends Output = Output, S = never> = CoreCallback<sdk.StreamTextOnEndCallback<BoundTools<T>, R, Native<O>>, S, T>;
```

## `StreamTextOnErrorCallback`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Observe a text stream failure without losing its SDK event payload.

```text
export type StreamTextOnErrorCallback<S = never> = CoreCallback<sdk.StreamTextOnErrorCallback, S>;
```

## `StreamTextOnErrorResult`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

A result that requests recovery from a streamed provider error.

```text
type StreamTextOnErrorResult = {
  retry: true;
};
```

## `StreamTextOnErrorRetryCallback`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Make a retry decision after a stream reports an error.

```text
export type StreamTextOnErrorRetryCallback<S = never> = CoreCallback<sdk.StreamTextOnErrorRetryCallback, S>;
```

## `StreamTextResult`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Expose a native text stream as a scoped result with Effect accessors.

```text
export type StreamTextResult<T extends EffectTools, R extends Context, O extends Output> = TextStreamResult<BoundTools<T>, R, Native<O>>;
```
