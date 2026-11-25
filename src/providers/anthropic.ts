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
export type AnthropicProvider = ReturnType<typeof wrapProvider>;
type ResolverKey = 'authToken';
export type AnthropicProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
export const createAnthropic = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  AnthropicProvider
>('createAnthropic', ['authToken'], (settings) =>
  wrapProvider(sdkCreateAnthropic(settings)),
);
export const anthropic: AnthropicProvider = wrapProvider(sdkAnthropic);
export const forwardAnthropicContainerIdFromLastStep = (
  ...args: Parameters<typeof sdkForwardContainer>
) => sdkForwardContainer(...args);
