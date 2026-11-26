---
title: Core API reference 15
doc-type: reference
sources:
  [
    src/core-chat.ts,
    src/core-errors.ts,
    src/core-files.ts,
    src/core-message-schema.ts,
    src/core-middleware.ts,
    src/core-providers.ts,
    src/core-schema.ts,
    src/core.ts,
    src/frameworks/options.ts,
    src/index.ts,
    src/internal/chat-validation.ts,
    src/protocols/provider-errors.ts,
    src/testing.ts,
  ]
---

# Core API reference 15

> **TL;DR:** Public core and test declarations from `UnsupportedFunctionalityError` to `zodSchema`. Each entry lists its package import and declaration.

## `UnsupportedFunctionalityError`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Wrap an operation that the selected SDK model cannot perform with the native arguments
and expose its SDK type guard.
Use the shared `AiSdkError` type for an operation that the selected SDK model cannot
perform. `UnsupportedFunctionalityError.isInstance` checks its SDK cause.

```text
declare const UnsupportedFunctionalityError: {
    new (args_0: {
        functionality: string;
        message?: string;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
};
```

```text
export type UnsupportedFunctionalityError = AiSdkError;
```

## `UnsupportedModelVersionError`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Construct or identify the wrapped SDK failure for a model protocol version rejected by the SDK.
Shared Effect error type used for a model protocol version rejected by the SDK.

```text
declare const UnsupportedModelVersionError: {
    new (options: {
        version: string;
        provider: string;
        modelId: string;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
};
```

```text
export type UnsupportedModelVersionError = AiSdkError;
```

## `uploadFile`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Resolve a registered file API and propagate interruption to the native upload request.

```text
declare const uploadFile: (options: Options<Parameters<typeof sdk.uploadFile>[0], FilesV4Handle | FilesProvider>) => Effect.Effect<sdk.UploadFileResult, AiSdkError, never>;
```

## `UploadFileResult`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
interface UploadFileResult {
  readonly providerReference: ProviderReference;
  readonly mediaType?: string;
  readonly filename?: string;
  /**
   * The size of the uploaded file in bytes, if reported by the provider.
   */
  readonly byteSize?: number;
  /**
   * When the file was created, if reported by the provider.
   */
  readonly createdAt?: Date;
  /**
   * When the provider will delete the file (retention expiry), if reported.
   */
  readonly expiresAt?: Date;
  readonly providerMetadata?: ProviderMetadata;
  readonly warnings: Array<Warning>;
}
```

## `uploadSkill`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Resolve the provider skill API and fail with `AiSdkError` when it is unavailable.

```text
declare const uploadSkill: (options: Options<Parameters<typeof sdk.uploadSkill>[0], SkillsV4Handle | SkillsProvider>) => Effect.Effect<sdk.UploadSkillResult, AiSdkError, never>;
```

## `UploadSkillResult`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type UploadSkillResult = Omit<SkillsV4UploadSkillResult, 'providerReference' | 'warnings'> & {
  readonly providerReference: ProviderReference;
  readonly warnings: Warning[];
};
```

## `UseCompletionOptions`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Configure text completion state, request body, and a finish notification in the host
view.

```text
export type CompletionOptions<Body extends object = object> = FetchOptions & {
    readonly initialCompletion?: string;
    readonly initialInput?: string;
    readonly onFinish?: (prompt: string, completion: string) => HostResult<void>;
    readonly body?: Body;
    readonly streamProtocol?: 'data' | 'text';
};
```

## `UserContent`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Content of a user message. It can be a string or an array of text and image parts.

```text
type UserContent = string | Array<TextPart | ImagePart | FilePart>;
```

## `UserModelMessage`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

A user message. It can contain text or a combination of text and images.

```text
type UserModelMessage = {
  role: 'user';
  content: UserContent;
  /**
   * Additional provider-specific metadata. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerOptions?: ProviderOptions;
};
```

## `userModelMessageSchema`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Validate user prompts and their supported content parts for model input.

```text
declare const userModelMessageSchema: import("./core-schema.js").Schema<sdk.UserModelMessage, never>;
```

## `validateUIMessages`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Validate unknown UI history and expose SDK rejection on the Effect error channel.

```text
declare const validateUIMessages: <Message extends UIMessage = UIMessage, R = never>(options: ValidateUIMessagesOptions<Message, R>) => Effect.Effect<Message[], AiSdkError, Exclude<R, import("effect/Scope").Scope>>;
```

## `ValidateUIMessagesOptions`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Validate untrusted message history with optional schemas for metadata, data parts, and tools.

```text
export type ValidateUIMessagesOptions<Message extends UIMessage = UIMessage, R = never> = {
    readonly messages: unknown;
    readonly metadataSchema?: FlexibleSchema<Message['metadata'], R>;
    readonly dataSchemas?: UIDataPartSchemas<MessageData<Message>, R>;
    readonly tools?: {
        readonly [Name in keyof MessageTools<Message> & string]?: {
            readonly inputSchema: FlexibleSchema<MessageTools<Message>[Name]['input'], R>;
            readonly outputSchema?: FlexibleSchema<MessageTools<Message>[Name]['output'], R>;
        };
    };
    readonly experimental_refineToolInput?: {
        readonly [Name in keyof MessageTools<Message> & string]?: (input: MessageTools<Message>[Name]['input']) => CallbackResult<MessageTools<Message>[Name]['input'], R>;
    };
};
```

## `ValidationResult`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Preserve the SDK distinction between successful validation and a validation rejection.

```text
export type ValidationResult<A> = sdk.ValidationResult<A>;
```

## `Warning`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Warning from the model provider for this call. The call will proceed, but e.g.
some settings might not be supported, which can lead to suboptimal results.

```text
type Warning = SharedV4Warning;
```

## `WebSocketChatTransport`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Use a chat transport that sends and reconnects through a WebSocket.
Create a socket transport with Effect-bound request options and native replay behavior.

```text
export type WebSocketChatTransport<Message extends UIMessage = UIMessage> = ChatTransport<Message>;
```

```text
declare const WebSocketChatTransport: <Message extends UIMessage = UIMessage, R = never>({ params, body, headers, prepareSendMessagesRequest, prepareReconnectToStreamRequest, ...settings }: WebSocketChatTransportInitOptions<Message, R>) => Effect.Effect<ChatTransport<Message>, AiSdkError, import("effect/Scope").Scope | R>;
```

## `WebSocketChatTransportAbortRequest`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type WebSocketChatTransportAbortRequest = {
  type: 'abort';
  requestId: string;
};
```

## `WebSocketChatTransportInitOptions`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Configure the socket endpoint, host constructor, and Effect-aware request preparation.

```text
export type WebSocketChatTransportInitOptions<Message extends UIMessage, R = never> = {
    readonly url: string;
    readonly protocols?: string | string[];
    readonly params?: Resolvable<Record<string, string>, R>;
    readonly body?: Resolvable<object, R>;
    readonly headers?: Resolvable<Record<string, string> | Headers, R>;
    readonly webSocket?: WebSocketConstructor;
    readonly prepareSendMessagesRequest?: PrepareWebSocketChatTransportSendMessagesRequest<Message, R>;
    readonly prepareReconnectToStreamRequest?: PrepareWebSocketChatTransportReconnectToStreamRequest<R>;
};
```

## `WebSocketChatTransportRequest`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

A client-to-server frame used by `WebSocketChatTransport`.

```text
type WebSocketChatTransportRequest<UI_MESSAGE extends UIMessage = UIMessage> = WebSocketChatTransportSendRequest<UI_MESSAGE> | WebSocketChatTransportResumeRequest | WebSocketChatTransportAbortRequest;
```

## `WebSocketChatTransportResponse`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

A server-to-client frame used by `WebSocketChatTransport`.

```text
type WebSocketChatTransportResponse = {
  type: 'start';
  requestId: string;
} | {
  type: 'chunk';
  requestId: string;
  sequence: number;
  chunk: UIMessageChunk;
} | {
  type: 'end';
  requestId: string;
} | {
  type: 'error';
  requestId: string;
  errorText?: string;
} | {
  type: 'no-active';
  requestId: string;
};
```

## `WebSocketChatTransportResumeRequest`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type WebSocketChatTransportResumeRequest = {
  type: 'resume';
  requestId: string;
  id: string;
  /** Omitted by this transport to request a complete UI message replay. */
  lastSequence: number | undefined;
  headers: Record<string, string>;
  body: object;
  metadata: unknown;
};
```

## `WebSocketChatTransportSendRequest`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type WebSocketChatTransportSendRequest<UI_MESSAGE extends UIMessage = UIMessage> = {
  type: 'send';
  requestId: string;
  id: string;
  trigger: 'submit-message' | 'regenerate-message';
  messageId: string | undefined;
  messages: UI_MESSAGE[];
  headers: Record<string, string>;
  body: object;
  metadata: unknown;
};
```

## `wrapEmbeddingModel`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Resolve a supported embedding model and keep its middleware callbacks in the caller's scope.

```text
declare const wrapEmbeddingModel: <R = never>({ model, middleware, ...options }: ModelOptions<EmbeddingModelV3 | EmbeddingModelV4, EmbeddingModelMiddleware<R>>) => Effect.Effect<{
    maxEmbeddingsPerCall: Effect.Effect<number | undefined, AiSdkError, never>;
    supportsParallelCalls: Effect.Effect<boolean, AiSdkError, never>;
    doEmbed: (options: native.EmbeddingModelV4CallOptions) => Effect.Effect<native.EmbeddingModelV4Result, AiSdkError, never>;
    specificationVersion: "v4";
    provider: string;
    modelId: string;
}, AiSdkError, import("effect/Scope").Scope | R>;
```

## `wrapImageModel`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Resolve a supported image model and keep its middleware callbacks in the caller's scope.

```text
declare const wrapImageModel: <R = never>({ model, middleware, ...options }: ModelOptions<ImageModelV2 | ImageModelV3 | ImageModelV4, ImageModelMiddleware<R>>) => Effect.Effect<{
    maxImagesPerCall: (options: {
        modelId: string;
    }) => Effect.Effect<number | undefined, AiSdkError, never>;
    supportsFileInputs: Effect.Effect<boolean | undefined, AiSdkError, never>;
    supportsMaskInputs: Effect.Effect<boolean | undefined, AiSdkError, never>;
    doGenerate: (options: native.ImageModelV4CallOptions) => Effect.Effect<native.ImageModelV4Result, AiSdkError, never>;
    specificationVersion: "v4";
    provider: string;
    modelId: string;
}, AiSdkError, import("effect/Scope").Scope | R>;
```

## `wrapLanguageModel`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Resolve a supported language model and keep its middleware callbacks in the caller's scope.

```text
declare const wrapLanguageModel: <R = never>({ model, middleware, ...options }: ModelOptions<LanguageModelV2 | LanguageModelV3 | LanguageModelV4, LanguageModelMiddleware<R>>) => Effect.Effect<{
    specificationVersion: "v4";
    provider: string;
    modelId: string;
    readonly supportedUrls: Effect.Effect<Record<string, RegExp[]>, AiSdkError, never>;
    doGenerate: (options: native.LanguageModelV4CallOptions) => Effect.Effect<native.LanguageModelV4GenerateResult, AiSdkError, never>;
    doStream: (options: native.LanguageModelV4CallOptions) => Effect.Effect<{
        stream: Stream.Stream<native.LanguageModelV4StreamPart, AiSdkError, never>;
        request?: {
            url?: string;
            body?: unknown;
        };
        response?: {
            headers?: native.SharedV4Headers;
        };
    }, AiSdkError, import("effect/Scope").Scope>;
}, AiSdkError, import("effect/Scope").Scope | R>;
```

## `wrapProvider`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Apply language model middleware to a provider using an Effect scope that owns its callbacks.

```text
declare const wrapProvider: <R = never, const Provider extends RegisteredProvider | LegacyProvider<unknown> = RegisteredProvider>(options: MiddlewareOptions<R> & {
    readonly provider: Provider;
    readonly languageModelMiddleware: LanguageModelMiddleware<R> | LanguageModelMiddleware<R>[];
}) => Effect.Effect<ProviderHandle, AiSdkError, R | ProviderServices<Provider> | Scope.Scope>;
```

## `zodSchema`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Wrap a Zod definition with its native conversion options and defer the SDK callback.

```text
declare const zodSchema: <A>(schema: Parameters<typeof sdk.zodSchema<A>>[0], options?: Parameters<typeof sdk.zodSchema<A>>[1]) => Effect.Effect<Schema<A>>;
```
