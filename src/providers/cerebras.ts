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

/** Adapt language model selection from the Cerebras SDK to Effect. */
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
  /**
   * Supply the credential directly or as an Effect that runs when the SDK asks for the
   * key.
   */
  readonly apiKey?: ProviderSetting<string, E, R>;
  /** Override the Cerebras SDK endpoint for deployments with a custom base URL. */
  readonly baseURL?: string;
  /** Add headers to requests made by the native provider. */
  readonly headers?: Record<string, string>;
  /**
   * Supply the SDK fetch implementation for transport interception or a custom runtime.
   */
  readonly fetch?: typeof globalThis.fetch;
}

/**
 * Allow static SDK settings without a scope and replace the Effect-capable key with its
 * static form.
 */
type PlainCerebrasSettings = Omit<CerebrasProviderSettings, 'apiKey'> & {
  readonly apiKey?: string;
};

/** Create Cerebras with static settings or an Effect credential. */
interface CreateCerebras {
  (
    options?: PlainCerebrasSettings,
  ): Effect.Effect<CerebrasProvider, AiSdkError>;
  <E, R>(
    options: CerebrasProviderSettings<E, R>,
  ): Effect.Effect<CerebrasProvider, AiSdkError, R | Scope.Scope>;
}

/**
 * Build the Cerebras adapter with the SDK key resolver bound to the current operation
 * scope.
 */
function createCerebrasScoped<E, R>(
  options?: CerebrasProviderSettings<E, R>,
): Effect.Effect<CerebrasProvider, AiSdkError, R | Scope.Scope> {
  return createWithProviderSettings<SdkSettings, R, CerebrasProvider>(
    'createCerebras',
    options,
    ['apiKey'],
    (settings) => wrapCerebras(sdkCreateCerebras(settings)),
  );
}

/**
 * Build the Cerebras provider inside an Effect. The Effect key resolver overload requires
 * a scope.
 */
export const createCerebras = createCerebrasScoped as CreateCerebras;
