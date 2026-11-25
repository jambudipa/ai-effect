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

const wrapProvider = (sdk: SdkProvider) => ({
  ...wrapProviderBase('klingai', sdk),
  video: adaptMethod('klingai.video', sdk.video.bind(sdk), wrapVideoModel),
  videoModel: adaptMethod(
    'klingai.videoModel',
    sdk.videoModel.bind(sdk),
    wrapVideoModel,
  ),
});
export type KlingAIProvider = ReturnType<typeof wrapProvider>;
type ResolverKey = 'apiKey';
export type KlingAIProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
export const createKlingAI = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  KlingAIProvider
>('createKlingAI', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateKlingAI(settings)),
);
export const klingai: KlingAIProvider = wrapProvider(sdkKlingai);
