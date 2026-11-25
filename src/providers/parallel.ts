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

const wrapProvider = (sdk: SdkProvider) => ({
  ...wrapProviderBase('parallel', sdk),
  decisionModel: adaptMethod(
    'parallel.decisionModel',
    sdk.decisionModel.bind(sdk),
    wrapDecisionModel,
  ),
});
export type ParallelProvider = ReturnType<typeof wrapProvider>;
export const createParallel = (...args: Parameters<typeof sdkCreateParallel>) =>
  runSync('createParallel', () => wrapProvider(sdkCreateParallel(...args)));
export const parallel: ParallelProvider = wrapProvider(sdkParallel);
