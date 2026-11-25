// Generated from @ai-sdk/sandbox-vercel in @ai-sdk/sandbox-vercel@1.0.193. Do not edit.
// Original license: harness.LICENSE.
// Normalize Zod v4 declarations for the Zod 3.25.76 bridge.
import { Sandbox } from '@vercel/sandbox';
import {
  HarnessV1NetworkSandboxSession,
  HarnessV1SandboxProvider,
  HarnessV1SandboxSessionCreateOptions,
  HarnessV1SandboxSessionResumeOptions,
} from './harness.js';
import { Experimental_SandboxSession } from '@ai-sdk/provider-utils';
type VercelSandboxCreateParams$1 = NonNullable<
  Parameters<typeof Sandbox.create>[0]
>;
type DistributiveOmit$1<T, K extends keyof any> = T extends unknown
  ? Omit<T, K>
  : never;
type VercelSandboxCreationSettings$1 = DistributiveOmit$1<
  VercelSandboxCreateParams$1,
  'onResume'
> & {
  sandbox?: never;
  name?: string;
};
type VercelSandboxSettings =
  | {
      sandbox: Sandbox;
    }
  | VercelSandboxCreationSettings$1;
export declare function createVercelSandbox(
  settings?: VercelSandboxSettings,
): HarnessV1SandboxProvider;
export declare class VercelSandboxProvider implements HarnessV1SandboxProvider {
  private readonly settings;
  readonly specificationVersion: 'harness-sandbox-v1';
  readonly providerId = 'vercel-sandbox';
  constructor(settings: VercelSandboxSettings);
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
  resumeSession: (options: {
    sessionId: string;
    abortSignal?: AbortSignal;
  }) => Promise<HarnessV1NetworkSandboxSession>;
}
type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
type DistributiveOmit<T, K extends keyof any> = T extends unknown
  ? Prettify<Omit<T, K>>
  : never;
type VercelSandboxCreateParams = DistributiveOmit<
  NonNullable<Parameters<typeof Sandbox.create>[0]>,
  'onResume'
>;
type VercelNativeSandboxSession = Sandbox;
type VercelSandboxCreationSettings = VercelSandboxCreateParams & {
  sandbox?: never;
  name?: string;
};
type VercelCreationSettings = DistributiveOmit<
  VercelSandboxCreationSettings,
  'sandbox'
> & {
  templateName?: string;
};
type VercelNetworkSandboxSessionCreateOptions = Prettify<
  HarnessV1SandboxSessionCreateOptions<VercelCreationSettings> & {
    sandbox?: never;
  }
>;
type VercelLookupSettings = DistributiveOmit<
  NonNullable<Parameters<typeof Sandbox.get>[0]>,
  'name' | 'resume'
> & {
  name?: never;
  resume?: never;
};
type VercelNetworkSandboxSessionResumeOptions = Prettify<
  HarnessV1SandboxSessionResumeOptions<VercelLookupSettings>
>;
export declare function createVercelNetworkSandboxSession(
  options?: VercelNetworkSandboxSessionCreateOptions,
): Promise<HarnessV1NetworkSandboxSession>;
export declare function resumeVercelNetworkSandboxSession(
  options: VercelNetworkSandboxSessionResumeOptions,
): Promise<HarnessV1NetworkSandboxSession>;
export declare function createVercelSandboxSessionFromNativeSandbox(
  nativeSandbox: VercelNativeSandboxSession,
): Experimental_SandboxSession;
export declare function createVercelNetworkSandboxSessionFromNativeSandbox(
  nativeSandbox: VercelNativeSandboxSession,
): HarnessV1NetworkSandboxSession;
export type {
  VercelNativeSandboxSession,
  VercelNetworkSandboxSessionCreateOptions,
  VercelNetworkSandboxSessionResumeOptions,
  VercelSandboxSettings,
};
