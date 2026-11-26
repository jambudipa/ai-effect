import { Context, Effect, Schema, Stream } from 'effect';
import { expectTypeOf } from 'vitest';
import type { ToolRequirements } from '../src/internal/tool.js';
import {
  createProviderDefinedToolFactory,
  type InferToolOutput,
  type ProviderDefinedToolFactory,
} from '../src/protocols/provider-utils.js';

class OutputLabel extends Context.Service<OutputLabel, string>()(
  '@jambudipa/ai-effect/tests/ProviderDefinedToolFactory/OutputLabel',
) {}

class Lifecycle extends Context.Service<Lifecycle, void>()(
  '@jambudipa/ai-effect/tests/ProviderDefinedToolFactory/Lifecycle',
) {}

type Args = { readonly label: string };
type ToolContext = { readonly offset: number };

export const providerDefinedToolFactoryProof = Effect.gen(function* () {
  const factory: ProviderDefinedToolFactory<number, Args, ToolContext> =
    yield* createProviderDefinedToolFactory<number, Args, ToolContext>({
      id: 'fixture.number',
      inputSchema: Schema.Number,
    });

  const explicit = yield* factory<number>({ label: 'explicit' });
  expectTypeOf<InferToolOutput<typeof explicit>>().toEqualTypeOf<number>();
  expectTypeOf<ToolRequirements<typeof explicit>>().toEqualTypeOf<never>();

  const tuple = yield* factory<[Args]>({ label: 'tuple output' });
  expectTypeOf<InferToolOutput<typeof tuple>>().toEqualTypeOf<[Args]>();

  const streamed = yield* factory<number, OutputLabel>({
    label: 'streamed',
    execute: (input, { context }) =>
      Stream.unwrap(
        Effect.map(OutputLabel, (label) =>
          Stream.make(input + context.offset + label.length),
        ),
      ),
  });
  expectTypeOf<InferToolOutput<typeof streamed>>().toEqualTypeOf<number>();
  expectTypeOf<
    ToolRequirements<typeof streamed>
  >().toEqualTypeOf<OutputLabel>();

  const inferred = yield* factory({
    label: 'inferred',
    execute: (input) => Effect.map(OutputLabel, (label) => `${label} ${input}`),
    onInputStart: () => Lifecycle,
  });
  expectTypeOf<InferToolOutput<typeof inferred>>().toEqualTypeOf<string>();
  expectTypeOf<ToolRequirements<typeof inferred>>().toEqualTypeOf<
    OutputLabel | Lifecycle
  >();

  // @ts-expect-error The declared output is a number.
  yield* factory<number>({ label: 'bad', execute: () => Effect.succeed('x') });
});
