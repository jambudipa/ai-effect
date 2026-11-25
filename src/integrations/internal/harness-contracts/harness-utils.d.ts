// Generated from @ai-sdk/harness/utils in @ai-sdk/harness@1.0.193. Do not edit.
// Original license: harness.LICENSE.
// Normalize Zod v4 declarations for the Zod 3.25.76 bridge.
import {
  Experimental_SandboxProcess,
  Experimental_SandboxSession,
  FlexibleSchema,
  ToolResultOutput,
  UserModelMessage,
} from '@ai-sdk/provider-utils';
import { z } from 'zod/v4';
import { Buffer } from 'node:buffer';
import '@ai-sdk/provider';
import { WebSocket } from 'ws';
type SandboxChannelDebugEvent =
  | {
      event: 'reconnect-attempt';
      attempt: number;
      lastSeenEventId: number;
    }
  | {
      event: 'reconnected';
      attempt: number;
      lastSeenEventId: number;
    }
  | {
      event: 'reconnect-failed';
      attempts: number;
      lastSeenEventId: number;
      cause: unknown;
    };
interface SandboxChannelReconnectOptions {
  readonly maxElapsedMs?: number;
  readonly initialDelayMs?: number;
  readonly maxDelayMs?: number;
}
interface SandboxChannelConnectOptions {
  readonly abortSignal: AbortSignal;
  readonly reason: 'open' | 'reconnect';
}
interface SandboxChannelOptions<TOut> {
  connect: (options: SandboxChannelConnectOptions) => Promise<WebSocket>;
  outboundSchema: FlexibleSchema<TOut>;
  reconnect?: SandboxChannelReconnectOptions;
  keepAliveMs?: number;
  onDebug?: (event: SandboxChannelDebugEvent) => void;
  onDiagnostic?: (
    event: Extract<
      TOut,
      {
        type: 'sandbox-log' | 'debug-event';
      }
    >,
  ) => void;
  onBridgeError?: (
    event: Extract<
      TOut,
      {
        type: 'error';
      }
    >,
  ) => void;
  initialLastSeenEventId?: number;
}
type EventTypeOf<
  TOut extends {
    type: string;
  },
> = TOut['type'];
type Listener<
  TOut extends {
    type: string;
  },
  T extends EventTypeOf<TOut>,
> = (
  event: Extract<
    TOut,
    {
      type: T;
    }
  >,
) => void;
export declare class SandboxChannel<
  TOut extends {
    type: string;
  },
  TIn extends {
    type: string;
  } = {
    type: string;
  },
> {
  private readonly listeners;
  private readonly buffered;
  private readonly bufferedByType;
  private bufferedOffset;
  private flushingBuffered;
  private bufferedFlushScheduled;
  private listenerAttachmentDepth;
  private readonly onCloseHandlers;
  private readonly onReconnectHandlers;
  private readonly connectThunk;
  private readonly outboundSchema;
  private readonly onDebug;
  private readonly onDiagnostic;
  private readonly onBridgeError;
  private readonly maxElapsedMs;
  private readonly initialDelayMs;
  private readonly maxDelayMs;
  private readonly keepAliveMs;
  private stopKeepalive;
  private ws;
  private connected;
  private closing;
  private suspended;
  private pinnedSuspensionCursor;
  private terminal;
  private _lastSeenEventId;
  private readonly pendingSends;
  private dispatchChain;
  private activeConnectAbortController;
  private reconnectAbortController;
  constructor(options: SandboxChannelOptions<TOut>);
  get lastSeenEventId(): number;
  open(opts?: { resume?: boolean }): Promise<void>;
  on<T extends EventTypeOf<TOut>>(
    type: T,
    listener: Listener<TOut, T>,
  ): () => void;
  beginListenerAttachment(): () => void;
  onClose(handler: (code: number, reason: string) => void): void;
  onReconnect(handler: () => void): () => void;
  send(
    message: TIn,
    {
      onSent,
      queueIfDisconnected,
    }?: {
      onSent?: () => void;
      queueIfDisconnected?: boolean;
    },
  ): void;
  beginClose(): void;
  close(): void;
  suspend(): Promise<number>;
  isClosed(): boolean;
  private wire;
  private keepalive;
  private reconnectLoop;
  private connect;
  private abortActiveConnect;
  private failReconnect;
  private rawSend;
  private flushPending;
  private enqueue;
  private handleIncoming;
  private dispatch;
  private flushBuffered;
  private captureBufferedListeners;
  private flushBufferedType;
  private scheduleSelectiveBufferedFlush;
  private hasListeners;
  private attachEventCheckpoint;
  private finalizeClose;
}
type Experimental_BridgeUserMessageRequest = {
  type: 'user-message';
  messageId: string;
  text: string;
};
type Experimental_BridgeUserMessageResponse = {
  type: 'user-message-response';
  messageId: string;
  accepted: boolean;
  error?: {
    message: string;
  };
};
type Experimental_BridgeUserMessageSubmitter = {
  submit(text: string): Promise<void>;
  close(error?: unknown): void;
};
export declare function experimental_createBridgeUserMessageSubmitter(options: {
  send(message: Experimental_BridgeUserMessageRequest): void;
  onResponse(
    listener: (response: Experimental_BridgeUserMessageResponse) => void,
  ): () => void;
  onReconnect(listener: () => void): () => void;
}): Experimental_BridgeUserMessageSubmitter;
type DiskLogRecoveryMode = 'replay' | 'rerun';
export declare function classifyDiskLog(
  eventLog: string | null | undefined,
): Promise<DiskLogRecoveryMode>;
export declare function getAiGatewayAuthFromEnv({
  env,
}: {
  env: Record<string, string | undefined>;
}): {
  apiKey: string | undefined;
  baseUrl: string;
};
type HarnessV1AuthenticationEnvironment = Readonly<Record<string, string>>;
type HarnessV1Authentication<ADAPTER_CHOICES extends string = 'direct'> = [
  ADAPTER_CHOICES,
] extends [never]
  ? never
  : string extends ADAPTER_CHOICES
    ? never
    : | 'auto'
      | 'ai-gateway'
      | ADAPTER_CHOICES
      | HarnessV1AuthenticationEnvironment;
export declare function isHarnessAuthenticationEnvironment(
  value: unknown,
): value is HarnessV1AuthenticationEnvironment;
export declare function parseJwtPayload({
  token,
}: {
  token: string;
}): Promise<Readonly<Record<string, unknown>> | undefined>;
export declare function getJwtExpiresAt({
  token,
}: {
  token: string;
}): Promise<number | undefined>;
export declare function readLinuxSecretServicePassword({
  attributes,
}: {
  attributes: Readonly<Record<string, string>>;
}): Promise<string | undefined>;
export declare function readMacOSKeychainPassword({
  service,
  account,
}: {
  service: string;
  account: string;
}): Promise<string | undefined>;
export declare function shouldResolveNativeSubscription({
  auth,
  env,
  hasDirectCredential,
}: {
  auth: Extract<HarnessV1Authentication, string> | undefined;
  env: Readonly<Record<string, string | undefined>>;
  hasDirectCredential: boolean;
}): boolean;
export declare function readWindowsCredentialManagerPassword({
  targetName,
}: {
  targetName: string;
}): Promise<string | undefined>;
type OAuthCredential = {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresAt: number;
};
type RefreshOAuthAccessTokenResult = {
  readonly accessToken: string;
  readonly expiresAt: number;
  readonly refreshToken?: string;
};
export declare function isAccessTokenExpiringSoon({
  expiresAt,
  now,
  refreshWindowMs,
}: {
  readonly expiresAt: number;
  readonly now?: number;
  readonly refreshWindowMs?: number;
}): boolean;
export declare function refreshOAuthAccessToken({
  tokenUrl,
  clientId,
  refreshToken,
  requestFormat,
  headers,
  fetch: fetchImplementation,
}: {
  readonly tokenUrl: string;
  readonly clientId: string;
  readonly refreshToken: string;
  readonly requestFormat?: 'json' | 'form';
  readonly headers?: Record<string, string>;
  readonly fetch?: typeof globalThis.fetch;
}): Promise<RefreshOAuthAccessTokenResult>;
export declare function isMacOS(platform: NodeJS.Platform): boolean;
export declare function isLinux(platform: NodeJS.Platform): boolean;
export declare function isWindows(platform: NodeJS.Platform): boolean;
type HarnessV1PortEndpoint = {
  readonly url: string;
  readonly headers?: Readonly<Record<string, string>>;
};
interface HarnessV1NetworkSandboxSession extends Experimental_SandboxSession {
  readonly id: string;
  readonly defaultWorkingDirectory: string;
  readonly ports: ReadonlyArray<number>;
  readonly getPortEndpoint: (options: {
    port: number;
    protocol?: 'http' | 'https' | 'ws';
  }) => PromiseLike<HarnessV1PortEndpoint>;
  readonly getPortUrl: (options: {
    port: number;
    protocol?: 'http' | 'https' | 'ws';
  }) => PromiseLike<string>;
  readonly stop: () => PromiseLike<void>;
  readonly destroy: () => PromiseLike<void>;
  readonly setNetworkPolicy?: (
    policy: HarnessV1NetworkPolicy,
  ) => PromiseLike<void>;
  readonly setRequestTransformations?: (
    transformations: ReadonlyArray<HarnessV1RequestTransformation>,
  ) => PromiseLike<void>;
  readonly addRequestTransformations?: (
    transformations: ReadonlyArray<HarnessV1RequestTransformation>,
  ) => PromiseLike<void>;
  readonly setPorts?: (
    ports: ReadonlyArray<number>,
    options?: {
      abortSignal?: AbortSignal;
    },
  ) => PromiseLike<void>;
  readonly restricted: () => Experimental_SandboxSession;
}
type HarnessV1NetworkPolicy =
  | {
      mode: 'allow-all';
    }
  | {
      mode: 'deny-all';
    }
  | {
      mode: 'custom';
      allowedHosts: ReadonlyArray<string>;
      allowedCIDRs?: ReadonlyArray<string>;
      deniedCIDRs?: ReadonlyArray<string>;
    }
  | {
      mode: 'custom';
      allowedHosts?: ReadonlyArray<string>;
      allowedCIDRs: ReadonlyArray<string>;
      deniedCIDRs?: ReadonlyArray<string>;
    };
type HarnessV1RequestTransformationPathMatcher =
  | {
      exact: string;
    }
  | {
      startsWith: string;
    }
  | {
      regex: string;
    };
type HarnessV1RequestTransformationKeyValuePartMatcher =
  | {
      exact: string;
    }
  | {
      startsWith: string;
    }
  | {
      regex: string;
    };
type HarnessV1RequestTransformationKeyValueMatcher = {
  readonly key?: HarnessV1RequestTransformationKeyValuePartMatcher;
  readonly value?: HarnessV1RequestTransformationKeyValuePartMatcher;
};
type HarnessV1RequestTransformation = {
  readonly match: {
    readonly host: string;
    readonly path?: HarnessV1RequestTransformationPathMatcher;
    readonly method?: ReadonlyArray<string>;
    readonly queryString?: ReadonlyArray<HarnessV1RequestTransformationKeyValueMatcher>;
    readonly headers?: ReadonlyArray<HarnessV1RequestTransformationKeyValueMatcher>;
  };
  readonly transform: {
    readonly headers: Readonly<Record<string, string>>;
  };
};
type HarnessV1Prompt = string | UserModelMessage;
type HarnessV1Skill = {
  readonly name: string;
  readonly description: string;
  readonly content: string;
  readonly files?: ReadonlyArray<HarnessV1SkillFile>;
};
type HarnessV1SkillFile = {
  readonly path: string;
  readonly content: string;
};
type HarnessV1CallWarning =
  | {
      type: 'unsupported-setting';
      setting: string;
      details?: string;
    }
  | {
      type: 'unsupported-tool';
      tool: string;
      details?: string;
    }
  | {
      type: 'other';
      message: string;
    };
declare module 'ai' {
  interface CallWarningRegistry {
    harnessV1: HarnessV1CallWarning;
  }
}
type HarnessV1CredentialForwarding = (options: {
  readonly credential: string;
  readonly environmentVariableName: string;
}) => string | PromiseLike<string>;
export declare function encodeHarnessPathSegment(value: string): string;
declare const harnessV1BridgeHelloSchema: z.ZodObject<
  {
    type: z.ZodLiteral<'bridge-hello'>;
    state: z.ZodOptional<z.ZodString>;
    lastSeq: z.ZodOptional<z.ZodNumber>;
    capabilities: z.ZodOptional<
      z.ZodObject<
        {
          idempotentStart: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
          experimental_userMessageResponses: z.ZodOptional<z.ZodBoolean>;
        },
        z.core.$strip
      >
    >;
  },
  z.core.$strip
>;
export declare function applyCredentialForwarding({
  environment,
  credentialEnvironmentVariables,
  credentialForwarding,
}: {
  environment: Readonly<Record<string, string>>;
  credentialEnvironmentVariables: ReadonlyArray<string>;
  credentialForwarding: HarnessV1CredentialForwarding | undefined;
}): Promise<Record<string, string>>;
export declare function resolveSandboxCredentialEnvironment({
  environment,
  credentialEnvironmentVariables,
  credentialForwarding,
  previousSandboxCredentialEnvironment,
}: {
  environment: Readonly<Record<string, string>>;
  credentialEnvironmentVariables: ReadonlyArray<string>;
  credentialForwarding: HarnessV1CredentialForwarding | undefined;
  previousSandboxCredentialEnvironment?: Readonly<Record<string, string>>;
}): Promise<Record<string, string>>;
export declare function generateSandboxCredentialPlaceholder(): string;
export declare function isSandboxCredentialPlaceholder(value: string): boolean;
export declare function warnCredentialBrokeringUnavailable(options: {
  environment: Readonly<Record<string, string>>;
  forwardedEnvironment: Readonly<Record<string, string>>;
  credentialEnvironmentVariables: ReadonlyArray<string>;
}): void;
export declare function maskSandboxCredentials({
  environment,
  credentialEnvironmentVariables,
}: {
  environment: Readonly<Record<string, string>>;
  credentialEnvironmentVariables: ReadonlyArray<string>;
}): Record<string, string>;
export declare function createCredentialRequestTransformation({
  matchUrl,
  matchHeaders,
  transformHeaders,
}: {
  matchUrl: string;
  matchHeaders: Readonly<Record<string, string>>;
  transformHeaders: Readonly<Record<string, string>>;
}): HarnessV1RequestTransformation;
export declare function resolveSandboxHomeDir({
  sandbox,
  abortSignal,
}: {
  sandbox: Experimental_SandboxSession;
  abortSignal?: AbortSignal;
}): Promise<string>;
export declare function shellQuote(value: string): string;
type WriteInstructionsOptions = {
  sandbox: Experimental_SandboxSession;
  homePath: string;
  instructionsFile: string;
  instructions?: string;
  abortSignal?: AbortSignal;
};
type WriteInstructionsResult = {
  changed: boolean;
  filePath: string;
};
export declare function writeInstructions({
  sandbox,
  homePath,
  instructionsFile,
  instructions,
  abortSignal,
}: WriteInstructionsOptions): Promise<WriteInstructionsResult>;
type SkillFilePathMode = 'relative' | 'strip-leading-slashes';
type WriteSkillsOptions = {
  sandbox: Experimental_SandboxSession;
  homePath: string;
  skillsDir: string;
  skills: ReadonlyArray<HarnessV1Skill>;
  abortSignal?: AbortSignal;
  skillNamePattern?: RegExp;
  invalidSkillNameMessage?: (input: { name: string }) => string;
  filePathMode?: SkillFilePathMode;
  invalidSkillFilePathMessage?: (input: {
    skillName: string;
    filePath: string;
  }) => string;
  trailingNewline?: boolean;
};
type WriteSkillsResult = {
  changed: boolean;
  written: string[];
  removed: string[];
  unchanged: string[];
};
export declare function writeSkills({
  sandbox,
  homePath,
  skillsDir,
  skills,
  abortSignal,
  skillNamePattern,
  invalidSkillNameMessage,
  filePathMode,
  invalidSkillFilePathMessage,
  trailingNewline,
}: WriteSkillsOptions): Promise<WriteSkillsResult>;
type BridgeReadySource = 'stdout' | 'metadata';
type BridgeReadyErrorContext = {
  proc: Experimental_SandboxProcess;
  stdoutTail: string[];
};
type WaitForBridgeReadyOptions = {
  proc: Experimental_SandboxProcess;
  sandbox: Experimental_SandboxSession;
  bridgeStateDir: string;
  bridgeType: string;
  timeoutMs: number;
  abortSignal?: AbortSignal;
  pollIntervalMs?: number;
  createTimeoutError?: (
    context: BridgeReadyErrorContext,
  ) => Error | Promise<Error>;
  createExitError?: (
    context: BridgeReadyErrorContext,
  ) => Error | Promise<Error>;
};
type WaitForBridgeReadyResult = {
  port: number;
  source: BridgeReadySource;
  stdoutTail: string[];
};
export declare function markBridgeStarting({
  sandbox,
  bridgeStateDir,
  bridgeType,
  abortSignal,
}: {
  sandbox: Experimental_SandboxSession;
  bridgeStateDir: string;
  bridgeType: string;
  abortSignal?: AbortSignal;
}): Promise<void>;
export declare function waitForBridgeReady({
  proc,
  sandbox,
  bridgeStateDir,
  bridgeType,
  timeoutMs,
  abortSignal,
  pollIntervalMs,
  createTimeoutError,
  createExitError,
}: WaitForBridgeReadyOptions): Promise<WaitForBridgeReadyResult>;
export declare function stopPreviousBridge({
  sandbox,
  bridgeStateDir,
  bridgeType,
  gracePeriodMs,
  abortSignal,
}: {
  sandbox: Experimental_SandboxSession;
  bridgeStateDir: string;
  bridgeType: string;
  gracePeriodMs?: number;
  abortSignal?: AbortSignal;
}): Promise<void>;
export declare const BRIDGE_AUTH_PUBLIC_KEY_ENV = 'BRIDGE_AUTH_PUBLIC_KEY';
interface BridgeAuthKeyPair {
  readonly privateKey: string;
  readonly publicKey: string;
}
export declare function createBridgeAuthKeyPair(): BridgeAuthKeyPair;
export declare function validateBridgeSandboxSettings({
  sandboxSession,
  portOverride,
  portEndpointOverride,
}: {
  sandboxSession: HarnessV1NetworkSandboxSession | Experimental_SandboxSession;
  portOverride: number | undefined;
  portEndpointOverride: HarnessV1PortEndpoint | undefined;
}): void;
export declare function warnMintBridgeTokenIgnored({
  harnessId,
  mintBridgeToken,
}: {
  harnessId: string;
  mintBridgeToken: unknown;
}): void;
export declare function resolveBridgePort({
  sandboxSession,
  portOverride,
}: {
  sandboxSession: HarnessV1NetworkSandboxSession | Experimental_SandboxSession;
  portOverride: number | undefined;
}): number;
export declare function resolveBridgeEndpoint({
  sandboxSession,
  port,
  portEndpointOverride,
}: {
  sandboxSession: HarnessV1NetworkSandboxSession | Experimental_SandboxSession;
  port: number;
  portEndpointOverride: HarnessV1PortEndpoint | undefined;
}): Promise<HarnessV1PortEndpoint>;
type BridgeHello = z.infer<typeof harnessV1BridgeHelloSchema>;
interface CreateBridgeWebSocketConnectOptions {
  endpoint: HarnessV1PortEndpoint;
  privateKey: string;
  webSocketConstructor: typeof WebSocket;
  openRetryTimeoutMs?: number;
  startAbortSignal?: AbortSignal;
  onHello?: (hello: BridgeHello) => void;
}
export declare function createBridgeWebSocketConnect({
  endpoint,
  privateKey,
  webSocketConstructor,
  openRetryTimeoutMs,
  startAbortSignal,
  onHello,
}: CreateBridgeWebSocketConnectOptions): (
  options: SandboxChannelConnectOptions,
) => Promise<WebSocket>;
export declare function createReadBridgeAsset<
  const ASSET_URLS extends Record<string, URL>,
>(
  assetUrls: ASSET_URLS,
): (name: Extract<keyof ASSET_URLS, string>) => Promise<string>;
type BridgeProcessStreamName = 'stdout' | 'stderr';
export declare function formatBridgeError(error: unknown): string;
export declare function logBridgeError({
  harnessId,
  sessionId,
  context,
  error,
  write,
}: {
  harnessId: string;
  sessionId?: string;
  context?: string;
  error: unknown;
  write?: (line: string) => void;
}): void;
export declare function createBridgeErrorHandler({
  harnessId,
  sessionId,
}: {
  harnessId: string;
  sessionId?: string;
}): (event: { type: 'error'; error: unknown }) => void;
export declare function createBridgeStartupError({
  message,
  proc,
  stdoutTail,
  stderrTail,
  stderrDone,
}: {
  message: string;
  proc: Experimental_SandboxProcess;
  stdoutTail: string[];
  stderrTail: string[];
  stderrDone?: Promise<void>;
}): Promise<Error>;
export declare function forwardBridgeProcessStream({
  stream,
  streamName,
  source,
  collectTail,
  tailLimit,
}: {
  stream: ReadableStream<Uint8Array>;
  streamName: BridgeProcessStreamName;
  source?: string;
  collectTail?: string[];
  tailLimit?: number;
}): Promise<void>;
export declare function drainBridgeProcessStream(
  stream: ReadableStream<Uint8Array>,
): Promise<void>;
export declare function resolveSandboxDefaultWorkingDirectory({
  sandboxSession,
  abortSignal,
}: {
  readonly sandboxSession:
    HarnessV1NetworkSandboxSession | Experimental_SandboxSession;
  readonly abortSignal?: AbortSignal;
}): Promise<string>;
export declare function getRestrictedSandboxSession(
  sandboxSession: HarnessV1NetworkSandboxSession | Experimental_SandboxSession,
): Experimental_SandboxSession;
export declare function isSandboxWriteProtectedPath({
  sandbox,
  workDir,
  paths,
  writeProtectedPaths,
  abortSignal,
}: {
  sandbox: Experimental_SandboxSession;
  workDir: string;
  paths: ReadonlyArray<string>;
  writeProtectedPaths: ReadonlyArray<string>;
  abortSignal?: AbortSignal;
}): Promise<boolean>;
export declare function sleep({
  ms,
  abortSignal,
}: {
  ms: number;
  abortSignal?: AbortSignal;
}): Promise<void>;
export declare function normalizeHarnessToolModelOutput({
  output,
}: {
  output: ToolResultOutput;
}): ToolResultOutput;
declare const harnessPromptContentPartSchema: z.ZodDiscriminatedUnion<
  [
    z.ZodObject<
      {
        type: z.ZodLiteral<'text'>;
        text: z.ZodString;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'image'>;
        data: z.ZodString;
        mediaType: z.ZodString;
      },
      z.core.$strip
    >,
  ]
> & {
  def: {
    discriminator: 'type';
  };
  _zod: {
    def: {
      discriminator: 'type';
    };
  };
};
export declare const harnessPromptContentSchema: z.ZodUnion<
  readonly [
    z.ZodString,
    z.ZodArray<
      z.ZodDiscriminatedUnion<
        [
          z.ZodObject<
            {
              type: z.ZodLiteral<'text'>;
              text: z.ZodString;
            },
            z.core.$strip
          >,
          z.ZodObject<
            {
              type: z.ZodLiteral<'image'>;
              data: z.ZodString;
              mediaType: z.ZodString;
            },
            z.core.$strip
          >,
        ]
      > & {
        def: {
          discriminator: 'type';
        };
        _zod: {
          def: {
            discriminator: 'type';
          };
        };
      }
    >,
  ]
>;
type HarnessPromptContentPart = z.infer<typeof harnessPromptContentPartSchema>;
type HarnessPromptContent = z.infer<typeof harnessPromptContentSchema>;
export declare function extractHarnessPromptContent({
  prompt,
}: {
  prompt: HarnessV1Prompt;
}): HarnessPromptContent;
type HarnessToolModelOutputContent =
  | {
      type: 'text';
      text: string;
    }
  | {
      type: 'image';
      data: string;
      mediaType: string;
    };
export declare function convertHarnessToolModelOutput({
  output,
}: {
  output: ToolResultOutput;
}): {
  content: HarnessToolModelOutputContent[];
  isError: boolean;
};
export type {
  BridgeAuthKeyPair,
  BridgeHello,
  BridgeReadyErrorContext,
  BridgeReadySource,
  CreateBridgeWebSocketConnectOptions,
  DiskLogRecoveryMode,
  Experimental_BridgeUserMessageRequest,
  Experimental_BridgeUserMessageResponse,
  Experimental_BridgeUserMessageSubmitter,
  HarnessPromptContent,
  HarnessPromptContentPart,
  HarnessToolModelOutputContent,
  OAuthCredential,
  RefreshOAuthAccessTokenResult,
  SandboxChannelConnectOptions,
  SandboxChannelDebugEvent,
  SandboxChannelOptions,
  SandboxChannelReconnectOptions,
  SkillFilePathMode,
  WaitForBridgeReadyOptions,
  WaitForBridgeReadyResult,
  WriteInstructionsOptions,
  WriteInstructionsResult,
  WriteSkillsOptions,
  WriteSkillsResult,
};
