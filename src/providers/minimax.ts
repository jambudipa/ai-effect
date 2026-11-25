import { adaptProviderFactory } from '../internal/provider-settings.js';
import type { EffectProviderSettings } from '../internal/provider-settings.js';
import type { MiniMaxProviderSettings as SdkSettings } from '@ai-sdk/minimax';
import {
  createMiniMax as sdkCreateMiniMax,
  minimax as sdkMinimax,
} from '@ai-sdk/minimax';
import type { MiniMaxProvider as SdkProvider } from '@ai-sdk/minimax';
import {
  adaptMethod,
  adaptUnsupportedMethod,
  wrapProviderBase,
} from '../internal/provider-adapter.js';
import { wrapImageModel, wrapVideoModel } from '../internal/provider-model.js';
import { wrapLanguageModel } from '../internal/language-model.js';

export { VERSION } from '@ai-sdk/minimax';
export type {
  MiniMaxCacheControlOptions,
  MiniMaxChatModelId,
  MiniMaxImageModelId,
  MiniMaxImageModelOptions,
  MiniMaxImagePartOptions,
  MiniMaxLanguageModelOptions,
  MiniMaxProviderOptions,
  MiniMaxVideoModelId,
  MiniMaxVideoModelOptions,
  MiniMaxVideoPartOptions,
} from '@ai-sdk/minimax';

const wrapProvider = (sdk: SdkProvider) =>
  Object.assign(adaptMethod('minimax', sdk, wrapLanguageModel), {
    ...wrapProviderBase('minimax', sdk),
    image: adaptMethod('minimax.image', sdk.image.bind(sdk), wrapImageModel),
    imageModel: adaptMethod(
      'minimax.imageModel',
      sdk.imageModel.bind(sdk),
      wrapImageModel,
    ),
    languageModel: adaptMethod(
      'minimax.languageModel',
      sdk.languageModel.bind(sdk),
      wrapLanguageModel,
    ),
    chat: adaptMethod('minimax.chat', sdk.chat.bind(sdk), wrapLanguageModel),
    video: adaptMethod('minimax.video', sdk.video.bind(sdk), wrapVideoModel),
    videoModel: adaptMethod(
      'minimax.videoModel',
      sdk.videoModel.bind(sdk),
      wrapVideoModel,
    ),
    textEmbeddingModel: adaptUnsupportedMethod(
      'minimax.textEmbeddingModel',
      sdk.textEmbeddingModel.bind(sdk),
    ),
  });
export type MiniMaxProvider = ReturnType<typeof wrapProvider>;
type ResolverKey = 'apiKey';
export type MiniMaxProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
export const createMiniMax = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  MiniMaxProvider
>('createMiniMax', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateMiniMax(settings)),
);
export const minimax: MiniMaxProvider = wrapProvider(sdkMinimax);
