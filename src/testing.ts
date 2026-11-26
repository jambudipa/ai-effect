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

/** Construct a v3 provider test double with configurable model lookup behavior. */
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

/** Construct a v4 provider test double with configurable model lookups. */
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

/** Type a successfully created mock that uses version 3 provider capability names. */
export type MockProviderV3 = Effect.Success<ReturnType<typeof MockProviderV3>>;
/** Type a mock provider with version 4 capability names and Effect lookups. */
export type MockProviderV4 = Effect.Success<ReturnType<typeof MockProviderV4>>;

/** Configure version 4 language model results and callbacks in the test Effect context. */
export type MockLanguageModelV4Options<Services = never> = MockOptions<
  NonNullable<ConstructorParameters<typeof sdk.MockLanguageModelV4>[0]>,
  Services
>;

/** Simulate v4 generation and streaming and expose snapshots of native call arguments. */
export const MockLanguageModelV4 = mockModel(
  'MockLanguageModelV4',
  sdk.MockLanguageModelV4,
  wrapLanguageModel,
  'doGenerateCalls',
  'doStreamCalls',
);

/** Simulate v4 embeddings and expose native call history for assertions. */
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

/** Simulate legacy generation and streaming while preserving native v3 call history. */
export const MockLanguageModelV3 = mockModel(
  'MockLanguageModelV3',
  sdk.MockLanguageModelV3,
  wrapLegacyModel,
  'doGenerateCalls',
  'doStreamCalls',
);
/** Simulate legacy embeddings and retain the tested call arguments. */
export const MockEmbeddingModelV3 = mockModel(
  'MockEmbeddingModelV3',
  sdk.MockEmbeddingModelV3,
  wrapLegacyModel,
  'doEmbedCalls',
);
/** Create a version 3 image model test double for legacy adapter coverage. */
export const MockImageModelV3 = mockModel(
  'MockImageModelV3',
  sdk.MockImageModelV3,
  wrapLegacyModel,
);
/** Create a version 3 speech model test double for legacy adapter coverage. */
export const MockSpeechModelV3 = mockModel(
  'MockSpeechModelV3',
  sdk.MockSpeechModelV3,
  wrapLegacyModel,
);
/** Create a version 3 transcription test double without a remote audio service. */
export const MockTranscriptionModelV3 = mockModel(
  'MockTranscriptionModelV3',
  sdk.MockTranscriptionModelV3,
  wrapLegacyModel,
);
/** Create a version 3 reranking test double for legacy model lookup tests. */
export const MockRerankingModelV3 = mockModel(
  'MockRerankingModelV3',
  sdk.MockRerankingModelV3,
  wrapLegacyModel,
);
/** Create a version 3 video test double for legacy model registration tests. */
export const MockVideoModelV3 = mockModel(
  'MockVideoModelV3',
  sdk.MockVideoModelV3,
  wrapLegacyModel,
);

/** Type the registered v3 language model test double and its exposed call history. */
export type MockLanguageModelV3 = Effect.Success<
  ReturnType<typeof MockLanguageModelV3>
>;
/** Type the registered v3 embedding test double and its exposed call history. */
export type MockEmbeddingModelV3 = Effect.Success<
  ReturnType<typeof MockEmbeddingModelV3>
>;
/** Use a legacy image model mock where a version 3 request is expected. */
export type MockImageModelV3 = Effect.Success<
  ReturnType<typeof MockImageModelV3>
>;
/** Use a legacy speech model mock in version 3 synthesis requests. */
export type MockSpeechModelV3 = Effect.Success<
  ReturnType<typeof MockSpeechModelV3>
>;
/** Use a legacy transcription mock in version 3 audio requests. */
export type MockTranscriptionModelV3 = Effect.Success<
  ReturnType<typeof MockTranscriptionModelV3>
>;
/** Use a legacy reranking mock in version 3 document requests. */
export type MockRerankingModelV3 = Effect.Success<
  ReturnType<typeof MockRerankingModelV3>
>;
/** Use a legacy video mock through its version 3 model handle. */
export type MockVideoModelV3 = Effect.Success<
  ReturnType<typeof MockVideoModelV3>
>;

/** Construct a registered image model backed by SDK mock results. */
export const MockImageModelV4 = mockModel(
  'MockImageModelV4',
  sdk.MockImageModelV4,
  wrapImageModel,
);
/** Construct a registered speech synthesis model backed by SDK mock results. */
export const MockSpeechModelV4 = mockModel(
  'MockSpeechModelV4',
  sdk.MockSpeechModelV4,
  wrapSpeechModel,
);

/** Construct a registered transcription model backed by SDK mock results. */
export const MockTranscriptionModelV4 = mockModel(
  'MockTranscriptionModelV4',
  sdk.MockTranscriptionModelV4,
  // The published fixture uses explicit undefined for optional native methods.
  (native: sdk.MockTranscriptionModelV4) =>
    wrapTranscriptionModel(native as NativeTranscription),
);

/** Construct a registered reranking model backed by SDK mock results. */
export const MockRerankingModelV4 = mockModel(
  'MockRerankingModelV4',
  sdk.MockRerankingModelV4,
  wrapRerankingModel,
);
/** Create a registered native v4 video mock before adapting webhook handlers. */
const makeMockVideoModelV4 = mockModel(
  'MockVideoModelV4',
  sdk.MockVideoModelV4,
  (native: sdk.MockVideoModelV4) => wrapVideoModel(native as NativeVideo),
);

/** Carry the SDK video webhook notification data used by the mock handler. */
type MockVideoNotification = models.Experimental_VideoModelV4OperationWebhook;
/** Allow test video callbacks to use Effect services and receive native webhook data. */
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

/** Create a version 4 video model mock with Effect-compatible webhook callbacks. */
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

/** Simulate decision model responses without requesting a remote model. */
export const Experimental_DecisionMockModelV4 = mockModel(
  'Experimental_DecisionMockModelV4',
  sdk.Experimental_DecisionMockModelV4,
  wrapEvaluationModel,
);

/** Simulate evaluation model responses using the SDK compatibility model class. */
export const Experimental_EvaluationMockModelV4 = mockModel(
  'Experimental_EvaluationMockModelV4',
  sdk.Experimental_EvaluationMockModelV4,
  wrapEvaluationModel,
);

/** Simulate structured extraction responses for a registered extraction handle. */
export const Experimental_ExtractionMockModelV4 = mockModel(
  'Experimental_ExtractionMockModelV4',
  sdk.Experimental_ExtractionMockModelV4,
  wrapExtractionModel,
);

/** Simulate the SDK's speech translation model without a remote audio service. */
export const Experimental_MockSpeechTranslationModelV4 = mockModel(
  'Experimental_MockSpeechTranslationModelV4',
  sdk.Experimental_MockSpeechTranslationModelV4,
  wrapSpeechTranslationModel,
);

/** Simulate streaming speech through the SDK model test double. */
export const Experimental_MockStreamingSpeechModelV4 = mockModel(
  'Experimental_MockStreamingSpeechModelV4',
  sdk.Experimental_MockStreamingSpeechModelV4,
  wrapStreamingSpeechModel,
);

/** Build a lazy supplier that advances through the SDK mock value sequence on execution. */
export const mockValues = <A>(...values: A[]) =>
  runSync('mockValues', () => sdk.mockValues(...values)).pipe(
    Effect.map((next) => () => runSync('mockValues.next', next)),
  );

/** Type the v4 language test model and its native generation and stream call snapshots. */
export type MockLanguageModelV4 = Effect.Success<
  ReturnType<typeof MockLanguageModelV4>
>;
/** Type the v4 embedding test model and its exposed call snapshots. */
export type MockEmbeddingModelV4 = Effect.Success<
  ReturnType<typeof MockEmbeddingModelV4>
>;
/** Use the registered v4 image test model as a generation input. */
export type MockImageModelV4 = Effect.Success<
  ReturnType<typeof MockImageModelV4>
>;
/** Use the registered v4 speech test model as a synthesis input. */
export type MockSpeechModelV4 = Effect.Success<
  ReturnType<typeof MockSpeechModelV4>
>;
/** Use the registered v4 transcription test model as an audio request input. */
export type MockTranscriptionModelV4 = Effect.Success<
  ReturnType<typeof MockTranscriptionModelV4>
>;
/** Use the registered v4 reranking test model as a document scoring input. */
export type MockRerankingModelV4 = Effect.Success<
  ReturnType<typeof MockRerankingModelV4>
>;
/** Use the registered v4 video test model for requests and webhook assertions. */
export type MockVideoModelV4 = Effect.Success<
  ReturnType<typeof MockVideoModelV4>
>;
/** Use the registered decision test model when testing a decision request. */
export type Experimental_DecisionMockModelV4 = Effect.Success<
  ReturnType<typeof Experimental_DecisionMockModelV4>
>;
/** Use the registered evaluation test model when exercising compatibility names. */
export type Experimental_EvaluationMockModelV4 = Effect.Success<
  ReturnType<typeof Experimental_EvaluationMockModelV4>
>;
/** Use the registered extraction test model for structured output requests. */
export type Experimental_ExtractionMockModelV4 = Effect.Success<
  ReturnType<typeof Experimental_ExtractionMockModelV4>
>;
/** Use the registered speech translation test model for audio translation. */
export type Experimental_MockSpeechTranslationModelV4 = Effect.Success<
  ReturnType<typeof Experimental_MockSpeechTranslationModelV4>
>;
/** Use the registered streaming speech test model for incremental audio tests. */
export type Experimental_MockStreamingSpeechModelV4 = Effect.Success<
  ReturnType<typeof Experimental_MockStreamingSpeechModelV4>
>;
