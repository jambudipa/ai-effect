import type { HarnessV1 } from './harness-contracts/harness.js';
import type { HarnessAgent as NativeAgent } from '@ai-sdk/harness/agent';
import type { OutputInterface, ToolSet } from 'ai';
import type { HarnessAgent } from '../harness/agent.js';

export const agents = new WeakMap<
  HarnessAgent,
  NativeAgent<HarnessV1, ToolSet, Record<string, unknown>, OutputInterface>
>();
