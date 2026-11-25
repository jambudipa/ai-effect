import type { Effect, Scope, Stream } from 'effect';
import type { AiSdkError } from './operation.js';
import { lazyValue, requestMethod, streamMethod } from './provider-model.js';

type Identity = {
  readonly specificationVersion: 'v2' | 'v3';
  readonly provider: string;
  readonly modelId: string;
};

const metadata = [
  'maxEmbeddingsPerCall',
  'maxImagesPerCall',
  'maxVideosPerCall',
  'supportedUrls',
  'supportsParallelCalls',
] as const;
const operations = ['doEmbed', 'doGenerate', 'doRerank', 'doStream'] as const;

type Metadata = (typeof metadata)[number];
type LimitName = 'maxImagesPerCall' | 'maxVideosPerCall';
type LimitOptions = { modelId: string };
type LimitValue = number | undefined;
type ModelLimit = (
  options: LimitOptions,
) => Effect.Effect<LimitValue, AiSdkError>;
type NativeLimit =
  | LimitValue
  | ((options: LimitOptions) => LimitValue | PromiseLike<LimitValue>);
type LegacyLimits<Native> = (Native extends {
  readonly maxImagesPerCall: NativeLimit;
}
  ? { readonly maxImagesPerCall: ModelLimit }
  : unknown) &
  (Native extends { readonly maxVideosPerCall: NativeLimit }
    ? { readonly maxVideosPerCall: ModelLimit }
    : unknown);
type Operation = (typeof operations)[number];
type Request = { readonly abortSignal?: AbortSignal };

type WrappedMethod<Method> = Method extends (
  options: infer Options,
) => PromiseLike<infer Result>
  ? Result extends { stream: ReadableStream<infer Part> }
    ? (
        options: Options,
      ) => Effect.Effect<
        Omit<Result, 'stream'> & { stream: Stream.Stream<Part, AiSdkError> },
        AiSdkError,
        Scope.Scope
      >
    : (options: Options) => Effect.Effect<Result, AiSdkError>
  : never;

export type LegacyModel<Native extends Identity> = {
  [
    Name in keyof Native as Name extends keyof Identity ? Name : never
  ]: Native[Name];
} & {
  readonly [Name in Exclude<Metadata, LimitName> & keyof Native]: Effect.Effect<
    Awaited<Native[Name]>,
    AiSdkError
  >;
} & {
  readonly [
    Name in keyof Native as Name extends Operation ? Name : never
  ]: WrappedMethod<Native[Name]>;
} & LegacyLimits<Native>;

const nativeModels = new WeakMap<object, Identity>();

export const unwrapLegacyModel = <Native extends Identity>(
  model: Identity,
): Native | undefined => nativeModels.get(model) as Native | undefined;

export function wrapLegacyModel<Native extends Identity>(
  native: Native,
): LegacyModel<Native> {
  const { specificationVersion, provider, modelId } = native;
  const namespace = `${specificationVersion}Model`;
  const fields = native as Native & Partial<Record<Metadata, unknown>>;
  const wrappedMetadata = Object.fromEntries(
    metadata
      .filter((name) => name in fields)
      .map((name) => {
        const operation = `${namespace}.${name}`;
        if (name === 'maxImagesPerCall' || name === 'maxVideosPerCall') {
          const read = (options: LimitOptions) =>
            lazyValue(operation, () => {
              const limit = fields[name] as NativeLimit;
              return typeof limit === 'function'
                ? limit.call(native, options)
                : limit;
            });
          return [name, read];
        }
        return [name, lazyValue(operation, () => fields[name])];
      }),
  );

  const methods = native as Native &
    Partial<Record<Operation, (request: Request) => PromiseLike<unknown>>>;
  const wrappedMethods = Object.fromEntries(
    operations.flatMap<
      readonly [
        Operation,
        (request: Request) => Effect.Effect<unknown, AiSdkError, Scope.Scope>,
      ]
    >((method) => {
      const run = methods[method]?.bind(native);
      if (!run) return [];
      const operation = `${namespace}.${method}`;
      if (method === 'doStream') {
        const read = run as (
          request: Request,
        ) => PromiseLike<{ stream: ReadableStream<unknown> }>;
        return [[method, streamMethod(operation, read)]];
      }
      return [[method, requestMethod(operation, run)]];
    }),
  );

  const model = {
    specificationVersion,
    provider,
    modelId,
    ...wrappedMetadata,
    ...wrappedMethods,
  };
  nativeModels.set(model, native);
  return model as LegacyModel<Native>;
}
