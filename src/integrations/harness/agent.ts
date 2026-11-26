import * as sdk from '@ai-sdk/harness/agent';
import type { HarnessV1 as NativeHarness } from '../internal/harness-contracts/harness.js';
import type { GenerateTextResult, OutputInterface, ToolSet } from 'ai';
import { Effect, Fiber, Option, Ref } from 'effect';
import type { Scope } from 'effect/Scope';
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
import {
  type TextStreamResult,
  wrapTextStream,
} from '../../internal/text-stream.js';
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
import {
  type EffectTelemetry,
  unwrapTelemetryEvent,
  wrapTelemetry,
} from '../internal/telemetry.js';

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
} from '@ai-sdk/harness/agent';

/** Application data passed through native harness turns and tool calls. */
type RuntimeContext = Record<string, unknown>;
/** Native agent settings specialized to the wrapper's full, partial, and input output-schema types. */
type NativeOptions<A = unknown, P = A, I = unknown> = sdk.HarnessAgentSettings<
  NativeHarness,
  ToolSet,
  RuntimeContext,
  OutputInterface<A, P, I>
>;
/** Native agent shape retained behind the wrapper and its identity registry. */
type NativeAgent<A = unknown, P = A, I = unknown> = sdk.HarnessAgent<
  NativeHarness,
  ToolSet,
  RuntimeContext,
  OutputInterface<A, P, I>
>;
/** Lifecycle hooks that require binding to the constructor's captured Effect context. */
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
/** SDK constructor settings forwarded without replacing the harness, sandbox, tools, or output handles. */
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

/** Required SDK preparation callback signature extracted without optionality. */
type NativePrepareCall = NonNullable<NativeOptions['prepareCall']>;
/** Prepare overrides with Effect tools and the captured callback environment before the native call starts. */
type PrepareCall<T extends EffectTools, E, R> = (
  options: CoreEvent<Parameters<NativePrepareCall>[0], T>,
) => Effect.Effect<
  Omit<Awaited<ReturnType<NativePrepareCall>>, 'tools'> & {
    readonly tools?: T;
  },
  E,
  R
>;

/** Construct an agent from a registered harness, with optional Effect tool, output, and sandbox configuration. */
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

/** SDK session type shared by wrapper acquisition and turn invocation. */
type NativeSession = sdk.HarnessAgentSession;
/** Type-only declaration used to specialize the SDK's generic turn methods. */
declare const sessionType: NativeSession;
/** Native initial-turn method preserving the agent's structured-output types. */
type NativePromptTurn<A, P, I> = typeof sessionType.promptTurn<
  ToolSet,
  RuntimeContext,
  OutputInterface<A, P, I>
>;
/** Native continuation method preserving the same types as the initial turn. */
type NativeContinueTurn<A, P, I> = typeof sessionType.continueTurn<
  ToolSet,
  RuntimeContext,
  OutputInterface<A, P, I>
>;
/** Options shared by the bound native entry points for opening and continuing a turn. */
type NativeTurnOptions<A, P, I> =
  | Parameters<NativePromptTurn<A, P, I>>[0]
  | Parameters<NativeContinueTurn<A, P, I>>[0];

/** Supply the Effect tool sets, callbacks, stopping conditions, and output specification for one session turn. */
type TurnOptions<
  A,
  P,
  I,
  T extends EffectTools,
  Active extends EffectTools,
  R,
  Native extends NativeTurnOptions<A, P, I>,
> = Omit<
  CoreOptions<Native, R, T>,
  'tools' | 'activeTools' | 'output' | 'callbacks' | 'stopConditions'
> & {
  readonly tools: T;
  readonly activeTools: Active;
  readonly output: OutputSpecification<A, P, I, R> | undefined;
  readonly callbacks: CoreOptions<Native['callbacks'], R, T>;
  readonly stopConditions: CoreOptions<
    { readonly stopWhen: Native['stopConditions'] },
    R,
    T
  >['stopWhen'];
};

/** Scoped turn handle with independent readiness and completion effects and a streamed result. */
export type HarnessAgentTurn<A, P = A, I = unknown> = {
  readonly result: TextStreamResult<
    ToolSet,
    RuntimeContext,
    OutputInterface<A, P, I>
  >;
  readonly ready: Effect.Effect<void, AiSdkError>;
  readonly done: Effect.Effect<void, AiSdkError>;
};
/** Resolve stable Effect session handles without holding completed sessions alive. */
const sessions = new WeakMap<HarnessAgentSession, NativeSession>();
/** Construct a registered wrapper from the acquisition scope and its shared closure state. */
let wrapSession: (
  native: NativeSession,
  closed: Ref.Ref<boolean>,
) => HarnessAgentSession;
/** Extract the available creation and resumption options from the native agent. */
type NativeSessionOptions = NonNullable<
  Parameters<NativeAgent['createSession']>[0]
>;
/** Supply an existing wrapped sandbox or a callback that creates one for this session. */
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

  /** Keep native session access private and coordinate explicit closure with scope cleanup. */
  private constructor(
    private readonly native: NativeSession,
    private readonly closed: Ref.Ref<boolean>,
  ) {}

  /** Native identity used to associate prompt and continuation calls with the same session. */
  get sessionId() {
    return this.native.sessionId;
  }
  /** Indicates whether the SDK opened this session from saved state. */
  get isResume() {
    return this.native.isResume;
  }
  /** Read the native session's current ability to continue an incomplete turn. */
  get hasUnfinishedTurn() {
    return runSync('HarnessAgentSession.hasUnfinishedTurn', () =>
      this.native.hasUnfinishedTurn(),
    );
  }

  /** Start a turn with Effect tools and callbacks bound to its own operation scope. */
  promptTurn<A, P, I, T extends EffectTools, Active extends EffectTools, R>(
    options: TurnOptions<
      A,
      P,
      I,
      T,
      Active,
      R,
      Parameters<NativePromptTurn<A, P, I>>[0]
    >,
  ) {
    return this.openTurn('HarnessAgentSession.promptTurn', options, (native) =>
      this.native.promptTurn<ToolSet, RuntimeContext, OutputInterface<A, P, I>>(
        native,
      ),
    );
  }

  /** Continue an existing turn through the same scoped lifecycle used for initial prompts. */
  continueTurn<A, P, I, T extends EffectTools, Active extends EffectTools, R>(
    options: TurnOptions<
      A,
      P,
      I,
      T,
      Active,
      R,
      Parameters<NativeContinueTurn<A, P, I>>[0]
    >,
  ) {
    return this.openTurn(
      'HarnessAgentSession.continueTurn',
      options,
      (native) =>
        this.native.continueTurn<
          ToolSet,
          RuntimeContext,
          OutputInterface<A, P, I>
        >(native),
    );
  }

  /** Bind tools, stopping conditions, output, and callbacks, then observe readiness and completion in scoped fibers. */
  private openTurn<
    A,
    P,
    I,
    T extends EffectTools,
    Active extends EffectTools,
    R,
    Native extends NativeTurnOptions<A, P, I>,
  >(
    name: string,
    options: TurnOptions<A, P, I, T, Active, R, Native>,
    invoke: (options: Native) => ReturnType<NativePromptTurn<A, P, I>>,
  ): Effect.Effect<
    HarnessAgentTurn<A, P, I>,
    AiSdkError,
    Scope | R | ToolServices<T> | ToolServices<Active>
  > {
    return Effect.gen(function* () {
      const {
        tools,
        activeTools,
        output,
        callbacks,
        stopConditions,
        ...settings
      } = options;
      const owner = yield* openOperation<
        R | ToolServices<T> | ToolServices<Active>
      >(options.abortSignal);
      const turn = yield* runSync(name, () => {
        const bound = bindCoreOptions<Native, R>(settings, owner, tools);
        const stop = bindCoreOptions<{ stopWhen: Native['stopConditions'] }, R>(
          { stopWhen: stopConditions },
          owner,
          tools,
        );
        return invoke({
          ...bound,
          abortSignal: owner.signal,
          tools: bindTools(tools, owner),
          activeTools: bindTools(activeTools, owner),
          output: output && bindOutput(output, owner),
          callbacks: bindCoreOptions<Native['callbacks'], R>(
            callbacks,
            owner,
            tools,
          ),
          stopConditions: stop.stopWhen,
        });
      });
      const ready = yield* Effect.forkScoped(
        runRequest(
          `${name}.ready`,
          { abortSignal: owner.signal },
          () => turn.ready,
        ),
      );
      const done = yield* Effect.forkScoped(
        runRequest(
          `${name}.done`,
          { abortSignal: owner.signal },
          () => turn.done,
        ).pipe(Effect.tap(() => owner.markComplete)),
      );
      return {
        result: wrapTextStream(name, turn.result),
        ready: Fiber.join(ready),
        done: Fiber.join(done),
      };
    });
  }

  /** Ask the session to compact its context, optionally with custom instructions for that operation. */
  compact(instructions?: string) {
    return runRequest('HarnessAgentSession.compact', {}, () =>
      this.native.compact(instructions),
    );
  }

  /** Submit steering text to the native turn through the experimental session capability. */
  experimental_steerTurn(text: string) {
    return runRequest('HarnessAgentSession.steerTurn', {}, () =>
      this.native.experimental_steerTurn(text),
    );
  }

  /** Read conversation history using the native session's history options. */
  readHistory(options?: Parameters<NativeSession['readHistory']>[0]) {
    return runRequest('HarnessAgentSession.readHistory', {}, () =>
      this.native.readHistory(options),
    );
  }

  /** Suspend the current turn while retaining the enclosing session handle. */
  get suspendTurn() {
    return runRequest('HarnessAgentSession.suspendTurn', {}, () =>
      this.native.suspendTurn(),
    );
  }

  /** Detach the session through the shared closure guard and suppress a second finalizer action. */
  get detach() {
    return this.finish('HarnessAgentSession.detach', () =>
      this.native.detach(),
    );
  }

  /** Stop the session through the shared closure guard and suppress a second finalizer action. */
  get stop() {
    return this.finish('HarnessAgentSession.stop', () => this.native.stop());
  }

  /** Destroy the native session explicitly and mark its scope finalizer as complete. */
  get destroy() {
    return this.finish('HarnessAgentSession.destroy', () =>
      this.native.destroy(),
    );
  }

  /** Serialize final actions and restore the open state if the SDK operation fails. */
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

/** Native call fields bound by session and construction APIs instead of per-call generate or stream options. */
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
/** Preserve the SDK option union while requiring a registered Effect session for the call. */
type WrappedCallOptions<O> = O extends unknown
  ? Omit<O, OmittedCallOptions> & {
      readonly session: HarnessAgentSession;
    }
  : never;
/** Input for a completed generation in an existing wrapped session. */
type GenerateOptions = WrappedCallOptions<
  Parameters<NativeAgent['generate']>[0]
>;
/** Input for session generation whose result is consumed as a stream. */
type StreamOptions = WrappedCallOptions<Parameters<NativeAgent['stream']>[0]>;
/** Continue a turn in a registered session with the SDK's continuation data. */
type ContinueOptions = Omit<
  Parameters<NativeAgent['continueStream']>[0],
  'session'
> & {
  readonly session: HarnessAgentSession;
};

/** Preserve native result data while deferring structured-output access to a tagged Effect. */
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

/** Native factory options used to preserve sandbox template configuration. */
type CreateOptions = Parameters<typeof sdk.createHarnessSandboxTemplate>[0];
/** Template bootstrap configuration excludes the hook for individual sessions. */
type BootstrapConfig<E, R> = Omit<HarnessAgentSandboxConfig<E, R>, 'onSession'>;
/** Build a sandbox template from registered harnesses and optional Effect bootstrap work. */
type TemplateOptions<E = never, R = never> = Omit<
  CreateOptions,
  'harnesses' | 'sandboxConfig'
> & {
  readonly harnesses: ReadonlyArray<{ readonly harnessId: string }>;
  readonly sandboxConfig?: BootstrapConfig<E, R>;
};
/** Resolve all native harness handles before invoking a template or preparation operation. */
const unwrapHarnesses = (harnesses: TemplateOptions['harnesses']) =>
  Effect.forEach(harnesses, (harness) => {
    const native = unwrapHarness(harness);
    return native
      ? Effect.succeed(native)
      : Effect.fail(sdkError('HarnessAgent.harnesses', 'Invalid harness'));
  });

/** Bind preparation to a registered sandbox and forward interruption to the SDK template. */
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

/** Reusable sandbox template with native identity and Effect preparation. */
export type HarnessSandboxTemplate = ReturnType<typeof wrapTemplate>;

/** Ask the SDK for one combined template and wrap it when the configured harnesses provide one. */
export const createHarnessSandboxTemplate = <E = never, R = never>(
  options: TemplateOptions<E, R>,
) =>
  Effect.gen(function* () {
    const { sandboxConfig, harnesses: handles } = options;
    const harnesses = yield* unwrapHarnesses(handles);
    const owner = yield* openOperation<R>();
    const template = yield* runRequest(
      'HarnessAgent.createHarnessSandboxTemplate',
      { abortSignal: owner.signal },
      () =>
        sdk.createHarnessSandboxTemplate({
          harnesses,
          ...(sandboxConfig && {
            sandboxConfig: bindSandboxConfig(sandboxConfig, owner),
          }),
        }),
    );
    return template && wrapTemplate(template);
  });

/** Prewarming options with registered harness and provider handles and an Effect bootstrap callback. */
type PrewarmOptions<E, R> = Omit<
  Parameters<typeof sdk.prepareHarnessSandboxTemplate>[0],
  'harness' | 'sandboxProvider' | 'sandboxConfig'
> & {
  readonly harness: { readonly harnessId: string };
  readonly sandboxConfig?: BootstrapConfig<E, R>;
  readonly sandboxProvider: ReturnType<
    typeof import('../internal/sandbox.js').wrapSandboxProvider
  >;
};

/** Prepare a provider sandbox template under a local scope and forward the caller's abort signal. */
export const prepareHarnessSandboxTemplate = <E = never, R = never>(
  options: PrewarmOptions<E, R>,
) =>
  Effect.scoped(
    Effect.gen(function* () {
      const { sandboxConfig, ...settings } = options;
      const harness = unwrapHarness(options.harness);
      const sandboxProvider = unwrapSandboxProvider(options.sandboxProvider);
      if (!harness || !sandboxProvider) {
        return yield* Effect.fail(
          sdkError(
            'HarnessAgent.prewarm',
            'Invalid harness or sandbox provider',
          ),
        );
      }
      const owner = yield* openOperation<R>(options.abortSignal);
      return yield* runRequest(
        'HarnessAgent.prewarm',
        { abortSignal: owner.signal },
        (abortSignal) =>
          sdk.prepareHarnessSandboxTemplate({
            ...settings,
            harness,
            sandboxProvider,
            abortSignal,
            ...(sandboxConfig && {
              sandboxConfig: bindSandboxConfig(sandboxConfig, owner),
            }),
          }),
      );
    }),
  );

/** Expose the template preparation operation under the prewarming name as well. */
export const prewarmHarness = prepareHarnessSandboxTemplate;

/** Prepare an existing sandbox using the selected harnesses and Effect session configuration. */
type PrepareOptions<E, R> = Omit<
  Parameters<typeof sdk.prepareSandboxForHarness>[0],
  'session' | 'harnesses' | 'sandboxConfig'
> & {
  readonly session: SandboxSession;
  readonly harnesses: TemplateOptions<E, R>['harnesses'];
  readonly sandboxConfig?: HarnessAgentSandboxConfig<E, R>;
};

/** Validate the existing session and harness identities before calling native preparation in a scope. */
export const prepareSandboxForHarness = <E = never, R = never>(
  options: PrepareOptions<E, R>,
) =>
  Effect.scoped(
    Effect.gen(function* () {
      const { sandboxConfig, ...settings } = options;
      const session = unwrapSandbox(options.session);
      if (!session)
        return yield* Effect.fail(
          sdkError('HarnessAgent.prepareSandbox', 'Invalid sandbox session'),
        );
      const harnesses = yield* unwrapHarnesses(options.harnesses);
      const owner = yield* openOperation<R>(options.abortSignal);
      return yield* runRequest(
        'HarnessAgent.prepareSandbox',
        { abortSignal: owner.signal },
        (abortSignal) =>
          sdk.prepareSandboxForHarness({
            ...settings,
            session,
            harnesses,
            abortSignal,
            ...(sandboxConfig && {
              sandboxConfig: bindSandboxConfig(sandboxConfig, owner),
            }),
          }),
      );
    }),
  );

/** A harness agent whose native sessions and streaming results stay private. */
export class HarnessAgent<A = unknown, P = A, I = unknown> {
  /** Create the agent lazily and retain the scope required by constructor callbacks and tools. */
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
        ...(preparedTools
          ? { tools: bindTools(preparedTools as T, owner) }
          : {}),
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

  /** Store only a registered native agent behind the public handle. */
  private constructor(private readonly native: NativeAgent<A, P, I>) {}

  /** Version discriminator reported by the SDK harness agent. */
  get version() {
    return this.native.version;
  }
  /** Optional identifier configured for this agent instance. */
  get id() {
    return this.native.id;
  }
  /** ID of the selected harness adapter, independent of the agent ID. */
  get harnessId() {
    return this.native.harnessId;
  }
  /** Indicates whether the agent exposes a structured output specification. */
  get hasOutput() {
    return this.native.hasOutput;
  }
  /** Adapt native built-in and configured tools for Effect callers by native tool key. */
  get tools() {
    return wrapTools('HarnessAgent.tools', this.native.tools);
  }

  /** Read the SDK's optional sandbox template and wrap its preparation operation. */
  getSandboxTemplate() {
    return runRequest('HarnessAgent.getSandboxTemplate', {}, () =>
      this.native.getSandboxTemplate(),
    ).pipe(Effect.map((template) => template && wrapTemplate(template)));
  }

  /** Acquire a session and destroy it at scope exit unless explicit closure already succeeded. */
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

  /** Run a complete turn with a registered session and expose structured output as an Effect. */
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

  /** Begin native output streaming in an operation scope tied to the caller's cancellation signal. */
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

  /** Continue an incomplete turn to a complete result, with deferred structured output access. */
  continueGenerate(options: ContinueOptions) {
    return this.continue('HarnessAgent.continueGenerate', options, (input) =>
      this.native.continueGenerate(input),
    ).pipe(
      Effect.flatMap((result) =>
        runSync('HarnessAgent.continueGenerate', () => readResult(result)),
      ),
    );
  }

  /** Continue an incomplete turn and expose its native output as a scoped stream. */
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

  /** Submit steering text using a registered session. An unregistered handle fails before the SDK call. */
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

  /** Share native identity validation and abort propagation between both continuation result modes. */
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

/** Derive pending approval continuation data from the SDK's message representation. */
export const collectHarnessAgentToolApprovalContinuations = (
  ...args: Parameters<typeof sdk.collectHarnessAgentToolApprovalContinuations>
) =>
  runSync('HarnessAgent.collectToolApprovalContinuations', () =>
    sdk.collectHarnessAgentToolApprovalContinuations(...args),
  );

/** Derive pending tool-result continuation data from the SDK's message representation. */
export const collectHarnessAgentToolResultContinuations = (
  ...args: Parameters<typeof sdk.collectHarnessAgentToolResultContinuations>
) =>
  runSync('HarnessAgent.collectToolResultContinuations', () =>
    sdk.collectHarnessAgentToolResultContinuations(...args),
  );

/** Create a native file reporter with Effect telemetry and diagnostic ingestion operations. */
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

/** File-backed telemetry integration that can also receive harness diagnostic events. */
export type FileReporter = EffectTelemetry & HarnessDiagnosticConsumer;

/** Configure where completed trace tree output is written. */
export interface TraceTreeReporterOptions<E = never, R = never> {
  /** Optional Effect sink for rendered trace chunks. Omitting it keeps the SDK's output sink. */
  readonly write?: (chunk: string) => Effect.Effect<void, E, R>;
}

/** Render traces with the SDK and run an optional custom write Effect in the reporter's scope. */
export const createTraceTreeReporter = <E = never, R = never>(
  options?: TraceTreeReporterOptions<E, R>,
): Effect.Effect<EffectTelemetry, AiSdkError, Scope | R> =>
  Effect.gen(function* () {
    const operation = 'HarnessAgent.TraceTreeReporter';
    const write = options?.write;
    if (!write) {
      return yield* runSync(operation, () =>
        wrapTelemetry(operation, sdk.createTraceTreeReporter()),
      );
    }
    const owner = yield* openOperation<R>();
    return yield* runSync(operation, (): EffectTelemetry => {
      let rendered = Option.none<string>();
      const native = sdk.createTraceTreeReporter({
        write: (chunk) => {
          rendered = Option.some(chunk);
        },
      });
      return {
        ...wrapTelemetry(operation, native),
        onEnd: (event) =>
          Effect.gen(function* () {
            const chunk = yield* runSync(`${operation}.render`, () => {
              rendered = Option.none();
              native.onEnd?.(unwrapTelemetryEvent(event));
              return rendered;
            });
            if (Option.isSome(chunk)) {
              yield* runRequest(
                `${operation}.write`,
                { abortSignal: owner.signal },
                (signal) =>
                  owner.runCallback(
                    Effect.suspend(() => write(chunk.value)),
                    signal,
                  ),
              );
            }
          }),
      };
    });
  });

/** Obtain the SDK's diagnostic message for a harness failure through the tagged boundary. */
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

/** Native lifecycle and bootstrap configuration before adapting sandbox handles and callbacks. */
type NativeSandboxConfig = sdk.HarnessAgentSandboxConfig;
/** Bootstrap callback input with a wrapped session for initialization operations. */
type SandboxBootstrapInput = Omit<
  Parameters<NonNullable<NativeSandboxConfig['onBootstrap']>>[0],
  'session'
> & { readonly session: SandboxSession };
/** Session callback input with a wrapped session for session-level operations. */
type SandboxSessionInput = Omit<
  Parameters<NonNullable<NativeSandboxConfig['onSession']>>[0],
  'session'
> & { readonly session: SandboxSession };

/** Configure the SDK sandbox and run bootstrap and session hooks as Effects. */
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

/** Wrap native sessions before running sandbox callbacks with their supplied cancellation signal. */
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

/** Optional factory interface for an agent to create its own sandbox for a session. */
export interface HarnessAgentSandboxCreator {
  /** Default working directory the agent reports for sandbox operations created by this factory. */
  readonly defaultWorkingDirectory: string;
  /** Acquire a registered sandbox handle and honor the optional session cancellation signal. */
  readonly createSandboxSession: (options: {
    readonly abortSignal?: AbortSignal;
  }) => Effect.Effect<SandboxSession, AiSdkError>;
}

/** Effect wrappers for built-in native tools exposed by the harness agent. */
export type HarnessAgentBuiltinTools = ReturnType<typeof wrapTools>;

/** Combine built-in and supplied tools. Supplied tools take precedence by name. */
export type HarnessAllTools<
  Harness extends { readonly builtinTools: Record<string, object> },
  Tools extends EffectTools,
> = Omit<Harness['builtinTools'], keyof Tools> & Tools;

/** Optional diagnostics entry point shared by file reporters and other telemetry consumers. */
export interface HarnessDiagnosticConsumer {
  /** Deliver one native harness diagnostic to an Effect consumer. */
  readonly ingestDiagnostic?: (
    diagnostic: sdk.HarnessDiagnostic,
  ) => Effect.Effect<void, AiSdkError>;
}
