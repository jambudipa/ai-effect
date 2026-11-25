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
