import * as sdk from '@ai-sdk/harness-pi';
import { runSync } from '../internal/operation.js';
import { wrapHarness } from './internal/harness.js';

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
} from '@ai-sdk/harness-pi';

export type { PiHarnessSettings } from '@ai-sdk/harness-pi';

export const VERSION = sdk.VERSION;
export const createPi = (settings?: sdk.PiHarnessSettings) =>
  runSync('Pi.create', () => wrapHarness(sdk.createPi(settings)));
export const pi = runSync('Pi.default', () => wrapHarness(sdk.pi));
