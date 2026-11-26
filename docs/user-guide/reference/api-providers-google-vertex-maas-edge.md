---
title: google-vertex-maas-edge provider API
doc-type: reference
sources: [src/providers/google-vertex/maas/edge.ts, package.json]
---

# google-vertex-maas-edge provider API

> **TL;DR:** This entry exposes 7 public exports through `@jambudipa/ai-effect/google-vertex/maas/edge`.
> The contracts below come from the installed package declarations and JSDoc.

## Import

`@jambudipa/ai-effect/google-vertex/maas/edge` selects the package export for this provider. See the [provider source](../../../src/providers/google-vertex/maas/edge.ts).

## `createGoogleVertexMaas`

Construct the Vertex AI MaaS provider inside an Effect. Keep the scope open when using an
Effect resolver for `headers`.

```text
createGoogleVertexMaas(options?: StaticProviderSettings<GoogleVertexMaasProviderSettings, "headers"> | undefined): Effect<GoogleVertexMaasProvider, AiSdkError, never>
createGoogleVertexMaas<E, R>(options: EffectProviderSettings<GoogleVertexMaasProviderSettings, "headers", E, R>): Effect<GoogleVertexMaasProvider, AiSdkError, Scope | R>
```

## `createVertexMaas`

Expose the same Vertex AI MaaS factory as `createGoogleVertexMaas` under the SDK alias.

```text
createVertexMaas(options?: StaticProviderSettings<GoogleVertexMaasProviderSettings, "headers"> | undefined): Effect<GoogleVertexMaasProvider, AiSdkError, never>
createVertexMaas<E, R>(options: EffectProviderSettings<GoogleVertexMaasProviderSettings, "headers", E, R>): Effect<GoogleVertexMaasProvider, AiSdkError, Scope | R>
```

## `googleVertexMaas`

Adapt the preconfigured provider from the edge Vertex AI MaaS SDK. Use the factory to
supply explicit settings.

```text
googleVertexMaas(modelId: GoogleVertexMaasModelId): Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

### Public properties

#### `googleVertexMaas.chatModel`

```text
(modelId: GoogleVertexMaasModelId) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

#### `googleVertexMaas.completionModel`

```text
(modelId: string) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

#### `googleVertexMaas.embeddingModel`

```text
(modelId: string) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `googleVertexMaas.files`

```text
(() => Effect<{ specificationVersion: "v4"; provider: string; uploadFile: (options: FilesV4UploadFileCallOptions) => Effect<FilesV4UploadFileResult, AiSdkError, never>; getFileMetadata: ((options: FilesV4GetFileMetadataCallOptions) => Effect<FilesV4GetFileMetadataResult, AiSdkError, never>) | undefined; downloadFile: ((options: FilesV4DownloadFileCallOptions) => Effect<{ content: Stream<Uint8Array<ArrayBufferLike>, AiSdkError, never>; mediaType?: string | undefined; providerMetadata?: SharedV4ProviderMetadata | undefined; warnings: SharedV4Warning[]; }, AiSdkError, Scope>) | undefined; deleteFile: ((options: FilesV4DeleteFileCallOptions) => Effect<FilesV4DeleteFileResult, AiSdkError, never>) | undefined; }, AiSdkError, never>) | undefined
```

#### `googleVertexMaas.imageModel`

```text
(modelId: string) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `googleVertexMaas.languageModel`

```text
SelectCompatibleLanguageModel<GoogleVertexMaasModelId>
```

#### `googleVertexMaas.rerankingModel`

```text
((modelId: string) => Effect<{ doRerank: (options: RerankingModelV4CallOptions) => Effect<RerankingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined
```

#### `googleVertexMaas.skills`

```text
(() => Effect<{ specificationVersion: "v4"; provider: string; uploadSkill: (options: SkillsV4UploadSkillCallOptions) => Effect<SkillsV4UploadSkillResult, AiSdkError, never>; }, AiSdkError, never>) | undefined
```

#### `googleVertexMaas.specificationVersion`

```text
"v4"
```

#### `googleVertexMaas.speechModel`

```text
((modelId: string) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined
```

#### `googleVertexMaas.textEmbeddingModel`

```text
(modelId: string) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `googleVertexMaas.transcriptionModel`

```text
((modelId: string) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined
```


## `GoogleVertexMaasModelId`

The source declaration does not provide a JSDoc description.

```text
type GoogleVertexMaasModelId = GoogleVertexModelIds['maas'] | (string & {});
```

## `GoogleVertexMaasProvider`

OpenAI-compatible model selectors for the edge Vertex MaaS SDK, with native model IDs
preserved.

```text
export type GoogleVertexMaasProvider = OpenAICompatibleProvider<GoogleVertexMaasModelId>;
```

## `GoogleVertexMaasProviderSettings`

Keep the native Vertex AI MaaS options and allow `headers` to resolve through Effect
when the SDK requests the value.

```text
export type GoogleVertexMaasProviderSettings<E = never, R = never> = EffectProviderSettings<SdkSettings, 'headers', E, R>;
```

## `vertexMaas`

Expose the same Vertex AI MaaS provider as `googleVertexMaas` under the SDK alias.

```text
vertexMaas(modelId: GoogleVertexMaasModelId): Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```


### Public properties

#### `vertexMaas.chatModel`

```text
(modelId: GoogleVertexMaasModelId) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

#### `vertexMaas.completionModel`

```text
(modelId: string) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

#### `vertexMaas.embeddingModel`

```text
(modelId: string) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `vertexMaas.files`

```text
(() => Effect<{ specificationVersion: "v4"; provider: string; uploadFile: (options: FilesV4UploadFileCallOptions) => Effect<FilesV4UploadFileResult, AiSdkError, never>; getFileMetadata: ((options: FilesV4GetFileMetadataCallOptions) => Effect<FilesV4GetFileMetadataResult, AiSdkError, never>) | undefined; downloadFile: ((options: FilesV4DownloadFileCallOptions) => Effect<{ content: Stream<Uint8Array<ArrayBufferLike>, AiSdkError, never>; mediaType?: string | undefined; providerMetadata?: SharedV4ProviderMetadata | undefined; warnings: SharedV4Warning[]; }, AiSdkError, Scope>) | undefined; deleteFile: ((options: FilesV4DeleteFileCallOptions) => Effect<FilesV4DeleteFileResult, AiSdkError, never>) | undefined; }, AiSdkError, never>) | undefined
```

#### `vertexMaas.imageModel`

```text
(modelId: string) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `vertexMaas.languageModel`

```text
SelectCompatibleLanguageModel<GoogleVertexMaasModelId>
```

#### `vertexMaas.rerankingModel`

```text
((modelId: string) => Effect<{ doRerank: (options: RerankingModelV4CallOptions) => Effect<RerankingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined
```

#### `vertexMaas.skills`

```text
(() => Effect<{ specificationVersion: "v4"; provider: string; uploadSkill: (options: SkillsV4UploadSkillCallOptions) => Effect<SkillsV4UploadSkillResult, AiSdkError, never>; }, AiSdkError, never>) | undefined
```

#### `vertexMaas.specificationVersion`

```text
"v4"
```

#### `vertexMaas.speechModel`

```text
((modelId: string) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined
```

#### `vertexMaas.textEmbeddingModel`

```text
(modelId: string) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `vertexMaas.transcriptionModel`

```text
((modelId: string) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined
```
