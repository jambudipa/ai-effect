---
title: alibaba provider API
doc-type: reference
sources: [src/providers/alibaba.ts, package.json]
---

# alibaba provider API

> **TL;DR:** This entry exposes 16 public exports through `@jambudipa/ai-effect/alibaba`.
> The contracts below come from the installed package declarations and JSDoc.

## Import

`@jambudipa/ai-effect/alibaba` selects the package export for this provider. See the [provider source](../../../src/providers/alibaba.ts).

## `alibaba`

Adapt the preconfigured provider from the Alibaba SDK. Use the factory to supply
explicit settings.

```text
alibaba(modelId: AlibabaChatModelId): Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

### Public properties

#### `alibaba.chatModel`

```text
(modelId: AlibabaChatModelId) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

#### `alibaba.embedding`

```text
(modelId: AlibabaEmbeddingModelId) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `alibaba.embeddingModel`

```text
(modelId: AlibabaEmbeddingModelId) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `alibaba.files`

```text
(() => Effect<{ specificationVersion: "v4"; provider: string; uploadFile: (options: FilesV4UploadFileCallOptions) => Effect<FilesV4UploadFileResult, AiSdkError, never>; getFileMetadata: ((options: FilesV4GetFileMetadataCallOptions) => Effect<FilesV4GetFileMetadataResult, AiSdkError, never>) | undefined; downloadFile: ((options: FilesV4DownloadFileCallOptions) => Effect<{ content: Stream<Uint8Array<ArrayBufferLike>, AiSdkError, never>; mediaType?: string | undefined; providerMetadata?: SharedV4ProviderMetadata | undefined; warnings: SharedV4Warning[]; }, AiSdkError, Scope>) | undefined; deleteFile: ((options: FilesV4DeleteFileCallOptions) => Effect<FilesV4DeleteFileResult, AiSdkError, never>) | undefined; }, AiSdkError, never>) | undefined
```

#### `alibaba.imageModel`

```text
(modelId: string) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `alibaba.languageModel`

```text
(modelId: AlibabaChatModelId) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

#### `alibaba.rerankingModel`

```text
((modelId: string) => Effect<{ doRerank: (options: RerankingModelV4CallOptions) => Effect<RerankingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined
```

#### `alibaba.skills`

```text
(() => Effect<{ specificationVersion: "v4"; provider: string; uploadSkill: (options: SkillsV4UploadSkillCallOptions) => Effect<SkillsV4UploadSkillResult, AiSdkError, never>; }, AiSdkError, never>) | undefined
```

#### `alibaba.specificationVersion`

```text
"v4"
```

#### `alibaba.speechModel`

```text
((modelId: string) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined
```

#### `alibaba.transcriptionModel`

```text
((modelId: string) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined
```

#### `alibaba.video`

```text
(modelId: AlibabaVideoModelId) => Effect<{ maxVideosPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; doGenerate: ((options: VideoModelV4CallOptions) => Effect<VideoModelV4Result, AiSdkError, never>) | undefined; doStart: ((options: VideoModelV4CallOptions & { webhookUrl?: string | undefined; }) => Effect<VideoModelV4OperationStartResult, AiSdkError, never>) | undefined; doStatus: ((options: { operation: JSONValue; abortSignal?: AbortSignal | undefined; headers?: Record<string, string | undefined> | undefined; }) => Effect<VideoModelV4OperationStatusResult, AiSdkError, never>) | undefined; handleWebhookOption: (<E, R, E2, R2>(options: { readonly webhook: () => Effect<{ readonly url: string; readonly received: Effect<VideoModelV4OperationWebhook<JSONValue>, E2, R2>; }, E, R>; }) => Effect<{ webhookUrl: string; received: Effect<VideoModelV4OperationWebhook<JSONValue>, AiSdkError, never>; }, AiSdkError, Scope | R | R2>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `alibaba.videoModel`

```text
(modelId: AlibabaVideoModelId) => Effect<{ maxVideosPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; doGenerate: ((options: VideoModelV4CallOptions) => Effect<VideoModelV4Result, AiSdkError, never>) | undefined; doStart: ((options: VideoModelV4CallOptions & { webhookUrl?: string | undefined; }) => Effect<VideoModelV4OperationStartResult, AiSdkError, never>) | undefined; doStatus: ((options: { operation: JSONValue; abortSignal?: AbortSignal | undefined; headers?: Record<string, string | undefined> | undefined; }) => Effect<VideoModelV4OperationStatusResult, AiSdkError, never>) | undefined; handleWebhookOption: (<E, R, E2, R2>(options: { readonly webhook: () => Effect<{ readonly url: string; readonly received: Effect<VideoModelV4OperationWebhook<JSONValue>, E2, R2>; }, E, R>; }) => Effect<{ webhookUrl: string; received: Effect<VideoModelV4OperationWebhook<JSONValue>, AiSdkError, never>; }, AiSdkError, Scope | R | R2>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```


## `AlibabaCacheControl`

The source declaration does not provide a JSDoc description.

```text
type AlibabaCacheControl = {
  type: string;
};
```

## `AlibabaChatModelId`

The source declaration does not provide a JSDoc description.

```text
type AlibabaChatModelId = AlibabaModelIds['language'] | (string & {});
```

## `AlibabaEmbeddingModelId`

The source declaration does not provide a JSDoc description.

```text
type AlibabaEmbeddingModelId = AlibabaModelIds['embedding'] | (string & {});
```

## `AlibabaEmbeddingModelOptions`

The source declaration does not provide a JSDoc description.

```text
type AlibabaEmbeddingModelOptions = InferSchema<typeof alibabaEmbeddingModelOptions>;
```

## `AlibabaLanguageModelChatOptions`

The source declaration does not provide a JSDoc description.

```text
type AlibabaLanguageModelChatOptions = InferSchema<typeof alibabaLanguageModelChatOptions>;
```

## `AlibabaLanguageModelOptions`

The source declaration does not provide a JSDoc description.

```text
type AlibabaLanguageModelChatOptions = InferSchema<typeof alibabaLanguageModelChatOptions>;
```

## `AlibabaProvider`

Provider returned by the adapter, with Effect-based model selection for Alibaba.

```text
export type AlibabaProvider = ReturnType<typeof wrapProvider>;
```

## `AlibabaProviderOptions`

The source declaration does not provide a JSDoc description.

```text
type AlibabaLanguageModelChatOptions = InferSchema<typeof alibabaLanguageModelChatOptions>;
```

## `AlibabaProviderSettings`

Keep the native Alibaba options and allow `apiKey` to resolve through Effect when the
SDK requests the value.

```text
export type AlibabaProviderSettings<E = never, R = never> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
```

## `AlibabaUsage`

Usage as reported by Alibaba's OpenAI-compatible chat completions API.

The fields below are the ones this provider maps onto the standard usage
shape. Alibaba returns more than this, and `alibabaUsageSchema` parses
loosely so that anything undeclared survives into `raw` rather than being
dropped. Declared fields are therefore a subset of what a caller may find
there.

```text
type AlibabaUsage = {
  prompt_tokens?: number | null;
  completion_tokens?: number | null;
  total_tokens?: number | null;
  prompt_tokens_details?: {
    cached_tokens?: number | null;
    cache_creation_input_tokens?: number | null;
    /**
     * Which caching mode served the request. Alibaba populates this only under
     * explicit context caching, which sending `cache_control` selects; under
     * implicit caching the field is absent. The two modes are mutually
     * exclusive and priced differently, so this is the discriminator for
     * attributing cache reads to a rate.
     */
    cache_type?: string | null;
  } | null;
  completion_tokens_details?: {
    reasoning_tokens?: number | null;
  } | null;
};
```

## `AlibabaVideoModelId`

The source declaration does not provide a JSDoc description.

```text
type AlibabaVideoModelId = AlibabaModelIds['video'] | (string & {});
```

## `AlibabaVideoModelOptions`

The source declaration does not provide a JSDoc description.

```text
type AlibabaVideoModelOptions = {
  /** Negative prompt to specify what to avoid (max 500 chars). */
  negativePrompt?: string | null;
  /** URL to audio file for audio-video sync (WAV/MP3, 3-30s, max 15MB). */
  audioUrl?: string | null;
  /** Enable prompt extension/rewriting for better generation. Defaults to true. */
  promptExtend?: boolean | null;
  /**
   * Shot type: 'single' for single-shot or 'multi' for multi-shot narrative
   * (wan2.6 and earlier; wan2.7 models describe shot structure in the prompt).
   */
  shotType?: 'single' | 'multi' | null;
  /** Whether to add watermark to generated video. Defaults to false. */
  watermark?: boolean | null;
  /**
   * Enable audio generation (wan2.6 I2V/R2V and wan3 models;
   * wan2.7 models always generate audio). Defaults to true on wan3.
   */
  audio?: boolean | null;
  /**
   * Reference URLs for reference-to-video mode (wan2.6 models).
   * Array of URLs to images (0-5) and/or videos (0-3), max 5 total.
   * Use character identifiers (character1, character2) in prompts to reference them.
   */
  referenceUrls?: string[] | null;
  /**
   * Explicit media array (wan2.7 and wan3 models). Overrides the automatic
   * mapping from `inputReferences` and `frameImages`.
   * Use `Image 1`, `Video 1`, etc. in prompts to reference media items
   * (images, videos, and audio are counted separately, in array order).
   *
   * `reference_audio`, `file`, and `link` are wan3-only and have no top-level
   * call option, so they can only be passed here. wan3 also rejects mixing
   * `reference_*`/`file`/`link` with `first_frame`/`last_frame`.
   */
  media?: Array<{
    type: 'reference_image' | 'reference_video' | 'reference_audio' | 'first_frame' | 'last_frame' | 'file' | 'link';
    /** Public URL, or a `data:{mime};base64,{data}` URI for images. */
    url: string;
    /** URL to an audio file used as voice reference for this media item. */
    referenceVoice?: string | null;
  }> | null;
  /**
   * Aspect ratio (wan2.7 text-to-video and reference-to-video models, and
   * every wan3 generation). `adaptive` is wan3-only, and is its default.
   */
  ratio?: 'adaptive' | '16:9' | '9:16' | '1:1' | '4:3' | '3:4' | null;
  /** Polling interval in milliseconds. Defaults to 5000 (5 seconds). */
  pollIntervalMs?: number | null;
  /** Maximum wait time in milliseconds for video generation. Defaults to 600000 (10 minutes). */
  pollTimeoutMs?: number | null;
  [key: string]: unknown;
};
```

## `AlibabaVideoProviderOptions`

The source declaration does not provide a JSDoc description.

```text
type AlibabaVideoModelOptions = {
  /** Negative prompt to specify what to avoid (max 500 chars). */
  negativePrompt?: string | null;
  /** URL to audio file for audio-video sync (WAV/MP3, 3-30s, max 15MB). */
  audioUrl?: string | null;
  /** Enable prompt extension/rewriting for better generation. Defaults to true. */
  promptExtend?: boolean | null;
  /**
   * Shot type: 'single' for single-shot or 'multi' for multi-shot narrative
   * (wan2.6 and earlier; wan2.7 models describe shot structure in the prompt).
   */
  shotType?: 'single' | 'multi' | null;
  /** Whether to add watermark to generated video. Defaults to false. */
  watermark?: boolean | null;
  /**
   * Enable audio generation (wan2.6 I2V/R2V and wan3 models;
   * wan2.7 models always generate audio). Defaults to true on wan3.
   */
  audio?: boolean | null;
  /**
   * Reference URLs for reference-to-video mode (wan2.6 models).
   * Array of URLs to images (0-5) and/or videos (0-3), max 5 total.
   * Use character identifiers (character1, character2) in prompts to reference them.
   */
  referenceUrls?: string[] | null;
  /**
   * Explicit media array (wan2.7 and wan3 models). Overrides the automatic
   * mapping from `inputReferences` and `frameImages`.
   * Use `Image 1`, `Video 1`, etc. in prompts to reference media items
   * (images, videos, and audio are counted separately, in array order).
   *
   * `reference_audio`, `file`, and `link` are wan3-only and have no top-level
   * call option, so they can only be passed here. wan3 also rejects mixing
   * `reference_*`/`file`/`link` with `first_frame`/`last_frame`.
   */
  media?: Array<{
    type: 'reference_image' | 'reference_video' | 'reference_audio' | 'first_frame' | 'last_frame' | 'file' | 'link';
    /** Public URL, or a `data:{mime};base64,{data}` URI for images. */
    url: string;
    /** URL to an audio file used as voice reference for this media item. */
    referenceVoice?: string | null;
  }> | null;
  /**
   * Aspect ratio (wan2.7 text-to-video and reference-to-video models, and
   * every wan3 generation). `adaptive` is wan3-only, and is its default.
   */
  ratio?: 'adaptive' | '16:9' | '9:16' | '1:1' | '4:3' | '3:4' | null;
  /** Polling interval in milliseconds. Defaults to 5000 (5 seconds). */
  pollIntervalMs?: number | null;
  /** Maximum wait time in milliseconds for video generation. Defaults to 600000 (10 minutes). */
  pollTimeoutMs?: number | null;
  [key: string]: unknown;
};
```

## `createAlibaba`

Construct the Alibaba provider inside an Effect. Keep the scope open when using an Effect
resolver for `apiKey`.

```text
createAlibaba(options?: StaticProviderSettings<AlibabaProviderSettings, "apiKey"> | undefined): Effect<((modelId: AlibabaChatModelId) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>) & { languageModel: (modelId: AlibabaChatModelId) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>; chatModel: (modelId: AlibabaChatModelId) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>; embedding: (modelId: AlibabaEmbeddingModelId) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; embeddingModel: (modelId: AlibabaEmbeddingModelId) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; video: (modelId: AlibabaVideoModelId) => Effect<{ maxVideosPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; doGenerate: ((options: VideoModelV4CallOptions) => Effect<VideoModelV4Result, AiSdkError, never>) | undefined; doStart: ((options: VideoModelV4CallOptions & { webhookUrl?: string | undefined; }) => Effect<VideoModelV4OperationStartResult, AiSdkError, never>) | undefined; doStatus: ((options: { operation: JSONValue; abortSignal?: AbortSignal | undefined; headers?: Record<string, string | undefined> | undefined; }) => Effect<VideoModelV4OperationStatusResult, AiSdkError, never>) | undefined; handleWebhookOption: (<E, R, E2, R2>(options: { readonly webhook: () => Effect<{ readonly url: string; readonly received: Effect<VideoModelV4OperationWebhook<JSONValue>, E2, R2>; }, E, R>; }) => Effect<{ webhookUrl: string; received: Effect<VideoModelV4OperationWebhook<JSONValue>, AiSdkError, never>; }, AiSdkError, Scope | R | R2>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; videoModel: (modelId: AlibabaVideoModelId) => Effect<{ maxVideosPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; doGenerate: ((options: VideoModelV4CallOptions) => Effect<VideoModelV4Result, AiSdkError, never>) | undefined; doStart: ((options: VideoModelV4CallOptions & { webhookUrl?: string | undefined; }) => Effect<VideoModelV4OperationStartResult, AiSdkError, never>) | undefined; doStatus: ((options: { operation: JSONValue; abortSignal?: AbortSignal | undefined; headers?: Record<string, string | undefined> | undefined; }) => Effect<VideoModelV4OperationStatusResult, AiSdkError, never>) | undefined; handleWebhookOption: (<E, R, E2, R2>(options: { readonly webhook: () => Effect<{ readonly url: string; readonly received: Effect<VideoModelV4OperationWebhook<JSONValue>, E2, R2>; }, E, R>; }) => Effect<{ webhookUrl: string; received: Effect<VideoModelV4OperationWebhook<JSONValue>, AiSdkError, never>; }, AiSdkError, Scope | R | R2>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; specificationVersion: "v4"; imageModel: (modelId: string) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; transcriptionModel: ((modelId: string) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; speechModel: ((modelId: string) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; rerankingModel: ((modelId: string) => Effect<{ doRerank: (options: RerankingModelV4CallOptions) => Effect<RerankingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; files: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadFile: (options: FilesV4UploadFileCallOptions) => Effect<FilesV4UploadFileResult, AiSdkError, never>; getFileMetadata: ((options: FilesV4GetFileMetadataCallOptions) => Effect<FilesV4GetFileMetadataResult, AiSdkError, never>) | undefined; downloadFile: ((options: FilesV4DownloadFileCallOptions) => Effect<{ content: Stream<Uint8Array<ArrayBufferLike>, AiSdkError, never>; mediaType?: string | undefined; providerMetadata?: SharedV4ProviderMetadata | undefined; warnings: SharedV4Warning[]; }, AiSdkError, Scope>) | undefined; deleteFile: ((options: FilesV4DeleteFileCallOptions) => Effect<FilesV4DeleteFileResult, AiSdkError, never>) | undefined; }, AiSdkError, never>) | undefined; skills: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadSkill: (options: SkillsV4UploadSkillCallOptions) => Effect<SkillsV4UploadSkillResult, AiSdkError, never>; }, AiSdkError, never>) | undefined; }, AiSdkError, never>
createAlibaba<E, R>(options: EffectProviderSettings<AlibabaProviderSettings, "apiKey", E, R>): Effect<((modelId: AlibabaChatModelId) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>) & { languageModel: (modelId: AlibabaChatModelId) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>; chatModel: (modelId: AlibabaChatModelId) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>; embedding: (modelId: AlibabaEmbeddingModelId) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; embeddingModel: (modelId: AlibabaEmbeddingModelId) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; video: (modelId: AlibabaVideoModelId) => Effect<{ maxVideosPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; doGenerate: ((options: VideoModelV4CallOptions) => Effect<VideoModelV4Result, AiSdkError, never>) | undefined; doStart: ((options: VideoModelV4CallOptions & { webhookUrl?: string | undefined; }) => Effect<VideoModelV4OperationStartResult, AiSdkError, never>) | undefined; doStatus: ((options: { operation: JSONValue; abortSignal?: AbortSignal | undefined; headers?: Record<string, string | undefined> | undefined; }) => Effect<VideoModelV4OperationStatusResult, AiSdkError, never>) | undefined; handleWebhookOption: (<E, R, E2, R2>(options: { readonly webhook: () => Effect<{ readonly url: string; readonly received: Effect<VideoModelV4OperationWebhook<JSONValue>, E2, R2>; }, E, R>; }) => Effect<{ webhookUrl: string; received: Effect<VideoModelV4OperationWebhook<JSONValue>, AiSdkError, never>; }, AiSdkError, Scope | R | R2>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; videoModel: (modelId: AlibabaVideoModelId) => Effect<{ maxVideosPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; doGenerate: ((options: VideoModelV4CallOptions) => Effect<VideoModelV4Result, AiSdkError, never>) | undefined; doStart: ((options: VideoModelV4CallOptions & { webhookUrl?: string | undefined; }) => Effect<VideoModelV4OperationStartResult, AiSdkError, never>) | undefined; doStatus: ((options: { operation: JSONValue; abortSignal?: AbortSignal | undefined; headers?: Record<string, string | undefined> | undefined; }) => Effect<VideoModelV4OperationStatusResult, AiSdkError, never>) | undefined; handleWebhookOption: (<E, R, E2, R2>(options: { readonly webhook: () => Effect<{ readonly url: string; readonly received: Effect<VideoModelV4OperationWebhook<JSONValue>, E2, R2>; }, E, R>; }) => Effect<{ webhookUrl: string; received: Effect<VideoModelV4OperationWebhook<JSONValue>, AiSdkError, never>; }, AiSdkError, Scope | R | R2>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; specificationVersion: "v4"; imageModel: (modelId: string) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; transcriptionModel: ((modelId: string) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; speechModel: ((modelId: string) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; rerankingModel: ((modelId: string) => Effect<{ doRerank: (options: RerankingModelV4CallOptions) => Effect<RerankingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; files: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadFile: (options: FilesV4UploadFileCallOptions) => Effect<FilesV4UploadFileResult, AiSdkError, never>; getFileMetadata: ((options: FilesV4GetFileMetadataCallOptions) => Effect<FilesV4GetFileMetadataResult, AiSdkError, never>) | undefined; downloadFile: ((options: FilesV4DownloadFileCallOptions) => Effect<{ content: Stream<Uint8Array<ArrayBufferLike>, AiSdkError, never>; mediaType?: string | undefined; providerMetadata?: SharedV4ProviderMetadata | undefined; warnings: SharedV4Warning[]; }, AiSdkError, Scope>) | undefined; deleteFile: ((options: FilesV4DeleteFileCallOptions) => Effect<FilesV4DeleteFileResult, AiSdkError, never>) | undefined; }, AiSdkError, never>) | undefined; skills: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadSkill: (options: SkillsV4UploadSkillCallOptions) => Effect<SkillsV4UploadSkillResult, AiSdkError, never>; }, AiSdkError, never>) | undefined; }, AiSdkError, Scope | R>
```

## `VERSION`

The source declaration does not provide a JSDoc description.

```text
VERSION: string
```
