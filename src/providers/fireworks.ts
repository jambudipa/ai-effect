import { adaptProviderFactory } from '../internal/provider-settings.js';
import type { EffectProviderSettings } from '../internal/provider-settings.js';
import type { FireworksProviderSettings as SdkSettings } from '@ai-sdk/fireworks';
import { FireworksImageModel as SdkFireworksImageModel } from '@ai-sdk/fireworks';
import {
  createFireworks as sdkCreateFireworks,
  fireworks as sdkFireworks,
} from '@ai-sdk/fireworks';
import type { FireworksProvider as SdkProvider } from '@ai-sdk/fireworks';
import {
  WORKFLOW_DESERIALIZE,
  WORKFLOW_SERIALIZE,
} from '@ai-sdk/provider-utils';
import { Context, Effect } from 'effect';
import { adaptMethod, wrapProviderBase } from '../internal/provider-adapter.js';
import { wrapLanguageModel } from '../internal/language-model.js';
import {
  unwrapImageModel,
  wrapEmbeddingModel,
  wrapFixedImageModel,
  wrapImageModel,
} from '../internal/provider-model.js';
import { adaptWorkflowModelConstructor } from '../internal/workflow-model.js';
import type { AdaptedWorkflowConstructor } from '../internal/workflow-model.js';

export { VERSION } from '@ai-sdk/fireworks';
export type {
  FireworksEmbeddingModelId,
  FireworksEmbeddingModelOptions,
  FireworksEmbeddingProviderOptions,
  FireworksErrorData,
  FireworksImageModelId,
  FireworksImageModelOptions,
  FireworksLanguageModelOptions,
  FireworksProviderOptions,
} from '@ai-sdk/fireworks';

const wrapProvider = (sdk: SdkProvider) =>
  Object.assign(adaptMethod('fireworks', sdk, wrapLanguageModel), {
    ...wrapProviderBase('fireworks', sdk),
    chatModel: adaptMethod(
      'fireworks.chatModel',
      sdk.chatModel.bind(sdk),
      wrapLanguageModel,
    ),
    completionModel: adaptMethod(
      'fireworks.completionModel',
      sdk.completionModel.bind(sdk),
      wrapLanguageModel,
    ),
    languageModel: adaptMethod(
      'fireworks.languageModel',
      sdk.languageModel.bind(sdk),
      wrapLanguageModel,
    ),
    embeddingModel: adaptMethod(
      'fireworks.embeddingModel',
      sdk.embeddingModel.bind(sdk),
      wrapEmbeddingModel,
    ),
    textEmbeddingModel: adaptMethod(
      'fireworks.textEmbeddingModel',
      sdk.textEmbeddingModel.bind(sdk),
      wrapEmbeddingModel,
    ),
    image: adaptMethod('fireworks.image', sdk.image.bind(sdk), wrapImageModel),
    imageModel: adaptMethod(
      'fireworks.imageModel',
      sdk.imageModel.bind(sdk),
      wrapImageModel,
    ),
  });
export type FireworksProvider = ReturnType<typeof wrapProvider>;
type ResolverKey = 'apiKey';
export type FireworksProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
export const createFireworks = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  FireworksProvider
>('createFireworks', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateFireworks(settings)),
);
export const fireworks: FireworksProvider = wrapProvider(sdkFireworks);

// Workflow calls these host hooks synchronously. Both Effects have no services.
const runWorkflowHook = Effect.runSyncWith(Context.empty());

class FireworksWorkflowCarrier {
  static [WORKFLOW_SERIALIZE](model: FireworksImageModel) {
    return runWorkflowHook(FireworksImageModel[WORKFLOW_SERIALIZE](model));
  }

  static [WORKFLOW_DESERIALIZE](
    input: Parameters<
      (typeof SdkFireworksImageModel)[typeof WORKFLOW_DESERIALIZE]
    >[0],
  ) {
    return runWorkflowHook(FireworksImageModel[WORKFLOW_DESERIALIZE](input));
  }
}

const wrapWorkflowImageModel = (model: SdkFireworksImageModel) => {
  const wrapped = wrapFixedImageModel(model);
  Object.defineProperty(wrapped, 'constructor', {
    value: FireworksWorkflowCarrier,
  });
  return wrapped;
};

export const FireworksImageModel: AdaptedWorkflowConstructor<
  typeof SdkFireworksImageModel,
  FireworksImageModel
> = adaptWorkflowModelConstructor(
  'FireworksImageModel',
  SdkFireworksImageModel,
  wrapWorkflowImageModel,
  unwrapImageModel,
);
export type FireworksImageModel = ReturnType<
  typeof wrapFixedImageModel<SdkFireworksImageModel['maxImagesPerCall']>
>;
