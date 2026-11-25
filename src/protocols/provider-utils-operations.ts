import * as sdk from '@ai-sdk/provider-utils';
import type {
  LanguageModelV4StreamPart,
  SharedV4ProviderMetadata,
} from '@ai-sdk/provider';
import { Effect, Option, Redacted, Ref, type Schema, Stream } from 'effect';
import {
  abortable,
  AiSdkError,
  openOperation,
  runRequest,
  runSync,
  sdkError,
} from '../internal/operation.js';
import {
  adaptProviderTool,
  type ProviderToolHandle,
} from '../internal/provider-tool.js';
import {
  annotateToolCaller,
  type EffectTools,
  type EffectToolExecutionOptions,
  type EffectToolOptions,
  type ToolCaller,
  type ToolWithCaller,
} from '../internal/tool.js';
import { toSdkSchema } from '../internal/schema.js';
import type { FlexibleSchema } from '../core-schema.js';
import { bindLazySchema } from '../internal/lazy-schema.js';
import { ownReadable } from '../internal/readable.js';
import { wrapError } from '../integrations/internal/error.js';
import { runValue } from '../integrations/internal/operation.js';
import { fromReadable, ownStream } from '../integrations/internal/stream.js';

export const asArray = <A>(value: sdk.Arrayable<A>) => sdk.asArray(value);
export const filterNullable = <A>(...values: Array<A | undefined | null>) =>
  sdk.filterNullable(...values);
export const isAbortError = (input: unknown): input is Error =>
  sdk.isAbortError(input);
export const isArrayBuffer = (input: unknown): input is ArrayBuffer =>
  sdk.isArrayBuffer(input);
export const isBrowserRuntime = (host?: unknown) => sdk.isBrowserRuntime(host);
export const isBuffer = (input: unknown): input is Buffer =>
  sdk.isBuffer(input);
export const isCustomReasoning = (
  ...args: Parameters<typeof sdk.isCustomReasoning>
) => sdk.isCustomReasoning(...args);
export const isNonNullable = <A>(
  input: A | undefined | null,
): input is NonNullable<A> => sdk.isNonNullable(input);
export const isProviderReference = (
  ...args: Parameters<typeof sdk.isProviderReference>
) => sdk.isProviderReference(...args);
export const isProviderStreamError = (
  ...args: Parameters<typeof sdk.isProviderStreamError>
) => sdk.isProviderStreamError(...args);
export const isRecord = (input: unknown): input is Record<string, unknown> =>
  sdk.isRecord(input);
export const isUint8Array = (input: unknown): input is Uint8Array =>
  sdk.isUint8Array(input);
export const removeUndefinedEntries = <A>(
  record: Record<string, A | undefined>,
) => sdk.removeUndefinedEntries(record);
export const getRuntimeEnvironmentUserAgent = (host?: unknown) =>
  sdk.getRuntimeEnvironmentUserAgent(host);
export const extractResponseHeaders = (response: Response) =>
  sdk.extractResponseHeaders(response);
export const mapReasoningToProviderEffort = <
  A extends string,
  B extends string = never,
>(
  options: Parameters<typeof sdk.mapReasoningToProviderEffort<A, B>>[0],
) => sdk.mapReasoningToProviderEffort<A, B>(options);

export const DownloadError = wrapError(
  'ProviderUtils.DownloadError',
  sdk.DownloadError,
);
export type DownloadError = AiSdkError;
export const SerializationError = wrapError(
  'ProviderUtils.SerializationError',
  sdk.SerializationError,
);
export type SerializationError = AiSdkError;

export const cancelResponseBody = (response: Response) =>
  runRequest('ProviderUtils.cancelResponseBody', {}, () =>
    sdk.cancelResponseBody(response),
  );

export const downloadBlob = (
  url: string,
  options?: Parameters<typeof sdk.downloadBlob>[1],
) =>
  runRequest('ProviderUtils.downloadBlob', options ?? {}, (abortSignal) =>
    sdk.downloadBlob(url, { ...options, abortSignal }),
  );

type ReadResponseOptions = {
  readonly response: Response;
  readonly url: string;
  readonly maxBytes?: number;
  readonly abortSignal?: AbortSignal;
  readonly onChunk?: (chunk: Uint8Array) => void;
};

export const readResponseWithSizeLimit = (input: ReadResponseOptions) =>
  Effect.scoped(
    Effect.gen(function* () {
      const operation = 'ProviderUtils.readResponseWithSizeLimit';
      const { response, abortSignal } = input;
      const body = response.body;
      const readable = body && (yield* ownReadable(operation, body));
      const read = runRequest(operation, {}, () =>
        sdk.readResponseWithSizeLimit({
          ...input,
          response: readable
            ? new Response(readable, { headers: response.headers })
            : response,
        }),
      );
      return yield* abortSignal
        ? abortable(operation, abortSignal, read)
        : read;
    }),
  );

export const fetchUntrustedUrl = (
  options: Parameters<typeof sdk.fetchUntrustedUrl>[0],
) =>
  runRequest('ProviderUtils.fetchUntrustedUrl', options, (abortSignal) =>
    sdk.fetchUntrustedUrl({ ...options, abortSignal }),
  );

export const fetchWithValidatedRedirects = (
  options: Parameters<typeof sdk.fetchWithValidatedRedirects>[0],
) =>
  runRequest(
    'ProviderUtils.fetchWithValidatedRedirects',
    options,
    (abortSignal) =>
      sdk.fetchWithValidatedRedirects({ ...options, abortSignal }),
  );

export const fetchWithValidatedEndpoint = (
  options: Parameters<typeof sdk.fetchWithValidatedEndpoint>[0],
) =>
  runRequest(
    'ProviderUtils.fetchWithValidatedEndpoint',
    {
      ...(options.init?.signal && { abortSignal: options.init.signal }),
    },
    (signal) =>
      sdk.fetchWithValidatedEndpoint({
        ...options,
        init: { ...options.init, signal },
      }),
  );

export const convertToFormData = <A extends Record<string, unknown>>(
  value: A,
  options?: Parameters<typeof sdk.convertToFormData<A>>[1],
) =>
  runSync('ProviderUtils.convertToFormData', () =>
    sdk.convertToFormData(value, options),
  );

export const createIdGenerator = (
  options?: Parameters<typeof sdk.createIdGenerator>[0],
) =>
  runSync('ProviderUtils.createIdGenerator', () => {
    const generate = sdk.createIdGenerator(options);
    return () => runSync('ProviderUtils.generateId', generate);
  });

export const createTextOutputCapture = (
  options: Parameters<typeof sdk.createTextOutputCapture>[0],
) =>
  runSync('ProviderUtils.createTextOutputCapture', () => {
    const native = sdk.createTextOutputCapture(options);
    return {
      append: (chunk: string) =>
        runSync('ProviderUtils.textOutput.append', () => native.append(chunk)),
      text: runSync('ProviderUtils.textOutput.text', () => native.text),
      length: runSync('ProviderUtils.textOutput.length', () => native.length),
    };
  });

export const createToolNameMapping = (
  options: Parameters<typeof sdk.createToolNameMapping>[0],
) =>
  runSync('ProviderUtils.createToolNameMapping', () => {
    const native = sdk.createToolNameMapping(options);
    return {
      toProviderToolName: (name: string) =>
        runSync('ProviderUtils.toProviderToolName', () =>
          native.toProviderToolName(name),
        ),
      toCustomToolName: (name: string) =>
        runSync('ProviderUtils.toCustomToolName', () =>
          native.toCustomToolName(name),
        ),
    };
  });

export const delay = (
  milliseconds?: number | null,
  options?: { abortSignal?: AbortSignal },
) => {
  const sleep = milliseconds ? Effect.sleep(milliseconds) : Effect.void;
  return options?.abortSignal
    ? abortable('ProviderUtils.delay', options.abortSignal, sleep)
    : sleep;
};

export class DelayedPromise<A> {
  static make<A>() {
    return runSync(
      'ProviderUtils.DelayedPromise.make',
      () => new DelayedPromise(new sdk.DelayedPromise<A>()),
    );
  }
  private constructor(private readonly native: sdk.DelayedPromise<A>) {}

  get promise() {
    return runRequest(
      'ProviderUtils.DelayedPromise.promise',
      {},
      () => this.native.promise,
    );
  }
  resolve(value: A) {
    return runSync('ProviderUtils.DelayedPromise.resolve', () =>
      this.native.resolve(value),
    );
  }
  reject(error: unknown) {
    return runSync('ProviderUtils.DelayedPromise.reject', () =>
      this.native.reject(error),
    );
  }
  isResolved() {
    return runSync('ProviderUtils.DelayedPromise.isResolved', () =>
      this.native.isResolved(),
    );
  }
  isRejected() {
    return runSync('ProviderUtils.DelayedPromise.isRejected', () =>
      this.native.isRejected(),
    );
  }
  isPending() {
    return runSync('ProviderUtils.DelayedPromise.isPending', () =>
      this.native.isPending(),
    );
  }
}

type Transform<I, O> = {
  readonly writable: WritableStream<I>;
  readonly readable: Stream.Stream<O, AiSdkError>;
};

const wrapTransform = <I, O>(
  name: string,
  transform: TransformStream<I, O>,
): Transform<I, O> => ({
  writable: transform.writable,
  readable: fromReadable(name, Effect.succeed(transform.readable)),
});

export const EventSourceParserStream = {
  make: () =>
    runSync('ProviderUtils.EventSourceParserStream.make', () =>
      wrapTransform('ProviderUtils.sse', new sdk.EventSourceParserStream()),
    ),
};
export type EventSourceParserStream = Effect.Success<
  ReturnType<typeof EventSourceParserStream.make>
>;

export const convertJsonResponseToolStream = (name: string) =>
  runSync('ProviderUtils.convertJsonResponseToolStream', () =>
    wrapTransform(
      'ProviderUtils.jsonToolStream',
      sdk.convertJsonResponseToolStream(name),
    ),
  );

export const convertAsyncIteratorToReadableStream = <A>(
  iterator: AsyncIterator<A>,
) =>
  fromReadable(
    'ProviderUtils.convertAsyncIteratorToReadableStream',
    runSync('ProviderUtils.convertAsyncIteratorToReadableStream', () =>
      sdk.convertAsyncIteratorToReadableStream(iterator),
    ),
  );

type EventResult<A> =
  | { readonly success: true; readonly value: A; readonly rawValue: unknown }
  | {
      readonly success: false;
      readonly error: AiSdkError;
      readonly rawValue: unknown;
    };

const eventResult = <A>(value: sdk.ParseResult<A>): EventResult<A> =>
  value.success
    ? value
    : {
        ...value,
        error: sdkError('ProviderUtils.parseJsonEventStream', value.error),
      };

export const parseJsonEventStream = <A, R = never>(options: {
  readonly stream: ReadableStream<Uint8Array>;
  readonly schema: Schema.ConstraintDecoder<A, R>;
}) =>
  fromReadable(
    'ProviderUtils.parseJsonEventStream',
    Effect.gen(function* () {
      const owner = yield* openOperation<R>();
      return yield* runSync('ProviderUtils.parseJsonEventStream', () =>
        sdk.parseJsonEventStream({
          stream: options.stream,
          schema: toSdkSchema(options.schema, owner),
        }),
      );
    }),
  ).pipe(Stream.map(eventResult));

type TrackerController = { enqueue(part: LanguageModelV4StreamPart): void };

export type StreamingToolCallTrackerOptions<
  D extends sdk.StreamingToolCallDelta = sdk.StreamingToolCallDelta,
> = {
  readonly generateId?: () => string;
  readonly typeValidation?: 'none' | 'if-present' | 'required';
  readonly extractMetadata?: (delta: D) => SharedV4ProviderMetadata | undefined;
  readonly buildToolCallProviderMetadata?: (
    metadata: SharedV4ProviderMetadata | undefined,
  ) => SharedV4ProviderMetadata | undefined;
};

export class StreamingToolCallTracker<
  D extends sdk.StreamingToolCallDelta = sdk.StreamingToolCallDelta,
> {
  static make<
    D extends sdk.StreamingToolCallDelta = sdk.StreamingToolCallDelta,
  >(
    controller: TrackerController,
    options?: StreamingToolCallTrackerOptions<D>,
  ) {
    return runSync(
      'ProviderUtils.StreamingToolCallTracker.make',
      () =>
        new StreamingToolCallTracker(
          new sdk.StreamingToolCallTracker<D>(controller, options),
        ),
    );
  }

  private constructor(
    private readonly native: sdk.StreamingToolCallTracker<D>,
  ) {}

  processDelta(delta: D) {
    return runSync('ProviderUtils.StreamingToolCallTracker.processDelta', () =>
      this.native.processDelta(delta),
    );
  }

  flush() {
    return runSync('ProviderUtils.StreamingToolCallTracker.flush', () =>
      this.native.flush(),
    );
  }
}

export const redactTelemetryValue = <A>(value: A) =>
  runSync('ProviderUtils.redactTelemetryValue', () =>
    sdk.redactTelemetryValue(value),
  );

export const withTelemetryRedaction = <A extends Record<string, unknown>>(
  value: A,
  redact: (value: A) => A,
) =>
  runSync('ProviderUtils.withTelemetryRedaction', () =>
    sdk.withTelemetryRedaction(value, redact),
  );

export type RetryDelayProvider = (options: {
  error: unknown;
  exponentialBackoffDelay: number;
}) => number;

export type RetryErrorFactory = (options: {
  message: string;
  reason: sdk.RetryErrorReason;
  errors: unknown[];
}) => unknown;

type RetryOptions<E, R> = {
  readonly maxRetries?: number;
  readonly initialDelayInMs?: number;
  readonly backoffFactor?: number;
  readonly abortSignal?: AbortSignal;
  readonly shouldRetry: (error: unknown) => Effect.Effect<boolean, E, R>;
  readonly getDelayInMs?: RetryDelayProvider;
  readonly createRetryError?: RetryErrorFactory;
};

export const retryWithExponentialBackoff =
  <E = never, R = never>(options: RetryOptions<E, R>) =>
  <A, F, S>(
    operation: Effect.Effect<A, F, S>,
  ): Effect.Effect<A, AiSdkError, R | S> =>
    Effect.scoped(
      Effect.gen(function* () {
        const owner = yield* openOperation<R | S>(options.abortSignal);
        return yield* runRequest(
          'ProviderUtils.retry',
          { abortSignal: owner.signal },
          (abortSignal) =>
            sdk.retryWithExponentialBackoff({
              ...options,
              abortSignal,
              shouldRetry: (cause) =>
                owner.runCallback(
                  Effect.suspend(() => options.shouldRetry(cause)),
                  abortSignal,
                ),
            })(() => owner.runCallback(operation, abortSignal)),
        );
      }),
    );

type ResolvedValue<A, E, R> = A | PromiseLike<A> | Effect.Effect<A, E, R>;

export type Resolvable<A, E = never, R = never> =
  ResolvedValue<A, E, R> | (() => ResolvedValue<A, E, R>);

export const resolve = <A, E = never, R = never>(
  input: Resolvable<A, E, R>,
): Effect.Effect<A, AiSdkError | E, R> =>
  Effect.flatMap(
    runSync('ProviderUtils.resolve', () =>
      typeof input === 'function'
        ? (input as () => ResolvedValue<A, E, R>)()
        : input,
    ),
    (value): Effect.Effect<A, AiSdkError | E, R> =>
      Effect.isEffect(value)
        ? (value as Effect.Effect<A, E, R>)
        : runValue('ProviderUtils.resolve', () => value as A | PromiseLike<A>),
  );

export const resolveWith = <A, B, E = never, R = never, F = never, S = never>(
  input: Resolvable<A, E, R>,
  transform: (value: A) => ResolvedValue<B, F, S>,
) => Effect.flatMap(resolve(input), (value) => resolve(() => transform(value)));

type ModelHeaders = Record<string, string | undefined>;
type SerializableConfiguration = {
  readonly headers?:
    | ModelHeaders
    | PromiseLike<ModelHeaders>
    | (() => ModelHeaders | PromiseLike<ModelHeaders>);
};

export const serializeModelOptions = <
  C extends SerializableConfiguration,
>(options: {
  readonly modelId: string;
  readonly config: C;
}) =>
  runSync('ProviderUtils.serializeModelOptions', () =>
    sdk.serializeModelOptions(options),
  );

export const resolveProviderOptions = <A, R = never>(
  options: Omit<
    Parameters<typeof sdk.resolveProviderOptions<A>>[0],
    'schema'
  > & {
    readonly schema: Schema.ConstraintDecoder<A, R>;
  },
) =>
  Effect.scoped(
    Effect.gen(function* () {
      const owner = yield* openOperation<R>();
      return yield* runRequest(
        'ProviderUtils.resolveProviderOptions',
        { abortSignal: owner.signal },
        () =>
          sdk.resolveProviderOptions({
            ...options,
            schema: toSdkSchema(options.schema, owner),
          }),
      );
    }),
  );

type NativeHandler<A> = sdk.ResponseHandler<A>;
type HandlerInput = Parameters<NativeHandler<unknown>>[0];
type HandlerResult<A> = Awaited<ReturnType<NativeHandler<A>>>;

export type ResponseHandler<A, E = AiSdkError, R = never> = (
  input: HandlerInput,
) => Effect.Effect<HandlerResult<A>, E, R>;

const handle = <A>(
  name: string,
  input: HandlerInput,
  native: () => NativeHandler<A>,
) => runRequest(name, {}, () => native()(input));

export const createBinaryResponseHandler = () => (input: HandlerInput) =>
  handle(
    'ProviderUtils.binaryResponse',
    input,
    sdk.createBinaryResponseHandler,
  );

export const createBinaryStreamResponseHandler = () => (input: HandlerInput) =>
  Effect.gen(function* () {
    const name = 'ProviderUtils.binaryStreamResponse';
    const { value, ...rest } = yield* handle(
      name,
      input,
      sdk.createBinaryStreamResponseHandler,
    );
    return { ...rest, value: yield* ownStream(name, value) };
  });

export const createJsonResponseHandler =
  <A, R = never>(
    schema: Schema.ConstraintDecoder<A, R>,
    options?: Parameters<typeof sdk.createJsonResponseHandler<A>>[1],
  ) =>
  (input: HandlerInput) =>
    Effect.scoped(
      Effect.gen(function* () {
        const owner = yield* openOperation<R>();
        return yield* handle('ProviderUtils.jsonResponse', input, () =>
          sdk.createJsonResponseHandler(toSdkSchema(schema, owner), options),
        );
      }),
    );

export const createJsonErrorResponseHandler =
  <A, R = never>(options: {
    readonly errorSchema: FlexibleSchema<A, R>;
    readonly errorToMessage: (error: A) => string;
    readonly isRetryable?: (response: Response, error?: A) => boolean;
  }) =>
  (input: HandlerInput) =>
    Effect.scoped(
      Effect.gen(function* () {
        const name = 'ProviderUtils.jsonErrorResponse';
        const owner = yield* openOperation<R>();
        const output = yield* handle(name, input, () =>
          sdk.createJsonErrorResponseHandler({
            ...options,
            errorSchema: bindLazySchema(options.errorSchema, owner, name),
          }),
        );
        return { ...output, value: sdkError(name, output.value) };
      }),
    );

export const createStatusCodeErrorResponseHandler =
  () => (input: HandlerInput) =>
    Effect.map(
      handle(
        'ProviderUtils.statusCodeErrorResponse',
        input,
        sdk.createStatusCodeErrorResponseHandler,
      ),
      (output) => ({
        ...output,
        value: sdkError('ProviderUtils.statusCodeErrorResponse', output.value),
      }),
    );

export const createEventSourceResponseHandler =
  <A, R = never>(schema: Schema.ConstraintDecoder<A, R>) =>
  (input: HandlerInput) =>
    Effect.gen(function* () {
      const name = 'ProviderUtils.eventSourceResponse';
      const owner = yield* openOperation<R>();
      const { value, ...rest } = yield* handle(name, input, () =>
        sdk.createEventSourceResponseHandler(toSdkSchema(schema, owner)),
      );
      const stream = yield* ownStream(name, value);
      return { ...rest, value: Stream.map(stream, eventResult) };
    });

export const createJsonLinesResponseHandler =
  <A, R = never>(
    schema: Schema.ConstraintDecoder<A, R>,
    options?: Parameters<typeof sdk.createJsonLinesResponseHandler<A>>[1],
  ) =>
  (input: HandlerInput) =>
    Effect.gen(function* () {
      const name = 'ProviderUtils.jsonLinesResponse';
      const owner = yield* openOperation<R>();
      const { value, ...rest } = yield* handle(name, input, () =>
        sdk.createJsonLinesResponseHandler(toSdkSchema(schema, owner), options),
      );
      return {
        ...rest,
        value: Stream.fromAsyncIterable(value, (cause) =>
          sdkError(name, cause),
        ),
      };
    });

type HttpHooks<A, E, R> = {
  readonly successfulResponseHandler: ResponseHandler<A, E, R>;
  readonly failedResponseHandler: ResponseHandler<Error, E, R>;
  readonly abortSignal?: AbortSignal;
};

type NativeHttpOptions<A> = {
  readonly successfulResponseHandler: NativeHandler<A>;
  readonly failedResponseHandler: NativeHandler<Error>;
  readonly abortSignal?: AbortSignal;
};

type HttpRequest<T, A, E, R> = Omit<T, keyof NativeHttpOptions<A>> &
  HttpHooks<A, E, R>;

const invokeHttp = <T extends NativeHttpOptions<A>, A, E, R>(
  name: string,
  options: HttpRequest<T, A, E, R>,
  call: (input: T) => Promise<HandlerResult<A>>,
) =>
  Effect.gen(function* () {
    const { successfulResponseHandler, failedResponseHandler, ...rest } =
      options;
    const owner = yield* openOperation<R>(options.abortSignal);
    return yield* runRequest(
      name,
      { abortSignal: owner.signal },
      (abortSignal) =>
        call({
          ...rest,
          abortSignal,
          successfulResponseHandler: (input: HandlerInput) =>
            owner.runCallback(successfulResponseHandler(input), abortSignal),
          failedResponseHandler: (input: HandlerInput) =>
            owner.runCallback(failedResponseHandler(input), abortSignal),
        } as unknown as T),
    ).pipe(
      Effect.mapError((error) => {
        const cause = Redacted.value(error.cause);
        return cause instanceof AiSdkError ? cause : error;
      }),
    );
  });

export const deleteFromApi = <A, E = AiSdkError, R = never>(
  options: HttpRequest<Parameters<typeof sdk.deleteFromApi<A>>[0], A, E, R>,
) =>
  invokeHttp<Parameters<typeof sdk.deleteFromApi<A>>[0], A, E, R>(
    'ProviderUtils.deleteFromApi',
    options,
    sdk.deleteFromApi<A>,
  );

export const getFromApi = <A, E = AiSdkError, R = never>(
  options: HttpRequest<Parameters<typeof sdk.getFromApi<A>>[0], A, E, R>,
) =>
  invokeHttp<Parameters<typeof sdk.getFromApi<A>>[0], A, E, R>(
    'ProviderUtils.getFromApi',
    options,
    sdk.getFromApi<A>,
  );

export const postFormDataToApi = <A, E = AiSdkError, R = never>(
  options: HttpRequest<Parameters<typeof sdk.postFormDataToApi<A>>[0], A, E, R>,
) =>
  invokeHttp<Parameters<typeof sdk.postFormDataToApi<A>>[0], A, E, R>(
    'ProviderUtils.postFormDataToApi',
    options,
    sdk.postFormDataToApi<A>,
  );

export const postJsonToApi = <A, E = AiSdkError, R = never>(
  options: HttpRequest<Parameters<typeof sdk.postJsonToApi<A>>[0], A, E, R>,
) =>
  invokeHttp<Parameters<typeof sdk.postJsonToApi<A>>[0], A, E, R>(
    'ProviderUtils.postJsonToApi',
    options,
    sdk.postJsonToApi<A>,
  );

export const postMultipartStreamToApi = <A, E = AiSdkError, R = never>(
  options: HttpRequest<
    Parameters<typeof sdk.postMultipartStreamToApi<A>>[0],
    A,
    E,
    R
  >,
) =>
  invokeHttp<Parameters<typeof sdk.postMultipartStreamToApi<A>>[0], A, E, R>(
    'ProviderUtils.postMultipartStreamToApi',
    options,
    sdk.postMultipartStreamToApi<A>,
  );

export const postToApi = <A, E = AiSdkError, R = never>(
  options: HttpRequest<Parameters<typeof sdk.postToApi<A>>[0], A, E, R>,
) =>
  invokeHttp<Parameters<typeof sdk.postToApi<A>>[0], A, E, R>(
    'ProviderUtils.postToApi',
    options,
    sdk.postToApi<A>,
  );

export { tool } from '../internal/tool.js';

export const dynamicTool = <Input, Output, E, R, Context = unknown>(
  options: EffectToolOptions<Input, Output, E, R, Context>,
): DynamicTool<Input, Output, Context, E, R> => ({
  ...options,
  type: 'dynamic',
});

type ToolWithExecute = {
  readonly execute?: (
    ...args: never[]
  ) => Effect.Effect<unknown, unknown, unknown>;
};

export const isExecutableTool = <T extends ToolWithExecute>(
  tool: T | undefined,
): tool is T & { readonly execute: NonNullable<T['execute']> } =>
  typeof tool?.execute === 'function';

type ExecutionOptions<C> = EffectToolExecutionOptions<C>;

type Executable<I, A, C, E, R> = {
  readonly execute: (
    input: I,
    options: ExecutionOptions<C>,
  ) => Effect.Effect<A | Stream.Stream<A, E, R>, E, R> | Stream.Stream<A, E, R>;
};

type ToolOutput<A> =
  | { readonly type: 'preliminary'; readonly output: A }
  | { readonly type: 'final'; readonly output: A | undefined };

export const executeTool = <I, A, C, E, R>(input: {
  readonly tool: Executable<I, A, C, E, R>;
  readonly input: I;
  readonly options: ExecutionOptions<C>;
}): Stream.Stream<ToolOutput<A>, E | AiSdkError, R> => {
  const execution = Effect.flatMap(
    runSync('ProviderUtils.executeTool', () =>
      input.tool.execute(input.input, input.options),
    ),
    (result) => (Effect.isEffect(result) ? result : Effect.succeed(result)),
  );
  const begin = input.options.abortSignal
    ? abortable(
        'ProviderUtils.executeTool',
        input.options.abortSignal,
        execution,
      )
    : execution;
  return Stream.unwrap(
    Effect.gen(function* () {
      const output = yield* begin;
      if (!Stream.isStream(output)) {
        const part: ToolOutput<A> = { type: 'final', output: output as A };
        return Stream.make(part);
      }
      const last = yield* Ref.make(Option.none<A>());
      const stream = output as Stream.Stream<A, E, R>;
      const signal = input.options.abortSignal;
      const available = signal
        ? Stream.interruptWhen(
            stream,
            abortable('ProviderUtils.executeTool', signal, Effect.never),
          )
        : stream;
      const chunks = available.pipe(
        Stream.tap((chunk) => Ref.set(last, Option.some(chunk))),
        Stream.map((chunk): ToolOutput<A> => ({
          type: 'preliminary',
          output: chunk,
        })),
      );
      const final = Stream.fromEffect(
        Effect.map(Ref.get(last), (value): ToolOutput<A> => ({
          type: 'final',
          output: Option.getOrUndefined(value),
        })),
      );
      return Stream.concat(chunks, final);
    }),
  );
};

/** Attach caller hooks that complete synchronously during native tool setup. */
export const experimental_toolCaller = <
  A extends EffectTools[string],
  R = never,
  Bound extends EffectTools[string] = EffectTools[string],
  Prepare = R,
>(
  tool: A,
  definition: ToolCaller<R, Bound, Prepare>,
) =>
  runSync('ProviderUtils.toolCaller', () =>
    annotateToolCaller(tool, definition),
  );

export const experimental_getToolCaller = <
  R,
  Bound extends EffectTools[string],
  Prepare,
>(
  tool?: EffectTools[string] & {
    readonly experimental_toolCaller?: ToolCaller<R, Bound, Prepare>;
  },
) => tool?.experimental_toolCaller;

type NativeProviderTool = ReturnType<Parameters<typeof adaptProviderTool>[1]>;
type AdaptedFactory<Fn extends (...args: never[]) => object> = ReturnType<
  typeof adaptProviderTool<Parameters<Fn>, ReturnType<Fn> & NativeProviderTool>
>;

const adaptFactory = <Fn extends (...args: never[]) => object>(
  operation: string,
  create: Fn,
): AdaptedFactory<Fn> =>
  adaptProviderTool(
    operation,
    create as unknown as (
      ...args: Parameters<Fn>
    ) => ReturnType<Fn> & NativeProviderTool,
  );

type ToolFactoryOptions<Input> = {
  readonly id: `${string}.${string}`;
  readonly inputSchema: Schema.ConstraintDecoder<Input>;
  readonly redactArgs?: (
    args: Record<string, unknown>,
  ) => Record<string, unknown>;
};
type OutputToolFactoryOptions<Input, Output> = ToolFactoryOptions<Input> & {
  readonly outputSchema: Schema.ConstraintDecoder<Output>;
};

export const createProviderDefinedToolFactory = <
  I,
  Args extends object,
  C extends sdk.Context = {},
>(
  options: ToolFactoryOptions<I>,
): Effect.Effect<
  AdaptedFactory<
    ReturnType<typeof sdk.createProviderDefinedToolFactory<I, Args, C>>
  >,
  AiSdkError
> =>
  runSync('ProviderUtils.createProviderDefinedToolFactory', () =>
    adaptFactory(
      'ProviderUtils.createProviderDefinedTool',
      sdk.createProviderDefinedToolFactory<I, Args, C>({
        ...options,
        inputSchema: toSdkSchema(options.inputSchema),
      }),
    ),
  );

export const createProviderDefinedToolFactoryWithOutputSchema = <
  I,
  A,
  Args extends object,
  C extends sdk.Context = {},
>(
  options: OutputToolFactoryOptions<I, A>,
): Effect.Effect<
  AdaptedFactory<
    ReturnType<
      typeof sdk.createProviderDefinedToolFactoryWithOutputSchema<I, A, Args, C>
    >
  >,
  AiSdkError
> =>
  runSync(
    'ProviderUtils.createProviderDefinedToolFactoryWithOutputSchema',
    () =>
      adaptFactory(
        'ProviderUtils.createProviderDefinedToolWithOutputSchema',
        sdk.createProviderDefinedToolFactoryWithOutputSchema<I, A, Args, C>({
          ...options,
          inputSchema: toSdkSchema(options.inputSchema),
          outputSchema: toSdkSchema(options.outputSchema),
        }),
      ),
  );

export const createProviderExecutedToolFactory = <
  I,
  A,
  Args extends object,
  C extends sdk.Context = {},
>(
  options: OutputToolFactoryOptions<I, A> & {
    readonly supportsDeferredResults?: boolean;
  },
): Effect.Effect<
  AdaptedFactory<
    ReturnType<typeof sdk.createProviderExecutedToolFactory<I, A, Args, C>>
  >,
  AiSdkError
> =>
  runSync('ProviderUtils.createProviderExecutedToolFactory', () =>
    adaptFactory(
      'ProviderUtils.createProviderExecutedTool',
      sdk.createProviderExecutedToolFactory<I, A, Args, C>({
        ...options,
        inputSchema: toSdkSchema(options.inputSchema),
        outputSchema: toSdkSchema(options.outputSchema),
      }),
    ),
  );

export const DEFAULT_MAX_DOWNLOAD_SIZE = sdk.DEFAULT_MAX_DOWNLOAD_SIZE;
export const VERSION = sdk.VERSION;
export const EXPERIMENTAL_EMBEDDING_MODEL_MAX_INPUT_BYTES_PER_CALL =
  sdk.EXPERIMENTAL_EMBEDDING_MODEL_MAX_INPUT_BYTES_PER_CALL;
export const EXPERIMENTAL_EMBEDDING_MODEL_PROVIDER_OPTIONS_TRANSFORMER =
  sdk.EXPERIMENTAL_EMBEDDING_MODEL_PROVIDER_OPTIONS_TRANSFORMER;
export const EXPERIMENTAL_SPEECH_STREAM_START_FRAME_TYPE =
  sdk.EXPERIMENTAL_SPEECH_STREAM_START_FRAME_TYPE;
export const EXPERIMENTAL_SPEECH_STREAM_TEXT_DELTA_FRAME_TYPE =
  sdk.EXPERIMENTAL_SPEECH_STREAM_TEXT_DELTA_FRAME_TYPE;
export const EXPERIMENTAL_SPEECH_STREAM_TEXT_DONE_FRAME_TYPE =
  sdk.EXPERIMENTAL_SPEECH_STREAM_TEXT_DONE_FRAME_TYPE;
export const EXPERIMENTAL_TRANSCRIPTION_STREAM_AUDIO_DONE_FRAME_TYPE =
  sdk.EXPERIMENTAL_TRANSCRIPTION_STREAM_AUDIO_DONE_FRAME_TYPE;
export const EXPERIMENTAL_TRANSCRIPTION_STREAM_START_FRAME_TYPE =
  sdk.EXPERIMENTAL_TRANSCRIPTION_STREAM_START_FRAME_TYPE;
export const WORKFLOW_SERIALIZE = sdk.WORKFLOW_SERIALIZE;
export const WORKFLOW_DESERIALIZE = sdk.WORKFLOW_DESERIALIZE;

export type Experimental_ToolCallerDefinition<
  R = never,
  Bound extends EffectTools[string] = EffectTools[string],
  Prepare = R,
> = ToolCaller<R, Bound, Prepare>;
export type Experimental_ToolCallerTool<
  T extends object = EffectTools[string],
  R = never,
  Bound extends EffectTools[string] = EffectTools[string],
  Prepare = R,
> = ToolWithCaller<T, R, Bound, Prepare>;
export type ExecutableTool<T extends ToolWithExecute> = T & {
  readonly execute: NonNullable<T['execute']>;
};
export type RetryFunction<E = never, R = never> = ReturnType<
  typeof retryWithExponentialBackoff<E, R>
>;
export type ShouldRetryFunction<E = never, R = never> = RetryOptions<
  E,
  R
>['shouldRetry'];
export type IdGenerator = Effect.Success<ReturnType<typeof createIdGenerator>>;
export type ToolNameMapping = Effect.Success<
  ReturnType<typeof createToolNameMapping>
>;
export type Experimental_SandboxSession =
  import('../integrations/internal/sandbox-base.js').SandboxSession;
export type Experimental_SandboxProcess =
  import('../integrations/internal/sandbox-base.js').Process;
export type Experimental_WritableSandboxProcess =
  Experimental_SandboxProcess & {
    readonly stdin: WritableStream<Uint8Array>;
  };

export type ToolExecutionOptions<C = unknown> = ExecutionOptions<C>;

type TypedExecution<I, A, C, E, R> = NonNullable<
  EffectToolOptions<I, A, E, R, C>['execute']
>;

export type ToolExecuteFunction<
  I,
  A,
  C = unknown,
  E = never,
  R = never,
> = TypedExecution<I, A, C, E, R>;

export type ToolNeedsApprovalFunction<I, C = unknown, E = never, R = never> = (
  input: I,
  options: Pick<ExecutionOptions<C>, 'toolCallId' | 'messages' | 'context'>,
) => Effect.Effect<boolean, E, R>;

export type FunctionTool<
  I = unknown,
  A = unknown,
  C = unknown,
  E = never,
  R = never,
> = Omit<EffectToolOptions<I, A, E, R, C>, 'type'> & {
  readonly type?: 'function';
};

export type DynamicTool<
  I = unknown,
  A = unknown,
  C = unknown,
  E = never,
  R = never,
> = Omit<FunctionTool<I, A, C, E, R>, 'type'> & { readonly type: 'dynamic' };

export type ProviderDefinedTool<
  I = unknown,
  A = unknown,
  R = never,
> = ProviderToolHandle<I, A, R> & { readonly isProviderExecuted: false };

export type ProviderExecutedTool<
  I = unknown,
  A = unknown,
  R = never,
> = ProviderToolHandle<I, A, R> & { readonly isProviderExecuted: true };

export type Tool<I = unknown, A = unknown, C = unknown, E = never, R = never> =
  | FunctionTool<I, A, C, E, R>
  | DynamicTool<I, A, C, E, R>
  | ProviderDefinedTool<I, A, R>
  | ProviderExecutedTool<I, A, R>;

export type ProviderDefinedToolFactory<
  I,
  Args extends object,
  C extends sdk.Context = {},
> = Effect.Success<
  ReturnType<typeof createProviderDefinedToolFactory<I, Args, C>>
>;

export type ProviderDefinedToolFactoryWithOutputSchema<
  I,
  A,
  Args extends object,
  C extends sdk.Context = {},
> = Effect.Success<
  ReturnType<
    typeof createProviderDefinedToolFactoryWithOutputSchema<I, A, Args, C>
  >
>;

export type ProviderExecutedToolFactory<
  I,
  A,
  Args extends object,
  C extends sdk.Context = {},
> = Effect.Success<
  ReturnType<typeof createProviderExecutedToolFactory<I, A, Args, C>>
>;

export type EmbeddingModelProviderOptionsTransformer<E = never, R = never> = (
  ...args: Parameters<sdk.EmbeddingModelProviderOptionsTransformer>
) => Effect.Effect<
  Awaited<ReturnType<sdk.EmbeddingModelProviderOptionsTransformer>>,
  E,
  R
>;
