import * as sdk from '@ai-sdk/typesafe-ai';
import { runSync } from '../internal/operation.js';
import { adaptMethod, wrapProviderBase } from '../internal/provider-adapter.js';
import {
  wrapDecisionModel,
  wrapEvaluationModel,
} from '../internal/provider-model.js';

export type {
  Experimental_TypeSafeAiDecisionModelId,
  Experimental_TypeSafeAiEvaluationModelId,
  TypeSafeAiDecisionModelOptions,
  TypeSafeAiFilePartProviderOptions,
  TypeSafeAiProviderSettings,
} from '@ai-sdk/typesafe-ai';

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

export type TypeSafeAiProvider = ReturnType<typeof wrapTypeSafeAi>;

export const VERSION = sdk.VERSION;

export const createTypeSafeAi = (options?: sdk.TypeSafeAiProviderSettings) =>
  runSync('TypeSafeAi.create', () =>
    wrapTypeSafeAi(sdk.createTypeSafeAi(options)),
  );

export const typeSafeAi = runSync('TypeSafeAi.default', () =>
  wrapTypeSafeAi(sdk.typeSafeAi),
);
