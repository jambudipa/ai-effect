---
title: How to serve streamed text from a Fetch handler
doc-type: how-to
sources:
  [
    src/core.ts,
    src/core-chat.ts,
    src/internal/chat-ui-stream.ts,
    src/internal/text-stream.ts,
  ]
---

# How to serve streamed text from a Fetch handler

> **TL;DR:** Open the text result inside `Stream.unwrap`. Pass its `textStream`
> to `createTextStreamResponse` so the response body consumes it in scope.

Use this for a route that sends text fragments to a plain-text HTTP client.
The example takes a prompt string in the request body. It assumes your route
already authenticates callers and limits request size. The gateway model needs
credentials.

1. Read the prompt at the host boundary. Pass the request signal to the model.
2. Build and return a response with the stream as its body.

   ```ts
   import {
     createTextStreamResponse,
     streamText,
   } from '@jambudipa/ai-effect/ai';
   import { Effect, Stream } from 'effect';

   export async function POST(request: Request): Promise<Response> {
     const prompt = await request.text();
     if (prompt.trim() === '') {
       return new Response('A prompt is required.', { status: 400 });
     }

     const stream = Stream.unwrap(
       streamText({
         model: 'openai/gpt-5-mini',
         prompt,
         abortSignal: request.signal,
       }).pipe(Effect.map((result) => result.textStream)),
     );

     return Effect.runPromise(createTextStreamResponse({ stream }));
   }
   ```

3. Test your route with a client that displays fragments as they arrive.

   ```sh
   curl --no-buffer --data 'Write a one-line welcome.' http://localhost:3000/api/answer
   ```

After the host sends the headers, it cannot change the HTTP status. Handle a
failed body read in your client. For a chat client that reads message parts,
use [a UI message response](serve-a-ui-message-response.md).
