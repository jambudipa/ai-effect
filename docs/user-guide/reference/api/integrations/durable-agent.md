---
title: "Integration API — durable-agent"
doc-type: reference
sources: [src/integrations/durable-agent.ts, package.json]
---

# durable-agent

> **TL;DR:** The `@jambudipa/ai-effect/durable-agent` entry provides the public declarations listed below.

## Import

`@jambudipa/ai-effect/durable-agent`

## `CompatibleLanguageModel`

Effect model contract for a Durable Agent that still uses a v2-shaped native streaming boundary.

```text
export interface CompatibleLanguageModel<R = never, E = never> {
    /** Provider protocol version accepted by the pinned Durable Agent adapter. */
    readonly specificationVersion: 'v2' | 'v3';
    /** Provider name carried into native language model metadata. */
    readonly provider: string;
    /** Model identifier carried into native language model metadata. */
    readonly modelId: string;
    /** Open a scoped stream of legacy model events and retain the native response metadata. */
    readonly doStream: (options: LanguageModelV2CallOptions) => Effect.Effect<Omit<ModelResult, 'stream'> & {
        readonly stream: Stream.Stream<LanguageModelV2StreamPart, E, R>;
    }, E, R | Scope.Scope>;
}
```

## `DownloadFunction`

Resolve assets in request order. Return `null` for a URL the model can receive directly.

```text
export type DownloadFunction<E = never, R = never> = (options: Array<{
    url: URL;
    isUrlSupportedByModel: boolean;
}>) => Effect.Effect<Array<{
    data: Uint8Array;
    mediaType: string | undefined;
} | null>, E, R>;
```

## `DurableAgent`

Own legacy model and tool callbacks in the scope of the agent.

```text
/** Own legacy model and tool callbacks in the scope of the agent. */
export declare class DurableAgent {
    private constructor();
    /** Construct the native agent lazily and keep its model factory and tool callbacks in scope. */
    static make<T extends EffectTools = {}, R = never, E = never>(settings: DurableAgentOptions<T, R, E>): Effect.Effect<DurableAgent, AiSdkError, R | ToolServices<T> | Scope.Scope>;
    /** Call the legacy generate entry point. The pinned SDK throws an unimplemented-operation error. */
    generate(): Effect.Effect<void, AiSdkError>;
    /** Stream into the caller's writer and join native completion, including scoped callback handling. */
    stream<A = never, P = A, E = never, R = never>(options: DurableAgentStreamOptions<A, P, E, R>): Effect.Effect<DurableAgentStreamResult<A>, AiSdkError, Exclude<R, Scope.Scope>>;
}
```

## `DurableAgentOptions`

Bind a model and optional Effect tools to a Durable Agent construction scope.

```text
export type DurableAgentOptions<T extends EffectTools = {}, R = never, E = never> = GenerationSettings & {
    readonly model: ModelFactory<E, R>;
    readonly tools?: T;
    readonly system?: string;
    readonly toolChoice?: ToolChoice;
    readonly experimental_telemetry?: TelemetrySettings;
};
```

## `DurableAgentStreamOptions`

Configure legacy model streaming into a supplied UI writer, including callback and output handling.

```text
export type DurableAgentStreamOptions<A = never, P = A, E = never, R = never> = GenerationSettings & {
    readonly messages: DurableMessage[];
    readonly system?: string;
    readonly writable: WritableStream<DurableUIMessageChunk>;
    readonly preventClose?: boolean;
    readonly sendStart?: boolean;
    readonly sendFinish?: boolean;
    readonly stopWhen?: StopCondition<E, R> | ReadonlyArray<StopCondition<E, R>>;
    readonly maxSteps?: number;
    readonly toolChoice?: ToolChoice;
    readonly activeTools?: string[];
    readonly experimental_telemetry?: TelemetrySettings;
    readonly experimental_context?: unknown;
    readonly experimental_output?: OutputSpecification<A, P, R>;
    readonly includeRawChunks?: boolean;
    readonly experimental_repairToolCall?: ToolCallRepairFunction<E, R>;
    readonly experimental_transform?: StreamTextTransform<E, R> | ReadonlyArray<StreamTextTransform<E, R>>;
    readonly experimental_download?: DownloadFunction<E, R>;
    readonly onStepFinish?: (event: DurableStepResult) => Effect.Effect<void, E, R>;
    readonly onError?: StreamTextOnErrorCallback<E, R>;
    readonly onFinish?: StreamTextOnFinishCallback<A, E, R>;
    readonly onAbort?: StreamTextOnAbortCallback<E, R>;
    readonly prepareStep?: PrepareStepCallback<E, R>;
    readonly collectUIMessages?: boolean;
};
```

## `DurableAgentStreamResult`

Completed durable run state and optional gathered UI messages from the supplied writer flow.

```text
export type DurableAgentStreamResult<A = never> = {
    readonly messages: DurableMessage[];
    readonly steps: DurableStepResult[];
    readonly experimental_output: A;
    readonly uiMessages?: DurableUIMessage[];
};
```

## `GenerationSettings`

Per-call generation, retry, and cancellation configuration accepted by the Durable Agent SDK.

```text
export interface GenerationSettings {
    /** Upper bound on output tokens for the model request. */
    readonly maxOutputTokens?: number;
    /** Temperature used by the provider when sampling output tokens. */
    readonly temperature?: number;
    /** Cumulative-probability cutoff used by providers that support nucleus sampling. */
    readonly topP?: number;
    /** Number of token candidates used by providers that support top-k sampling. */
    readonly topK?: number;
    /** Provider penalty for tokens that already occur in the generated text. */
    readonly presencePenalty?: number;
    /** Provider penalty that increases with previous token frequency. */
    readonly frequencyPenalty?: number;
    /** Termination sequences forwarded to the native model request. */
    readonly stopSequences?: string[];
    /** Sampling seed for providers that support reproducible generation. */
    readonly seed?: number;
    /** Limit the additional attempts the native SDK may make after a failed request. */
    readonly maxRetries?: number;
    /** Combine caller cancellation with interruption of the owning operation. */
    readonly abortSignal?: AbortSignal;
    /** Request headers passed through to the SDK, including keys whose values are unset. */
    readonly headers?: Record<string, string | undefined>;
    /** Provider-scoped configuration for the durable model request. */
    readonly providerOptions?: ProviderOptions;
}
```

## `Output`

Construct the SDK's output modes without exposing the SDK parser.

```text
export declare const Output: {
    text: () => Effect.Effect<OutputSpecification<string, string, never, never>, AiSdkError, never>;
    json: (options?: NamedOutput) => Effect.Effect<OutputSpecification<import("@ai-sdk/provider").JSONValue, import("@ai-sdk/provider").JSONValue, never, never>, AiSdkError, never>;
    choice: <Choice extends string>(options: NamedOutput & {
        readonly options: Array<Choice>;
    }) => Effect.Effect<OutputSpecification<Choice, Choice, never, never>, AiSdkError, never>;
    object: StructuredOutput<"object">;
    array: StructuredOutput<"array">;
};
```

## `OutputSpecification`

Parse complete and partial durable output with an Effect-backed output specification.

```text
export type OutputSpecification<A, P = A, R = never> = EffectOutput<A, P, unknown, R>;
```

## `PrepareStepCallback`

Prepare the next step's overrides with access to the current prompt and previous step results.

```text
export type PrepareStepCallback<E = never, R = never> = (info: PrepareStepInfo) => Effect.Effect<PrepareStepResult<E, R>, E, R>;
```

## `PrepareStepInfo`

Current model, accumulated steps, and prompt passed to the preparation callback.

```text
export interface PrepareStepInfo {
    /** Read the current model selection as an ID or a deferred compatible model. */
    readonly model: ModelFactory<AiSdkError, never>;
    /** Step position reported by the pinned SDK. */
    readonly stepNumber: number;
    /** Completed step results available before the next step starts. */
    readonly steps: DurableStepResult[];
    /** Legacy model prompt that will be sent to the next step unless replaced. */
    readonly messages: LanguageModelV2Prompt;
    /** Application context forwarded by the SDK to the next step. */
    readonly experimental_context: unknown;
}
```

## `PrepareStepResult`

Optional overrides applied to the upcoming durable model step.

```text
export interface PrepareStepResult<E = never, R = never> extends GenerationSettings {
    /** Replace the current model selection with another ID or scoped model factory. */
    readonly model?: ModelFactory<E, R>;
    /** Supply replacement system instructions for the next step. */
    readonly system?: string;
    /** Supply a replacement native v2 prompt for the upcoming model call. */
    readonly messages?: LanguageModelV2Prompt;
    /** Override the next step's tool selection mode. */
    readonly toolChoice?: ToolChoice;
    /** Limit which of the registered tool names can be called during the next step. */
    readonly activeTools?: string[];
    /** Replace the application context passed on to the next step. */
    readonly experimental_context?: unknown;
}
```

## `ProviderOptions`

Provider-specific options keyed by provider under the legacy v2 protocol.

```text
export type ProviderOptions = SharedV2ProviderOptions;
```

## `StreamTextOnAbortCallback`

Observe completed steps when the SDK reports cancellation of the stream.

```text
export type StreamTextOnAbortCallback<E = never, R = never> = (event: {
    readonly steps: DurableStepResult[];
}) => Effect.Effect<void, E, R>;
```

## `StreamTextOnErrorCallback`

Observe the tagged SDK error associated with a failed streaming operation.

```text
export type StreamTextOnErrorCallback<E = never, R = never> = (event: {
    readonly error: AiSdkError;
}) => Effect.Effect<void, E, R>;
```

## `StreamTextOnFinishCallback`

Observe final conversation state, completed steps, and parsed structured output.

```text
export type StreamTextOnFinishCallback<A = never, E = never, R = never> = (event: {
    readonly steps: DurableStepResult[];
    readonly messages: DurableMessage[];
    readonly experimental_context: unknown;
    readonly experimental_output: A;
}) => Effect.Effect<void, E, R>;
```

## `StreamTextTransform`

Transform a legacy model event stream with wrapped tools and an Effect to stop generation.

```text
export interface StreamTextTransform<E = never, R = never> {
    (options: {
        readonly tools: ReturnType<typeof wrapTools>;
        readonly stopStream: Effect.Effect<void, AiSdkError>;
        readonly stream: Stream.Stream<LanguageModelV2StreamPart, AiSdkError>;
    }): Stream.Stream<LanguageModelV2StreamPart, E, R>;
}
```

## `TelemetrySettings`

Native telemetry configuration for individual Durable Agent operations.

```text
export interface TelemetrySettings {
    /** Enable the legacy SDK's telemetry hooks for the operation. */
    readonly isEnabled?: boolean;
    /** Label a call with a function identifier for telemetry grouping. */
    readonly functionId?: string;
    /** Application attributes attached to the operation's telemetry. */
    readonly metadata?: Record<string, string | number | boolean | Array<string | number | boolean> | null | undefined>;
    /** Optional tracer forwarded to the legacy SDK without runtime conversion. */
    readonly tracer?: unknown;
}
```

## `ToolCallRepairFunction`

Return a repaired legacy tool call or `null` when no repair can be offered.

```text
export type ToolCallRepairFunction<E = never, R = never> = (options: {
    readonly toolCall: LanguageModelV2ToolCall;
    readonly tools: ReturnType<typeof wrapTools>;
    readonly error: AiSdkError;
    readonly messages: LanguageModelV2Prompt;
}) => Effect.Effect<LanguageModelV2ToolCall | null, E, R>;
```
