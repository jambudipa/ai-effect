---
title: How to serve UI message events from a chat endpoint
doc-type: how-to
sources:
  [
    src/core-chat.ts,
    src/core.ts,
    src/internal/chat-ui-stream.ts,
    src/internal/text-stream.ts,
    test/CoreChat.test.ts,
  ]
---

# How to serve UI message events from a chat endpoint

> **TL;DR:** Validate incoming UI messages and convert them to model messages.
> Return the generated UI events as the response body for a chat transport.

Use this when the client expects UI message events, such as the default React
chat transport. Run the example with gateway credentials and a route that
already enforces authorization and request limits.

1. Read the `messages` field from the request body. Validate it before starting
   a model call.
2. Open the model stream within the response stream and return its UI events.

   ```ts
   import {
     convertToModelMessages,
     createUIMessageStreamResponse,
     streamText,
     validateUIMessages,
   } from '@jambudipa/ai-effect/ai';
   import { Effect, Stream } from 'effect';

   export async function POST(request: Request): Promise<Response> {
     let payload: unknown;
     try {
       payload = await request.json();
     } catch {
       return new Response('Expected JSON.', { status: 400 });
     }
     if (
       typeof payload !== 'object' ||
       payload === null ||
       !('messages' in payload)
     ) {
       return new Response('Expected a messages field.', { status: 400 });
     }

     const parsed = await Effect.runPromise(
       validateUIMessages({ messages: payload.messages }).pipe(Effect.option),
     );
     if (parsed._tag === 'None') {
       return new Response('The messages are invalid.', { status: 400 });
     }

     return Effect.runPromise(
       Effect.gen(function* () {
         const messages = yield* convertToModelMessages(parsed.value);
         const stream = Stream.unwrap(
           streamText({
             model: 'openai/gpt-5-mini',
             messages,
             abortSignal: request.signal,
           }).pipe(Effect.map((result) => result.toUIMessageStream())),
         );
         return yield* createUIMessageStreamResponse({ stream });
       }),
     );
   }
   ```

3. Send a message with your chat client. Confirm that text appears as the
   events arrive. Send malformed messages and confirm that the route returns
   HTTP 400.

If your messages carry app-specific data or tool parts, supply the matching
schemas when you validate them. See
[Render a React chat](../frameworks/render-a-react-chat.md) for the client.
