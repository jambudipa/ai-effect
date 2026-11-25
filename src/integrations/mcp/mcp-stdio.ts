import { StdioMCPTransport as SdkStdioTransport } from '@ai-sdk/mcp/mcp-stdio';
import type { JSONRPCMessage } from '@ai-sdk/mcp';
import { Effect } from 'effect';
import { runRequest, runSync } from '../../internal/operation.js';
import { transports } from '../internal/mcp-stdio.js';

export type { StdioConfig } from '@ai-sdk/mcp/mcp-stdio';
import type { StdioConfig } from '@ai-sdk/mcp/mcp-stdio';

/** A scoped standard I/O transport for MCP. */
export class StdioMCPTransport {
  readonly supportsProtocolVersionDiscovery = true;

  static make(config: StdioConfig) {
    return runSync('StdioMCPTransport.make', () => {
      const native = new SdkStdioTransport(config);
      const wrapped = new StdioMCPTransport(native);
      transports.set(wrapped, native);
      return wrapped;
    });
  }

  private constructor(private readonly native: SdkStdioTransport) {}

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
    const transport = this.native;
    return {
      subscribe: (onMessage: (message: JSONRPCMessage) => void) =>
        Effect.acquireRelease(
          Effect.sync(() => {
            const previous = transport.onmessage;
            transport.onmessage = onMessage;
            return previous;
          }),
          (previous) =>
            Effect.sync(() => {
              if (transport.onmessage !== onMessage) return;
              if (previous) transport.onmessage = previous;
              else delete transport.onmessage;
            }),
        ),
    };
  }
}

export const Experimental_StdioMCPTransport = StdioMCPTransport;
export type Experimental_StdioMCPTransport = StdioMCPTransport;
