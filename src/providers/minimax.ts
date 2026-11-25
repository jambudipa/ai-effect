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
import { runSync } from '../internal/operation.js';

export { VERSION } from '@ai-sdk/minimax';
export type {
  MiniMaxCacheControlOptions,
  MiniMaxChatModelId,
  MiniMaxImageModelId,
  MiniMaxImageModelOptions,
  MiniMaxImagePartOptions,
  MiniMaxLanguageModelOptions,
  MiniMaxProviderOptions,
  MiniMaxProviderSettings,
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
export const createMiniMax = (...args: Parameters<typeof sdkCreateMiniMax>) =>
  runSync('createMiniMax', () => wrapProvider(sdkCreateMiniMax(...args)));
export const minimax: MiniMaxProvider = wrapProvider(sdkMinimax);
