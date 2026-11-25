import * as sdk from '@ai-sdk/harness/agent';
import type { HarnessV1 as NativeHarness } from '../internal/harness-contracts/harness.js';
import type { GenerateTextResult, OutputInterface, ToolSet } from 'ai';
import { Effect, Ref } from 'effect';
import {
  bindCoreOptions,
  type CoreEvent,
  type CoreOptions,
} from '../../internal/core-settings.js';
import {
  type AiSdkError,
  openOperation,
  runRequest,
  runSync,
  sdkError,
} from '../../internal/operation.js';
import { bindOutput, type OutputSpecification } from '../../internal/output.js';
import { wrapTextStream } from '../../internal/text-stream.js';
import {
  bindTools,
  type EffectTools,
  type ToolServices,
} from '../../internal/tool.js';
import { agents } from '../internal/harness-agent.js';
import { unwrapHarness } from '../internal/harness.js';
import {
  type SandboxSession,
  type SandboxTemplate,
  unwrapSandbox,
  unwrapSandboxProvider,
  wrapSandbox,
} from '../internal/sandbox.js';
import { wrapTools } from '../internal/sdk-tool.js';
import { type EffectTelemetry, wrapTelemetry } from '../internal/telemetry.js';

export {
  HarnessCapabilityUnsupportedError,
  HarnessError,
  HarnessSandboxAuthenticationError,
} from '../harness.js';
export type {
  FileReporterOptions,
  HarnessAgentContinueTurnState,
  HarnessAgentPermissionMode,
  HarnessAgentResumeSessionState,
  HarnessAgentSkill,
  HarnessDiagnostic,
  TraceTreeReporterOptions,
} from '@ai-sdk/harness/agent';

type RuntimeContext = Record<string, unknown>;
type NativeOptions<A = unknown, P = A, I = unknown> = sdk.HarnessAgentSettings<
  NativeHarness,
  ToolSet,
  RuntimeContext,
  OutputInterface<A, P, I>
>;
type NativeAgent<A = unknown, P = A, I = unknown> = sdk.HarnessAgent<
  NativeHarness,
  ToolSet,
  RuntimeContext,
  OutputInterface<A, P, I>
>;
const constructorCallbacks = [
  'onStart',
  'onStepStart',
  'onLanguageModelCallStart',
  'onLanguageModelCallEnd',
  'onToolExecutionStart',
  'onToolExecutionEnd',
  'onStepEnd',
  'onEnd',
] as const;
type SettingsKeys =
  | 'id'
  | 'model'
  | 'skills'
  | 'instructions'
  | 'headers'
  | 'permissionMode'
  | 'debug'
  | 'toolApproval'
  | 'runtimeContext'
  | 'toolsContext'
  | 'stopWhen'
  | 'telemetry'
  | (typeof constructorCallbacks)[number];

type NativePrepareCall = NonNullable<NativeOptions['prepareCall']>;
type PrepareCall<T extends EffectTools, E, R> = (
  options: CoreEvent<Parameters<NativePrepareCall>[0], T>,
) => Effect.Effect<
  Omit<Awaited<ReturnType<NativePrepareCall>>, 'tools'> & {
    readonly tools?: T;
  },
  E,
  R
>;

export type HarnessAgentSettings<
  T extends EffectTools = {},
  E = never,
  R = never,
  A = unknown,
  P = A,
  I = unknown,
> = CoreOptions<Pick<NativeOptions<A, P, I>, SettingsKeys>, R, T> & {
  readonly harness: { readonly harnessId: string };
  readonly tools?: T;
  readonly output?: OutputSpecification<A, P, I, R>;
  readonly prepareCall?: PrepareCall<T, E, R>;
  readonly sandbox?: ReturnType<
    typeof import('../internal/sandbox.js').wrapSandboxProvider
  >;
  readonly sandboxConfig?: HarnessAgentSandboxConfig<E, R>;
  readonly onSandboxSession?: HarnessAgentSandboxConfig<E, R>['onSession'];
};

type NativeSession = sdk.HarnessAgentSession;
const sessions = new WeakMap<HarnessAgentSession, NativeSession>();
let wrapSession: (
  native: NativeSession,
  closed: Ref.Ref<boolean>,
) => HarnessAgentSession;
type NativeSessionOptions = NonNullable<
  Parameters<NativeAgent['createSession']>[0]
>;
type SessionOptions = Omit<NativeSessionOptions, 'sandboxSession'> & {
  readonly sandboxSession?: SandboxSession | HarnessAgentSandboxCreator;
};

/** An Effect handle for a running harness session. */
export class HarnessAgentSession {
  static {
    wrapSession = (native, closed) => {
      const session = new HarnessAgentSession(native, closed);
      sessions.set(session, native);
      return session;
    };
  }

  private constructor(
    private readonly native: NativeSession,
    private readonly closed: Ref.Ref<boolean>,
  ) {}

  get sessionId() {
    return this.native.sessionId;
  }
  get isResume() {
    return this.native.isResume;
  }
  get hasUnfinishedTurn() {
    return runSync('HarnessAgentSession.hasUnfinishedTurn', () =>
      this.native.hasUnfinishedTurn(),
    );
  }

  compact(instructions?: string) {
    return runRequest('HarnessAgentSession.compact', {}, () =>
      this.native.compact(instructions),
    );
  }

  experimental_steerTurn(text: string) {
    return runRequest('HarnessAgentSession.steerTurn', {}, () =>
      this.native.experimental_steerTurn(text),
    );
  }

  readHistory(options?: Parameters<NativeSession['readHistory']>[0]) {
    return runRequest('HarnessAgentSession.readHistory', {}, () =>
      this.native.readHistory(options),
    );
  }

  get suspendTurn() {
    return runRequest('HarnessAgentSession.suspendTurn', {}, () =>
      this.native.suspendTurn(),
    );
  }

  get detach() {
    return this.finish('HarnessAgentSession.detach', () =>
      this.native.detach(),
    );
  }

  get stop() {
    return this.finish('HarnessAgentSession.stop', () => this.native.stop());
  }

  get destroy() {
    return this.finish('HarnessAgentSession.destroy', () =>
      this.native.destroy(),
    );
  }

  private finish<A>(operation: string, invoke: () => Promise<A>) {
    return Effect.uninterruptible(
      Effect.gen({ self: this }, function* () {
        const closed = yield* Ref.getAndSet(this.closed, true);
        if (closed)
          return yield* Effect.fail(
            sdkError(operation, 'Harness session is closed'),
          );
        return yield* runRequest(operation, {}, invoke).pipe(
          Effect.tapError(() => Ref.set(this.closed, false)),
        );
      }),
    );
  }
}

type OmittedCallOptions =
  | 'session'
  | 'experimental_sandbox'
  | 'onStart'
  | 'experimental_onStart'
  | 'onStepStart'
  | 'experimental_onStepStart'
  | 'onToolExecutionStart'
  | 'experimental_onToolCallStart'
  | 'onToolExecutionEnd'
  | 'experimental_onToolCallFinish'
  | 'onStepEnd'
  | 'onStepFinish'
  | 'onEnd'
  | 'onFinish'
  | 'onAbort'
  | 'onError'
  | 'onChunk'
  | 'experimental_transform';
type WrappedCallOptions<O> = O extends unknown
  ? Omit<O, OmittedCallOptions> & {
      readonly session: HarnessAgentSession;
    }
  : never;
type GenerateOptions = WrappedCallOptions<
  Parameters<NativeAgent['generate']>[0]
>;
type StreamOptions = WrappedCallOptions<Parameters<NativeAgent['stream']>[0]>;
type ContinueOptions = Omit<
  Parameters<NativeAgent['continueStream']>[0],
  'session'
> & {
  readonly session: HarnessAgentSession;
};

const readResult = <
  T extends ToolSet,
  R extends Record<string, unknown>,
  O extends OutputInterface,
>(
  result: GenerateTextResult<T, R, O>,
) => ({
  content: result.content,
  text: result.text,
  reasoning: result.reasoning,
  reasoningText: result.reasoningText,
  files: result.files,
  sources: result.sources,
  toolCalls: result.toolCalls,
  staticToolCalls: result.staticToolCalls,
  dynamicToolCalls: result.dynamicToolCalls,
  toolResults: result.toolResults,
  staticToolResults: result.staticToolResults,
  dynamicToolResults: result.dynamicToolResults,
  finishReason: result.finishReason,
  rawFinishReason: result.rawFinishReason,
  usage: result.usage,
  totalUsage: result.totalUsage,
  warnings: result.warnings,
  steps: result.steps,
  request: result.request,
  response: result.response,
  providerMetadata: result.providerMetadata,
  output: runSync('HarnessAgent.output', () => result.output),
});

type CreateOptions = Parameters<typeof sdk.createHarnessSandboxTemplate>[0];
type TemplateOptions = Omit<CreateOptions, 'harnesses'> & {
  readonly harnesses: ReadonlyArray<{ readonly harnessId: string }>;
};
const unwrapHarnesses = (harnesses: TemplateOptions['harnesses']) =>
  Effect.forEach(harnesses, (harness) => {
    const native = unwrapHarness(harness);
    return native
      ? Effect.succeed(native)
      : Effect.fail(sdkError('HarnessAgent.harnesses', 'Invalid harness'));
  });

const wrapTemplate = (
  template: sdk.HarnessSandboxTemplate,
): SandboxTemplate<never, AiSdkError> => ({
  identity: template.identity,
  prepare: ({ session, abortSignal }) =>
    Effect.gen(function* () {
      const native = unwrapSandbox(session);
      if (!native)
        return yield* Effect.fail(
          sdkError('HarnessAgent.template', 'Invalid sandbox session'),
        );
      return yield* runRequest(
        'HarnessAgent.template',
        { ...(abortSignal && { abortSignal }) },
        (signal) => template.prepare({ session: native, abortSignal: signal }),
      );
    }),
});

export type HarnessSandboxTemplate = ReturnType<typeof wrapTemplate>;

export const createHarnessSandboxTemplate = (options: TemplateOptions) =>
  Effect.gen(function* () {
    const harnesses = yield* unwrapHarnesses(options.harnesses);
    const template = yield* runRequest(
      'HarnessAgent.createHarnessSandboxTemplate',
      {},
      () => sdk.createHarnessSandboxTemplate({ ...options, harnesses }),
    );
    return template && wrapTemplate(template);
  });

type PrewarmOptions = Omit<
  Parameters<typeof sdk.prepareHarnessSandboxTemplate>[0],
  'harness' | 'sandboxProvider'
> & {
  readonly harness: { readonly harnessId: string };
  readonly sandboxProvider: ReturnType<
    typeof import('../internal/sandbox.js').wrapSandboxProvider
  >;
};

export const prepareHarnessSandboxTemplate = (options: PrewarmOptions) =>
  Effect.gen(function* () {
    const harness = unwrapHarness(options.harness);
    const sandboxProvider = unwrapSandboxProvider(options.sandboxProvider);
    if (!harness || !sandboxProvider) {
      return yield* Effect.fail(
        sdkError('HarnessAgent.prewarm', 'Invalid harness or sandbox provider'),
      );
    }
    return yield* runRequest('HarnessAgent.prewarm', options, (abortSignal) =>
      sdk.prepareHarnessSandboxTemplate({
        ...options,
        harness,
        sandboxProvider,
        abortSignal,
      }),
    );
  });

export const prewarmHarness = prepareHarnessSandboxTemplate;

type PrepareOptions = Omit<
  Parameters<typeof sdk.prepareSandboxForHarness>[0],
  'session' | 'harnesses'
> & {
  readonly session: SandboxSession;
  readonly harnesses: TemplateOptions['harnesses'];
};

export const prepareSandboxForHarness = (options: PrepareOptions) =>
  Effect.gen(function* () {
    const session = unwrapSandbox(options.session);
    if (!session)
      return yield* Effect.fail(
        sdkError('HarnessAgent.prepareSandbox', 'Invalid sandbox session'),
      );
    const harnesses = yield* unwrapHarnesses(options.harnesses);
    return yield* runRequest(
      'HarnessAgent.prepareSandbox',
      options,
      (abortSignal) =>
        sdk.prepareSandboxForHarness({
          ...options,
          session,
          harnesses,
          abortSignal,
        }),
    );
  });

/** A harness agent whose native sessions and streaming results stay private. */
export class HarnessAgent<A = unknown, P = A, I = unknown> {
  static make<
    T extends EffectTools = {},
    E = never,
    R = never,
    A = unknown,
    P = A,
    I = unknown,
  >(settings: HarnessAgentSettings<T, E, R, A, P, I>) {
    return Effect.gen(function* () {
      const {
        harness,
        tools,
        output,
        sandbox,
        sandboxConfig,
        onSandboxSession,
        ...options
      } = settings;
      const nativeHarness = unwrapHarness(harness);
      const nativeSandbox = sandbox && unwrapSandboxProvider(sandbox);
      if (!nativeHarness || (sandbox && !nativeSandbox)) {
        return yield* Effect.fail(
          sdkError('HarnessAgent.make', 'Invalid harness or sandbox provider'),
        );
      }
      const owner = yield* openOperation<R | ToolServices<T>>();
      const callbacks = bindCoreOptions<
        Pick<NativeOptions<A, P, I>, SettingsKeys | 'prepareCall'>,
        R
      >(options, owner, tools, ({ tools: preparedTools, ...next }) => ({
        ...next,
        ...(preparedTools && { tools: bindTools(preparedTools as T, owner) }),
      }));
      return yield* runSync('HarnessAgent.make', () => {
        const nativeOutput = output && bindOutput(output, owner);
        const native = new sdk.HarnessAgent<
          NativeHarness,
          ToolSet,
          RuntimeContext,
          OutputInterface<A, P, I>
        >({
          ...callbacks,
          harness: nativeHarness,
          ...(tools && { tools: bindTools(tools, owner) }),
          ...(nativeOutput && { output: nativeOutput }),
          ...(nativeSandbox && { sandbox: nativeSandbox }),
          ...(sandboxConfig && {
            sandboxConfig: bindSandboxConfig(sandboxConfig, owner),
          }),
          ...(onSandboxSession && {
            onSandboxSession: ({ session, ...input }) =>
              owner.runCallback(
                onSandboxSession({ ...input, session: wrapSandbox(session) }),
                input.abortSignal,
              ),
          }),
        });
        const agent = new HarnessAgent(native);
        agents.set(agent, native);
        return agent;
      });
    });
  }

  private constructor(private readonly native: NativeAgent<A, P, I>) {}

  get version() {
    return this.native.version;
  }
  get id() {
    return this.native.id;
  }
  get harnessId() {
    return this.native.harnessId;
  }
  get hasOutput() {
    return this.native.hasOutput;
  }
  get tools() {
    return wrapTools('HarnessAgent.tools', this.native.tools);
  }

  getSandboxTemplate() {
    return runRequest('HarnessAgent.getSandboxTemplate', {}, () =>
      this.native.getSandboxTemplate(),
    ).pipe(Effect.map((template) => template && wrapTemplate(template)));
  }

  createSession(options: SessionOptions = {}) {
    return Effect.gen({ self: this }, function* () {
      const { sandboxSession, ...rest } = options;
      const owner = yield* openOperation(options.abortSignal);
      const sandbox =
        sandboxSession && 'createSandboxSession' in sandboxSession
          ? {
              defaultWorkingDirectory: sandboxSession.defaultWorkingDirectory,
              createSandboxSession: (input: { abortSignal?: AbortSignal }) =>
                owner.runCallback(
                  Effect.flatMap(
                    sandboxSession.createSandboxSession(input),
                    (session) => {
                      const native = unwrapSandbox(session);
                      return native
                        ? Effect.succeed(native)
                        : Effect.fail(
                            sdkError(
                              'HarnessAgent.createSession',
                              'Invalid sandbox session',
                            ),
                          );
                    },
                  ),
                  input.abortSignal,
                ),
            }
          : sandboxSession && unwrapSandbox(sandboxSession);
      if (sandboxSession && !sandbox) {
        return yield* Effect.fail(
          sdkError('HarnessAgent.createSession', 'Invalid sandbox session'),
        );
      }
      const closed = yield* Ref.make(false);
      const native = yield* Effect.acquireRelease(
        runRequest('HarnessAgent.createSession', options, (abortSignal) =>
          this.native.createSession({
            ...rest,
            abortSignal,
            ...(sandbox && { sandboxSession: sandbox }),
          }),
        ),
        (session) =>
          Effect.gen(function* () {
            const wasClosed = yield* Ref.getAndSet(closed, true);
            if (!wasClosed) {
              yield* runRequest('HarnessAgent.release', {}, () =>
                session.destroy(),
              ).pipe(
                Effect.catchTag('AiSdkError', (error) =>
                  Effect.logWarning(
                    'Harness agent session release failed',
                    error,
                  ),
                ),
              );
            }
          }),
        { interruptible: true },
      );
      return wrapSession(native, closed);
    });
  }

  generate(options: GenerateOptions) {
    const op = 'HarnessAgent.generate';
    const { session, ...rest } = options;
    const native = sessions.get(session);
    if (!native) return Effect.fail(sdkError(op, 'Invalid harness session'));
    return runRequest(op, options, (abortSignal) =>
      this.native.generate({
        ...rest,
        abortSignal,
        session: native,
      }),
    ).pipe(Effect.flatMap((result) => runSync(op, () => readResult(result))));
  }

  stream(options: StreamOptions) {
    const op = 'HarnessAgent.stream';
    const owner = this;
    const { session, ...rest } = options;
    return Effect.gen(function* () {
      const native = sessions.get(session);
      if (!native)
        return yield* Effect.fail(sdkError(op, 'Invalid harness session'));
      const operation = yield* openOperation(options.abortSignal);
      const result = yield* runRequest(
        op,
        { abortSignal: operation.signal },
        (abortSignal) =>
          owner.native.stream({
            ...rest,
            abortSignal,
            session: native,
          }),
      );
      return wrapTextStream(op, result);
    });
  }

  continueGenerate(options: ContinueOptions) {
    return this.continue('HarnessAgent.continueGenerate', options, (input) =>
      this.native.continueGenerate(input),
    ).pipe(
      Effect.flatMap((result) =>
        runSync('HarnessAgent.continueGenerate', () => readResult(result)),
      ),
    );
  }

  continueStream(options: ContinueOptions) {
    return Effect.gen({ self: this }, function* () {
      const operation = yield* openOperation(options.abortSignal);
      const result = yield* this.continue(
        'HarnessAgent.continueStream',
        { ...options, abortSignal: operation.signal },
        (input) => this.native.continueStream(input),
      );
      return wrapTextStream('HarnessAgent.continueStream', result);
    });
  }

  experimental_steer(options: { session: HarnessAgentSession; text: string }) {
    return Effect.suspend(() => {
      const session = sessions.get(options.session);
      return session
        ? runRequest('HarnessAgent.steer', {}, () =>
            this.native.experimental_steer({ ...options, session }),
          )
        : Effect.fail(
            sdkError('HarnessAgent.steer', 'Invalid harness session'),
          );
    });
  }

  private continue<A>(
    operation: string,
    options: ContinueOptions,
    invoke: (
      options: Parameters<NativeAgent['continueStream']>[0],
    ) => Promise<A>,
  ) {
    return Effect.suspend(() => {
      const { session, ...rest } = options;
      const native = sessions.get(session);
      return native
        ? runRequest(operation, options, (abortSignal) =>
            invoke({ ...rest, session: native, abortSignal }),
          )
        : Effect.fail(sdkError(operation, 'Invalid harness session'));
    });
  }
}

export const collectHarnessAgentToolApprovalContinuations = (
  ...args: Parameters<typeof sdk.collectHarnessAgentToolApprovalContinuations>
) =>
  runSync('HarnessAgent.collectToolApprovalContinuations', () =>
    sdk.collectHarnessAgentToolApprovalContinuations(...args),
  );

export const collectHarnessAgentToolResultContinuations = (
  ...args: Parameters<typeof sdk.collectHarnessAgentToolResultContinuations>
) =>
  runSync('HarnessAgent.collectToolResultContinuations', () =>
    sdk.collectHarnessAgentToolResultContinuations(...args),
  );

export const createFileReporter = (
  ...args: Parameters<typeof sdk.createFileReporter>
): Effect.Effect<FileReporter, AiSdkError> =>
  runSync('HarnessAgent.createFileReporter', () => {
    const native = sdk.createFileReporter(...args);
    return {
      ...wrapTelemetry('HarnessAgent.FileReporter', native),
      ingestDiagnostic: (event: sdk.HarnessDiagnostic) =>
        runSync('HarnessAgent.FileReporter.ingestDiagnostic', () =>
          native.ingestDiagnostic?.(event),
        ),
    };
  });

export type FileReporter = EffectTelemetry & HarnessDiagnosticConsumer;

export const createTraceTreeReporter = (
  ...args: Parameters<typeof sdk.createTraceTreeReporter>
) =>
  runSync('HarnessAgent.createTraceTreeReporter', () =>
    wrapTelemetry(
      'HarnessAgent.TraceTreeReporter',
      sdk.createTraceTreeReporter(...args),
    ),
  );

export const getHarnessErrorMessage = (
  ...args: Parameters<typeof sdk.getHarnessErrorMessage>
) =>
  runSync('HarnessAgent.getErrorMessage', () =>
    sdk.getHarnessErrorMessage(...args),
  );

export type {
  HarnessAgentBuiltinToolName,
  HarnessAgentBuiltinToolUseKind,
  HarnessAgentLifecycleState,
  HarnessAgentPendingToolApproval,
  HarnessAgentPendingToolResult,
  HarnessAgentPrompt,
  HarnessAgentStreamPart,
  HarnessAgentToolSpec,
  HarnessDebugConfig,
  HarnessDebugLevel,
  PrepareSandboxForHarnessResult,
} from '@ai-sdk/harness/agent';

export type {
  HarnessV1 as HarnessAgentAdapter,
  HarnessV1BuiltinTool as HarnessAgentBuiltinTool,
} from '../harness.js';

export type {
  HarnessV1Session as HarnessAgentAdapterSession,
  HarnessV1ContinueTurnOptions as HarnessAgentContinueTurnOptions,
  HarnessV1PromptControl as HarnessAgentPromptControl,
  HarnessV1PromptTurnOptions as HarnessAgentPromptTurnOptions,
  HarnessV1StartOptions as HarnessAgentStartOptions,
} from '../internal/harness.js';

export type { HarnessAgentToolApprovalConfiguration } from '@ai-sdk/harness/agent';

type NativeSandboxConfig = sdk.HarnessAgentSandboxConfig;
type SandboxBootstrapInput = Omit<
  Parameters<NonNullable<NativeSandboxConfig['onBootstrap']>>[0],
  'session'
> & { readonly session: SandboxSession };
type SandboxSessionInput = Omit<
  Parameters<NonNullable<NativeSandboxConfig['onSession']>>[0],
  'session'
> & { readonly session: SandboxSession };

export type HarnessAgentSandboxConfig<E = never, R = never> = Omit<
  NativeSandboxConfig,
  'onBootstrap' | 'onSession'
> & {
  readonly onBootstrap?: (
    options: SandboxBootstrapInput,
  ) => Effect.Effect<void, E, R>;
  readonly onSession?: (
    options: SandboxSessionInput,
  ) => Effect.Effect<void, E, R>;
};

const bindSandboxConfig = <E, R>(
  input: HarnessAgentSandboxConfig<E, R>,
  owner: Effect.Success<ReturnType<typeof openOperation<R>>>,
): NativeSandboxConfig => {
  const { onBootstrap, onSession, ...rest } = input;
  return {
    ...rest,
    ...(onBootstrap && {
      onBootstrap: ({
        session,
        ...options
      }: Parameters<NonNullable<NativeSandboxConfig['onBootstrap']>>[0]) =>
        owner.runCallback(
          onBootstrap({ ...options, session: wrapSandbox(session) }),
          options.abortSignal,
        ),
    }),
    ...(onSession && {
      onSession: ({
        session,
        ...options
      }: Parameters<NonNullable<NativeSandboxConfig['onSession']>>[0]) =>
        owner.runCallback(
          onSession({ ...options, session: wrapSandbox(session) }),
          options.abortSignal,
        ),
    }),
  };
};

export interface HarnessAgentSandboxCreator {
  readonly defaultWorkingDirectory: string;
  readonly createSandboxSession: (options: {
    readonly abortSignal?: AbortSignal;
  }) => Effect.Effect<SandboxSession, AiSdkError>;
}

export type HarnessAgentBuiltinTools = ReturnType<typeof wrapTools>;

export type HarnessAllTools<
  Harness extends { readonly builtinTools: Record<string, object> },
  Tools extends EffectTools,
> = Omit<Harness['builtinTools'], keyof Tools> & Tools;

export interface HarnessDiagnosticConsumer {
  readonly ingestDiagnostic?: (
    diagnostic: sdk.HarnessDiagnostic,
  ) => Effect.Effect<void, AiSdkError>;
}
