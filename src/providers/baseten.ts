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

/**
 * Adapt language, embedding, and decision model selection from the Baseten SDK to Effect.
 */
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
/** Provider returned by the adapter, with Effect-based model selection for Baseten. */
export type BasetenProvider = ReturnType<typeof wrapProvider>;
/**
 * Read the constructor contract from the SDK injection point so upstream argument changes
 * reach the adapter.
 */
type NativePerformanceClientConstructor = NonNullable<
  SdkSettings['performanceClient']
>;
/**
 * Use the installed performance client as the source of the native embedding argument and
 * result types.
 */
type NativePerformanceClient = InstanceType<NativePerformanceClientConstructor>;

/**
 * Implement this client to supply Baseten performance embeddings through Effects owned by
 * the provider scope.
 */
export interface BasetenPerformanceClient<E = never, R = never> {
  /**
   * Run when the SDK asks for performance embeddings. Keep the native request and response
   * shapes.
   */
  embed(
    ...args: Parameters<NativePerformanceClient['embed']>
  ): Effect.Effect<Awaited<ReturnType<NativePerformanceClient['embed']>>, E, R>;
}

/**
 * Keep SDK constructor arguments identical when supplying an Effect-based performance
 * client.
 */
export type BasetenPerformanceClientConstructor<E = never, R = never> = new (
  ...args: ConstructorParameters<NativePerformanceClientConstructor>
) => BasetenPerformanceClient<E, R>;

/**
 * Substitute the client implementation while retaining the SDK settings and their optional
 * fields.
 */
type Settings<Base, Client> = {
  [Key in keyof Base]: Key extends 'performanceClient' ? Client : Base[Key];
};

/** Use for plain SDK options with a static key and no custom performance client. */
type PlainBasetenSettings = Settings<
  StaticProviderSettings<SdkSettings, 'apiKey'>,
  never
>;

/**
 * Allow the key and a custom performance client to use Effect. Keep their provider scope
 * open for use.
 */
export type BasetenProviderSettings<E = never, R = never> = Settings<
  EffectProviderSettings<SdkSettings, 'apiKey', E, R>,
  BasetenPerformanceClientConstructor<E, R>
>;

/**
 * Construct the native Baseten client after the caller has bound the SDK-facing settings.
 */
const buildBaseten = (settings?: SdkSettings) =>
  wrapProvider(sdkCreateBaseten(settings));

/**
 * Expose a scope-free overload for static settings and a scoped overload for Effect-backed
 * options.
 */
interface CreateBaseten {
  (options?: PlainBasetenSettings): Effect.Effect<BasetenProvider, AiSdkError>;
  <E, R>(
    options: BasetenProviderSettings<E, R>,
  ): Effect.Effect<BasetenProvider, AiSdkError, R | Scope.Scope>;
}

/**
 * Bind the custom embedding client to the provider scope before injecting its native
 * Promise bridge.
 */
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

/**
 * Build an Effect-based provider with optional custom performance embeddings. Provide a
 * scope for Effect-backed settings.
 */
export const createBaseten = createBasetenScoped as CreateBaseten;

/**
 * Adapt the preconfigured provider from the Baseten SDK. Use the factory to supply
 * explicit settings.
 */
export const baseten: BasetenProvider = wrapProvider(sdkBaseten);
