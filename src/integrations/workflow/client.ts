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

const callbacks = [
  'onChatSendMessage',
  'onChatEnd',
  'prepareSendMessagesRequest',
  'prepareReconnectToStreamRequest',
] as const;

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
      return yield* runSync('WorkflowChatTransport.make', () =>
        wrapChatTransport(new NativeTransport<M>(nativeOptions)),
      );
    }),
};

export type WorkflowChatTransport<M extends UIMessage = UIMessage> =
  Effect.Success<ReturnType<typeof WorkflowChatTransport.make<M>>>;
