---
title: tencent provider API
doc-type: reference
sources: [src/providers/tencent.ts, package.json]
---

# tencent provider API

> **TL;DR:** This entry exposes 10 public exports through `@jambudipa/ai-effect/tencent`.
> The contracts below come from the installed package declarations and JSDoc.

## Import

`@jambudipa/ai-effect/tencent` selects the package export for this provider. See the [provider source](../../../../../src/providers/tencent.ts).

## `createTencent`

Construct the Tencent provider inside an Effect. Keep the scope open when using an Effect
resolver for `apiKey`.

```text
createTencent(options?: StaticProviderSettings<TencentProviderSettings, "apiKey"> | undefined): Effect<((modelId: TencentChatModelId) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>) & { languageModel: (modelId: TencentChatModelId) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>; chat: (modelId: TencentChatModelId) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>; video: (modelId: TencentVideoModelId) => Effect<{ maxVideosPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; doGenerate: ((options: VideoModelV4CallOptions) => Effect<VideoModelV4Result, AiSdkError, never>) | undefined; doStart: ((options: VideoModelV4CallOptions & { webhookUrl?: string | undefined; }) => Effect<VideoModelV4OperationStartResult, AiSdkError, never>) | undefined; doStatus: ((options: { operation: JSONValue; abortSignal?: AbortSignal | undefined; headers?: Record<string, string | undefined> | undefined; }) => Effect<VideoModelV4OperationStatusResult, AiSdkError, never>) | undefined; handleWebhookOption: (<E, R, E2, R2>(options: { readonly webhook: () => Effect<{ readonly url: string; readonly received: Effect<VideoModelV4OperationWebhook<JSONValue>, E2, R2>; }, E, R>; }) => Effect<{ webhookUrl: string; received: Effect<VideoModelV4OperationWebhook<JSONValue>, AiSdkError, never>; }, AiSdkError, Scope | R | R2>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; videoModel: (modelId: TencentVideoModelId) => Effect<{ maxVideosPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; doGenerate: ((options: VideoModelV4CallOptions) => Effect<VideoModelV4Result, AiSdkError, never>) | undefined; doStart: ((options: VideoModelV4CallOptions & { webhookUrl?: string | undefined; }) => Effect<VideoModelV4OperationStartResult, AiSdkError, never>) | undefined; doStatus: ((options: { operation: JSONValue; abortSignal?: AbortSignal | undefined; headers?: Record<string, string | undefined> | undefined; }) => Effect<VideoModelV4OperationStatusResult, AiSdkError, never>) | undefined; handleWebhookOption: (<E, R, E2, R2>(options: { readonly webhook: () => Effect<{ readonly url: string; readonly received: Effect<VideoModelV4OperationWebhook<JSONValue>, E2, R2>; }, E, R>; }) => Effect<{ webhookUrl: string; received: Effect<VideoModelV4OperationWebhook<JSONValue>, AiSdkError, never>; }, AiSdkError, Scope | R | R2>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; textEmbeddingModel: (modelId: string) => Effect<never, AiSdkError, never>; specificationVersion: "v4"; embeddingModel: (modelId: string) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; imageModel: (modelId: string) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; transcriptionModel: ((modelId: string) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; speechModel: ((modelId: string) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; rerankingModel: ((modelId: string) => Effect<{ doRerank: (options: RerankingModelV4CallOptions) => Effect<RerankingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; files: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadFile: (options: FilesV4UploadFileCallOptions) => Effect<FilesV4UploadFileResult, AiSdkError, never>; getFileMetadata: ((options: FilesV4GetFileMetadataCallOptions) => Effect<FilesV4GetFileMetadataResult, AiSdkError, never>) | undefined; downloadFile: ((options: FilesV4DownloadFileCallOptions) => Effect<{ content: Stream<Uint8Array<ArrayBufferLike>, AiSdkError, never>; mediaType?: string | undefined; providerMetadata?: SharedV4ProviderMetadata | undefined; warnings: SharedV4Warning[]; }, AiSdkError, Scope>) | undefined; deleteFile: ((options: FilesV4DeleteFileCallOptions) => Effect<FilesV4DeleteFileResult, AiSdkError, never>) | undefined; }, AiSdkError, never>) | undefined; skills: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadSkill: (options: SkillsV4UploadSkillCallOptions) => Effect<SkillsV4UploadSkillResult, AiSdkError, never>; }, AiSdkError, never>) | undefined; }, AiSdkError, never>
createTencent<E, R>(options: EffectProviderSettings<TencentProviderSettings, "apiKey", E, R>): Effect<((modelId: TencentChatModelId) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>) & { languageModel: (modelId: TencentChatModelId) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>; chat: (modelId: TencentChatModelId) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>; video: (modelId: TencentVideoModelId) => Effect<{ maxVideosPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; doGenerate: ((options: VideoModelV4CallOptions) => Effect<VideoModelV4Result, AiSdkError, never>) | undefined; doStart: ((options: VideoModelV4CallOptions & { webhookUrl?: string | undefined; }) => Effect<VideoModelV4OperationStartResult, AiSdkError, never>) | undefined; doStatus: ((options: { operation: JSONValue; abortSignal?: AbortSignal | undefined; headers?: Record<string, string | undefined> | undefined; }) => Effect<VideoModelV4OperationStatusResult, AiSdkError, never>) | undefined; handleWebhookOption: (<E, R, E2, R2>(options: { readonly webhook: () => Effect<{ readonly url: string; readonly received: Effect<VideoModelV4OperationWebhook<JSONValue>, E2, R2>; }, E, R>; }) => Effect<{ webhookUrl: string; received: Effect<VideoModelV4OperationWebhook<JSONValue>, AiSdkError, never>; }, AiSdkError, Scope | R | R2>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; videoModel: (modelId: TencentVideoModelId) => Effect<{ maxVideosPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; doGenerate: ((options: VideoModelV4CallOptions) => Effect<VideoModelV4Result, AiSdkError, never>) | undefined; doStart: ((options: VideoModelV4CallOptions & { webhookUrl?: string | undefined; }) => Effect<VideoModelV4OperationStartResult, AiSdkError, never>) | undefined; doStatus: ((options: { operation: JSONValue; abortSignal?: AbortSignal | undefined; headers?: Record<string, string | undefined> | undefined; }) => Effect<VideoModelV4OperationStatusResult, AiSdkError, never>) | undefined; handleWebhookOption: (<E, R, E2, R2>(options: { readonly webhook: () => Effect<{ readonly url: string; readonly received: Effect<VideoModelV4OperationWebhook<JSONValue>, E2, R2>; }, E, R>; }) => Effect<{ webhookUrl: string; received: Effect<VideoModelV4OperationWebhook<JSONValue>, AiSdkError, never>; }, AiSdkError, Scope | R | R2>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; textEmbeddingModel: (modelId: string) => Effect<never, AiSdkError, never>; specificationVersion: "v4"; embeddingModel: (modelId: string) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; imageModel: (modelId: string) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; transcriptionModel: ((modelId: string) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; speechModel: ((modelId: string) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; rerankingModel: ((modelId: string) => Effect<{ doRerank: (options: RerankingModelV4CallOptions) => Effect<RerankingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; files: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadFile: (options: FilesV4UploadFileCallOptions) => Effect<FilesV4UploadFileResult, AiSdkError, never>; getFileMetadata: ((options: FilesV4GetFileMetadataCallOptions) => Effect<FilesV4GetFileMetadataResult, AiSdkError, never>) | undefined; downloadFile: ((options: FilesV4DownloadFileCallOptions) => Effect<{ content: Stream<Uint8Array<ArrayBufferLike>, AiSdkError, never>; mediaType?: string | undefined; providerMetadata?: SharedV4ProviderMetadata | undefined; warnings: SharedV4Warning[]; }, AiSdkError, Scope>) | undefined; deleteFile: ((options: FilesV4DeleteFileCallOptions) => Effect<FilesV4DeleteFileResult, AiSdkError, never>) | undefined; }, AiSdkError, never>) | undefined; skills: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadSkill: (options: SkillsV4UploadSkillCallOptions) => Effect<SkillsV4UploadSkillResult, AiSdkError, never>; }, AiSdkError, never>) | undefined; }, AiSdkError, Scope | R>
```

## `tencent`

Adapt the preconfigured provider from the Tencent SDK. Use the factory to supply
explicit settings.

```text
tencent(modelId: TencentChatModelId): Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

### Public properties

#### `tencent.chat`

```text
(modelId: TencentChatModelId) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

#### `tencent.embeddingModel`

```text
(modelId: string) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `tencent.files`

```text
(() => Effect<{ specificationVersion: "v4"; provider: string; uploadFile: (options: FilesV4UploadFileCallOptions) => Effect<FilesV4UploadFileResult, AiSdkError, never>; getFileMetadata: ((options: FilesV4GetFileMetadataCallOptions) => Effect<FilesV4GetFileMetadataResult, AiSdkError, never>) | undefined; downloadFile: ((options: FilesV4DownloadFileCallOptions) => Effect<{ content: Stream<Uint8Array<ArrayBufferLike>, AiSdkError, never>; mediaType?: string | undefined; providerMetadata?: SharedV4ProviderMetadata | undefined; warnings: SharedV4Warning[]; }, AiSdkError, Scope>) | undefined; deleteFile: ((options: FilesV4DeleteFileCallOptions) => Effect<FilesV4DeleteFileResult, AiSdkError, never>) | undefined; }, AiSdkError, never>) | undefined
```

#### `tencent.imageModel`

```text
(modelId: string) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `tencent.languageModel`

```text
(modelId: TencentChatModelId) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

#### `tencent.rerankingModel`

```text
((modelId: string) => Effect<{ doRerank: (options: RerankingModelV4CallOptions) => Effect<RerankingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined
```

#### `tencent.skills`

```text
(() => Effect<{ specificationVersion: "v4"; provider: string; uploadSkill: (options: SkillsV4UploadSkillCallOptions) => Effect<SkillsV4UploadSkillResult, AiSdkError, never>; }, AiSdkError, never>) | undefined
```

#### `tencent.specificationVersion`

```text
"v4"
```

#### `tencent.speechModel`

```text
((modelId: string) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined
```

#### `tencent.textEmbeddingModel`

```text
(modelId: string) => Effect<never, AiSdkError, never>
```

#### `tencent.transcriptionModel`

```text
((modelId: string) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined
```

#### `tencent.video`

```text
(modelId: TencentVideoModelId) => Effect<{ maxVideosPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; doGenerate: ((options: VideoModelV4CallOptions) => Effect<VideoModelV4Result, AiSdkError, never>) | undefined; doStart: ((options: VideoModelV4CallOptions & { webhookUrl?: string | undefined; }) => Effect<VideoModelV4OperationStartResult, AiSdkError, never>) | undefined; doStatus: ((options: { operation: JSONValue; abortSignal?: AbortSignal | undefined; headers?: Record<string, string | undefined> | undefined; }) => Effect<VideoModelV4OperationStatusResult, AiSdkError, never>) | undefined; handleWebhookOption: (<E, R, E2, R2>(options: { readonly webhook: () => Effect<{ readonly url: string; readonly received: Effect<VideoModelV4OperationWebhook<JSONValue>, E2, R2>; }, E, R>; }) => Effect<{ webhookUrl: string; received: Effect<VideoModelV4OperationWebhook<JSONValue>, AiSdkError, never>; }, AiSdkError, Scope | R | R2>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `tencent.videoModel`

```text
(modelId: TencentVideoModelId) => Effect<{ maxVideosPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; doGenerate: ((options: VideoModelV4CallOptions) => Effect<VideoModelV4Result, AiSdkError, never>) | undefined; doStart: ((options: VideoModelV4CallOptions & { webhookUrl?: string | undefined; }) => Effect<VideoModelV4OperationStartResult, AiSdkError, never>) | undefined; doStatus: ((options: { operation: JSONValue; abortSignal?: AbortSignal | undefined; headers?: Record<string, string | undefined> | undefined; }) => Effect<VideoModelV4OperationStatusResult, AiSdkError, never>) | undefined; handleWebhookOption: (<E, R, E2, R2>(options: { readonly webhook: () => Effect<{ readonly url: string; readonly received: Effect<VideoModelV4OperationWebhook<JSONValue>, E2, R2>; }, E, R>; }) => Effect<{ webhookUrl: string; received: Effect<VideoModelV4OperationWebhook<JSONValue>, AiSdkError, never>; }, AiSdkError, Scope | R | R2>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```


## `TencentChatModelId`

The source declaration does not provide a JSDoc description.

```text
type TencentChatModelId = TencentModelIds['language'] | (string & {});
```

## `TencentLanguageModelChatOptions`

TokenHub accepts the OpenAI-compatible chat options. Keys under
`providerOptions.tencent` that are not part of that set (for example
`thinking`) are forwarded to the request body unchanged.

```text
type TencentLanguageModelChatOptions = Record<string, never>;
```

## `TencentProvider`

Provider returned by the adapter, with Effect-based model selection for Tencent.

```text
export type TencentProvider = ReturnType<typeof wrapProvider>;
```

## `TencentProviderSettings`

Keep the native Tencent options and allow `apiKey` to resolve through Effect when the
SDK requests the value.

```text
export type TencentProviderSettings<E = never, R = never> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
```

## `TencentTokenHubErrorData`

The source declaration does not provide a JSDoc description.

```text
type TencentTokenHubErrorData = InferSchema<typeof tencentTokenHubErrorDataSchema>;
```

## `TencentVideoModelId`

Video model IDs.

- TokenHub Kling models use the TokenHub `model` value, e.g. `kling-video-v3`.
  See https://www.tencentcloud.com/document/product/1300/83714
- VOD AIGC models use `vod/<ModelName>/<ModelVersion>`, e.g. `vod/Kling/3.0`.
  See https://www.tencentcloud.com/document/api/266/76684

```text
type TencentVideoModelId = TencentModelIds['video'] | (string & {});
```

## `TencentVideoModelOptions`

Provider-specific options for Tencent video generation, passed as
`providerOptions.tencent`.

Options apply to TokenHub Kling models (`kling-video-*`), VOD AIGC models
(`vod/<ModelName>/<ModelVersion>`), or both, as noted on each option. An
option that does not apply to the selected model is ignored with a warning.

```text
type TencentVideoModelOptions = {
  /**
   * Output resolution tier, sent as-is. Takes precedence over the top-level
   * `resolution`.
   *
   * TokenHub Kling: `720p`, `1080p`, `4k`. VOD: e.g. `720P`, `1080P`, `2K`,
   * `4K` depending on the model. Both backends.
   */
  resolution?: string;
  /**
   * TokenHub Kling: audio track mode. `native` generates audio, `original`
   * keeps the audio of a reference video (omni and motion control), `off`
   * disables audio. Takes precedence over the top-level `generateAudio`.
   */
  audio?: 'native' | 'original' | 'off';
  /**
   * TokenHub Kling: whether a multi-shot prompt produces multi-shot output.
   * Supported by `kling-video-v3` and `kling-video-v3-omni`.
   */
  multiShot?: boolean;
  /**
   * TokenHub Kling motion control: whether the character orientation follows
   * the image reference or the motion reference video. Required by the API
   * for motion control models.
   */
  characterOrientation?: 'image' | 'video';
  /**
   * TokenHub Kling: custom elements (subjects) created through the TokenHub
   * element API. `id` is required by motion control models and lets the
   * prompt reference the element.
   */
  elements?: Array<{
    elementId: string;
    id?: string;
  }>;
  /**
   * TokenHub Kling omni: voices to use, referenced in the prompt as `@id`.
   */
  voices?: Array<{
    voiceId: string;
    id: string;
  }>;
  /**
   * How reference videos from `inputReferences` are used. `feature` uses
   * them as a feature reference, `base` as a video to edit. Defaults to
   * `feature`. TokenHub Kling omni and VOD Kling.
   */
  referenceVideoType?: 'feature' | 'base';
  /**
   * Whether to add a watermark (TokenHub `watermark_info`, VOD `LogoAdd`).
   * Both backends.
   */
  watermark?: boolean;
  /**
   * TokenHub Kling: custom task ID, unique within the account.
   */
  externalTaskId?: string;
  /**
   * VOD: prompt describing what the model should avoid.
   */
  negativePrompt?: string;
  /**
   * VOD: whether to optimize the prompt automatically.
   */
  enhancePrompt?: boolean;
  /**
   * VOD: where input files are stored. Tencent defaults to `Mainland`.
   */
  inputRegion?: 'Oversea' | 'OverseaUSWest' | 'Mainland';
  /**
   * VOD: scenario type, e.g. `motion_control`, `avatar_i2v` or `lip_sync`
   * for Kling.
   */
  sceneType?: string;
  /**
   * VOD: whether people and faces may be generated.
   */
  personGeneration?: 'AllowAdult' | 'Disallowed';
  /**
   * VOD: whether to run a compliance check on the input.
   */
  inputComplianceCheck?: boolean;
  /**
   * VOD: whether to run a compliance check on the output.
   */
  outputComplianceCheck?: boolean;
  /**
   * VOD: whether to upscale output with video enhancement. Tencent enables
   * enhancement by default when the resolution exceeds what the model
   * renders natively.
   */
  enhanceSwitch?: boolean;
  /**
   * VOD: whether to run the task in off-peak mode.
   */
  offPeak?: boolean;
  /**
   * VOD: deduplication identifier. A request that repeats an identifier used
   * within the last three days fails.
   */
  sessionId?: string;
  /**
   * VOD: context string passed through to callbacks.
   */
  sessionContext?: string;
  /**
   * VOD: task priority from -10 to 10.
   */
  tasksPriority?: number;
  /**
   * VOD: reserved field for model-specific parameters, sent as-is.
   */
  extInfo?: string;
  /**
   * VOD: materials registered with `CreateAigcMaterial`, referenced by their
   * `asset://` URL. VOD requires assets for images that show real people.
   * Sent after the other file inputs.
   */
  assets?: Array<{
    /** Asset URL, for example `asset://asset-…`. */
    url: string;
    /** How the asset is used. Defaults to `Reference`. */
    usage?: 'FirstFrame' | 'LastFrame' | 'Reference';
    /** Asset media category. Defaults to `Image`. */
    category?: 'Image' | 'Video' | 'Audio';
  }>;
};
```

## `VERSION`

The source declaration does not provide a JSDoc description.

```text
VERSION: string
```
