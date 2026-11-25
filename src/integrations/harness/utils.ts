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
import { Effect, Queue, type Schema, Stream } from 'effect';
import { wrapSchema } from '../internal/schema.js';
import { type HarnessV1CredentialForwarding } from '../internal/harness.js';
import {
  type Process,
  type SandboxSession,
  unwrapProcess,
  unwrapSandbox,
  wrapSandbox,
} from '../internal/sandbox.js';

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

export const BRIDGE_AUTH_PUBLIC_KEY_ENV = sdk.BRIDGE_AUTH_PUBLIC_KEY_ENV;
export const harnessPromptContentSchema = wrapSchema(
  'HarnessUtils.promptContent',
  sdk.harnessPromptContentSchema,
);

export const convertHarnessToolModelOutput = (
  ...args: Parameters<typeof sdk.convertHarnessToolModelOutput>
) =>
  runSync('HarnessUtils.convertHarnessToolModelOutput', () =>
    sdk.convertHarnessToolModelOutput(...args),
  );

export const createBridgeAuthKeyPair = (
  ...args: Parameters<typeof sdk.createBridgeAuthKeyPair>
) =>
  runSync('HarnessUtils.createBridgeAuthKeyPair', () =>
    sdk.createBridgeAuthKeyPair(...args),
  );

export const encodeHarnessPathSegment = (
  ...args: Parameters<typeof sdk.encodeHarnessPathSegment>
) =>
  runSync('HarnessUtils.encodeHarnessPathSegment', () =>
    sdk.encodeHarnessPathSegment(...args),
  );

export const extractHarnessPromptContent = (
  ...args: Parameters<typeof sdk.extractHarnessPromptContent>
) =>
  runSync('HarnessUtils.extractHarnessPromptContent', () =>
    sdk.extractHarnessPromptContent(...args),
  );

export const formatBridgeError = (
  ...args: Parameters<typeof sdk.formatBridgeError>
) =>
  runSync('HarnessUtils.formatBridgeError', () =>
    sdk.formatBridgeError(...args),
  );

export const generateSandboxCredentialPlaceholder = (
  ...args: Parameters<typeof sdk.generateSandboxCredentialPlaceholder>
) =>
  runSync('HarnessUtils.generateSandboxCredentialPlaceholder', () =>
    sdk.generateSandboxCredentialPlaceholder(...args),
  );

export const getAiGatewayAuthFromEnv = (
  ...args: Parameters<typeof sdk.getAiGatewayAuthFromEnv>
) =>
  runSync('HarnessUtils.getAiGatewayAuthFromEnv', () =>
    sdk.getAiGatewayAuthFromEnv(...args),
  );

export const isAccessTokenExpiringSoon = (
  ...args: Parameters<typeof sdk.isAccessTokenExpiringSoon>
) =>
  runSync('HarnessUtils.isAccessTokenExpiringSoon', () =>
    sdk.isAccessTokenExpiringSoon(...args),
  );

export const isHarnessAuthenticationEnvironment = (
  ...args: Parameters<typeof sdk.isHarnessAuthenticationEnvironment>
) =>
  runSync('HarnessUtils.isHarnessAuthenticationEnvironment', () =>
    sdk.isHarnessAuthenticationEnvironment(...args),
  );

export const isLinux = (...args: Parameters<typeof sdk.isLinux>) =>
  runSync('HarnessUtils.isLinux', () => sdk.isLinux(...args));

export const isMacOS = (...args: Parameters<typeof sdk.isMacOS>) =>
  runSync('HarnessUtils.isMacOS', () => sdk.isMacOS(...args));

export const isSandboxCredentialPlaceholder = (
  ...args: Parameters<typeof sdk.isSandboxCredentialPlaceholder>
) =>
  runSync('HarnessUtils.isSandboxCredentialPlaceholder', () =>
    sdk.isSandboxCredentialPlaceholder(...args),
  );

export const isWindows = (...args: Parameters<typeof sdk.isWindows>) =>
  runSync('HarnessUtils.isWindows', () => sdk.isWindows(...args));

export const logBridgeError = (
  ...args: Parameters<typeof sdk.logBridgeError>
) => runSync('HarnessUtils.logBridgeError', () => sdk.logBridgeError(...args));

export const maskSandboxCredentials = (
  ...args: Parameters<typeof sdk.maskSandboxCredentials>
) =>
  runSync('HarnessUtils.maskSandboxCredentials', () =>
    sdk.maskSandboxCredentials(...args),
  );

export const normalizeHarnessToolModelOutput = (
  ...args: Parameters<typeof sdk.normalizeHarnessToolModelOutput>
) =>
  runSync('HarnessUtils.normalizeHarnessToolModelOutput', () =>
    sdk.normalizeHarnessToolModelOutput(...args),
  );

export const shellQuote = (...args: Parameters<typeof sdk.shellQuote>) =>
  runSync('HarnessUtils.shellQuote', () => sdk.shellQuote(...args));

export const shouldResolveNativeSubscription = (
  ...args: Parameters<typeof sdk.shouldResolveNativeSubscription>
) =>
  runSync('HarnessUtils.shouldResolveNativeSubscription', () =>
    sdk.shouldResolveNativeSubscription(...args),
  );

export const warnCredentialBrokeringUnavailable = (
  ...args: Parameters<typeof sdk.warnCredentialBrokeringUnavailable>
) =>
  runSync('HarnessUtils.warnCredentialBrokeringUnavailable', () =>
    sdk.warnCredentialBrokeringUnavailable(...args),
  );

export const warnMintBridgeTokenIgnored = (
  ...args: Parameters<typeof sdk.warnMintBridgeTokenIgnored>
) =>
  runSync('HarnessUtils.warnMintBridgeTokenIgnored', () =>
    sdk.warnMintBridgeTokenIgnored(...args),
  );

export const classifyDiskLog = (
  ...args: Parameters<typeof sdk.classifyDiskLog>
) =>
  runRequest('HarnessUtils.classifyDiskLog', {}, () =>
    sdk.classifyDiskLog(...args),
  );

export const drainBridgeProcessStream = (
  ...args: Parameters<typeof sdk.drainBridgeProcessStream>
) =>
  runRequest('HarnessUtils.drainBridgeProcessStream', {}, () =>
    sdk.drainBridgeProcessStream(...args),
  );

export const forwardBridgeProcessStream = (
  ...args: Parameters<typeof sdk.forwardBridgeProcessStream>
) =>
  runRequest('HarnessUtils.forwardBridgeProcessStream', {}, () =>
    sdk.forwardBridgeProcessStream(...args),
  );

export const getJwtExpiresAt = (
  ...args: Parameters<typeof sdk.getJwtExpiresAt>
) =>
  runRequest('HarnessUtils.getJwtExpiresAt', {}, () =>
    sdk.getJwtExpiresAt(...args),
  );

export const parseJwtPayload = (
  ...args: Parameters<typeof sdk.parseJwtPayload>
) =>
  runRequest('HarnessUtils.parseJwtPayload', {}, () =>
    sdk.parseJwtPayload(...args),
  );

export const readLinuxSecretServicePassword = (
  ...args: Parameters<typeof sdk.readLinuxSecretServicePassword>
) =>
  runRequest('HarnessUtils.readLinuxSecretServicePassword', {}, () =>
    sdk.readLinuxSecretServicePassword(...args),
  );

export const readMacOSKeychainPassword = (
  ...args: Parameters<typeof sdk.readMacOSKeychainPassword>
) =>
  runRequest('HarnessUtils.readMacOSKeychainPassword', {}, () =>
    sdk.readMacOSKeychainPassword(...args),
  );

export const readWindowsCredentialManagerPassword = (
  ...args: Parameters<typeof sdk.readWindowsCredentialManagerPassword>
) =>
  runRequest('HarnessUtils.readWindowsCredentialManagerPassword', {}, () =>
    sdk.readWindowsCredentialManagerPassword(...args),
  );

export const refreshOAuthAccessToken = (
  ...args: Parameters<typeof sdk.refreshOAuthAccessToken>
) =>
  runRequest('HarnessUtils.refreshOAuthAccessToken', {}, () =>
    sdk.refreshOAuthAccessToken(...args),
  );

type NativeSandbox = NonNullable<ReturnType<typeof unwrapSandbox>>;
type Sandboxed<O, K extends keyof O> = Omit<O, K> & {
  readonly [P in K]: SandboxSession;
};

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

export type WriteInstructionsOptions = Sandboxed<
  SDKContract.WriteInstructionsOptions,
  'sandbox'
>;
export type WriteSkillsOptions = Sandboxed<
  SDKContract.WriteSkillsOptions,
  'sandbox'
>;

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

export const markBridgeStarting = (
  options: Sandboxed<Parameters<typeof sdk.markBridgeStarting>[0], 'sandbox'>,
) =>
  withSandbox('HarnessUtils.markBridgeStarting', options.sandbox, (sandbox) =>
    runRequest('HarnessUtils.markBridgeStarting', options, (abortSignal) =>
      sdk.markBridgeStarting({ ...options, sandbox, abortSignal }),
    ),
  );

export const stopPreviousBridge = (
  options: Sandboxed<Parameters<typeof sdk.stopPreviousBridge>[0], 'sandbox'>,
) =>
  withSandbox('HarnessUtils.stopPreviousBridge', options.sandbox, (sandbox) =>
    runRequest('HarnessUtils.stopPreviousBridge', options, (abortSignal) =>
      sdk.stopPreviousBridge({ ...options, sandbox, abortSignal }),
    ),
  );

export const writeInstructions = (
  options: Sandboxed<Parameters<typeof sdk.writeInstructions>[0], 'sandbox'>,
) =>
  withSandbox('HarnessUtils.writeInstructions', options.sandbox, (sandbox) =>
    runRequest('HarnessUtils.writeInstructions', options, (abortSignal) =>
      sdk.writeInstructions({ ...options, sandbox, abortSignal }),
    ),
  );

export const writeSkills = (
  options: Sandboxed<Parameters<typeof sdk.writeSkills>[0], 'sandbox'>,
) =>
  withSandbox('HarnessUtils.writeSkills', options.sandbox, (sandbox) =>
    runRequest('HarnessUtils.writeSkills', options, (abortSignal) =>
      sdk.writeSkills({ ...options, sandbox, abortSignal }),
    ),
  );

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

export const getRestrictedSandboxSession = (input: SandboxSession) =>
  withSandbox('HarnessUtils.getRestrictedSandboxSession', input, (sandbox) =>
    runSync('HarnessUtils.getRestrictedSandboxSession', () =>
      wrapSandbox(sdk.getRestrictedSandboxSession(sandbox)),
    ),
  );

export const createCredentialRequestTransformation = (
  ...args: Parameters<typeof sdk.createCredentialRequestTransformation>
) =>
  runSync('HarnessUtils.createCredentialRequestTransformation', () =>
    sdk.createCredentialRequestTransformation(...args),
  );

type WithCredentialCallback<Options, R, E> = Omit<
  Options,
  'credentialForwarding'
> & {
  readonly credentialForwarding?: HarnessV1CredentialForwarding<R, E>;
};

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

export const createReadBridgeAsset =
  <const Urls extends Record<string, URL>>(urls: Urls) =>
  (name: Extract<keyof Urls, string>) =>
    runRequest('HarnessUtils.readBridgeAsset', {}, () =>
      sdk.createReadBridgeAsset(urls)(name),
    );

export const createBridgeErrorHandler =
  (...args: Parameters<typeof sdk.createBridgeErrorHandler>) =>
  (event: Parameters<ReturnType<typeof sdk.createBridgeErrorHandler>>[0]) =>
    runSync('HarnessUtils.bridgeErrorHandler', () =>
      sdk.createBridgeErrorHandler(...args)(event),
    );

export type CreateBridgeWebSocketConnectOptions = Omit<
  SDKContract.CreateBridgeWebSocketConnectOptions,
  'onHello'
> & {
  readonly onHello?: (message: SDKContract.BridgeHello) => void;
};

export const createBridgeWebSocketConnect =
  (options: CreateBridgeWebSocketConnectOptions) =>
  (connect: SDKContract.SandboxChannelConnectOptions) =>
    runRequest(
      'HarnessUtils.connectBridgeWebSocket',
      { abortSignal: connect.abortSignal },
      (abortSignal) =>
        sdk.createBridgeWebSocketConnect(options)({ ...connect, abortSignal }),
    );

export const sleep = (options: Parameters<typeof sdk.sleep>[0]) =>
  runRequest('HarnessUtils.sleep', options, (abortSignal) =>
    sdk.sleep({ ...options, abortSignal }),
  );

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

export type Experimental_BridgeUserMessageSubmitter = ReturnType<
  typeof wrapSubmitter
>;

export const experimental_createBridgeUserMessageSubmitter = (
  options: Parameters<
    typeof sdk.experimental_createBridgeUserMessageSubmitter
  >[0],
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

type Frame = { readonly type: string };
type Channel<Out extends Frame, In extends Frame> = SDKContract.SandboxChannel<
  Out,
  In
>;

export type SandboxChannelOptions<
  Out extends Frame,
  R = never,
  E = never,
> = Omit<
  SDKContract.SandboxChannelOptions<Out>,
  'connect' | 'outboundSchema'
> & {
  readonly connect: (
    options: SDKContract.SandboxChannelConnectOptions,
  ) => Effect.Effect<
    Awaited<ReturnType<SDKContract.SandboxChannelOptions<Out>['connect']>>,
    E,
    R
  >;
  readonly outboundSchema: Schema.ConstraintDecoder<Out, R>;
};

/** A scoped, ordered channel to a harness bridge. */
export class SandboxChannel<Out extends Frame, In extends Frame = Frame> {
  static make<
    Out extends Frame,
    In extends Frame = Frame,
    R = never,
    E = never,
  >(options: SandboxChannelOptions<Out, R, E>) {
    return Effect.gen(function* () {
      const owner = yield* openOperation<R>();
      const { connect, outboundSchema, ...rest } = options;
      const channel = yield* Effect.acquireRelease(
        runSync(
          'SandboxChannel.make',
          () =>
            new SandboxChannel<Out, In>(
              new sdk.SandboxChannel({
                ...rest,
                connect: (input) =>
                  owner.runCallback(connect(input), input.abortSignal),
                outboundSchema: toSdkSchema(outboundSchema, owner),
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

  private constructor(private readonly native: Channel<Out, In>) {}

  get lastSeenEventId() {
    return runSync(
      'SandboxChannel.lastSeenEventId',
      () => this.native.lastSeenEventId,
    );
  }

  open(options?: Parameters<Channel<Out, In>['open']>[0]) {
    return runRequest('SandboxChannel.open', {}, () =>
      this.native.open(options),
    );
  }

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

  onClose(handler: (code: number, reason: string) => void) {
    return runSync('SandboxChannel.onClose', () =>
      this.native.onClose(handler),
    );
  }

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

  send(...args: Parameters<Channel<Out, In>['send']>) {
    return runSync('SandboxChannel.send', () => this.native.send(...args));
  }

  get beginClose() {
    return runSync('SandboxChannel.beginClose', () => this.native.beginClose());
  }

  get close() {
    return runSync('SandboxChannel.close', () => this.native.close());
  }

  get suspend() {
    return runRequest('SandboxChannel.suspend', {}, () =>
      this.native.suspend(),
    );
  }

  get isClosed() {
    return runSync('SandboxChannel.isClosed', () => this.native.isClosed());
  }
}

export type BridgeReadyErrorContext = Omit<
  SDKContract.BridgeReadyErrorContext,
  'proc'
> & {
  readonly proc: Process;
};

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

type StartupErrorOptions = Omit<
  Parameters<typeof sdk.createBridgeStartupError>[0],
  'proc' | 'stderrDone'
> & {
  readonly proc: Process;
  readonly stderrDone?: Effect.Effect<void>;
};

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
