import { adaptProviderFactory } from '../internal/provider-settings.js';
import type { EffectProviderSettings } from '../internal/provider-settings.js';
import type { AnthropicProviderSettings as SdkSettings } from '@ai-sdk/anthropic';
import { forwardAnthropicContainerIdFromLastStep as sdkForwardContainer } from '@ai-sdk/anthropic';
import { wrapProviderTools } from '../internal/provider-tool.js';
import {
  createAnthropic as sdkCreateAnthropic,
  anthropic as sdkAnthropic,
} from '@ai-sdk/anthropic';
import type { AnthropicProvider as SdkProvider } from '@ai-sdk/anthropic';
import {
  adaptMethod,
  adaptUnsupportedMethod,
  wrapProviderBase,
} from '../internal/provider-adapter.js';
import { wrapLanguageModel } from '../internal/language-model.js';
import {
  wrapDecisionModel,
  wrapEvaluationModel,
  wrapExtractionModel,
} from '../internal/provider-model.js';
import {
  wrapBatch,
  wrapFiles,
  wrapSkills,
} from '../internal/provider-resource.js';

export { VERSION } from '@ai-sdk/anthropic';
export type {
  AnthropicCitation,
  AnthropicLanguageModelOptions,
  AnthropicMessageMetadata,
  AnthropicProviderOptions,
  AnthropicSystemMessageProviderOptions,
  AnthropicTextProviderMetadata,
  AnthropicToolOptions,
  AnthropicUsageIteration,
} from '@ai-sdk/anthropic';

/**
 * Adapt language, decision, evaluation, and extraction model selection from the Anthropic
 * SDK to Effect.
 */
const wrapProvider = (sdk: SdkProvider) =>
  Object.assign(adaptMethod('anthropic', sdk, wrapLanguageModel), {
    ...wrapProviderBase('anthropic', sdk),
    languageModel: adaptMethod(
      'anthropic.languageModel',
      sdk.languageModel.bind(sdk),
      wrapLanguageModel,
    ),
    chat: adaptMethod('anthropic.chat', sdk.chat.bind(sdk), wrapLanguageModel),
    messages: adaptMethod(
      'anthropic.messages',
      sdk.messages.bind(sdk),
      wrapLanguageModel,
    ),
    decisionModel: adaptMethod(
      'anthropic.decisionModel',
      sdk.decisionModel.bind(sdk),
      wrapDecisionModel,
    ),
    evaluationModel: adaptMethod(
      'anthropic.evaluationModel',
      sdk.evaluationModel.bind(sdk),
      wrapEvaluationModel,
    ),
    extractionModel: adaptMethod(
      'anthropic.extractionModel',
      sdk.extractionModel.bind(sdk),
      wrapExtractionModel,
    ),
    experimental_batch: adaptMethod(
      'anthropic.experimental_batch',
      sdk.experimental_batch.bind(sdk),
      wrapBatch,
    ),
    textEmbeddingModel: adaptUnsupportedMethod(
      'anthropic.textEmbeddingModel',
      sdk.textEmbeddingModel.bind(sdk),
    ),
    files: adaptMethod('anthropic.files', sdk.files.bind(sdk), wrapFiles),
    skills: adaptMethod('anthropic.skills', sdk.skills.bind(sdk), wrapSkills),
    tools: wrapProviderTools('anthropic.tools', sdk.tools),
  });
/** Provider returned by the adapter, with Effect-based model selection for Anthropic. */
export type AnthropicProvider = ReturnType<typeof wrapProvider>;
/** Reserve `authToken` for settings the SDK may read through lazy Effect resolvers. */
type ResolverKey = 'authToken';
/**
 * Keep the native Anthropic options and allow `authToken` to resolve through Effect when
 * the SDK requests the value.
 */
export type AnthropicProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
/**
 * Construct the Anthropic provider inside an Effect. Keep the scope open when using an
 * Effect resolver for `authToken`.
 */
export const createAnthropic = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  AnthropicProvider
>('createAnthropic', ['authToken'], (settings) =>
  wrapProvider(sdkCreateAnthropic(settings)),
);
/**
 * Adapt the preconfigured provider from the Anthropic SDK. Use the factory to supply
 * explicit settings.
 */
export const anthropic: AnthropicProvider = wrapProvider(sdkAnthropic);
/**
 * Forward the Anthropic container ID from the prior step so the next request can reuse the
 * container.
 */
export const forwardAnthropicContainerIdFromLastStep = (
  ...args: Parameters<typeof sdkForwardContainer>
) => sdkForwardContainer(...args);
