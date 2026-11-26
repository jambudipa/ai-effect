import { adaptProviderFactory } from '../internal/provider-settings.js';
import type { EffectProviderSettings } from '../internal/provider-settings.js';
import type { TencentProviderSettings as SdkSettings } from '@ai-sdk/tencent';
import {
  createTencent as sdkCreateTencent,
  tencent as sdkTencent,
} from '@ai-sdk/tencent';
import type { TencentProvider as SdkProvider } from '@ai-sdk/tencent';
import {
  adaptMethod,
  adaptUnsupportedMethod,
  wrapProviderBase,
} from '../internal/provider-adapter.js';
import { wrapLanguageModel } from '../internal/language-model.js';
import { wrapVideoModel } from '../internal/provider-model.js';

export { VERSION } from '@ai-sdk/tencent';
export type {
  TencentChatModelId,
  TencentLanguageModelChatOptions,
  TencentTokenHubErrorData,
  TencentVideoModelId,
  TencentVideoModelOptions,
} from '@ai-sdk/tencent';

/** Adapt language and video model selection from the Tencent SDK to Effect. */
const wrapProvider = (sdk: SdkProvider) =>
  Object.assign(adaptMethod('tencent', sdk, wrapLanguageModel), {
    ...wrapProviderBase('tencent', sdk),
    languageModel: adaptMethod(
      'tencent.languageModel',
      sdk.languageModel.bind(sdk),
      wrapLanguageModel,
    ),
    chat: adaptMethod('tencent.chat', sdk.chat.bind(sdk), wrapLanguageModel),
    video: adaptMethod('tencent.video', sdk.video.bind(sdk), wrapVideoModel),
    videoModel: adaptMethod(
      'tencent.videoModel',
      sdk.videoModel.bind(sdk),
      wrapVideoModel,
    ),
    textEmbeddingModel: adaptUnsupportedMethod(
      'tencent.textEmbeddingModel',
      sdk.textEmbeddingModel.bind(sdk),
    ),
  });
/** Provider returned by the adapter, with Effect-based model selection for Tencent. */
export type TencentProvider = ReturnType<typeof wrapProvider>;
/** Reserve `apiKey` for settings the SDK may read through lazy Effect resolvers. */
type ResolverKey = 'apiKey';
/**
 * Keep the native Tencent options and allow `apiKey` to resolve through Effect when the
 * SDK requests the value.
 */
export type TencentProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
/**
 * Construct the Tencent provider inside an Effect. Keep the scope open when using an Effect
 * resolver for `apiKey`.
 */
export const createTencent = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  TencentProvider
>('createTencent', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateTencent(settings)),
);
/**
 * Adapt the preconfigured provider from the Tencent SDK. Use the factory to supply
 * explicit settings.
 */
export const tencent: TencentProvider = wrapProvider(sdkTencent);
