import { expect, it } from '@effect/vitest';
import { Context, Deferred, Effect, Fiber, Schema } from 'effect';
import { expectTypeOf } from 'vitest';
import { experimental_toolCaller, generateText, tool } from '../src/core.js';
import type { LanguageModelV4GenerateResult } from '../src/protocols/provider.js';
import {
  experimental_getToolCaller,
  experimental_toolCaller as providerUtilsToolCaller,
} from '../src/protocols/provider-utils.js';
import { createOpenAI } from '../src/providers/openai.js';
import { MockLanguageModelV4 } from '../src/testing.js';

class CallerLabel extends Context.Service<CallerLabel, string>()(
  '@jambudipa/ai-effect/tests/ToolCaller/Label',
) {}

class BoundLabel extends Context.Service<BoundLabel, string>()(
  '@jambudipa/ai-effect/tests/ToolCaller/BoundLabel',
) {}

class MessageLabel extends Context.Service<MessageLabel, string>()(
  '@jambudipa/ai-effect/tests/ToolCaller/MessageLabel',
) {}

const inputSchema = Schema.Struct({}).annotate({
  identifier: 'ToolCallerFixtureInput',
});
const plainResponse: LanguageModelV4GenerateResult = {
  content: [{ type: 'text', text: 'fixture' }],
  finishReason: { unified: 'stop', raw: void 0 },
  usage: {
    inputTokens: { total: 1, noCache: 1, cacheRead: 0, cacheWrite: 0 },
    outputTokens: { total: 1, text: 1, reasoning: 0 },
  },
  warnings: [],
};
const callerResponse: LanguageModelV4GenerateResult = {
  ...plainResponse,
  content: [
    {
      type: 'tool-call',
      toolCallId: 'fixture-call',
      toolName: 'caller',
      input: '{}',
    },
  ],
  finishReason: { unified: 'tool-calls', raw: void 0 },
};

it('finds no caller definition on a plain tool', () => {
  expect(experimental_getToolCaller(tool({ inputSchema }))).toBeUndefined();
});

it.effect('retains the configured tool shape on both caller exports', () =>
  Effect.gen(function* () {
    const definition = {
      inputSchema,
      contextSchema: Schema.Struct({ label: Schema.String }),
      outputSchema: Schema.String,
      description: ({ context }: { context: { label: string } }) =>
        context.label,
      needsApproval: () => Effect.succeed(false),
      onInputStart: () => Effect.void,
      onInputDelta: () => Effect.void,
      onInputAvailable: () => Effect.void,
      execute: () => Effect.succeed('result'),
      toModelOutput: () =>
        Effect.succeed({ type: 'text' as const, value: 'result' }),
    };
    const caller = {
      type: 'local' as const,
      bind: () => Effect.succeed(definition),
    };
    const fromCore = yield* experimental_toolCaller(definition, caller);
    const fromProviderUtils = yield* providerUtilsToolCaller(
      definition,
      caller,
    );
    expectTypeOf(fromCore).toExtend<typeof definition>();
    expectTypeOf(fromProviderUtils).toExtend<typeof definition>();
    expect(fromCore).toMatchObject(definition);
    expect(fromProviderUtils).toMatchObject(definition);
  }),
);
it.effect('applies provider caller options and retains the provider tool', () =>
  Effect.gen(function* () {
    let hookCalls = 0;
    const provider = yield* createOpenAI({ apiKey: 'fixture' });
    const search = yield* provider.tools.webSearch({});
    const caller = yield* experimental_toolCaller(search, {
      type: 'provider',
      prepareProviderOptions: (options) =>
        Effect.map(CallerLabel, (label) => {
          hookCalls++;
          expect(options).toEqual({ fixture: { initial: true } });
          return { fixture: { label } };
        }),
    });
    const target = tool({
      inputSchema,
      providerOptions: { fixture: { initial: true } },
      execute: () => Effect.succeed('target'),
    });
    const model = yield* MockLanguageModelV4({ doGenerate: plainResponse });
    const request = generateText({
      model,
      prompt: 'Use a provider tool caller',
      tools: { caller, target },
      experimental_toolCallers: { target: ['caller'] },
    });
    expectTypeOf<
      Effect.Services<typeof request>
    >().toEqualTypeOf<CallerLabel>();
    expect(hookCalls).toBe(0);
    yield* request.pipe(Effect.provideService(CallerLabel, 'provider label'));
    expect(hookCalls).toBe(1);
    const prepared = model.doGenerateCalls[0]?.tools;
    expect(prepared).toContainEqual(
      expect.objectContaining({
        type: 'provider',
        name: 'caller',
        id: 'openai.web_search',
      }),
    );
    expect(prepared).toContainEqual(
      expect.objectContaining({
        type: 'function',
        name: 'target',
        providerOptions: { fixture: { label: 'provider label' } },
      }),
    );
  }),
);

it.effect('binds a local caller and adds its Effect model message', () =>
  Effect.gen(function* () {
    const callerTool = tool({ inputSchema });
    const caller = yield* experimental_toolCaller(callerTool, {
      type: 'local',
      bind: (tools) =>
        Effect.map(CallerLabel, (label) => {
          expect(Object.keys(tools)).toEqual(['target']);
          return tool({
            inputSchema,
            execute: () =>
              Effect.map(BoundLabel, (bound) => `${label} ${bound}`),
          });
        }),
      prepareModelMessage: (tools) =>
        Effect.map(MessageLabel, (label) => {
          expect(Object.keys(tools)).toEqual(['target']);
          return `prepared ${label}`;
        }),
    });
    const target = tool({
      inputSchema,
      execute: () => Effect.succeed('target'),
    });
    const model = yield* MockLanguageModelV4({
      doGenerate: callerResponse,
    });
    const request = generateText({
      model,
      prompt: 'Use a local tool caller',
      tools: { caller, target },
      experimental_toolCallers: { target: ['caller'] },
    });
    expectTypeOf<Effect.Services<typeof request>>().toEqualTypeOf<
      CallerLabel | BoundLabel | MessageLabel
    >();
    const result = yield* request.pipe(
      Effect.provideService(CallerLabel, 'local label'),
      Effect.provideService(BoundLabel, 'bound label'),
      Effect.provideService(MessageLabel, 'message label'),
    );
    expect(model.doGenerateCalls[0]?.prompt).toContainEqual(
      expect.objectContaining({
        role: 'user',
        content: [{ type: 'text', text: 'prepared message label' }],
      }),
    );
    expect(result.toolResults).toContainEqual(
      expect.objectContaining({
        toolCallId: 'fixture-call',
        output: 'local label bound label',
      }),
    );
  }),
);

it.effect('passes a provider-adjusted tool to a local caller', () =>
  Effect.gen(function* () {
    const providerOptions = { fixture: { adjusted: true } };
    const provider = yield* experimental_toolCaller(tool({ inputSchema }), {
      type: 'provider',
      prepareProviderOptions: () => Effect.succeed(providerOptions),
    });
    const caller = yield* experimental_toolCaller(tool({ inputSchema }), {
      type: 'local',
      bind: (tools) =>
        Effect.gen(function* () {
          const target = tools.target;
          if (!target) return yield* Effect.die('Missing routed tool');
          expect(target).toHaveProperty('providerOptions', providerOptions);
          return target;
        }),
    });
    const target = tool({
      inputSchema,
      execute: () => Effect.succeed('routed execution'),
    });
    const model = yield* MockLanguageModelV4({ doGenerate: callerResponse });
    const result = yield* generateText({
      model,
      prompt: 'Route a provider-adjusted tool',
      tools: { provider, caller, target },
      experimental_toolCallers: { target: ['provider', 'caller'] },
    });
    expect(result.toolResults).toContainEqual(
      expect.objectContaining({
        toolCallId: 'fixture-call',
        output: 'routed execution',
      }),
    );
  }),
);

it.effect(
  'interrupts asynchronous work from a synchronous tool caller hook',
  () =>
    Effect.gen(function* () {
      const finalizing = yield* Deferred.make<void>();
      const release = yield* Deferred.make<void>();
      const completed = yield* Deferred.make<void>();
      const caller = yield* experimental_toolCaller(tool({ inputSchema }), {
        type: 'provider',
        prepareProviderOptions: () =>
          Effect.never.pipe(
            Effect.ensuring(
              Deferred.succeed(finalizing, void 0).pipe(
                Effect.andThen(Deferred.await(release)),
              ),
            ),
          ),
      });
      const target = tool({ inputSchema });
      const model = yield* MockLanguageModelV4({ doGenerate: plainResponse });
      const running = yield* Effect.forkScoped(
        generateText({
          model,
          prompt: 'Reject the asynchronous hook',
          tools: { caller, target },
          experimental_toolCallers: { target: ['caller'] },
        }).pipe(Effect.onExit(() => Deferred.succeed(completed, void 0))),
      );
      yield* Deferred.await(finalizing);
      // Give the SDK's rejection handlers one turn to finish.
      yield* Effect.callback<void>((resume) => {
        const turn = setImmediate(() => resume(Effect.void));
        return Effect.sync(() => clearImmediate(turn));
      });
      const completedBeforeRelease = yield* Deferred.isDone(completed);
      yield* Deferred.succeed(release, void 0);
      expect(completedBeforeRelease).toBe(false);
      const failure = yield* Effect.flip(Fiber.join(running));
      expect(failure._tag).toBe('AiSdkError');
      expect(model.doGenerateCalls).toHaveLength(0);
    }),
);
