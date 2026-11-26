import * as sdk from '@ai-sdk/policy-opa';
import type {
  SingleToolApprovalFunction,
  Tool,
  ToolApprovalConfiguration,
  ToolApprovalStatus,
  ToolSet,
} from 'ai';
import { Effect, Option, type Scope } from 'effect';
import {
  type AiSdkError,
  openOperation,
  runRequest,
  runSync,
  sdkError,
} from '../internal/operation.js';
import type { LanguageModelV4CallOptions } from '../protocols/provider.js';
import { wrapMiddleware } from './internal/middleware.js';
import { runValue } from './internal/operation.js';
import { type SandboxSession, wrapSandbox } from './internal/sandbox.js';
import { unwrapTools, wrapTools } from './internal/sdk-tool.js';

export type {
  DefaultOpaCapabilityInput,
  DefaultOpaInput,
  PolicyDecision,
  PolicyDecisionEvent,
} from '@ai-sdk/policy-opa';

/** Effect boundary for evaluating a named OPA policy with a caller-defined input. */
export interface PolicyClient<R = never, E = AiSdkError> {
  /** Evaluate the policy path and return the requested result in the client's Effect context. */
  readonly evaluate: <T = unknown, A = unknown>(
    path: string,
    input: T,
  ) => Effect.Effect<A, E, R>;
}

/** Operation owner that keeps policy and approval callbacks in their captured context. */
type Owner<R> = Effect.Success<ReturnType<typeof openOperation<R>>>;

/** Expose an Effect client to native policy code using the owning operation's callback runner. */
const toNativeClient = <R, E>(
  client: PolicyClient<R, E>,
  owner: Owner<R>,
): sdk.PolicyClient => ({
  evaluate: <T, A>(path: string, input: T) =>
    owner.runCallback(client.evaluate<T, A>(path, input)),
});

/** Wrap native evaluation with its operation name and tagged asynchronous failures. */
const wrapClient = (name: string, native: sdk.PolicyClient): PolicyClient => ({
  evaluate: <T, A>(path: string, input: T) =>
    runRequest(name, {}, () => native.evaluate<T, A>(path, input)),
});

/** Construct an HTTP policy client lazily and keep evaluations behind the Effect boundary. */
export const httpPolicyClient = (
  ...args: Parameters<typeof sdk.httpPolicyClient>
) =>
  runSync('OPA.httpPolicyClient', () =>
    wrapClient('OPA.httpPolicyClient.evaluate', sdk.httpPolicyClient(...args)),
  );

/** Load the native WebAssembly policy client and expose its evaluation as an Effect operation. */
export const wasmPolicyClient = (
  ...args: Parameters<typeof sdk.wasmPolicyClient>
) =>
  runRequest('OPA.wasmPolicyClient', {}, () =>
    sdk.wasmPolicyClient(...args),
  ).pipe(
    Effect.map((native) => wrapClient('OPA.wasmPolicyClient.evaluate', native)),
  );

/** Convert a policy response into the approval decision shape recognized by the native SDK. */
export const normalizeOpaDecision = (input: unknown) =>
  runSync('OPA.normalizeDecision', () => sdk.normalizeOpaDecision(input));

/** Configure model capability evaluation with a policy client, path, and optional synchronous input projection. */
type CapabilityOptions<R, E> = {
  readonly client: PolicyClient<R, E>;
  readonly path: string;
  readonly toInput?: (input: {
    messages: LanguageModelV4CallOptions['prompt'];
    providerOptions: LanguageModelV4CallOptions['providerOptions'];
  }) => unknown;
};

/** Construct model middleware that evaluates capabilities through a scoped Effect policy client. */
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

/** Native tool definitions accepted by both the AI SDK and OPA approval integration. */
type CompatibleTools = Record<string, Tool> & ToolSet;
/** Approval configuration payload accepted by the SDK for native tools. */
type NativeApproval = ToolApprovalConfiguration<CompatibleTools, unknown>;
/** Select the whole-call approval function from the SDK's alternative configuration shapes. */
type NativeApprovalFunction = Extract<
  NativeApproval,
  (...args: never[]) => unknown
>;
/** Input to one native approval decision before adapting its tool handles. */
type NativeInput = Parameters<NativeApprovalFunction>[0];

/** Effect tool collection exposed to policy callbacks in place of the native definitions. */
type EffectToolSet = ReturnType<typeof wrapTools>;
/** Approval event with optional wrapped tools from the caller's native tool registry. */
type ApprovalInput = Omit<NativeInput, 'tools'> & {
  readonly tools?: EffectToolSet;
};

/** Marker that identifies approval functions produced by this wrapper. */
const approvalTypeId = Symbol('@jambudipa/ai-effect/OPA/Approval');

/** Callable Effect approval handle with a named evaluation operation. */
interface Approval {
  /** Identifies an approval handle whose native configuration is available for reuse. */
  readonly [approvalTypeId]: true;
  (options: ApprovalInput): Effect.Effect<ToolApprovalStatus, AiSdkError>;
  /** Evaluate a tool approval policy through the tagged SDK boundary. */
  readonly evaluate: (
    options: ApprovalInput,
  ) => Effect.Effect<ToolApprovalStatus, AiSdkError>;
}

/** Per-tool native approval options before adapting the sandbox handle. */
type NativeRuleOptions = Parameters<
  SingleToolApprovalFunction<unknown, unknown, unknown>
>[1];
/** Approval rule options with a wrapped sandbox when the native request provides one. */
type ApprovalRuleOptions = Omit<NativeRuleOptions, 'experimental_sandbox'> & {
  readonly experimental_sandbox?: SandboxSession;
};

/** Accept a static decision, native thenable, or Effect procedure that resolves the decision. */
type ApprovalValue<R, E> =
  | ToolApprovalStatus
  | PromiseLike<ToolApprovalStatus>
  | Effect.Effect<ToolApprovalStatus, E, R>;
/** Whole-call approval callback or map of statuses and tool-specific approval rules. */
type ApprovalSource<R, E> =
  | ((input: ApprovalInput) => ApprovalValue<R, E>)
  | Readonly<
      Record<
        string,
        | ToolApprovalStatus
        | ((
            input: unknown,
            options: ApprovalRuleOptions,
          ) => ApprovalValue<R, E>)
      >
    >;

/** Preserve native approval identity so wrapped policies can be composed without re-binding their callbacks. */
const approvals = new WeakMap<object, NativeApproval>();

/** Restore a registered native tool set before applying the SDK approval configuration. */
const toNativeInput = (input: ApprovalInput): NativeInput => ({
  ...input,
  tools:
    input.tools && (unwrapTools(input.tools) as CompatibleTools | undefined),
});

/** Bind a caller-supplied approval source to the owning scope and wrap native callback inputs. */
const bindApproval = <R, E, S = never>(
  source: ApprovalSource<R, E>,
  owner: Owner<R | S>,
): NativeApproval => {
  const native = approvals.get(source);
  if (native) return native;
  const run = (approval: () => ApprovalValue<R, E>) =>
    owner.runCallback(
      Effect.suspend<ToolApprovalStatus, AiSdkError | E, R>(() => {
        const value = approval();
        return Effect.isEffect(value)
          ? value
          : runValue('OPA.approval.callback', () => value);
      }),
    );
  if (typeof source === 'function') {
    return ({ tools, ...input }: NativeInput) =>
      run(() =>
        source({
          ...input,
          ...(tools && { tools: wrapTools('OPA.tools', tools) }),
        }),
      );
  }
  return Object.fromEntries(
    Object.entries(source).map(([name, approval]) => [
      name,
      typeof approval === 'function'
        ? (
            input: unknown,
            { experimental_sandbox, ...options }: NativeRuleOptions,
          ) =>
            run(() =>
              approval(input, {
                ...options,
                ...(experimental_sandbox && {
                  experimental_sandbox: wrapSandbox(experimental_sandbox),
                }),
              }),
            )
        : approval,
    ]),
  );
};

/** Expose native whole-call and per-tool policies as one Effect evaluation function. */
const wrapApproval = (native: NativeApproval): Approval => {
  const evaluate = (options: ApprovalInput) =>
    runValue('OPA.approval.evaluate', () => {
      const input = toNativeInput(options);
      if (typeof native === 'function') return native(input);
      if (!Object.hasOwn(native, input.toolCall.toolName))
        return 'not-applicable';
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
    });
  const approval: Approval = Object.assign(evaluate, {
    evaluate,
    [approvalTypeId]: true as const,
  });
  approvals.set(approval, native);
  return approval;
};

/** Native OPA policy options before adapting the client and policy input projection. */
type NativeOptions = Parameters<typeof sdk.opaPolicy>[0];
/** Native input shape the SDK passes to a custom policy projection. */
type NativePolicyInput = Parameters<NonNullable<NativeOptions['toInput']>>[0];

/** Request tool approval from a policy client using an optional synchronous projection with wrapped tools. */
type PolicyOptions<R, E> = Omit<NativeOptions, 'client' | 'toInput'> & {
  readonly client: PolicyClient<R, E>;
  readonly toInput?: (
    input: Omit<NativePolicyInput, 'tools'> & {
      readonly tools?: EffectToolSet;
    },
  ) => unknown;
};

/** Construct an approval configuration and bind policy evaluation to the operation that provides the client. */
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

/** Return an absent policy when no client is configured, or construct a policy when it is. */
export const optionalOpaPolicy = <R = never, E = never>(
  options: Omit<PolicyOptions<R, E>, 'client'> & {
    readonly client?: PolicyClient<R, E> | undefined;
  },
) =>
  options.client
    ? Effect.map(opaPolicy({ ...options, client: options.client }), Option.some)
    : Effect.succeed(Option.none());

/** Configure enforcement and observation of the native shadow policy's decisions. */
type ShadowOptions<R, E> = {
  readonly enforce?: boolean;
  readonly onDecision?: (
    event: sdk.PolicyDecisionEvent,
  ) => Effect.Effect<void, E, R>;
};

/** Wrap a policy with shadow behavior and an optional Effect decision observer. */
export const shadow = <R = never, E = never, S = R, F = E>(
  approval: ApprovalSource<R, E>,
  options?: ShadowOptions<S, F>,
) =>
  Effect.gen(function* () {
    const owner = yield* openOperation<R | S>();
    const { onDecision, ...rest } = options ?? {};
    return yield* runSync('OPA.shadow', () =>
      wrapApproval(
        sdk.shadow<CompatibleTools, unknown>(bindApproval(approval, owner), {
          ...rest,
          ...(onDecision && {
            onDecision: (event) => owner.runCallback(onDecision(event)),
          }),
        }),
      ),
    );
  });

/** Preserve the MCP tool set alongside the approval function used for tool calls. */
export type WrappedMcpTools<T extends EffectToolSet = EffectToolSet> = {
  readonly tools: T;
  readonly toolApproval: Approval;
};

/** Native options for combining MCP tools with their approval configuration. */
type WrapOptions = Parameters<typeof sdk.wrapMcpTools>[2];

/** Combine registered MCP tools with an already wrapped approval without opening another callback scope. */
export function wrapMcpTools<T extends EffectToolSet>(
  tools: T,
  approval: Approval,
  options?: WrapOptions,
): Effect.Effect<WrappedMcpTools<T>, AiSdkError>;
/** Combine registered MCP tools with caller-supplied rules in a scope that owns their callbacks. */
export function wrapMcpTools<T extends EffectToolSet, R = never, E = never>(
  tools: T,
  approval: ApprovalSource<R, E>,
  options?: WrapOptions,
): Effect.Effect<WrappedMcpTools<T>, AiSdkError, Scope.Scope | R>;
export function wrapMcpTools<T extends EffectToolSet, R = never, E = never>(
  tools: T,
  approval: ApprovalSource<R, E | AiSdkError>,
  options?: WrapOptions,
): Effect.Effect<WrappedMcpTools<T>, AiSdkError, Scope.Scope | R> {
  const wrap = (nativeApproval: NativeApproval) =>
    Effect.suspend(() => {
      const nativeTools = unwrapTools(tools);
      if (!nativeTools)
        return sdkError('OPA.wrapMcpTools', 'Invalid tools configuration');
      return runSync('OPA.wrapMcpTools', (): WrappedMcpTools<T> => {
        const { toolApproval } = sdk.wrapMcpTools<CompatibleTools, unknown>(
          nativeTools as CompatibleTools,
          nativeApproval,
          options,
        );
        return { tools, toolApproval: wrapApproval(toolApproval) };
      });
    });
  const native = approvals.get(approval);
  if (native) return wrap(native);
  // The diagnostic applies the unscoped approval overload to this callback branch.
  // @effect-diagnostics-next-line effect/missingEffectContext:off
  return Effect.flatMap(openOperation<R>(), (owner) =>
    runSync('OPA.wrapMcpTools.approval', () =>
      bindApproval(approval, owner),
    ).pipe(Effect.flatMap(wrap)),
  );
}
