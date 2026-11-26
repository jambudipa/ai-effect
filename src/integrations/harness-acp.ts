import * as native from '@ai-sdk/harness-acp';
import type * as SDKContract from './internal/harness-contracts/harness-acp.js';
import { Cause, Effect, Exit } from 'effect';
import { openOperation, runSync } from '../internal/operation.js';
import {
  bindTools,
  type BoundTools,
  type EffectTools,
  type ToolServices,
} from '../internal/tool.js';
import type { HarnessV1MintBridgeTokenCallback } from './harness.js';
import type { WithEffectCallbacks } from './internal/callbacks.js';
import {
  type HarnessV1CredentialForwarding,
  wrapHarness,
} from './internal/harness.js';
import { type SandboxSession, wrapSandbox } from './internal/sandbox.js';

/** Use the pinned ACP SDK declarations at the native adapter boundary. */
const sdk = native as unknown as typeof SDKContract;

export type {
  ACPAnnotations,
  ACPAudioContent,
  ACPAuthentication,
  ACPAuthenticationFile,
  ACPAuthenticationMode,
  ACPBlobResourceContents,
  ACPClientApp,
  ACPContentBlock,
  ACPEmbeddedResource,
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
  ACPValueSource,
} from './internal/harness-contracts/harness-acp.js';

/** Preserve the native preparation callback's sandbox and cancellation argument shape. */
type PrepareSandbox = NonNullable<
  SDKContract.ACPHarnessSettings['prepareSandbox']
>;
/** Preserve the native authentication-environment callback's arguments and awaited result. */
type ResolveAuthentication = NonNullable<
  SDKContract.ACPHarnessSettings['resolveAuthenticationEnvironment']
>;
/** Expose native synchronous callbacks as Effects that must finish without suspension. */
type SynchronousCallback<T, R, E> = T extends (
  ...args: infer Args
) => infer Result
  ? (...args: Args) => Effect.Effect<Result, E, R>
  : never;

/** ACP calls these hooks synchronously. Each Effect must complete synchronously. */
export type ACPAskUserQuestionsSettings<
  R = never,
  E = never,
> = WithEffectCallbacks<
  SDKContract.ACPAskUserQuestionsSettings,
  Exclude<keyof SDKContract.ACPAskUserQuestionsSettings, 'requestMethod'>,
  E,
  R
>;

/** Provide ACP authentication files through an Effect that finishes synchronously. */
export type ACPAuthenticationFiles<R = never, E = never> = SynchronousCallback<
  SDKContract.ACPAuthenticationFiles,
  R,
  E
>;
/** Resolve ACP credential brokering settings through an Effect that finishes synchronously. */
export type ACPCredentialBrokering<R = never, E = never> = SynchronousCallback<
  SDKContract.ACPCredentialBrokering,
  R,
  E
>;
/** Resolve a native ACP tool call through an Effect that finishes synchronously. */
export type ACPResolveHostToolCall<R = never, E = never> = SynchronousCallback<
  SDKContract.ACPResolveHostToolCall,
  R,
  E
>;

/** Optional settings for translating question requests and responses to the ACP protocol. */
type AskQuestions<R, E> = ACPAskUserQuestionsSettings<R, E> | undefined;
/** Specialize the native factory according to whether the host supplies question handling. */
type NativeAskQuestions<Q> = Q extends undefined
  ? undefined
  : SDKContract.ACPAskUserQuestionsSettings;

/** Adapter settings whose Effects must complete inside their synchronous native callbacks. */
type SynchronousSettings<R, E> = {
  readonly authenticationFiles?: ACPAuthenticationFiles<R, E>;
  readonly credentialBrokering?: ACPCredentialBrokering<R, E>;
  readonly isMcpToolCall: SynchronousCallback<
    SDKContract.ACPHarnessSettings['isMcpToolCall'],
    R,
    E
  >;
  readonly resolveHostToolCall: ACPResolveHostToolCall<R, E>;
};

/** Configure ACP authentication, sandbox preparation, and optional Effect tools for a scoped adapter. */
export type ACPHarnessSettings<
  T extends EffectTools = {},
  Q = unknown,
  R = never,
  E = never,
> = Omit<
  SDKContract.ACPHarnessSettings<BoundTools<T>>,
  | keyof SynchronousSettings<R, E>
  | 'askUserQuestions'
  | 'builtinTools'
  | 'credentialForwarding'
  | 'mintBridgeToken'
  | 'prepareSandbox'
  | 'resolveAuthenticationEnvironment'
> &
  SynchronousSettings<R, E> & {
    readonly askUserQuestions?: Q & AskQuestions<R, E>;
    readonly builtinTools?: T;
    readonly credentialForwarding?: HarnessV1CredentialForwarding<R, E>;
    /** @deprecated The SDK ignores this setting and generates its own bridge keys. */
    readonly mintBridgeToken?: HarnessV1MintBridgeTokenCallback;
    readonly prepareSandbox?: (
      options: Omit<Parameters<PrepareSandbox>[0], 'sandbox'> & {
        readonly sandbox: SandboxSession;
      },
    ) => Effect.Effect<void, E, R>;
    readonly resolveAuthenticationEnvironment?: (
      ...args: Parameters<ResolveAuthentication>
    ) => Effect.Effect<Awaited<ReturnType<ResolveAuthentication>>, E, R>;
  };

/** Version reported by the pinned native ACP adapter. */
export const VERSION = sdk.VERSION;

/** Bind synchronous hooks with the captured services and interrupt any hook that attempts asynchronous work. */
const createWithSettings = <
  T extends EffectTools = {},
  Q = undefined,
  R = never,
  E = never,
>(
  settings: ACPHarnessSettings<T, Q, R, E>,
) =>
  Effect.gen(function* () {
    const {
      askUserQuestions,
      authenticationFiles,
      builtinTools,
      credentialBrokering,
      credentialForwarding,
      isMcpToolCall,
      prepareSandbox,
      resolveAuthenticationEnvironment,
      resolveHostToolCall,
      ...rest
    } = settings;
    const owner = yield* openOperation<R | ToolServices<T>>();
    const context = yield* Effect.context<R>();
    const bindSync =
      <Args extends ReadonlyArray<unknown>, A>(
        callback: (...args: Args) => Effect.Effect<A, E, R>,
      ) =>
      (...args: Args): A => {
        owner.signal.throwIfAborted();
        const exit = Effect.runSyncExitWith(context)(
          Effect.suspend(() => callback(...args)),
        );
        if (Exit.isFailure(exit)) {
          for (const reason of exit.cause.reasons) {
            if (
              Cause.isDieReason(reason) &&
              Cause.isAsyncFiberError(reason.defect)
            ) {
              reason.defect.fiber.interruptUnsafe();
            }
          }
        }
        return Effect.runSyncWith(context)(exit);
      };
    const questions = askUserQuestions && {
      requestMethod: askUserQuestions.requestMethod,
      fromNativeRequest: bindSync(askUserQuestions.fromNativeRequest),
      toNativeResponse: bindSync(askUserQuestions.toNativeResponse),
      ...(askUserQuestions.isNativeToolCall && {
        isNativeToolCall: bindSync(askUserQuestions.isNativeToolCall),
      }),
      ...(askUserQuestions.matchesNativeRequest && {
        matchesNativeRequest: bindSync(askUserQuestions.matchesNativeRequest),
      }),
    };
    return yield* runSync('ACP.create', () =>
      wrapHarness(
        sdk.createACP<BoundTools<T>, NativeAskQuestions<Q>>({
          ...rest,
          isMcpToolCall: bindSync(isMcpToolCall),
          resolveHostToolCall: bindSync(resolveHostToolCall),
          ...(questions && {
            askUserQuestions: questions as NativeAskQuestions<Q>,
          }),
          ...(authenticationFiles && {
            authenticationFiles: bindSync(authenticationFiles),
          }),
          ...(builtinTools && { builtinTools: bindTools(builtinTools, owner) }),
          ...(credentialBrokering && {
            credentialBrokering: bindSync(credentialBrokering),
          }),
          ...(credentialForwarding && {
            credentialForwarding: (input) =>
              owner.runCallback(credentialForwarding(input)),
          }),
          ...(prepareSandbox && {
            prepareSandbox: ({ sandbox, ...opts }) =>
              owner.runCallback(
                prepareSandbox({ ...opts, sandbox: wrapSandbox(sandbox) }),
                opts.abortSignal,
              ),
          }),
          ...(resolveAuthenticationEnvironment && {
            resolveAuthenticationEnvironment: (options) =>
              owner.runCallback(resolveAuthenticationEnvironment(options)),
          }),
        }),
      ),
    );
  });

/** Construct an ACP adapter and retain the question tool type when question handling is required. */
export function createACP<T extends EffectTools = {}, R = never, E = never>(
  settings: ACPHarnessSettings<T, unknown, R, E> & {
    readonly askUserQuestions: ACPAskUserQuestionsSettings<R, E>;
  },
): ReturnType<
  typeof createWithSettings<T, ACPAskUserQuestionsSettings<R, E>, R, E>
>;
/** Construct an ACP adapter with the supplied tools and optional question handling. */
export function createACP<
  T extends EffectTools = {},
  Q = undefined,
  R = never,
  E = never,
>(
  settings: ACPHarnessSettings<T, Q, R, E>,
): ReturnType<typeof createWithSettings<T, Q, R, E>>;
export function createACP<
  T extends EffectTools = {},
  Q = undefined,
  R = never,
  E = never,
>(
  settings: ACPHarnessSettings<T, Q, R, E>,
): ReturnType<typeof createWithSettings<T, Q, R, E>> {
  // The diagnostic compares the service parameters of separate overloads.
  // @effect-diagnostics-next-line effect/missingEffectContext:off
  return createWithSettings<T, Q, R, E>(settings);
}

/** ACP v1 configuration with Effect host callbacks following the same synchronous and scoped contracts as the adapter. */
export type ACPV1Settings<R = never, E = never> = Omit<
  SDKContract.ACPV1Settings,
  | keyof SynchronousSettings<R, E>
  | 'askUserQuestions'
  | 'credentialForwarding'
  | 'mintBridgeToken'
  | 'prepareSandbox'
  | 'resolveAuthenticationEnvironment'
> &
  SynchronousSettings<R, E> &
  Pick<
    ACPHarnessSettings<{}, AskQuestions<R, E>, R, E>,
    | 'askUserQuestions'
    | 'credentialForwarding'
    | 'mintBridgeToken'
    | 'prepareSandbox'
    | 'resolveAuthenticationEnvironment'
  >;
