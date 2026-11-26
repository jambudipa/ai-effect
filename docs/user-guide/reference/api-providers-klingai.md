---
title: klingai provider API
doc-type: reference
sources: [src/providers/klingai.ts, package.json]
---

# klingai provider API

> **TL;DR:** This entry exposes 8 public exports through `@jambudipa/ai-effect/klingai`.
> The contracts below come from the installed package declarations and JSDoc.

## Import

`@jambudipa/ai-effect/klingai` selects the package export for this provider. See the [provider source](../../../src/providers/klingai.ts).

## `createKlingAI`

Construct the Kling AI provider inside an Effect. Keep the scope open when using an Effect
resolver for `apiKey`.

```text
createKlingAI(options?: StaticProviderSettings<KlingAIProviderSettings, "apiKey"> | undefined): Effect<{ video: (modelId: KlingAIVideoModelId) => Effect<{ maxVideosPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; doGenerate: ((options: VideoModelV4CallOptions) => Effect<VideoModelV4Result, AiSdkError, never>) | undefined; doStart: ((options: VideoModelV4CallOptions & { webhookUrl?: string | undefined; }) => Effect<VideoModelV4OperationStartResult, AiSdkError, never>) | undefined; doStatus: ((options: { operation: JSONValue; abortSignal?: AbortSignal | undefined; headers?: Record<string, string | undefined> | undefined; }) => Effect<VideoModelV4OperationStatusResult, AiSdkError, never>) | undefined; handleWebhookOption: (<E, R, E2, R2>(options: { readonly webhook: () => Effect<{ readonly url: string; readonly received: Effect<VideoModelV4OperationWebhook<JSONValue>, E2, R2>; }, E, R>; }) => Effect<{ webhookUrl: string; received: Effect<VideoModelV4OperationWebhook<JSONValue>, AiSdkError, never>; }, AiSdkError, Scope | R | R2>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; videoModel: (modelId: KlingAIVideoModelId) => Effect<{ maxVideosPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; doGenerate: ((options: VideoModelV4CallOptions) => Effect<VideoModelV4Result, AiSdkError, never>) | undefined; doStart: ((options: VideoModelV4CallOptions & { webhookUrl?: string | undefined; }) => Effect<VideoModelV4OperationStartResult, AiSdkError, never>) | undefined; doStatus: ((options: { operation: JSONValue; abortSignal?: AbortSignal | undefined; headers?: Record<string, string | undefined> | undefined; }) => Effect<VideoModelV4OperationStatusResult, AiSdkError, never>) | undefined; handleWebhookOption: (<E, R, E2, R2>(options: { readonly webhook: () => Effect<{ readonly url: string; readonly received: Effect<VideoModelV4OperationWebhook<JSONValue>, E2, R2>; }, E, R>; }) => Effect<{ webhookUrl: string; received: Effect<VideoModelV4OperationWebhook<JSONValue>, AiSdkError, never>; }, AiSdkError, Scope | R | R2>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; specificationVersion: "v4"; languageModel: (modelId: string) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>; embeddingModel: (modelId: string) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; imageModel: (modelId: string) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; transcriptionModel: ((modelId: string) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; speechModel: ((modelId: string) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; rerankingModel: ((modelId: string) => Effect<{ doRerank: (options: RerankingModelV4CallOptions) => Effect<RerankingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; files: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadFile: (options: FilesV4UploadFileCallOptions) => Effect<FilesV4UploadFileResult, AiSdkError, never>; getFileMetadata: ((options: FilesV4GetFileMetadataCallOptions) => Effect<FilesV4GetFileMetadataResult, AiSdkError, never>) | undefined; downloadFile: ((options: FilesV4DownloadFileCallOptions) => Effect<{ content: Stream<Uint8Array<ArrayBufferLike>, AiSdkError, never>; mediaType?: string | undefined; providerMetadata?: SharedV4ProviderMetadata | undefined; warnings: SharedV4Warning[]; }, AiSdkError, Scope>) | undefined; deleteFile: ((options: FilesV4DeleteFileCallOptions) => Effect<FilesV4DeleteFileResult, AiSdkError, never>) | undefined; }, AiSdkError, never>) | undefined; skills: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadSkill: (options: SkillsV4UploadSkillCallOptions) => Effect<SkillsV4UploadSkillResult, AiSdkError, never>; }, AiSdkError, never>) | undefined; }, AiSdkError, never>
createKlingAI<E, R>(options: EffectProviderSettings<KlingAIProviderSettings, "apiKey", E, R>): Effect<{ video: (modelId: KlingAIVideoModelId) => Effect<{ maxVideosPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; doGenerate: ((options: VideoModelV4CallOptions) => Effect<VideoModelV4Result, AiSdkError, never>) | undefined; doStart: ((options: VideoModelV4CallOptions & { webhookUrl?: string | undefined; }) => Effect<VideoModelV4OperationStartResult, AiSdkError, never>) | undefined; doStatus: ((options: { operation: JSONValue; abortSignal?: AbortSignal | undefined; headers?: Record<string, string | undefined> | undefined; }) => Effect<VideoModelV4OperationStatusResult, AiSdkError, never>) | undefined; handleWebhookOption: (<E, R, E2, R2>(options: { readonly webhook: () => Effect<{ readonly url: string; readonly received: Effect<VideoModelV4OperationWebhook<JSONValue>, E2, R2>; }, E, R>; }) => Effect<{ webhookUrl: string; received: Effect<VideoModelV4OperationWebhook<JSONValue>, AiSdkError, never>; }, AiSdkError, Scope | R | R2>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; videoModel: (modelId: KlingAIVideoModelId) => Effect<{ maxVideosPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; doGenerate: ((options: VideoModelV4CallOptions) => Effect<VideoModelV4Result, AiSdkError, never>) | undefined; doStart: ((options: VideoModelV4CallOptions & { webhookUrl?: string | undefined; }) => Effect<VideoModelV4OperationStartResult, AiSdkError, never>) | undefined; doStatus: ((options: { operation: JSONValue; abortSignal?: AbortSignal | undefined; headers?: Record<string, string | undefined> | undefined; }) => Effect<VideoModelV4OperationStatusResult, AiSdkError, never>) | undefined; handleWebhookOption: (<E, R, E2, R2>(options: { readonly webhook: () => Effect<{ readonly url: string; readonly received: Effect<VideoModelV4OperationWebhook<JSONValue>, E2, R2>; }, E, R>; }) => Effect<{ webhookUrl: string; received: Effect<VideoModelV4OperationWebhook<JSONValue>, AiSdkError, never>; }, AiSdkError, Scope | R | R2>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; specificationVersion: "v4"; languageModel: (modelId: string) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>; embeddingModel: (modelId: string) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; imageModel: (modelId: string) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; transcriptionModel: ((modelId: string) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; speechModel: ((modelId: string) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; rerankingModel: ((modelId: string) => Effect<{ doRerank: (options: RerankingModelV4CallOptions) => Effect<RerankingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; files: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadFile: (options: FilesV4UploadFileCallOptions) => Effect<FilesV4UploadFileResult, AiSdkError, never>; getFileMetadata: ((options: FilesV4GetFileMetadataCallOptions) => Effect<FilesV4GetFileMetadataResult, AiSdkError, never>) | undefined; downloadFile: ((options: FilesV4DownloadFileCallOptions) => Effect<{ content: Stream<Uint8Array<ArrayBufferLike>, AiSdkError, never>; mediaType?: string | undefined; providerMetadata?: SharedV4ProviderMetadata | undefined; warnings: SharedV4Warning[]; }, AiSdkError, Scope>) | undefined; deleteFile: ((options: FilesV4DeleteFileCallOptions) => Effect<FilesV4DeleteFileResult, AiSdkError, never>) | undefined; }, AiSdkError, never>) | undefined; skills: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadSkill: (options: SkillsV4UploadSkillCallOptions) => Effect<SkillsV4UploadSkillResult, AiSdkError, never>; }, AiSdkError, never>) | undefined; }, AiSdkError, Scope | R>
```

## `klingai`

Adapt the preconfigured provider from the Kling AI SDK. Use the factory to supply
explicit settings.

```text
klingai: { video: (modelId: KlingAIVideoModelId) => Effect<{ maxVideosPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; doGenerate: ((options: VideoModelV4CallOptions) => Effect<VideoModelV4Result, AiSdkError, never>) | undefined; doStart: ((options: VideoModelV4CallOptions & { webhookUrl?: string | undefined; }) => Effect<VideoModelV4OperationStartResult, AiSdkError, never>) | undefined; doStatus: ((options: { operation: JSONValue; abortSignal?: AbortSignal | undefined; headers?: Record<string, string | undefined> | undefined; }) => Effect<VideoModelV4OperationStatusResult, AiSdkError, never>) | undefined; handleWebhookOption: (<E, R, E2, R2>(options: { readonly webhook: () => Effect<{ readonly url: string; readonly received: Effect<VideoModelV4OperationWebhook<JSONValue>, E2, R2>; }, E, R>; }) => Effect<{ webhookUrl: string; received: Effect<VideoModelV4OperationWebhook<JSONValue>, AiSdkError, never>; }, AiSdkError, Scope | R | R2>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; videoModel: (modelId: KlingAIVideoModelId) => Effect<{ maxVideosPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; doGenerate: ((options: VideoModelV4CallOptions) => Effect<VideoModelV4Result, AiSdkError, never>) | undefined; doStart: ((options: VideoModelV4CallOptions & { webhookUrl?: string | undefined; }) => Effect<VideoModelV4OperationStartResult, AiSdkError, never>) | undefined; doStatus: ((options: { operation: JSONValue; abortSignal?: AbortSignal | undefined; headers?: Record<string, string | undefined> | undefined; }) => Effect<VideoModelV4OperationStatusResult, AiSdkError, never>) | undefined; handleWebhookOption: (<E, R, E2, R2>(options: { readonly webhook: () => Effect<{ readonly url: string; readonly received: Effect<VideoModelV4OperationWebhook<JSONValue>, E2, R2>; }, E, R>; }) => Effect<{ webhookUrl: string; received: Effect<VideoModelV4OperationWebhook<JSONValue>, AiSdkError, never>; }, AiSdkError, Scope | R | R2>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; specificationVersion: "v4"; languageModel: (modelId: string) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>; embeddingModel: (modelId: string) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; imageModel: (modelId: string) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; transcriptionModel: ((modelId: string) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; speechModel: ((modelId: string) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; rerankingModel: ((modelId: string) => Effect<{ doRerank: (options: RerankingModelV4CallOptions) => Effect<RerankingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; files: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadFile: (options: FilesV4UploadFileCallOptions) => Effect<FilesV4UploadFileResult, AiSdkError, never>; getFileMetadata: ((options: FilesV4GetFileMetadataCallOptions) => Effect<FilesV4GetFileMetadataResult, AiSdkError, never>) | undefined; downloadFile: ((options: FilesV4DownloadFileCallOptions) => Effect<{ content: Stream<Uint8Array<ArrayBufferLike>, AiSdkError, never>; mediaType?: string | undefined; providerMetadata?: SharedV4ProviderMetadata | undefined; warnings: SharedV4Warning[]; }, AiSdkError, Scope>) | undefined; deleteFile: ((options: FilesV4DeleteFileCallOptions) => Effect<FilesV4DeleteFileResult, AiSdkError, never>) | undefined; }, AiSdkError, never>) | undefined; skills: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadSkill: (options: SkillsV4UploadSkillCallOptions) => Effect<SkillsV4UploadSkillResult, AiSdkError, never>; }, AiSdkError, never>) | undefined; }
```

## `KlingAIProvider`

Provider returned by the adapter, with Effect-based model selection for Kling AI.

```text
export type KlingAIProvider = ReturnType<typeof wrapProvider>;
```

## `KlingAIProviderSettings`

Keep the native Kling AI options and allow `apiKey` to resolve through Effect when the
SDK requests the value.

```text
export type KlingAIProviderSettings<E = never, R = never> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
```

## `KlingAIVideoModelId`

The source declaration does not provide a JSDoc description.

```text
type KlingAIVideoModelId = KlingAIModelIds['video'] | (string & {});
```

## `KlingAIVideoModelOptions`

Provider-specific options for KlingAI video generation.

Not all options are supported by every model version and video mode (T2V, I2V,
motion control). See the KlingAI capability map for detailed compatibility:
https://app.klingai.com/global/dev/document-api/apiReference/model/skillsMap

```text
type KlingAIVideoModelOptions = {
  /**
   * Video generation mode.
   *
   * - `'std'`: Standard mode — cost-effective.
   * - `'pro'`: Professional mode — higher quality but longer generation time.
   */
  mode?: 'std' | 'pro' | null;
  /**
   * Polling interval in milliseconds for checking task status.
   * Default: 5000 (5 seconds).
   */
  pollIntervalMs?: number | null;
  /**
   * Maximum time in milliseconds to wait for video generation.
   * Default: 600000 (10 minutes).
   */
  pollTimeoutMs?: number | null;
  /**
   * Negative text prompt to specify what to avoid.
   * Cannot exceed 2500 characters.
   */
  negativePrompt?: string | null;
  /**
   * Whether to generate sound simultaneously when generating videos.
   * Only V2.6 and subsequent versions support this parameter,
   * and requires `mode: 'pro'`.
   */
  sound?: 'on' | 'off' | null;
  /**
   * Flexibility in video generation. The higher the value, the lower the
   * model's flexibility, and the stronger the relevance to the user's prompt.
   * Value range: [0, 1]. Kling-v2.x models do not support this parameter.
   */
  cfgScale?: number | null;
  /**
   * Camera movement control. If not specified, the model will intelligently
   * match based on the input text/images.
   */
  cameraControl?: {
    type: 'simple' | 'down_back' | 'forward_up' | 'right_turn_forward' | 'left_turn_forward';
    config?: {
      horizontal?: number | null;
      vertical?: number | null;
      pan?: number | null;
      tilt?: number | null;
      roll?: number | null;
      zoom?: number | null;
    } | null;
  } | null;
  /**
   * End frame image for I2V start+end frame control.
   * Supports image URL or raw base64-encoded image data.
   * Requires `mode: 'pro'` for most models.
   */
  imageTail?: string | null;
  /**
   * Static brush mask image for I2V motion brush.
   * Supports image URL or raw base64-encoded image data.
   */
  staticMask?: string | null;
  /**
   * Dynamic brush configurations for I2V motion brush.
   * Up to 6 groups, each with a mask and motion trajectories.
   */
  dynamicMasks?: Array<{
    mask: string;
    trajectories: Array<{
      x: number;
      y: number;
    }>;
  }> | null;
  /**
   * Enable multi-shot video generation (Kling v3.0+).
   * When true, the video is split into up to 6 storyboard shots
   * with individual prompts and durations.
   *
   * When multiShot is true with shotType 'customize', multiPrompt is required.
   * When multiShot is true, the main prompt parameter is ignored by the API.
   */
  multiShot?: boolean | null;
  /**
   * Storyboard method for multi-shot video generation (Kling v3.0+).
   * Required when multiShot is true.
   *
   * - `'customize'`: User-defined shots via multiPrompt.
   * - `'intelligence'`: Model auto-segments based on the main prompt.
   */
  shotType?: 'customize' | 'intelligence' | null;
  /**
   * Per-shot details for multi-shot video generation (Kling v3.0+).
   * Required when multiShot is true and shotType is 'customize'.
   *
   * Up to 6 shots. Each shot has an index, prompt (max 512 chars),
   * and duration in seconds. Shot durations must sum to the total duration.
   */
  multiPrompt?: Array<{
    index: number;
    prompt: string;
    duration: string;
  }> | null;
  /**
   * Reference elements for element control (Kling v3.0+).
   * Supports video character elements and multi-image elements.
   *
   * - I2V: Up to 3 reference elements. Cannot coexist with voiceList.
   * - Motion Control: Currently only 1 element supported.
   *   When referencing an element, the generated video can only
   *   refer to the orientation of the person in the video.
   */
  elementList?: Array<{
    element_id: number;
  }> | null;
  /**
   * Voice references for voice control (Kling v3.0+).
   * Up to 2 voice references. Referenced via `<<<voice_1>>>` template
   * syntax in the prompt.
   *
   * When voiceList is used and the prompt references voice IDs,
   * sound must be set to 'on'.
   * Cannot coexist with elementList on the I2V endpoint.
   */
  voiceList?: Array<{
    voice_id: string;
  }> | null;
  /**
   * Whether to generate watermarked results simultaneously.
   */
  watermarkEnabled?: boolean | null;
  /**
   * URL of the reference video. The character actions in the generated video
   * are consistent with the reference video.
   *
   * Supports .mp4/.mov, max 100MB, side lengths 340px–3850px,
   * duration 3–30 seconds (depends on `characterOrientation`).
   */
  videoUrl?: string | null;
  /**
   * Orientation of the characters in the generated video.
   *
   * - `'image'`: Same orientation as the person in the image.
   *   Reference video duration max 10 seconds.
   * - `'video'`: Same orientation as the person in the video.
   *   Reference video duration max 30 seconds.
   */
  characterOrientation?: 'image' | 'video' | null;
  /**
   * Whether to keep the original sound of the reference video.
   * Default: `'yes'`.
   */
  keepOriginalSound?: 'yes' | 'no' | null;
  [key: string]: unknown;
};
```

## `KlingAIVideoProviderOptions`

Provider-specific options for KlingAI video generation.

Not all options are supported by every model version and video mode (T2V, I2V,
motion control). See the KlingAI capability map for detailed compatibility:
https://app.klingai.com/global/dev/document-api/apiReference/model/skillsMap

```text
type KlingAIVideoModelOptions = {
  /**
   * Video generation mode.
   *
   * - `'std'`: Standard mode — cost-effective.
   * - `'pro'`: Professional mode — higher quality but longer generation time.
   */
  mode?: 'std' | 'pro' | null;
  /**
   * Polling interval in milliseconds for checking task status.
   * Default: 5000 (5 seconds).
   */
  pollIntervalMs?: number | null;
  /**
   * Maximum time in milliseconds to wait for video generation.
   * Default: 600000 (10 minutes).
   */
  pollTimeoutMs?: number | null;
  /**
   * Negative text prompt to specify what to avoid.
   * Cannot exceed 2500 characters.
   */
  negativePrompt?: string | null;
  /**
   * Whether to generate sound simultaneously when generating videos.
   * Only V2.6 and subsequent versions support this parameter,
   * and requires `mode: 'pro'`.
   */
  sound?: 'on' | 'off' | null;
  /**
   * Flexibility in video generation. The higher the value, the lower the
   * model's flexibility, and the stronger the relevance to the user's prompt.
   * Value range: [0, 1]. Kling-v2.x models do not support this parameter.
   */
  cfgScale?: number | null;
  /**
   * Camera movement control. If not specified, the model will intelligently
   * match based on the input text/images.
   */
  cameraControl?: {
    type: 'simple' | 'down_back' | 'forward_up' | 'right_turn_forward' | 'left_turn_forward';
    config?: {
      horizontal?: number | null;
      vertical?: number | null;
      pan?: number | null;
      tilt?: number | null;
      roll?: number | null;
      zoom?: number | null;
    } | null;
  } | null;
  /**
   * End frame image for I2V start+end frame control.
   * Supports image URL or raw base64-encoded image data.
   * Requires `mode: 'pro'` for most models.
   */
  imageTail?: string | null;
  /**
   * Static brush mask image for I2V motion brush.
   * Supports image URL or raw base64-encoded image data.
   */
  staticMask?: string | null;
  /**
   * Dynamic brush configurations for I2V motion brush.
   * Up to 6 groups, each with a mask and motion trajectories.
   */
  dynamicMasks?: Array<{
    mask: string;
    trajectories: Array<{
      x: number;
      y: number;
    }>;
  }> | null;
  /**
   * Enable multi-shot video generation (Kling v3.0+).
   * When true, the video is split into up to 6 storyboard shots
   * with individual prompts and durations.
   *
   * When multiShot is true with shotType 'customize', multiPrompt is required.
   * When multiShot is true, the main prompt parameter is ignored by the API.
   */
  multiShot?: boolean | null;
  /**
   * Storyboard method for multi-shot video generation (Kling v3.0+).
   * Required when multiShot is true.
   *
   * - `'customize'`: User-defined shots via multiPrompt.
   * - `'intelligence'`: Model auto-segments based on the main prompt.
   */
  shotType?: 'customize' | 'intelligence' | null;
  /**
   * Per-shot details for multi-shot video generation (Kling v3.0+).
   * Required when multiShot is true and shotType is 'customize'.
   *
   * Up to 6 shots. Each shot has an index, prompt (max 512 chars),
   * and duration in seconds. Shot durations must sum to the total duration.
   */
  multiPrompt?: Array<{
    index: number;
    prompt: string;
    duration: string;
  }> | null;
  /**
   * Reference elements for element control (Kling v3.0+).
   * Supports video character elements and multi-image elements.
   *
   * - I2V: Up to 3 reference elements. Cannot coexist with voiceList.
   * - Motion Control: Currently only 1 element supported.
   *   When referencing an element, the generated video can only
   *   refer to the orientation of the person in the video.
   */
  elementList?: Array<{
    element_id: number;
  }> | null;
  /**
   * Voice references for voice control (Kling v3.0+).
   * Up to 2 voice references. Referenced via `<<<voice_1>>>` template
   * syntax in the prompt.
   *
   * When voiceList is used and the prompt references voice IDs,
   * sound must be set to 'on'.
   * Cannot coexist with elementList on the I2V endpoint.
   */
  voiceList?: Array<{
    voice_id: string;
  }> | null;
  /**
   * Whether to generate watermarked results simultaneously.
   */
  watermarkEnabled?: boolean | null;
  /**
   * URL of the reference video. The character actions in the generated video
   * are consistent with the reference video.
   *
   * Supports .mp4/.mov, max 100MB, side lengths 340px–3850px,
   * duration 3–30 seconds (depends on `characterOrientation`).
   */
  videoUrl?: string | null;
  /**
   * Orientation of the characters in the generated video.
   *
   * - `'image'`: Same orientation as the person in the image.
   *   Reference video duration max 10 seconds.
   * - `'video'`: Same orientation as the person in the video.
   *   Reference video duration max 30 seconds.
   */
  characterOrientation?: 'image' | 'video' | null;
  /**
   * Whether to keep the original sound of the reference video.
   * Default: `'yes'`.
   */
  keepOriginalSound?: 'yes' | 'no' | null;
  [key: string]: unknown;
};
```

## `VERSION`

The source declaration does not provide a JSDoc description.

```text
VERSION: string
```
