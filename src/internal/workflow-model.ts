import {
  WORKFLOW_DESERIALIZE,
  WORKFLOW_SERIALIZE,
} from '@ai-sdk/provider-utils';
import { Effect } from 'effect';
import { runSync, sdkError } from './operation.js';
import type { AiSdkError } from './operation.js';
import { adaptModelConstructor } from './provider-adapter.js';
import type { AdaptedConstructor } from './provider-adapter.js';

/** Describe a native workflow-capable model class and its persistence hooks. */
interface WorkflowModelClass<Args extends unknown[], Native, Payload, Input> {
  new (...args: Args): Native;
  /** Extract a workflow payload from the original native model instance. */
  [WORKFLOW_SERIALIZE](model: Native): Payload;
  /** Build a native model from its deserialized workflow configuration. */
  [WORKFLOW_DESERIALIZE](input: Input): Native;
}

/** Expose native workflow hooks as Effects over registered public model handles. */
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

/** Preserve native constructor arguments and add Effect workflow persistence hooks. */
export type AdaptedWorkflowConstructor<
  Constructor extends WorkflowModelClass<never[], unknown, unknown, never>,
  Model,
> = AdaptedConstructor<Constructor, Model> &
  AdaptedWorkflowHooks<Constructor, Model>;

/** Adapt workflow serialization and reject handles that do not wrap the expected native class. */
export const workflowModelHooks = <
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

/** Bind lazy native construction to the workflow serialization and deserialization adapters. */
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
