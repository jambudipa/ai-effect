'use client';

import * as sdk from '@ai-sdk/rsc';
import { Effect, Stream } from 'effect';
import { useEffect, useMemo } from 'react';
import { runSync, sdkError, type AiSdkError } from '../internal/operation.js';
import { ViewLifetime } from './lifetime.js';
import type {
  InferActions,
  InferAIState,
  InferUIState,
  ProviderComponent,
  ValueOrUpdater,
} from './rsc-types.js';

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

export function useUIState<AI extends ProviderComponent>(): StateHook<
  InferUIState<AI, unknown>
> {
  const [state, set] = sdk.useUIState();
  return [state as InferUIState<AI, unknown>, (next) => set(next)];
}

type AIState<AI extends ProviderComponent> = InferAIState<AI, unknown>;
type StateHook<State> = [
  state: State,
  set: (next: ValueOrUpdater<State>) => void,
];

export function useAIState<AI extends ProviderComponent>(): StateHook<
  AIState<AI>
>;
export function useAIState<
  AI extends ProviderComponent,
  Key extends keyof AIState<AI> = keyof AIState<AI>,
>(key: Key): StateHook<AIState<AI>[Key]>;
export function useAIState(
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

export function useActions<AI extends ProviderComponent>(): PublicActions<
  InferActions<AI, Record<string, (...args: unknown[]) => Promise<unknown>>>
> {
  const actions = sdk.useActions() as Record<
    string,
    (...args: unknown[]) => Promise<unknown>
  >;
  const view = useView();
  return Object.fromEntries(
    Object.entries(actions).map(([name, action]) => [
      name,
      (...args: unknown[]) =>
        view.command(`useActions.${name}`, () => action(...args)),
    ]),
  ) as PublicActions<
    InferActions<AI, Record<string, (...args: unknown[]) => Promise<unknown>>>
  >;
}

export function useSyncUIState() {
  const synchronize = sdk.useSyncUIState();
  const view = useView();
  return () => view.command('useSyncUIState', synchronize);
}
