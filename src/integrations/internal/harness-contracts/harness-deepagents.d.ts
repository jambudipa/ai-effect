// Generated from @ai-sdk/harness-deepagents in @ai-sdk/harness-deepagents@1.0.193. Do not edit.
// Original license: harness.LICENSE.
// Normalize Zod v4 declarations for the Zod 3.25.76 bridge.
import {
  HarnessV1,
  HarnessV1Authentication,
  HarnessV1BuiltinTool,
  HarnessV1CredentialForwarding,
  HarnessV1MintBridgeTokenCallback,
  HarnessV1PortEndpoint,
} from './harness.js';
import { SandboxChannelReconnectOptions } from './harness-utils.js';
type DeepAgentsAuthenticationMode = HarnessV1Authentication<'anthropic'>;
type DeepAgentsThinkingConfig =
  | {
      readonly type: 'adaptive';
      readonly display?: 'summarized' | 'omitted';
    }
  | {
      readonly type: 'enabled';
      readonly budget_tokens: number;
      readonly display?: 'summarized' | 'omitted';
    }
  | {
      readonly type: 'disabled';
    };
type DeepAgentsHarnessSettings = {
  readonly auth?: DeepAgentsAuthenticationMode;
  readonly credentialForwarding?: HarnessV1CredentialForwarding;
  readonly thinking?: DeepAgentsThinkingConfig;
  readonly effort?: 'low' | 'medium' | 'high' | 'xhigh' | 'max';
  readonly port?: number;
  readonly portEndpoint?: HarnessV1PortEndpoint;
  readonly startupTimeoutMs?: number;
  readonly hostDisconnectTimeoutMs?: number;
  readonly reconnect?: SandboxChannelReconnectOptions;
  readonly keepAliveMs?: number;
  readonly mintBridgeToken?: HarnessV1MintBridgeTokenCallback;
  readonly recursionLimit?: number;
  readonly mcpServers?: Record<string, unknown>;
};
declare const DEEPAGENTS_BUILTIN_TOOLS: {
  readonly read: HarnessV1BuiltinTool<
    {
      file_path: string;
    },
    unknown
  >;
  readonly write: HarnessV1BuiltinTool<
    {
      file_path: string;
      content: string;
    },
    unknown
  >;
  readonly edit: HarnessV1BuiltinTool<
    {
      file_path: string;
      old_string: string;
      new_string: string;
    },
    unknown
  >;
  readonly bash: HarnessV1BuiltinTool<
    {
      command: string;
    },
    unknown
  >;
  readonly grep: HarnessV1BuiltinTool<
    {
      pattern: string;
    },
    unknown
  >;
  readonly glob: HarnessV1BuiltinTool<
    {
      pattern: string;
    },
    unknown
  >;
  readonly delete: HarnessV1BuiltinTool<
    {
      file_path: string;
    },
    any
  >;
  readonly ls: import('@ai-sdk/provider-utils').Tool<
    {
      path?: string | undefined;
    },
    any,
    any
  >;
  readonly task: import('@ai-sdk/provider-utils').Tool<
    {
      description?: string | undefined;
      subagent_type?: string | undefined;
    },
    any,
    any
  >;
  readonly write_todos: import('@ai-sdk/provider-utils').Tool<
    {
      todos?: unknown[] | undefined;
    },
    any,
    any
  >;
};
export declare function createDeepAgents(
  settings?: DeepAgentsHarnessSettings,
): HarnessV1<typeof DEEPAGENTS_BUILTIN_TOOLS>;
export declare const VERSION: string;
export declare const deepAgents: import('./harness.js').HarnessV1<{
  readonly read: import('./harness.js').HarnessV1BuiltinTool<
    {
      file_path: string;
    },
    unknown
  >;
  readonly write: import('./harness.js').HarnessV1BuiltinTool<
    {
      file_path: string;
      content: string;
    },
    unknown
  >;
  readonly edit: import('./harness.js').HarnessV1BuiltinTool<
    {
      file_path: string;
      old_string: string;
      new_string: string;
    },
    unknown
  >;
  readonly bash: import('./harness.js').HarnessV1BuiltinTool<
    {
      command: string;
    },
    unknown
  >;
  readonly grep: import('./harness.js').HarnessV1BuiltinTool<
    {
      pattern: string;
    },
    unknown
  >;
  readonly glob: import('./harness.js').HarnessV1BuiltinTool<
    {
      pattern: string;
    },
    unknown
  >;
  readonly delete: import('./harness.js').HarnessV1BuiltinTool<
    {
      file_path: string;
    },
    any
  >;
  readonly ls: import('@ai-sdk/provider-utils').Tool<
    {
      path?: string | undefined;
    },
    any,
    any
  >;
  readonly task: import('@ai-sdk/provider-utils').Tool<
    {
      description?: string | undefined;
      subagent_type?: string | undefined;
    },
    any,
    any
  >;
  readonly write_todos: import('@ai-sdk/provider-utils').Tool<
    {
      todos?: unknown[] | undefined;
    },
    any,
    any
  >;
}>;
export type {
  DeepAgentsAuthenticationMode,
  DeepAgentsHarnessSettings,
  DeepAgentsThinkingConfig,
};
