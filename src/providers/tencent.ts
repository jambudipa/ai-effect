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
export type TencentProvider = ReturnType<typeof wrapProvider>;
type ResolverKey = 'apiKey';
export type TencentProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
export const createTencent = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  TencentProvider
>('createTencent', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateTencent(settings)),
);
export const tencent: TencentProvider = wrapProvider(sdkTencent);
