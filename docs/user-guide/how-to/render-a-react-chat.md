---
title: How to render a React chat
doc-type: how-to
sources:
  [
    src/frameworks/react.ts,
    src/frameworks/lifetime.ts,
    src/core-chat.ts,
    package.json,
  ]
---

# How to render a React chat

> **TL;DR:** Import `useChat` from the React entry. Read messages and status
> during render. Run the Effect returned by a chat command at the event boundary.

1. Install a [compatible React peer](../reference/installation.md). Set up your
   server to accept the chat request and return a UI message stream.
2. Place the chat hook in a client component. The default transport uses
   `/api/chat`. Configure a transport if the endpoint differs.
3. Read the text parts and run `sendMessage` from an event handler.

   ```tsx
   'use client';

   import { useChat } from '@jambudipa/ai-effect/react';
   import { Effect } from 'effect';

   export function Chat() {
     const chat = useChat();

     return (
       <section>
         {chat.messages.map((message) => (
           <p key={message.id}>
             {message.parts.map((part) =>
               part.type === 'text' ? part.text : '',
             )}
           </p>
         ))}
         <button
           type="button"
           disabled={chat.status !== 'ready'}
           onClick={() => {
             void Effect.runPromiseExit(chat.sendMessage({ text: 'Hello.' }));
           }}
         >
           Send hello
         </button>
         {chat.error && <p role="alert">The chat request failed.</p>}
       </section>
     );
   }
   ```

Use the helper's `stop()` Effect for a cancel button. See
[Framework adapters](../reference/frameworks.md) for the host exports.
