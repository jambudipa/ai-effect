import {
  createHuggingFace as sdkCreateHuggingFace,
  huggingFace as sdkHuggingFace,
} from '@ai-sdk/huggingface';
import type { HuggingFaceProvider as SdkProvider } from '@ai-sdk/huggingface';
import {
  adaptMethod,
  adaptUnsupportedMethod,
  wrapProviderBase,
} from '../internal/provider-adapter.js';
import { wrapLanguageModel } from '../internal/language-model.js';
import { runSync } from '../internal/operation.js';

export { VERSION } from '@ai-sdk/huggingface';
export type {
  HuggingFaceErrorData,
  HuggingFaceProviderSettings,
  HuggingFaceResponsesModelId,
  HuggingFaceResponsesSettings,
} from '@ai-sdk/huggingface';

const wrapProvider = (sdk: SdkProvider) =>
  Object.assign(adaptMethod('huggingFace', sdk, wrapLanguageModel), {
    ...wrapProviderBase('huggingFace', sdk),
    languageModel: adaptMethod(
      'huggingFace.languageModel',
      sdk.languageModel.bind(sdk),
      wrapLanguageModel,
    ),
    responses: adaptMethod(
      'huggingFace.responses',
      sdk.responses.bind(sdk),
      wrapLanguageModel,
    ),
    textEmbeddingModel: adaptUnsupportedMethod(
      'huggingFace.textEmbeddingModel',
      sdk.textEmbeddingModel.bind(sdk),
    ),
  });
export type HuggingFaceProvider = ReturnType<typeof wrapProvider>;
export const createHuggingFace = (
  ...args: Parameters<typeof sdkCreateHuggingFace>
) =>
  runSync('createHuggingFace', () =>
    wrapProvider(sdkCreateHuggingFace(...args)),
  );
export const huggingFace: HuggingFaceProvider = wrapProvider(sdkHuggingFace);
export const huggingface: HuggingFaceProvider = huggingFace;
