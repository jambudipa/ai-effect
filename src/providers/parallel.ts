import {
  createParallel as sdkCreateParallel,
  parallel as sdkParallel,
} from '@ai-sdk/parallel';
import type { ParallelProvider as SdkProvider } from '@ai-sdk/parallel';
import { adaptMethod, wrapProviderBase } from '../internal/provider-adapter.js';
import { wrapDecisionModel } from '../internal/provider-model.js';
import { runSync } from '../internal/operation.js';

export { VERSION } from '@ai-sdk/parallel';
export type {
  Experimental_ParallelDecisionModelId,
  ParallelDecisionModelOptions,
  ParallelDecisionProviderMetadata,
  ParallelProviderSettings,
} from '@ai-sdk/parallel';

/** Adapt decision model selection from the Parallel SDK to Effect. */
const wrapProvider = (sdk: SdkProvider) => ({
  ...wrapProviderBase('parallel', sdk),
  decisionModel: adaptMethod(
    'parallel.decisionModel',
    sdk.decisionModel.bind(sdk),
    wrapDecisionModel,
  ),
});
/** Provider returned by the adapter, with Effect-based model selection for Parallel. */
export type ParallelProvider = ReturnType<typeof wrapProvider>;
/**
 * Construct the Parallel provider lazily with the native SDK arguments and map SDK
 * construction failures.
 */
export const createParallel = (...args: Parameters<typeof sdkCreateParallel>) =>
  runSync('createParallel', () => wrapProvider(sdkCreateParallel(...args)));
/**
 * Adapt the preconfigured provider from the Parallel SDK. Use the factory to supply
 * explicit settings.
 */
export const parallel: ParallelProvider = wrapProvider(sdkParallel);
