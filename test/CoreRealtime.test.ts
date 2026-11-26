import { expect, it } from '@effect/vitest';
import type {
  Experimental_RealtimeModelV4,
  Experimental_RealtimeModelV4Transport,
} from '@ai-sdk/provider';
import { Context, Deferred, Effect, Fiber } from 'effect';
import { expectTypeOf } from 'vitest';
import { Experimental_AbstractRealtimeSession } from '../src/core-realtime.js';
import { runRequest } from '../src/internal/operation.js';
import { wrapRealtimeModel } from '../src/internal/provider-realtime.js';

class SessionName extends Context.Service<SessionName, string>()(
  '@jambudipa/ai-effect/tests/SessionName',
) {}

class Session<R = never> extends Experimental_AbstractRealtimeSession<R> {
  get status() {
    return this.state.status;
  }

  protected setState() {}
}

const transport = (
  methods: Pick<Experimental_RealtimeModelV4Transport, 'connect' | 'dispose'>,
): Experimental_RealtimeModelV4Transport => {
  const done = () => Effect.runPromise(Effect.void);
  return {
    ...methods,
    close: done,
    finish: done,
    sendEvent: done,
    startCapture: done,
    stopCapture: done,
    stopPlayback: () => {},
    resumePlayback: done,
  };
};

const realtimeModel = (
  createTransport: NonNullable<Experimental_RealtimeModelV4['createTransport']>,
) =>
  wrapRealtimeModel({
    specificationVersion: 'v4',
    provider: 'fixture',
    modelId: 'realtime',
    capabilities: {
      conversation: 'turn-based',
      transports: ['websocket'],
      connections: ['provider'],
    },
    createTransport,
    parseServerEvent: (raw) => ({ type: 'custom', rawType: 'fixture', raw }),
    serializeClientEvent: (event) => event,
    buildSessionConfig: (config) => config,
  });

it.effect(
  'provides callback services and disposes the scoped realtime transport',
  () =>
    Effect.gen(function* () {
      let disposals = 0;
      const seen = yield* Deferred.make<string>();
      const session = new Session<SessionName>({
        model: realtimeModel(({ onEvent }) =>
          transport({
            connect: ({ capture }) =>
              Effect.runPromise(
                Effect.gen(function* () {
                  expect(capture).toBe(false);
                  yield* runRequest(
                    'fixture.realtime.event',
                    {},
                    () =>
                      onEvent({ type: 'session-created', raw: 'fixture' }) ??
                      Effect.runPromise(Effect.void),
                  );
                }),
              ),
            dispose: () => {
              disposals++;
            },
          }),
        ),
        api: { provider: '/api/realtime' },
        onEvent: (event) =>
          Effect.gen(function* () {
            const name = yield* SessionName;
            yield* Deferred.succeed(seen, `${name}:${event.type}`);
          }),
      });

      expectTypeOf<Parameters<typeof session.connect>>().toEqualTypeOf<
        [options: { stream?: MediaStream; capture?: boolean }]
      >();
      const connect = session.connect({ capture: false });
      expect(session.status).toBe('disconnected');
      yield* Effect.scoped(
        Effect.gen(function* () {
          yield* connect.pipe(Effect.provideService(SessionName, 'fixture'));
          expect(session.status).toBe('connected');
          expect(yield* Deferred.await(seen)).toBe('fixture:session-created');
          expect(disposals).toBe(0);
        }),
      );
      expect(session.status).toBe('disconnected');
      expect(disposals).toBe(1);
    }),
);

it.effect('aborts the native transport when startup is interrupted', () =>
  Effect.gen(function* () {
    let disposals = 0;
    const started = yield* Deferred.make<AbortSignal>();
    const session = new Session({
      model: realtimeModel(() =>
        transport({
          connect: ({ abortSignal }) =>
            Effect.runPromise(
              Deferred.succeed(started, abortSignal).pipe(
                Effect.andThen(Effect.never),
              ),
              { signal: abortSignal },
            ),
          dispose: () => {
            disposals++;
          },
        }),
      ),
      api: { provider: '/api/realtime' },
    });

    const fiber = yield* Effect.forkChild(session.connect());
    const signal = yield* Deferred.await(started);
    yield* Fiber.interrupt(fiber);

    expect(signal.aborted).toBe(true);
    expect(session.status).toBe('disconnected');
    expect(disposals).toBe(1);
  }),
);
