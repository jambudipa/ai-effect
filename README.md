# ai-effect

Use the Vercel AI SDK from Effect v4. The package keeps the SDK's model,
tool, and structured output types. It provides typed failures and cancels
requests when their fibers or stream scopes close.

```sh
npm install @jambudipa/ai-effect ai@^7.0.181 effect@^4.1.5
```

Use Node.js 22.19 or later from a supported release line. Configure the model
through the [Vercel AI SDK](https://ai-sdk.dev/docs/ai-sdk-core/overview).
The example uses the AI Gateway and requires its credentials.

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

Use `Output.object({ schema })` from `ai` for structured output.
The result's `output` field keeps the type of the SDK schema.

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

`AiSdkError` carries the operation name and original cause. Use
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
