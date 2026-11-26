import type { Effect } from 'effect';
import type { openOperation } from './operation.js';

/** Keep services and cancellation available when a public agent is bound to a native operation. */
type Owner<Services> = Effect.Success<
  ReturnType<typeof openOperation<Services>>
>;

/** Associate agent handles with factories without retaining unused handle objects. */
const agents = new WeakMap<object, (owner: Owner<never>) => unknown>();

/** Remember how to construct the SDK agent from a public handle and a later operation owner. */
export function registerNativeAgent<Services, Agent>(
  handle: object,
  bind: (owner: Owner<Services>) => Agent,
): void {
  agents.set(handle, bind as (owner: Owner<never>) => Agent);
}

/** Build the registered native agent for the current owner, if the handle is recognized. */
export function bindNativeAgent<Agent, Services = never>(
  handle: object,
  owner: Owner<Services>,
): Agent | undefined {
  return agents.get(handle)?.(owner as Owner<never>) as Agent | undefined;
}
