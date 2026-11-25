import {
  VERSION,
  cerebras as sdkCerebras,
  createCerebras as sdkCreateCerebras,
  type CerebrasProvider as SdkCerebrasProvider,
  type CerebrasProviderSettings,
} from '@ai-sdk/cerebras';
import { wrapLanguageModel } from '../internal/language-model.js';
import { runSync } from '../internal/operation.js';
import {
  adaptMethod,
  adaptUnsupportedMethod,
  wrapProviderBase,
} from '../internal/provider-adapter.js';

export { VERSION };
export type {
  CerebrasErrorData,
  CerebrasLanguageModelChatOptions,
  CerebrasProviderSettings,
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

/** Create a Cerebras provider with caller-supplied settings. */
export const createCerebras = (options?: CerebrasProviderSettings) =>
  runSync('createCerebras', () => wrapCerebras(sdkCreateCerebras(options)));
