import { makeChatTransport } from '@jambudipa/ai-effect/ai';
import { Effect, Option, Stream } from 'effect';
import { assert } from './shared.mjs';
import { flushSync, mount, unmount } from 'svelte';
import App from './App.svelte';

export async function verifyHost(target) {
  const state = { updates: [], finished: 0, chatFinished: 0 };
  let stream;
  let signal;
  const canceled = Promise.withResolvers();
  const requested = Promise.withResolvers();
  const chatCanceled = Promise.withResolvers();
  const chatRequested = Promise.withResolvers();
  let chatSignal;
  const transport = makeChatTransport({
    sendMessages: ({ abortSignal }) =>
      Effect.sync(() => {
        chatSignal = abortSignal;
        chatRequested.resolve();
        return Stream.fromIterable([
          { type: 'start', messageId: 'assistant-1' },
          { type: 'text-start', id: 'text-1' },
          { type: 'text-delta', id: 'text-1', delta: 'chat delta' },
        ]).pipe(
          Stream.concat(Stream.never),
          Stream.ensuring(Effect.sync(chatCanceled.resolve)),
        );
      }),
    reconnectToStream: () => Effect.succeed(Option.none()),
  });
  const app = mount(App, {
    target,
    props: {
      transport,
      state,
      fetcher: (_url, init) => {
        signal = init.signal;
        const body = new ReadableStream({
          start(controller) {
            stream = controller;
          },
          cancel() {
            canceled.resolve();
          },
        });
        requested.resolve();
        return Promise.resolve(new Response(body));
      },
    },
  });
  const request = app.start();
  const chat = app.sendChat();
  await Promise.all([requested.promise, chatRequested.promise]);
  stream.enqueue(new TextEncoder().encode('first'));
  for (let i = 0; i < 20 && target.textContent !== 'first chat delta'; i++) {
    await new Promise((resolve) => setTimeout(resolve, 0));
    flushSync();
  }
  assert(
    target.querySelector('output')?.textContent === 'first',
    'the mounted view receives its stream delta',
  );
  assert(
    state.updates.includes('first'),
    'the Svelte subscription observes the delta',
  );
  assert(
    target.querySelector('[data-chat]')?.textContent === 'chat delta',
    'the mounted chat consumes Effect transport chunks',
  );
  const updateCount = state.updates.length;
  await unmount(app);
  await Promise.all([canceled.promise, chatCanceled.promise]);
  assert(signal.aborted, 'unmount aborts the fetch signal');
  assert(
    (await request)._tag === 'Failure',
    'unmount interrupts the Effect command',
  );
  assert(state.finished === 0, 'unmount blocks the finish callback');
  assert(chatSignal.aborted, 'unmount aborts the chat transport');
  assert(
    (await chat)._tag === 'Failure',
    'unmount interrupts the chat command',
  );
  assert(state.chatFinished === 0, 'unmount blocks the chat finish callback');
  assert(
    state.updates.length === updateCount,
    'unmount removes the subscription',
  );
  assert(target.textContent === '', 'unmount removes the DOM');
}
