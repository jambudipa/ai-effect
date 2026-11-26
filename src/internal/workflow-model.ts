import {
  WORKFLOW_DESERIALIZE,
  WORKFLOW_SERIALIZE,
} from '@ai-sdk/provider-utils';
import { Effect } from 'effect';
import { runSync, sdkError } from './operation.js';
import type { AiSdkError } from './operation.js';
import { adaptModelConstructor } from './provider-adapter.js';
import type { AdaptedConstructor } from './provider-adapter.js';

interface WorkflowModelClass<Args extends unknown[], Native, Payload, Input> {
  new (...args: Args): Native;
  [WORKFLOW_SERIALIZE](model: Native): Payload;
  [WORKFLOW_DESERIALIZE](input: Input): Native;
}

export type AdaptedWorkflowHooks<
  Constructor extends WorkflowModelClass<never[], unknown, unknown, never>,
  Model,
> = {
  [WORKFLOW_SERIALIZE](
    model: Model,
  ): Effect.Effect<
    ReturnType<Constructor[typeof WORKFLOW_SERIALIZE]>,
    AiSdkError
  >;
  [WORKFLOW_DESERIALIZE](
    input: Parameters<Constructor[typeof WORKFLOW_DESERIALIZE]>[0],
  ): Effect.Effect<Model, AiSdkError>;
};

export type AdaptedWorkflowConstructor<
  Constructor extends WorkflowModelClass<never[], unknown, unknown, never>,
  Model,
> = AdaptedConstructor<Constructor, Model> &
  AdaptedWorkflowHooks<Constructor, Model>;

export const workflowModelHooks = <Native, Payload, Input, Model>(
  operation: string,
  ModelClass: WorkflowModelClass<never[], Native, Payload, Input>,
  wrap: (model: Native) => Model,
  unwrap: (model: Model) => unknown,
) => ({
  [WORKFLOW_SERIALIZE]: (model: Model) =>
    Effect.suspend(() => {
      const step = `${operation}.workflowSerialize`;
      const native = unwrap(model);
      return native instanceof ModelClass
        ? runSync(step, () => ModelClass[WORKFLOW_SERIALIZE](native))
        : Effect.fail(sdkError(step, `Expected a registered ${operation}`));
    }),
  [WORKFLOW_DESERIALIZE]: (input: Input) =>
    runSync(`${operation}.workflowDeserialize`, () =>
      wrap(ModelClass[WORKFLOW_DESERIALIZE](input)),
    ),
});

export const adaptWorkflowModelConstructor = <
  Args extends unknown[],
  Native,
  Payload,
  Input,
  Model,
>(
  operation: string,
  ModelClass: WorkflowModelClass<Args, Native, Payload, Input>,
  wrap: (model: Native) => Model,
  unwrap: (model: Model) => unknown,
) =>
  Object.assign(
    adaptModelConstructor(operation, ModelClass, wrap),
    workflowModelHooks(operation, ModelClass, wrap, unwrap),
  );
