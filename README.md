# ai-effect

Use the Vercel AI SDK from Effect v4. The package keeps the SDK's model,
tool, and structured output types. It provides typed failures and cancels
requests when their fibers or stream scopes close.

```sh
npm install @jambudipa/ai-effect effect@^4.1.5
```

Use Node.js 22.19 or later from a supported release line. Configure the model
through the [Vercel AI SDK](https://ai-sdk.dev/docs/ai-sdk-core/overview).
The example uses the AI Gateway and requires its credentials.

Import SDK operations and SDK types through `@jambudipa/ai-effect`. The package
installs the pinned SDK dependencies. Install the host libraries for framework
entries that you use, such as React for `@jambudipa/ai-effect/react`.

```ts
import { AiSdk } from '@jambudipa/ai-effect';
import { Effect } from 'effect';

const program = Effect.gen(function* () {
  const ai = yield* AiSdk;
  const result = yield* ai.generateText({
    model: 'openai/gpt-5-mini',
    prompt: 'Explain lexical scope in one sentence.',
    timeout: 30_000,
  });
  return result.text;
}).pipe(Effect.provide(AiSdk.layer));

const text = await Effect.runPromise(program);
```

Use an Effect schema with `Output.object`. The result's `output` field
keeps the schema type.

```ts
import { generateText, Output } from '@jambudipa/ai-effect/ai';
import { createCerebras } from '@jambudipa/ai-effect/cerebras';
import { Effect, Schema } from 'effect';

const program = Effect.gen(function* () {
  const provider = yield* createCerebras();
  const model = yield* provider('gpt-oss-120b');
  const output = yield* Output.object({
    schema: Schema.Struct({ explanation: Schema.String }),
  });
  const result = yield* generateText({
    model,
    prompt: 'Explain lexical scope in one sentence.',
    output,
  });
  return result.output.explanation;
});
```

| Import path                          | Purpose                                            |
| ------------------------------------ | -------------------------------------------------- |
| `@jambudipa/ai-effect/ai`            | Core generation, tools, agents, and output formats |
| `@jambudipa/ai-effect/ai/test`       | Model and stream fixtures                          |
| `@jambudipa/ai-effect/cerebras`      | Callable Cerebras provider                         |
| `@jambudipa/ai-effect/ui-utils`      | Legacy stream utilities                            |
| `@jambudipa/ai-effect/ui-utils/test` | Legacy Vitest fixtures                             |
| `@jambudipa/ai-effect/svelte`        | Svelte 5 component adapters                        |

The [SDK inventory](docs/sdk-surface.json) lists wrapper paths and their import
conditions. Use `@jambudipa/ai-effect/provider` for protocol types and
`@jambudipa/ai-effect/provider-utils` for protocol utilities.

Create model mocks inside an Effect scope. The mock is a model handle, and its
call history is available on the same object.

```ts
import { MockLanguageModelV4 } from '@jambudipa/ai-effect/ai/test';
import { Effect } from 'effect';

const test = Effect.scoped(
  Effect.gen(function* () {
    const model = yield* MockLanguageModelV4();
    return model.doGenerateCalls.length;
  }),
);
```

| Method                                          | Return value                    |
| ----------------------------------------------- | ------------------------------- |
| `generateText`                                  | Effect with the full SDK result |
| `streamText`                                    | Effect Stream of SDK events     |
| `embed`, `embedMany`, `rerank`                  | Effect with the full SDK result |
| `generateImage`, `generateSpeech`, `transcribe` | Effect with the full SDK result |

Each execution starts a new SDK call. Each consumption of `streamText` starts
a new stream. Select the text deltas when you only need text.

```ts
import { AiSdk } from '@jambudipa/ai-effect';
import { Effect, Stream } from 'effect';

const program = Effect.gen(function* () {
  const ai = yield* AiSdk;
  return yield* ai
    .streamText({
      model: 'openai/gpt-5-mini',
      prompt: 'Explain lexical scope in one sentence.',
      timeout: 30_000,
    })
    .pipe(
      Stream.filter((part) => part.type === 'text-delta'),
      Stream.map((part) => part.text),
      Stream.runCollect,
    );
}).pipe(Effect.provide(AiSdk.layer));
```

The wrapper keeps SDK options, including provider options and the caller's
`abortSignal`. It combines that signal with Effect cancellation. An early
stream exit aborts the SDK request. A stream that completes normally leaves the
signal intact.

`AiSdkError` carries the operation name, category, and optional HTTP details.
The cause is a redacted value. Use
`Effect.catchTag` or `Stream.catchTag` to handle it. An SDK `abort` event
becomes `AiSdkStreamAborted`. A `tool-error` event remains an event so the SDK
can pass the error back to the model. Fiber interruption follows Effect's
normal interruption semantics.

Provide a replacement with `Layer.succeed(AiSdk, AiSdk.of(implementation))`
in application tests. The `AiSdkService` type defines the implementation
contract. See the [development references](docs/README.md) for local standards.

Run `npm ci` to install the development tools. Run `npm run lint`,
`npm run typecheck`, `npm test`, and `npm pack --dry-run` before release.
Use Changesets to record release changes. The [release workflow](.github/workflows/release.yml)
uses npm trusted publishing after a maintainer configures the publisher for the
package. See [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/).

MIT
