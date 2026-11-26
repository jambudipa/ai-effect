import { adaptProviderFactory } from '../internal/provider-settings.js';
import type { EffectProviderSettings } from '../internal/provider-settings.js';
import type { GoogleVertexProviderSettings as SdkSettings } from '@ai-sdk/google-vertex';
import { GoogleVertexGeminiTranscriptionModel as SdkGoogleVertexGeminiTranscriptionModel } from '@ai-sdk/google-vertex';
import { wrapProviderTools } from '../internal/provider-tool.js';
import {
  createGoogleVertex as sdkCreateGoogleVertex,
  googleVertex as sdkGoogleVertex,
} from '@ai-sdk/google-vertex';
import type { GoogleVertexProvider as SdkProvider } from '@ai-sdk/google-vertex';
import {
  WORKFLOW_DESERIALIZE,
  WORKFLOW_SERIALIZE,
} from '@ai-sdk/provider-utils';
import { Context, Effect } from 'effect';
import { adaptMethod, wrapProviderBase } from '../internal/provider-adapter.js';
import { wrapLanguageModel } from '../internal/language-model.js';
import { runSync } from '../internal/operation.js';
import {
  unwrapTranscriptionModel,
  wrapEmbeddingModel,
  wrapImageModel,
  wrapSpeechModel,
  wrapTranscriptionModel,
  wrapVideoModel,
} from '../internal/provider-model.js';
import {
  adaptWorkflowModelConstructor,
  type AdaptedWorkflowConstructor,
} from '../internal/workflow-model.js';

export { VERSION } from '@ai-sdk/google-vertex';
export type {
  GoogleVertexEmbeddingModelOptions,
  GoogleVertexGeminiTranscriptionModelId,
  GoogleVertexImageModelOptions,
  GoogleVertexImageProviderOptions,
  GoogleVertexSpeechModelId,
  GoogleVertexSpeechModelOptions,
  GoogleVertexTranscriptionModelGeminiOptions,
  GoogleVertexTranscriptionModelId,
  GoogleVertexTranscriptionModelOptions,
  GoogleVertexVideoModelId,
  GoogleVertexVideoModelOptions,
  GoogleVertexVideoProviderOptions,
} from '@ai-sdk/google-vertex';

/**
 * Use the native Vertex interaction input so the Effect method accepts the SDK payload
 * unchanged.
 */
type InteractionInput = Parameters<SdkProvider['interactions']>[0];

/**
 * Adapt language, embedding, image, video, speech, and transcription model selection from
 * the Vertex AI SDK to Effect.
 */
const wrapProvider = (sdk: SdkProvider) =>
  Object.assign(adaptMethod('googleVertex', sdk, wrapLanguageModel), {
    ...wrapProviderBase('googleVertex', sdk),
    languageModel: adaptMethod(
      'googleVertex.languageModel',
      sdk.languageModel.bind(sdk),
      wrapLanguageModel,
    ),
    interactions: (input: InteractionInput) =>
      runSync('googleVertex.interactions', () =>
        wrapLanguageModel(sdk.interactions(input)),
      ),
    image: adaptMethod(
      'googleVertex.image',
      sdk.image.bind(sdk),
      wrapImageModel,
    ),
    imageModel: adaptMethod(
      'googleVertex.imageModel',
      sdk.imageModel.bind(sdk),
      wrapImageModel,
    ),
    textEmbeddingModel: adaptMethod(
      'googleVertex.textEmbeddingModel',
      sdk.textEmbeddingModel.bind(sdk),
      wrapEmbeddingModel,
    ),
    video: adaptMethod(
      'googleVertex.video',
      sdk.video.bind(sdk),
      wrapVideoModel,
    ),
    videoModel: adaptMethod(
      'googleVertex.videoModel',
      sdk.videoModel.bind(sdk),
      wrapVideoModel,
    ),
    speech: adaptMethod(
      'googleVertex.speech',
      sdk.speech.bind(sdk),
      wrapSpeechModel,
    ),
    speechModel: adaptMethod(
      'googleVertex.speechModel',
      sdk.speechModel.bind(sdk),
      wrapSpeechModel,
    ),
    transcription: adaptMethod(
      'googleVertex.transcription',
      sdk.transcription.bind(sdk),
      wrapTranscriptionModel,
    ),
    transcriptionModel: adaptMethod(
      'googleVertex.transcriptionModel',
      sdk.transcriptionModel.bind(sdk),
      wrapTranscriptionModel,
    ),
    tools: wrapProviderTools('googleVertex.tools', sdk.tools),
  });
/** Provider returned by the adapter, with Effect-based model selection for Vertex AI. */
export type GoogleVertexProvider = ReturnType<typeof wrapProvider>;
/**
 * Reserve `apiKey` and `headers` for settings the SDK may read through lazy Effect
 * resolvers.
 */
type ResolverKey = 'apiKey' | 'headers';
/**
 * Keep the native Vertex AI options and allow the SDK to obtain `apiKey` and `headers`
 * through Effect resolvers.
 */
export type GoogleVertexProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
/**
 * Construct the Vertex AI provider inside an Effect. Keep the scope open when using an
 * Effect resolver for `apiKey` and `headers`.
 */
export const createGoogleVertex = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  GoogleVertexProvider
>('createGoogleVertex', ['apiKey', 'headers'], (settings) =>
  wrapProvider(sdkCreateGoogleVertex(settings)),
);
/** Expose the same Vertex AI factory as `createGoogleVertex` under the SDK alias. */
export const createVertex = createGoogleVertex;
/**
 * Adapt the preconfigured provider from the Vertex AI SDK. Use the factory to supply
 * explicit settings.
 */
export const googleVertex: GoogleVertexProvider = wrapProvider(sdkGoogleVertex);
/** Expose the same Vertex AI provider as `googleVertex` under the SDK alias. */
export const vertex: GoogleVertexProvider = googleVertex;

// Workflow calls these host hooks synchronously. The Effects have no services.
/**
 * Run the synchronous serialization hooks with an empty Effect context for the workflow
 * host.
 */
const runWorkflowHook = Effect.runSyncWith(Context.empty());

/**
 * Expose synchronous workflow hooks on Vertex Gemini transcription models instances
 * reconstructed by the Effect adapter.
 */
class GoogleVertexTranscriptionWorkflowCarrier {
  /** Serialize the adapted model through its synchronous SDK workflow hook. */
  static [WORKFLOW_SERIALIZE](model: GoogleVertexGeminiTranscriptionModel) {
    return runWorkflowHook(
      GoogleVertexGeminiTranscriptionModel[WORKFLOW_SERIALIZE](model),
    );
  }

  /**
   * Restore the Effect model from the native workflow payload before handing it to the
   * host.
   */
  static [WORKFLOW_DESERIALIZE](
    input: Parameters<
      (typeof SdkGoogleVertexGeminiTranscriptionModel)[typeof WORKFLOW_DESERIALIZE]
    >[0],
  ) {
    return runWorkflowHook(
      GoogleVertexGeminiTranscriptionModel[WORKFLOW_DESERIALIZE](input),
    );
  }
}

/**
 * Attach the workflow carrier to the adapted Vertex Gemini transcription models so the
 * workflow host can round-trip the instance.
 */
const wrapWorkflowTranscriptionModel = (
  model: SdkGoogleVertexGeminiTranscriptionModel,
) => {
  const wrapped = wrapTranscriptionModel(model);
  Object.defineProperty(wrapped, 'constructor', {
    value: GoogleVertexTranscriptionWorkflowCarrier,
  });
  return wrapped;
};

/**
 * Construct the SDK Vertex Gemini transcription model lazily with its native options. It
 * exposes the workflow serialization hooks.
 */
export const GoogleVertexGeminiTranscriptionModel: AdaptedWorkflowConstructor<
  typeof SdkGoogleVertexGeminiTranscriptionModel,
  GoogleVertexGeminiTranscriptionModel
> = adaptWorkflowModelConstructor(
  'GoogleVertexGeminiTranscriptionModel',
  SdkGoogleVertexGeminiTranscriptionModel,
  wrapWorkflowTranscriptionModel,
  unwrapTranscriptionModel,
);
/**
 * Effect model returned by `GoogleVertexGeminiTranscriptionModel`. Use its transcription
 * operations in an Effect program.
 */
export type GoogleVertexGeminiTranscriptionModel = ReturnType<
  typeof wrapTranscriptionModel
>;
