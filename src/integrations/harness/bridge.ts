import * as sdk from '@ai-sdk/harness/bridge';
import { Effect, Stream } from 'effect';
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

export const HarnessBridgeCapabilityUnsupportedError = wrapError(
  'HarnessBridge.unsupported',
  sdk.HarnessBridgeCapabilityUnsupportedError,
);
export type HarnessBridgeCapabilityUnsupportedError = AiSdkError;

export const isWriteProtectedPath = (
  ...args: Parameters<typeof sdk.isWriteProtectedPath>
) =>
  runRequest('HarnessBridge.isWriteProtectedPath', {}, () =>
    sdk.isWriteProtectedPath(...args),
  );

export const convertHarnessToolModelOutput = (
  ...args: Parameters<typeof sdk.convertHarnessToolModelOutput>
) =>
  runSync('HarnessBridge.convertToolOutput', () =>
    sdk.convertHarnessToolModelOutput(...args),
  );

const wrapMessage = (message: sdk.Experimental_BridgeUserMessage) => ({
  messageId: message.messageId,
  text: message.text,
  accept: runSync('BridgeUserMessage.accept', () => message.accept()),
  reject: (reason: unknown) =>
    runSync('BridgeUserMessage.reject', () => message.reject(reason)),
});

export type Experimental_BridgeUserMessage = ReturnType<typeof wrapMessage>;

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

export type Experimental_BridgeUserMessageQueue = ReturnType<typeof wrapQueue>;

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

export type BridgeTurn = ReturnType<typeof wrapTurn>;

type Start = { readonly type: 'start' };

export type RunBridgeOptions<T extends Start, E = never, R = never> = Omit<
  sdk.RunBridgeOptions<T>,
  'onStart' | 'onStop' | 'onDestroy'
> & {
  readonly onStart: (start: T, turn: BridgeTurn) => Effect.Effect<void, E, R>;
  readonly onStop?: () => Effect.Effect<unknown, E, R>;
  readonly onDestroy?: () => Effect.Effect<void, E, R>;
};

const wrapBridge = (native: sdk.BridgeHandle) => ({
  port: native.port,
  close: runRequest('HarnessBridge.close', {}, () => native.close()),
});

export type BridgeHandle = ReturnType<typeof wrapBridge>;

/** Start a bridge owned by the calling Effect scope. */
export const runBridge = <T extends Start, E = never, R = never>(
  options: RunBridgeOptions<T, E, R>,
) =>
  Effect.gen(function* () {
    const { onStart, onStop, onDestroy, ...rest } = options;
    const owner = yield* openOperation<R>();
    const bridge = yield* scopedResource(
      'HarnessBridge.start',
      { abortSignal: owner.signal },
      () =>
        sdk.runBridge<T>({
          ...rest,
          onStart: (start, turn) =>
            owner.runCallback(onStart(start, wrapTurn(turn)), turn.abortSignal),
          ...(onStop && { onStop: () => owner.runCallback(onStop()) }),
          ...(onDestroy && { onDestroy: () => owner.runCallback(onDestroy()) }),
        }),
      (bridge) => bridge.close(),
    );
    return wrapBridge(bridge);
  });
