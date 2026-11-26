import * as sdk from 'ai';
import type {
  Experimental_VideoModelV3,
  Experimental_VideoModelV4,
  ProviderV4,
} from '@ai-sdk/provider';
import { Effect, HashMap, Option } from 'effect';
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
import {
  applyProviderMiddleware,
  isLegacyProviderV3,
  isProviderFacade,
  type LegacyProvider,
  type ProviderFacade,
  rememberProviderFacade,
  wrapLegacyProvider,
} from './internal/legacy-provider.js';
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
import type { ProviderV2, ProviderV3 } from './protocols/provider.js';

/** Recognize a version 4 Effect provider by its model lookup contract and protocol discriminator. */
type RegisteredProvider = {
  readonly specificationVersion: 'v4';
  readonly languageModel: (
    ...args: never[]
  ) => Effect.Effect<unknown, AiSdkError, unknown>;
};
/** Accept registered Effect providers and native version 3 providers at the registry boundary. */
type RegistryProvider = RegisteredProvider | ProviderV3<unknown>;
/** Map lookup prefixes to providers without changing upstream model IDs. */
type ProviderMap = Readonly<Record<string, RegistryProvider>>;
/** Describe the model and resource capabilities shared by the provider adapters. */
type ProviderHandle = ReturnType<typeof wrapProviderBase>;
/** Identify the baseline operations for which a legacy provider can require services. */
type LegacyMethods = keyof ProviderV2<unknown> | keyof ProviderV3<unknown>;
/** Include additional model operations when inferring service dependencies for a registry. */
type RegistryMethods =
  'videoModel' | 'decisionModel' | 'evaluationModel' | 'extractionModel';
/** Infer services required by legacy provider Effects without adding context to registered v4 providers. */
type ProviderServices<Provider, AdditionalMethods = never> = Provider extends {
  readonly specificationVersion: 'v4';
}
  ? never
  : {
      [
        Name in Extract<keyof Provider, LegacyMethods | AdditionalMethods>
      ]-?: NonNullable<Provider[Name]> extends (
        ...args: never[]
      ) => Effect.Effect<unknown, unknown, infer Services>
        ? Services
        : never;
    }[Extract<keyof Provider, LegacyMethods | AdditionalMethods>];
/** Collect service requirements from every registered provider's legacy operations. */
type RegistryServices<Providers extends ProviderMap> = ProviderServices<
  Providers[keyof Providers],
  RegistryMethods
>;
/** Require a scope only when the registry must bind a native legacy provider in the static overload. */
type LegacyRegistryScope<Providers extends ProviderMap> = [
  Extract<Providers[keyof Providers], ProviderV3<unknown>>,
] extends [never]
  ? never
  : Scope.Scope | RegistryServices<Providers>;

/** Carry the original provider, model ID, and protocol version through lookup and adaptation. */
type ResourceIdentity = {
  readonly specificationVersion: 'v2' | 'v3' | 'v4';
  readonly provider: string;
  readonly modelId: string;
};
/** Keep legacy video handles distinct so callers route them through their supported adapter. */
type LegacyVideo = ResourceIdentity & { readonly specificationVersion: 'v3' };
/** Accept a registry ID or a supported video handle in custom provider registration. */
type VideoModel = string | VideoModelV4 | LegacyVideo;

/** Resolve a registered native provider and fail before calling the SDK if the handle is unknown. */
const requireProvider = (provider: RegisteredProvider, operation: string) =>
  Effect.suspend(() => {
    const native = unwrapProvider(provider);
    return native
      ? Effect.succeed(native)
      : Effect.fail(
          sdkError(operation, 'The provider is not a registered handle.'),
        );
  });

/** Allow a custom provider to delegate capability lookup to a registered or legacy provider. */
type FallbackProvider = RegisteredProvider | LegacyProvider<unknown>;
/** Supply local aliases by capability plus an optional fallback and registered file or skill handles. */
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
  readonly fallbackProvider?: FallbackProvider;
  readonly files?: FilesV4Handle;
  readonly skills?: SkillsV4Handle;
};

/** Infer known IDs from the local model map while leaving omitted capabilities open to string IDs. */
type ModelIdentifiers<Options, Key> = Key extends keyof Options
  ? Extract<keyof NonNullable<Options[Key]>, string>
  : string;
/** Keep the decision lookup compatible with the older evaluation alias map. */
type DecisionIdentifiers<Options> = 'decisionModels' extends keyof Options
  ? ModelIdentifiers<Options, 'decisionModels'>
  : ModelIdentifiers<Options, 'evaluationModels'>;
/** Defer a lookup and expose SDK lookup failures on the Effect error channel. */
type ModelCall<Id, Model> = (modelId: Id) => Effect.Effect<Model, AiSdkError>;
/** Keep literal ID suggestions while also accepting arbitrary fallback IDs. */
type CustomModelCall<Id, Model> = ModelCall<string, Model> &
  ModelCall<Id, Model>;
/** Extract the legacy fallback so its services and lifecycle can be inferred. */
type Fallback<Options> = Options extends {
  readonly fallbackProvider?: infer Provider;
}
  ? Extract<Provider, LegacyProvider<unknown>>
  : never;
/** Attach a scope and native service requirements only when a legacy fallback needs them. */
type CustomProviderScope<Options> = [Fallback<Options>] extends [never]
  ? never
  : Scope.Scope | ProviderServices<Fallback<Options>, RegistryMethods>;
/** Request a resource handle lazily through the provider's Effect API. */
type ResourceCall<Value> = () => Effect.Effect<Value, AiSdkError>;
/** Require an accessor only when a direct resource or definite fallback resource is present. */
type CustomApi<
  Options,
  Key extends 'files' | 'skills',
  Value,
> = Options extends
  | Readonly<Record<Key, Value>>
  | { readonly fallbackProvider: Readonly<Record<Key, ResourceCall<Value>>> }
  ? Readonly<Record<Key, ResourceCall<Value>>>
  : Readonly<Partial<Record<Key, ResourceCall<Value>>>>;

/** Expose typed model lookups and preserve the optional resource capabilities of the configured providers. */
type CustomProvider<Options> = {
  readonly specificationVersion: 'v4';
  readonly languageModel: CustomModelCall<
    ModelIdentifiers<Options, 'languageModels'>,
    ReturnType<typeof wrapLanguageModel>
  >;
  readonly embeddingModel: CustomModelCall<
    ModelIdentifiers<Options, 'embeddingModels'>,
    ReturnType<typeof wrapEmbeddingModel>
  >;
  readonly imageModel: CustomModelCall<
    ModelIdentifiers<Options, 'imageModels'>,
    ReturnType<typeof wrapImageModel>
  >;
  readonly transcriptionModel: CustomModelCall<
    ModelIdentifiers<Options, 'transcriptionModels'>,
    ReturnType<typeof wrapTranscriptionModel>
  >;
  readonly speechModel: CustomModelCall<
    ModelIdentifiers<Options, 'speechModels'>,
    ReturnType<typeof wrapSpeechModel>
  >;
  readonly rerankingModel: CustomModelCall<
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
} & CustomApi<Options, 'files', FilesV4Handle> &
  CustomApi<Options, 'skills', SkillsV4Handle>;

/** Recover the SDK model according to its protocol version before custom provider registration. */
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

/** Resolve each provided alias to a native model and omit unconfigured capability maps. */
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

/** Unwrap an optional resource and reject a supplied handle that has no registered native value. */
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

/** Adapt the SDK custom provider to return Effect handles on matching capability lookups. */
const wrapCustomProvider = <Options extends CustomProviderOptions>(
  native: ReturnType<typeof sdk.customProvider>,
): CustomProvider<Options> => {
  const { files, skills, ...provider } = wrapProviderBase(
    'customProvider',
    native,
  );
  return {
    ...provider,
    ...(files ? { files } : {}),
    ...(skills ? { skills } : {}),
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
  } as unknown as CustomProvider<Options>;
};

/** Identify the maps whose local entries take priority over fallback model selection. */
type UserModels = Pick<
  CustomProviderOptions,
  | 'languageModels'
  | 'embeddingModels'
  | 'imageModels'
  | 'transcriptionModels'
  | 'speechModels'
  | 'rerankingModels'
  | 'videoModels'
  | 'decisionModels'
  | 'extractionModels'
>;

/** Prefer explicitly configured models and delegate absent capability lookups to the fallback. */
const withFallback = (
  provider: CustomProvider<CustomProviderOptions>,
  fallback: ProviderFacade,
  models: {
    readonly [Key in keyof UserModels]: Readonly<Record<string, unknown>>;
  },
) => {
  const select =
    <Model>(
      local: Readonly<Record<string, unknown>> | undefined,
      own: ModelCall<string, Model>,
      other?: ModelCall<string, Model>,
    ): ModelCall<string, Model> =>
    (id) =>
      Effect.suspend(() =>
        other && !(local && Object.hasOwn(local, id)) ? other(id) : own(id),
      );

  const files = provider.files ?? fallback.files;
  const skills = provider.skills ?? fallback.skills;
  return rememberProviderFacade({
    ...provider,
    languageModel: select(
      models.languageModels,
      provider.languageModel,
      fallback.languageModel,
    ),
    embeddingModel: select(
      models.embeddingModels,
      provider.embeddingModel,
      fallback.embeddingModel,
    ),
    imageModel: select(
      models.imageModels,
      provider.imageModel,
      fallback.imageModel,
    ),
    transcriptionModel: select(
      models.transcriptionModels,
      provider.transcriptionModel,
      fallback.transcriptionModel,
    ),
    speechModel: select(
      models.speechModels,
      provider.speechModel,
      fallback.speechModel,
    ),
    rerankingModel: select(
      models.rerankingModels,
      provider.rerankingModel,
      fallback.rerankingModel,
    ),
    videoModel: select(
      models.videoModels,
      provider.videoModel,
      fallback.videoModel,
    ),
    decisionModel: select(
      models.decisionModels,
      provider.decisionModel,
      fallback.decisionModel,
    ),
    evaluationModel: select(
      models.decisionModels,
      provider.evaluationModel,
      fallback.evaluationModel,
    ),
    extractionModel: select(
      models.extractionModels,
      provider.extractionModel,
      fallback.extractionModel,
    ),
    ...(files ? { files } : {}),
    ...(skills ? { skills } : {}),
  });
};

/** Resolve native models and resources before constructing the local provider and optional fallback facade. */
const makeCustomProvider = <const Options extends CustomProviderOptions>(
  options: Options,
): Effect.Effect<
  CustomProvider<Options>,
  AiSdkError,
  Scope.Scope | ProviderServices<Fallback<Options>, RegistryMethods>
> =>
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
    let facade: ProviderFacade | undefined;
    let fallbackProvider: ProviderV4 | undefined;
    const configured = options.fallbackProvider;
    if (configured) {
      if (isProviderFacade(configured)) {
        facade = configured;
      } else if (
        !('specificationVersion' in configured) ||
        configured.specificationVersion === 'v3'
      ) {
        type Services = ProviderServices<Fallback<Options>, RegistryMethods>;
        const owner = yield* openOperation<Services>();
        facade = yield* runSync('customProvider', () =>
          wrapLegacyProvider(
            configured as LegacyProvider<Services>,
            owner,
            true,
          ),
        );
      } else {
        fallbackProvider = yield* requireProvider(configured, 'customProvider');
      }
    }

    const models = {
      languageModels,
      embeddingModels,
      imageModels,
      transcriptionModels,
      speechModels,
      rerankingModels,
      videoModels,
      extractionModels,
    };
    return yield* runSync('customProvider', () => {
      const provider = wrapCustomProvider<CustomProviderOptions>(
        sdk.customProvider({
          ...models,
          ...(options.decisionModels ? { decisionModels } : {}),
          ...(options.evaluationModels ? { evaluationModels } : {}),
          ...(files ? { files } : {}),
          ...(skills ? { skills } : {}),
          ...(fallbackProvider ? { fallbackProvider } : {}),
        }),
      );
      return (facade
        ? withFallback(provider, facade, {
            ...models,
            decisionModels: options.decisionModels
              ? decisionModels
              : evaluationModels,
          })
        : provider) as unknown as CustomProvider<Options>;
    });
  });

/** Infer configured model IDs and legacy fallback requirements when constructing a provider. */
interface CustomProviderFactory {
  <const Options extends CustomProviderOptions>(
    options: Options,
  ): Effect.Effect<
    CustomProvider<Options>,
    AiSdkError,
    CustomProviderScope<Options>
  >;
}
/** Register local model aliases and use an optional provider for unresolved IDs. */
export const customProvider = makeCustomProvider as CustomProviderFactory;

/** Limit registry prefixes and resource provider names to configured string keys. */
type Names<Providers> = Extract<keyof Providers, string>;
/** Keep declared model ID literals for suggestion without treating `string` as a literal. */
type LiteralModelId<Id> = Id extends string
  ? string extends Id
    ? never
    : Id
  : never;
/** Read a provider method's model ID from its first argument. */
type ModelArgument<Provider, Method> = Method extends keyof Provider
  ? NonNullable<Provider[Method]> extends (...args: infer Args) => unknown
    ? LiteralModelId<Args[0]>
    : never
  : never;

/** Suggest configured fully qualified IDs and retain SDK lookup for arbitrary string input. */
interface RegistrySelector<Providers, Separator extends string, Method, Model> {
  <Name extends Names<Providers>>(
    id: `${Name}${Separator}${ModelArgument<Providers[Name], Method>}`,
  ): Effect.Effect<Model, AiSdkError>;
  <Name extends Names<Providers>>(
    id: `${Name}${Separator}${string}`,
  ): Effect.Effect<Model, AiSdkError>;
}

/** Route model IDs by provider prefix and expose file or skill lookups by provider name. */
export interface ProviderRegistryProvider<
  Providers extends ProviderMap = ProviderMap,
  Separator extends string = ':',
> {
  /** Resolve a provider-qualified language model ID under the registry's separator rules. */
  readonly languageModel: RegistrySelector<
    Providers,
    Separator,
    'languageModel',
    ReturnType<typeof wrapLanguageModel>
  >;
  /** Resolve a provider-qualified embedding model ID before sending values to the model. */
  readonly embeddingModel: RegistrySelector<
    Providers,
    Separator,
    'embeddingModel',
    ReturnType<typeof wrapEmbeddingModel>
  >;
  /** Resolve a provider-qualified image model ID before image generation. */
  readonly imageModel: RegistrySelector<
    Providers,
    Separator,
    'imageModel',
    ReturnType<typeof wrapImageModel>
  >;
  /** Resolve a provider-qualified transcription model ID for an audio-to-text request. */
  readonly transcriptionModel: RegistrySelector<
    Providers,
    Separator,
    'transcriptionModel',
    ReturnType<typeof wrapTranscriptionModel>
  >;
  /** Resolve a provider-qualified speech model ID for synthesized audio. */
  readonly speechModel: RegistrySelector<
    Providers,
    Separator,
    'speechModel',
    ReturnType<typeof wrapSpeechModel>
  >;
  /** Resolve a provider-qualified reranking model ID for document scoring. */
  readonly rerankingModel: RegistrySelector<
    Providers,
    Separator,
    'rerankingModel',
    ReturnType<typeof wrapRerankingModel>
  >;
  /** Resolve a provider-qualified video model ID before starting generation. */
  readonly videoModel: RegistrySelector<
    Providers,
    Separator,
    'videoModel',
    ReturnType<typeof wrapVideoModel>
  >;
  /** Resolve the named provider's registered file API without a model ID. */
  readonly files: (
    provider: Names<Providers>,
  ) => Effect.Effect<FilesV4Handle, AiSdkError>;
  /** Resolve the named provider's registered skill API without a model ID. */
  readonly skills: (
    provider: Names<Providers>,
  ) => Effect.Effect<SkillsV4Handle, AiSdkError>;
}

/** Add decision model selection to the ordinary model and resource selectors. */
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

/** Expose the decision selector under the SDK's evaluation compatibility name. */
export type Experimental_EvaluationProviderRegistry<
  Providers extends ProviderMap = ProviderMap,
  Separator extends string = ':',
> = Experimental_DecisionProviderRegistry<Providers, Separator>;

/** Expose extraction selection alongside the decision and evaluation interfaces. */
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

/** Route a prefixed ID through its Effect facade and preserve native lookup errors for unmatched IDs. */
const registryRoutes =
  (facades: HashMap.HashMap<string, ProviderFacade>, separator: string) =>
  <Id extends string, A>(
    native: (id: Id) => Effect.Effect<A, AiSdkError>,
    select: (
      provider: ProviderFacade,
    ) => ((id: string) => Effect.Effect<A, AiSdkError>) | undefined,
  ) =>
  (id: Id): Effect.Effect<A, AiSdkError> =>
    Effect.suspend(() => {
      const split = id.indexOf(separator);
      if (split < 0) return native(id);
      const provider = Option.getOrUndefined(
        HashMap.get(facades, id.slice(0, split)),
      );
      const method = provider && select(provider);
      return method ? method(id.slice(split + separator.length)) : native(id);
    });

/** Wrap registry model lookups and route legacy capabilities through their own bound facade. */
const wrapRegistry = <Providers extends ProviderMap, Separator extends string>(
  native: ReturnType<
    typeof sdk.createProviderRegistry<Record<string, ProviderV4>, Separator>
  >,
  facades: HashMap.HashMap<string, ProviderFacade>,
  separator: string,
): Experimental_ExtractionProviderRegistry<Providers, Separator> => {
  const route = registryRoutes(facades, separator);
  const resource =
    <Id extends string, Model>(
      native: ModelCall<Id, Model>,
      select: (
        provider: ProviderFacade,
      ) => (() => Effect.Effect<Model, AiSdkError>) | undefined,
    ): ModelCall<Id, Model> =>
    (id) =>
      Effect.suspend(() => {
        const facade = Option.getOrUndefined(HashMap.get(facades, id));
        const read = facade && select(facade);
        return read ? read() : native(id);
      });
  return {
    languageModel: route(
      adaptMethod(
        'ProviderRegistry.languageModel',
        native.languageModel.bind(native),
        wrapLanguageModel,
      ),
      (provider) => provider.languageModel,
    ),
    embeddingModel: route(
      adaptMethod(
        'ProviderRegistry.embeddingModel',
        native.embeddingModel.bind(native),
        wrapEmbeddingModel,
      ),
      (provider) => provider.embeddingModel,
    ),
    imageModel: route(
      adaptMethod(
        'ProviderRegistry.imageModel',
        native.imageModel.bind(native),
        wrapImageModel,
      ),
      (provider) => provider.imageModel,
    ),
    transcriptionModel: route(
      adaptMethod(
        'ProviderRegistry.transcriptionModel',
        native.transcriptionModel.bind(native),
        wrapTranscriptionModel,
      ),
      (provider) => provider.transcriptionModel,
    ),
    speechModel: route(
      adaptMethod(
        'ProviderRegistry.speechModel',
        native.speechModel.bind(native),
        wrapSpeechModel,
      ),
      (provider) => provider.speechModel,
    ),
    rerankingModel: route(
      adaptMethod(
        'ProviderRegistry.rerankingModel',
        native.rerankingModel.bind(native),
        wrapRerankingModel,
      ),
      (provider) => provider.rerankingModel,
    ),
    videoModel: route(
      adaptMethod(
        'ProviderRegistry.videoModel',
        native.videoModel.bind(native),
        wrapVideoModel,
      ),
      (provider) => provider.videoModel,
    ),
    files: resource(
      adaptMethod(
        'ProviderRegistry.files',
        native.files.bind(native),
        wrapFiles,
      ),
      (provider) => provider.files,
    ),
    skills: resource(
      adaptMethod(
        'ProviderRegistry.skills',
        native.skills.bind(native),
        wrapSkills,
      ),
      (provider) => provider.skills,
    ),
    decisionModel: route(
      adaptMethod(
        'ProviderRegistry.decisionModel',
        native.decisionModel.bind(native),
        wrapDecisionModel,
      ),
      (provider) => provider.decisionModel,
    ),
    evaluationModel: route(
      adaptMethod(
        'ProviderRegistry.evaluationModel',
        native.evaluationModel.bind(native),
        wrapEvaluationModel,
      ),
      (provider) => provider.evaluationModel,
    ),
    extractionModel: route(
      adaptMethod(
        'ProviderRegistry.extractionModel',
        native.extractionModel.bind(native),
        wrapExtractionModel,
      ),
      (provider) => provider.extractionModel,
    ),
  };
};

/** Accept one or more middleware layers for language and image requests. */
type MiddlewareOptions<R> = {
  readonly languageModelMiddleware?:
    LanguageModelMiddleware<R> | LanguageModelMiddleware<R>[];
  readonly imageModelMiddleware?:
    ImageModelMiddleware<R> | ImageModelMiddleware<R>[];
};
/** Set the registry separator alongside any middleware that needs an operation owner. */
type RegistryOptions<R, Separator extends string> = MiddlewareOptions<R> & {
  readonly separator?: Separator;
};
/** Keep the static registry overload free of middleware-related scope requirements. */
type StaticRegistryOptions<Separator extends string> = {
  readonly separator?: Separator;
  readonly languageModelMiddleware?: never;
  readonly imageModelMiddleware?: never;
};

/** Apply the same native binding to a single middleware value or each value in an array. */
const bindMiddleware = <A, B>(
  values: A | A[] | undefined,
  bind: (value: A) => B,
) => (Array.isArray(values) ? values.map(bind) : values && bind(values));

/** Bind language and image middleware with the registry's owner before forwarding SDK options. */
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

/** Build a native registry and retain Effect owners for legacy providers and supplied middleware. */
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
  R | RegistryServices<Providers> | Scope.Scope
> =>
  Effect.gen(function* () {
    type Services = R | RegistryServices<Providers>;
    const supplied = Object.entries<RegistryProvider>(providers);
    const hasLegacy = supplied.some(([, provider]) =>
      isLegacyProviderV3(provider),
    );
    const middleware =
      options?.languageModelMiddleware || options?.imageModelMiddleware;
    const owner =
      (hasLegacy || middleware) && (yield* openOperation<Services>());
    const boundMiddleware =
      options && owner ? nativeMiddleware<Services>(options, owner) : {};
    let facades = HashMap.empty<string, ProviderFacade>();
    const entries = yield* Effect.forEach(supplied, ([name, provider]) => {
      if (
        (isLegacyProviderV3(provider) && owner) ||
        isProviderFacade(provider)
      ) {
        return runSync('createProviderRegistry', () => {
          const facade = isProviderFacade(provider)
            ? provider
            : wrapLegacyProvider(
                provider as ProviderV3<Services>,
                owner as Owner<Services>,
                true,
              );
          facades = HashMap.set(
            facades,
            name,
            applyProviderMiddleware(facade, boundMiddleware, true),
          );
          // Keep the legacy name in the SDK registry for its standard lookup errors.
          return [name, sdk.customProvider({})] as const;
        });
      }
      return requireProvider(
        provider as RegisteredProvider,
        'createProviderRegistry',
      ).pipe(Effect.map((native) => [name, native] as const));
    });
    const native = Object.fromEntries(entries);
    const base =
      options && 'separator' in options ? { separator: options.separator } : {};
    return yield* runSync('createProviderRegistry', () =>
      wrapRegistry<Providers, Separator>(
        sdk.createProviderRegistry<Record<string, ProviderV4>, Separator>(
          native,
          { ...base, ...boundMiddleware },
        ),
        facades,
        options?.separator ?? ':',
      ),
    );
  });

/** Select the registry overload that matches whether middleware and legacy providers need a scope. */
interface CreateProviderRegistry {
  <const Providers extends ProviderMap, const Separator extends string = ':'>(
    providers: Providers,
    options?: StaticRegistryOptions<Separator>,
  ): Effect.Effect<
    Experimental_ExtractionProviderRegistry<Providers, Separator>,
    AiSdkError,
    LegacyRegistryScope<Providers>
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
    R | RegistryServices<Providers> | Scope.Scope
  >;
}

/** Resolve qualified model IDs across named providers with optional lookup middleware. */
export const createProviderRegistry = createRegistry as CreateProviderRegistry;
/** Keep the original experimental spelling available for registry consumers. */
export const experimental_createProviderRegistry = createProviderRegistry;

/** Apply language model middleware to a provider using an Effect scope that owns its callbacks. */
export const wrapProvider = <
  R = never,
  const Provider extends RegisteredProvider | LegacyProvider<unknown> =
    RegisteredProvider,
>(
  options: MiddlewareOptions<R> & {
    readonly provider: Provider;
    readonly languageModelMiddleware:
      LanguageModelMiddleware<R> | LanguageModelMiddleware<R>[];
  },
): Effect.Effect<
  ProviderHandle,
  AiSdkError,
  R | ProviderServices<Provider> | Scope.Scope
> =>
  Effect.gen(function* () {
    type Services = R | ProviderServices<Provider>;
    const selected = options.provider;
    const owner = yield* openOperation<Services>();
    const middleware = nativeMiddleware<Services>(options, owner);
    const legacy =
      !('specificationVersion' in selected) ||
      selected.specificationVersion === 'v3';
    if (legacy || isProviderFacade(selected)) {
      return yield* runSync('wrapProvider', () =>
        applyProviderMiddleware(
          legacy
            ? wrapLegacyProvider(
                selected as LegacyProvider<Services>,
                owner,
                false,
              )
            : (selected as ProviderFacade),
          middleware,
          false,
        ),
      );
    }
    const provider = yield* requireProvider(
      selected as RegisteredProvider,
      'wrapProvider',
    );
    return yield* runSync('wrapProvider', () =>
      wrapProviderBase(
        'wrapProvider',
        sdk.wrapProvider({
          provider,
          ...middleware,
          languageModelMiddleware: middleware.languageModelMiddleware ?? [],
        }),
      ),
    );
  });
