---
title: How to connect an OpenAI-compatible endpoint
doc-type: how-to
sources:
  [src/providers/openai-compatible.ts, src/core.ts, src/internal/fetch.ts]
---

# How to connect an OpenAI-compatible endpoint

> **TL;DR:** Set the endpoint's base URL and select a chat model. Add the API
> key when the endpoint requires one.

Use these steps when your application must send a request to an existing
OpenAI-compatible chat server. Get its base URL and model ID from its operator.

1. Set `CHAT_BASE_URL` to the API root, such as `http://127.0.0.1:8080/v1`.
   Set `CHAT_MODEL` to an ID that the server accepts. Set `CHAT_API_KEY` if
   the server requires bearer authentication.
2. Save this program as `relay-chat.mjs` in the consumer application.

   ```js
   import { generateText } from '@jambudipa/ai-effect/ai';
   import { createOpenAICompatible } from '@jambudipa/ai-effect/openai-compatible';
   import { Effect } from 'effect';

   const { CHAT_BASE_URL, CHAT_MODEL, CHAT_API_KEY } = process.env;
   if (!CHAT_BASE_URL || !CHAT_MODEL) {
     throw new Error('Set CHAT_BASE_URL and CHAT_MODEL.');
   }

   const program = Effect.gen(function* () {
     const provider = yield* createOpenAICompatible({
       name: 'relay',
       baseURL: CHAT_BASE_URL,
       ...(CHAT_API_KEY ? { apiKey: CHAT_API_KEY } : {}),
     });
     const model = yield* provider.chatModel(CHAT_MODEL);
     const result = yield* generateText({
       model,
       prompt: 'Reply with one greeting.',
     });
     return result.text;
   });

   console.log(await Effect.runPromise(program));
   ```

3. Run `node relay-chat.mjs`. Check that it prints a reply from the selected
   model. The response text depends on the server.

If the server returns HTTP 404, check that the base URL ends before the
`/chat/completions` route. If it returns HTTP 401, check the server's expected
authentication method and the credential. If authentication is disabled, omit
`CHAT_API_KEY`.

See the [adapter contract](../../reference/api/providers/openai-compatible.md)
for the model selectors and settings.
