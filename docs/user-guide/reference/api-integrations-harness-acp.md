---
title: "Integration API — harness-acp"
doc-type: reference
sources: [src/integrations/harness-acp.ts, package.json]
---

# harness-acp

> **TL;DR:** The `@jambudipa/ai-effect/harness-acp` entry provides the public declarations listed below.

## Import

`@jambudipa/ai-effect/harness-acp`

## `ACPAnnotations`

```text
type ACPAnnotations = {
  audience?: Array<ACPRole> | null;
  lastModified?: string | null;
  priority?: number | null;
  _meta?: ACPMetadata | null;
};
```

## `ACPAskUserQuestionsSettings`

ACP calls these hooks synchronously. Each Effect must complete synchronously.

```text
export type ACPAskUserQuestionsSettings<R = never, E = never> = WithEffectCallbacks<SDKContract.ACPAskUserQuestionsSettings, Exclude<keyof SDKContract.ACPAskUserQuestionsSettings, 'requestMethod'>, E, R>;
```

## `ACPAudioContent`

```text
type ACPAudioContent = {
  annotations?: ACPAnnotations | null;
  data: string;
  mimeType: string;
  _meta?: ACPMetadata | null;
};
```

## `ACPAuthentication`

```text
type ACPAuthentication = {
  readonly methodId: string;
  readonly meta?: Readonly<Record<string, ACPSerializableValue>>;
  readonly clientCapabilities?: Readonly<Record<string, ACPSerializableValue>>;
};
```

## `ACPAuthenticationFile`

```text
type ACPAuthenticationFile = {
  readonly path: string;
  readonly content: string;
};
```

## `ACPAuthenticationFiles`

Provide ACP authentication files through an Effect that finishes synchronously.

```text
export type ACPAuthenticationFiles<R = never, E = never> = SynchronousCallback<SDKContract.ACPAuthenticationFiles, R, E>;
```

## `ACPAuthenticationMode`

```text
type ACPAuthenticationMode = ACPAuthenticationMode$1;
```

## `ACPBlobResourceContents`

```text
type ACPBlobResourceContents = {
  blob: string;
  mimeType?: string | null;
  uri: string;
  _meta?: ACPMetadata | null;
};
```

## `ACPClientApp`

```text
type ACPClientApp = {
  readonly name: string;
  readonly version: string;
};
```

## `ACPContentBlock`

```text
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
```

## `ACPCredentialBrokering`

Resolve ACP credential brokering settings through an Effect that finishes synchronously.

```text
export type ACPCredentialBrokering<R = never, E = never> = SynchronousCallback<SDKContract.ACPCredentialBrokering, R, E>;
```

## `ACPEmbeddedResource`

```text
type ACPEmbeddedResource = {
  annotations?: ACPAnnotations | null;
  resource: ACPTextResourceContents | ACPBlobResourceContents;
  _meta?: ACPMetadata | null;
};
```

## `ACPHarnessSettings`

Configure ACP authentication, sandbox preparation, and optional Effect tools for a scoped adapter.

```text
export type ACPHarnessSettings<T extends EffectTools = {}, Q = unknown, R = never, E = never> = Omit<SDKContract.ACPHarnessSettings<BoundTools<T>>, keyof SynchronousSettings<R, E> | 'askUserQuestions' | 'builtinTools' | 'credentialForwarding' | 'mintBridgeToken' | 'prepareSandbox' | 'resolveAuthenticationEnvironment'> & SynchronousSettings<R, E> & {
    readonly askUserQuestions?: Q & AskQuestions<R, E>;
    readonly builtinTools?: T;
    readonly credentialForwarding?: HarnessV1CredentialForwarding<R, E>;
    /** @deprecated The SDK ignores this setting and generates its own bridge keys. */
    readonly mintBridgeToken?: HarnessV1MintBridgeTokenCallback;
    readonly prepareSandbox?: (options: Omit<Parameters<PrepareSandbox>[0], 'sandbox'> & {
        readonly sandbox: SandboxSession;
    }) => Effect.Effect<void, E, R>;
    readonly resolveAuthenticationEnvironment?: (...args: Parameters<ResolveAuthentication>) => Effect.Effect<Awaited<ReturnType<ResolveAuthentication>>, E, R>;
};
```

## `ACPHostToolMCPTransport`

```text
type ACPHostToolMCPTransport = 'stdio' | 'http';
```

## `ACPImageContent`

```text
type ACPImageContent = {
  annotations?: ACPAnnotations | null;
  data: string;
  mimeType: string;
  uri?: string | null;
  _meta?: ACPMetadata | null;
};
```

## `ACPInstallCommandSource`

```text
type ACPInstallCommandSource = {
  readonly type: 'install-command';
  readonly command: string;
};
```

## `ACPInstructionMapping`

```text
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
```

## `ACPMetadata`

```text
type ACPMetadata = Record<string, unknown>;
```

## `ACPModelMapping`

```text
type ACPModelMapping =
  | {
      readonly type: 'session-config-option';
      readonly path: string;
    }
  | {
      readonly type: 'session-model';
      readonly path: string;
    };
```

## `ACPNpmLockedSource`

```text
type ACPNpmLockedSource = {
  readonly type: 'npm-locked';
  readonly packageJson: string;
  readonly pnpmLockYaml: string;
  readonly pnpmWorkspaceYaml?: string;
};
```

## `ACPOutputSchemaMapping`

```text
type ACPOutputSchemaMapping = {
  readonly type: 'session-prompt-meta';
  readonly path: ReadonlyArray<string>;
};
```

## `ACPPermissionModeMapping`

```text
type ACPPermissionModeMapping = Readonly<
  Record<HarnessV1PermissionMode, ACPPermissionModeTarget | null>
>;
```

## `ACPPermissionModeTarget`

```text
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
```

## `ACPProfileValue`

```text
type ACPProfileValue =
  | ACPSerializablePrimitive
  | ACPValueSource
  | ReadonlyArray<ACPProfileValue>
  | {
      readonly [key: string]: ACPProfileValue;
    };
```

## `ACPProviderAuthentication`

```text
type ACPProviderAuthentication = {
  readonly gateway: {
    readonly env: Readonly<Record<string, ACPProfileValue>>;
  };
};
```

## `ACPResolvedHostToolCall`

```text
type ACPResolvedHostToolCall = {
  readonly toolName: string;
  readonly input: Readonly<Record<string, unknown>>;
};
```

## `ACPResolveHostToolCall`

Resolve a native ACP tool call through an Effect that finishes synchronously.

```text
export type ACPResolveHostToolCall<R = never, E = never> = SynchronousCallback<SDKContract.ACPResolveHostToolCall, R, E>;
```

## `ACPResourceLink`

```text
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
```

## `ACPRole`

```text
type ACPRole = 'assistant' | 'user';
```

## `ACPSerializablePrimitive`

```text
type ACPSerializablePrimitive = string | number | boolean | null;
```

## `ACPSerializableValue`

```text
type ACPSerializableValue =
  | ACPSerializablePrimitive
  | ReadonlyArray<ACPSerializableValue>
  | {
      readonly [key: string]: ACPSerializableValue;
    };
```

## `ACPSource`

```text
type ACPSource = ACPNpmLockedSource | ACPInstallCommandSource;
```

## `ACPTextContent`

```text
type ACPTextContent = {
  annotations?: ACPAnnotations | null;
  text: string;
  _meta?: ACPMetadata | null;
};
```

## `ACPTextResourceContents`

```text
type ACPTextResourceContents = {
  mimeType?: string | null;
  text: string;
  uri: string;
  _meta?: ACPMetadata | null;
};
```

## `ACPToolCall`

```text
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
```

## `ACPToolCallContent`

```text
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
```

## `ACPToolCallLocation`

```text
type ACPToolCallLocation = {
  path: string;
  line?: number | null;
  _meta?: ACPMetadata | null;
};
```

## `ACPToolCallStatus`

```text
type ACPToolCallStatus = 'pending' | 'in_progress' | 'completed' | 'failed';
```

## `ACPToolKind`

```text
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
```

## `ACPV1Settings`

ACP v1 configuration with Effect host callbacks following the same synchronous and scoped contracts as the adapter.

```text
export type ACPV1Settings<R = never, E = never> = Omit<SDKContract.ACPV1Settings, keyof SynchronousSettings<R, E> | 'askUserQuestions' | 'credentialForwarding' | 'mintBridgeToken' | 'prepareSandbox' | 'resolveAuthenticationEnvironment'> & SynchronousSettings<R, E> & Pick<ACPHarnessSettings<{}, AskQuestions<R, E>, R, E>, 'askUserQuestions' | 'credentialForwarding' | 'mintBridgeToken' | 'prepareSandbox' | 'resolveAuthenticationEnvironment'>;
```

## `ACPValueSource`

```text
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
```

## `createACP`

Construct an ACP adapter and retain the question tool type when question handling is required.
Construct an ACP adapter with the supplied tools and optional question handling.

```text
export declare function createACP<T extends EffectTools = {}, R = never, E = never>(settings: ACPHarnessSettings<T, unknown, R, E> & {
    readonly askUserQuestions: ACPAskUserQuestionsSettings<R, E>;
}): ReturnType<typeof createWithSettings<T, ACPAskUserQuestionsSettings<R, E>, R, E>>;

export declare function createACP<T extends EffectTools = {}, Q = undefined, R = never, E = never>(settings: ACPHarnessSettings<T, Q, R, E>): ReturnType<typeof createWithSettings<T, Q, R, E>>;
```

## `VERSION`

Version reported by the pinned native ACP adapter.

```text
export declare const VERSION: string;
```

