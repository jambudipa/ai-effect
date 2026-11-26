---
title: fireworks provider API
doc-type: reference
sources: [src/providers/fireworks.ts, package.json]
---

# fireworks provider API

> **TL;DR:** This entry exposes 14 public exports through `@jambudipa/ai-effect/fireworks`.
> The contracts below come from the installed package declarations and JSDoc.

## Import

`@jambudipa/ai-effect/fireworks` selects the package export for this provider. See the [provider source](../../../src/providers/fireworks.ts).

## `createFireworks`

Construct the Fireworks provider inside an Effect. Keep the scope open when using an
Effect resolver for `apiKey`.

```text
createFireworks(options?: StaticProviderSettings<FireworksProviderSettings, "apiKey"> | undefined): Effect<((modelId: (string & {}) | "accounts/fireworks/models/deepseek-v3" | "accounts/fireworks/models/llama-v3p3-70b-instruct" | "accounts/fireworks/models/llama-v3p2-3b-instruct" | "accounts/fireworks/models/llama-v3p1-405b-instruct" | "accounts/fireworks/models/llama-v3p1-8b-instruct" | "accounts/fireworks/models/mixtral-8x7b-instruct" | "accounts/fireworks/models/mixtral-8x22b-instruct" | "accounts/fireworks/models/mixtral-8x7b-instruct-hf" | "accounts/fireworks/models/qwen2p5-coder-32b-instruct" | "accounts/fireworks/models/qwen2p5-72b-instruct" | "accounts/fireworks/models/qwen-qwq-32b-preview" | "accounts/fireworks/models/qwen2-vl-72b-instruct" | "accounts/fireworks/models/llama-v3p2-11b-vision-instruct" | "accounts/fireworks/models/qwq-32b" | "accounts/fireworks/models/yi-large" | "accounts/fireworks/models/kimi-k2-instruct" | "accounts/fireworks/models/kimi-k2-thinking" | "accounts/fireworks/models/kimi-k2p6" | "accounts/fireworks/models/minimax-m2") => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>) & { chatModel: (modelId: (string & {}) | "accounts/fireworks/models/deepseek-v3" | "accounts/fireworks/models/llama-v3p3-70b-instruct" | "accounts/fireworks/models/llama-v3p2-3b-instruct" | "accounts/fireworks/models/llama-v3p1-405b-instruct" | "accounts/fireworks/models/llama-v3p1-8b-instruct" | "accounts/fireworks/models/mixtral-8x7b-instruct" | "accounts/fireworks/models/mixtral-8x22b-instruct" | "accounts/fireworks/models/mixtral-8x7b-instruct-hf" | "accounts/fireworks/models/qwen2p5-coder-32b-instruct" | "accounts/fireworks/models/qwen2p5-72b-instruct" | "accounts/fireworks/models/qwen-qwq-32b-preview" | "accounts/fireworks/models/qwen2-vl-72b-instruct" | "accounts/fireworks/models/llama-v3p2-11b-vision-instruct" | "accounts/fireworks/models/qwq-32b" | "accounts/fireworks/models/yi-large" | "accounts/fireworks/models/kimi-k2-instruct" | "accounts/fireworks/models/kimi-k2-thinking" | "accounts/fireworks/models/kimi-k2p6" | "accounts/fireworks/models/minimax-m2") => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>; completionModel: (modelId: (string & {}) | "accounts/fireworks/models/llama-v3-8b-instruct" | "accounts/fireworks/models/llama-v2-34b-code") => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>; languageModel: (modelId: (string & {}) | "accounts/fireworks/models/deepseek-v3" | "accounts/fireworks/models/llama-v3p3-70b-instruct" | "accounts/fireworks/models/llama-v3p2-3b-instruct" | "accounts/fireworks/models/llama-v3p1-405b-instruct" | "accounts/fireworks/models/llama-v3p1-8b-instruct" | "accounts/fireworks/models/mixtral-8x7b-instruct" | "accounts/fireworks/models/mixtral-8x22b-instruct" | "accounts/fireworks/models/mixtral-8x7b-instruct-hf" | "accounts/fireworks/models/qwen2p5-coder-32b-instruct" | "accounts/fireworks/models/qwen2p5-72b-instruct" | "accounts/fireworks/models/qwen-qwq-32b-preview" | "accounts/fireworks/models/qwen2-vl-72b-instruct" | "accounts/fireworks/models/llama-v3p2-11b-vision-instruct" | "accounts/fireworks/models/qwq-32b" | "accounts/fireworks/models/yi-large" | "accounts/fireworks/models/kimi-k2-instruct" | "accounts/fireworks/models/kimi-k2-thinking" | "accounts/fireworks/models/kimi-k2p6" | "accounts/fireworks/models/minimax-m2") => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>; embeddingModel: (modelId: FireworksEmbeddingModelId) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; textEmbeddingModel: (modelId: FireworksEmbeddingModelId) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; image: (modelId: FireworksImageModelId) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; imageModel: (modelId: FireworksImageModelId) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; specificationVersion: "v4"; transcriptionModel: ((modelId: string) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; speechModel: ((modelId: string) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; rerankingModel: ((modelId: string) => Effect<{ doRerank: (options: RerankingModelV4CallOptions) => Effect<RerankingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; files: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadFile: (options: FilesV4UploadFileCallOptions) => Effect<FilesV4UploadFileResult, AiSdkError, never>; getFileMetadata: ((options: FilesV4GetFileMetadataCallOptions) => Effect<FilesV4GetFileMetadataResult, AiSdkError, never>) | undefined; downloadFile: ((options: FilesV4DownloadFileCallOptions) => Effect<{ content: Stream<Uint8Array<ArrayBufferLike>, AiSdkError, never>; mediaType?: string | undefined; providerMetadata?: SharedV4ProviderMetadata | undefined; warnings: SharedV4Warning[]; }, AiSdkError, Scope>) | undefined; deleteFile: ((options: FilesV4DeleteFileCallOptions) => Effect<FilesV4DeleteFileResult, AiSdkError, never>) | undefined; }, AiSdkError, never>) | undefined; skills: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadSkill: (options: SkillsV4UploadSkillCallOptions) => Effect<SkillsV4UploadSkillResult, AiSdkError, never>; }, AiSdkError, never>) | undefined; }, AiSdkError, never>
createFireworks<E, R>(options: EffectProviderSettings<FireworksProviderSettings, "apiKey", E, R>): Effect<((modelId: (string & {}) | "accounts/fireworks/models/deepseek-v3" | "accounts/fireworks/models/llama-v3p3-70b-instruct" | "accounts/fireworks/models/llama-v3p2-3b-instruct" | "accounts/fireworks/models/llama-v3p1-405b-instruct" | "accounts/fireworks/models/llama-v3p1-8b-instruct" | "accounts/fireworks/models/mixtral-8x7b-instruct" | "accounts/fireworks/models/mixtral-8x22b-instruct" | "accounts/fireworks/models/mixtral-8x7b-instruct-hf" | "accounts/fireworks/models/qwen2p5-coder-32b-instruct" | "accounts/fireworks/models/qwen2p5-72b-instruct" | "accounts/fireworks/models/qwen-qwq-32b-preview" | "accounts/fireworks/models/qwen2-vl-72b-instruct" | "accounts/fireworks/models/llama-v3p2-11b-vision-instruct" | "accounts/fireworks/models/qwq-32b" | "accounts/fireworks/models/yi-large" | "accounts/fireworks/models/kimi-k2-instruct" | "accounts/fireworks/models/kimi-k2-thinking" | "accounts/fireworks/models/kimi-k2p6" | "accounts/fireworks/models/minimax-m2") => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>) & { chatModel: (modelId: (string & {}) | "accounts/fireworks/models/deepseek-v3" | "accounts/fireworks/models/llama-v3p3-70b-instruct" | "accounts/fireworks/models/llama-v3p2-3b-instruct" | "accounts/fireworks/models/llama-v3p1-405b-instruct" | "accounts/fireworks/models/llama-v3p1-8b-instruct" | "accounts/fireworks/models/mixtral-8x7b-instruct" | "accounts/fireworks/models/mixtral-8x22b-instruct" | "accounts/fireworks/models/mixtral-8x7b-instruct-hf" | "accounts/fireworks/models/qwen2p5-coder-32b-instruct" | "accounts/fireworks/models/qwen2p5-72b-instruct" | "accounts/fireworks/models/qwen-qwq-32b-preview" | "accounts/fireworks/models/qwen2-vl-72b-instruct" | "accounts/fireworks/models/llama-v3p2-11b-vision-instruct" | "accounts/fireworks/models/qwq-32b" | "accounts/fireworks/models/yi-large" | "accounts/fireworks/models/kimi-k2-instruct" | "accounts/fireworks/models/kimi-k2-thinking" | "accounts/fireworks/models/kimi-k2p6" | "accounts/fireworks/models/minimax-m2") => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>; completionModel: (modelId: (string & {}) | "accounts/fireworks/models/llama-v3-8b-instruct" | "accounts/fireworks/models/llama-v2-34b-code") => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>; languageModel: (modelId: (string & {}) | "accounts/fireworks/models/deepseek-v3" | "accounts/fireworks/models/llama-v3p3-70b-instruct" | "accounts/fireworks/models/llama-v3p2-3b-instruct" | "accounts/fireworks/models/llama-v3p1-405b-instruct" | "accounts/fireworks/models/llama-v3p1-8b-instruct" | "accounts/fireworks/models/mixtral-8x7b-instruct" | "accounts/fireworks/models/mixtral-8x22b-instruct" | "accounts/fireworks/models/mixtral-8x7b-instruct-hf" | "accounts/fireworks/models/qwen2p5-coder-32b-instruct" | "accounts/fireworks/models/qwen2p5-72b-instruct" | "accounts/fireworks/models/qwen-qwq-32b-preview" | "accounts/fireworks/models/qwen2-vl-72b-instruct" | "accounts/fireworks/models/llama-v3p2-11b-vision-instruct" | "accounts/fireworks/models/qwq-32b" | "accounts/fireworks/models/yi-large" | "accounts/fireworks/models/kimi-k2-instruct" | "accounts/fireworks/models/kimi-k2-thinking" | "accounts/fireworks/models/kimi-k2p6" | "accounts/fireworks/models/minimax-m2") => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>; embeddingModel: (modelId: FireworksEmbeddingModelId) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; textEmbeddingModel: (modelId: FireworksEmbeddingModelId) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; image: (modelId: FireworksImageModelId) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; imageModel: (modelId: FireworksImageModelId) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; specificationVersion: "v4"; transcriptionModel: ((modelId: string) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; speechModel: ((modelId: string) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; rerankingModel: ((modelId: string) => Effect<{ doRerank: (options: RerankingModelV4CallOptions) => Effect<RerankingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; files: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadFile: (options: FilesV4UploadFileCallOptions) => Effect<FilesV4UploadFileResult, AiSdkError, never>; getFileMetadata: ((options: FilesV4GetFileMetadataCallOptions) => Effect<FilesV4GetFileMetadataResult, AiSdkError, never>) | undefined; downloadFile: ((options: FilesV4DownloadFileCallOptions) => Effect<{ content: Stream<Uint8Array<ArrayBufferLike>, AiSdkError, never>; mediaType?: string | undefined; providerMetadata?: SharedV4ProviderMetadata | undefined; warnings: SharedV4Warning[]; }, AiSdkError, Scope>) | undefined; deleteFile: ((options: FilesV4DeleteFileCallOptions) => Effect<FilesV4DeleteFileResult, AiSdkError, never>) | undefined; }, AiSdkError, never>) | undefined; skills: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadSkill: (options: SkillsV4UploadSkillCallOptions) => Effect<SkillsV4UploadSkillResult, AiSdkError, never>; }, AiSdkError, never>) | undefined; }, AiSdkError, Scope | R>
```

## `fireworks`

Adapt the preconfigured provider from the Fireworks SDK. Use the factory to supply
explicit settings.

```text
fireworks(modelId: (string & {}) | "accounts/fireworks/models/deepseek-v3" | "accounts/fireworks/models/llama-v3p3-70b-instruct" | "accounts/fireworks/models/llama-v3p2-3b-instruct" | "accounts/fireworks/models/llama-v3p1-405b-instruct" | "accounts/fireworks/models/llama-v3p1-8b-instruct" | "accounts/fireworks/models/mixtral-8x7b-instruct" | "accounts/fireworks/models/mixtral-8x22b-instruct" | "accounts/fireworks/models/mixtral-8x7b-instruct-hf" | "accounts/fireworks/models/qwen2p5-coder-32b-instruct" | "accounts/fireworks/models/qwen2p5-72b-instruct" | "accounts/fireworks/models/qwen-qwq-32b-preview" | "accounts/fireworks/models/qwen2-vl-72b-instruct" | "accounts/fireworks/models/llama-v3p2-11b-vision-instruct" | "accounts/fireworks/models/qwq-32b" | "accounts/fireworks/models/yi-large" | "accounts/fireworks/models/kimi-k2-instruct" | "accounts/fireworks/models/kimi-k2-thinking" | "accounts/fireworks/models/kimi-k2p6" | "accounts/fireworks/models/minimax-m2"): Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

### Public properties

#### `fireworks.chatModel`

```text
(modelId: (string & {}) | "accounts/fireworks/models/deepseek-v3" | "accounts/fireworks/models/llama-v3p3-70b-instruct" | "accounts/fireworks/models/llama-v3p2-3b-instruct" | "accounts/fireworks/models/llama-v3p1-405b-instruct" | "accounts/fireworks/models/llama-v3p1-8b-instruct" | "accounts/fireworks/models/mixtral-8x7b-instruct" | "accounts/fireworks/models/mixtral-8x22b-instruct" | "accounts/fireworks/models/mixtral-8x7b-instruct-hf" | "accounts/fireworks/models/qwen2p5-coder-32b-instruct" | "accounts/fireworks/models/qwen2p5-72b-instruct" | "accounts/fireworks/models/qwen-qwq-32b-preview" | "accounts/fireworks/models/qwen2-vl-72b-instruct" | "accounts/fireworks/models/llama-v3p2-11b-vision-instruct" | "accounts/fireworks/models/qwq-32b" | "accounts/fireworks/models/yi-large" | "accounts/fireworks/models/kimi-k2-instruct" | "accounts/fireworks/models/kimi-k2-thinking" | "accounts/fireworks/models/kimi-k2p6" | "accounts/fireworks/models/minimax-m2") => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

#### `fireworks.completionModel`

```text
(modelId: (string & {}) | "accounts/fireworks/models/llama-v3-8b-instruct" | "accounts/fireworks/models/llama-v2-34b-code") => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

#### `fireworks.embeddingModel`

```text
(modelId: FireworksEmbeddingModelId) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `fireworks.files`

```text
(() => Effect<{ specificationVersion: "v4"; provider: string; uploadFile: (options: FilesV4UploadFileCallOptions) => Effect<FilesV4UploadFileResult, AiSdkError, never>; getFileMetadata: ((options: FilesV4GetFileMetadataCallOptions) => Effect<FilesV4GetFileMetadataResult, AiSdkError, never>) | undefined; downloadFile: ((options: FilesV4DownloadFileCallOptions) => Effect<{ content: Stream<Uint8Array<ArrayBufferLike>, AiSdkError, never>; mediaType?: string | undefined; providerMetadata?: SharedV4ProviderMetadata | undefined; warnings: SharedV4Warning[]; }, AiSdkError, Scope>) | undefined; deleteFile: ((options: FilesV4DeleteFileCallOptions) => Effect<FilesV4DeleteFileResult, AiSdkError, never>) | undefined; }, AiSdkError, never>) | undefined
```

#### `fireworks.image`

```text
(modelId: FireworksImageModelId) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `fireworks.imageModel`

```text
(modelId: FireworksImageModelId) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `fireworks.languageModel`

```text
(modelId: (string & {}) | "accounts/fireworks/models/deepseek-v3" | "accounts/fireworks/models/llama-v3p3-70b-instruct" | "accounts/fireworks/models/llama-v3p2-3b-instruct" | "accounts/fireworks/models/llama-v3p1-405b-instruct" | "accounts/fireworks/models/llama-v3p1-8b-instruct" | "accounts/fireworks/models/mixtral-8x7b-instruct" | "accounts/fireworks/models/mixtral-8x22b-instruct" | "accounts/fireworks/models/mixtral-8x7b-instruct-hf" | "accounts/fireworks/models/qwen2p5-coder-32b-instruct" | "accounts/fireworks/models/qwen2p5-72b-instruct" | "accounts/fireworks/models/qwen-qwq-32b-preview" | "accounts/fireworks/models/qwen2-vl-72b-instruct" | "accounts/fireworks/models/llama-v3p2-11b-vision-instruct" | "accounts/fireworks/models/qwq-32b" | "accounts/fireworks/models/yi-large" | "accounts/fireworks/models/kimi-k2-instruct" | "accounts/fireworks/models/kimi-k2-thinking" | "accounts/fireworks/models/kimi-k2p6" | "accounts/fireworks/models/minimax-m2") => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

#### `fireworks.rerankingModel`

```text
((modelId: string) => Effect<{ doRerank: (options: RerankingModelV4CallOptions) => Effect<RerankingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined
```

#### `fireworks.skills`

```text
(() => Effect<{ specificationVersion: "v4"; provider: string; uploadSkill: (options: SkillsV4UploadSkillCallOptions) => Effect<SkillsV4UploadSkillResult, AiSdkError, never>; }, AiSdkError, never>) | undefined
```

#### `fireworks.specificationVersion`

```text
"v4"
```

#### `fireworks.speechModel`

```text
((modelId: string) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined
```

#### `fireworks.textEmbeddingModel`

```text
(modelId: FireworksEmbeddingModelId) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `fireworks.transcriptionModel`

```text
((modelId: string) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined
```


## `FireworksEmbeddingModelId`

The source declaration does not provide a JSDoc description.

```text
type FireworksEmbeddingModelId = FireworksModelIds['embedding'] | (string & {});
```

## `FireworksEmbeddingModelOptions`

The source declaration does not provide a JSDoc description.

```text
type FireworksEmbeddingModelOptions = z.infer<typeof fireworksEmbeddingModelOptions>;
```

## `FireworksEmbeddingProviderOptions`

The source declaration does not provide a JSDoc description.

```text
type FireworksEmbeddingModelOptions = z.infer<typeof fireworksEmbeddingModelOptions>;
```

## `FireworksErrorData`

The source declaration does not provide a JSDoc description.

```text
type FireworksErrorData = z.infer<typeof fireworksErrorSchema>;
```

## `FireworksImageModel`

Construct the SDK Fireworks image model lazily with its native options. It exposes the
workflow serialization hooks.
Effect model returned by `FireworksImageModel`. Use its image generation operations in
an Effect program.

```text
FireworksImageModel(modelId: FireworksImageModelId, config: ProviderHostConfiguration<FireworksImageModelConfig>): Effect<{ maxImagesPerCall: Effect<1, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

### Public properties

#### `FireworksImageModel[WORKFLOW_DESERIALIZE]`

```text
(input: { modelId: FireworksImageModelId; config: FireworksImageModelConfig; }) => Effect<{ maxImagesPerCall: Effect<1, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `FireworksImageModel[WORKFLOW_SERIALIZE]`

```text
(model: { maxImagesPerCall: Effect<1, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }) => Effect<{ modelId: string; config: JSONObject; }, AiSdkError, never>
```


## `FireworksImageModelId`

The source declaration does not provide a JSDoc description.

```text
type FireworksImageModelId = FireworksModelIds['image'] | (string & {});
```

## `FireworksImageModelOptions`

The source declaration does not provide a JSDoc description.

```text
type FireworksImageModelOptions = InferSchema<typeof fireworksImageModelOptionsSchema>;
```

## `FireworksLanguageModelOptions`

The source declaration does not provide a JSDoc description.

```text
type FireworksLanguageModelOptions = z.infer<typeof fireworksLanguageModelOptions>;
```

## `FireworksProvider`

Provider returned by the adapter, with Effect-based model selection for Fireworks.

```text
export type FireworksProvider = ReturnType<typeof wrapProvider>;
```

## `FireworksProviderOptions`

The source declaration does not provide a JSDoc description.

```text
type FireworksLanguageModelOptions = z.infer<typeof fireworksLanguageModelOptions>;
```

## `FireworksProviderSettings`

Keep the native Fireworks options and allow `apiKey` to resolve through Effect when the
SDK requests the value.

```text
export type FireworksProviderSettings<E = never, R = never> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
```

## `VERSION`

The source declaration does not provide a JSDoc description.

```text
VERSION: string
```

