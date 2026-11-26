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

type InteractionInput = Parameters<SdkProvider['interactions']>[0];

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
export type GoogleVertexProvider = ReturnType<typeof wrapProvider>;
type ResolverKey = 'apiKey' | 'headers';
export type GoogleVertexProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
export const createGoogleVertex = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  GoogleVertexProvider
>('createGoogleVertex', ['apiKey', 'headers'], (settings) =>
  wrapProvider(sdkCreateGoogleVertex(settings)),
);
export const createVertex = createGoogleVertex;
export const googleVertex: GoogleVertexProvider = wrapProvider(sdkGoogleVertex);
export const vertex: GoogleVertexProvider = googleVertex;

// Workflow calls these host hooks synchronously. The Effects have no services.
const runWorkflowHook = Effect.runSyncWith(Context.empty());

class GoogleVertexTranscriptionWorkflowCarrier {
  static [WORKFLOW_SERIALIZE](model: GoogleVertexGeminiTranscriptionModel) {
    return runWorkflowHook(
      GoogleVertexGeminiTranscriptionModel[WORKFLOW_SERIALIZE](model),
    );
  }

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

const wrapWorkflowTranscriptionModel = (
  model: SdkGoogleVertexGeminiTranscriptionModel,
) => {
  const wrapped = wrapTranscriptionModel(model);
  Object.defineProperty(wrapped, 'constructor', {
    value: GoogleVertexTranscriptionWorkflowCarrier,
  });
  return wrapped;
};

export const GoogleVertexGeminiTranscriptionModel: AdaptedWorkflowConstructor<
  typeof SdkGoogleVertexGeminiTranscriptionModel,
  GoogleVertexGeminiTranscriptionModel
> = adaptWorkflowModelConstructor(
  'GoogleVertexGeminiTranscriptionModel',
  SdkGoogleVertexGeminiTranscriptionModel,
  wrapWorkflowTranscriptionModel,
  unwrapTranscriptionModel,
);
export type GoogleVertexGeminiTranscriptionModel = ReturnType<
  typeof wrapTranscriptionModel
>;
