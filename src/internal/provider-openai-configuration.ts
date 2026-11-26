import type {
  MetadataExtractor as NativeMetadataExtractor,
  ProviderErrorStructure as NativeProviderErrorStructure,
} from '@ai-sdk/openai-compatible';
import { Effect } from 'effect';
import { openOperation } from './operation.js';
import { createWithProviderSettings } from './provider-settings.js';
import type {
  EffectProviderSettings,
  StaticProviderSettings,
} from './provider-settings.js';

/** Infer metadata from the resolved return of the native extraction callback. */
type Metadata = Awaited<ReturnType<NativeMetadataExtractor['extractMetadata']>>;
/** Keep the native streaming extractor protocol synchronized with the installed SDK. */
type StreamExtractor = ReturnType<
  NativeMetadataExtractor['createStreamExtractor']
>;

/** Allow whole-response metadata extraction to use Effect while keeping stream parsing synchronous. */
export interface MetadataExtractor<E = never, R = never> {
  /** Extract metadata in the provider scope using the SDK's native response inputs. */
  readonly extractMetadata: (
    options: Parameters<NativeMetadataExtractor['extractMetadata']>[0],
  ) => Effect.Effect<Metadata, E, R>;
  /** Create a fresh synchronous metadata accumulator for each native stream. */
  readonly createStreamExtractor: () => {
    readonly processChunk: (
      ...args: Parameters<StreamExtractor['processChunk']>
    ) => void;
    readonly buildMetadata: () => ReturnType<StreamExtractor['buildMetadata']>;
  };
}

/** Decode provider-specific failures and retain the SDK's synchronous handling hooks. */
export interface ProviderErrorStructure<T> {
  /** Decode untrusted response bodies before computing an error message or retry decision. */
  readonly errorSchema: NativeProviderErrorStructure<T>['errorSchema'];
  /** Render the message from a successfully decoded provider error payload. */
  readonly errorToMessage: (error: T) => string;
  /** Override retry classification using the HTTP response and any decoded provider error. */
  readonly isRetryable?: (response: Response, error?: T) => boolean;
}

/** Preserve a host callback's arguments and synchronous return contract. */
type SynchronousHook<F> = F extends (...args: infer Args) => infer A
  ? (...args: Args) => A
  : F;

/** Adapt the native error structure while retaining its decoded payload type. */
type ErrorStructure<A> =
  A extends NativeProviderErrorStructure<infer Input>
    ? ProviderErrorStructure<Input>
    : A;

/** Identify provider settings whose native resolvers can run a caller Effect. */
const resolverKeys = ['apiKey', 'headers', 'supportedUrls'] as const;
/** Restrict the configurable resolver fields to keys supported by the native model. */
type ResolverKey<Native> = Extract<(typeof resolverKeys)[number], keyof Native>;

/** Replace native metadata and error adapters, keeping other host settings in their existing shape. */
type Configuration<Base, Extractor> = {
  [Key in keyof Base]: Key extends 'metadataExtractor'
    ? Extractor
    : Key extends 'errorStructure'
      ? ErrorStructure<Base[Key]>
      : Key extends 'convertUsage' | 'transformRequestBody' | 'mapReasoning'
        ? SynchronousHook<Base[Key]>
        : Base[Key];
};

/** Allow scoped settings resolution and effectful whole-response metadata extraction. */
export type CompatibleSettings<Native, E, R> = Configuration<
  EffectProviderSettings<Native, ResolverKey<Native>, E, R>,
  MetadataExtractor<E, R>
>;

/** Describe synchronous model options that can be used without an Effect scope. */
export type StaticCompatibleSettings<Native> = Configuration<
  StaticProviderSettings<Native, ResolverKey<Native>>,
  never
>;

/** Bind whole-response metadata extraction and supported setting resolvers to the provider scope. */
export const buildWithCompatibleSettings = <Native extends object, R, A>(
  operation: string,
  options:
    | (object & { readonly metadataExtractor?: MetadataExtractor<unknown, R> })
    | undefined,
  create: (settings?: Native) => A,
) => {
  const extractor = options?.metadataExtractor;
  if (!extractor)
    return createWithProviderSettings<Native, R, A>(
      operation,
      options,
      resolverKeys,
      create,
    );

  return Effect.gen(function* () {
    const owner = yield* openOperation<R>();
    const metadataExtractor: NativeMetadataExtractor = {
      extractMetadata: (input) =>
        owner.runCallback(
          Effect.suspend(() => extractor.extractMetadata(input)),
        ),
      createStreamExtractor: () => extractor.createStreamExtractor(),
    };
    return yield* createWithProviderSettings<Native, R, A>(
      operation,
      { ...options, metadataExtractor },
      resolverKeys,
      create,
    );
  });
};

/** Select the constructor overload that matches the scope needed for configured callbacks. */
export interface CompatibleModelConstructor<
  Constructor extends new (...args: never[]) => unknown,
  Wrapper,
> {
  (
    modelId: ConstructorParameters<Constructor>[0],
    config: StaticCompatibleSettings<ConstructorParameters<Constructor>[1]>,
  ): Effect.Effect<Wrapper, import('./operation.js').AiSdkError>;
  <E, R>(
    modelId: ConstructorParameters<Constructor>[0],
    config: CompatibleSettings<ConstructorParameters<Constructor>[1], E, R>,
  ): Effect.Effect<
    Wrapper,
    import('./operation.js').AiSdkError,
    R | import('effect').Scope.Scope
  >;
}

/** Adapt native compatible model construction after translating settings and metadata hooks. */
export const adaptCompatibleModel = <Id, Config extends object, Model, Wrapper>(
  operation: string,
  Constructor: new (modelId: Id, config: Config) => Model,
  wrap: (model: Model) => Wrapper,
): CompatibleModelConstructor<typeof Constructor, Wrapper> => {
  const select = <E, R>(
    modelId: Id,
    config: CompatibleSettings<Config, E, R>,
  ) =>
    buildWithCompatibleSettings<Config, R, Wrapper>(
      operation,
      config,
      (settings) => wrap(new Constructor(modelId, settings as Config)),
    );
  return select as CompatibleModelConstructor<typeof Constructor, Wrapper>;
};
