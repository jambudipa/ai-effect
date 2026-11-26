---
title: "Integration API — sandbox-just-bash"
doc-type: reference
sources: [src/integrations/sandbox-just-bash.ts, package.json]
---

# sandbox-just-bash

> **TL;DR:** The `@jambudipa/ai-effect/sandbox-just-bash` entry provides the public declarations listed below.

## Import

`@jambudipa/ai-effect/sandbox-just-bash`

## `createJustBashNetworkSandboxSession`

Open a new sandbox in the caller's scope.

```text
export declare const createJustBashNetworkSandboxSession: <R = never, E = never>(options?: JustBashNetworkSandboxSessionCreateOptions<R, E>) => Effect.Effect<{
    restricted: Effect.Effect<{
        description: string;
        readFile: (options: Parameters<import("ai").Experimental_SandboxSession["readFile"]>[0]) => Effect.Effect<import("effect/Stream").Stream<Uint8Array<ArrayBufferLike>, import("../internal/operation.js").AiSdkError, never> | null, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>;
        readBinaryFile: (args: {
            path: string;
            abortSignal?: AbortSignal;
        }) => Effect.Effect<Uint8Array<ArrayBufferLike> | null, import("../internal/operation.js").AiSdkError, never>;
        readTextFile: (args: import("@ai-sdk/provider-utils").Experimental_SandboxReadTextFileOptions) => Effect.Effect<string | null, import("../internal/operation.js").AiSdkError, never>;
        writeFile: (args: import("@ai-sdk/provider-utils").Experimental_SandboxWriteFileOptions) => Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>;
        writeBinaryFile: (args: import("@ai-sdk/provider-utils").Experimental_SandboxWriteBinaryFileOptions) => Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>;
        writeTextFile: (args: import("@ai-sdk/provider-utils").Experimental_SandboxWriteTextFileOptions) => Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>;
        stat: (args: {
            path: string;
            abortSignal?: AbortSignal;
        }) => Effect.Effect<import("ai").Experimental_SandboxFileStat | null, import("../internal/operation.js").AiSdkError, never>;
        listDirectory: (args: {
            path: string;
            abortSignal?: AbortSignal;
        }) => Effect.Effect<import("ai").Experimental_SandboxDirectoryEntry[] | null, import("../internal/operation.js").AiSdkError, never>;
        deleteFile: (args: {
            path: string;
            abortSignal?: AbortSignal;
        }) => Effect.Effect<boolean, import("../internal/operation.js").AiSdkError, never>;
        spawn: {
            (options: import("@ai-sdk/provider-utils").Experimental_SandboxSpawnOptionsWithStdin): Effect.Effect<{
                stdin?: WritableStream<Uint8Array<ArrayBufferLike>>;
                pid: number | undefined;
                stdout: Effect.Effect<import("effect/Stream").Stream<Uint8Array<ArrayBufferLike>, import("../internal/operation.js").AiSdkError, never>, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>;
                stderr: Effect.Effect<import("effect/Stream").Stream<Uint8Array<ArrayBufferLike>, import("../internal/operation.js").AiSdkError, never>, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>;
                wait: Effect.Effect<{
                    exitCode: number;
                }, import("../internal/operation.js").AiSdkError, never>;
                kill: Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>;
            } & {
                readonly stdin: WritableStream<Uint8Array>;
            }, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>;
            (options: import("@ai-sdk/provider-utils").Experimental_SandboxSpawnOptionsWithoutStdin): Effect.Effect<import("./internal/sandbox-base.js").Process, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>;
            (options: import("@ai-sdk/provider-utils").Experimental_SandboxSpawnOptions): Effect.Effect<import("./internal/sandbox-base.js").Process, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>;
        };
        run: (args: import("@ai-sdk/provider-utils").Experimental_SandboxRunOptions) => Effect.Effect<{
            exitCode: number;
            stdout: string;
            stderr: string;
            stdoutLength?: number;
            stderrLength?: number;
        }, import("../internal/operation.js").AiSdkError, never>;
    }, import("../internal/operation.js").AiSdkError, never>;
    setPorts?: (ports: ReadonlyArray<number>, options?: import("./internal/sandbox-base.js").WithAbort) => Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>;
    id: string;
    defaultWorkingDirectory: string;
    ports: readonly number[];
    getPortEndpoint: (options: Parameters<import("./internal/harness-contracts/harness.js").HarnessV1NetworkSandboxSession["getPortEndpoint"]>[0]) => Effect.Effect<import("./harness.js").HarnessV1PortEndpoint, import("../internal/operation.js").AiSdkError, never>;
    getPortUrl: (options: Parameters<import("./internal/harness-contracts/harness.js").HarnessV1NetworkSandboxSession["getPortUrl"]>[0]) => Effect.Effect<string, import("../internal/operation.js").AiSdkError, never>;
    stop: Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>;
    destroy: Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>;
    setNetworkPolicy: ((input: import("./harness.js").HarnessV1NetworkPolicy) => Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>) | undefined;
    setRequestTransformations: ((input: readonly import("./harness.js").HarnessV1RequestTransformation[]) => Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>) | undefined;
    addRequestTransformations: ((input: readonly import("./harness.js").HarnessV1RequestTransformation[]) => Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>) | undefined;
    description: string;
    readFile: (options: Parameters<import("ai").Experimental_SandboxSession["readFile"]>[0]) => Effect.Effect<import("effect/Stream").Stream<Uint8Array<ArrayBufferLike>, import("../internal/operation.js").AiSdkError, never> | null, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>;
    readBinaryFile: (args: {
        path: string;
        abortSignal?: AbortSignal;
    }) => Effect.Effect<Uint8Array<ArrayBufferLike> | null, import("../internal/operation.js").AiSdkError, never>;
    readTextFile: (args: import("@ai-sdk/provider-utils").Experimental_SandboxReadTextFileOptions) => Effect.Effect<string | null, import("../internal/operation.js").AiSdkError, never>;
    writeFile: (args: import("@ai-sdk/provider-utils").Experimental_SandboxWriteFileOptions) => Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>;
    writeBinaryFile: (args: import("@ai-sdk/provider-utils").Experimental_SandboxWriteBinaryFileOptions) => Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>;
    writeTextFile: (args: import("@ai-sdk/provider-utils").Experimental_SandboxWriteTextFileOptions) => Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>;
    stat: (args: {
        path: string;
        abortSignal?: AbortSignal;
    }) => Effect.Effect<import("ai").Experimental_SandboxFileStat | null, import("../internal/operation.js").AiSdkError, never>;
    listDirectory: (args: {
        path: string;
        abortSignal?: AbortSignal;
    }) => Effect.Effect<import("ai").Experimental_SandboxDirectoryEntry[] | null, import("../internal/operation.js").AiSdkError, never>;
    deleteFile: (args: {
        path: string;
        abortSignal?: AbortSignal;
    }) => Effect.Effect<boolean, import("../internal/operation.js").AiSdkError, never>;
    spawn: {
        (options: import("@ai-sdk/provider-utils").Experimental_SandboxSpawnOptionsWithStdin): Effect.Effect<{
            stdin?: WritableStream<Uint8Array<ArrayBufferLike>>;
            pid: number | undefined;
            stdout: Effect.Effect<import("effect/Stream").Stream<Uint8Array<ArrayBufferLike>, import("../internal/operation.js").AiSdkError, never>, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>;
            stderr: Effect.Effect<import("effect/Stream").Stream<Uint8Array<ArrayBufferLike>, import("../internal/operation.js").AiSdkError, never>, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>;
            wait: Effect.Effect<{
                exitCode: number;
            }, import("../internal/operation.js").AiSdkError, never>;
            kill: Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>;
        } & {
            readonly stdin: WritableStream<Uint8Array>;
        }, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>;
        (options: import("@ai-sdk/provider-utils").Experimental_SandboxSpawnOptionsWithoutStdin): Effect.Effect<import("./internal/sandbox-base.js").Process, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>;
        (options: import("@ai-sdk/provider-utils").Experimental_SandboxSpawnOptions): Effect.Effect<import("./internal/sandbox-base.js").Process, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>;
    };
    run: (args: import("@ai-sdk/provider-utils").Experimental_SandboxRunOptions) => Effect.Effect<{
        exitCode: number;
        stdout: string;
        stderr: string;
        stdoutLength?: number;
        stderrLength?: number;
    }, import("../internal/operation.js").AiSdkError, never>;
}, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope | R>;
```

## `createJustBashNetworkSandboxSessionFromNativeSandbox`

Wrap a host-owned network sandbox without stopping it on scope exit.

```text
export declare const createJustBashNetworkSandboxSessionFromNativeSandbox: (native: SDKContract.JustBashNativeSandboxSession) => Effect.Effect<{
    restricted: Effect.Effect<{
        description: string;
        readFile: (options: Parameters<import("ai").Experimental_SandboxSession["readFile"]>[0]) => Effect.Effect<import("effect/Stream").Stream<Uint8Array<ArrayBufferLike>, import("../internal/operation.js").AiSdkError, never> | null, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>;
        readBinaryFile: (args: {
            path: string;
            abortSignal?: AbortSignal;
        }) => Effect.Effect<Uint8Array<ArrayBufferLike> | null, import("../internal/operation.js").AiSdkError, never>;
        readTextFile: (args: import("@ai-sdk/provider-utils").Experimental_SandboxReadTextFileOptions) => Effect.Effect<string | null, import("../internal/operation.js").AiSdkError, never>;
        writeFile: (args: import("@ai-sdk/provider-utils").Experimental_SandboxWriteFileOptions) => Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>;
        writeBinaryFile: (args: import("@ai-sdk/provider-utils").Experimental_SandboxWriteBinaryFileOptions) => Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>;
        writeTextFile: (args: import("@ai-sdk/provider-utils").Experimental_SandboxWriteTextFileOptions) => Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>;
        stat: (args: {
            path: string;
            abortSignal?: AbortSignal;
        }) => Effect.Effect<import("ai").Experimental_SandboxFileStat | null, import("../internal/operation.js").AiSdkError, never>;
        listDirectory: (args: {
            path: string;
            abortSignal?: AbortSignal;
        }) => Effect.Effect<import("ai").Experimental_SandboxDirectoryEntry[] | null, import("../internal/operation.js").AiSdkError, never>;
        deleteFile: (args: {
            path: string;
            abortSignal?: AbortSignal;
        }) => Effect.Effect<boolean, import("../internal/operation.js").AiSdkError, never>;
        spawn: {
            (options: import("@ai-sdk/provider-utils").Experimental_SandboxSpawnOptionsWithStdin): Effect.Effect<{
                stdin?: WritableStream<Uint8Array<ArrayBufferLike>>;
                pid: number | undefined;
                stdout: Effect.Effect<import("effect/Stream").Stream<Uint8Array<ArrayBufferLike>, import("../internal/operation.js").AiSdkError, never>, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>;
                stderr: Effect.Effect<import("effect/Stream").Stream<Uint8Array<ArrayBufferLike>, import("../internal/operation.js").AiSdkError, never>, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>;
                wait: Effect.Effect<{
                    exitCode: number;
                }, import("../internal/operation.js").AiSdkError, never>;
                kill: Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>;
            } & {
                readonly stdin: WritableStream<Uint8Array>;
            }, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>;
            (options: import("@ai-sdk/provider-utils").Experimental_SandboxSpawnOptionsWithoutStdin): Effect.Effect<import("./internal/sandbox-base.js").Process, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>;
            (options: import("@ai-sdk/provider-utils").Experimental_SandboxSpawnOptions): Effect.Effect<import("./internal/sandbox-base.js").Process, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>;
        };
        run: (args: import("@ai-sdk/provider-utils").Experimental_SandboxRunOptions) => Effect.Effect<{
            exitCode: number;
            stdout: string;
            stderr: string;
            stdoutLength?: number;
            stderrLength?: number;
        }, import("../internal/operation.js").AiSdkError, never>;
    }, import("../internal/operation.js").AiSdkError, never>;
    setPorts?: (ports: ReadonlyArray<number>, options?: import("./internal/sandbox-base.js").WithAbort) => Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>;
    id: string;
    defaultWorkingDirectory: string;
    ports: readonly number[];
    getPortEndpoint: (options: Parameters<import("./internal/harness-contracts/harness.js").HarnessV1NetworkSandboxSession["getPortEndpoint"]>[0]) => Effect.Effect<import("./harness.js").HarnessV1PortEndpoint, import("../internal/operation.js").AiSdkError, never>;
    getPortUrl: (options: Parameters<import("./internal/harness-contracts/harness.js").HarnessV1NetworkSandboxSession["getPortUrl"]>[0]) => Effect.Effect<string, import("../internal/operation.js").AiSdkError, never>;
    stop: Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>;
    destroy: Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>;
    setNetworkPolicy: ((input: import("./harness.js").HarnessV1NetworkPolicy) => Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>) | undefined;
    setRequestTransformations: ((input: readonly import("./harness.js").HarnessV1RequestTransformation[]) => Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>) | undefined;
    addRequestTransformations: ((input: readonly import("./harness.js").HarnessV1RequestTransformation[]) => Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>) | undefined;
    description: string;
    readFile: (options: Parameters<import("ai").Experimental_SandboxSession["readFile"]>[0]) => Effect.Effect<import("effect/Stream").Stream<Uint8Array<ArrayBufferLike>, import("../internal/operation.js").AiSdkError, never> | null, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>;
    readBinaryFile: (args: {
        path: string;
        abortSignal?: AbortSignal;
    }) => Effect.Effect<Uint8Array<ArrayBufferLike> | null, import("../internal/operation.js").AiSdkError, never>;
    readTextFile: (args: import("@ai-sdk/provider-utils").Experimental_SandboxReadTextFileOptions) => Effect.Effect<string | null, import("../internal/operation.js").AiSdkError, never>;
    writeFile: (args: import("@ai-sdk/provider-utils").Experimental_SandboxWriteFileOptions) => Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>;
    writeBinaryFile: (args: import("@ai-sdk/provider-utils").Experimental_SandboxWriteBinaryFileOptions) => Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>;
    writeTextFile: (args: import("@ai-sdk/provider-utils").Experimental_SandboxWriteTextFileOptions) => Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>;
    stat: (args: {
        path: string;
        abortSignal?: AbortSignal;
    }) => Effect.Effect<import("ai").Experimental_SandboxFileStat | null, import("../internal/operation.js").AiSdkError, never>;
    listDirectory: (args: {
        path: string;
        abortSignal?: AbortSignal;
    }) => Effect.Effect<import("ai").Experimental_SandboxDirectoryEntry[] | null, import("../internal/operation.js").AiSdkError, never>;
    deleteFile: (args: {
        path: string;
        abortSignal?: AbortSignal;
    }) => Effect.Effect<boolean, import("../internal/operation.js").AiSdkError, never>;
    spawn: {
        (options: import("@ai-sdk/provider-utils").Experimental_SandboxSpawnOptionsWithStdin): Effect.Effect<{
            stdin?: WritableStream<Uint8Array<ArrayBufferLike>>;
            pid: number | undefined;
            stdout: Effect.Effect<import("effect/Stream").Stream<Uint8Array<ArrayBufferLike>, import("../internal/operation.js").AiSdkError, never>, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>;
            stderr: Effect.Effect<import("effect/Stream").Stream<Uint8Array<ArrayBufferLike>, import("../internal/operation.js").AiSdkError, never>, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>;
            wait: Effect.Effect<{
                exitCode: number;
            }, import("../internal/operation.js").AiSdkError, never>;
            kill: Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>;
        } & {
            readonly stdin: WritableStream<Uint8Array>;
        }, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>;
        (options: import("@ai-sdk/provider-utils").Experimental_SandboxSpawnOptionsWithoutStdin): Effect.Effect<import("./internal/sandbox-base.js").Process, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>;
        (options: import("@ai-sdk/provider-utils").Experimental_SandboxSpawnOptions): Effect.Effect<import("./internal/sandbox-base.js").Process, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>;
    };
    run: (args: import("@ai-sdk/provider-utils").Experimental_SandboxRunOptions) => Effect.Effect<{
        exitCode: number;
        stdout: string;
        stderr: string;
        stdoutLength?: number;
        stderrLength?: number;
    }, import("../internal/operation.js").AiSdkError, never>;
}, import("../internal/operation.js").AiSdkError, never>;
```

## `createJustBashSandbox`

Create the legacy sandbox provider.

The full public type is defined by the [source declaration](../../../src/integrations/sandbox-just-bash.ts).

The following declaration preserves the exact public type through the package entry.

```text
declare const createJustBashSandbox: (settings?: SDKContract.JustBashSandboxSettings) =>
  ReturnType<typeof import('@jambudipa/ai-effect/sandbox-just-bash').createJustBashSandbox>;
```

## `createJustBashSandboxSessionFromNativeSandbox`

Wrap a host-owned sandbox without taking ownership of its lifecycle.

```text
export declare const createJustBashSandboxSessionFromNativeSandbox: (native: SDKContract.JustBashNativeSandboxSession) => Effect.Effect<{
    description: string;
    readFile: (options: Parameters<import("ai").Experimental_SandboxSession["readFile"]>[0]) => Effect.Effect<import("effect/Stream").Stream<Uint8Array<ArrayBufferLike>, import("../internal/operation.js").AiSdkError, never> | null, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>;
    readBinaryFile: (args: {
        path: string;
        abortSignal?: AbortSignal;
    }) => Effect.Effect<Uint8Array<ArrayBufferLike> | null, import("../internal/operation.js").AiSdkError, never>;
    readTextFile: (args: import("@ai-sdk/provider-utils").Experimental_SandboxReadTextFileOptions) => Effect.Effect<string | null, import("../internal/operation.js").AiSdkError, never>;
    writeFile: (args: import("@ai-sdk/provider-utils").Experimental_SandboxWriteFileOptions) => Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>;
    writeBinaryFile: (args: import("@ai-sdk/provider-utils").Experimental_SandboxWriteBinaryFileOptions) => Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>;
    writeTextFile: (args: import("@ai-sdk/provider-utils").Experimental_SandboxWriteTextFileOptions) => Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>;
    stat: (args: {
        path: string;
        abortSignal?: AbortSignal;
    }) => Effect.Effect<import("ai").Experimental_SandboxFileStat | null, import("../internal/operation.js").AiSdkError, never>;
    listDirectory: (args: {
        path: string;
        abortSignal?: AbortSignal;
    }) => Effect.Effect<import("ai").Experimental_SandboxDirectoryEntry[] | null, import("../internal/operation.js").AiSdkError, never>;
    deleteFile: (args: {
        path: string;
        abortSignal?: AbortSignal;
    }) => Effect.Effect<boolean, import("../internal/operation.js").AiSdkError, never>;
    spawn: {
        (options: import("@ai-sdk/provider-utils").Experimental_SandboxSpawnOptionsWithStdin): Effect.Effect<{
            stdin?: WritableStream<Uint8Array<ArrayBufferLike>>;
            pid: number | undefined;
            stdout: Effect.Effect<import("effect/Stream").Stream<Uint8Array<ArrayBufferLike>, import("../internal/operation.js").AiSdkError, never>, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>;
            stderr: Effect.Effect<import("effect/Stream").Stream<Uint8Array<ArrayBufferLike>, import("../internal/operation.js").AiSdkError, never>, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>;
            wait: Effect.Effect<{
                exitCode: number;
            }, import("../internal/operation.js").AiSdkError, never>;
            kill: Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>;
        } & {
            readonly stdin: WritableStream<Uint8Array>;
        }, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>;
        (options: import("@ai-sdk/provider-utils").Experimental_SandboxSpawnOptionsWithoutStdin): Effect.Effect<import("./internal/sandbox-base.js").Process, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>;
        (options: import("@ai-sdk/provider-utils").Experimental_SandboxSpawnOptions): Effect.Effect<import("./internal/sandbox-base.js").Process, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>;
    };
    run: (args: import("@ai-sdk/provider-utils").Experimental_SandboxRunOptions) => Effect.Effect<{
        exitCode: number;
        stdout: string;
        stderr: string;
        stdoutLength?: number;
        stderrLength?: number;
    }, import("../internal/operation.js").AiSdkError, never>;
}, import("../internal/operation.js").AiSdkError, never>;
```

## `JustBashNativeSandboxSession`

```text
type JustBashNativeSandboxSession = Sandbox;
```

## `JustBashNetworkSandboxSessionCreateOptions`

Creation settings with an optional Effect bootstrap template for a Just Bash session.

```text
export type JustBashNetworkSandboxSessionCreateOptions<R = never, E = never> = WithoutTemplate<SDKContract.JustBashNetworkSandboxSessionCreateOptions> & {
    readonly template?: SandboxTemplate<R, E>;
};
```

## `JustBashNetworkSandboxSessionResumeOptions`

```text
type JustBashNetworkSandboxSessionResumeOptions = Prettify<
  HarnessV1SandboxSessionResumeOptions<JustBashLookupSettings>
>;
```

## `JustBashSandboxProvider`

Construct the legacy provider with explicit settings.
Wrapped Just Bash provider returned by the lazy factory, with scoped session lifecycle methods.

The full public type is defined by the [source declaration](../../../src/integrations/sandbox-just-bash.ts).

The following declaration preserves the exact public type through the package entry.

```text
declare const JustBashSandboxProvider: typeof import('@jambudipa/ai-effect/sandbox-just-bash').JustBashSandboxProvider;
```

## `JustBashSandboxSettings`

```text
type JustBashSandboxSettings =
  | {
      sandbox: Sandbox;
    }
  | JustBashCreationSettings$1;
```

## `resumeJustBashNetworkSandboxSession`

Reattach to an existing sandbox in the caller's scope.

```text
export declare const resumeJustBashNetworkSandboxSession: (options: SDKContract.JustBashNetworkSandboxSessionResumeOptions) => Effect.Effect<{
    restricted: Effect.Effect<{
        description: string;
        readFile: (options: Parameters<import("ai").Experimental_SandboxSession["readFile"]>[0]) => Effect.Effect<import("effect/Stream").Stream<Uint8Array<ArrayBufferLike>, import("../internal/operation.js").AiSdkError, never> | null, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>;
        readBinaryFile: (args: {
            path: string;
            abortSignal?: AbortSignal;
        }) => Effect.Effect<Uint8Array<ArrayBufferLike> | null, import("../internal/operation.js").AiSdkError, never>;
        readTextFile: (args: import("@ai-sdk/provider-utils").Experimental_SandboxReadTextFileOptions) => Effect.Effect<string | null, import("../internal/operation.js").AiSdkError, never>;
        writeFile: (args: import("@ai-sdk/provider-utils").Experimental_SandboxWriteFileOptions) => Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>;
        writeBinaryFile: (args: import("@ai-sdk/provider-utils").Experimental_SandboxWriteBinaryFileOptions) => Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>;
        writeTextFile: (args: import("@ai-sdk/provider-utils").Experimental_SandboxWriteTextFileOptions) => Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>;
        stat: (args: {
            path: string;
            abortSignal?: AbortSignal;
        }) => Effect.Effect<import("ai").Experimental_SandboxFileStat | null, import("../internal/operation.js").AiSdkError, never>;
        listDirectory: (args: {
            path: string;
            abortSignal?: AbortSignal;
        }) => Effect.Effect<import("ai").Experimental_SandboxDirectoryEntry[] | null, import("../internal/operation.js").AiSdkError, never>;
        deleteFile: (args: {
            path: string;
            abortSignal?: AbortSignal;
        }) => Effect.Effect<boolean, import("../internal/operation.js").AiSdkError, never>;
        spawn: {
            (options: import("@ai-sdk/provider-utils").Experimental_SandboxSpawnOptionsWithStdin): Effect.Effect<{
                stdin?: WritableStream<Uint8Array<ArrayBufferLike>>;
                pid: number | undefined;
                stdout: Effect.Effect<import("effect/Stream").Stream<Uint8Array<ArrayBufferLike>, import("../internal/operation.js").AiSdkError, never>, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>;
                stderr: Effect.Effect<import("effect/Stream").Stream<Uint8Array<ArrayBufferLike>, import("../internal/operation.js").AiSdkError, never>, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>;
                wait: Effect.Effect<{
                    exitCode: number;
                }, import("../internal/operation.js").AiSdkError, never>;
                kill: Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>;
            } & {
                readonly stdin: WritableStream<Uint8Array>;
            }, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>;
            (options: import("@ai-sdk/provider-utils").Experimental_SandboxSpawnOptionsWithoutStdin): Effect.Effect<import("./internal/sandbox-base.js").Process, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>;
            (options: import("@ai-sdk/provider-utils").Experimental_SandboxSpawnOptions): Effect.Effect<import("./internal/sandbox-base.js").Process, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>;
        };
        run: (args: import("@ai-sdk/provider-utils").Experimental_SandboxRunOptions) => Effect.Effect<{
            exitCode: number;
            stdout: string;
            stderr: string;
            stdoutLength?: number;
            stderrLength?: number;
        }, import("../internal/operation.js").AiSdkError, never>;
    }, import("../internal/operation.js").AiSdkError, never>;
    setPorts?: (ports: ReadonlyArray<number>, options?: import("./internal/sandbox-base.js").WithAbort) => Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>;
    id: string;
    defaultWorkingDirectory: string;
    ports: readonly number[];
    getPortEndpoint: (options: Parameters<import("./internal/harness-contracts/harness.js").HarnessV1NetworkSandboxSession["getPortEndpoint"]>[0]) => Effect.Effect<import("./harness.js").HarnessV1PortEndpoint, import("../internal/operation.js").AiSdkError, never>;
    getPortUrl: (options: Parameters<import("./internal/harness-contracts/harness.js").HarnessV1NetworkSandboxSession["getPortUrl"]>[0]) => Effect.Effect<string, import("../internal/operation.js").AiSdkError, never>;
    stop: Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>;
    destroy: Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>;
    setNetworkPolicy: ((input: import("./harness.js").HarnessV1NetworkPolicy) => Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>) | undefined;
    setRequestTransformations: ((input: readonly import("./harness.js").HarnessV1RequestTransformation[]) => Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>) | undefined;
    addRequestTransformations: ((input: readonly import("./harness.js").HarnessV1RequestTransformation[]) => Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>) | undefined;
    description: string;
    readFile: (options: Parameters<import("ai").Experimental_SandboxSession["readFile"]>[0]) => Effect.Effect<import("effect/Stream").Stream<Uint8Array<ArrayBufferLike>, import("../internal/operation.js").AiSdkError, never> | null, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>;
    readBinaryFile: (args: {
        path: string;
        abortSignal?: AbortSignal;
    }) => Effect.Effect<Uint8Array<ArrayBufferLike> | null, import("../internal/operation.js").AiSdkError, never>;
    readTextFile: (args: import("@ai-sdk/provider-utils").Experimental_SandboxReadTextFileOptions) => Effect.Effect<string | null, import("../internal/operation.js").AiSdkError, never>;
    writeFile: (args: import("@ai-sdk/provider-utils").Experimental_SandboxWriteFileOptions) => Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>;
    writeBinaryFile: (args: import("@ai-sdk/provider-utils").Experimental_SandboxWriteBinaryFileOptions) => Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>;
    writeTextFile: (args: import("@ai-sdk/provider-utils").Experimental_SandboxWriteTextFileOptions) => Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>;
    stat: (args: {
        path: string;
        abortSignal?: AbortSignal;
    }) => Effect.Effect<import("ai").Experimental_SandboxFileStat | null, import("../internal/operation.js").AiSdkError, never>;
    listDirectory: (args: {
        path: string;
        abortSignal?: AbortSignal;
    }) => Effect.Effect<import("ai").Experimental_SandboxDirectoryEntry[] | null, import("../internal/operation.js").AiSdkError, never>;
    deleteFile: (args: {
        path: string;
        abortSignal?: AbortSignal;
    }) => Effect.Effect<boolean, import("../internal/operation.js").AiSdkError, never>;
    spawn: {
        (options: import("@ai-sdk/provider-utils").Experimental_SandboxSpawnOptionsWithStdin): Effect.Effect<{
            stdin?: WritableStream<Uint8Array<ArrayBufferLike>>;
            pid: number | undefined;
            stdout: Effect.Effect<import("effect/Stream").Stream<Uint8Array<ArrayBufferLike>, import("../internal/operation.js").AiSdkError, never>, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>;
            stderr: Effect.Effect<import("effect/Stream").Stream<Uint8Array<ArrayBufferLike>, import("../internal/operation.js").AiSdkError, never>, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>;
            wait: Effect.Effect<{
                exitCode: number;
            }, import("../internal/operation.js").AiSdkError, never>;
            kill: Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>;
        } & {
            readonly stdin: WritableStream<Uint8Array>;
        }, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>;
        (options: import("@ai-sdk/provider-utils").Experimental_SandboxSpawnOptionsWithoutStdin): Effect.Effect<import("./internal/sandbox-base.js").Process, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>;
        (options: import("@ai-sdk/provider-utils").Experimental_SandboxSpawnOptions): Effect.Effect<import("./internal/sandbox-base.js").Process, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>;
    };
    run: (args: import("@ai-sdk/provider-utils").Experimental_SandboxRunOptions) => Effect.Effect<{
        exitCode: number;
        stdout: string;
        stderr: string;
        stdoutLength?: number;
        stderrLength?: number;
    }, import("../internal/operation.js").AiSdkError, never>;
}, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>;
```

