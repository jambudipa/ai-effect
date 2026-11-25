import {
  createBaseten as sdkCreateBaseten,
  baseten as sdkBaseten,
} from '@ai-sdk/baseten';
import type { BasetenProvider as SdkProvider } from '@ai-sdk/baseten';
import { adaptMethod, wrapProviderBase } from '../internal/provider-adapter.js';
import { wrapLanguageModel } from '../internal/language-model.js';
import {
  wrapDecisionModel,
  wrapEmbeddingModel,
} from '../internal/provider-model.js';
import { runSync } from '../internal/operation.js';

export { VERSION } from '@ai-sdk/baseten';
export type {
  BasetenChatModelId,
  BasetenDecisionModelId,
  BasetenDecisionModelOptions,
  BasetenEmbeddingModelOptions,
  BasetenErrorData,
  BasetenPerformanceClient,
  BasetenPerformanceClientConstructor,
  BasetenProviderSettings,
} from '@ai-sdk/baseten';

const wrapProvider = (sdk: SdkProvider) =>
  Object.assign(adaptMethod('baseten', sdk, wrapLanguageModel), {
    ...wrapProviderBase('baseten', sdk),
    chatModel: adaptMethod(
      'baseten.chatModel',
      sdk.chatModel.bind(sdk),
      wrapLanguageModel,
    ),
    languageModel: adaptMethod(
      'baseten.languageModel',
      sdk.languageModel.bind(sdk),
      wrapLanguageModel,
    ),
    embeddingModel: adaptMethod(
      'baseten.embeddingModel',
      sdk.embeddingModel.bind(sdk),
      wrapEmbeddingModel,
    ),
    textEmbeddingModel: adaptMethod(
      'baseten.textEmbeddingModel',
      sdk.textEmbeddingModel.bind(sdk),
      wrapEmbeddingModel,
    ),
    decisionModel: adaptMethod(
      'baseten.decisionModel',
      sdk.decisionModel.bind(sdk),
      wrapDecisionModel,
    ),
  });
export type BasetenProvider = ReturnType<typeof wrapProvider>;
export const createBaseten = (...args: Parameters<typeof sdkCreateBaseten>) =>
  runSync('createBaseten', () => wrapProvider(sdkCreateBaseten(...args)));
export const baseten: BasetenProvider = wrapProvider(sdkBaseten);
