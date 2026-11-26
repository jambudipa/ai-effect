---
title: Get your first text result
doc-type: tutorial
sources: [src/AiSdk.ts, src/testing.ts, package.json]
---

# Get your first text result

> **TL;DR:** Run a text request through `AiSdk` with a model fixture. The program
> prints `Hello from Effect.` and confirms that the model received one call.

Use Node.js 24 and npm. The fixture supplies the response in the process.

1. Create an empty project and install the package.

   ```sh
   mkdir ai-effect-first-result
   cd ai-effect-first-result
   npm init -y
   npm install --ignore-scripts @jambudipa/ai-effect@0.1.0 effect@4.1.5
   ```

   npm lists the installed packages when it finishes.

2. Create `first-result.mjs`.

   ```js
   import { AiSdk } from '@jambudipa/ai-effect';
   import { MockLanguageModelV4 } from '@jambudipa/ai-effect/ai/test';
   import { Effect } from 'effect';

   const program = Effect.gen(function* () {
     const ai = yield* AiSdk;
     const model = yield* MockLanguageModelV4({
       doGenerate: {
         content: [{ type: 'text', text: 'Hello from Effect.' }],
         finishReason: { unified: 'stop', raw: undefined },
         usage: {
           inputTokens: { total: 3, noCache: 3 },
           outputTokens: { total: 4, text: 4 },
         },
         warnings: [],
       },
     });
     const result = yield* ai.generateText({ model, prompt: 'Say hello.' });
     return { text: result.text, calls: model.doGenerateCalls.length };
   }).pipe(Effect.scoped, Effect.provide(AiSdk.layer));

   const result = await Effect.runPromise(program);
   console.log(result.text);
   console.log(`Model calls: ${result.calls}`);
   ```

3. Run the example.

   ```sh
   node first-result.mjs
   ```

   ```text
   Hello from Effect.
   Model calls: 1
   ```

You used the default service layer and a fixture to get a full SDK result. Next,
[read your first text stream](first-text-stream.md) or
[choose a provider](../how-to/choose-a-provider.md).
