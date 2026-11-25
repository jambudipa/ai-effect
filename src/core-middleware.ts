import * as sdk from 'ai';
import type * as native from '@ai-sdk/provider';
import { Effect, Stream } from 'effect';
import {
  unwrapLanguageModel,
  wrapLanguageModel as adaptLanguageModel,
  type LanguageModelV4,
} from './internal/language-model.js';
import { unwrapLegacyModel } from './internal/legacy-model.js';
import {
  openOperation,
  runRequest,
  runSync,
  sdkError,
  type AiSdkError,
} from './internal/operation.js';
import {
  unwrapEmbeddingModel,
  unwrapImageModel,
  wrapEmbeddingModel as adaptEmbeddingModel,
  wrapImageModel as adaptImageModel,
  type EmbeddingModelV4,
  type ImageModelV4,
} from './internal/provider-model.js';
import type {
  EmbeddingModelV3,
  ImageModelV2,
  ImageModelV3,
  LanguageModelV2,
  LanguageModelV3,
} from './protocols/provider.js';

type Owner<R> = Effect.Success<ReturnType<typeof openOperation<R>>>;
type Middleware<R, A> = Effect.Effect<A, unknown, R>;
type Identity<Model> = {
  readonly specificationVersion: 'v4';
  readonly overrideProvider?: (options: { model: Model }) => string;
  readonly overrideModelId?: (options: { model: Model }) => string;
};
type Arguments<Model, Params> = { model: Model; params: Params };
type LanguageArgs = Arguments<
  LanguageModelV4,
  native.LanguageModelV4CallOptions
>;
type EmbeddingArgs = Arguments<
  EmbeddingModelV4,
  native.EmbeddingModelV4CallOptions
>;
type ImageArgs = Arguments<ImageModelV4, native.ImageModelV4CallOptions>;
type LanguageStream = Omit<native.LanguageModelV4StreamResult, 'stream'> & {
  stream: Stream.Stream<native.LanguageModelV4StreamPart, AiSdkError>;
};
type LanguageNext = LanguageArgs & {
  doGenerate: () => Effect.Effect<
    native.LanguageModelV4GenerateResult,
    AiSdkError
  >;
  doStream: () => Effect.Effect<LanguageStream, AiSdkError>;
};

export type LanguageModelMiddleware<R = never> = Identity<LanguageModelV4> & {
  readonly overrideSupportedUrls?: (options: {
    model: LanguageModelV4;
  }) => Middleware<R, Record<string, RegExp[]>>;
  readonly transformParams?: (
    options: LanguageArgs & { type: 'generate' | 'stream' },
  ) => Middleware<R, LanguageArgs['params']>;
  readonly wrapGenerate?: (
    options: LanguageNext,
  ) => Middleware<R, native.LanguageModelV4GenerateResult>;
  readonly wrapStream?: (
    options: LanguageNext,
  ) => Middleware<R, LanguageStream>;
};

export type EmbeddingModelMiddleware<R = never> = Identity<EmbeddingModelV4> & {
  readonly overrideMaxEmbeddingsPerCall?: (options: {
    model: EmbeddingModelV4;
  }) => Middleware<R, number | undefined>;
  readonly overrideSupportsParallelCalls?: (options: {
    model: EmbeddingModelV4;
  }) => Middleware<R, boolean>;
  readonly transformParams?: (
    options: EmbeddingArgs,
  ) => Middleware<R, EmbeddingArgs['params']>;
  readonly wrapEmbed?: (
    options: EmbeddingArgs & {
      doEmbed: () => Effect.Effect<native.EmbeddingModelV4Result, AiSdkError>;
    },
  ) => Middleware<R, native.EmbeddingModelV4Result>;
};

type ImageResult = Awaited<ReturnType<native.ImageModelV4['doGenerate']>>;
export type ImageModelMiddleware<R = never> = Identity<ImageModelV4> & {
  readonly overrideMaxImagesPerCall?: (options: {
    model: ImageModelV4;
  }) =>
    | number
    | undefined
    | ((options: { modelId: string }) => Middleware<R, number | undefined>);
  readonly overrideSupportsFileInputs?: (options: {
    model: ImageModelV4;
  }) => boolean | undefined;
  readonly overrideSupportsMaskInputs?: (options: {
    model: ImageModelV4;
  }) => boolean | undefined;
  readonly transformParams?: (
    options: ImageArgs,
  ) => Middleware<R, ImageArgs['params']>;
  readonly wrapGenerate?: (
    options: ImageArgs & {
      doGenerate: () => Effect.Effect<ImageResult, AiSdkError>;
    },
  ) => Middleware<R, ImageResult>;
};

export type LanguageModelV4Middleware<R = never> = LanguageModelMiddleware<R>;
export type EmbeddingModelV4Middleware<R = never> = EmbeddingModelMiddleware<R>;
export type ImageModelV4Middleware<R = never> = ImageModelMiddleware<R>;

const languageBuiltins = new WeakMap<object, sdk.LanguageModelMiddleware>();
const embeddingBuiltins = new WeakMap<object, sdk.EmbeddingModelMiddleware>();

function bindIdentity<Model, Native>(
  identity: Identity<Model>,
  wrap: (model: Native) => Model,
) {
  const { overrideProvider, overrideModelId } = identity;
  return {
    specificationVersion: 'v4' as const,
    ...(overrideProvider && {
      overrideProvider: ({ model }: { model: Native }) =>
        overrideProvider({ model: wrap(model) }),
    }),
    ...(overrideModelId && {
      overrideModelId: ({ model }: { model: Native }) =>
        overrideModelId({ model: wrap(model) }),
    }),
  };
}

const fromStream = (
  result: native.LanguageModelV4StreamResult,
): LanguageStream => ({
  ...result,
  stream: Stream.fromReadableStream({
    evaluate: () => result.stream,
    onError: (cause) => sdkError('LanguageModelMiddleware.stream', cause),
    releaseLockOnEnd: true,
  }),
});

const toStream = (
  result: LanguageStream,
): native.LanguageModelV4StreamResult => ({
  ...result,
  stream: Stream.toReadableStream(result.stream),
});

function languageNext(
  options: Parameters<
    NonNullable<sdk.LanguageModelMiddleware['wrapStream']>
  >[0],
): LanguageNext {
  return {
    params: options.params,
    model: adaptLanguageModel(options.model),
    doGenerate: () =>
      runRequest(
        'LanguageModelMiddleware.doGenerate',
        options.params,
        options.doGenerate,
      ),
    doStream: () =>
      runRequest(
        'LanguageModelMiddleware.doStream',
        options.params,
        options.doStream,
      ).pipe(Effect.map(fromStream)),
  };
}

export function bindLanguageMiddleware<R>(
  middleware: LanguageModelMiddleware<R>,
  owner: Owner<R>,
): sdk.LanguageModelMiddleware {
  const builtin = languageBuiltins.get(middleware);
  if (builtin) return builtin;
  const { overrideSupportedUrls, transformParams, wrapGenerate, wrapStream } =
    middleware;
  const bound: sdk.LanguageModelMiddleware = bindIdentity(
    middleware,
    adaptLanguageModel,
  );
  if (overrideSupportedUrls) {
    bound.overrideSupportedUrls = ({ model }) =>
      owner.runCallback(
        Effect.suspend(() =>
          overrideSupportedUrls({ model: adaptLanguageModel(model) }),
        ),
      );
  }
  if (transformParams) {
    bound.transformParams = ({ model, ...options }) =>
      owner.runCallback(
        Effect.suspend(() =>
          transformParams({ ...options, model: adaptLanguageModel(model) }),
        ),
        options.params.abortSignal,
      );
  }
  if (wrapGenerate) {
    bound.wrapGenerate = (options) =>
      owner.runCallback(
        Effect.suspend(() => wrapGenerate(languageNext(options))),
        options.params.abortSignal,
      );
  }
  if (wrapStream) {
    bound.wrapStream = (options) =>
      owner.runCallback(
        Effect.suspend(() => wrapStream(languageNext(options))).pipe(
          Effect.map(toStream),
        ),
        options.params.abortSignal,
      );
  }
  return bound;
}

function bindEmbeddingMiddleware<R>(
  middleware: EmbeddingModelMiddleware<R>,
  owner: Owner<R>,
): sdk.EmbeddingModelMiddleware {
  const {
    overrideMaxEmbeddingsPerCall,
    overrideSupportsParallelCalls,
    transformParams,
    wrapEmbed,
  } = middleware;
  const bound: sdk.EmbeddingModelMiddleware = bindIdentity(
    middleware,
    adaptEmbeddingModel,
  );
  if (overrideMaxEmbeddingsPerCall)
    bound.overrideMaxEmbeddingsPerCall = ({ model }) =>
      owner.runCallback(
        Effect.suspend(() =>
          overrideMaxEmbeddingsPerCall({ model: adaptEmbeddingModel(model) }),
        ),
      );
  if (overrideSupportsParallelCalls)
    bound.overrideSupportsParallelCalls = ({ model }) =>
      owner.runCallback(
        Effect.suspend(() =>
          overrideSupportsParallelCalls({ model: adaptEmbeddingModel(model) }),
        ),
      );
  if (transformParams)
    bound.transformParams = ({ model, params }) =>
      owner.runCallback(
        Effect.suspend(() =>
          transformParams({ model: adaptEmbeddingModel(model), params }),
        ),
        params.abortSignal,
      );
  if (wrapEmbed)
    bound.wrapEmbed = ({ model, params, doEmbed }) =>
      owner.runCallback(
        Effect.suspend(() =>
          wrapEmbed({
            model: adaptEmbeddingModel(model),
            params,
            doEmbed: () =>
              runRequest('EmbeddingModelMiddleware.doEmbed', params, doEmbed),
          }),
        ),
        params.abortSignal,
      );
  return embeddingBuiltins.get(middleware) ?? bound;
}

export function bindImageMiddleware<R>(
  middleware: ImageModelMiddleware<R>,
  owner: Owner<R>,
): sdk.ImageModelMiddleware {
  const {
    overrideMaxImagesPerCall,
    overrideSupportsFileInputs,
    overrideSupportsMaskInputs,
    transformParams,
    wrapGenerate,
  } = middleware;
  const bound: sdk.ImageModelMiddleware = bindIdentity(
    middleware,
    adaptImageModel,
  );
  if (overrideMaxImagesPerCall)
    bound.overrideMaxImagesPerCall = ({ model }) => {
      const limit = overrideMaxImagesPerCall({ model: adaptImageModel(model) });
      return typeof limit === 'function'
        ? (options) => owner.runCallback(Effect.suspend(() => limit(options)))
        : limit;
    };
  if (overrideSupportsFileInputs)
    bound.overrideSupportsFileInputs = ({ model }) =>
      overrideSupportsFileInputs({ model: adaptImageModel(model) });
  if (overrideSupportsMaskInputs)
    bound.overrideSupportsMaskInputs = ({ model }) =>
      overrideSupportsMaskInputs({ model: adaptImageModel(model) });
  if (transformParams)
    bound.transformParams = ({ model, params }) =>
      owner.runCallback(
        Effect.suspend(() =>
          transformParams({ model: adaptImageModel(model), params }),
        ),
        params.abortSignal,
      );
  if (wrapGenerate)
    bound.wrapGenerate = ({ model, params, doGenerate }) =>
      owner.runCallback(
        Effect.suspend(() =>
          wrapGenerate({
            model: adaptImageModel(model),
            params,
            doGenerate: () =>
              runRequest('ImageModelMiddleware.doGenerate', params, doGenerate),
          }),
        ),
        params.abortSignal,
      );
  return bound;
}

type ModelOptions<Model, M> = {
  readonly model: Model;
  readonly middleware: M | readonly M[];
  readonly modelId?: string;
  readonly providerId?: string;
};

function list<A>(value: A | readonly A[]): readonly A[] {
  return Array.isArray(value) ? value : [value as A];
}

function requireModel<A, Model extends { modelId: string }>(
  operation: string,
  model: Model,
  type: ConstructorParameters<typeof sdk.NoSuchModelError>[0]['modelType'],
  nativeModel: A | undefined,
) {
  return nativeModel
    ? Effect.succeed(nativeModel)
    : Effect.fail(
        sdkError(
          operation,
          new sdk.NoSuchModelError({ modelId: model.modelId, modelType: type }),
        ),
      );
}

export const wrapLanguageModel = <R = never>({
  model,
  middleware,
  ...options
}: ModelOptions<
  LanguageModelV2 | LanguageModelV3 | LanguageModelV4,
  LanguageModelMiddleware<R>
>) =>
  Effect.gen(function* () {
    const operation = 'wrapLanguageModel';
    const nativeModel = yield* requireModel(
      operation,
      model,
      'languageModel',
      model.specificationVersion === 'v4'
        ? unwrapLanguageModel(model)
        : unwrapLegacyModel<native.LanguageModelV2 | native.LanguageModelV3>(
            model,
          ),
    );
    const owner = yield* openOperation<R>();
    return yield* runSync(operation, () =>
      adaptLanguageModel(
        sdk.wrapLanguageModel({
          ...options,
          model: nativeModel,
          middleware: list(middleware).map((entry) =>
            bindLanguageMiddleware(entry, owner),
          ),
        }),
      ),
    );
  });

export const wrapEmbeddingModel = <R = never>({
  model,
  middleware,
  ...options
}: ModelOptions<
  EmbeddingModelV3 | EmbeddingModelV4,
  EmbeddingModelMiddleware<R>
>) =>
  Effect.gen(function* () {
    const operation = 'wrapEmbeddingModel';
    const nativeModel = yield* requireModel(
      operation,
      model,
      'embeddingModel',
      model.specificationVersion === 'v4'
        ? unwrapEmbeddingModel(model)
        : unwrapLegacyModel<native.EmbeddingModelV3>(model),
    );
    const owner = yield* openOperation<R>();
    return yield* runSync(operation, () =>
      adaptEmbeddingModel(
        sdk.wrapEmbeddingModel({
          ...options,
          model: nativeModel,
          middleware: list(middleware).map((entry) =>
            bindEmbeddingMiddleware(entry, owner),
          ),
        }),
      ),
    );
  });

export const wrapImageModel = <R = never>({
  model,
  middleware,
  ...options
}: ModelOptions<
  ImageModelV2 | ImageModelV3 | ImageModelV4,
  ImageModelMiddleware<R>
>) =>
  Effect.gen(function* () {
    const operation = 'wrapImageModel';
    const nativeModel = yield* requireModel(
      operation,
      model,
      'imageModel',
      model.specificationVersion === 'v4'
        ? unwrapImageModel(model)
        : unwrapLegacyModel<native.ImageModelV2 | native.ImageModelV3>(model),
    );
    const owner = yield* openOperation<R>();
    return yield* runSync(operation, () =>
      adaptImageModel(
        sdk.wrapImageModel({
          ...options,
          model: nativeModel,
          middleware: list(middleware).map((entry) =>
            bindImageMiddleware(entry, owner),
          ),
        }),
      ),
    );
  });

function languageBuiltin(
  middleware: sdk.LanguageModelMiddleware,
): LanguageModelMiddleware {
  const { transformParams, wrapGenerate, wrapStream } = middleware;
  const wrapped: LanguageModelMiddleware = {
    specificationVersion: 'v4',
    ...(transformParams && {
      transformParams: ({ model, ...options }) =>
        Effect.gen(function* () {
          const operation = 'LanguageModelMiddleware.transformParams';
          const input = yield* requireModel(
            operation,
            model,
            'languageModel',
            unwrapLanguageModel(model),
          );
          return yield* runRequest(operation, options.params, (abortSignal) =>
            transformParams({
              ...options,
              params: { ...options.params, abortSignal },
              model: input,
            }),
          );
        }),
    }),
    ...(wrapGenerate && {
      wrapGenerate: (options) =>
        Effect.gen(function* () {
          const operation = 'LanguageModelMiddleware.wrapGenerate';
          const next = yield* builtinNext(operation, options);
          return yield* runRequest(operation, options.params, () =>
            wrapGenerate(next),
          );
        }).pipe(Effect.scoped),
    }),
    ...(wrapStream && {
      wrapStream: (options) =>
        Effect.gen(function* () {
          const operation = 'LanguageModelMiddleware.wrapStream';
          const next = yield* builtinNext(operation, options);
          return yield* runRequest(operation, options.params, () =>
            wrapStream(next),
          ).pipe(Effect.map(fromStream));
        }).pipe(Effect.scoped),
    }),
  };
  languageBuiltins.set(wrapped, middleware);
  return wrapped;
}

function builtinNext(
  operation: string,
  { model, doGenerate, doStream, params }: LanguageNext,
) {
  return Effect.gen(function* () {
    const input = yield* requireModel(
      operation,
      model,
      'languageModel',
      unwrapLanguageModel(model),
    );
    const owner = yield* openOperation(params.abortSignal);
    return {
      params,
      model: input,
      doGenerate: () => owner.runCallback(doGenerate()),
      doStream: () => owner.runCallback(doStream().pipe(Effect.map(toStream))),
    };
  });
}

export const defaultEmbeddingSettingsMiddleware = (
  options: Parameters<typeof sdk.defaultEmbeddingSettingsMiddleware>[0],
): EmbeddingModelMiddleware => {
  const middleware = sdk.defaultEmbeddingSettingsMiddleware(options);
  const transform = middleware.transformParams;
  const wrapped: EmbeddingModelMiddleware = {
    specificationVersion: 'v4',
    ...(transform && {
      transformParams: ({ model, params }) =>
        Effect.gen(function* () {
          const operation = 'EmbeddingModelMiddleware.transformParams';
          const input = yield* requireModel(
            operation,
            model,
            'embeddingModel',
            unwrapEmbeddingModel(model),
          );
          return yield* runRequest(operation, params, (abortSignal) =>
            transform({
              model: input,
              params: { ...params, abortSignal },
            }),
          );
        }),
    }),
  };
  embeddingBuiltins.set(wrapped, middleware);
  return wrapped;
};

export const addToolInputExamplesMiddleware = (options?: {
  readonly prefix?: string;
  readonly format?: (
    example: { input: native.JSONObject },
    index: number,
  ) => string;
  readonly remove?: boolean;
}) => languageBuiltin(sdk.addToolInputExamplesMiddleware(options));

export const defaultInstructionsMiddleware = (
  options: Parameters<typeof sdk.defaultInstructionsMiddleware>[0],
) => languageBuiltin(sdk.defaultInstructionsMiddleware(options));

export const defaultSettingsMiddleware = (
  options: Parameters<typeof sdk.defaultSettingsMiddleware>[0],
) => languageBuiltin(sdk.defaultSettingsMiddleware(options));

export const extractJsonMiddleware = (options?: {
  readonly transform?: (text: string) => string;
}) => languageBuiltin(sdk.extractJsonMiddleware(options));

export const extractReasoningMiddleware = (
  options: Parameters<typeof sdk.extractReasoningMiddleware>[0],
) => languageBuiltin(sdk.extractReasoningMiddleware(options));

export const simulateStreamingMiddleware = () =>
  languageBuiltin(sdk.simulateStreamingMiddleware());
