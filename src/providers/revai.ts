import { adaptProviderFactory } from '../internal/provider-settings.js';
import type { EffectProviderSettings } from '../internal/provider-settings.js';
import type { RevaiProviderSettings as SdkSettings } from '@ai-sdk/revai';
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

export { VERSION } from '@ai-sdk/revai';
export type { RevaiTranscriptionModelOptions } from '@ai-sdk/revai';

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
type ResolverKey = 'apiKey';
export type RevaiProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, ResolverKey, E, R>;
export const createRevai = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  RevaiProvider
>('createRevai', ['apiKey'], (settings) =>
  wrapProvider(sdkCreateRevai(settings)),
);
export const revai: RevaiProvider = wrapProvider(sdkRevai);
