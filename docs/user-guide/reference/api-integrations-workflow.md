---
title: "Integration API — workflow"
doc-type: reference
sources: [src/integrations/workflow.ts, package.json]
---

# workflow

> **TL;DR:** The `@jambudipa/ai-effect/workflow` entry provides the public declarations listed below.

## Import

`@jambudipa/ai-effect/workflow`

## `CompatibleLanguageModel`

Registered Effect v4 language model accepted by the Workflow agent constructor.

```text
export type CompatibleLanguageModel = LanguageModelV4;
```

## `createModelCallToUIChunkTransform`

Construct the native transform that converts model-call events to UI message chunks.

```text
export declare const createModelCallToUIChunkTransform: (...args: Parameters<typeof sdk.createModelCallToUIChunkTransform>) => Effect.Effect<TransformStream<sdk.ModelCallStreamPart<ToolSet>, UIMessageChunk>, AiSdkError, never>;
```

## `DownloadFunction`

Run a Workflow asset download with the services captured for the owning operation.

```text
export type DownloadFunction<E = never, R = never> = (...args: Parameters<NativeDownload>) => Effect.Effect<Awaited<ReturnType<NativeDownload>>, E, R>;
```

## `GenerationSettings`

Generation settings that can be passed to the model.
These map directly to LanguageModelV4CallOptions.

```text
interface GenerationSettings {
  /**
   * Maximum number of tokens to generate.
   */
  maxOutputTokens?: number;
  /**
   * Temperature setting. The range depends on the provider and model.
   * It is recommended to set either `temperature` or `topP`, but not both.
   */
  temperature?: number;
  /**
   * Nucleus sampling. This is a number between 0 and 1.
   * E.g. 0.1 would mean that only tokens with the top 10% probability mass are considered.
   * It is recommended to set either `temperature` or `topP`, but not both.
   */
  topP?: number;
  /**
   * Only sample from the top K options for each subsequent token.
   * Used to remove "long tail" low probability responses.
   * Recommended for advanced use cases only. You usually only need to use temperature.
   */
  topK?: number;
  /**
   * Presence penalty setting. It affects the likelihood of the model to
   * repeat information that is already in the prompt.
   * The presence penalty is a number between -1 (increase repetition)
   * and 1 (maximum penalty, decrease repetition). 0 means no penalty.
   */
  presencePenalty?: number;
  /**
   * Frequency penalty setting. It affects the likelihood of the model
   * to repeatedly use the same words or phrases.
   * The frequency penalty is a number between -1 (increase repetition)
   * and 1 (maximum penalty, decrease repetition). 0 means no penalty.
   */
  frequencyPenalty?: number;
  /**
   * Stop sequences. If set, the model will stop generating text when one of the stop sequences is generated.
   * Providers may have limits on the number of stop sequences.
   */
  stopSequences?: string[];
  /**
   * The seed (integer) to use for random sampling. If set and supported
   * by the model, calls will generate deterministic results.
   */
  seed?: number;
  /**
   * Maximum number of retries for retryable model call failures. Set to 0 to disable retries.
   * @default 2
   */
  maxRetries?: number;
  /**
   * Abort signal for cancelling the operation.
   */
  abortSignal?: AbortSignal;
  /**
   * Additional HTTP headers to be sent with the request.
   * Only applicable for HTTP-based providers.
   */
  headers?: Record<string, string | undefined>;
  /**
   * Reasoning effort level for the model. Controls how much reasoning
   * the model performs before generating a response.
   */
  reasoning?: LanguageModelV4CallOptions['reasoning'];
  /**
   * Additional provider-specific options. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerOptions?: ProviderOptions;
}
```

## `InferWorkflowAgentTools`

Recover the tool definitions exposed by a concrete Workflow agent instance.

```text
export type InferWorkflowAgentTools<A extends WorkflowAgent> = A['tools'];
```

## `InferWorkflowAgentUIMessage`

Infer a workflow UI message using the tools available on the supplied agent type.

```text
export type InferWorkflowAgentUIMessage<A extends WorkflowAgent, Metadata = unknown> = UIMessage<Metadata>;
```

## `ModelCallStreamPart`

Native workflow model-call stream event specialized to the bound tool set.

```text
export type ModelCallStreamPart<T extends EffectTools = EffectTools> = sdk.ModelCallStreamPart<BoundTools<T>>;
```

## `normalizeUIMessageStreamParts`

Normalize UI chunk order using the workflow protocol.

```text
export declare const normalizeUIMessageStreamParts: <E = never, R = never>(input: Stream.Stream<UIMessageChunk, E, R> | AsyncIterable<UIMessageChunk>) => Stream.Stream<UIMessageChunk, AiSdkError, Exclude<R, import("effect/Scope").Scope>>;
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

Output parser with separate final and partial types and optional Effect service requirements.

```text
export type OutputSpecification<A, P = A, R = never> = EffectOutput<A, P, unknown, R>;
```

## `PrepareCallCallback`

Prepare overrides for one call using the operation's Effect context.

```text
export type PrepareCallCallback<E = never, R = never> = (options: PrepareCallOptions) => Effect.Effect<PrepareCallResult, E, R>;
```

## `PrepareCallOptions`

Call preparation input with registered Effect tools and the current model selection.

```text
export type PrepareCallOptions = Omit<NativeCall, 'model' | 'tools' | 'stopWhen' | 'experimental_download' | 'telemetry'> & {
    readonly model: Model;
    readonly tools: ReturnType<typeof wrapTools>;
};
```

## `PrepareCallResult`

Supply only call setting overrides. The tool set remains owned by the Workflow agent.

```text
export type PrepareCallResult = Omit<PrepareCallOptions, 'tools'> extends infer T ? Partial<T> : never;
```

## `PrepareStepCallback`

Prepare overrides for the next step with its current model and optional sandbox.

```text
export type PrepareStepCallback<E = never, R = never> = (options: PrepareStepInfo) => Effect.Effect<PrepareStepResult, E, R>;
```

## `PrepareStepInfo`

Current step context with the model selection and any active wrapped sandbox.

```text
export type PrepareStepInfo = Omit<NativeStep, 'model' | 'experimental_sandbox'> & {
    readonly model: Model;
    readonly experimental_sandbox?: SandboxSession;
};
```

## `PrepareStepResult`

Optional per-step overrides, including a registered replacement model or sandbox.

```text
export type PrepareStepResult = Omit<NativeStepResult, 'model' | 'experimental_sandbox'> & {
    readonly model?: Model;
    readonly experimental_sandbox?: SandboxSession;
};
```

## `ProviderOptions`

Provider-specific options type. This is equivalent to SharedV4ProviderOptions from

- **@ai-sdk** /provider.

```text
type ProviderOptions = SharedV4ProviderOptions;
```

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

## `TelemetryOptions`

Preserve telemetry settings while exposing Effect integrations in the integration list.

```text
export type TelemetryOptions = Omit<NativeTelemetry, 'integrations'> & {
    readonly integrations?: ReadonlyArray<EffectTelemetry>;
};
```

## `ToolCallRepairFunction`

Inspect the failing call with wrapped tools, a scoped schema operation, and a tagged error.

```text
export type ToolCallRepairFunction<E = never, R = never> = (options: Omit<NativeRepairArgs, 'tools' | 'inputSchema' | 'error'> & {
    readonly tools: ReturnType<typeof wrapTools>;
    readonly inputSchema: (...args: Parameters<NativeRepairArgs['inputSchema']>) => Effect.Effect<Awaited<ReturnType<NativeRepairArgs['inputSchema']>>, AiSdkError>;
    readonly error: AiSdkError;
}) => Effect.Effect<Awaited<ReturnType<NativeRepair>>, E, R>;
```

## `toUIMessageChunk`

Convert a native model-call event to the corresponding UI stream chunk when supported.

```text
export declare const toUIMessageChunk: (...args: Parameters<typeof sdk.toUIMessageChunk>) => Effect.Effect<UIMessageChunk | undefined, AiSdkError, never>;
```

## `WorkflowAgent`

Workflow-hosted agent that runs the native model with Effect tools and callback ownership.

```text
/** Workflow-hosted agent that runs the native model with Effect tools and callback ownership. */
export declare class WorkflowAgent<A = never, P = A> {
    private constructor();
    /** Validate model and sandbox identity before acquiring the constructor callback scope. */
    static make<T extends EffectTools = {}, A = never, P = A, E = never, R = never>(options: WorkflowAgentOptions<T, A, P, E, R>): Effect.Effect<WorkflowAgent<A, P>, AiSdkError, import("effect/Scope").Scope | R | import("../internal/tool.js").ToolRequirements<T[keyof T]>>;
    /** Identifier configured on the native Workflow agent. */
    get id(): string | undefined;
    /** Return wrapped tools with their native Workflow tool keys. */
    get tools(): import("./internal/sdk-tool.js").WrappedTools<ToolSet>;
    /** Run a complete Workflow call and retain its full structured-output type. */
    generate<Out = [
        A
    ] extends [
        never
    ] ? string : A, Part = P, E = never, R = never>(options: WorkflowAgentGenerateOptions<Out, Part, E, R>): Effect.Effect<WorkflowAgentGenerateResult<Out>, AiSdkError, Exclude<R, import("effect/Scope").Scope>>;
    /** Run a streaming Workflow call and map any embedded native failure to `AiSdkError`. */
    stream<Out = A, Part = P, E = never, R = never>(options: WorkflowAgentStreamOptions<Out, Part, E, R>): Effect.Effect<WorkflowAgentStreamResult<Out>, AiSdkError, Exclude<R, import("effect/Scope").Scope>>;
}
```

## `WorkflowAgentCallOptions`

Shared call configuration used to type Workflow lifecycle callbacks.

```text
export type WorkflowAgentCallOptions<A = never, P = A, E = never, R = never> = OperationOptions<NativeCall<A, P>, A, P, E, R>;
```

## `WorkflowAgentGenerateOptions`

Complete-generation request with optional Effect structured output and per-call hooks.

```text
export type WorkflowAgentGenerateOptions<A = string, P = A, E = never, R = never> = OperationOptions<NativeGenerate<A, P>, A, P, E, R>;
```

## `WorkflowAgentGenerateResult`

Native completed generation result with the caller's parsed output type.

```text
export type WorkflowAgentGenerateResult<A = string> = sdk.WorkflowAgentGenerateResult<ToolSet, Record<string, unknown>, A>;
```

## `WorkflowAgentOnAbortCallback`

Effect handler for Workflow abort events with the caller's callback services.

```text
export type WorkflowAgentOnAbortCallback<A = never, E = never, R = never> = NonNullable<WorkflowAgentCallOptions<A, A, E, R>['onAbort']>;
```

## `WorkflowAgentOnEndCallback`

Effect handler for the native Workflow operation's end event.

```text
export type WorkflowAgentOnEndCallback<A = never, E = never, R = never> = NonNullable<WorkflowAgentCallOptions<A, A, E, R>['onEnd']>;
```

## `WorkflowAgentOnErrorCallback`

Effect handler for errors reported by a native Workflow call.

```text
export type WorkflowAgentOnErrorCallback<A = never, E = never, R = never> = NonNullable<WorkflowAgentCallOptions<A, A, E, R>['onError']>;
```

## `WorkflowAgentOnFinishCallback`

Effect handler for the SDK's finish event, preserving the typed output.

```text
export type WorkflowAgentOnFinishCallback<A = never, E = never, R = never> = NonNullable<WorkflowAgentCallOptions<A, A, E, R>['onFinish']>;
```

## `WorkflowAgentOnStartCallback`

Effect handler for call start with an adapted model identity.

```text
export type WorkflowAgentOnStartCallback<A = never, E = never, R = never> = NonNullable<WorkflowAgentCallOptions<A, A, E, R>['onStart']>;
```

## `WorkflowAgentOnStepEndCallback`

Effect handler for the end of a Workflow step.

```text
export type WorkflowAgentOnStepEndCallback<A = never, E = never, R = never> = NonNullable<WorkflowAgentCallOptions<A, A, E, R>['onStepEnd']>;
```

## `WorkflowAgentOnStepFinishCallback`

Effect handler for the native step-finish callback name.

```text
export type WorkflowAgentOnStepFinishCallback<A = never, E = never, R = never> = NonNullable<WorkflowAgentCallOptions<A, A, E, R>['onStepFinish']>;
```

## `WorkflowAgentOnStepStartCallback`

Effect handler for step start with the adapted model and accumulated history.

```text
export type WorkflowAgentOnStepStartCallback<A = never, E = never, R = never> = NonNullable<WorkflowAgentCallOptions<A, A, E, R>['onStepStart']>;
```

## `WorkflowAgentOnToolExecutionEndCallback`

Effect handler for completion of a Workflow tool invocation.

```text
export type WorkflowAgentOnToolExecutionEndCallback<A = never, E = never, R = never> = NonNullable<WorkflowAgentCallOptions<A, A, E, R>['onToolExecutionEnd']>;
```

## `WorkflowAgentOnToolExecutionStartCallback`

Effect handler for start of a Workflow tool invocation.

```text
export type WorkflowAgentOnToolExecutionStartCallback<A = never, E = never, R = never> = NonNullable<WorkflowAgentCallOptions<A, A, E, R>['onToolExecutionStart']>;
```

## `WorkflowAgentOptions`

Construct a Workflow agent from a registered model or model ID with optional Effect hooks, tools, and sandbox.

```text
export type WorkflowAgentOptions<T extends EffectTools = {}, A = never, P = A, E = never, R = never> = WithEffectCallbacks<Pick<NativeSettings<A, P>, Extract<keyof NativeSettings<A, P>, GeneralSettings | Lifecycle>>, Lifecycle, E, R> & Partial<sdk.GenerationSettings> & StartCallbacks<E, R> & WorkflowConstructorExtras<E, R> & {
    readonly model: Extract<NativeSettings<A, P>['model'], string> | CompatibleLanguageModel;
    readonly tools?: T;
    readonly output?: OutputSpecification<A, P, R>;
    readonly experimental_sandbox?: SandboxSession;
};
```

## `WorkflowAgentStreamOptions`

Stream request with optional Effect structured output and per-call hooks.

```text
export type WorkflowAgentStreamOptions<A = never, P = A, E = never, R = never> = OperationOptions<NativeStream<A, P>, A, P, E, R>;
```

## `WorkflowAgentStreamResult`

Workflow stream completion data with a tagged error when the SDK reports one in the result.

```text
export type WorkflowAgentStreamResult<A = never> = Omit<sdk.WorkflowAgentStreamResult<ToolSet, A>, 'error'> & {
    readonly error?: AiSdkError;
};
```

## `WorkflowAgentTimeoutConfiguration`

Timeout configuration for a workflow agent call.

A number is the total deadline in milliseconds. The object form can also
limit each model call and, in `stream()`, the wait for model output.

```text
type WorkflowAgentTimeoutConfiguration = number | {
  /**
   * Deadline for the model calls of the whole run, in milliseconds.
   * The same deadline stays in effect after a tool suspends and resumes.
   */
  totalMs?: number;
  /**
   * Time limit for each model call, in milliseconds. It covers dispatch,
   * SDK retries, and reading the response. Tool execution is not included.
   */
  stepMs?: number;
  /**
   * Time limit for the first output chunk of each model call, in
   * milliseconds. Used by `stream()` only.
   */
  firstChunkMs?: number;
  /**
   * Time limit between two output chunks of a model call, in milliseconds.
   * Used by `stream()` only.
   */
  chunkMs?: number;
};
```

## `WorkflowAgentToolExecutionEndEvent`

Workflow tool completion event with types reflecting the selected Effect tools.

```text
export type WorkflowAgentToolExecutionEndEvent<T extends EffectTools = EffectTools> = sdk.WorkflowAgentToolExecutionEndEvent<BoundTools<T>>;
```

## `WorkflowAgentToolExecutionStartEvent`

Workflow tool start event with types reflecting the selected Effect tools.

```text
export type WorkflowAgentToolExecutionStartEvent<T extends EffectTools = EffectTools> = sdk.WorkflowAgentToolExecutionStartEvent<BoundTools<T>>;
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

## `WorkflowToolApprovalSecret`

Workflow-safe reference to the environment variable that contains the
secret used to sign and verify tool approvals.

```text
type WorkflowToolApprovalSecret = {
  /**
   * Name of an environment variable containing a high-entropy secret.
   */
  environmentVariable: string;
};
```

