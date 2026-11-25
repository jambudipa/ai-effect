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

type Metadata = Awaited<ReturnType<NativeMetadataExtractor['extractMetadata']>>;
type StreamExtractor = ReturnType<
  NativeMetadataExtractor['createStreamExtractor']
>;

export interface MetadataExtractor<E = never, R = never> {
  readonly extractMetadata: (
    options: Parameters<NativeMetadataExtractor['extractMetadata']>[0],
  ) => Effect.Effect<Metadata, E, R>;
  readonly createStreamExtractor: () => {
    readonly processChunk: (
      ...args: Parameters<StreamExtractor['processChunk']>
    ) => void;
    readonly buildMetadata: () => ReturnType<StreamExtractor['buildMetadata']>;
  };
}

export interface ProviderErrorStructure<T> {
  readonly errorSchema: NativeProviderErrorStructure<T>['errorSchema'];
  readonly errorToMessage: (error: T) => string;
  readonly isRetryable?: (response: Response, error?: T) => boolean;
}

type SynchronousHook<F> = F extends (...args: infer Args) => infer A
  ? (...args: Args) => A
  : F;

type ErrorStructure<A> =
  A extends NativeProviderErrorStructure<infer Input>
    ? ProviderErrorStructure<Input>
    : A;

const resolverKeys = ['apiKey', 'headers', 'supportedUrls'] as const;
type ResolverKey<Native> = Extract<(typeof resolverKeys)[number], keyof Native>;

type Configuration<Base, Extractor> = {
  [Key in keyof Base]: Key extends 'metadataExtractor'
    ? Extractor
    : Key extends 'errorStructure'
      ? ErrorStructure<Base[Key]>
      : Key extends 'convertUsage' | 'transformRequestBody' | 'mapReasoning'
        ? SynchronousHook<Base[Key]>
        : Base[Key];
};

export type CompatibleSettings<Native, E, R> = Configuration<
  EffectProviderSettings<Native, ResolverKey<Native>, E, R>,
  MetadataExtractor<E, R>
>;

export type StaticCompatibleSettings<Native> = Configuration<
  StaticProviderSettings<Native, ResolverKey<Native>>,
  never
>;

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
