import {
  VERSION,
  cerebras as sdkCerebras,
  createCerebras as sdkCreateCerebras,
  type CerebrasProvider as SdkCerebrasProvider,
  type CerebrasProviderSettings as SdkSettings,
} from '@ai-sdk/cerebras';
import { wrapLanguageModel } from '../internal/language-model.js';
import type { Effect, Scope } from 'effect';
import type { AiSdkError } from '../internal/operation.js';
import { createWithProviderSettings } from '../internal/provider-settings.js';
import type { ProviderSetting } from '../internal/provider-settings.js';
import {
  adaptMethod,
  adaptUnsupportedMethod,
  wrapProviderBase,
} from '../internal/provider-adapter.js';

export { VERSION };
export type {
  CerebrasErrorData,
  CerebrasLanguageModelChatOptions,
} from '@ai-sdk/cerebras';
export type { LanguageModelV4 } from '../internal/language-model.js';
export type {
  LanguageModelV4CallOptions,
  LanguageModelV4GenerateResult,
  LanguageModelV4StreamPart,
} from '@ai-sdk/provider';

/** The callable Cerebras provider and its model selectors. */
export type CerebrasProvider = ReturnType<typeof wrapCerebras>;

const wrapCerebras = (sdk: SdkCerebrasProvider) =>
  Object.assign(adaptMethod('cerebras', sdk, wrapLanguageModel), {
    ...wrapProviderBase('cerebras', sdk),
    languageModel: adaptMethod(
      'cerebras.languageModel',
      sdk.languageModel.bind(sdk),
      wrapLanguageModel,
    ),
    chat: adaptMethod('cerebras.chat', sdk.chat.bind(sdk), wrapLanguageModel),
    textEmbeddingModel: adaptUnsupportedMethod(
      'cerebras.textEmbeddingModel',
      sdk.textEmbeddingModel.bind(sdk),
    ),
  });

/** Use Cerebras with its default settings. Requests start on execution. */
export const cerebras = wrapCerebras(sdkCerebras);

/** Cerebras connection settings. A credential Effect runs when the SDK requests it. */
export interface CerebrasProviderSettings<E = never, R = never> {
  readonly apiKey?: ProviderSetting<string, E, R>;
  readonly baseURL?: string;
  readonly headers?: Record<string, string>;
  readonly fetch?: typeof globalThis.fetch;
}

type PlainCerebrasSettings = Omit<CerebrasProviderSettings, 'apiKey'> & {
  readonly apiKey?: string;
};

/** Create a provider with static settings. */
export function createCerebras(
  options?: PlainCerebrasSettings,
): Effect.Effect<CerebrasProvider, AiSdkError>;
/** Create a provider with credentials that resolve during each SDK request. */
export function createCerebras<E, R>(
  options: CerebrasProviderSettings<E, R>,
): Effect.Effect<CerebrasProvider, AiSdkError, R | Scope.Scope>;
export function createCerebras<E, R>(options?: CerebrasProviderSettings<E, R>) {
  return createWithProviderSettings<SdkSettings, R, CerebrasProvider>(
    'createCerebras',
    options,
    ['apiKey'],
    (settings) => wrapCerebras(sdkCreateCerebras(settings)),
  );
}
