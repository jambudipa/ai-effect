import { adaptProviderFactory } from '../internal/provider-settings.js';
import type { EffectProviderSettings } from '../internal/provider-settings.js';
import type { XaiProviderSettings as SdkSettings } from '@ai-sdk/xai';
import { xaiTools as sdkXaiTools } from '@ai-sdk/xai';
import { xSearch as sdkXSearch } from '@ai-sdk/xai';
import { webSearch as sdkWebSearch } from '@ai-sdk/xai';
import { viewXVideo as sdkViewXVideo } from '@ai-sdk/xai';
import { viewImage as sdkViewImage } from '@ai-sdk/xai';
import { mcpServer as sdkMcpServer } from '@ai-sdk/xai';
import { imageGeneration as sdkImageGeneration } from '@ai-sdk/xai';
import { codeExecution as sdkCodeExecution } from '@ai-sdk/xai';
import {
  wrapRealtimeModel,
  wrapRealtimeFactory,
} from '../internal/provider-realtime.js';
import { Experimental_XaiRealtimeModel as SdkExperimental_XaiRealtimeModel } from '@ai-sdk/xai';
import {
  adaptProviderTool,
  wrapProviderTools,
} from '../internal/provider-tool.js';
import { createXai as sdkCreateXai, xai as sdkXai } from '@ai-sdk/xai';
import type { XaiProvider as SdkProvider } from '@ai-sdk/xai';
import {
  adaptMethod,
  adaptModelConstructor,
  adaptUnsupportedMethod,
  wrapProviderBase,
} from '../internal/provider-adapter.js';
import { wrapLanguageModel } from '../internal/language-model.js';
import { wrapBatch, wrapFiles } from '../internal/provider-resource.js';
import {
  wrapImageModel,
  wrapSpeechModel,
  wrapTranscriptionModel,
  wrapVideoModel,
} from '../internal/provider-model.js';

export { VERSION } from '@ai-sdk/xai';
export type {
  Experimental_XaiRealtimeModelConfig,
  XaiErrorData,
  XaiFilePartProviderOptions,
  XaiFilesOptions,
  XaiImageModelOptions,
  XaiImageProviderOptions,
  XaiLanguageModelResponsesOptions,
  XaiResponsesProviderOptions,
  XaiSpeechModelOptions,
  XaiTranscriptionModelId,
  XaiTranscriptionModelOptions,
  XaiVideoModelId,
  XaiVideoModelOptions,
  XaiVideoProviderOptions,
} from '@ai-sdk/xai';

const wrapProvider = (sdk: SdkProvider) =>
  Object.assign(adaptMethod('xai', sdk, wrapLanguageModel), {
    ...wrapProviderBase('xai', sdk),
    languageModel: adaptMethod(
      'xai.languageModel',
      sdk.languageModel.bind(sdk),
      wrapLanguageModel,
    ),
    responses: adaptMethod(
      'xai.responses',
      sdk.responses.bind(sdk),
      wrapLanguageModel,
    ),
    experimental_batch: adaptMethod(
      'xai.experimental_batch',
      sdk.experimental_batch.bind(sdk),
      wrapBatch,
    ),
    image: adaptMethod('xai.image', sdk.image.bind(sdk), wrapImageModel),
    imageModel: adaptMethod(
      'xai.imageModel',
      sdk.imageModel.bind(sdk),
      wrapImageModel,
    ),
    video: adaptMethod('xai.video', sdk.video.bind(sdk), wrapVideoModel),
    videoModel: adaptMethod(
      'xai.videoModel',
      sdk.videoModel.bind(sdk),
      wrapVideoModel,
    ),
    speech: adaptMethod('xai.speech', sdk.speech.bind(sdk), wrapSpeechModel),
    speechModel: adaptMethod(
      'xai.speechModel',
      sdk.speechModel.bind(sdk),
      wrapSpeechModel,
    ),
    transcription: adaptMethod(
      'xai.transcription',
      sdk.transcription.bind(sdk),
      wrapTranscriptionModel,
    ),
    transcriptionModel: adaptMethod(
      'xai.transcriptionModel',
      sdk.transcriptionModel.bind(sdk),
      wrapTranscriptionModel,
    ),
    files: adaptMethod('xai.files', sdk.files.bind(sdk), wrapFiles),
    textEmbeddingModel: adaptUnsupportedMethod(
      'xai.textEmbeddingModel',
      sdk.textEmbeddingModel.bind(sdk),
    ),
    experimental_realtime: wrapRealtimeFactory(
      'xai.experimental_realtime',
      sdk.experimental_realtime,
    ),
    tools: wrapProviderTools('xai.tools', sdk.tools),
  });
export type XaiProvider = ReturnType<typeof wrapProvider>;
type ResolverKey = 'apiKey';
export type XaiProviderSettings<E = never, R = never> = EffectProviderSettings<
  SdkSettings,
  ResolverKey,
  E,
  R
>;
export const createXai = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  XaiProvider
>('createXai', ['apiKey'], (settings) => wrapProvider(sdkCreateXai(settings)));
export const xai: XaiProvider = wrapProvider(sdkXai);
export const Experimental_XaiRealtimeModel = adaptModelConstructor(
  'Experimental_XaiRealtimeModel',
  SdkExperimental_XaiRealtimeModel,
  wrapRealtimeModel,
);
export type Experimental_XaiRealtimeModel = ReturnType<
  typeof wrapRealtimeModel
>;
export const codeExecution = adaptProviderTool(
  'xai.codeExecution',
  sdkCodeExecution,
);
export const imageGeneration = adaptProviderTool(
  'xai.imageGeneration',
  sdkImageGeneration,
);
export const mcpServer = adaptProviderTool('xai.mcpServer', sdkMcpServer);
export const viewImage = adaptProviderTool('xai.viewImage', sdkViewImage);
export const viewXVideo = adaptProviderTool('xai.viewXVideo', sdkViewXVideo);
export const webSearch = adaptProviderTool('xai.webSearch', sdkWebSearch);
export const xSearch = adaptProviderTool('xai.xSearch', sdkXSearch);
export const xaiTools = wrapProviderTools('xaiTools', sdkXaiTools);
