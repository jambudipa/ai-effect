---
title: cartesia provider API
doc-type: reference
sources: [src/providers/cartesia.ts, package.json]
---

# cartesia provider API

> **TL;DR:** This entry exposes 15 public exports through `@jambudipa/ai-effect/cartesia`.
> The contracts below come from the installed package declarations and JSDoc.

## Import

`@jambudipa/ai-effect/cartesia` selects the package export for this provider. See the [provider source](../../../../../src/providers/cartesia.ts).

## `cartesia`

Adapt the preconfigured provider from the Cartesia SDK. Use the factory to supply
explicit settings.

```text
cartesia(modelId: CartesiaSpeechModelId, settings?: {} | undefined): Effect<{ speech: { doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }; }, AiSdkError, never>
```

### Public properties

#### `cartesia.embeddingModel`

```text
(modelId: string) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `cartesia.experimental_realtime`

```text
((modelId: string) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; capabilities: { conversation: "continuous" | "turn-based"; transports: readonly ("websocket" | "webrtc")[]; connections?: readonly ("provider" | "webrtc" | "client-secret-websocket" | "server-websocket")[] | undefined; startup?: "session-start" | "session-update" | undefined; finalization?: "session-close" | "transport-close" | undefined; } | undefined; createTransport: (<E, R>(options: RealtimeTransportOptions<E, R>) => Effect<{ connect: (options: Omit<{ api: string; sessionConfig?: RealtimeModelV4SessionConfig | undefined; stream?: MediaStream | undefined; capture?: boolean | undefined; abortSignal: AbortSignal; }, "abortSignal"> & { readonly abortSignal?: AbortSignal | undefined; }) => Effect<void, AiSdkError, never>; sendEvent: (event: RealtimeModelV4ClientEvent, shouldSend?: (() => boolean) | undefined) => Effect<void, AiSdkError, never>; startCapture: (stream?: MediaStream | undefined) => Effect<void, AiSdkError, never>; stopCapture: () => Effect<void, AiSdkError, never>; stopPlayback: () => Effect<void, AiSdkError, never>; resumePlayback: () => Effect<void, AiSdkError, never>; finish: () => Effect<void, AiSdkError, never>; close: () => Effect<void, AiSdkError, never>; dispose: () => Effect<void, AiSdkError, never>; }, AiSdkError, Scope | R>) | undefined; getWebRTCConfig: (() => Effect<{ dataChannelLabel: string; }, AiSdkError, never>) | undefined; doCreateWebRTCSession: ((options: { sdp: string; sessionConfig?: RealtimeModelV4SessionConfig | undefined; abortSignal?: AbortSignal | undefined; }) => Effect<{ sessionId: string; sdp: string; }, AiSdkError, never>) | undefined; doCreateClientSecret: ((options: RealtimeModelV4ClientSecretOptions) => Effect<RealtimeModelV4ClientSecretResult, AiSdkError, never>) | undefined; getWebSocketConfig: ((options: { token: string; url: string; }) => Effect<{ url: string; protocols?: string[] | undefined; }, AiSdkError, never>) | undefined; parseServerEvent: (raw: unknown) => Effect<RealtimeModelV4ServerEvent | RealtimeModelV4ServerEvent[], AiSdkError, never>; createServerEventParser: (() => Effect<(raw: unknown) => Effect<RealtimeModelV4ServerEvent | RealtimeModelV4ServerEvent[], AiSdkError, never>, AiSdkError, never>) | undefined; serializeClientEvent: (event: RealtimeModelV4ClientEvent, options?: { intent?: RealtimeModelV4SessionIntent | undefined; } | undefined) => Effect<unknown, AiSdkError, never>; buildSessionConfig: (config: RealtimeModelV4SessionConfig, options?: { intent?: RealtimeModelV4SessionIntent | undefined; } | undefined) => Effect<unknown, AiSdkError, never>; getServerWebSocketConfig: ((options?: { intent?: RealtimeModelV4SessionIntent | undefined; } | undefined) => Effect<RealtimeModelV4ServerConnection, AiSdkError, never>) | undefined; getHealthCheckResponse: ((raw: unknown) => Effect<unknown, AiSdkError, never>) | undefined; }, AiSdkError, never>) & { getToken: (options: RealtimeFactoryV4GetTokenOptions) => Effect<RealtimeFactoryV4GetTokenResult, AiSdkError, never>; }
```

#### `cartesia.files`

```text
(() => Effect<{ specificationVersion: "v4"; provider: string; uploadFile: (options: FilesV4UploadFileCallOptions) => Effect<FilesV4UploadFileResult, AiSdkError, never>; getFileMetadata: ((options: FilesV4GetFileMetadataCallOptions) => Effect<FilesV4GetFileMetadataResult, AiSdkError, never>) | undefined; downloadFile: ((options: FilesV4DownloadFileCallOptions) => Effect<{ content: Stream<Uint8Array<ArrayBufferLike>, AiSdkError, never>; mediaType?: string | undefined; providerMetadata?: SharedV4ProviderMetadata | undefined; warnings: SharedV4Warning[]; }, AiSdkError, Scope>) | undefined; deleteFile: ((options: FilesV4DeleteFileCallOptions) => Effect<FilesV4DeleteFileResult, AiSdkError, never>) | undefined; }, AiSdkError, never>) | undefined
```

#### `cartesia.imageModel`

```text
(modelId: string) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `cartesia.languageModel`

```text
(modelId: string) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

#### `cartesia.rerankingModel`

```text
((modelId: string) => Effect<{ doRerank: (options: RerankingModelV4CallOptions) => Effect<RerankingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined
```

#### `cartesia.skills`

```text
(() => Effect<{ specificationVersion: "v4"; provider: string; uploadSkill: (options: SkillsV4UploadSkillCallOptions) => Effect<SkillsV4UploadSkillResult, AiSdkError, never>; }, AiSdkError, never>) | undefined
```

#### `cartesia.specificationVersion`

```text
"v4"
```

#### `cartesia.speech`

```text
(modelId: CartesiaSpeechModelId) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `cartesia.speechModel`

```text
((modelId: string) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined
```

#### `cartesia.textEmbeddingModel`

```text
(modelId: string) => Effect<never, AiSdkError, never>
```

#### `cartesia.transcription`

```text
(modelId: CartesiaTranscriptionModelId) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `cartesia.transcriptionModel`

```text
((modelId: string) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined
```


## `CartesiaProvider`

Provider returned by the adapter, with Effect-based model selection for Cartesia.

```text
export type CartesiaProvider = ReturnType<typeof wrapProvider>;
```

## `CartesiaProviderSettings`

Keep the native Cartesia options and allow `apiKey` to resolve through Effect when the
SDK requests the value.

```text
export type CartesiaProviderSettings<E = never, R = never> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
```

## `CartesiaRealtimeModel`

Construct the SDK Cartesia realtime model lazily with its native options.
Effect model returned by `CartesiaRealtimeModel`. Use its realtime connection operations
in an Effect program.

```text
CartesiaRealtimeModel(modelId: CartesiaRealtimeModelId, config: ProviderHostConfiguration<CartesiaRealtimeModelConfig>): Effect<{ specificationVersion: "v4"; provider: string; modelId: string; capabilities: { conversation: "continuous" | "turn-based"; transports: readonly ("websocket" | "webrtc")[]; connections?: readonly ("provider" | "webrtc" | "client-secret-websocket" | "server-websocket")[] | undefined; startup?: "session-start" | "session-update" | undefined; finalization?: "session-close" | "transport-close" | undefined; } | undefined; createTransport: (<E, R>(options: RealtimeTransportOptions<E, R>) => Effect<{ connect: (options: Omit<{ api: string; sessionConfig?: RealtimeModelV4SessionConfig | undefined; stream?: MediaStream | undefined; capture?: boolean | undefined; abortSignal: AbortSignal; }, "abortSignal"> & { readonly abortSignal?: AbortSignal | undefined; }) => Effect<void, AiSdkError, never>; sendEvent: (event: RealtimeModelV4ClientEvent, shouldSend?: (() => boolean) | undefined) => Effect<void, AiSdkError, never>; startCapture: (stream?: MediaStream | undefined) => Effect<void, AiSdkError, never>; stopCapture: () => Effect<void, AiSdkError, never>; stopPlayback: () => Effect<void, AiSdkError, never>; resumePlayback: () => Effect<void, AiSdkError, never>; finish: () => Effect<void, AiSdkError, never>; close: () => Effect<void, AiSdkError, never>; dispose: () => Effect<void, AiSdkError, never>; }, AiSdkError, Scope | R>) | undefined; getWebRTCConfig: (() => Effect<{ dataChannelLabel: string; }, AiSdkError, never>) | undefined; doCreateWebRTCSession: ((options: { sdp: string; sessionConfig?: RealtimeModelV4SessionConfig | undefined; abortSignal?: AbortSignal | undefined; }) => Effect<{ sessionId: string; sdp: string; }, AiSdkError, never>) | undefined; doCreateClientSecret: ((options: RealtimeModelV4ClientSecretOptions) => Effect<RealtimeModelV4ClientSecretResult, AiSdkError, never>) | undefined; getWebSocketConfig: ((options: { token: string; url: string; }) => Effect<{ url: string; protocols?: string[] | undefined; }, AiSdkError, never>) | undefined; parseServerEvent: (raw: unknown) => Effect<RealtimeModelV4ServerEvent | RealtimeModelV4ServerEvent[], AiSdkError, never>; createServerEventParser: (() => Effect<(raw: unknown) => Effect<RealtimeModelV4ServerEvent | RealtimeModelV4ServerEvent[], AiSdkError, never>, AiSdkError, never>) | undefined; serializeClientEvent: (event: RealtimeModelV4ClientEvent, options?: { intent?: RealtimeModelV4SessionIntent | undefined; } | undefined) => Effect<unknown, AiSdkError, never>; buildSessionConfig: (config: RealtimeModelV4SessionConfig, options?: { intent?: RealtimeModelV4SessionIntent | undefined; } | undefined) => Effect<unknown, AiSdkError, never>; getServerWebSocketConfig: ((options?: { intent?: RealtimeModelV4SessionIntent | undefined; } | undefined) => Effect<RealtimeModelV4ServerConnection, AiSdkError, never>) | undefined; getHealthCheckResponse: ((raw: unknown) => Effect<unknown, AiSdkError, never>) | undefined; }, AiSdkError, never>
```

## `CartesiaRealtimeModelId`

The source declaration does not provide a JSDoc description.

```text
type CartesiaRealtimeModelId = CartesiaModelIds['realtime'] | (string & {});
```

## `CartesiaRealtimeModelOptions`

The source declaration does not provide a JSDoc description.

```text
type CartesiaRealtimeModelOptions = Record<string, never>;
```

## `CartesiaSpeechModel`

Construct the SDK Cartesia speech model lazily with its native options. It exposes the
workflow serialization hooks.
Effect model returned by `CartesiaSpeechModel`. Use its speech synthesis operations in
an Effect program.

```text
CartesiaSpeechModel(modelId: CartesiaSpeechModelId, config: ProviderHostConfiguration<CartesiaSpeechModelConfig>): Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

### Public properties

#### `CartesiaSpeechModel[WORKFLOW_DESERIALIZE]`

```text
(input: { modelId: CartesiaSpeechModelId; config: CartesiaSpeechModelConfig; }) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `CartesiaSpeechModel[WORKFLOW_SERIALIZE]`

```text
(model: { doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }) => Effect<{ modelId: string; config: JSONObject; }, AiSdkError, never>
```


## `CartesiaSpeechModelId`

The source declaration does not provide a JSDoc description.

```text
type CartesiaSpeechModelId = CartesiaModelIds['speech'] | (string & {});
```

## `CartesiaSpeechModelOptions`

The source declaration does not provide a JSDoc description.

```text
type CartesiaSpeechModelOptions = InferSchema<typeof cartesiaSpeechModelOptionsSchema>;
```

## `CartesiaSpeechVoiceId`

The source declaration does not provide a JSDoc description.

```text
type CartesiaSpeechVoiceId = string;
```

## `CartesiaTranscriptionModel`

Construct the SDK Cartesia transcription model lazily with its native options. It
exposes the workflow serialization hooks.
Effect model returned by `CartesiaTranscriptionModel`. Use its transcription operations
in an Effect program.

```text
CartesiaTranscriptionModel(modelId: CartesiaTranscriptionModelId, config: ProviderHostConfiguration<CartesiaTranscriptionModelConfig>): Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

### Public properties

#### `CartesiaTranscriptionModel[WORKFLOW_DESERIALIZE]`

```text
(input: { modelId: CartesiaTranscriptionModelId; config: CartesiaTranscriptionModelConfig; }) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `CartesiaTranscriptionModel[WORKFLOW_SERIALIZE]`

```text
(model: { doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }) => Effect<{ modelId: string; config: JSONObject; }, AiSdkError, never>
```


## `CartesiaTranscriptionModelId`

The source declaration does not provide a JSDoc description.

```text
type CartesiaTranscriptionModelId = CartesiaModelIds['transcription'] | (string & {});
```

## `CartesiaTranscriptionModelOptions`

The source declaration does not provide a JSDoc description.

```text
type CartesiaTranscriptionModelOptions = InferSchema<typeof cartesiaTranscriptionModelOptionsSchema>;
```

## `createCartesia`

Construct the Cartesia provider inside an Effect. Keep the scope open when using an Effect
resolver for `apiKey`.

```text
createCartesia(options?: StaticProviderSettings<CartesiaProviderSettings, "apiKey"> | undefined): Effect<((modelId: CartesiaSpeechModelId, settings?: {} | undefined) => Effect<{ speech: { doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }; }, AiSdkError, never>) & { transcription: (modelId: CartesiaTranscriptionModelId) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; speech: (modelId: CartesiaSpeechModelId) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; textEmbeddingModel: (modelId: string) => Effect<never, AiSdkError, never>; experimental_realtime: ((modelId: string) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; capabilities: { conversation: "continuous" | "turn-based"; transports: readonly ("websocket" | "webrtc")[]; connections?: readonly ("provider" | "webrtc" | "client-secret-websocket" | "server-websocket")[] | undefined; startup?: "session-start" | "session-update" | undefined; finalization?: "session-close" | "transport-close" | undefined; } | undefined; createTransport: (<E, R>(options: RealtimeTransportOptions<E, R>) => Effect<{ connect: (options: Omit<{ api: string; sessionConfig?: RealtimeModelV4SessionConfig | undefined; stream?: MediaStream | undefined; capture?: boolean | undefined; abortSignal: AbortSignal; }, "abortSignal"> & { readonly abortSignal?: AbortSignal | undefined; }) => Effect<void, AiSdkError, never>; sendEvent: (event: RealtimeModelV4ClientEvent, shouldSend?: (() => boolean) | undefined) => Effect<void, AiSdkError, never>; startCapture: (stream?: MediaStream | undefined) => Effect<void, AiSdkError, never>; stopCapture: () => Effect<void, AiSdkError, never>; stopPlayback: () => Effect<void, AiSdkError, never>; resumePlayback: () => Effect<void, AiSdkError, never>; finish: () => Effect<void, AiSdkError, never>; close: () => Effect<void, AiSdkError, never>; dispose: () => Effect<void, AiSdkError, never>; }, AiSdkError, Scope | R>) | undefined; getWebRTCConfig: (() => Effect<{ dataChannelLabel: string; }, AiSdkError, never>) | undefined; doCreateWebRTCSession: ((options: { sdp: string; sessionConfig?: RealtimeModelV4SessionConfig | undefined; abortSignal?: AbortSignal | undefined; }) => Effect<{ sessionId: string; sdp: string; }, AiSdkError, never>) | undefined; doCreateClientSecret: ((options: RealtimeModelV4ClientSecretOptions) => Effect<RealtimeModelV4ClientSecretResult, AiSdkError, never>) | undefined; getWebSocketConfig: ((options: { token: string; url: string; }) => Effect<{ url: string; protocols?: string[] | undefined; }, AiSdkError, never>) | undefined; parseServerEvent: (raw: unknown) => Effect<RealtimeModelV4ServerEvent | RealtimeModelV4ServerEvent[], AiSdkError, never>; createServerEventParser: (() => Effect<(raw: unknown) => Effect<RealtimeModelV4ServerEvent | RealtimeModelV4ServerEvent[], AiSdkError, never>, AiSdkError, never>) | undefined; serializeClientEvent: (event: RealtimeModelV4ClientEvent, options?: { intent?: RealtimeModelV4SessionIntent | undefined; } | undefined) => Effect<unknown, AiSdkError, never>; buildSessionConfig: (config: RealtimeModelV4SessionConfig, options?: { intent?: RealtimeModelV4SessionIntent | undefined; } | undefined) => Effect<unknown, AiSdkError, never>; getServerWebSocketConfig: ((options?: { intent?: RealtimeModelV4SessionIntent | undefined; } | undefined) => Effect<RealtimeModelV4ServerConnection, AiSdkError, never>) | undefined; getHealthCheckResponse: ((raw: unknown) => Effect<unknown, AiSdkError, never>) | undefined; }, AiSdkError, never>) & { getToken: (options: RealtimeFactoryV4GetTokenOptions) => Effect<RealtimeFactoryV4GetTokenResult, AiSdkError, never>; }; specificationVersion: "v4"; languageModel: (modelId: string) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>; embeddingModel: (modelId: string) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; imageModel: (modelId: string) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; transcriptionModel: ((modelId: string) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; speechModel: ((modelId: string) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; rerankingModel: ((modelId: string) => Effect<{ doRerank: (options: RerankingModelV4CallOptions) => Effect<RerankingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; files: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadFile: (options: FilesV4UploadFileCallOptions) => Effect<FilesV4UploadFileResult, AiSdkError, never>; getFileMetadata: ((options: FilesV4GetFileMetadataCallOptions) => Effect<FilesV4GetFileMetadataResult, AiSdkError, never>) | undefined; downloadFile: ((options: FilesV4DownloadFileCallOptions) => Effect<{ content: Stream<Uint8Array<ArrayBufferLike>, AiSdkError, never>; mediaType?: string | undefined; providerMetadata?: SharedV4ProviderMetadata | undefined; warnings: SharedV4Warning[]; }, AiSdkError, Scope>) | undefined; deleteFile: ((options: FilesV4DeleteFileCallOptions) => Effect<FilesV4DeleteFileResult, AiSdkError, never>) | undefined; }, AiSdkError, never>) | undefined; skills: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadSkill: (options: SkillsV4UploadSkillCallOptions) => Effect<SkillsV4UploadSkillResult, AiSdkError, never>; }, AiSdkError, never>) | undefined; }, AiSdkError, never>
createCartesia<E, R>(options: EffectProviderSettings<CartesiaProviderSettings, "apiKey", E, R>): Effect<((modelId: CartesiaSpeechModelId, settings?: {} | undefined) => Effect<{ speech: { doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }; }, AiSdkError, never>) & { transcription: (modelId: CartesiaTranscriptionModelId) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; speech: (modelId: CartesiaSpeechModelId) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; textEmbeddingModel: (modelId: string) => Effect<never, AiSdkError, never>; experimental_realtime: ((modelId: string) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; capabilities: { conversation: "continuous" | "turn-based"; transports: readonly ("websocket" | "webrtc")[]; connections?: readonly ("provider" | "webrtc" | "client-secret-websocket" | "server-websocket")[] | undefined; startup?: "session-start" | "session-update" | undefined; finalization?: "session-close" | "transport-close" | undefined; } | undefined; createTransport: (<E, R>(options: RealtimeTransportOptions<E, R>) => Effect<{ connect: (options: Omit<{ api: string; sessionConfig?: RealtimeModelV4SessionConfig | undefined; stream?: MediaStream | undefined; capture?: boolean | undefined; abortSignal: AbortSignal; }, "abortSignal"> & { readonly abortSignal?: AbortSignal | undefined; }) => Effect<void, AiSdkError, never>; sendEvent: (event: RealtimeModelV4ClientEvent, shouldSend?: (() => boolean) | undefined) => Effect<void, AiSdkError, never>; startCapture: (stream?: MediaStream | undefined) => Effect<void, AiSdkError, never>; stopCapture: () => Effect<void, AiSdkError, never>; stopPlayback: () => Effect<void, AiSdkError, never>; resumePlayback: () => Effect<void, AiSdkError, never>; finish: () => Effect<void, AiSdkError, never>; close: () => Effect<void, AiSdkError, never>; dispose: () => Effect<void, AiSdkError, never>; }, AiSdkError, Scope | R>) | undefined; getWebRTCConfig: (() => Effect<{ dataChannelLabel: string; }, AiSdkError, never>) | undefined; doCreateWebRTCSession: ((options: { sdp: string; sessionConfig?: RealtimeModelV4SessionConfig | undefined; abortSignal?: AbortSignal | undefined; }) => Effect<{ sessionId: string; sdp: string; }, AiSdkError, never>) | undefined; doCreateClientSecret: ((options: RealtimeModelV4ClientSecretOptions) => Effect<RealtimeModelV4ClientSecretResult, AiSdkError, never>) | undefined; getWebSocketConfig: ((options: { token: string; url: string; }) => Effect<{ url: string; protocols?: string[] | undefined; }, AiSdkError, never>) | undefined; parseServerEvent: (raw: unknown) => Effect<RealtimeModelV4ServerEvent | RealtimeModelV4ServerEvent[], AiSdkError, never>; createServerEventParser: (() => Effect<(raw: unknown) => Effect<RealtimeModelV4ServerEvent | RealtimeModelV4ServerEvent[], AiSdkError, never>, AiSdkError, never>) | undefined; serializeClientEvent: (event: RealtimeModelV4ClientEvent, options?: { intent?: RealtimeModelV4SessionIntent | undefined; } | undefined) => Effect<unknown, AiSdkError, never>; buildSessionConfig: (config: RealtimeModelV4SessionConfig, options?: { intent?: RealtimeModelV4SessionIntent | undefined; } | undefined) => Effect<unknown, AiSdkError, never>; getServerWebSocketConfig: ((options?: { intent?: RealtimeModelV4SessionIntent | undefined; } | undefined) => Effect<RealtimeModelV4ServerConnection, AiSdkError, never>) | undefined; getHealthCheckResponse: ((raw: unknown) => Effect<unknown, AiSdkError, never>) | undefined; }, AiSdkError, never>) & { getToken: (options: RealtimeFactoryV4GetTokenOptions) => Effect<RealtimeFactoryV4GetTokenResult, AiSdkError, never>; }; specificationVersion: "v4"; languageModel: (modelId: string) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>; embeddingModel: (modelId: string) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; imageModel: (modelId: string) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; transcriptionModel: ((modelId: string) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; speechModel: ((modelId: string) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; rerankingModel: ((modelId: string) => Effect<{ doRerank: (options: RerankingModelV4CallOptions) => Effect<RerankingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; files: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadFile: (options: FilesV4UploadFileCallOptions) => Effect<FilesV4UploadFileResult, AiSdkError, never>; getFileMetadata: ((options: FilesV4GetFileMetadataCallOptions) => Effect<FilesV4GetFileMetadataResult, AiSdkError, never>) | undefined; downloadFile: ((options: FilesV4DownloadFileCallOptions) => Effect<{ content: Stream<Uint8Array<ArrayBufferLike>, AiSdkError, never>; mediaType?: string | undefined; providerMetadata?: SharedV4ProviderMetadata | undefined; warnings: SharedV4Warning[]; }, AiSdkError, Scope>) | undefined; deleteFile: ((options: FilesV4DeleteFileCallOptions) => Effect<FilesV4DeleteFileResult, AiSdkError, never>) | undefined; }, AiSdkError, never>) | undefined; skills: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadSkill: (options: SkillsV4UploadSkillCallOptions) => Effect<SkillsV4UploadSkillResult, AiSdkError, never>; }, AiSdkError, never>) | undefined; }, AiSdkError, Scope | R>
```

## `VERSION`

The source declaration does not provide a JSDoc description.

```text
VERSION: string
```
