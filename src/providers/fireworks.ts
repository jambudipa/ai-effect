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

/**
 * Adapt language, embedding, and image model selection from the Fireworks SDK to Effect.
 */
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
/** Provider returned by the adapter, with Effect-based model selection for Fireworks. */
export type FireworksProvider = ReturnType<typeof wrapProvider>;
/** Reserve `apiKey` for settings the SDK may read through lazy Effect resolvers. */
type ResolverKey = 'apiKey';
/**
 * Keep the native Fireworks options and allow `apiKey` to resolve through Effect when the
 * SDK requests the value.
 */
export type FireworksProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
/**
 * Construct the Fireworks provider inside an Effect. Keep the scope open when using an
 * Effect resolver for `apiKey`.
 */
export const createFireworks = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  FireworksProvider
>('createFireworks', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateFireworks(settings)),
);
/**
 * Adapt the preconfigured provider from the Fireworks SDK. Use the factory to supply
 * explicit settings.
 */
export const fireworks: FireworksProvider = wrapProvider(sdkFireworks);

// Workflow calls these host hooks synchronously. Both Effects have no services.
/**
 * Run the synchronous serialization hooks with an empty Effect context for the workflow
 * host.
 */
const runWorkflowHook = Effect.runSyncWith(Context.empty());

/**
 * Expose synchronous workflow hooks on Fireworks image models instances reconstructed by
 * the Effect adapter.
 */
class FireworksWorkflowCarrier {
  /** Serialize the adapted model through its synchronous SDK workflow hook. */
  static [WORKFLOW_SERIALIZE](model: FireworksImageModel) {
    return runWorkflowHook(FireworksImageModel[WORKFLOW_SERIALIZE](model));
  }

  /**
   * Restore the Effect model from the native workflow payload before handing it to the
   * host.
   */
  static [WORKFLOW_DESERIALIZE](
    input: Parameters<
      (typeof SdkFireworksImageModel)[typeof WORKFLOW_DESERIALIZE]
    >[0],
  ) {
    return runWorkflowHook(FireworksImageModel[WORKFLOW_DESERIALIZE](input));
  }
}

/**
 * Attach the workflow carrier to the adapted Fireworks image models so the workflow host
 * can round-trip the instance.
 */
const wrapWorkflowImageModel = (model: SdkFireworksImageModel) => {
  const wrapped = wrapFixedImageModel(model);
  Object.defineProperty(wrapped, 'constructor', {
    value: FireworksWorkflowCarrier,
  });
  return wrapped;
};

/**
 * Construct the SDK Fireworks image model lazily with its native options. It exposes the
 * workflow serialization hooks.
 */
export const FireworksImageModel: AdaptedWorkflowConstructor<
  typeof SdkFireworksImageModel,
  FireworksImageModel
> = adaptWorkflowModelConstructor(
  'FireworksImageModel',
  SdkFireworksImageModel,
  wrapWorkflowImageModel,
  unwrapImageModel,
);
/**
 * Effect model returned by `FireworksImageModel`. Use its image generation operations in
 * an Effect program.
 */
export type FireworksImageModel = ReturnType<
  typeof wrapFixedImageModel<SdkFireworksImageModel['maxImagesPerCall']>
>;
