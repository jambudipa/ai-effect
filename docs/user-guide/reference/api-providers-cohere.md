---
title: cohere provider API
doc-type: reference
sources: [src/providers/cohere.ts, package.json]
---

# cohere provider API

> **TL;DR:** This entry exposes 11 public exports through `@jambudipa/ai-effect/cohere`.
> The contracts below come from the installed package declarations and JSDoc.

## Import

`@jambudipa/ai-effect/cohere` selects the package export for this provider. See the [provider source](../../../src/providers/cohere.ts).

## `cohere`

Adapt the preconfigured provider from the Cohere SDK. Use the factory to supply
explicit settings.

```text
cohere(modelId: (string & {}) | "command" | "command-a-03-2025" | "command-a-reasoning-08-2025" | "command-a-vision-07-2025" | "command-r7b-12-2024" | "command-r-plus-04-2024" | "command-r-plus" | "command-r-08-2024" | "command-r-03-2024" | "command-r" | "command-nightly" | "command-light" | "command-light-nightly"): Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

### Public properties

#### `cohere.embedding`

```text
(modelId: (string & {}) | "embed-v5.0-pro" | "embed-v5.0-fast" | "embed-v4.0" | "embed-english-v3.0" | "embed-multilingual-v3.0" | "embed-english-light-v3.0" | "embed-multilingual-light-v3.0" | "embed-english-v2.0" | "embed-english-light-v2.0" | "embed-multilingual-v2.0") => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `cohere.embeddingModel`

```text
(modelId: (string & {}) | "embed-v5.0-pro" | "embed-v5.0-fast" | "embed-v4.0" | "embed-english-v3.0" | "embed-multilingual-v3.0" | "embed-english-light-v3.0" | "embed-multilingual-light-v3.0" | "embed-english-v2.0" | "embed-english-light-v2.0" | "embed-multilingual-v2.0") => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `cohere.files`

```text
(() => Effect<{ specificationVersion: "v4"; provider: string; uploadFile: (options: FilesV4UploadFileCallOptions) => Effect<FilesV4UploadFileResult, AiSdkError, never>; getFileMetadata: ((options: FilesV4GetFileMetadataCallOptions) => Effect<FilesV4GetFileMetadataResult, AiSdkError, never>) | undefined; downloadFile: ((options: FilesV4DownloadFileCallOptions) => Effect<{ content: Stream<Uint8Array<ArrayBufferLike>, AiSdkError, never>; mediaType?: string | undefined; providerMetadata?: SharedV4ProviderMetadata | undefined; warnings: SharedV4Warning[]; }, AiSdkError, Scope>) | undefined; deleteFile: ((options: FilesV4DeleteFileCallOptions) => Effect<FilesV4DeleteFileResult, AiSdkError, never>) | undefined; }, AiSdkError, never>) | undefined
```

#### `cohere.imageModel`

```text
(modelId: string) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `cohere.languageModel`

```text
(modelId: (string & {}) | "command" | "command-a-03-2025" | "command-a-reasoning-08-2025" | "command-a-vision-07-2025" | "command-r7b-12-2024" | "command-r-plus-04-2024" | "command-r-plus" | "command-r-08-2024" | "command-r-03-2024" | "command-r" | "command-nightly" | "command-light" | "command-light-nightly") => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

#### `cohere.reranking`

```text
(modelId: (string & {}) | "rerank-v4.0-pro" | "rerank-v4.0-fast" | "rerank-v3.5" | "rerank-english-v3.0" | "rerank-multilingual-v3.0") => Effect<{ doRerank: (options: RerankingModelV4CallOptions) => Effect<RerankingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `cohere.rerankingModel`

```text
(modelId: (string & {}) | "rerank-v4.0-pro" | "rerank-v4.0-fast" | "rerank-v3.5" | "rerank-english-v3.0" | "rerank-multilingual-v3.0") => Effect<{ doRerank: (options: RerankingModelV4CallOptions) => Effect<RerankingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `cohere.skills`

```text
(() => Effect<{ specificationVersion: "v4"; provider: string; uploadSkill: (options: SkillsV4UploadSkillCallOptions) => Effect<SkillsV4UploadSkillResult, AiSdkError, never>; }, AiSdkError, never>) | undefined
```

#### `cohere.specificationVersion`

```text
"v4"
```

#### `cohere.speechModel`

```text
((modelId: string) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined
```

#### `cohere.textEmbedding`

```text
(modelId: (string & {}) | "embed-v5.0-pro" | "embed-v5.0-fast" | "embed-v4.0" | "embed-english-v3.0" | "embed-multilingual-v3.0" | "embed-english-light-v3.0" | "embed-multilingual-light-v3.0" | "embed-english-v2.0" | "embed-english-light-v2.0" | "embed-multilingual-v2.0") => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `cohere.textEmbeddingModel`

```text
(modelId: (string & {}) | "embed-v5.0-pro" | "embed-v5.0-fast" | "embed-v4.0" | "embed-english-v3.0" | "embed-multilingual-v3.0" | "embed-english-light-v3.0" | "embed-multilingual-light-v3.0" | "embed-english-v2.0" | "embed-english-light-v2.0" | "embed-multilingual-v2.0") => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `cohere.transcriptionModel`

```text
((modelId: string) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined
```


## `CohereChatModelOptions`

The source declaration does not provide a JSDoc description.

```text
type CohereLanguageModelChatOptions = InferSchema<typeof cohereLanguageModelChatOptions>;
```

## `CohereEmbeddingModelOptions`

The source declaration does not provide a JSDoc description.

```text
type CohereEmbeddingModelOptions = InferSchema<typeof cohereEmbeddingModelOptions>;
```

## `CohereLanguageModelChatOptions`

The source declaration does not provide a JSDoc description.

```text
type CohereLanguageModelChatOptions = InferSchema<typeof cohereLanguageModelChatOptions>;
```

## `CohereLanguageModelOptions`

The source declaration does not provide a JSDoc description.

```text
type CohereLanguageModelChatOptions = InferSchema<typeof cohereLanguageModelChatOptions>;
```

## `CohereProvider`

Provider returned by the adapter, with Effect-based model selection for Cohere.

```text
export type CohereProvider = ReturnType<typeof wrapProvider>;
```

## `CohereProviderSettings`

Keep the native Cohere options and allow `apiKey` to resolve through Effect when the SDK
requests the value.

```text
export type CohereProviderSettings<E = never, R = never> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
```

## `CohereRerankingModelOptions`

The source declaration does not provide a JSDoc description.

```text
type CohereRerankingModelOptions = {
  /**
   * Long documents will be automatically truncated to the specified number of tokens.
   *
   * @default 4096
   */
  maxTokensPerDoc?: number;
  /**
   * The priority of the request.
   *
   * @default 0
   */
  priority?: number;
};
```

## `CohereRerankingOptions`

The source declaration does not provide a JSDoc description.

```text
type CohereRerankingModelOptions = {
  /**
   * Long documents will be automatically truncated to the specified number of tokens.
   *
   * @default 4096
   */
  maxTokensPerDoc?: number;
  /**
   * The priority of the request.
   *
   * @default 0
   */
  priority?: number;
};
```

## `createCohere`

Construct the Cohere provider inside an Effect. Keep the scope open when using an Effect
resolver for `apiKey`.

```text
createCohere(options?: StaticProviderSettings<CohereProviderSettings, "apiKey"> | undefined): Effect<((modelId: (string & {}) | "command" | "command-a-03-2025" | "command-a-reasoning-08-2025" | "command-a-vision-07-2025" | "command-r7b-12-2024" | "command-r-plus-04-2024" | "command-r-plus" | "command-r-08-2024" | "command-r-03-2024" | "command-r" | "command-nightly" | "command-light" | "command-light-nightly") => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>) & { languageModel: (modelId: (string & {}) | "command" | "command-a-03-2025" | "command-a-reasoning-08-2025" | "command-a-vision-07-2025" | "command-r7b-12-2024" | "command-r-plus-04-2024" | "command-r-plus" | "command-r-08-2024" | "command-r-03-2024" | "command-r" | "command-nightly" | "command-light" | "command-light-nightly") => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>; embedding: (modelId: (string & {}) | "embed-v5.0-pro" | "embed-v5.0-fast" | "embed-v4.0" | "embed-english-v3.0" | "embed-multilingual-v3.0" | "embed-english-light-v3.0" | "embed-multilingual-light-v3.0" | "embed-english-v2.0" | "embed-english-light-v2.0" | "embed-multilingual-v2.0") => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; embeddingModel: (modelId: (string & {}) | "embed-v5.0-pro" | "embed-v5.0-fast" | "embed-v4.0" | "embed-english-v3.0" | "embed-multilingual-v3.0" | "embed-english-light-v3.0" | "embed-multilingual-light-v3.0" | "embed-english-v2.0" | "embed-english-light-v2.0" | "embed-multilingual-v2.0") => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; textEmbedding: (modelId: (string & {}) | "embed-v5.0-pro" | "embed-v5.0-fast" | "embed-v4.0" | "embed-english-v3.0" | "embed-multilingual-v3.0" | "embed-english-light-v3.0" | "embed-multilingual-light-v3.0" | "embed-english-v2.0" | "embed-english-light-v2.0" | "embed-multilingual-v2.0") => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; textEmbeddingModel: (modelId: (string & {}) | "embed-v5.0-pro" | "embed-v5.0-fast" | "embed-v4.0" | "embed-english-v3.0" | "embed-multilingual-v3.0" | "embed-english-light-v3.0" | "embed-multilingual-light-v3.0" | "embed-english-v2.0" | "embed-english-light-v2.0" | "embed-multilingual-v2.0") => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; reranking: (modelId: (string & {}) | "rerank-v4.0-pro" | "rerank-v4.0-fast" | "rerank-v3.5" | "rerank-english-v3.0" | "rerank-multilingual-v3.0") => Effect<{ doRerank: (options: RerankingModelV4CallOptions) => Effect<RerankingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; rerankingModel: (modelId: (string & {}) | "rerank-v4.0-pro" | "rerank-v4.0-fast" | "rerank-v3.5" | "rerank-english-v3.0" | "rerank-multilingual-v3.0") => Effect<{ doRerank: (options: RerankingModelV4CallOptions) => Effect<RerankingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; specificationVersion: "v4"; imageModel: (modelId: string) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; transcriptionModel: ((modelId: string) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; speechModel: ((modelId: string) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; files: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadFile: (options: FilesV4UploadFileCallOptions) => Effect<FilesV4UploadFileResult, AiSdkError, never>; getFileMetadata: ((options: FilesV4GetFileMetadataCallOptions) => Effect<FilesV4GetFileMetadataResult, AiSdkError, never>) | undefined; downloadFile: ((options: FilesV4DownloadFileCallOptions) => Effect<{ content: Stream<Uint8Array<ArrayBufferLike>, AiSdkError, never>; mediaType?: string | undefined; providerMetadata?: SharedV4ProviderMetadata | undefined; warnings: SharedV4Warning[]; }, AiSdkError, Scope>) | undefined; deleteFile: ((options: FilesV4DeleteFileCallOptions) => Effect<FilesV4DeleteFileResult, AiSdkError, never>) | undefined; }, AiSdkError, never>) | undefined; skills: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadSkill: (options: SkillsV4UploadSkillCallOptions) => Effect<SkillsV4UploadSkillResult, AiSdkError, never>; }, AiSdkError, never>) | undefined; }, AiSdkError, never>
createCohere<E, R>(options: EffectProviderSettings<CohereProviderSettings, "apiKey", E, R>): Effect<((modelId: (string & {}) | "command" | "command-a-03-2025" | "command-a-reasoning-08-2025" | "command-a-vision-07-2025" | "command-r7b-12-2024" | "command-r-plus-04-2024" | "command-r-plus" | "command-r-08-2024" | "command-r-03-2024" | "command-r" | "command-nightly" | "command-light" | "command-light-nightly") => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>) & { languageModel: (modelId: (string & {}) | "command" | "command-a-03-2025" | "command-a-reasoning-08-2025" | "command-a-vision-07-2025" | "command-r7b-12-2024" | "command-r-plus-04-2024" | "command-r-plus" | "command-r-08-2024" | "command-r-03-2024" | "command-r" | "command-nightly" | "command-light" | "command-light-nightly") => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>; embedding: (modelId: (string & {}) | "embed-v5.0-pro" | "embed-v5.0-fast" | "embed-v4.0" | "embed-english-v3.0" | "embed-multilingual-v3.0" | "embed-english-light-v3.0" | "embed-multilingual-light-v3.0" | "embed-english-v2.0" | "embed-english-light-v2.0" | "embed-multilingual-v2.0") => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; embeddingModel: (modelId: (string & {}) | "embed-v5.0-pro" | "embed-v5.0-fast" | "embed-v4.0" | "embed-english-v3.0" | "embed-multilingual-v3.0" | "embed-english-light-v3.0" | "embed-multilingual-light-v3.0" | "embed-english-v2.0" | "embed-english-light-v2.0" | "embed-multilingual-v2.0") => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; textEmbedding: (modelId: (string & {}) | "embed-v5.0-pro" | "embed-v5.0-fast" | "embed-v4.0" | "embed-english-v3.0" | "embed-multilingual-v3.0" | "embed-english-light-v3.0" | "embed-multilingual-light-v3.0" | "embed-english-v2.0" | "embed-english-light-v2.0" | "embed-multilingual-v2.0") => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; textEmbeddingModel: (modelId: (string & {}) | "embed-v5.0-pro" | "embed-v5.0-fast" | "embed-v4.0" | "embed-english-v3.0" | "embed-multilingual-v3.0" | "embed-english-light-v3.0" | "embed-multilingual-light-v3.0" | "embed-english-v2.0" | "embed-english-light-v2.0" | "embed-multilingual-v2.0") => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; reranking: (modelId: (string & {}) | "rerank-v4.0-pro" | "rerank-v4.0-fast" | "rerank-v3.5" | "rerank-english-v3.0" | "rerank-multilingual-v3.0") => Effect<{ doRerank: (options: RerankingModelV4CallOptions) => Effect<RerankingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; rerankingModel: (modelId: (string & {}) | "rerank-v4.0-pro" | "rerank-v4.0-fast" | "rerank-v3.5" | "rerank-english-v3.0" | "rerank-multilingual-v3.0") => Effect<{ doRerank: (options: RerankingModelV4CallOptions) => Effect<RerankingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; specificationVersion: "v4"; imageModel: (modelId: string) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; transcriptionModel: ((modelId: string) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; speechModel: ((modelId: string) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; files: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadFile: (options: FilesV4UploadFileCallOptions) => Effect<FilesV4UploadFileResult, AiSdkError, never>; getFileMetadata: ((options: FilesV4GetFileMetadataCallOptions) => Effect<FilesV4GetFileMetadataResult, AiSdkError, never>) | undefined; downloadFile: ((options: FilesV4DownloadFileCallOptions) => Effect<{ content: Stream<Uint8Array<ArrayBufferLike>, AiSdkError, never>; mediaType?: string | undefined; providerMetadata?: SharedV4ProviderMetadata | undefined; warnings: SharedV4Warning[]; }, AiSdkError, Scope>) | undefined; deleteFile: ((options: FilesV4DeleteFileCallOptions) => Effect<FilesV4DeleteFileResult, AiSdkError, never>) | undefined; }, AiSdkError, never>) | undefined; skills: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadSkill: (options: SkillsV4UploadSkillCallOptions) => Effect<SkillsV4UploadSkillResult, AiSdkError, never>; }, AiSdkError, never>) | undefined; }, AiSdkError, Scope | R>
```

## `VERSION`

The source declaration does not provide a JSDoc description.

```text
VERSION: string
```
