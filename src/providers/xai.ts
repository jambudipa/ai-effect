import type { Experimental_XaiRealtimeModelConfig as SdkExperimental_XaiRealtimeModelConfig } from '@ai-sdk/xai';
import type { ProviderHostConfiguration } from '../internal/provider-host-configuration.js';
import type { AdaptedConstructor } from '../internal/provider-adapter.js';
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

/**
 * Adapt language, image, video, speech, and transcription model selection from the xAI SDK
 * to Effect.
 */
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
/** Provider returned by the adapter, with Effect-based model selection for xAI. */
export type XaiProvider = ReturnType<typeof wrapProvider>;
/** Reserve `apiKey` for settings the SDK may read through lazy Effect resolvers. */
type ResolverKey = 'apiKey';
/**
 * Keep the native xAI options and allow `apiKey` to resolve through Effect when the SDK
 * requests the value.
 */
export type XaiProviderSettings<E = never, R = never> = EffectProviderSettings<
  SdkSettings,
  ResolverKey,
  E,
  R
>;
/**
 * Construct the xAI provider inside an Effect. Keep the scope open when using an Effect
 * resolver for `apiKey`.
 */
export const createXai = adaptProviderFactory<
  SdkSettings,
  ResolverKey,
  XaiProvider
>('createXai', ['apiKey'], (settings) => wrapProvider(sdkCreateXai(settings)));
/**
 * Adapt the preconfigured provider from the xAI SDK. Use the factory to supply explicit
 * settings.
 */
export const xai: XaiProvider = wrapProvider(sdkXai);
/** Construct the SDK xAI realtime model lazily with its native options. */
export const Experimental_XaiRealtimeModel: AdaptedConstructor<
  typeof SdkExperimental_XaiRealtimeModel,
  Experimental_XaiRealtimeModel
> = adaptModelConstructor(
  'Experimental_XaiRealtimeModel',
  SdkExperimental_XaiRealtimeModel,
  wrapRealtimeModel,
);
/**
 * Effect model returned by `Experimental_XaiRealtimeModel`. Use its realtime connection
 * operations in an Effect program.
 */
export type Experimental_XaiRealtimeModel = ReturnType<
  typeof wrapRealtimeModel
>;
/**
 * Construct the xAI-hosted code execution descriptor for models that advertise tool
 * support.
 */
export const codeExecution = adaptProviderTool(
  'xai.codeExecution',
  sdkCodeExecution,
);
/** Construct the xAI-hosted image generation tool descriptor inside an Effect. */
export const imageGeneration = adaptProviderTool(
  'xai.imageGeneration',
  sdkImageGeneration,
);
/** Construct the xAI MCP server tool descriptor with native connection settings. */
export const mcpServer = adaptProviderTool('xai.mcpServer', sdkMcpServer);
/** Construct the native xAI image viewing descriptor for tool-enabled requests. */
export const viewImage = adaptProviderTool('xai.viewImage', sdkViewImage);
/** Construct the xAI descriptor that lets a tool-enabled model view video from X. */
export const viewXVideo = adaptProviderTool('xai.viewXVideo', sdkViewXVideo);
/** Construct the xAI web search tool descriptor for provider-executed lookups. */
export const webSearch = adaptProviderTool('xai.webSearch', sdkWebSearch);
/** Construct the xAI search descriptor for provider-executed lookups on X. */
export const xSearch = adaptProviderTool('xai.xSearch', sdkXSearch);
/**
 * Expose the xAI SDK tool collection with lazy Effect construction and typed failures.
 */
export const xaiTools = wrapProviderTools('xaiTools', sdkXaiTools);

/** Retain the xAI realtime model configuration fields accepted at the host boundary. */
export type Experimental_XaiRealtimeModelConfig =
  ProviderHostConfiguration<SdkExperimental_XaiRealtimeModelConfig>;
