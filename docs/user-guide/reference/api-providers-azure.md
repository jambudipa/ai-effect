---
title: azure provider API
doc-type: reference
sources: [src/providers/azure.ts, package.json]
---

# azure provider API

> **TL;DR:** This entry exposes 21 public exports through `@jambudipa/ai-effect/azure`.
> The contracts below come from the installed package declarations and JSDoc.

## Import

`@jambudipa/ai-effect/azure` selects the package export for this provider. See the [provider source](../../../src/providers/azure.ts).

## `azure`

Adapt the preconfigured provider from the Azure OpenAI SDK. Use the factory to supply
explicit settings.

```text
azure(deploymentId: string, settings?: AzureOpenAILanguageModelSettings | undefined): Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

### Public properties

#### `azure.chat`

```text
(deploymentId: string, settings?: AzureOpenAILanguageModelSettings | undefined) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

#### `azure.completion`

```text
(deploymentId: string, settings?: AzureOpenAILanguageModelSettings | undefined) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

#### `azure.deepseek`

```text
(deploymentId: string) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

#### `azure.embedding`

```text
(deploymentId: string) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `azure.embeddingModel`

```text
(deploymentId: string) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `azure.files`

```text
(() => Effect<{ specificationVersion: "v4"; provider: string; uploadFile: (options: FilesV4UploadFileCallOptions) => Effect<FilesV4UploadFileResult, AiSdkError, never>; getFileMetadata: ((options: FilesV4GetFileMetadataCallOptions) => Effect<FilesV4GetFileMetadataResult, AiSdkError, never>) | undefined; downloadFile: ((options: FilesV4DownloadFileCallOptions) => Effect<{ content: Stream<Uint8Array<ArrayBufferLike>, AiSdkError, never>; mediaType?: string | undefined; providerMetadata?: SharedV4ProviderMetadata | undefined; warnings: SharedV4Warning[]; }, AiSdkError, Scope>) | undefined; deleteFile: ((options: FilesV4DeleteFileCallOptions) => Effect<FilesV4DeleteFileResult, AiSdkError, never>) | undefined; }, AiSdkError, never>) | undefined
```

#### `azure.image`

```text
(deploymentId: string) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `azure.imageModel`

```text
(deploymentId: string) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `azure.languageModel`

```text
(deploymentId: string, settings?: AzureOpenAILanguageModelSettings | undefined) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

#### `azure.rerankingModel`

```text
((modelId: string) => Effect<{ doRerank: (options: RerankingModelV4CallOptions) => Effect<RerankingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined
```

#### `azure.responses`

```text
(deploymentId: string, settings?: AzureOpenAILanguageModelSettings | undefined) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

#### `azure.skills`

```text
(() => Effect<{ specificationVersion: "v4"; provider: string; uploadSkill: (options: SkillsV4UploadSkillCallOptions) => Effect<SkillsV4UploadSkillResult, AiSdkError, never>; }, AiSdkError, never>) | undefined
```

#### `azure.specificationVersion`

```text
"v4"
```

#### `azure.speech`

```text
(deploymentId: string) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `azure.speechModel`

```text
(deploymentId: string) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `azure.textEmbedding`

```text
(deploymentId: string) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `azure.textEmbeddingModel`

```text
(deploymentId: string) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `azure.tools`

```text
AdaptedTools<{ applyPatch: ProviderDefinedToolFactoryWithOutputSchema<{ callId: string; operation: ApplyPatchOperation; }, { status: "completed" | "failed"; output?: string | undefined; }, {}, {}>; codeInterpreter: (args?: { container?: string | { fileIds?: string[] | undefined; memoryLimit?: "1g" | "4g" | "16g" | "64g" | undefined; networkPolicy?: { type: "disabled"; } | { type: "allowlist"; allowedDomains: string[]; domainSecrets?: { domain: string; name: string; value: string; }[] | undefined; } | undefined; } | undefined; } | undefined) => ProviderExecutedTool<{ code?: string | null | undefined; containerId: string; }, { outputs?: ({ type: "logs"; logs: string; } | { type: "image"; url: string; })[] | null | undefined; }, {}>; customTool: (args: { description?: string | undefined; async?: boolean | undefined; format?: { type: "grammar"; syntax: "regex" | "lark"; definition: string; } | { type: "text"; } | undefined; } & { execute?: ToolExecuteFunction<string, unknown, {}> | undefined; needsApproval?: boolean | ToolNeedsApprovalFunction<string, {}> | undefined; toModelOutput?: ((options: { toolCallId: string; input: string; output: unknown; }) => ToolResultOutput | PromiseLike<ToolResultOutput>) | undefined; onInputStart?: ((options: ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; onInputDelta?: ((options: { inputTextDelta: string; } & ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; onInputAvailable?: ((options: { input: string; } & ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; }) => ProviderDefinedTool<string, unknown, {}>; fileSearch: ProviderExecutedToolFactory<{}, { queries: string[]; results: { attributes: Record<string, unknown>; fileId: string; filename: string; score: number; text: string; }[] | null; }, { vectorStoreIds: string[]; maxNumResults?: number | undefined; ranking?: { ranker?: string | undefined; scoreThreshold?: number | undefined; } | undefined; filters?: OpenAIResponsesFileSearchToolComparisonFilter | OpenAIResponsesFileSearchToolCompoundFilter | undefined; }, {}>; imageGeneration: (args?: { action?: "generate" | "edit" | "auto" | undefined; background?: "auto" | "opaque" | "transparent" | undefined; inputFidelity?: "low" | "high" | undefined; inputImageMask?: { fileId?: string | undefined; imageUrl?: string | undefined; } | undefined; model?: string | undefined; moderation?: "auto" | "low" | undefined; outputCompression?: number | undefined; outputFormat?: "png" | "jpeg" | "webp" | undefined; partialImages?: number | undefined; quality?: "auto" | "low" | "high" | "medium" | "xhigh" | "max" | undefined; size?: (string & {}) | "auto" | "1024x1024" | "1024x1536" | "1536x1024" | undefined; } | undefined) => ProviderExecutedTool<{}, { result: string; }, {}>; shell: ProviderDefinedToolFactoryWithOutputSchema<{ action: { commands: string[]; timeoutMs?: number | undefined; maxOutputLength?: number | undefined; }; }, { maxOutputLength?: number | undefined; output: { stdout: string; stderr: string; outcome: { type: "timeout"; } | { type: "exit"; exitCode: number; }; }[]; }, { environment?: { type: "containerAuto"; fileIds?: string[] | undefined; memoryLimit?: "1g" | "4g" | "16g" | "64g" | undefined; networkPolicy?: { type: "disabled"; } | { type: "allowlist"; allowedDomains: string[]; domainSecrets?: { domain: string; name: string; value: string; }[] | undefined; } | undefined; skills?: ({ type: "skillReference"; providerReference: SharedV4ProviderReference; version?: string | undefined; } | { type: "inline"; name: string; description: string; source: { type: "base64"; mediaType: "application/zip"; data: string; }; })[] | undefined; } | { type: "containerReference"; containerId: string; } | { type?: "local" | undefined; skills?: { name: string; description: string; path: string; }[] | undefined; } | undefined; }, {}>; toolSearch: (args?: ({ execution?: "server" | "client" | undefined; description?: string | undefined; parameters?: Record<string, unknown> | undefined; } & { execute?: ToolExecuteFunction<{ arguments?: unknown; call_id?: string | null | undefined; }, { tools: JSONObject[]; }, {}> | undefined; needsApproval?: boolean | ToolNeedsApprovalFunction<{ arguments?: unknown; call_id?: string | null | undefined; }, {}> | undefined; toModelOutput?: ((options: { toolCallId: string; input: { arguments?: unknown; call_id?: string | null | undefined; }; output: NoInfer<{ tools: JSONObject[]; }>; }) => ToolResultOutput | PromiseLike<ToolResultOutput>) | undefined; onInputStart?: ((options: ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; onInputDelta?: ((options: { inputTextDelta: string; } & ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; onInputAvailable?: ((options: { input: { arguments?: unknown; call_id?: string | null | undefined; }; } & ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; }) | undefined) => ProviderDefinedTool<{ arguments?: unknown; call_id?: string | null | undefined; }, { tools: JSONObject[]; }, {}>; webSearch: (args?: ({ externalWebAccess?: boolean | undefined; filters?: { allowedDomains?: string[] | undefined; blockedDomains?: string[] | undefined; } | undefined; searchContextSize?: "low" | "high" | "medium" | undefined; userLocation?: { type: "approximate"; country?: string | undefined; city?: string | undefined; region?: string | undefined; timezone?: string | undefined; } | undefined; } & { onInputStart?: ((options: ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; onInputDelta?: ((options: { inputTextDelta: string; } & ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; onInputAvailable?: ((options: { input: {}; } & ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; }) | undefined) => ProviderExecutedTool<{}, { action?: { type: "search"; query?: string | undefined; queries?: string[] | undefined; } | { type: "openPage"; url?: string | null | undefined; } | { type: "findInPage"; url?: string | null | undefined; pattern?: string | null | undefined; } | undefined; sources?: ({ type: "url"; url: string; } | { type: "api"; name: string; })[] | undefined; }, {}>; webSearchPreview: ProviderExecutedToolFactory<{}, { action?: { type: "search"; query?: string | undefined; } | { type: "openPage"; url?: string | null | undefined; } | { type: "findInPage"; url?: string | null | undefined; pattern?: string | null | undefined; } | undefined; }, { searchContextSize?: "low" | "high" | "medium" | undefined; userLocation?: { type: "approximate"; country?: string | undefined; city?: string | undefined; region?: string | undefined; timezone?: string | undefined; } | undefined; }, {}>; }>
```

#### `azure.transcription`

```text
(deploymentId: string) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `azure.transcriptionModel`

```text
(deploymentId: string) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```


## `AzureDeepSeekChatOptions`

The source declaration does not provide a JSDoc description.

```text
export type AzureDeepSeekChatOptions = AzureDeepSeekLanguageModelOptions;
```

## `AzureDeepSeekLanguageModelOptions`

The source declaration does not provide a JSDoc description.

```text
export type AzureDeepSeekLanguageModelOptions = Omit<
  DeepSeekLanguageModelChatOptions,
  'thinking'
>;
```

## `AzureImageModelOptions`

The source declaration does not provide a JSDoc description.

```text
type AzureImageModelOptions = InferSchema<typeof azureImageModelOptions>;
```

## `AzureOpenAILanguageModelSettings`

The source declaration does not provide a JSDoc description.

```text
interface AzureOpenAILanguageModelSettings {
  modelId?: string;
}
```

## `AzureOpenAIProvider`

Provider returned by the adapter, with Effect-based model selection for Azure OpenAI.

```text
export type AzureOpenAIProvider = ReturnType<typeof wrapProvider>;
```

## `AzureOpenAIProviderSettings`

Keep the native Azure OpenAI options and allow the SDK to obtain `apiKey` and
`tokenProvider` through Effect resolvers.

```text
export type AzureOpenAIProviderSettings<E = never, R = never> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
```

## `AzureResponsesProviderMetadata`

The source declaration does not provide a JSDoc description.

```text
type AzureResponsesProviderMetadata = {
  azure: ResponsesProviderMetadata;
};
```

## `AzureResponsesReasoningProviderMetadata`

The source declaration does not provide a JSDoc description.

```text
type AzureResponsesReasoningProviderMetadata = {
  azure: ResponsesReasoningProviderMetadata;
};
```

## `AzureResponsesSourceDocumentProviderMetadata`

The source declaration does not provide a JSDoc description.

```text
type AzureResponsesSourceDocumentProviderMetadata = {
  azure: ResponsesSourceDocumentProviderMetadata;
};
```

## `AzureResponsesTextProviderMetadata`

The source declaration does not provide a JSDoc description.

```text
type AzureResponsesTextProviderMetadata = {
  azure: ResponsesTextProviderMetadata;
};
```

## `AzureSpeechModelOptions`

The source declaration does not provide a JSDoc description.

```text
type AzureSpeechModelOptions = InferSchema<typeof azureSpeechModelOptions>;
```

## `AzureTranscriptionModelOptions`

The source declaration does not provide a JSDoc description.

```text
type AzureTranscriptionModelOptions = InferSchema<
  typeof azureTranscriptionModelOptions
>;
```

## `AzureTranscriptionProviderMetadata`

The source declaration does not provide a JSDoc description.

```text
type AzureTranscriptionProviderMetadata = {
  azure: {
    phrases: Array<{
      text: string;
      offsetMilliseconds?: number | null;
      durationMilliseconds?: number | null;
      locale?: string | null;
      speaker?: number | null;
      confidence?: number | null;
      words?: Array<{
        text: string;
        offsetMilliseconds?: number | null;
        durationMilliseconds?: number | null;
      }> | null;
    }>;
  };
};
```

## `createAzure`

Construct the Azure OpenAI provider inside an Effect. Keep the scope open when using an
Effect resolver for `apiKey` and `tokenProvider`.

```text
createAzure(options?: StaticProviderSettings<AzureOpenAIProviderSettings, ResolverKey> | undefined): Effect<((deploymentId: string, settings?: AzureOpenAILanguageModelSettings | undefined) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>) & { languageModel: (deploymentId: string, settings?: AzureOpenAILanguageModelSettings | undefined) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>; chat: (deploymentId: string, settings?: AzureOpenAILanguageModelSettings | undefined) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>; deepseek: (deploymentId: string) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>; responses: (deploymentId: string, settings?: AzureOpenAILanguageModelSettings | undefined) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>; completion: (deploymentId: string, settings?: AzureOpenAILanguageModelSettings | undefined) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>; embedding: (deploymentId: string) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; embeddingModel: (deploymentId: string) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; textEmbedding: (deploymentId: string) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; textEmbeddingModel: (deploymentId: string) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; image: (deploymentId: string) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; imageModel: (deploymentId: string) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; transcription: (deploymentId: string) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; transcriptionModel: (deploymentId: string) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; speech: (deploymentId: string) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; speechModel: (deploymentId: string) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; tools: AdaptedTools<{ applyPatch: ProviderDefinedToolFactoryWithOutputSchema<{ callId: string; operation: ApplyPatchOperation; }, { status: "completed" | "failed"; output?: string | undefined; }, {}, {}>; codeInterpreter: (args?: { container?: string | { fileIds?: string[] | undefined; memoryLimit?: "1g" | "4g" | "16g" | "64g" | undefined; networkPolicy?: { type: "disabled"; } | { type: "allowlist"; allowedDomains: string[]; domainSecrets?: { domain: string; name: string; value: string; }[] | undefined; } | undefined; } | undefined; } | undefined) => ProviderExecutedTool<{ code?: string | null | undefined; containerId: string; }, { outputs?: ({ type: "logs"; logs: string; } | { type: "image"; url: string; })[] | null | undefined; }, {}>; customTool: (args: { description?: string | undefined; async?: boolean | undefined; format?: { type: "grammar"; syntax: "regex" | "lark"; definition: string; } | { type: "text"; } | undefined; } & { execute?: ToolExecuteFunction<string, unknown, {}> | undefined; needsApproval?: boolean | ToolNeedsApprovalFunction<string, {}> | undefined; toModelOutput?: ((options: { toolCallId: string; input: string; output: unknown; }) => ToolResultOutput | PromiseLike<ToolResultOutput>) | undefined; onInputStart?: ((options: ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; onInputDelta?: ((options: { inputTextDelta: string; } & ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; onInputAvailable?: ((options: { input: string; } & ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; }) => ProviderDefinedTool<string, unknown, {}>; fileSearch: ProviderExecutedToolFactory<{}, { queries: string[]; results: { attributes: Record<string, unknown>; fileId: string; filename: string; score: number; text: string; }[] | null; }, { vectorStoreIds: string[]; maxNumResults?: number | undefined; ranking?: { ranker?: string | undefined; scoreThreshold?: number | undefined; } | undefined; filters?: OpenAIResponsesFileSearchToolComparisonFilter | OpenAIResponsesFileSearchToolCompoundFilter | undefined; }, {}>; imageGeneration: (args?: { action?: "generate" | "edit" | "auto" | undefined; background?: "auto" | "opaque" | "transparent" | undefined; inputFidelity?: "low" | "high" | undefined; inputImageMask?: { fileId?: string | undefined; imageUrl?: string | undefined; } | undefined; model?: string | undefined; moderation?: "auto" | "low" | undefined; outputCompression?: number | undefined; outputFormat?: "png" | "jpeg" | "webp" | undefined; partialImages?: number | undefined; quality?: "auto" | "low" | "high" | "medium" | "xhigh" | "max" | undefined; size?: (string & {}) | "auto" | "1024x1024" | "1024x1536" | "1536x1024" | undefined; } | undefined) => ProviderExecutedTool<{}, { result: string; }, {}>; shell: ProviderDefinedToolFactoryWithOutputSchema<{ action: { commands: string[]; timeoutMs?: number | undefined; maxOutputLength?: number | undefined; }; }, { maxOutputLength?: number | undefined; output: { stdout: string; stderr: string; outcome: { type: "timeout"; } | { type: "exit"; exitCode: number; }; }[]; }, { environment?: { type: "containerAuto"; fileIds?: string[] | undefined; memoryLimit?: "1g" | "4g" | "16g" | "64g" | undefined; networkPolicy?: { type: "disabled"; } | { type: "allowlist"; allowedDomains: string[]; domainSecrets?: { domain: string; name: string; value: string; }[] | undefined; } | undefined; skills?: ({ type: "skillReference"; providerReference: SharedV4ProviderReference; version?: string | undefined; } | { type: "inline"; name: string; description: string; source: { type: "base64"; mediaType: "application/zip"; data: string; }; })[] | undefined; } | { type: "containerReference"; containerId: string; } | { type?: "local" | undefined; skills?: { name: string; description: string; path: string; }[] | undefined; } | undefined; }, {}>; toolSearch: (args?: ({ execution?: "server" | "client" | undefined; description?: string | undefined; parameters?: Record<string, unknown> | undefined; } & { execute?: ToolExecuteFunction<{ arguments?: unknown; call_id?: string | null | undefined; }, { tools: JSONObject[]; }, {}> | undefined; needsApproval?: boolean | ToolNeedsApprovalFunction<{ arguments?: unknown; call_id?: string | null | undefined; }, {}> | undefined; toModelOutput?: ((options: { toolCallId: string; input: { arguments?: unknown; call_id?: string | null | undefined; }; output: NoInfer<{ tools: JSONObject[]; }>; }) => ToolResultOutput | PromiseLike<ToolResultOutput>) | undefined; onInputStart?: ((options: ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; onInputDelta?: ((options: { inputTextDelta: string; } & ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; onInputAvailable?: ((options: { input: { arguments?: unknown; call_id?: string | null | undefined; }; } & ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; }) | undefined) => ProviderDefinedTool<{ arguments?: unknown; call_id?: string | null | undefined; }, { tools: JSONObject[]; }, {}>; webSearch: (args?: ({ externalWebAccess?: boolean | undefined; filters?: { allowedDomains?: string[] | undefined; blockedDomains?: string[] | undefined; } | undefined; searchContextSize?: "low" | "high" | "medium" | undefined; userLocation?: { type: "approximate"; country?: string | undefined; city?: string | undefined; region?: string | undefined; timezone?: string | undefined; } | undefined; } & { onInputStart?: ((options: ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; onInputDelta?: ((options: { inputTextDelta: string; } & ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; onInputAvailable?: ((options: { input: {}; } & ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; }) | undefined) => ProviderExecutedTool<{}, { action?: { type: "search"; query?: string | undefined; queries?: string[] | undefined; } | { type: "openPage"; url?: string | null | undefined; } | { type: "findInPage"; url?: string | null | undefined; pattern?: string | null | undefined; } | undefined; sources?: ({ type: "url"; url: string; } | { type: "api"; name: string; })[] | undefined; }, {}>; webSearchPreview: ProviderExecutedToolFactory<{}, { action?: { type: "search"; query?: string | undefined; } | { type: "openPage"; url?: string | null | undefined; } | { type: "findInPage"; url?: string | null | undefined; pattern?: string | null | undefined; } | undefined; }, { searchContextSize?: "low" | "high" | "medium" | undefined; userLocation?: { type: "approximate"; country?: string | undefined; city?: string | undefined; region?: string | undefined; timezone?: string | undefined; } | undefined; }, {}>; }>; specificationVersion: "v4"; rerankingModel: ((modelId: string) => Effect<{ doRerank: (options: RerankingModelV4CallOptions) => Effect<RerankingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; files: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadFile: (options: FilesV4UploadFileCallOptions) => Effect<FilesV4UploadFileResult, AiSdkError, never>; getFileMetadata: ((options: FilesV4GetFileMetadataCallOptions) => Effect<FilesV4GetFileMetadataResult, AiSdkError, never>) | undefined; downloadFile: ((options: FilesV4DownloadFileCallOptions) => Effect<{ content: Stream<Uint8Array<ArrayBufferLike>, AiSdkError, never>; mediaType?: string | undefined; providerMetadata?: SharedV4ProviderMetadata | undefined; warnings: SharedV4Warning[]; }, AiSdkError, Scope>) | undefined; deleteFile: ((options: FilesV4DeleteFileCallOptions) => Effect<FilesV4DeleteFileResult, AiSdkError, never>) | undefined; }, AiSdkError, never>) | undefined; skills: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadSkill: (options: SkillsV4UploadSkillCallOptions) => Effect<SkillsV4UploadSkillResult, AiSdkError, never>; }, AiSdkError, never>) | undefined; }, AiSdkError, never>
createAzure<E, R>(options: EffectProviderSettings<AzureOpenAIProviderSettings, ResolverKey, E, R>): Effect<((deploymentId: string, settings?: AzureOpenAILanguageModelSettings | undefined) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>) & { languageModel: (deploymentId: string, settings?: AzureOpenAILanguageModelSettings | undefined) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>; chat: (deploymentId: string, settings?: AzureOpenAILanguageModelSettings | undefined) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>; deepseek: (deploymentId: string) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>; responses: (deploymentId: string, settings?: AzureOpenAILanguageModelSettings | undefined) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>; completion: (deploymentId: string, settings?: AzureOpenAILanguageModelSettings | undefined) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>; embedding: (deploymentId: string) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; embeddingModel: (deploymentId: string) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; textEmbedding: (deploymentId: string) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; textEmbeddingModel: (deploymentId: string) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; image: (deploymentId: string) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; imageModel: (deploymentId: string) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; transcription: (deploymentId: string) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; transcriptionModel: (deploymentId: string) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; speech: (deploymentId: string) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; speechModel: (deploymentId: string) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; tools: AdaptedTools<{ applyPatch: ProviderDefinedToolFactoryWithOutputSchema<{ callId: string; operation: ApplyPatchOperation; }, { status: "completed" | "failed"; output?: string | undefined; }, {}, {}>; codeInterpreter: (args?: { container?: string | { fileIds?: string[] | undefined; memoryLimit?: "1g" | "4g" | "16g" | "64g" | undefined; networkPolicy?: { type: "disabled"; } | { type: "allowlist"; allowedDomains: string[]; domainSecrets?: { domain: string; name: string; value: string; }[] | undefined; } | undefined; } | undefined; } | undefined) => ProviderExecutedTool<{ code?: string | null | undefined; containerId: string; }, { outputs?: ({ type: "logs"; logs: string; } | { type: "image"; url: string; })[] | null | undefined; }, {}>; customTool: (args: { description?: string | undefined; async?: boolean | undefined; format?: { type: "grammar"; syntax: "regex" | "lark"; definition: string; } | { type: "text"; } | undefined; } & { execute?: ToolExecuteFunction<string, unknown, {}> | undefined; needsApproval?: boolean | ToolNeedsApprovalFunction<string, {}> | undefined; toModelOutput?: ((options: { toolCallId: string; input: string; output: unknown; }) => ToolResultOutput | PromiseLike<ToolResultOutput>) | undefined; onInputStart?: ((options: ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; onInputDelta?: ((options: { inputTextDelta: string; } & ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; onInputAvailable?: ((options: { input: string; } & ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; }) => ProviderDefinedTool<string, unknown, {}>; fileSearch: ProviderExecutedToolFactory<{}, { queries: string[]; results: { attributes: Record<string, unknown>; fileId: string; filename: string; score: number; text: string; }[] | null; }, { vectorStoreIds: string[]; maxNumResults?: number | undefined; ranking?: { ranker?: string | undefined; scoreThreshold?: number | undefined; } | undefined; filters?: OpenAIResponsesFileSearchToolComparisonFilter | OpenAIResponsesFileSearchToolCompoundFilter | undefined; }, {}>; imageGeneration: (args?: { action?: "generate" | "edit" | "auto" | undefined; background?: "auto" | "opaque" | "transparent" | undefined; inputFidelity?: "low" | "high" | undefined; inputImageMask?: { fileId?: string | undefined; imageUrl?: string | undefined; } | undefined; model?: string | undefined; moderation?: "auto" | "low" | undefined; outputCompression?: number | undefined; outputFormat?: "png" | "jpeg" | "webp" | undefined; partialImages?: number | undefined; quality?: "auto" | "low" | "high" | "medium" | "xhigh" | "max" | undefined; size?: (string & {}) | "auto" | "1024x1024" | "1024x1536" | "1536x1024" | undefined; } | undefined) => ProviderExecutedTool<{}, { result: string; }, {}>; shell: ProviderDefinedToolFactoryWithOutputSchema<{ action: { commands: string[]; timeoutMs?: number | undefined; maxOutputLength?: number | undefined; }; }, { maxOutputLength?: number | undefined; output: { stdout: string; stderr: string; outcome: { type: "timeout"; } | { type: "exit"; exitCode: number; }; }[]; }, { environment?: { type: "containerAuto"; fileIds?: string[] | undefined; memoryLimit?: "1g" | "4g" | "16g" | "64g" | undefined; networkPolicy?: { type: "disabled"; } | { type: "allowlist"; allowedDomains: string[]; domainSecrets?: { domain: string; name: string; value: string; }[] | undefined; } | undefined; skills?: ({ type: "skillReference"; providerReference: SharedV4ProviderReference; version?: string | undefined; } | { type: "inline"; name: string; description: string; source: { type: "base64"; mediaType: "application/zip"; data: string; }; })[] | undefined; } | { type: "containerReference"; containerId: string; } | { type?: "local" | undefined; skills?: { name: string; description: string; path: string; }[] | undefined; } | undefined; }, {}>; toolSearch: (args?: ({ execution?: "server" | "client" | undefined; description?: string | undefined; parameters?: Record<string, unknown> | undefined; } & { execute?: ToolExecuteFunction<{ arguments?: unknown; call_id?: string | null | undefined; }, { tools: JSONObject[]; }, {}> | undefined; needsApproval?: boolean | ToolNeedsApprovalFunction<{ arguments?: unknown; call_id?: string | null | undefined; }, {}> | undefined; toModelOutput?: ((options: { toolCallId: string; input: { arguments?: unknown; call_id?: string | null | undefined; }; output: NoInfer<{ tools: JSONObject[]; }>; }) => ToolResultOutput | PromiseLike<ToolResultOutput>) | undefined; onInputStart?: ((options: ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; onInputDelta?: ((options: { inputTextDelta: string; } & ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; onInputAvailable?: ((options: { input: { arguments?: unknown; call_id?: string | null | undefined; }; } & ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; }) | undefined) => ProviderDefinedTool<{ arguments?: unknown; call_id?: string | null | undefined; }, { tools: JSONObject[]; }, {}>; webSearch: (args?: ({ externalWebAccess?: boolean | undefined; filters?: { allowedDomains?: string[] | undefined; blockedDomains?: string[] | undefined; } | undefined; searchContextSize?: "low" | "high" | "medium" | undefined; userLocation?: { type: "approximate"; country?: string | undefined; city?: string | undefined; region?: string | undefined; timezone?: string | undefined; } | undefined; } & { onInputStart?: ((options: ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; onInputDelta?: ((options: { inputTextDelta: string; } & ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; onInputAvailable?: ((options: { input: {}; } & ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; }) | undefined) => ProviderExecutedTool<{}, { action?: { type: "search"; query?: string | undefined; queries?: string[] | undefined; } | { type: "openPage"; url?: string | null | undefined; } | { type: "findInPage"; url?: string | null | undefined; pattern?: string | null | undefined; } | undefined; sources?: ({ type: "url"; url: string; } | { type: "api"; name: string; })[] | undefined; }, {}>; webSearchPreview: ProviderExecutedToolFactory<{}, { action?: { type: "search"; query?: string | undefined; } | { type: "openPage"; url?: string | null | undefined; } | { type: "findInPage"; url?: string | null | undefined; pattern?: string | null | undefined; } | undefined; }, { searchContextSize?: "low" | "high" | "medium" | undefined; userLocation?: { type: "approximate"; country?: string | undefined; city?: string | undefined; region?: string | undefined; timezone?: string | undefined; } | undefined; }, {}>; }>; specificationVersion: "v4"; rerankingModel: ((modelId: string) => Effect<{ doRerank: (options: RerankingModelV4CallOptions) => Effect<RerankingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; files: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadFile: (options: FilesV4UploadFileCallOptions) => Effect<FilesV4UploadFileResult, AiSdkError, never>; getFileMetadata: ((options: FilesV4GetFileMetadataCallOptions) => Effect<FilesV4GetFileMetadataResult, AiSdkError, never>) | undefined; downloadFile: ((options: FilesV4DownloadFileCallOptions) => Effect<{ content: Stream<Uint8Array<ArrayBufferLike>, AiSdkError, never>; mediaType?: string | undefined; providerMetadata?: SharedV4ProviderMetadata | undefined; warnings: SharedV4Warning[]; }, AiSdkError, Scope>) | undefined; deleteFile: ((options: FilesV4DeleteFileCallOptions) => Effect<FilesV4DeleteFileResult, AiSdkError, never>) | undefined; }, AiSdkError, never>) | undefined; skills: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadSkill: (options: SkillsV4UploadSkillCallOptions) => Effect<SkillsV4UploadSkillResult, AiSdkError, never>; }, AiSdkError, never>) | undefined; }, AiSdkError, Scope | R>
```

## `OpenAIChatLanguageModelOptions`

The source declaration does not provide a JSDoc description.

```text
type OpenAILanguageModelChatOptions = InferSchema<
  typeof openaiLanguageModelChatOptions
>;
```

## `OpenAILanguageModelChatOptions`

The source declaration does not provide a JSDoc description.

```text
type OpenAILanguageModelChatOptions = InferSchema<
  typeof openaiLanguageModelChatOptions
>;
```

## `OpenAILanguageModelResponsesOptions`

The source declaration does not provide a JSDoc description.

```text
type OpenAILanguageModelResponsesOptions = InferSchema<
  typeof openaiLanguageModelResponsesOptionsSchema
>;
```

## `OpenAIResponsesProviderOptions`

The source declaration does not provide a JSDoc description.

```text
type OpenAILanguageModelResponsesOptions = InferSchema<
  typeof openaiLanguageModelResponsesOptionsSchema
>;
```

## `OpenAIResponsesSystemMessageOptions`

The source declaration does not provide a JSDoc description.

```text
type OpenAIResponsesSystemMessageOptions = InferSchema<
  typeof openaiResponsesSystemMessageOptionsSchema
>;
```

## `VERSION`

Expose the version of the Azure OpenAI SDK used by this adapter.

```text
VERSION: string
```
