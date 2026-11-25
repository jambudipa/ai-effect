import type { ProviderOptions } from '@ai-sdk/provider-utils';
import {
  callCompletionApi as nativeCompletion,
  experimental_streamLanguageModelCall as nativeModelCall,
  smoothStream as nativeSmoothStream,
  type Experimental_DownloadFunction as NativeDownload,
  type GatewayModelId,
  type InferToolInput,
  type LanguageModel as NativeLanguageModel,
  type LanguageModelCallOptions,
  type LanguageModelStreamPart,
  type OnLanguageModelCallEndCallback,
  type OnLanguageModelCallStartCallback,
  type OutputInterface,
  type Prompt,
  type StreamTextTransform,
  type TextStreamPart,
  type ToolSet,
} from 'ai';
import { Effect, Option, Stream } from 'effect';
import {
  unwrapSandbox,
  type SandboxSession,
} from './integrations/internal/sandbox-base.js';
import {
  invoke,
  type CallbackResult,
  type Owner,
} from './internal/chat-boundary.js';
import { scopedStream } from './internal/chat-ui-stream.js';
import { guardedFetch } from './internal/fetch.js';
import {
  unwrapLanguageModel,
  type LanguageModelV4,
} from './internal/language-model.js';
import { unwrapLegacyModel } from './internal/legacy-model.js';
import {
  abortable,
  combineSignals,
  openOperation,
  runRequest,
  runSync,
  sdkError,
  type AiSdkError,
} from './internal/operation.js';
import { bindOutput, type OutputSpecification } from './internal/output.js';
import { streamMethod } from './internal/provider-model.js';
import {
  bindTools,
  type BoundTools,
  type EffectTools,
  type ToolServices,
} from './internal/tool.js';
import type { LanguageModelV2, LanguageModelV3 } from './protocols/provider.js';

type LanguageModel =
  GatewayModelId | LanguageModelV2 | LanguageModelV3 | LanguageModelV4;

export type CallCompletionApiOptions<R = never> = {
  readonly api: string;
  readonly prompt: string;
  readonly credentials?: RequestCredentials;
  readonly headers?: HeadersInit;
  readonly body?: Record<string, unknown>;
  readonly streamProtocol?: 'data' | 'text';
  readonly abortSignal?: AbortSignal;
  readonly fetch?: typeof globalThis.fetch;
  readonly setCompletion: (completion: string) => void;
  readonly setLoading: (loading: boolean) => void;
  readonly setError: (error: AiSdkError | undefined) => void;
  readonly setAbortController: (controller: AbortController | null) => void;
  readonly getAbortController?: () => AbortController | null | undefined;
  readonly onFinish?: (
    prompt: string,
    completion: string,
  ) => CallbackResult<void, R>;
  readonly onError?: (error: AiSdkError) => CallbackResult<void, R>;
};

/** Run a host completion request and own its handlers until it ends. */
export const callCompletionApi = <R = never>(
  options: CallCompletionApiOptions<R>,
) =>
  Effect.scoped(
    Effect.gen(function* () {
      const operation = 'callCompletionApi';
      const owner = yield* openOperation<R>(options.abortSignal);
      const {
        api,
        prompt,
        credentials,
        headers,
        body,
        streamProtocol,
        fetch,
        getAbortController,
        setAbortController,
        setCompletion,
        setLoading,
        setError,
        onFinish,
        onError,
      } = options;
      let active = Option.none<AbortController>();
      let failed = Option.none<AiSdkError>();
      let wasLoading = false;
      let completed = false;
      yield* Effect.addFinalizer(() =>
        runSync(operation, () => {
          if (Option.isSome(active)) {
            const controller = active.value;
            if (!completed) controller.abort();
            if (getAbortController && getAbortController() !== controller)
              return;
            setAbortController(Option.getOrNull(Option.none()));
          }
          if (wasLoading) setLoading(false);
        }).pipe(Effect.ignore),
      );
      const completion = yield* abortable(
        operation,
        owner.signal,
        runRequest(operation, { abortSignal: owner.signal }, () =>
          nativeCompletion({
            api,
            prompt,
            credentials,
            headers,
            body: body ?? {},
            streamProtocol,
            fetch: guardedFetch(owner.signal, fetch),
            ...(getAbortController ? { getAbortController } : {}),
            setAbortController: (controller) => {
              if (controller) {
                active = Option.some(controller);
                setAbortController(controller);
              }
            },
            setCompletion: (text) => {
              if (!owner.signal.aborted) setCompletion(text);
            },
            setLoading: (loading) => {
              if (loading) {
                wasLoading = true;
                setLoading(true);
              }
            },
            setError: (cause) => {
              const error = cause && sdkError(operation, cause);
              if (error) failed = Option.some(error);
              if (!owner.signal.aborted) setError(error);
            },
            onFinish: void 0,
            onError: (cause) => {
              failed = Option.some(sdkError(operation, cause));
            },
          }),
        ),
      );
      if (Option.isSome(failed)) {
        const error = failed.value;
        if (onError) {
          yield* invoke(`${operation}.onError`, () => onError(error)).pipe(
            Effect.mapError((cause) => sdkError(operation, cause)),
          );
        }
        return yield* Effect.fail(error);
      }
      if (typeof completion === 'string' && onFinish) {
        yield* invoke(`${operation}.onFinish`, () =>
          onFinish(prompt, completion),
        ).pipe(Effect.mapError((cause) => sdkError(operation, cause)));
      }
      completed = true;
      yield* owner.markComplete;
      return Option.fromNullishOr(completion);
    }),
  );

export type ChunkDetector = (buffer: string) => string | undefined | null;

export type SmoothStreamOptions<R = never> = {
  readonly delayInMs?: number | null;
  readonly chunking?: 'word' | 'line' | RegExp | ChunkDetector | Intl.Segmenter;
  readonly _internal?: {
    readonly delay?: (
      delayInMs: number | null,
    ) => Effect.Effect<void, unknown, R>;
  };
};

export interface SmoothStream {
  readonly apply: <T extends EffectTools, E, R>(
    source: Stream.Stream<TextStreamPart<BoundTools<T>>, E, R>,
  ) => Stream.Stream<TextStreamPart<BoundTools<T>>, AiSdkError, R>;
}

type BindSmooth = <Tools extends ToolSet>(
  owner: Owner<never>,
) => StreamTextTransform<Tools>;

const smoothBindings = new WeakMap<SmoothStream, BindSmooth>();

export const unwrapSmoothStream = <Tools extends ToolSet>(
  stream: SmoothStream,
  owner: Owner<never>,
): StreamTextTransform<Tools> | undefined =>
  smoothBindings.get(stream)?.<Tools>(owner);

/** Split and pace the SDK's text and reasoning deltas. */
export const smoothStream = <R = never>({
  _internal,
  ...options
}: SmoothStreamOptions<R> = {}) =>
  Effect.gen(function* () {
    const callbackContext = yield* Effect.context<R>();
    const operation = 'smoothStream';
    const customDelay = _internal?.delay;
    const bind: BindSmooth = <Tools extends ToolSet>(owner: Owner<never>) =>
      nativeSmoothStream<Tools>({
        ...options,
        _internal: {
          delay: (milliseconds) =>
            owner.runCallback(
              Effect.suspend(() =>
                customDelay
                  ? customDelay(milliseconds)
                  : Option.match(Option.fromNullishOr(milliseconds), {
                      onNone: () => Effect.void,
                      onSome: Effect.sleep,
                    }),
              ).pipe(Effect.provideContext(callbackContext)),
            ),
        },
      });
    const result: SmoothStream = {
      apply: <T extends EffectTools, E, Services>(
        source: Stream.Stream<TextStreamPart<BoundTools<T>>, E, Services>,
      ) =>
        Stream.unwrap(
          Effect.gen(function* () {
            const context = yield* Effect.context<Services>();
            const owner = yield* openOperation();
            const readable = yield* runSync(operation, () =>
              Stream.toReadableStreamWith(source, context, {
                signal: owner.signal,
              }).pipeThrough(
                bind<BoundTools<T>>(owner)({
                  tools: {} as BoundTools<T>,
                  stopStream: () => {},
                }),
                { signal: owner.signal },
              ),
            );
            return yield* scopedStream(operation, readable);
          }),
        ),
    };
    smoothBindings.set(result, bind);
    return result;
  });

type ModelCallOptions<T extends EffectTools, A, P, I> = Parameters<
  typeof nativeModelCall<BoundTools<T>, OutputInterface<A, P, I>>
>[0];
type ModelCallData<T extends EffectTools> = Prompt &
  LanguageModelCallOptions & {
    readonly toolOrder?: NonNullable<
      ModelCallOptions<T, string, string, never>['toolOrder']
    >;
    readonly toolChoice?: NonNullable<
      ModelCallOptions<T, string, string, never>['toolChoice']
    >;
    readonly abortSignal?: AbortSignal;
    readonly headers?: Record<string, string | undefined>;
    readonly includeRawChunks?: boolean;
    readonly providerOptions?: ProviderOptions;
    readonly callId?: string;
    readonly toolsContext?: NonNullable<
      ModelCallOptions<T, string, string, never>['toolsContext']
    >;
  };
type InitialEvent = Parameters<
  NonNullable<ModelCallOptions<{}, string, string, never>['onStart']>
>[0];
type StepStart = Parameters<OnLanguageModelCallStartCallback>[0];
type StepEnd<T extends EffectTools> = Parameters<
  OnLanguageModelCallEndCallback<BoundTools<T>>
>[0];
type Repair<T extends EffectTools> = NonNullable<
  ModelCallOptions<T, string, string, never>['repairToolCall']
>;
type Refinements<T extends EffectTools> = NonNullable<
  ModelCallOptions<T, string, string, never>['refineToolInput']
>;
type ToolInput<T extends EffectTools, Name extends keyof T> = InferToolInput<
  BoundTools<T>[Name]
>;
type RepairContext<T extends EffectTools> = Parameters<Repair<T>>[0];
type Trace = NonNullable<
  ModelCallOptions<
    {},
    string,
    string,
    never
  >['executeLanguageModelCallInTelemetryContext']
>;
type Lifecycle<A, R> =
  | ((event: A) => CallbackResult<void, R>)
  | readonly ((event: A) => CallbackResult<void, R>)[];
type TraceEvent = Parameters<Trace>[0];
type TraceContext<A> = Partial<StepStart> & {
  readonly callId: string;
  readonly recordInputs?: boolean;
  readonly recordOutputs?: boolean;
  readonly functionId?: string;
  readonly includeToolsContext?: TraceEvent['includeToolsContext'];
  readonly aiVersion?: string;
  readonly timestamp?: number;
  readonly durableContext?: TraceEvent['durableContext'];
  readonly execute: Effect.Effect<A, AiSdkError>;
};

export type StreamLanguageModelCallOptions<
  T extends EffectTools = {},
  A = string,
  P = A,
  I = never,
  R = never,
  OutputServices = never,
> = ModelCallData<T> & {
  readonly model: LanguageModel;
  readonly tools?: T;
  readonly output?: OutputSpecification<A, P, I, OutputServices>;
  readonly experimental_sandbox?: SandboxSession;
  readonly download?: (
    requests: Parameters<NativeDownload>[0],
  ) => CallbackResult<Awaited<ReturnType<NativeDownload>>, R>;
  readonly repairToolCall?: (context: {
    readonly instructions: RepairContext<T>['instructions'];
    readonly system: RepairContext<T>['system'];
    readonly messages: RepairContext<T>['messages'];
    readonly toolCall: RepairContext<T>['toolCall'];
    readonly abortSignal?: AbortSignal;
    readonly tools: T;
    readonly inputSchema: (
      ...args: Parameters<RepairContext<T>['inputSchema']>
    ) => Effect.Effect<
      Awaited<ReturnType<RepairContext<T>['inputSchema']>>,
      AiSdkError
    >;
    readonly error: AiSdkError;
  }) => CallbackResult<Awaited<ReturnType<Repair<T>>>, R>;
  readonly refineToolInput?: {
    readonly [Name in keyof T]?: (
      input: ToolInput<T, Name>,
    ) => CallbackResult<ToolInput<T, Name>, R>;
  };
  readonly executeLanguageModelCallInTelemetryContext?: <Value>(
    event: TraceContext<Value>,
  ) => Effect.Effect<Value, unknown, R>;
  readonly onStart?: (event: InitialEvent) => CallbackResult<void, R>;
  readonly onLanguageModelCallStart?: Lifecycle<StepStart, R>;
  readonly onLanguageModelCallEnd?: Lifecycle<StepEnd<T>, R>;
  readonly _internal?: {
    readonly generateId?: () => string;
    readonly generateCallId?: () => string;
    readonly now?: () => number;
    readonly collectContent?: boolean;
  };
};

/** Stream one native model call without a tool execution loop. */
export const experimental_streamLanguageModelCall = <
  T extends EffectTools = {},
  A = string,
  P = A,
  I = never,
  R = never,
  OutputServices = never,
>({
  model,
  tools,
  output,
  download,
  experimental_sandbox,
  repairToolCall,
  refineToolInput,
  executeLanguageModelCallInTelemetryContext,
  onStart,
  onLanguageModelCallStart,
  onLanguageModelCallEnd,
  ...options
}: StreamLanguageModelCallOptions<T, A, P, I, R, OutputServices>) =>
  Effect.gen(function* () {
    const operation = 'experimental_streamLanguageModelCall';
    const owner = yield* openOperation<ToolServices<T> | R | OutputServices>(
      options.abortSignal,
    );
    const nativeModel =
      typeof model === 'string'
        ? model
        : model.specificationVersion === 'v4'
          ? unwrapLanguageModel(model)
          : unwrapLegacyModel<
              Exclude<
                NativeLanguageModel,
                string | { specificationVersion: 'v4' }
              >
            >(model);
    const sandbox = experimental_sandbox && unwrapSandbox(experimental_sandbox);
    const nativeOutput = yield* runSync(
      operation,
      () => output && bindOutput(output, owner),
    );
    if (
      !nativeModel ||
      (experimental_sandbox && !sandbox) ||
      (output && !nativeOutput)
    ) {
      return yield* Effect.fail(
        sdkError(operation, 'Unknown model call handle'),
      );
    }
    const bind =
      <Value, Result>(
        name: string,
        callback: (value: Value) => CallbackResult<Result, R>,
      ) =>
      (value: Value) =>
        owner.runCallback(
          invoke(`${operation}.${name}`, () => callback(value)),
        );
    const bindMany = <Event>(name: string, callbacks: Lifecycle<Event, R>) =>
      typeof callbacks === 'function'
        ? bind(name, callbacks)
        : callbacks.map((callback) => bind(name, callback));
    const refinements = refineToolInput
      ? {
          refineToolInput: Object.fromEntries(
            Object.entries(refineToolInput).map(([name, callback]) => [
              name,
              bind('refineToolInput', callback),
            ]),
          ) as Refinements<T>,
        }
      : {};
    const trace: Trace = <Value>({
      execute,
      integrations: _nativeIntegrations,
      ...event
    }: Parameters<Trace>[0] & {
      execute: () => PromiseLike<Value>;
      integrations?: unknown;
    }) =>
      owner.runCallback(
        Effect.suspend(() =>
          executeLanguageModelCallInTelemetryContext
            ? executeLanguageModelCallInTelemetryContext({
                ...event,
                execute: runRequest(
                  `${operation}.execute`,
                  { abortSignal: owner.signal },
                  execute,
                ),
              })
            : runRequest(
                `${operation}.execute`,
                { abortSignal: owner.signal },
                execute,
              ),
        ),
      );
    const start = streamMethod(
      operation,
      ({ abortSignal }: { readonly abortSignal: AbortSignal }) =>
        nativeModelCall<BoundTools<T>, OutputInterface<A, P, I>>({
          ...options,
          model: nativeModel,
          abortSignal,
          ...(tools ? { tools: bindTools(tools, owner) } : {}),
          ...(nativeOutput ? { output: nativeOutput } : {}),
          ...(sandbox ? { experimental_sandbox: sandbox } : {}),
          ...(download
            ? {
                download: (requests) =>
                  bind(
                    'download',
                    download,
                  )(
                    requests.map((request) => ({
                      ...request,
                      abortSignal: combineSignals(
                        abortSignal,
                        request.abortSignal,
                      ),
                    })),
                  ),
              }
            : {}),
          ...(repairToolCall
            ? {
                repairToolCall: ({
                  tools: _sdkTools,
                  inputSchema,
                  error,
                  ...input
                }) =>
                  owner.runCallback(
                    invoke(`${operation}.repairToolCall`, () =>
                      repairToolCall({
                        ...input,
                        tools: tools ?? ({} as T),
                        inputSchema: (schema) =>
                          runRequest(
                            `${operation}.inputSchema`,
                            { abortSignal },
                            () => inputSchema(schema),
                          ),
                        error: sdkError(operation, error),
                      }),
                    ),
                    input.abortSignal,
                  ),
              }
            : {}),
          ...refinements,
          ...(executeLanguageModelCallInTelemetryContext
            ? { executeLanguageModelCallInTelemetryContext: trace }
            : {}),
          ...(onStart ? { onStart: bind('onStart', onStart) } : {}),
          ...(onLanguageModelCallStart
            ? {
                onLanguageModelCallStart: bindMany(
                  'onLanguageModelCallStart',
                  onLanguageModelCallStart,
                ),
              }
            : {}),
          ...(onLanguageModelCallEnd
            ? {
                onLanguageModelCallEnd: bindMany(
                  'onLanguageModelCallEnd',
                  onLanguageModelCallEnd,
                ),
              }
            : {}),
        }),
    );
    const { stream, ...metadata } = yield* abortable(
      operation,
      owner.signal,
      start({ abortSignal: owner.signal }),
    );
    const events = stream.pipe(
      Stream.mapEffect(
        Effect.fnUntraced(function* (
          event: LanguageModelStreamPart<BoundTools<T>>,
        ) {
          if (event.type === 'error')
            return yield* sdkError(operation, event.error);
          return event;
        }),
      ),
      Stream.onEnd(owner.markComplete),
    );
    return { ...metadata, stream: events };
  });
