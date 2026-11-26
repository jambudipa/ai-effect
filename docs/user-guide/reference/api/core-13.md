---
title: Core API reference 13
doc-type: reference
sources:
  [
    src/core-chat.ts,
    src/core-contracts.ts,
    src/core-data.ts,
    src/core-errors.ts,
    src/core-message-schema.ts,
    src/core-telemetry.ts,
    src/core.ts,
    src/index.ts,
    src/internal/core-transform.ts,
    src/internal/tool.ts,
    src/testing.ts,
  ]
---

# Core API reference 13

> **TL;DR:** Public core and test declarations from `StreamTextTransform` to `ToolResultPart`. Each entry lists its package import and declaration.

## `StreamTextTransform`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Build an Effect text stream transform with typed tools and an operation stop action.

```text
export type StreamTextTransform<Tools extends EffectTools, R = never> = (options: {
    readonly tools: Tools;
    readonly stopStream: Effect.Effect<void>;
}) => (source: Stream.Stream<TextStreamPart<BoundTools<Tools>>, AiSdkError>) => Stream.Stream<TextStreamPart<BoundTools<Tools>>, unknown, R>;
```

## `StreamTranscriptionResult`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
interface StreamTranscriptionResult {
  /**
   * The final transcribed text.
   */
  readonly text: PromiseLike<string>;
  /**
   * Final transcript segments with timing information, if available.
   */
  readonly segments: PromiseLike<Array<{
    text: string;
    startSecond: number;
    endSecond: number;
  }>>;
  /**
   * The language of the transcript, if available.
   */
  readonly language: PromiseLike<string | undefined>;
  /**
   * The duration of the transcript in seconds, if available.
   */
  readonly durationInSeconds: PromiseLike<number | undefined>;
  /**
   * Warnings for the call, e.g. unsupported settings.
   */
  readonly warnings: PromiseLike<Array<Warning>>;
  /**
   * Response metadata.
   */
  readonly responses: PromiseLike<Array<TranscriptionModelResponseMetadata>>;
  /**
   * Additional provider-specific metadata.
   */
  readonly providerMetadata: PromiseLike<Record<string, JSONObject>>;
  /**
   * Full stream of transcription parts.
   *
   * This is a single-consumer live stream and can only be accessed once.
   * Access it before any result promise when both stream parts and final
   * results are needed; accessing a result promise first consumes the stream
   * internally and makes `fullStream` unavailable.
   */
  readonly fullStream: AsyncIterableStream<TranscriptionStreamPart>;
}
```

## `SystemModelMessage`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

A system message. It can contain system information.

Note: using the "system" part of the prompt is strongly preferred
to increase the resilience against prompt injection attacks,
and because not all providers support several system messages.

```text
type SystemModelMessage = {
  role: 'system';
  content: string;
  /**
   * Additional provider-specific metadata. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerOptions?: ProviderOptions;
};
```

## `systemModelMessageSchema`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Validate instructions carried in the model protocol's `system` role.

```text
declare const systemModelMessageSchema: import("./core-schema.js").Schema<sdk.SystemModelMessage, never>;
```

## `Telemetry`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Describe Effect callbacks that receive SDK generation and tool events.

```text
export type Telemetry = EffectTelemetry;
```

## `TelemetryOptions`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Preserve native telemetry settings while allowing one or several Effect integrations.

```text
export type TelemetryOptions<Runtime extends Record<string, unknown> = Record<string, unknown>> = Omit<NativeOptions<Runtime>, 'integrations'> & {
    readonly integrations?: Telemetry | readonly Telemetry[];
};
```

## `TelemetryTracingChannelMessage`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type TelemetryTracingChannelMessage<EVENT = unknown> = {
  readonly type: TelemetryTracingEventType;
  readonly event: EVENT;
};
```

## `TelemetryTracingEventType`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type TelemetryTracingEventType = 'generateText' | 'streamText' | 'step' | 'languageModelCall' | 'executeTool' | 'embed' | 'embedMany' | 'rerank' | 'generateSpeech' | 'transcribe' | 'streamTranscribe' | 'experimental_decide' | 'experimental_extract';
```

## `TextPart`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Text content part of a prompt. It contains a string of text.

```text
interface TextPart {
  type: 'text';
  /**
   * The text content.
   */
  text: string;
  /**
   * Additional provider-specific metadata. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerOptions?: ProviderOptions;
}
```

## `TextStreamChatTransport`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Use a transport that maps plain response text to chat message chunks.
Create an HTTP transport for responses that contain a plain text stream.

```text
export type TextStreamChatTransport<Message extends UIMessage = UIMessage> = ChatTransport<Message>;
```

```text
declare const TextStreamChatTransport: <Message extends UIMessage = UIMessage, R = never>(settings?: HttpChatTransportInitOptions<Message, R>) => Effect.Effect<ChatTransport<Message>, never, import("effect/Scope").Scope | R>;
```

## `TextStreamPart`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Distinguish text, tool, and lifecycle parts in a text operation's full stream.

```text
export type TextStreamPart<T extends EffectTools> = sdk.TextStreamPart<BoundTools<T>>;
```

## `TextUIPart`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

A text part of a message.

```text
type TextUIPart = {
  type: 'text';
  /** References supporting this text, separate from retrieved sources. */
  citations?: Array<Citation>;
  /**
   * The text content.
   */
  text: string;
  /**
   * The state of the text part.
   */
  state?: 'streaming' | 'done';
  /**
   * The provider metadata.
   */
  providerMetadata?: ProviderMetadata;
};
```

## `TimeoutConfiguration`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Express SDK timeout limits and infer tool names from the public tool set.

```text
export type TimeoutConfiguration<Tools extends EffectTools = EffectTools> = sdk.TimeoutConfiguration<BoundTools<Tools>>;
```

## `tool`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Define a tool whose callbacks use the context of each invocation.
Preserve direct calls to a scalar Effect execution handler.
Preserve the output and context types for a tool with explicit execution settings.
Keep explicit input, output, and context types when execution is optional.
Declare a tool that validates input and context without a typed result.
Declare a tool that supplies typed output and context without a typed input.
Declare the tool context alone when the tool has neither a typed input nor output.
Return the registered provider tool handle with its precise type intact.

```text
export declare function tool<const Definition extends FunctionToolDefinition, Input, Output = never, Context = ContextData>(options: Definition & ToolOptions<Input, Output, unknown, unknown, Context>): CallableTool<Definition, Input, Context> & ToolTypes<Input, InferredOutput<Definition, Output>, Context, FunctionRequirements<Definition>>;
```

```text
export declare function tool<Input, Output, Failure, Services>(options: ScalarTool<Input, Output, Failure, Services>): ScalarTool<Input, Output, Failure, Services>;
```

```text
export declare function tool<Input, Output, Context extends ContextData, Failure = unknown, Services = never>(options: ExplicitExecutableTool<Input, Output, Context, Failure, Services>): ExplicitExecutableTool<Input, Output, Context, Failure, Services>;
```

```text
export declare function tool<Input, Output, Context extends ContextData, Failure = unknown, Services = never>(options: ExplicitTool<Input, Output, Context, Failure, Services>): ExplicitTool<Input, Output, Context, Failure, Services>;
```

```text
export declare function tool<Input, Context extends ContextData>(options: ExplicitTool<Input, never, Context>): ExplicitTool<Input, never, Context>;
```

```text
export declare function tool<Output, Context extends ContextData>(options: ExplicitTool<never, Output, Context>): ExplicitTool<never, Output, Context>;
```

```text
export declare function tool<Context extends ContextData>(options: ExplicitTool<never, never, Context>): ExplicitTool<never, never, Context>;
```

```text
export declare function tool<const Definition extends ProviderToolHandle<unknown, unknown, unknown>>(options: Definition): Definition;
```

## `Tool`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Accept either a provider-owned tool handle or a user-defined Effect tool definition.

```text
export type Tool<I = unknown, A = unknown, C = unknown, E = never, S = never> = ProviderToolHandle<I, A, S> | EffectToolOptions<I, A, E, S, C>;
```

## `ToolApprovalConfiguration`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Describe which requested tool calls need approval before the SDK executes them.

```text
export type ToolApprovalConfiguration<T extends EffectTools, R, S = never> = CoreOptions<{
    toolApproval: sdk.ToolApprovalConfiguration<BoundTools<T>, R>;
}, S, T>['toolApproval'];
```

## `ToolApprovalRequest`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Tool approval request prompt part.

```text
type ToolApprovalRequest = {
  type: 'tool-approval-request';
  /**
   * ID of the tool approval.
   */
  approvalId: string;
  /**
   * ID of the tool call that the approval request is for.
   */
  toolCallId: string;
  /**
   * Reason why the tool call requires approval.
   */
  reason?: string;
  /**
   * Flag indicating whether the tool was automatically approved or denied.
   *
   * @default false
   */
  isAutomatic?: boolean;
  /**
   * HMAC-SHA256 signature binding this approval to its tool call.
   * Present only when `experimental_toolApprovalSecret` is configured.
   */
  signature?: string;
  /**
   * Tool input before input schema validation and transformation.
   *
   * This is included when it differs from the validated tool input so that
   * approved tool calls can be safely revalidated before execution.
   */
  inputSchemaInput?: unknown;
};
```

## `ToolApprovalRequestOutput`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Carry a tool request that needs a decision before execution can continue.

```text
export type ToolApprovalRequestOutput<T extends EffectTools> = sdk.ToolApprovalRequestOutput<BoundTools<T>>;
```

## `ToolApprovalResponse`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Tool approval response prompt part.

```text
type ToolApprovalResponse = {
  type: 'tool-approval-response';
  /**
   * ID of the tool approval.
   */
  approvalId: string;
  /**
   * Flag indicating whether the approval was granted or denied.
   */
  approved: boolean;
  /**
   * Optional reason for the approval or denial.
   *
   * For denied tool calls, the reason is included in the `execution-denied`
   * tool result that is sent to the model. For approved tool calls that are
   * executed by the SDK, the reason remains in the message history: it is not
   * included in the model prompt and is not exposed through a dedicated tool
   * execution option. For provider-executed tools, the approval response
   * (including the reason) is forwarded to the provider.
   */
  reason?: string;
  /**
   * Flag indicating whether the tool call is provider-executed.
   * Only provider-executed tool approval responses should be sent to the model.
   */
  providerExecuted?: boolean;
};
```

## `ToolApprovalResponseOutput`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Carry an approval decision correlated with the originating tool call.

```text
export type ToolApprovalResponseOutput<T extends EffectTools> = sdk.ToolApprovalResponseOutput<BoundTools<T>>;
```

## `ToolApprovalStatus`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

The approval status of a tool configuration. This can be one of the following:

- 'not-applicable': The tool does not require approval.
- 'approved': The tool is automatically approved.
- 'denied': The tool is automatically denied.
- 'user-approval': The tool requires user approval.

In addition to the string statuses, you can also use object statuses with a reason property.
For approved and denied statuses, the reason is emitted on the approval response.
For user-approval statuses, the reason is emitted on the approval request so it can be shown to the approver.

`undefined` is treated as the `not-applicable` status.

```text
type ToolApprovalStatus = undefined | 'not-applicable' | 'approved' | 'denied' | 'user-approval' | {
  type: 'not-applicable';
  reason?: never;
} | {
  type: 'approved';
  reason?: string;
} | {
  type: 'denied';
  reason?: string;
} | {
  type: 'user-approval';
  reason?: string;
};
```

## `ToolCallNotFoundForApprovalError`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Construct or identify the wrapped SDK failure for an approval without a matching tool call.
Shared Effect error type used for an approval without a matching tool call.

```text
declare const ToolCallNotFoundForApprovalError: {
    new (args_0: {
        toolCallId: string;
        approvalId: string;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
};
```

```text
export type ToolCallNotFoundForApprovalError = AiSdkError;
```

## `ToolCallPart`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Tool call content part of a prompt. It contains a tool call (usually generated by the AI model).

```text
interface ToolCallPart {
  type: 'tool-call';
  /**
   * ID of the tool call. This ID is used to match the tool call with the tool result.
   */
  toolCallId: string;
  /**
   * Name of the tool that is being called.
   */
  toolName: string;
  /**
   * Arguments of the tool call. This is a JSON-serializable object that matches the tool's input schema.
   */
  input: unknown;
  /**
   * Additional provider-specific metadata. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerOptions?: ProviderOptions;
  /**
   * Whether the tool call was executed by the provider.
   */
  providerExecuted?: boolean;
}
```

## `ToolCallRepairError`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Construct or identify the wrapped SDK failure for an SDK failure while repairing a tool call.
Shared Effect error type used for an SDK failure while repairing a tool call.

```text
declare const ToolCallRepairError: {
    new (args_0: {
        message?: string;
        cause: unknown;
        originalError: sdk.NoSuchToolError | sdk.InvalidToolInputError;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
};
```

```text
export type ToolCallRepairError = AiSdkError;
```

## `ToolCallRepairFunction`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Rewrite an invalid SDK tool call before execution with the registered tool types.

```text
export type ToolCallRepairFunction<T extends EffectTools, S = never> = CoreCallback<sdk.ToolCallRepairFunction<BoundTools<T>>, S, T>;
```

## `ToolChoice`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Tool choice for the generation. It supports the following settings:

- `auto` (default): the model can choose whether and which tools to call.
- `required`: the model must call a tool. It can choose which tool to call.
- `none`: the model must not call tools
- `{ type: 'tool', toolName: string (typed) }`: the model must call the specified tool

```text
type ToolChoice<TOOLS extends Record<string, unknown>> = 'auto' | 'none' | 'required' | {
  type: 'tool';
  toolName: Extract<keyof TOOLS, string>;
};
```

## `ToolChoiceViolationError`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Construct or identify the wrapped SDK failure for a model response that violates the configured tool choice.
Shared Effect error type used for a model response that violates the configured tool choice.

```text
declare const ToolChoiceViolationError: {
    new (args_0: {
        toolChoice: {
            type: "none";
        } | {
            type: "required";
        } | {
            type: "tool";
            toolName: string;
        };
        finishReason: sdk.FinishReason;
        provider: string;
        modelId: string;
        content: Array<import("@ai-sdk/provider").LanguageModelV4Content>;
        message?: string;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
};
```

```text
export type ToolChoiceViolationError = AiSdkError;
```

## `ToolContent`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Content of a tool message. It is an array of tool result parts.

```text
type ToolContent = Array<ToolResultPart | ToolApprovalResponse>;
```

## `ToolExecuteFunction`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Implement a tool with one Effect result or a stream of results in the operation context.

```text
export type ToolExecuteFunction<I, A, C, E = never, S = never> = (input: I, options: ToolExecutionOptions<C>) => Effect.Effect<A, E, S> | Stream.Stream<A, E, S>;
```

## `ToolExecutionEndEvent`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Event passed to the `onToolExecutionEnd` callback.

Called when a tool execution completes, either successfully or with an error.
Uses the `toolOutput.type` discriminator to distinguish success and error.

```text
type ToolExecutionEndEvent<TOOLS extends ToolSet = ToolSet> = [ToolSet] extends [TOOLS] ? WidenedToolExecutionEndEvent : StaticToolExecutionEndEvent<TOOLS> | DynamicToolExecutionEndEvent<TOOLS>;
```

## `ToolExecutionOptions`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Carry invocation context, an abort signal, and the tool call identifier to an Effect handler.

```text
export type ToolExecutionOptions<C> = EffectToolExecutionOptions<C>;
```

## `ToolExecutionStartEvent`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Event passed to the `onToolExecutionStart` callback.

Called when a tool execution begins, before the tool's `execute` function is invoked.

```text
type ToolExecutionStartEvent<TOOLS extends ToolSet = ToolSet> = [ToolSet] extends [TOOLS] ? WidenedToolExecutionStartEvent : StaticToolExecutionStartEvent<TOOLS> | DynamicToolExecutionStartEvent;
```

## `ToolInputRefinement`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Customize refinement for a named tool while retaining the tool's native callback input.

```text
export type ToolInputRefinement<T extends EffectTools, S = never> = {
    [K in keyof sdk.ToolInputRefinement<BoundTools<T>>]: CoreCallback<sdk.ToolInputRefinement<BoundTools<T>>[K], S, T>;
};
```

## `ToolLoopAgent`

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

## `ToolLoopAgentSettings`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Infer the reusable agent settings from the constructor's public adapter boundary.

```text
export type ToolLoopAgentSettings<C = never, T extends EffectTools = {}, R extends Context = Context, O extends Output = Output, S = never> = ConstructorParameters<typeof ToolLoopAgent<C, T, R, O extends OutputSpecification<infer A, unknown, unknown, unknown> ? A : never, O extends OutputSpecification<unknown, infer P, unknown, unknown> ? P : never, O extends OutputSpecification<unknown, unknown, infer I, unknown> ? I : never, S>>[0];
```

## `ToolModelMessage`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

A tool message. It contains the result of one or more tool calls.

```text
type ToolModelMessage = {
  role: 'tool';
  content: ToolContent;
  /**
   * Additional provider-specific metadata. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerOptions?: ProviderOptions;
};
```

## `toolModelMessageSchema`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Validate tool results and correlate them with calls through their identifiers.

```text
declare const toolModelMessageSchema: import("./core-schema.js").Schema<sdk.ToolModelMessage, never>;
```

## `ToolOrder`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Tool names that define the order in which tools are sent to the provider.

Tool names are object keys at runtime, so the type is restricted to the
string keys of the configured tool set. The list can be partial; tools not
listed in `toolOrder` are sent after the listed tools, sorted alphabetically.

```text
type ToolOrder<TOOLS extends ToolSet> = ReadonlyArray<keyof TOOLS & string> | undefined;
```

## `ToolOutputErrorUIPart`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

A static or dynamic tool UI part whose execution failed.

Use `isToolOutputErrorUIPart` to identify tool output errors without
depending on the underlying tool state discriminator.

```text
type ToolOutputErrorUIPart<TOOLS extends UITools = UITools> = Extract<ToolUIPart<TOOLS> | DynamicToolUIPart, {
  state: 'output-error';
}>;
```

## `ToolResultPart`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Tool result content part of a prompt. It contains the result of the tool call with the matching ID.

```text
interface ToolResultPart {
  type: 'tool-result';
  /**
   * ID of the tool call that this result is associated with.
   */
  toolCallId: string;
  /**
   * Name of the tool that generated this result.
   */
  toolName: string;
  /**
   * Result of the tool call. This is a JSON-serializable object.
   */
  output: ToolResultOutput;
  /**
   * Additional provider-specific metadata. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerOptions?: ProviderOptions;
}
```
