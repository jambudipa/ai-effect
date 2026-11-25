import { adaptProviderFactory } from '../internal/provider-settings.js';
import type { EffectProviderSettings } from '../internal/provider-settings.js';
import type { ProdiaProviderSettings as SdkSettings } from '@ai-sdk/prodia';
import {
  createProdia as sdkCreateProdia,
  prodia as sdkProdia,
} from '@ai-sdk/prodia';
import type { ProdiaProvider as SdkProvider } from '@ai-sdk/prodia';
import {
  adaptMethod,
  adaptUnsupportedMethod,
  wrapProviderBase,
} from '../internal/provider-adapter.js';
import { wrapLanguageModel } from '../internal/language-model.js';
import { wrapImageModel, wrapVideoModel } from '../internal/provider-model.js';

export { VERSION } from '@ai-sdk/prodia';
export type {
  ProdiaImageModelId,
  ProdiaImageModelOptions,
  ProdiaImageProviderOptions,
  ProdiaLanguageModelId,
  ProdiaLanguageModelOptions,
  ProdiaVideoModelId,
  ProdiaVideoModelOptions,
} from '@ai-sdk/prodia';

const wrapProvider = (sdk: SdkProvider) => ({
  ...wrapProviderBase('prodia', sdk),
  languageModel: adaptMethod(
    'prodia.languageModel',
    sdk.languageModel.bind(sdk),
    wrapLanguageModel,
  ),
  image: adaptMethod('prodia.image', sdk.image.bind(sdk), wrapImageModel),
  imageModel: adaptMethod(
    'prodia.imageModel',
    sdk.imageModel.bind(sdk),
    wrapImageModel,
  ),
  video: adaptMethod('prodia.video', sdk.video.bind(sdk), wrapVideoModel),
  videoModel: adaptMethod(
    'prodia.videoModel',
    sdk.videoModel.bind(sdk),
    wrapVideoModel,
  ),
  textEmbeddingModel: adaptUnsupportedMethod(
    'prodia.textEmbeddingModel',
    sdk.textEmbeddingModel.bind(sdk),
  ),
});
export type ProdiaProvider = ReturnType<typeof wrapProvider>;
type ResolverKey = 'apiKey';
export type ProdiaProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
export const createProdia = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  ProdiaProvider
>('createProdia', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateProdia(settings)),
);
export const prodia: ProdiaProvider = wrapProvider(sdkProdia);
