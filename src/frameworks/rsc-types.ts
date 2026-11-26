import type { Effect } from 'effect';
import type { ReactElement, ReactNode } from 'react';
import type { AiSdkError } from '../internal/operation.js';

export type { JSONValue, StreamableValue } from '@ai-sdk/rsc';

/**
 * Constrain a host action to the Effect return channel so callers can capture its
 * services.
 */
export type EffectAction = (
  ...args: never[]
) => Effect.Effect<unknown, unknown, unknown>;
/**
 * Declare a server action with typed arguments, result, failure, and required services.
 */
export type AIAction<
  Argument = unknown,
  Result = unknown,
  Failure = never,
  Services = never,
> = (...args: Argument[]) => Effect.Effect<Result, Failure, Services>;
/**
 * Associate server action names with the Effect action contract used by the RSC provider.
 */
export type AIActions<
  Argument = never,
  Result = unknown,
  Failure = unknown,
  Services = unknown,
> = Record<string, AIAction<Argument, Result, Failure, Services>>;

/**
 * Supply children and initial state to the native wrapper and carry action types for
 * client inference.
 */
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

/**
 * Represent the asynchronous React provider with its AI state, UI state, and action types.
 */
export type AIProvider<State = unknown, UI = unknown, Actions = AIActions> = (
  props: AIProviderProps<State, UI, Actions>,
) => Promise<ReactElement>;

/**
 * Accept a React server provider component as the type witness for state and action hooks.
 */
export type ProviderComponent = (props: never) => Promise<ReactElement>;
/**
 * Extract AI state from a typed provider component and use the fallback for other
 * components.
 */
export type InferAIState<T, Fallback> =
  T extends AIProvider<infer State, infer _UI, infer _Actions>
    ? State
    : Fallback;
/**
 * Extract UI state from a typed provider component and use the fallback for other
 * components.
 */
export type InferUIState<T, Fallback> =
  T extends AIProvider<infer _State, infer UI, infer _Actions> ? UI : Fallback;
/**
 * Extract the action record from a typed provider so client hooks retain concrete action
 * signatures.
 */
export type InferActions<T, Fallback> =
  T extends AIProvider<infer _State, infer _UI, infer Actions>
    ? Actions
    : Fallback;
/** Accept a complete next state or a function that derives it from the current state. */
export type ValueOrUpdater<State> = State | ((current: State) => State);

/** Associate the server result with an Effect that yields the resulting state patch. */
export type ServerWrappedAction<State = unknown> = (
  aiState: State,
  ...args: unknown[]
) => Effect.Effect<
  readonly [Effect.Effect<State, AiSdkError>, unknown],
  AiSdkError
>;

/** Index wrapped server actions by the names exposed to the RSC host. */
export type ServerWrappedActions<State = unknown> = Record<
  string,
  ServerWrappedAction<State>
>;

/**
 * Pass initialized state, optional patch, and wrapped actions to the internal provider
 * boundary.
 */
export type InternalAIProviderProps<State = unknown, UI = unknown> = {
  readonly children: ReactNode;
  readonly initialUIState: UI;
  readonly initialAIState: State;
  readonly initialAIStatePatch?: Effect.Effect<State, AiSdkError>;
  readonly wrappedActions: ServerWrappedActions<State>;
  readonly wrappedSyncUIState?: ServerWrappedAction<State>;
};

/**
 * Observe the native state update event with an Effect for external state persistence.
 */
export type OnSetAIState<State, Services = never> = (
  event: Parameters<import('@ai-sdk/rsc').OnSetAIState<State>>[0],
) => Effect.Effect<void, unknown, Services>;

/**
 * Provide an Effect callback for restoring UI state from the host, with `undefined` for
 * absent state.
 */
export type OnGetUIState<State, Services = never> = AIAction<
  void,
  State | undefined,
  unknown,
  Services
>;

/** Carry the optional state persistence hook used by the server state store. */
export type InternalAIStateStorageOptions = {
  readonly onSetAIState?: OnSetAIState<unknown>;
};

/** Update or finalize server state from a provider action using lazy Effect commands. */
export type MutableAIState<State> = {
  readonly get: () => Effect.Effect<State, AiSdkError>;
  readonly update: (
    next: ValueOrUpdater<State>,
  ) => Effect.Effect<void, AiSdkError>;
  readonly done: (
    ...args: [] | [next: State]
  ) => Effect.Effect<void, AiSdkError>;
};
