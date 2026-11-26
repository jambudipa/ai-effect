import type { Effect, Scope, Stream } from 'effect';
import type { AiSdkError } from './operation.js';
import { lazyValue, requestMethod, streamMethod } from './provider-model.js';

/** Keep the native legacy model's protocol version and lookup identity visible on its handle. */
type Identity = {
  readonly specificationVersion: 'v2' | 'v3';
  readonly provider: string;
  readonly modelId: string;
};

/** Identify native metadata fields whose access must be deferred to Effect execution. */
const metadata = [
  'maxEmbeddingsPerCall',
  'maxImagesPerCall',
  'maxVideosPerCall',
  'supportedUrls',
  'supportsParallelCalls',
] as const;
/** Identify the known version 2 and 3 native request and stream methods. */
const operations = ['doEmbed', 'doGenerate', 'doRerank', 'doStream'] as const;

/** Restrict metadata forwarding to the exported legacy metadata table. */
type Metadata = (typeof metadata)[number];
/** Select the image and video limits whose native shapes vary between SDK versions. */
type LimitName = 'maxImagesPerCall' | 'maxVideosPerCall';
/** Pass the model ID to native implementations that compute the per-call limit. */
type LimitOptions = { modelId: string };
/** Represent an unspecified per-call maximum as `undefined`. */
type LimitValue = number | undefined;
/** Read an optional native limit lazily with the SDK error channel available. */
type ModelLimit = (
  options: LimitOptions,
) => Effect.Effect<LimitValue, AiSdkError>;
/** Accept fixed, synchronous, and promise-based native limit representations. */
type NativeLimit =
  | LimitValue
  | ((options: LimitOptions) => LimitValue | PromiseLike<LimitValue>);
/** Expose limit methods only when the legacy model type declares the corresponding limit. */
type LegacyLimits<Native> = (Native extends {
  readonly maxImagesPerCall: NativeLimit;
}
  ? { readonly maxImagesPerCall: ModelLimit }
  : unknown) &
  (Native extends { readonly maxVideosPerCall: NativeLimit }
    ? { readonly maxVideosPerCall: ModelLimit }
    : unknown);
/** Restrict request adaptation to native legacy operation names known by the wrapper. */
type Operation = (typeof operations)[number];
/** Forward the caller abort signal alongside interruption to legacy requests. */
type Request = { readonly abortSignal?: AbortSignal };

/** Convert native results to Effects and retain scope requirements for streamed values. */
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

/** Preserve a legacy model's native identity and expose lazy versions of its supported operations. */
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

/** Associate each public legacy handle with its source native model. */
const nativeModels = new WeakMap<object, Identity>();

/** Recover the original legacy model only for previously registered handles. */
export const unwrapLegacyModel = <Native extends Identity>(
  model: Identity,
): Native | undefined => nativeModels.get(model) as Native | undefined;

/** Register the native model, preserving its version and deferring supported request and metadata access. */
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
