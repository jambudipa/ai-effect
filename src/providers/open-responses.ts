import { wrapProviderTools } from '../internal/provider-tool.js';
import { createOpenResponses as sdkCreateOpenResponses } from '@ai-sdk/open-responses';
import type { OpenResponsesProvider as SdkProvider } from '@ai-sdk/open-responses';
import { adaptMethod, wrapProviderBase } from '../internal/provider-adapter.js';
import { wrapLanguageModel } from '../internal/language-model.js';
import type { Effect, Scope } from 'effect';
import type { AiSdkError } from '../internal/operation.js';
import { createWithProviderSettings } from '../internal/provider-settings.js';
import type {
  EffectProviderSettings,
  StaticProviderSettings,
} from '../internal/provider-settings.js';
import type { OpenResponsesProviderSettings as SdkSettings } from '@ai-sdk/open-responses';

export { VERSION } from '@ai-sdk/open-responses';
export type {
  Experimental_OpenResponsesBareExtension,
  Experimental_OpenResponsesExtension,
  Experimental_OpenResponsesExtensionContentPart,
  Experimental_OpenResponsesExtensionEvent,
  Experimental_OpenResponsesExtensionInputPart,
  Experimental_OpenResponsesExtensionItem,
  Experimental_OpenResponsesExtensionRecord,
  Experimental_OpenResponsesExtensionStreamPart,
  Experimental_OpenResponsesNamespacedType,
  OpenResponsesCustomToolOptions,
  OpenResponsesLanguageModelOptions,
  OpenResponsesOptions,
} from '@ai-sdk/open-responses';

const wrapProvider = (sdk: SdkProvider) =>
  Object.assign(adaptMethod('openResponses', sdk, wrapLanguageModel), {
    ...wrapProviderBase('openResponses', sdk),
    tools: wrapProviderTools('openResponses.tools', sdk.tools),
  });
export type OpenResponsesProvider = ReturnType<typeof wrapProvider>;
type ResolverKey = 'apiKey' | 'headers';
export type OpenResponsesProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;

export function createOpenResponses(
  options: StaticProviderSettings<SdkSettings, ResolverKey>,
): Effect.Effect<OpenResponsesProvider, AiSdkError>;
export function createOpenResponses<E, R>(
  options: OpenResponsesProviderSettings<E, R>,
): Effect.Effect<OpenResponsesProvider, AiSdkError, R | Scope.Scope>;
export function createOpenResponses<E, R>(
  options: OpenResponsesProviderSettings<E, R>,
) {
  return createWithProviderSettings<SdkSettings, R, OpenResponsesProvider>(
    'createOpenResponses',
    options,
    ['apiKey', 'headers'],
    (settings) => wrapProvider(sdkCreateOpenResponses(settings as SdkSettings)),
  );
}
