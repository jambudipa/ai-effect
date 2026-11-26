---
title: '@jambudipa/ai-effect/rsc API'
doc-type: reference
sources: [src/frameworks, src/internal, src/core-chat.ts, package.json]
---

# @jambudipa/ai-effect/rsc API

> **TL;DR:** This reference lists the public declarations for this entry. Signatures and descriptions come from the package declarations.

Import path: `@jambudipa/ai-effect/rsc`. Conditions: `react-server → types`.

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

## `createAI`

Build the native RSC provider and capture the service context for its scoped actions and
state callbacks.

```text
createAI: <State, UI, Actions extends AIActions, R = never>(options: CreateAIOptions<State, UI, Actions, R>) => Effect.Effect<AIProvider<State, UI, Actions>, AiSdkError, R | Effect.Services<ReturnType<Actions[keyof Actions]>>>
```

## `createStreamableUI`

Create a scoped writer for streaming React nodes. Pass its hosted value to the client.

```text
createStreamableUI: (initialValue?: ReactNode) => Effect.Effect<Streamable<ReactNode, ReactNode>, AiSdkError, import("effect/Scope").Scope>
```

## `createStreamableValue`

Create a scoped writer for streaming typed values from a server action.

```text
createStreamableValue: <A, E = unknown>(initialValue?: A | ReadableStream<A>) => Effect.Effect<Streamable<sdk.StreamableValue<A, E>, A>, AiSdkError, import("effect/Scope").Scope>
```

## `EffectAction`

Constrain a host action to the Effect return channel so callers can capture its
services.

```text
export type EffectAction = (...args: never[]) => Effect.Effect<unknown, unknown, unknown>;
```

## `getAIState`

Read a snapshot of the complete server state from the current provider action context.
Read one server state field while retaining its type from the provider component.
Read a server state field when the caller does not supply a concrete provider type.

```text
export declare function getAIState<AI extends ProviderComponent>(): Effect.Effect<Readonly<InferAIState<AI, unknown>>, AiSdkError>;
```

```text
export declare function getAIState<AI extends ProviderComponent, Key extends keyof InferAIState<AI, unknown> = keyof InferAIState<AI, unknown>>(key: Key): Effect.Effect<Readonly<InferAIState<AI, unknown>[Key]>, AiSdkError>;
```

```text
export declare function getAIState(key: PropertyKey): Effect.Effect<unknown, AiSdkError>;
```

## `getMutableAIState`

Get a writer for the complete server state in the active provider action.
Get a writer limited to the selected typed field of the server state.
Get a keyed state writer when the concrete provider type is unavailable.

```text
export declare function getMutableAIState<AI extends ProviderComponent>(): Effect.Effect<MutableAIState<AIState<AI>>, AiSdkError>;
```

```text
export declare function getMutableAIState<AI extends ProviderComponent, Key extends keyof AIState<AI> = keyof AIState<AI>>(key: Key): Effect.Effect<MutableAIState<AIState<AI>[Key]>, AiSdkError>;
```

```text
export declare function getMutableAIState(key: PropertyKey): Effect.Effect<MutableAIState<unknown>, AiSdkError>;
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

## `streamUI`

Start native RSC rendering in the caller scope and adapt its raw event reader to an
Effect stream.

```text
streamUI: <Tools extends RenderSchemas = {}, R = never>(options: StreamUIOptions<Tools, R>) => Effect.Effect<{
    stream: Stream.Stream<import("@ai-sdk/provider").LanguageModelV4StreamPart, AiSdkError, never>;
    value: ReactNode;
    request?: {
        url?: string;
        body?: unknown;
    };
    response?: {
        headers?: import("@ai-sdk/provider").SharedV4Headers;
    };
}, AiSdkError, import("effect/Scope").Scope | R>
```

## `ValueOrUpdater`

Accept a complete next state or a function that derives it from the current state.

```text
export type ValueOrUpdater<State> = State | ((current: State) => State);
```

