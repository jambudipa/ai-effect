---
title: Core API reference 08
doc-type: reference
sources:
  [
    src/core-chat.ts,
    src/core-contracts.ts,
    src/core-data.ts,
    src/core-errors.ts,
    src/core-middleware.ts,
    src/core-models.ts,
    src/core-tools.ts,
    src/core.ts,
    src/index.ts,
    src/internal/tool.ts,
    src/protocols/provider-errors.ts,
    src/testing.ts,
  ]
---

# Core API reference 08

> **TL;DR:** Public core and test declarations from `getFirstChunkTimeoutMs` to `InvalidToolInputError`. Each entry lists its package import and declaration.

## `getFirstChunkTimeoutMs`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Return the time allowed before the first chunk, in milliseconds.

```text
declare const getFirstChunkTimeoutMs: (timeout?: TimeoutConfiguration) => Effect.Effect<Option.Option<number>, AiSdkError, never>;
```

## `getStaticToolName`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Retain the declared tool-name union when extracting a static tool's name.

```text
declare const getStaticToolName: <Tools extends UITools>(part: ToolUIPart<Tools>) => Effect.Effect<keyof Tools, AiSdkError, never>;
```

## `getStepTimeoutMs`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Return the per-step limit in milliseconds, or `None` if it is unset.

```text
declare const getStepTimeoutMs: (timeout?: TimeoutConfiguration) => Effect.Effect<Option.Option<number>, AiSdkError, never>;
```

## `getTextFromDataUrl`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Decode the text payload of a data URL and report malformed input as an SDK error.

```text
declare const getTextFromDataUrl: (dataUrl: string) => Effect.Effect<string, AiSdkError, never>;
```

## `getToolName`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Resolve the name used to render or dispatch a UI tool part.

```text
declare const getToolName: (part: ToolUIPart<UITools> | DynamicToolUIPart) => Effect.Effect<string, AiSdkError, never>;
```

## `getToolOrDynamicToolName`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Support both a type-encoded static name and a runtime-supplied dynamic name.

```text
declare const getToolOrDynamicToolName: (part: ToolUIPart<UITools> | DynamicToolUIPart) => Effect.Effect<string, AiSdkError, never>;
```

## `getToolTimeoutMs`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Look up the limit for a named tool in milliseconds and preserve absence as `None`.

```text
declare const getToolTimeoutMs: <Tools extends EffectTools>(timeout: TimeoutConfiguration<Tools>, toolName: keyof Tools & string) => Effect.Effect<Option.Option<number>, AiSdkError, never>;
```

## `getTotalTimeoutMs`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Return the overall limit in milliseconds, or `None` if it is unset.

```text
declare const getTotalTimeoutMs: (timeout?: TimeoutConfiguration) => Effect.Effect<Option.Option<number>, AiSdkError, never>;
```

## `GetVideoStatusResult`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

The result of an `experimental_getVideoStatus` call: the spec-level status
payload, discriminated by `status` (`pending` | `completed` | `error`).

```text
type GetVideoStatusResult = Experimental_VideoModelV4OperationStatusResult;
```

## `hasToolCall`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value.

Stop when the last completed step requested any of the supplied tool names.

```text
declare const hasToolCall: <Tools extends EffectTools>(...names: Array<keyof Tools | (string & {})>) => ({ steps }: Steps) => boolean;
```

## `HttpChatTransport`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Use the chat transport interface for requests and reconnects over HTTP.
Extend the HTTP protocol with an Effect Stream decoder.

```text
export type HttpChatTransport<Message extends UIMessage = UIMessage> = ChatTransport<Message>;
```

```text
declare const HttpChatTransport: <Message extends UIMessage = UIMessage, R = never>({ processResponseStream, ...settings }: HttpChatTransportInitOptions<Message, R> & {
    readonly processResponseStream: (source: Stream.Stream<Uint8Array, AiSdkError>) => Stream.Stream<UIMessageChunk, AiSdkError, R>;
}) => Effect.Effect<ChatTransport<Message>, never, import("effect/Scope").Scope | R>;
```

## `HttpChatTransportInitOptions`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Configure defaults and per-request hooks for an HTTP chat transport.

```text
export type HttpChatTransportInitOptions<Message extends UIMessage, R = never> = {
    readonly api?: string;
    readonly credentials?: Resolvable<RequestCredentials, R>;
    readonly headers?: Resolvable<Record<string, string> | Headers, R>;
    readonly body?: Resolvable<object, R>;
    readonly fetch?: typeof globalThis.fetch;
    readonly prepareSendMessagesRequest?: PrepareSendMessagesRequest<Message, R>;
    readonly prepareReconnectToStreamRequest?: PrepareReconnectToStreamRequest<R>;
};
```

## `IdGenerator`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Represent an ID supplier as a lazy operation with a typed failure channel.

```text
export type IdGenerator = () => Effect.Effect<string, AiSdkError>;
```

## `ImageModel`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Accept a model registry ID or a supported image model handle.

```text
export type ImageModel = string | ImageModelV4 | legacy.ImageModelV3 | legacy.ImageModelV2;
```

## `ImageModelMiddleware`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Transform image parameters and wrap image generation in the operation context.

```text
export type ImageModelMiddleware<R = never> = Identity<ImageModelV4> & {
    readonly overrideMaxImagesPerCall?: (options: {
        model: ImageModelV4;
    }) => number | undefined | ((options: {
        modelId: string;
    }) => Middleware<R, number | undefined>);
    readonly overrideSupportsFileInputs?: (options: {
        model: ImageModelV4;
    }) => boolean | undefined;
    readonly overrideSupportsMaskInputs?: (options: {
        model: ImageModelV4;
    }) => boolean | undefined;
    readonly transformParams?: (options: ImageArgs) => Middleware<R, ImageArgs['params']>;
    readonly wrapGenerate?: (options: ImageArgs & {
        doGenerate: () => Effect.Effect<ImageResult, AiSdkError>;
    }) => Middleware<R, ImageResult>;
};
```

## `ImageModelProviderMetadata`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Metadata from the model provider for this call.

```text
type ImageModelProviderMetadata = ImageModelV4ProviderMetadata | ImageModelV2ProviderMetadata;
```

## `ImageModelResponseMetadata`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type ImageModelResponseMetadata = {
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

## `ImageModelUsage`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Usage information for an image model call.

```text
type ImageModelUsage = ImageModelV4Usage;
```

## `ImagePart`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Image content part of a prompt. It contains an image.

```text
interface ImagePart {
  type: 'image';
  /**
   * Image data. Can either be:
   *
   * - data: a base64-encoded string, a Uint8Array, an ArrayBuffer, or a Buffer
   * - URL: a URL that points to the image
   * - ProviderReference: a provider reference from `uploadFile`
   */
  image: DataContent | URL | ProviderReference;
  /**
   * Optional IANA media type of the image.
   *
   * @see https://www.iana.org/assignments/media-types/media-types.xhtml
   */
  mediaType?: string;
  /**
   * Additional provider-specific metadata. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerOptions?: ProviderOptions;
}
```

## `InferAgentUIMessage`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Infer the UI message type of an agent.

```text
type InferAgentUIMessage<AGENT, MESSAGE_METADATA = unknown> = UIMessage<MESSAGE_METADATA, never, InferUITools<InferAgentTools<AGENT>>>;
```

## `InferGenerateOutput`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Infer the complete value that a generation result exposes after parsing.

```text
export type InferGenerateOutput<Value extends Output> = Value extends OutputSpecification<infer A, unknown, unknown, unknown> ? A : never;
```

## `InferSchema`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Extract the validated value type shared by supported schema inputs.

```text
export type InferSchema<Value> = Value extends FlexibleSchema<infer A, unknown> ? A : never;
```

## `InferStreamOutput`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Infer the partial value produced while streaming output is still incomplete.

```text
export type InferStreamOutput<Value extends Output> = Value extends OutputSpecification<unknown, infer A, unknown, unknown> ? A : never;
```

## `InferTelemetryEvent`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Infer an event payload after restoring public Effect types on its adapted fields.

```text
export type InferTelemetryEvent<Event> = TelemetryEvent<sdk.InferTelemetryEvent<Event>>;
```

## `InferToolInput`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Infer input from a registered provider tool or the user-defined schema and metadata.

```text
export type InferToolInput<Definition> = Definition extends ProviderToolHandle<infer Input, unknown, unknown> ? Input : Definition extends ToolTypes<infer Input, unknown, unknown, unknown> ? Input : Definition extends {
    readonly inputSchema: FlexibleSchema<infer Input, unknown>;
} ? Input : never;
```

## `InferToolOutput`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Infer output from the registered tool metadata or the user-defined execution contract.

```text
export type InferToolOutput<Definition> = Definition extends ProviderToolHandle<unknown, infer Output, unknown> ? Output : Definition extends ToolTypes<unknown, infer Output, unknown, unknown> ? Output : ExecutionOutput<Callback<Definition, 'execute'>>;
```

## `InferUIDataParts`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type InferUIDataParts<T extends UIDataPartSchemas> = { [K in keyof T]: InferSchema<T[K]>; };
```

## `InferUIMessageChunk`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

```text
type InferUIMessageChunk<T extends UIMessage> = UIMessageChunk<InferUIMessageMetadata<T>, InferUIMessageData<T>>;
```

## `InferUITool`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Derive UI input and output types from the public tool declaration.

```text
export type InferUITool<T> = {
    input: InferToolInput<T>;
    output: InferToolOutput<T>;
};
```

## `InferUITools`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Infer the input and output types of a tool set so it can be used as a UI tool set.

```text
type InferUITools<TOOLS extends ToolSet> = { [NAME in keyof TOOLS & string]: InferUITool<TOOLS[NAME]>; };
```

## `Instructions`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** type.

Instructions to include in the prompt. Can be used with `prompt` or `messages`.

```text
type Instructions = string | SystemModelMessage | Array<SystemModelMessage>;
```

## `InvalidArgumentError`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Construct or identify the wrapped SDK failure for a request argument that violates an SDK precondition.
Shared Effect error type used for a request argument that violates an SDK precondition.

```text
declare const InvalidArgumentError: {
    new (args_0: {
        parameter: string;
        value: unknown;
        message: string;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
};
```

```text
export type InvalidArgumentError = AiSdkError;
```

## `InvalidDataContentError`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Construct or identify the wrapped SDK failure for a data value with an unsupported representation.
Shared Effect error type used for a data value with an unsupported representation.

```text
declare const InvalidDataContentError: {
    new (args_0: {
        content: unknown;
        cause?: unknown;
        message?: string;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
};
```

```text
export type InvalidDataContentError = AiSdkError;
```

## `InvalidMessageRoleError`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Construct or identify the wrapped SDK failure for an invalid model message role.
Shared Effect error type used for an invalid model message role.

```text
declare const InvalidMessageRoleError: {
    new (args_0: {
        role: string;
        message?: string;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
};
```

```text
export type InvalidMessageRoleError = AiSdkError;
```

## `InvalidPromptError`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Wrap a prompt rejected during SDK validation with the native arguments and expose its
SDK type guard.
Use the shared `AiSdkError` type for a prompt rejected during SDK validation.
`InvalidPromptError.isInstance` checks its SDK cause.

```text
declare const InvalidPromptError: {
    new (args_0: {
        prompt: unknown;
        message: string;
        cause?: unknown;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
};
```

```text
export type InvalidPromptError = AiSdkError;
```

## `InvalidResponseDataError`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Wrap response data rejected during SDK validation with the native arguments and expose
its SDK type guard.
Use the shared `AiSdkError` type for response data rejected during SDK validation.
`InvalidResponseDataError.isInstance` checks its SDK cause.

```text
declare const InvalidResponseDataError: {
    new (args_0: {
        data: unknown;
        message?: string;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
};
```

```text
export type InvalidResponseDataError = AiSdkError;
```

## `InvalidStreamPartError`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Construct or identify the wrapped SDK failure for an unsupported or malformed SDK stream part.
Shared Effect error type used for an unsupported or malformed SDK stream part.

```text
declare const InvalidStreamPartError: {
    new (args_0: {
        chunk: sdk.Experimental_LanguageModelStreamPart<any>;
        message: string;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
};
```

```text
export type InvalidStreamPartError = AiSdkError;
```

## `InvalidToolApprovalError`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Construct or identify the wrapped SDK failure for a tool approval response the SDK rejects.
Shared Effect error type used for a tool approval response the SDK rejects.

```text
declare const InvalidToolApprovalError: {
    new (args_0: {
        approvalId: string;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
};
```

```text
export type InvalidToolApprovalError = AiSdkError;
```

## `InvalidToolApprovalSignatureError`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Construct or identify the wrapped SDK failure for a tool approval signature that fails verification.
Shared Effect error type used for a tool approval signature that fails verification.

```text
declare const InvalidToolApprovalSignatureError: {
    new (args_0: {
        approvalId: string;
        toolCallId: string;
        reason: string;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
};
```

```text
export type InvalidToolApprovalSignatureError = AiSdkError;
```

## `InvalidToolInputError`

**Import:** `@jambudipa/ai-effect`, `@jambudipa/ai-effect/ai`.
**Kind:** value, type.

Construct or identify the wrapped SDK failure for a tool call with input that fails validation.
Shared Effect error type used for a tool call with input that fails validation.

```text
declare const InvalidToolInputError: {
    new (args_0: {
        message?: string;
        toolInput: string;
        toolName: string;
        cause: unknown;
    }): AiSdkError;
    isInstance(value: unknown): value is AiSdkError;
};
```

```text
export type InvalidToolInputError = AiSdkError;
```
