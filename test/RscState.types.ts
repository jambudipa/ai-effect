import type { Effect } from 'effect';
import { expectTypeOf } from 'vitest';
import {
  createAI,
  getAIState,
  getMutableAIState,
} from '../src/frameworks/rsc-server.js';

const provider = createAI({
  actions: {},
  initialAIState: { messages: ['hello'], count: 1 },
  initialUIState: [],
});
type Provider = Effect.Success<typeof provider>;

const snapshot = getAIState('messages');
const editor = getMutableAIState('messages');
const typedSnapshot = getAIState<Provider, 'messages'>('messages');
const typedEditor = getMutableAIState<Provider, 'count'>('count');

expectTypeOf<Effect.Success<typeof snapshot>>().toEqualTypeOf<unknown>();
expectTypeOf<
  Effect.Success<ReturnType<Effect.Success<typeof editor>['get']>>
>().toEqualTypeOf<unknown>();
expectTypeOf<Effect.Success<typeof typedSnapshot>>().toEqualTypeOf<
  ReadonlyArray<string>
>();
expectTypeOf<
  Effect.Success<ReturnType<Effect.Success<typeof typedEditor>['get']>>
>().toEqualTypeOf<number>();

// @ts-expect-error A typed provider restricts the key to its state fields.
getAIState<Provider>('missing');
// @ts-expect-error A typed provider restricts the key to its state fields.
getMutableAIState<Provider>('missing');
