---
title: google provider API
doc-type: reference
sources: [src/providers/google.ts, package.json]
---

# google provider API

> **TL;DR:** This entry exposes 49 public exports through `@jambudipa/ai-effect/google`.
> The contracts below come from the installed package declarations and JSDoc.

## Import

`@jambudipa/ai-effect/google` selects the package export for this provider. See the [provider source](../../../src/providers/google.ts).

## `createGoogle`

Construct the Google Generative AI provider inside an Effect. Keep the scope open when
using an Effect resolver for `apiKey`.

```text
createGoogle(options?: StaticProviderSettings<GoogleProviderSettings, "apiKey"> | undefined): Effect<GoogleProvider, AiSdkError, never>
createGoogle<E, R>(options: EffectProviderSettings<GoogleProviderSettings, "apiKey", E, R>): Effect<GoogleProvider, AiSdkError, R | Scope>
```

## `createGoogleGenerativeAI`

Expose the same Google Generative AI factory as `createGoogle` under the SDK alias.

```text
createGoogleGenerativeAI(options?: StaticProviderSettings<GoogleProviderSettings, "apiKey"> | undefined): Effect<GoogleProvider, AiSdkError, never>
createGoogleGenerativeAI<E, R>(options: EffectProviderSettings<GoogleProviderSettings, "apiKey", E, R>): Effect<GoogleProvider, AiSdkError, R | Scope>
```

## `Experimental_GoogleRealtimeModel`

Construct the SDK Google realtime model lazily with its native options.
Effect model returned by `Experimental_GoogleRealtimeModel`. Use its realtime connection
operations in an Effect program.

```text
Experimental_GoogleRealtimeModel(modelId: string, config: ProviderHostConfiguration<GoogleRealtimeModelConfig>): Effect<{ specificationVersion: "v4"; provider: string; modelId: string; capabilities: { conversation: "continuous" | "turn-based"; transports: readonly ("websocket" | "webrtc")[]; connections?: readonly ("webrtc" | "client-secret-websocket" | "server-websocket" | "provider")[] | undefined; startup?: "session-start" | "session-update" | undefined; finalization?: "session-close" | "transport-close" | undefined; } | undefined; createTransport: (<E, R>(options: RealtimeTransportOptions<E, R>) => Effect<{ connect: (options: Omit<{ api: string; sessionConfig?: RealtimeModelV4SessionConfig | undefined; stream?: MediaStream | undefined; capture?: boolean | undefined; abortSignal: AbortSignal; }, "abortSignal"> & { readonly abortSignal?: AbortSignal | undefined; }) => Effect<void, AiSdkError, never>; sendEvent: (event: RealtimeModelV4ClientEvent, shouldSend?: (() => boolean) | undefined) => Effect<void, AiSdkError, never>; startCapture: (stream?: MediaStream | undefined) => Effect<void, AiSdkError, never>; stopCapture: () => Effect<void, AiSdkError, never>; stopPlayback: () => Effect<void, AiSdkError, never>; resumePlayback: () => Effect<void, AiSdkError, never>; finish: () => Effect<void, AiSdkError, never>; close: () => Effect<void, AiSdkError, never>; dispose: () => Effect<void, AiSdkError, never>; }, AiSdkError, Scope | R>) | undefined; getWebRTCConfig: (() => Effect<{ dataChannelLabel: string; }, AiSdkError, never>) | undefined; doCreateWebRTCSession: ((options: { sdp: string; sessionConfig?: RealtimeModelV4SessionConfig | undefined; abortSignal?: AbortSignal | undefined; }) => Effect<{ sessionId: string; sdp: string; }, AiSdkError, never>) | undefined; doCreateClientSecret: ((options: RealtimeModelV4ClientSecretOptions) => Effect<RealtimeModelV4ClientSecretResult, AiSdkError, never>) | undefined; getWebSocketConfig: ((options: { token: string; url: string; }) => Effect<{ url: string; protocols?: string[] | undefined; }, AiSdkError, never>) | undefined; parseServerEvent: (raw: unknown) => Effect<RealtimeModelV4ServerEvent | RealtimeModelV4ServerEvent[], AiSdkError, never>; createServerEventParser: (() => Effect<(raw: unknown) => Effect<RealtimeModelV4ServerEvent | RealtimeModelV4ServerEvent[], AiSdkError, never>, AiSdkError, never>) | undefined; serializeClientEvent: (event: RealtimeModelV4ClientEvent, options?: { intent?: RealtimeModelV4SessionIntent | undefined; } | undefined) => Effect<unknown, AiSdkError, never>; buildSessionConfig: (config: RealtimeModelV4SessionConfig, options?: { intent?: RealtimeModelV4SessionIntent | undefined; } | undefined) => Effect<unknown, AiSdkError, never>; getServerWebSocketConfig: ((options?: { intent?: RealtimeModelV4SessionIntent | undefined; } | undefined) => Effect<RealtimeModelV4ServerConnection, AiSdkError, never>) | undefined; getHealthCheckResponse: ((raw: unknown) => Effect<unknown, AiSdkError, never>) | undefined; }, AiSdkError, never>
```

## `Experimental_GoogleRealtimeModelConfig`

Carry the native Google realtime configuration through the adapter host boundary.

```text
export type Experimental_GoogleRealtimeModelConfig = ProviderHostConfiguration<SdkExperimental_GoogleRealtimeModelConfig>;
```

## `Experimental_GoogleRealtimeModelId`

The source declaration does not provide a JSDoc description.

```text
type GoogleRealtimeModelId = string;
```

## `Experimental_GoogleRealtimeModelOptions`

The source declaration does not provide a JSDoc description.

```text
type GoogleRealtimeModelOptions = {
  /**
   * Gemini Live Translation configuration.
   *
   * Required for `gemini-3.5-live-translate-preview` when translating speech
   * to a target language.
   */
  translationConfig?: {
    /**
     * BCP-47 language code of the language to translate into.
     * Defaults to `en` in the Gemini API.
     */
    targetLanguageCode?: string;
    /**
     * Whether input audio already in the target language should be echoed
     * instead of producing silence.
     */
    echoTargetLanguage?: boolean;
  };
  /**
   * Gemini Live thinking configuration.
   *
   * Supported by Live models with background reasoning (e.g.
   * `gemini-3.8-live-extended-thinking`), which can process multi-step
   * reasoning and function calls while streaming audio responses. Not
   * supported by latency-optimized models (e.g. `gemini-3.8-live`).
   */
  thinkingConfig?: {
    /**
     * Thinking effort level. Background-reasoning Live models require exactly
     * one of `thinkingLevel` or `thinkingBudget`; when neither is set, the
     * provider sends `thinkingLevel: 'low'` on those models.
     */
    thinkingLevel?: 'low' | 'medium' | 'high';
    /**
     * Token budget for background thinking. Mutually exclusive with
     * `thinkingLevel`; setting it suppresses the default level.
     */
    thinkingBudget?: number;
    /**
     * Whether thought summaries should be included in the response.
     */
    includeThoughts?: boolean;
  };
  /**
   * Default `behavior` stamped onto every function declaration in the
   * session setup.
   *
   * Gemini 3.8 Live models default to `NON_BLOCKING` (asynchronous) function
   * calling. Set to `BLOCKING` for synchronous calls on models that support it
   * (e.g. `gemini-3.8-live`); background-reasoning models accept only
   * `NON_BLOCKING`.
   */
  defaultToolBehavior?: 'BLOCKING' | 'NON_BLOCKING';
};
```

## `Experimental_GoogleSpeechTranslationModel`

Construct the SDK Google speech translation model lazily with its native options. It
exposes the workflow serialization hooks.
Effect model returned by `Experimental_GoogleSpeechTranslationModel`. Use its speech
translation operations in an Effect program.

```text
Experimental_GoogleSpeechTranslationModel(modelId: GoogleSpeechTranslationModelId, config: ProviderHostConfiguration<GoogleSpeechTranslationModelConfig>): Effect<{ doStream: (options: SpeechTranslationModelV4StreamOptions) => Effect<Omit<SpeechTranslationModelV4StreamResult & { stream: ReadableStream<SpeechTranslationModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechTranslationModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

### Public properties

#### `Experimental_GoogleSpeechTranslationModel[WORKFLOW_DESERIALIZE]`

```text
(input: { modelId: GoogleSpeechTranslationModelId; config: GoogleSpeechTranslationModelConfig; }) => Effect<{ doStream: (options: SpeechTranslationModelV4StreamOptions) => Effect<Omit<SpeechTranslationModelV4StreamResult & { stream: ReadableStream<SpeechTranslationModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechTranslationModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `Experimental_GoogleSpeechTranslationModel[WORKFLOW_SERIALIZE]`

```text
(model: { doStream: (options: SpeechTranslationModelV4StreamOptions) => Effect<Omit<SpeechTranslationModelV4StreamResult & { stream: ReadableStream<SpeechTranslationModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechTranslationModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>; specificationVersion: "v4"; provider: string; modelId: string; }) => Effect<{ modelId: string; config: JSONObject; }, AiSdkError, never>
```


## `Experimental_GoogleSpeechTranslationModelConfig`

Carry the native Google speech translation configuration through the host boundary.

```text
export type Experimental_GoogleSpeechTranslationModelConfig = ProviderHostConfiguration<SdkExperimental_GoogleSpeechTranslationModelConfig>;
```

## `Experimental_GoogleSpeechTranslationModelId`

The source declaration does not provide a JSDoc description.

```text
type GoogleSpeechTranslationModelId = GoogleModelIds['speechTranslation'] | (string & {});
```

## `Experimental_GoogleSpeechTranslationModelOptions`

The source declaration does not provide a JSDoc description.

```text
type GoogleSpeechTranslationModelOptions = InferSchema<typeof googleSpeechTranslationModelOptions>;
```

## `Experimental_GoogleTranslationModel`

Expose the same Google Generative AI constructor as
`Experimental_GoogleSpeechTranslationModel` under the SDK alias.
Expose the same Google Generative AI contract as
`Experimental_GoogleSpeechTranslationModel` under the SDK alias.

```text
Experimental_GoogleTranslationModel(modelId: GoogleSpeechTranslationModelId, config: ProviderHostConfiguration<GoogleSpeechTranslationModelConfig>): Effect<{ doStream: (options: SpeechTranslationModelV4StreamOptions) => Effect<Omit<SpeechTranslationModelV4StreamResult & { stream: ReadableStream<SpeechTranslationModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechTranslationModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

### Public properties

#### `Experimental_GoogleTranslationModel[WORKFLOW_DESERIALIZE]`

```text
(input: { modelId: GoogleSpeechTranslationModelId; config: GoogleSpeechTranslationModelConfig; }) => Effect<{ doStream: (options: SpeechTranslationModelV4StreamOptions) => Effect<Omit<SpeechTranslationModelV4StreamResult & { stream: ReadableStream<SpeechTranslationModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechTranslationModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `Experimental_GoogleTranslationModel[WORKFLOW_SERIALIZE]`

```text
(model: { doStream: (options: SpeechTranslationModelV4StreamOptions) => Effect<Omit<SpeechTranslationModelV4StreamResult & { stream: ReadableStream<SpeechTranslationModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechTranslationModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>; specificationVersion: "v4"; provider: string; modelId: string; }) => Effect<{ modelId: string; config: JSONObject; }, AiSdkError, never>
```


## `Experimental_GoogleTranslationModelConfig`

Alias the speech translation configuration under the SDK translation model name.

```text
export type Experimental_GoogleTranslationModelConfig = ProviderHostConfiguration<SdkExperimental_GoogleTranslationModelConfig>;
```

## `Experimental_GoogleTranslationModelId`

The source declaration does not provide a JSDoc description.

```text
type GoogleSpeechTranslationModelId = GoogleModelIds['speechTranslation'] | (string & {});
```

## `Experimental_GoogleTranslationModelOptions`

The source declaration does not provide a JSDoc description.

```text
type GoogleSpeechTranslationModelOptions = InferSchema<typeof googleSpeechTranslationModelOptions>;
```

## `google`

Adapt the preconfigured provider from the Google Generative AI SDK. Use the factory to
supply explicit settings.

```text
google(modelId: "gemini-nano-banana-2.1" | "gemini-4-argon" | "gemini-4-carbon" | "gemini-4-hydrogen" | "gemini-4-neon" | "gemini-3.8-flash" | "gemini-3.7-flash" | "gemini-3.6-flash" | "gemini-3.5-flash" | "gemini-3.5-flash-lite" | "gemini-3.1-pro-preview" | "gemini-3.1-flash-image-preview" | "gemini-3.1-flash-lite-preview" | "gemini-3-pro-preview" | "gemini-3-pro-image-preview" | "gemini-3-flash-preview" | "gemini-2.5-pro" | "gemini-2.5-flash" | "gemini-2.5-flash-lite" | "gemini-2.5-flash-lite-preview-06-17" | "gemini-2.0-flash" | "aqa" | "deep-research-max-preview-04-2026" | "deep-research-preview-04-2026" | "deep-research-pro-preview-12-2025" | "gemini-2.0-flash-001" | "gemini-2.0-flash-lite" | "gemini-2.0-flash-lite-001" | "gemini-2.5-computer-use-preview-10-2025" | "gemini-2.5-flash-image" | "gemini-2.5-flash-native-audio-latest" | "gemini-2.5-flash-native-audio-preview-09-2025" | "gemini-2.5-flash-native-audio-preview-12-2025" | "gemini-2.5-flash-preview-tts" | "gemini-2.5-pro-preview-tts" | "gemini-3.1-flash-tts-preview" | "gemini-3.1-pro-preview-customtools" | "gemini-flash-latest" | "gemini-flash-lite-latest" | "gemini-pro-latest" | "gemini-robotics-er-1.5-preview" | "gemma-3-12b-it" | "gemma-3-1b-it" | "gemma-3-27b-it" | "gemma-3-4b-it" | "gemma-3n-e2b-it" | "gemma-3n-e4b-it" | "nano-banana-pro-preview" | (string & {})): Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

### Public properties

#### `google.chat`

```text
(modelId: (string & {}) | "gemini-nano-banana-2.1" | "gemini-4-argon" | "gemini-4-carbon" | "gemini-4-hydrogen" | "gemini-4-neon" | "gemini-3.8-flash" | "gemini-3.7-flash" | "gemini-3.6-flash" | "gemini-3.5-flash" | "gemini-3.5-flash-lite" | "gemini-3.1-pro-preview" | "gemini-3.1-flash-image-preview" | "gemini-3.1-flash-lite-preview" | "gemini-3-pro-preview" | "gemini-3-pro-image-preview" | "gemini-3-flash-preview" | "gemini-2.5-pro" | "gemini-2.5-flash" | "gemini-2.5-flash-lite" | "gemini-2.5-flash-lite-preview-06-17" | "gemini-2.0-flash" | "aqa" | "deep-research-max-preview-04-2026" | "deep-research-preview-04-2026" | "deep-research-pro-preview-12-2025" | "gemini-2.0-flash-001" | "gemini-2.0-flash-lite" | "gemini-2.0-flash-lite-001" | "gemini-2.5-computer-use-preview-10-2025" | "gemini-2.5-flash-image" | "gemini-2.5-flash-native-audio-latest" | "gemini-2.5-flash-native-audio-preview-09-2025" | "gemini-2.5-flash-native-audio-preview-12-2025" | "gemini-2.5-flash-preview-tts" | "gemini-2.5-pro-preview-tts" | "gemini-3.1-flash-tts-preview" | "gemini-3.1-pro-preview-customtools" | "gemini-flash-latest" | "gemini-flash-lite-latest" | "gemini-pro-latest" | "gemini-robotics-er-1.5-preview" | "gemma-3-12b-it" | "gemma-3-1b-it" | "gemma-3-27b-it" | "gemma-3-4b-it" | "gemma-3n-e2b-it" | "gemma-3n-e4b-it" | "nano-banana-pro-preview") => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

#### `google.decisionModel`

```text
(modelId: GoogleDecisionModelId) => Effect<{ supportedQuestionTypes: readonly ("boolean" | "choice" | "score" | "box")[]; doDecide: (options: DecisionModelV4CallOptions) => Effect<DecisionModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `google.embedding`

```text
(modelId: (string & {}) | "gemini-embedding-001" | "gemini-embedding-2" | "gemini-embedding-2-preview") => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `google.embeddingModel`

```text
(modelId: (string & {}) | "gemini-embedding-001" | "gemini-embedding-2" | "gemini-embedding-2-preview") => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `google.evaluationModel`

```text
(modelId: GoogleDecisionModelId) => Effect<{ supportedQuestionTypes: readonly ("boolean" | "choice" | "score" | "box")[]; doDecide: (options: DecisionModelV4CallOptions) => Effect<DecisionModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; } & { doEvaluate: (options: DecisionModelV4CallOptions) => Effect<DecisionModelV4Result, AiSdkError, never>; }, AiSdkError, never>
```

#### `google.experimental_batch`

```text
() => Effect<{ specificationVersion: "v4"; provider: string; supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doStartBatch: (options: BatchV4StartOptions<{ text: (string & {}) | "gemini-nano-banana-2.1" | "gemini-4-argon" | "gemini-4-carbon" | "gemini-4-hydrogen" | "gemini-4-neon" | "gemini-3.8-flash" | "gemini-3.7-flash" | "gemini-3.6-flash" | "gemini-3.5-flash" | "gemini-3.5-flash-lite" | "gemini-3.1-pro-preview" | "gemini-3.1-flash-image-preview" | "gemini-3.1-flash-lite-preview" | "gemini-3-pro-preview" | "gemini-3-pro-image-preview" | "gemini-3-flash-preview" | "gemini-2.5-pro" | "gemini-2.5-flash" | "gemini-2.5-flash-lite" | "gemini-2.5-flash-lite-preview-06-17" | "gemini-2.0-flash" | "aqa" | "deep-research-max-preview-04-2026" | "deep-research-preview-04-2026" | "deep-research-pro-preview-12-2025" | "gemini-2.0-flash-001" | "gemini-2.0-flash-lite" | "gemini-2.0-flash-lite-001" | "gemini-2.5-computer-use-preview-10-2025" | "gemini-2.5-flash-image" | "gemini-2.5-flash-native-audio-latest" | "gemini-2.5-flash-native-audio-preview-09-2025" | "gemini-2.5-flash-native-audio-preview-12-2025" | "gemini-2.5-flash-preview-tts" | "gemini-2.5-pro-preview-tts" | "gemini-3.1-flash-tts-preview" | "gemini-3.1-pro-preview-customtools" | "gemini-flash-latest" | "gemini-flash-lite-latest" | "gemini-pro-latest" | "gemini-robotics-er-1.5-preview" | "gemma-3-12b-it" | "gemma-3-1b-it" | "gemma-3-27b-it" | "gemma-3-4b-it" | "gemma-3n-e2b-it" | "gemma-3n-e4b-it" | "nano-banana-pro-preview"; image: (string & {}) | "gemini-nano-banana-2.1" | "gemini-3.1-flash-image-preview" | "gemini-3-pro-image-preview" | "gemini-2.5-flash-image"; }>) => Effect<BatchV4StartResult, AiSdkError, never>; doGetBatchStatus: (options: BatchV4OperationOptions) => Effect<BatchV4Status, AiSdkError, never>; doGetBatchResults: (options: BatchV4OperationOptions) => Effect<Stream<BatchV4ItemResult, AiSdkError, never>, AiSdkError, Scope>; doCancelBatch: ((options: BatchV4OperationOptions) => Effect<BatchV4CancelResult, AiSdkError, never>) | undefined; doListBatches: ((options: BatchV4ListOptions) => Effect<BatchV4ListResult, AiSdkError, never>) | undefined; }, AiSdkError, never>
```

#### `google.experimental_realtime`

```text
((modelId: string) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; capabilities: { conversation: "continuous" | "turn-based"; transports: readonly ("websocket" | "webrtc")[]; connections?: readonly ("webrtc" | "client-secret-websocket" | "server-websocket" | "provider")[] | undefined; startup?: "session-start" | "session-update" | undefined; finalization?: "session-close" | "transport-close" | undefined; } | undefined; createTransport: (<E, R>(options: RealtimeTransportOptions<E, R>) => Effect<{ connect: (options: Omit<{ api: string; sessionConfig?: RealtimeModelV4SessionConfig | undefined; stream?: MediaStream | undefined; capture?: boolean | undefined; abortSignal: AbortSignal; }, "abortSignal"> & { readonly abortSignal?: AbortSignal | undefined; }) => Effect<void, AiSdkError, never>; sendEvent: (event: RealtimeModelV4ClientEvent, shouldSend?: (() => boolean) | undefined) => Effect<void, AiSdkError, never>; startCapture: (stream?: MediaStream | undefined) => Effect<void, AiSdkError, never>; stopCapture: () => Effect<void, AiSdkError, never>; stopPlayback: () => Effect<void, AiSdkError, never>; resumePlayback: () => Effect<void, AiSdkError, never>; finish: () => Effect<void, AiSdkError, never>; close: () => Effect<void, AiSdkError, never>; dispose: () => Effect<void, AiSdkError, never>; }, AiSdkError, Scope | R>) | undefined; getWebRTCConfig: (() => Effect<{ dataChannelLabel: string; }, AiSdkError, never>) | undefined; doCreateWebRTCSession: ((options: { sdp: string; sessionConfig?: RealtimeModelV4SessionConfig | undefined; abortSignal?: AbortSignal | undefined; }) => Effect<{ sessionId: string; sdp: string; }, AiSdkError, never>) | undefined; doCreateClientSecret: ((options: RealtimeModelV4ClientSecretOptions) => Effect<RealtimeModelV4ClientSecretResult, AiSdkError, never>) | undefined; getWebSocketConfig: ((options: { token: string; url: string; }) => Effect<{ url: string; protocols?: string[] | undefined; }, AiSdkError, never>) | undefined; parseServerEvent: (raw: unknown) => Effect<RealtimeModelV4ServerEvent | RealtimeModelV4ServerEvent[], AiSdkError, never>; createServerEventParser: (() => Effect<(raw: unknown) => Effect<RealtimeModelV4ServerEvent | RealtimeModelV4ServerEvent[], AiSdkError, never>, AiSdkError, never>) | undefined; serializeClientEvent: (event: RealtimeModelV4ClientEvent, options?: { intent?: RealtimeModelV4SessionIntent | undefined; } | undefined) => Effect<unknown, AiSdkError, never>; buildSessionConfig: (config: RealtimeModelV4SessionConfig, options?: { intent?: RealtimeModelV4SessionIntent | undefined; } | undefined) => Effect<unknown, AiSdkError, never>; getServerWebSocketConfig: ((options?: { intent?: RealtimeModelV4SessionIntent | undefined; } | undefined) => Effect<RealtimeModelV4ServerConnection, AiSdkError, never>) | undefined; getHealthCheckResponse: ((raw: unknown) => Effect<unknown, AiSdkError, never>) | undefined; }, AiSdkError, never>) & { getToken: (options: RealtimeFactoryV4GetTokenOptions) => Effect<RealtimeFactoryV4GetTokenResult, AiSdkError, never>; }
```

#### `google.extractionModel`

```text
(modelId: (string & {}) | "gemini-nano-banana-2.1" | "gemini-4-argon" | "gemini-4-carbon" | "gemini-4-hydrogen" | "gemini-4-neon" | "gemini-3.8-flash" | "gemini-3.7-flash" | "gemini-3.6-flash" | "gemini-3.5-flash" | "gemini-3.5-flash-lite" | "gemini-3.1-pro-preview" | "gemini-3.1-flash-image-preview" | "gemini-3.1-flash-lite-preview" | "gemini-3-pro-preview" | "gemini-3-pro-image-preview" | "gemini-3-flash-preview" | "gemini-2.5-pro" | "gemini-2.5-flash" | "gemini-2.5-flash-lite" | "gemini-2.5-flash-lite-preview-06-17" | "gemini-2.0-flash" | "aqa" | "deep-research-max-preview-04-2026" | "deep-research-preview-04-2026" | "deep-research-pro-preview-12-2025" | "gemini-2.0-flash-001" | "gemini-2.0-flash-lite" | "gemini-2.0-flash-lite-001" | "gemini-2.5-computer-use-preview-10-2025" | "gemini-2.5-flash-image" | "gemini-2.5-flash-native-audio-latest" | "gemini-2.5-flash-native-audio-preview-09-2025" | "gemini-2.5-flash-native-audio-preview-12-2025" | "gemini-2.5-flash-preview-tts" | "gemini-2.5-pro-preview-tts" | "gemini-3.1-flash-tts-preview" | "gemini-3.1-pro-preview-customtools" | "gemini-flash-latest" | "gemini-flash-lite-latest" | "gemini-pro-latest" | "gemini-robotics-er-1.5-preview" | "gemma-3-12b-it" | "gemma-3-1b-it" | "gemma-3-27b-it" | "gemma-3-4b-it" | "gemma-3n-e2b-it" | "gemma-3n-e4b-it" | "nano-banana-pro-preview") => Effect<{ supportedFieldTypes: readonly ("number" | "text" | "date" | "time" | "datetime" | "duration" | "list")[]; doExtract: (options: ExtractionModelV4CallOptions) => Effect<ExtractionModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `google.files`

```text
() => Effect<{ specificationVersion: "v4"; provider: string; uploadFile: (options: FilesV4UploadFileCallOptions) => Effect<FilesV4UploadFileResult, AiSdkError, never>; getFileMetadata: ((options: FilesV4GetFileMetadataCallOptions) => Effect<FilesV4GetFileMetadataResult, AiSdkError, never>) | undefined; downloadFile: ((options: FilesV4DownloadFileCallOptions) => Effect<{ content: Stream<Uint8Array<ArrayBufferLike>, AiSdkError, never>; mediaType?: string | undefined; providerMetadata?: SharedV4ProviderMetadata | undefined; warnings: SharedV4Warning[]; }, AiSdkError, Scope>) | undefined; deleteFile: ((options: FilesV4DeleteFileCallOptions) => Effect<FilesV4DeleteFileResult, AiSdkError, never>) | undefined; }, AiSdkError, never>
```

#### `google.generativeAI`

```text
(modelId: (string & {}) | "gemini-nano-banana-2.1" | "gemini-4-argon" | "gemini-4-carbon" | "gemini-4-hydrogen" | "gemini-4-neon" | "gemini-3.8-flash" | "gemini-3.7-flash" | "gemini-3.6-flash" | "gemini-3.5-flash" | "gemini-3.5-flash-lite" | "gemini-3.1-pro-preview" | "gemini-3.1-flash-image-preview" | "gemini-3.1-flash-lite-preview" | "gemini-3-pro-preview" | "gemini-3-pro-image-preview" | "gemini-3-flash-preview" | "gemini-2.5-pro" | "gemini-2.5-flash" | "gemini-2.5-flash-lite" | "gemini-2.5-flash-lite-preview-06-17" | "gemini-2.0-flash" | "aqa" | "deep-research-max-preview-04-2026" | "deep-research-preview-04-2026" | "deep-research-pro-preview-12-2025" | "gemini-2.0-flash-001" | "gemini-2.0-flash-lite" | "gemini-2.0-flash-lite-001" | "gemini-2.5-computer-use-preview-10-2025" | "gemini-2.5-flash-image" | "gemini-2.5-flash-native-audio-latest" | "gemini-2.5-flash-native-audio-preview-09-2025" | "gemini-2.5-flash-native-audio-preview-12-2025" | "gemini-2.5-flash-preview-tts" | "gemini-2.5-pro-preview-tts" | "gemini-3.1-flash-tts-preview" | "gemini-3.1-pro-preview-customtools" | "gemini-flash-latest" | "gemini-flash-lite-latest" | "gemini-pro-latest" | "gemini-robotics-er-1.5-preview" | "gemma-3-12b-it" | "gemma-3-1b-it" | "gemma-3-27b-it" | "gemma-3-4b-it" | "gemma-3n-e2b-it" | "gemma-3n-e4b-it" | "nano-banana-pro-preview") => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

#### `google.image`

```text
AdaptedMethod<(modelId: GoogleImageModelId, settings?: GoogleImageSettings | undefined) => ImageModelV4, { maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }>
```

#### `google.imageModel`

```text
(modelId: string) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `google.interactions`

```text
(modelIdOrAgent: GoogleInteractionsModelId | { agent: GoogleInteractionsAgentName; } | { managedAgent: string; }) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

#### `google.languageModel`

```text
(modelId: (string & {}) | "gemini-nano-banana-2.1" | "gemini-4-argon" | "gemini-4-carbon" | "gemini-4-hydrogen" | "gemini-4-neon" | "gemini-3.8-flash" | "gemini-3.7-flash" | "gemini-3.6-flash" | "gemini-3.5-flash" | "gemini-3.5-flash-lite" | "gemini-3.1-pro-preview" | "gemini-3.1-flash-image-preview" | "gemini-3.1-flash-lite-preview" | "gemini-3-pro-preview" | "gemini-3-pro-image-preview" | "gemini-3-flash-preview" | "gemini-2.5-pro" | "gemini-2.5-flash" | "gemini-2.5-flash-lite" | "gemini-2.5-flash-lite-preview-06-17" | "gemini-2.0-flash" | "aqa" | "deep-research-max-preview-04-2026" | "deep-research-preview-04-2026" | "deep-research-pro-preview-12-2025" | "gemini-2.0-flash-001" | "gemini-2.0-flash-lite" | "gemini-2.0-flash-lite-001" | "gemini-2.5-computer-use-preview-10-2025" | "gemini-2.5-flash-image" | "gemini-2.5-flash-native-audio-latest" | "gemini-2.5-flash-native-audio-preview-09-2025" | "gemini-2.5-flash-native-audio-preview-12-2025" | "gemini-2.5-flash-preview-tts" | "gemini-2.5-pro-preview-tts" | "gemini-3.1-flash-tts-preview" | "gemini-3.1-pro-preview-customtools" | "gemini-flash-latest" | "gemini-flash-lite-latest" | "gemini-pro-latest" | "gemini-robotics-er-1.5-preview" | "gemma-3-12b-it" | "gemma-3-1b-it" | "gemma-3-27b-it" | "gemma-3-4b-it" | "gemma-3n-e2b-it" | "gemma-3n-e4b-it" | "nano-banana-pro-preview") => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

#### `google.rerankingModel`

```text
((modelId: string) => Effect<{ doRerank: (options: RerankingModelV4CallOptions) => Effect<RerankingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) | undefined
```

#### `google.skills`

```text
(() => Effect<{ specificationVersion: "v4"; provider: string; uploadSkill: (options: SkillsV4UploadSkillCallOptions) => Effect<SkillsV4UploadSkillResult, AiSdkError, never>; }, AiSdkError, never>) | undefined
```

#### `google.specificationVersion`

```text
"v4"
```

#### `google.speech`

```text
(modelId: GoogleSpeechModelId) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `google.speechModel`

```text
(modelId: GoogleSpeechModelId) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `google.speechTranslationModel`

```text
(modelId: GoogleSpeechTranslationModelId) => Effect<{ doStream: (options: SpeechTranslationModelV4StreamOptions) => Effect<Omit<SpeechTranslationModelV4StreamResult & { stream: ReadableStream<SpeechTranslationModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechTranslationModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `google.textEmbedding`

```text
(modelId: (string & {}) | "gemini-embedding-001" | "gemini-embedding-2" | "gemini-embedding-2-preview") => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `google.textEmbeddingModel`

```text
(modelId: (string & {}) | "gemini-embedding-001" | "gemini-embedding-2" | "gemini-embedding-2-preview") => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `google.tools`

```text
AdaptedTools<{ googleSearch: ProviderExecutedToolFactory<{}, {}, { [x: string]: unknown; searchTypes?: { webSearch?: Record<string, never> | undefined; imageSearch?: Record<string, never> | undefined; } | undefined; timeRangeFilter?: { startTime: string; endTime: string; } | undefined; }, {}>; enterpriseWebSearch: ProviderExecutedToolFactory<{}, {}, {}, {}>; googleMaps: ProviderExecutedToolFactory<{}, {}, {}, {}>; urlContext: ProviderExecutedToolFactory<{}, {}, {}, {}>; fileSearch: ProviderExecutedToolFactory<{}, {}, { [x: string]: unknown; fileSearchStoreNames: string[]; topK?: number | undefined; metadataFilter?: string | undefined; }, {}>; codeExecution: ProviderExecutedToolFactory<{ language: string; code: string; }, { outcome: string; output: string; }, {}, {}>; vertexRagStore: ProviderExecutedToolFactory<{}, {}, { ragCorpus: string; topK?: number | undefined; }, {}>; mcpServer: ProviderExecutedToolFactory<{}, {}, { name?: string | undefined; url?: string | undefined; headers?: Record<string, string> | undefined; allowedTools?: string[] | undefined; }, {}>; }>
```

#### `google.transcription`

```text
(modelId: GoogleTranscriptionModelId) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `google.transcriptionModel`

```text
(modelId: GoogleTranscriptionModelId) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `google.translation`

```text
(modelId: GoogleSpeechTranslationModelId) => Effect<{ doStream: (options: SpeechTranslationModelV4StreamOptions) => Effect<Omit<SpeechTranslationModelV4StreamResult & { stream: ReadableStream<SpeechTranslationModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechTranslationModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `google.video`

```text
(modelId: GoogleVideoModelId) => Effect<{ maxVideosPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; doGenerate: ((options: VideoModelV4CallOptions) => Effect<VideoModelV4Result, AiSdkError, never>) | undefined; doStart: ((options: VideoModelV4CallOptions & { webhookUrl?: string | undefined; }) => Effect<VideoModelV4OperationStartResult, AiSdkError, never>) | undefined; doStatus: ((options: { operation: JSONValue; abortSignal?: AbortSignal | undefined; headers?: Record<string, string | undefined> | undefined; }) => Effect<VideoModelV4OperationStatusResult, AiSdkError, never>) | undefined; handleWebhookOption: (<E, R, E2, R2>(options: { readonly webhook: () => Effect<{ readonly url: string; readonly received: Effect<VideoModelV4OperationWebhook<JSONValue>, E2, R2>; }, E, R>; }) => Effect<{ webhookUrl: string; received: Effect<VideoModelV4OperationWebhook<JSONValue>, AiSdkError, never>; }, AiSdkError, Scope | R | R2>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `google.videoModel`

```text
(modelId: GoogleVideoModelId) => Effect<{ maxVideosPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; doGenerate: ((options: VideoModelV4CallOptions) => Effect<VideoModelV4Result, AiSdkError, never>) | undefined; doStart: ((options: VideoModelV4CallOptions & { webhookUrl?: string | undefined; }) => Effect<VideoModelV4OperationStartResult, AiSdkError, never>) | undefined; doStatus: ((options: { operation: JSONValue; abortSignal?: AbortSignal | undefined; headers?: Record<string, string | undefined> | undefined; }) => Effect<VideoModelV4OperationStatusResult, AiSdkError, never>) | undefined; handleWebhookOption: (<E, R, E2, R2>(options: { readonly webhook: () => Effect<{ readonly url: string; readonly received: Effect<VideoModelV4OperationWebhook<JSONValue>, E2, R2>; }, E, R>; }) => Effect<{ webhookUrl: string; received: Effect<VideoModelV4OperationWebhook<JSONValue>, AiSdkError, never>; }, AiSdkError, Scope | R | R2>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```


## `GoogleDecisionModelId`

The source declaration does not provide a JSDoc description.

```text
type GoogleDecisionModelId = GoogleModelIds['decision'] | (string & {});
```

## `GoogleDecisionModelOptions`

Google decision models do not support provider-specific options.

```text
type GoogleDecisionModelOptions = Record<string, never>;
```

## `GoogleEmbeddingModelOptions`

The source declaration does not provide a JSDoc description.

```text
type GoogleEmbeddingModelOptions = InferSchema<typeof googleEmbeddingModelOptions>;
```

## `GoogleErrorData`

The source declaration does not provide a JSDoc description.

```text
type GoogleErrorData = InferSchema<typeof googleErrorDataSchema>;
```

## `GoogleFilePartOptions`

Per-file options for Gemini GenerateContent, including tool-result files.

```text
type GoogleFilePartOptions = z.infer<typeof googleFilePartOptionsSchema>;
```

## `GoogleFilesUploadOptions`

The source declaration does not provide a JSDoc description.

```text
type GoogleFilesUploadOptions = {
  displayName?: string | null;
  pollIntervalMs?: number | null;
  pollTimeoutMs?: number | null;
  [key: string]: unknown;
};
```

## `GoogleGenerativeAIEmbeddingProviderOptions`

The source declaration does not provide a JSDoc description.

```text
type GoogleEmbeddingModelOptions = InferSchema<typeof googleEmbeddingModelOptions>;
```

## `GoogleGenerativeAIImageProviderOptions`

The source declaration does not provide a JSDoc description.

```text
type GoogleImageModelOptions = Omit<GoogleLanguageModelOptions, 'responseModalities'> & {
  googleSearch?: GoogleSearchToolArgs;
};
```

## `GoogleGenerativeAIProvider`

Expose the same Google Generative AI contract as `GoogleProvider` under the SDK alias.

```text
export type GoogleGenerativeAIProvider = GoogleProvider;
```

## `GoogleGenerativeAIProviderMetadata`

The source declaration does not provide a JSDoc description.

```text
interface GoogleProviderMetadata {
  promptFeedback: GooglePromptFeedback | null;
  groundingMetadata: GoogleGroundingMetadata | null;
  /** Grounding from each automatically continued request, in request order. */
  groundingMetadataPerRequest?: Array<GoogleGroundingMetadata | null>;
  urlContextMetadata: GoogleUrlContextMetadata | null;
  safetyRatings: GoogleSafetyRating[] | null;
  usageMetadata: GoogleUsageMetadata | null;
  finishReason?: string | null;
  finishMessage: string | null;
  serviceTier: string | null;
  /**
   * Opaque token returned when a response stops with `MAX_TOKENS` because it
   * used up its `maxOutputTokens` budget. Pass it back as
   * `providerOptions.google.continuationToken` together with a higher
   * `maxOutputTokens` and the original prompt to resume generation.
   */
  continuationToken?: string | null;
  /**
   * Prompt token count of the first request of a long decode response that
   * was continued automatically (Gemini 4). Usage is summed across requests
   * to match billing, and each continued request re-sends the prompt plus all
   * output so far as input. Use this value instead of the summed input tokens
   * for context window checks and compaction. Only present when the response
   * spanned more than one request.
   */
  initialPromptTokenCount?: number | null;
}
```

## `GoogleGenerativeAIProviderOptions`

The source declaration does not provide a JSDoc description.

```text
type GoogleLanguageModelOptions = InferSchema<typeof googleLanguageModelOptions>;
```

## `GoogleGenerativeAIProviderSettings`

Keep the native Google Generative AI options and allow `apiKey` to resolve through
Effect when the SDK requests the value.

```text
export type GoogleGenerativeAIProviderSettings<E = never, R = never> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
```

## `GoogleGenerativeAIVideoModelId`

The source declaration does not provide a JSDoc description.

```text
type GoogleVideoModelId = GoogleModelIds['video'] | (string & {});
```

## `GoogleGenerativeAIVideoProviderOptions`

The source declaration does not provide a JSDoc description.

```text
type GoogleVideoModelOptions = {
  pollIntervalMs?: number | null;
  pollTimeoutMs?: number | null;
  personGeneration?: 'dont_allow' | 'allow_adult' | 'allow_all' | null;
  negativePrompt?: string | null;
  referenceImages?: Array<{
    bytesBase64Encoded?: string;
    gcsUri?: string;
  }> | null;
  [key: string]: unknown;
};
```

## `GoogleImageModelOptions`

The source declaration does not provide a JSDoc description.

```text
type GoogleImageModelOptions = Omit<GoogleLanguageModelOptions, 'responseModalities'> & {
  googleSearch?: GoogleSearchToolArgs;
};
```

## `GoogleInteractionsAgentName`

Type-only module: declares the union of supported Gemini Interactions agent
names. Used by the `google.interactions({ agent })` factory branch.

Strict string-literal union: unknown agent names are a compile-time error.
User-defined agents (created via the `/agents` endpoint) are addressed by
a separate `{ managedAgent: string }` factory shape — see
`GoogleInteractionsModelInput`.

```text
type GoogleInteractionsAgentName = 'deep-research-pro-preview-12-2025' | 'deep-research-preview-04-2026' | 'deep-research-max-preview-04-2026' | 'antigravity-preview-05-2026';
```

## `GoogleInteractionsFileOptions`

Per-file inspection options for the Gemini Interactions API.

```text
type GoogleInteractionsFileOptions = z.infer<typeof googleInteractionsFileOptionsSchema>;
```

## `GoogleInteractionsModelId`

Type-only union of Gemini model IDs that the Interactions API accepts via
`model:`. Mirrors `Model` from `googleapis/js-genai`
`src/interactions/resources/interactions.ts`.

Kept as a separate type from `GoogleModelId` even though most IDs overlap;
the two surfaces (`:generateContent` vs `/interactions`) are independent and
may diverge over time.

```text
type GoogleInteractionsModelId = GoogleModelIds['interactions'] | (string & {});
```

## `GoogleInteractionsProviderMetadata`

Provider-metadata shape that the Gemini Interactions language model writes
onto `result.providerMetadata.google` (and reads back from input messages on
the next turn for stateful chaining and signature round-trip).

```text
type GoogleInteractionsProviderMetadata = {
  /**
   * Gemini-server-side interaction id (`Interaction.id`). Pass back in
   * `providerOptions.google.previousInteractionId` to chain stateful turns.
   */
  interactionId?: string;
  /**
   * Service tier used for this interaction (passthrough for observability).
   */
  serviceTier?: string;
  /**
   * Output token counts keyed by modality (e.g. `{ video: 57920 }`), sourced
   * from the Interactions API `output_tokens_by_modality`. Present only when
   * the response reports a breakdown. Preview surface for per-modality billing;
   * may be promoted to a first-class usage field later.
   */
  outputTokensByModality?: Record<string, number>;
  /**
   * Per-block signature hash for backend validation. Set by the SDK on output
   * reasoning / tool-call parts and round-tripped on input parts.
   */
  signature?: string;
  /**
   * ID of an agentic video `processing_call` step. Present on
   * `google.processing_call` custom parts.
   */
  processingId?: string;
  /**
   * ID of the corresponding agentic video processing call. Present on
   * `google.processing_result` custom parts.
   */
  processingCallId?: string;
};
```

## `GoogleInteractionsVideoOptions`

Provider options for an individual video file part sent to the Gemini
Interactions API.

```text
type GoogleInteractionsVideoOptions = {
  /**
   * Controls how Gemini processes this video.
   *
   * Agentic processing dynamically explores the video timeline. Static
   * processing samples frames at a fixed rate and optionally supports clipping
   * and custom frame rates.
   */
  processing?: 'agentic' | 'static' | {
    type: 'static';
    startOffset?: number;
    endOffset?: number;
    fps?: number;
  };
};
```

## `GoogleLanguageModelInteractionsOptions`

The source declaration does not provide a JSDoc description.

```text
type GoogleLanguageModelInteractionsOptions = InferSchema<typeof googleInteractionsLanguageModelOptions>;
```

## `GoogleLanguageModelOptions`

The source declaration does not provide a JSDoc description.

```text
type GoogleLanguageModelOptions = InferSchema<typeof googleLanguageModelOptions>;
```

## `GoogleProvider`

Provider returned by the adapter, with Effect-based model selection for Google
Generative AI.

```text
export type GoogleProvider = ReturnType<typeof wrapProviderMethods> & {
    image: AdaptedMethod<SdkProvider['image'], ReturnType<typeof wrapImageModel>>;
};
```

## `GoogleProviderMetadata`

The source declaration does not provide a JSDoc description.

```text
interface GoogleProviderMetadata {
  promptFeedback: GooglePromptFeedback | null;
  groundingMetadata: GoogleGroundingMetadata | null;
  /** Grounding from each automatically continued request, in request order. */
  groundingMetadataPerRequest?: Array<GoogleGroundingMetadata | null>;
  urlContextMetadata: GoogleUrlContextMetadata | null;
  safetyRatings: GoogleSafetyRating[] | null;
  usageMetadata: GoogleUsageMetadata | null;
  finishReason?: string | null;
  finishMessage: string | null;
  serviceTier: string | null;
  /**
   * Opaque token returned when a response stops with `MAX_TOKENS` because it
   * used up its `maxOutputTokens` budget. Pass it back as
   * `providerOptions.google.continuationToken` together with a higher
   * `maxOutputTokens` and the original prompt to resume generation.
   */
  continuationToken?: string | null;
  /**
   * Prompt token count of the first request of a long decode response that
   * was continued automatically (Gemini 4). Usage is summed across requests
   * to match billing, and each continued request re-sends the prompt plus all
   * output so far as input. Use this value instead of the summed input tokens
   * for context window checks and compaction. Only present when the response
   * spanned more than one request.
   */
  initialPromptTokenCount?: number | null;
}
```

## `GoogleProviderSettings`

Keep the native Google Generative AI options and allow `apiKey` to resolve through
Effect when the SDK requests the value.

```text
export type GoogleProviderSettings<E = never, R = never> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
```

## `GoogleSpeechModelId`

The source declaration does not provide a JSDoc description.

```text
type GoogleSpeechModelId = GoogleModelIds['speech'] | (string & {});
```

## `GoogleSpeechModelOptions`

The source declaration does not provide a JSDoc description.

```text
type GoogleSpeechModelOptions = InferSchema<typeof googleSpeechProviderOptionsSchema>;
```

## `GoogleTranscriptionModel`

Construct the SDK Google transcription model lazily with its native options. It exposes
the workflow serialization hooks.
Effect model returned by `GoogleTranscriptionModel`. Use its transcription operations in
an Effect program.

```text
GoogleTranscriptionModel(modelId: GoogleTranscriptionModelId, config: ProviderHostConfiguration<GoogleTranscriptionModelConfig>): Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

### Public properties

#### `GoogleTranscriptionModel[WORKFLOW_DESERIALIZE]`

```text
(input: { modelId: GoogleTranscriptionModelId; config: GoogleTranscriptionModelConfig; }) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `GoogleTranscriptionModel[WORKFLOW_SERIALIZE]`

```text
(model: { doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }) => Effect<{ modelId: string; config: JSONObject; }, AiSdkError, never>
```


## `GoogleTranscriptionModelId`

The source declaration does not provide a JSDoc description.

```text
type GoogleTranscriptionModelId = GoogleModelIds['transcription'] | (string & {});
```

## `GoogleTranscriptionModelOptions`

The source declaration does not provide a JSDoc description.

```text
type GoogleTranscriptionModelOptions = InferSchema<typeof googleTranscriptionModelOptions>;
```

## `GoogleVideoMetadata`

The source declaration does not provide a JSDoc description.

```text
type GoogleVideoMetadata = z.infer<typeof googleVideoMetadataSchema>;
```

## `GoogleVideoModelId`

The source declaration does not provide a JSDoc description.

```text
type GoogleVideoModelId = GoogleModelIds['video'] | (string & {});
```

## `GoogleVideoModelOptions`

The source declaration does not provide a JSDoc description.

```text
type GoogleVideoModelOptions = {
  pollIntervalMs?: number | null;
  pollTimeoutMs?: number | null;
  personGeneration?: 'dont_allow' | 'allow_adult' | 'allow_all' | null;
  negativePrompt?: string | null;
  referenceImages?: Array<{
    bytesBase64Encoded?: string;
    gcsUri?: string;
  }> | null;
  [key: string]: unknown;
};
```

## `VERSION`

The source declaration does not provide a JSDoc description.

```text
VERSION: string
```

