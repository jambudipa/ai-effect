---
title: hume provider API
doc-type: reference
sources: [src/providers/hume.ts, package.json]
---

# hume provider API

> **TL;DR:** This entry exposes 6 public exports through `@jambudipa/ai-effect/hume`.
> The contracts below come from the installed package declarations and JSDoc.

## Import

`@jambudipa/ai-effect/hume` selects the package export for this provider. See the [provider source](../../../src/providers/hume.ts).

## `createHume`

Construct the Hume provider inside an Effect. Keep the scope open when using an Effect
resolver for `apiKey`.

```text
createHume(options?: StaticProviderSettings<HumeProviderSettings, "apiKey"> | undefined): Effect<((settings?: {} | undefined) => Effect<{ speech: { doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }; }, AiSdkError, never>) & { speech: () => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; specificationVersion: "v4"; languageModel: (modelId: string) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>; embeddingModel: (modelId: string) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; imageModel: (modelId: string) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; transcriptionModel: ((modelId: string) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; speechModel: ((modelId: string) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; rerankingModel: ((modelId: string) => Effect<{ doRerank: (options: RerankingModelV4CallOptions) => Effect<RerankingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; files: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadFile: (options: FilesV4UploadFileCallOptions) => Effect<FilesV4UploadFileResult, AiSdkError, never>; getFileMetadata: ((options: FilesV4GetFileMetadataCallOptions) => Effect<FilesV4GetFileMetadataResult, AiSdkError, never>) | undefined; downloadFile: ((options: FilesV4DownloadFileCallOptions) => Effect<{ content: Stream<Uint8Array<ArrayBufferLike>, AiSdkError, never>; mediaType?: string | undefined; providerMetadata?: SharedV4ProviderMetadata | undefined; warnings: SharedV4Warning[]; }, AiSdkError, Scope>) | undefined; deleteFile: ((options: FilesV4DeleteFileCallOptions) => Effect<FilesV4DeleteFileResult, AiSdkError, never>) | undefined; }, AiSdkError, never>) | undefined; skills: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadSkill: (options: SkillsV4UploadSkillCallOptions) => Effect<SkillsV4UploadSkillResult, AiSdkError, never>; }, AiSdkError, never>) | undefined; }, AiSdkError, never>
createHume<E, R>(options: EffectProviderSettings<HumeProviderSettings, "apiKey", E, R>): Effect<((settings?: {} | undefined) => Effect<{ speech: { doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }; }, AiSdkError, never>) & { speech: () => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; specificationVersion: "v4"; languageModel: (modelId: string) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>; embeddingModel: (modelId: string) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; imageModel: (modelId: string) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; transcriptionModel: ((modelId: string) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; speechModel: ((modelId: string) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; rerankingModel: ((modelId: string) => Effect<{ doRerank: (options: RerankingModelV4CallOptions) => Effect<RerankingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; files: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadFile: (options: FilesV4UploadFileCallOptions) => Effect<FilesV4UploadFileResult, AiSdkError, never>; getFileMetadata: ((options: FilesV4GetFileMetadataCallOptions) => Effect<FilesV4GetFileMetadataResult, AiSdkError, never>) | undefined; downloadFile: ((options: FilesV4DownloadFileCallOptions) => Effect<{ content: Stream<Uint8Array<ArrayBufferLike>, AiSdkError, never>; mediaType?: string | undefined; providerMetadata?: SharedV4ProviderMetadata | undefined; warnings: SharedV4Warning[]; }, AiSdkError, Scope>) | undefined; deleteFile: ((options: FilesV4DeleteFileCallOptions) => Effect<FilesV4DeleteFileResult, AiSdkError, never>) | undefined; }, AiSdkError, never>) | undefined; skills: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadSkill: (options: SkillsV4UploadSkillCallOptions) => Effect<SkillsV4UploadSkillResult, AiSdkError, never>; }, AiSdkError, never>) | undefined; }, AiSdkError, Scope | R>
```

## `hume`

Adapt the preconfigured provider from the Hume SDK. Use the factory to supply explicit
settings.

```text
hume(settings?: {} | undefined): Effect<{ speech: { doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }; }, AiSdkError, never>
```

### Public properties

#### `hume.embeddingModel`

```text
(modelId: string) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `hume.files`

```text
(() => Effect<{ specificationVersion: "v4"; provider: string; uploadFile: (options: FilesV4UploadFileCallOptions) => Effect<FilesV4UploadFileResult, AiSdkError, never>; getFileMetadata: ((options: FilesV4GetFileMetadataCallOptions) => Effect<FilesV4GetFileMetadataResult, AiSdkError, never>) | undefined; downloadFile: ((options: FilesV4DownloadFileCallOptions) => Effect<{ content: Stream<Uint8Array<ArrayBufferLike>, AiSdkError, never>; mediaType?: string | undefined; providerMetadata?: SharedV4ProviderMetadata | undefined; warnings: SharedV4Warning[]; }, AiSdkError, Scope>) | undefined; deleteFile: ((options: FilesV4DeleteFileCallOptions) => Effect<FilesV4DeleteFileResult, AiSdkError, never>) | undefined; }, AiSdkError, never>) | undefined
```

#### `hume.imageModel`

```text
(modelId: string) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `hume.languageModel`

```text
(modelId: string) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

#### `hume.rerankingModel`

```text
((modelId: string) => Effect<{ doRerank: (options: RerankingModelV4CallOptions) => Effect<RerankingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined
```

#### `hume.skills`

```text
(() => Effect<{ specificationVersion: "v4"; provider: string; uploadSkill: (options: SkillsV4UploadSkillCallOptions) => Effect<SkillsV4UploadSkillResult, AiSdkError, never>; }, AiSdkError, never>) | undefined
```

#### `hume.specificationVersion`

```text
"v4"
```

#### `hume.speech`

```text
() => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `hume.speechModel`

```text
((modelId: string) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined
```

#### `hume.transcriptionModel`

```text
((modelId: string) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined
```


## `HumeProvider`

Provider returned by the adapter, with Effect-based model selection for Hume.

```text
export type HumeProvider = ReturnType<typeof wrapProvider>;
```

## `HumeProviderSettings`

Keep the native Hume options and allow `apiKey` to resolve through Effect when the SDK
requests the value.

```text
export type HumeProviderSettings<E = never, R = never> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
```

## `HumeSpeechModelOptions`

The source declaration does not provide a JSDoc description.

```text
type HumeSpeechModelOptions = InferSchema<typeof humeSpeechModelOptionsSchema>;
```

## `VERSION`

The source declaration does not provide a JSDoc description.

```text
VERSION: string
```
