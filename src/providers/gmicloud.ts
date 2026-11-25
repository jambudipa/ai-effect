import { adaptProviderFactory } from '../internal/provider-settings.js';
import type { EffectProviderSettings } from '../internal/provider-settings.js';
import type { GmicloudProviderSettings as SdkSettings } from '@ai-sdk/gmicloud';
import {
  createGmicloud as sdkCreateGmicloud,
  gmicloud as sdkGmicloud,
} from '@ai-sdk/gmicloud';
import type { GmicloudProvider as SdkProvider } from '@ai-sdk/gmicloud';
import {
  adaptMethod,
  adaptUnsupportedMethod,
  wrapProviderBase,
} from '../internal/provider-adapter.js';
import { wrapLanguageModel } from '../internal/language-model.js';

export { VERSION } from '@ai-sdk/gmicloud';
export type { GmicloudErrorData } from '@ai-sdk/gmicloud';

const wrapProvider = (sdk: SdkProvider) =>
  Object.assign(adaptMethod('gmicloud', sdk, wrapLanguageModel), {
    ...wrapProviderBase('gmicloud', sdk),
    languageModel: adaptMethod(
      'gmicloud.languageModel',
      sdk.languageModel.bind(sdk),
      wrapLanguageModel,
    ),
    chat: adaptMethod('gmicloud.chat', sdk.chat.bind(sdk), wrapLanguageModel),
    textEmbeddingModel: adaptUnsupportedMethod(
      'gmicloud.textEmbeddingModel',
      sdk.textEmbeddingModel.bind(sdk),
    ),
  });
export type GmicloudProvider = ReturnType<typeof wrapProvider>;
type ResolverKey = 'apiKey';
export type GmicloudProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
export const createGmicloud = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  GmicloudProvider
>('createGmicloud', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateGmicloud(settings)),
);
export const gmicloud: GmicloudProvider = wrapProvider(sdkGmicloud);
