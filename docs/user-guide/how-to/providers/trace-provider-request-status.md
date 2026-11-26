---
title: How to trace provider request status
doc-type: how-to
sources:
  [
    src/providers/openai.ts,
    src/internal/fetch.ts,
    src/internal/provider-adapter.ts,
  ]
---

# How to trace provider request status

> **TL;DR:** Wrap `fetch` in the provider settings. Record the URL pathname and
> status while preserving the SDK request options and abort signal.

Use this example when you need to identify which provider endpoint returns an
error. Install it where your application creates the OpenAI provider.

1. Define a fetch function that forwards the original request and options.
2. Log an endpoint path and a status once a response arrives.

   ```ts
   import { createOpenAI } from '@jambudipa/ai-effect/openai';

   const traceFetch: typeof fetch = async (input, init) => {
     const request = new Request(input, init);
     const path = new URL(request.url).pathname;
     try {
       const response = await fetch(request);
       console.info('Provider response', path, response.status);
       return response;
     } catch (error) {
       console.info('Provider request ended', path, request.signal.aborted);
       throw error;
     }
   };

   export const makeProvider = createOpenAI({ fetch: traceFetch });
   ```

3. Build a model from `makeProvider` and send a request. Check for a status
   line such as `Provider response /v1/responses 200`.

When a request ends before it has a response, check the abort flag. A true
flag indicates cancellation. The SDK still receives the original error.
See the [OpenAI adapter contract](../../reference/api/providers/openai.md).
