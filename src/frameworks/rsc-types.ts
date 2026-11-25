import type { Effect } from 'effect';
import type { ReactElement, ReactNode } from 'react';
import type { AiSdkError } from '../internal/operation.js';

export type { JSONValue, StreamableValue } from '@ai-sdk/rsc';

export type EffectAction = (
  ...args: never[]
) => Effect.Effect<unknown, unknown, unknown>;
export type AIAction<
  Argument = unknown,
  Result = unknown,
  Failure = never,
  Services = never,
> = (...args: Argument[]) => Effect.Effect<Result, Failure, Services>;
export type AIActions<
  Argument = never,
  Result = unknown,
  Failure = unknown,
  Services = unknown,
> = Record<string, AIAction<Argument, Result, Failure, Services>>;

export type AIProviderProps<
  State = unknown,
  UI = unknown,
  Actions = AIActions,
> = {
  readonly children: ReactNode;
  readonly initialAIState?: State;
  readonly initialUIState?: UI;
  readonly $ActionTypes?: Actions;
};

export type AIProvider<State = unknown, UI = unknown, Actions = AIActions> = (
  props: AIProviderProps<State, UI, Actions>,
) => Promise<ReactElement>;

export type ProviderComponent = (props: never) => Promise<ReactElement>;
export type InferAIState<T, Fallback> =
  T extends AIProvider<infer State, infer _UI, infer _Actions>
    ? State
    : Fallback;
export type InferUIState<T, Fallback> =
  T extends AIProvider<infer _State, infer UI, infer _Actions> ? UI : Fallback;
export type InferActions<T, Fallback> =
  T extends AIProvider<infer _State, infer _UI, infer Actions>
    ? Actions
    : Fallback;
export type ValueOrUpdater<State> = State | ((current: State) => State);

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

export type InternalAIProviderProps<State = unknown, UI = unknown> = {
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
  void,
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
    next: ValueOrUpdater<State>,
  ) => Effect.Effect<void, AiSdkError>;
  readonly done: (
    ...args: [] | [next: State]
  ) => Effect.Effect<void, AiSdkError>;
};
