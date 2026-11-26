import { wrapProviderTools } from '../internal/provider-tool.js';
import { createOpenResponses as sdkCreateOpenResponses } from '@ai-sdk/open-responses';
import type { OpenResponsesProvider as SdkProvider } from '@ai-sdk/open-responses';
import { adaptMethod, wrapProviderBase } from '../internal/provider-adapter.js';
import { wrapLanguageModel } from '../internal/language-model.js';
import { Effect } from 'effect';
import type { Scope } from 'effect';
import { openOperation } from '../internal/operation.js';
import type { AiSdkError } from '../internal/operation.js';
import { createWithProviderSettings } from '../internal/provider-settings.js';
import type {
  EffectProviderSettings,
  StaticProviderSettings,
} from '../internal/provider-settings.js';
import type {
  Experimental_OpenResponsesBareExtension as SdkBareExtension,
  Experimental_OpenResponsesExtension as SdkExtension,
  OpenResponsesProviderSettings as SdkSettings,
} from '@ai-sdk/open-responses';

export { VERSION } from '@ai-sdk/open-responses';
export type {
  Experimental_OpenResponsesExtensionContentPart,
  Experimental_OpenResponsesExtensionEvent,
  Experimental_OpenResponsesExtensionInputPart,
  Experimental_OpenResponsesExtensionItem,
  Experimental_OpenResponsesExtensionRecord,
  Experimental_OpenResponsesExtensionStreamPart,
  Experimental_OpenResponsesNamespacedType,
  OpenResponsesCustomToolOptions,
  OpenResponsesLanguageModelOptions,
  OpenResponsesOptions,
} from '@ai-sdk/open-responses';

/** Adapt language model selection from the Open Responses SDK to Effect. */
const wrapProvider = (sdk: SdkProvider) =>
  Object.assign(adaptMethod('openResponses', sdk, wrapLanguageModel), {
    ...wrapProviderBase('openResponses', sdk),
    tools: wrapProviderTools('openResponses.tools', sdk.tools),
  });
/**
 * Provider returned by the adapter, with Effect-based model selection for Open Responses.
 */
export type OpenResponsesProvider = ReturnType<typeof wrapProvider>;

/**
 * Reserve `apiKey` and `headers` for settings the SDK may read through lazy Effect
 * resolvers.
 */
type ResolverKey = 'apiKey' | 'headers';
/** Identify the SDK extension hooks that must cross the Effect callback bridge. */
const extensionCallbacks = [
  'encodeTool',
  'encodeToolChoice',
  'decodeItem',
  'encodeInputItem',
  'decodeEvent',
] as const;

/**
 * Preserve native callback arguments and result shape while replacing its return with a
 * typed Effect.
 */
type EffectCallback<C, E, R> = C extends (...args: infer Args) => infer A
  ? (...args: Args) => Effect.Effect<Awaited<A>, E, R>
  : C;

/**
 * Lift the selected callbacks into Effect and retain the SDK fields used to describe an
 * extension.
 */
type Extension<Native, E, R> = {
  [Key in keyof Native]: Key extends (typeof extensionCallbacks)[number]
    ? EffectCallback<Native[Key], E, R>
    : Native[Key];
};

/** Provide bare SDK extension metadata with Effect callbacks for its configured hooks. */
export type Experimental_OpenResponsesBareExtension<
  E = never,
  R = never,
> = Extension<SdkBareExtension, E, R>;
/**
 * Provide a native Open Responses extension with Effect callbacks for encoding and
 * decoding.
 */
export type Experimental_OpenResponsesExtension<
  E = never,
  R = never,
> = Extension<SdkExtension, E, R>;

/**
 * Derive the required error metadata hook from the SDK so native signature changes
 * propagate.
 */
type MetadataHook = NonNullable<SdkSettings['getResponseErrorMetadata']>;
/**
 * Preserve the synchronous SDK error metadata contract alongside the effectful failure
 * handler.
 */
type ResponseErrorMetadata = (
  ...args: Parameters<MetadataHook>
) => ReturnType<MetadataHook>;

/**
 * Substitute the callback and extension contracts while preserving the rest of the native
 * settings.
 */
type Settings<Base, Handler, Extensions> = {
  [Key in keyof Base]: Key extends 'failedResponseHandler'
    ? Handler
    : Key extends 'experimental_extensions'
      ? Extensions
      : Key extends 'getResponseErrorMetadata'
        ? ResponseErrorMetadata
        : Base[Key];
};

/**
 * Keep the native Open Responses options and allow the SDK to obtain `apiKey` and
 * `headers` through Effect resolvers.
 */
export type OpenResponsesProviderSettings<E = never, R = never> = Settings<
  EffectProviderSettings<SdkSettings, ResolverKey, E, R>,
  EffectCallback<NonNullable<SdkSettings['failedResponseHandler']>, E, R>,
  ReadonlyArray<
    | Experimental_OpenResponsesExtension<E, R>
    | Experimental_OpenResponsesBareExtension<E, R>
  >
>;

/**
 * Use for providers with native settings and no scoped handler or extension callbacks.
 */
type StaticSettings = Settings<
  StaticProviderSettings<SdkSettings, ResolverKey>,
  never,
  never
>;

/**
 * Collect the translated SDK callbacks that can replace the Effect versions at
 * construction.
 */
type NativeCallbacks = Pick<
  SdkSettings,
  'failedResponseHandler' | 'experimental_extensions'
>;

/**
 * Construct the native Open Responses provider after the caller translates callback
 * settings.
 */
const build = (settings?: SdkSettings) =>
  wrapProvider(sdkCreateOpenResponses(settings as SdkSettings));

/**
 * Run failure and extension callbacks within the owning scope while preserving the
 * extension receiver.
 */
const bindCallbacks = <E, R>(
  options: OpenResponsesProviderSettings<E, R>,
  owner: Effect.Success<ReturnType<typeof openOperation<R>>>,
): NativeCallbacks => {
  const { failedResponseHandler, experimental_extensions: extensions } =
    options;
  const bound = {
    ...(failedResponseHandler && {
      failedResponseHandler: (
        ...args: Parameters<typeof failedResponseHandler>
      ) =>
        owner.runCallback(Effect.suspend(() => failedResponseHandler(...args))),
    }),
    ...(extensions && {
      experimental_extensions: extensions.map((extension) => {
        const callbacks = extensionCallbacks.flatMap((key) => {
          const callback = extension[key];
          return callback
            ? [
                [
                  key,
                  (input: Parameters<typeof callback>[0]) =>
                    owner.runCallback(
                      Effect.suspend(() =>
                        (
                          callback as (
                            input: unknown,
                          ) => Effect.Effect<unknown, E, R>
                        ).call(extension, input),
                      ),
                    ),
                ],
              ]
            : [];
        });
        return Object.assign({}, extension, Object.fromEntries(callbacks));
      }),
    }),
  };
  return bound as NativeCallbacks;
};

/**
 * Keep static setup scope-free and require a scope when hooks or settings use an Effect
 * environment.
 */
interface CreateOpenResponses {
  (options: StaticSettings): Effect.Effect<OpenResponsesProvider, AiSdkError>;
  <E, R>(
    options: OpenResponsesProviderSettings<E, R>,
  ): Effect.Effect<OpenResponsesProvider, AiSdkError, R | Scope.Scope>;
}

/**
 * Bind effectful handlers and extension callbacks before passing native settings to the
 * provider constructor.
 */
function createOpenResponsesScoped<E, R>(
  options: OpenResponsesProviderSettings<E, R>,
): Effect.Effect<OpenResponsesProvider, AiSdkError, R | Scope.Scope> {
  if (!options.failedResponseHandler && !options.experimental_extensions)
    return createWithProviderSettings<SdkSettings, R, OpenResponsesProvider>(
      'createOpenResponses',
      options,
      ['apiKey', 'headers'],
      build,
    );

  return Effect.gen(function* () {
    const owner = yield* openOperation<R>();
    const native = { ...options, ...bindCallbacks(options, owner) };
    return yield* createWithProviderSettings<
      SdkSettings,
      R,
      OpenResponsesProvider
    >('createOpenResponses', native, ['apiKey', 'headers'], build);
  });
}

/**
 * Construct the Open Responses provider lazily. Keep the scope open when using effectful
 * settings or extensions.
 */
export const createOpenResponses =
  createOpenResponsesScoped as CreateOpenResponses;
