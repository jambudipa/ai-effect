import * as sdk from '@ai-sdk/harness-acp';
import { Effect } from 'effect';
import { openOperation, runSync } from '../internal/operation.js';
import {
  bindTools,
  type BoundTools,
  type EffectTools,
  type ToolServices,
} from '../internal/tool.js';
import {
  type HarnessV1CredentialForwarding,
  wrapHarness,
} from './internal/harness.js';
import { type SandboxSession, wrapSandbox } from './internal/sandbox.js';

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
  ACPValueSource,
} from '@ai-sdk/harness-acp';

type PrepareSandbox = NonNullable<sdk.ACPHarnessSettings['prepareSandbox']>;
type ResolveAuthentication = NonNullable<
  sdk.ACPHarnessSettings['resolveAuthenticationEnvironment']
>;
type AskQuestions = sdk.ACPAskUserQuestionsSettings | undefined;

export type ACPHarnessSettings<
  T extends EffectTools = {},
  Q extends AskQuestions = AskQuestions,
  R = never,
  E = never,
> = Omit<
  sdk.ACPHarnessSettings<BoundTools<T>, Q>,
  | 'builtinTools'
  | 'credentialForwarding'
  | 'prepareSandbox'
  | 'resolveAuthenticationEnvironment'
> & {
  readonly builtinTools?: T;
  readonly credentialForwarding?: HarnessV1CredentialForwarding<R, E>;
  readonly prepareSandbox?: (
    options: Omit<Parameters<PrepareSandbox>[0], 'sandbox'> & {
      readonly sandbox: SandboxSession;
    },
  ) => Effect.Effect<void, E, R>;
  readonly resolveAuthenticationEnvironment?: (
    ...args: Parameters<ResolveAuthentication>
  ) => Effect.Effect<Awaited<ReturnType<ResolveAuthentication>>, E, R>;
};

export const VERSION = sdk.VERSION;

export const createACP = <
  T extends EffectTools = {},
  Q extends AskQuestions = undefined,
  R = never,
  E = never,
>(
  settings: ACPHarnessSettings<T, Q, R, E>,
) =>
  Effect.gen(function* () {
    const {
      builtinTools,
      credentialForwarding,
      prepareSandbox,
      resolveAuthenticationEnvironment,
      ...rest
    } = settings;
    const owner = yield* openOperation<R | ToolServices<T>>();
    return yield* runSync('ACP.create', () =>
      wrapHarness(
        sdk.createACP<BoundTools<T>, Q>({
          ...rest,
          ...(builtinTools && { builtinTools: bindTools(builtinTools, owner) }),
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

export type ACPV1Settings<R = never, E = never> = Omit<
  sdk.ACPV1Settings,
  'credentialForwarding' | 'prepareSandbox' | 'resolveAuthenticationEnvironment'
> &
  Pick<
    ACPHarnessSettings<{}, AskQuestions, R, E>,
    | 'credentialForwarding'
    | 'prepareSandbox'
    | 'resolveAuthenticationEnvironment'
  >;
