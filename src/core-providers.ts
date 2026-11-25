import * as sdk from 'ai';
import type {
  Experimental_VideoModelV3,
  Experimental_VideoModelV4,
  ProviderV4,
} from '@ai-sdk/provider';
import { Effect } from 'effect';
import type { Scope } from 'effect';
import type { LanguageModel } from './core.js';
import type {
  EmbeddingModel,
  ImageModel,
  RerankingModel,
  SpeechModel,
  TranscriptionModel,
} from './core-models.js';
import type {
  Experimental_DecisionModel,
  Experimental_ExtractionModel,
} from './core-experimental.js';
import {
  bindImageMiddleware,
  bindLanguageMiddleware,
} from './core-middleware.js';
import type {
  ImageModelMiddleware,
  LanguageModelMiddleware,
} from './core-middleware.js';
import {
  unwrapLanguageModel,
  wrapLanguageModel,
} from './internal/language-model.js';
import { unwrapLegacyModel } from './internal/legacy-model.js';
import { openOperation, runSync, sdkError } from './internal/operation.js';
import type { AiSdkError } from './internal/operation.js';
import {
  adaptMethod,
  unwrapProvider,
  wrapProviderBase,
} from './internal/provider-adapter.js';
import {
  unwrapDecisionModel,
  unwrapEmbeddingModel,
  unwrapExtractionModel,
  unwrapImageModel,
  unwrapRerankingModel,
  unwrapSpeechModel,
  unwrapTranscriptionModel,
  unwrapVideoModel,
  wrapDecisionModel,
  wrapEmbeddingModel,
  wrapEvaluationModel,
  wrapExtractionModel,
  wrapImageModel,
  wrapRerankingModel,
  wrapSpeechModel,
  wrapTranscriptionModel,
  wrapVideoModel,
} from './internal/provider-model.js';
import type { VideoModelV4 } from './internal/provider-model.js';
import {
  unwrapFiles,
  unwrapSkills,
  wrapFiles,
  wrapSkills,
} from './internal/provider-resource.js';
import type {
  FilesV4Handle,
  SkillsV4Handle,
} from './internal/provider-resource.js';
import type { Owner } from './internal/experimental-callbacks.js';

type RegisteredProvider = {
  readonly specificationVersion: 'v4';
  readonly languageModel: (
    ...args: never[]
  ) => Effect.Effect<unknown, AiSdkError, unknown>;
};
type ProviderMap = Readonly<Record<string, RegisteredProvider>>;
type ProviderHandle = ReturnType<typeof wrapProviderBase>;

type ResourceIdentity = {
  readonly specificationVersion: 'v2' | 'v3' | 'v4';
  readonly provider: string;
  readonly modelId: string;
};
type LegacyVideo = ResourceIdentity & { readonly specificationVersion: 'v3' };
type VideoModel = string | VideoModelV4 | LegacyVideo;

const requireProvider = (provider: RegisteredProvider, operation: string) =>
  Effect.suspend(() => {
    const native = unwrapProvider(provider);
    return native
      ? Effect.succeed(native)
      : Effect.fail(
          sdkError(operation, 'The provider is not a registered handle.'),
        );
  });

type CustomProviderOptions = {
  readonly languageModels?: Readonly<Record<string, LanguageModel>>;
  readonly embeddingModels?: Readonly<Record<string, EmbeddingModel>>;
  readonly imageModels?: Readonly<Record<string, ImageModel>>;
  readonly transcriptionModels?: Readonly<Record<string, TranscriptionModel>>;
  readonly speechModels?: Readonly<Record<string, SpeechModel>>;
  readonly rerankingModels?: Readonly<Record<string, RerankingModel>>;
  readonly videoModels?: Readonly<Record<string, VideoModel>>;
  readonly decisionModels?: Readonly<
    Record<string, Experimental_DecisionModel>
  >;
  readonly evaluationModels?: Readonly<
    Record<string, Experimental_DecisionModel>
  >;
  readonly extractionModels?: Readonly<
    Record<string, Experimental_ExtractionModel>
  >;
  readonly fallbackProvider?: RegisteredProvider;
  readonly files?: FilesV4Handle;
  readonly skills?: SkillsV4Handle;
};

type ModelIdentifiers<Options, Key> = Key extends keyof Options
  ? Extract<keyof NonNullable<Options[Key]>, string>
  : string;
type DecisionIdentifiers<Options> = 'decisionModels' extends keyof Options
  ? ModelIdentifiers<Options, 'decisionModels'>
  : ModelIdentifiers<Options, 'evaluationModels'>;
type ModelCall<Id, Model> = (modelId: Id) => Effect.Effect<Model, AiSdkError>;
type CustomApi<Options, Key extends 'files' | 'skills', Value> =
  Options extends Record<Key, Value>
    ? () => Effect.Effect<Value, AiSdkError>
    : Options extends {
          readonly fallbackProvider: Record<
            Key,
            () => Effect.Effect<Value, AiSdkError>
          >;
        }
      ? () => Effect.Effect<Value, AiSdkError>
      : (() => Effect.Effect<Value, AiSdkError>) | undefined;

type CustomProvider<Options> = {
  readonly specificationVersion: 'v4';
  readonly languageModel: ModelCall<
    ModelIdentifiers<Options, 'languageModels'>,
    ReturnType<typeof wrapLanguageModel>
  >;
  readonly embeddingModel: ModelCall<
    ModelIdentifiers<Options, 'embeddingModels'>,
    ReturnType<typeof wrapEmbeddingModel>
  >;
  readonly imageModel: ModelCall<
    ModelIdentifiers<Options, 'imageModels'>,
    ReturnType<typeof wrapImageModel>
  >;
  readonly transcriptionModel: ModelCall<
    ModelIdentifiers<Options, 'transcriptionModels'>,
    ReturnType<typeof wrapTranscriptionModel>
  >;
  readonly speechModel: ModelCall<
    ModelIdentifiers<Options, 'speechModels'>,
    ReturnType<typeof wrapSpeechModel>
  >;
  readonly rerankingModel: ModelCall<
    ModelIdentifiers<Options, 'rerankingModels'>,
    ReturnType<typeof wrapRerankingModel>
  >;
  readonly videoModel: ModelCall<
    ModelIdentifiers<Options, 'videoModels'>,
    ReturnType<typeof wrapVideoModel>
  >;
  readonly decisionModel: ModelCall<
    DecisionIdentifiers<Options>,
    ReturnType<typeof wrapDecisionModel>
  >;
  readonly evaluationModel: ModelCall<
    DecisionIdentifiers<Options>,
    ReturnType<typeof wrapEvaluationModel>
  >;
  readonly extractionModel: ModelCall<
    ModelIdentifiers<Options, 'extractionModels'>,
    ReturnType<typeof wrapExtractionModel>
  >;
  readonly files: CustomApi<Options, 'files', FilesV4Handle>;
  readonly skills: CustomApi<Options, 'skills', SkillsV4Handle>;
};

const sdkModel = <
  Native extends ResourceIdentity,
  Handle extends ResourceIdentity,
>(
  model: Handle,
  unwrap: (
    model: Extract<Handle, { specificationVersion: 'v4' }>,
  ) => Native | undefined,
): Native | undefined =>
  model.specificationVersion === 'v4'
    ? unwrap(model as Extract<Handle, { specificationVersion: 'v4' }>)
    : unwrapLegacyModel<Native & { specificationVersion: 'v2' | 'v3' }>(
        model as Handle & { specificationVersion: 'v2' | 'v3' },
      );

const modelMap = <Handle extends ResourceIdentity, Native>(
  models: Readonly<Record<string, string | Handle>> | undefined,
  unwrap: (model: Handle) => Native | undefined,
) =>
  Effect.forEach(Object.entries(models ?? {}), ([key, handle]) => {
    const model = typeof handle === 'string' ? handle : unwrap(handle);
    return model
      ? Effect.succeed([key, model] as const)
      : Effect.fail(
          sdkError(
            'customProvider',
            'A supplied model is not a registered handle.',
          ),
        );
  }).pipe(Effect.map((entries) => Object.fromEntries(entries)));

const optionalResource = <Handle extends object, Native>(
  handle: Handle | undefined,
  unwrap: (value: Handle) => Native | undefined,
) =>
  Effect.suspend(() => {
    const native = handle && unwrap(handle);
    return !handle || native
      ? Effect.succeed(native)
      : Effect.fail(
          sdkError(
            'customProvider',
            'A supplied resource is not a registered handle.',
          ),
        );
  });

const wrapCustomProvider = <Options extends CustomProviderOptions>(
  native: ReturnType<typeof sdk.customProvider>,
): CustomProvider<Options> =>
  Object.assign(wrapProviderBase('customProvider', native), {
    videoModel: adaptMethod(
      'customProvider.videoModel',
      native.videoModel.bind(native),
      wrapVideoModel,
    ),
    decisionModel: adaptMethod(
      'customProvider.decisionModel',
      native.decisionModel.bind(native),
      wrapDecisionModel,
    ),
    evaluationModel: adaptMethod(
      'customProvider.evaluationModel',
      native.evaluationModel.bind(native),
      wrapEvaluationModel,
    ),
    extractionModel: adaptMethod(
      'customProvider.extractionModel',
      native.extractionModel.bind(native),
      wrapExtractionModel,
    ),
  }) as unknown as CustomProvider<Options>;

export const customProvider = <const Options extends CustomProviderOptions>(
  options: Options,
): Effect.Effect<CustomProvider<Options>, AiSdkError> =>
  Effect.gen(function* () {
    const languageModels = yield* modelMap<
      Exclude<LanguageModel, string>,
      Exclude<sdk.LanguageModel, string>
    >(options.languageModels, (model) =>
      sdkModel<
        Exclude<sdk.LanguageModel, string>,
        Exclude<LanguageModel, string>
      >(model, unwrapLanguageModel),
    );
    const embeddingModels = yield* modelMap(options.embeddingModels, (model) =>
      sdkModel<
        Exclude<sdk.EmbeddingModel, string>,
        Exclude<EmbeddingModel, string>
      >(model, unwrapEmbeddingModel),
    );
    const imageModels = yield* modelMap(options.imageModels, (model) =>
      sdkModel<Exclude<sdk.ImageModel, string>, Exclude<ImageModel, string>>(
        model,
        unwrapImageModel,
      ),
    );
    const transcriptionModels = yield* modelMap(
      options.transcriptionModels,
      (model) =>
        sdkModel<
          Exclude<sdk.TranscriptionModel, string>,
          Exclude<TranscriptionModel, string>
        >(model, unwrapTranscriptionModel),
    );
    const speechModels = yield* modelMap(options.speechModels, (model) =>
      sdkModel<Exclude<sdk.SpeechModel, string>, Exclude<SpeechModel, string>>(
        model,
        unwrapSpeechModel,
      ),
    );
    const rerankingModels = yield* modelMap(options.rerankingModels, (model) =>
      sdkModel<
        Exclude<sdk.RerankingModel, string>,
        Exclude<RerankingModel, string>
      >(model, unwrapRerankingModel),
    );
    const videoModels = yield* modelMap(options.videoModels, (model) =>
      sdkModel<
        Experimental_VideoModelV4 | Experimental_VideoModelV3,
        Exclude<VideoModel, string>
      >(model, unwrapVideoModel),
    );
    const decisionModels = yield* modelMap(
      options.decisionModels,
      unwrapDecisionModel,
    );
    const evaluationModels = yield* modelMap(
      options.evaluationModels,
      unwrapDecisionModel,
    );
    const extractionModels = yield* modelMap(
      options.extractionModels,
      unwrapExtractionModel,
    );
    const files = yield* optionalResource(options.files, unwrapFiles);
    const skills = yield* optionalResource(options.skills, unwrapSkills);
    const fallbackProvider =
      options.fallbackProvider &&
      (yield* requireProvider(options.fallbackProvider, 'customProvider'));

    return yield* runSync('customProvider', () =>
      wrapCustomProvider<Options>(
        sdk.customProvider({
          languageModels,
          embeddingModels,
          imageModels,
          transcriptionModels,
          speechModels,
          rerankingModels,
          videoModels,
          ...(options.decisionModels ? { decisionModels } : {}),
          ...(options.evaluationModels ? { evaluationModels } : {}),
          extractionModels,
          ...(files ? { files } : {}),
          ...(skills ? { skills } : {}),
          ...(fallbackProvider ? { fallbackProvider } : {}),
        }),
      ),
    );
  });

type Names<Providers> = Extract<keyof Providers, string>;
type LiteralModelId<Id> = Id extends string
  ? string extends Id
    ? never
    : Id
  : never;
type ModelArgument<Provider, Method> = Method extends keyof Provider
  ? NonNullable<Provider[Method]> extends (...args: infer Args) => unknown
    ? LiteralModelId<Args[0]>
    : never
  : never;

interface RegistrySelector<Providers, Separator extends string, Method, Model> {
  <Name extends Names<Providers>>(
    id: `${Name}${Separator}${ModelArgument<Providers[Name], Method>}`,
  ): Effect.Effect<Model, AiSdkError>;
  <Name extends Names<Providers>>(
    id: `${Name}${Separator}${string}`,
  ): Effect.Effect<Model, AiSdkError>;
}

export interface ProviderRegistryProvider<
  Providers extends ProviderMap = ProviderMap,
  Separator extends string = ':',
> {
  readonly languageModel: RegistrySelector<
    Providers,
    Separator,
    'languageModel',
    ReturnType<typeof wrapLanguageModel>
  >;
  readonly embeddingModel: RegistrySelector<
    Providers,
    Separator,
    'embeddingModel',
    ReturnType<typeof wrapEmbeddingModel>
  >;
  readonly imageModel: RegistrySelector<
    Providers,
    Separator,
    'imageModel',
    ReturnType<typeof wrapImageModel>
  >;
  readonly transcriptionModel: RegistrySelector<
    Providers,
    Separator,
    'transcriptionModel',
    ReturnType<typeof wrapTranscriptionModel>
  >;
  readonly speechModel: RegistrySelector<
    Providers,
    Separator,
    'speechModel',
    ReturnType<typeof wrapSpeechModel>
  >;
  readonly rerankingModel: RegistrySelector<
    Providers,
    Separator,
    'rerankingModel',
    ReturnType<typeof wrapRerankingModel>
  >;
  readonly videoModel: RegistrySelector<
    Providers,
    Separator,
    'videoModel',
    ReturnType<typeof wrapVideoModel>
  >;
  readonly files: (
    provider: Names<Providers>,
  ) => Effect.Effect<FilesV4Handle, AiSdkError>;
  readonly skills: (
    provider: Names<Providers>,
  ) => Effect.Effect<SkillsV4Handle, AiSdkError>;
}

export type Experimental_DecisionProviderRegistry<
  Providers extends ProviderMap = ProviderMap,
  Separator extends string = ':',
> = ProviderRegistryProvider<Providers, Separator> & {
  readonly decisionModel: RegistrySelector<
    Providers,
    Separator,
    'decisionModel',
    ReturnType<typeof wrapDecisionModel>
  >;
  readonly evaluationModel: RegistrySelector<
    Providers,
    Separator,
    'decisionModel',
    ReturnType<typeof wrapEvaluationModel>
  >;
};

export type Experimental_EvaluationProviderRegistry<
  Providers extends ProviderMap = ProviderMap,
  Separator extends string = ':',
> = Experimental_DecisionProviderRegistry<Providers, Separator>;

export type Experimental_ExtractionProviderRegistry<
  Providers extends ProviderMap = ProviderMap,
  Separator extends string = ':',
> = Experimental_DecisionProviderRegistry<Providers, Separator> & {
  readonly extractionModel: RegistrySelector<
    Providers,
    Separator,
    'extractionModel',
    ReturnType<typeof wrapExtractionModel>
  >;
};

const wrapRegistry = <Providers extends ProviderMap, Separator extends string>(
  native: ReturnType<
    typeof sdk.createProviderRegistry<Record<string, ProviderV4>, Separator>
  >,
): Experimental_ExtractionProviderRegistry<Providers, Separator> => ({
  languageModel: adaptMethod(
    'ProviderRegistry.languageModel',
    native.languageModel.bind(native),
    wrapLanguageModel,
  ),
  embeddingModel: adaptMethod(
    'ProviderRegistry.embeddingModel',
    native.embeddingModel.bind(native),
    wrapEmbeddingModel,
  ),
  imageModel: adaptMethod(
    'ProviderRegistry.imageModel',
    native.imageModel.bind(native),
    wrapImageModel,
  ),
  transcriptionModel: adaptMethod(
    'ProviderRegistry.transcriptionModel',
    native.transcriptionModel.bind(native),
    wrapTranscriptionModel,
  ),
  speechModel: adaptMethod(
    'ProviderRegistry.speechModel',
    native.speechModel.bind(native),
    wrapSpeechModel,
  ),
  rerankingModel: adaptMethod(
    'ProviderRegistry.rerankingModel',
    native.rerankingModel.bind(native),
    wrapRerankingModel,
  ),
  videoModel: adaptMethod(
    'ProviderRegistry.videoModel',
    native.videoModel.bind(native),
    wrapVideoModel,
  ),
  files: adaptMethod(
    'ProviderRegistry.files',
    native.files.bind(native),
    wrapFiles,
  ),
  skills: adaptMethod(
    'ProviderRegistry.skills',
    native.skills.bind(native),
    wrapSkills,
  ),
  decisionModel: adaptMethod(
    'ProviderRegistry.decisionModel',
    native.decisionModel.bind(native),
    wrapDecisionModel,
  ),
  evaluationModel: adaptMethod(
    'ProviderRegistry.evaluationModel',
    native.evaluationModel.bind(native),
    wrapEvaluationModel,
  ),
  extractionModel: adaptMethod(
    'ProviderRegistry.extractionModel',
    native.extractionModel.bind(native),
    wrapExtractionModel,
  ),
});

type MiddlewareOptions<R> = {
  readonly languageModelMiddleware?:
    LanguageModelMiddleware<R> | LanguageModelMiddleware<R>[];
  readonly imageModelMiddleware?:
    ImageModelMiddleware<R> | ImageModelMiddleware<R>[];
};
type RegistryOptions<R, Separator extends string> = MiddlewareOptions<R> & {
  readonly separator?: Separator;
};
type StaticRegistryOptions<Separator extends string> = {
  readonly separator?: Separator;
  readonly languageModelMiddleware?: never;
  readonly imageModelMiddleware?: never;
};

const bindMiddleware = <A, B>(
  values: A | A[] | undefined,
  bind: (value: A) => B,
) => (Array.isArray(values) ? values.map(bind) : values && bind(values));

const nativeMiddleware = <R>(
  options: MiddlewareOptions<R>,
  owner: Owner<R>,
) => {
  const languageModelMiddleware = bindMiddleware(
    options.languageModelMiddleware,
    (middleware) => bindLanguageMiddleware(middleware, owner),
  );
  const imageModelMiddleware = bindMiddleware(
    options.imageModelMiddleware,
    (middleware) => bindImageMiddleware(middleware, owner),
  );
  return {
    ...(languageModelMiddleware ? { languageModelMiddleware } : {}),
    ...(imageModelMiddleware ? { imageModelMiddleware } : {}),
  };
};

const createRegistry = <
  Providers extends ProviderMap,
  Separator extends string,
  R,
>(
  providers: Providers,
  options?: RegistryOptions<R, Separator>,
): Effect.Effect<
  Experimental_ExtractionProviderRegistry<Providers, Separator>,
  AiSdkError,
  R | Scope.Scope
> =>
  Effect.gen(function* () {
    const entries = yield* Effect.forEach(
      Object.entries(providers),
      ([name, provider]) =>
        requireProvider(provider, 'createProviderRegistry').pipe(
          Effect.map((native) => [name, native] as const),
        ),
    );
    const native = Object.fromEntries(entries);
    const base =
      options && 'separator' in options ? { separator: options.separator } : {};
    if (!options?.languageModelMiddleware && !options?.imageModelMiddleware)
      return yield* runSync('createProviderRegistry', () =>
        wrapRegistry<Providers, Separator>(
          sdk.createProviderRegistry<Record<string, ProviderV4>, Separator>(
            native,
            base,
          ),
        ),
      );

    const owner = yield* openOperation<R>();
    return yield* runSync('createProviderRegistry', () =>
      wrapRegistry<Providers, Separator>(
        sdk.createProviderRegistry<Record<string, ProviderV4>, Separator>(
          native,
          { ...base, ...nativeMiddleware(options, owner) },
        ),
      ),
    );
  });

interface CreateProviderRegistry {
  <const Providers extends ProviderMap, const Separator extends string = ':'>(
    providers: Providers,
    options?: StaticRegistryOptions<Separator>,
  ): Effect.Effect<
    Experimental_ExtractionProviderRegistry<Providers, Separator>,
    AiSdkError
  >;
  <
    const Providers extends ProviderMap,
    const Separator extends string = ':',
    R = never,
  >(
    providers: Providers,
    options: RegistryOptions<R, Separator>,
  ): Effect.Effect<
    Experimental_ExtractionProviderRegistry<Providers, Separator>,
    AiSdkError,
    R | Scope.Scope
  >;
}

export const createProviderRegistry = createRegistry as CreateProviderRegistry;
export const experimental_createProviderRegistry = createProviderRegistry;

export const wrapProvider = <R = never>(
  options: MiddlewareOptions<R> & {
    readonly provider: RegisteredProvider;
    readonly languageModelMiddleware:
      LanguageModelMiddleware<R> | LanguageModelMiddleware<R>[];
  },
): Effect.Effect<ProviderHandle, AiSdkError, R | Scope.Scope> =>
  Effect.gen(function* () {
    const provider = yield* requireProvider(options.provider, 'wrapProvider');
    const owner = yield* openOperation<R>();
    const imageModelMiddleware = bindMiddleware(
      options.imageModelMiddleware,
      (middleware) => bindImageMiddleware(middleware, owner),
    );
    const languageModelMiddleware = Array.isArray(
      options.languageModelMiddleware,
    )
      ? options.languageModelMiddleware.map((middleware) =>
          bindLanguageMiddleware(middleware, owner),
        )
      : bindLanguageMiddleware(options.languageModelMiddleware, owner);
    return yield* runSync('wrapProvider', () =>
      wrapProviderBase(
        'wrapProvider',
        sdk.wrapProvider({
          provider,
          languageModelMiddleware,
          ...(imageModelMiddleware ? { imageModelMiddleware } : {}),
        }),
      ),
    );
  });
