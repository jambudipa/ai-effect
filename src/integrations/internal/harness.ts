import type {
  HarnessV1 as NativeHarness,
  HarnessV1ContinueTurnOptions as NativeContinueTurnOptions,
  HarnessV1CredentialForwarding as NativeCredentialForwarding,
  HarnessV1Diagnostic,
  HarnessV1Observability as NativeObservability,
  HarnessV1PromptControl as NativeControl,
  HarnessV1PromptTurnOptions as NativePromptOptions,
  HarnessV1Session as NativeSession,
  HarnessV1StartOptions as NativeStartOptions,
  HarnessV1StreamPart,
} from './harness-contracts/harness.js';
import type { ToolSet } from '@ai-sdk/provider-utils';
import { Cause, Effect, Fiber, Queue, Ref, Stream } from 'effect';
import {
  type AiSdkError,
  openOperation,
  runRequest,
  runSync,
  sdkError,
} from '../../internal/operation.js';
import { type SandboxSession, unwrapSandbox } from './sandbox.js';
import { wrapSchema } from './schema.js';
import { wrapTools } from './sdk-tool.js';

export type HarnessV1Observability = Omit<NativeObservability, 'report'> & {
  readonly report?: (event: HarnessV1Diagnostic) => void;
};

export type HarnessV1StartOptions = Omit<
  NativeStartOptions,
  'sandboxSession' | 'observability'
> & {
  readonly sandboxSession: SandboxSession;
  readonly observability?: HarnessV1Observability;
};

type EffectEmit<E, R> = {
  readonly emit: (event: HarnessV1StreamPart) => Effect.Effect<void, E, R>;
};
export type HarnessV1PromptTurnOptions<E = never, R = never> = Omit<
  NativePromptOptions,
  'emit'
> &
  EffectEmit<E, R>;
export type HarnessV1ContinueTurnOptions<E = never, R = never> = Omit<
  NativeContinueTurnOptions,
  'emit'
> &
  EffectEmit<E, R>;

const bindTurn =
  <O extends { abortSignal?: AbortSignal }>(
    name: string,
    invoke: (
      options: O & { emit: (event: HarnessV1StreamPart) => void },
    ) => PromiseLike<NativeControl>,
  ) =>
  <E, R>(options: O & EffectEmit<E, R>) =>
    Effect.gen(function* () {
      const { emit, ...rest } = options;
      const owner = yield* openOperation(rest.abortSignal);
      const events = yield* Queue.unbounded<
        HarnessV1StreamPart,
        Cause.Done | AiSdkError
      >();
      const start = runRequest(
        name,
        { abortSignal: owner.signal },
        (abortSignal) =>
          invoke({
            ...rest,
            abortSignal,
            emit: (event: HarnessV1StreamPart) => {
              if (!owner.signal.aborted) Queue.offerUnsafe(events, event);
            },
          } as unknown as O & { emit: (event: HarnessV1StreamPart) => void }),
      );
      const drain = yield* Effect.forkScoped(
        Stream.runForEach(Stream.fromQueue(events), emit),
      );
      const native = yield* start;
      const complete = runRequest(
        `${name}.done`,
        { abortSignal: owner.signal },
        () => native.done,
      ).pipe(
        Effect.onExit((exit) =>
          exit._tag === 'Success'
            ? Queue.end(events)
            : Queue.failCause(events, exit.cause),
        ),
      );
      const finished = yield* Effect.forkScoped(complete);
      const approval = native.submitToolApproval?.bind(native);
      const userMessage = native.submitUserMessage?.bind(native);
      return {
        submitToolResult: (
          input: Parameters<NativeControl['submitToolResult']>[0],
        ) =>
          runRequest(
            `${name}.submitToolResult`,
            { abortSignal: owner.signal },
            () => native.submitToolResult(input),
          ),
        ...(approval && {
          submitToolApproval: (input: Parameters<typeof approval>[0]) =>
            runRequest(
              `${name}.submitToolApproval`,
              { abortSignal: owner.signal },
              () => approval(input),
            ),
        }),
        ...(userMessage && {
          submitUserMessage: (text: string) =>
            runRequest(
              `${name}.submitUserMessage`,
              { abortSignal: owner.signal },
              () => userMessage(text),
            ),
        }),
        done: Effect.andThen(Fiber.join(finished), Fiber.join(drain)),
      };
    });

export type HarnessV1PromptControl<E = never> = Effect.Success<
  ReturnType<ReturnType<typeof bindTurn<NativePromptOptions>>>
> & { readonly done: Effect.Effect<void, AiSdkError | E> };

const wrapSession = (native: NativeSession, closed: Ref.Ref<boolean>) => {
  const readHistory = native.doReadHistory?.bind(native);
  const finish = <A>(name: string, end: () => PromiseLike<A>) =>
    Effect.uninterruptible(
      Effect.gen(function* () {
        const wasClosed = yield* Ref.getAndSet(closed, true);
        if (wasClosed)
          return yield* Effect.fail(
            sdkError(name, 'Harness session is closed'),
          );
        return yield* runRequest(name, {}, end).pipe(
          Effect.tapError(() => Ref.set(closed, false)),
        );
      }),
    );
  return {
    sessionId: native.sessionId,
    isResume: native.isResume,
    doPromptTurn: bindTurn<Omit<NativePromptOptions, 'emit'>>(
      'Harness.doPromptTurn',
      native.doPromptTurn.bind(native),
    ),
    doContinueTurn: bindTurn<Omit<NativeContinueTurnOptions, 'emit'>>(
      'Harness.doContinueTurn',
      native.doContinueTurn.bind(native),
    ),
    doSuspendTurn: runRequest('Harness.doSuspendTurn', {}, () =>
      native.doSuspendTurn(),
    ),
    doCompact: (instructions?: string) =>
      runRequest('Harness.doCompact', {}, () => native.doCompact(instructions)),
    ...(readHistory && {
      doReadHistory: (options: Parameters<typeof readHistory>[0]) =>
        runRequest('Harness.doReadHistory', {}, () => readHistory(options)),
    }),
    doDetach: finish('Harness.doDetach', () => native.doDetach()),
    doStop: finish('Harness.doStop', () => native.doStop()),
    doDestroy: finish('Harness.doDestroy', () => native.doDestroy()),
  };
};

export type HarnessV1Session = ReturnType<typeof wrapSession>;

const harnesses = new WeakMap<object, NativeHarness>();

type HarnessData<T extends Record<string, object>> = Omit<
  NativeHarness,
  'builtinTools'
> & {
  readonly builtinTools: T;
};

export const wrapHarness = <T extends Record<string, object>>(
  native: HarnessData<T>,
) => {
  const bootstrap = native.getBootstrap?.bind(native);
  const harness = {
    specificationVersion: native.specificationVersion,
    harnessId: native.harnessId,
    builtinTools: wrapTools(
      `Harness.${native.harnessId}.builtinTools`,
      native.builtinTools,
    ),
    ...(native.supportsBuiltinToolApprovals && {
      supportsBuiltinToolApprovals: true,
    }),
    ...(native.supportsBuiltinToolFiltering && {
      supportsBuiltinToolFiltering: true,
    }),
    ...(native.lifecycleStateSchema && {
      lifecycleStateSchema: wrapSchema(
        'Harness.lifecycleStateSchema',
        native.lifecycleStateSchema,
      ),
    }),
    ...(bootstrap && {
      getBootstrap: (options: { abortSignal?: AbortSignal } = {}) =>
        runRequest('Harness.getBootstrap', options, (abortSignal) =>
          bootstrap({ ...options, abortSignal }),
        ),
    }),
    doStart: (options: HarnessV1StartOptions) =>
      Effect.gen(function* () {
        const sandboxSession = unwrapSandbox(options.sandboxSession);
        if (!sandboxSession) {
          return yield* Effect.fail(
            sdkError('Harness.doStart', 'Invalid sandbox session'),
          );
        }
        const closed = yield* Ref.make(false);
        const session = yield* Effect.acquireRelease(
          runRequest('Harness.doStart', options, (abortSignal) =>
            native.doStart({ ...options, sandboxSession, abortSignal }),
          ),
          (session) =>
            Effect.gen(function* () {
              const wasClosed = yield* Ref.getAndSet(closed, true);
              if (!wasClosed) {
                yield* runRequest('Harness.doStart.release', {}, () =>
                  session.doDestroy(),
                ).pipe(
                  Effect.catchTag('AiSdkError', (error) =>
                    Effect.logWarning('Harness release failed', error),
                  ),
                );
              }
            }),
          { interruptible: true },
        );
        return wrapSession(session, closed);
      }),
  };
  harnesses.set(harness, native as unknown as NativeHarness);
  return harness;
};

export type HarnessV1<T extends Record<string, object> = ToolSet> = ReturnType<
  typeof wrapHarness<T>
>;

export const unwrapHarness = (value: object) => harnesses.get(value);

export type HarnessV1CredentialForwarding<R = never, E = never> = (
  options: Parameters<NativeCredentialForwarding>[0],
) => Effect.Effect<string, E, R>;

export type WithCredentialForwarding<Settings, R = never, E = never> = Omit<
  Settings,
  'credentialForwarding'
> & {
  readonly credentialForwarding?: HarnessV1CredentialForwarding<R, E>;
};

export const makeWithCredentialForwarding = <
  Settings extends {
    readonly credentialForwarding?: NativeCredentialForwarding;
  },
  Tools extends Record<string, object>,
  R,
  E,
>(
  create: (settings?: Settings) => HarnessData<Tools>,
  options?: WithCredentialForwarding<Settings, R, E>,
) =>
  Effect.gen(function* () {
    const owner = yield* openOperation<R>();
    const { credentialForwarding, ...settings } = options ?? {};
    const nativeOptions = {
      ...settings,
      ...(credentialForwarding && {
        credentialForwarding: (
          input: Parameters<NativeCredentialForwarding>[0],
        ) => owner.runCallback(credentialForwarding(input)),
      }),
    } as unknown as Settings;
    return yield* runSync('Harness.make', () =>
      wrapHarness(create(nativeOptions)),
    );
  });
