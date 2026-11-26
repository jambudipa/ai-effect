---
title: How to save a generated video clip
doc-type: how-to
sources: [src/core-experimental.ts, src/core.ts, src/providers/fal.ts]
---

# How to save a generated video clip

> **TL;DR:** Select a video model and request one clip. Save its bytes with a
> filename that matches the returned media type.

Use this example in a Node.js application that creates a clip from a text
prompt. Supply a fal credential in `VIDEO_PROVIDER_KEY` and a video model ID
that your fal account can use in `VIDEO_MODEL_ID`.

1. Select the video model and request one clip with `experimental_generateVideo`.
2. Write the bytes using the returned media type. This example accepts MP4 and WebM.

   ```ts
   import { writeFile } from 'node:fs/promises';
   import { experimental_generateVideo } from '@jambudipa/ai-effect/ai';
   import { createFal } from '@jambudipa/ai-effect/fal';
   import { Config, Effect } from 'effect';

   const program = Effect.gen(function* () {
     const apiKey = yield* Config.String('VIDEO_PROVIDER_KEY');
     const modelId = yield* Config.String('VIDEO_MODEL_ID');
     const provider = yield* createFal({ apiKey });
     const model = yield* provider.video(modelId);
     const { video } = yield* experimental_generateVideo({
       model,
       prompt: 'A blue circle slowly rolls across a white background.',
       n: 1,
     });

     let path: string;
     if (video.mediaType === 'video/mp4') {
       path = 'circle.mp4';
     } else if (video.mediaType === 'video/webm') {
       path = 'circle.webm';
     } else {
       return yield* Effect.fail(
         new Error(`Unexpected format: ${video.mediaType}`),
       );
     }
     yield* Effect.tryPromise(() => writeFile(path, video.uint8Array));
     return path;
   });

   console.log(await Effect.runPromise(program));
   ```

3. Open the printed file and check that it plays as a video.

If the provider rejects the model ID or options, check that the selected
model supports text prompts and the requested clip count. See the
[fal adapter](../../reference/api/providers/fal.md) for the public selectors.
