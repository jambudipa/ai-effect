import * as sdk from '@ai-sdk/policy-opa';
import type {
  Tool,
  ToolApprovalConfiguration,
  ToolApprovalStatus,
  ToolSet,
} from 'ai';
import { Effect, Option } from 'effect';
import {
  type AiSdkError,
  openOperation,
  runRequest,
  runSync,
  sdkError,
} from '../internal/operation.js';
import { wrapMiddleware } from './internal/middleware.js';
import { runValue } from './internal/operation.js';
import { unwrapTools, wrapTools } from './internal/sdk-tool.js';

export type {
  DefaultOpaCapabilityInput,
  DefaultOpaInput,
  PolicyDecision,
  PolicyDecisionEvent,
} from '@ai-sdk/policy-opa';

export interface PolicyClient<R = never, E = AiSdkError> {
  readonly evaluate: <T = unknown, A = unknown>(
    path: string,
    input: T,
  ) => Effect.Effect<A, E, R>;
}

type Owner<R> = Effect.Success<ReturnType<typeof openOperation<R>>>;

const toNativeClient = <R, E>(
  client: PolicyClient<R, E>,
  owner: Owner<R>,
): sdk.PolicyClient => ({
  evaluate: <T, A>(path: string, input: T) =>
    owner.runCallback(client.evaluate<T, A>(path, input)),
});

const wrapClient = (name: string, native: sdk.PolicyClient): PolicyClient => ({
  evaluate: <T, A>(path: string, input: T) =>
    runRequest(name, {}, () => native.evaluate<T, A>(path, input)),
});

export const httpPolicyClient = (
  ...args: Parameters<typeof sdk.httpPolicyClient>
) =>
  runSync('OPA.httpPolicyClient', () =>
    wrapClient('OPA.httpPolicyClient.evaluate', sdk.httpPolicyClient(...args)),
  );

export const wasmPolicyClient = (
  ...args: Parameters<typeof sdk.wasmPolicyClient>
) =>
  runRequest('OPA.wasmPolicyClient', {}, () =>
    sdk.wasmPolicyClient(...args),
  ).pipe(
    Effect.map((native) => wrapClient('OPA.wasmPolicyClient.evaluate', native)),
  );

export const normalizeOpaDecision = (input: unknown) =>
  runSync('OPA.normalizeDecision', () => sdk.normalizeOpaDecision(input));

type NativeCapability = Parameters<typeof sdk.opaCapabilityMiddleware>[0];
type CapabilityOptions<R, E> = Omit<NativeCapability, 'client'> & {
  readonly client: PolicyClient<R, E>;
};

export const opaCapabilityMiddleware = <R = never, E = never>(
  options: CapabilityOptions<R, E>,
) =>
  Effect.gen(function* () {
    const owner = yield* openOperation<R>();
    return yield* runSync('OPA.capabilityMiddleware', () =>
      wrapMiddleware(
        'OPA.capabilityMiddleware',
        sdk.opaCapabilityMiddleware({
          ...options,
          client: toNativeClient(options.client, owner),
        }),
      ),
    );
  });

type CompatibleTools = Record<string, Tool> & ToolSet;
type NativeApproval = ToolApprovalConfiguration<CompatibleTools, unknown>;
type NativeApprovalFunction = Extract<
  NativeApproval,
  (...args: never[]) => unknown
>;
type NativeInput = Parameters<NativeApprovalFunction>[0];

type EffectToolSet = ReturnType<typeof wrapTools>;
type ApprovalInput = Omit<NativeInput, 'tools'> & {
  readonly tools?: EffectToolSet;
};

interface Approval {
  readonly evaluate: (
    options: ApprovalInput,
  ) => Effect.Effect<ToolApprovalStatus, AiSdkError>;
}

const approvals = new WeakMap<Approval, NativeApproval>();

const toNativeInput = (input: ApprovalInput): NativeInput => ({
  ...input,
  tools:
    input.tools && (unwrapTools(input.tools) as CompatibleTools | undefined),
});

const wrapApproval = (native: NativeApproval): Approval => {
  const approval: Approval = {
    evaluate: (options) =>
      runValue('OPA.approval.evaluate', () => {
        const input = toNativeInput(options);
        if (typeof native === 'function') return native(input);
        const rule = native[input.toolCall.toolName];
        if (!rule) return 'not-applicable';
        return typeof rule === 'function'
          ? rule(input.toolCall.input, {
              toolCallId: input.toolCall.toolCallId,
              messages: input.messages,
              toolContext: (input.toolsContext as Record<string, unknown>)[
                input.toolCall.toolName
              ] as never,
              runtimeContext: input.runtimeContext,
            })
          : rule;
      }),
  };
  approvals.set(approval, native);
  return approval;
};

type NativeOptions = Parameters<typeof sdk.opaPolicy>[0];
type NativePolicyInput = Parameters<NonNullable<NativeOptions['toInput']>>[0];

type PolicyOptions<R, E> = Omit<NativeOptions, 'client' | 'toInput'> & {
  readonly client: PolicyClient<R, E>;
  readonly toInput?: (
    input: Omit<NativePolicyInput, 'tools'> & {
      readonly tools?: EffectToolSet;
    },
  ) => unknown;
};

export const opaPolicy = <R = never, E = never>(options: PolicyOptions<R, E>) =>
  Effect.gen(function* () {
    const { client, toInput, ...rest } = options;
    const owner = yield* openOperation<R>();
    return yield* runSync('OPA.opaPolicy', () =>
      wrapApproval(
        sdk.opaPolicy<CompatibleTools, unknown>({
          ...rest,
          client: toNativeClient(client, owner),
          ...(toInput && {
            toInput: ({ tools, ...input }) =>
              toInput({
                ...input,
                ...(tools && { tools: wrapTools('OPA.tools', tools) }),
              }),
          }),
        }),
      ),
    );
  });

export const optionalOpaPolicy = <R = never, E = never>(
  options: Omit<PolicyOptions<R, E>, 'client'> & {
    readonly client?: PolicyClient<R, E>;
  },
) =>
  options.client
    ? Effect.map(opaPolicy({ ...options, client: options.client }), Option.some)
    : Effect.succeed(Option.none());

type ShadowOptions<R, E> = {
  readonly enforce?: boolean;
  readonly onDecision?: (
    event: sdk.PolicyDecisionEvent,
  ) => Effect.Effect<void, E, R>;
};

export const shadow = <R = never, E = never>(
  approval: Approval,
  options?: ShadowOptions<R, E>,
) =>
  Effect.gen(function* () {
    const native = approvals.get(approval);
    if (!native) {
      return yield* Effect.fail(
        sdkError('OPA.shadow', 'Invalid approval configuration'),
      );
    }
    const owner = yield* openOperation<R>();
    const { onDecision, ...rest } = options ?? {};
    return yield* runSync('OPA.shadow', () =>
      wrapApproval(
        sdk.shadow<CompatibleTools, unknown>(native, {
          ...rest,
          ...(onDecision && {
            onDecision: (event) => owner.runCallback(onDecision(event)),
          }),
        }),
      ),
    );
  });

export type WrappedMcpTools<T extends EffectToolSet = EffectToolSet> = {
  readonly tools: T;
  readonly toolApproval: Approval;
};

export const wrapMcpTools = <T extends EffectToolSet>(
  tools: T,
  approval: Approval,
  options?: Parameters<typeof sdk.wrapMcpTools>[2],
) =>
  Effect.gen(function* () {
    const nativeApproval = approvals.get(approval);
    const nativeTools = unwrapTools(tools);
    if (!nativeApproval || !nativeTools) {
      return yield* Effect.fail(
        sdkError('OPA.wrapMcpTools', 'Invalid tools or approval configuration'),
      );
    }
    return yield* runSync('OPA.wrapMcpTools', (): WrappedMcpTools<T> => {
      const { toolApproval } = sdk.wrapMcpTools<CompatibleTools, unknown>(
        nativeTools as CompatibleTools,
        nativeApproval,
        options,
      );
      return { tools, toolApproval: wrapApproval(toolApproval) };
    });
  });
