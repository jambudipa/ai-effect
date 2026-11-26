import { expect, it } from '@effect/vitest';
import { Context, Effect, Stream } from 'effect';
import { expectTypeOf } from 'vitest';
import { registerSandbox } from '../src/integrations/internal/sandbox-base.js';
import { openOperation } from '../src/internal/operation.js';
import { bindProviderTool } from '../src/internal/provider-tool.js';
import type { ToolServices } from '../src/internal/tool.js';
import { anthropic } from '../src/providers/anthropic.js';

class BashContext extends Context.Service<BashContext, string>()(
  '@jambudipa/ai-effect/tests/ProviderBashContext',
) {}

const invocation = { toolCallId: 'fixture', context: {}, messages: [] };

it.effect('runs both pinned default Bash executors as Effects', () =>
  Effect.gen(function* () {
    type NativeSandbox = Parameters<typeof registerSandbox>[1];
    type RunOptions = Parameters<NativeSandbox['run']>[0];
    type Sandbox = Parameters<typeof registerSandbox>[0];
    const output = { exitCode: 0, stdout: 'fixture stdout', stderr: '' };
    const sandbox = { description: 'fixture sandbox' } as Sandbox;
    let calls: RunOptions[] = [];
    registerSandbox(sandbox, {
      run: (options: RunOptions) => {
        calls = [...calls, options];
        return Effect.runPromise(Effect.succeed(output));
      },
    } as Pick<NativeSandbox, 'run'> as NativeSandbox);
    const legacy = yield* anthropic.tools.bash_20241022();
    const current = yield* anthropic.tools.bash_20250124({});
    const controller = new AbortController();
    const execute = (handle: typeof legacy | typeof current) =>
      handle.execute(
        { command: 'fixture command', restart: true },
        {
          ...invocation,
          abortSignal: controller.signal,
          experimental_sandbox: sandbox,
        },
      );
    const olderRun = execute(legacy);
    const newerRun = execute(current);
    expect(calls).toEqual([]);
    expect(yield* olderRun).toEqual(output);
    expect(yield* newerRun).toEqual(output);
    expect(calls.map(({ command }) => command)).toEqual([
      'fixture command',
      'fixture command',
    ]);
    expect(calls[0]?.abortSignal).toBeInstanceOf(AbortSignal);
    controller.abort();
    expect(calls[0]?.abortSignal?.aborted).toBe(true);
    const failure = yield* Effect.flip(
      current.execute({ command: 'fixture' }, invocation),
    );
    expect(failure._tag).toBe('AiSdkError');
  }),
);

it.effect(
  'preserves disabled and custom Bash overloads and configured hooks',
  () =>
    Effect.gen(function* () {
      const onInputAvailable = () => Effect.asVoid(BashContext);
      const disabled = yield* anthropic.tools.bash_20241022<
        string,
        BashContext
      >({
        // eslint-disable-next-line effect/no-null-use-option -- The pinned Bash overload uses null to disable its executor.
        execute: null,
        onInputAvailable,
      });
      expect(disabled.execute).toBeUndefined();
      expect(disabled.onInputAvailable).toBe(onInputAvailable);
      const owner = yield* openOperation<BashContext>();
      expect(bindProviderTool(disabled, owner).execute).toBeUndefined();

      const custom = yield* anthropic.tools.bash_20250124({
        execute: ({ command }) =>
          Stream.fromEffect(
            Effect.map(BashContext, (prefix) => prefix + command),
          ),
        onInputAvailable,
        toModelOutput: ({ output }) =>
          Effect.succeed({ type: 'text' as const, value: output }),
      });
      expectTypeOf<ReturnType<typeof custom.execute>>().toEqualTypeOf<
        Stream.Stream<string, never, BashContext>
      >();
      expectTypeOf<
        ToolServices<{ custom: typeof custom }>
      >().toEqualTypeOf<BashContext>();
      expect(custom.onInputAvailable).toBe(onInputAvailable);
      const output = yield* Stream.runCollect(
        custom.execute({ command: 'command' }, invocation),
      );
      expect(output).toEqual(['fixture command']);
    }).pipe(Effect.provideService(BashContext, 'fixture ')),
);
