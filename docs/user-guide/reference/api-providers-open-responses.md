---
title: open-responses provider API
doc-type: reference
sources: [src/providers/open-responses.ts, package.json]
---

# open-responses provider API

> **TL;DR:** This entry exposes 16 public exports through `@jambudipa/ai-effect/open-responses`.
> The contracts below come from the installed package declarations and JSDoc.

## Import

`@jambudipa/ai-effect/open-responses` selects the package export for this provider. See the [provider source](../../../src/providers/open-responses.ts).

## `createOpenResponses`

Construct the Open Responses provider lazily. Keep the scope open when using effectful
settings or extensions.

```text
createOpenResponses(options: Settings<StaticProviderSettings<OpenResponsesProviderSettings, ResolverKey>, never, never>): Effect<((modelId: string) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>) & { tools: AdaptedTools<{ customTool: (options: OpenResponsesCustomToolOptions & { execute?: ToolExecuteFunction<string, unknown, {}> | undefined; needsApproval?: boolean | ToolNeedsApprovalFunction<string, {}> | undefined; toModelOutput?: ((options: { toolCallId: string; input: string; output: unknown; }) => ToolResultOutput | PromiseLike<ToolResultOutput>) | undefined; onInputStart?: ((options: ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; onInputDelta?: ((options: { inputTextDelta: string; } & ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; onInputAvailable?: ((options: { input: string; } & ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; }) => ProviderDefinedTool<string, unknown, {}>; }>; specificationVersion: "v4"; languageModel: (modelId: string) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>; embeddingModel: (modelId: string) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; imageModel: (modelId: string) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; transcriptionModel: ((modelId: string) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; speechModel: ((modelId: string) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; rerankingModel: ((modelId: string) => Effect<{ doRerank: (options: RerankingModelV4CallOptions) => Effect<RerankingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; files: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadFile: (options: FilesV4UploadFileCallOptions) => Effect<FilesV4UploadFileResult, AiSdkError, never>; getFileMetadata: ((options: FilesV4GetFileMetadataCallOptions) => Effect<FilesV4GetFileMetadataResult, AiSdkError, never>) | undefined; downloadFile: ((options: FilesV4DownloadFileCallOptions) => Effect<{ content: Stream<Uint8Array<ArrayBufferLike>, AiSdkError, never>; mediaType?: string | undefined; providerMetadata?: SharedV4ProviderMetadata | undefined; warnings: SharedV4Warning[]; }, AiSdkError, Scope>) | undefined; deleteFile: ((options: FilesV4DeleteFileCallOptions) => Effect<FilesV4DeleteFileResult, AiSdkError, never>) | undefined; }, AiSdkError, never>) | undefined; skills: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadSkill: (options: SkillsV4UploadSkillCallOptions) => Effect<SkillsV4UploadSkillResult, AiSdkError, never>; }, AiSdkError, never>) | undefined; }, AiSdkError, never>
createOpenResponses<E, R>(options: Settings<EffectProviderSettings<OpenResponsesProviderSettings, ResolverKey, E, R>, (options: { url: string; requestBodyValues: unknown; response: Response; }) => Effect<{ value: APICallError; rawValue?: unknown; responseHeaders?: Record<string, string> | undefined; }, E, R>, readonly (Extension<OpenResponsesExtension, E, R> | Experimental_OpenResponsesBareExtension<E, R>)[]>): Effect<((modelId: string) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>) & { tools: AdaptedTools<{ customTool: (options: OpenResponsesCustomToolOptions & { execute?: ToolExecuteFunction<string, unknown, {}> | undefined; needsApproval?: boolean | ToolNeedsApprovalFunction<string, {}> | undefined; toModelOutput?: ((options: { toolCallId: string; input: string; output: unknown; }) => ToolResultOutput | PromiseLike<ToolResultOutput>) | undefined; onInputStart?: ((options: ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; onInputDelta?: ((options: { inputTextDelta: string; } & ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; onInputAvailable?: ((options: { input: string; } & ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; }) => ProviderDefinedTool<string, unknown, {}>; }>; specificationVersion: "v4"; languageModel: (modelId: string) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>; embeddingModel: (modelId: string) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; imageModel: (modelId: string) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>; transcriptionModel: ((modelId: string) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; speechModel: ((modelId: string) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; rerankingModel: ((modelId: string) => Effect<{ doRerank: (options: RerankingModelV4CallOptions) => Effect<RerankingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined; files: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadFile: (options: FilesV4UploadFileCallOptions) => Effect<FilesV4UploadFileResult, AiSdkError, never>; getFileMetadata: ((options: FilesV4GetFileMetadataCallOptions) => Effect<FilesV4GetFileMetadataResult, AiSdkError, never>) | undefined; downloadFile: ((options: FilesV4DownloadFileCallOptions) => Effect<{ content: Stream<Uint8Array<ArrayBufferLike>, AiSdkError, never>; mediaType?: string | undefined; providerMetadata?: SharedV4ProviderMetadata | undefined; warnings: SharedV4Warning[]; }, AiSdkError, Scope>) | undefined; deleteFile: ((options: FilesV4DeleteFileCallOptions) => Effect<FilesV4DeleteFileResult, AiSdkError, never>) | undefined; }, AiSdkError, never>) | undefined; skills: (() => Effect<{ specificationVersion: "v4"; provider: string; uploadSkill: (options: SkillsV4UploadSkillCallOptions) => Effect<SkillsV4UploadSkillResult, AiSdkError, never>; }, AiSdkError, never>) | undefined; }, AiSdkError, Scope | R>
```

## `Experimental_OpenResponsesBareExtension`

Provide bare SDK extension metadata with Effect callbacks for its configured hooks.

```text
export type Experimental_OpenResponsesBareExtension<E = never, R = never> = Extension<SdkBareExtension, E, R>;
```

## `Experimental_OpenResponsesExtension`

Provide a native Open Responses extension with Effect callbacks for encoding and
decoding.

```text
export type Experimental_OpenResponsesExtension<E = never, R = never> = Extension<SdkExtension, E, R>;
```

## `Experimental_OpenResponsesExtensionContentPart`

The source declaration does not provide a JSDoc description.

```text
type OpenResponsesExtensionContentPart = Extract<LanguageModelV4Content, LanguageModelV4StreamPart>;
```

## `Experimental_OpenResponsesExtensionEvent`

The source declaration does not provide a JSDoc description.

```text
type OpenResponsesExtensionEvent<Type extends string = OpenResponsesNamespacedType> = OpenResponsesExtensionRecord<Type> & {
  sequence_number: number;
};
```

## `Experimental_OpenResponsesExtensionInputPart`

The source declaration does not provide a JSDoc description.

```text
type OpenResponsesExtensionInputPart = LanguageModelV4ToolCallPart | LanguageModelV4ToolResultPart;
```

## `Experimental_OpenResponsesExtensionItem`

The source declaration does not provide a JSDoc description.

```text
type OpenResponsesExtensionItem<Type extends string = OpenResponsesNamespacedType> = OpenResponsesExtensionRecord<Type> & {
  id: string;
  status: string;
};
```

## `Experimental_OpenResponsesExtensionRecord`

The source declaration does not provide a JSDoc description.

```text
type OpenResponsesExtensionRecord<Type extends string = OpenResponsesNamespacedType> = JSONObject & {
  type: Type;
};
```

## `Experimental_OpenResponsesExtensionStreamPart`

The source declaration does not provide a JSDoc description.

```text
type OpenResponsesExtensionStreamPart = Exclude<LanguageModelV4StreamPart, {
  type: 'error' | 'finish' | 'raw' | 'response-metadata' | 'stream-start';
}>;
```

## `Experimental_OpenResponsesNamespacedType`

The source declaration does not provide a JSDoc description.

```text
type OpenResponsesNamespacedType = `${string}:${string}`;
```

## `OpenResponsesCustomToolOptions`

The source declaration does not provide a JSDoc description.

```text
type OpenResponsesCustomToolOptions = {
  /**
   * An optional description of what the custom tool does.
   */
  description?: string;
  /**
   * The raw text format returned by the model.
   */
  format?: {
    type: 'grammar';
    syntax: 'regex' | 'lark';
    definition: string;
  } | {
    type: 'text';
  };
};
```

## `OpenResponsesLanguageModelOptions`

The source declaration does not provide a JSDoc description.

```text
type OpenResponsesLanguageModelOptions = InferSchema<typeof openResponsesLanguageModelOptions>;
```

## `OpenResponsesOptions`

The source declaration does not provide a JSDoc description.

```text
type OpenResponsesLanguageModelOptions = InferSchema<typeof openResponsesLanguageModelOptions>;
```

## `OpenResponsesProvider`

Provider returned by the adapter, with Effect-based model selection for Open Responses.

```text
export type OpenResponsesProvider = ReturnType<typeof wrapProvider>;
```

## `OpenResponsesProviderSettings`

Keep the native Open Responses options and allow the SDK to obtain `apiKey` and
`headers` through Effect resolvers.

```text
export type OpenResponsesProviderSettings<E = never, R = never> = Settings<EffectProviderSettings<SdkSettings, ResolverKey, E, R>, EffectCallback<NonNullable<SdkSettings['failedResponseHandler']>, E, R>, ReadonlyArray<Experimental_OpenResponsesExtension<E, R> | Experimental_OpenResponsesBareExtension<E, R>>>;
```

## `VERSION`

The source declaration does not provide a JSDoc description.

```text
VERSION: string
```
