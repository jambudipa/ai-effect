import { createClaudeCode as nativeCreateClaudeCode } from '@ai-sdk/harness-claude-code';
import { expect, it } from '@effect/vitest';
import { Context, Deferred, Effect } from 'effect';
import { vi } from 'vitest';
import { createClaudeCode } from '../src/integrations/harness-claude-code.js';

vi.mock('@ai-sdk/harness-claude-code', { spy: true });

class Observer extends Context.Service<Observer, (event: string) => void>()(
  '@jambudipa/ai-effect/test/ClaudeCodeAdapter/Observer',
) {}

it.effect('binds Claude Code debug events to the harness scope', () =>
  Effect.gen(function* () {
    const received = yield* Deferred.make<string>();
    const observed = vi.fn<(event: string) => void>();
    const event = {
      event: 'reconnect-attempt',
      attempt: 1,
      lastSeenEventId: 2,
    } as const;
    const onDebug = yield* Effect.scoped(
      Effect.gen(function* () {
        yield* createClaudeCode({
          onDebug: ({ event }) =>
            Effect.gen(function* () {
              const emit = yield* Observer;
              emit(event);
              yield* Deferred.succeed(received, event);
            }),
        });
        const onDebug = vi.mocked(nativeCreateClaudeCode).mock.lastCall?.[0]
          ?.onDebug;
        expect(observed).not.toHaveBeenCalled();
        onDebug?.(event);
        expect(yield* Deferred.await(received)).toBe('reconnect-attempt');
        expect(observed).toHaveBeenCalledExactlyOnceWith('reconnect-attempt');
        return onDebug;
      }).pipe(Effect.provideService(Observer, observed)),
    );
    onDebug?.(event);
    expect(observed).toHaveBeenCalledTimes(1);
  }),
);
