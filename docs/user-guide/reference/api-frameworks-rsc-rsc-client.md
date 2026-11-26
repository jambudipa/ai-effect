---
title: '@jambudipa/ai-effect/rsc API'
doc-type: reference
sources: [src/frameworks, src/internal, src/core-chat.ts, package.json]
---

# @jambudipa/ai-effect/rsc API

> **TL;DR:** This reference lists the public declarations for this entry. Signatures and descriptions come from the package declarations.

Import path: `@jambudipa/ai-effect/rsc`. Conditions: `types`.

## `AIAction`

Declare a server action with typed arguments, result, failure, and required services.

```text
export type AIAction<Argument = unknown, Result = unknown, Failure = never, Services = never> = (...args: Argument[]) => Effect.Effect<Result, Failure, Services>;
```

## `AIActions`

Associate server action names with the Effect action contract used by the RSC provider.

```text
export type AIActions<Argument = never, Result = unknown, Failure = unknown, Services = unknown> = Record<string, AIAction<Argument, Result, Failure, Services>>;
```

## `AIProvider`

Represent the asynchronous React provider with its AI state, UI state, and action types.

```text
export type AIProvider<State = unknown, UI = unknown, Actions = AIActions> = (props: AIProviderProps<State, UI, Actions>) => Promise<ReactElement>;
```

## `AIProviderProps`

Supply children and initial state to the native wrapper and carry action types for
client inference.

```text
export type AIProviderProps<State = unknown, UI = unknown, Actions = AIActions> = {
    readonly children: ReactNode;
    readonly initialAIState?: State;
    readonly initialUIState?: UI;
    readonly $ActionTypes?: Actions;
};
```

## `EffectAction`

Constrain a host action to the Effect return channel so callers can capture its
services.

```text
export type EffectAction = (...args: never[]) => Effect.Effect<unknown, unknown, unknown>;
```

## `InferActions`

Extract the action record from a typed provider so client hooks retain concrete action
signatures.

```text
export type InferActions<T, Fallback> = T extends AIProvider<infer _State, infer _UI, infer Actions> ? Actions : Fallback;
```

## `InferAIState`

Extract AI state from a typed provider component and use the fallback for other
components.

```text
export type InferAIState<T, Fallback> = T extends AIProvider<infer State, infer _UI, infer _Actions> ? State : Fallback;
```

## `InferUIState`

Extract UI state from a typed provider component and use the fallback for other
components.

```text
export type InferUIState<T, Fallback> = T extends AIProvider<infer _State, infer UI, infer _Actions> ? UI : Fallback;
```

## `InternalAIProviderProps`

Pass initialized state, optional patch, and wrapped actions to the internal provider
boundary.

```text
export type InternalAIProviderProps<State = unknown, UI = unknown> = {
    readonly children: ReactNode;
    readonly initialUIState: UI;
    readonly initialAIState: State;
    readonly initialAIStatePatch?: Effect.Effect<State, AiSdkError>;
    readonly wrappedActions: ServerWrappedActions<State>;
    readonly wrappedSyncUIState?: ServerWrappedAction<State>;
};
```

## `InternalAIStateStorageOptions`

Carry the optional state persistence hook used by the server state store.

```text
export type InternalAIStateStorageOptions = {
    readonly onSetAIState?: OnSetAIState<unknown>;
};
```

## `JSONValue`

The public declaration does not include a description.

```text
export type JSONValue = string | number | boolean | JSONObject | JSONArray;
```

## `MutableAIState`

Update or finalize server state from a provider action using lazy Effect commands.

```text
export type MutableAIState<State> = {
    readonly get: () => Effect.Effect<State, AiSdkError>;
    readonly update: (next: ValueOrUpdater<State>) => Effect.Effect<void, AiSdkError>;
    readonly done: (...args: [] | [next: State]) => Effect.Effect<void, AiSdkError>;
};
```

## `OnGetUIState`

Provide an Effect callback for restoring UI state from the host, with `undefined` for
absent state.

```text
export type OnGetUIState<State, Services = never> = AIAction<void, State | undefined, unknown, Services>;
```

## `OnSetAIState`

Observe the native state update event with an Effect for external state persistence.

```text
export type OnSetAIState<State, Services = never> = (event: Parameters<import('@ai-sdk/rsc').OnSetAIState<State>>[0]) => Effect.Effect<void, unknown, Services>;
```

## `ProviderComponent`

Accept a React server provider component as the type witness for state and action hooks.

```text
export type ProviderComponent = (props: never) => Promise<ReactElement>;
```

## `readStreamableValue`

Read server stream updates through an Effect stream and map native iterator failures.

```text
export declare function readStreamableValue<A>(value: sdk.StreamableValue<A>): Stream.Stream<A | undefined, AiSdkError, never>;
```

## `ServerWrappedAction`

Associate the server result with an Effect that yields the resulting state patch.

```text
export type ServerWrappedAction<State = unknown> = (aiState: State, ...args: unknown[]) => Effect.Effect<readonly [Effect.Effect<State, AiSdkError>, unknown], AiSdkError>;
```

## `ServerWrappedActions`

Index wrapped server actions by the names exposed to the RSC host.

```text
export type ServerWrappedActions<State = unknown> = Record<string, ServerWrappedAction<State>>;
```

## `StreamableValue`

StreamableValue is a value that can be streamed over the network via AI Actions.
To read the streamed values, use the `readStreamableValue` or `useStreamableValue` APIs.

```text
type StreamableValue<T = any, E = any> = {
  [__internal_curr]?: T;
  [__internal_error]?: E;
};
```

## `useActions`

Expose typed Effect commands for the native server actions in the current RSC provider.

```text
export declare function useActions<AI extends ProviderComponent>(): PublicActions<InferActions<AI, Record<string, (...args: unknown[]) => Promise<unknown>>>>;
```

## `useAIState`

Read and update the complete AI state associated with the current provider component.
Read and update the named AI state field while keeping its value type.

```text
export declare function useAIState<AI extends ProviderComponent>(): StateHook<AIState<AI>>;
```

```text
export declare function useAIState<AI extends ProviderComponent, Key extends keyof AIState<AI> = keyof AIState<AI>>(key: Key): StateHook<AIState<AI>[Key]>;
```

## `useStreamableValue`

Subscribe to native streamable updates and normalize a received failure to `AiSdkError`.

```text
export declare function useStreamableValue<A, E = unknown>(value?: sdk.StreamableValue<A, E>): [data: A | undefined, error: AiSdkError | undefined, pending: boolean];
```

## `useSyncUIState`

Return a view-owned Effect command for native server UI synchronization.

```text
export declare function useSyncUIState(): () => Effect.Effect<void, AiSdkError, never>;
```

## `useUIState`

Read or update client UI state with the type carried by the provider component.

```text
export declare function useUIState<AI extends ProviderComponent>(): StateHook<InferUIState<AI, unknown>>;
```

## `ValueOrUpdater`

Accept a complete next state or a function that derives it from the current state.

```text
export type ValueOrUpdater<State> = State | ((current: State) => State);
```

