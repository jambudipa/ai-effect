import type { Chat, ChatInit, UIMessage } from '@jambudipa/ai-effect/svelte';
import type { Schema as LegacySchema } from '@jambudipa/ai-effect/ui-utils';
import {
  Output,
  type ChatAddToolOutputFunction,
  type PrepareSendMessagesRequest,
  type UIMessageStreamOnEndCallback,
  type UseCompletionOptions,
} from '@jambudipa/ai-effect/ai';
import { Effect, Schema } from 'effect';

type Message = UIMessage<
  { trace: string },
  { numbers: { value: number } },
  { lookup: { input: { query: string }; output: { found: boolean } } }
>;

export const chatOptions: ChatInit<Message> = {
  messageMetadataSchema: Schema.Struct({ trace: Schema.String }),
  dataPartSchemas: {
    numbers: Schema.Struct({ value: Schema.Number }),
  },
  onData: (part) => {
    if (part.type === 'data-numbers') {
      const value: number = part.data.value;
      void value;
    }
    return Effect.void;
  },
};

export function rejectsWrongToolOutput(chat: Chat<Message>) {
  const addOutput: ChatAddToolOutputFunction<Message> = chat.addToolOutput;
  addOutput({
    tool: 'lookup',
    toolCallId: 'lookup-1',
    output: { found: true },
  });
  addOutput({
    tool: 'lookup',
    toolCallId: 'lookup-2',
    // @ts-expect-error The selected tool requires a boolean result field.
    output: { found: 'yes' },
  });
}

export const prepareRequest: PrepareSendMessagesRequest<Message> = (request) =>
  Effect.succeed({ body: { trace: request.messages.at(-1)?.metadata?.trace } });

export const onEnd: UIMessageStreamOnEndCallback<Message> = (event) =>
  Effect.sync(() => {
    const trace: string | undefined = event.responseMessage.metadata?.trace;
    void trace;
  });

export const completionOptions: UseCompletionOptions<{ session: string }> = {
  body: { session: 'fixture' },
  onFinish: () => Effect.void,
};

export function separatesLegacySchema(schema: LegacySchema<number>) {
  // @ts-expect-error The legacy schema handle cannot enter current Core.
  return Output.object({ schema });
}
