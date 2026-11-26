import { adaptProviderFactory } from '../internal/provider-settings.js';
import type { EffectProviderSettings } from '../internal/provider-settings.js';
import type { DeepInfraProviderSettings as SdkSettings } from '@ai-sdk/deepinfra';
import {
  createDeepInfra as sdkCreateDeepInfra,
  deepInfra as sdkDeepInfra,
} from '@ai-sdk/deepinfra';
import type { DeepInfraProvider as SdkProvider } from '@ai-sdk/deepinfra';
import { adaptMethod, wrapProviderBase } from '../internal/provider-adapter.js';
import { wrapLanguageModel } from '../internal/language-model.js';
import {
  wrapEmbeddingModel,
  wrapImageModel,
} from '../internal/provider-model.js';

export { VERSION } from '@ai-sdk/deepinfra';
export type {
  DeepInfraErrorData,
  DeepInfraImageModelOptions,
} from '@ai-sdk/deepinfra';

/**
 * Adapt language, embedding, and image model selection from the DeepInfra SDK to Effect.
 */
const wrapProvider = (sdk: SdkProvider) =>
  Object.assign(adaptMethod('deepInfra', sdk, wrapLanguageModel), {
    ...wrapProviderBase('deepInfra', sdk),
    chatModel: adaptMethod(
      'deepInfra.chatModel',
      sdk.chatModel.bind(sdk),
      wrapLanguageModel,
    ),
    image: adaptMethod('deepInfra.image', sdk.image.bind(sdk), wrapImageModel),
    imageModel: adaptMethod(
      'deepInfra.imageModel',
      sdk.imageModel.bind(sdk),
      wrapImageModel,
    ),
    languageModel: adaptMethod(
      'deepInfra.languageModel',
      sdk.languageModel.bind(sdk),
      wrapLanguageModel,
    ),
    completionModel: adaptMethod(
      'deepInfra.completionModel',
      sdk.completionModel.bind(sdk),
      wrapLanguageModel,
    ),
    embeddingModel: adaptMethod(
      'deepInfra.embeddingModel',
      sdk.embeddingModel.bind(sdk),
      wrapEmbeddingModel,
    ),
    textEmbeddingModel: adaptMethod(
      'deepInfra.textEmbeddingModel',
      sdk.textEmbeddingModel.bind(sdk),
      wrapEmbeddingModel,
    ),
  });
/** Provider returned by the adapter, with Effect-based model selection for DeepInfra. */
export type DeepInfraProvider = ReturnType<typeof wrapProvider>;
/** Reserve `apiKey` for settings the SDK may read through lazy Effect resolvers. */
type ResolverKey = 'apiKey';
/**
 * Keep the native DeepInfra options and allow `apiKey` to resolve through Effect when the
 * SDK requests the value.
 */
export type DeepInfraProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
/**
 * Construct the DeepInfra provider inside an Effect. Keep the scope open when using an
 * Effect resolver for `apiKey`.
 */
export const createDeepInfra = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  DeepInfraProvider
>('createDeepInfra', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateDeepInfra(settings)),
);
/**
 * Adapt the preconfigured provider from the DeepInfra SDK. Use the factory to supply
 * explicit settings.
 */
export const deepInfra: DeepInfraProvider = wrapProvider(sdkDeepInfra);
/** Expose the same DeepInfra provider as `deepInfra` under the SDK alias. */
export const deepinfra: DeepInfraProvider = deepInfra;
