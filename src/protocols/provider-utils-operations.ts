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
  type AdaptArguments,
  type AdaptedDescriptor,
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

/** Normalize one SDK value to a single-item array and preserve input arrays. */
export const asArray = <A>(value: sdk.Arrayable<A>) => sdk.asArray(value);
/** Collect values in argument order and omit `null` and `undefined`. */
export const filterNullable = <A>(...values: Array<A | undefined | null>) =>
  sdk.filterNullable(...values);
/**
 * Identify abort failures using the SDK error guard before classifying request errors.
 */
export const isAbortError = (input: unknown): input is Error =>
  sdk.isAbortError(input);
/** Recognize an `ArrayBuffer` with the SDK guard at a binary boundary. */
export const isArrayBuffer = (input: unknown): input is ArrayBuffer =>
  sdk.isArrayBuffer(input);
/** Detect a browser using the supplied runtime object or the SDK default host. */
export const isBrowserRuntime = (host?: unknown) => sdk.isBrowserRuntime(host);
/** Check for a Node buffer using the runtime-aware SDK guard. */
export const isBuffer = (input: unknown): input is Buffer =>
  sdk.isBuffer(input);
/**
 * Detect an explicit reasoning level or `none`. An omitted value leaves reasoning to the
 * provider.
 */
export const isCustomReasoning = (
  ...args: Parameters<typeof sdk.isCustomReasoning>
) => sdk.isCustomReasoning(...args);
/** Narrow an optional value to exclude both `null` and `undefined`. */
export const isNonNullable = <A>(
  input: A | undefined | null,
): input is NonNullable<A> => sdk.isNonNullable(input);
/**
 * Apply the SDK provider reference guard to distinguish model asset references from binary
 * payloads and URLs.
 */
export const isProviderReference = (
  ...args: Parameters<typeof sdk.isProviderReference>
) => sdk.isProviderReference(...args);
/** Identify the SDK stream error shape before handling a provider stream termination. */
export const isProviderStreamError = (
  ...args: Parameters<typeof sdk.isProviderStreamError>
) => sdk.isProviderStreamError(...args);
/** Apply the native object guard before reading fields from unknown SDK data. */
export const isRecord = (input: unknown): input is Record<string, unknown> =>
  sdk.isRecord(input);
/** Check for the native byte array type used by the binary provider paths. */
export const isUint8Array = (input: unknown): input is Uint8Array =>
  sdk.isUint8Array(input);
/** Omit undefined members before passing an options record to the SDK. */
export const removeUndefinedEntries = <A>(
  record: Record<string, A | undefined>,
) => sdk.removeUndefinedEntries(record);
/** Produce the SDK user-agent token for the supplied runtime or the default host. */
export const getRuntimeEnvironmentUserAgent = (host?: unknown) =>
  sdk.getRuntimeEnvironmentUserAgent(host);
/** Convert a native response header collection to the SDK record shape. */
export const extractResponseHeaders = (response: Response) =>
  sdk.extractResponseHeaders(response);
/**
 * Apply the native effort mapping and record SDK warnings when a model needs a fallback
 * effort level.
 */
export const mapReasoningToProviderEffort = <
  A extends string,
  B extends string = never,
>(
  options: Parameters<typeof sdk.mapReasoningToProviderEffort<A, B>>[0],
) => sdk.mapReasoningToProviderEffort<A, B>(options);

/**
 * Construct the native SDK download failure with its original options wrapped in
 * `AiSdkError`.
 */
export const DownloadError = wrapError(
  'ProviderUtils.DownloadError',
  sdk.DownloadError,
);
/** Classify download failures in the shared `AiSdkError` channel. */
export type DownloadError = AiSdkError;
/**
 * Construct an SDK model option serialization failure and preserve its native details in
 * `AiSdkError`.
 */
export const SerializationError = wrapError(
  'ProviderUtils.SerializationError',
  sdk.SerializationError,
);
/** Use the shared `AiSdkError` type for model serialization failures. */
export type SerializationError = AiSdkError;

/** Request cancellation when a caller will leave the native response body unread. */
export const cancelResponseBody = (response: Response) =>
  runRequest('ProviderUtils.cancelResponseBody', {}, () =>
    sdk.cancelResponseBody(response),
  );

/**
 * Start the SDK download when the Effect runs and pass runtime interruption to its abort
 * signal.
 */
export const downloadBlob = (
  url: string,
  options?: Parameters<typeof sdk.downloadBlob>[1],
) =>
  runRequest('ProviderUtils.downloadBlob', options ?? {}, (abortSignal) =>
    sdk.downloadBlob(url, { ...options, abortSignal }),
  );

/**
 * Carry the native response, download URL, byte budget, cancellation signal, and chunk
 * callback into the reader.
 */
type ReadResponseOptions = {
  readonly response: Response;
  readonly url: string;
  readonly maxBytes?: number;
  readonly abortSignal?: AbortSignal;
  readonly onChunk?: (chunk: Uint8Array) => void;
};

/**
 * Read the response within a byte budget. The scope owns the body reader and releases it
 * on interruption.
 */
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

/**
 * Run the SDK fetch with its untrusted-URL policy and pass through the caller cancellation
 * signal.
 */
export const fetchUntrustedUrl = (
  options: Parameters<typeof sdk.fetchUntrustedUrl>[0],
) =>
  runRequest('ProviderUtils.fetchUntrustedUrl', options, (abortSignal) =>
    sdk.fetchUntrustedUrl({ ...options, abortSignal }),
  );

/**
 * Delegate redirect validation to the SDK and propagate interruption to its request
 * signal.
 */
export const fetchWithValidatedRedirects = (
  options: Parameters<typeof sdk.fetchWithValidatedRedirects>[0],
) =>
  runRequest(
    'ProviderUtils.fetchWithValidatedRedirects',
    options,
    (abortSignal) =>
      sdk.fetchWithValidatedRedirects({ ...options, abortSignal }),
  );

/**
 * Use the native endpoint validation path while linking any request signal to Effect
 * interruption.
 */
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

/** Encode the record with the native FormData converter and map conversion failures. */
export const convertToFormData = <A extends Record<string, unknown>>(
  value: A,
  options?: Parameters<typeof sdk.convertToFormData<A>>[1],
) =>
  runSync('ProviderUtils.convertToFormData', () =>
    sdk.convertToFormData(value, options),
  );

/**
 * Allocate a native generator. Each ID request uses its current state when the returned
 * Effect runs.
 */
export const createIdGenerator = (
  options?: Parameters<typeof sdk.createIdGenerator>[0],
) =>
  runSync('ProviderUtils.createIdGenerator', () => {
    const generate = sdk.createIdGenerator(options);
    return () => runSync('ProviderUtils.generateId', generate);
  });

/** Create an SDK capture object whose append and read operations run inside Effects. */
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

/** Build the native bidirectional mapping between provider and application tool names. */
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

/**
 * Wait the given number of milliseconds on the Effect clock and observe an optional abort
 * signal.
 */
export const delay = (
  milliseconds?: number | null,
  options?: { abortSignal?: AbortSignal },
) => {
  const sleep = milliseconds ? Effect.sleep(milliseconds) : Effect.void;
  return options?.abortSignal
    ? abortable('ProviderUtils.delay', options.abortSignal, sleep)
    : sleep;
};

/**
 * Adapt an externally settled SDK promise. Consumers wait, resolve, and reject it through
 * Effects.
 */
export class DelayedPromise<A> {
  /** Allocate one native pending value per Effect execution. */
  static make<A>() {
    return runSync(
      'ProviderUtils.DelayedPromise.make',
      () => new DelayedPromise(new sdk.DelayedPromise<A>()),
    );
  }
  /** Keep one native state holder for the lifetime of this wrapper. */
  private constructor(private readonly native: sdk.DelayedPromise<A>) {}

  /**
   * Await native settlement through the request bridge. A rejection enters the typed
   * failure channel.
   */
  get promise() {
    return runRequest(
      'ProviderUtils.DelayedPromise.promise',
      {},
      () => this.native.promise,
    );
  }
  /** Settle the pending native promise with this value when the Effect runs. */
  resolve(value: A) {
    return runSync('ProviderUtils.DelayedPromise.resolve', () =>
      this.native.resolve(value),
    );
  }
  /** Settle the pending native promise with this failure when the Effect runs. */
  reject(error: unknown) {
    return runSync('ProviderUtils.DelayedPromise.reject', () =>
      this.native.reject(error),
    );
  }
  /** Read the native success state lazily. */
  isResolved() {
    return runSync('ProviderUtils.DelayedPromise.isResolved', () =>
      this.native.isResolved(),
    );
  }
  /** Read the native rejection state lazily. */
  isRejected() {
    return runSync('ProviderUtils.DelayedPromise.isRejected', () =>
      this.native.isRejected(),
    );
  }
  /** Read whether the native promise still awaits settlement. */
  isPending() {
    return runSync('ProviderUtils.DelayedPromise.isPending', () =>
      this.native.isPending(),
    );
  }
}

/** Expose the native transform input writer with an Effect stream for its output. */
type Transform<I, O> = {
  readonly writable: WritableStream<I>;
  readonly readable: Stream.Stream<O, AiSdkError>;
};

/** Keep the write side native and adapt the read side to a scoped Effect stream. */
const wrapTransform = <I, O>(
  name: string,
  transform: TransformStream<I, O>,
): Transform<I, O> => ({
  writable: transform.writable,
  readable: fromReadable(name, Effect.succeed(transform.readable)),
});

/** Create a native server-sent event parser with an Effect output stream. */
export const EventSourceParserStream = {
  make: () =>
    runSync('ProviderUtils.EventSourceParserStream.make', () =>
      wrapTransform('ProviderUtils.sse', new sdk.EventSourceParserStream()),
    ),
};
/**
 * Use the writer and Effect reader returned by `EventSourceParserStream.make` together.
 */
export type EventSourceParserStream = Effect.Success<
  ReturnType<typeof EventSourceParserStream.make>
>;

/**
 * Convert the native JSON response into tool stream parts under the supplied tool name.
 */
export const convertJsonResponseToolStream = (name: string) =>
  runSync('ProviderUtils.convertJsonResponseToolStream', () =>
    wrapTransform(
      'ProviderUtils.jsonToolStream',
      sdk.convertJsonResponseToolStream(name),
    ),
  );

/**
 * Expose values from the native iterator as an Effect stream and manage the intermediate
 * reader.
 */
export const convertAsyncIteratorToReadableStream = <A>(
  iterator: AsyncIterator<A>,
) =>
  fromReadable(
    'ProviderUtils.convertAsyncIteratorToReadableStream',
    runSync('ProviderUtils.convertAsyncIteratorToReadableStream', () =>
      sdk.convertAsyncIteratorToReadableStream(iterator),
    ),
  );

/**
 * Preserve the original payload for both validated values and per-event decoding failures.
 */
type EventResult<A> =
  | { readonly success: true; readonly value: A; readonly rawValue: unknown }
  | {
      readonly success: false;
      readonly error: AiSdkError;
      readonly rawValue: unknown;
    };

/**
 * Map a native validation failure to an `AiSdkError` while preserving the raw event value.
 */
const eventResult = <A>(value: sdk.ParseResult<A>): EventResult<A> =>
  value.success
    ? value
    : {
        ...value,
        error: sdkError('ProviderUtils.parseJsonEventStream', value.error),
      };

/**
 * Decode JSON events against an Effect schema and keep the schema environment for the
 * stream lifetime.
 */
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

/**
 * Send normalized tool-call parts to the consumer that owns the surrounding language
 * stream.
 */
type TrackerController = { enqueue(part: LanguageModelV4StreamPart): void };

/**
 * Configure native call IDs, delta validation, and metadata extraction for streaming tool
 * calls.
 */
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

/**
 * Track native incremental tool calls and expose processing and flushing through Effect.
 */
export class StreamingToolCallTracker<
  D extends sdk.StreamingToolCallDelta = sdk.StreamingToolCallDelta,
> {
  /**
   * Allocate a tracker that emits accumulated tool-call parts through the supplied
   * controller.
   */
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

  /** Keep the one native tracker that owns the buffered deltas. */
  private constructor(
    private readonly native: sdk.StreamingToolCallTracker<D>,
  ) {}

  /** Advance the native tracker with one tool-call delta and emit any resulting parts. */
  processDelta(delta: D) {
    return runSync('ProviderUtils.StreamingToolCallTracker.processDelta', () =>
      this.native.processDelta(delta),
    );
  }

  /**
   * Finish the tracked calls when the source stream ends and deliver the remaining parts.
   */
  flush() {
    return runSync('ProviderUtils.StreamingToolCallTracker.flush', () =>
      this.native.flush(),
    );
  }
}

/**
 * Apply SDK redaction before a value enters telemetry. Its original type remains available
 * to the caller.
 */
export const redactTelemetryValue = <A>(value: A) =>
  runSync('ProviderUtils.redactTelemetryValue', () =>
    sdk.redactTelemetryValue(value),
  );

/** Apply a caller-supplied redaction rule through the SDK telemetry mechanism. */
export const withTelemetryRedaction = <A extends Record<string, unknown>>(
  value: A,
  redact: (value: A) => A,
) =>
  runSync('ProviderUtils.withTelemetryRedaction', () =>
    sdk.withTelemetryRedaction(value, redact),
  );

/**
 * Return an SDK retry delay in milliseconds using the failure and the computed backoff
 * delay.
 */
export type RetryDelayProvider = (options: {
  error: unknown;
  exponentialBackoffDelay: number;
}) => number;

/** Build the terminal SDK retry error from its reason and ordered failure history. */
export type RetryErrorFactory = (options: {
  message: string;
  reason: sdk.RetryErrorReason;
  errors: unknown[];
}) => unknown;

/**
 * Configure backoff in milliseconds, abort handling, and an Effect predicate for retryable
 * failures.
 */
type RetryOptions<E, R> = {
  readonly maxRetries?: number;
  readonly initialDelayInMs?: number;
  readonly backoffFactor?: number;
  readonly abortSignal?: AbortSignal;
  readonly shouldRetry: (error: unknown) => Effect.Effect<boolean, E, R>;
  readonly getDelayInMs?: RetryDelayProvider;
  readonly createRetryError?: RetryErrorFactory;
};

/**
 * Rerun the Effect according to the native backoff policy and bind retry decisions to the
 * owning operation scope.
 */
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

/**
 * Allow direct, Promise-based, or Effect-based values before optional resolver callback
 * handling.
 */
type ResolvedValue<A, E, R> = A | PromiseLike<A> | Effect.Effect<A, E, R>;

/**
 * Supply an immediate value or a deferred callback. `resolve` executes the Effect or
 * native promise at use.
 */
export type Resolvable<A, E = never, R = never> =
  ResolvedValue<A, E, R> | (() => ResolvedValue<A, E, R>);

/**
 * Evaluate the resolver lazily and preserve its typed Effect errors. Map native throws and
 * rejected promises to `AiSdkError`.
 */
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

/**
 * Resolve the input before applying a transformation that can also return a Promise or
 * Effect.
 */
export const resolveWith = <A, B, E = never, R = never, F = never, S = never>(
  input: Resolvable<A, E, R>,
  transform: (value: A) => ResolvedValue<B, F, S>,
) => Effect.flatMap(resolve(input), (value) => resolve(() => transform(value)));

/**
 * Retain the optional header values recognized by the SDK model configuration serializer.
 */
type ModelHeaders = Record<string, string | undefined>;
/**
 * Expose the supported header inputs to the SDK serialization path, including a deferred
 * header factory.
 */
type SerializableConfiguration = {
  readonly headers?:
    | ModelHeaders
    | PromiseLike<ModelHeaders>
    | (() => ModelHeaders | PromiseLike<ModelHeaders>);
};

/**
 * Serialize the SDK model ID and configuration lazily with the native serialization rules.
 */
export const serializeModelOptions = <
  C extends SerializableConfiguration,
>(options: {
  readonly modelId: string;
  readonly config: C;
}) =>
  runSync('ProviderUtils.serializeModelOptions', () =>
    sdk.serializeModelOptions(options),
  );

/**
 * Decode the chosen provider options against the supplied Effect schema within a scoped
 * validator bridge.
 */
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

/**
 * Use the installed SDK response handler as the source of the transport callback protocol.
 */
type NativeHandler<A> = sdk.ResponseHandler<A>;
/**
 * Preserve the complete native response handler input, including metadata and request
 * context.
 */
type HandlerInput = Parameters<NativeHandler<unknown>>[0];
/**
 * Retain the resolved native response handler result after replacing the Promise with an
 * Effect.
 */
type HandlerResult<A> = Awaited<ReturnType<NativeHandler<A>>>;

/**
 * Read an SDK response through the Effect error channel with the native transport result
 * shape.
 */
export type ResponseHandler<A, E = AiSdkError, R = never> = (
  input: HandlerInput,
) => Effect.Effect<HandlerResult<A>, E, R>;

/** Allocate and invoke the SDK response handler inside the named request Effect. */
const handle = <A>(
  name: string,
  input: HandlerInput,
  native: () => NativeHandler<A>,
) => runRequest(name, {}, () => native()(input));

/** Read the response bytes with the native SDK binary handler when the Effect runs. */
export const createBinaryResponseHandler = () => (input: HandlerInput) =>
  handle(
    'ProviderUtils.binaryResponse',
    input,
    sdk.createBinaryResponseHandler,
  );

/** Read a binary response as a stream that remains owned by the calling scope. */
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

/**
 * Decode a JSON response with an Effect schema. Scope the decoder environment to this
 * response.
 */
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

/**
 * Parse a failed JSON response with the configured schema and normalize the SDK error
 * value.
 */
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

/**
 * Classify an unsuccessful response from its status code and return the SDK error as
 * `AiSdkError`.
 */
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

/**
 * Decode server-sent JSON events and retain per-event validation details in a scoped
 * stream.
 */
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

/**
 * Decode newline-delimited JSON using the supplied schema and adapt iterator failures to
 * `AiSdkError`.
 */
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

/**
 * Attach Effect response handlers and optional request cancellation to a transport
 * operation.
 */
type HttpHooks<A, E, R> = {
  readonly successfulResponseHandler: ResponseHandler<A, E, R>;
  readonly failedResponseHandler: ResponseHandler<Error, E, R>;
  readonly abortSignal?: AbortSignal;
};

/**
 * Describe the native Promise handlers and abort input replaced by the Effect request
 * bridge.
 */
type NativeHttpOptions<A> = {
  readonly successfulResponseHandler: NativeHandler<A>;
  readonly failedResponseHandler: NativeHandler<Error>;
  readonly abortSignal?: AbortSignal;
};

/**
 * Keep the native method settings while replacing its response handlers with Effect
 * callbacks.
 */
type HttpRequest<T, A, E, R> = Omit<T, keyof NativeHttpOptions<A>> &
  HttpHooks<A, E, R>;

/**
 * Bind native response callbacks to the request scope and restore an already wrapped
 * handler failure at the boundary.
 */
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

/**
 * Send a native DELETE request inside Effect and use the configured response handlers.
 */
export const deleteFromApi = <A, E = AiSdkError, R = never>(
  options: HttpRequest<Parameters<typeof sdk.deleteFromApi<A>>[0], A, E, R>,
) =>
  invokeHttp<Parameters<typeof sdk.deleteFromApi<A>>[0], A, E, R>(
    'ProviderUtils.deleteFromApi',
    options,
    sdk.deleteFromApi<A>,
  );

/** Send an SDK GET request with scoped response handlers and linked abort signals. */
export const getFromApi = <A, E = AiSdkError, R = never>(
  options: HttpRequest<Parameters<typeof sdk.getFromApi<A>>[0], A, E, R>,
) =>
  invokeHttp<Parameters<typeof sdk.getFromApi<A>>[0], A, E, R>(
    'ProviderUtils.getFromApi',
    options,
    sdk.getFromApi<A>,
  );

/** Post a native FormData body through the SDK with Effect response handlers. */
export const postFormDataToApi = <A, E = AiSdkError, R = never>(
  options: HttpRequest<Parameters<typeof sdk.postFormDataToApi<A>>[0], A, E, R>,
) =>
  invokeHttp<Parameters<typeof sdk.postFormDataToApi<A>>[0], A, E, R>(
    'ProviderUtils.postFormDataToApi',
    options,
    sdk.postFormDataToApi<A>,
  );

/** Post JSON with the SDK request options and use the adapted response handlers. */
export const postJsonToApi = <A, E = AiSdkError, R = never>(
  options: HttpRequest<Parameters<typeof sdk.postJsonToApi<A>>[0], A, E, R>,
) =>
  invokeHttp<Parameters<typeof sdk.postJsonToApi<A>>[0], A, E, R>(
    'ProviderUtils.postJsonToApi',
    options,
    sdk.postJsonToApi<A>,
  );

/**
 * Post native multipart streams with the SDK and scope their response handling to the
 * request.
 */
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

/**
 * Send a POST request with the native body settings and a scoped response handler bridge.
 */
export const postToApi = <A, E = AiSdkError, R = never>(
  options: HttpRequest<Parameters<typeof sdk.postToApi<A>>[0], A, E, R>,
) =>
  invokeHttp<Parameters<typeof sdk.postToApi<A>>[0], A, E, R>(
    'ProviderUtils.postToApi',
    options,
    sdk.postToApi<A>,
  );

export { tool } from '../internal/tool.js';

/**
 * Mark a tool descriptor as dynamic while retaining its supplied schema and Effect
 * callbacks.
 */
export const dynamicTool = <Input, Output, E, R, Context = unknown>(
  options: EffectToolOptions<Input, Output, E, R, Context>,
): DynamicTool<Input, Output, Context, E, R> => ({
  ...options,
  type: 'dynamic',
});

/**
 * Accept descriptors whose execution callback may be absent so a guard can narrow them
 * before execution.
 */
type ToolWithExecute = {
  readonly execute?: (
    ...args: never[]
  ) => Effect.Effect<unknown, unknown, unknown>;
};

/** Narrow the tool to one whose `execute` callback is available. */
export const isExecutableTool = <T extends ToolWithExecute>(
  tool: T | undefined,
): tool is T & { readonly execute: NonNullable<T['execute']> } =>
  typeof tool?.execute === 'function';

/**
 * Keep the call ID, conversation, context, and interruption options of the Effect tool
 * bridge.
 */
type ExecutionOptions<C> = EffectToolExecutionOptions<C>;

/** Allow a tool to emit one value or an Effect stream of values for one request. */
type Executable<I, A, C, E, R> = {
  readonly execute: (
    input: I,
    options: ExecutionOptions<C>,
  ) => Effect.Effect<A | Stream.Stream<A, E, R>, E, R> | Stream.Stream<A, E, R>;
};

/**
 * Distinguish intermediate streaming output from the final result that completes the tool
 * call.
 */
type ToolOutput<A> =
  | { readonly type: 'preliminary'; readonly output: A }
  | { readonly type: 'final'; readonly output: A | undefined };

/**
 * Stream tool output as preliminary parts. The final part carries the last emitted value
 * if the stream completes.
 */
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

/**
 * Read a configured tool caller annotation. Unannotated and absent tools both yield
 * `undefined`.
 */
export const experimental_getToolCaller = <
  R,
  Bound extends EffectTools[string],
  Prepare,
>(
  tool?: EffectTools[string] & {
    readonly experimental_toolCaller?: ToolCaller<R, Bound, Prepare>;
  },
) => tool?.experimental_toolCaller;

/** Use the native descriptor shape accepted by the Effect provider tool bridge. */
type NativeProviderTool = ReturnType<Parameters<typeof adaptProviderTool>[1]>;
/**
 * Preserve native factory arguments while returning an adapted Effect tool descriptor.
 */
type AdaptedFactory<Fn extends (...args: never[]) => object> = ReturnType<
  typeof adaptProviderTool<Parameters<Fn>, ReturnType<Fn> & NativeProviderTool>
>;

/**
 * Lift a native provider tool constructor without discarding its arguments or returned
 * descriptor shape.
 */
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

/**
 * Describe the provider tool ID and input schema before conversion to the SDK schema
 * format.
 */
type ToolFactoryOptions<Input> = {
  readonly id: `${string}.${string}`;
  readonly inputSchema: Schema.ConstraintDecoder<Input>;
  readonly redactArgs?: (
    args: Record<string, unknown>,
  ) => Record<string, unknown>;
};
/** Add an output schema for factories whose results need a typed SDK descriptor. */
type OutputToolFactoryOptions<Input, Output> = ToolFactoryOptions<Input> & {
  readonly outputSchema: Schema.ConstraintDecoder<Output>;
};

/** Create a reusable provider-defined tool factory with an adapted input schema. */
export const createProviderDefinedToolFactory = <
  I,
  Args extends object,
  C extends sdk.Context = {},
>(
  options: ToolFactoryOptions<I>,
): Effect.Effect<ProviderDefinedToolFactory<I, Args, C>, AiSdkError> =>
  runSync(
    'ProviderUtils.createProviderDefinedToolFactory',
    () =>
      adaptFactory(
        'ProviderUtils.createProviderDefinedTool',
        sdk.createProviderDefinedToolFactory<I, Args, C>({
          ...options,
          inputSchema: toSdkSchema(options.inputSchema),
        }),
      ) as ProviderDefinedToolFactory<I, Args, C>,
  );

/**
 * Create a provider-defined factory that keeps a typed output schema on its descriptor.
 */
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

/** Create a tool factory whose descriptors signal that the provider owns execution. */
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

/** Expose the native default limit in bytes for downloads without a supplied budget. */
export const DEFAULT_MAX_DOWNLOAD_SIZE = sdk.DEFAULT_MAX_DOWNLOAD_SIZE;
/** Expose the installed native provider utility package version. */
export const VERSION = sdk.VERSION;
/**
 * Use the SDK symbol that stores the provider model byte budget for a single embedding
 * call.
 */
export const EXPERIMENTAL_EMBEDDING_MODEL_MAX_INPUT_BYTES_PER_CALL: typeof sdk.EXPERIMENTAL_EMBEDDING_MODEL_MAX_INPUT_BYTES_PER_CALL =
  sdk.EXPERIMENTAL_EMBEDDING_MODEL_MAX_INPUT_BYTES_PER_CALL;
/** Use the SDK symbol that identifies the embedding provider option transformer. */
export const EXPERIMENTAL_EMBEDDING_MODEL_PROVIDER_OPTIONS_TRANSFORMER =
  sdk.EXPERIMENTAL_EMBEDDING_MODEL_PROVIDER_OPTIONS_TRANSFORMER;
/** Identify the native realtime speech frame that starts a synthesis stream. */
export const EXPERIMENTAL_SPEECH_STREAM_START_FRAME_TYPE =
  sdk.EXPERIMENTAL_SPEECH_STREAM_START_FRAME_TYPE;
/** Identify the native realtime speech frame containing another portion of input text. */
export const EXPERIMENTAL_SPEECH_STREAM_TEXT_DELTA_FRAME_TYPE =
  sdk.EXPERIMENTAL_SPEECH_STREAM_TEXT_DELTA_FRAME_TYPE;
/** Identify the native speech frame that completes text input. */
export const EXPERIMENTAL_SPEECH_STREAM_TEXT_DONE_FRAME_TYPE =
  sdk.EXPERIMENTAL_SPEECH_STREAM_TEXT_DONE_FRAME_TYPE;
/** Identify the native transcription frame that marks the end of audio input. */
export const EXPERIMENTAL_TRANSCRIPTION_STREAM_AUDIO_DONE_FRAME_TYPE =
  sdk.EXPERIMENTAL_TRANSCRIPTION_STREAM_AUDIO_DONE_FRAME_TYPE;
/** Identify the native frame that starts a transcription stream. */
export const EXPERIMENTAL_TRANSCRIPTION_STREAM_START_FRAME_TYPE =
  sdk.EXPERIMENTAL_TRANSCRIPTION_STREAM_START_FRAME_TYPE;
/**
 * Use the SDK well-known symbol for model serialization hooks and preserve symbol
 * identity.
 */
export const WORKFLOW_SERIALIZE: typeof sdk.WORKFLOW_SERIALIZE =
  sdk.WORKFLOW_SERIALIZE;
/**
 * Use the SDK well-known symbol for model restoration hooks and preserve symbol identity.
 */
export const WORKFLOW_DESERIALIZE: typeof sdk.WORKFLOW_DESERIALIZE =
  sdk.WORKFLOW_DESERIALIZE;

/**
 * Configure tool preparation and binding with Effect requirements carried in the tool
 * caller contract.
 */
export type Experimental_ToolCallerDefinition<
  R = never,
  Bound extends EffectTools[string] = EffectTools[string],
  Prepare = R,
> = ToolCaller<R, Bound, Prepare>;
/** Keep the concrete tool shape while requiring the attached tool caller annotation. */
export type Experimental_ToolCallerTool<
  T extends object = EffectTools[string],
  R = never,
  Bound extends EffectTools[string] = EffectTools[string],
  Prepare = R,
> = ToolWithCaller<T, R, Bound, Prepare>;
/**
 * Require an `execute` callback on a descriptor after checking its execution capability.
 */
export type ExecutableTool<T extends ToolWithExecute> = T & {
  readonly execute: NonNullable<T['execute']>;
};
/** Represent a reusable native retry policy adapted to run Effect operations. */
export type RetryFunction<E = never, R = never> = ReturnType<
  typeof retryWithExponentialBackoff<E, R>
>;
/** Return an Effect decision for a failed attempt before scheduling another retry. */
export type ShouldRetryFunction<E = never, R = never> = RetryOptions<
  E,
  R
>['shouldRetry'];
/** Generate each next ID as an Effect after the generator has been allocated. */
export type IdGenerator = Effect.Success<ReturnType<typeof createIdGenerator>>;
/** Translate tool names in either direction through the SDK mapping instance. */
export type ToolNameMapping = Effect.Success<
  ReturnType<typeof createToolNameMapping>
>;
/**
 * Expose the integration sandbox session to provider utility consumers with its Effect
 * operations.
 */
export type Experimental_SandboxSession =
  import('../integrations/internal/sandbox-base.js').SandboxSession;
/** Represent the Effect process handle returned by sandbox execution. */
export type Experimental_SandboxProcess =
  import('../integrations/internal/sandbox-base.js').Process;
/** Require a native byte writer for processes that accept input over stdin. */
export type Experimental_WritableSandboxProcess =
  Experimental_SandboxProcess & {
    readonly stdin: WritableStream<Uint8Array>;
  };

/** Provide call context and interruption options to Effect tool execution. */
export type ToolExecutionOptions<C = unknown> = ExecutionOptions<C>;

/**
 * Keep the exact execution callback signature from Effect tool options and require the
 * field.
 */
type TypedExecution<I, A, C, E, R> = NonNullable<
  EffectToolOptions<I, A, E, R, C>['execute']
>;

/**
 * Implement a tool body with the same call options and environment as the public tool
 * descriptor.
 */
export type ToolExecuteFunction<
  I,
  A,
  C = unknown,
  E = never,
  R = never,
> = TypedExecution<I, A, C, E, R>;

/** Decide approval from tool input, caller context, and history through an Effect. */
export type ToolNeedsApprovalFunction<I, C = unknown, E = never, R = never> = (
  input: I,
  options: Pick<ExecutionOptions<C>, 'toolCallId' | 'messages' | 'context'>,
) => Effect.Effect<boolean, E, R>;

/**
 * Describe an application function tool with typed inputs and optional Effect execution.
 */
export type FunctionTool<
  I = unknown,
  A = unknown,
  C = unknown,
  E = never,
  R = never,
> = Omit<EffectToolOptions<I, A, E, R, C>, 'type'> & {
  readonly type?: 'function';
};

/**
 * Set the dynamic discriminator on an application tool so the host can mark
 * runtime-defined tools.
 */
export type DynamicTool<
  I = unknown,
  A = unknown,
  C = unknown,
  E = never,
  R = never,
> = Omit<FunctionTool<I, A, C, E, R>, 'type'> & { readonly type: 'dynamic' };

/**
 * Use provider-defined schemas with execution available to the application where
 * configured.
 */
export type ProviderDefinedTool<
  I = unknown,
  A = unknown,
  R = never,
> = ProviderToolHandle<I, A, R> & { readonly isProviderExecuted: false };

/** Use a provider tool descriptor whose execution takes place on the provider. */
export type ProviderExecutedTool<
  I = unknown,
  A = unknown,
  R = never,
> = ProviderToolHandle<I, A, R> & { readonly isProviderExecuted: true };

/**
 * Unify application and provider tool descriptors while retaining their distinct execution
 * contracts.
 */
export type Tool<I = unknown, A = unknown, C = unknown, E = never, R = never> =
  | FunctionTool<I, A, C, E, R>
  | DynamicTool<I, A, C, E, R>
  | ProviderDefinedTool<I, A, R>
  | ProviderExecutedTool<I, A, R>;

// Both SDK factories accept the same settings after choosing an output type.
/**
 * Read the constructor arguments from the SDK tool factory so option inference follows the
 * SDK.
 */
type ProviderDefinedArgs<
  I,
  A,
  Args extends object,
  C extends sdk.Context,
> = Parameters<sdk.ProviderDefinedToolFactoryWithOutputSchema<I, A, Args, C>>;
/**
 * Adapt native factory inputs to allow Effect-based callbacks in the caller environment.
 */
type ProviderDefinedOptions<
  I,
  A,
  Args extends object,
  C extends sdk.Context,
  R,
> = AdaptArguments<ProviderDefinedArgs<I, A, Args, C>, R>[0];

/**
 * Infer adapted input and output options for a factory with a provider-defined descriptor.
 */
export type ProviderDefinedToolFactory<
  I,
  Args extends object,
  C extends sdk.Context = {},
> = {
  // Settings inference selects the second signature when no type arguments are supplied.
  <A, R = never, Provided = unknown>(
    options: Provided &
      (unknown extends Provided
        ? ProviderDefinedOptions<I, A, Args, C, R>
        : never),
  ): Effect.Effect<
    AdaptedDescriptor<
      ProviderDefinedArgs<I, A, Args, C>,
      sdk.ProviderDefinedTool<I, A, C> & NativeProviderTool,
      [ProviderDefinedOptions<I, A, Args, C, R>]
    >,
    AiSdkError
  >;
} & AdaptedFactory<sdk.ProviderDefinedToolFactory<I, Args, C>>;

/**
 * Produce application-side provider descriptors that retain the factory output schema.
 */
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

/** Produce provider-executed descriptors with native provider argument shapes. */
export type ProviderExecutedToolFactory<
  I,
  A,
  Args extends object,
  C extends sdk.Context = {},
> = Effect.Success<
  ReturnType<typeof createProviderExecutedToolFactory<I, A, Args, C>>
>;

/**
 * Transform native embedding provider options through Effect while retaining the SDK
 * argument list.
 */
export type EmbeddingModelProviderOptionsTransformer<E = never, R = never> = (
  ...args: Parameters<sdk.EmbeddingModelProviderOptionsTransformer>
) => Effect.Effect<
  Awaited<ReturnType<sdk.EmbeddingModelProviderOptionsTransformer>>,
  E,
  R
>;
