---
title: openai provider API
doc-type: reference
sources: [src/providers/openai.ts, package.json]
---

# openai provider API

> **TL;DR:** This entry exposes 45 public exports through `@jambudipa/ai-effect/openai`.
> The contracts below come from the installed package declarations and JSDoc.

## Import

`@jambudipa/ai-effect/openai` selects the package export for this provider. See the [provider source](../../../src/providers/openai.ts).

## `createOpenAI`

Construct the OpenAI provider inside an Effect. Keep the scope open when using an Effect
resolver for `apiKey`.

```text
createOpenAI(options?: StaticProviderSettings<OpenAIProviderSettings, "apiKey"> | undefined): Effect<OpenAIProvider, AiSdkError, never>
createOpenAI<E, R>(options: EffectProviderSettings<OpenAIProviderSettings, "apiKey", E, R>): Effect<OpenAIProvider, AiSdkError, Scope | R>
```

## `Experimental_OpenAIRealtimeFactory`

Select a live or realtime model with the native API hint, or use `getToken` to acquire a
token.

```text
export type Experimental_OpenAIRealtimeFactory = ReturnType<typeof wrapOpenAIRealtime>;
```

## `Experimental_OpenAIRealtimeModel`

Construct the SDK OpenAI realtime model lazily with its native options.
Effect model returned by `Experimental_OpenAIRealtimeModel`. Use its realtime connection
operations in an Effect program.

```text
Experimental_OpenAIRealtimeModel(modelId: string, config: ProviderHostConfiguration<OpenAIRealtimeModelConfig>): Effect<Experimental_OpenAIRealtimeModel, AiSdkError, never>
```

## `Experimental_OpenAIRealtimeModelConfig`

Expose the SDK realtime model configuration accepted at the adapter host boundary.

```text
export type Experimental_OpenAIRealtimeModelConfig = ProviderHostConfiguration<SdkExperimental_OpenAIRealtimeModelConfig>;
```

## `Experimental_OpenAIRealtimeModelLive`

Construct the SDK OpenAI live model lazily with its native options.
Effect model returned by `Experimental_OpenAIRealtimeModelLive`. Use its session
connection operations in an Effect program.

```text
Experimental_OpenAIRealtimeModelLive(modelId: OpenAIRealtimeModelLiveId, config: ProviderHostConfiguration<OpenAIRealtimeModelConfig>): Effect<Experimental_OpenAIRealtimeModelLive, AiSdkError, never>
```

## `Experimental_OpenAIRealtimeModelLiveConfig`

Expose the SDK live model configuration accepted at the adapter host boundary.

```text
export type Experimental_OpenAIRealtimeModelLiveConfig = ProviderHostConfiguration<SdkExperimental_OpenAIRealtimeModelLiveConfig>;
```

## `Experimental_OpenAIRealtimeModelLiveId`

The source declaration does not provide a JSDoc description.

```text
type OpenAIRealtimeModelLiveId = 'gpt-live-1' | (string & {});
```

## `Experimental_OpenAIRealtimeModelLiveOptions`

The source declaration does not provide a JSDoc description.

```text
type OpenAIRealtimeModelLiveOptions = z.infer<
  typeof openaiRealtimeModelLiveOptionsSchema
>;
```

## `Experimental_OpenAIRealtimeOptions`

The source declaration does not provide a JSDoc description.

```text
type OpenAIRealtimeOptions = {
  api?: 'live' | 'realtime';
};
```

## `Experimental_OpenAISpeechTranslationModel`

Construct the SDK OpenAI speech translation model lazily with its native options. It
exposes the workflow serialization hooks.
Effect model returned by `Experimental_OpenAISpeechTranslationModel`. Use its speech
translation operations in an Effect program.

```text
Experimental_OpenAISpeechTranslationModel(modelId: OpenAISpeechTranslationModelId, config: ProviderHostConfiguration<OpenAISpeechTranslationModelConfig>): Effect<{ doStream: (options: SpeechTranslationModelV4StreamOptions) => Effect<Omit<SpeechTranslationModelV4StreamResult & { stream: ReadableStream<SpeechTranslationModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechTranslationModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

### Public properties

#### `Experimental_OpenAISpeechTranslationModel[WORKFLOW_DESERIALIZE]`

```text
(input: { modelId: OpenAISpeechTranslationModelId; config: OpenAISpeechTranslationModelConfig; }) => Effect<{ doStream: (options: SpeechTranslationModelV4StreamOptions) => Effect<Omit<SpeechTranslationModelV4StreamResult & { stream: ReadableStream<SpeechTranslationModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechTranslationModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `Experimental_OpenAISpeechTranslationModel[WORKFLOW_SERIALIZE]`

```text
(model: { doStream: (options: SpeechTranslationModelV4StreamOptions) => Effect<Omit<SpeechTranslationModelV4StreamResult & { stream: ReadableStream<SpeechTranslationModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechTranslationModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>; specificationVersion: "v4"; provider: string; modelId: string; }) => Effect<{ modelId: string; config: JSONObject; }, AiSdkError, never>
```


## `Experimental_OpenAISpeechTranslationModelId`

The source declaration does not provide a JSDoc description.

```text
type OpenAISpeechTranslationModelId =
  OpenAIModelIds['speechTranslation'] | (string & {});
```

## `Experimental_OpenAISpeechTranslationModelOptions`

The source declaration does not provide a JSDoc description.

```text
type OpenAISpeechTranslationModelOptions = InferSchema<
  typeof openAISpeechTranslationModelOptions
>;
```

## `Experimental_OpenAITranslationModel`

Expose the same OpenAI provider as `Experimental_OpenAISpeechTranslationModel` under the
SDK alias.
Expose the same OpenAI contract as `Experimental_OpenAISpeechTranslationModel` under the
SDK alias.

```text
Experimental_OpenAITranslationModel(modelId: OpenAISpeechTranslationModelId, config: ProviderHostConfiguration<OpenAISpeechTranslationModelConfig>): Effect<{ doStream: (options: SpeechTranslationModelV4StreamOptions) => Effect<Omit<SpeechTranslationModelV4StreamResult & { stream: ReadableStream<SpeechTranslationModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechTranslationModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

### Public properties

#### `Experimental_OpenAITranslationModel[WORKFLOW_DESERIALIZE]`

```text
(input: { modelId: OpenAISpeechTranslationModelId; config: OpenAISpeechTranslationModelConfig; }) => Effect<{ doStream: (options: SpeechTranslationModelV4StreamOptions) => Effect<Omit<SpeechTranslationModelV4StreamResult & { stream: ReadableStream<SpeechTranslationModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechTranslationModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `Experimental_OpenAITranslationModel[WORKFLOW_SERIALIZE]`

```text
(model: { doStream: (options: SpeechTranslationModelV4StreamOptions) => Effect<Omit<SpeechTranslationModelV4StreamResult & { stream: ReadableStream<SpeechTranslationModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechTranslationModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>; specificationVersion: "v4"; provider: string; modelId: string; }) => Effect<{ modelId: string; config: JSONObject; }, AiSdkError, never>
```


## `Experimental_OpenAITranslationModelId`

The source declaration does not provide a JSDoc description.

```text
type OpenAISpeechTranslationModelId =
  OpenAIModelIds['speechTranslation'] | (string & {});
```

## `Experimental_OpenAITranslationModelOptions`

The source declaration does not provide a JSDoc description.

```text
type OpenAISpeechTranslationModelOptions = InferSchema<
  typeof openAISpeechTranslationModelOptions
>;
```

## `openai`

Adapt the preconfigured provider from the OpenAI SDK. Use the factory to supply
explicit settings.

```text
openai(modelId: (string & {}) | "gpt-6.2-astra" | "gpt-6.2-sol" | "gpt-6-astra" | "gpt-6.1-sol" | "gpt-6.1-terra" | "gpt-6-luna" | "gpt-6-sol" | "gpt-5.6" | "gpt-5.6-luna" | "gpt-5.6-sol" | "gpt-5.6-terra" | "gpt-5.5" | "gpt-5.4-pro" | "gpt-5.4" | "gpt-5.4-mini" | "gpt-5.4-nano" | "gpt-5.3-chat-latest" | "gpt-5.2-pro" | "gpt-5.2-chat-latest" | "gpt-5.2" | "gpt-5.1-codex-mini" | "gpt-5.1-codex" | "gpt-5.1-chat-latest" | "gpt-5.1" | "gpt-5-pro" | "gpt-5" | "gpt-5-mini" | "gpt-5-nano" | "gpt-5-codex" | "gpt-5-chat-latest" | "gpt-4.1" | "gpt-4.1-mini" | "gpt-4.1-nano" | "gpt-4o" | "gpt-4o-mini" | "gpt-3.5-turbo" | "gpt-3.5-turbo-0125" | "gpt-3.5-turbo-1106" | "gpt-4.1-2025-04-14" | "gpt-4.1-mini-2025-04-14" | "gpt-4.1-nano-2025-04-14" | "gpt-4o-2024-05-13" | "gpt-4o-2024-08-06" | "gpt-4o-2024-11-20" | "gpt-4o-mini-2024-07-18" | "gpt-5-2025-08-07" | "gpt-5-mini-2025-08-07" | "gpt-5-nano-2025-08-07" | "gpt-5.1-2025-11-13" | "gpt-5.2-2025-12-11" | "gpt-5.2-pro-2025-12-11" | "gpt-5.4-2026-03-05" | "gpt-5.4-mini-2026-03-17" | "gpt-5.4-nano-2026-03-17" | "gpt-5.4-pro-2026-03-05" | "gpt-5.5-2026-04-23" | "o1" | "o1-2024-12-17" | "o3" | "o3-2025-04-16" | "o3-mini" | "o3-mini-2025-01-31" | "o4-mini" | "o4-mini-2025-04-16" | "gpt-5-pro-2025-10-06" | "gpt-5.1-codex-max" | "gpt-5.2-codex" | "gpt-5.3-codex"): Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

### Public properties

#### `openai.chat`

```text
(modelId: (string & {}) | "gpt-6.2-astra" | "gpt-6.2-sol" | "gpt-6-astra" | "gpt-6.1-sol" | "gpt-6.1-terra" | "gpt-6-luna" | "gpt-6-sol" | "gpt-5.6" | "gpt-5.6-luna" | "gpt-5.6-sol" | "gpt-5.6-terra" | "gpt-5.5" | "gpt-5.4-pro" | "gpt-5.4" | "gpt-5.4-mini" | "gpt-5.4-nano" | "gpt-5.3-chat-latest" | "gpt-5.2-pro" | "gpt-5.2-chat-latest" | "gpt-5.2" | "gpt-5.1-chat-latest" | "gpt-5.1" | "gpt-5" | "gpt-5-mini" | "gpt-5-nano" | "gpt-5-chat-latest" | "gpt-4.1" | "gpt-4.1-mini" | "gpt-4.1-nano" | "gpt-4o" | "gpt-4o-mini" | "gpt-3.5-turbo" | "gpt-3.5-turbo-0125" | "gpt-3.5-turbo-1106" | "gpt-3.5-turbo-16k" | "gpt-4.1-2025-04-14" | "gpt-4.1-mini-2025-04-14" | "gpt-4.1-nano-2025-04-14" | "gpt-4o-2024-05-13" | "gpt-4o-2024-08-06" | "gpt-4o-2024-11-20" | "gpt-4o-audio-preview" | "gpt-4o-audio-preview-2024-12-17" | "gpt-4o-audio-preview-2025-06-03" | "gpt-4o-mini-2024-07-18" | "gpt-4o-mini-audio-preview" | "gpt-4o-mini-audio-preview-2024-12-17" | "gpt-4o-mini-search-preview" | "gpt-4o-mini-search-preview-2025-03-11" | "gpt-4o-search-preview" | "gpt-4o-search-preview-2025-03-11" | "gpt-5-2025-08-07" | "gpt-5-mini-2025-08-07" | "gpt-5-nano-2025-08-07" | "gpt-5.1-2025-11-13" | "gpt-5.2-2025-12-11" | "gpt-5.2-pro-2025-12-11" | "gpt-5.4-2026-03-05" | "gpt-5.4-mini-2026-03-17" | "gpt-5.4-nano-2026-03-17" | "gpt-5.4-pro-2026-03-05" | "gpt-5.5-2026-04-23" | "o1" | "o1-2024-12-17" | "o3" | "o3-2025-04-16" | "o3-mini" | "o3-mini-2025-01-31" | "o4-mini" | "o4-mini-2025-04-16") => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

#### `openai.completion`

```text
(modelId: (string & {}) | "gpt-3.5-turbo-instruct" | "gpt-3.5-turbo-instruct-0914") => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

#### `openai.decisionModel`

```text
(modelId: OpenAIDecisionModelId) => Effect<{ supportedQuestionTypes: readonly ("boolean" | "choice" | "score" | "box")[]; doDecide: (options: DecisionModelV4CallOptions) => Effect<DecisionModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `openai.embedding`

```text
(modelId: (string & {}) | "text-embedding-3-large" | "text-embedding-3-small" | "text-embedding-ada-002") => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `openai.embeddingModel`

```text
(modelId: (string & {}) | "text-embedding-3-large" | "text-embedding-3-small" | "text-embedding-ada-002") => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `openai.evaluationModel`

```text
(modelId: OpenAIDecisionModelId) => Effect<{ supportedQuestionTypes: readonly ("boolean" | "choice" | "score" | "box")[]; doDecide: (options: DecisionModelV4CallOptions) => Effect<DecisionModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; } & { doEvaluate: (options: DecisionModelV4CallOptions) => Effect<DecisionModelV4Result, AiSdkError, never>; }, AiSdkError, never>
```

#### `openai.experimental_batch`

```text
() => Effect<{ specificationVersion: "v4"; provider: string; supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doStartBatch: (options: BatchV4StartOptions<{ text: (string & {}) | "gpt-6.2-astra" | "gpt-6.2-sol" | "gpt-6-astra" | "gpt-6.1-sol" | "gpt-6.1-terra" | "gpt-6-luna" | "gpt-6-sol" | "gpt-5.6" | "gpt-5.6-luna" | "gpt-5.6-sol" | "gpt-5.6-terra" | "gpt-5.5" | "gpt-5.4-pro" | "gpt-5.4" | "gpt-5.4-mini" | "gpt-5.4-nano" | "gpt-5.3-chat-latest" | "gpt-5.2-pro" | "gpt-5.2-chat-latest" | "gpt-5.2" | "gpt-5.1-chat-latest" | "gpt-5.1" | "gpt-5" | "gpt-5-mini" | "gpt-5-nano" | "gpt-5-chat-latest" | "gpt-4.1" | "gpt-4.1-mini" | "gpt-4.1-nano" | "gpt-4o" | "gpt-4o-mini" | "gpt-3.5-turbo" | "gpt-3.5-turbo-0125" | "gpt-3.5-turbo-1106" | "gpt-4.1-2025-04-14" | "gpt-4.1-mini-2025-04-14" | "gpt-4.1-nano-2025-04-14" | "gpt-4o-2024-05-13" | "gpt-4o-2024-08-06" | "gpt-4o-2024-11-20" | "gpt-4o-mini-2024-07-18" | "gpt-5-2025-08-07" | "gpt-5-mini-2025-08-07" | "gpt-5-nano-2025-08-07" | "gpt-5.1-2025-11-13" | "gpt-5.2-2025-12-11" | "gpt-5.2-pro-2025-12-11" | "gpt-5.4-2026-03-05" | "gpt-5.4-mini-2026-03-17" | "gpt-5.4-nano-2026-03-17" | "gpt-5.4-pro-2026-03-05" | "gpt-5.5-2026-04-23" | "o1" | "o1-2024-12-17" | "o3" | "o3-2025-04-16" | "o3-mini" | "o3-mini-2025-01-31" | "o4-mini" | "o4-mini-2025-04-16" | "gpt-5.1-codex-mini" | "gpt-5.1-codex" | "gpt-5-pro" | "gpt-5-codex" | "gpt-5-pro-2025-10-06" | "gpt-5.1-codex-max" | "gpt-5.2-codex" | "gpt-5.3-codex"; }>) => Effect<BatchV4StartResult, AiSdkError, never>; doGetBatchStatus: (options: BatchV4OperationOptions) => Effect<BatchV4Status, AiSdkError, never>; doGetBatchResults: (options: BatchV4OperationOptions) => Effect<Stream<BatchV4ItemResult, AiSdkError, never>, AiSdkError, Scope>; doCancelBatch: ((options: BatchV4OperationOptions) => Effect<BatchV4CancelResult, AiSdkError, never>) | undefined; doListBatches: ((options: BatchV4ListOptions) => Effect<BatchV4ListResult, AiSdkError, never>) | undefined; }, AiSdkError, never>
```

#### `openai.experimental_realtime`

```text
{ (modelId: string, options: { api: "live"; }): Effect<Experimental_OpenAIRealtimeModelLive, AiSdkError, never>; (modelId: string, options: { api: "realtime"; }): Effect<Experimental_OpenAIRealtimeModel, AiSdkError, never>; (modelId: "gpt-live-1", options?: { api?: undefined; } | undefined): Effect<Experimental_OpenAIRealtimeModelLive, AiSdkError, never>; (modelId: string, options?: OpenAIRealtimeOptions | undefined): Effect<{ specificationVersion: "v4"; provider: string; modelId: string; capabilities: { conversation: "continuous" | "turn-based"; transports: readonly ("websocket" | "webrtc")[]; connections?: readonly ("webrtc" | "client-secret-websocket" | "server-websocket" | "provider")[] | undefined; startup?: "session-start" | "session-update" | undefined; finalization?: "session-close" | "transport-close" | undefined; } | undefined; createTransport: (<E, R>(options: RealtimeTransportOptions<E, R>) => Effect<{ connect: (options: Omit<{ api: string; sessionConfig?: RealtimeModelV4SessionConfig | undefined; stream?: MediaStream | undefined; capture?: boolean | undefined; abortSignal: AbortSignal; }, "abortSignal"> & { readonly abortSignal?: AbortSignal | undefined; }) => Effect<void, AiSdkError, never>; sendEvent: (event: RealtimeModelV4ClientEvent, shouldSend?: (() => boolean) | undefined) => Effect<void, AiSdkError, never>; startCapture: (stream?: MediaStream | undefined) => Effect<void, AiSdkError, never>; stopCapture: () => Effect<void, AiSdkError, never>; stopPlayback: () => Effect<void, AiSdkError, never>; resumePlayback: () => Effect<void, AiSdkError, never>; finish: () => Effect<void, AiSdkError, never>; close: () => Effect<void, AiSdkError, never>; dispose: () => Effect<void, AiSdkError, never>; }, AiSdkError, Scope | R>) | undefined; getWebRTCConfig: (() => Effect<{ dataChannelLabel: string; }, AiSdkError, never>) | undefined; doCreateWebRTCSession: ((options: { sdp: string; sessionConfig?: RealtimeModelV4SessionConfig | undefined; abortSignal?: AbortSignal | undefined; }) => Effect<{ sessionId: string; sdp: string; }, AiSdkError, never>) | undefined; doCreateClientSecret: ((options: RealtimeModelV4ClientSecretOptions) => Effect<RealtimeModelV4ClientSecretResult, AiSdkError, never>) | undefined; getWebSocketConfig: ((options: { token: string; url: string; }) => Effect<{ url: string; protocols?: string[] | undefined; }, AiSdkError, never>) | undefined; parseServerEvent: (raw: unknown) => Effect<RealtimeModelV4ServerEvent | RealtimeModelV4ServerEvent[], AiSdkError, never>; createServerEventParser: (() => Effect<(raw: unknown) => Effect<RealtimeModelV4ServerEvent | RealtimeModelV4ServerEvent[], AiSdkError, never>, AiSdkError, never>) | undefined; serializeClientEvent: (event: RealtimeModelV4ClientEvent, options?: { intent?: RealtimeModelV4SessionIntent | undefined; } | undefined) => Effect<unknown, AiSdkError, never>; buildSessionConfig: (config: RealtimeModelV4SessionConfig, options?: { intent?: RealtimeModelV4SessionIntent | undefined; } | undefined) => Effect<unknown, AiSdkError, never>; getServerWebSocketConfig: ((options?: { intent?: RealtimeModelV4SessionIntent | undefined; } | undefined) => Effect<RealtimeModelV4ServerConnection, AiSdkError, never>) | undefined; getHealthCheckResponse: ((raw: unknown) => Effect<unknown, AiSdkError, never>) | undefined; }, AiSdkError, never>; } & { getToken: (options: { model: string; } & RealtimeModelV4ClientSecretOptions & OpenAIRealtimeOptions) => Effect<RealtimeFactoryV4GetTokenResult, AiSdkError, never>; }
```

#### `openai.extractionModel`

```text
(modelId: (string & {}) | "gpt-6.2-astra" | "gpt-6.2-sol" | "gpt-6-astra" | "gpt-6.1-sol" | "gpt-6.1-terra" | "gpt-6-luna" | "gpt-6-sol" | "gpt-5.6" | "gpt-5.6-luna" | "gpt-5.6-sol" | "gpt-5.6-terra" | "gpt-5.5" | "gpt-5.4-pro" | "gpt-5.4" | "gpt-5.4-mini" | "gpt-5.4-nano" | "gpt-5.3-chat-latest" | "gpt-5.2-pro" | "gpt-5.2-chat-latest" | "gpt-5.2" | "gpt-5.1-chat-latest" | "gpt-5.1" | "gpt-5" | "gpt-5-mini" | "gpt-5-nano" | "gpt-5-chat-latest" | "gpt-4.1" | "gpt-4.1-mini" | "gpt-4.1-nano" | "gpt-4o" | "gpt-4o-mini" | "gpt-3.5-turbo" | "gpt-3.5-turbo-0125" | "gpt-3.5-turbo-1106" | "gpt-4.1-2025-04-14" | "gpt-4.1-mini-2025-04-14" | "gpt-4.1-nano-2025-04-14" | "gpt-4o-2024-05-13" | "gpt-4o-2024-08-06" | "gpt-4o-2024-11-20" | "gpt-4o-mini-2024-07-18" | "gpt-5-2025-08-07" | "gpt-5-mini-2025-08-07" | "gpt-5-nano-2025-08-07" | "gpt-5.1-2025-11-13" | "gpt-5.2-2025-12-11" | "gpt-5.2-pro-2025-12-11" | "gpt-5.4-2026-03-05" | "gpt-5.4-mini-2026-03-17" | "gpt-5.4-nano-2026-03-17" | "gpt-5.4-pro-2026-03-05" | "gpt-5.5-2026-04-23" | "o1" | "o1-2024-12-17" | "o3" | "o3-2025-04-16" | "o3-mini" | "o3-mini-2025-01-31" | "o4-mini" | "o4-mini-2025-04-16" | "gpt-5.1-codex-mini" | "gpt-5.1-codex" | "gpt-5-pro" | "gpt-5-codex" | "gpt-5-pro-2025-10-06" | "gpt-5.1-codex-max" | "gpt-5.2-codex" | "gpt-5.3-codex") => Effect<{ supportedFieldTypes: readonly ("number" | "text" | "date" | "time" | "datetime" | "duration" | "list")[]; doExtract: (options: ExtractionModelV4CallOptions) => Effect<ExtractionModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `openai.files`

```text
() => Effect<{ specificationVersion: "v4"; provider: string; uploadFile: (options: FilesV4UploadFileCallOptions) => Effect<FilesV4UploadFileResult, AiSdkError, never>; getFileMetadata: ((options: FilesV4GetFileMetadataCallOptions) => Effect<FilesV4GetFileMetadataResult, AiSdkError, never>) | undefined; downloadFile: ((options: FilesV4DownloadFileCallOptions) => Effect<{ content: Stream<Uint8Array<ArrayBufferLike>, AiSdkError, never>; mediaType?: string | undefined; providerMetadata?: SharedV4ProviderMetadata | undefined; warnings: SharedV4Warning[]; }, AiSdkError, Scope>) | undefined; deleteFile: ((options: FilesV4DeleteFileCallOptions) => Effect<FilesV4DeleteFileResult, AiSdkError, never>) | undefined; }, AiSdkError, never>
```

#### `openai.image`

```text
(modelId: (string & {}) | "gpt-image-2.6-flare" | "gpt-image-2.6-sunburst" | "gpt-image-2.5-flare" | "gpt-image-2.5-sunburst" | "gpt-image-2" | "gpt-image-1.5" | "gpt-image-1-mini" | "gpt-image-1" | "dall-e-3" | "dall-e-2" | "gpt-image-2.5-flare-2026-09-08" | "gpt-image-2.5-sunburst-2026-09-08" | "chatgpt-image-latest") => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `openai.imageModel`

```text
(modelId: (string & {}) | "gpt-image-2.6-flare" | "gpt-image-2.6-sunburst" | "gpt-image-2.5-flare" | "gpt-image-2.5-sunburst" | "gpt-image-2" | "gpt-image-1.5" | "gpt-image-1-mini" | "gpt-image-1" | "dall-e-3" | "dall-e-2" | "gpt-image-2.5-flare-2026-09-08" | "gpt-image-2.5-sunburst-2026-09-08" | "chatgpt-image-latest") => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `openai.languageModel`

```text
(modelId: (string & {}) | "gpt-6.2-astra" | "gpt-6.2-sol" | "gpt-6-astra" | "gpt-6.1-sol" | "gpt-6.1-terra" | "gpt-6-luna" | "gpt-6-sol" | "gpt-5.6" | "gpt-5.6-luna" | "gpt-5.6-sol" | "gpt-5.6-terra" | "gpt-5.5" | "gpt-5.4-pro" | "gpt-5.4" | "gpt-5.4-mini" | "gpt-5.4-nano" | "gpt-5.3-chat-latest" | "gpt-5.2-pro" | "gpt-5.2-chat-latest" | "gpt-5.2" | "gpt-5.1-chat-latest" | "gpt-5.1" | "gpt-5" | "gpt-5-mini" | "gpt-5-nano" | "gpt-5-chat-latest" | "gpt-4.1" | "gpt-4.1-mini" | "gpt-4.1-nano" | "gpt-4o" | "gpt-4o-mini" | "gpt-3.5-turbo" | "gpt-3.5-turbo-0125" | "gpt-3.5-turbo-1106" | "gpt-4.1-2025-04-14" | "gpt-4.1-mini-2025-04-14" | "gpt-4.1-nano-2025-04-14" | "gpt-4o-2024-05-13" | "gpt-4o-2024-08-06" | "gpt-4o-2024-11-20" | "gpt-4o-mini-2024-07-18" | "gpt-5-2025-08-07" | "gpt-5-mini-2025-08-07" | "gpt-5-nano-2025-08-07" | "gpt-5.1-2025-11-13" | "gpt-5.2-2025-12-11" | "gpt-5.2-pro-2025-12-11" | "gpt-5.4-2026-03-05" | "gpt-5.4-mini-2026-03-17" | "gpt-5.4-nano-2026-03-17" | "gpt-5.4-pro-2026-03-05" | "gpt-5.5-2026-04-23" | "o1" | "o1-2024-12-17" | "o3" | "o3-2025-04-16" | "o3-mini" | "o3-mini-2025-01-31" | "o4-mini" | "o4-mini-2025-04-16" | "gpt-5.1-codex-mini" | "gpt-5.1-codex" | "gpt-5-pro" | "gpt-5-codex" | "gpt-5-pro-2025-10-06" | "gpt-5.1-codex-max" | "gpt-5.2-codex" | "gpt-5.3-codex") => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

#### `openai.rerankingModel`

```text
((modelId: string) => Effect<{ doRerank: (options: RerankingModelV4CallOptions) => Effect<RerankingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined
```

#### `openai.responses`

```text
(modelId: (string & {}) | "gpt-6.2-astra" | "gpt-6.2-sol" | "gpt-6-astra" | "gpt-6.1-sol" | "gpt-6.1-terra" | "gpt-6-luna" | "gpt-6-sol" | "gpt-5.6" | "gpt-5.6-luna" | "gpt-5.6-sol" | "gpt-5.6-terra" | "gpt-5.5" | "gpt-5.4-pro" | "gpt-5.4" | "gpt-5.4-mini" | "gpt-5.4-nano" | "gpt-5.3-chat-latest" | "gpt-5.2-pro" | "gpt-5.2-chat-latest" | "gpt-5.2" | "gpt-5.1-chat-latest" | "gpt-5.1" | "gpt-5" | "gpt-5-mini" | "gpt-5-nano" | "gpt-5-chat-latest" | "gpt-4.1" | "gpt-4.1-mini" | "gpt-4.1-nano" | "gpt-4o" | "gpt-4o-mini" | "gpt-3.5-turbo" | "gpt-3.5-turbo-0125" | "gpt-3.5-turbo-1106" | "gpt-4.1-2025-04-14" | "gpt-4.1-mini-2025-04-14" | "gpt-4.1-nano-2025-04-14" | "gpt-4o-2024-05-13" | "gpt-4o-2024-08-06" | "gpt-4o-2024-11-20" | "gpt-4o-mini-2024-07-18" | "gpt-5-2025-08-07" | "gpt-5-mini-2025-08-07" | "gpt-5-nano-2025-08-07" | "gpt-5.1-2025-11-13" | "gpt-5.2-2025-12-11" | "gpt-5.2-pro-2025-12-11" | "gpt-5.4-2026-03-05" | "gpt-5.4-mini-2026-03-17" | "gpt-5.4-nano-2026-03-17" | "gpt-5.4-pro-2026-03-05" | "gpt-5.5-2026-04-23" | "o1" | "o1-2024-12-17" | "o3" | "o3-2025-04-16" | "o3-mini" | "o3-mini-2025-01-31" | "o4-mini" | "o4-mini-2025-04-16" | "gpt-5.1-codex-mini" | "gpt-5.1-codex" | "gpt-5-pro" | "gpt-5-codex" | "gpt-5-pro-2025-10-06" | "gpt-5.1-codex-max" | "gpt-5.2-codex" | "gpt-5.3-codex") => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

#### `openai.skills`

```text
() => Effect<{ specificationVersion: "v4"; provider: string; uploadSkill: (options: SkillsV4UploadSkillCallOptions) => Effect<SkillsV4UploadSkillResult, AiSdkError, never>; }, AiSdkError, never>
```

#### `openai.specificationVersion`

```text
"v4"
```

#### `openai.speech`

```text
(modelId: (string & {}) | "tts-1" | "tts-1-hd" | "gpt-4o-mini-tts" | "gpt-4o-mini-tts-2025-03-20" | "gpt-4o-mini-tts-2025-12-15" | "tts-1-1106" | "tts-1-hd-1106") => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `openai.speechModel`

```text
((modelId: string) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined
```

#### `openai.speechTranslationModel`

```text
(modelId: OpenAISpeechTranslationModelId) => Effect<{ doStream: (options: SpeechTranslationModelV4StreamOptions) => Effect<Omit<SpeechTranslationModelV4StreamResult & { stream: ReadableStream<SpeechTranslationModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechTranslationModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `openai.textEmbedding`

```text
(modelId: (string & {}) | "text-embedding-3-large" | "text-embedding-3-small" | "text-embedding-ada-002") => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `openai.textEmbeddingModel`

```text
(modelId: (string & {}) | "text-embedding-3-large" | "text-embedding-3-small" | "text-embedding-ada-002") => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `openai.tools`

```text
AdaptedTools<{ applyPatch: ProviderDefinedToolFactoryWithOutputSchema<{ callId: string; operation: ApplyPatchOperation; }, { status: "completed" | "failed"; output?: string | undefined; }, {}, {}>; customTool: (args: { description?: string | undefined; async?: boolean | undefined; format?: { type: "grammar"; syntax: "regex" | "lark"; definition: string; } | { type: "text"; } | undefined; } & { execute?: ToolExecuteFunction<string, unknown, {}> | undefined; needsApproval?: boolean | ToolNeedsApprovalFunction<string, {}> | undefined; toModelOutput?: ((options: { toolCallId: string; input: string; output: unknown; }) => ToolResultOutput | PromiseLike<ToolResultOutput>) | undefined; onInputStart?: ((options: ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; onInputDelta?: ((options: { inputTextDelta: string; } & ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; onInputAvailable?: ((options: { input: string; } & ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; }) => ProviderDefinedTool<string, unknown, {}>; codeInterpreter: (args?: { container?: string | { fileIds?: string[] | undefined; memoryLimit?: "1g" | "4g" | "16g" | "64g" | undefined; networkPolicy?: { type: "disabled"; } | { type: "allowlist"; allowedDomains: string[]; domainSecrets?: { domain: string; name: string; value: string; }[] | undefined; } | undefined; } | undefined; } | undefined) => ProviderExecutedTool<{ code?: string | null | undefined; containerId: string; }, { outputs?: ({ type: "logs"; logs: string; } | { type: "image"; url: string; })[] | null | undefined; }, {}>; computer: (options?: { execute?: ToolExecuteFunction<{ actions: ({ type: "click"; button: "left" | "right" | "wheel" | "back" | "forward"; x: number; y: number; keys?: string[] | undefined; } | { type: "double_click"; x: number; y: number; keys?: string[] | undefined; } | { type: "drag"; path: { x: number; y: number; }[]; keys?: string[] | undefined; } | { type: "keypress"; keys: string[]; } | { type: "move"; x: number; y: number; keys?: string[] | undefined; } | { type: "screenshot"; } | { type: "scroll"; x: number; y: number; scrollX: number; scrollY: number; keys?: string[] | undefined; } | { type: "type"; text: string; } | { type: "wait"; })[]; pendingSafetyChecks: { id: string; code?: string | undefined; message?: string | undefined; }[]; status: "completed" | "in_progress" | "incomplete"; }, { output: { type: "computer_screenshot"; imageUrl: string; fileId?: string | undefined; detail?: "auto" | "low" | "high" | "original" | undefined; } | { type: "computer_screenshot"; fileId: string; imageUrl?: string | undefined; detail?: "auto" | "low" | "high" | "original" | undefined; }; acknowledgedSafetyChecks?: { id: string; code?: string | undefined; message?: string | undefined; }[] | undefined; }, {}> | undefined; needsApproval?: boolean | ToolNeedsApprovalFunction<{ actions: ({ type: "click"; button: "left" | "right" | "wheel" | "back" | "forward"; x: number; y: number; keys?: string[] | undefined; } | { type: "double_click"; x: number; y: number; keys?: string[] | undefined; } | { type: "drag"; path: { x: number; y: number; }[]; keys?: string[] | undefined; } | { type: "keypress"; keys: string[]; } | { type: "move"; x: number; y: number; keys?: string[] | undefined; } | { type: "screenshot"; } | { type: "scroll"; x: number; y: number; scrollX: number; scrollY: number; keys?: string[] | undefined; } | { type: "type"; text: string; } | { type: "wait"; })[]; pendingSafetyChecks: { id: string; code?: string | undefined; message?: string | undefined; }[]; status: "completed" | "in_progress" | "incomplete"; }, {}> | undefined; toModelOutput?: ((options: { toolCallId: string; input: { actions: ({ type: "click"; button: "left" | "right" | "wheel" | "back" | "forward"; x: number; y: number; keys?: string[] | undefined; } | { type: "double_click"; x: number; y: number; keys?: string[] | undefined; } | { type: "drag"; path: { x: number; y: number; }[]; keys?: string[] | undefined; } | { type: "keypress"; keys: string[]; } | { type: "move"; x: number; y: number; keys?: string[] | undefined; } | { type: "screenshot"; } | { type: "scroll"; x: number; y: number; scrollX: number; scrollY: number; keys?: string[] | undefined; } | { type: "type"; text: string; } | { type: "wait"; })[]; pendingSafetyChecks: { id: string; code?: string | undefined; message?: string | undefined; }[]; status: "completed" | "in_progress" | "incomplete"; }; output: NoInfer<{ output: { type: "computer_screenshot"; imageUrl: string; fileId?: string | undefined; detail?: "auto" | "low" | "high" | "original" | undefined; } | { type: "computer_screenshot"; fileId: string; imageUrl?: string | undefined; detail?: "auto" | "low" | "high" | "original" | undefined; }; acknowledgedSafetyChecks?: { id: string; code?: string | undefined; message?: string | undefined; }[] | undefined; }>; }) => ToolResultOutput | PromiseLike<ToolResultOutput>) | undefined; onInputStart?: ((options: ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; onInputDelta?: ((options: { inputTextDelta: string; } & ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; onInputAvailable?: ((options: { input: { actions: ({ type: "click"; button: "left" | "right" | "wheel" | "back" | "forward"; x: number; y: number; keys?: string[] | undefined; } | { type: "double_click"; x: number; y: number; keys?: string[] | undefined; } | { type: "drag"; path: { x: number; y: number; }[]; keys?: string[] | undefined; } | { type: "keypress"; keys: string[]; } | { type: "move"; x: number; y: number; keys?: string[] | undefined; } | { type: "screenshot"; } | { type: "scroll"; x: number; y: number; scrollX: number; scrollY: number; keys?: string[] | undefined; } | { type: "type"; text: string; } | { type: "wait"; })[]; pendingSafetyChecks: { id: string; code?: string | undefined; message?: string | undefined; }[]; status: "completed" | "in_progress" | "incomplete"; }; } & ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; } | undefined) => ProviderDefinedTool<{ actions: ({ type: "click"; button: "left" | "right" | "wheel" | "back" | "forward"; x: number; y: number; keys?: string[] | undefined; } | { type: "double_click"; x: number; y: number; keys?: string[] | undefined; } | { type: "drag"; path: { x: number; y: number; }[]; keys?: string[] | undefined; } | { type: "keypress"; keys: string[]; } | { type: "move"; x: number; y: number; keys?: string[] | undefined; } | { type: "screenshot"; } | { type: "scroll"; x: number; y: number; scrollX: number; scrollY: number; keys?: string[] | undefined; } | { type: "type"; text: string; } | { type: "wait"; })[]; pendingSafetyChecks: { id: string; code?: string | undefined; message?: string | undefined; }[]; status: "completed" | "in_progress" | "incomplete"; }, { output: { type: "computer_screenshot"; imageUrl: string; fileId?: string | undefined; detail?: "auto" | "low" | "high" | "original" | undefined; } | { type: "computer_screenshot"; fileId: string; imageUrl?: string | undefined; detail?: "auto" | "low" | "high" | "original" | undefined; }; acknowledgedSafetyChecks?: { id: string; code?: string | undefined; message?: string | undefined; }[] | undefined; }, {}>; fileSearch: ProviderExecutedToolFactory<{}, { queries: string[]; results: { attributes: Record<string, unknown>; fileId: string; filename: string; score: number; text: string; }[] | null; }, { vectorStoreIds: string[]; maxNumResults?: number | undefined; ranking?: { ranker?: string | undefined; scoreThreshold?: number | undefined; } | undefined; filters?: OpenAIResponsesFileSearchToolComparisonFilter | OpenAIResponsesFileSearchToolCompoundFilter | undefined; }, {}>; imageGeneration: (args?: { action?: "auto" | "generate" | "edit" | undefined; background?: "auto" | "opaque" | "transparent" | undefined; inputFidelity?: "low" | "high" | undefined; inputImageMask?: { fileId?: string | undefined; imageUrl?: string | undefined; } | undefined; model?: string | undefined; moderation?: "auto" | "low" | undefined; outputCompression?: number | undefined; outputFormat?: "png" | "jpeg" | "webp" | undefined; partialImages?: number | undefined; quality?: "auto" | "low" | "high" | "medium" | "xhigh" | "max" | undefined; size?: (string & {}) | "auto" | "1024x1024" | "1024x1536" | "1536x1024" | undefined; } | undefined) => ProviderExecutedTool<{}, { result: string; }, {}>; localShell: ProviderDefinedToolFactoryWithOutputSchema<{ action: { type: "exec"; command: string[]; timeoutMs?: number | undefined; user?: string | undefined; workingDirectory?: string | undefined; env?: Record<string, string> | undefined; }; }, { output: string; }, {}, {}>; shell: ProviderDefinedToolFactoryWithOutputSchema<{ action: { commands: string[]; timeoutMs?: number | undefined; maxOutputLength?: number | undefined; }; }, { maxOutputLength?: number | undefined; output: { stdout: string; stderr: string; outcome: { type: "timeout"; } | { type: "exit"; exitCode: number; }; }[]; }, { environment?: { type: "containerAuto"; fileIds?: string[] | undefined; memoryLimit?: "1g" | "4g" | "16g" | "64g" | undefined; networkPolicy?: { type: "disabled"; } | { type: "allowlist"; allowedDomains: string[]; domainSecrets?: { domain: string; name: string; value: string; }[] | undefined; } | undefined; skills?: ({ type: "skillReference"; providerReference: SharedV4ProviderReference; version?: string | undefined; } | { type: "inline"; name: string; description: string; source: { type: "base64"; mediaType: "application/zip"; data: string; }; })[] | undefined; } | { type: "containerReference"; containerId: string; } | { type?: "local" | undefined; skills?: { name: string; description: string; path: string; }[] | undefined; } | undefined; }, {}>; webSearchPreview: ProviderExecutedToolFactory<{}, { action?: { type: "search"; query?: string | undefined; } | { type: "openPage"; url?: string | null | undefined; } | { type: "findInPage"; url?: string | null | undefined; pattern?: string | null | undefined; } | undefined; }, { searchContextSize?: "low" | "high" | "medium" | undefined; userLocation?: { type: "approximate"; country?: string | undefined; city?: string | undefined; region?: string | undefined; timezone?: string | undefined; } | undefined; }, {}>; webSearch: (args?: ({ externalWebAccess?: boolean | undefined; filters?: { allowedDomains?: string[] | undefined; blockedDomains?: string[] | undefined; } | undefined; searchContextSize?: "low" | "high" | "medium" | undefined; userLocation?: { type: "approximate"; country?: string | undefined; city?: string | undefined; region?: string | undefined; timezone?: string | undefined; } | undefined; } & { onInputStart?: ((options: ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; onInputDelta?: ((options: { inputTextDelta: string; } & ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; onInputAvailable?: ((options: { input: {}; } & ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; }) | undefined) => ProviderExecutedTool<{}, { action?: { type: "search"; query?: string | undefined; queries?: string[] | undefined; } | { type: "openPage"; url?: string | null | undefined; } | { type: "findInPage"; url?: string | null | undefined; pattern?: string | null | undefined; } | undefined; sources?: ({ type: "url"; url: string; } | { type: "api"; name: string; })[] | undefined; }, {}>; mcp: (args: { serverLabel: string; allowedTools?: string[] | { readOnly?: boolean | undefined; toolNames?: string[] | undefined; } | undefined; authorization?: string | undefined; headers?: Record<string, string> | undefined; requireApproval?: "always" | "never" | { never?: { toolNames?: string[] | undefined; } | undefined; } | undefined; serverDescription?: string | undefined; } & ({ serverUrl?: string | undefined; connectorId?: string | undefined; tunnelId?: undefined; } | { tunnelId: string; serverUrl?: undefined; connectorId?: undefined; })) => ProviderExecutedTool<{}, { type: "call"; serverLabel: string; name: string; arguments: string; output?: string | null | undefined; error?: JSONValue | undefined; }, {}>; programmaticToolCalling: () => ToolCallerTool<ProviderExecutedTool<{ code: string; fingerprint: string; }, { result: string; status: "completed" | "incomplete"; }, {}>>; toolSearch: (args?: ({ execution?: "server" | "client" | undefined; description?: string | undefined; parameters?: Record<string, unknown> | undefined; } & { execute?: ToolExecuteFunction<{ arguments?: unknown; call_id?: string | null | undefined; }, { tools: JSONObject[]; }, {}> | undefined; needsApproval?: boolean | ToolNeedsApprovalFunction<{ arguments?: unknown; call_id?: string | null | undefined; }, {}> | undefined; toModelOutput?: ((options: { toolCallId: string; input: { arguments?: unknown; call_id?: string | null | undefined; }; output: NoInfer<{ tools: JSONObject[]; }>; }) => ToolResultOutput | PromiseLike<ToolResultOutput>) | undefined; onInputStart?: ((options: ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; onInputDelta?: ((options: { inputTextDelta: string; } & ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; onInputAvailable?: ((options: { input: { arguments?: unknown; call_id?: string | null | undefined; }; } & ToolExecutionOptions<{}>) => void | PromiseLike<void>) | undefined; }) | undefined) => ProviderDefinedTool<{ arguments?: unknown; call_id?: string | null | undefined; }, { tools: JSONObject[]; }, {}>; }>
```

#### `openai.transcription`

```text
(modelId: (string & {}) | "whisper-1" | "gpt-4o-mini-transcribe" | "gpt-4o-transcribe" | "gpt-4o-transcribe-diarize" | "gpt-transcribe" | "gpt-live-transcribe" | "gpt-realtime-whisper" | "gpt-4o-mini-transcribe-2025-03-20" | "gpt-4o-mini-transcribe-2025-12-15") => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `openai.transcriptionModel`

```text
((modelId: string) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined
```

#### `openai.translation`

```text
(modelId: OpenAISpeechTranslationModelId) => Effect<{ doStream: (options: SpeechTranslationModelV4StreamOptions) => Effect<Omit<SpeechTranslationModelV4StreamResult & { stream: ReadableStream<SpeechTranslationModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechTranslationModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```


## `OpenAIChatLanguageModelOptions`

The source declaration does not provide a JSDoc description.

```text
type OpenAILanguageModelChatOptions = InferSchema<
  typeof openaiLanguageModelChatOptions
>;
```

## `OpenAIChatMessageProviderOptions`

The source declaration does not provide a JSDoc description.

```text
type OpenAIChatMessageProviderOptions = InferSchema<
  typeof openaiChatMessageProviderOptions
>;
```

## `OpenAIComputerAction`

The source declaration does not provide a JSDoc description.

```text
type OpenAIComputerAction = z.infer<ReturnType<typeof computerActionSchema>>;
```

## `OpenAIComputerSafetyCheck`

The source declaration does not provide a JSDoc description.

```text
type OpenAIComputerSafetyCheck = z.infer<ReturnType<typeof safetyCheckSchema>>;
```

## `OpenAIDecisionModelId`

The source declaration does not provide a JSDoc description.

```text
type OpenAIDecisionModelId = OpenAIModelIds['decision'] | (string & {});
```

## `OpenAIDecisionModelOptions`

The source declaration does not provide a JSDoc description.

```text
type OpenAIDecisionModelOptions = InferSchema<
  typeof openaiDecisionModelOptions
>;
```

## `OpenAIEmbeddingModelOptions`

The source declaration does not provide a JSDoc description.

```text
type OpenAIEmbeddingModelOptions = InferSchema<
  typeof openaiEmbeddingModelOptions
>;
```

## `OpenAIFilesOptions`

The source declaration does not provide a JSDoc description.

```text
type OpenAIFilesOptions = InferSchema<typeof openaiFilesOptionsSchema>;
```

## `OpenAIImageModelEditOptions`

The source declaration does not provide a JSDoc description.

```text
type OpenAIImageModelEditOptions = InferSchema<
  typeof openaiImageModelEditOptions
>;
```

## `OpenAIImageModelGenerationOptions`

The source declaration does not provide a JSDoc description.

```text
type OpenAIImageModelGenerationOptions = InferSchema<
  typeof openaiImageModelGenerationOptions
>;
```

## `OpenAIImageModelOptions`

The source declaration does not provide a JSDoc description.

```text
type OpenAIImageModelOptions = InferSchema<typeof openaiImageModelOptions>;
```

## `OpenAILanguageModelChatOptions`

The source declaration does not provide a JSDoc description.

```text
type OpenAILanguageModelChatOptions = InferSchema<
  typeof openaiLanguageModelChatOptions
>;
```

## `OpenAILanguageModelCompletionOptions`

The source declaration does not provide a JSDoc description.

```text
type OpenAILanguageModelCompletionOptions = InferSchema<
  typeof openaiLanguageModelCompletionOptions
>;
```

## `OpenAILanguageModelResponsesOptions`

The source declaration does not provide a JSDoc description.

```text
type OpenAILanguageModelResponsesOptions = InferSchema<
  typeof openaiLanguageModelResponsesOptionsSchema
>;
```

## `OpenAIProvider`

Provider returned by the adapter, with Effect-based model selection for OpenAI.

```text
export type OpenAIProvider = ReturnType<typeof wrapProviderMethods> & {
    tools: AdaptedTools<SdkProvider['tools']>;
};
```

## `OpenAIProviderSettings`

Keep the native OpenAI options and allow `apiKey` to resolve through Effect when the SDK
requests the value.

```text
export type OpenAIProviderSettings<E = never, R = never> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
```

## `OpenaiResponsesCompactionProviderMetadata`

The source declaration does not provide a JSDoc description.

```text
type OpenaiResponsesCompactionProviderMetadata = {
  openai: ResponsesCompactionProviderMetadata;
};
```

## `OpenaiResponsesProviderMetadata`

The source declaration does not provide a JSDoc description.

```text
type OpenaiResponsesProviderMetadata = {
  openai: ResponsesProviderMetadata;
};
```

## `OpenAIResponsesProviderOptions`

The source declaration does not provide a JSDoc description.

```text
type OpenAILanguageModelResponsesOptions = InferSchema<
  typeof openaiLanguageModelResponsesOptionsSchema
>;
```

## `OpenaiResponsesReasoningProviderMetadata`

The source declaration does not provide a JSDoc description.

```text
type OpenaiResponsesReasoningProviderMetadata = {
  openai: ResponsesReasoningProviderMetadata;
};
```

## `OpenaiResponsesSourceDocumentProviderMetadata`

The source declaration does not provide a JSDoc description.

```text
type OpenaiResponsesSourceDocumentProviderMetadata = {
  openai: ResponsesSourceDocumentProviderMetadata;
};
```

## `OpenAIResponsesSystemMessageOptions`

The source declaration does not provide a JSDoc description.

```text
type OpenAIResponsesSystemMessageOptions = InferSchema<
  typeof openaiResponsesSystemMessageOptionsSchema
>;
```

## `OpenaiResponsesTextProviderMetadata`

The source declaration does not provide a JSDoc description.

```text
type OpenaiResponsesTextProviderMetadata = {
  openai: ResponsesTextProviderMetadata;
};
```

## `OpenaiResponsesToolCallProviderMetadata`

The source declaration does not provide a JSDoc description.

```text
type OpenaiResponsesToolCallProviderMetadata = {
  openai: ResponsesToolCallProviderMetadata;
};
```

## `OpenAIResponsesToolResultOptions`

The source declaration does not provide a JSDoc description.

```text
type OpenAIResponsesToolResultOptions = InferSchema<
  typeof openaiResponsesToolResultOptionsSchema
>;
```

## `OpenAISpeechModelOptions`

The source declaration does not provide a JSDoc description.

```text
type OpenAISpeechModelOptions = InferSchema<
  typeof openaiSpeechModelOptionsSchema
>;
```

## `OpenAIToolOptions`

The source declaration does not provide a JSDoc description.

```text
type OpenAIToolOptions = {
  allowedCallers?: Array<'direct' | 'programmatic'>;
  async?: boolean;
  deferLoading?: boolean;
  omitFromRequestTools?: boolean;
  outputSchema?: JSONObject;
  namespace?: {
    name: string;
    description: string;
  };
};
```

## `OpenAITranscriptionModelOptions`

The source declaration does not provide a JSDoc description.

```text
type OpenAITranscriptionModelOptions = InferSchema<
  typeof openAITranscriptionModelOptions
>;
```

## `VERSION`

Expose the version of the OpenAI SDK used by this adapter.

```text
VERSION: string
```
