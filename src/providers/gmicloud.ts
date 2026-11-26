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

/** Adapt language model selection from the GMI Cloud SDK to Effect. */
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
/** Provider returned by the adapter, with Effect-based model selection for GMI Cloud. */
export type GmicloudProvider = ReturnType<typeof wrapProvider>;
/** Reserve `apiKey` for settings the SDK may read through lazy Effect resolvers. */
type ResolverKey = 'apiKey';
/**
 * Keep the native GMI Cloud options and allow `apiKey` to resolve through Effect when the
 * SDK requests the value.
 */
export type GmicloudProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
/**
 * Construct the GMI Cloud provider inside an Effect. Keep the scope open when using an
 * Effect resolver for `apiKey`.
 */
export const createGmicloud = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  GmicloudProvider
>('createGmicloud', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateGmicloud(settings)),
);
/**
 * Adapt the preconfigured provider from the GMI Cloud SDK. Use the factory to supply
 * explicit settings.
 */
export const gmicloud: GmicloudProvider = wrapProvider(sdkGmicloud);
