// Generated from @ai-sdk/harness-acp in @ai-sdk/harness-acp@1.0.133. Do not edit.
// Original license: harness.LICENSE.
// Normalize Zod v4 declarations for the Zod 3.25.76 bridge.
import {
  HARNESS_V1_BUILTIN_TOOLS,
  HarnessV1,
  HarnessV1Authentication,
  HarnessV1CredentialForwarding,
  HarnessV1MintBridgeTokenCallback,
  HarnessV1PermissionMode,
  HarnessV1PortEndpoint,
  HarnessV1RequestTransformation,
  HarnessV1StreamPart,
  harnessV1BridgeStartBaseSchema,
} from './harness.js';
import { z } from 'zod/v4';
import { SandboxChannelReconnectOptions } from './harness-utils.js';
import {
  Experimental_SandboxSession,
  ToolResultPart,
  ToolSet,
} from '@ai-sdk/provider-utils';
type ACPMetadata = Record<string, unknown>;
type ACPRole = 'assistant' | 'user';
type ACPAnnotations = {
  audience?: Array<ACPRole> | null;
  lastModified?: string | null;
  priority?: number | null;
  _meta?: ACPMetadata | null;
};
type ACPTextContent = {
  annotations?: ACPAnnotations | null;
  text: string;
  _meta?: ACPMetadata | null;
};
type ACPImageContent = {
  annotations?: ACPAnnotations | null;
  data: string;
  mimeType: string;
  uri?: string | null;
  _meta?: ACPMetadata | null;
};
type ACPAudioContent = {
  annotations?: ACPAnnotations | null;
  data: string;
  mimeType: string;
  _meta?: ACPMetadata | null;
};
type ACPResourceLink = {
  annotations?: ACPAnnotations | null;
  description?: string | null;
  mimeType?: string | null;
  name: string;
  size?: number | null;
  title?: string | null;
  uri: string;
  _meta?: ACPMetadata | null;
};
type ACPTextResourceContents = {
  mimeType?: string | null;
  text: string;
  uri: string;
  _meta?: ACPMetadata | null;
};
type ACPBlobResourceContents = {
  blob: string;
  mimeType?: string | null;
  uri: string;
  _meta?: ACPMetadata | null;
};
type ACPEmbeddedResource = {
  annotations?: ACPAnnotations | null;
  resource: ACPTextResourceContents | ACPBlobResourceContents;
  _meta?: ACPMetadata | null;
};
type ACPContentBlock =
  | (ACPTextContent & {
      type: 'text';
    })
  | (ACPImageContent & {
      type: 'image';
    })
  | (ACPAudioContent & {
      type: 'audio';
    })
  | (ACPResourceLink & {
      type: 'resource_link';
    })
  | (ACPEmbeddedResource & {
      type: 'resource';
    });
type ACPToolCallContent =
  | {
      type: 'content';
      content: ACPContentBlock;
      _meta?: ACPMetadata | null;
    }
  | {
      type: 'diff';
      path: string;
      oldText?: string | null;
      newText: string;
      _meta?: ACPMetadata | null;
    }
  | {
      type: 'terminal';
      terminalId: string;
      _meta?: ACPMetadata | null;
    };
type ACPToolKind =
  | 'read'
  | 'edit'
  | 'delete'
  | 'move'
  | 'search'
  | 'execute'
  | 'think'
  | 'fetch'
  | 'switch_mode'
  | 'other';
type ACPToolCallStatus = 'pending' | 'in_progress' | 'completed' | 'failed';
type ACPToolCallLocation = {
  path: string;
  line?: number | null;
  _meta?: ACPMetadata | null;
};
type ACPToolCall = {
  toolCallId: string;
  name?: string | null;
  title: string;
  kind?: ACPToolKind;
  status?: ACPToolCallStatus;
  content?: Array<ACPToolCallContent>;
  locations?: Array<ACPToolCallLocation>;
  rawInput?: unknown;
  rawOutput?: unknown;
  _meta?: ACPMetadata | null;
};
type ACPResolvedHostToolCall = {
  readonly toolName: string;
  readonly input: Readonly<Record<string, unknown>>;
};
type ACPResolveHostToolCall = (options: {
  readonly toolCall: ACPToolCall;
  readonly serverName: string;
  readonly toolNames: ReadonlyArray<string>;
}) => ACPResolvedHostToolCall | undefined;
type ACPSerializablePrimitive = string | number | boolean | null;
type ACPSerializableValue =
  | ACPSerializablePrimitive
  | ReadonlyArray<ACPSerializableValue>
  | {
      readonly [key: string]: ACPSerializableValue;
    };
type ACPValueSource = {
  readonly $source:
    | 'gateway-api-key'
    | 'gateway-base-url'
    | 'gateway-authorization'
    | 'client-app'
    | 'client-app-name'
    | 'client-app-version';
  readonly prefix?: string;
  readonly suffix?: string;
  readonly ensureSuffix?: string;
};
type ACPProfileValue =
  | ACPSerializablePrimitive
  | ACPValueSource
  | ReadonlyArray<ACPProfileValue>
  | {
      readonly [key: string]: ACPProfileValue;
    };
type ACPNpmLockedSource = {
  readonly type: 'npm-locked';
  readonly packageJson: string;
  readonly pnpmLockYaml: string;
  readonly pnpmWorkspaceYaml?: string;
};
type ACPInstallCommandSource = {
  readonly type: 'install-command';
  readonly command: string;
};
type ACPSource = ACPNpmLockedSource | ACPInstallCommandSource;
type ACPAuthentication = {
  readonly methodId: string;
  readonly meta?: Readonly<Record<string, ACPSerializableValue>>;
  readonly clientCapabilities?: Readonly<Record<string, ACPSerializableValue>>;
};
type ACPAuthenticationMode$1 = HarnessV1Authentication;
type ACPProviderAuthentication = {
  readonly gateway: {
    readonly env: Readonly<Record<string, ACPProfileValue>>;
  };
};
type ACPModelMapping =
  | {
      readonly type: 'session-config-option';
      readonly path: string;
    }
  | {
      readonly type: 'session-model';
      readonly path: string;
    };
type ACPCredentialBrokering = ({
  env,
  sandboxEnv,
  headers,
}: {
  env: Readonly<Record<string, string>>;
  sandboxEnv?: Readonly<Record<string, string>>;
  headers?: Readonly<Record<string, string>>;
}) => ReadonlyArray<HarnessV1RequestTransformation>;
type ACPAuthenticationFile = {
  readonly path: string;
  readonly content: string;
};
type ACPAuthenticationFiles = (options: {
  readonly env: Readonly<Record<string, string>>;
  readonly sandboxEnv: Readonly<Record<string, string>>;
  readonly credentialBrokeringAvailable: boolean;
}) => ReadonlyArray<ACPAuthenticationFile>;
type ACPPermissionModeTarget =
  | {
      readonly type: 'session-mode';
      readonly modeId: string;
    }
  | {
      readonly type: 'session-config-option';
      readonly configId: string;
      readonly value: string | boolean;
    };
type ACPPermissionModeMapping = Readonly<
  Record<HarnessV1PermissionMode, ACPPermissionModeTarget | null>
>;
type ACPInstructionMapping =
  | {
      readonly type: 'session-meta';
      readonly path: ReadonlyArray<string>;
    }
  | {
      readonly type: 'launch-env-json';
      readonly variable: string;
      readonly path: ReadonlyArray<string>;
    }
  | {
      readonly type: 'filesystem';
      readonly path: string;
    };
type ACPOutputSchemaMapping = {
  readonly type: 'session-prompt-meta';
  readonly path: ReadonlyArray<string>;
};
type ACPHostToolMCPTransport = 'stdio' | 'http';
type ACPAskUserQuestionsSettings = {
  readonly requestMethod: string;
  readonly isNativeToolCall?: (options: {
    nativeToolCall: ACPToolCall;
  }) => boolean;
  readonly fromNativeRequest: (options: {
    nativeRequest: unknown;
    nativeToolCall?: ACPToolCall;
  }) => Extract<
    HarnessV1StreamPart,
    {
      type: 'tool-call';
    }
  > | null;
  readonly toNativeResponse: (options: {
    nativeRequest: unknown;
    toolResult: ToolResultPart;
  }) => unknown;
  readonly matchesNativeRequest?: (options: {
    previousNativeRequest: unknown;
    nativeRequest: unknown;
  }) => boolean;
};
type ACPV1Settings = {
  readonly version?: 'v1';
  readonly harnessId: string;
  readonly mcpServers?: Record<string, unknown>;
  readonly isMcpToolCall: (toolCall: ACPToolCall) => boolean;
  readonly resolveHostToolCall: ACPResolveHostToolCall;
  readonly auth?: ACPAuthenticationMode$1;
  readonly resolveAuthenticationEnvironment?: (options: {
    readonly auth: ACPAuthenticationMode$1 | undefined;
    readonly env: Readonly<Record<string, string | undefined>>;
  }) => Promise<Readonly<Record<string, string | undefined>>>;
  readonly source: ACPSource;
  readonly executable: string;
  readonly args?: ReadonlyArray<string>;
  readonly forwardEnv?: ReadonlyArray<string>;
  readonly credentialEnv?: ReadonlyArray<string>;
  readonly credentialBrokering?: ACPCredentialBrokering;
  readonly authenticationFiles?: ACPAuthenticationFiles;
  readonly prepareSandbox?: (options: {
    readonly sandbox: Experimental_SandboxSession;
    readonly workDir: string;
    readonly abortSignal?: AbortSignal;
  }) => void | PromiseLike<void>;
  readonly credentialForwarding?: HarnessV1CredentialForwarding;
  readonly env?: Readonly<Record<string, string>>;
  readonly authentication?: ACPAuthentication;
  readonly clientCapabilities?: Readonly<Record<string, ACPSerializableValue>>;
  readonly providerAuthentication?: ACPProviderAuthentication;
  readonly modelMapping: ACPModelMapping;
  readonly skillsDirectory?: string;
  readonly instructionMapping?: ACPInstructionMapping;
  readonly outputSchemaMapping?: ACPOutputSchemaMapping;
  readonly hostToolMcpTransport?: ACPHostToolMCPTransport;
  readonly nonTextContentTypes?: ReadonlyArray<'image'>;
  readonly askUserQuestions?: ACPAskUserQuestionsSettings;
  readonly permissionModeMapping?: ACPPermissionModeMapping;
  readonly writeProtectedPaths?: ReadonlyArray<string>;
  readonly session?: {
    readonly meta?: Readonly<Record<string, ACPSerializableValue>>;
  };
  readonly mintBridgeToken?: HarnessV1MintBridgeTokenCallback;
};
type ACPAuthenticationMode = ACPAuthenticationMode$1;
type ACPClientApp = {
  readonly name: string;
  readonly version: string;
};
type ACPHarnessSettings<
  TBuiltinTools extends ToolSet = {},
  TAskUserQuestions extends ACPAskUserQuestionsSettings | undefined =
    ACPAskUserQuestionsSettings | undefined,
> = {
  readonly builtinTools?: TBuiltinTools;
  readonly mcpServers?: Record<string, unknown>;
  readonly isMcpToolCall: ACPV1Settings['isMcpToolCall'];
  readonly resolveHostToolCall: ACPV1Settings['resolveHostToolCall'];
  readonly port?: number;
  readonly portEndpoint?: HarnessV1PortEndpoint;
  readonly startupTimeoutMs?: number;
  readonly hostDisconnectTimeoutMs?: number;
  readonly reconnect?: SandboxChannelReconnectOptions;
  readonly keepAliveMs?: number;
  readonly clientApp?: ACPClientApp;
  readonly version?: ACPV1Settings['version'];
  readonly harnessId: ACPV1Settings['harnessId'];
  readonly auth?: ACPAuthenticationMode;
  readonly resolveAuthenticationEnvironment?: ACPV1Settings['resolveAuthenticationEnvironment'];
  readonly source: ACPV1Settings['source'];
  readonly executable: ACPV1Settings['executable'];
  readonly args?: ACPV1Settings['args'];
  readonly forwardEnv?: ACPV1Settings['forwardEnv'];
  readonly credentialEnv?: ACPV1Settings['credentialEnv'];
  readonly credentialBrokering?: ACPV1Settings['credentialBrokering'];
  readonly authenticationFiles?: ACPV1Settings['authenticationFiles'];
  readonly prepareSandbox?: ACPV1Settings['prepareSandbox'];
  readonly credentialForwarding?: HarnessV1CredentialForwarding;
  readonly env?: ACPV1Settings['env'];
  readonly authentication?: ACPV1Settings['authentication'];
  readonly clientCapabilities?: ACPV1Settings['clientCapabilities'];
  readonly providerAuthentication?: ACPV1Settings['providerAuthentication'];
  readonly modelMapping: ACPV1Settings['modelMapping'];
  readonly skillsDirectory?: ACPV1Settings['skillsDirectory'];
  readonly instructionMapping?: ACPV1Settings['instructionMapping'];
  readonly outputSchemaMapping?: ACPV1Settings['outputSchemaMapping'];
  readonly hostToolMcpTransport?: ACPV1Settings['hostToolMcpTransport'];
  readonly nonTextContentTypes?: ACPV1Settings['nonTextContentTypes'];
  readonly askUserQuestions?: TAskUserQuestions;
  readonly permissionModeMapping?: ACPV1Settings['permissionModeMapping'];
  readonly writeProtectedPaths?: ACPV1Settings['writeProtectedPaths'];
  readonly session?: ACPV1Settings['session'];
  readonly mintBridgeToken?: HarnessV1MintBridgeTokenCallback;
};
type ACPHarnessTools<
  TBuiltinTools extends ToolSet,
  TAskUserQuestions,
> = TBuiltinTools &
  ([TAskUserQuestions] extends [undefined]
    ? {}
    : {
        askUserQuestions: typeof HARNESS_V1_BUILTIN_TOOLS.askUserQuestions;
      });
export declare function createACP<
  TBuiltinTools extends ToolSet = {},
  TAskUserQuestions extends ACPAskUserQuestionsSettings | undefined = undefined,
>(
  settings: ACPHarnessSettings<TBuiltinTools, TAskUserQuestions>,
): HarnessV1<ACPHarnessTools<TBuiltinTools, TAskUserQuestions>>;
export declare const VERSION: string;
export type {
  ACPAnnotations,
  ACPAskUserQuestionsSettings,
  ACPAudioContent,
  ACPAuthentication,
  ACPAuthenticationFile,
  ACPAuthenticationFiles,
  ACPAuthenticationMode,
  ACPBlobResourceContents,
  ACPClientApp,
  ACPContentBlock,
  ACPCredentialBrokering,
  ACPEmbeddedResource,
  ACPHarnessSettings,
  ACPHostToolMCPTransport,
  ACPImageContent,
  ACPInstallCommandSource,
  ACPInstructionMapping,
  ACPMetadata,
  ACPModelMapping,
  ACPNpmLockedSource,
  ACPOutputSchemaMapping,
  ACPPermissionModeMapping,
  ACPPermissionModeTarget,
  ACPProfileValue,
  ACPProviderAuthentication,
  ACPResolveHostToolCall,
  ACPResolvedHostToolCall,
  ACPResourceLink,
  ACPRole,
  ACPSerializablePrimitive,
  ACPSerializableValue,
  ACPSource,
  ACPTextContent,
  ACPTextResourceContents,
  ACPToolCall,
  ACPToolCallContent,
  ACPToolCallLocation,
  ACPToolCallStatus,
  ACPToolKind,
  ACPV1Settings,
  ACPValueSource,
};
