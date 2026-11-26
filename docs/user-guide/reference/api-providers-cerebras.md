---
title: cerebras provider API
doc-type: reference
sources: [src/providers/cerebras.ts, package.json]
---

# cerebras provider API

> **TL;DR:** This entry exposes 11 public exports through `@jambudipa/ai-effect/cerebras`.
> The contracts below come from the installed package declarations and JSDoc.

## Import

`@jambudipa/ai-effect/cerebras` selects the package export for this provider. See the [provider source](../../../src/providers/cerebras.ts).

## `cerebras`

Use Cerebras with its default settings. Requests start on execution.

```text
cerebras(modelId: (string & {}) | "gpt-oss-120b" | "gemma-4-31b"): Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

### Public properties

#### `cerebras.chat`

```text
(modelId: (string & {}) | "gpt-oss-120b" | "gemma-4-31b") => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

#### `cerebras.embeddingModel`

```text
(modelId: string) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `cerebras.files`

```text
(() => Effect<{ specificationVersion: "v4"; provider: string; uploadFile: (options: FilesV4UploadFileCallOptions) => Effect<FilesV4UploadFileResult, AiSdkError, never>; getFileMetadata: ((options: FilesV4GetFileMetadataCallOptions) => Effect<FilesV4GetFileMetadataResult, AiSdkError, never>) | undefined; downloadFile: ((options: FilesV4DownloadFileCallOptions) => Effect<{ content: Stream<Uint8Array<ArrayBufferLike>, AiSdkError, never>; mediaType?: string | undefined; providerMetadata?: SharedV4ProviderMetadata | undefined; warnings: SharedV4Warning[]; }, AiSdkError, Scope>) | undefined; deleteFile: ((options: FilesV4DeleteFileCallOptions) => Effect<FilesV4DeleteFileResult, AiSdkError, never>) | undefined; }, AiSdkError, never>) | undefined
```

#### `cerebras.imageModel`

```text
(modelId: string) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `cerebras.languageModel`

```text
(modelId: (string & {}) | "gpt-oss-120b" | "gemma-4-31b") => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

#### `cerebras.rerankingModel`

```text
((modelId: string) => Effect<{ doRerank: (options: RerankingModelV4CallOptions) => Effect<RerankingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined
```

#### `cerebras.skills`

```text
(() => Effect<{ specificationVersion: "v4"; provider: string; uploadSkill: (options: SkillsV4UploadSkillCallOptions) => Effect<SkillsV4UploadSkillResult, AiSdkError, never>; }, AiSdkError, never>) | undefined
```

#### `cerebras.specificationVersion`

```text
"v4"
```

#### `cerebras.speechModel`

```text
((modelId: string) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined
```

#### `cerebras.textEmbeddingModel`

```text
(modelId: string) => Effect<never, AiSdkError, never>
```

#### `cerebras.transcriptionModel`

```text
((modelId: string) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined
```


## `CerebrasErrorData`

The source declaration does not provide a JSDoc description.

```text
type CerebrasErrorData = z.infer<typeof cerebrasErrorSchema>;
```

## `CerebrasLanguageModelChatOptions`

The source declaration does not provide a JSDoc description.

```text
type CerebrasLanguageModelChatOptions = z.infer<typeof cerebrasLanguageModelChatOptions>;
```

## `CerebrasProvider`

The callable Cerebras provider and its model selectors.

```text
export type CerebrasProvider = ReturnType<typeof wrapCerebras>;
```

## `CerebrasProviderSettings`

Cerebras connection settings. A credential Effect runs when the SDK requests it.

```text
export interface CerebrasProviderSettings<E = never, R = never> {
    /**
     * Supply the credential directly or as an Effect that runs when the SDK asks for the
     * key.
     */
    readonly apiKey?: ProviderSetting<string, E, R>;
    /** Override the Cerebras SDK endpoint for deployments with a custom base URL. */
    readonly baseURL?: string;
    /** Add headers to requests made by the native provider. */
    readonly headers?: Record<string, string>;
    /**
     * Supply the SDK fetch implementation for transport interception or a custom runtime.
     */
    readonly fetch?: typeof globalThis.fetch;
}
```

## `createCerebras`

Build the Cerebras provider inside an Effect. The Effect key resolver overload requires
a scope.

```text
createCerebras(options?: PlainCerebrasSettings | undefined): Effect<((modelId: (string & {}) | "gpt-oss-120b" | "gemma-4-31b") => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>) & { languageModel: (modelId: (string & {}) | "gpt-oss-120b" | "gemma-4-31b") => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>; chat: (modelId: (string & {}) | "gpt-oss-120b" | "gemma-4-31b") => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>; textEmbeddingModel: (modelId: string) => Effect<never, AiSdkError, never>; specificationVersion: "v4"; embeddingModel: (modelId: string) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; imageModel: (modelId: string) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; transcriptionModel: ((modelId: string) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; speechModel: ((modelId: string) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; rerankingModel: ((modelId: string) => Effect<{ doRerank: (options: RerankingModelV4CallOptions) => Effect<RerankingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; files: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadFile: (options: FilesV4UploadFileCallOptions) => Effect<FilesV4UploadFileResult, AiSdkError, never>; getFileMetadata: ((options: FilesV4GetFileMetadataCallOptions) => Effect<FilesV4GetFileMetadataResult, AiSdkError, never>) | undefined; downloadFile: ((options: FilesV4DownloadFileCallOptions) => Effect<{ content: Stream<Uint8Array<ArrayBufferLike>, AiSdkError, never>; mediaType?: string | undefined; providerMetadata?: SharedV4ProviderMetadata | undefined; warnings: SharedV4Warning[]; }, AiSdkError, Scope>) | undefined; deleteFile: ((options: FilesV4DeleteFileCallOptions) => Effect<FilesV4DeleteFileResult, AiSdkError, never>) | undefined; }, AiSdkError, never>) | undefined; skills: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadSkill: (options: SkillsV4UploadSkillCallOptions) => Effect<SkillsV4UploadSkillResult, AiSdkError, never>; }, AiSdkError, never>) | undefined; }, AiSdkError, never>
createCerebras<E, R>(options: CerebrasProviderSettings<E, R>): Effect<((modelId: (string & {}) | "gpt-oss-120b" | "gemma-4-31b") => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>) & { languageModel: (modelId: (string & {}) | "gpt-oss-120b" | "gemma-4-31b") => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>; chat: (modelId: (string & {}) | "gpt-oss-120b" | "gemma-4-31b") => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>; textEmbeddingModel: (modelId: string) => Effect<never, AiSdkError, never>; specificationVersion: "v4"; embeddingModel: (modelId: string) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; imageModel: (modelId: string) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; transcriptionModel: ((modelId: string) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; speechModel: ((modelId: string) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; rerankingModel: ((modelId: string) => Effect<{ doRerank: (options: RerankingModelV4CallOptions) => Effect<RerankingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; files: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadFile: (options: FilesV4UploadFileCallOptions) => Effect<FilesV4UploadFileResult, AiSdkError, never>; getFileMetadata: ((options: FilesV4GetFileMetadataCallOptions) => Effect<FilesV4GetFileMetadataResult, AiSdkError, never>) | undefined; downloadFile: ((options: FilesV4DownloadFileCallOptions) => Effect<{ content: Stream<Uint8Array<ArrayBufferLike>, AiSdkError, never>; mediaType?: string | undefined; providerMetadata?: SharedV4ProviderMetadata | undefined; warnings: SharedV4Warning[]; }, AiSdkError, Scope>) | undefined; deleteFile: ((options: FilesV4DeleteFileCallOptions) => Effect<FilesV4DeleteFileResult, AiSdkError, never>) | undefined; }, AiSdkError, never>) | undefined; skills: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadSkill: (options: SkillsV4UploadSkillCallOptions) => Effect<SkillsV4UploadSkillResult, AiSdkError, never>; }, AiSdkError, never>) | undefined; }, AiSdkError, Scope | R>
```

## `LanguageModelV4`

An Effect handle to a v4 SDK language model.

```text
export type LanguageModelV4 = ReturnType<typeof wrapLanguageModel>;
```

## `LanguageModelV4CallOptions`

The source declaration does not provide a JSDoc description.

```text
export type LanguageModelV4CallOptions = {
  /**
   * A language mode prompt is a standardized prompt type.
   *
   * Note: This is **not** the user-facing prompt. The AI SDK methods will map the
   * user-facing prompt types such as chat or instruction prompts to this format.
   * That approach allows us to evolve the user  facing prompts without breaking
   * the language model interface.
   */
  prompt: LanguageModelV4Prompt;
  /**
   * Maximum number of tokens to generate.
   */
  maxOutputTokens?: number;
  /**
   * Temperature setting. The range depends on the provider and model.
   */
  temperature?: number;
  /**
   * Stop sequences.
   * If set, the model will stop generating text when one of the stop sequences is generated.
   * Providers may have limits on the number of stop sequences.
   */
  stopSequences?: string[];
  /**
   * Nucleus sampling.
   */
  topP?: number;
  /**
   * Only sample from the top K options for each subsequent token.
   *
   * Used to remove "long tail" low probability responses.
   * Recommended for advanced use cases only. You usually only need to use temperature.
   */
  topK?: number;
  /**
   * Presence penalty setting. It affects the likelihood of the model to
   * repeat information that is already in the prompt.
   */
  presencePenalty?: number;
  /**
   * Frequency penalty setting. It affects the likelihood of the model
   * to repeatedly use the same words or phrases.
   */
  frequencyPenalty?: number;
  /**
   * Response format. The output can either be text or JSON. Default is text.
   *
   * If JSON is selected, a schema can optionally be provided to guide the LLM.
   */
  responseFormat?: {
    type: 'text';
  } | {
    type: 'json';
    /**
     * JSON schema that the generated output should conform to.
     */
    schema?: JSONSchema7$1;
    /**
     * Name of output that should be generated. Used by some providers for additional LLM guidance.
     */
    name?: string;
    /**
     * Description of the output that should be generated. Used by some providers for additional LLM guidance.
     */
    description?: string;
  };
  /**
   * The seed (integer) to use for random sampling. If set and supported
   * by the model, calls will generate deterministic results.
   */
  seed?: number;
  /**
   * The tools that are available for the model.
   */
  tools?: Array<LanguageModelV4FunctionTool | LanguageModelV4ProviderTool>;
  /**
   * Specifies how the tool should be selected. Defaults to 'auto'.
   */
  toolChoice?: LanguageModelV4ToolChoice;
  /**
   * Include raw chunks in the stream. Only applicable for streaming calls.
   */
  includeRawChunks?: boolean;
  /**
   * Abort signal for cancelling the operation.
   */
  abortSignal?: AbortSignal;
  /**
   * Additional HTTP headers to be sent with the request.
   * Only applicable for HTTP-based providers.
   */
  headers?: Record<string, string | undefined>;
  /**
   * Reasoning effort level for the model. Controls how much reasoning
   * the model performs before generating a response. Defaults to 'provider-default'.
   */
  reasoning?: 'provider-default' | 'none' | 'minimal' | 'low' | 'medium' | 'high' | 'xhigh' | 'max';
  /**
   * Additional provider-specific options. They are passed through
   * to the provider from the AI SDK and enable provider-specific
   * functionality that can be fully encapsulated in the provider.
   */
  providerOptions?: SharedV4ProviderOptions;
};
```

## `LanguageModelV4GenerateResult`

The result of a language model doGenerate call.

```text
export type LanguageModelV4GenerateResult = {
  /**
   * Ordered content that the model has generated.
   */
  content: Array<LanguageModelV4Content>;
  /**
   * Text to parse for structured JSON output when it differs from the
   * concatenation of all text parts in `content` (e.g. drafts followed by a
   * final answer). This does not replace or remove any generated content.
   *
   * When omitted, consumers concatenate all text parts. An empty string is
   * an explicit selection and must not fall back to the other text parts.
   */
  structuredOutputText?: string;
  /**
   * The finish reason.
   */
  finishReason: LanguageModelV4FinishReason;
  /**
   * The usage information.
   */
  usage: LanguageModelV4Usage;
  /**
   * Additional provider-specific metadata. They are passed through
   * from the provider to the AI SDK and enable provider-specific
   * results that can be fully encapsulated in the provider.
   */
  providerMetadata?: SharedV4ProviderMetadata;
  /**
   * Optional request information for telemetry and debugging purposes.
   */
  request?: {
    /** The actual HTTP endpoint used for this request, when known. */
    url?: string;
    /**
     * Request HTTP body that was sent to the provider API.
     */
    body?: unknown;
  };
  /**
   * Optional response information for telemetry and debugging purposes.
   */
  response?: LanguageModelV4ResponseMetadata & {
    /**
     * Response headers.
     */
    headers?: SharedV4Headers;
    /**
     * Response HTTP body.
     */
    body?: unknown;
  };
  /**
   * Warnings for the call, e.g. unsupported settings.
   */
  warnings: Array<SharedV4Warning>;
};
```

## `LanguageModelV4StreamPart`

The source declaration does not provide a JSDoc description.

```text
export type LanguageModelV4StreamPart = {
  type: 'text-start';
  providerMetadata?: SharedV4ProviderMetadata;
  id: string;
} | {
  type: 'text-delta';
  id: string;
  providerMetadata?: SharedV4ProviderMetadata;
  delta: string;
} | {
  type: 'text-end';
  /** References supporting the text block with this ID. */
  citations?: Array<LanguageModelV4Citation>;
  providerMetadata?: SharedV4ProviderMetadata;
  id: string;
} | {
  type: 'reasoning-start';
  providerMetadata?: SharedV4ProviderMetadata;
  id: string;
} | {
  type: 'reasoning-delta';
  id: string;
  providerMetadata?: SharedV4ProviderMetadata;
  delta: string;
} | {
  type: 'reasoning-end';
  id: string;
  providerMetadata?: SharedV4ProviderMetadata;
} | {
  type: 'tool-input-start';
  id: string;
  toolName: string;
  /**
   * Encoding of the input deltas. Defaults to JSON when omitted.
   * Text deltas concatenate to a raw string. The final tool-call input
   * must still be JSON-encoded, regardless of the delta encoding.
   */
  inputEncoding?: 'json' | 'text';
  providerMetadata?: SharedV4ProviderMetadata;
  providerExecuted?: boolean;
  dynamic?: boolean;
  title?: string;
} | {
  type: 'tool-input-delta';
  id: string;
  delta: string;
  providerMetadata?: SharedV4ProviderMetadata;
} | {
  type: 'tool-input-end';
  id: string;
  providerMetadata?: SharedV4ProviderMetadata;
} | LanguageModelV4ToolApprovalRequest | LanguageModelV4ToolCall | LanguageModelV4ToolResult | LanguageModelV4CustomContent | LanguageModelV4File | LanguageModelV4ReasoningFile | LanguageModelV4Source | {
  type: 'stream-start';
  warnings: Array<SharedV4Warning>;
} | ({
  type: 'response-metadata';
} & LanguageModelV4ResponseMetadata) | {
  type: 'finish';
  usage: LanguageModelV4Usage;
  finishReason: LanguageModelV4FinishReason;
  providerMetadata?: SharedV4ProviderMetadata;
} | {
  type: 'ping';
} | {
  type: 'raw';
  rawValue: unknown;
} | {
  type: 'error';
  error: unknown;
};
```

## `VERSION`

The source declaration does not provide a JSDoc description.

```text
VERSION: string
```
