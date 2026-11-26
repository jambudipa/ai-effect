import { WorkflowChatTransport as NativeTransport } from '@ai-sdk/workflow/client';
import type { WorkflowChatTransportOptions as NativeOptions } from '@ai-sdk/workflow/client';
import type { UIMessage } from 'ai';
import { Effect } from 'effect';
import { wrapChatTransport } from '../../internal/chat-transport.js';
import { openOperation, runSync } from '../../internal/operation.js';
import {
  bindCallbacks,
  type WithEffectCallbacks,
} from '../internal/callbacks.js';

export type {
  ReconnectToStreamOptions,
  SendMessagesOptions,
} from '@ai-sdk/workflow/client';

/** These native callbacks run through the captured Effect operation context. */
const callbacks = [
  'onChatSendMessage',
  'onChatEnd',
  'prepareSendMessagesRequest',
  'prepareReconnectToStreamRequest',
] as const;

/** Workflow request options with Effect callbacks for request preparation and completion. */
export type WorkflowChatTransportOptions<
  M extends UIMessage = UIMessage,
  E = never,
  R = never,
> = WithEffectCallbacks<NativeOptions<M>, (typeof callbacks)[number], E, R>;

/** Construct a workflow transport with scoped request and stream callbacks. */
export const WorkflowChatTransport = {
  make: <M extends UIMessage = UIMessage, E = never, R = never>(
    options: WorkflowChatTransportOptions<M, E, R> = {},
  ) =>
    Effect.gen(function* () {
      const owner = yield* openOperation<R>();
      const nativeOptions = bindCallbacks<
        NativeOptions<M>,
        typeof callbacks,
        E,
        R
      >(options, callbacks, owner);
      return yield* runSync('WorkflowChatTransport.make', () => {
        const native = new NativeTransport<M>(nativeOptions);
        return wrapChatTransport<M>({
          sendMessages: ({ messageId, abortSignal, ...rest }) =>
            native.sendMessages({
              ...rest,
              ...(messageId && { messageId }),
              ...(abortSignal && { abortSignal }),
            }),
          reconnectToStream: native.reconnectToStream.bind(native),
        });
      });
    }),
};

/** Effect chat transport handle returned by `make` after it captures the callback scope. */
export type WorkflowChatTransport<M extends UIMessage = UIMessage> =
  Effect.Success<ReturnType<typeof WorkflowChatTransport.make<M>>>;
