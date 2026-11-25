import * as sdk from '@ai-sdk/tui';
import { Effect } from 'effect';
import {
  type ChatTransport,
  unwrapChatTransport,
} from '../internal/chat-transport.js';
import { runRequest, sdkError } from '../internal/operation.js';

export type {
  ResponseStatisticsMode,
  TerminalPartDisplayMode,
} from '@ai-sdk/tui';

export type RunAgentTUIOptions = Omit<
  sdk.RunAgentTUIOptions,
  'agent' | 'transport' | 'sandbox'
> & {
  readonly transport: ChatTransport;
};

/** Start the native terminal host with an Effect transport. */
export const runAgentTUI = (options: RunAgentTUIOptions) =>
  Effect.gen(function* () {
    const transport = unwrapChatTransport(options.transport);
    if (!transport) {
      return yield* Effect.fail(
        sdkError('TUI.runAgentTUI', 'Invalid chat transport'),
      );
    }
    return yield* runRequest('TUI.runAgentTUI', {}, () =>
      sdk.runAgentTUI({ ...options, transport }),
    );
  });
