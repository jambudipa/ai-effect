import {
  createAlibaba as sdkCreateAlibaba,
  alibaba as sdkAlibaba,
} from '@ai-sdk/alibaba';
import type { AlibabaProvider as SdkProvider } from '@ai-sdk/alibaba';
import { adaptMethod, wrapProviderBase } from '../internal/provider-adapter.js';
import { wrapLanguageModel } from '../internal/language-model.js';
import {
  wrapEmbeddingModel,
  wrapVideoModel,
} from '../internal/provider-model.js';
import { runSync } from '../internal/operation.js';

export { VERSION } from '@ai-sdk/alibaba';
export type {
  AlibabaCacheControl,
  AlibabaChatModelId,
  AlibabaEmbeddingModelId,
  AlibabaEmbeddingModelOptions,
  AlibabaLanguageModelChatOptions,
  AlibabaLanguageModelOptions,
  AlibabaProviderOptions,
  AlibabaProviderSettings,
  AlibabaUsage,
  AlibabaVideoModelId,
  AlibabaVideoModelOptions,
  AlibabaVideoProviderOptions,
} from '@ai-sdk/alibaba';

const wrapProvider = (sdk: SdkProvider) =>
  Object.assign(adaptMethod('alibaba', sdk, wrapLanguageModel), {
    ...wrapProviderBase('alibaba', sdk),
    languageModel: adaptMethod(
      'alibaba.languageModel',
      sdk.languageModel.bind(sdk),
      wrapLanguageModel,
    ),
    chatModel: adaptMethod(
      'alibaba.chatModel',
      sdk.chatModel.bind(sdk),
      wrapLanguageModel,
    ),
    embedding: adaptMethod(
      'alibaba.embedding',
      sdk.embedding.bind(sdk),
      wrapEmbeddingModel,
    ),
    embeddingModel: adaptMethod(
      'alibaba.embeddingModel',
      sdk.embeddingModel.bind(sdk),
      wrapEmbeddingModel,
    ),
    video: adaptMethod('alibaba.video', sdk.video.bind(sdk), wrapVideoModel),
    videoModel: adaptMethod(
      'alibaba.videoModel',
      sdk.videoModel.bind(sdk),
      wrapVideoModel,
    ),
  });
export type AlibabaProvider = ReturnType<typeof wrapProvider>;
export const createAlibaba = (...args: Parameters<typeof sdkCreateAlibaba>) =>
  runSync('createAlibaba', () => wrapProvider(sdkCreateAlibaba(...args)));
export const alibaba: AlibabaProvider = wrapProvider(sdkAlibaba);
