---
title: Recover from a model failure
doc-type: tutorial
sources:
  [
    src/AiSdk.ts,
    src/testing.ts,
    src/internal/operation.ts,
    src/internal/mock-model.ts,
  ]
---

# Recover from a model failure

> **TL;DR:** Make a local model fixture fail. Catch the tagged failure and check
> that your program returns a fallback message.

Use Node.js 24 and the project from [Get your first text result](../getting-started/first-text-result.md).

1. Create `fallback.mjs`.

   ```js
   import { AiSdk } from '@jambudipa/ai-effect';
   import { MockLanguageModelV4 } from '@jambudipa/ai-effect/ai/test';
   import { Effect } from 'effect';

   const program = Effect.gen(function* () {
     const ai = yield* AiSdk;
     const model = yield* MockLanguageModelV4({
       doGenerate: () => Effect.fail('fixture failure'),
     });

     const answer = yield* ai
       .generateText({
         model,
         prompt: 'Summarize this ticket.',
         maxRetries: 0,
       })
       .pipe(
         Effect.map((result) => result.text),
         Effect.catchTag('AiSdkError', (error) =>
           Effect.succeed('Fallback for: ' + error.operation),
         ),
       );

     return { answer, calls: model.doGenerateCalls.length };
   }).pipe(Effect.scoped, Effect.provide(AiSdk.layer));

   const result = await Effect.runPromise(program);
   console.log(result.answer);
   console.log('Model calls: ' + result.calls);
   ```

2. Run the program.

   ```sh
   node fallback.mjs
   ```

   ```text
   Fallback for: generateText
   Model calls: 1
   ```

   The fixture records the failed request. The program returns the fallback
   through its success channel.

3. Run the command again. The fixture produces the same result.

Next, [queue responses for successive calls](../../how-to/testing/queue-model-responses.md)
to check behavior across multiple requests.
