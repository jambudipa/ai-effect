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

const wrapProvider = (sdk: SdkProvider) =>
  Object.assign(adaptMethod('openResponses', sdk, wrapLanguageModel), {
    ...wrapProviderBase('openResponses', sdk),
    tools: wrapProviderTools('openResponses.tools', sdk.tools),
  });
export type OpenResponsesProvider = ReturnType<typeof wrapProvider>;

type ResolverKey = 'apiKey' | 'headers';
const extensionCallbacks = [
  'encodeTool',
  'encodeToolChoice',
  'decodeItem',
  'encodeInputItem',
  'decodeEvent',
] as const;

type EffectCallback<C, E, R> = C extends (...args: infer Args) => infer A
  ? (...args: Args) => Effect.Effect<Awaited<A>, E, R>
  : C;

type Extension<Native, E, R> = {
  [Key in keyof Native]: Key extends (typeof extensionCallbacks)[number]
    ? EffectCallback<Native[Key], E, R>
    : Native[Key];
};

export type Experimental_OpenResponsesBareExtension<
  E = never,
  R = never,
> = Extension<SdkBareExtension, E, R>;
export type Experimental_OpenResponsesExtension<
  E = never,
  R = never,
> = Extension<SdkExtension, E, R>;

type MetadataHook = NonNullable<SdkSettings['getResponseErrorMetadata']>;
type ResponseErrorMetadata = (
  ...args: Parameters<MetadataHook>
) => ReturnType<MetadataHook>;

type Settings<Base, Handler, Extensions> = {
  [Key in keyof Base]: Key extends 'failedResponseHandler'
    ? Handler
    : Key extends 'experimental_extensions'
      ? Extensions
      : Key extends 'getResponseErrorMetadata'
        ? ResponseErrorMetadata
        : Base[Key];
};

export type OpenResponsesProviderSettings<E = never, R = never> = Settings<
  EffectProviderSettings<SdkSettings, ResolverKey, E, R>,
  EffectCallback<NonNullable<SdkSettings['failedResponseHandler']>, E, R>,
  ReadonlyArray<
    | Experimental_OpenResponsesExtension<E, R>
    | Experimental_OpenResponsesBareExtension<E, R>
  >
>;

type StaticSettings = Settings<
  StaticProviderSettings<SdkSettings, ResolverKey>,
  never,
  never
>;

type NativeCallbacks = Pick<
  SdkSettings,
  'failedResponseHandler' | 'experimental_extensions'
>;

const build = (settings?: SdkSettings) =>
  wrapProvider(sdkCreateOpenResponses(settings as SdkSettings));

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

interface CreateOpenResponses {
  (options: StaticSettings): Effect.Effect<OpenResponsesProvider, AiSdkError>;
  <E, R>(
    options: OpenResponsesProviderSettings<E, R>,
  ): Effect.Effect<OpenResponsesProvider, AiSdkError, R | Scope.Scope>;
}

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

export const createOpenResponses =
  createOpenResponsesScoped as CreateOpenResponses;
