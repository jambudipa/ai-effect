---
title: groq provider API
doc-type: reference
sources: [src/providers/groq.ts, package.json]
---

# groq provider API

> **TL;DR:** This entry exposes 10 public exports through `@jambudipa/ai-effect/groq`.
> The contracts below come from the installed package declarations and JSDoc.

## Import

`@jambudipa/ai-effect/groq` selects the package export for this provider. See the [provider source](../../../src/providers/groq.ts).

## `browserSearch`

Build the Groq browser search tool descriptor lazily for use with a model that supports
it.

```text
browserSearch<Provided extends [options: AdaptOptions<{ onInputStart?: ((options: ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; onInputDelta?: ((options: { inputTextDelta: string; } & ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; onInputAvailable?: ((options: { input: {}; } & ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; }, unknown>]>(...args: Provided): Effect<AdaptedDescriptor<[options: { onInputStart?: ((options: ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; onInputDelta?: ((options: { inputTextDelta: string; } & ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; onInputAvailable?: ((options: { input: {}; } & ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; }], ProviderExecutedTool<{}, {}, {}>, Provided>, AiSdkError, never>
```

## `createGroq`

Construct the Groq provider inside an Effect. Keep the scope open when using an Effect
resolver for `apiKey`.

```text
createGroq(options?: StaticProviderSettings<GroqProviderSettings, "apiKey"> | undefined): Effect<((modelId: (string & {}) | "openai/gpt-oss-120b" | "openai/gpt-oss-20b" | "gemma2-9b-it" | "llama-3.1-8b-instant" | "llama-3.3-70b-versatile" | "meta-llama/llama-guard-4-12b" | "deepseek-r1-distill-llama-70b" | "meta-llama/llama-4-maverick-17b-128e-instruct" | "meta-llama/llama-4-scout-17b-16e-instruct" | "meta-llama/llama-prompt-guard-2-22m" | "meta-llama/llama-prompt-guard-2-86m" | "moonshotai/kimi-k2-instruct-0905" | "qwen/qwen3.6-27b" | "llama-guard-3-8b" | "llama3-70b-8192" | "llama3-8b-8192" | "mixtral-8x7b-32768" | "qwen-qwq-32b" | "qwen-2.5-32b" | "deepseek-r1-distill-qwen-32b") => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>) & { languageModel: (modelId: (string & {}) | "openai/gpt-oss-120b" | "openai/gpt-oss-20b" | "gemma2-9b-it" | "llama-3.1-8b-instant" | "llama-3.3-70b-versatile" | "meta-llama/llama-guard-4-12b" | "deepseek-r1-distill-llama-70b" | "meta-llama/llama-4-maverick-17b-128e-instruct" | "meta-llama/llama-4-scout-17b-16e-instruct" | "meta-llama/llama-prompt-guard-2-22m" | "meta-llama/llama-prompt-guard-2-86m" | "moonshotai/kimi-k2-instruct-0905" | "qwen/qwen3.6-27b" | "llama-guard-3-8b" | "llama3-70b-8192" | "llama3-8b-8192" | "mixtral-8x7b-32768" | "qwen-qwq-32b" | "qwen-2.5-32b" | "deepseek-r1-distill-qwen-32b") => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>; transcription: (modelId: (string & {}) | "whisper-large-v3" | "whisper-large-v3-turbo") => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; textEmbeddingModel: (modelId: string) => Effect<never, AiSdkError, never>; tools: AdaptedTools<{ browserSearch: ProviderExecutedToolFactory<{}, {}, {}, {}>; }>; specificationVersion: "v4"; embeddingModel: (modelId: string) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; imageModel: (modelId: string) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; transcriptionModel: ((modelId: string) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; speechModel: ((modelId: string) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; rerankingModel: ((modelId: string) => Effect<{ doRerank: (options: RerankingModelV4CallOptions) => Effect<RerankingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; files: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadFile: (options: FilesV4UploadFileCallOptions) => Effect<FilesV4UploadFileResult, AiSdkError, never>; getFileMetadata: ((options: FilesV4GetFileMetadataCallOptions) => Effect<FilesV4GetFileMetadataResult, AiSdkError, never>) | undefined; downloadFile: ((options: FilesV4DownloadFileCallOptions) => Effect<{ content: Stream<Uint8Array<ArrayBufferLike>, AiSdkError, never>; mediaType?: string | undefined; providerMetadata?: SharedV4ProviderMetadata | undefined; warnings: SharedV4Warning[]; }, AiSdkError, Scope>) | undefined; deleteFile: ((options: FilesV4DeleteFileCallOptions) => Effect<FilesV4DeleteFileResult, AiSdkError, never>) | undefined; }, AiSdkError, never>) | undefined; skills: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadSkill: (options: SkillsV4UploadSkillCallOptions) => Effect<SkillsV4UploadSkillResult, AiSdkError, never>; }, AiSdkError, never>) | undefined; }, AiSdkError, never>
createGroq<E, R>(options: EffectProviderSettings<GroqProviderSettings, "apiKey", E, R>): Effect<((modelId: (string & {}) | "openai/gpt-oss-120b" | "openai/gpt-oss-20b" | "gemma2-9b-it" | "llama-3.1-8b-instant" | "llama-3.3-70b-versatile" | "meta-llama/llama-guard-4-12b" | "deepseek-r1-distill-llama-70b" | "meta-llama/llama-4-maverick-17b-128e-instruct" | "meta-llama/llama-4-scout-17b-16e-instruct" | "meta-llama/llama-prompt-guard-2-22m" | "meta-llama/llama-prompt-guard-2-86m" | "moonshotai/kimi-k2-instruct-0905" | "qwen/qwen3.6-27b" | "llama-guard-3-8b" | "llama3-70b-8192" | "llama3-8b-8192" | "mixtral-8x7b-32768" | "qwen-qwq-32b" | "qwen-2.5-32b" | "deepseek-r1-distill-qwen-32b") => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>) & { languageModel: (modelId: (string & {}) | "openai/gpt-oss-120b" | "openai/gpt-oss-20b" | "gemma2-9b-it" | "llama-3.1-8b-instant" | "llama-3.3-70b-versatile" | "meta-llama/llama-guard-4-12b" | "deepseek-r1-distill-llama-70b" | "meta-llama/llama-4-maverick-17b-128e-instruct" | "meta-llama/llama-4-scout-17b-16e-instruct" | "meta-llama/llama-prompt-guard-2-22m" | "meta-llama/llama-prompt-guard-2-86m" | "moonshotai/kimi-k2-instruct-0905" | "qwen/qwen3.6-27b" | "llama-guard-3-8b" | "llama3-70b-8192" | "llama3-8b-8192" | "mixtral-8x7b-32768" | "qwen-qwq-32b" | "qwen-2.5-32b" | "deepseek-r1-distill-qwen-32b") => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>; transcription: (modelId: (string & {}) | "whisper-large-v3" | "whisper-large-v3-turbo") => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; textEmbeddingModel: (modelId: string) => Effect<never, AiSdkError, never>; tools: AdaptedTools<{ browserSearch: ProviderExecutedToolFactory<{}, {}, {}, {}>; }>; specificationVersion: "v4"; embeddingModel: (modelId: string) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; imageModel: (modelId: string) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; transcriptionModel: ((modelId: string) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; speechModel: ((modelId: string) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; rerankingModel: ((modelId: string) => Effect<{ doRerank: (options: RerankingModelV4CallOptions) => Effect<RerankingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; files: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadFile: (options: FilesV4UploadFileCallOptions) => Effect<FilesV4UploadFileResult, AiSdkError, never>; getFileMetadata: ((options: FilesV4GetFileMetadataCallOptions) => Effect<FilesV4GetFileMetadataResult, AiSdkError, never>) | undefined; downloadFile: ((options: FilesV4DownloadFileCallOptions) => Effect<{ content: Stream<Uint8Array<ArrayBufferLike>, AiSdkError, never>; mediaType?: string | undefined; providerMetadata?: SharedV4ProviderMetadata | undefined; warnings: SharedV4Warning[]; }, AiSdkError, Scope>) | undefined; deleteFile: ((options: FilesV4DeleteFileCallOptions) => Effect<FilesV4DeleteFileResult, AiSdkError, never>) | undefined; }, AiSdkError, never>) | undefined; skills: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadSkill: (options: SkillsV4UploadSkillCallOptions) => Effect<SkillsV4UploadSkillResult, AiSdkError, never>; }, AiSdkError, never>) | undefined; }, AiSdkError, Scope | R>
```

## `groq`

Adapt the preconfigured provider from the Groq SDK. Use the factory to supply explicit
settings.

```text
groq(modelId: (string & {}) | "openai/gpt-oss-120b" | "openai/gpt-oss-20b" | "gemma2-9b-it" | "llama-3.1-8b-instant" | "llama-3.3-70b-versatile" | "meta-llama/llama-guard-4-12b" | "deepseek-r1-distill-llama-70b" | "meta-llama/llama-4-maverick-17b-128e-instruct" | "meta-llama/llama-4-scout-17b-16e-instruct" | "meta-llama/llama-prompt-guard-2-22m" | "meta-llama/llama-prompt-guard-2-86m" | "moonshotai/kimi-k2-instruct-0905" | "qwen/qwen3.6-27b" | "llama-guard-3-8b" | "llama3-70b-8192" | "llama3-8b-8192" | "mixtral-8x7b-32768" | "qwen-qwq-32b" | "qwen-2.5-32b" | "deepseek-r1-distill-qwen-32b"): Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

### Public properties

#### `groq.embeddingModel`

```text
(modelId: string) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `groq.files`

```text
(() => Effect<{ specificationVersion: "v4"; provider: string; uploadFile: (options: FilesV4UploadFileCallOptions) => Effect<FilesV4UploadFileResult, AiSdkError, never>; getFileMetadata: ((options: FilesV4GetFileMetadataCallOptions) => Effect<FilesV4GetFileMetadataResult, AiSdkError, never>) | undefined; downloadFile: ((options: FilesV4DownloadFileCallOptions) => Effect<{ content: Stream<Uint8Array<ArrayBufferLike>, AiSdkError, never>; mediaType?: string | undefined; providerMetadata?: SharedV4ProviderMetadata | undefined; warnings: SharedV4Warning[]; }, AiSdkError, Scope>) | undefined; deleteFile: ((options: FilesV4DeleteFileCallOptions) => Effect<FilesV4DeleteFileResult, AiSdkError, never>) | undefined; }, AiSdkError, never>) | undefined
```

#### `groq.imageModel`

```text
(modelId: string) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `groq.languageModel`

```text
(modelId: (string & {}) | "openai/gpt-oss-120b" | "openai/gpt-oss-20b" | "gemma2-9b-it" | "llama-3.1-8b-instant" | "llama-3.3-70b-versatile" | "meta-llama/llama-guard-4-12b" | "deepseek-r1-distill-llama-70b" | "meta-llama/llama-4-maverick-17b-128e-instruct" | "meta-llama/llama-4-scout-17b-16e-instruct" | "meta-llama/llama-prompt-guard-2-22m" | "meta-llama/llama-prompt-guard-2-86m" | "moonshotai/kimi-k2-instruct-0905" | "qwen/qwen3.6-27b" | "llama-guard-3-8b" | "llama3-70b-8192" | "llama3-8b-8192" | "mixtral-8x7b-32768" | "qwen-qwq-32b" | "qwen-2.5-32b" | "deepseek-r1-distill-qwen-32b") => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

#### `groq.rerankingModel`

```text
((modelId: string) => Effect<{ doRerank: (options: RerankingModelV4CallOptions) => Effect<RerankingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined
```

#### `groq.skills`

```text
(() => Effect<{ specificationVersion: "v4"; provider: string; uploadSkill: (options: SkillsV4UploadSkillCallOptions) => Effect<SkillsV4UploadSkillResult, AiSdkError, never>; }, AiSdkError, never>) | undefined
```

#### `groq.specificationVersion`

```text
"v4"
```

#### `groq.speechModel`

```text
((modelId: string) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined
```

#### `groq.textEmbeddingModel`

```text
(modelId: string) => Effect<never, AiSdkError, never>
```

#### `groq.tools`

```text
AdaptedTools<{ browserSearch: ProviderExecutedToolFactory<{}, {}, {}, {}>; }>
```

#### `groq.transcription`

```text
(modelId: (string & {}) | "whisper-large-v3" | "whisper-large-v3-turbo") => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `groq.transcriptionModel`

```text
((modelId: string) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined
```


## `GroqLanguageModelChatOptions`

The source declaration does not provide a JSDoc description.

```text
type GroqLanguageModelChatOptions = z.infer<typeof groqLanguageModelChatOptions>;
```

## `GroqLanguageModelOptions`

The source declaration does not provide a JSDoc description.

```text
type GroqLanguageModelChatOptions = z.infer<typeof groqLanguageModelChatOptions>;
```

## `GroqProvider`

Provider returned by the adapter, with Effect-based model selection for Groq.

```text
export type GroqProvider = ReturnType<typeof wrapProvider>;
```

## `GroqProviderOptions`

The source declaration does not provide a JSDoc description.

```text
type GroqLanguageModelChatOptions = z.infer<typeof groqLanguageModelChatOptions>;
```

## `GroqProviderSettings`

Keep the native Groq options and allow `apiKey` to resolve through Effect when the SDK
requests the value.

```text
export type GroqProviderSettings<E = never, R = never> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
```

## `GroqTranscriptionModelOptions`

The source declaration does not provide a JSDoc description.

```text
type GroqTranscriptionModelOptions = InferSchema<typeof groqTranscriptionModelOptions>;
```

## `VERSION`

The source declaration does not provide a JSDoc description.

```text
VERSION: string
```

