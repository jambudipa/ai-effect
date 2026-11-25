import { describe, expect, it } from '@effect/vitest';
import { Deferred, Effect, Option, Stream } from 'effect';
import { makeChatTransport } from '../src/core.js';

describe('makeChatTransport', () => {
  it.effect(
    'cancels the source when a scoped reader stops after one chunk',
    () =>
      Effect.gen(function* () {
        const stopped = yield* Deferred.make<void>();
        const chunk = {
          type: 'text-delta',
          id: 'text',
          delta: 'fixture',
        } as const;
        const transport = makeChatTransport({
          sendMessages: () =>
            Effect.succeed(
              Stream.make(chunk).pipe(
                Stream.concat(Stream.never),
                Stream.ensuring(Deferred.succeed(stopped, void 0)),
              ),
            ),
          reconnectToStream: () => Effect.succeed(Option.none()),
        });

        const first = yield* Effect.scoped(
          Effect.gen(function* () {
            const stream = yield* transport.sendMessages({
              trigger: 'submit-message',
              chatId: 'fixture',
              messageId: 'message',
              messages: [],
              abortSignal: new AbortController().signal,
            });
            return yield* Stream.runHead(stream);
          }),
        );
        expect(first).toEqual(Option.some(chunk));
        yield* Deferred.await(stopped);
        const resumed = yield* transport.reconnectToStream({
          chatId: 'fixture',
        });
        expect(resumed).toEqual(Option.none());
      }),
  );
});
