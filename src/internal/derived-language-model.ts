import { NoSuchModelError } from '@ai-sdk/provider';
import type { LanguageModelV4 as Native } from '@ai-sdk/provider';
import { Effect } from 'effect';
import { unwrapLanguageModel, type LanguageModelV4 } from './language-model.js';
import { runSync, sdkError } from './operation.js';

export function withLanguageModel<A>(
  operation: string,
  model: LanguageModelV4,
  use: (native: Native) => A,
) {
  return Effect.suspend(() => {
    const native = unwrapLanguageModel(model);
    if (native) return runSync(operation, () => use(native));
    return Effect.fail(
      sdkError(
        operation,
        new NoSuchModelError({
          modelType: 'languageModel',
          modelId: model.modelId,
        }),
      ),
    );
  });
}
