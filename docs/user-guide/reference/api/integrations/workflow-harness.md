---
title: "Integration API — workflow-harness"
doc-type: reference
sources: [src/integrations/workflow-harness.ts, package.json]
---

# workflow-harness

> **TL;DR:** The `@jambudipa/ai-effect/workflow-harness` entry provides the public declarations listed below.

## Import

`@jambudipa/ai-effect/workflow-harness`

## `createHarnessWorkflowState`

Initialize the native Workflow state that successive harness slices update.

```text
export declare const createHarnessWorkflowState: <A = unknown>(input: SDKContract.HarnessWorkflowInput) => Effect.Effect<SDKContract.HarnessWorkflowState<A>, import("../internal/operation.js").AiSdkError, never>;
```

## `finalizeHarnessWorkflow`

Convert the final native Workflow state to the SDK's completed result.

```text
export declare const finalizeHarnessWorkflow: <A = unknown>(state: SDKContract.HarnessWorkflowState<A>) => Effect.Effect<SDKContract.HarnessWorkflowFinalResult<A>, import("../internal/operation.js").AiSdkError, never>;
```

## `HarnessWorkflowAgent`

Wrapped agent that can be resolved to a native Workflow-compatible harness.

```text
export type HarnessWorkflowAgent = HarnessAgent;
```

## `HarnessWorkflowChunk`

```text
interface HarnessWorkflowChunk {
  readonly type: string;
  readonly [key: string]: unknown;
}
```

## `HarnessWorkflowFinalResult`

```text
interface HarnessWorkflowFinalResult<OUTPUT = unknown> {
  readonly sessionId: string;
  readonly finishReason: string;
  readonly usage?: HarnessWorkflowUsageSummary;
  readonly output?: OUTPUT;
}
```

## `HarnessWorkflowInput`

```text
interface HarnessWorkflowInput {
  prompt?: HarnessV1Prompt;
  messages?: HarnessWorkflowModelMessage[];
  sessionId: string;
  resumeFrom?: HarnessV1ResumeSessionState;
  continueFrom?: HarnessV1ContinueTurnState;
}
```

## `HarnessWorkflowModelMessage`

```text
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
```

## `HarnessWorkflowState`

```text
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
```

## `HarnessWorkflowStatus`

```text
type HarnessWorkflowStatus =
  | 'not_started'
  | 'ready_for_next_step'
  | 'awaiting_tool_approval'
  | 'finished'
  | 'failed'
  | 'timed_out';
```

## `HarnessWorkflowStreamResult`

Successful wrapped harness stream type consumed by the Workflow integration.

```text
export type HarnessWorkflowStreamResult = Effect.Success<ReturnType<HarnessAgent['stream']>>;
```

## `HarnessWorkflowUsageSummary`

```text
interface HarnessWorkflowUsageSummary {
  readonly inputTokens?: number;
  readonly outputTokens?: number;
}
```

## `runHarnessAgentSlice`

Advance the Workflow state according to the supplied native slice configuration.

```text
export declare const runHarnessAgentSlice: (options: RunHarnessAgentSliceOptions) => Effect.Effect<SDKContract.HarnessWorkflowState<unknown>, import("../internal/operation.js").AiSdkError, never>;
```

## `RunHarnessAgentSliceOptions`

Configure a native slice operation with its corresponding registered handles.

```text
export type RunHarnessAgentSliceOptions = Options<SDKContract.RunHarnessAgentSliceOptions>;
```

## `runHarnessAgentStep`

Advance the Workflow state by one harness step.

```text
export declare const runHarnessAgentStep: (options: RunHarnessAgentStepOptions) => Effect.Effect<SDKContract.HarnessWorkflowState<unknown>, import("../internal/operation.js").AiSdkError, never>;
```

## `RunHarnessAgentStepOptions`

Configure a single harness step with a registered Effect agent.

```text
export type RunHarnessAgentStepOptions = Options<SDKContract.RunHarnessAgentStepOptions>;
```

## `runHarnessAgentTimeSlice`

Advance the Workflow state through a native time-bounded slice.

```text
export declare const runHarnessAgentTimeSlice: (options: RunHarnessAgentTimeSliceOptions) => Effect.Effect<SDKContract.HarnessWorkflowState<unknown>, import("../internal/operation.js").AiSdkError, never>;
```

## `RunHarnessAgentTimeSliceOptions`

Configure a time-bounded slice with a registered Effect agent.

```text
export type RunHarnessAgentTimeSliceOptions = Options<SDKContract.RunHarnessAgentTimeSliceOptions>;
```
