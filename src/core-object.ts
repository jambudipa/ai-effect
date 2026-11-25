import * as sdk from 'ai';
import type { JSONValue } from '@ai-sdk/provider';
import { Effect, Stream } from 'effect';
import type { Scope } from 'effect';
import { bindSchema, type FlexibleSchema } from './core-schema.js';
import type { LanguageModel } from './core.js';
import { bindCoreOptions, type CoreOptions } from './internal/core-settings.js';
import { unwrapLanguageModel } from './internal/language-model.js';
import { unwrapLegacyModel } from './internal/legacy-model.js';
import {
  openOperation,
  runRequest,
  runSync,
  sdkError,
  type AiSdkError,
} from './internal/operation.js';
import { lazyValue } from './internal/provider-model.js';

type Mode = 'object' | 'array' | 'enum' | 'no-schema';
type NativeSchema = ReturnType<typeof sdk.jsonSchema<unknown>>;
type NativeOptions<A> = Parameters<
  typeof sdk.streamObject<NativeSchema, Mode, A>
>[0];
type LegacyNative = Exclude<
  sdk.LanguageModel,
  string | { specificationVersion: 'v4' }
>;
type Owner<R> = Effect.Success<ReturnType<typeof openOperation<R>>>;

type OwnedNativeOptions<Options, R> = Options extends object
  ? CoreOptions<
      Omit<Options, 'model' | 'schema' | 'enum' | 'output' | '_internal'>,
      R
    >
  : never;

type ObjectInput<A, R> = OwnedNativeOptions<NativeOptions<A>, R> & {
  readonly model: LanguageModel;
  readonly schema: FlexibleSchema<A, R>;
  readonly output?: 'object';
  readonly schemaName?: string;
  readonly schemaDescription?: string;
};

type OmitMode<Options, Key extends PropertyKey> = Options extends object
  ? Omit<Options, Key>
  : never;

type ArrayInput<A, R> = OmitMode<ObjectInput<A, R>, 'output'> & {
  readonly output: 'array';
};
type EnumInput<A, R> = OmitMode<ObjectInput<A, R>, 'output' | 'schema'> & {
  readonly output: 'enum';
  readonly enum: readonly A[];
};
type UntypedInput<R> = OmitMode<
  ObjectInput<JSONValue, R>,
  'output' | 'schema'
> & {
  readonly output: 'no-schema';
};
type Input<A, R> =
  ObjectInput<A, R> | ArrayInput<A, R> | EnumInput<A, R> | UntypedInput<R>;

function bindOptions<A, R>(
  operation: string,
  options: Input<A, R>,
  owner: Owner<R>,
) {
  return Effect.gen(function* () {
    const model = options.model;
    const native =
      typeof model === 'string'
        ? model
        : model.specificationVersion === 'v4'
          ? unwrapLanguageModel(model)
          : unwrapLegacyModel<LegacyNative>(model);
    if (!native) {
      return yield* sdkError(
        operation,
        new sdk.NoSuchModelError({
          modelType: 'languageModel',
          modelId: typeof model === 'string' ? model : model.modelId,
        }),
      );
    }
    const resolved = bindCoreOptions(options, owner);
    const schema =
      'schema' in options ? yield* bindSchema(options.schema, owner) : void 0;
    return {
      ...resolved,
      ...(schema ? { schema } : {}),
      model: native,
      abortSignal: owner.signal,
    } as NativeOptions<unknown>;
  });
}

export type GenerateObjectResult<A> = Omit<
  sdk.GenerateObjectResult<A>,
  'toJsonResponse'
> & {
  readonly toJsonResponse: (
    init?: ResponseInit,
  ) => Effect.Effect<Response, AiSdkError>;
};

export function generateObject<A, R = never>(
  options: ObjectInput<A, R>,
): Effect.Effect<GenerateObjectResult<A>, AiSdkError, Exclude<R, Scope.Scope>>;
export function generateObject<A, R = never>(
  options: ArrayInput<A, R>,
): Effect.Effect<
  GenerateObjectResult<A[]>,
  AiSdkError,
  Exclude<R, Scope.Scope>
>;
export function generateObject<const A extends string, R = never>(
  options: EnumInput<A, R>,
): Effect.Effect<GenerateObjectResult<A>, AiSdkError, Exclude<R, Scope.Scope>>;
export function generateObject<R = never>(
  options: UntypedInput<R>,
): Effect.Effect<
  GenerateObjectResult<JSONValue>,
  AiSdkError,
  Exclude<R, Scope.Scope>
>;
export function generateObject<A, R>(
  options: Input<A, R>,
): Effect.Effect<
  GenerateObjectResult<unknown>,
  AiSdkError,
  Exclude<R, Scope.Scope>
> {
  // The diagnostic compares the overload's R with the implementation's R.
  // @effect-diagnostics-next-line effect/missingEffectContext:off
  return Effect.scoped(
    Effect.gen(function* () {
      const operation = 'generateObject';
      const owner = yield* openOperation<R>(options.abortSignal);
      const nativeOptions = yield* bindOptions(operation, options, owner);
      const result = yield* runRequest(
        operation,
        { abortSignal: owner.signal },
        (abortSignal) =>
          sdk.generateObject<NativeSchema, Mode, unknown>({
            ...nativeOptions,
            abortSignal,
          }),
      );
      return {
        object: result.object,
        reasoning: result.reasoning,
        finishReason: result.finishReason,
        usage: result.usage,
        warnings: result.warnings,
        request: result.request,
        response: result.response,
        providerMetadata: result.providerMetadata,
        toJsonResponse: (init?: ResponseInit) =>
          runSync(operation, () => result.toJsonResponse(init)),
      };
    }),
  );
}

type NativeStream<P, A, I> = sdk.StreamObjectResult<
  P,
  A,
  sdk.AsyncIterableStream<I>
>;
type AsyncFields =
  | 'warnings'
  | 'usage'
  | 'providerMetadata'
  | 'request'
  | 'response'
  | 'finishReason'
  | 'object';
type StreamObjectData<P, A, I> = {
  [Key in AsyncFields]: Effect.Effect<
    Awaited<NativeStream<P, A, I>[Key]>,
    AiSdkError
  >;
};

export type StreamObjectResult<P, A, I = never> = StreamObjectData<P, A, I> & {
  readonly partialObjectStream: Stream.Stream<P, AiSdkError>;
  readonly elementStream: Stream.Stream<I, AiSdkError>;
  readonly textStream: Stream.Stream<string, AiSdkError>;
  readonly fullStream: Stream.Stream<
    ReadableValue<NativeStream<P, A, I>['fullStream']>,
    AiSdkError
  >;
  readonly pipeTextStreamToResponse: (
    ...args: Parameters<NativeStream<P, A, I>['pipeTextStreamToResponse']>
  ) => Effect.Effect<void, AiSdkError>;
  readonly toTextStreamResponse: (
    init?: ResponseInit,
  ) => Effect.Effect<Response, AiSdkError>;
};

type ReadableValue<Value> = Value extends ReadableStream<infer A> ? A : never;

function wrapObjectStream<P, A, I>(
  native: NativeStream<P, A, I>,
  markComplete: Effect.Effect<void>,
): StreamObjectResult<P, A, I> {
  const operation = 'streamObject';
  const read = <Value>(get: () => Value | PromiseLike<Value>) =>
    lazyValue(operation, get);
  const stream = <Value>(get: () => ReadableStream<Value>) =>
    Stream.unwrap(
      runSync(operation, get).pipe(
        Effect.map((readable) =>
          Stream.fromReadableStream({
            evaluate: () => readable,
            onError: (error) => sdkError(operation, error),
            releaseLockOnEnd: true,
          }),
        ),
      ),
    ).pipe(Stream.onEnd(markComplete));

  return {
    warnings: read(() => native.warnings),
    usage: read(() => native.usage),
    providerMetadata: read(() => native.providerMetadata),
    request: read(() => native.request),
    response: read(() => native.response),
    finishReason: read(() => native.finishReason),
    object: read(() => native.object),
    partialObjectStream: stream(() => native.partialObjectStream),
    elementStream: stream(() => native.elementStream),
    textStream: stream(() => native.textStream),
    fullStream: stream(() => native.fullStream).pipe(
      Stream.mapEffect((part) =>
        part.type === 'error'
          ? Effect.fail(sdkError(operation, part.error))
          : Effect.succeed(part),
      ),
    ),
    pipeTextStreamToResponse: (...args) =>
      runSync(operation, () => native.pipeTextStreamToResponse(...args)),
    toTextStreamResponse: (init) =>
      runSync(operation, () => native.toTextStreamResponse(init)),
  };
}

export function streamObject<A, R = never>(
  options: ObjectInput<A, R>,
): Effect.Effect<
  StreamObjectResult<sdk.DeepPartial<A>, A>,
  AiSdkError,
  Scope.Scope | R
>;
export function streamObject<A, R = never>(
  options: ArrayInput<A, R>,
): Effect.Effect<StreamObjectResult<A[], A[], A>, AiSdkError, Scope.Scope | R>;
export function streamObject<const A extends string, R = never>(
  options: EnumInput<A, R>,
): Effect.Effect<StreamObjectResult<string, A>, AiSdkError, Scope.Scope | R>;
export function streamObject<R = never>(
  options: UntypedInput<R>,
): Effect.Effect<
  StreamObjectResult<JSONValue, JSONValue>,
  AiSdkError,
  Scope.Scope | R
>;
export function streamObject<A, R>(options: Input<A, R>) {
  // The diagnostic compares the overload's R with the implementation's R.
  // @effect-diagnostics-next-line effect/missingEffectContext:off
  return Effect.gen(function* () {
    const operation = 'streamObject';
    const owner = yield* openOperation<R>(options.abortSignal);
    const nativeOptions = yield* bindOptions(operation, options, owner);
    const result = yield* runSync(operation, () =>
      sdk.streamObject<NativeSchema, Mode, unknown>(nativeOptions),
    );
    return wrapObjectStream(
      result as NativeStream<unknown, unknown, unknown>,
      owner.markComplete,
    );
  });
}
