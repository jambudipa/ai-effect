import type { StdioMCPTransport as NativeTransport } from '@ai-sdk/mcp/mcp-stdio';
import type { StdioMCPTransport } from '../mcp/mcp-stdio.js';

export const transports = new WeakMap<StdioMCPTransport, NativeTransport>();
