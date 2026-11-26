import * as sdk from 'ai/test';
import type {
  TranscriptionModelV4 as NativeTranscription,
  Experimental_VideoModelV4 as NativeVideo,
} from '@ai-sdk/provider';
import { EXPERIMENTAL_EMBEDDING_MODEL_MAX_INPUT_BYTES_PER_CALL } from '@ai-sdk/provider-utils';
import { Effect } from 'effect';
import { wrapLanguageModel } from './internal/language-model.js';
import { wrapLegacyModel } from './internal/legacy-model.js';
import { mockModel, type MockOptions } from './internal/mock-model.js';
import { mockProvider } from './internal/mock-provider.js';
import {
  type AiSdkError,
  openOperation,
  runRequest,
  runSync,
} from './internal/operation.js';
import {
  lazyValue,
  wrapEmbeddingModel,
  wrapEvaluationModel,
  wrapExtractionModel,
  wrapImageModel,
  wrapRerankingModel,
  wrapSpeechModel,
  wrapSpeechTranslationModel,
  wrapStreamingSpeechModel,
  wrapTranscriptionModel,
  wrapVideoModel,
} from './internal/provider-model.js';
import type * as models from './protocols/provider.js';

export * from './internal/sdk-data/testing.js';
export { simulateReadableStream } from './internal/simulate-readable.js';
export {
  convertArrayToAsyncIterable,
  convertArrayToReadableStream,
  convertReadableStreamToArray,
  mockId,
} from './protocols/provider-utils/test.js';

export const MockProviderV3 = mockProvider<
  'v3',
  {
    language: models.LanguageModelV3;
    embedding: models.EmbeddingModelV3;
    image: models.ImageModelV3;
    transcription: models.TranscriptionModelV3;
    speech: models.SpeechModelV3;
    reranking: models.RerankingModelV3;
  }
>('v3');

export const MockProviderV4 = mockProvider<
  'v4',
  {
    language: models.LanguageModelV4;
    embedding: models.EmbeddingModelV4;
    image: models.ImageModelV4;
    transcription: models.TranscriptionModelV4;
    speech: models.SpeechModelV4;
    reranking: models.RerankingModelV4;
  }
>('v4');

export type MockProviderV3 = Effect.Success<ReturnType<typeof MockProviderV3>>;
export type MockProviderV4 = Effect.Success<ReturnType<typeof MockProviderV4>>;

export type MockLanguageModelV4Options<Services = never> = MockOptions<
  NonNullable<ConstructorParameters<typeof sdk.MockLanguageModelV4>[0]>,
  Services
>;

export const MockLanguageModelV4 = mockModel(
  'MockLanguageModelV4',
  sdk.MockLanguageModelV4,
  wrapLanguageModel,
  'doGenerateCalls',
  'doStreamCalls',
);

export const MockEmbeddingModelV4 = mockModel(
  'MockEmbeddingModelV4',
  sdk.MockEmbeddingModelV4,
  (model) =>
    Object.assign(wrapEmbeddingModel(model), {
      [EXPERIMENTAL_EMBEDDING_MODEL_MAX_INPUT_BYTES_PER_CALL]: lazyValue(
        'MockEmbeddingModelV4.maxInputBytesPerCall',
        () => model[EXPERIMENTAL_EMBEDDING_MODEL_MAX_INPUT_BYTES_PER_CALL],
      ),
    }),
  'doEmbedCalls',
);

export const MockLanguageModelV3 = mockModel(
  'MockLanguageModelV3',
  sdk.MockLanguageModelV3,
  wrapLegacyModel,
  'doGenerateCalls',
  'doStreamCalls',
);
export const MockEmbeddingModelV3 = mockModel(
  'MockEmbeddingModelV3',
  sdk.MockEmbeddingModelV3,
  wrapLegacyModel,
  'doEmbedCalls',
);
export const MockImageModelV3 = mockModel(
  'MockImageModelV3',
  sdk.MockImageModelV3,
  wrapLegacyModel,
);
export const MockSpeechModelV3 = mockModel(
  'MockSpeechModelV3',
  sdk.MockSpeechModelV3,
  wrapLegacyModel,
);
export const MockTranscriptionModelV3 = mockModel(
  'MockTranscriptionModelV3',
  sdk.MockTranscriptionModelV3,
  wrapLegacyModel,
);
export const MockRerankingModelV3 = mockModel(
  'MockRerankingModelV3',
  sdk.MockRerankingModelV3,
  wrapLegacyModel,
);
export const MockVideoModelV3 = mockModel(
  'MockVideoModelV3',
  sdk.MockVideoModelV3,
  wrapLegacyModel,
);

export type MockLanguageModelV3 = Effect.Success<
  ReturnType<typeof MockLanguageModelV3>
>;
export type MockEmbeddingModelV3 = Effect.Success<
  ReturnType<typeof MockEmbeddingModelV3>
>;
export type MockImageModelV3 = Effect.Success<
  ReturnType<typeof MockImageModelV3>
>;
export type MockSpeechModelV3 = Effect.Success<
  ReturnType<typeof MockSpeechModelV3>
>;
export type MockTranscriptionModelV3 = Effect.Success<
  ReturnType<typeof MockTranscriptionModelV3>
>;
export type MockRerankingModelV3 = Effect.Success<
  ReturnType<typeof MockRerankingModelV3>
>;
export type MockVideoModelV3 = Effect.Success<
  ReturnType<typeof MockVideoModelV3>
>;

export const MockImageModelV4 = mockModel(
  'MockImageModelV4',
  sdk.MockImageModelV4,
  wrapImageModel,
);
export const MockSpeechModelV4 = mockModel(
  'MockSpeechModelV4',
  sdk.MockSpeechModelV4,
  wrapSpeechModel,
);

export const MockTranscriptionModelV4 = mockModel(
  'MockTranscriptionModelV4',
  sdk.MockTranscriptionModelV4,
  // The published fixture uses explicit undefined for optional native methods.
  (native: sdk.MockTranscriptionModelV4) =>
    wrapTranscriptionModel(native as NativeTranscription),
);

export const MockRerankingModelV4 = mockModel(
  'MockRerankingModelV4',
  sdk.MockRerankingModelV4,
  wrapRerankingModel,
);
const makeMockVideoModelV4 = mockModel(
  'MockVideoModelV4',
  sdk.MockVideoModelV4,
  (native: sdk.MockVideoModelV4) => wrapVideoModel(native as NativeVideo),
);

type MockVideoNotification = models.Experimental_VideoModelV4OperationWebhook;
type MockVideoOptions<Services> = Omit<
  MockOptions<
    NonNullable<ConstructorParameters<typeof sdk.MockVideoModelV4>[0]>,
    Services
  >,
  'handleWebhookOption'
> & {
  readonly handleWebhookOption?: (options: {
    readonly webhook: () => Effect.Effect<
      {
        readonly url: string;
        readonly received: Effect.Effect<MockVideoNotification, AiSdkError>;
      },
      AiSdkError
    >;
  }) => Effect.Effect<
    {
      readonly webhookUrl: string;
      readonly received: Effect.Effect<
        MockVideoNotification,
        unknown,
        Services
      >;
    },
    unknown,
    Services
  >;
};

export const MockVideoModelV4 = <Services = never>(
  options?: MockVideoOptions<Services>,
) =>
  Effect.suspend(() => {
    const { handleWebhookOption, ...settings } = options ?? {};
    if (handleWebhookOption === undefined) {
      return makeMockVideoModelV4<Services>(settings);
    }
    return Effect.gen(function* () {
      const owner = yield* openOperation<Services>();
      return yield* makeMockVideoModelV4<Services>({
        ...settings,
        handleWebhookOption: ({ webhook }) =>
          handleWebhookOption({
            webhook: () =>
              runRequest('MockVideoModelV4.webhook', {}, () => webhook()).pipe(
                Effect.map(({ url, received }) => ({
                  url,
                  received: runRequest(
                    'MockVideoModelV4.webhook.received',
                    {},
                    () => received,
                  ),
                })),
              ),
          }).pipe(
            Effect.map(({ webhookUrl, received }) => {
              const pending = owner.runCallback(received);
              // The native caller can defer observing the delivery.
              void pending.catch(() => {});
              return { webhookUrl, received: pending };
            }),
          ),
      });
    });
  });

export const Experimental_DecisionMockModelV4 = mockModel(
  'Experimental_DecisionMockModelV4',
  sdk.Experimental_DecisionMockModelV4,
  wrapEvaluationModel,
);

export const Experimental_EvaluationMockModelV4 = mockModel(
  'Experimental_EvaluationMockModelV4',
  sdk.Experimental_EvaluationMockModelV4,
  wrapEvaluationModel,
);

export const Experimental_ExtractionMockModelV4 = mockModel(
  'Experimental_ExtractionMockModelV4',
  sdk.Experimental_ExtractionMockModelV4,
  wrapExtractionModel,
);

export const Experimental_MockSpeechTranslationModelV4 = mockModel(
  'Experimental_MockSpeechTranslationModelV4',
  sdk.Experimental_MockSpeechTranslationModelV4,
  wrapSpeechTranslationModel,
);

export const Experimental_MockStreamingSpeechModelV4 = mockModel(
  'Experimental_MockStreamingSpeechModelV4',
  sdk.Experimental_MockStreamingSpeechModelV4,
  wrapStreamingSpeechModel,
);

export const mockValues = <A>(...values: A[]) =>
  runSync('mockValues', () => sdk.mockValues(...values)).pipe(
    Effect.map((next) => () => runSync('mockValues.next', next)),
  );

export type MockLanguageModelV4 = Effect.Success<
  ReturnType<typeof MockLanguageModelV4>
>;
export type MockEmbeddingModelV4 = Effect.Success<
  ReturnType<typeof MockEmbeddingModelV4>
>;
export type MockImageModelV4 = Effect.Success<
  ReturnType<typeof MockImageModelV4>
>;
export type MockSpeechModelV4 = Effect.Success<
  ReturnType<typeof MockSpeechModelV4>
>;
export type MockTranscriptionModelV4 = Effect.Success<
  ReturnType<typeof MockTranscriptionModelV4>
>;
export type MockRerankingModelV4 = Effect.Success<
  ReturnType<typeof MockRerankingModelV4>
>;
export type MockVideoModelV4 = Effect.Success<
  ReturnType<typeof MockVideoModelV4>
>;
export type Experimental_DecisionMockModelV4 = Effect.Success<
  ReturnType<typeof Experimental_DecisionMockModelV4>
>;
export type Experimental_EvaluationMockModelV4 = Effect.Success<
  ReturnType<typeof Experimental_EvaluationMockModelV4>
>;
export type Experimental_ExtractionMockModelV4 = Effect.Success<
  ReturnType<typeof Experimental_ExtractionMockModelV4>
>;
export type Experimental_MockSpeechTranslationModelV4 = Effect.Success<
  ReturnType<typeof Experimental_MockSpeechTranslationModelV4>
>;
export type Experimental_MockStreamingSpeechModelV4 = Effect.Success<
  ReturnType<typeof Experimental_MockStreamingSpeechModelV4>
>;
