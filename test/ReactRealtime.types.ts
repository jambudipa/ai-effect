import type { Effect } from 'effect';
import type { AiSdkError } from '../src/AiSdk.js';
import type { Experimental_UseRealtimeReturn } from '../src/frameworks/react.js';

export const checkRealtimeConnect = (
  controls: Experimental_UseRealtimeReturn,
  stream: MediaStream,
): [Effect.Effect<void, AiSdkError>, Effect.Effect<void, AiSdkError>] => [
  controls.connect(),
  controls.connect({ stream, capture: false }),
];
