import * as native from '@ai-sdk/workflow-harness';
import type * as SDKContract from './internal/harness-contracts/workflow-harness.js';
import { runSync } from '../internal/operation.js';

export type {
  HarnessWorkflowChunk,
  HarnessWorkflowFinalResult,
  HarnessWorkflowInput,
  HarnessWorkflowModelMessage,
  HarnessWorkflowState,
  HarnessWorkflowStatus,
  HarnessWorkflowUsageSummary,
} from './internal/harness-contracts/workflow-harness.js';

/** Initialize the native Workflow state that successive harness slices update. */
export const createHarnessWorkflowState = <A = unknown>(
  input: SDKContract.HarnessWorkflowInput,
) =>
  runSync('WorkflowHarness.createHarnessWorkflowState', () =>
    sdk.createHarnessWorkflowState<A>(input),
  );

/** Convert the final native Workflow state to the SDK's completed result. */
export const finalizeHarnessWorkflow = <A = unknown>(
  state: SDKContract.HarnessWorkflowState<A>,
) =>
  runSync('WorkflowHarness.finalizeHarnessWorkflow', () =>
    sdk.finalizeHarnessWorkflow(state),
  );

import { Effect } from 'effect';
import { runRequest, sdkError } from '../internal/operation.js';
import type { HarnessAgent } from './harness/agent.js';
import { agents } from './internal/harness-agent.js';
import { type SandboxSession, unwrapSandbox } from './internal/sandbox.js';

/** Bind the pinned Workflow Harness contract at the native SDK boundary. */
const sdk = native as unknown as typeof SDKContract;

/** Wrapped agent that can be resolved to a native Workflow-compatible harness. */
export type HarnessWorkflowAgent = HarnessAgent;
/** Successful wrapped harness stream type consumed by the Workflow integration. */
export type HarnessWorkflowStreamResult = Effect.Success<
  ReturnType<HarnessAgent['stream']>
>;

/** Preserve native slice options while requiring wrapped agent and sandbox handles. */
type Options<T> = Omit<T, 'agent' | 'sandboxSession'> & {
  readonly agent: HarnessWorkflowAgent;
  readonly sandboxSession?: SandboxSession;
};

/** Configure a single harness step with a registered Effect agent. */
export type RunHarnessAgentStepOptions =
  Options<SDKContract.RunHarnessAgentStepOptions>;
/** Configure a time-bounded slice with a registered Effect agent. */
export type RunHarnessAgentTimeSliceOptions =
  Options<SDKContract.RunHarnessAgentTimeSliceOptions>;
/** Configure a native slice operation with its corresponding registered handles. */
export type RunHarnessAgentSliceOptions =
  Options<SDKContract.RunHarnessAgentSliceOptions>;

/** Shared native slice contract used to specialize each wrapper entry point. */
type NativeOptions = SDKContract.RunHarnessAgentSliceOptions;

/** Restore native identities and reject an unregistered agent or sandbox before calling the SDK. */
const run = <T extends NativeOptions>(
  name: string,
  options: Options<T>,
  invoke: (native: T) => Promise<SDKContract.HarnessWorkflowState>,
) =>
  Effect.gen(function* () {
    const { agent, sandboxSession, ...rest } = options;
    const nativeAgent = agents.get(agent);
    const sandbox = sandboxSession && unwrapSandbox(sandboxSession);
    if (!nativeAgent || (sandboxSession && !sandbox)) {
      return yield* Effect.fail(
        sdkError(name, 'Invalid harness agent or sandbox session'),
      );
    }
    return yield* runRequest(name, {}, () =>
      invoke({
        ...rest,
        agent: nativeAgent,
        ...(sandbox && { sandboxSession: sandbox }),
      } as unknown as T),
    );
  });

/** Advance the Workflow state by one harness step. */
export const runHarnessAgentStep = (options: RunHarnessAgentStepOptions) =>
  run('WorkflowHarness.runStep', options, sdk.runHarnessAgentStep);

/** Advance the Workflow state through a native time-bounded slice. */
export const runHarnessAgentTimeSlice = (
  options: RunHarnessAgentTimeSliceOptions,
) => run('WorkflowHarness.runTimeSlice', options, sdk.runHarnessAgentTimeSlice);

/** Advance the Workflow state according to the supplied native slice configuration. */
export const runHarnessAgentSlice = (options: RunHarnessAgentSliceOptions) =>
  run('WorkflowHarness.runSlice', options, sdk.runHarnessAgentSlice);
