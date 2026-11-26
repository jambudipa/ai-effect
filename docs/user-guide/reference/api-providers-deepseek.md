---
title: deepseek provider API
doc-type: reference
sources: [src/providers/deepseek.ts, package.json]
---

# deepseek provider API

> **TL;DR:** This entry exposes 15 public exports through `@jambudipa/ai-effect/deepseek`.
> The contracts below come from the installed package declarations and JSDoc.

## Import

`@jambudipa/ai-effect/deepseek` selects the package export for this provider. See the [provider source](../../../src/providers/deepseek.ts).

## `createDeepSeek`

Construct the DeepSeek provider inside an Effect. Keep the scope open when using an Effect
resolver for `apiKey`.

```text
createDeepSeek(options?: StaticProviderSettings<DeepSeekProviderSettings, "apiKey"> | undefined): Effect<((modelId: (string & {}) | "deepseek-flash" | "deepseek-v4-flash" | "deepseek-v4-pro" | "deepseek-v4-flash-vision-exp") => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>) & { languageModel: (modelId: (string & {}) | "deepseek-flash" | "deepseek-v4-flash" | "deepseek-v4-pro" | "deepseek-v4-flash-vision-exp") => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>; chat: (modelId: (string & {}) | "deepseek-flash" | "deepseek-v4-flash" | "deepseek-v4-pro" | "deepseek-v4-flash-vision-exp") => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>; responses: (modelId: (string & {}) | "deepseek-flash" | "deepseek-v4-pro") => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>; files: () => Effect<{ specificationVersion: "v4"; provider: string; uploadFile: (options: FilesV4UploadFileCallOptions) => Effect<FilesV4UploadFileResult, AiSdkError, never>; getFileMetadata: ((options: FilesV4GetFileMetadataCallOptions) => Effect<FilesV4GetFileMetadataResult, AiSdkError, never>) | undefined; downloadFile: ((options: FilesV4DownloadFileCallOptions) => Effect<{ content: Stream<Uint8Array<ArrayBufferLike>, AiSdkError, never>; mediaType?: string | undefined; providerMetadata?: SharedV4ProviderMetadata | undefined; warnings: SharedV4Warning[]; }, AiSdkError, Scope>) | undefined; deleteFile: ((options: FilesV4DeleteFileCallOptions) => Effect<FilesV4DeleteFileResult, AiSdkError, never>) | undefined; }, AiSdkError, never>; textEmbeddingModel: (modelId: string) => Effect<never, AiSdkError, never>; tools: AdaptedTools<{ webSearch: (args?: { onInputStart?: ((options: ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; onInputDelta?: ((options: { inputTextDelta: string; } & ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; onInputAvailable?: ((options: { input: {}; } & ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; } | undefined) => ProviderExecutedTool<{}, { status?: string | undefined; action?: Record<string, unknown> | undefined; }, {}>; }>; specificationVersion: "v4"; embeddingModel: (modelId: string) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; imageModel: (modelId: string) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; transcriptionModel: ((modelId: string) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; speechModel: ((modelId: string) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; rerankingModel: ((modelId: string) => Effect<{ doRerank: (options: RerankingModelV4CallOptions) => Effect<RerankingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; skills: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadSkill: (options: SkillsV4UploadSkillCallOptions) => Effect<SkillsV4UploadSkillResult, AiSdkError, never>; }, AiSdkError, never>) | undefined; }, AiSdkError, never>
createDeepSeek<E, R>(options: EffectProviderSettings<DeepSeekProviderSettings, "apiKey", E, R>): Effect<((modelId: (string & {}) | "deepseek-flash" | "deepseek-v4-flash" | "deepseek-v4-pro" | "deepseek-v4-flash-vision-exp") => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>) & { languageModel: (modelId: (string & {}) | "deepseek-flash" | "deepseek-v4-flash" | "deepseek-v4-pro" | "deepseek-v4-flash-vision-exp") => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>; chat: (modelId: (string & {}) | "deepseek-flash" | "deepseek-v4-flash" | "deepseek-v4-pro" | "deepseek-v4-flash-vision-exp") => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>; responses: (modelId: (string & {}) | "deepseek-flash" | "deepseek-v4-pro") => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>; files: () => Effect<{ specificationVersion: "v4"; provider: string; uploadFile: (options: FilesV4UploadFileCallOptions) => Effect<FilesV4UploadFileResult, AiSdkError, never>; getFileMetadata: ((options: FilesV4GetFileMetadataCallOptions) => Effect<FilesV4GetFileMetadataResult, AiSdkError, never>) | undefined; downloadFile: ((options: FilesV4DownloadFileCallOptions) => Effect<{ content: Stream<Uint8Array<ArrayBufferLike>, AiSdkError, never>; mediaType?: string | undefined; providerMetadata?: SharedV4ProviderMetadata | undefined; warnings: SharedV4Warning[]; }, AiSdkError, Scope>) | undefined; deleteFile: ((options: FilesV4DeleteFileCallOptions) => Effect<FilesV4DeleteFileResult, AiSdkError, never>) | undefined; }, AiSdkError, never>; textEmbeddingModel: (modelId: string) => Effect<never, AiSdkError, never>; tools: AdaptedTools<{ webSearch: (args?: { onInputStart?: ((options: ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; onInputDelta?: ((options: { inputTextDelta: string; } & ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; onInputAvailable?: ((options: { input: {}; } & ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; } | undefined) => ProviderExecutedTool<{}, { status?: string | undefined; action?: Record<string, unknown> | undefined; }, {}>; }>; specificationVersion: "v4"; embeddingModel: (modelId: string) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; imageModel: (modelId: string) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; transcriptionModel: ((modelId: string) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; speechModel: ((modelId: string) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; rerankingModel: ((modelId: string) => Effect<{ doRerank: (options: RerankingModelV4CallOptions) => Effect<RerankingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; skills: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadSkill: (options: SkillsV4UploadSkillCallOptions) => Effect<SkillsV4UploadSkillResult, AiSdkError, never>; }, AiSdkError, never>) | undefined; }, AiSdkError, R | Scope>
```

## `deepseek`

Expose the same DeepSeek provider as `deepSeek` under the SDK alias.

```text
deepseek(modelId: (string & {}) | "deepseek-flash" | "deepseek-v4-flash" | "deepseek-v4-pro" | "deepseek-v4-flash-vision-exp"): Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

### Public properties

#### `deepseek.chat`

```text
(modelId: (string & {}) | "deepseek-flash" | "deepseek-v4-flash" | "deepseek-v4-pro" | "deepseek-v4-flash-vision-exp") => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

#### `deepseek.embeddingModel`

```text
(modelId: string) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `deepseek.files`

```text
() => Effect<{ specificationVersion: "v4"; provider: string; uploadFile: (options: FilesV4UploadFileCallOptions) => Effect<FilesV4UploadFileResult, AiSdkError, never>; getFileMetadata: ((options: FilesV4GetFileMetadataCallOptions) => Effect<FilesV4GetFileMetadataResult, AiSdkError, never>) | undefined; downloadFile: ((options: FilesV4DownloadFileCallOptions) => Effect<{ content: Stream<Uint8Array<ArrayBufferLike>, AiSdkError, never>; mediaType?: string | undefined; providerMetadata?: SharedV4ProviderMetadata | undefined; warnings: SharedV4Warning[]; }, AiSdkError, Scope>) | undefined; deleteFile: ((options: FilesV4DeleteFileCallOptions) => Effect<FilesV4DeleteFileResult, AiSdkError, never>) | undefined; }, AiSdkError, never>
```

#### `deepseek.imageModel`

```text
(modelId: string) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `deepseek.languageModel`

```text
(modelId: (string & {}) | "deepseek-flash" | "deepseek-v4-flash" | "deepseek-v4-pro" | "deepseek-v4-flash-vision-exp") => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

#### `deepseek.rerankingModel`

```text
((modelId: string) => Effect<{ doRerank: (options: RerankingModelV4CallOptions) => Effect<RerankingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined
```

#### `deepseek.responses`

```text
(modelId: (string & {}) | "deepseek-flash" | "deepseek-v4-pro") => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

#### `deepseek.skills`

```text
(() => Effect<{ specificationVersion: "v4"; provider: string; uploadSkill: (options: SkillsV4UploadSkillCallOptions) => Effect<SkillsV4UploadSkillResult, AiSdkError, never>; }, AiSdkError, never>) | undefined
```

#### `deepseek.specificationVersion`

```text
"v4"
```

#### `deepseek.speechModel`

```text
((modelId: string) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined
```

#### `deepseek.textEmbeddingModel`

```text
(modelId: string) => Effect<never, AiSdkError, never>
```

#### `deepseek.tools`

```text
AdaptedTools<{ webSearch: (args?: { onInputStart?: ((options: ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; onInputDelta?: ((options: { inputTextDelta: string; } & ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; onInputAvailable?: ((options: { input: {}; } & ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; } | undefined) => ProviderExecutedTool<{}, { status?: string | undefined; action?: Record<string, unknown> | undefined; }, {}>; }>
```

#### `deepseek.transcriptionModel`

```text
((modelId: string) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined
```


## `deepSeek`

Adapt the preconfigured provider from the DeepSeek SDK. Use the factory to supply
explicit settings.

```text
deepSeek(modelId: (string & {}) | "deepseek-flash" | "deepseek-v4-flash" | "deepseek-v4-pro" | "deepseek-v4-flash-vision-exp"): Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

### Public properties

#### `deepSeek.chat`

```text
(modelId: (string & {}) | "deepseek-flash" | "deepseek-v4-flash" | "deepseek-v4-pro" | "deepseek-v4-flash-vision-exp") => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

#### `deepSeek.embeddingModel`

```text
(modelId: string) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `deepSeek.files`

```text
() => Effect<{ specificationVersion: "v4"; provider: string; uploadFile: (options: FilesV4UploadFileCallOptions) => Effect<FilesV4UploadFileResult, AiSdkError, never>; getFileMetadata: ((options: FilesV4GetFileMetadataCallOptions) => Effect<FilesV4GetFileMetadataResult, AiSdkError, never>) | undefined; downloadFile: ((options: FilesV4DownloadFileCallOptions) => Effect<{ content: Stream<Uint8Array<ArrayBufferLike>, AiSdkError, never>; mediaType?: string | undefined; providerMetadata?: SharedV4ProviderMetadata | undefined; warnings: SharedV4Warning[]; }, AiSdkError, Scope>) | undefined; deleteFile: ((options: FilesV4DeleteFileCallOptions) => Effect<FilesV4DeleteFileResult, AiSdkError, never>) | undefined; }, AiSdkError, never>
```

#### `deepSeek.imageModel`

```text
(modelId: string) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `deepSeek.languageModel`

```text
(modelId: (string & {}) | "deepseek-flash" | "deepseek-v4-flash" | "deepseek-v4-pro" | "deepseek-v4-flash-vision-exp") => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

#### `deepSeek.rerankingModel`

```text
((modelId: string) => Effect<{ doRerank: (options: RerankingModelV4CallOptions) => Effect<RerankingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined
```

#### `deepSeek.responses`

```text
(modelId: (string & {}) | "deepseek-flash" | "deepseek-v4-pro") => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

#### `deepSeek.skills`

```text
(() => Effect<{ specificationVersion: "v4"; provider: string; uploadSkill: (options: SkillsV4UploadSkillCallOptions) => Effect<SkillsV4UploadSkillResult, AiSdkError, never>; }, AiSdkError, never>) | undefined
```

#### `deepSeek.specificationVersion`

```text
"v4"
```

#### `deepSeek.speechModel`

```text
((modelId: string) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined
```

#### `deepSeek.textEmbeddingModel`

```text
(modelId: string) => Effect<never, AiSdkError, never>
```

#### `deepSeek.tools`

```text
AdaptedTools<{ webSearch: (args?: { onInputStart?: ((options: ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; onInputDelta?: ((options: { inputTextDelta: string; } & ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; onInputAvailable?: ((options: { input: {}; } & ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; } | undefined) => ProviderExecutedTool<{}, { status?: string | undefined; action?: Record<string, unknown> | undefined; }, {}>; }>
```

#### `deepSeek.transcriptionModel`

```text
((modelId: string) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined
```


## `DeepSeekAssistantMessageProviderOptions`

The source declaration does not provide a JSDoc description.

```text
type DeepSeekAssistantMessageProviderOptions = InferSchema<typeof deepseekAssistantMessageProviderOptions>;
```

## `DeepSeekChatOptions`

The source declaration does not provide a JSDoc description.

```text
type DeepSeekLanguageModelChatOptions = {
  /**
   * Whether to return log probabilities for generated tokens.
   */
  logprobs?: boolean;
  /**
   * Number of most likely tokens to return at each token position.
   *
   * Setting this option automatically enables `logprobs`.
   */
  topLogprobs?: number;
  /**
   * An opaque identifier for the end user. DeepSeek uses this identifier for
   * content-safety tracing and request isolation.
   *
   * Must contain only ASCII letters, numbers, underscores, and hyphens, and
   * must be at most 512 characters long.
   */
  userId?: string;
  /**
   * Controls whether thinking mode is enabled. Defaults to `enabled`.
   */
  thinking?: {
    type?: 'enabled' | 'disabled';
  };
  /**
   * Controls the thinking strength for DeepSeek V4 reasoning models.
   */
  reasoningEffort?: 'low' | 'high' | 'max';
  /**
   * Whether to use strict JSON schema validation for structured outputs.
   * Only applies when the serving endpoint supports JSON schema response
   * formats (e.g. Azure). Defaults to `true`.
   */
  strictJsonSchema?: boolean;
};
```

## `DeepSeekErrorData`

The source declaration does not provide a JSDoc description.

```text
type DeepSeekErrorData = InferSchema<typeof deepSeekErrorSchema>;
```

## `DeepSeekFilePartProviderOptions`

The source declaration does not provide a JSDoc description.

```text
type DeepSeekFilePartProviderOptions = InferSchema<typeof deepseekFilePartProviderOptions>;
```

## `DeepSeekFilesOptions`

The source declaration does not provide a JSDoc description.

```text
type DeepSeekFilesOptions = InferSchema<typeof deepSeekFilesOptionsSchema>;
```

## `DeepSeekLanguageModelChatOptions`

The source declaration does not provide a JSDoc description.

```text
type DeepSeekLanguageModelChatOptions = {
  /**
   * Whether to return log probabilities for generated tokens.
   */
  logprobs?: boolean;
  /**
   * Number of most likely tokens to return at each token position.
   *
   * Setting this option automatically enables `logprobs`.
   */
  topLogprobs?: number;
  /**
   * An opaque identifier for the end user. DeepSeek uses this identifier for
   * content-safety tracing and request isolation.
   *
   * Must contain only ASCII letters, numbers, underscores, and hyphens, and
   * must be at most 512 characters long.
   */
  userId?: string;
  /**
   * Controls whether thinking mode is enabled. Defaults to `enabled`.
   */
  thinking?: {
    type?: 'enabled' | 'disabled';
  };
  /**
   * Controls the thinking strength for DeepSeek V4 reasoning models.
   */
  reasoningEffort?: 'low' | 'high' | 'max';
  /**
   * Whether to use strict JSON schema validation for structured outputs.
   * Only applies when the serving endpoint supports JSON schema response
   * formats (e.g. Azure). Defaults to `true`.
   */
  strictJsonSchema?: boolean;
};
```

## `DeepSeekLanguageModelOptions`

The source declaration does not provide a JSDoc description.

```text
type DeepSeekLanguageModelChatOptions = {
  /**
   * Whether to return log probabilities for generated tokens.
   */
  logprobs?: boolean;
  /**
   * Number of most likely tokens to return at each token position.
   *
   * Setting this option automatically enables `logprobs`.
   */
  topLogprobs?: number;
  /**
   * An opaque identifier for the end user. DeepSeek uses this identifier for
   * content-safety tracing and request isolation.
   *
   * Must contain only ASCII letters, numbers, underscores, and hyphens, and
   * must be at most 512 characters long.
   */
  userId?: string;
  /**
   * Controls whether thinking mode is enabled. Defaults to `enabled`.
   */
  thinking?: {
    type?: 'enabled' | 'disabled';
  };
  /**
   * Controls the thinking strength for DeepSeek V4 reasoning models.
   */
  reasoningEffort?: 'low' | 'high' | 'max';
  /**
   * Whether to use strict JSON schema validation for structured outputs.
   * Only applies when the serving endpoint supports JSON schema response
   * formats (e.g. Azure). Defaults to `true`.
   */
  strictJsonSchema?: boolean;
};
```

## `DeepSeekLanguageModelResponsesOptions`

The source declaration does not provide a JSDoc description.

```text
type DeepSeekLanguageModelResponsesOptions = {
  /**
   * Controls whether thinking mode is enabled. Thinking is enabled by default.
   */
  thinking?: {
    type?: 'enabled' | 'disabled';
  };
  /**
   * Controls the thinking strength when thinking is enabled.
   */
  reasoningEffort?: 'low' | 'high' | 'max';
  /**
   * Number of most likely tokens to return at each token position (0 to 20).
   * Log probabilities are returned in `providerMetadata.deepseek.logprobs`.
   */
  topLogprobs?: number;
  /**
   * An opaque identifier for the end user. DeepSeek uses this identifier for
   * content-safety tracing and request isolation.
   *
   * Must contain only ASCII letters, numbers, underscores, and hyphens, and
   * must be at most 512 characters long.
   */
  userId?: string;
};
```

## `DeepSeekMessageProviderOptions`

The source declaration does not provide a JSDoc description.

```text
type DeepSeekMessageProviderOptions = InferSchema<typeof deepseekMessageProviderOptions>;
```

## `DeepSeekProvider`

Provider returned by the adapter, with Effect-based model selection for DeepSeek.

```text
export type DeepSeekProvider = ReturnType<typeof wrapProvider>;
```

## `DeepSeekProviderSettings`

Keep the native DeepSeek options and allow `apiKey` to resolve through Effect when the
SDK requests the value.

```text
export type DeepSeekProviderSettings<E = never, R = never> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
```

## `VERSION`

The source declaration does not provide a JSDoc description.

```text
VERSION: string
```
