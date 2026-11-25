import * as sdk from '@ai-sdk/rsc';
import { Effect, Stream } from 'effect';
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
import type {
  AIActions,
  AIProvider,
  MutableAIState,
  OnGetUIState,
  OnSetAIState,
} from './rsc-types.js';

export type * from './rsc-types.js';

type Services<Actions extends AIActions> = Effect.Services<
  ReturnType<Actions[keyof Actions]>
>;

type CreateAIOptions<State, UI, Actions extends AIActions, R> = {
  readonly actions: Actions;
  readonly initialAIState?: State;
  readonly initialUIState?: UI;
  readonly onSetAIState?: OnSetAIState<State, R>;
  readonly onGetUIState?: OnGetUIState<UI, R>;
};

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

export function getAIState<AI extends sdk.AIProvider>(): Effect.Effect<
  Readonly<sdk.InferAIState<AI, unknown>>,
  AiSdkError
>;
export function getAIState<
  AI extends sdk.AIProvider,
  Key extends keyof sdk.InferAIState<AI, unknown> = keyof sdk.InferAIState<
    AI,
    unknown
  >,
>(
  key: Key,
): Effect.Effect<Readonly<sdk.InferAIState<AI, unknown>[Key]>, AiSdkError>;
export function getAIState<AI extends sdk.AIProvider>(
  key?: PropertyKey,
): Effect.Effect<unknown, AiSdkError> {
  return runSync('getAIState', () =>
    key === undefined
      ? sdk.getAIState<AI>()
      : sdk.getAIState<AI>(key as keyof sdk.InferAIState<AI, unknown>),
  );
}

type AIState<AI extends sdk.AIProvider> = sdk.InferAIState<AI, unknown>;

export function getMutableAIState<AI extends sdk.AIProvider>(): Effect.Effect<
  MutableAIState<AIState<AI>>,
  AiSdkError
>;
export function getMutableAIState<
  AI extends sdk.AIProvider,
  Key extends keyof AIState<AI> = keyof AIState<AI>,
>(key: Key): Effect.Effect<MutableAIState<AIState<AI>[Key]>, AiSdkError>;
export function getMutableAIState<AI extends sdk.AIProvider>(
  key?: PropertyKey,
): Effect.Effect<unknown, AiSdkError> {
  return runSync('getMutableAIState', () => {
    const state =
      key === undefined
        ? sdk.getMutableAIState<AI>()
        : sdk.getMutableAIState<AI>(key as keyof AIState<AI>);
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

type NativeStreamable<Hosted, A> = {
  readonly value: Hosted;
  update(value: A): unknown;
  append(value: A): unknown;
  error(error: unknown): unknown;
  done(...args: [] | [A]): unknown;
};

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

export const createStreamableUI = (initialValue?: ReactNode) =>
  scopedStreamable('createStreamableUI', () =>
    sdk.createStreamableUI(initialValue),
  );

export const createStreamableValue = <A, E = unknown>(
  initialValue?: A | ReadableStream<A>,
) =>
  scopedStreamable('createStreamableValue', () =>
    sdk.createStreamableValue<A, E>(initialValue),
  );

type NativeStreamUIOptions = Parameters<typeof sdk.streamUI>[0];
type StreamUIOptions<Options> = Options extends unknown
  ? Omit<Options, 'model'> & { readonly model: LanguageModelV4 }
  : never;

export const streamUI = (options: StreamUIOptions<NativeStreamUIOptions>) =>
  Effect.gen(function* () {
    const operation = 'streamUI';
    const owner = yield* openOperation(options.abortSignal);
    const model = unwrapLanguageModel(options.model);
    if (!model)
      return yield* sdkError(operation, 'Invalid language model handle');
    const { stream, ...result } = yield* runRequest(
      operation,
      { abortSignal: owner.signal },
      (abortSignal) =>
        sdk.streamUI(Object.assign({}, options, { model, abortSignal })),
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
