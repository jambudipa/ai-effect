import {
  createBedrockMantle as sdkCreateBedrockMantle,
  bedrockMantle as sdkBedrockMantle,
} from '@ai-sdk/amazon-bedrock/mantle';
import type { BedrockMantleProvider as SdkProvider } from '@ai-sdk/amazon-bedrock/mantle';
import {
  adaptMethod,
  adaptUnsupportedMethod,
  wrapProviderBase,
} from '../../internal/provider-adapter.js';
import { wrapLanguageModel } from '../../internal/language-model.js';
import { runSync } from '../../internal/operation.js';

export type {
  BedrockMantleModelId,
  BedrockMantleProviderSettings,
} from '@ai-sdk/amazon-bedrock/mantle';

const wrapProvider = (sdk: SdkProvider) =>
  Object.assign(adaptMethod('bedrockMantle', sdk, wrapLanguageModel), {
    ...wrapProviderBase('bedrockMantle', sdk),
    languageModel: adaptMethod(
      'bedrockMantle.languageModel',
      sdk.languageModel.bind(sdk),
      wrapLanguageModel,
    ),
    chat: adaptMethod(
      'bedrockMantle.chat',
      sdk.chat.bind(sdk),
      wrapLanguageModel,
    ),
    responses: adaptMethod(
      'bedrockMantle.responses',
      sdk.responses.bind(sdk),
      wrapLanguageModel,
    ),
    textEmbeddingModel: adaptUnsupportedMethod(
      'bedrockMantle.textEmbeddingModel',
      sdk.textEmbeddingModel.bind(sdk),
    ),
  });
export type BedrockMantleProvider = ReturnType<typeof wrapProvider>;
export const createBedrockMantle = (
  ...args: Parameters<typeof sdkCreateBedrockMantle>
) =>
  runSync('createBedrockMantle', () =>
    wrapProvider(sdkCreateBedrockMantle(...args)),
  );
export const bedrockMantle: BedrockMantleProvider =
  wrapProvider(sdkBedrockMantle);
