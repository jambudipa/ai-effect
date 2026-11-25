import * as native from '@ai-sdk/harness-pi';
import type * as SDKContract from './internal/harness-contracts/harness-pi.js';
import { runSync } from '../internal/operation.js';
import { wrapHarness } from './internal/harness.js';

const sdk = native as unknown as typeof SDKContract;

export type {
  PiAuthenticationMode,
  PiCredentialStore,
  PiFileToolPathPolicy,
  PiHarnessExtensionFactory,
  PiHarnessExtensionSession,
  PiMcpExposure,
  PiMcpServerConfig,
  PiResources,
  PiSandboxSkill,
  PiSessionStorage,
} from './internal/harness-contracts/harness-pi.js';

export type { PiHarnessSettings } from './internal/harness-contracts/harness-pi.js';

export const VERSION = sdk.VERSION;
export const createPi = (settings?: SDKContract.PiHarnessSettings) =>
  runSync('Pi.create', () => wrapHarness(sdk.createPi(settings)));
export const pi = runSync('Pi.default', () => wrapHarness(sdk.pi));
