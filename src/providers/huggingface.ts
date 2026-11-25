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
export type HuggingFaceProvider = ReturnType<typeof wrapProvider>;
type ResolverKey = 'apiKey';
export type HuggingFaceProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
export const createHuggingFace = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  HuggingFaceProvider
>('createHuggingFace', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateHuggingFace(settings)),
);
export const huggingFace: HuggingFaceProvider = wrapProvider(sdkHuggingFace);
export const huggingface: HuggingFaceProvider = huggingFace;
