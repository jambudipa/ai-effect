---
title: Core API reference 01
doc-type: reference
sources:
  [
    src/AiSdk.ts,
    src/core-chat.ts,
    src/core-contracts.ts,
    src/core-data.ts,
    src/core-message-schema.ts,
    src/core-middleware.ts,
    src/core-schema.ts,
    src/core-stream-operations.ts,
    src/core-tools.ts,
    src/core.ts,
    src/frameworks/chat.ts,
    src/index.ts,
    src/internal/chat-agent.ts,
    src/internal/chat-transport.ts,
    src/internal/operation.ts,
    src/internal/stream-aborted.ts,
    src/protocols/provider-errors.ts,
    src/testing.ts,
  ]
---

# Core API reference 01

> **TL;DR:** Public core and test declarations from `AbstractChat` to `ChunkDetector`. Each entry lists its package import and declaration.

## `AbstractChat`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Type chat consumers against the host wrapper and its typed UI state.
Extend the SDK chat with host state and release it with the Effect scope.

```text
export type AbstractChat<Message extends UIMessage = UIMessage> = HostChat<Message>;
```

```text
declare const AbstractChat: <Message extends UIMessage = UIMessage>(config: ChatInit<Message> & {
    readonly state: ChatState<Message>;
}) => Effect.Effect<AbstractChat<Message>, AiSdkError, import("effect/Scope").Scope>;
```

## `ActiveTools`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Restrict a request to named tools, or leave the full tool set active when unspecified.

```text
export type ActiveTools<Tools extends EffectTools> = ReadonlyArray<Extract<keyof Tools, string>> | undefined;
```

## `ActiveToolSubset`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Infer the active subset while preserving an omitted restriction or tool set.

```text
export type ActiveToolSubset<Tools extends EffectTools | undefined, Active extends ActiveTools<NonNullable<Tools>>> = Tools extends undefined ? undefined : [Active] extends [NonNullable<ActiveTools<NonNullable<Tools>>>] ? Pick<NonNullable<Tools>, Active[number]> : Tools;
```

## `addToolInputExamplesMiddleware`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Add tool input examples to descriptions with optional caller formatting.

```text
declare const addToolInputExamplesMiddleware: (options?: {
    readonly prefix?: string;
    readonly format?: (example: {
        input: native.JSONObject;
    }, index: number) => string;
    readonly remove?: boolean;
}) => LanguageModelMiddleware<never>;
```

## `Agent`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Type a reusable agent for consumers that need its identity, tools, and invocations.

```text
export type Agent<C = never, T extends EffectTools = {}, R extends Context = Context, O extends Output = Output, S = never> = Pick<AgentFor<C, T, R, O, S>, 'id' | 'version' | 'tools' | 'generate' | 'stream'>;
```

## `AgentCallParameters`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Accept a generation call with typed tool and callback options.

```text
export type AgentCallParameters<C, T extends EffectTools = {}, R extends Context = Context, S = never> = CoreOptions<sdk.AgentCallParameters<C, BoundTools<T>, R>, S, T>;
```

## `AgentStreamParameters`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Accept a streaming call with typed tools, runtime context, and callback services.

```text
export type AgentStreamParameters<C, T extends EffectTools, R extends Context = Context, S = never> = CoreOptions<sdk.AgentStreamParameters<C, BoundTools<T>, R>, S, T>;
```

## `AgentUIMessageStreamOptions`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Bind an agent, its call options, and UI lifecycle hooks to one stream request.

```text
export type AgentUIMessageStreamOptions<CallOptions, Tools extends EffectTools, Context extends Runtime, Output, Partial, Element, Message extends AgentMessage<Tools>, Services = never> = Omit<UIMessageStreamOptions<Message, Services>, 'onStepEnd' | 'onStepFinish'> & {
    readonly agent: ToolLoopAgent<CallOptions, Tools, Context, Output, Partial, Element>;
    readonly uiMessages: unknown[];
    readonly convertDataPart?: (part: DataUIPart<MessageData<Message>>) => TextPart | FilePart | undefined;
    readonly abortSignal?: AbortSignal;
    readonly timeout?: TimeoutConfiguration<Tools>;
    readonly experimental_sandbox?: SandboxSession;
    readonly experimental_steering?: Steering;
    readonly experimental_transform?: Transform<Tools> | readonly Transform<Tools>[];
    readonly options?: CallOptions;
    readonly onStepEnd?: GenerationStep<Tools, Services>;
    readonly onStepFinish?: GenerationStep<Tools, Services>;
    readonly onUIMessageStepEnd?: NonNullable<UIMessageStreamOptions<Message, Services>['onStepEnd']>;
};
```

## `AI_SDK_TELEMETRY_TRACING_CHANNEL`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Use the SDK's tracing channel name when registering a diagnostics subscriber.

```text
declare const AI_SDK_TELEMETRY_TRACING_CHANNEL = "ai:telemetry";
```

## `AiSdk`

**Import:** `@jambudipa/ai-effect`.
**Kind:** value, type.

Effect service for the Core SDK calls.

```text
export declare class AiSdk extends AiSdk_base {
    /** Install the built-in Core operations as the default implementation. */
    static readonly layer: Layer.Layer<AiSdk, never, never>;
}
```

## `AiSdkError`

**Import:** `@jambudipa/ai-effect`.
**Kind:** value, type.

A foreign SDK failure with only safe diagnostic fields visible.

```text
export declare class AiSdkError extends AiSdkError_base {
}
```

## `AISDKError`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Wrap a general SDK failure with the native arguments and expose its SDK type guard.
Use the shared `AiSdkError` type for a general SDK failure. `AISDKError.isInstance`
checks its SDK cause.

```text
declare const AISDKError: {
    new (args_0: {
        name: string;
        message: string;
        cause?: unknown;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
};
```

```text
export type AISDKError = AiSdkError;
```

## `AiSdkService`

**Import:** `@jambudipa/ai-effect`.
**Kind:** type.

Service interface for applications that supply a replacement layer.

```text
export type AiSdkService = AiSdk['Service'];
```

## `AiSdkStreamAborted`

**Import:** `@jambudipa/ai-effect`.
**Kind:** value, type.

The SDK reported an abort event on a text stream.

```text
export declare class AiSdkStreamAborted extends AiSdkStreamAborted_base {
}
```

## `APICallError`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Wrap a provider API request failure with the native arguments and expose its SDK type
guard.
Use the shared `AiSdkError` type for a provider API request failure.
`APICallError.isInstance` checks its SDK cause.

```text
declare const APICallError: {
    new (args_0: {
        message: string;
        url: string;
        requestBodyValues: unknown;
        statusCode?: number;
        responseHeaders?: Record<string, string>;
        responseBody?: string;
        cause?: unknown;
        isRetryable?: boolean;
        data?: unknown;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
};
```

```text
export type APICallError = AiSdkError;
```

## `asSchema`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Normalize supported input forms to a lazily resolved public schema.

```text
declare const asSchema: <A, R = never>(input?: FlexibleSchema<A, R>) => LazySchema<A, R>;
```

## `AssistantContent`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Content of an assistant message.
It can be a string or an array of text, image, reasoning, redacted reasoning, and tool call parts.

```text
type AssistantContent = string | Array<TextPart | CustomPart | FilePart | ReasoningPart | ReasoningFilePart | ToolCallPart | ToolResultPart | ToolApprovalRequest>;
```

## `AssistantModelMessage`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

An assistant message. It can contain text, tool calls, or a combination of text and tool calls.

```text
type AssistantModelMessage = {
  role: 'assistant';
  content: AssistantContent;
  /**
   * Additional provider-specific metadata. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerOptions?: ProviderOptions;
};
```

## `assistantModelMessageSchema`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Decode assistant history entries with the native message schema and Effect error handling.

```text
declare const assistantModelMessageSchema: import("./core-schema.js").Schema<sdk.AssistantModelMessage, never>;
```

## `AsyncIterableStream`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

A type that combines AsyncIterable and ReadableStream.
This allows a ReadableStream to be consumed using for-await-of syntax.

```text
type AsyncIterableStream<T> = AsyncIterable<T> & ReadableStream<T>;
```

## `callCompletionApi`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Run a host completion request and own its handlers until it ends.

```text
declare const callCompletionApi: <R = never>(options: CallCompletionApiOptions<R>) => Effect.Effect<Option.Option<string>, AiSdkError, Exclude<R, import("effect/Scope").Scope>>;
```

## `CallCompletionApiOptions`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Supply a completion request URL, prompt, and transport options to the client stream adapter.

```text
export type CallCompletionApiOptions<R = never> = {
    readonly api: string;
    readonly prompt: string;
    readonly credentials?: RequestCredentials;
    readonly headers?: HeadersInit;
    readonly body?: Record<string, unknown>;
    readonly streamProtocol?: 'data' | 'text';
    readonly abortSignal?: AbortSignal;
    readonly fetch?: typeof globalThis.fetch;
    readonly setCompletion: (completion: string) => void;
    readonly setLoading: (loading: boolean) => void;
    readonly setError: (error: AiSdkError | undefined) => void;
    readonly setAbortController: (controller: AbortController | null) => void;
    readonly getAbortController?: () => AbortController | null | undefined;
    readonly onFinish?: (prompt: string, completion: string) => CallbackResult<void, R>;
    readonly onError?: (error: AiSdkError) => CallbackResult<void, R>;
};
```

## `CallSettings`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type CallSettings = LanguageModelCallOptions & Omit<RequestOptions, 'timeout'>;
```

## `CallWarning`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Warning from the model provider for this call. The call will proceed, but e.g.
some settings might not be supported, which can lead to suboptimal results.

```text
type CallWarning = CallWarningRegistry[keyof CallWarningRegistry];
```

## `CallWarningRegistry`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Registry for call warning variants. Packages that expose additional warning
protocols can augment this interface.

```text
interface CallWarningRegistry {
  sharedV4: SharedV4Warning;
}
```

```text
interface CallWarningRegistry {
    harnessV1: HarnessV1CallWarning;
  }
```

## `ChatAddToolApproveResponseFunction`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Submit a decision for a pending tool approval from a chat host.

```text
export type ChatAddToolApproveResponseFunction = HostChat<UIMessage>['addToolApprovalResponse'];
```

## `ChatAddToolOutputFunction`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Add a result to the UI history for a tool call the host handles.

```text
export type ChatAddToolOutputFunction<Message extends UIMessage = UIMessage> = HostChat<Message>['addToolOutput'];
```

## `ChatInit`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Configure typed chat state, an adapted transport, and callbacks owned by the host view.

```text
export type ChatInit<Message extends UIMessage> = {
    readonly id?: string;
    readonly messageMetadataSchema?: HostSchema<Message['metadata']>;
    readonly dataPartSchemas?: {
        [K in keyof MessageData<Message>]: HostSchema<MessageData<Message>[K]>;
    };
    readonly messages?: Message[];
    readonly generateId?: () => string;
    readonly transport?: ChatTransport<Message>;
    readonly onError?: (error: AiSdkError) => HostResult<void>;
    readonly onToolCall?: (event: ChatEvent<Message, 'onToolCall'>) => HostResult<void>;
    readonly onFinish?: (event: ChatEvent<Message, 'onFinish'>) => HostResult<void>;
    readonly onData?: (event: ChatEvent<Message, 'onData'>) => HostResult<void>;
    readonly sendAutomaticallyWhen?: (options: {
        messages: Message[];
    }) => HostResult<boolean>;
    readonly experimental_queue?: boolean;
};
```

## `ChatOnDataCallback`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Receive application data streamed alongside typed UI message parts.

```text
export type ChatOnDataCallback<Message extends UIMessage = UIMessage> = NonNullable<ChatInit<Message>['onData']>;
```

## `ChatOnErrorCallback`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Report an SDK or transport failure through the chat host callback.

```text
export type ChatOnErrorCallback = NonNullable<ChatInit<UIMessage>['onError']>;
```

## `ChatOnFinishCallback`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Observe the final message and status when a host completes a request.

```text
export type ChatOnFinishCallback<Message extends UIMessage = UIMessage> = NonNullable<ChatInit<Message>['onFinish']>;
```

## `ChatOnToolCallCallback`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Handle a typed tool request from the native chat host.

```text
export type ChatOnToolCallCallback<Message extends UIMessage = UIMessage> = NonNullable<ChatInit<Message>['onToolCall']>;
```

## `ChatReconnectOptions`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Use the same identifiers and request data as native SDK reconnects.

```text
export type ChatReconnectOptions = Parameters<SdkChatTransport<UIMessage>['reconnectToStream']>[0];
```

## `ChatRequestOptions`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type ChatRequestOptions = {
  /**
   * Additional headers that should be to be passed to the API endpoint.
   */
  headers?: Record<string, string> | Headers;
  /**
   * Additional body JSON properties that should be sent to the API endpoint.
   */
  body?: object;
  metadata?: unknown;
};
```

## `ChatSendOptions`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Preserve the native send fields for the chat's declared UI message type.

```text
export type ChatSendOptions<Message extends UIMessage> = Parameters<SdkChatTransport<Message>['sendMessages']>[0];
```

## `ChatState`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

The synchronous host state contract for an abstract chat.

```text
export interface ChatState<Message extends UIMessage> {
    /** Track whether the chat is submitting, consuming output, ready, or failed. */
    status: 'submitted' | 'streaming' | 'ready' | 'error';
    /** Expose the latest chat failure with redacted diagnostics. */
    error: AiSdkError | undefined;
    /** Retain the current UI history using the consumer's message type. */
    messages: Message[];
    /** Store SDK-queued messages while the active request still owns the transport. */
    experimental_queuedMessages?: Message[];
    /** Append a message through the host's reactive state mechanism. */
    pushMessage(message: Message): void;
    /** Remove the last message through the host's state mechanism. */
    popMessage(): void;
    /** Replace a UI message at the SDK's requested history index. */
    replaceMessage(index: number, message: Message): void;
    /** Give the SDK a snapshot that matches the host's state semantics. */
    snapshot<A>(value: A): A;
}
```

## `ChatStatus`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type ChatStatus = 'submitted' | 'streaming' | 'ready' | 'error';
```

## `ChatTransport`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Expose chat send, replay, and closing operations under Effect.

```text
export interface ChatTransport<Message extends UIMessage = UIMessage> {
    /** Specify whether reconnect output must be replayed from the beginning of the response. */
    readonly resumeStreamIsReplay?: boolean;
    /** Send SDK message history and retain the response reader in the caller's scope. */
    readonly sendMessages: (options: ChatSendOptions<Message>) => Effect.Effect<Stream.Stream<UIMessageChunk, AiSdkError>, AiSdkError, Scope.Scope>;
    /** Return a scoped replay or resumed stream when the transport can reconnect. */
    readonly reconnectToStream: (options: ChatReconnectOptions) => Effect.Effect<Option.Option<Stream.Stream<UIMessageChunk, AiSdkError>>, AiSdkError, Scope.Scope>;
    /** Close native transport resources through the Effect error channel. */
    readonly close: () => Effect.Effect<void, AiSdkError>;
}
```

## `ChatTransportHandlers`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Implement send and reconnect as Effect operations that can serve an SDK transport.

```text
export interface ChatTransportHandlers<Message extends UIMessage> {
    /** Preserve reconnect replay semantics when wrapping custom transport handlers. */
    readonly resumeStreamIsReplay?: boolean;
    /** Produce a UI chunk stream for the outgoing typed history request. */
    readonly sendMessages: (options: ChatSendOptions<Message>) => Effect.Effect<ResponseChunks, AiSdkError>;
    /** Return `None` when no active response exists for the request. */
    readonly reconnectToStream: (options: ChatReconnectOptions) => Effect.Effect<Option.Option<ResponseChunks>, AiSdkError>;
}
```

## `ChunkDetector`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Recognize a boundary in buffered text so smoothing can emit another chunk.

```text
export type ChunkDetector = (...args: Parameters<sdk.ChunkDetector>) => ReturnType<sdk.ChunkDetector>;
```
