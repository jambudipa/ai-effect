import * as sdk from '@ai-sdk/typesafe-ai';
import { runSync } from '../internal/operation.js';
import { adaptMethod, wrapProviderBase } from '../internal/provider-adapter.js';
import {
  adaptProviderFactory,
  type EffectProviderSettings,
} from '../internal/provider-settings.js';
import {
  wrapDecisionModel,
  wrapEvaluationModel,
} from '../internal/provider-model.js';

export type {
  Experimental_TypeSafeAiDecisionModelId,
  Experimental_TypeSafeAiEvaluationModelId,
  TypeSafeAiDecisionModelOptions,
  TypeSafeAiFilePartProviderOptions,
} from '@ai-sdk/typesafe-ai';

/** Adapt native TypeSafe AI model factories and keep provider tool definitions available through Effect. */
const wrapTypeSafeAi = (native: sdk.TypeSafeAiProvider) => ({
  ...wrapProviderBase('TypeSafeAi', native),
  decisionModel: adaptMethod(
    'TypeSafeAi.decisionModel',
    native.decisionModel.bind(native),
    wrapDecisionModel,
  ),
  evaluationModel: adaptMethod(
    'TypeSafeAi.evaluationModel',
    native.evaluationModel.bind(native),
    wrapEvaluationModel,
  ),
});

/** Wrapped provider handle with Effect model factories and SDK tool metadata. */
export type TypeSafeAiProvider = ReturnType<typeof wrapTypeSafeAi>;
/** TypeSafe AI provider settings with any Effect services needed by the shared factory adapter. */
export type TypeSafeAiProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<sdk.TypeSafeAiProviderSettings, 'apiKey', E, R>;

/** Version reported by the native TypeSafe AI package. */
export const VERSION = sdk.VERSION;

/** Adapt native TypeSafe AI provider creation to the shared Effect provider boundary. */
export const createTypeSafeAi = adaptProviderFactory<
  sdk.TypeSafeAiProviderSettings,
  'apiKey',
  TypeSafeAiProvider
>('TypeSafeAi.create', ['apiKey'], (options) =>
  wrapTypeSafeAi(sdk.createTypeSafeAi(options)),
);

/** Resolve the SDK's default provider when the Effect runs. */
export const typeSafeAi = runSync('TypeSafeAi.default', () =>
  wrapTypeSafeAi(sdk.typeSafeAi),
);
