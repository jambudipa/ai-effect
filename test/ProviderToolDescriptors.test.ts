import { expect, it } from '@effect/vitest';
import { Context, Effect } from 'effect';
import { expectTypeOf } from 'vitest';
import { openOperation } from '../src/internal/operation.js';
import { lazyValue } from '../src/internal/provider-model.js';
import { bindProviderTool } from '../src/internal/provider-tool.js';
import type { ToolServices } from '../src/internal/tool.js';
import { browserSearch } from '../src/providers/groq.js';
import { openai } from '../src/providers/openai.js';
import { xaiTools, xSearch } from '../src/providers/xai.js';

class HookContext extends Context.Service<HookContext, string>()(
  '@jambudipa/ai-effect/tests/ProviderToolHookContext',
) {}

const invocation = { toolCallId: 'fixture', context: {}, messages: [] };

it.effect('retains Groq input hooks and binds them to the SDK invocation', () =>
  Effect.gen(function* () {
    let seen: string[] = [];
    const record = (event: string) =>
      HookContext.pipe(
        Effect.map((prefix) => {
          seen = [...seen, prefix + event];
        }),
      );
    const onInputStart = () => record('start');
    const handle = yield* browserSearch({
      onInputStart,
      onInputDelta: ({ inputTextDelta }) => record(inputTextDelta),
      onInputAvailable: () => record('available'),
    });

    expect(handle.onInputStart).toBe(onInputStart);
    expectTypeOf<
      ToolServices<{ search: typeof handle }>
    >().toEqualTypeOf<HookContext>();
    expectTypeOf<
      'execute' extends keyof typeof handle ? true : false
    >().toEqualTypeOf<false>();
    expectTypeOf<
      'toModelOutput' extends keyof typeof handle ? true : false
    >().toEqualTypeOf<false>();
    expect(seen).toEqual([]);
    const owner = yield* openOperation<HookContext>();
    const native = bindProviderTool(handle, owner);
    yield* lazyValue('fixture.onInputStart', () =>
      native.onInputStart?.(invocation),
    );
    yield* lazyValue('fixture.onInputDelta', () =>
      native.onInputDelta?.({ ...invocation, inputTextDelta: 'delta' }),
    );
    yield* lazyValue('fixture.onInputAvailable', () =>
      native.onInputAvailable?.({ ...invocation, input: {} }),
    );
    expect(seen).toEqual(['hook:start', 'hook:delta', 'hook:available']);
  }).pipe(Effect.provideService(HookContext, 'hook:')),
);

it.effect('retains xAI hooks without moving provider options', () =>
  Effect.gen(function* () {
    const onInputAvailable = () => Effect.asVoid(HookContext);
    const search = yield* xSearch({
      allowedXHandles: ['fixture'],
      onInputAvailable,
    });
    const files = yield* xaiTools.fileSearch({
      vectorStoreIds: ['fixture'],
      onInputStart: () => Effect.void,
    });
    expect(search.onInputAvailable).toBe(onInputAvailable);
    expect(search.args).toEqual({ allowedXHandles: ['fixture'] });
    expect(typeof files.onInputStart).toBe('function');
    expect(files.args).toEqual({ vectorStoreIds: ['fixture'] });
    expect((yield* xSearch()).onInputAvailable).toBeUndefined();
    expectTypeOf<
      Parameters<NonNullable<typeof search.onInputAvailable>>[0]['input']
    >().toEqualTypeOf<Record<string, unknown>>();
  }),
);

it.effect('retains configured OpenAI search hooks with their exact types', () =>
  Effect.gen(function* () {
    const search = yield* openai.tools.toolSearch({
      execution: 'client',
      needsApproval: true,
      execute: () => Effect.succeed({ tools: [{ name: 'fixture' }] }),
      onInputStart: () => Effect.void,
      onInputDelta: () => Effect.void,
      onInputAvailable: () => Effect.void,
      toModelOutput: ({ output }) =>
        HookContext.pipe(
          Effect.map((prefix) => ({
            type: 'text' as const,
            value: prefix + output.tools.length,
          })),
        ),
    });
    const format = search.toModelOutput;
    const execute = search.execute;
    if (!format || !execute)
      return yield* Effect.die('Expected configured tool callbacks');
    expect(search.needsApproval).toBe(true);
    expect(search.args).toEqual({ execution: 'client' });
    expect(typeof search.onInputStart).toBe('function');
    expect(typeof search.onInputDelta).toBe('function');
    expect(typeof search.onInputAvailable).toBe('function');

    const input = { call_id: 'fixture' };
    const output = yield* execute(input, invocation);
    const formatted = format({ toolCallId: 'fixture', input, output });
    expectTypeOf<
      Effect.Services<typeof formatted>
    >().toEqualTypeOf<HookContext>();
    expect(
      yield* Effect.provideService(formatted, HookContext, 'count:'),
    ).toEqual({ type: 'text', value: 'count:1' });
    expect((yield* openai.tools.toolSearch()).execute).toBeUndefined();
  }),
);
