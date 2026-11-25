'use client';

import * as sdk from '@ai-sdk/rsc';
import { Effect, Stream } from 'effect';
import { useEffect, useMemo } from 'react';
import { runSync, sdkError, type AiSdkError } from '../internal/operation.js';
import { ViewLifetime } from './lifetime.js';

export type * from './rsc-types.js';

const useView = () => {
  const view = useMemo(() => new ViewLifetime(), []);
  useEffect(() => {
    view.activate();
    return () => view.dispose();
  }, [view]);
  return view;
};

export function readStreamableValue<A>(value: sdk.StreamableValue<A>) {
  const operation = 'readStreamableValue';
  return Stream.unwrap(
    runSync(operation, () => sdk.readStreamableValue(value)).pipe(
      Effect.map((source) =>
        Stream.fromAsyncIterable(source, (cause) => sdkError(operation, cause)),
      ),
    ),
  );
}

export function useStreamableValue<A, E = unknown>(
  value?: sdk.StreamableValue<A, E>,
): [data: A | undefined, error: AiSdkError | undefined, pending: boolean] {
  const [data, error, pending] = sdk.useStreamableValue<A, E>(value);
  return [
    data,
    error === undefined ? undefined : sdkError('useStreamableValue', error),
    pending,
  ];
}

export function useUIState<AI extends sdk.AIProvider>(): ReturnType<
  typeof sdk.useUIState<AI>
> {
  const [state, set] = sdk.useUIState<AI>();
  return [state, (...args: Parameters<typeof set>) => set(...args)];
}

type AIState<AI extends sdk.AIProvider> = sdk.InferAIState<AI, unknown>;
type StateHook<State> = [
  state: State,
  set: (next: sdk.ValueOrUpdater<State>) => void,
];

export function useAIState<AI extends sdk.AIProvider>(): StateHook<AIState<AI>>;
export function useAIState<
  AI extends sdk.AIProvider,
  Key extends keyof AIState<AI> = keyof AIState<AI>,
>(key: Key): StateHook<AIState<AI>[Key]>;
export function useAIState<AI extends sdk.AIProvider>(
  key?: PropertyKey,
): [state: unknown, set: (next: never) => void] {
  const hook = sdk.useAIState as (
    key?: PropertyKey,
  ) => [state: unknown, set: (next: never) => void];
  const [state, setter] = hook(key);
  return [state, (next) => setter(next)];
}

type PublicActions<Actions> = {
  [K in keyof Actions]: Actions[K] extends (...args: infer P) => infer A
    ? (
        ...args: P
      ) => Effect.Effect<
        A extends Effect.Effect<infer Value, unknown, unknown>
          ? Value
          : Awaited<A>,
        AiSdkError
      >
    : never;
};

export function useActions<AI extends sdk.AIProvider>(): PublicActions<
  sdk.InferActions<AI, sdk.AIActions>
> {
  const actions = sdk.useActions<AI>() as sdk.AIActions;
  const view = useView();
  return Object.fromEntries(
    Object.entries(actions).map(([name, action]) => [
      name,
      (...args: unknown[]) =>
        view.command(`useActions.${name}`, () => action(...args)),
    ]),
  ) as PublicActions<sdk.InferActions<AI, sdk.AIActions>>;
}

export function useSyncUIState() {
  const synchronize = sdk.useSyncUIState();
  const view = useView();
  return () => view.command('useSyncUIState', synchronize);
}
