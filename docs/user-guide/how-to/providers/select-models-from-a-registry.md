---
title: How to select models by application route
doc-type: how-to
sources:
  [
    src/core-providers.ts,
    src/core.ts,
    src/providers/openai.ts,
    src/providers/openai-compatible.ts,
    test/CoreProviders.test.ts,
  ]
---

# How to select models by application route

> **TL;DR:** Register providers under stable aliases. Map your application's
> route names to provider and model IDs before calling `generateText`.

Use a registry when the same service sends different requests to a hosted
provider and to an internal chat relay. In this example, the OpenAI entry
reads `OPENAI_API_KEY`. The relay accepts `internal-writer` with no API key.

1. Register each provider with a name that stays stable when its model changes.
2. Map application routes to model IDs and select the model at request time.

   ```ts
   import {
     createProviderRegistry,
     generateText,
   } from '@jambudipa/ai-effect/ai';
   import { createOpenAI } from '@jambudipa/ai-effect/openai';
   import { createOpenAICompatible } from '@jambudipa/ai-effect/openai-compatible';
   import { Effect } from 'effect';

   const routes = {
     publicCopy: 'hosted:gpt-5-mini',
     internalCopy: 'relay:internal-writer',
   } as const;

   export const writeCopy = (route: keyof typeof routes, prompt: string) =>
     Effect.gen(function* () {
       const hosted = yield* createOpenAI();
       const relay = yield* createOpenAICompatible({
         name: 'internal',
         baseURL: 'http://127.0.0.1:8080/v1',
       });
       const registry = yield* createProviderRegistry({ hosted, relay });
       const model = yield* registry.languageModel(routes[route]);
       const result = yield* generateText({ model, prompt });
       return result.text;
     });
   ```

3. Call `writeCopy('internalCopy', 'Write a title for this report.')` at your
   runtime boundary. Use the fulfilled text as the application response.

If a request supplies a route name from user input, validate it before the
lookup. To replace a model, change the selected entry in `routes` and check
its credentials and availability. See [Core API](../../reference/core.md).
