import type { HarnessV1 } from '@ai-sdk/harness';
import type { HarnessAgent as NativeAgent } from '@ai-sdk/harness/agent';
import type { ToolSet } from 'ai';
import type { HarnessAgent } from '../harness/agent.js';

export const agents = new WeakMap<
  HarnessAgent,
  NativeAgent<HarnessV1, ToolSet>
>();
