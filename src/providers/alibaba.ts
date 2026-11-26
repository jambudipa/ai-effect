import { adaptProviderFactory } from '../internal/provider-settings.js';
import type { EffectProviderSettings } from '../internal/provider-settings.js';
import type { AlibabaProviderSettings as SdkSettings } from '@ai-sdk/alibaba';
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

export { VERSION } from '@ai-sdk/alibaba';
export type {
  AlibabaCacheControl,
  AlibabaChatModelId,
  AlibabaEmbeddingModelId,
  AlibabaEmbeddingModelOptions,
  AlibabaLanguageModelChatOptions,
  AlibabaLanguageModelOptions,
  AlibabaProviderOptions,
  AlibabaUsage,
  AlibabaVideoModelId,
  AlibabaVideoModelOptions,
  AlibabaVideoProviderOptions,
} from '@ai-sdk/alibaba';

/**
 * Adapt language, embedding, and video model selection from the Alibaba SDK to Effect.
 */
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
/** Provider returned by the adapter, with Effect-based model selection for Alibaba. */
export type AlibabaProvider = ReturnType<typeof wrapProvider>;
/** Reserve `apiKey` for settings the SDK may read through lazy Effect resolvers. */
type ResolverKey = 'apiKey';
/**
 * Keep the native Alibaba options and allow `apiKey` to resolve through Effect when the
 * SDK requests the value.
 */
export type AlibabaProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
/**
 * Construct the Alibaba provider inside an Effect. Keep the scope open when using an Effect
 * resolver for `apiKey`.
 */
export const createAlibaba = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  AlibabaProvider
>('createAlibaba', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateAlibaba(settings)),
);
/**
 * Adapt the preconfigured provider from the Alibaba SDK. Use the factory to supply
 * explicit settings.
 */
export const alibaba: AlibabaProvider = wrapProvider(sdkAlibaba);
