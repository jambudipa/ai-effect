import * as native from '@ai-sdk/harness/utils';
import type * as SDKContract from '../internal/harness-contracts/harness-utils.js';
import {
  type AiSdkError,
  openOperation,
  runRequest,
  runSync,
  sdkError,
} from '../../internal/operation.js';
import { toSdkSchema } from '../../internal/schema.js';
import { Effect, Queue, type Schema, type Scope, Stream } from 'effect';
import { wrapSchema } from '../internal/schema.js';
import { type HarnessV1CredentialForwarding } from '../internal/harness.js';
import {
  type Process,
  type SandboxSession,
  unwrapProcess,
  unwrapSandbox,
  wrapSandbox,
} from '../internal/sandbox.js';

/** Treat the native utility exports as the checked pinned contract used by the adapters below. */
const sdk = native as unknown as typeof SDKContract;

export type {
  BridgeAuthKeyPair,
  BridgeHello,
  BridgeReadySource,
  DiskLogRecoveryMode,
  Experimental_BridgeUserMessageRequest,
  Experimental_BridgeUserMessageResponse,
  HarnessPromptContent,
  HarnessPromptContentPart,
  HarnessToolModelOutputContent,
  OAuthCredential,
  RefreshOAuthAccessTokenResult,
  SandboxChannelConnectOptions,
  SandboxChannelDebugEvent,
  SandboxChannelReconnectOptions,
  SkillFilePathMode,
  WaitForBridgeReadyResult,
  WriteInstructionsResult,
  WriteSkillsResult,
} from '../internal/harness-contracts/harness-utils.js';
export type { HarnessV1RequestTransformation } from '../internal/harness-contracts/harness.js';

/** Sandbox environment key for the public half of bridge authentication material. */
export const BRIDGE_AUTH_PUBLIC_KEY_ENV = sdk.BRIDGE_AUTH_PUBLIC_KEY_ENV;
/** Validate the SDK's supported harness prompt content through its Effect schema wrapper. */
export const harnessPromptContentSchema = wrapSchema(
  'HarnessUtils.promptContent',
  sdk.harnessPromptContentSchema,
);

/** Adapt native tool results to bridge model output without executing the tools again. */
export const convertHarnessToolModelOutput = (
  ...args: Parameters<typeof sdk.convertHarnessToolModelOutput>
) =>
  runSync('HarnessUtils.convertHarnessToolModelOutput', () =>
    sdk.convertHarnessToolModelOutput(...args),
  );

/** Create bridge authentication material lazily through the SDK's tagged boundary. */
export const createBridgeAuthKeyPair = (
  ...args: Parameters<typeof sdk.createBridgeAuthKeyPair>
) =>
  runSync('HarnessUtils.createBridgeAuthKeyPair', () =>
    sdk.createBridgeAuthKeyPair(...args),
  );

/** Encode a harness identifier for use as one path segment. */
export const encodeHarnessPathSegment = (
  ...args: Parameters<typeof sdk.encodeHarnessPathSegment>
) =>
  runSync('HarnessUtils.encodeHarnessPathSegment', () =>
    sdk.encodeHarnessPathSegment(...args),
  );

/** Extract the supported prompt content parts from the SDK input shape. */
export const extractHarnessPromptContent = (
  ...args: Parameters<typeof sdk.extractHarnessPromptContent>
) =>
  runSync('HarnessUtils.extractHarnessPromptContent', () =>
    sdk.extractHarnessPromptContent(...args),
  );

/** Format a bridge failure as a diagnostic message through the native helper. */
export const formatBridgeError = (
  ...args: Parameters<typeof sdk.formatBridgeError>
) =>
  runSync('HarnessUtils.formatBridgeError', () =>
    sdk.formatBridgeError(...args),
  );

/** Create the placeholder value the SDK uses in a sandbox instead of the original credential. */
export const generateSandboxCredentialPlaceholder = (
  ...args: Parameters<typeof sdk.generateSandboxCredentialPlaceholder>
) =>
  runSync('HarnessUtils.generateSandboxCredentialPlaceholder', () =>
    sdk.generateSandboxCredentialPlaceholder(...args),
  );

/** Read the SDK's AI Gateway authentication configuration from the supplied environment. */
export const getAiGatewayAuthFromEnv = (
  ...args: Parameters<typeof sdk.getAiGatewayAuthFromEnv>
) =>
  runSync('HarnessUtils.getAiGatewayAuthFromEnv', () =>
    sdk.getAiGatewayAuthFromEnv(...args),
  );

/** Let the SDK apply its expiry threshold to an access token's lifetime. */
export const isAccessTokenExpiringSoon = (
  ...args: Parameters<typeof sdk.isAccessTokenExpiringSoon>
) =>
  runSync('HarnessUtils.isAccessTokenExpiringSoon', () =>
    sdk.isAccessTokenExpiringSoon(...args),
  );

/** Test whether the native harness supports the supplied authentication environment. */
export const isHarnessAuthenticationEnvironment = (
  ...args: Parameters<typeof sdk.isHarnessAuthenticationEnvironment>
) =>
  runSync('HarnessUtils.isHarnessAuthenticationEnvironment', () =>
    sdk.isHarnessAuthenticationEnvironment(...args),
  );

/** Use the pinned SDK's Linux environment check as a lazy Effect. */
export const isLinux = (...args: Parameters<typeof sdk.isLinux>) =>
  runSync('HarnessUtils.isLinux', () => sdk.isLinux(...args));

/** Use the pinned SDK's macOS environment check as a lazy Effect. */
export const isMacOS = (...args: Parameters<typeof sdk.isMacOS>) =>
  runSync('HarnessUtils.isMacOS', () => sdk.isMacOS(...args));

/** Test whether a value is already an SDK sandbox credential placeholder. */
export const isSandboxCredentialPlaceholder = (
  ...args: Parameters<typeof sdk.isSandboxCredentialPlaceholder>
) =>
  runSync('HarnessUtils.isSandboxCredentialPlaceholder', () =>
    sdk.isSandboxCredentialPlaceholder(...args),
  );

/** Use the pinned SDK's Windows environment check as a lazy Effect. */
export const isWindows = (...args: Parameters<typeof sdk.isWindows>) =>
  runSync('HarnessUtils.isWindows', () => sdk.isWindows(...args));

/** Bridge diagnostic settings with an optional Effect event consumer. */
type LogBridgeErrorOptions<E, R> = Omit<
  Parameters<typeof sdk.logBridgeError>[0],
  'write'
> & {
  readonly write?: (line: string) => Effect.Effect<void, E, R>;
};

/** Send a bridge error to the native logger and bind optional diagnostics to the caller's Effect context. */
export const logBridgeError = <E = never, R = never>(
  options: LogBridgeErrorOptions<E, R>,
) =>
  Effect.gen(function* () {
    const { write, ...nativeOptions } = options;
    if (!write) {
      return yield* runSync('HarnessUtils.logBridgeError', () =>
        sdk.logBridgeError(nativeOptions),
      );
    }
    const lines = yield* runSync('HarnessUtils.logBridgeError', () => {
      let output: string[] = [];
      sdk.logBridgeError({
        ...nativeOptions,
        write: (line) => {
          output = [...output, line];
        },
      });
      return output;
    });
    yield* Effect.forEach(lines, (line) => Effect.suspend(() => write(line)), {
      discard: true,
    });
  });

/** Ask the SDK to redact sandbox credential values in content before reporting it. */
export const maskSandboxCredentials = (
  ...args: Parameters<typeof sdk.maskSandboxCredentials>
) =>
  runSync('HarnessUtils.maskSandboxCredentials', () =>
    sdk.maskSandboxCredentials(...args),
  );

/** Normalize bridge tool output into the content shape the SDK expects. */
export const normalizeHarnessToolModelOutput = (
  ...args: Parameters<typeof sdk.normalizeHarnessToolModelOutput>
) =>
  runSync('HarnessUtils.normalizeHarnessToolModelOutput', () =>
    sdk.normalizeHarnessToolModelOutput(...args),
  );

/** Quote one value using the SDK's shell argument convention. */
export const shellQuote = (...args: Parameters<typeof sdk.shellQuote>) =>
  runSync('HarnessUtils.shellQuote', () => sdk.shellQuote(...args));

/** Determine whether the SDK should try the harness's native subscription credentials. */
export const shouldResolveNativeSubscription = (
  ...args: Parameters<typeof sdk.shouldResolveNativeSubscription>
) =>
  runSync('HarnessUtils.shouldResolveNativeSubscription', () =>
    sdk.shouldResolveNativeSubscription(...args),
  );

/** Emit the SDK diagnostic for a sandbox environment without credential brokering support. */
export const warnCredentialBrokeringUnavailable = (
  ...args: Parameters<typeof sdk.warnCredentialBrokeringUnavailable>
) =>
  runSync('HarnessUtils.warnCredentialBrokeringUnavailable', () =>
    sdk.warnCredentialBrokeringUnavailable(...args),
  );

/** Emit the SDK diagnostic for a bridge token setting that has no effect. */
export const warnMintBridgeTokenIgnored = (
  ...args: Parameters<typeof sdk.warnMintBridgeTokenIgnored>
) =>
  runSync('HarnessUtils.warnMintBridgeTokenIgnored', () =>
    sdk.warnMintBridgeTokenIgnored(...args),
  );

/** Classify the SDK's disk-log content through its asynchronous boundary. */
export const classifyDiskLog = (
  ...args: Parameters<typeof sdk.classifyDiskLog>
) =>
  runRequest('HarnessUtils.classifyDiskLog', {}, () =>
    sdk.classifyDiskLog(...args),
  );

/** Consume a bridge process stream using the SDK's drain convention. */
export const drainBridgeProcessStream = (
  ...args: Parameters<typeof sdk.drainBridgeProcessStream>
) =>
  runRequest('HarnessUtils.drainBridgeProcessStream', {}, () =>
    sdk.drainBridgeProcessStream(...args),
  );

/** Forward a bridge process stream to the native diagnostics consumer. */
export const forwardBridgeProcessStream = (
  ...args: Parameters<typeof sdk.forwardBridgeProcessStream>
) =>
  runRequest('HarnessUtils.forwardBridgeProcessStream', {}, () =>
    sdk.forwardBridgeProcessStream(...args),
  );

/** Read a token's expiry using the SDK helper. Parsing alone does not authenticate a token. */
export const getJwtExpiresAt = (
  ...args: Parameters<typeof sdk.getJwtExpiresAt>
) =>
  runRequest('HarnessUtils.getJwtExpiresAt', {}, () =>
    sdk.getJwtExpiresAt(...args),
  );

/** Decode the token payload through the native parser. Use verification before trusting claims. */
export const parseJwtPayload = (
  ...args: Parameters<typeof sdk.parseJwtPayload>
) =>
  runRequest('HarnessUtils.parseJwtPayload', {}, () =>
    sdk.parseJwtPayload(...args),
  );

/** Request an authorized credential lookup through the SDK's Linux Secret Service integration. */
export const readLinuxSecretServicePassword = (
  ...args: Parameters<typeof sdk.readLinuxSecretServicePassword>
) =>
  runRequest('HarnessUtils.readLinuxSecretServicePassword', {}, () =>
    sdk.readLinuxSecretServicePassword(...args),
  );

/** Request an authorized credential lookup through the SDK's macOS Keychain integration. */
export const readMacOSKeychainPassword = (
  ...args: Parameters<typeof sdk.readMacOSKeychainPassword>
) =>
  runRequest('HarnessUtils.readMacOSKeychainPassword', {}, () =>
    sdk.readMacOSKeychainPassword(...args),
  );

/** Request an authorized credential lookup through the SDK's Windows Credential Manager integration. */
export const readWindowsCredentialManagerPassword = (
  ...args: Parameters<typeof sdk.readWindowsCredentialManagerPassword>
) =>
  runRequest('HarnessUtils.readWindowsCredentialManagerPassword', {}, () =>
    sdk.readWindowsCredentialManagerPassword(...args),
  );

/** Ask the native SDK to refresh an OAuth token using its supplied refresh settings. */
export const refreshOAuthAccessToken = (
  ...args: Parameters<typeof sdk.refreshOAuthAccessToken>
) =>
  runRequest('HarnessUtils.refreshOAuthAccessToken', {}, () =>
    sdk.refreshOAuthAccessToken(...args),
  );

/** Registered native sandbox identity recognized by the SDK helper calls. */
type NativeSandbox = NonNullable<ReturnType<typeof unwrapSandbox>>;
/** Replace the chosen native sandbox field with the public Effect session handle. */
type Sandboxed<O, K extends keyof O> = Omit<O, K> & {
  readonly [P in K]: SandboxSession;
};

/** Resolve native identity at execution time and fail with a tagged error for unregistered sessions. */
const withSandbox = <A, E, R>(
  name: string,
  input: SandboxSession,
  use: (native: NativeSandbox) => Effect.Effect<A, E, R>,
) =>
  Effect.suspend<A, E | AiSdkError, R>(() => {
    const sandbox = unwrapSandbox(input);
    return sandbox
      ? use(sandbox)
      : Effect.fail(sdkError(name, 'Invalid sandbox session'));
  });

/** Instruction write settings for a registered sandbox session. */
export type WriteInstructionsOptions = Sandboxed<
  SDKContract.WriteInstructionsOptions,
  'sandbox'
>;
/** Skill write options with synchronous validation messages for invalid skill names and paths. */
export type WriteSkillsOptions = Omit<
  Sandboxed<SDKContract.WriteSkillsOptions, 'sandbox'>,
  'invalidSkillNameMessage' | 'invalidSkillFilePathMessage'
> & {
  readonly invalidSkillNameMessage?: (input: { name: string }) => string;
  readonly invalidSkillFilePathMessage?: (input: {
    skillName: string;
    filePath: string;
  }) => string;
};

/** Resolve the home directory using a registered sandbox and a cancellable native request. */
export const resolveSandboxHomeDir = (
  options: Sandboxed<
    Parameters<typeof sdk.resolveSandboxHomeDir>[0],
    'sandbox'
  >,
) =>
  withSandbox(
    'HarnessUtils.resolveSandboxHomeDir',
    options.sandbox,
    (sandbox) =>
      runRequest('HarnessUtils.resolveSandboxHomeDir', options, (abortSignal) =>
        sdk.resolveSandboxHomeDir({ ...options, sandbox, abortSignal }),
      ),
  );

/** Check a sandbox path against the native write protection policy with the caller's abort signal. */
export const isSandboxWriteProtectedPath = (
  options: Sandboxed<
    Parameters<typeof sdk.isSandboxWriteProtectedPath>[0],
    'sandbox'
  >,
) =>
  withSandbox(
    'HarnessUtils.isSandboxWriteProtectedPath',
    options.sandbox,
    (sandbox) =>
      runRequest(
        'HarnessUtils.isSandboxWriteProtectedPath',
        options,
        (abortSignal) =>
          sdk.isSandboxWriteProtectedPath({ ...options, sandbox, abortSignal }),
      ),
  );

/** Record bridge startup in a registered sandbox through the native lifecycle helper. */
export const markBridgeStarting = (
  options: Sandboxed<Parameters<typeof sdk.markBridgeStarting>[0], 'sandbox'>,
) =>
  withSandbox('HarnessUtils.markBridgeStarting', options.sandbox, (sandbox) =>
    runRequest('HarnessUtils.markBridgeStarting', options, (abortSignal) =>
      sdk.markBridgeStarting({ ...options, sandbox, abortSignal }),
    ),
  );

/** Stop an earlier bridge through the registered sandbox with cancellable native cleanup. */
export const stopPreviousBridge = (
  options: Sandboxed<Parameters<typeof sdk.stopPreviousBridge>[0], 'sandbox'>,
) =>
  withSandbox('HarnessUtils.stopPreviousBridge', options.sandbox, (sandbox) =>
    runRequest('HarnessUtils.stopPreviousBridge', options, (abortSignal) =>
      sdk.stopPreviousBridge({ ...options, sandbox, abortSignal }),
    ),
  );

/** Write harness instructions using a registered sandbox and the native write format. */
export const writeInstructions = (
  options: Sandboxed<Parameters<typeof sdk.writeInstructions>[0], 'sandbox'>,
) =>
  withSandbox('HarnessUtils.writeInstructions', options.sandbox, (sandbox) =>
    runRequest('HarnessUtils.writeInstructions', options, (abortSignal) =>
      sdk.writeInstructions({ ...options, sandbox, abortSignal }),
    ),
  );

/** Write harness skill files through native path validation within the registered sandbox. */
export const writeSkills = (options: WriteSkillsOptions) =>
  withSandbox('HarnessUtils.writeSkills', options.sandbox, (sandbox) =>
    runRequest('HarnessUtils.writeSkills', options, (abortSignal) =>
      sdk.writeSkills({ ...options, sandbox, abortSignal }),
    ),
  );

/** Resolve the effective working directory from the registered sandbox's native settings. */
export const resolveSandboxDefaultWorkingDirectory = (
  options: Sandboxed<
    Parameters<typeof sdk.resolveSandboxDefaultWorkingDirectory>[0],
    'sandboxSession'
  >,
) =>
  withSandbox(
    'HarnessUtils.resolveSandboxDefaultWorkingDirectory',
    options.sandboxSession,
    (sandboxSession) =>
      runRequest(
        'HarnessUtils.resolveSandboxDefaultWorkingDirectory',
        options,
        (abortSignal) =>
          sdk.resolveSandboxDefaultWorkingDirectory({
            ...options,
            sandboxSession,
            abortSignal,
          }),
      ),
  );

/** Resolve the bridge endpoint using a registered sandbox's network configuration. */
export const resolveBridgeEndpoint = (
  options: Sandboxed<
    Parameters<typeof sdk.resolveBridgeEndpoint>[0],
    'sandboxSession'
  >,
) =>
  withSandbox(
    'HarnessUtils.resolveBridgeEndpoint',
    options.sandboxSession,
    (sandboxSession) =>
      runRequest('HarnessUtils.resolveBridgeEndpoint', {}, () =>
        sdk.resolveBridgeEndpoint({ ...options, sandboxSession }),
      ),
  );

/** Validate bridge settings through the native sandbox before opening a connection. */
export const validateBridgeSandboxSettings = (
  options: Sandboxed<
    Parameters<typeof sdk.validateBridgeSandboxSettings>[0],
    'sandboxSession'
  >,
) =>
  withSandbox(
    'HarnessUtils.validateBridgeSandboxSettings',
    options.sandboxSession,
    (sandboxSession) =>
      runSync('HarnessUtils.validateBridgeSandboxSettings', () =>
        sdk.validateBridgeSandboxSettings({
          ...options,
          sandboxSession,
        }),
      ),
  );

/** Resolve the bridge port using the registered session and the SDK's configuration rules. */
export const resolveBridgePort = (
  options: Sandboxed<
    Parameters<typeof sdk.resolveBridgePort>[0],
    'sandboxSession'
  >,
) =>
  withSandbox(
    'HarnessUtils.resolveBridgePort',
    options.sandboxSession,
    (sandboxSession) =>
      runSync('HarnessUtils.resolveBridgePort', () =>
        sdk.resolveBridgePort({ ...options, sandboxSession }),
      ),
  );

/** Obtain and register the native restricted view of a sandbox session. */
export const getRestrictedSandboxSession = (input: SandboxSession) =>
  withSandbox('HarnessUtils.getRestrictedSandboxSession', input, (sandbox) =>
    runSync('HarnessUtils.getRestrictedSandboxSession', () =>
      wrapSandbox(sdk.getRestrictedSandboxSession(sandbox)),
    ),
  );

/** Construct the native credential request transformation through the tagged synchronous boundary. */
export const createCredentialRequestTransformation = (
  ...args: Parameters<typeof sdk.createCredentialRequestTransformation>
) =>
  runSync('HarnessUtils.createCredentialRequestTransformation', () =>
    sdk.createCredentialRequestTransformation(...args),
  );

/** Replace the SDK credential hook with a callback in the caller's Effect environment. */
type WithCredentialCallback<Options, R, E> = Omit<
  Options,
  'credentialForwarding'
> & {
  readonly credentialForwarding?: HarnessV1CredentialForwarding<R, E>;
};

/** Apply native credential forwarding with a local scope for the optional Effect callback. */
export const applyCredentialForwarding = <R = never, E = never>(
  input: WithCredentialCallback<
    Parameters<typeof sdk.applyCredentialForwarding>[0],
    R,
    E
  >,
) =>
  Effect.scoped(
    Effect.gen(function* () {
      const owner = yield* openOperation<R>();
      const { credentialForwarding, ...rest } = input;
      return yield* runRequest(
        'HarnessUtils.applyCredentialForwarding',
        { abortSignal: owner.signal },
        () =>
          sdk.applyCredentialForwarding({
            ...rest,
            credentialForwarding:
              credentialForwarding &&
              ((options) => owner.runCallback(credentialForwarding(options))),
          }),
      );
    }),
  );

/** Resolve sandbox credential environment values with interruption scoped to the lookup. */
export const resolveSandboxCredentialEnvironment = <R = never, E = never>(
  input: WithCredentialCallback<
    Parameters<typeof sdk.resolveSandboxCredentialEnvironment>[0],
    R,
    E
  >,
) =>
  Effect.scoped(
    Effect.gen(function* () {
      const owner = yield* openOperation<R>();
      const { credentialForwarding, ...rest } = input;
      return yield* runRequest(
        'HarnessUtils.resolveSandboxCredentialEnvironment',
        { abortSignal: owner.signal },
        () =>
          sdk.resolveSandboxCredentialEnvironment({
            ...rest,
            credentialForwarding:
              credentialForwarding &&
              ((options) => owner.runCallback(credentialForwarding(options))),
          }),
      );
    }),
  );

/** Return an Effect reader whose requested asset name must exist in the supplied URL map. */
export const createReadBridgeAsset =
  <const Urls extends Record<string, URL>>(urls: Urls) =>
  (name: Extract<keyof Urls, string>) =>
    runRequest('HarnessUtils.readBridgeAsset', {}, () =>
      sdk.createReadBridgeAsset(urls)(name),
    );

/** Build a lazy handler for the SDK's bridge error event shape. */
export const createBridgeErrorHandler =
  (...args: Parameters<typeof sdk.createBridgeErrorHandler>) =>
  (event: Parameters<ReturnType<typeof sdk.createBridgeErrorHandler>>[0]) =>
    runSync('HarnessUtils.bridgeErrorHandler', () =>
      sdk.createBridgeErrorHandler(...args)(event),
    );

/** Native WebSocket configuration with a synchronous observer for the bridge hello message. */
export type CreateBridgeWebSocketConnectOptions = Omit<
  SDKContract.CreateBridgeWebSocketConnectOptions,
  'onHello'
> & {
  readonly onHello?: (message: SDKContract.BridgeHello) => void;
};

/** Connect to the native bridge with the same cancellation signal used by the channel. */
export const createBridgeWebSocketConnect =
  (options: CreateBridgeWebSocketConnectOptions) =>
  (connect: SDKContract.SandboxChannelConnectOptions) =>
    runRequest(
      'HarnessUtils.connectBridgeWebSocket',
      { abortSignal: connect.abortSignal },
      (abortSignal) =>
        sdk.createBridgeWebSocketConnect(options)({ ...connect, abortSignal }),
    );

/** Wait for the native retry delay while allowing Effect interruption to cancel the wait. */
export const sleep = (options: Parameters<typeof sdk.sleep>[0]) =>
  runRequest('HarnessUtils.sleep', options, (abortSignal) =>
    sdk.sleep({ ...options, abortSignal }),
  );

/** Defer native submit and close calls while preserving message and closure arguments. */
const wrapSubmitter = (
  native: SDKContract.Experimental_BridgeUserMessageSubmitter,
) => ({
  submit: (
    ...args: Parameters<
      SDKContract.Experimental_BridgeUserMessageSubmitter['submit']
    >
  ) =>
    runRequest('HarnessUtils.bridgeUserMessage.submit', {}, () =>
      native.submit(...args),
    ),
  close: (
    ...args: Parameters<
      SDKContract.Experimental_BridgeUserMessageSubmitter['close']
    >
  ) =>
    runSync('HarnessUtils.bridgeUserMessage.close', () =>
      native.close(...args),
    ),
});

/** Submitter handle with an explicit early close operation owned by the acquisition scope. */
export type Experimental_BridgeUserMessageSubmitter = ReturnType<
  typeof wrapSubmitter
>;

/** Native transport hooks needed to send requests, observe responses, and handle reconnection. */
type BridgeSubmitterTransport = {
  readonly send: (
    message: SDKContract.Experimental_BridgeUserMessageRequest,
  ) => void;
  readonly onResponse: (
    listener: (
      response: SDKContract.Experimental_BridgeUserMessageResponse,
    ) => void,
  ) => () => void;
  readonly onReconnect: (listener: () => void) => () => void;
};

/** Allocate a bridge submitter and close it at scope exit, logging tagged release failures. */
export const experimental_createBridgeUserMessageSubmitter = (
  options: BridgeSubmitterTransport,
) =>
  Effect.acquireRelease(
    runSync('HarnessUtils.createBridgeUserMessageSubmitter', () =>
      wrapSubmitter(sdk.experimental_createBridgeUserMessageSubmitter(options)),
    ),
    (submitter) =>
      submitter
        .close()
        .pipe(
          Effect.catchTag('AiSdkError', (error) =>
            Effect.logWarning('Bridge submitter release failed', error),
          ),
        ),
  );

/** Shared type discriminator for selecting typed channel frames. */
type Frame = { readonly type: string };
/** Native channel contract pairing frames from the bridge with frames sent to it. */
type Channel<Out extends Frame, In extends Frame> = SDKContract.SandboxChannel<
  Out,
  In
>;

/** Channel options with an Effect connection callback, schema-based frame decoding, and scoped observers. */
export type SandboxChannelOptions<
  Out extends Frame,
  R = never,
  E = never,
> = Omit<
  SDKContract.SandboxChannelOptions<Out>,
  'connect' | 'outboundSchema' | 'onDebug' | 'onDiagnostic' | 'onBridgeError'
> & {
  readonly connect: (
    options: SDKContract.SandboxChannelConnectOptions,
  ) => Effect.Effect<
    Awaited<ReturnType<SDKContract.SandboxChannelOptions<Out>['connect']>>,
    E,
    R
  >;
  readonly outboundSchema: Schema.ConstraintDecoder<Out, R>;
  readonly onDebug?: (
    event: SDKContract.SandboxChannelDebugEvent,
  ) => Effect.Effect<void, E, R>;
  readonly onDiagnostic?: (
    event: Extract<Out, { type: 'sandbox-log' | 'debug-event' }>,
  ) => Effect.Effect<void, E, R>;
  readonly onBridgeError?: (
    event: Extract<Out, { type: 'error' }>,
  ) => Effect.Effect<void, E, R>;
};

/** Send settings control disconnected buffering and optional delivery notification. */
type ChannelSendOptions<E, R> = {
  readonly queueIfDisconnected?: boolean;
  readonly onSent?: () => Effect.Effect<void, E, R>;
};

/** A scoped, ordered channel to a harness bridge. */
export class SandboxChannel<Out extends Frame, In extends Frame = Frame> {
  /** Acquire a channel and bind connection, validation, and callbacks to the owning scope. */
  static make<
    Out extends Frame,
    In extends Frame = Frame,
    R = never,
    E = never,
  >(options: SandboxChannelOptions<Out, R, E>) {
    return Effect.gen(function* () {
      const owner = yield* openOperation<R>();
      const {
        connect,
        outboundSchema,
        onDebug,
        onDiagnostic,
        onBridgeError,
        ...rest
      } = options;
      const notify =
        <Event>(listener: (event: Event) => Effect.Effect<void, E, R>) =>
        (event: Event) => {
          void owner
            .runCallback(Effect.suspend(() => listener(event)))
            .catch(() => {});
        };
      const channel = yield* Effect.acquireRelease(
        runSync(
          'SandboxChannel.make',
          () =>
            new SandboxChannel<Out, In>(
              new sdk.SandboxChannel({
                ...rest,
                connect: (input) =>
                  owner.runCallback(
                    Effect.suspend(() => connect(input)),
                    input.abortSignal,
                  ),
                outboundSchema: toSdkSchema(outboundSchema, owner),
                ...(onDebug && { onDebug: notify(onDebug) }),
                ...(onDiagnostic && { onDiagnostic: notify(onDiagnostic) }),
                ...(onBridgeError && { onBridgeError: notify(onBridgeError) }),
              }),
            ),
        ),
        (channel) =>
          channel.close.pipe(
            Effect.catchTag('AiSdkError', (error) =>
              Effect.logWarning('Sandbox channel release failed', error),
            ),
          ),
      );
      return channel;
    });
  }

  /** Keep the native connection private so callers use the scoped channel lifecycle. */
  private constructor(private readonly native: Channel<Out, In>) {}

  /** Read the event cursor that the native channel tracks for reconnection. */
  get lastSeenEventId() {
    return runSync(
      'SandboxChannel.lastSeenEventId',
      () => this.native.lastSeenEventId,
    );
  }

  /** Open the native connection with the supplied channel options. */
  open(options?: Parameters<Channel<Out, In>['open']>[0]) {
    return runRequest('SandboxChannel.open', {}, () =>
      this.native.open(options),
    );
  }

  /** Mark listener attachment for the lifetime of the scope, then release the native attachment. */
  beginListenerAttachment() {
    return Effect.acquireRelease(
      runSync('SandboxChannel.beginListenerAttachment', () =>
        this.native.beginListenerAttachment(),
      ),
      (detach) =>
        runSync('SandboxChannel.endListenerAttachment', detach).pipe(
          Effect.catchTag('AiSdkError', (error) =>
            Effect.logWarning('Sandbox channel listener detach failed', error),
          ),
        ),
    ).pipe(Effect.asVoid);
  }

  /** Stream frames with the selected discriminator and detach the listener when collection stops. */
  on<T extends Out['type']>(type: T) {
    return Stream.unwrap(
      Effect.gen({ self: this }, function* () {
        const messages = yield* Queue.unbounded<Extract<Out, { type: T }>>();
        yield* Effect.acquireRelease(
          runSync('SandboxChannel.on', () =>
            this.native.on(type, (value) => {
              Queue.offerUnsafe(messages, value);
            }),
          ),
          (detach) =>
            runSync('SandboxChannel.off', detach).pipe(
              Effect.catchTag('AiSdkError', (error) =>
                Effect.logWarning(
                  'Sandbox channel listener detach failed',
                  error,
                ),
              ),
            ),
        );
        return Stream.fromQueue(messages);
      }),
    );
  }

  /** Listen for native closure codes and reasons through a synchronous callback. */
  onClose(handler: (code: number, reason: string) => void) {
    return runSync('SandboxChannel.onClose', () =>
      this.native.onClose(handler),
    );
  }

  /** Attach a reconnect listener for the current scope and detach it at scope exit. */
  onReconnect(handler: () => void) {
    return Effect.acquireRelease(
      runSync('SandboxChannel.onReconnect', () =>
        this.native.onReconnect(handler),
      ),
      (detach) =>
        runSync('SandboxChannel.offReconnect', detach).pipe(
          Effect.catchTag('AiSdkError', (error) =>
            Effect.logWarning('Sandbox channel listener detach failed', error),
          ),
        ),
    ).pipe(Effect.asVoid);
  }

  /** Send a frame with optional disconnection buffering and no Effect delivery callback. */
  send(
    message: In,
    options?: Omit<ChannelSendOptions<never, never>, 'onSent'>,
  ): Effect.Effect<void, AiSdkError>;
  /** Send a frame with a delivery callback owned by the current scope. */
  send<E, R>(
    message: In,
    options: ChannelSendOptions<E, R>,
  ): Effect.Effect<void, AiSdkError, R | Scope.Scope>;
  send<E, R>(
    message: In,
    options?: ChannelSendOptions<E, R>,
  ): Effect.Effect<void, AiSdkError, R | Scope.Scope> {
    const { onSent, ...rest } = options ?? {};
    if (!onSent)
      return runSync('SandboxChannel.send', () =>
        this.native.send(message, rest),
      );
    // The callback overload declares the services for this branch.
    // @effect-diagnostics-next-line effect/missingEffectContext:off
    return this.sendAcknowledged(message, rest, onSent);
  }

  /** Bind acknowledgment to a live Effect scope and run it only when the native sender reports delivery. */
  private sendAcknowledged<E, R>(
    message: In,
    options: Omit<ChannelSendOptions<E, R>, 'onSent'>,
    onSent: () => Effect.Effect<void, E, R>,
  ): Effect.Effect<void, AiSdkError, R | Scope.Scope> {
    return Effect.gen({ self: this }, function* () {
      const owner = yield* openOperation<R>();
      return yield* runSync('SandboxChannel.send', () =>
        this.native.send(message, {
          ...options,
          onSent: () => {
            void owner.runCallback(Effect.suspend(onSent)).catch(() => {});
          },
        }),
      );
    });
  }

  /** Begin native close without relinquishing the separately scoped cleanup action. */
  get beginClose() {
    return runSync('SandboxChannel.beginClose', () => this.native.beginClose());
  }

  /** Close the native channel through its tagged synchronous boundary. */
  get close() {
    return runSync('SandboxChannel.close', () => this.native.close());
  }

  /** Suspend the connection through the SDK's reconnectable lifecycle operation. */
  get suspend() {
    return runRequest('SandboxChannel.suspend', {}, () =>
      this.native.suspend(),
    );
  }

  /** Read whether the SDK has closed the channel. */
  get isClosed() {
    return runSync('SandboxChannel.isClosed', () => this.native.isClosed());
  }
}

/** Expose the wrapped process and captured output tail to readiness error callbacks. */
export type BridgeReadyErrorContext = Omit<
  SDKContract.BridgeReadyErrorContext,
  'proc'
> & {
  readonly proc: Process;
};

/** Supply a registered process and sandbox and optionally customize timeout and exit errors as Effects. */
export type WaitForBridgeReadyOptions<R = never, E = never> = Omit<
  SDKContract.WaitForBridgeReadyOptions,
  'proc' | 'sandbox' | 'createTimeoutError' | 'createExitError'
> & {
  readonly proc: Process;
  readonly sandbox: SandboxSession;
  readonly createTimeoutError?: (
    context: BridgeReadyErrorContext,
  ) => Effect.Effect<Error, E, R>;
  readonly createExitError?: (
    context: BridgeReadyErrorContext,
  ) => Effect.Effect<Error, E, R>;
};

/** Observe readiness through the native SDK and run error callbacks under the same cancellation signal. */
export const waitForBridgeReady = <R = never, E = never>(
  options: WaitForBridgeReadyOptions<R, E>,
) =>
  Effect.scoped(
    Effect.gen(function* () {
      const { proc, sandbox, createTimeoutError, createExitError, ...rest } =
        options;
      const nativeSandbox = unwrapSandbox(sandbox);
      const nativeProcess = unwrapProcess(proc);
      if (!nativeSandbox || !nativeProcess) {
        return yield* Effect.fail(
          sdkError(
            'HarnessUtils.waitForBridgeReady',
            'Invalid process or sandbox session',
          ),
        );
      }
      const owner = yield* openOperation<R>(options.abortSignal);
      return yield* runRequest(
        'HarnessUtils.waitForBridgeReady',
        { abortSignal: owner.signal },
        (abortSignal) =>
          sdk.waitForBridgeReady({
            ...rest,
            proc: nativeProcess,
            sandbox: nativeSandbox,
            abortSignal,
            ...(createTimeoutError && {
              createTimeoutError: ({ stdoutTail }) =>
                owner.runCallback(
                  createTimeoutError({ proc, stdoutTail }),
                  abortSignal,
                ),
            }),
            ...(createExitError && {
              createExitError: ({ stdoutTail }) =>
                owner.runCallback(
                  createExitError({ proc, stdoutTail }),
                  abortSignal,
                ),
            }),
          }),
      );
    }),
  );

/** Startup diagnostic settings with a wrapped process and an optional Effect for completed error output. */
type StartupErrorOptions = Omit<
  Parameters<typeof sdk.createBridgeStartupError>[0],
  'proc' | 'stderrDone'
> & {
  readonly proc: Process;
  readonly stderrDone?: Effect.Effect<void>;
};

/** Build a tagged startup error after the native helper inspects the registered process. */
export const createBridgeStartupError = (options: StartupErrorOptions) =>
  Effect.scoped(
    Effect.gen(function* () {
      const { proc, stderrDone, ...rest } = options;
      const nativeProcess = unwrapProcess(proc);
      if (!nativeProcess) {
        return yield* Effect.fail(
          sdkError('HarnessUtils.createBridgeStartupError', 'Invalid process'),
        );
      }
      const owner = yield* openOperation();
      const error = yield* runRequest(
        'HarnessUtils.createBridgeStartupError',
        { abortSignal: owner.signal },
        () =>
          sdk.createBridgeStartupError({
            ...rest,
            proc: nativeProcess,
            ...(stderrDone && { stderrDone: owner.runCallback(stderrDone) }),
          }),
      );
      return sdkError('HarnessUtils.createBridgeStartupError', error);
    }),
  );
