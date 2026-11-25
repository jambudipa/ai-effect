import type { Effect } from 'effect';
import type { Scope } from 'effect/Scope';
import {
  WorkflowAgent,
  type OutputSpecification,
} from '../src/integrations/workflow.js';

type Expect<T extends true> = T;
type Same<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;

type Order = { readonly id: string };
type OutputService = { readonly id: 'workflow-output-service' };
declare const output: OutputSpecification<Order, Partial<Order>, OutputService>;

const make = WorkflowAgent.make({ model: 'test/model', output });
declare const agent: Effect.Success<typeof make>;
const generate = agent.generate({
  messages: [{ role: 'user', content: 'Find the order.' }],
  output,
});

export type ConstructorBindsOutputServices = Expect<
  Same<Effect.Services<typeof make>, Scope | OutputService>
>;
export type CallBindsOutputServices = Expect<
  Same<Effect.Services<typeof generate>, OutputService>
>;
export type GeneratedOutputPreservesType = Expect<
  Same<Effect.Success<typeof generate>['output'], Order>
>;
