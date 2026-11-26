---
title: "Integration API — mcp/mcp-stdio"
doc-type: reference
sources: [src/integrations/mcp/mcp-stdio.ts, package.json]
---

# mcp/mcp-stdio

> **TL;DR:** The `@jambudipa/ai-effect/mcp/mcp-stdio` entry provides the public declarations listed below.

## Import

`@jambudipa/ai-effect/mcp/mcp-stdio`

## `Experimental_StdioMCPTransport`

Preserve the SDK's experimental export name for the scoped stdio constructor.
Transport instance type associated with the SDK-compatible experimental export name.

```text
export declare const Experimental_StdioMCPTransport: typeof StdioMCPTransport;

export type Experimental_StdioMCPTransport = StdioMCPTransport;
```

## `MCPTransportListeners`

Optional observers that receive one transport's events in delivery order.

```text
export interface MCPTransportListeners<MessageR = never, MessageE = never, CloseR = MessageR, CloseE = MessageE, ErrorR = MessageR, ErrorE = MessageE> {
    /** Consume a parsed JSON-RPC notification or response without replacing the client's handler. */
    readonly onMessage?: (message: JSONRPCMessage) => Effect.Effect<void, MessageE, MessageR>;
    /** Observe normal transport closure once per successful start. */
    readonly onClose?: () => Effect.Effect<void, CloseE, CloseR>;
    /** Observe native transport errors tagged with the operation name. */
    readonly onError?: (error: AiSdkError) => Effect.Effect<void, ErrorE, ErrorR>;
}
```

## `StdioConfig`

Child process settings passed directly to the MCP standard I/O transport.

```text
export interface StdioConfig {
    /** Executable to spawn to serve MCP JSON-RPC over standard input and output. */
    command: string;
    /** Arguments to pass after the executable name when spawning the server. */
    args?: string[];
    /** Environment variables passed to the MCP server process. */
    env?: Record<string, string>;
    /** Route for the child's standard error stream, which is separate from JSON-RPC output. */
    stderr?: IOType | Stream | number;
    /** Working directory for the child before it reads any relative paths. */
    cwd?: string;
    /** Child-process shell selection. Enable only when the command needs shell interpretation. */
    shell?: boolean | string;
}
```

## `StdioMCPTransport`

A scoped standard I/O transport for MCP.

```text
/** A scoped standard I/O transport for MCP. */
export declare class StdioMCPTransport {
    private constructor();
    /** The stdio client can discover the server protocol version during initialization. */
    readonly supportsProtocolVersionDiscovery = true;
    /** Create a transport handle without starting the child process. */
    static make(config: StdioConfig): Effect.Effect<StdioMCPTransport, import("../../internal/operation.js").AiSdkError, never>;
    /** Use this event source for messages, parse failures, and closure notifications. */
    get events(): {
        subscribe: <MessageR = never, MessageE = never, CloseR = never, CloseE = never, ErrorR = never, ErrorE = never>(callbacks: import("../internal/mcp-stdio.js").MCPTransportListeners<MessageR, MessageE, CloseR, CloseE, ErrorR, ErrorE>) => Effect.Effect<void, never, import("effect/Scope").Scope | MessageR | CloseR | ErrorR>;
    };
    /** Start the child and close it when the owning scope ends, including on interruption. */
    get start(): Effect.Effect<void, import("../../internal/operation.js").AiSdkError, import("effect/Scope").Scope>;
    /** Close the native transport early. The owning scope also registers cleanup. */
    get close(): Effect.Effect<void, import("../../internal/operation.js").AiSdkError, never>;
    /** Send one JSON-RPC value over the child process's input stream. */
    send(message: JSONRPCMessage): Effect.Effect<void, import("../../internal/operation.js").AiSdkError, never>;
    /** Subscribe to message values with a synchronous callback. Use `events` for error and close handlers. */
    get messages(): {
        subscribe: (onMessage: (message: JSONRPCMessage) => void) => Effect.Effect<void, never, import("effect/Scope").Scope>;
    };
}
```

