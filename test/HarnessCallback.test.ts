import { expect, it } from '@effect/vitest';
import { Context, Deferred, Effect, Option, Schema } from 'effect';
import {
  logBridgeError,
  SandboxChannel,
  type SandboxChannelOptions,
} from '../src/integrations/harness/utils.js';

class Prefix extends Context.Service<Prefix, string>()(
  '@jambudipa/ai-effect/test/HarnessCallbackPrefix',
) {}

it.effect('writes each bridge error line through the supplied Effect', () =>
  Effect.gen(function* () {
    let lines: string[] = [];
    const log = logBridgeError({
      harnessId: 'test',
      error: 'first\nsecond',
      write: (line) =>
        Prefix.pipe(
          Effect.map((prefix) => {
            lines = [...lines, prefix + line];
          }),
        ),
    });
    expect(lines).toEqual([]);
    yield* Effect.provideService(log, Prefix, 'fixture ');
    expect(lines).toEqual([
      'fixture [harness:test:error] first\n',
      'fixture [harness:test:error] second\n',
    ]);
  }),
);

it.effect('runs scoped channel error and send notifications', () =>
  Effect.gen(function* () {
    type ErrorFrame = { type: 'error' };
    type NativeSocket = Effect.Success<
      ReturnType<SandboxChannelOptions<ErrorFrame>['connect']>
    >;
    class Socket {
      readonly OPEN = 1;
      readyState = 1;
      #message = Option.none<(text: string) => void>();
      on(event: string, listener: (text: string) => void) {
        if (event === 'message') this.#message = Option.some(listener);
      }
      receive(text: string) {
        Option.getOrUndefined(this.#message)?.(text);
      }
      send(_text: string) {}
      close() {
        this.readyState = 3;
      }
    }
    const host = new Socket();
    const sent = yield* Deferred.make<string>();
    const reported = yield* Deferred.make<string>();
    const make = SandboxChannel.make({
      connect: () => Effect.succeed(host as unknown as NativeSocket),
      outboundSchema: Schema.Struct({ type: Schema.Literal('error') }),
      onBridgeError: (event) =>
        Effect.flatMap(Prefix, (prefix) =>
          Effect.asVoid(Deferred.succeed(reported, prefix + event.type)),
        ),
    });
    const channel = yield* Effect.provideService(make, Prefix, 'bridge ');
    yield* channel.open();
    yield* channel
      .send(
        { type: 'ping' },
        {
          onSent: () =>
            Effect.flatMap(Prefix, (prefix) =>
              Effect.asVoid(Deferred.succeed(sent, prefix)),
            ),
        },
      )
      .pipe(Effect.provideService(Prefix, 'send'));
    host.receive('{"type":"error"}');
    expect(yield* Deferred.await(sent)).toBe('send');
    expect(yield* Deferred.await(reported)).toBe('bridge error');
  }),
);
