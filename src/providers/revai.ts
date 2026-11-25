import {
  createRevai as sdkCreateRevai,
  revai as sdkRevai,
} from '@ai-sdk/revai';
import type { RevaiProvider as SdkProvider } from '@ai-sdk/revai';
import {
  adaptMethod,
  adaptUnsupportedMethod,
  wrapLegacyTranscription,
  wrapProviderBase,
} from '../internal/provider-adapter.js';
import { wrapTranscriptionModel } from '../internal/provider-model.js';
import { runSync } from '../internal/operation.js';

export { VERSION } from '@ai-sdk/revai';
export type {
  RevaiProviderSettings,
  RevaiTranscriptionModelOptions,
} from '@ai-sdk/revai';

const wrapProvider = (sdk: SdkProvider) =>
  Object.assign(adaptMethod('revai', sdk, wrapLegacyTranscription), {
    ...wrapProviderBase('revai', sdk),
    transcription: adaptMethod(
      'revai.transcription',
      sdk.transcription.bind(sdk),
      wrapTranscriptionModel,
    ),
    textEmbeddingModel: adaptUnsupportedMethod(
      'revai.textEmbeddingModel',
      sdk.textEmbeddingModel.bind(sdk),
    ),
  });
export type RevaiProvider = ReturnType<typeof wrapProvider>;
export const createRevai = (...args: Parameters<typeof sdkCreateRevai>) =>
  runSync('createRevai', () => wrapProvider(sdkCreateRevai(...args)));
export const revai: RevaiProvider = wrapProvider(sdkRevai);
