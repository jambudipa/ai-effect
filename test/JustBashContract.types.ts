import type { Sandbox as NativeSandbox } from 'just-bash';
import type {
  JustBashNativeSandboxSession,
  JustBashSandboxSettings,
} from '../src/integrations/sandbox-just-bash.js';

type Expect<T extends true> = T;
type Same<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;

export type AcceptsNativeSandbox = Expect<
  NativeSandbox extends JustBashNativeSandboxSession ? true : false
>;
export type RetainsPublicSandboxOperations = Expect<
  Same<keyof NativeSandbox, keyof JustBashNativeSandboxSession>
>;

type SandboxCreation = Exclude<JustBashSandboxSettings, { sandbox: unknown }>;
type Defense = Exclude<SandboxCreation['defenseInDepth'], boolean | undefined>;
type Violation = Parameters<NonNullable<Defense['onViolation']>>[0];

export type DefenseCallbackPreservesViolation = Expect<
  'prototype_mutation' extends Violation['type'] ? true : false
>;
export type DefenseCallbackPreservesTimestamp = Expect<
  Same<Violation['timestamp'], number>
>;
