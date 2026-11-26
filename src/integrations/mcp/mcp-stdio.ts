import { StdioMCPTransport as SdkStdioTransport } from '@ai-sdk/mcp/mcp-stdio';
import type { JSONRPCMessage } from '../internal/mcp-contract.js';
import { Effect } from 'effect';
import { runRequest, runSync } from '../../internal/operation.js';
import { registerTransport } from '../internal/mcp-stdio.js';
export type { MCPTransportListeners } from '../internal/mcp-stdio.js';

import type { IOType } from 'node:child_process';
import type { Stream } from 'node:stream';

/** Child process settings passed directly to the MCP standard I/O transport. */
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

/** A scoped standard I/O transport for MCP. */
export class StdioMCPTransport {
  /** The stdio client can discover the server protocol version during initialization. */
  readonly supportsProtocolVersionDiscovery = true;
  /** Buffered transport events and startup state share the native transport registration. */
  private readonly registered: ReturnType<typeof registerTransport>;

  /** Create a transport handle without starting the child process. */
  static make(config: StdioConfig) {
    return runSync('StdioMCPTransport.make', () => {
      const native = new SdkStdioTransport(config);
      return new StdioMCPTransport(native);
    });
  }

  /** Retain the native transport and install event handlers before any startup events can arrive. */
  private constructor(private readonly native: SdkStdioTransport) {
    this.registered = registerTransport(this, native, 'StdioMCPTransport');
  }

  /** Use this event source for messages, parse failures, and closure notifications. */
  get events() {
    return this.registered.events;
  }

  /** Start the child and close it when the owning scope ends, including on interruption. */
  get start() {
    return Effect.acquireRelease(this.registered.start, () =>
      this.close.pipe(
        Effect.tapError((error) =>
          Effect.logWarning('MCP standard I/O close failed', error),
        ),
        Effect.orDie,
      ),
    );
  }

  /** Close the native transport early. The owning scope also registers cleanup. */
  get close() {
    return runRequest('StdioMCPTransport.close', {}, () => this.native.close());
  }

  /** Send one JSON-RPC value over the child process's input stream. */
  send(message: JSONRPCMessage) {
    return runRequest('StdioMCPTransport.send', {}, () =>
      this.native.send(message),
    );
  }

  /** Subscribe to message values with a synchronous callback. Use `events` for error and close handlers. */
  get messages() {
    return {
      subscribe: (onMessage: (message: JSONRPCMessage) => void) =>
        this.events.subscribe({
          onMessage: (message) => Effect.sync(() => onMessage(message)),
        }),
    };
  }
}

/** Preserve the SDK's experimental export name for the scoped stdio constructor. */
export const Experimental_StdioMCPTransport = StdioMCPTransport;
/** Transport instance type associated with the SDK-compatible experimental export name. */
export type Experimental_StdioMCPTransport = StdioMCPTransport;
