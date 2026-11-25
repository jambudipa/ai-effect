// Generated from @ai-sdk/sandbox-just-bash in @ai-sdk/sandbox-just-bash@1.0.193. Do not edit.
// Original license: harness.LICENSE.
// Normalize Zod v4 declarations for the Zod 3.25.76 bridge.
import { Sandbox } from 'just-bash';
import {
  HarnessV1NetworkSandboxSession,
  HarnessV1SandboxProvider,
  HarnessV1SandboxSessionCreateOptions,
  HarnessV1SandboxSessionResumeOptions,
} from './harness.js';
import { Experimental_SandboxSession } from '@ai-sdk/provider-utils';
type JustBashSandboxCreateParams$1 = NonNullable<
  Parameters<typeof Sandbox.create>[0]
>;
type JustBashCreationSettings$1 = JustBashSandboxCreateParams$1 & {
  sandbox?: never;
};
type JustBashSandboxSettings =
  | {
      sandbox: Sandbox;
    }
  | JustBashCreationSettings$1;
export declare function createJustBashSandbox(
  settings?: JustBashSandboxSettings,
): HarnessV1SandboxProvider;
export declare class JustBashSandboxProvider implements HarnessV1SandboxProvider {
  private readonly settings;
  readonly specificationVersion: 'harness-sandbox-v1';
  readonly providerId = 'just-bash-sandbox';
  constructor(settings: JustBashSandboxSettings);
  createSession: (options?: {
    sessionId?: string;
    abortSignal?: AbortSignal;
    identity?: string;
    onFirstCreate?: (
      session: Experimental_SandboxSession,
      opts: {
        abortSignal?: AbortSignal;
      },
    ) => Promise<void>;
  }) => Promise<HarnessV1NetworkSandboxSession>;
}
type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
type JustBashNativeSandboxSession = Sandbox;
type JustBashSandboxCreateParams = NonNullable<
  Parameters<typeof Sandbox.create>[0]
>;
type JustBashCreationSettings = Omit<JustBashSandboxCreateParams, 'sandbox'>;
type JustBashNetworkSandboxSessionCreateOptions = Prettify<
  HarnessV1SandboxSessionCreateOptions<JustBashCreationSettings> & {
    sandbox?: never;
  }
>;
type JustBashLookupSettings = Record<never, never>;
type JustBashNetworkSandboxSessionResumeOptions = Prettify<
  HarnessV1SandboxSessionResumeOptions<JustBashLookupSettings>
>;
export declare function createJustBashNetworkSandboxSession(
  options?: JustBashNetworkSandboxSessionCreateOptions,
): Promise<HarnessV1NetworkSandboxSession>;
export declare function resumeJustBashNetworkSandboxSession(
  options: JustBashNetworkSandboxSessionResumeOptions,
): Promise<HarnessV1NetworkSandboxSession>;
export declare function createJustBashSandboxSessionFromNativeSandbox(
  nativeSandbox: JustBashNativeSandboxSession,
): Experimental_SandboxSession;
export declare function createJustBashNetworkSandboxSessionFromNativeSandbox(
  nativeSandbox: JustBashNativeSandboxSession,
): HarnessV1NetworkSandboxSession;
export type {
  JustBashNativeSandboxSession,
  JustBashNetworkSandboxSessionCreateOptions,
  JustBashNetworkSandboxSessionResumeOptions,
  JustBashSandboxSettings,
};
