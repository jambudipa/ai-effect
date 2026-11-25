import { expect, it } from '@effect/vitest';
import { Context, Deferred, Effect, Fiber, Schema, Stream } from 'effect';
import { expectTypeOf } from 'vitest';
import { jsonSchema } from '../src/core-schema.js';
import {
  openOperation,
  runRequest,
  sdkError,
} from '../src/internal/operation.js';
import { bindTools, tool, type ToolServices } from '../src/internal/tool.js';
import {
  executeTool,
  type InferToolInput,
  type InferToolOutput,
  type InferToolSetContext,
  type ToolSet,
} from '../src/protocols/provider-utils.js';

class Offset extends Context.Service<Offset, number>()(
  '@jambudipa/ai-effect/tests/ToolOffset',
) {}
class Approval extends Context.Service<Approval, boolean>()(
  '@jambudipa/ai-effect/tests/ToolApproval',
) {}

it.effect('infers context, numeric results and all callback services', () =>
  Effect.gen(function* () {
    const tools = {
      calculate: tool({
        inputSchema: jsonSchema<{ value: number }>({
          type: 'object',
          properties: { value: { type: 'number' } },
          required: ['value'],
        }),
        outputSchema: Schema.Number,
        contextSchema: Schema.Struct({ factor: Schema.Number }),
        description: ({ context }) => `Factor ${context.factor}`,
        needsApproval: (_input, options) =>
          Effect.map(
            Approval,
            (allowed) => allowed && options.context.factor > 0,
          ),
        execute: ({ value }, { context }) =>
          Effect.map(Offset, (offset) => value * context.factor + offset),
        toModelOutput: ({ output }) =>
          Effect.succeed({ type: 'text', value: output.toFixed(0) }),
      }),
      query: tool({
        inputSchema: Schema.Struct({ count: Schema.Number }),
        outputSchema: Schema.Boolean,
      }),
    };
    expectTypeOf(tools).toExtend<ToolSet>();
    expectTypeOf<InferToolInput<typeof tools.calculate>>().toEqualTypeOf<{
      value: number;
    }>();
    expectTypeOf<
      InferToolOutput<typeof tools.calculate>
    >().toEqualTypeOf<number>();
    expectTypeOf<
      InferToolSetContext<typeof tools>['calculate']['factor']
    >().toEqualTypeOf<number>();
    expectTypeOf<ToolServices<typeof tools>>().toEqualTypeOf<
      Offset | Approval
    >();
    const result = tools.calculate.execute(
      { value: 3 },
      { context: { factor: 2 }, messages: [], toolCallId: 'calculate' },
    );
    expectTypeOf(result).toEqualTypeOf<Effect.Effect<number, never, Offset>>();
    expect(yield* Effect.provideService(result, Offset, 5)).toBe(11);
  }),
);

it.effect(
  'closes the native tool iterator when a streaming execution aborts',
  () =>
    Effect.gen(function* () {
      const started = yield* Deferred.make<true>();
      const closed = yield* Deferred.make<true>();
      let factoryCalls = 0;
      const tools = {
        count: tool({
          inputSchema: Schema.Struct({}),
          execute: () => {
            factoryCalls++;
            return Stream.concat(
              Stream.succeed(1),
              Stream.fromEffect(
                Deferred.succeed(started, true).pipe(
                  Effect.andThen(Effect.never),
                ),
              ),
            ).pipe(Stream.ensuring(Deferred.succeed(closed, true)));
          },
        }),
      };
      const owner = yield* openOperation<ToolServices<typeof tools>>();
      const bound = bindTools(tools, owner);
      const controller = new AbortController();
      const options = {
        messages: [],
        toolCallId: 'count',
        context: {},
        abortSignal: controller.signal,
      };
      const result = bound.count.execute?.({}, options);
      if (typeof result !== 'object' || !(Symbol.asyncIterator in result)) {
        return yield* Effect.fail(
          sdkError('fixture.tool', 'Expected an iterator'),
        );
      }
      const iterator = result[Symbol.asyncIterator]();
      const next = runRequest('fixture.tool.next', {}, () => iterator.next());
      const first = yield* next;
      expect(first).toEqual({ done: false, value: 1 });
      const second = yield* Effect.forkChild(Effect.ignore(next));
      yield* Deferred.await(started);

      controller.abort();
      yield* Fiber.join(second);
      expect(yield* Deferred.await(closed)).toBe(true);
      expect(factoryCalls).toBe(1);
    }),
);

it.effect(
  'emits preliminary and final results from the standalone executor',
  () =>
    Effect.gen(function* () {
      const count = tool({
        inputSchema: Schema.Number,
        execute: (input) => Stream.make(input, input + 1),
      });
      const output = executeTool({
        tool: count,
        input: 2,
        options: { toolCallId: 'count', context: {}, messages: [] },
      });
      expect(yield* Stream.runCollect(output)).toEqual([
        { type: 'preliminary', output: 2 },
        { type: 'preliminary', output: 3 },
        { type: 'final', output: 3 },
      ]);
    }),
);
