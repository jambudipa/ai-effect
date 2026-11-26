---
title: How to choose a provider and model
doc-type: how-to
sources:
  [
    src/providers/openai.ts,
    src/providers/cerebras.ts,
    src/core.ts,
    src/internal/fetch.ts,
    package.json,
  ]
---

# How to choose a provider and model

> **TL;DR:** Import a provider factory from its package subpath. Run the factory
> and model selector inside Effect, then pass the model handle to a core call.

1. Find the provider in the [provider reference](../../reference/providers.md).
   Select a model ID that the provider supports for the operation you need.
2. Configure the provider credentials. For OpenAI, set `OPENAI_API_KEY` in the
   runtime environment or supply `apiKey` in the factory settings.
3. Pass the selected model to a core operation.

   ```ts
   import { generateText } from '@jambudipa/ai-effect/ai';
   import { createOpenAI } from '@jambudipa/ai-effect/openai';
   import { Effect } from 'effect';

   const request = Effect.gen(function* () {
     const openai = yield* createOpenAI();
     const model = yield* openai('gpt-5-mini');
     return yield* generateText({ model, prompt: 'Summarize this release.' });
   });

   const result = await Effect.runPromise(request);
   console.log(result.text);
   ```

   Run the example at your application's Effect runtime boundary. Check that
   it prints text from the selected model.

Use the provider's named model method for capabilities such as embeddings.
For an endpoint that implements the OpenAI chat API, see
[connect an OpenAI-compatible endpoint](connect-an-openai-compatible-endpoint.md).
For a credential that changes at runtime, see
[rotate credentials between requests](rotate-credentials-between-requests.md).

See the [Core API reference](../../reference/core.md) for the corresponding
operation and [Installation and compatibility](../../reference/installation.md)
for host requirements.
