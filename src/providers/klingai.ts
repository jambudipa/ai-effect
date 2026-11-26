import { adaptProviderFactory } from '../internal/provider-settings.js';
import type { EffectProviderSettings } from '../internal/provider-settings.js';
import type { KlingAIProviderSettings as SdkSettings } from '@ai-sdk/klingai';
import {
  createKlingAI as sdkCreateKlingAI,
  klingai as sdkKlingai,
} from '@ai-sdk/klingai';
import type { KlingAIProvider as SdkProvider } from '@ai-sdk/klingai';
import { adaptMethod, wrapProviderBase } from '../internal/provider-adapter.js';
import { wrapVideoModel } from '../internal/provider-model.js';

export { VERSION } from '@ai-sdk/klingai';
export type {
  KlingAIVideoModelId,
  KlingAIVideoModelOptions,
  KlingAIVideoProviderOptions,
} from '@ai-sdk/klingai';

/** Adapt video model selection from the Kling AI SDK to Effect. */
const wrapProvider = (sdk: SdkProvider) => ({
  ...wrapProviderBase('klingai', sdk),
  video: adaptMethod('klingai.video', sdk.video.bind(sdk), wrapVideoModel),
  videoModel: adaptMethod(
    'klingai.videoModel',
    sdk.videoModel.bind(sdk),
    wrapVideoModel,
  ),
});
/** Provider returned by the adapter, with Effect-based model selection for Kling AI. */
export type KlingAIProvider = ReturnType<typeof wrapProvider>;
/** Reserve `apiKey` for settings the SDK may read through lazy Effect resolvers. */
type ResolverKey = 'apiKey';
/**
 * Keep the native Kling AI options and allow `apiKey` to resolve through Effect when the
 * SDK requests the value.
 */
export type KlingAIProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
/**
 * Construct the Kling AI provider inside an Effect. Keep the scope open when using an Effect
 * resolver for `apiKey`.
 */
export const createKlingAI = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  KlingAIProvider
>('createKlingAI', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateKlingAI(settings)),
);
/**
 * Adapt the preconfigured provider from the Kling AI SDK. Use the factory to supply
 * explicit settings.
 */
export const klingai: KlingAIProvider = wrapProvider(sdkKlingai);
