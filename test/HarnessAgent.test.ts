import { expect, it } from '@effect/vitest';
import { Effect, Schema, Stream } from 'effect';
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
const state = {
  harnessId: 'local-test',
  specificationVersion: 'harness-v1',
  data: {},
} as const;

it.effect('binds harness results and releases the local session', () =>
  Effect.gen(function* () {
    let released = 0;
    let sawOutput = false;
    let traced = false;
    let models: readonly string[] = [];
    const harness: HarnessV1<{}> = {
      specificationVersion: 'harness-v1',
      harnessId: 'local-test',
      builtinTools: {},
      doStart: ({ sessionId, continueFrom }) => {
        const emitResult: HarnessV1Session['doContinueTurn'] = ({
          emit,
          model,
        }) =>
          Effect.runPromise(
            Effect.sync(() => {
                models = [...models, model ?? ''];
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
          );
        const session: HarnessV1Session = {
          sessionId,
          isResume: !!continueFrom,
          doPromptTurn: emitResult,
          doContinueTurn: emitResult,
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
          runtimeContext: { stage: 'initial' },
          prepareCall: (options) =>
            Effect.sync(() => {
              expect(options.runtimeContext).toEqual({ stage: 'initial' });
              return {
                ...options,
                model: 'prepared/model',
                runtimeContext: { stage: 'prepared' },
              };
            }),
          telemetry: {
            integrations: {
              onStart: () =>
                Effect.sync(() => {
                  traced = true;
                }),
            },
          },
          onStart: (event) =>
            Effect.sync(() => {
              sawOutput = Effect.isEffect(event.output?.responseFormat);
              expect(event.runtimeContext).toEqual({ stage: 'prepared' });
            }),
        });
        const sandboxSession = yield* createJustBashNetworkSandboxSession();
        const session = yield* agent.createSession({ sandboxSession });
        const response = yield* agent.generate({
          session,
          prompt: 'Return a value.',
        });
        const turnOptions = {
          model: 'direct/model',
          skills: [],
          instructions: 'Use the requested format.',
          tools: {},
          toolsContext: {},
          activeTools: {},
          toolSpecs: [],
          builtinToolFiltering: { mode: 'allow' as const, toolNames: [] },
          runtimeContext: {},
          abortSignal: AbortSignal.timeout(5_000),
          responseFormat: { type: 'text' as const },
          output,
          telemetry: {},
          callbacks: {},
          stopConditions: [],
        };
        const direct = yield* session.promptTurn({
          ...turnOptions,
          prompt: 'Return another value.',
        });
        yield* direct.ready;
        const text = yield* Stream.runCollect(direct.result.textStream);
        expect(Array.from(text)).toEqual(['{"value":7}']);
        yield* direct.done;
        expect(yield* direct.result.output).toEqual({ value: 7 });

        const resumed = yield* agent.createSession({
          sessionId: 'restored-session',
          sandboxSession,
          continueFrom: { ...state, type: 'continue-turn' },
        });
        const continued = yield* resumed.continueTurn({
          ...turnOptions,
          model: 'continued/model',
        });
        yield* continued.ready;
        expect(yield* continued.result.output).toEqual({ value: 7 });
        yield* continued.done;
        return yield* response.output;
      }),
    );

    expectTypeOf(result).toEqualTypeOf<{ readonly value: number }>();
    expect(result).toEqual({ value: 7 });
    expect(models).toEqual([
      'prepared/model',
      'direct/model',
      'continued/model',
    ]);
    expect(traced).toBe(true);
    expect(sawOutput).toBe(true);
    expect(released).toBe(2);
  }),
);
