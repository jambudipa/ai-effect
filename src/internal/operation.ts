import { Cause, Effect, Exit, FiberSet, Redacted, Ref, Schema } from 'effect';

/** A foreign SDK failure with only safe diagnostic fields visible. */
export class AiSdkError extends Schema.TaggedError<AiSdkError>()('AiSdkError', {
  operation: Schema.String,
  category: Schema.String,
  status: Schema.optionalKey(Schema.Number),
  requestId: Schema.optionalKey(Schema.String),
  cause: Schema.Redacted(Schema.Defect(), { disallowJsonEncode: true }),
}) {}

export const sdkError = (operation: string, cause: unknown): AiSdkError => {
  const error =
    typeof cause === 'object' && cause
      ? (cause as Record<string, unknown>)
      : {};
  const category =
    typeof error.name === 'string' &&
    (/^AI_[a-zA-Z]+Error$/u.test(error.name) ||
      /^Gateway(?:AccessPolicyDenied|Authentication|FailedDependency|Forbidden|InternalServer|InvalidRequest|ModelNotFound|NotFound|RateLimit|Response)?Error$/u.test(
        error.name,
      ))
      ? error.name
      : 'Error';
  const headers = error.responseHeaders as Record<string, unknown> | undefined;
  const requestId =
    headers?.['x-request-id'] ??
    headers?.['request-id'] ??
    headers?.['x-cerebras-request-id'] ??
    error.generationId;
  return new AiSdkError({
    operation,
    category,
    ...(typeof error.statusCode === 'number'
      ? { status: error.statusCode }
      : {}),
    ...(typeof requestId === 'string' ? { requestId } : {}),
    cause: Redacted.make(cause),
  });
};

export const combineSignals = (
  signal: AbortSignal,
  callerSignal?: AbortSignal,
) => (callerSignal ? AbortSignal.any([signal, callerSignal]) : signal);

export const runSync = <A>(operation: string, run: () => A) =>
  Effect.try({ try: run, catch: (cause) => sdkError(operation, cause) });

export const runRequest = <A>(
  operation: string,
  options: { readonly abortSignal?: AbortSignal },
  request: (signal: AbortSignal) => PromiseLike<A>,
): Effect.Effect<A, AiSdkError> =>
  Effect.tryPromise({
    try: (signal) => request(combineSignals(signal, options.abortSignal)),
    catch: (cause) => sdkError(operation, cause),
  });

/** Observe caller cancellation even if the SDK does not use the signal. */
export const abortable = <A, E, R>(
  operation: string,
  signal: AbortSignal,
  effect: Effect.Effect<A, E, R>,
) =>
  Effect.raceFirst(
    Effect.callback<never, AiSdkError>((resume) => {
      const abort = () =>
        resume(Effect.fail(sdkError(operation, signal.reason)));
      if (signal.aborted) {
        abort();
        return;
      }
      signal.addEventListener('abort', abort, { once: true });
      return Effect.sync(() => signal.removeEventListener('abort', abort));
    }),
    effect,
  );

/** Own the SDK signal and each callback fiber in the same scope. */
export const openOperation = <R = never>(callerSignal?: AbortSignal) =>
  Effect.gen(function* () {
    const scope = yield* Effect.scope;
    const context = yield* Effect.context<R>();
    const callbacks = yield* FiberSet.make();
    const runCallback = yield* FiberSet.runtimePromise(callbacks)<R>();
    const completed = yield* Ref.make(false);
    const controller = yield* Effect.acquireRelease(
      Effect.sync(() => new AbortController()),
      (controller) =>
        Ref.get(completed).pipe(
          Effect.flatMap((done) =>
            done ? Effect.void : Effect.sync(() => controller.abort()),
          ),
        ),
    );
    const signal = combineSignals(controller.signal, callerSignal);
    return {
      signal,
      scope,
      markComplete: Ref.set(completed, true),
      runCallback: <A, E>(
        effect: Effect.Effect<A, E, R>,
        callbackSignal?: AbortSignal,
      ) =>
        runCallback(effect, {
          signal: combineSignals(signal, callbackSignal),
        }),
      runSyncCallback: <A, E>(effect: Effect.Effect<A, E, R>): A => {
        signal.throwIfAborted();
        const checked: Effect.Effect<A, E | AiSdkError, R> =
          scope.state._tag === 'Closed'
            ? Effect.fail(
                sdkError('runSyncCallback', 'The operation scope is closed.'),
              )
            : effect;
        const exit = Effect.runSyncExitWith(context)(checked);
        // A native synchronous hook cannot wait for a suspended Effect.
        if (Exit.isFailure(exit)) {
          for (const reason of exit.cause.reasons) {
            if (
              Cause.isDieReason(reason) &&
              Cause.isAsyncFiberError(reason.defect)
            ) {
              FiberSet.addUnsafe(callbacks, reason.defect.fiber);
              reason.defect.fiber.interruptUnsafe();
            }
          }
        }
        return Effect.runSyncWith(context)(exit);
      },
      runCleanup: <A, E>(effect: Effect.Effect<A, E, R>) => runCallback(effect),
    };
  });
