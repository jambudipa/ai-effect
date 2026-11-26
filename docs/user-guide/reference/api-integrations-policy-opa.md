---
title: "Integration API — policy-opa"
doc-type: reference
sources: [src/integrations/policy-opa.ts, package.json]
---

# policy-opa

> **TL;DR:** The `@jambudipa/ai-effect/policy-opa` entry provides the public declarations listed below.

## Import

`@jambudipa/ai-effect/policy-opa`

## `DefaultOpaCapabilityInput`

Default OPA input shape passed to the capability-scoping rule.
Override with `toInput` if your Rego expects a different schema.

```text
interface DefaultOpaCapabilityInput {
  messages: LanguageModelV4CallOptions['prompt'];
  providerOptions: LanguageModelV4CallOptions['providerOptions'];
}
```

## `DefaultOpaInput`

The default shape passed to the OPA rule as `input` when no `toInput` is
supplied. Rego rules can read `input.tool.name`, `input.args`, and so on.

```text
interface DefaultOpaInput {
  tool: {
    name: string;
  };
  args: unknown;
  /**
   * The messages that were sent to the model to start the response that
   * contains the tool call. They do not include that response. For a tool call
   * that follows other tool calls in the same response, the policy is also
   * evaluated with those earlier calls appended (see {@link opaPolicy}).
   *
   * A tool call that a user approved is evaluated once more before it runs.
   * The messages then include the response with the tool call and the
   * approval.
   */
  messages: ReadonlyArray<ModelMessage>;
  runtimeContext: unknown;
}
```

## `httpPolicyClient`

Construct an HTTP policy client lazily and keep evaluations behind the Effect boundary.

```text
export declare const httpPolicyClient: (...args: Parameters<typeof sdk.httpPolicyClient>) => Effect.Effect<PolicyClient<never, AiSdkError>, AiSdkError, never>;
```

## `normalizeOpaDecision`

Convert a policy response into the approval decision shape recognized by the native SDK.

```text
export declare const normalizeOpaDecision: (input: unknown) => Effect.Effect<sdk.PolicyDecision, AiSdkError, never>;
```

## `opaCapabilityMiddleware`

Construct model middleware that evaluates capabilities through a scoped Effect policy client.

```text
export declare const opaCapabilityMiddleware: <R = never, E = never>(options: CapabilityOptions<R, E>) => Effect.Effect<{
    specificationVersion: "v4";
    apply: (model: import("../internal/language-model.js").LanguageModelV4) => Effect.Effect<{
        specificationVersion: "v4";
        provider: string;
        modelId: string;
        readonly supportedUrls: Effect.Effect<Record<string, RegExp[]>, AiSdkError, never>;
        doGenerate: (options: LanguageModelV4CallOptions) => Effect.Effect<import("@ai-sdk/provider").LanguageModelV4GenerateResult, AiSdkError, never>;
        doStream: (options: LanguageModelV4CallOptions) => Effect.Effect<{
            stream: import("effect/Stream").Stream<import("@ai-sdk/provider").LanguageModelV4StreamPart, AiSdkError, never>;
            request?: {
                url?: string;
                body?: unknown;
            };
            response?: {
                headers?: import("@ai-sdk/provider").SharedV4Headers;
            };
        }, AiSdkError, Scope.Scope>;
    }, AiSdkError, never>;
}, AiSdkError, Scope.Scope | R>;
```

## `opaPolicy`

Construct an approval configuration and bind policy evaluation to the operation that provides the client.

```text
export declare const opaPolicy: <R = never, E = never>(options: PolicyOptions<R, E>) => Effect.Effect<Approval, AiSdkError, Scope.Scope | R>;
```

## `optionalOpaPolicy`

Return an absent policy when no client is configured, or construct a policy when it is.

```text
export declare const optionalOpaPolicy: <R = never, E = never>(options: Omit<PolicyOptions<R, E>, "client"> & {
    readonly client?: PolicyClient<R, E> | undefined;
}) => Effect.Effect<Option.Option<Approval>, AiSdkError, Scope.Scope | R>;
```

## `PolicyClient`

Effect boundary for evaluating a named OPA policy with a caller-defined input.

```text
export interface PolicyClient<R = never, E = AiSdkError> {
    /** Evaluate the policy path and return the requested result in the client's Effect context. */
    readonly evaluate: <T = unknown, A = unknown>(path: string, input: T) => Effect.Effect<A, E, R>;
}
```

## `PolicyDecision`

Narrowed object form of the SDK's `ToolApprovalStatus`.

The public `ToolApprovalStatus` from `ai` allows both bare strings
(`'approved'`) and the matching object form (`{ type: 'approved' }`). This
package normalizes everything to the object form internally so callers like
`shadow` can rely on a single discriminant.

```text
type PolicyDecision = {
  type: 'approved';
  reason?: string;
} | {
  type: 'denied';
  reason?: string;
} | {
  type: 'user-approval';
  reason?: string;
} | {
  type: 'not-applicable';
};
```

## `PolicyDecisionEvent`

Event emitted by {@link shadow} every time the wrapped policy is evaluated.

Compare `decision` and `effective` to see what would have happened
differently if the policy were enforcing: any record where they disagree
is a tool call that shadow mode is letting through but enforce mode would
have blocked or escalated.

```text
interface PolicyDecisionEvent {
  /** Identifying info from the tool call being evaluated. */
  toolCall: {
    toolName: string;
    toolCallId: string;
    input: unknown;
  };
  /** The decision the wrapped policy returned, normalized to the object form. */
  decision: PolicyDecision;
  /** Whether the SDK will act on `decision` (true) or override to allow (false). */
  enforced: boolean;
  /** The decision the SDK actually acts on. Equals `decision` when enforcing,
   *  `{ type: 'approved' }` in shadow mode. */
  effective: PolicyDecision;
  /** ISO 8601 timestamp of the evaluation. */
  timestamp: string;
}
```

## `shadow`

Wrap a policy with shadow behavior and an optional Effect decision observer.

```text
export declare const shadow: <R = never, E = never, S = R, F = E>(approval: ApprovalSource<R, E>, options?: ShadowOptions<S, F>) => Effect.Effect<Approval, AiSdkError, Scope.Scope | R | S>;
```

## `wasmPolicyClient`

Load the native WebAssembly policy client and expose its evaluation as an Effect operation.

```text
export declare const wasmPolicyClient: (...args: Parameters<typeof sdk.wasmPolicyClient>) => Effect.Effect<PolicyClient<never, AiSdkError>, AiSdkError, never>;
```

## `wrapMcpTools`

Combine registered MCP tools with an already wrapped approval without opening another callback scope.
Combine registered MCP tools with caller-supplied rules in a scope that owns their callbacks.

```text
export declare function wrapMcpTools<T extends EffectToolSet>(tools: T, approval: Approval, options?: WrapOptions): Effect.Effect<WrappedMcpTools<T>, AiSdkError>;

export declare function wrapMcpTools<T extends EffectToolSet, R = never, E = never>(tools: T, approval: ApprovalSource<R, E>, options?: WrapOptions): Effect.Effect<WrappedMcpTools<T>, AiSdkError, Scope.Scope | R>;
```

## `WrappedMcpTools`

Preserve the MCP tool set alongside the approval function used for tool calls.

```text
export type WrappedMcpTools<T extends EffectToolSet = EffectToolSet> = {
    readonly tools: T;
    readonly toolApproval: Approval;
};
```

