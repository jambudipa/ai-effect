import { expect, it } from '@effect/vitest';
import { Effect, Schema } from 'effect';
import { expectTypeOf } from 'vitest';
import { HarnessAgent } from '../src/integrations/harness/agent.js';
import type {
  HarnessV1,
  HarnessV1Session,
} from '../src/integrations/internal/harness-contracts/harness.js';
import { wrapHarness } from '../src/integrations/internal/harness.js';
import { createJustBashNetworkSandboxSession } from '../src/integrations/sandbox-just-bash.js';
import { Output } from '../src/internal/output.js';

const usage = {
  inputTokens: { total: 1, noCache: 1, cacheRead: 0, cacheWrite: 0 },
  outputTokens: { total: 1, text: 1, reasoning: 0 },
};
const finishReason = { unified: 'stop', raw: 'stop' } as const;
const resolved = () => Effect.runPromise(Effect.void);

it.effect('parses the harness result and releases the local session', () =>
  Effect.gen(function* () {
    let released = 0;
    let sawOutput = false;
    const harness: HarnessV1<{}> = {
      specificationVersion: 'harness-v1',
      harnessId: 'local-test',
      builtinTools: {},
      doStart: ({ sessionId }) => {
        const state = {
          harnessId: 'local-test',
          specificationVersion: 'harness-v1',
          data: {},
        } as const;
        const session: HarnessV1Session = {
          sessionId,
          isResume: false,
          doPromptTurn: ({ emit }) =>
            Effect.runPromise(
              Effect.sync(() => {
                emit({ type: 'stream-start' });
                emit({ type: 'text-start', id: 'result' });
                emit({
                  type: 'text-delta',
                  id: 'result',
                  delta: '{"value":7}',
                });
                emit({ type: 'text-end', id: 'result' });
                emit({ type: 'finish-step', finishReason, usage });
                emit({ type: 'finish', finishReason, totalUsage: usage });
                return { done: resolved(), submitToolResult: resolved };
              }),
            ),
          doContinueTurn: () =>
            Effect.runPromise(Effect.fail('No pending turn')),
          doCompact: resolved,
          doSuspendTurn: () =>
            Effect.runPromise(
              Effect.succeed({ ...state, type: 'continue-turn' }),
            ),
          doDetach: () =>
            Effect.runPromise(
              Effect.succeed({ ...state, type: 'resume-session' }),
            ),
          doStop: () =>
            Effect.runPromise(
              Effect.succeed({ ...state, type: 'resume-session' }),
            ),
          doDestroy: () =>
            Effect.runPromise(
              Effect.sync(() => {
                released++;
              }),
            ),
        };
        return Effect.runPromise(Effect.succeed(session));
      },
    };

    const result = yield* Effect.scoped(
      Effect.gen(function* () {
        const output = yield* Output.object({
          schema: Schema.Struct({ value: Schema.Number }),
        });
        const agent = yield* HarnessAgent.make({
          harness: wrapHarness(harness),
          output,
          onStart: (event) =>
            Effect.sync(() => {
              sawOutput = Effect.isEffect(event.output?.responseFormat);
            }),
        });
        const sandboxSession = yield* createJustBashNetworkSandboxSession();
        const session = yield* agent.createSession({ sandboxSession });
        const response = yield* agent.generate({
          session,
          prompt: 'Return a value.',
        });
        return yield* response.output;
      }),
    );

    expectTypeOf(result).toEqualTypeOf<{ readonly value: number }>();
    expect(result).toEqual({ value: 7 });
    expect(sawOutput).toBe(true);
    expect(released).toBe(1);
  }),
);
