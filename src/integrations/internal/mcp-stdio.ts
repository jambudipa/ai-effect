import type { MCPTransport as NativeTransport } from './mcp-contract.js';

export const transports = new WeakMap<object, NativeTransport>();
