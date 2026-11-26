import { describe, expect, it } from '@effect/vitest';
import type { LanguageModelV2StreamPart } from '@ai-sdk/provider';
import { Context, Deferred, Effect, Fiber, Stream } from 'effect';
import {
  DurableAgent,
  type CompatibleLanguageModel,
  type DurableAgentStreamOptions,
} from '../src/integrations/durable-agent.js';
import {
  Agent,
  runSwarm,
  type SwarmLanguageModel,
} from '../src/integrations/swarm.js';
import { normalizeUIMessageStreamParts } from '../src/integrations/workflow.js';

class RunLabel extends Context.Service<RunLabel, string>()(
  '@jambudipa/ai-effect/test/WorkflowClosure/RunLabel',
) {}

const modelMetadata = {
  specificationVersion: 'v1' as const,
  provider: 'fixture',
  modelId: 'fixture',
  defaultObjectGenerationMode: 'json' as const,
};

const rawCall = { rawPrompt: '', rawSettings: {} };

describe('legacy workflow integration boundaries', () => {
  it.effect('preserves a Swarm agent, system context, and step callback', () =>
    Effect.gen(function* () {
      let stepText = '';
      const system = (context: string) => `Use ${context}`;
      const model: SwarmLanguageModel<RunLabel> = {
        ...modelMetadata,
        supportsUrl: () => true,
        doGenerate: ({ prompt }) =>
          Effect.map(RunLabel, (label) => {
            expect(prompt).toContainEqual({
              role: 'system',
              content: 'Use label',
            });
            return {
              text: label,
              finishReason: 'stop' as const,
              usage: { promptTokens: 1, completionTokens: 1 },
              rawCall,
            };
          }),
        doStream: () => Effect.succeed({ stream: Stream.empty, rawCall }),
      };
      const agent = yield* Agent.make<string, RunLabel>({
        name: 'fixture',
        system,
      });
      expect(agent.system).toBe(system);
      expect(typeof agent.system === 'function' && agent.system('direct')).toBe(
        'Use direct',
      );
      const result = yield* runSwarm({
        agent,
        model,
        context: 'label',
        prompt: 'hello',
        onStepFinish: ({ text }) =>
          Effect.sync(() => {
            stepText = text;
          }),
      });
      expect(result.activeAgent).toBe(agent);
      expect(result.text).toBe('fixture label');
      expect(stepText).toBe(result.text);
      expect(result.finishReason).toBe('stop');
    }).pipe(Effect.provideService(RunLabel, 'fixture label')),
  );

  it.effect('stops Swarm callbacks when the request is interrupted', () =>
    Effect.gen(function* () {
      const started = yield* Deferred.make<AbortSignal>();
      const released = yield* Deferred.make<void>();
      const model: SwarmLanguageModel = {
        ...modelMetadata,
        doGenerate: ({ abortSignal }) =>
          Effect.gen(function* () {
            if (abortSignal) yield* Deferred.succeed(started, abortSignal);
            yield* Effect.addFinalizer(() =>
              Deferred.succeed(released, void 0),
            );
            return yield* Effect.never;
          }).pipe(Effect.scoped),
        doStream: () => Effect.succeed({ stream: Stream.empty, rawCall }),
      };
      const agent = yield* Agent.make({ name: 'fixture' });
      const running = yield* Effect.forkScoped(
        runSwarm({ agent, model, prompt: 'hello' }),
      );
      const signal = yield* Deferred.await(started);
      expect(signal.aborted).toBe(false);
      yield* Fiber.interrupt(running);
      yield* Deferred.await(released);
      expect(signal.aborted).toBe(true);
    }),
  );

  it.effect('normalizes workflow UI chunks through an Effect Stream', () =>
    Effect.gen(function* () {
      const parts = yield* Stream.runCollect(
        normalizeUIMessageStreamParts(
          Stream.make(
            { type: 'start' as const, messageId: 'message' },
            { type: 'text-start' as const, id: 'text' },
            { type: 'text-delta' as const, id: 'text', delta: 'hello' },
            { type: 'text-end' as const, id: 'text' },
            { type: 'finish' as const },
          ),
        ),
      );
      expect(parts).toContainEqual({
        type: 'text-delta',
        id: 'text',
        delta: 'hello',
      });
      expect(parts.at(-1)).toEqual({ type: 'finish' });
    }),
  );

  it.effect('tags the unsupported Durable Agent generate command', () =>
    Effect.gen(function* () {
      const agent = yield* DurableAgent.make({ model: 'test/model' });
      const error = yield* Effect.flip(agent.generate());
      expect(error.operation).toBe('DurableAgent.generate');
    }),
  );

  it.effect('runs a Durable Agent stream with a scoped model factory', () =>
    Effect.gen(function* () {
      let received = false;
      let prepared = false;
      const parts: LanguageModelV2StreamPart[] = [
        { type: 'stream-start', warnings: [] },
        { type: 'text-start', id: 'text' },
        { type: 'text-delta', id: 'text', delta: 'hello' },
        { type: 'text-end', id: 'text' },
        {
          type: 'finish',
          finishReason: 'stop',
          usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
        },
      ];
      const model: CompatibleLanguageModel = {
        specificationVersion: 'v2',
        provider: 'fixture',
        modelId: 'legacy-fixture',
        doStream: () => Effect.succeed({ stream: Stream.fromIterable(parts) }),
      };
      const agent = yield* DurableAgent.make({
        model: () => Effect.succeed(model),
      });
      const writable: DurableAgentStreamOptions['writable'] =
        new WritableStream({
          write: (chunk) => {
            if (chunk.type === 'text-delta' && chunk.delta === 'hello')
              received = true;
          },
        });
      const result = yield* agent.stream({
        messages: [{ role: 'user', content: 'Say hello' }],
        writable,
        prepareStep: ({ model: current }) =>
          Effect.gen(function* () {
            expect(yield* RunLabel).toBe('durable');
            if (typeof current === 'function') {
              expect((yield* current()).modelId).toBe('legacy-fixture');
              prepared = true;
            }
            return { model: () => Effect.succeed(model) };
          }),
      });
      expect(prepared).toBe(true);
      expect(received).toBe(true);
      expect(writable.locked).toBe(false);
      expect(result.messages.at(-1)?.role).toBe('assistant');
    }).pipe(Effect.provideService(RunLabel, 'durable')),
  );
});
