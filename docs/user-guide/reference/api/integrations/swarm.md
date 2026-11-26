---
title: "Integration API — swarm"
doc-type: reference
sources: [src/integrations/swarm.ts, package.json]
---

# swarm

> **TL;DR:** The `@jambudipa/ai-effect/swarm` entry provides the public declarations listed below.

## Import

`@jambudipa/ai-effect/swarm`

## `Agent`

Immutable Swarm agent description that can become active during a handover.

```text
/** Immutable Swarm agent description that can become active during a handover. */
export declare class Agent<C = unknown, R = never, E = never> {
    private constructor();
    readonly settings: Definition<C, R, E>;
    /** Construct an agent description lazily through the tagged boundary. */
    static make<C = unknown, R = never, E = never>(options: Definition<C, R, E>): Effect.Effect<Agent<C, R, E>, AiSdkError, never>;
    /** Name used by the native Swarm to identify the agent. */
    get name(): string;
    /** Agent-specific model override, when the definition supplies one. */
    get model(): SwarmLanguageModel<R, E> | undefined;
    /** System instructions or the function that derives them from the active context. */
    get system(): string | ((context: C) => string) | undefined;
    /** Tools available to the active agent before they are bound into the native SDK. */
    get tools(): Record<string, AgentTool<C, never, unknown, E, R>> | undefined;
    /** Optional tool choice configured for this agent's native turns. */
    get toolChoice(): Definition<C, R, E>['toolChoice'];
}
```

## `AgentFunctionTool`

An ordinary Swarm tool with Effect decoding and execution.

```text
export interface AgentFunctionTool<C, A, O, E = never, R = never> {
    /** Optional discriminator for a function tool in the native Swarm registry. */
    readonly type?: 'function';
    /** Text that helps the model decide whether to select this function tool. */
    readonly description?: string;
    /** Decode model-supplied arguments before running the tool body. */
    readonly parameters: Schema.ConstraintDecoder<A>;
    /** Run an Effect using decoded arguments, the current context, and the supplied cancellation signal. */
    readonly execute: (input: A, options: ToolOptions<C>) => Effect.Effect<O, E, R>;
}
```

## `AgentHandoverTool`

A tool that changes the active Swarm agent and can replace its context.

```text
export interface AgentHandoverTool<C, A, R = never, E = never> {
    /** Required discriminator so the dispatcher handles this tool as an agent handover. */
    readonly type: 'handover';
    /** Text that helps the model decide when to transfer to another agent. */
    readonly description?: string;
    /** Decode the arguments required to select the next agent. */
    readonly parameters: Schema.ConstraintDecoder<A>;
    /** Select the destination agent synchronously and optionally supply its replacement context. */
    readonly execute: (input: A, options: ToolOptions<C>) => {
        readonly agent: Agent<C, R, E>;
        readonly context?: C;
    };
}
```

## `AgentTool`

Tool registered with a Swarm agent, either an Effect function or a synchronous handover.

```text
export type AgentTool<C, A, O, E = never, R = never> = AgentFunctionTool<C, A, O, E, R> | AgentHandoverTool<C, A, R, E>;
```

## `functionTool`

Retain the input, output, and Effect service types of an ordinary tool declaration.

```text
export declare const functionTool: <C, A, O, E = never, R = never>(options: AgentFunctionTool<C, A, O, E, R>) => AgentFunctionTool<C, A, O, E, R>;
```

## `handoverTool`

Retain the context and argument types of a handover tool declaration.

```text
export declare const handoverTool: <C, A, R = never, E = never>(options: AgentHandoverTool<C, A, R, E>) => AgentHandoverTool<C, A, R, E>;
```

## `runSwarm`

Run the legacy Swarm with Effect-owned tool and model callbacks.

```text
export declare const runSwarm: <C, R = never, E = never>(options: RunOptions<C, R, E>) => Effect.Effect<SwarmResult<C, R, E>, AiSdkError, R>;
```

## `SwarmLanguageModel`

Effect model contract for the v1 provider interface used by the legacy Swarm SDK.

```text
export interface SwarmLanguageModel<R = never, E = never> extends Omit<SwarmModelContract, 'doGenerate' | 'doStream' | 'supportsUrl'> {
    /** Synchronous model capability check for passing a URL directly in the native request. */
    readonly supportsUrl?: (url: URL) => boolean;
    /** Run complete v1 model generation in the operation's Effect context. */
    readonly doGenerate: (options: ModelCall) => Effect.Effect<Awaited<ReturnType<SwarmModelContract['doGenerate']>>, E, R>;
    /** Return an Effect stream of v1 events while preserving the provider's response metadata. */
    readonly doStream: (options: ModelCall) => Effect.Effect<Omit<ModelStream, 'stream'> & {
        readonly stream: Stream.Stream<Part, E, R>;
    }, E, R>;
}
```

## `SwarmResult`

Completed Swarm response with the wrapper for the agent active when generation ended.

```text
export type SwarmResult<C, R = never, E = never> = {
    readonly text: string;
    readonly responseMessages: SwarmMessage[];
    readonly finishReason: SwarmStepResult['finishReason'];
    readonly activeAgent: Agent<C, R, E>;
};
```
