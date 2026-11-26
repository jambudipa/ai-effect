import { adaptProviderFactory } from '../../internal/provider-settings.js';
import type { EffectProviderSettings } from '../../internal/provider-settings.js';
import type { GoogleVertexProviderSettings as SdkSettings } from '@ai-sdk/google-vertex/edge';
import { wrapProviderTools } from '../../internal/provider-tool.js';
import {
  createGoogleVertex as sdkCreateGoogleVertex,
  googleVertex as sdkGoogleVertex,
} from '@ai-sdk/google-vertex/edge';
import type { GoogleVertexProvider as SdkProvider } from '@ai-sdk/google-vertex/edge';
import {
  adaptMethod,
  wrapProviderBase,
} from '../../internal/provider-adapter.js';
import { wrapLanguageModel } from '../../internal/language-model.js';
import { runSync } from '../../internal/operation.js';
import {
  wrapEmbeddingModel,
  wrapImageModel,
  wrapSpeechModel,
  wrapTranscriptionModel,
  wrapVideoModel,
} from '../../internal/provider-model.js';

/** Preserve the interaction payload accepted by the edge Vertex SDK. */
type InteractionInput = Parameters<SdkProvider['interactions']>[0];

/**
 * Adapt language, embedding, image, video, speech, and transcription model selection from
 * the edge Vertex AI SDK to Effect.
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
 * Adapt the preconfigured provider from the edge Vertex AI SDK. Use the factory to supply
 * explicit settings.
 */
export const googleVertex: GoogleVertexProvider = wrapProvider(sdkGoogleVertex);
/** Expose the same Vertex AI provider as `googleVertex` under the SDK alias. */
export const vertex: GoogleVertexProvider = googleVertex;
