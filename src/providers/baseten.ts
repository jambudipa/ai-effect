import { Effect } from 'effect';
import type { Scope } from 'effect';
import { openOperation } from '../internal/operation.js';
import type { AiSdkError } from '../internal/operation.js';
import { createWithProviderSettings } from '../internal/provider-settings.js';
import type {
  EffectProviderSettings,
  StaticProviderSettings,
} from '../internal/provider-settings.js';
import type { BasetenProviderSettings as SdkSettings } from '@ai-sdk/baseten';
import {
  createBaseten as sdkCreateBaseten,
  baseten as sdkBaseten,
} from '@ai-sdk/baseten';
import type { BasetenProvider as SdkProvider } from '@ai-sdk/baseten';
import { adaptMethod, wrapProviderBase } from '../internal/provider-adapter.js';
import { wrapLanguageModel } from '../internal/language-model.js';
import {
  wrapDecisionModel,
  wrapEmbeddingModel,
} from '../internal/provider-model.js';

export { VERSION } from '@ai-sdk/baseten';
export type {
  BasetenChatModelId,
  BasetenDecisionModelId,
  BasetenDecisionModelOptions,
  BasetenEmbeddingModelOptions,
  BasetenErrorData,
} from '@ai-sdk/baseten';

const wrapProvider = (sdk: SdkProvider) =>
  Object.assign(adaptMethod('baseten', sdk, wrapLanguageModel), {
    ...wrapProviderBase('baseten', sdk),
    chatModel: adaptMethod(
      'baseten.chatModel',
      sdk.chatModel.bind(sdk),
      wrapLanguageModel,
    ),
    languageModel: adaptMethod(
      'baseten.languageModel',
      sdk.languageModel.bind(sdk),
      wrapLanguageModel,
    ),
    embeddingModel: adaptMethod(
      'baseten.embeddingModel',
      sdk.embeddingModel.bind(sdk),
      wrapEmbeddingModel,
    ),
    textEmbeddingModel: adaptMethod(
      'baseten.textEmbeddingModel',
      sdk.textEmbeddingModel.bind(sdk),
      wrapEmbeddingModel,
    ),
    decisionModel: adaptMethod(
      'baseten.decisionModel',
      sdk.decisionModel.bind(sdk),
      wrapDecisionModel,
    ),
  });
export type BasetenProvider = ReturnType<typeof wrapProvider>;
type NativePerformanceClientConstructor = NonNullable<
  SdkSettings['performanceClient']
>;
type NativePerformanceClient = InstanceType<NativePerformanceClientConstructor>;

export interface BasetenPerformanceClient<E = never, R = never> {
  embed(
    ...args: Parameters<NativePerformanceClient['embed']>
  ): Effect.Effect<Awaited<ReturnType<NativePerformanceClient['embed']>>, E, R>;
}

export type BasetenPerformanceClientConstructor<E = never, R = never> = new (
  ...args: ConstructorParameters<NativePerformanceClientConstructor>
) => BasetenPerformanceClient<E, R>;

type Settings<Base, Client> = {
  [Key in keyof Base]: Key extends 'performanceClient' ? Client : Base[Key];
};

type PlainBasetenSettings = Settings<
  StaticProviderSettings<SdkSettings, 'apiKey'>,
  never
>;

export type BasetenProviderSettings<E = never, R = never> = Settings<
  EffectProviderSettings<SdkSettings, 'apiKey', E, R>,
  BasetenPerformanceClientConstructor<E, R>
>;

const buildBaseten = (settings?: SdkSettings) =>
  wrapProvider(sdkCreateBaseten(settings));

interface CreateBaseten {
  (options?: PlainBasetenSettings): Effect.Effect<BasetenProvider, AiSdkError>;
  <E, R>(
    options: BasetenProviderSettings<E, R>,
  ): Effect.Effect<BasetenProvider, AiSdkError, R | Scope.Scope>;
}

function createBasetenScoped<E, R>(
  options?: BasetenProviderSettings<E, R>,
): Effect.Effect<BasetenProvider, AiSdkError, R | Scope.Scope> {
  const Client = options?.performanceClient;
  if (!Client)
    return createWithProviderSettings<SdkSettings, R, BasetenProvider>(
      'createBaseten',
      options,
      ['apiKey'],
      buildBaseten,
    );

  const ScopedClient: BasetenPerformanceClientConstructor<E, R> = Client;
  return Effect.gen(function* () {
    const owner = yield* openOperation<R>();
    class NativeClient {
      readonly client: BasetenPerformanceClient<E, R>;

      constructor(...args: ConstructorParameters<typeof ScopedClient>) {
        this.client = new ScopedClient(...args);
      }

      embed(...args: Parameters<NativePerformanceClient['embed']>) {
        return owner.runCallback(
          Effect.suspend(() => this.client.embed(...args)),
        );
      }
    }
    return yield* createWithProviderSettings<SdkSettings, R, BasetenProvider>(
      'createBaseten',
      { ...options, performanceClient: NativeClient },
      ['apiKey'],
      buildBaseten,
    );
  });
}

export const createBaseten = createBasetenScoped as CreateBaseten;

export const baseten: BasetenProvider = wrapProvider(sdkBaseten);
