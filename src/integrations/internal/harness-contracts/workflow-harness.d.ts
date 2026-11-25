// Generated from @ai-sdk/workflow-harness in @ai-sdk/workflow-harness@1.0.193. Do not edit.
// Original license: harness.LICENSE.
// Normalize Zod v4 declarations for the Zod 3.25.76 bridge.
import {
  HarnessV1ContinueTurnState,
  HarnessV1Prompt,
  HarnessV1ResumeSessionState,
} from './harness.js';
import { HarnessAgent, HarnessAgentSession } from '@ai-sdk/harness/agent';
type HarnessWorkflowModelMessage =
  | {
      readonly role: 'system';
      readonly content: any;
    }
  | {
      readonly role: 'user';
      readonly content: any;
    }
  | {
      readonly role: 'assistant';
      readonly content: any;
    }
  | {
      readonly role: 'tool';
      readonly content: any;
    };
type HarnessWorkflowStatus =
  | 'not_started'
  | 'ready_for_next_step'
  | 'awaiting_tool_approval'
  | 'finished'
  | 'failed'
  | 'timed_out';
interface HarnessWorkflowUsageSummary {
  readonly inputTokens?: number;
  readonly outputTokens?: number;
}
interface HarnessWorkflowFinalResult<OUTPUT = unknown> {
  readonly sessionId: string;
  readonly finishReason: string;
  readonly usage?: HarnessWorkflowUsageSummary;
  readonly output?: OUTPUT;
}
interface HarnessWorkflowSerializedChunk {
  readonly type: string;
  readonly [key: string]: unknown;
}
interface HarnessWorkflowStreamContext {
  readonly activeTextParts?: Record<string, HarnessWorkflowSerializedChunk>;
  readonly activeReasoningParts?: Record<
    string,
    HarnessWorkflowSerializedChunk
  >;
  readonly activeToolInputs?: Record<
    string,
    {
      readonly start: HarnessWorkflowSerializedChunk;
      readonly text: string;
    }
  >;
  readonly pendingToolInputs?: Record<string, HarnessWorkflowSerializedChunk>;
}
interface HarnessWorkflowState<OUTPUT = unknown> {
  readonly sessionId: string;
  readonly prompt: HarnessV1Prompt;
  readonly messages?: HarnessWorkflowModelMessage[];
  readonly status: HarnessWorkflowStatus;
  readonly resumeFrom?: HarnessV1ResumeSessionState;
  readonly continueFrom?: HarnessV1ContinueTurnState;
  readonly streamContext?: HarnessWorkflowStreamContext;
  readonly finalResult?: HarnessWorkflowFinalResult<OUTPUT>;
  readonly error?: string;
}
interface HarnessWorkflowInput {
  prompt?: HarnessV1Prompt;
  messages?: HarnessWorkflowModelMessage[];
  sessionId: string;
  resumeFrom?: HarnessV1ResumeSessionState;
  continueFrom?: HarnessV1ContinueTurnState;
}
export declare function createHarnessWorkflowState<OUTPUT = unknown>(
  input: HarnessWorkflowInput,
): HarnessWorkflowState<OUTPUT>;
export declare function finalizeHarnessWorkflow<OUTPUT = unknown>(
  state: HarnessWorkflowState<OUTPUT>,
): HarnessWorkflowFinalResult<OUTPUT>;
type HarnessV1UserMessage = Exclude<HarnessV1Prompt, string>;
type WorkflowSandboxSession = NonNullable<
  NonNullable<Parameters<HarnessAgent['createSession']>[0]>['sandboxSession']
>;
interface HarnessWorkflowChunk {
  readonly type: string;
  readonly [key: string]: unknown;
}
interface HarnessWorkflowStreamResult<OUTPUT = unknown> {
  toUIMessageStream(): ReadableStream<HarnessWorkflowChunk>;
  readonly finishReason: PromiseLike<unknown>;
  readonly totalUsage: PromiseLike<unknown>;
  readonly output?: PromiseLike<OUTPUT>;
}
interface HarnessWorkflowAgent<OUTPUT = unknown> {
  readonly hasOutput?: boolean;
  createSession(options?: {
    sessionId?: string;
    resumeFrom?: HarnessV1ResumeSessionState;
    continueFrom?: HarnessV1ContinueTurnState;
    sandboxSession?: WorkflowSandboxSession;
  }): Promise<HarnessAgentSession>;
  stream(
    options:
      | {
          session: HarnessAgentSession;
          prompt: string | HarnessV1UserMessage[];
          messages?: undefined;
        }
      | {
          session: HarnessAgentSession;
          prompt?: undefined;
          messages: HarnessWorkflowModelMessage[];
        },
  ): Promise<HarnessWorkflowStreamResult<OUTPUT>>;
  continueStream(options: {
    session: HarnessAgentSession;
  }): Promise<HarnessWorkflowStreamResult<OUTPUT>>;
}
interface RunHarnessAgentOptions<OUTPUT = unknown> {
  readonly agent: HarnessWorkflowAgent<OUTPUT>;
  readonly state: HarnessWorkflowState;
  readonly sandboxSession?: WorkflowSandboxSession;
  readonly timeSliceSeconds?: number;
  readonly destroyOnFinish?: boolean;
  readonly writable?: WritableStream<HarnessWorkflowChunk>;
}
type RunHarnessAgentStepOptions<OUTPUT = unknown> = Omit<
  RunHarnessAgentOptions<OUTPUT>,
  'timeSliceSeconds'
>;
export declare function runHarnessAgentStep<OUTPUT = unknown>(
  options: RunHarnessAgentStepOptions<OUTPUT>,
): Promise<HarnessWorkflowState<OUTPUT>>;
interface RunHarnessAgentTimeSliceOptions<OUTPUT = unknown> extends Omit<
  RunHarnessAgentOptions<OUTPUT>,
  'timeSliceSeconds'
> {
  readonly timeSliceSeconds?: number;
}
export declare function runHarnessAgentTimeSlice<OUTPUT = unknown>(
  options: RunHarnessAgentTimeSliceOptions<OUTPUT>,
): Promise<HarnessWorkflowState<OUTPUT>>;
interface RunHarnessAgentSliceOptions<OUTPUT = unknown> extends Omit<
  RunHarnessAgentTimeSliceOptions<OUTPUT>,
  'timeSliceSeconds'
> {
  readonly timeSliceSeconds?: number;
  readonly sliceTimeoutSeconds?: number;
}
export declare function runHarnessAgentSlice<OUTPUT = unknown>(
  options: RunHarnessAgentSliceOptions<OUTPUT>,
): Promise<HarnessWorkflowState<OUTPUT>>;
export type {
  HarnessWorkflowAgent,
  HarnessWorkflowChunk,
  HarnessWorkflowFinalResult,
  HarnessWorkflowInput,
  HarnessWorkflowModelMessage,
  HarnessWorkflowState,
  HarnessWorkflowStatus,
  HarnessWorkflowStreamResult,
  HarnessWorkflowUsageSummary,
  RunHarnessAgentSliceOptions,
  RunHarnessAgentStepOptions,
  RunHarnessAgentTimeSliceOptions,
};
