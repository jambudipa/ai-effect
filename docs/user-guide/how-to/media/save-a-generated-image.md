---
title: How to save a generated image to a file
doc-type: how-to
sources: [src/AiSdk.ts, src/core-models.ts, src/core-contracts.ts]
---

# How to save a generated image to a file

> **TL;DR:** Use `generateImage` to get binary output. Select the extension from the returned media type before you write the file.

Pass a model that supports image generation and run the function in a writable directory. The example creates one image for a thumbnail.

```ts
import { writeFile } from 'node:fs/promises';
import { generateImage, type ImageModel } from '@jambudipa/ai-effect/ai';
import { Effect } from 'effect';

export const saveThumbnail = (model: ImageModel, prompt: string) =>
  Effect.gen(function* () {
    const { image } = yield* generateImage({ model, prompt });
    const extensions = new Map([
      ['image/png', 'png'],
      ['image/jpeg', 'jpg'],
      ['image/webp', 'webp'],
    ]);
    const extension = extensions.get(image.mediaType);
    if (!extension) {
      return yield* Effect.fail(
        new Error('Unsupported image type: ' + image.mediaType),
      );
    }

    const path = 'thumbnail.' + extension;
    yield* Effect.tryPromise(() =>
      writeFile(path, image.uint8Array, { flag: 'wx' }),
    );
    return path;
  });
```

Read the returned path to find the file. If the destination already exists, choose a different name. The example opens the file exclusively so it reports the conflict. If you need web output, send the same bytes with `image.mediaType` in the response instead of writing a local file.

See the [core API reference](../../reference/core.md).
