import type {
  LanguageModelV4 as SdkLanguageModelV4,
  LanguageModelV4CallOptions,
  LanguageModelV4StreamPart,
} from '@ai-sdk/provider';
import { Effect, Stream } from 'effect';
import {
  combineSignals,
  openOperation,
  runRequest,
  sdkError,
  type AiSdkError,
} from './operation.js';
import { ownReadable } from './readable.js';

/** An Effect handle to a v4 SDK language model. */
export type LanguageModelV4 = ReturnType<typeof wrapLanguageModel>;

const sdkModels = new WeakMap<LanguageModelV4, SdkLanguageModelV4>();

export const unwrapLanguageModel = (model: LanguageModelV4) =>
  sdkModels.get(model);

export const wrapLanguageModel = (model: SdkLanguageModelV4) => {
  const wrapped = {
    specificationVersion: model.specificationVersion,
    provider: model.provider,
    modelId: model.modelId,
    get supportedUrls() {
      return runRequest('LanguageModelV4.supportedUrls', {}, () =>
        Promise.resolve(model.supportedUrls),
      );
    },
    doGenerate: (options: LanguageModelV4CallOptions) =>
      runRequest('LanguageModelV4.doGenerate', options, (abortSignal) =>
        model.doGenerate({ ...options, abortSignal }),
      ),
    doStream: (options: LanguageModelV4CallOptions) =>
      Effect.gen(function* () {
        const operation = 'LanguageModelV4.doStream';
        const owner = yield* openOperation(options.abortSignal);
        const { stream, ...metadata } = yield* runRequest(
          operation,
          { abortSignal: owner.signal },
          (abortSignal) =>
            Promise.resolve(model.doStream({ ...options, abortSignal })).then(
              (result) => {
                if (abortSignal.aborted) {
                  void result.stream.cancel().catch(() => {});
                  abortSignal.throwIfAborted();
                }
                return result;
              },
            ),
        );
        const readable = yield* ownReadable(operation, stream);
        const output: Stream.Stream<LanguageModelV4StreamPart, AiSdkError> =
          Stream.fromReadableStream({
            evaluate: () => readable,
            onError: (cause) => sdkError(operation, cause),
            releaseLockOnEnd: true,
          });
        return { ...metadata, stream: output };
      }),
  };
  sdkModels.set(wrapped, model);
  return wrapped;
};
