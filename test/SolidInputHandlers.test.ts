// @vitest-environment jsdom

import { expect, it } from '@effect/vitest';
import { Effect } from 'effect';
import { createRoot, type JSX } from 'solid-js';
import {
  useAssistant,
  useChat,
  useCompletion,
} from '../src/frameworks/solid.js';

type InputChange = JSX.ChangeEventHandler<
  HTMLInputElement | HTMLTextAreaElement,
  Event
>;

const edit = (
  field: HTMLInputElement | HTMLTextAreaElement,
  handle: InputChange,
) => {
  field.addEventListener(
    'change',
    (event) => {
      expect(event.target).toBe(field);
      expect(handle(event as Parameters<InputChange>[0])).toBeUndefined();
    },
    { once: true },
  );
  field.dispatchEvent(new Event('change'));
};

it.effect('updates each Solid input through a synchronous change handler', () =>
  Effect.gen(function* () {
    const { assistant, chat, completion } = yield* Effect.acquireRelease(
      Effect.sync(() =>
        createRoot((dispose) => ({
          dispose,
          assistant: useAssistant({ api: '/fixture' }),
          chat: useChat({ id: 'input-change-chat' }),
          completion: useCompletion({ id: 'input-change-completion' }),
        })),
      ),
      ({ dispose }) => Effect.sync(dispose),
    );

    const input = document.createElement('input');
    input.value = 'updated input';
    edit(input, assistant.handleInputChange);
    expect(assistant.input()).toBe(input.value);

    const textarea = document.createElement('textarea');
    textarea.value = 'updated textarea';
    edit(textarea, chat.handleInputChange);
    expect(chat.input()).toBe(textarea.value);

    input.value = 'updated completion';
    edit(input, completion.handleInputChange);
    expect(completion.input()).toBe(input.value);
  }),
);
