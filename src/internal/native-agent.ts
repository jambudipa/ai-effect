import type { Effect } from 'effect';
import type { openOperation } from './operation.js';

type Owner<Services> = Effect.Success<
  ReturnType<typeof openOperation<Services>>
>;

const agents = new WeakMap<object, (owner: Owner<never>) => unknown>();

export function registerNativeAgent<Services, Agent>(
  handle: object,
  bind: (owner: Owner<Services>) => Agent,
): void {
  agents.set(handle, bind as (owner: Owner<never>) => Agent);
}

export function bindNativeAgent<Agent, Services = never>(
  handle: object,
  owner: Owner<Services>,
): Agent | undefined {
  return agents.get(handle)?.(owner as Owner<never>) as Agent | undefined;
}
