---
title: How to transcribe a recording with timestamps
doc-type: how-to
sources: [src/AiSdk.ts, src/core-models.ts, src/core-contracts.ts]
---

# How to transcribe a recording with timestamps

> **TL;DR:** Pass local audio bytes to a transcription model. Read the full transcript and keep the time ranges to mark passages in your player.

Use a supported recording format and a transcription model handle. Pass the path of the recording to the function.

```ts
import { readFile } from 'node:fs/promises';
import { transcribe, type TranscriptionModel } from '@jambudipa/ai-effect/ai';
import { Effect } from 'effect';

export const transcribeRecording = (model: TranscriptionModel, path: string) =>
  Effect.gen(function* () {
    const audio = yield* Effect.tryPromise(() => readFile(path));
    const result = yield* transcribe({ model, audio });

    return {
      transcript: result.text,
      cues: result.segments.map(({ text, startSecond, endSecond }) => ({
        start: startSecond,
        end: endSecond,
        text,
      })),
    };
  });
```

Use `transcript` for plain text and `cues` to highlight passages during playback. The cue times are in seconds. If the provider gives no segments for the recording, show the plain transcript. If a long file exceeds provider limits, split it before submission and add each clip's start time to its cue times.

See the [core API reference](../../reference/core.md).
