---
title: How to add a stop button to a React chat
doc-type: how-to
sources: [src/frameworks/react.ts, src/frameworks/lifetime.ts, src/core-chat.ts]
---

# How to add a stop button to a React chat

> **TL;DR:** Use the `stop()` Effect from the same `useChat` instance that
> sends the request. Enable the button while the answer is in progress.

Use this when your React chat already sends messages to an endpoint. See
[Render a React chat](render-a-react-chat.md) for message rendering.

1. Derive the button state from `chat.status`.
2. Run the stop Effect in the click handler.

   ```tsx
   'use client';

   import { useChat } from '@jambudipa/ai-effect/react';
   import { Effect } from 'effect';

   export function ChatControls() {
     const chat = useChat();
     const sending = chat.status === 'submitted' || chat.status === 'streaming';

     return (
       <div>
         <button
           type="button"
           disabled={sending}
           onClick={() => {
             void Effect.runPromiseExit(
               chat.sendMessage({ text: 'Count to ten.' }),
             );
           }}
         >
           Send
         </button>
         <button
           type="button"
           disabled={!sending}
           onClick={() => {
             void Effect.runPromiseExit(chat.stop());
           }}
         >
           Stop
         </button>
         <p aria-live="polite">{chat.status}</p>
       </div>
     );
   }
   ```

3. Start a request with a slow test response. Click **Stop** while the server
   sends the answer. Confirm that the client stops receiving further parts.

Use the existing hook state if the chat already displays message history.
For server cancellation, pass the HTTP request signal to the model as in
[Serve UI message events](../streaming/serve-a-ui-message-response.md).
