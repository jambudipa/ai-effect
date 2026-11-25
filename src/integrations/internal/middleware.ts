import type { LanguageModelV4Middleware } from '@ai-sdk/provider';
import { wrapLanguageModel as sdkWrapLanguageModel } from 'ai';
import { Effect } from 'effect';
import {
  type LanguageModelV4,
  unwrapLanguageModel,
  wrapLanguageModel,
} from '../../internal/language-model.js';
import { runSync, sdkError } from '../../internal/operation.js';

export const wrapMiddleware = (
  operation: string,
  middleware: LanguageModelV4Middleware,
) => ({
  specificationVersion: middleware.specificationVersion,
  apply: (model: LanguageModelV4) =>
    Effect.suspend(() => {
      const native = unwrapLanguageModel(model);
      if (!native) {
        return Effect.fail(sdkError(operation, 'Invalid language model'));
      }
      return runSync(operation, () =>
        wrapLanguageModel(sdkWrapLanguageModel({ model: native, middleware })),
      );
    }),
});
