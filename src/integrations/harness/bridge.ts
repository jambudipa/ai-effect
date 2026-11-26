import * as sdk from '@ai-sdk/harness/bridge';
import { Deferred, Effect, Stream } from 'effect';
import {
  type AiSdkError,
  openOperation,
  runRequest,
  runSync,
  sdkError,
} from '../../internal/operation.js';
import { wrapError } from '../internal/error.js';
import { scopedResource } from '../internal/sandbox.js';

export type {
  BridgeDebugConfig,
  BridgeDebugLevel,
  BridgeEvent,
  BridgeState,
  HarnessToolModelOutputContent,
} from '@ai-sdk/harness/bridge';

/** Wrap SDK reports for capabilities the current bridge cannot provide. */
export const HarnessBridgeCapabilityUnsupportedError = wrapError(
  'HarnessBridge.unsupported',
  sdk.HarnessBridgeCapabilityUnsupportedError,
);
/** Tagged SDK error channel used by bridge capability checks. */
export type HarnessBridgeCapabilityUnsupportedError = AiSdkError;

/** Run the SDK's write-protection check as a request effect. */
export const isWriteProtectedPath = (
  ...args: Parameters<typeof sdk.isWriteProtectedPath>
) =>
  runRequest('HarnessBridge.isWriteProtectedPath', {}, () =>
    sdk.isWriteProtectedPath(...args),
  );

/** Convert SDK tool results to bridge model-output content without running the tool again. */
export const convertHarnessToolModelOutput = (
  ...args: Parameters<typeof sdk.convertHarnessToolModelOutput>
) =>
  runSync('HarnessBridge.convertToolOutput', () =>
    sdk.convertHarnessToolModelOutput(...args),
  );

/** Defer message acceptance and rejection until the bridge callback executes the effects. */
const wrapMessage = (message: sdk.Experimental_BridgeUserMessage) => ({
  messageId: message.messageId,
  text: message.text,
  accept: runSync('BridgeUserMessage.accept', () => message.accept()),
  reject: (reason: unknown) =>
    runSync('BridgeUserMessage.reject', () => message.reject(reason)),
});

/** Queued user message with explicit Effect operations for accepting or rejecting delivery. */
export type Experimental_BridgeUserMessage = ReturnType<typeof wrapMessage>;

/** Expose queue iteration as a stream and keep queue close on the callback runtime. */
const wrapQueue = (queue: sdk.Experimental_BridgeUserMessageQueue) => ({
  pendingCount: runSync(
    'BridgeUserMessages.pendingCount',
    () => queue.pendingCount,
  ),
  messages: Stream.map(
    Stream.fromAsyncIterable(queue, (cause) =>
      sdkError('BridgeUserMessages.messages', cause),
    ),
    wrapMessage,
  ),
  close: (reason?: unknown) =>
    runSync('BridgeUserMessages.close', () => queue.close(reason)),
});

/** Incoming turn messages with queue depth, delivery stream, and explicit closure. */
export type Experimental_BridgeUserMessageQueue = ReturnType<typeof wrapQueue>;

/** Keep tool approval and result requests tied to this turn's abort signal. */
const wrapTurn = (turn: sdk.BridgeTurn) => ({
  firstTurn: turn.firstTurn,
  abortSignal: turn.abortSignal,
  emit: (...args: Parameters<sdk.BridgeTurn['emit']>) =>
    runSync('BridgeTurn.emit', () => turn.emit(...args)),
  requestToolResult: (
    ...args: Parameters<sdk.BridgeTurn['requestToolResult']>
  ) =>
    runRequest(
      'BridgeTurn.requestToolResult',
      { abortSignal: turn.abortSignal },
      () => turn.requestToolResult(...args),
    ),
  requestToolApproval: (
    ...args: Parameters<sdk.BridgeTurn['requestToolApproval']>
  ) =>
    runRequest(
      'BridgeTurn.requestToolApproval',
      { abortSignal: turn.abortSignal },
      () => turn.requestToolApproval(...args),
    ),
  experimental_userMessages: wrapQueue(turn.experimental_userMessages),
  bridgeLog: (...args: Parameters<sdk.BridgeTurn['bridgeLog']>) =>
    runSync('BridgeTurn.bridgeLog', () => turn.bridgeLog(...args)),
  emitWarning: (...args: Parameters<sdk.BridgeTurn['emitWarning']>) =>
    runSync('BridgeTurn.emitWarning', () => turn.emitWarning(...args)),
  emitError: (...args: Parameters<sdk.BridgeTurn['emitError']>) =>
    runSync('BridgeTurn.emitError', () => turn.emitError(...args)),
});

/** Active bridge turn with event emission, tool requests, and the incoming user queue. */
export type BridgeTurn = ReturnType<typeof wrapTurn>;

/** Common discriminator for the bridge's adapter-specific start payload. */
type Start = { readonly type: 'start' };

/** Bridge settings with lifecycle callbacks that execute in the bridge's Effect context. */
export type RunBridgeOptions<T extends Start, E = never, R = never> = Omit<
  sdk.RunBridgeOptions<T>,
  'onStart' | 'onStop' | 'onDestroy' | 'onListening' | 'onExit'
> & {
  readonly onStart: (start: T, turn: BridgeTurn) => Effect.Effect<void, E, R>;
  readonly onStop?: () => Effect.Effect<unknown, E, R>;
  readonly onDestroy?: () => Effect.Effect<void, E, R>;
  readonly onListening?: (port: number) => Effect.Effect<void, E, R>;
  readonly onExit?: () => Effect.Effect<void, E, R>;
};

/** Preserve the listening port while putting early bridge closure behind an Effect. */
const wrapBridge = (native: sdk.BridgeHandle) => ({
  port: native.port,
  close: runRequest('HarnessBridge.close', {}, () => native.close()),
});

/** Listening bridge handle returned after the optional listening callback completes. */
export type BridgeHandle = ReturnType<typeof wrapBridge>;

/** Start a bridge owned by the calling Effect scope. */
export const runBridge = <T extends Start, E = never, R = never>(
  options: RunBridgeOptions<T, E, R>,
) =>
  Effect.gen(function* () {
    const { onStart, onStop, onDestroy, onListening, onExit, ...rest } =
      options;
    const owner = yield* openOperation<R>();
    const listening = onListening && (yield* Deferred.make<void, E>());
    const bridge = yield* scopedResource(
      'HarnessBridge.start',
      { abortSignal: owner.signal },
      () =>
        sdk.runBridge<T>({
          ...rest,
          onStart: (start, turn) =>
            owner.runCallback(
              Effect.suspend(() => onStart(start, wrapTurn(turn))),
              turn.abortSignal,
            ),
          ...(onStop && {
            onStop: () => owner.runCallback(Effect.suspend(onStop)),
          }),
          ...(onDestroy && {
            onDestroy: () => owner.runCallback(Effect.suspend(onDestroy)),
          }),
          ...(onListening &&
            listening && {
              onListening: (port: number) => {
                void owner
                  .runCallback(
                    Effect.suspend(() => onListening(port)).pipe(
                      Effect.onExit((exit) => Deferred.done(listening, exit)),
                    ),
                  )
                  .catch(() => {});
              },
            }),
          ...(onExit && {
            onExit: () => {
              void owner.runCleanup(Effect.suspend(onExit)).catch(() => {});
            },
          }),
        }),
      (bridge) => bridge.close(),
    );
    if (listening) yield* Deferred.await(listening);
    return wrapBridge(bridge);
  });
