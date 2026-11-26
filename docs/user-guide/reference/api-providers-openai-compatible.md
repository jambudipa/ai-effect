---
title: openai-compatible provider API
doc-type: reference
sources: [src/providers/openai-compatible.ts, package.json]
---

# openai-compatible provider API

> **TL;DR:** This entry exposes 21 public exports through `@jambudipa/ai-effect/openai-compatible`.
> The contracts below come from the installed package declarations and JSDoc.

## Import

`@jambudipa/ai-effect/openai-compatible` selects the package export for this provider. See the [provider source](../../../src/providers/openai-compatible.ts).

## `createOpenAICompatible`

Build a provider for an OpenAI-compatible endpoint. Give effectful settings a scope that
covers its requests.

```text
createOpenAICompatible<Chat extends string, Completion extends string, Embedding extends string, Image extends string>(options: Configuration<StaticProviderSettings<OpenAICompatibleProviderSettings, ResolverKey<OpenAICompatibleProviderSettings>>, never>): Effect<OpenAICompatibleProvider<Chat, Completion, Embedding, Image>, AiSdkError, never>
createOpenAICompatible<Chat extends string, Completion extends string, Embedding extends string, Image extends string, E = never, R = never>(options: Configuration<EffectProviderSettings<OpenAICompatibleProviderSettings, ResolverKey<OpenAICompatibleProviderSettings>, E, R>, MetadataExtractor<E, R>>): Effect<OpenAICompatibleProvider<Chat, Completion, Embedding, Image>, AiSdkError, Scope | R>
```

## `MetadataExtractor`

Allow whole-response metadata extraction to use Effect while keeping stream parsing synchronous.

```text
export interface MetadataExtractor<E = never, R = never> {
    /** Extract metadata in the provider scope using the SDK's native response inputs. */
    readonly extractMetadata: (options: Parameters<NativeMetadataExtractor['extractMetadata']>[0]) => Effect.Effect<Metadata, E, R>;
    /** Create a fresh synchronous metadata accumulator for each native stream. */
    readonly createStreamExtractor: () => {
        readonly processChunk: (...args: Parameters<StreamExtractor['processChunk']>) => void;
        readonly buildMetadata: () => ReturnType<StreamExtractor['buildMetadata']>;
    };
}
```

## `OpenAICompatibleChatLanguageModel`

Construct the SDK OpenAI-compatible chat model lazily with its native options. It
exposes the workflow serialization hooks.
Effect model returned by `OpenAICompatibleChatLanguageModel`. Use its chat generation
operations in an Effect program.

```text
OpenAICompatibleChatLanguageModel(modelId: string, config: Configuration<StaticProviderSettings<OpenAICompatibleChatConfig, ResolverKey<OpenAICompatibleChatConfig>>, never>): Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; } & { supportsStructuredOutputs: boolean; prepareRequest: (options: LanguageModelV4CallOptions) => Effect<{ body: Record<string, unknown>; warnings: SharedV4Warning[]; }, AiSdkError, never>; convertResponse: (options: { body: unknown; providerOptions?: SharedV4ProviderOptions | undefined; }) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; }, AiSdkError, never>
OpenAICompatibleChatLanguageModel<E, R>(modelId: string, config: Configuration<EffectProviderSettings<OpenAICompatibleChatConfig, ResolverKey<OpenAICompatibleChatConfig>, E, R>, MetadataExtractor<E, R>>): Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; } & { supportsStructuredOutputs: boolean; prepareRequest: (options: LanguageModelV4CallOptions) => Effect<{ body: Record<string, unknown>; warnings: SharedV4Warning[]; }, AiSdkError, never>; convertResponse: (options: { body: unknown; providerOptions?: SharedV4ProviderOptions | undefined; }) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; }, AiSdkError, Scope | R>
```

### Public properties

#### `OpenAICompatibleChatLanguageModel[WORKFLOW_DESERIALIZE]`

```text
(input: { modelId: string; config: OpenAICompatibleChatConfig; }) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; } & { supportsStructuredOutputs: boolean; prepareRequest: (options: LanguageModelV4CallOptions) => Effect<{ body: Record<string, unknown>; warnings: SharedV4Warning[]; }, AiSdkError, never>; convertResponse: (options: { body: unknown; providerOptions?: SharedV4ProviderOptions | undefined; }) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; }, AiSdkError, never>
```

#### `OpenAICompatibleChatLanguageModel[WORKFLOW_SERIALIZE]`

```text
(model: { specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; } & { supportsStructuredOutputs: boolean; prepareRequest: (options: LanguageModelV4CallOptions) => Effect<{ body: Record<string, unknown>; warnings: SharedV4Warning[]; }, AiSdkError, never>; convertResponse: (options: { body: unknown; providerOptions?: SharedV4ProviderOptions | undefined; }) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; }) => Effect<{ modelId: string; config: JSONObject; }, AiSdkError, never>
```


## `OpenAICompatibleChatModelId`

The source declaration does not provide a JSDoc description.

```text
type OpenAICompatibleChatModelId = string;
```

## `OpenAICompatibleCompletionLanguageModel`

Construct the SDK OpenAI-compatible completion model lazily with its native options. It
exposes the workflow serialization hooks.
Effect model returned by `OpenAICompatibleCompletionLanguageModel`. Use its completion
operations in an Effect program.

```text
OpenAICompatibleCompletionLanguageModel(modelId: string, config: Configuration<StaticProviderSettings<OpenAICompatibleCompletionConfig, ResolverKey<OpenAICompatibleCompletionConfig>>, never>): Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
OpenAICompatibleCompletionLanguageModel<E, R>(modelId: string, config: Configuration<EffectProviderSettings<OpenAICompatibleCompletionConfig, ResolverKey<OpenAICompatibleCompletionConfig>, E, R>, MetadataExtractor<E, R>>): Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, Scope | R>
```

### Public properties

#### `OpenAICompatibleCompletionLanguageModel[WORKFLOW_DESERIALIZE]`

```text
(input: { modelId: string; config: OpenAICompatibleCompletionConfig; }) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

#### `OpenAICompatibleCompletionLanguageModel[WORKFLOW_SERIALIZE]`

```text
(model: { specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }) => Effect<{ modelId: string; config: JSONObject; }, AiSdkError, never>
```


## `OpenAICompatibleCompletionModelId`

The source declaration does not provide a JSDoc description.

```text
type OpenAICompatibleCompletionModelId = string;
```

## `OpenAICompatibleCompletionProviderOptions`

The source declaration does not provide a JSDoc description.

```text
type OpenAICompatibleLanguageModelCompletionOptions = InferSchema<typeof openaiCompatibleLanguageModelCompletionOptions>;
```

## `OpenAICompatibleEmbeddingModel`

Construct the SDK OpenAI-compatible embedding model lazily with its native options. It
exposes the workflow serialization hooks.
Effect model returned by `OpenAICompatibleEmbeddingModel`. Use its embedding operations
in an Effect program.

```text
OpenAICompatibleEmbeddingModel(modelId: string, config: Configuration<StaticProviderSettings<OpenAICompatibleEmbeddingConfig, "headers">, never>): Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
OpenAICompatibleEmbeddingModel<E, R>(modelId: string, config: Configuration<EffectProviderSettings<OpenAICompatibleEmbeddingConfig, "headers", E, R>, MetadataExtractor<E, R>>): Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, Scope | R>
```

### Public properties

#### `OpenAICompatibleEmbeddingModel[WORKFLOW_DESERIALIZE]`

```text
(input: { modelId: string; config: OpenAICompatibleEmbeddingConfig; }) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `OpenAICompatibleEmbeddingModel[WORKFLOW_SERIALIZE]`

```text
(model: { maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }) => Effect<{ modelId: string; config: JSONObject; }, AiSdkError, never>
```


## `OpenAICompatibleEmbeddingModelId`

The source declaration does not provide a JSDoc description.

```text
type OpenAICompatibleEmbeddingModelId = string;
```

## `OpenAICompatibleEmbeddingModelOptions`

The source declaration does not provide a JSDoc description.

```text
type OpenAICompatibleEmbeddingModelOptions = InferSchema<typeof openaiCompatibleEmbeddingModelOptions>;
```

## `OpenAICompatibleEmbeddingProviderOptions`

The source declaration does not provide a JSDoc description.

```text
type OpenAICompatibleEmbeddingModelOptions = InferSchema<typeof openaiCompatibleEmbeddingModelOptions>;
```

## `OpenAICompatibleErrorData`

The source declaration does not provide a JSDoc description.

```text
type OpenAICompatibleErrorData = z.infer<typeof openaiCompatibleErrorDataSchema>;
```

## `OpenAICompatibleImageModel`

Construct the SDK OpenAI-compatible image model lazily with its native options. It
exposes the workflow serialization hooks.
Effect model returned by `OpenAICompatibleImageModel`. Use its image generation
operations in an Effect program.

```text
OpenAICompatibleImageModel(modelId: string, config: Configuration<StaticProviderSettings<OpenAICompatibleImageModelConfig, "headers">, never>): Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
OpenAICompatibleImageModel<E, R>(modelId: string, config: Configuration<EffectProviderSettings<OpenAICompatibleImageModelConfig, "headers", E, R>, MetadataExtractor<E, R>>): Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, Scope | R>
```

### Public properties

#### `OpenAICompatibleImageModel[WORKFLOW_DESERIALIZE]`

```text
(input: { modelId: string; config: OpenAICompatibleImageModelConfig; }) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `OpenAICompatibleImageModel[WORKFLOW_SERIALIZE]`

```text
(model: { maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }) => Effect<{ modelId: string; config: JSONObject; }, AiSdkError, never>
```


## `OpenAICompatibleImageModelOptions`

The source declaration does not provide a JSDoc description.

```text
type OpenAICompatibleImageModelOptions = InferSchema<typeof openaiCompatibleImageModelOptions>;
```

## `OpenAICompatibleLanguageModelChatOptions`

The source declaration does not provide a JSDoc description.

```text
type OpenAICompatibleLanguageModelChatOptions = z.infer<typeof openaiCompatibleLanguageModelChatOptions>;
```

## `OpenAICompatibleLanguageModelCompletionOptions`

The source declaration does not provide a JSDoc description.

```text
type OpenAICompatibleLanguageModelCompletionOptions = InferSchema<typeof openaiCompatibleLanguageModelCompletionOptions>;
```

## `OpenAICompatibleProvider`

Use a registered compatible provider with separate ID types for its model capabilities.

```text
export type OpenAICompatibleProvider<Chat extends string = string, Completion extends string = string, Embedding extends string = string, Image extends string = string> = ReturnType<typeof wrapOpenAICompatibleProvider<Chat, Completion, Embedding, Image>>;
```

## `OpenAICompatibleProviderOptions`

The source declaration does not provide a JSDoc description.

```text
type OpenAICompatibleLanguageModelChatOptions = z.infer<typeof openaiCompatibleLanguageModelChatOptions>;
```

## `OpenAICompatibleProviderSettings`

Preserve the SDK endpoint and option shape and allow Effect-based credentials and
supported hooks.

```text
export type OpenAICompatibleProviderSettings<E = never, R = never> = CompatibleSettings<SdkSettings, E, R>;
```

## `ProviderErrorStructure`

Decode provider-specific failures and retain the SDK's synchronous handling hooks.

```text
export interface ProviderErrorStructure<T> {
    /** Decode untrusted response bodies before computing an error message or retry decision. */
    readonly errorSchema: NativeProviderErrorStructure<T>['errorSchema'];
    /** Render the message from a successfully decoded provider error payload. */
    readonly errorToMessage: (error: T) => string;
    /** Override retry classification using the HTTP response and any decoded provider error. */
    readonly isRetryable?: (response: Response, error?: T) => boolean;
}
```

## `VERSION`

The source declaration does not provide a JSDoc description.

```text
VERSION: string
```
