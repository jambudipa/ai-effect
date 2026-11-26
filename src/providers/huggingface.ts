import { adaptProviderFactory } from '../internal/provider-settings.js';
import type { EffectProviderSettings } from '../internal/provider-settings.js';
import type { HuggingFaceProviderSettings as SdkSettings } from '@ai-sdk/huggingface';
import {
  createHuggingFace as sdkCreateHuggingFace,
  huggingFace as sdkHuggingFace,
} from '@ai-sdk/huggingface';
import type { HuggingFaceProvider as SdkProvider } from '@ai-sdk/huggingface';
import {
  adaptMethod,
  adaptUnsupportedMethod,
  wrapProviderBase,
} from '../internal/provider-adapter.js';
import { wrapLanguageModel } from '../internal/language-model.js';

export { VERSION } from '@ai-sdk/huggingface';
export type {
  HuggingFaceErrorData,
  HuggingFaceResponsesModelId,
  HuggingFaceResponsesSettings,
} from '@ai-sdk/huggingface';

/** Adapt language model selection from the Hugging Face SDK to Effect. */
const wrapProvider = (sdk: SdkProvider) =>
  Object.assign(adaptMethod('huggingFace', sdk, wrapLanguageModel), {
    ...wrapProviderBase('huggingFace', sdk),
    languageModel: adaptMethod(
      'huggingFace.languageModel',
      sdk.languageModel.bind(sdk),
      wrapLanguageModel,
    ),
    responses: adaptMethod(
      'huggingFace.responses',
      sdk.responses.bind(sdk),
      wrapLanguageModel,
    ),
    textEmbeddingModel: adaptUnsupportedMethod(
      'huggingFace.textEmbeddingModel',
      sdk.textEmbeddingModel.bind(sdk),
    ),
  });
/**
 * Provider returned by the adapter, with Effect-based model selection for Hugging Face.
 */
export type HuggingFaceProvider = ReturnType<typeof wrapProvider>;
/** Reserve `apiKey` for settings the SDK may read through lazy Effect resolvers. */
type ResolverKey = 'apiKey';
/**
 * Keep the native Hugging Face options and allow `apiKey` to resolve through Effect when
 * the SDK requests the value.
 */
export type HuggingFaceProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
/**
 * Construct the Hugging Face provider inside an Effect. Keep the scope open when using an
 * Effect resolver for `apiKey`.
 */
export const createHuggingFace = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  HuggingFaceProvider
>('createHuggingFace', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateHuggingFace(settings)),
);
/**
 * Adapt the preconfigured provider from the Hugging Face SDK. Use the factory to supply
 * explicit settings.
 */
export const huggingFace: HuggingFaceProvider = wrapProvider(sdkHuggingFace);
/** Expose the same Hugging Face provider as `huggingFace` under the SDK alias. */
export const huggingface: HuggingFaceProvider = huggingFace;
