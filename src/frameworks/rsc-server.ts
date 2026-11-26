import * as sdk from '@ai-sdk/rsc';
import type { LanguageModelCallOptions, Prompt } from 'ai';
import { Effect, Schema, Stream } from 'effect';
import type { ReactNode } from 'react';
import {
  unwrapLanguageModel,
  type LanguageModelV4,
} from '../internal/language-model.js';
import {
  openOperation,
  runRequest,
  runSync,
  sdkError,
  type AiSdkError,
} from '../internal/operation.js';
import { ownReadable } from '../internal/readable.js';
import { toSdkSchema } from '../internal/schema.js';
import type {
  AIActions,
  AIProvider,
  InferAIState,
  MutableAIState,
  OnGetUIState,
  OnSetAIState,
  ProviderComponent,
} from './rsc-types.js';

export type * from './rsc-types.js';

/**
 * Collect the Effect service requirements shared by the provider actions before wrapping
 * them.
 */
type Services<Actions extends AIActions> = Effect.Services<
  ReturnType<Actions[keyof Actions]>
>;

/** Supply the native provider settings with Effect actions and server state callbacks. */
type CreateAIOptions<State, UI, Actions extends AIActions, R> = {
  readonly actions: Actions;
  readonly initialAIState?: State;
  readonly initialUIState?: UI;
  readonly onSetAIState?: OnSetAIState<State, R>;
  readonly onGetUIState?: OnGetUIState<UI, R>;
};

/**
 * Build the native RSC provider and capture the service context for its scoped actions and
 * state callbacks.
 */
export const createAI = <State, UI, Actions extends AIActions, R = never>(
  options: CreateAIOptions<State, UI, Actions, R>,
) =>
  Effect.gen(function* () {
    const context = yield* Effect.context<Services<Actions> | R>();
    const run = Effect.runPromiseWith(context);
    return yield* runSync('createAI', () => {
      const { actions, onSetAIState, onGetUIState, ...settings } = options;
      const nativeActions = Object.fromEntries(
        Object.entries(actions).map(([name, action]) => [
          name,
          (...args: unknown[]) =>
            run(
              Effect.scoped(
                Effect.suspend(() =>
                  (
                    action as (
                      ...args: unknown[]
                    ) => ReturnType<Actions[keyof Actions]>
                  )(...args),
                ),
              ),
            ),
        ]),
      );
      const provider = sdk.createAI<State, UI, typeof nativeActions>({
        ...settings,
        actions: nativeActions,
        ...(onSetAIState
          ? {
              onSetAIState: (event: Parameters<sdk.OnSetAIState<State>>[0]) =>
                run(Effect.scoped(Effect.suspend(() => onSetAIState(event)))),
            }
          : {}),
        ...(onGetUIState
          ? {
              onGetUIState: () =>
                run(Effect.scoped(Effect.suspend(onGetUIState))),
            }
          : {}),
      });
      const component: AIProvider<State, UI, Actions> = ({
        $ActionTypes,
        ...props
      }) => provider(props);
      return component;
    });
  });

/**
 * Read a snapshot of the complete server state from the current provider action context.
 */
export function getAIState<AI extends ProviderComponent>(): Effect.Effect<
  Readonly<InferAIState<AI, unknown>>,
  AiSdkError
>;
/** Read one server state field while retaining its type from the provider component. */
export function getAIState<
  AI extends ProviderComponent,
  Key extends keyof InferAIState<AI, unknown> = keyof InferAIState<AI, unknown>,
>(
  key: Key,
): Effect.Effect<Readonly<InferAIState<AI, unknown>[Key]>, AiSdkError>;
/** Read a server state field when the caller does not supply a concrete provider type. */
export function getAIState(
  key: PropertyKey,
): Effect.Effect<unknown, AiSdkError>;
export function getAIState(
  key?: PropertyKey,
): Effect.Effect<unknown, AiSdkError> {
  return runSync('getAIState', () =>
    key === undefined ? sdk.getAIState() : sdk.getAIState(key),
  );
}

/** Infer the mutable server state type from the provided RSC component contract. */
type AIState<AI extends ProviderComponent> = InferAIState<AI, unknown>;

/** Get a writer for the complete server state in the active provider action. */
export function getMutableAIState<
  AI extends ProviderComponent,
>(): Effect.Effect<MutableAIState<AIState<AI>>, AiSdkError>;
/** Get a writer limited to the selected typed field of the server state. */
export function getMutableAIState<
  AI extends ProviderComponent,
  Key extends keyof AIState<AI> = keyof AIState<AI>,
>(key: Key): Effect.Effect<MutableAIState<AIState<AI>[Key]>, AiSdkError>;
/** Get a keyed state writer when the concrete provider type is unavailable. */
export function getMutableAIState(
  key: PropertyKey,
): Effect.Effect<MutableAIState<unknown>, AiSdkError>;
export function getMutableAIState(
  key?: PropertyKey,
): Effect.Effect<unknown, AiSdkError> {
  return runSync('getMutableAIState', () => {
    const state =
      key === undefined ? sdk.getMutableAIState() : sdk.getMutableAIState(key);
    const handle: MutableAIState<ReturnType<typeof state.get>> = {
      get: () => runSync('MutableAIState.get', state.get),
      update: (next) =>
        runSync('MutableAIState.update', () => state.update(next)),
      done: (...args) =>
        runSync('MutableAIState.done', () => {
          if (args.length) state.done(args[0]);
          else (state.done as () => void)();
        }),
    };
    return handle;
  });
}

/** Describe the synchronous native handle that backs a server value or UI node stream. */
type NativeStreamable<Hosted, A> = {
  readonly value: Hosted;
  update(value: A): unknown;
  append(value: A): unknown;
  error(error: unknown): unknown;
  done(...args: [] | [A]): unknown;
};

/** Expose the native streamable value and lazy commands for updates and finalization. */
type Streamable<Hosted, A> = {
  readonly value: Hosted;
  readonly update: (
    value: A,
  ) => Effect.Effect<Streamable<Hosted, A>, AiSdkError>;
  readonly append: (
    value: A,
  ) => Effect.Effect<Streamable<Hosted, A>, AiSdkError>;
  readonly error: (
    error: unknown,
  ) => Effect.Effect<Streamable<Hosted, A>, AiSdkError>;
  readonly done: (
    ...args: [] | [A]
  ) => Effect.Effect<Streamable<Hosted, A>, AiSdkError>;
};

/**
 * Acquire the native writer in a scope and complete it on release unless it already ended.
 */
const scopedStreamable = <Hosted, A>(
  name: string,
  create: () => NativeStreamable<Hosted, A>,
) =>
  Effect.acquireRelease(
    runSync(name, () => ({ native: create(), closed: false })),
    (handle) =>
      Effect.ignore(
        runSync(name, () => {
          if (!handle.closed) handle.native.done();
        }),
      ),
  ).pipe(
    Effect.map((handle) => {
      const sdk = handle.native;
      const api: Streamable<Hosted, A> = {
        get value() {
          return sdk.value;
        },
        update: (value) =>
          runSync(`${name}.update`, () => {
            sdk.update(value);
            return api;
          }),
        append: (value) =>
          runSync(`${name}.append`, () => {
            sdk.append(value);
            return api;
          }),
        error: (cause) =>
          runSync(`${name}.error`, () => {
            sdk.error(sdkError(`${name}.error`, cause));
            handle.closed = true;
            return api;
          }),
        done: (...args) =>
          runSync(`${name}.done`, () => {
            sdk.done(...args);
            handle.closed = true;
            return api;
          }),
      };
      return api;
    }),
  );

/**
 * Create a scoped writer for streaming React nodes. Pass its hosted value to the client.
 */
export const createStreamableUI = (initialValue?: ReactNode) =>
  scopedStreamable('createStreamableUI', () =>
    sdk.createStreamableUI(initialValue),
  );

/** Create a scoped writer for streaming typed values from a server action. */
export const createStreamableValue = <A, E = unknown>(
  initialValue?: A | ReadableStream<A>,
) =>
  scopedStreamable('createStreamableValue', () =>
    sdk.createStreamableValue<A, E>(initialValue),
  );

/** Associate each stream UI tool name with the Effect decoder for its input. */
type RenderSchemas = Readonly<
  Record<string, Schema.ConstraintDecoder<unknown>>
>;
/**
 * Keep each tool input type when its decoder becomes the native SDK validation schema.
 */
type BoundSchemas<Tools extends RenderSchemas> = {
  [K in keyof Tools]: ReturnType<typeof toSdkSchema<Tools[K]['Type'], never>>;
};
/**
 * Derive the native stream UI options with the converted schemas for the selected tools.
 */
type NativeStreamUIOptions<Tools extends RenderSchemas> = Parameters<
  typeof sdk.streamUI<BoundSchemas<Tools>>
>[0];
/**
 * Permit immediate or asynchronous React node results at the native renderer boundary.
 */
type RenderNode = ReactNode | Promise<ReactNode>;
/**
 * Allow native node renderers, incremental generators, and Effect renderers in the
 * operation environment.
 */
type HostRenderer<Args extends unknown[], R> = (
  ...args: Args
) =>
  | RenderNode
  | Generator<RenderNode, RenderNode, void>
  | AsyncGenerator<RenderNode, RenderNode, void>
  | Effect.Effect<ReactNode, unknown, R>;
/** Use the native stream UI completion payload when invoking the caller Effect hook. */
type FinishEvent = Parameters<
  NonNullable<NativeStreamUIOptions<{}>['onFinish']>
>[0];
/**
 * Configure a wrapped model and optional typed tool and text renderers for an RSC request.
 */
type StreamUIOptions<
  Tools extends RenderSchemas,
  R,
> = LanguageModelCallOptions &
  Prompt & {
    readonly model: LanguageModelV4;
    readonly tools?: {
      [K in keyof Tools]: {
        readonly description?: string;
        readonly inputSchema: Tools[K];
        readonly generate?: HostRenderer<
          [Tools[K]['Type'], { toolName: string; toolCallId: string }],
          R
        >;
      };
    };
    readonly toolChoice?: Exclude<
      NativeStreamUIOptions<Tools>['toolChoice'],
      undefined
    >;
    readonly initial?: ReactNode;
    readonly providerOptions?: Exclude<
      NativeStreamUIOptions<Tools>['providerOptions'],
      undefined
    >;
    readonly maxRetries?: number;
    readonly headers?: Record<string, string | undefined>;
    readonly abortSignal?: AbortSignal;
    readonly text?: HostRenderer<
      [{ content: string; delta: string; done: boolean }],
      R
    >;
    readonly onFinish?: (event: FinishEvent) => Effect.Effect<void, unknown, R>;
  };

/**
 * Start native RSC rendering in the caller scope and adapt its raw event reader to an
 * Effect stream.
 */
export const streamUI = <Tools extends RenderSchemas = {}, R = never>(
  options: StreamUIOptions<Tools, R>,
) =>
  Effect.gen(function* () {
    const operation = 'streamUI';
    const owner = yield* openOperation<R>(options.abortSignal);
    const model = unwrapLanguageModel(options.model);
    if (!model)
      return yield* sdkError(operation, 'Invalid language model handle');
    const renderer =
      <Args extends unknown[], A>(
        callback: (...args: Args) => A | Effect.Effect<ReactNode, unknown, R>,
      ) =>
      (...args: Args): A | Promise<ReactNode> => {
        if (owner.signal.aborted) {
          return owner.runCallback(
            Effect.fail(sdkError(operation, owner.signal.reason)),
          );
        }
        const rendered = callback(...args);
        return Effect.isEffect(rendered)
          ? owner.runCallback(rendered as Effect.Effect<ReactNode, unknown, R>)
          : rendered;
      };
    const { text, onFinish, tools, ...settings } = options;
    const { stream, ...result } = yield* runRequest(
      operation,
      { abortSignal: owner.signal },
      (abortSignal) => {
        const boundTools =
          tools &&
          Object.fromEntries(
            Object.entries(tools).map(([name, tool]) => {
              const { generate, inputSchema, ...toolOptions } = tool;
              return [
                name,
                {
                  ...toolOptions,
                  inputSchema: toSdkSchema(inputSchema),
                  ...(generate ? { generate: renderer(generate) } : {}),
                },
              ];
            }),
          );
        return sdk.streamUI<BoundSchemas<Tools>>({
          ...settings,
          model,
          abortSignal,
          ...(boundTools ? { tools: boundTools } : {}),
          ...(text ? { text: renderer(text) } : {}),
          ...(onFinish
            ? {
                onFinish: (event: FinishEvent) =>
                  owner.runCallback(Effect.suspend(() => onFinish(event))),
              }
            : {}),
        } as unknown as NativeStreamUIOptions<Tools>);
      },
    );
    const readable = yield* ownReadable(operation, stream);
    return {
      ...result,
      stream: Stream.fromReadableStream({
        evaluate: () => readable,
        onError: (cause) => sdkError(operation, cause),
        releaseLockOnEnd: true,
      }),
    };
  });
