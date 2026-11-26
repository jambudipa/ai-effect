---
title: gateway provider API
doc-type: reference
sources: [src/providers/gateway.ts, package.json]
---

# gateway provider API

> **TL;DR:** This entry exposes 58 public exports through `@jambudipa/ai-effect/gateway`.
> The contracts below come from the installed package declarations and JSDoc.

## Import

`@jambudipa/ai-effect/gateway` selects the package export for this provider. See the [provider source](../../../src/providers/gateway.ts).

## `createGateway`

Construct the AI Gateway provider inside an Effect. Keep the scope open when using an
Effect resolver for `apiKey`.

```text
createGateway(options?: StaticProviderSettings<GatewayProviderSettings, "apiKey"> | undefined): Effect<GatewayProvider, AiSdkError, never>
createGateway<E, R>(options: EffectProviderSettings<GatewayProviderSettings, "apiKey", E, R>): Effect<GatewayProvider, AiSdkError, Scope | R>
```

## `createGatewayProvider`

Expose the same AI Gateway factory as `createGateway` under the SDK alias.

```text
createGatewayProvider(options?: StaticProviderSettings<GatewayProviderSettings, "apiKey"> | undefined): Effect<GatewayProvider, AiSdkError, never>
createGatewayProvider<E, R>(options: EffectProviderSettings<GatewayProviderSettings, "apiKey", E, R>): Effect<GatewayProvider, AiSdkError, Scope | R>
```

## `DecisionFallbackCondition`

A condition on the primary model's answers. `QUESTION_ID` narrows
`question` to your question IDs. Without `question`, `confidenceBelow`
checks every Choice and Score question and `probabilityBetween` every
Boolean question. Groups nest at most five levels deep, which the SDK
checks at runtime.

```text
type DecisionFallbackCondition<QUESTION_ID extends string = string> = ExclusiveCondition<{
  question?: QUESTION_ID;
  confidenceBelow: number;
}> | ExclusiveCondition<{
  question?: QUESTION_ID;
  probabilityBetween: [number, number];
}> | ExclusiveCondition<{
  any: DecisionFallbackConditionList<QUESTION_ID>;
}> | ExclusiveCondition<{
  all: DecisionFallbackConditionList<QUESTION_ID>;
}> | ExclusiveCondition<{
  atLeast: {
    count: number;
    conditions: DecisionFallbackConditionList<QUESTION_ID>;
  };
}>;
```

## `EvaluationFallbackCondition`

The source declaration does not provide a JSDoc description.

```text
export type EvaluationFallbackCondition<QUESTION_ID extends string = string> = DecisionFallbackCondition<QUESTION_ID>;
```

## `gateway`

Adapt the preconfigured provider from the AI Gateway SDK. Use the factory to supply
explicit settings.

```text
gateway(modelId: GatewayModelId): Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

### Public properties

#### `gateway.chat`

```text
(modelId: GatewayModelId) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

#### `gateway.decision`

```text
(modelId: GatewayDecisionModelId) => Effect<{ supportedQuestionTypes: readonly ("boolean" | "choice" | "score" | "box")[]; doDecide: (options: DecisionModelV4CallOptions) => Effect<DecisionModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `gateway.decisionModel`

```text
(modelId: GatewayDecisionModelId) => Effect<{ supportedQuestionTypes: readonly ("boolean" | "choice" | "score" | "box")[]; doDecide: (options: DecisionModelV4CallOptions) => Effect<DecisionModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `gateway.embedding`

```text
(modelId: GatewayEmbeddingModelId) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `gateway.embeddingModel`

```text
(modelId: GatewayEmbeddingModelId) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `gateway.evaluation`

```text
(modelId: GatewayDecisionModelId) => Effect<{ supportedQuestionTypes: readonly ("boolean" | "choice" | "score" | "box")[]; doDecide: (options: DecisionModelV4CallOptions) => Effect<DecisionModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; } & { doEvaluate: (options: DecisionModelV4CallOptions) => Effect<DecisionModelV4Result, AiSdkError, never>; }, AiSdkError, never>
```

#### `gateway.evaluationModel`

```text
(modelId: GatewayDecisionModelId) => Effect<{ supportedQuestionTypes: readonly ("boolean" | "choice" | "score" | "box")[]; doDecide: (options: DecisionModelV4CallOptions) => Effect<DecisionModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; } & { doEvaluate: (options: DecisionModelV4CallOptions) => Effect<DecisionModelV4Result, AiSdkError, never>; }, AiSdkError, never>
```

#### `gateway.experimental_batch`

```text
() => Effect<{ specificationVersion: "v4"; provider: string; supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doStartBatch: (options: BatchV4StartOptions<{ text: GatewayModelId; }>) => Effect<BatchV4StartResult, AiSdkError, never>; doGetBatchStatus: (options: BatchV4OperationOptions) => Effect<BatchV4Status, AiSdkError, never>; doGetBatchResults: (options: BatchV4OperationOptions) => Effect<Stream<BatchV4ItemResult, AiSdkError, never>, AiSdkError, Scope>; doCancelBatch: ((options: BatchV4OperationOptions) => Effect<BatchV4CancelResult, AiSdkError, never>) | undefined; doListBatches: ((options: BatchV4ListOptions) => Effect<BatchV4ListResult, AiSdkError, never>) | undefined; }, AiSdkError, never>
```

#### `gateway.experimental_realtime`

```text
{ (modelId: string, options: { api: "live"; }): Effect<TypedRealtimeModel<GatewayModel<true>>, AiSdkError, never>; (modelId: string, options: { api: "realtime"; }): Effect<TypedRealtimeModel<GatewayModel<false>>, AiSdkError, never>; (modelId: "openai/gpt-live-1" | "openai/gpt-live-1.1", options?: { api?: undefined; } | undefined): Effect<TypedRealtimeModel<GatewayModel<true>>, AiSdkError, never>; (modelId: string, options?: GatewayRealtimeOptions | undefined): Effect<{ specificationVersion: "v4"; provider: string; modelId: string; capabilities: { conversation: "continuous" | "turn-based"; transports: readonly ("websocket" | "webrtc")[]; connections?: readonly ("provider" | "webrtc" | "client-secret-websocket" | "server-websocket")[] | undefined; startup?: "session-start" | "session-update" | undefined; finalization?: "session-close" | "transport-close" | undefined; } | undefined; createTransport: (<E, R>(options: RealtimeTransportOptions<E, R>) => Effect<{ connect: (options: Omit<{ api: string; sessionConfig?: RealtimeModelV4SessionConfig | undefined; stream?: MediaStream | undefined; capture?: boolean | undefined; abortSignal: AbortSignal; }, "abortSignal"> & { readonly abortSignal?: AbortSignal | undefined; }) => Effect<void, AiSdkError, never>; sendEvent: (event: RealtimeModelV4ClientEvent, shouldSend?: (() => boolean) | undefined) => Effect<void, AiSdkError, never>; startCapture: (stream?: MediaStream | undefined) => Effect<void, AiSdkError, never>; stopCapture: () => Effect<void, AiSdkError, never>; stopPlayback: () => Effect<void, AiSdkError, never>; resumePlayback: () => Effect<void, AiSdkError, never>; finish: () => Effect<void, AiSdkError, never>; close: () => Effect<void, AiSdkError, never>; dispose: () => Effect<void, AiSdkError, never>; }, AiSdkError, Scope | R>) | undefined; getWebRTCConfig: (() => Effect<{ dataChannelLabel: string; }, AiSdkError, never>) | undefined; doCreateWebRTCSession: ((options: { sdp: string; sessionConfig?: RealtimeModelV4SessionConfig | undefined; abortSignal?: AbortSignal | undefined; }) => Effect<{ sessionId: string; sdp: string; }, AiSdkError, never>) | undefined; doCreateClientSecret: ((options: RealtimeModelV4ClientSecretOptions) => Effect<RealtimeModelV4ClientSecretResult, AiSdkError, never>) | undefined; getWebSocketConfig: ((options: { token: string; url: string; }) => Effect<{ url: string; protocols?: string[] | undefined; }, AiSdkError, never>) | undefined; parseServerEvent: (raw: unknown) => Effect<RealtimeModelV4ServerEvent | RealtimeModelV4ServerEvent[], AiSdkError, never>; createServerEventParser: (() => Effect<(raw: unknown) => Effect<RealtimeModelV4ServerEvent | RealtimeModelV4ServerEvent[], AiSdkError, never>, AiSdkError, never>) | undefined; serializeClientEvent: (event: RealtimeModelV4ClientEvent, options?: { intent?: RealtimeModelV4SessionIntent | undefined; } | undefined) => Effect<unknown, AiSdkError, never>; buildSessionConfig: (config: RealtimeModelV4SessionConfig, options?: { intent?: RealtimeModelV4SessionIntent | undefined; } | undefined) => Effect<unknown, AiSdkError, never>; getServerWebSocketConfig: ((options?: { intent?: RealtimeModelV4SessionIntent | undefined; } | undefined) => Effect<RealtimeModelV4ServerConnection, AiSdkError, never>) | undefined; getHealthCheckResponse: ((raw: unknown) => Effect<unknown, AiSdkError, never>) | undefined; }, AiSdkError, never>; } & { getToken: (options: { model: string; } & RealtimeModelV4ClientSecretOptions & GatewayRealtimeOptions) => Effect<RealtimeFactoryV4GetTokenResult, AiSdkError, never>; }
```

#### `gateway.experimental_speech`

```text
((modelId: GatewaySpeechModelId) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; } & { doStream: (options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>; }, AiSdkError, never>) & { getToken: (options: { model: GatewaySpeechModelId; expiresAfterSeconds?: number | undefined; }) => Effect<{ token: string; url: string; expiresAt?: number | undefined; }, AiSdkError, never>; }
```

#### `gateway.experimental_transcription`

```text
((modelId: GatewayTranscriptionModelId) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>) & { getToken: (options: { model: GatewayTranscriptionModelId; expiresAfterSeconds?: number | undefined; }) => Effect<{ token: string; url: string; expiresAt?: number | undefined; }, AiSdkError, never>; }
```

#### `gateway.extraction`

```text
(modelId: GatewayExtractionModelId) => Effect<{ supportedFieldTypes: readonly ("number" | "text" | "date" | "time" | "datetime" | "duration" | "list")[]; doExtract: (options: ExtractionModelV4CallOptions) => Effect<ExtractionModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `gateway.extractionModel`

```text
(modelId: GatewayExtractionModelId) => Effect<{ supportedFieldTypes: readonly ("number" | "text" | "date" | "time" | "datetime" | "duration" | "list")[]; doExtract: (options: ExtractionModelV4CallOptions) => Effect<ExtractionModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `gateway.files`

```text
(() => Effect<{ specificationVersion: "v4"; provider: string; uploadFile: (options: FilesV4UploadFileCallOptions) => Effect<FilesV4UploadFileResult, AiSdkError, never>; getFileMetadata: ((options: FilesV4GetFileMetadataCallOptions) => Effect<FilesV4GetFileMetadataResult, AiSdkError, never>) | undefined; downloadFile: ((options: FilesV4DownloadFileCallOptions) => Effect<{ content: Stream<Uint8Array<ArrayBufferLike>, AiSdkError, never>; mediaType?: string | undefined; providerMetadata?: SharedV4ProviderMetadata | undefined; warnings: SharedV4Warning[]; }, AiSdkError, Scope>) | undefined; deleteFile: ((options: FilesV4DeleteFileCallOptions) => Effect<FilesV4DeleteFileResult, AiSdkError, never>) | undefined; }, AiSdkError, never>) | undefined
```

#### `gateway.getAvailableModels`

```text
AdaptedMethod<() => Promise<GatewayFetchMetadataResponse>, GatewayFetchMetadataResponse>
```

#### `gateway.getCredits`

```text
() => Effect<GatewayCreditsResponse, AiSdkError, never>
```

#### `gateway.getGenerationInfo`

```text
(params: GatewayGenerationInfoParams) => Effect<GatewayGenerationInfo, AiSdkError, never>
```

#### `gateway.getSpendReport`

```text
(params: GatewaySpendReportParams) => Effect<GatewaySpendReportResponse, AiSdkError, never>
```

#### `gateway.image`

```text
(modelId: GatewayImageModelId) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `gateway.imageModel`

```text
(modelId: GatewayImageModelId) => Effect<{ maxImagesPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; supportsFileInputs: Effect<boolean | undefined, AiSdkError, never>; supportsMaskInputs: Effect<boolean | undefined, AiSdkError, never>; doGenerate: (options: ImageModelV4CallOptions) => Effect<ImageModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `gateway.languageModel`

```text
(modelId: GatewayModelId) => Effect<{ specificationVersion: "v4"; provider: string; modelId: string; readonly supportedUrls: Effect<Record<string, RegExp[]>, AiSdkError, never>; doGenerate: (options: LanguageModelV4CallOptions) => Effect<LanguageModelV4GenerateResult, AiSdkError, never>; doStream: (options: LanguageModelV4CallOptions) => Effect<{ stream: Stream<LanguageModelV4StreamPart, AiSdkError, never>; request?: { url?: string | undefined; body?: unknown; } | undefined; response?: { headers?: SharedV4Headers | undefined; } | undefined; }, AiSdkError, Scope>; }, AiSdkError, never>
```

#### `gateway.reranking`

```text
(modelId: GatewayRerankingModelId) => Effect<{ doRerank: (options: RerankingModelV4CallOptions) => Effect<RerankingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `gateway.rerankingModel`

```text
(modelId: GatewayRerankingModelId) => Effect<{ doRerank: (options: RerankingModelV4CallOptions) => Effect<RerankingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `gateway.skills`

```text
(() => Effect<{ specificationVersion: "v4"; provider: string; uploadSkill: (options: SkillsV4UploadSkillCallOptions) => Effect<SkillsV4UploadSkillResult, AiSdkError, never>; }, AiSdkError, never>) | undefined
```

#### `gateway.specificationVersion`

```text
"v4"
```

#### `gateway.speech`

```text
(modelId: GatewaySpeechModelId) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `gateway.speechModel`

```text
(modelId: GatewaySpeechModelId) => Effect<{ doGenerate: (options: SpeechModelV4CallOptions) => Effect<SpeechModelV4Result, AiSdkError, never>; doStream: ((options: SpeechModelV4StreamOptions) => Effect<Omit<SpeechModelV4StreamResult & { stream: ReadableStream<SpeechModelV4StreamPart>; }, "stream"> & { stream: Stream<SpeechModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `gateway.textEmbeddingModel`

```text
(modelId: GatewayEmbeddingModelId) => Effect<{ maxEmbeddingsPerCall: Effect<number | undefined, AiSdkError, never>; supportsParallelCalls: Effect<boolean, AiSdkError, never>; doEmbed: (options: EmbeddingModelV4CallOptions) => Effect<EmbeddingModelV4Result, AiSdkError, never>; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `gateway.tools`

```text
AdaptedTools<{ browserbaseFetch: (config?: BrowserbaseFetchConfig | undefined) => ProviderExecutedTool<BrowserbaseFetchInput, BrowserbaseFetchOutput, {}>; browserbaseSearch: (config?: BrowserbaseSearchConfig | undefined) => ProviderExecutedTool<BrowserbaseSearchInput, BrowserbaseSearchOutput, {}>; deepseekFetch: (config?: DeepSeekFetchConfig | undefined) => ProviderExecutedTool<DeepSeekFetchInput, DeepSeekFetchOutput, {}>; deepseekSearch: (config?: DeepSeekSearchConfig | undefined) => ProviderExecutedTool<DeepSeekSearchInput, DeepSeekSearchOutput, {}>; exaSearch: (config?: ExaSearchConfig | undefined) => ProviderExecutedTool<ExaSearchInput, ExaSearchOutput, {}>; parallelSearch: (config?: ParallelSearchConfig | undefined) => ProviderExecutedTool<ParallelSearchInput, ParallelSearchOutput, {}>; perplexitySearch: (config?: PerplexitySearchConfig | undefined) => ProviderExecutedTool<PerplexitySearchInput, PerplexitySearchOutput, {}>; takoSearch: (config?: TakoSearchConfig | undefined) => ProviderExecutedTool<TakoSearchInput, TakoSearchOutput, {}>; }>
```

#### `gateway.transcription`

```text
(modelId: GatewayTranscriptionModelId) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `gateway.transcriptionModel`

```text
(modelId: GatewayTranscriptionModelId) => Effect<{ doGenerate: (options: TranscriptionModelV4CallOptions) => Effect<TranscriptionModelV4Result, AiSdkError, never>; doGenerateFromUrl: ((options: Omit<TranscriptionModelV4CallOptions, "audio" | "mediaType"> & { audio: URL; }) => Effect<TranscriptionModelV4Result | undefined, AiSdkError, never>) | undefined; doStream: ((options: TranscriptionModelV4StreamOptions) => Effect<Omit<TranscriptionModelV4StreamResult & { stream: ReadableStream<TranscriptionModelV4StreamPart>; }, "stream"> & { stream: Stream<TranscriptionModelV4StreamPart, AiSdkError, never>; }, AiSdkError, Scope>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `gateway.video`

```text
(modelId: GatewayVideoModelId) => Effect<{ maxVideosPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; doGenerate: ((options: VideoModelV4CallOptions) => Effect<VideoModelV4Result, AiSdkError, never>) | undefined; doStart: ((options: VideoModelV4CallOptions & { webhookUrl?: string | undefined; }) => Effect<VideoModelV4OperationStartResult, AiSdkError, never>) | undefined; doStatus: ((options: { operation: JSONValue; abortSignal?: AbortSignal | undefined; headers?: Record<string, string | undefined> | undefined; }) => Effect<VideoModelV4OperationStatusResult, AiSdkError, never>) | undefined; handleWebhookOption: (<E, R, E2, R2>(options: { readonly webhook: () => Effect<{ readonly url: string; readonly received: Effect<VideoModelV4OperationWebhook<JSONValue>, E2, R2>; }, E, R>; }) => Effect<{ webhookUrl: string; received: Effect<VideoModelV4OperationWebhook<JSONValue>, AiSdkError, never>; }, AiSdkError, Scope | R | R2>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```

#### `gateway.videoModel`

```text
(modelId: GatewayVideoModelId) => Effect<{ maxVideosPerCall: (options: { modelId: string; }) => Effect<number | undefined, AiSdkError, never>; doGenerate: ((options: VideoModelV4CallOptions) => Effect<VideoModelV4Result, AiSdkError, never>) | undefined; doStart: ((options: VideoModelV4CallOptions & { webhookUrl?: string | undefined; }) => Effect<VideoModelV4OperationStartResult, AiSdkError, never>) | undefined; doStatus: ((options: { operation: JSONValue; abortSignal?: AbortSignal | undefined; headers?: Record<string, string | undefined> | undefined; }) => Effect<VideoModelV4OperationStatusResult, AiSdkError, never>) | undefined; handleWebhookOption: (<E, R, E2, R2>(options: { readonly webhook: () => Effect<{ readonly url: string; readonly received: Effect<VideoModelV4OperationWebhook<JSONValue>, E2, R2>; }, E, R>; }) => Effect<{ webhookUrl: string; received: Effect<VideoModelV4OperationWebhook<JSONValue>, AiSdkError, never>; }, AiSdkError, Scope | R | R2>) | undefined; specificationVersion: "v4"; provider: string; modelId: string; }, AiSdkError, never>
```


## `GATEWAY_AUTH_SUBPROTOCOL_PREFIX`

Subprotocol prefix that carries the Gateway auth (bearer) token.

```text
GATEWAY_AUTH_SUBPROTOCOL_PREFIX: "ai-gateway-auth."
```

## `GATEWAY_REALTIME_SUBPROTOCOL`

Marker subprotocol offered on every realtime handshake so the Gateway can
echo a negotiated subprotocol on the 101 response (some clients require the
server to select one of the offered subprotocols).

```text
GATEWAY_REALTIME_SUBPROTOCOL: "ai-gateway-realtime.v1"
```

## `GATEWAY_SPEECH_SUBPROTOCOL`

Marker subprotocol for streaming speech handshakes (same negotiation
purpose as `GATEWAY_REALTIME_SUBPROTOCOL`).

```text
GATEWAY_SPEECH_SUBPROTOCOL: "ai-gateway-speech.v1"
```

## `GATEWAY_TEAM_SUBPROTOCOL_PREFIX`

Subprotocol prefix that carries optional Vercel team scoping.

```text
GATEWAY_TEAM_SUBPROTOCOL_PREFIX: "ai-gateway-team."
```

## `GATEWAY_TRANSCRIPTION_SUBPROTOCOL`

Marker subprotocol for streaming transcription handshakes (same negotiation
purpose as `GATEWAY_REALTIME_SUBPROTOCOL`).

```text
GATEWAY_TRANSCRIPTION_SUBPROTOCOL: "ai-gateway-transcription.v1"
```

## `GatewayAccessPolicyDeniedError`

Construct an access-policy failure with policy IDs and the providers or models removed.
Read policy IDs and excluded model or provider IDs after narrowing an access-policy failure.

```text
GatewayAccessPolicyDeniedError(args_0?: { message?: string | undefined; statusCode?: number | undefined; cause?: unknown; generationId?: string | undefined; policyIds?: string[] | undefined; removedModels?: string[] | undefined; removedProviders?: string[] | undefined; } | undefined): Effect<SpecificError<"access_policy_denied", { policyIds: string[] | undefined; removedModels: string[] | undefined; removedProviders: string[] | undefined; }>, AiSdkError, never>
```

### Public properties

#### `GatewayAccessPolicyDeniedError.hasMarker`

```text
(error: unknown) => error is GatewayError
```

#### `GatewayAccessPolicyDeniedError.isInstance`

```text
(error: unknown) => error is SpecificError<"access_policy_denied", { policyIds: string[] | undefined; removedModels: string[] | undefined; removedProviders: string[] | undefined; }>
```


## `GatewayAsyncJobMetadata`

Metadata for an asynchronous AI Gateway job.

```text
type GatewayAsyncJobMetadata = {
  readonly jobId: string;
  readonly status: string;
  /**
   * Secret for verifying customer webhook deliveries. This is sensitive,
   * start-response-only metadata and must not be logged or forwarded.
   */
  readonly webhookSigningSecret?: string;
  readonly [key: string]: JSONValue | undefined;
};
```

## `GatewayAuthenticationError`

Construct a gateway authentication failure and retain the contextual SDK constructor.
Identify the authentication failure variant in gateway error handling.

```text
GatewayAuthenticationError(args_0?: { message?: string | undefined; statusCode?: number | undefined; cause?: unknown; generationId?: string | undefined; } | undefined): Effect<SpecificError<"authentication_error", {}>, AiSdkError, never>
```

### Public properties

#### `GatewayAuthenticationError.createContextualError`

```text
(args_0: { apiKeyProvided: boolean; oidcTokenProvided: boolean; message?: string | undefined; statusCode?: number | undefined; cause?: unknown; generationId?: string | undefined; }) => Effect<SpecificError<"authentication_error", {}>, AiSdkError, never>
```

#### `GatewayAuthenticationError.hasMarker`

```text
(error: unknown) => error is GatewayError
```

#### `GatewayAuthenticationError.isInstance`

```text
(error: unknown) => error is SpecificError<"authentication_error", {}>
```


## `GatewayCreditsResponse`

The source declaration does not provide a JSDoc description.

```text
interface GatewayCreditsResponse {
  /** The remaining gateway credit balance available for API usage */
  balance: string;
  /** The total amount of gateway credits that have been consumed */
  totalUsed: string;
}
```

## `GatewayDecisionModelId`

The source declaration does not provide a JSDoc description.

```text
type GatewayDecisionModelId = GatewayModelIds['decision'] | (string & {});
```

## `GatewayEmbeddingModelId`

The source declaration does not provide a JSDoc description.

```text
type GatewayEmbeddingModelId = GatewayModelIds['embedding'] | (string & {});
```

## `GatewayError`

Represent a gateway failure with its status, retry hint, and redacted native cause.

```text
new GatewayError(args: { readonly name: string; readonly type: string; readonly statusCode: number; readonly generationId?: string | undefined; readonly isRetryable: boolean; readonly cause?: Redacted<unknown> | undefined; }): GatewayError
```

### Public properties

#### `GatewayError.hasMarker`

Retain the SDK-compatible marker check for wrapped gateway errors.

```text
(error: unknown) => error is GatewayError
```

#### `GatewayError.isInstance`

Recognize an error created by this gateway adapter before reading gateway metadata.

```text
(error: unknown) => error is GatewayError
```


## `GatewayErrorResponse`

The source declaration does not provide a JSDoc description.

```text
type GatewayErrorResponse = InferSchema<typeof gatewayErrorResponseSchema>;
```

## `GatewayEvaluationModelId`

The source declaration does not provide a JSDoc description.

```text
export type GatewayEvaluationModelId = GatewayDecisionModelId;
```

## `GatewayExtractionModelId`

The source declaration does not provide a JSDoc description.

```text
type GatewayExtractionModelId = GatewayModelIds['extraction'] | (string & {});
```

## `GatewayFailedDependencyError`

Construct a gateway failure caused by an unavailable downstream dependency.
Identify the dependency failure variant in gateway error handling.

```text
GatewayFailedDependencyError(args_0?: { message?: string | undefined; statusCode?: number | undefined; cause?: unknown; generationId?: string | undefined; } | undefined): Effect<SpecificError<"failed_dependency", {}>, AiSdkError, never>
```

### Public properties

#### `GatewayFailedDependencyError.hasMarker`

```text
(error: unknown) => error is GatewayError
```

#### `GatewayFailedDependencyError.isInstance`

```text
(error: unknown) => error is SpecificError<"failed_dependency", {}>
```


## `GatewayForbiddenError`

Construct an authorization failure and keep the rule that rejected the request.
Read the rejecting rule ID after narrowing an authorization failure.

```text
GatewayForbiddenError(args_0?: { message?: string | undefined; statusCode?: number | undefined; cause?: unknown; generationId?: string | undefined; ruleId?: string | undefined; } | undefined): Effect<SpecificError<"forbidden", { ruleId: string | undefined; }>, AiSdkError, never>
```

### Public properties

#### `GatewayForbiddenError.hasMarker`

```text
(error: unknown) => error is GatewayError
```

#### `GatewayForbiddenError.isInstance`

```text
(error: unknown) => error is SpecificError<"forbidden", { ruleId: string | undefined; }>
```


## `GatewayGenerationInfo`

The source declaration does not provide a JSDoc description.

```text
interface GatewayGenerationInfo {
  /** The generation ID */
  id: string;
  /** Total cost in USD */
  totalCost: number;
  /** Market cost in USD, excluding surcharges. Omitted when unavailable. */
  marketCost?: number;
  /** Total surcharges applied in USD. Omitted when unavailable. */
  surchargeCost?: number;
  /** Total amount debited in USD. Omitted when unavailable. */
  gatewayCost?: number;
  /** Upstream inference cost in USD (BYOK only) */
  upstreamInferenceCost: number;
  /** Usage cost in USD (same as totalCost) */
  usage: number;
  /** ISO 8601 timestamp when the generation was created */
  createdAt: string;
  /** Model identifier */
  model: string;
  /** Whether BYOK credentials were used */
  isByok: boolean;
  /** Provider that served this generation */
  providerName: string;
  /** Whether streaming was used */
  streamed: boolean;
  /** Finish reason (e.g. 'stop') */
  finishReason: string;
  /** Time to first token in milliseconds */
  latency: number;
  /** Total generation time in milliseconds */
  generationTime: number;
  /** Number of prompt tokens */
  promptTokens: number;
  /** Number of completion tokens */
  completionTokens: number;
  /** Reasoning tokens used */
  reasoningTokens: number;
  /** Cached tokens used */
  cachedTokens: number;
  /** Cache creation input tokens */
  cacheCreationTokens: number;
  /** Billable web search calls */
  billableWebSearchCalls: number;
}
```

## `GatewayGenerationInfoParams`

The source declaration does not provide a JSDoc description.

```text
interface GatewayGenerationInfoParams {
  /** The generation ID to look up (format: gen_<ulid>) */
  id: string;
}
```

## `GatewayImageModelId`

The source declaration does not provide a JSDoc description.

```text
type GatewayImageModelId = GatewayModelIds['image'] | (string & {});
```

## `GatewayInternalServerError`

Construct a gateway internal error with the native status and retry hint.
Identify the internal server failure variant in gateway error handling.

```text
GatewayInternalServerError(args_0?: { message?: string | undefined; statusCode?: number | undefined; cause?: unknown; generationId?: string | undefined; } | undefined): Effect<SpecificError<"internal_server_error", {}>, AiSdkError, never>
```

### Public properties

#### `GatewayInternalServerError.hasMarker`

```text
(error: unknown) => error is GatewayError
```

#### `GatewayInternalServerError.isInstance`

```text
(error: unknown) => error is SpecificError<"internal_server_error", {}>
```


## `GatewayInvalidRequestError`

Construct a gateway rejection of invalid request data.
Identify the invalid request failure variant in gateway error handling.

```text
GatewayInvalidRequestError(args_0?: { message?: string | undefined; statusCode?: number | undefined; cause?: unknown; generationId?: string | undefined; } | undefined): Effect<SpecificError<"invalid_request_error", {}>, AiSdkError, never>
```

### Public properties

#### `GatewayInvalidRequestError.hasMarker`

```text
(error: unknown) => error is GatewayError
```

#### `GatewayInvalidRequestError.isInstance`

```text
(error: unknown) => error is SpecificError<"invalid_request_error", {}>
```


## `GatewayKnownLiveModelId`

The source declaration does not provide a JSDoc description.

```text
type GatewayKnownLiveModelId = (typeof gatewayLiveModelIds)[number];
```

## `GatewayLanguageModelEntry`

The source declaration does not provide a JSDoc description.

```text
interface GatewayLanguageModelEntry {
  /**
   * The model id used by the remote provider in model settings and for specifying the
   * intended model for text generation.
   */
  id: string;
  /**
   * The display name of the model for presentation in user-facing contexts.
   */
  name: string;
  /**
   * Optional description of the model.
   */
  description?: string | null;
  /**
   * Optional pricing information for the model.
   */
  pricing?: {
    /**
     * Cost per input token in USD.
     */
    input: string;
    /**
     * Cost per output token in USD.
     */
    output: string;
    /**
     * Cost per cached input token in USD.
     * Only present for providers/models that support prompt caching.
     */
    cachedInputTokens?: string;
    /**
     * Cost per input token to create/write cache entries in USD.
     * Only present for providers/models that support prompt caching.
     */
    cacheCreationInputTokens?: string;
  } | null;
  /**
   * Additional AI SDK language model specifications for the model.
   */
  specification: GatewayLanguageModelSpecification;
  /**
   * Optional field to differentiate between model types.
   */
  modelType?: KnownModelType | null;
}
```

## `GatewayLanguageModelOptions`

The source declaration does not provide a JSDoc description.

```text
type GatewayProviderOptions<QUESTION_ID extends string = string> = {
  /**
   * Service-owned options may be added by the Gateway without requiring an SDK
   * release. The Gateway service validates and applies the runtime schema.
   */
  [key: string]: unknown;
  /** Request-scoped BYOK credentials to use instead of cached credentials. */
  byok?: Record<string, Array<Record<string, unknown>>>;
  /** Enables automatic caching behavior when supported by the Gateway. */
  caching?: 'auto';
  /**
   * Experimental, image models only: decode large base64 images while reading
   * the response to reduce peak memory. Extracted images are returned as bytes;
   * if a result mixes extracted and small images, all are returned as bytes.
   * Defaults to false. Image models remove this client option from requests.
   */
  experimental_streamingImageDecoding?: boolean;
  /** Filter to providers that do not train on prompt data. */
  disallowPromptTraining?: boolean;
  /**
   * Route only to providers headquartered in these countries (ISO 3166-1
   * alpha-2 codes, e.g. `['US', 'DE']`), or prefix every code with `!` to
   * exclude countries instead (e.g. `['!US']`). A list can't mix the two.
   */
  headquarters?: string[];
  /**
   * Restrict routing to provider models that satisfy every given entry.
   *
   * Entries are capability tags (`'implicit-caching'`, `'reasoning'`,
   * `'tool-use'`, `'vision'` (image input), `'structured-output'`
   * (schema-constrained output)) or weight-format conditions:
   * `'quantization:fp8'` requires the serving provider to report that weight
   * format, `'!quantization:fp8'` excludes it (providers with no recorded
   * format still pass an exclusion). Format values are an open space but must
   * match `[a-zA-Z0-9._-]{1,32}` and compare case-insensitively. Unknown
   * capability names are rejected by the Gateway with a 400.
   */
  has?: Array<'implicit-caching' | 'reasoning' | 'structured-output' | 'tool-use' | 'vision' | `quantization:${string}` | `!quantization:${string}`>;
  /**
   * Idempotency key for `experimental_startBatch`: retries with the same
   * key replay the original batch instead of creating a duplicate.
   */
  idempotencyKey?: string;
  /**
   * Fallback models to try in order. On decision requests, the first entry
   * can be a conditional `{ model, when }` fallback that reruns the decision
   * when `when` matches the primary answers. Other request types reject a
   * conditional entry. Pass your question IDs as `QUESTION_ID` to check the
   * `question` names in `when`.
   */
  models?: GatewayModelFallbackList<QUESTION_ID>;
  /** Array of provider slugs that are the only ones allowed to be used. */
  only?: string[];
  /** Array of provider slugs specifying the provider attempt order. */
  order?: string[];
  /** Per-provider timeouts for BYOK credentials in milliseconds. */
  providerTimeouts?: {
    byok?: Record<string, number>;
  };
  /** Entity identifier against which quota is tracked. */
  quotaEntityId?: string;
  /** Unified service tier intent. */
  serviceTier?: 'flex' | 'priority';
  /** Sort providers by a performance or cost metric before routing. */
  sort?: 'cost' | 'tps' | 'ttft';
  /** User-specified tags for reporting and filtering usage. */
  tags?: string[];
  /** End-user identifier for spend tracking and attribution. */
  user?: string;
  /** Filter to providers with zero data retention agreements. */
  zeroDataRetention?: boolean;
};
```

## `GatewayLanguageModelSpecification`

The source declaration does not provide a JSDoc description.

```text
type GatewayLanguageModelSpecification = Pick<LanguageModelV4, 'specificationVersion' | 'provider' | 'modelId'>;
```

## `GatewayModelEntry`

The source declaration does not provide a JSDoc description.

```text
interface GatewayLanguageModelEntry {
  /**
   * The model id used by the remote provider in model settings and for specifying the
   * intended model for text generation.
   */
  id: string;
  /**
   * The display name of the model for presentation in user-facing contexts.
   */
  name: string;
  /**
   * Optional description of the model.
   */
  description?: string | null;
  /**
   * Optional pricing information for the model.
   */
  pricing?: {
    /**
     * Cost per input token in USD.
     */
    input: string;
    /**
     * Cost per output token in USD.
     */
    output: string;
    /**
     * Cost per cached input token in USD.
     * Only present for providers/models that support prompt caching.
     */
    cachedInputTokens?: string;
    /**
     * Cost per input token to create/write cache entries in USD.
     * Only present for providers/models that support prompt caching.
     */
    cacheCreationInputTokens?: string;
  } | null;
  /**
   * Additional AI SDK language model specifications for the model.
   */
  specification: GatewayLanguageModelSpecification;
  /**
   * Optional field to differentiate between model types.
   */
  modelType?: KnownModelType | null;
}
```

## `GatewayModelFallback`

The source declaration does not provide a JSDoc description.

```text
type GatewayModelFallback<QUESTION_ID extends string = string> = string | {
  model: string;
  when: DecisionFallbackCondition<QUESTION_ID>;
};
```

## `GatewayModelId`

The source declaration does not provide a JSDoc description.

```text
type GatewayModelId = GatewayModelIds['language'] | (string & {});
```

## `GatewayModelNotFoundError`

Construct a missing-model failure and retain the requested model ID.
Read the requested model ID after narrowing a gateway model lookup failure.

```text
GatewayModelNotFoundError(args_0?: { message?: string | undefined; statusCode?: number | undefined; modelId?: string | undefined; cause?: unknown; generationId?: string | undefined; } | undefined): Effect<SpecificError<"model_not_found", { modelId: string | undefined; }>, AiSdkError, never>
```

### Public properties

#### `GatewayModelNotFoundError.hasMarker`

```text
(error: unknown) => error is GatewayError
```

#### `GatewayModelNotFoundError.isInstance`

```text
(error: unknown) => error is SpecificError<"model_not_found", { modelId: string | undefined; }>
```


## `GatewayNotFoundError`

Construct the gateway failure for a missing resource.
Identify the missing resource variant in gateway error handling.

```text
GatewayNotFoundError(args_0?: { message?: string | undefined; statusCode?: number | undefined; cause?: unknown; generationId?: string | undefined; } | undefined): Effect<SpecificError<"not_found", {}>, AiSdkError, never>
```

### Public properties

#### `GatewayNotFoundError.hasMarker`

```text
(error: unknown) => error is GatewayError
```

#### `GatewayNotFoundError.isInstance`

```text
(error: unknown) => error is SpecificError<"not_found", {}>
```


## `GatewayProvider`

Provider returned by the adapter, with Effect-based model selection for AI Gateway.

```text
export type GatewayProvider = ReturnType<typeof wrapProviderMethods> & {
    getAvailableModels: AdaptedMethod<SdkProvider['getAvailableModels'], Awaited<ReturnType<SdkProvider['getAvailableModels']>>>;
    tools: AdaptedTools<SdkProvider['tools']>;
};
```

## `GatewayProviderMetadata`

Shape of the inner `providerMetadata.gateway` object returned by AI Gateway
operations.

Additional fields may be added without a package update.

```text
type GatewayProviderMetadata = {
  readonly asyncJob?: GatewayAsyncJobMetadata;
  readonly [key: string]: JSONValue | undefined;
};
```

## `GatewayProviderOptions`

The source declaration does not provide a JSDoc description.

```text
type GatewayProviderOptions<QUESTION_ID extends string = string> = {
  /**
   * Service-owned options may be added by the Gateway without requiring an SDK
   * release. The Gateway service validates and applies the runtime schema.
   */
  [key: string]: unknown;
  /** Request-scoped BYOK credentials to use instead of cached credentials. */
  byok?: Record<string, Array<Record<string, unknown>>>;
  /** Enables automatic caching behavior when supported by the Gateway. */
  caching?: 'auto';
  /**
   * Experimental, image models only: decode large base64 images while reading
   * the response to reduce peak memory. Extracted images are returned as bytes;
   * if a result mixes extracted and small images, all are returned as bytes.
   * Defaults to false. Image models remove this client option from requests.
   */
  experimental_streamingImageDecoding?: boolean;
  /** Filter to providers that do not train on prompt data. */
  disallowPromptTraining?: boolean;
  /**
   * Route only to providers headquartered in these countries (ISO 3166-1
   * alpha-2 codes, e.g. `['US', 'DE']`), or prefix every code with `!` to
   * exclude countries instead (e.g. `['!US']`). A list can't mix the two.
   */
  headquarters?: string[];
  /**
   * Restrict routing to provider models that satisfy every given entry.
   *
   * Entries are capability tags (`'implicit-caching'`, `'reasoning'`,
   * `'tool-use'`, `'vision'` (image input), `'structured-output'`
   * (schema-constrained output)) or weight-format conditions:
   * `'quantization:fp8'` requires the serving provider to report that weight
   * format, `'!quantization:fp8'` excludes it (providers with no recorded
   * format still pass an exclusion). Format values are an open space but must
   * match `[a-zA-Z0-9._-]{1,32}` and compare case-insensitively. Unknown
   * capability names are rejected by the Gateway with a 400.
   */
  has?: Array<'implicit-caching' | 'reasoning' | 'structured-output' | 'tool-use' | 'vision' | `quantization:${string}` | `!quantization:${string}`>;
  /**
   * Idempotency key for `experimental_startBatch`: retries with the same
   * key replay the original batch instead of creating a duplicate.
   */
  idempotencyKey?: string;
  /**
   * Fallback models to try in order. On decision requests, the first entry
   * can be a conditional `{ model, when }` fallback that reruns the decision
   * when `when` matches the primary answers. Other request types reject a
   * conditional entry. Pass your question IDs as `QUESTION_ID` to check the
   * `question` names in `when`.
   */
  models?: GatewayModelFallbackList<QUESTION_ID>;
  /** Array of provider slugs that are the only ones allowed to be used. */
  only?: string[];
  /** Array of provider slugs specifying the provider attempt order. */
  order?: string[];
  /** Per-provider timeouts for BYOK credentials in milliseconds. */
  providerTimeouts?: {
    byok?: Record<string, number>;
  };
  /** Entity identifier against which quota is tracked. */
  quotaEntityId?: string;
  /** Unified service tier intent. */
  serviceTier?: 'flex' | 'priority';
  /** Sort providers by a performance or cost metric before routing. */
  sort?: 'cost' | 'tps' | 'ttft';
  /** User-specified tags for reporting and filtering usage. */
  tags?: string[];
  /** End-user identifier for spend tracking and attribution. */
  user?: string;
  /** Filter to providers with zero data retention agreements. */
  zeroDataRetention?: boolean;
};
```

## `GatewayProviderSettings`

Keep the native AI Gateway options and allow `apiKey` to resolve through Effect when the
SDK requests the value.

```text
export type GatewayProviderSettings<E = never, R = never> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
```

## `GatewayRateLimitError`

Construct a gateway rate-limit failure and preserve the native retry hint.
Identify the rate-limit variant before applying retry policy.

```text
GatewayRateLimitError(args_0?: { message?: string | undefined; statusCode?: number | undefined; cause?: unknown; generationId?: string | undefined; } | undefined): Effect<SpecificError<"rate_limit_exceeded", {}>, AiSdkError, never>
```

### Public properties

#### `GatewayRateLimitError.hasMarker`

```text
(error: unknown) => error is GatewayError
```

#### `GatewayRateLimitError.isInstance`

```text
(error: unknown) => error is SpecificError<"rate_limit_exceeded", {}>
```


## `GatewayRealtimeFactory`

Select a websocket model using an explicit API or a known live ID, or request a token
with `getToken`.

```text
export type GatewayRealtimeFactory = ReturnType<typeof wrapGatewayRealtime>;
```

## `GatewayRealtimeModelId`

The source declaration does not provide a JSDoc description.

```text
type GatewayRealtimeModelId = GatewayModelIds['realtime'] | (string & {});
```

## `GatewayRealtimeOptions`

The source declaration does not provide a JSDoc description.

```text
type GatewayRealtimeOptions = {
  /** Selects the Gateway API for the model ID, including for new Live models. */
  api?: 'live' | 'realtime';
};
```

## `GatewayRerankingModelId`

The source declaration does not provide a JSDoc description.

```text
type GatewayRerankingModelId = GatewayModelIds['reranking'] | (string & {});
```

## `GatewayResponseError`

Construct a gateway response failure with the native response and validation details redacted.
Identify a response failure and retain its redacted diagnostics for internal inspection.

```text
GatewayResponseError(args_0?: { message?: string | undefined; statusCode?: number | undefined; response?: unknown; validationError?: TypeValidationError | undefined; cause?: unknown; generationId?: string | undefined; isRetryable?: boolean | undefined; } | undefined): Effect<SpecificError<"response_error", { response: Redacted<unknown>; validationError?: Redacted<TypeValidationError> | undefined; }>, AiSdkError, never>
```

### Public properties

#### `GatewayResponseError.hasMarker`

```text
(error: unknown) => error is GatewayError
```

#### `GatewayResponseError.isInstance`

```text
(error: unknown) => error is SpecificError<"response_error", { response: Redacted<unknown>; validationError?: Redacted<TypeValidationError> | undefined; }>
```


## `GatewaySpeechModelId`

The source declaration does not provide a JSDoc description.

```text
type GatewaySpeechModelId = GatewayModelIds['speech'] | (string & {});
```

## `GatewaySpendReportParams`

The source declaration does not provide a JSDoc description.

```text
interface GatewaySpendReportParams {
  /** Start date in YYYY-MM-DD format (inclusive) */
  startDate: string;
  /** End date in YYYY-MM-DD format (inclusive) */
  endDate: string;
  /** Primary aggregation dimension. Defaults to 'day'. */
  groupBy?: 'day' | 'user' | 'model' | 'tag' | 'provider' | 'credential_type';
  /** Time granularity when groupBy is 'day'. */
  datePart?: 'day' | 'hour';
  /** Filter to a specific user's spend. */
  userId?: string;
  /** Filter to a specific model (e.g. 'anthropic/claude-sonnet-4.5'). */
  model?: string;
  /** Filter to a specific provider (e.g. 'anthropic'). */
  provider?: string;
  /** Filter to BYOK or system credentials. */
  credentialType?: 'byok' | 'system';
  /** Filter to requests with these tags. */
  tags?: string[];
}
```

## `GatewaySpendReportResponse`

The source declaration does not provide a JSDoc description.

```text
interface GatewaySpendReportResponse {
  results: GatewaySpendReportRow[];
}
```

## `GatewaySpendReportRow`

The source declaration does not provide a JSDoc description.

```text
interface GatewaySpendReportRow {
  /** Date string (present when groupBy is 'day') */
  day?: string;
  /** Hour timestamp (present when groupBy is 'day' and datePart is 'hour') */
  hour?: string;
  /** User identifier (present when groupBy is 'user') */
  user?: string;
  /** Model identifier (present when groupBy is 'model') */
  model?: string;
  /** Tag value (present when groupBy is 'tag') */
  tag?: string;
  /** Provider name (present when groupBy is 'provider') */
  provider?: string;
  /** Credential type (present when groupBy is 'credential_type') */
  credentialType?: 'byok' | 'system';
  /** Total cost in USD */
  totalCost: number;
  /** Market cost in USD */
  marketCost?: number;
  /** Number of input tokens */
  inputTokens?: number;
  /** Number of output tokens */
  outputTokens?: number;
  /** Number of cached input tokens */
  cachedInputTokens?: number;
  /** Number of cache creation input tokens */
  cacheCreationInputTokens?: number;
  /** Number of reasoning tokens */
  reasoningTokens?: number;
  /** Number of requests */
  requestCount?: number;
}
```

## `GatewayTranscriptionModelId`

The source declaration does not provide a JSDoc description.

```text
type GatewayTranscriptionModelId = GatewayModelIds['transcription'] | (string & {});
```

## `GatewayVideoModelId`

The source declaration does not provide a JSDoc description.

```text
type GatewayVideoModelId = GatewayModelIds['video'] | (string & {});
```

## `getGatewayRealtimeAuthToken`

Delegate extraction of the realtime websocket auth token to the SDK protocol helper.

```text
getGatewayRealtimeAuthToken(secWebSocketProtocol: string | null | undefined): string | undefined
```

## `getGatewayRealtimeProtocols`

Build the Gateway realtime websocket subprotocols with the native SDK protocol encoding.

```text
getGatewayRealtimeProtocols(token: string, options?: { teamIdOrSlug?: string | undefined; } | undefined): string[]
```

## `getGatewayRealtimeTeamIdOrSlug`

Read the team ID or slug carried in the Gateway realtime websocket subprotocols.

```text
getGatewayRealtimeTeamIdOrSlug(secWebSocketProtocol: string | null | undefined): string | undefined
```

## `getGatewaySpeechProtocols`

Build websocket subprotocols for Gateway streaming speech using the SDK speech encoding.

```text
getGatewaySpeechProtocols(token: string, options?: { teamIdOrSlug?: string | undefined; } | undefined): string[]
```

## `getGatewayTranscriptionProtocols`

Build websocket subprotocols for Gateway transcription using the SDK transcription
encoding.

```text
getGatewayTranscriptionProtocols(token: string, options?: { teamIdOrSlug?: string | undefined; } | undefined): string[]
```

## `VERSION`

The source declaration does not provide a JSDoc description.

```text
VERSION: string
```
