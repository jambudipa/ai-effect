---
title: '@jambudipa/ai-effect/provider-utils API'
doc-type: reference
sources: [src/protocols, src/internal, src/core-middleware.ts, package.json]
---

# @jambudipa/ai-effect/provider-utils API

> **TL;DR:** This reference lists the public declarations for this entry. Signatures and descriptions come from the package declarations.

Import path: `@jambudipa/ai-effect/provider-utils`. Conditions: `types`.

## `Arrayable`

A value that can be provided either as a single item, an array of items,
or be left undefined.

```text
type Arrayable<T> = T | T[] | undefined;
```

## `asArray`

Normalize one SDK value to a single-item array and preserve input arrays.

```text
asArray: <A>(value: sdk.Arrayable<A>) => A[]
```

## `asSchema`

Normalize supported input forms to a lazily resolved public schema.

```text
asSchema: <A, R = never>(input?: FlexibleSchema<A, R>) => LazySchema<A, R>
```

## `AssistantContent`

Content of an assistant message.
It can be a string or an array of text, image, reasoning, redacted reasoning, and tool call parts.

```text
type AssistantContent = string | Array<TextPart | CustomPart | FilePart | ReasoningPart | ReasoningFilePart | ToolCallPart | ToolResultPart | ToolApprovalRequest>;
```

## `AssistantModelMessage`

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

## `cancelResponseBody`

Request cancellation when a caller will leave the native response body unread.

```text
cancelResponseBody: (response: Response) => Effect.Effect<void, AiSdkError, never>
```

## `combineHeaders`

The public declaration does not include a description.

```text
combineHeaders: (...args: Parameters<typeof sdk.combineHeaders>) => import("effect/Effect").Effect<Record<string, string | undefined>, import("../internal/operation.js").AiSdkError, never>
```

## `connectToWebSocket`

Open a scoped connection and route native events to Effect callbacks. Scope release or
abort closes the connection.

```text
connectToWebSocket: <E = never, R = never>(options: ConnectOptions<E, R>) => Effect.Effect<{
    socket: Effect.Effect<WebSocketLike | undefined, AiSdkError, never>;
    close: (code?: number) => Effect.Effect<void, AiSdkError, never>;
}, AiSdkError, Scope.Scope | R>
```

## `Context`

A context object that is passed into tool execution.

```text
type Context = Record<string, unknown>;
```

## `convertAsyncIteratorToReadableStream`

Expose values from the native iterator as an Effect stream and manage the intermediate
reader.

```text
convertAsyncIteratorToReadableStream: <A>(iterator: AsyncIterator<A>) => Stream.Stream<A, AiSdkError, never>
```

## `convertBase64ToUint8Array`

The public declaration does not include a description.

```text
convertBase64ToUint8Array: (...args: Parameters<typeof sdk.convertBase64ToUint8Array>) => import("effect/Effect").Effect<Uint8Array<ArrayBuffer>, import("../internal/operation.js").AiSdkError, never>
```

## `convertImageModelFileToDataUri`

The public declaration does not include a description.

```text
convertImageModelFileToDataUri: (...args: Parameters<typeof sdk.convertImageModelFileToDataUri>) => import("effect/Effect").Effect<string, import("../internal/operation.js").AiSdkError, never>
```

## `convertInlineFileDataToUint8Array`

The public declaration does not include a description.

```text
convertInlineFileDataToUint8Array: (...args: Parameters<typeof sdk.convertInlineFileDataToUint8Array>) => import("effect/Effect").Effect<Uint8Array<ArrayBufferLike>, import("../internal/operation.js").AiSdkError, never>
```

## `convertJsonResponseToolStream`

Convert the native JSON response into tool stream parts under the supplied tool name.

```text
convertJsonResponseToolStream: (name: string) => Effect.Effect<Transform<LanguageModelV4StreamPart, LanguageModelV4StreamPart>, AiSdkError, never>
```

## `convertToBase64`

The public declaration does not include a description.

```text
convertToBase64: (...args: Parameters<typeof sdk.convertToBase64>) => import("effect/Effect").Effect<string, import("../internal/operation.js").AiSdkError, never>
```

## `convertToFormData`

Encode the record with the native FormData converter and map conversion failures.

```text
convertToFormData: <A extends Record<string, unknown>>(value: A, options?: Parameters<typeof sdk.convertToFormData<A>>[1]) => Effect.Effect<FormData, AiSdkError, never>
```

## `convertUint8ArrayToBase64`

The public declaration does not include a description.

```text
convertUint8ArrayToBase64: (...args: Parameters<typeof sdk.convertUint8ArrayToBase64>) => import("effect/Effect").Effect<string, import("../internal/operation.js").AiSdkError, never>
```

## `createBinaryResponseHandler`

Read the response bytes with the native SDK binary handler when the Effect runs.

```text
createBinaryResponseHandler: () => (input: HandlerInput) => Effect.Effect<{
    value: Uint8Array<ArrayBufferLike>;
    rawValue?: unknown;
    responseHeaders?: Record<string, string>;
}, AiSdkError, never>
```

## `createBinaryStreamResponseHandler`

Read a binary response as a stream that remains owned by the calling scope.

```text
createBinaryStreamResponseHandler: () => (input: HandlerInput) => Effect.Effect<{
    value: Stream.Stream<Uint8Array<ArrayBufferLike>, AiSdkError, never>;
    rawValue?: unknown;
    responseHeaders?: Record<string, string>;
}, AiSdkError, import("effect/Scope").Scope>
```

## `createEventSourceResponseHandler`

Decode server-sent JSON events and retain per-event validation details in a scoped
stream.

```text
createEventSourceResponseHandler: <A, R = never>(schema: Schema.ConstraintDecoder<A, R>) => (input: HandlerInput) => Effect.Effect<{
    value: Stream.Stream<EventResult<A>, AiSdkError, never>;
    rawValue?: unknown;
    responseHeaders?: Record<string, string>;
}, AiSdkError, import("effect/Scope").Scope | R>
```

## `createIdGenerator`

Allocate a native generator. Each ID request uses its current state when the returned
Effect runs.

```text
createIdGenerator: (options?: Parameters<typeof sdk.createIdGenerator>[0]) => Effect.Effect<() => Effect.Effect<string, AiSdkError, never>, AiSdkError, never>
```

## `createJsonErrorResponseHandler`

Parse a failed JSON response with the configured schema and normalize the SDK error
value.

```text
createJsonErrorResponseHandler: <A, R = never>(options: {
    readonly errorSchema: FlexibleSchema<A, R>;
    readonly errorToMessage: (error: A) => string;
    readonly isRetryable?: (response: Response, error?: A) => boolean;
}) => (input: HandlerInput) => Effect.Effect<{
    value: AiSdkError;
    rawValue?: unknown;
    responseHeaders?: Record<string, string>;
}, AiSdkError, Exclude<R, import("effect/Scope").Scope>>
```

## `createJsonLinesResponseHandler`

Decode newline-delimited JSON using the supplied schema and adapt iterator failures to
`AiSdkError`.

```text
createJsonLinesResponseHandler: <A, R = never>(schema: Schema.ConstraintDecoder<A, R>, options?: Parameters<typeof sdk.createJsonLinesResponseHandler<A>>[1]) => (input: HandlerInput) => Effect.Effect<{
    value: Stream.Stream<A, AiSdkError, never>;
    rawValue?: unknown;
    responseHeaders?: Record<string, string>;
}, AiSdkError, import("effect/Scope").Scope | R>
```

## `createJsonResponseHandler`

Decode a JSON response with an Effect schema. Scope the decoder environment to this
response.

```text
createJsonResponseHandler: <A, R = never>(schema: Schema.ConstraintDecoder<A, R>, options?: Parameters<typeof sdk.createJsonResponseHandler<A>>[1]) => (input: HandlerInput) => Effect.Effect<{
    value: A;
    rawValue?: unknown;
    responseHeaders?: Record<string, string>;
}, AiSdkError, Exclude<R, import("effect/Scope").Scope>>
```

## `createLanguageModelResponseMetadata`

The public declaration does not include a description.

```text
createLanguageModelResponseMetadata: (...args: Parameters<typeof sdk.createLanguageModelResponseMetadata>) => import("effect/Effect").Effect<import("@ai-sdk/provider").LanguageModelV4ResponseMetadata, import("../internal/operation.js").AiSdkError, never>
```

## `createNullLanguageModelUsage`

The public declaration does not include a description.

```text
createNullLanguageModelUsage: (...args: Parameters<typeof sdk.createNullLanguageModelUsage>) => import("effect/Effect").Effect<import("@ai-sdk/provider").LanguageModelV4Usage, import("../internal/operation.js").AiSdkError, never>
```

## `createProviderDefinedToolFactory`

Create a reusable provider-defined tool factory with an adapted input schema.

```text
createProviderDefinedToolFactory: <I, Args extends object, C extends sdk.Context = {}>(options: ToolFactoryOptions<I>) => Effect.Effect<ProviderDefinedToolFactory<I, Args, C>, AiSdkError>
```

## `createProviderDefinedToolFactoryWithOutputSchema`

Create a provider-defined factory that keeps a typed output schema on its descriptor.

```text
createProviderDefinedToolFactoryWithOutputSchema: <I, A, Args extends object, C extends sdk.Context = {}>(options: OutputToolFactoryOptions<I, A>) => Effect.Effect<AdaptedFactory<ReturnType<typeof sdk.createProviderDefinedToolFactoryWithOutputSchema<I, A, Args, C>>>, AiSdkError>
```

## `createProviderExecutedToolFactory`

Create a tool factory whose descriptors signal that the provider owns execution.

```text
createProviderExecutedToolFactory: <I, A, Args extends object, C extends sdk.Context = {}>(options: OutputToolFactoryOptions<I, A> & {
    readonly supportsDeferredResults?: boolean;
}) => Effect.Effect<AdaptedFactory<ReturnType<typeof sdk.createProviderExecutedToolFactory<I, A, Args, C>>>, AiSdkError>
```

## `createProviderStreamError`

The public declaration does not include a description.

```text
createProviderStreamError: (...args: Parameters<typeof sdk.createProviderStreamError>) => import("effect/Effect").Effect<sdk.ProviderStreamError, import("../internal/operation.js").AiSdkError, never>
```

## `createStatusCodeErrorResponseHandler`

Classify an unsuccessful response from its status code and return the SDK error as
`AiSdkError`.

```text
createStatusCodeErrorResponseHandler: () => (input: HandlerInput) => Effect.Effect<{
    value: AiSdkError;
    rawValue?: unknown;
    responseHeaders?: Record<string, string>;
}, AiSdkError, never>
```

## `createTextOutputCapture`

Create an SDK capture object whose append and read operations run inside Effects.

```text
createTextOutputCapture: (options: Parameters<typeof sdk.createTextOutputCapture>[0]) => Effect.Effect<{
    append: (chunk: string) => Effect.Effect<void, AiSdkError, never>;
    text: Effect.Effect<string, AiSdkError, never>;
    length: Effect.Effect<number, AiSdkError, never>;
}, AiSdkError, never>
```

## `createToolNameMapping`

Build the native bidirectional mapping between provider and application tool names.

```text
createToolNameMapping: (options: Parameters<typeof sdk.createToolNameMapping>[0]) => Effect.Effect<{
    toProviderToolName: (name: string) => Effect.Effect<string, AiSdkError, never>;
    toCustomToolName: (name: string) => Effect.Effect<string, AiSdkError, never>;
}, AiSdkError, never>
```

## `CustomPart`

Custom content part of a prompt. It contains no standardized payload beyond
provider-specific options.

```text
interface CustomPart {
  type: 'custom';
  /**
   * The kind of custom content, in the format `{provider}.{provider-type}`.
   */
  kind: `${string}.${string}`;
  /**
   * Additional provider-specific metadata. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerOptions?: ProviderOptions;
}
```

## `DataContent`

Data content. Can either be a base64-encoded string, a Uint8Array, an ArrayBuffer, or a Buffer.

```text
type DataContent = string | Uint8Array | ArrayBuffer | Buffer;
```

## `DEFAULT_MAX_DOWNLOAD_SIZE`

Expose the native default limit in bytes for downloads without a supplied budget.

```text
DEFAULT_MAX_DOWNLOAD_SIZE: number
```

## `delay`

Wait the given number of milliseconds on the Effect clock and observe an optional abort
signal.

```text
delay: (milliseconds?: number | null, options?: {
    abortSignal?: AbortSignal;
}) => Effect.Effect<void, AiSdkError, never>
```

## `DelayedPromise`

Adapt an externally settled SDK promise. Consumers wait, resolve, and reject it through
Effects.

```text
export declare class DelayedPromise<A> {
    private readonly native;
    /** Allocate one native pending value per Effect execution. */
    static make<A>(): Effect.Effect<DelayedPromise<A>, AiSdkError, never>;
    /** Keep one native state holder for the lifetime of this wrapper. */
    private constructor();
    /**
     * Await native settlement through the request bridge. A rejection enters the typed
     * failure channel.
     */
    get promise(): Effect.Effect<A, AiSdkError, never>;
    /** Settle the pending native promise with this value when the Effect runs. */
    resolve(value: A): Effect.Effect<void, AiSdkError, never>;
    /** Settle the pending native promise with this failure when the Effect runs. */
    reject(error: unknown): Effect.Effect<void, AiSdkError, never>;
    /** Read the native success state lazily. */
    isResolved(): Effect.Effect<boolean, AiSdkError, never>;
    /** Read the native rejection state lazily. */
    isRejected(): Effect.Effect<boolean, AiSdkError, never>;
    /** Read whether the native promise still awaits settlement. */
    isPending(): Effect.Effect<boolean, AiSdkError, never>;
}
```

## `deleteFromApi`

Send a native DELETE request inside Effect and use the configured response handlers.

```text
deleteFromApi: <A, E = AiSdkError, R = never>(options: HttpRequest<Parameters<typeof sdk.deleteFromApi<A>>[0], A, E, R>) => Effect.Effect<{
    value: A;
    rawValue?: unknown;
    responseHeaders?: Record<string, string>;
}, AiSdkError, import("effect/Scope").Scope | R>
```

## `detectMediaType`

The public declaration does not include a description.

```text
detectMediaType: (...args: Parameters<typeof sdk.detectMediaType>) => import("effect/Effect").Effect<string | undefined, import("../internal/operation.js").AiSdkError, never>
```

## `downloadBlob`

Start the SDK download when the Effect runs and pass runtime interruption to its abort
signal.

```text
downloadBlob: (url: string, options?: Parameters<typeof sdk.downloadBlob>[1]) => Effect.Effect<Blob, AiSdkError, never>
```

## `DownloadError`

Construct the native SDK download failure with its original options wrapped in
`AiSdkError`.
Classify download failures in the shared `AiSdkError` channel.

```text
DownloadError: {
    make: (args_0: {
        url: string;
        statusCode?: number;
        statusText?: string;
        message?: string;
        cause?: unknown;
    }) => Effect.Effect<AiSdkError, AiSdkError, never>;
    isInstance: (value: unknown) => value is AiSdkError;
}
```

```text
export type DownloadError = AiSdkError;
```

## `dynamicTool`

Mark a tool descriptor as dynamic while retaining its supplied schema and Effect
callbacks.

```text
dynamicTool: <Input, Output, E, R, Context = unknown>(options: EffectToolOptions<Input, Output, E, R, Context>) => DynamicTool<Input, Output, Context, E, R>
```

## `DynamicTool`

Set the dynamic discriminator on an application tool so the host can mark
runtime-defined tools.

```text
export type DynamicTool<I = unknown, A = unknown, C = unknown, E = never, R = never> = Omit<FunctionTool<I, A, C, E, R>, 'type'> & {
    readonly type: 'dynamic';
};
```

## `EmbeddingModelProviderOptionsTransformer`

Transform native embedding provider options through Effect while retaining the SDK
argument list.

```text
export type EmbeddingModelProviderOptionsTransformer<E = never, R = never> = (...args: Parameters<sdk.EmbeddingModelProviderOptionsTransformer>) => Effect.Effect<Awaited<ReturnType<sdk.EmbeddingModelProviderOptionsTransformer>>, E, R>;
```

## `encodePathSegment`

The public declaration does not include a description.

```text
encodePathSegment: (...args: Parameters<typeof sdk.encodePathSegment>) => import("effect/Effect").Effect<string, import("../internal/operation.js").AiSdkError, never>
```

## `EventSourceMessage`

A parsed EventSource message event

**@public**

```text
export declare interface EventSourceMessage {
  /**
   * The event type sent from the server. Note that this differs from the browser `EventSource`
   * implementation in that browsers will default this to `message`, whereas this parser will
   * leave this as `undefined` if not explicitly declared.
   */
  event?: string | undefined;
  /**
   * ID of the message, if any was provided by the server. Can be used by clients to keep the
   * last received message ID in sync when reconnecting.
   */
  id?: string | undefined;
  /**
   * The data received for this message
   */
  data: string;
}
```

## `EventSourceParserStream`

Create a native server-sent event parser with an Effect output stream.
Use the writer and Effect reader returned by `EventSourceParserStream.make` together.

```text
EventSourceParserStream: {
    make: () => Effect.Effect<Transform<string, sdk.EventSourceMessage>, AiSdkError, never>;
}
```

```text
export type EventSourceParserStream = Effect.Success<ReturnType<typeof EventSourceParserStream.make>>;
```

## `ExecutableTool`

Require an `execute` callback on a descriptor after checking its execution capability.

```text
export type ExecutableTool<T extends ToolWithExecute> = T & {
    readonly execute: NonNullable<T['execute']>;
};
```

## `executeTool`

Stream tool output as preliminary parts. The final part carries the last emitted value
if the stream completes.

```text
executeTool: <I, A, C, E, R>(input: {
    readonly tool: Executable<I, A, C, E, R>;
    readonly input: I;
    readonly options: ExecutionOptions<C>;
}) => Stream.Stream<ToolOutput<A>, E | AiSdkError, R>
```

## `EXPERIMENTAL_EMBEDDING_MODEL_MAX_INPUT_BYTES_PER_CALL`

Use the SDK symbol that stores the provider model byte budget for a single embedding
call.

```text
EXPERIMENTAL_EMBEDDING_MODEL_MAX_INPUT_BYTES_PER_CALL: typeof sdk.EXPERIMENTAL_EMBEDDING_MODEL_MAX_INPUT_BYTES_PER_CALL
```

## `EXPERIMENTAL_EMBEDDING_MODEL_PROVIDER_OPTIONS_TRANSFORMER`

Use the SDK symbol that identifies the embedding provider option transformer.

```text
EXPERIMENTAL_EMBEDDING_MODEL_PROVIDER_OPTIONS_TRANSFORMER: symbol
```

## `experimental_getToolCaller`

Read a configured tool caller annotation. Unannotated and absent tools both yield
`undefined`.

```text
experimental_getToolCaller: <R, Bound extends EffectTools[string], Prepare>(tool?: EffectTools[string] & {
    readonly experimental_toolCaller?: ToolCaller<R, Bound, Prepare>;
}) => ToolCaller<R, Bound, Prepare> | undefined
```

## `experimental_parseSpeechStreamClientFrame`

The public declaration does not include a description.

```text
experimental_parseSpeechStreamClientFrame: (...args: Parameters<typeof sdk.experimental_parseSpeechStreamClientFrame>) => import("effect/Effect").Effect<sdk.Experimental_SpeechStreamClientFrame, import("../internal/operation.js").AiSdkError, never>
```

## `experimental_parseSpeechStreamPart`

The public declaration does not include a description.

```text
experimental_parseSpeechStreamPart: (...args: Parameters<typeof sdk.experimental_parseSpeechStreamPart>) => import("effect/Effect").Effect<import("@ai-sdk/provider").Experimental_SpeechModelV4StreamPart | undefined, import("../internal/operation.js").AiSdkError, never>
```

## `experimental_parseTranscriptionStreamClientFrame`

The public declaration does not include a description.

```text
experimental_parseTranscriptionStreamClientFrame: (...args: Parameters<typeof sdk.experimental_parseTranscriptionStreamClientFrame>) => import("effect/Effect").Effect<sdk.Experimental_TranscriptionStreamClientFrame, import("../internal/operation.js").AiSdkError, never>
```

## `experimental_parseTranscriptionStreamPart`

The public declaration does not include a description.

```text
experimental_parseTranscriptionStreamPart: (...args: Parameters<typeof sdk.experimental_parseTranscriptionStreamPart>) => import("effect/Effect").Effect<import("@ai-sdk/provider").Experimental_TranscriptionModelV4StreamPart | undefined, import("../internal/operation.js").AiSdkError, never>
```

## `Experimental_SandboxDeleteFileOptions`

The public declaration does not include a description.

```text
type SandboxDeleteFileOptions = PathOptions;
```

## `Experimental_SandboxDirectoryEntry`

Entry in a directory listing, returned by `SandboxSession.listDirectory`.

```text
type SandboxDirectoryEntry = {
  /**
   * Name of the entry, without the directory path.
   */
  name: string;
  /**
   * Type of the entry. Symbolic links are reported as `symlink` and not
   * followed. `other` covers devices, sockets, and named pipes.
   */
  type: 'file' | 'directory' | 'symlink' | 'other';
};
```

## `Experimental_SandboxFileStat`

Information about a file or directory in the sandbox, returned by
`SandboxSession.stat`. Symbolic links are followed.

```text
type SandboxFileStat = {
  /**
   * Type of the path. `other` covers devices, sockets, and named pipes.
   */
  type: 'file' | 'directory' | 'other';
  /**
   * Size in bytes. The size of a directory is implementation-defined.
   */
  size: number;
};
```

## `Experimental_SandboxListDirectoryOptions`

The public declaration does not include a description.

```text
type SandboxListDirectoryOptions = PathOptions;
```

## `Experimental_SandboxProcess`

Represent the Effect process handle returned by sandbox execution.

```text
export type Experimental_SandboxProcess = import('../integrations/internal/sandbox-base.js').Process;
```

## `Experimental_SandboxReadBinaryFileOptions`

The public declaration does not include a description.

```text
type SandboxReadBinaryFileOptions = PathOptions;
```

## `Experimental_SandboxReadFileOptions`

The public declaration does not include a description.

```text
type SandboxReadFileOptions = PathOptions;
```

## `Experimental_SandboxReadTextFileOptions`

The public declaration does not include a description.

```text
type SandboxReadTextFileOptions = PathOptions & {
  /**
   * Text encoding used to decode the file bytes. Defaults to `"utf-8"`.
   */
  encoding?: string;
  /**
   * 1-based inclusive start line. Defaults to 1.
   */
  startLine?: number;
  /**
   * 1-based inclusive end line. When past the file's line count, the read
   * returns through EOF without error.
   */
  endLine?: number;
};
```

## `Experimental_SandboxRunOptions`

The public declaration does not include a description.

```text
type SandboxRunOptions = SandboxProcessOptions & {
  /**
   * Optional positive safe integer limiting each returned output stream to at
   * most this many UTF-16 code units. The command still runs to completion and its
   * remaining output is drained and discarded. Supporting implementations
   * return `stdoutLength` and `stderrLength` with the original stream lengths.
   * Older implementations may ignore this option and return the full output.
   * Native sandbox runtimes may impose their own buffering and output limits.
   */
  maxOutputLength?: number;
};
```

## `Experimental_SandboxSession`

Expose the integration sandbox session to provider utility consumers with its Effect
operations.

```text
export type Experimental_SandboxSession = import('../integrations/internal/sandbox-base.js').SandboxSession;
```

## `Experimental_SandboxSpawnOptions`

The public declaration does not include a description.

```text
type SandboxSpawnOptions = SandboxProcessOptions & {
  stdin?: boolean;
};
```

## `Experimental_SandboxSpawnOptionsWithoutStdin`

The public declaration does not include a description.

```text
type SandboxSpawnOptionsWithoutStdin = SandboxProcessOptions & {
  stdin?: false;
};
```

## `Experimental_SandboxSpawnOptionsWithStdin`

The public declaration does not include a description.

```text
type SandboxSpawnOptionsWithStdin = SandboxProcessOptions & {
  stdin: true;
};
```

## `Experimental_SandboxStatOptions`

The public declaration does not include a description.

```text
type SandboxStatOptions = PathOptions;
```

## `Experimental_SandboxWriteBinaryFileOptions`

The public declaration does not include a description.

```text
type SandboxWriteBinaryFileOptions = WriteFileOptions<Uint8Array>;
```

## `Experimental_SandboxWriteFileOptions`

The public declaration does not include a description.

```text
type SandboxWriteFileOptions = WriteFileOptions<ReadableStream<Uint8Array>>;
```

## `Experimental_SandboxWriteTextFileOptions`

The public declaration does not include a description.

```text
type SandboxWriteTextFileOptions = WriteFileOptions<string> & {
  /**
   * Text encoding used to encode the string to bytes. Defaults to `"utf-8"`.
   */
  encoding?: string;
};
```

## `experimental_serializeSpeechStreamPart`

The public declaration does not include a description.

```text
experimental_serializeSpeechStreamPart: (...args: Parameters<typeof sdk.experimental_serializeSpeechStreamPart>) => import("effect/Effect").Effect<string | undefined, import("../internal/operation.js").AiSdkError, never>
```

## `experimental_serializeTranscriptionStreamPart`

The public declaration does not include a description.

```text
experimental_serializeTranscriptionStreamPart: (...args: Parameters<typeof sdk.experimental_serializeTranscriptionStreamPart>) => import("effect/Effect").Effect<string | undefined, import("../internal/operation.js").AiSdkError, never>
```

## `EXPERIMENTAL_SPEECH_STREAM_START_FRAME_TYPE`

Identify the native realtime speech frame that starts a synthesis stream.

```text
EXPERIMENTAL_SPEECH_STREAM_START_FRAME_TYPE = "speech-stream.start"
```

## `EXPERIMENTAL_SPEECH_STREAM_TEXT_DELTA_FRAME_TYPE`

Identify the native realtime speech frame containing another portion of input text.

```text
EXPERIMENTAL_SPEECH_STREAM_TEXT_DELTA_FRAME_TYPE = "speech-stream.text-delta"
```

## `EXPERIMENTAL_SPEECH_STREAM_TEXT_DONE_FRAME_TYPE`

Identify the native speech frame that completes text input.

```text
EXPERIMENTAL_SPEECH_STREAM_TEXT_DONE_FRAME_TYPE = "speech-stream.text-done"
```

## `Experimental_SpeechStreamClientFrame`

Server-side classification of a client TEXT frame.

```text
type SpeechStreamClientFrame = {
  type: 'start';
  frame: SpeechStreamStartFrame;
} | {
  type: 'text-delta';
  delta: string;
  voice?: string;
  providerOptions?: Record<string, JSONObject>;
} | {
  type: 'text-done';
} | {
  /** Malformed JSON or a recognized frame with an invalid shape. */
  type: 'invalid';
  message: string;
} | {
  /** Unrecognized frame type; ignore for forward compatibility. */
  type: 'unknown';
};
```

## `Experimental_SpeechStreamStartFrame`

The client's session start frame. Optional keys are omitted when undefined.

```text
type SpeechStreamStartFrame = {
  type: typeof SPEECH_STREAM_START_FRAME_TYPE;
  voice?: string;
  outputFormat?: SharedV4AudioFormat;
  instructions?: string;
  speed?: number;
  language?: string;
  /** Provider-specific options, passed through verbatim. */
  providerOptions?: Record<string, JSONObject>;
  /** When true, the server should include `raw` parts in the stream. */
  includeRawChunks?: boolean;
};
```

## `Experimental_SpeechStreamTextDeltaFrame`

A client frame carrying one input text delta, i.e. one text part. Optional
keys are omitted when undefined.

```text
type SpeechStreamTextDeltaFrame = {
  type: typeof SPEECH_STREAM_TEXT_DELTA_FRAME_TYPE;
  delta: string;
  voice?: string;
  providerOptions?: Record<string, JSONObject>;
};
```

## `experimental_toolCaller`

Attach caller hooks that complete synchronously during native tool setup.

```text
experimental_toolCaller: <A extends EffectTools[string], R = never, Bound extends EffectTools[string] = EffectTools[string], Prepare = R>(tool: A, definition: ToolCaller<R, Bound, Prepare>) => Effect.Effect<ToolWithCaller<A, R, Bound, Prepare>, AiSdkError, never>
```

## `Experimental_ToolCallerDefinition`

Configure tool preparation and binding with Effect requirements carried in the tool
caller contract.

```text
export type Experimental_ToolCallerDefinition<R = never, Bound extends EffectTools[string] = EffectTools[string], Prepare = R> = ToolCaller<R, Bound, Prepare>;
```

## `Experimental_ToolCallerTool`

Keep the concrete tool shape while requiring the attached tool caller annotation.

```text
export type Experimental_ToolCallerTool<T extends object = EffectTools[string], R = never, Bound extends EffectTools[string] = EffectTools[string], Prepare = R> = ToolWithCaller<T, R, Bound, Prepare>;
```

## `EXPERIMENTAL_TRANSCRIPTION_STREAM_AUDIO_DONE_FRAME_TYPE`

Identify the native transcription frame that marks the end of audio input.

```text
EXPERIMENTAL_TRANSCRIPTION_STREAM_AUDIO_DONE_FRAME_TYPE = "transcription-stream.audio-done"
```

## `EXPERIMENTAL_TRANSCRIPTION_STREAM_START_FRAME_TYPE`

Identify the native frame that starts a transcription stream.

```text
EXPERIMENTAL_TRANSCRIPTION_STREAM_START_FRAME_TYPE = "transcription-stream.start"
```

## `Experimental_TranscriptionStreamClientFrame`

Server-side classification of a client TEXT frame.

```text
type TranscriptionStreamClientFrame = {
  type: 'start';
  frame: TranscriptionStreamStartFrame;
} | {
  type: 'audio-done';
} | {
  /** Malformed JSON or a recognized frame with an invalid shape. */
  type: 'invalid';
  message: string;
} | {
  /** Unrecognized frame type; ignore for forward compatibility. */
  type: 'unknown';
};
```

## `Experimental_TranscriptionStreamStartFrame`

The client's session start frame. Optional keys are omitted when undefined.

```text
type TranscriptionStreamStartFrame = {
  type: typeof TRANSCRIPTION_STREAM_START_FRAME_TYPE;
  /** Audio format of the binary audio frames, e.g. `{ type: 'audio/pcm', rate: 16000 }`. */
  inputAudioFormat: {
    type: string;
    rate?: number;
  };
  /** Provider-specific options, passed through verbatim. */
  providerOptions?: Record<string, JSONObject>;
  /** When true, the server should include `raw` parts in the stream. */
  includeRawChunks?: boolean;
};
```

## `Experimental_WritableSandboxProcess`

Require a native byte writer for processes that accept input over stdin.

```text
export type Experimental_WritableSandboxProcess = Experimental_SandboxProcess & {
    readonly stdin: WritableStream<Uint8Array>;
};
```

## `extractLines`

The public declaration does not include a description.

```text
extractLines: (...args: Parameters<typeof sdk.extractLines>) => import("effect/Effect").Effect<string, import("../internal/operation.js").AiSdkError, never>
```

## `extractResponseHeaders`

Convert a native response header collection to the SDK record shape.

```text
extractResponseHeaders: (response: Response) => {
    [k: string]: string;
}
```

## `FetchFunction`

Fetch function type (standardizes the version of fetch used).

```text
export type FetchFunction = typeof globalThis.fetch;
```

## `fetchUntrustedUrl`

Run the SDK fetch with its untrusted-URL policy and pass through the caller cancellation
signal.

```text
fetchUntrustedUrl: (options: Parameters<typeof sdk.fetchUntrustedUrl>[0]) => Effect.Effect<Response, AiSdkError, never>
```

## `fetchWithValidatedEndpoint`

Use the native endpoint validation path while linking any request signal to Effect
interruption.

```text
fetchWithValidatedEndpoint: (options: Parameters<typeof sdk.fetchWithValidatedEndpoint>[0]) => Effect.Effect<Response, AiSdkError, never>
```

## `fetchWithValidatedRedirects`

Delegate redirect validation to the SDK and propagate interruption to its request
signal.

```text
fetchWithValidatedRedirects: (options: Parameters<typeof sdk.fetchWithValidatedRedirects>[0]) => Effect.Effect<Response, AiSdkError, never>
```

## `FileData`

File data as a tagged discriminated union:

- `{ type: 'data', data }`: raw bytes (`Uint8Array`, `ArrayBuffer`, or
  `Buffer`) or a base64-encoded string.
- `{ type: 'url', url }`: a URL that points to the file.
- `{ type: 'reference', reference }`: a provider reference (`{ [provider]: id }`).
- `{ type: 'text', text }`: inline text content (e.g. an inline text document).

```text
type FileData = FileDataData | FileDataUrl | FileDataReference | FileDataText;
```

## `FileDataData`

File data variant containing raw bytes (`Uint8Array`, `ArrayBuffer`, or
`Buffer`) or a base64-encoded string.

This is slightly more permissive than `SharedV4FileDataData`.

```text
interface FileDataData {
  type: 'data';
  data: DataContent;
}
```

## `FileDataReference`

File data variant containing a provider reference (`{ [provider]: id }`).

```text
type FileDataReference = SharedV4FileDataReference;
```

## `FileDataText`

File data variant containing inline text content (e.g. an inline text
document).

```text
type FileDataText = SharedV4FileDataText;
```

## `FileDataUrl`

File data variant containing a URL that points to the file.

```text
type FileDataUrl = SharedV4FileDataUrl;
```

## `FilePart`

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

## `filterNullable`

Collect values in argument order and omit `null` and `undefined`.

```text
filterNullable: <A>(...values: Array<A | undefined | null>) => A[]
```

## `FlexibleSchema`

Accept native, Effect, Standard Schema, and effectful schema inputs at one boundary.

```text
export type FlexibleSchema<A, R = never> = Schema<A, R> | EffectSchema.ConstraintDecoder<A, R> | ExternalSchema<A> | LazySchema<A, R>;
```

## `FunctionTool`

Describe an application function tool with typed inputs and optional Effect execution.

```text
export type FunctionTool<I = unknown, A = unknown, C = unknown, E = never, R = never> = Omit<EffectToolOptions<I, A, E, R, C>, 'type'> & {
    readonly type?: 'function';
};
```

## `generateId`

The public declaration does not include a description.

```text
generateId: (...args: Parameters<typeof sdk.generateId>) => import("effect/Effect").Effect<string, import("../internal/operation.js").AiSdkError, never>
```

## `getErrorMessage`

The public declaration does not include a description.

```text
getErrorMessage: (...args: Parameters<typeof sdk.getErrorMessage>) => import("effect/Effect").Effect<string, import("../internal/operation.js").AiSdkError, never>
```

## `getFromApi`

Send an SDK GET request with scoped response handlers and linked abort signals.

```text
getFromApi: <A, E = AiSdkError, R = never>(options: HttpRequest<Parameters<typeof sdk.getFromApi<A>>[0], A, E, R>) => Effect.Effect<{
    value: A;
    rawValue?: unknown;
    responseHeaders?: Record<string, string>;
}, AiSdkError, import("effect/Scope").Scope | R>
```

## `getRuntimeEnvironmentUserAgent`

Produce the SDK user-agent token for the supplied runtime or the default host.

```text
getRuntimeEnvironmentUserAgent: (host?: unknown) => string
```

## `getTopLevelMediaType`

The public declaration does not include a description.

```text
getTopLevelMediaType: (...args: Parameters<typeof sdk.getTopLevelMediaType>) => import("effect/Effect").Effect<string, import("../internal/operation.js").AiSdkError, never>
```

## `getWebSocketConstructor`

Resolve the configured or runtime SDK constructor and return a factory for wrapped
sockets.

```text
getWebSocketConstructor: (webSocket?: WebSocketConstructor) => Effect.Effect<(url: string | URL, protocols?: string | string[], options?: SocketOptions) => Effect.Effect<WebSocketLike, AiSdkError, Scope.Scope>, AiSdkError, never>
```

## `HasRequiredKey`

Checks if an object has required keys.

**@param**: OBJECT - The object to check.

**@returns**: True if the object has required keys, false otherwise.

```text
type HasRequiredKey<OBJECT> = {} extends OBJECT ? false : true;
```

## `IdGenerator`

Generate each next ID as an Effect after the generator has been allocated.

```text
export type IdGenerator = Effect.Success<ReturnType<typeof createIdGenerator>>;
```

## `ImagePart`

Image content part of a prompt. It contains an image.

**@deprecated**: Use `FilePart` with `mediaType: 'image'` instead:
`{ type: 'file', mediaType: 'image', data: { type: 'data', data } }`.

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

## `InferSchema`

The public declaration does not include a description.

```text
type InferSchema<SCHEMA> = SCHEMA extends StandardSchema<infer T> ? T : SCHEMA extends ZodSchema<infer T> ? T : SCHEMA extends LazySchema<infer T> ? T : SCHEMA extends Schema<infer T> ? T : never;
```

## `InferToolContext`

Treat unspecified or empty context as unrequired when preparing tool inputs.

```text
export type InferToolContext<Definition> = unknown extends DeclaredContext<Definition> ? never : keyof NonNullable<DeclaredContext<Definition>> extends never ? never : string extends keyof NonNullable<DeclaredContext<Definition>> ? never : DeclaredContext<Definition>;
```

## `InferToolInput`

Infer input from a registered provider tool or the user-defined schema and metadata.

```text
export type InferToolInput<Definition> = Definition extends ProviderToolHandle<infer Input, unknown, unknown> ? Input : Definition extends ToolTypes<infer Input, unknown, unknown, unknown> ? Input : Definition extends {
    readonly inputSchema: FlexibleSchema<infer Input, unknown>;
} ? Input : never;
```

## `InferToolOutput`

Infer output from the registered tool metadata or the user-defined execution contract.

```text
export type InferToolOutput<Definition> = Definition extends ProviderToolHandle<unknown, infer Output, unknown> ? Output : Definition extends ToolTypes<unknown, infer Output, unknown, unknown> ? Output : ExecutionOutput<Callback<Definition, 'execute'>>;
```

## `InferToolSetContext`

Assemble the context record keyed by tool name with the appropriate optional fields.

```text
export type InferToolSetContext<Tools extends EffectTools> = {
    [Name in keyof (RequiredToolContext<Tools> & OptionalToolContext<Tools>)]: (RequiredToolContext<Tools> & OptionalToolContext<Tools>)[Name];
};
```

## `injectJsonInstructionIntoMessages`

The public declaration does not include a description.

```text
injectJsonInstructionIntoMessages: (...args: Parameters<typeof sdk.injectJsonInstructionIntoMessages>) => import("effect/Effect").Effect<import("@ai-sdk/provider").LanguageModelV4Prompt, import("../internal/operation.js").AiSdkError, never>
```

## `isAbortError`

Identify abort failures using the SDK error guard before classifying request errors.

```text
isAbortError: (input: unknown) => input is Error
```

## `isArrayBuffer`

Recognize an `ArrayBuffer` with the SDK guard at a binary boundary.

```text
isArrayBuffer: (input: unknown) => input is ArrayBuffer
```

## `isBrowserRuntime`

Detect a browser using the supplied runtime object or the SDK default host.

```text
isBrowserRuntime: (host?: unknown) => boolean
```

## `isBuffer`

Check for a Node buffer using the runtime-aware SDK guard.

```text
isBuffer: (input: unknown) => input is Buffer
```

## `isCustomReasoning`

Detect an explicit reasoning level or `none`. An omitted value leaves reasoning to the
provider.

```text
isCustomReasoning: (...args: Parameters<typeof sdk.isCustomReasoning>) => boolean
```

## `isExecutableTool`

Narrow the tool to one whose `execute` callback is available.

```text
isExecutableTool: <T extends ToolWithExecute>(tool: T | undefined) => tool is T & {
    readonly execute: NonNullable<T["execute"]>;
}
```

## `isFullMediaType`

The public declaration does not include a description.

```text
isFullMediaType: (...args: Parameters<typeof sdk.isFullMediaType>) => import("effect/Effect").Effect<boolean, import("../internal/operation.js").AiSdkError, never>
```

## `isNonNullable`

Narrow an optional value to exclude both `null` and `undefined`.

```text
isNonNullable: <A>(input: A | undefined | null) => input is NonNullable<A>
```

## `isParsableJson`

The public declaration does not include a description.

```text
isParsableJson: (...args: Parameters<typeof sdk.isParsableJson>) => import("effect/Effect").Effect<boolean, import("../internal/operation.js").AiSdkError, never>
```

## `isProviderReference`

Apply the SDK provider reference guard to distinguish model asset references from binary
payloads and URLs.

```text
isProviderReference: (...args: Parameters<typeof sdk.isProviderReference>) => boolean
```

## `isProviderStreamError`

Identify the SDK stream error shape before handling a provider stream termination.

```text
isProviderStreamError: (...args: Parameters<typeof sdk.isProviderStreamError>) => boolean
```

## `isRecord`

Apply the native object guard before reading fields from unknown SDK data.

```text
isRecord: (input: unknown) => input is Record<string, unknown>
```

## `isSameOrigin`

The public declaration does not include a description.

```text
isSameOrigin: (...args: Parameters<typeof sdk.isSameOrigin>) => import("effect/Effect").Effect<boolean, import("../internal/operation.js").AiSdkError, never>
```

## `isUint8Array`

Check for the native byte array type used by the binary provider paths.

```text
isUint8Array: (input: unknown) => input is Uint8Array
```

## `isUrlSupported`

The public declaration does not include a description.

```text
isUrlSupported: (...args: Parameters<typeof sdk.isUrlSupported>) => import("effect/Effect").Effect<boolean, import("../internal/operation.js").AiSdkError, never>
```

## `isValidHostnamePart`

The public declaration does not include a description.

```text
isValidHostnamePart: (...args: Parameters<typeof sdk.isValidHostnamePart>) => import("effect/Effect").Effect<boolean, import("../internal/operation.js").AiSdkError, never>
```

## `jsonSchema`

Register a lazy JSON Schema document and an optional Effect validation callback.

```text
jsonSchema: <A = unknown, R = never>(document: SchemaDocument<R>, options?: {
    readonly validate?: ValidateFunction<A, R>;
}) => Effect.Effect<Schema<A, R>>
```

## `lazySchema`

Create a reusable cached schema resolution effect without running its constructor immediately.

```text
lazySchema: <A, R>(create: () => LazySchema<A, R>) => Effect.Effect<Effect.Effect<Schema<A, R>, AiSdkError, R>, never, never>
```

## `LazySchema`

Resolve a schema lazily with access to its required Effect services.

```text
export type LazySchema<A, R = never> = Effect.Effect<Schema<A, R>, AiSdkError, R>;
```

## `loadApiKey`

The public declaration does not include a description.

```text
loadApiKey: (...args: Parameters<typeof sdk.loadApiKey>) => import("effect/Effect").Effect<string, import("../internal/operation.js").AiSdkError, never>
```

## `loadOptionalSetting`

The public declaration does not include a description.

```text
loadOptionalSetting: (...args: Parameters<typeof sdk.loadOptionalSetting>) => import("effect/Effect").Effect<string | undefined, import("../internal/operation.js").AiSdkError, never>
```

## `loadSetting`

The public declaration does not include a description.

```text
loadSetting: (...args: Parameters<typeof sdk.loadSetting>) => import("effect/Effect").Effect<string, import("../internal/operation.js").AiSdkError, never>
```

## `mapReasoningToProviderBudget`

The public declaration does not include a description.

```text
mapReasoningToProviderBudget: (...args: Parameters<typeof sdk.mapReasoningToProviderBudget>) => import("effect/Effect").Effect<number, import("../internal/operation.js").AiSdkError, never>
```

## `mapReasoningToProviderEffort`

Apply the native effort mapping and record SDK warnings when a model needs a fallback
effort level.

```text
mapReasoningToProviderEffort: <A extends string, B extends string = never>(options: Parameters<typeof sdk.mapReasoningToProviderEffort<A, B>>[0]) => A | B | undefined
```

## `MaybePromiseLike`

A value that can be provided either synchronously or as a promise-like.

```text
type MaybePromiseLike<T> = T | PromiseLike<T>;
```

## `mediaTypeToExtension`

The public declaration does not include a description.

```text
mediaTypeToExtension: (...args: Parameters<typeof sdk.mediaTypeToExtension>) => import("effect/Effect").Effect<string, import("../internal/operation.js").AiSdkError, never>
```

## `ModelMessage`

A message that can be used in the `messages` field of a prompt.
It can be a user message, an assistant message, or a tool message.

```text
type ModelMessage = SystemModelMessage | UserModelMessage | AssistantModelMessage | ToolModelMessage;
```

## `MultipartStreamPart`

A part of a streaming multipart/form-data request body.

Parts are emitted in array order, which providers may depend on
(e.g. xAI requires expiry fields to precede the file part).

```text
export type MultipartStreamPart = {
  type: 'field';
  name: string;
  value: string;
} | {
  type: 'file';
  name: string;
  filename?: string;
  mediaType?: string;
  content: ReadableStream<Uint8Array> | Uint8Array;
};
```

## `normalizeBatchRequestCounts`

The public declaration does not include a description.

```text
normalizeBatchRequestCounts: (...args: Parameters<typeof sdk.normalizeBatchRequestCounts>) => import("effect/Effect").Effect<{
    readonly total: number;
    readonly pending: number;
    readonly completed: number;
    readonly failed: number;
} | undefined, import("../internal/operation.js").AiSdkError, never>
```

## `normalizeHeaders`

The public declaration does not include a description.

```text
normalizeHeaders: (...args: Parameters<typeof sdk.normalizeHeaders>) => import("effect/Effect").Effect<Record<string, string>, import("../internal/operation.js").AiSdkError, never>
```

## `parseJSON`

Parse JSON text and fail the effect if the SDK rejects it.
Parse JSON text and validate or transform it with the supplied schema.

```text
export declare function parseJSON(options: ParseOptions): Effect.Effect<JSONValue, AiSdkError>;
```

```text
export declare function parseJSON<A, R = never>(options: TypedParseOptions<A, R>): Effect.Effect<A, AiSdkError, Exclude<R, Scope>>;
```

## `parseJsonEventStream`

Decode JSON events against an Effect schema and keep the schema environment for the
stream lifetime.

```text
parseJsonEventStream: <A, R = never>(options: {
    readonly stream: ReadableStream<Uint8Array>;
    readonly schema: Schema.ConstraintDecoder<A, R>;
}) => Stream.Stream<EventResult<A>, AiSdkError, Exclude<R, import("effect/Scope").Scope>>
```

## `parseProviderOptions`

Validate one provider's named option set and represent a missing entry as `None`.

```text
parseProviderOptions: <A, R = never>(options: Omit<Parameters<typeof sdk.parseProviderOptions<A>>[0], "schema"> & {
    schema: FlexibleSchema<A, R>;
}) => Effect.Effect<Option.Option<A & {}>, AiSdkError, Exclude<R, Scope>>
```

## `ParseResult`

Preserve raw input when available and expose the final value or redacted parse failure.

```text
export type ParseResult<A> = {
    readonly success: true;
    readonly value: A;
    readonly rawValue: unknown;
} | {
    readonly success: false;
    readonly error: AiSdkError;
    readonly rawValue?: unknown;
};
```

## `postFormDataToApi`

Post a native FormData body through the SDK with Effect response handlers.

```text
postFormDataToApi: <A, E = AiSdkError, R = never>(options: HttpRequest<Parameters<typeof sdk.postFormDataToApi<A>>[0], A, E, R>) => Effect.Effect<{
    value: A;
    rawValue?: unknown;
    responseHeaders?: Record<string, string>;
}, AiSdkError, import("effect/Scope").Scope | R>
```

## `postJsonToApi`

Post JSON with the SDK request options and use the adapted response handlers.

```text
postJsonToApi: <A, E = AiSdkError, R = never>(options: HttpRequest<Parameters<typeof sdk.postJsonToApi<A>>[0], A, E, R>) => Effect.Effect<{
    value: A;
    rawValue?: unknown;
    responseHeaders?: Record<string, string>;
}, AiSdkError, import("effect/Scope").Scope | R>
```

## `postMultipartStreamToApi`

Post native multipart streams with the SDK and scope their response handling to the
request.

```text
postMultipartStreamToApi: <A, E = AiSdkError, R = never>(options: HttpRequest<Parameters<typeof sdk.postMultipartStreamToApi<A>>[0], A, E, R>) => Effect.Effect<{
    value: A;
    rawValue?: unknown;
    responseHeaders?: Record<string, string>;
}, AiSdkError, import("effect/Scope").Scope | R>
```

## `postToApi`

Send a POST request with the native body settings and a scoped response handler bridge.

```text
postToApi: <A, E = AiSdkError, R = never>(options: HttpRequest<Parameters<typeof sdk.postToApi<A>>[0], A, E, R>) => Effect.Effect<{
    value: A;
    rawValue?: unknown;
    responseHeaders?: Record<string, string>;
}, AiSdkError, import("effect/Scope").Scope | R>
```

## `ProviderDefinedTool`

Use provider-defined schemas with execution available to the application where
configured.

```text
export type ProviderDefinedTool<I = unknown, A = unknown, R = never> = ProviderToolHandle<I, A, R> & {
    readonly isProviderExecuted: false;
};
```

## `ProviderDefinedToolFactory`

Infer adapted input and output options for a factory with a provider-defined descriptor.

```text
export type ProviderDefinedToolFactory<I, Args extends object, C extends sdk.Context = {}> = {
    <A, R = never, Provided = unknown>(options: Provided & (unknown extends Provided ? ProviderDefinedOptions<I, A, Args, C, R> : never)): Effect.Effect<AdaptedDescriptor<ProviderDefinedArgs<I, A, Args, C>, sdk.ProviderDefinedTool<I, A, C> & NativeProviderTool, [
        ProviderDefinedOptions<I, A, Args, C, R>
    ]>, AiSdkError>;
} & AdaptedFactory<sdk.ProviderDefinedToolFactory<I, Args, C>>;
```

## `ProviderDefinedToolFactoryWithOutputSchema`

Produce application-side provider descriptors that retain the factory output schema.

```text
export type ProviderDefinedToolFactoryWithOutputSchema<I, A, Args extends object, C extends sdk.Context = {}> = Effect.Success<ReturnType<typeof createProviderDefinedToolFactoryWithOutputSchema<I, A, Args, C>>>;
```

## `ProviderExecutedTool`

Use a provider tool descriptor whose execution takes place on the provider.

```text
export type ProviderExecutedTool<I = unknown, A = unknown, R = never> = ProviderToolHandle<I, A, R> & {
    readonly isProviderExecuted: true;
};
```

## `ProviderExecutedToolFactory`

Produce provider-executed descriptors with native provider argument shapes.

```text
export type ProviderExecutedToolFactory<I, A, Args extends object, C extends sdk.Context = {}> = Effect.Success<ReturnType<typeof createProviderExecutedToolFactory<I, A, Args, C>>>;
```

## `ProviderOptions`

Additional provider-specific options.

They are passed through to the provider from the AI SDK and enable
provider-specific functionality that can be fully encapsulated in the provider.

```text
type ProviderOptions = SharedV4ProviderOptions;
```

## `ProviderOptionsResolution`

How options found under several `providerOptions` namespaces are combined.

- `first`: namespaces are aliases. The first namespace that is present wins
  as a whole and later namespaces are ignored (no merging).
- `merge`: every present namespace is parsed and the results are merged in
  order, so later namespaces override earlier ones key by key.

```text
type ProviderOptionsResolution = 'first' | 'merge';
```

## `ProviderReference`

A mapping of provider names to provider-specific file identifiers.

Provider references allow files to be identified across different
providers without re-uploading, by storing each provider's own
identifier for the same logical file.

```text
type ProviderReference = SharedV4ProviderReference;
```

## `ProviderStreamError`

The public declaration does not include a description.

```text
type ProviderStreamError = {
  readonly message: string;
  readonly type?: string;
  readonly code?: string | number;
  readonly statusCode?: number;
  readonly isRetryable?: boolean;
  readonly data: unknown;
};
```

## `readResponseWithSizeLimit`

Read the response within a byte budget. The scope owns the body reader and releases it
on interruption.

```text
readResponseWithSizeLimit: (input: ReadResponseOptions) => Effect.Effect<Uint8Array<ArrayBufferLike>, AiSdkError, never>
```

## `readWebSocketMessageText`

Decode a native websocket message with the SDK and report decoding failures in the
Effect.

```text
readWebSocketMessageText: (data: unknown) => Effect.Effect<string, AiSdkError, never>
```

## `ReasoningFilePart`

Reasoning file content part of a prompt. It contains a file generated as part of reasoning.

```text
interface ReasoningFilePart {
  type: 'reasoning-file';
  /**
   * Reasoning file data.
   *
   * Reasoning files originate from a model's reasoning output and are always
   * raw bytes or a fetchable URL. Unlike `FilePart.data`, the `reference` and
   * `text` shapes are not supported here: provider references describe files
   * uploaded by the user (not produced as model output), and reasoning text is
   * carried by `ReasoningPart` rather than as a file.
   *
   * Either a tagged shape or a bare shorthand:
   *
   * - `{ type: 'data', data }` or bare `DataContent`: raw bytes
   *   (base64 string, Uint8Array, ArrayBuffer, Buffer)
   * - `{ type: 'url', url }` or bare `URL`: a URL that points to the file
   */
  data: FileDataData | FileDataUrl | DataContent | URL;
  /**
   * IANA media type of the file.
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

## `ReasoningPart`

Reasoning content part of a prompt. It contains a reasoning.

```text
interface ReasoningPart {
  type: 'reasoning';
  /**
   * The reasoning text.
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

## `redactTelemetryValue`

Apply SDK redaction before a value enters telemetry. Its original type remains available
to the caller.

```text
redactTelemetryValue: <A>(value: A) => Effect.Effect<A | undefined, AiSdkError, never>
```

## `removeUndefinedEntries`

Omit undefined members before passing an options record to the SDK.

```text
removeUndefinedEntries: <A>(record: Record<string, A | undefined>) => Record<string, A>
```

## `Resolvable`

Supply an immediate value or a deferred callback. `resolve` executes the Effect or
native promise at use.

```text
export type Resolvable<A, E = never, R = never> = ResolvedValue<A, E, R> | (() => ResolvedValue<A, E, R>);
```

## `resolve`

Evaluate the resolver lazily and preserve its typed Effect errors. Map native throws and
rejected promises to `AiSdkError`.

```text
resolve: <A, E = never, R = never>(input: Resolvable<A, E, R>) => Effect.Effect<A, AiSdkError | E, R>
```

## `resolveFullMediaType`

The public declaration does not include a description.

```text
resolveFullMediaType: (...args: Parameters<typeof sdk.resolveFullMediaType>) => import("effect/Effect").Effect<string, import("../internal/operation.js").AiSdkError, never>
```

## `resolveProviderOptions`

Decode the chosen provider options against the supplied Effect schema within a scoped
validator bridge.

```text
resolveProviderOptions: <A, R = never>(options: Omit<Parameters<typeof sdk.resolveProviderOptions<A>>[0], "schema"> & {
    readonly schema: Schema.ConstraintDecoder<A, R>;
}) => Effect.Effect<{
    options: A | undefined;
    namespaces: string[];
}, AiSdkError, Exclude<R, import("effect/Scope").Scope>>
```

## `resolveProviderReference`

The public declaration does not include a description.

```text
resolveProviderReference: (...args: Parameters<typeof sdk.resolveProviderReference>) => import("effect/Effect").Effect<string, import("../internal/operation.js").AiSdkError, never>
```

## `resolveWith`

Resolve the input before applying a transformation that can also return a Promise or
Effect.

```text
resolveWith: <A, B, E = never, R = never, F = never, S = never>(input: Resolvable<A, E, R>, transform: (value: A) => ResolvedValue<B, F, S>) => Effect.Effect<B, AiSdkError | E | F, R | S>
```

## `ResponseHandler`

Read an SDK response through the Effect error channel with the native transport result
shape.

```text
export type ResponseHandler<A, E = AiSdkError, R = never> = (input: HandlerInput) => Effect.Effect<HandlerResult<A>, E, R>;
```

## `RetryDelayProvider`

Return an SDK retry delay in milliseconds using the failure and the computed backoff
delay.

```text
export type RetryDelayProvider = (options: {
    error: unknown;
    exponentialBackoffDelay: number;
}) => number;
```

## `RetryErrorFactory`

Build the terminal SDK retry error from its reason and ordered failure history.

```text
export type RetryErrorFactory = (options: {
    message: string;
    reason: sdk.RetryErrorReason;
    errors: unknown[];
}) => unknown;
```

## `RetryErrorReason`

The public declaration does not include a description.

```text
export type RetryErrorReason = 'maxRetriesExceeded' | 'errorNotRetryable';
```

## `RetryFunction`

Represent a reusable native retry policy adapted to run Effect operations.

```text
export type RetryFunction<E = never, R = never> = ReturnType<typeof retryWithExponentialBackoff<E, R>>;
```

## `retryWithExponentialBackoff`

Rerun the Effect according to the native backoff policy and bind retry decisions to the
owning operation scope.

```text
retryWithExponentialBackoff: <E = never, R = never>(options: RetryOptions<E, R>) => <A, F, S>(operation: Effect.Effect<A, F, S>) => Effect.Effect<A, AiSdkError, R | S>
```

## `safeParseJSON`

Parse JSON text and report parse rejection in the result value.
Parse and validate JSON while keeping parse or validation rejection in the result value.

```text
export declare function safeParseJSON(options: ParseOptions): Effect.Effect<ParseResult<JSONValue>, AiSdkError>;
```

```text
export declare function safeParseJSON<A, R = never>(options: TypedParseOptions<A, R>): Effect.Effect<ParseResult<A>, AiSdkError, Exclude<R, Scope>>;
```

## `safeValidateTypes`

Validate unknown data and represent schema rejection as a result value.

```text
safeValidateTypes: <A, R = never>(options: ValidationOptions<A, R>) => Effect.Effect<ParseResult<A>, AiSdkError, Exclude<R, Scope>>
```

## `Schema`

A schema whose conversion and validation run through Effect.

```text
export interface Schema<A, R = never> {
    /** Render the provider-facing JSON Schema document under an owned operation scope. */
    readonly jsonSchema: Effect.Effect<JSONSchema7, AiSdkError, R>;
    /** Validate an unknown input and carry the SDK's validation result separately from runtime failures. */
    readonly validate: (value: unknown) => Effect.Effect<ValidationResult<A>, AiSdkError, R>;
}
```

## `secureJsonParse`

Run the SDK's protected JSON parser and map parser errors to `AiSdkError`.

```text
secureJsonParse: (text: string) => Effect.Effect<unknown, AiSdkError>
```

## `SerializationError`

Construct an SDK model option serialization failure and preserve its native details in
`AiSdkError`.
Use the shared `AiSdkError` type for model serialization failures.

```text
SerializationError: {
    make: (args_0?: {
        message?: string;
        cause?: unknown;
    } | undefined) => Effect.Effect<AiSdkError, AiSdkError, never>;
    isInstance: (value: unknown) => value is AiSdkError;
}
```

```text
export type SerializationError = AiSdkError;
```

## `serializeModelOptions`

Serialize the SDK model ID and configuration lazily with the native serialization rules.

```text
serializeModelOptions: <C extends SerializableConfiguration>(options: {
    readonly modelId: string;
    readonly config: C;
}) => Effect.Effect<{
    modelId: string;
    config: import("@ai-sdk/provider").JSONObject;
}, AiSdkError, never>
```

## `ShouldRetryFunction`

Return an Effect decision for a failed attempt before scheduling another retry.

```text
export type ShouldRetryFunction<E = never, R = never> = RetryOptions<E, R>['shouldRetry'];
```

## `StandardJSONSchemaV1`

The Standard JSON Schema interface.

```text
interface StandardJSONSchemaV1<Input = unknown, Output = Input> {
    /** The Standard JSON Schema properties. */
    readonly "~standard": StandardJSONSchemaV1.Props<Input, Output>;
}
```

```text
declare namespace StandardJSONSchemaV1 {
    /** The Standard JSON Schema properties interface. */
    interface Props<Input = unknown, Output = Input> extends StandardTypedV1.Props<Input, Output> {
        /** Methods for generating the input/output JSON Schema. */
        readonly jsonSchema: StandardJSONSchemaV1.Converter;
    }
    /** The Standard JSON Schema converter interface. */
    interface Converter {
        /** Converts the input type to JSON Schema. May throw if conversion is not supported. */
        readonly input: (options: StandardJSONSchemaV1.Options) => Record<string, unknown>;
        /** Converts the output type to JSON Schema. May throw if conversion is not supported. */
        readonly output: (options: StandardJSONSchemaV1.Options) => Record<string, unknown>;
    }
    /**
     * The target version of the generated JSON Schema.
     *
     * It is *strongly recommended* that implementers support `"draft-2020-12"` and `"draft-07"`, as they are both in wide use. All other targets can be implemented on a best-effort basis. Libraries should throw if they don't support a specified target.
     *
     * The `"openapi-3.0"` target is intended as a standardized specifier for OpenAPI 3.0 which is a superset of JSON Schema `"draft-04"`.
     */
    type Target = "draft-2020-12" | "draft-07" | "openapi-3.0" | ({} & string);
    /** The options for the input/output methods. */
    interface Options {
        /** Specifies the target version of the generated JSON Schema. Support for all versions is on a best-effort basis. If a given version is not supported, the library should throw. */
        readonly target: Target;
        /** Explicit support for additional vendor-specific parameters, if needed. */
        readonly libraryOptions?: Record<string, unknown> | undefined;
    }
    /** The Standard types interface. */
    interface Types<Input = unknown, Output = Input> extends StandardTypedV1.Types<Input, Output> {
    }
    /** Infers the input type of a Standard. */
    type InferInput<Schema extends StandardTypedV1> = StandardTypedV1.InferInput<Schema>;
    /** Infers the output type of a Standard. */
    type InferOutput<Schema extends StandardTypedV1> = StandardTypedV1.InferOutput<Schema>;
}
```

## `StandardSchemaV1`

The Standard Schema interface.

```text
interface StandardSchemaV1<Input = unknown, Output = Input> {
    /** The Standard Schema properties. */
    readonly "~standard": StandardSchemaV1.Props<Input, Output>;
}
```

```text
declare namespace StandardSchemaV1 {
    /** The Standard Schema properties interface. */
    interface Props<Input = unknown, Output = Input> extends StandardTypedV1.Props<Input, Output> {
        /** Validates unknown input values. */
        readonly validate: (value: unknown, options?: StandardSchemaV1.Options | undefined) => Result<Output> | Promise<Result<Output>>;
    }
    /** The result interface of the validate function. */
    type Result<Output> = SuccessResult<Output> | FailureResult;
    /** The result interface if validation succeeds. */
    interface SuccessResult<Output> {
        /** The typed output value. */
        readonly value: Output;
        /** A falsy value for `issues` indicates success. */
        readonly issues?: undefined;
    }
    interface Options {
        /** Explicit support for additional vendor-specific parameters, if needed. */
        readonly libraryOptions?: Record<string, unknown> | undefined;
    }
    /** The result interface if validation fails. */
    interface FailureResult {
        /** The issues of failed validation. */
        readonly issues: ReadonlyArray<Issue>;
    }
    /** The issue interface of the failure output. */
    interface Issue {
        /** The error message of the issue. */
        readonly message: string;
        /** The path of the issue, if any. */
        readonly path?: ReadonlyArray<PropertyKey | PathSegment> | undefined;
    }
    /** The path segment interface of the issue. */
    interface PathSegment {
        /** The key representing a path segment. */
        readonly key: PropertyKey;
    }
    /** The Standard types interface. */
    interface Types<Input = unknown, Output = Input> extends StandardTypedV1.Types<Input, Output> {
    }
    /** Infers the input type of a Standard. */
    type InferInput<Schema extends StandardTypedV1> = StandardTypedV1.InferInput<Schema>;
    /** Infers the output type of a Standard. */
    type InferOutput<Schema extends StandardTypedV1> = StandardTypedV1.InferOutput<Schema>;
}
```

## `StandardTypedV1`

The Standard Typed interface. This is a base type extended by other specs.

```text
interface StandardTypedV1<Input = unknown, Output = Input> {
    /** The Standard properties. */
    readonly "~standard": StandardTypedV1.Props<Input, Output>;
}
```

```text
declare namespace StandardTypedV1 {
    /** The Standard Typed properties interface. */
    interface Props<Input = unknown, Output = Input> {
        /** The version number of the standard. */
        readonly version: 1;
        /** The vendor name of the schema library. */
        readonly vendor: string;
        /** Inferred types associated with the schema. */
        readonly types?: Types<Input, Output> | undefined;
    }
    /** The Standard Typed types interface. */
    interface Types<Input = unknown, Output = Input> {
        /** The input type of the schema. */
        readonly input: Input;
        /** The output type of the schema. */
        readonly output: Output;
    }
    /** Infers the input type of a Standard Typed. */
    type InferInput<Schema extends StandardTypedV1> = NonNullable<Schema["~standard"]["types"]>["input"];
    /** Infers the output type of a Standard Typed. */
    type InferOutput<Schema extends StandardTypedV1> = NonNullable<Schema["~standard"]["types"]>["output"];
}
```

## `StreamingToolCallDelta`

Minimal interface for a streaming tool call delta from an OpenAI-compatible API.

```text
interface StreamingToolCallDelta {
  index?: number | null;
  id?: string | null;
  type?: string | null;
  function?: {
    name?: string | null;
    arguments?: string | null;
  } | null;
}
```

## `StreamingToolCallTracker`

Track native incremental tool calls and expose processing and flushing through Effect.

```text
export declare class StreamingToolCallTracker<D extends sdk.StreamingToolCallDelta = sdk.StreamingToolCallDelta> {
    private readonly native;
    /**
     * Allocate a tracker that emits accumulated tool-call parts through the supplied
     * controller.
     */
    static make<D extends sdk.StreamingToolCallDelta = sdk.StreamingToolCallDelta>(controller: TrackerController, options?: StreamingToolCallTrackerOptions<D>): Effect.Effect<StreamingToolCallTracker<D>, AiSdkError, never>;
    /** Keep the one native tracker that owns the buffered deltas. */
    private constructor();
    /** Advance the native tracker with one tool-call delta and emit any resulting parts. */
    processDelta(delta: D): Effect.Effect<void, AiSdkError, never>;
    /**
     * Finish the tracked calls when the source stream ends and deliver the remaining parts.
     */
    flush(): Effect.Effect<void, AiSdkError, never>;
}
```

## `StreamingToolCallTrackerOptions`

Configure native call IDs, delta validation, and metadata extraction for streaming tool
calls.

```text
export type StreamingToolCallTrackerOptions<D extends sdk.StreamingToolCallDelta = sdk.StreamingToolCallDelta> = {
    readonly generateId?: () => string;
    readonly typeValidation?: 'none' | 'if-present' | 'required';
    readonly extractMetadata?: (delta: D) => SharedV4ProviderMetadata | undefined;
    readonly buildToolCallProviderMetadata?: (metadata: SharedV4ProviderMetadata | undefined) => SharedV4ProviderMetadata | undefined;
};
```

## `stringifyWithBigIntAndCycles`

The public declaration does not include a description.

```text
stringifyWithBigIntAndCycles: (...args: Parameters<typeof sdk.stringifyWithBigIntAndCycles>) => import("effect/Effect").Effect<string, import("../internal/operation.js").AiSdkError, never>
```

## `stripFileExtension`

The public declaration does not include a description.

```text
stripFileExtension: (...args: Parameters<typeof sdk.stripFileExtension>) => import("effect/Effect").Effect<string, import("../internal/operation.js").AiSdkError, never>
```

## `SystemModelMessage`

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

## `TextPart`

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

## `tool`

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

Unify application and provider tool descriptors while retaining their distinct execution
contracts.

```text
export type Tool<I = unknown, A = unknown, C = unknown, E = never, R = never> = FunctionTool<I, A, C, E, R> | DynamicTool<I, A, C, E, R> | ProviderDefinedTool<I, A, R> | ProviderExecutedTool<I, A, R>;
```

## `ToolApprovalRequest`

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

## `ToolApprovalResponse`

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

## `ToolCall`

Typed tool call that is returned by generateText and streamText.
It contains the tool call ID, the tool name, and the tool arguments.

```text
interface ToolCall<NAME extends string, INPUT> {
  /**
   * ID of the tool call. This ID is used to match the tool call with the tool result.
   */
  toolCallId: string;
  /**
   * Name of the tool that is being called.
   */
  toolName: NAME;
  /**
   * Arguments of the tool call. This is a JSON-serializable object that matches the tool's input schema.
   */
  input: INPUT;
  /**
   * Whether the tool call will be executed by the provider.
   * If this flag is not set or is false, the tool call will be executed by the client.
   */
  providerExecuted?: boolean;
  /**
   * Whether the tool is dynamic.
   */
  dynamic?: boolean;
}
```

## `ToolCallPart`

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

## `ToolContent`

Content of a tool message. It is an array of tool result parts.

```text
type ToolContent = Array<ToolResultPart | ToolApprovalResponse>;
```

## `ToolExecuteFunction`

Implement a tool body with the same call options and environment as the public tool
descriptor.

```text
export type ToolExecuteFunction<I, A, C = unknown, E = never, R = never> = TypedExecution<I, A, C, E, R>;
```

## `ToolExecutionOptions`

Provide call context and interruption options to Effect tool execution.

```text
export type ToolExecutionOptions<C = unknown> = ExecutionOptions<C>;
```

## `ToolModelMessage`

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

## `ToolNameMapping`

Translate tool names in either direction through the SDK mapping instance.

```text
export type ToolNameMapping = Effect.Success<ReturnType<typeof createToolNameMapping>>;
```

## `ToolNeedsApprovalFunction`

Decide approval from tool input, caller context, and history through an Effect.

```text
export type ToolNeedsApprovalFunction<I, C = unknown, E = never, R = never> = (input: I, options: Pick<ExecutionOptions<C>, 'toolCallId' | 'messages' | 'context'>) => Effect.Effect<boolean, E, R>;
```

## `ToolResult`

Typed tool result that is returned by `generateText` and `streamText`.
It contains the tool call ID, the tool name, the tool arguments, and the tool result.

```text
interface ToolResult<NAME extends string, INPUT, OUTPUT> {
  /**
   * ID of the tool call. This ID is used to match the tool call with the tool result.
   */
  toolCallId: string;
  /**
   * Name of the tool that was called.
   */
  toolName: NAME;
  /**
   * Arguments of the tool call. This is a JSON-serializable object that matches the tool's input schema.
   */
  input: INPUT;
  /**
   * Result of the tool call. This is the result of the tool's execution.
   */
  output: OUTPUT;
  /**
   * Whether the tool result has been executed by the provider.
   */
  providerExecuted?: boolean;
  /**
   * Whether the tool is dynamic.
   */
  dynamic?: boolean;
}
```

## `ToolResultOutput`

Output of a tool result.

```text
type ToolResultOutput = {
  /**
   * Text tool output that should be directly sent to the API.
   */
  type: 'text';
  value: string;
  /**
   * Provider-specific options.
   */
  providerOptions?: ProviderOptions;
} | {
  type: 'json';
  value: JSONValue;
  /**
   * Provider-specific options.
   */
  providerOptions?: ProviderOptions;
} | {
  /**
   * Type when the user has denied the execution of the tool call.
   */
  type: 'execution-denied';
  /**
   * Optional reason for the execution denial.
   */
  reason?: string;
  /**
   * Provider-specific options.
   */
  providerOptions?: ProviderOptions;
} | {
  type: 'error-text';
  value: string;
  /**
   * Provider-specific options.
   */
  providerOptions?: ProviderOptions;
} | {
  type: 'error-json';
  value: JSONValue;
  /**
   * Provider-specific options.
   */
  providerOptions?: ProviderOptions;
} | {
  type: 'content';
  value: Array<{
    type: 'text';
    /**
     * Text content.
     */
    text: string;
    /**
     * Provider-specific options.
     */
    providerOptions?: ProviderOptions;
  } | {
    type: 'file';
    /**
     * File data as a tagged discriminated union:
     *
     * - `{ type: 'data', data }`: raw bytes
     *   (base64 string, Uint8Array, ArrayBuffer, Buffer)
     * - `{ type: 'url', url }`: a URL that points to the file
     * - `{ type: 'reference', reference }`: a provider reference
     *   from `uploadFile`
     * - `{ type: 'text', text }`: inline text content (e.g. an inline
     *   text document)
     */
    data: FileData;
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
     * Provider-specific options.
     */
    providerOptions?: ProviderOptions;
  } | {
    /**
     * @deprecated Use 'file' with mediaType + tagged data instead:
     * `{ type: 'file', mediaType, data: { type: 'data', data } }`.
     */
    type: 'file-data';
    /**
     * Base-64 encoded media data.
     */
    data: string;
    /**
     * IANA media type.
     * @see https://www.iana.org/assignments/media-types/media-types.xhtml
     */
    mediaType: string;
    /**
     * Optional filename of the file.
     */
    filename?: string;
    /**
     * Provider-specific options.
     */
    providerOptions?: ProviderOptions;
  } | {
    /**
     * @deprecated Use 'file' with mediaType and tagged data instead:
     * `{ type: 'file', mediaType, data: { type: 'url', url: new URL(url) } }`.
     */
    type: 'file-url';
    /**
     * URL of the file.
     */
    url: string;
    /**
     * IANA media type.
     * @see https://www.iana.org/assignments/media-types/media-types.xhtml
     */
    mediaType?: string;
    /**
     * Provider-specific options.
     */
    providerOptions?: ProviderOptions;
  } | {
    /**
     * @deprecated Use 'file' with tagged data instead:
     * `{ type: 'file', mediaType, data: { type: 'reference', reference } }`.
     */
    type: 'file-id';
    /**
     * ID of the file.
     *
     * If you use multiple providers, you need to
     * specify the provider specific ids using
     * the Record option. The key is the provider
     * name, e.g. 'openai' or 'anthropic'.
     */
    fileId: string | Record<string, string>;
    /**
     * Provider-specific options.
     */
    providerOptions?: ProviderOptions;
  } | {
    /**
     * @deprecated Use 'file' with tagged data instead:
     * `{ type: 'file', mediaType, data: { type: 'reference', reference } }`.
     */
    type: 'file-reference';
    /**
     * Provider-specific references for the file.
     * The key is the provider name, e.g. 'openai' or 'anthropic'.
     */
    providerReference: ProviderReference;
    /**
     * Provider-specific options.
     */
    providerOptions?: ProviderOptions;
  } | {
    /**
     * @deprecated Use 'file' with mediaType (e.g. 'image' or a specific
     * `image/*` subtype) and tagged data instead:
     * `{ type: 'file', mediaType: 'image', data: { type: 'data', data } }`.
     */
    type: 'image-data';
    /**
     * Base-64 encoded image data.
     */
    data: string;
    /**
     * IANA media type.
     * @see https://www.iana.org/assignments/media-types/media-types.xhtml
     */
    mediaType: string;
    /**
     * Provider-specific options.
     */
    providerOptions?: ProviderOptions;
  } | {
    /**
     * @deprecated Use 'file' with `mediaType: 'image'` (or a specific
     * `image/*` subtype) and tagged data instead:
     * `{ type: 'file', mediaType: 'image', data: { type: 'url', url: new URL(url) } }`.
     */
    type: 'image-url';
    /**
     * URL of the image.
     */
    url: string;
    /**
     * Provider-specific options.
     */
    providerOptions?: ProviderOptions;
  } | {
    /**
     * @deprecated Use 'file' with `mediaType: 'image'` (or a specific
     * `image/*` subtype) and tagged data instead:
     * `{ type: 'file', mediaType: 'image', data: { type: 'reference', reference } }`.
     */
    type: 'image-file-id';
    /**
     * Image that is referenced using a provider file id.
     *
     * If you use multiple providers, you need to
     * specify the provider specific ids using
     * the Record option. The key is the provider
     * name, e.g. 'openai' or 'anthropic'.
     */
    fileId: string | Record<string, string>;
    /**
     * Provider-specific options.
     */
    providerOptions?: ProviderOptions;
  } | {
    /**
     * @deprecated Use 'file' with `mediaType: 'image'` (or a specific
     * `image/*` subtype) and tagged data instead:
     * `{ type: 'file', mediaType: 'image', data: { type: 'reference', reference } }`.
     */
    type: 'image-file-reference';
    /**
     * Provider-specific references for the image file.
     * The key is the provider name, e.g. 'openai' or 'anthropic'.
     */
    providerReference: ProviderReference;
    /**
     * Provider-specific options.
     */
    providerOptions?: ProviderOptions;
  } | {
    /**
     * Custom content part. This can be used to implement
     * provider-specific content parts.
     */
    type: 'custom';
    /**
     * Provider-specific options.
     */
    providerOptions?: ProviderOptions;
  }>;
};
```

## `ToolResultPart`

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

## `ToolSet`

Map names to public function tool definitions and registered provider handles.

```text
export type EffectTools = Readonly<Record<string, (FunctionToolDefinition | ProviderToolHandle<unknown, unknown, unknown>) & {
    readonly providerOptions?: ProviderOptions | undefined;
}>>;
```

## `toWebSocketUrl`

The public declaration does not include a description.

```text
toWebSocketUrl: (...args: Parameters<typeof sdk.toWebSocketUrl>) => import("effect/Effect").Effect<URL, import("../internal/operation.js").AiSdkError, never>
```

## `UserContent`

Content of a user message. It can be a string or an array of text and image parts.

```text
type UserContent = string | Array<TextPart | ImagePart | FilePart>;
```

## `UserModelMessage`

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

## `validateBaseURL`

The public declaration does not include a description.

```text
validateBaseURL: (...args: Parameters<typeof sdk.validateBaseURL>) => import("effect/Effect").Effect<string | undefined, import("../internal/operation.js").AiSdkError, never>
```

## `validateDownloadUrl`

The public declaration does not include a description.

```text
validateDownloadUrl: (...args: Parameters<typeof sdk.validateDownloadUrl>) => import("effect/Effect").Effect<void, import("../internal/operation.js").AiSdkError, never>
```

## `ValidateFunction`

Validate unknown input in the same Effect context as JSON Schema generation.

```text
export type ValidateFunction<A, R = never> = (value: unknown) => Effect.Effect<ValidationResult<A>, unknown, R>;
```

## `validateTypes`

Validate unknown data and fail the effect when the SDK rejects it.

```text
validateTypes: <A, R = never>(options: ValidationOptions<A, R>) => Effect.Effect<A, AiSdkError, Exclude<R, Scope>>
```

## `ValidationResult`

Preserve the SDK distinction between successful validation and a validation rejection.

```text
export type ValidationResult<A> = sdk.ValidationResult<A>;
```

## `VERSION`

Expose the installed native provider utility package version.

```text
VERSION: string
```

## `waitForWebSocketBufferDrain`

Use the SDK backpressure wait with the native socket and propagate interruption to its
poll.

```text
waitForWebSocketBufferDrain: (socket: WebSocketLike | WebSocketHost, options?: DrainOptions) => Effect.Effect<void, AiSdkError, never>
```

## `WebSocketConnection`

Expose optional open socket access and a close Effect for a connection owned by the
calling scope.

```text
export type WebSocketConnection = Effect.Success<ReturnType<typeof connectToWebSocket>>;
```

## `WebSocketConstructor`

Inject a runtime constructor that can create the host socket and expose its listener
slots.

```text
export type WebSocketConstructor = new (url: string | URL, protocols?: string | string[], options?: SocketOptions) => WebSocketHost;
```

## `WebSocketLike`

Expose reads, sends, closure, and scoped listener registration as Effects.

```text
export interface WebSocketLike {
    /** Read the current host state when the Effect runs. */
    readonly readyState: Effect.Effect<number, AiSdkError>;
    /** Read pending bytes. An undefined value means the host does not expose buffering. */
    readonly bufferedAmount: Effect.Effect<number | undefined, AiSdkError>;
    /** Send native text or binary data when the Effect runs. */
    send(data: SocketData): Effect.Effect<void, AiSdkError>;
    /** Close the socket once. Forward the optional native close code and reason. */
    close(code?: number, reason?: string): Effect.Effect<void, AiSdkError>;
    /** Install an open listener owned by the current scope. */
    onopen: Subscribe<unknown>;
    /** Subscribe to raw message events within the current scope. */
    onmessage: Subscribe<Message>;
    /** Subscribe to native socket error events within the current scope. */
    onerror: Subscribe<unknown>;
    /** Subscribe to native close events within the current scope. */
    onclose: Subscribe<unknown>;
}
```

## `withoutTrailingSlash`

The public declaration does not include a description.

```text
withoutTrailingSlash: (...args: Parameters<typeof sdk.withoutTrailingSlash>) => import("effect/Effect").Effect<string | undefined, import("../internal/operation.js").AiSdkError, never>
```

## `withTelemetryRedaction`

Apply a caller-supplied redaction rule through the SDK telemetry mechanism.

```text
withTelemetryRedaction: <A extends Record<string, unknown>>(value: A, redact: (value: A) => A) => Effect.Effect<A, AiSdkError, never>
```

## `withUserAgentSuffix`

The public declaration does not include a description.

```text
withUserAgentSuffix: (...args: Parameters<typeof sdk.withUserAgentSuffix>) => import("effect/Effect").Effect<Record<string, string>, import("../internal/operation.js").AiSdkError, never>
```

## `WORKFLOW_DESERIALIZE`

Use the SDK well-known symbol for model restoration hooks and preserve symbol identity.

```text
WORKFLOW_DESERIALIZE: typeof sdk.WORKFLOW_DESERIALIZE
```

## `WORKFLOW_SERIALIZE`

Use the SDK well-known symbol for model serialization hooks and preserve symbol
identity.

```text
WORKFLOW_SERIALIZE: typeof sdk.WORKFLOW_SERIALIZE
```

## `zodSchema`

Wrap a Zod definition with its native conversion options and defer the SDK callback.

```text
zodSchema: <A>(schema: Parameters<typeof sdk.zodSchema<A>>[0], options?: Parameters<typeof sdk.zodSchema<A>>[1]) => Effect.Effect<Schema<A>>
```
