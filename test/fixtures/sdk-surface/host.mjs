import { assert } from './shared.mjs';
import { flushSync, mount, unmount } from 'svelte';
import App from './App.svelte';

export async function verifyHost(target) {
  const state = { updates: [], finished: 0 };
  let stream;
  let signal;
  const canceled = Promise.withResolvers();
  const requested = Promise.withResolvers();
  const app = mount(App, {
    target,
    props: {
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
  await requested.promise;
  stream.enqueue(new TextEncoder().encode('first'));
  for (let i = 0; i < 20 && target.textContent !== 'first'; i++) {
    await new Promise((resolve) => setTimeout(resolve, 0));
    flushSync();
  }
  assert(
    target.textContent === 'first',
    'the mounted view receives its stream delta',
  );
  assert(
    state.updates.includes('first'),
    'the Svelte subscription observes the delta',
  );
  const updateCount = state.updates.length;
  await unmount(app);
  await canceled.promise;
  assert(signal.aborted, 'unmount aborts the fetch signal');
  assert(
    (await request)._tag === 'Failure',
    'unmount interrupts the Effect command',
  );
  assert(state.finished === 0, 'unmount blocks the finish callback');
  assert(
    state.updates.length === updateCount,
    'unmount removes the subscription',
  );
  assert(target.textContent === '', 'unmount removes the DOM');
}
