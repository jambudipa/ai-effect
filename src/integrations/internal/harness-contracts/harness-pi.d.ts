// Generated from @ai-sdk/harness-pi in @ai-sdk/harness-pi@1.0.196. Do not edit.
// Original license: harness.LICENSE.
// Normalize Zod v4 declarations for the Zod 3.25.76 bridge.
import {
  HarnessV1,
  HarnessV1Authentication,
  HarnessV1BuiltinTool,
} from './harness.js';
import { Experimental_SandboxSession } from '@ai-sdk/provider-utils';
import { z } from 'zod/v4';
import {
  CreateModelRuntimeOptions,
  ExtensionAPI,
  ExtensionFactory,
  McpExposure,
  McpServerConfig,
  ModelRegistry,
  ModelRuntime,
  ProviderConfig,
  SessionEntry,
  SessionManager,
} from '@earendil-works/pi-coding-agent';
type PiCredentialStore = NonNullable<CreateModelRuntimeOptions['credentials']>;
type PiAuthenticationMode = HarnessV1Authentication<
  'openai' | 'anthropic' | 'custom'
>;
interface PiSessionStorageEntry {
  entryId: string;
  parentEntryId?: string;
  version: number;
  data: SessionEntry;
}
interface PiSessionStorage {
  append(options: {
    sessionId: string;
    entry: PiSessionStorageEntry;
    abortSignal?: AbortSignal;
  }): PromiseLike<void>;
  appendMany?(options: {
    sessionId: string;
    entries: ReadonlyArray<PiSessionStorageEntry>;
    abortSignal?: AbortSignal;
  }): PromiseLike<void>;
  read(options: {
    sessionId: string;
    leafId: string;
    abortSignal?: AbortSignal;
  }): PromiseLike<ReadonlyArray<PiSessionStorageEntry>>;
}
interface PiFileToolPathPolicy {
  readonly readableRoots?: ReadonlyArray<string>;
  readonly writableRoots?: ReadonlyArray<string>;
  readonly deniedRoots?: ReadonlyArray<string>;
}
type PiThinkingLevel =
  'off' | 'minimal' | 'low' | 'medium' | 'high' | 'xhigh' | 'max';
type PiMcpExposure = Exclude<McpExposure, 'codemode'>;
type PiMcpServerConfig = McpServerConfig extends infer Config
  ? Config extends McpServerConfig
    ? Omit<Config, 'exposure' | 'toolExposure'> & {
        readonly exposure?: PiMcpExposure;
        readonly toolExposure?: Readonly<Record<string, PiMcpExposure>>;
      }
    : never
  : never;
interface PiMcpSettings {
  readonly toolPrefix?: 'server' | 'none' | 'short' | 'mcp';
  readonly outputGuard?: boolean;
}
type PiCacheRetention = 'none' | 'short' | 'long';
interface PiHarnessExtensionSession {
  readonly sandboxSession: Experimental_SandboxSession;
  readonly sessionWorkDir: string;
  readonly instructions: () => string | undefined;
}
type PiHarnessExtensionFactory = (
  pi: ExtensionAPI,
  session: PiHarnessExtensionSession,
) => ReturnType<ExtensionFactory>;
interface PiSandboxSkill {
  readonly name: string;
  readonly description: string;
  readonly filePath: string;
}
interface PiResources {
  readonly skills?: ReadonlyArray<PiSandboxSkill>;
}
type PiHarnessSettings = {
  readonly auth?: PiAuthenticationMode;
  readonly credentials?: PiCredentialStore;
  readonly sessionStorage?: PiSessionStorage;
  readonly reattachInProcess?: boolean;
  readonly providers?: Readonly<Record<string, ProviderConfig>>;
  readonly thinkingLevel?: PiThinkingLevel;
  readonly cacheRetention?: PiCacheRetention;
  readonly agentDir?: string;
  readonly mcpServers?: Record<string, unknown>;
  readonly mcpSettings?: PiMcpSettings;
  readonly extensionFactories?: ReadonlyArray<PiHarnessExtensionFactory>;
  readonly fileToolPathPolicy?: PiFileToolPathPolicy;
  readonly resources?: PiResources;
};
declare const PI_BUILTIN_TOOLS: {
  readonly read: HarnessV1BuiltinTool<
    {
      file_path: string;
      offset?: number | undefined;
      limit?: number | undefined;
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
      timeout?: number | undefined;
    },
    unknown
  >;
  readonly grep: HarnessV1BuiltinTool<
    {
      pattern: string;
      path?: string | undefined;
      glob?: string | undefined;
      ignoreCase?: boolean | undefined;
      literal?: boolean | undefined;
      context?: number | undefined;
      limit?: number | undefined;
    },
    unknown
  >;
  readonly glob: HarnessV1BuiltinTool<
    {
      pattern: string;
      path?: string | undefined;
      limit?: number | undefined;
    },
    unknown
  >;
  readonly ls: HarnessV1BuiltinTool;
};
export declare function createPi(
  settings?: PiHarnessSettings,
): HarnessV1<typeof PI_BUILTIN_TOOLS>;
export declare const VERSION: string;
export declare const pi: import('./harness.js').HarnessV1<{
  readonly read: import('./harness.js').HarnessV1BuiltinTool<
    {
      file_path: string;
      offset?: number | undefined;
      limit?: number | undefined;
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
      timeout?: number | undefined;
    },
    unknown
  >;
  readonly grep: import('./harness.js').HarnessV1BuiltinTool<
    {
      pattern: string;
      path?: string | undefined;
      glob?: string | undefined;
      ignoreCase?: boolean | undefined;
      literal?: boolean | undefined;
      context?: number | undefined;
      limit?: number | undefined;
    },
    unknown
  >;
  readonly glob: import('./harness.js').HarnessV1BuiltinTool<
    {
      pattern: string;
      path?: string | undefined;
      limit?: number | undefined;
    },
    unknown
  >;
  readonly ls: import('./harness.js').HarnessV1BuiltinTool;
}>;
export type {
  PiAuthenticationMode,
  PiCredentialStore,
  PiFileToolPathPolicy,
  PiHarnessExtensionFactory,
  PiHarnessExtensionSession,
  PiHarnessSettings,
  PiMcpExposure,
  PiMcpServerConfig,
  PiResources,
  PiSandboxSkill,
  PiSessionStorage,
};
