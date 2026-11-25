import { StdioMCPTransport as SdkStdioTransport } from '@ai-sdk/mcp/mcp-stdio';
import type { JSONRPCMessage } from '../internal/mcp-contract.js';
import { Effect } from 'effect';
import { runRequest, runSync } from '../../internal/operation.js';
import { registerTransport } from '../internal/mcp-stdio.js';
export type { MCPTransportListeners } from '../internal/mcp-stdio.js';

import type { IOType } from 'node:child_process';
import type { Stream } from 'node:stream';

export interface StdioConfig {
  command: string;
  args?: string[];
  env?: Record<string, string>;
  stderr?: IOType | Stream | number;
  cwd?: string;
  shell?: boolean | string;
}

/** A scoped standard I/O transport for MCP. */
export class StdioMCPTransport {
  readonly supportsProtocolVersionDiscovery = true;
  readonly events: ReturnType<typeof registerTransport>;

  static make(config: StdioConfig) {
    return runSync('StdioMCPTransport.make', () => {
      const native = new SdkStdioTransport(config);
      return new StdioMCPTransport(native);
    });
  }

  private constructor(private readonly native: SdkStdioTransport) {
    this.events = registerTransport(this, native, 'StdioMCPTransport');
  }

  get start() {
    return Effect.acquireRelease(
      runRequest('StdioMCPTransport.start', {}, () => this.native.start()),
      () =>
        this.close.pipe(
          Effect.tapError((error) =>
            Effect.logWarning('MCP standard I/O close failed', error),
          ),
          Effect.orDie,
        ),
    );
  }

  get close() {
    return runRequest('StdioMCPTransport.close', {}, () => this.native.close());
  }

  send(message: JSONRPCMessage) {
    return runRequest('StdioMCPTransport.send', {}, () =>
      this.native.send(message),
    );
  }

  get messages() {
    return {
      subscribe: (onMessage: (message: JSONRPCMessage) => void) =>
        this.events.subscribe({
          onMessage: (message) => Effect.sync(() => onMessage(message)),
        }),
    };
  }
}

export const Experimental_StdioMCPTransport = StdioMCPTransport;
export type Experimental_StdioMCPTransport = StdioMCPTransport;
