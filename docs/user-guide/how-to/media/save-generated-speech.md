---
title: How to save generated speech to an MP3 file
doc-type: how-to
sources:
  [src/core-models.ts, src/core.ts, src/providers/openai.ts, src/AiSdk.ts]
---

# How to save generated speech to an MP3 file

> **TL;DR:** Select a speech model and request MP3 audio. Write the returned
> `audio.uint8Array` to a file.

Use this example to turn a short line of application text into an audio file
on a Node.js server. Configure `OPENAI_API_KEY` and choose a speech model and
voice available to that key.

1. Select the speech model. Pass the line of text and output format to
   `generateSpeech`.
2. Write the byte array and return the media type to the caller.

   ```ts
   import { writeFile } from 'node:fs/promises';
   import { generateSpeech } from '@jambudipa/ai-effect/ai';
   import { createOpenAI } from '@jambudipa/ai-effect/openai';
   import { Effect } from 'effect';

   export const saveGreeting = () =>
     Effect.gen(function* () {
       const provider = yield* createOpenAI();
       const model = yield* provider.speech('gpt-4o-mini-tts');
       const { audio } = yield* generateSpeech({
         model,
         text: 'Your order is ready for collection.',
         voice: 'alloy',
         outputFormat: 'mp3',
       });
       yield* Effect.tryPromise(() =>
         writeFile('greeting.mp3', audio.uint8Array),
       );
       return audio.mediaType;
     });

   console.log(await Effect.runPromise(saveGreeting()));
   ```

3. Open `greeting.mp3` and check that it contains the line of speech.

If the application serves the bytes over HTTP, use `audio.mediaType` as the
response content type. If you request a different output format, update the
file extension too. See the [OpenAI adapter](../../reference/api/providers/openai.md).
