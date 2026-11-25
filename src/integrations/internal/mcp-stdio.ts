import type { MCPTransport as NativeTransport } from '@ai-sdk/mcp';

export const transports = new WeakMap<object, NativeTransport>();
