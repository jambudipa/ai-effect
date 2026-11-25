import { adaptProviderFactory } from '../internal/provider-settings.js';
import type { EffectProviderSettings } from '../internal/provider-settings.js';
import type { AnthropicAwsProviderSettings as SdkSettings } from '@ai-sdk/anthropic-aws';
import { wrapProviderTools } from '../internal/provider-tool.js';
import {
  createAnthropicAws as sdkCreateAnthropicAws,
  anthropicAws as sdkAnthropicAws,
} from '@ai-sdk/anthropic-aws';
import type { AnthropicAwsProvider as SdkProvider } from '@ai-sdk/anthropic-aws';
import {
  adaptMethod,
  adaptUnsupportedMethod,
  wrapProviderBase,
} from '../internal/provider-adapter.js';
import { wrapLanguageModel } from '../internal/language-model.js';
import { runSync } from '../internal/operation.js';
import { wrapFiles, wrapSkills } from '../internal/provider-resource.js';

export { VERSION } from '@ai-sdk/anthropic-aws';
export type { AnthropicAwsCredentials } from '@ai-sdk/anthropic-aws';

type ModelId = Parameters<SdkProvider>[0];

const wrapProvider = (sdk: SdkProvider) =>
  Object.assign(
    (modelId: ModelId) =>
      runSync('anthropicAws', () => wrapLanguageModel(sdk(modelId))),
    {
      ...wrapProviderBase('anthropicAws', sdk),
      languageModel: (modelId: ModelId) =>
        runSync('anthropicAws.languageModel', () =>
          wrapLanguageModel(sdk.languageModel(modelId)),
        ),
      textEmbeddingModel: adaptUnsupportedMethod(
        'anthropicAws.textEmbeddingModel',
        sdk.textEmbeddingModel.bind(sdk),
      ),
      files: adaptMethod('anthropicAws.files', sdk.files.bind(sdk), wrapFiles),
      skills: adaptMethod(
        'anthropicAws.skills',
        sdk.skills.bind(sdk),
        wrapSkills,
      ),
      tools: wrapProviderTools('anthropicAws.tools', sdk.tools),
    },
  );
export type AnthropicAwsProvider = ReturnType<typeof wrapProvider>;
type ResolverKey = 'apiKey' | 'credentialProvider';
export type AnthropicAwsProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
export const createAnthropicAws = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  AnthropicAwsProvider
>('createAnthropicAws', ['apiKey', 'credentialProvider'], (settings) =>
  wrapProvider(sdkCreateAnthropicAws(settings)),
);
export const anthropicAws: AnthropicAwsProvider = wrapProvider(sdkAnthropicAws);
