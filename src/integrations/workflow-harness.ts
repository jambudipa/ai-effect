import * as sdk from '@ai-sdk/workflow-harness';
import { runSync } from '../internal/operation.js';

export type {
  HarnessWorkflowChunk,
  HarnessWorkflowFinalResult,
  HarnessWorkflowInput,
  HarnessWorkflowModelMessage,
  HarnessWorkflowState,
  HarnessWorkflowStatus,
  HarnessWorkflowUsageSummary,
} from '@ai-sdk/workflow-harness';

export const createHarnessWorkflowState = <A = unknown>(
  input: sdk.HarnessWorkflowInput,
) =>
  runSync('WorkflowHarness.createHarnessWorkflowState', () =>
    sdk.createHarnessWorkflowState<A>(input),
  );

export const finalizeHarnessWorkflow = <A = unknown>(
  state: sdk.HarnessWorkflowState<A>,
) =>
  runSync('WorkflowHarness.finalizeHarnessWorkflow', () =>
    sdk.finalizeHarnessWorkflow(state),
  );

import { Effect } from 'effect';
import { runRequest, sdkError } from '../internal/operation.js';
import type { HarnessAgent } from './harness/agent.js';
import { agents } from './internal/harness-agent.js';
import { type SandboxSession, unwrapSandbox } from './internal/sandbox.js';

export type HarnessWorkflowAgent = HarnessAgent;
export type HarnessWorkflowStreamResult = Effect.Success<
  ReturnType<HarnessAgent['stream']>
>;

type Options<T> = Omit<T, 'agent' | 'sandboxSession'> & {
  readonly agent: HarnessWorkflowAgent;
  readonly sandboxSession?: SandboxSession;
};

export type RunHarnessAgentStepOptions =
  Options<sdk.RunHarnessAgentStepOptions>;
export type RunHarnessAgentTimeSliceOptions =
  Options<sdk.RunHarnessAgentTimeSliceOptions>;
export type RunHarnessAgentSliceOptions =
  Options<sdk.RunHarnessAgentSliceOptions>;

type NativeOptions = sdk.RunHarnessAgentSliceOptions;

const run = <T extends NativeOptions>(
  name: string,
  options: Options<T>,
  invoke: (native: T) => Promise<sdk.HarnessWorkflowState>,
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

export const runHarnessAgentStep = (options: RunHarnessAgentStepOptions) =>
  run('WorkflowHarness.runStep', options, sdk.runHarnessAgentStep);

export const runHarnessAgentTimeSlice = (
  options: RunHarnessAgentTimeSliceOptions,
) => run('WorkflowHarness.runTimeSlice', options, sdk.runHarnessAgentTimeSlice);

export const runHarnessAgentSlice = (options: RunHarnessAgentSliceOptions) =>
  run('WorkflowHarness.runSlice', options, sdk.runHarnessAgentSlice);
