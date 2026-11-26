---
title: Core API reference 02
doc-type: reference
sources:
  [
    src/core-chat.ts,
    src/core-contracts.ts,
    src/core-data.ts,
    src/core-errors.ts,
    src/core-files.ts,
    src/core-middleware.ts,
    src/core-providers.ts,
    src/core-tools.ts,
    src/core-utilities.ts,
    src/core.ts,
    src/index.ts,
    src/internal/chat-agent.ts,
    src/internal/chat-ui-stream.ts,
    src/internal/chat-validation.ts,
    src/protocols/provider-utils/test.ts,
    src/providers/gateway.ts,
    src/testing.ts,
  ]
---

# Core API reference 02

> **TL;DR:** Public core and test declarations from `Citation` to `DynamicToolCall`. Each entry lists its package import and declaration.

## `Citation`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

A reference supporting a generated text part.

```text
type Citation = LanguageModelV4Citation;
```

## `CompletionRequestOptions`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type CompletionRequestOptions<BODY extends object = object> = {
  /**
   * An optional object of headers to be passed to the API endpoint.
   */
  headers?: Record<string, string> | Headers;
  /**
   * An optional object to be passed to the API endpoint.
   */
  body?: BODY;
};
```

## `consumeStream`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Drain an Effect or host stream, with an optional scoped error handler.

```text
declare const consumeStream: <A, R, CallbackServices = never>({ stream, onError, abortSignal, }: {
    readonly stream: StreamInput<A, R>;
    readonly onError?: (cause: AiSdkError) => CallbackResult<void, CallbackServices>;
    readonly abortSignal?: AbortSignal;
}) => Effect.Effect<void, AiSdkError, R | CallbackServices>;
```

## `ContentPart`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Keep generated response parts typed by the tools attached to the operation.

```text
export type ContentPart<T extends EffectTools> = sdk.ContentPart<BoundTools<T>>;
```

## `convertArrayToAsyncIterable`

**Import:** `@jambudipa/ai-effect/ai/test`.
**Kind:** value.

Provide finite fixture values in the given order as an Effect stream.

```text
declare const convertArrayToAsyncIterable: <A>(values: A[]) => Stream.Stream<A, never, never>;
```

## `convertArrayToReadableStream`

**Import:** `@jambudipa/ai-effect/ai/test`.
**Kind:** value.

Feed an ordered finite array through the same Effect stream contract as adapted web
readers.

```text
declare const convertArrayToReadableStream: <A>(values: A[]) => Stream.Stream<A, never, never>;
```

## `convertDataContentToBase64String`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Normalize supported binary and text content for a base64 transport field.

```text
declare const convertDataContentToBase64String: (content: sdk.DataContent) => Effect.Effect<string, AiSdkError, never>;
```

## `convertFileListToFileUIParts`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Encode browser-selected files as data URLs for a UI message.

```text
declare const convertFileListToFileUIParts: (files?: FileList) => Effect.Effect<sdk.FileUIPart[], AiSdkError, never>;
```

## `convertReadableStreamToArray`

**Import:** `@jambudipa/ai-effect/ai/test`.
**Kind:** value.

Collect a native or Effect reader and release the native reader with the collection
scope.

```text
declare const convertReadableStreamToArray: <A>(source: ReadableStream<A> | Stream.Stream<A, AiSdkError>) => Effect.Effect<A[], AiSdkError, never>;
```

## `convertToModelMessages`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Convert typed UI history to model input after binding optional Effect tools.

```text
declare const convertToModelMessages: <Message extends UIMessage = UIMessage, Tools extends EffectTools = {}>(messages: Array<Omit<Message, "id">>, { tools, ...options }?: {
    readonly tools?: Tools;
    readonly ignoreIncompleteToolCalls?: boolean;
    readonly convertDataPart?: (part: DataUIPart<MessageData<Message>>) => TextPart | FilePart | undefined;
}) => Effect.Effect<import("ai").ModelMessage[], AiSdkError, Exclude<import("./tool.js").ToolRequirements<Tools[keyof Tools]>, import("effect/Scope").Scope>>;
```

## `cosineSimilarity`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Compare vectors by direction without including their magnitude in the result.

```text
declare const cosineSimilarity: (left: number[], right: number[]) => Effect.Effect<number, AiSdkError, never>;
```

## `createAgentUIStream`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Produce typed UI message chunks while retaining the agent operation's scope.

```text
declare const createAgentUIStream: <C = never, T extends EffectTools = {}, R extends Runtime = Runtime, A = string, P = A, I = never, Message extends AgentMessage<T> = AgentMessage<T>, Services = never>(options: AgentUIMessageStreamOptions<C, T, R, A, P, I, Message, Services>) => Stream.Stream<import("ai").InferUIMessageChunk<Message>, import("./operation.js").AiSdkError, Exclude<Services, import("effect/Scope").Scope> | Exclude<import("./tool.js").ToolRequirements<T[keyof T]>, import("effect/Scope").Scope>>;
```

## `createAgentUIStreamResponse`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Wrap agent UI chunks in the SDK's streaming HTTP response format.

```text
declare const createAgentUIStreamResponse: <C = never, T extends EffectTools = {}, R extends Runtime = Runtime, A = string, P = A, I = never, Message extends AgentMessage<T> = AgentMessage<T>, Services = never>({ headers, status, statusText, keepAliveMs, consumeSseStream, ...options }: AgentUIMessageStreamOptions<C, T, R, A, P, I, Message, Services> & Omit<UiHostOptions<never, Services>, "stream">) => Effect.Effect<Response, import("./operation.js").AiSdkError, import("effect/Scope").Scope | Services | import("./tool.js").ToolRequirements<T[keyof T]>>;
```

## `createAsyncIterableStream`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Read a host ReadableStream as a scoped Effect Stream.

```text
declare const createAsyncIterableStream: <A>(source: ReadableStream<A>) => Stream.Stream<A, AiSdkError, never>;
```

## `createDownload`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Create a reusable downloader with an optional byte limit and custom fetch implementation.

```text
declare const createDownload: (options?: {
    readonly maxBytes?: number;
    readonly fetch?: typeof globalThis.fetch;
}) => Effect.Effect<Download, AiSdkError, never>;
```

## `createGateway`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Construct the AI Gateway provider inside an Effect. Keep the scope open when using an
Effect resolver for `apiKey`.

```text
declare const createGateway: import("../internal/provider-settings.js").ProviderFactory<SdkSettings, "apiKey", GatewayProvider>;
```

## `createIdGenerator`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Create a reusable generator whose options control the prefix, separator, and size.

```text
declare const createIdGenerator: (options?: Parameters<typeof sdk.createIdGenerator>[0]) => Effect.Effect<IdGenerator, AiSdkError, never>;
```

## `createProviderRegistry`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Resolve qualified model IDs across named providers with optional lookup middleware.

```text
declare const createProviderRegistry: CreateProviderRegistry;
```

## `createTextStreamResponse`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Create a Fetch API response for a text stream.

```text
declare const createTextStreamResponse: <R>({ stream, ...options }: TextHostOptions<R>) => Effect.Effect<Response, AiSdkError, R>;
```

## `CreateUIMessage`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type CreateUIMessage<UI_MESSAGE extends UIMessage> = Omit<UI_MESSAGE, 'id' | 'role'> & {
  id?: UI_MESSAGE['id'];
  role?: UI_MESSAGE['role'];
};
```

## `createUIMessageStream`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Create a UI stream whose writer and callbacks share its Effect scope.

```text
declare const createUIMessageStream: <Message extends UIMessage = UIMessage, R = never>({ execute, generateId, ...options }: CreateUiStreamOptions<Message, R>) => Stream.Stream<InferUIMessageChunk<Message>, AiSdkError, Exclude<R, import("effect/Scope").Scope>>;
```

## `createUIMessageStreamResponse`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Create a UI event response without a separate consumer callback scope.
Create a UI event response while keeping the supplied SSE consumer in scope.

```text
export declare function createUIMessageStreamResponse<R>(options: UiHostOptions<R, never> & {
    readonly consumeSseStream?: never;
}): Effect.Effect<Response, AiSdkError, R>;
```

```text
export declare function createUIMessageStreamResponse<R, CallbackServices>(options: UiHostOptions<R, CallbackServices>): Effect.Effect<Response, AiSdkError, R | CallbackServices | import('effect').Scope.Scope>;
```

## `CustomContentUIPart`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

A provider-specific part of a message.

```text
type CustomContentUIPart = {
  type: 'custom';
  /**
   * The kind of custom content, in the format `{provider}.{provider-type}`.
   */
  kind: `${string}.${string}`;
  /**
   * The provider metadata.
   */
  providerMetadata?: ProviderMetadata;
};
```

## `customProvider`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Register local model aliases and use an optional provider for unresolved IDs.

```text
declare const customProvider: CustomProviderFactory;
```

## `DataContent`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Data content. Can either be a base64-encoded string, a Uint8Array, an ArrayBuffer, or a Buffer.

```text
type DataContent = string | Uint8Array | ArrayBuffer | Buffer;
```

## `DataUIPart`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type DataUIPart<DATA_TYPES extends UIDataTypes> = ValueOf<{ [NAME in keyof DATA_TYPES & string]: {
  type: `data-${NAME}`;
  id?: string;
  data: DATA_TYPES[NAME];
}; }>;
```

## `DeepPartial`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Create a type from an object with all keys and nested keys set to optional.
The helper supports normal objects and schemas (which are resolved automatically).
It always recurses into arrays.

Adopted from [type-fest](https://github.com/sindresorhus/type-fest/tree/main) PartialDeep.

```text
type DeepPartial<T> = T extends FlexibleSchema ? DeepPartialInternal<InferSchema<T>> : DeepPartialInternal<T>;
```

## `DefaultChatTransport`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Use a transport that decodes the SDK UI-message stream protocol.
Create the SDK's UI message HTTP transport with replay enabled by default.

```text
export type DefaultChatTransport<Message extends UIMessage = UIMessage> = ChatTransport<Message>;
```

```text
declare const DefaultChatTransport: <Message extends UIMessage = UIMessage, R = never>({ resumeStreamIsReplay, ...settings }?: HttpChatTransportInitOptions<Message, R> & {
    readonly resumeStreamIsReplay?: boolean;
}) => Effect.Effect<ChatTransport<Message>, never, import("effect/Scope").Scope | R>;
```

## `defaultEmbeddingSettingsMiddleware`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Supply default embedding settings through the native SDK middleware adapter.

```text
declare const defaultEmbeddingSettingsMiddleware: (options: Parameters<typeof sdk.defaultEmbeddingSettingsMiddleware>[0]) => EmbeddingModelMiddleware;
```

## `DefaultGeneratedFile`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Wrap a generated file and defer its base64 and byte conversions until requested.
Expose the media metadata and separately executable content encodings of a generated file.

```text
declare const DefaultGeneratedFile: (options: ConstructorParameters<typeof sdk.DefaultGeneratedFile>[0]) => Effect.Effect<{
    mediaType: string;
    providerMetadata: Record<string, import("@ai-sdk/provider").JSONObject> | undefined;
    base64: Effect.Effect<string, import("./internal/operation.js").AiSdkError, never>;
    uint8Array: Effect.Effect<Uint8Array<ArrayBufferLike>, import("./internal/operation.js").AiSdkError, never>;
}, import("./internal/operation.js").AiSdkError, never>;
```

```text
export type DefaultGeneratedFile = Effect.Success<ReturnType<typeof DefaultGeneratedFile>>;
```

## `defaultInstructionsMiddleware`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Set the SDK middleware fallback instructions for language model calls.

```text
declare const defaultInstructionsMiddleware: (options: Parameters<typeof sdk.defaultInstructionsMiddleware>[0]) => LanguageModelMiddleware<never>;
```

## `defaultSettingsMiddleware`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Supply native defaults for language model call settings.

```text
declare const defaultSettingsMiddleware: (options: Parameters<typeof sdk.defaultSettingsMiddleware>[0]) => LanguageModelMiddleware<never>;
```

## `detectToolDrift`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Compare current fingerprints with a baseline to detect tool-definition drift.

```text
declare const detectToolDrift: (current: Record<string, string>, baseline: Record<string, string>) => Effect.Effect<{
    added: string[];
    removed: string[];
    changed: string[];
}, import("./internal/operation.js").AiSdkError, never>;
```

## `DirectChatTransport`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Use an in-process transport backed by a registered agent.
Run an agent directly inside the chat stream scope and report no reconnectable stream.

```text
export type DirectChatTransport<Message extends UIMessage = UIMessage> = ChatTransport<Message>;
```

```text
declare const DirectChatTransport: <C = never, T extends EffectTools = {}, R extends Runtime = Runtime, A = string, P = A, I = never, Message extends DirectMessage<T> = DirectMessage<T>, Callbacks = never>({ agent, options: agentOptions, ...settings }: DirectChatTransportOptions<C, T, R, A, P, I, Message, Callbacks>) => Effect.Effect<ChatTransport<Message>, never, Callbacks | import("./internal/tool.js").ToolRequirements<T[keyof T]>>;
```

## `DirectChatTransportOptions`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Accept a registered agent with optional call and UI stream settings.

```text
export type DirectChatTransportOptions<C, T extends EffectTools, R extends Runtime, A, P, I, Message extends DirectMessage<T>, Callbacks = never> = Omit<UIMessageStreamOptions<Message, Callbacks>, 'onFinish'> & {
    readonly agent: ToolLoopAgent<C, T, R, A, P, I>;
    readonly options?: C;
};
```

## `DownloadError`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Construct or identify the wrapped SDK failure for a failed download of an input resource.
Shared Effect error type used for a failed download of an input resource.

```text
declare const DownloadError: {
    new (args_0: {
        url: string;
        statusCode?: number;
        statusText?: string;
        message?: string;
        cause?: unknown;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
};
```

```text
export type DownloadError = AiSdkError;
```

## `DurableTelemetryContext`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Serializable tracing identity shared by the processes of a durable run.

```text
type DurableTelemetryContext = {
  traceId: string;
  rootSpanId: string;
  /** The integration's root-span data, reused when the run is reported. */
  rootSpanName?: string;
  rootAttributes?: Record<string, string | number | boolean | Array<string | null | undefined> | Array<number | null | undefined> | Array<boolean | null | undefined> | undefined>;
  traceFlags: number;
  traceState?: string;
  samplingDecision: 0 | 1 | 2;
  parentSpanContext?: {
    traceId: string;
    spanId: string;
    traceFlags: number;
    traceState?: string;
  };
};
```

## `DurableTelemetryEventContext`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Identifies live model events and the run events reported after completion.

```text
type DurableTelemetryEventContext = {
  run: DurableTelemetryContext;
  stepNumber?: number;
  phase: 'live' | 'replay';
  /** Context has already been filtered before crossing the step boundary. */
  runtimeContext?: Record<string, unknown>;
  headers?: Record<string, string | undefined>;
};
```

## `dynamicTool`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Build a tool whose input and output are unknown until it is resolved at runtime.

```text
declare const dynamicTool: <Failure, Services>(options: EffectToolOptions<unknown, unknown, Failure, Services>) => EffectToolOptions<unknown, unknown, Failure, Services> & {
    readonly type: "dynamic";
};
```

## `DynamicToolCall`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

A tool call whose `toolName` is only known at runtime, such as an invalid
or otherwise untyped call that cannot be matched to the declared tool set.

```text
type DynamicToolCall = BaseToolCall & {
  toolName: string;
  input: unknown;
  dynamic: true;
  title?: string;
  /**
   * True if this is caused by an unparsable tool call or
   * a tool that does not exist.
   */
  invalid?: boolean;
  /**
   * The error that caused the tool call to be invalid.
   */
  error?: unknown;
};
```
