import { adaptProviderFactory } from '../internal/provider-settings.js';
import type { EffectProviderSettings } from '../internal/provider-settings.js';
import type { GatewayProviderSettings as SdkSettings } from '@ai-sdk/gateway';
import type { AdaptedMethod } from '../internal/provider-adapter.js';
import type { AdaptedTools } from '../internal/provider-tool.js';
import { getGatewayTranscriptionProtocols as sdkTranscriptionProtocols } from '@ai-sdk/gateway';
import { getGatewaySpeechProtocols as sdkSpeechProtocols } from '@ai-sdk/gateway';
import { getGatewayRealtimeTeamIdOrSlug as sdkRealtimeTeamIdOrSlug } from '@ai-sdk/gateway';
import { getGatewayRealtimeProtocols as sdkRealtimeProtocols } from '@ai-sdk/gateway';
import { getGatewayRealtimeAuthToken as sdkRealtimeAuthToken } from '@ai-sdk/gateway';
import { wrapRealtimeModel } from '../internal/provider-realtime.js';
import type {
  RealtimeModelV4,
  TypedRealtimeModel,
} from '../internal/provider-realtime.js';
import type { AiSdkError } from '../internal/operation.js';
import type { Effect } from 'effect';
import type {
  Experimental_RealtimeModelV4 as SdkRealtimeModel,
  Experimental_RealtimeModelV4ClientSecretOptions,
  Experimental_RealtimeModelV4ClientSecretResult,
  Experimental_RealtimeModelV4ServerEvent,
  Experimental_RealtimeModelV4SessionConfig,
} from '@ai-sdk/provider';
import type { GatewayKnownLiveModelId } from '@ai-sdk/gateway';
import { wrapProviderTools } from '../internal/provider-tool.js';
import {
  createGateway as sdkCreateGateway,
  gateway as sdkGateway,
} from '@ai-sdk/gateway';
import type {
  GatewayProvider as SdkProvider,
  GatewayRealtimeOptions,
} from '@ai-sdk/gateway';
import { adaptMethod, wrapProviderBase } from '../internal/provider-adapter.js';
import { wrapLanguageModel } from '../internal/language-model.js';
import { wrapBatch } from '../internal/provider-resource.js';
import {
  wrapDecisionModel,
  wrapEmbeddingModel,
  wrapEvaluationModel,
  wrapExtractionModel,
  wrapImageModel,
  wrapRerankingModel,
  wrapSpeechModel,
  wrapStreamingSpeechModel,
  wrapTranscriptionModel,
  wrapVideoModel,
} from '../internal/provider-model.js';
import { runRequest, runSync } from '../internal/operation.js';

export {
  VERSION,
  GATEWAY_AUTH_SUBPROTOCOL_PREFIX,
  GATEWAY_REALTIME_SUBPROTOCOL,
  GATEWAY_SPEECH_SUBPROTOCOL,
  GATEWAY_TEAM_SUBPROTOCOL_PREFIX,
  GATEWAY_TRANSCRIPTION_SUBPROTOCOL,
} from '@ai-sdk/gateway';
export type {
  DecisionFallbackCondition,
  EvaluationFallbackCondition,
  GatewayAsyncJobMetadata,
  GatewayCreditsResponse,
  GatewayDecisionModelId,
  GatewayEmbeddingModelId,
  GatewayErrorResponse,
  GatewayEvaluationModelId,
  GatewayExtractionModelId,
  GatewayGenerationInfo,
  GatewayGenerationInfoParams,
  GatewayImageModelId,
  GatewayKnownLiveModelId,
  GatewayLanguageModelEntry,
  GatewayLanguageModelOptions,
  GatewayLanguageModelSpecification,
  GatewayModelEntry,
  GatewayModelFallback,
  GatewayModelId,
  GatewayProviderMetadata,
  GatewayProviderOptions,
  GatewayRealtimeModelId,
  GatewayRealtimeOptions,
  GatewayRerankingModelId,
  GatewaySpeechModelId,
  GatewaySpendReportParams,
  GatewaySpendReportResponse,
  GatewaySpendReportRow,
  GatewayTranscriptionModelId,
  GatewayVideoModelId,
} from '@ai-sdk/gateway';

/**
 * Derive model selection, API discriminants, and token request types from the Gateway SDK
 * factory.
 */
type SdkRealtimeFactory = SdkProvider['experimental_realtime'];

/**
 * Describe the websocket capabilities for each Gateway API. Live sessions use explicit
 * start and close events.
 */
type GatewayModel<Live extends boolean> = Omit<
  SdkRealtimeModel,
  | 'capabilities'
  | 'doCreateClientSecret'
  | 'getServerWebSocketConfig'
  | 'getWebSocketConfig'
  | 'parseServerEvent'
  | 'buildSessionConfig'
> & {
  readonly capabilities: {
    readonly conversation: Live extends true ? 'continuous' : 'turn-based';
    readonly transports: readonly ['websocket'];
    readonly connections: readonly [
      'client-secret-websocket',
      'server-websocket',
    ];
  } & (Live extends true
    ? {
        readonly startup: 'session-start';
        readonly finalization: 'session-close';
      }
    : {});
  doCreateClientSecret(
    options?: Experimental_RealtimeModelV4ClientSecretOptions,
  ): Promise<Experimental_RealtimeModelV4ClientSecretResult>;
  getServerWebSocketConfig: NonNullable<
    SdkRealtimeModel['getServerWebSocketConfig']
  >;
  getWebSocketConfig: NonNullable<SdkRealtimeModel['getWebSocketConfig']>;
  parseServerEvent(raw: unknown): Experimental_RealtimeModelV4ServerEvent;
  buildSessionConfig(
    ...args: Parameters<SdkRealtimeModel['buildSessionConfig']>
  ): Live extends true ? Experimental_RealtimeModelV4SessionConfig : unknown;
};

/**
 * Preserve live and turn-based selection overloads and expose token requests as an Effect.
 */
const wrapGatewayRealtime = (factory: SdkRealtimeFactory) => {
  function select(
    modelId: string,
    options: { api: 'live' },
  ): Effect.Effect<TypedRealtimeModel<GatewayModel<true>>, AiSdkError>;
  function select(
    modelId: string,
    options: { api: 'realtime' },
  ): Effect.Effect<TypedRealtimeModel<GatewayModel<false>>, AiSdkError>;
  function select(
    modelId: GatewayKnownLiveModelId,
    options?: { api?: undefined },
  ): Effect.Effect<TypedRealtimeModel<GatewayModel<true>>, AiSdkError>;
  function select(
    modelId: Parameters<SdkRealtimeFactory>[0],
    options?: GatewayRealtimeOptions,
  ): Effect.Effect<RealtimeModelV4, AiSdkError>;
  function select(
    modelId: Parameters<SdkRealtimeFactory>[0],
    options?: GatewayRealtimeOptions | { api?: undefined },
  ) {
    return runSync('gateway.experimental_realtime', () =>
      wrapRealtimeModel(
        options?.api
          ? factory(modelId, { api: options.api })
          : factory(modelId),
      ),
    );
  }

  return Object.assign(select, {
    getToken: (options: Parameters<SdkRealtimeFactory['getToken']>[0]) =>
      runRequest('gateway.experimental_realtime.getToken', {}, () =>
        factory.getToken(options),
      ),
  });
};

/**
 * Select a websocket model using an explicit API or a known live ID, or request a token
 * with `getToken`.
 */
export type GatewayRealtimeFactory = ReturnType<typeof wrapGatewayRealtime>;

/** Adapt Gateway transcription model selection and keep token acquisition lazy. */
const wrapGatewayTranscription = (
  factory: SdkProvider['experimental_transcription'],
) =>
  Object.assign(
    adaptMethod(
      'gateway.experimental_transcription',
      factory,
      wrapTranscriptionModel,
    ),
    {
      getToken: (options: Parameters<typeof factory.getToken>[0]) =>
        runRequest('gateway.experimental_transcription.getToken', {}, () =>
          factory.getToken(options),
        ),
    },
  );

/** Adapt the Gateway streaming speech factory and make token acquisition an Effect. */
const wrapGatewaySpeech = (factory: SdkProvider['experimental_speech']) =>
  Object.assign(
    adaptMethod(
      'gateway.experimental_speech',
      factory,
      wrapStreamingSpeechModel,
    ),
    {
      getToken: (options: Parameters<typeof factory.getToken>[0]) =>
        runRequest('gateway.experimental_speech.getToken', {}, () =>
          factory.getToken(options),
        ),
    },
  );

/**
 * Bind the Gateway tool factories and lift their construction failures into the Effect
 * error channel.
 */
const wrapTools = (
  tools: SdkProvider['tools'],
): AdaptedTools<SdkProvider['tools']> =>
  wrapProviderTools('gateway.tools', tools);

/** Fetch the Gateway model catalog when the caller runs the returned Effect. */
const availableModels =
  (
    sdk: SdkProvider,
  ): AdaptedMethod<
    SdkProvider['getAvailableModels'],
    Awaited<ReturnType<SdkProvider['getAvailableModels']>>
  > =>
  () =>
    runRequest('gateway.getAvailableModels', {}, () =>
      sdk.getAvailableModels(),
    );

/**
 * Compose the native Gateway model selectors with adapted credit, routing, and model
 * catalog operations.
 */
const wrapProviderMethods = (sdk: SdkProvider) =>
  Object.assign(adaptMethod('gateway', sdk, wrapLanguageModel), {
    ...wrapProviderBase('gateway', sdk),
    chat: adaptMethod('gateway.chat', sdk.chat.bind(sdk), wrapLanguageModel),
    languageModel: adaptMethod(
      'gateway.languageModel',
      sdk.languageModel.bind(sdk),
      wrapLanguageModel,
    ),
    experimental_batch: adaptMethod(
      'gateway.experimental_batch',
      sdk.experimental_batch.bind(sdk),
      wrapBatch,
    ),
    embedding: adaptMethod(
      'gateway.embedding',
      sdk.embedding.bind(sdk),
      wrapEmbeddingModel,
    ),
    embeddingModel: adaptMethod(
      'gateway.embeddingModel',
      sdk.embeddingModel.bind(sdk),
      wrapEmbeddingModel,
    ),
    textEmbeddingModel: adaptMethod(
      'gateway.textEmbeddingModel',
      sdk.textEmbeddingModel.bind(sdk),
      wrapEmbeddingModel,
    ),
    image: adaptMethod('gateway.image', sdk.image.bind(sdk), wrapImageModel),
    imageModel: adaptMethod(
      'gateway.imageModel',
      sdk.imageModel.bind(sdk),
      wrapImageModel,
    ),
    video: adaptMethod('gateway.video', sdk.video.bind(sdk), wrapVideoModel),
    videoModel: adaptMethod(
      'gateway.videoModel',
      sdk.videoModel.bind(sdk),
      wrapVideoModel,
    ),
    reranking: adaptMethod(
      'gateway.reranking',
      sdk.reranking.bind(sdk),
      wrapRerankingModel,
    ),
    rerankingModel: adaptMethod(
      'gateway.rerankingModel',
      sdk.rerankingModel.bind(sdk),
      wrapRerankingModel,
    ),
    decision: adaptMethod(
      'gateway.decision',
      sdk.decision.bind(sdk),
      wrapDecisionModel,
    ),
    decisionModel: adaptMethod(
      'gateway.decisionModel',
      sdk.decisionModel.bind(sdk),
      wrapDecisionModel,
    ),
    evaluationModel: adaptMethod(
      'gateway.evaluationModel',
      sdk.evaluationModel.bind(sdk),
      wrapEvaluationModel,
    ),
    extraction: adaptMethod(
      'gateway.extraction',
      sdk.extraction.bind(sdk),
      wrapExtractionModel,
    ),
    extractionModel: adaptMethod(
      'gateway.extractionModel',
      sdk.extractionModel.bind(sdk),
      wrapExtractionModel,
    ),
    speech: adaptMethod(
      'gateway.speech',
      sdk.speech.bind(sdk),
      wrapSpeechModel,
    ),
    speechModel: adaptMethod(
      'gateway.speechModel',
      sdk.speechModel.bind(sdk),
      wrapSpeechModel,
    ),
    transcription: adaptMethod(
      'gateway.transcription',
      sdk.transcription.bind(sdk),
      wrapTranscriptionModel,
    ),
    transcriptionModel: adaptMethod(
      'gateway.transcriptionModel',
      sdk.transcriptionModel.bind(sdk),
      wrapTranscriptionModel,
    ),
    getCredits: () =>
      runRequest('gateway.getCredits', {}, () => sdk.getCredits()),
    getSpendReport: (...args: Parameters<typeof sdk.getSpendReport>) =>
      runRequest('gateway.getSpendReport', {}, () =>
        sdk.getSpendReport(...args),
      ),
    getGenerationInfo: (...args: Parameters<typeof sdk.getGenerationInfo>) =>
      runRequest('gateway.getGenerationInfo', {}, () =>
        sdk.getGenerationInfo(...args),
      ),
    evaluation: adaptMethod(
      'gateway.evaluation',
      sdk.evaluation.bind(sdk),
      wrapEvaluationModel,
    ),
    experimental_realtime: wrapGatewayRealtime(sdk.experimental_realtime),
    experimental_transcription: wrapGatewayTranscription(
      sdk.experimental_transcription,
    ),
    experimental_speech: wrapGatewaySpeech(sdk.experimental_speech),
  });
/** Provider returned by the adapter, with Effect-based model selection for AI Gateway. */
export type GatewayProvider = ReturnType<typeof wrapProviderMethods> & {
  getAvailableModels: AdaptedMethod<
    SdkProvider['getAvailableModels'],
    Awaited<ReturnType<SdkProvider['getAvailableModels']>>
  >;
  tools: AdaptedTools<SdkProvider['tools']>;
};

/**
 * Keep the callable provider and named model selectors from the AI Gateway SDK available
 * as Effects.
 */
const wrapProvider = (sdk: SdkProvider): GatewayProvider =>
  Object.assign(wrapProviderMethods(sdk), {
    getAvailableModels: availableModels(sdk),
    tools: wrapTools(sdk.tools),
  });
/** Reserve `apiKey` for settings the SDK may read through lazy Effect resolvers. */
type ResolverKey = 'apiKey';
/**
 * Keep the native AI Gateway options and allow `apiKey` to resolve through Effect when the
 * SDK requests the value.
 */
export type GatewayProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
/**
 * Construct the AI Gateway provider inside an Effect. Keep the scope open when using an
 * Effect resolver for `apiKey`.
 */
export const createGateway = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  GatewayProvider
>('createGateway', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateGateway(settings)),
);
/** Expose the same AI Gateway factory as `createGateway` under the SDK alias. */
export const createGatewayProvider = createGateway;
/**
 * Adapt the preconfigured provider from the AI Gateway SDK. Use the factory to supply
 * explicit settings.
 */
export const gateway: GatewayProvider = wrapProvider(sdkGateway);
/**
 * Delegate extraction of the realtime websocket auth token to the SDK protocol helper.
 */
export const getGatewayRealtimeAuthToken = (
  ...args: Parameters<typeof sdkRealtimeAuthToken>
) => sdkRealtimeAuthToken(...args);
/**
 * Build the Gateway realtime websocket subprotocols with the native SDK protocol encoding.
 */
export const getGatewayRealtimeProtocols = (
  ...args: Parameters<typeof sdkRealtimeProtocols>
) => sdkRealtimeProtocols(...args);
/** Read the team ID or slug carried in the Gateway realtime websocket subprotocols. */
export const getGatewayRealtimeTeamIdOrSlug = (
  ...args: Parameters<typeof sdkRealtimeTeamIdOrSlug>
) => sdkRealtimeTeamIdOrSlug(...args);
/**
 * Build websocket subprotocols for Gateway streaming speech using the SDK speech encoding.
 */
export const getGatewaySpeechProtocols = (
  ...args: Parameters<typeof sdkSpeechProtocols>
) => sdkSpeechProtocols(...args);
/**
 * Build websocket subprotocols for Gateway transcription using the SDK transcription
 * encoding.
 */
export const getGatewayTranscriptionProtocols = (
  ...args: Parameters<typeof sdkTranscriptionProtocols>
) => sdkTranscriptionProtocols(...args);

export {
  GatewayAccessPolicyDeniedError,
  GatewayAuthenticationError,
  GatewayFailedDependencyError,
  GatewayForbiddenError,
  GatewayInternalServerError,
  GatewayInvalidRequestError,
  GatewayModelNotFoundError,
  GatewayNotFoundError,
  GatewayRateLimitError,
  GatewayResponseError,
  GatewayError,
} from '../internal/provider-gateway-error.js';
