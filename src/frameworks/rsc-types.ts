import type { Effect } from 'effect';
import type { ReactElement, ReactNode } from 'react';
import type { AiSdkError } from '../internal/operation.js';

export type {
  InferAIState,
  InferActions,
  InferUIState,
  JSONValue,
  StreamableValue,
  ValueOrUpdater,
} from '@ai-sdk/rsc';

export type EffectAction = (
  ...args: never[]
) => Effect.Effect<unknown, unknown, unknown>;
export type AIActions = Record<string, EffectAction>;
export type AIAction<
  Arguments extends unknown[],
  Result,
  Failure = never,
  Services = never,
> = (...args: Arguments) => Effect.Effect<Result, Failure, Services>;

export type AIProviderProps<State, UI, Actions> = {
  readonly children: ReactNode;
  readonly initialAIState?: State;
  readonly initialUIState?: UI;
  readonly $ActionTypes?: Actions;
};

export type AIProvider<State, UI, Actions> = (
  props: AIProviderProps<State, UI, Actions>,
) => Promise<ReactElement>;

export type ServerWrappedAction<State = unknown> = (
  aiState: State,
  ...args: unknown[]
) => Effect.Effect<
  readonly [Effect.Effect<State, AiSdkError>, unknown],
  AiSdkError
>;

export type ServerWrappedActions<State = unknown> = Record<
  string,
  ServerWrappedAction<State>
>;

export type InternalAIProviderProps<State, UI> = {
  readonly children: ReactNode;
  readonly initialUIState: UI;
  readonly initialAIState: State;
  readonly initialAIStatePatch?: Effect.Effect<State, AiSdkError>;
  readonly wrappedActions: ServerWrappedActions<State>;
  readonly wrappedSyncUIState?: ServerWrappedAction<State>;
};

export type OnSetAIState<State, Services = never> = (
  event: Parameters<import('@ai-sdk/rsc').OnSetAIState<State>>[0],
) => Effect.Effect<void, unknown, Services>;

export type OnGetUIState<State, Services = never> = AIAction<
  [],
  State | undefined,
  unknown,
  Services
>;

export type InternalAIStateStorageOptions = {
  readonly onSetAIState?: OnSetAIState<unknown>;
};

export type MutableAIState<State> = {
  readonly get: () => Effect.Effect<State, AiSdkError>;
  readonly update: (
    next: import('@ai-sdk/rsc').ValueOrUpdater<State>,
  ) => Effect.Effect<void, AiSdkError>;
  readonly done: (
    ...args: [] | [next: State]
  ) => Effect.Effect<void, AiSdkError>;
};
