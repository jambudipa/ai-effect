---
title: prodia provider API
doc-type: reference
sources: [src/providers/prodia.ts, package.json]
---

# prodia provider API

> **TL;DR:** This entry exposes 12 public exports through `@jambudipa/ai-effect/prodia`.
> The contracts below come from the installed package declarations and JSDoc.

## Import

`@jambudipa/ai-effect/prodia` selects the package export for this provider. See the [provider source](../../../src/providers/prodia.ts).

## `createProdia`

Construct the Prodia provider inside an Effect. Keep the scope open when using an Effect
resolver for `apiKey`.

```text
createProdia(options?: StaticProviderSettings<ProdiaProviderSettings, "apiKey"> | undefined): Effect<{ languageModel: (modelId: ProdiaLanguageModelId) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>; image: (modelId: ProdiaImageModelId) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; imageModel: (modelId: ProdiaImageModelId) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; video: (modelId: ProdiaVideoModelId) => Effect<{ maxVideosPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; doGenerate: ((options: VideoModelV4CallOptions) => Effect<VideoModelV4Result, AiSdkError, never>) | undefined; doStart: ((options: VideoModelV4CallOptions & { webhookUrl?: string | undefined; }) => Effect<VideoModelV4OperationStartResult, AiSdkError, never>) | undefined; doStatus: ((options: { operation: JSONValue; abortSignal?: AbortSignal | undefined; headers?: Record<string, string | undefined> | undefined; }) => Effect<VideoModelV4OperationStatusResult, AiSdkError, never>) | undefined; handleWebhookOption: (<E, R, E2, R2>(options: { readonly webhook: () => Effect<{ readonly url: string; readonly received: Effect<VideoModelV4OperationWebhook<JSONValue>, E2, R2>; }, E, R>; }) => Effect<{ webhookUrl: string; received: Effect<VideoModelV4OperationWebhook<JSONValue>, AiSdkError, never>; }, AiSdkError, Scope | R | R2>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; videoModel: (modelId: ProdiaVideoModelId) => Effect<{ maxVideosPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; doGenerate: ((options: VideoModelV4CallOptions) => Effect<VideoModelV4Result, AiSdkError, never>) | undefined; doStart: ((options: VideoModelV4CallOptions & { webhookUrl?: string | undefined; }) => Effect<VideoModelV4OperationStartResult, AiSdkError, never>) | undefined; doStatus: ((options: { operation: JSONValue; abortSignal?: AbortSignal | undefined; headers?: Record<string, string | undefined> | undefined; }) => Effect<VideoModelV4OperationStatusResult, AiSdkError, never>) | undefined; handleWebhookOption: (<E, R, E2, R2>(options: { readonly webhook: () => Effect<{ readonly url: string; readonly received: Effect<VideoModelV4OperationWebhook<JSONValue>, E2, R2>; }, E, R>; }) => Effect<{ webhookUrl: string; received: Effect<VideoModelV4OperationWebhook<JSONValue>, AiSdkError, never>; }, AiSdkError, Scope | R | R2>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; textEmbeddingModel: (modelId: string) => Effect<never, AiSdkError, never>; specificationVersion: "v4"; embeddingModel: (modelId: string) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; transcriptionModel: ((modelId: string) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; speechModel: ((modelId: string) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; rerankingModel: ((modelId: string) => Effect<{ doRerank: (options: RerankingModelV4CallOptions) => Effect<RerankingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; files: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadFile: (options: FilesV4UploadFileCallOptions) => Effect<FilesV4UploadFileResult, AiSdkError, never>; getFileMetadata: ((options: FilesV4GetFileMetadataCallOptions) => Effect<FilesV4GetFileMetadataResult, AiSdkError, never>) | undefined; downloadFile: ((options: FilesV4DownloadFileCallOptions) => Effect<{ content: Stream<Uint8Array<ArrayBufferLike>, AiSdkError, never>; mediaType?: string | undefined; providerMetadata?: SharedV4ProviderMetadata | undefined; warnings: SharedV4Warning[]; }, AiSdkError, Scope>) | undefined; deleteFile: ((options: FilesV4DeleteFileCallOptions) => Effect<FilesV4DeleteFileResult, AiSdkError, never>) | undefined; }, AiSdkError, never>) | undefined; skills: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadSkill: (options: SkillsV4UploadSkillCallOptions) => Effect<SkillsV4UploadSkillResult, AiSdkError, never>; }, AiSdkError, never>) | undefined; }, AiSdkError, never>
createProdia<E, R>(options: EffectProviderSettings<ProdiaProviderSettings, "apiKey", E, R>): Effect<{ languageModel: (modelId: ProdiaLanguageModelId) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>; image: (modelId: ProdiaImageModelId) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; imageModel: (modelId: ProdiaImageModelId) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; video: (modelId: ProdiaVideoModelId) => Effect<{ maxVideosPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; doGenerate: ((options: VideoModelV4CallOptions) => Effect<VideoModelV4Result, AiSdkError, never>) | undefined; doStart: ((options: VideoModelV4CallOptions & { webhookUrl?: string | undefined; }) => Effect<VideoModelV4OperationStartResult, AiSdkError, never>) | undefined; doStatus: ((options: { operation: JSONValue; abortSignal?: AbortSignal | undefined; headers?: Record<string, string | undefined> | undefined; }) => Effect<VideoModelV4OperationStatusResult, AiSdkError, never>) | undefined; handleWebhookOption: (<E, R, E2, R2>(options: { readonly webhook: () => Effect<{ readonly url: string; readonly received: Effect<VideoModelV4OperationWebhook<JSONValue>, E2, R2>; }, E, R>; }) => Effect<{ webhookUrl: string; received: Effect<VideoModelV4OperationWebhook<JSONValue>, AiSdkError, never>; }, AiSdkError, Scope | R | R2>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; videoModel: (modelId: ProdiaVideoModelId) => Effect<{ maxVideosPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; doGenerate: ((options: VideoModelV4CallOptions) => Effect<VideoModelV4Result, AiSdkError, never>) | undefined; doStart: ((options: VideoModelV4CallOptions & { webhookUrl?: string | undefined; }) => Effect<VideoModelV4OperationStartResult, AiSdkError, never>) | undefined; doStatus: ((options: { operation: JSONValue; abortSignal?: AbortSignal | undefined; headers?: Record<string, string | undefined> | undefined; }) => Effect<VideoModelV4OperationStatusResult, AiSdkError, never>) | undefined; handleWebhookOption: (<E, R, E2, R2>(options: { readonly webhook: () => Effect<{ readonly url: string; readonly received: Effect<VideoModelV4OperationWebhook<JSONValue>, E2, R2>; }, E, R>; }) => Effect<{ webhookUrl: string; received: Effect<VideoModelV4OperationWebhook<JSONValue>, AiSdkError, never>; }, AiSdkError, Scope | R | R2>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; textEmbeddingModel: (modelId: string) => Effect<never, AiSdkError, never>; specificationVersion: "v4"; embeddingModel: (modelId: string) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; transcriptionModel: ((modelId: string) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; speechModel: ((modelId: string) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; rerankingModel: ((modelId: string) => Effect<{ doRerank: (options: RerankingModelV4CallOptions) => Effect<RerankingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; files: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadFile: (options: FilesV4UploadFileCallOptions) => Effect<FilesV4UploadFileResult, AiSdkError, never>; getFileMetadata: ((options: FilesV4GetFileMetadataCallOptions) => Effect<FilesV4GetFileMetadataResult, AiSdkError, never>) | undefined; downloadFile: ((options: FilesV4DownloadFileCallOptions) => Effect<{ content: Stream<Uint8Array<ArrayBufferLike>, AiSdkError, never>; mediaType?: string | undefined; providerMetadata?: SharedV4ProviderMetadata | undefined; warnings: SharedV4Warning[]; }, AiSdkError, Scope>) | undefined; deleteFile: ((options: FilesV4DeleteFileCallOptions) => Effect<FilesV4DeleteFileResult, AiSdkError, never>) | undefined; }, AiSdkError, never>) | undefined; skills: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadSkill: (options: SkillsV4UploadSkillCallOptions) => Effect<SkillsV4UploadSkillResult, AiSdkError, never>; }, AiSdkError, never>) | undefined; }, AiSdkError, Scope | R>
```

## `prodia`

Adapt the preconfigured provider from the Prodia SDK. Use the factory to supply
explicit settings.

```text
prodia: { languageModel: (modelId: ProdiaLanguageModelId) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>; image: (modelId: ProdiaImageModelId) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; imageModel: (modelId: ProdiaImageModelId) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; video: (modelId: ProdiaVideoModelId) => Effect<{ maxVideosPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; doGenerate: ((options: VideoModelV4CallOptions) => Effect<VideoModelV4Result, AiSdkError, never>) | undefined; doStart: ((options: VideoModelV4CallOptions & { webhookUrl?: string | undefined; }) => Effect<VideoModelV4OperationStartResult, AiSdkError, never>) | undefined; doStatus: ((options: { operation: JSONValue; abortSignal?: AbortSignal | undefined; headers?: Record<string, string | undefined> | undefined; }) => Effect<VideoModelV4OperationStatusResult, AiSdkError, never>) | undefined; handleWebhookOption: (<E, R, E2, R2>(options: { readonly webhook: () => Effect<{ readonly url: string; readonly received: Effect<VideoModelV4OperationWebhook<JSONValue>, E2, R2>; }, E, R>; }) => Effect<{ webhookUrl: string; received: Effect<VideoModelV4OperationWebhook<JSONValue>, AiSdkError, never>; }, AiSdkError, Scope | R | R2>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; videoModel: (modelId: ProdiaVideoModelId) => Effect<{ maxVideosPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; doGenerate: ((options: VideoModelV4CallOptions) => Effect<VideoModelV4Result, AiSdkError, never>) | undefined; doStart: ((options: VideoModelV4CallOptions & { webhookUrl?: string | undefined; }) => Effect<VideoModelV4OperationStartResult, AiSdkError, never>) | undefined; doStatus: ((options: { operation: JSONValue; abortSignal?: AbortSignal | undefined; headers?: Record<string, string | undefined> | undefined; }) => Effect<VideoModelV4OperationStatusResult, AiSdkError, never>) | undefined; handleWebhookOption: (<E, R, E2, R2>(options: { readonly webhook: () => Effect<{ readonly url: string; readonly received: Effect<VideoModelV4OperationWebhook<JSONValue>, E2, R2>; }, E, R>; }) => Effect<{ webhookUrl: string; received: Effect<VideoModelV4OperationWebhook<JSONValue>, AiSdkError, never>; }, AiSdkError, Scope | R | R2>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; textEmbeddingModel: (modelId: string) => Effect<never, AiSdkError, never>; specificationVersion: "v4"; embeddingModel: (modelId: string) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; transcriptionModel: ((modelId: string) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; speechModel: ((modelId: string) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; rerankingModel: ((modelId: string) => Effect<{ doRerank: (options: RerankingModelV4CallOptions) => Effect<RerankingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; files: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadFile: (options: FilesV4UploadFileCallOptions) => Effect<FilesV4UploadFileResult, AiSdkError, never>; getFileMetadata: ((options: FilesV4GetFileMetadataCallOptions) => Effect<FilesV4GetFileMetadataResult, AiSdkError, never>) | undefined; downloadFile: ((options: FilesV4DownloadFileCallOptions) => Effect<{ content: Stream<Uint8Array<ArrayBufferLike>, AiSdkError, never>; mediaType?: string | undefined; providerMetadata?: SharedV4ProviderMetadata | undefined; warnings: SharedV4Warning[]; }, AiSdkError, Scope>) | undefined; deleteFile: ((options: FilesV4DeleteFileCallOptions) => Effect<FilesV4DeleteFileResult, AiSdkError, never>) | undefined; }, AiSdkError, never>) | undefined; skills: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadSkill: (options: SkillsV4UploadSkillCallOptions) => Effect<SkillsV4UploadSkillResult, AiSdkError, never>; }, AiSdkError, never>) | undefined; }
```

## `ProdiaImageModelId`

Prodia job types for image generation.

```text
type ProdiaImageModelId = ProdiaModelIds['image'] | (string & {});
```

## `ProdiaImageModelOptions`

The source declaration does not provide a JSDoc description.

```text
type ProdiaImageModelOptions = InferSchema<typeof prodiaImageModelOptionsSchema>;
```

## `ProdiaImageProviderOptions`

The source declaration does not provide a JSDoc description.

```text
type ProdiaImageModelOptions = InferSchema<typeof prodiaImageModelOptionsSchema>;
```

## `ProdiaLanguageModelId`

Prodia job types for language model (multimodal img2img).

```text
type ProdiaLanguageModelId = ProdiaModelIds['language'] | (string & {});
```

## `ProdiaLanguageModelOptions`

The source declaration does not provide a JSDoc description.

```text
type ProdiaLanguageModelOptions = InferSchema<typeof prodiaLanguageModelOptionsSchema>;
```

## `ProdiaProvider`

Provider returned by the adapter, with Effect-based model selection for Prodia.

```text
export type ProdiaProvider = ReturnType<typeof wrapProvider>;
```

## `ProdiaProviderSettings`

Keep the native Prodia options and allow `apiKey` to resolve through Effect when the SDK
requests the value.

```text
export type ProdiaProviderSettings<E = never, R = never> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
```

## `ProdiaVideoModelId`

Prodia job types for video generation.

```text
type ProdiaVideoModelId = ProdiaModelIds['video'] | (string & {});
```

## `ProdiaVideoModelOptions`

The source declaration does not provide a JSDoc description.

```text
type ProdiaVideoModelOptions = InferSchema<typeof prodiaVideoModelOptionsSchema>;
```

## `VERSION`

The source declaration does not provide a JSDoc description.

```text
VERSION: string
```
