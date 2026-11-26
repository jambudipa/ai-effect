import { expect, it } from '@effect/vitest';
import type { OpenAICompatibleImageModel as NativeImageModel } from '@ai-sdk/openai-compatible';
import { Effect, Option } from 'effect';
import { expectTypeOf, vi } from 'vitest';
import { runRequest } from '../src/internal/operation.js';
import { unwrapImageModel } from '../src/internal/provider-model.js';
import {
  WORKFLOW_DESERIALIZE,
  WORKFLOW_SERIALIZE,
} from '../src/protocols/provider-utils.js';
import { byteDance } from '../src/providers/bytedance.js';
import {
  CartesiaSpeechModel,
  CartesiaTranscriptionModel,
} from '../src/providers/cartesia.js';
import { DeepgramSpeechModel } from '../src/providers/deepgram.js';
import {
  FishAudioSpeechModel,
  FishAudioTranscriptionModel,
} from '../src/providers/fish-audio.js';
import {
  Experimental_GoogleSpeechTranslationModel,
  Experimental_GoogleTranslationModel,
  GoogleTranscriptionModel,
} from '../src/providers/google.js';
import { GoogleVertexGeminiTranscriptionModel } from '../src/providers/google-vertex.js';
import {
  Experimental_OpenAISpeechTranslationModel,
  Experimental_OpenAITranslationModel,
} from '../src/providers/openai.js';
import {
  OpenAICompatibleChatLanguageModel,
  OpenAICompatibleCompletionLanguageModel,
  OpenAICompatibleEmbeddingModel,
  OpenAICompatibleImageModel,
} from '../src/providers/openai-compatible.js';

it('keeps both hooks and the translation constructor aliases', () => {
  const constructors = [
    CartesiaSpeechModel,
    CartesiaTranscriptionModel,
    DeepgramSpeechModel,
    FishAudioSpeechModel,
    FishAudioTranscriptionModel,
    Experimental_GoogleSpeechTranslationModel,
    GoogleTranscriptionModel,
    GoogleVertexGeminiTranscriptionModel,
    Experimental_OpenAISpeechTranslationModel,
    OpenAICompatibleChatLanguageModel,
    OpenAICompatibleCompletionLanguageModel,
    OpenAICompatibleEmbeddingModel,
    OpenAICompatibleImageModel,
  ];
  for (const constructor of constructors) {
    expect(Object.hasOwn(constructor, WORKFLOW_SERIALIZE)).toBe(true);
    expect(Object.hasOwn(constructor, WORKFLOW_DESERIALIZE)).toBe(true);
  }
  expect(Experimental_GoogleTranslationModel).toBe(
    Experimental_GoogleSpeechTranslationModel,
  );
  expect(Experimental_OpenAITranslationModel).toBe(
    Experimental_OpenAISpeechTranslationModel,
  );
});

it.effect(
  'uses supplied native callbacks and preserves the serialized URL omission',
  () =>
    Effect.gen(function* () {
      const runNative = Effect.runPromiseWith(yield* Effect.context<never>());
      const unconfiguredFetch = vi.fn(() =>
        runNative(Effect.die('Unexpected network call')),
      );
      yield* Effect.acquireRelease(
        Effect.sync(() => vi.stubGlobal('fetch', unconfiguredFetch)),
        () => Effect.sync(() => vi.unstubAllGlobals()),
      );
      const serialize = OpenAICompatibleImageModel[WORKFLOW_SERIALIZE];
      const deserialize = OpenAICompatibleImageModel[WORKFLOW_DESERIALIZE];
      type Options = Parameters<typeof deserialize>[0];
      expectTypeOf<Options>().toEqualTypeOf<
        Parameters<(typeof NativeImageModel)[typeof WORKFLOW_DESERIALIZE]>[0]
      >();
      expectTypeOf<
        Effect.Success<ReturnType<typeof serialize>>
      >().toEqualTypeOf<
        ReturnType<(typeof NativeImageModel)[typeof WORKFLOW_SERIALIZE]>
      >();

      const baseURL = 'https://workflow-fixture.invalid';
      let urlCalls = 0;
      let headerCalls = 0;
      let fetchCalls = 0;
      const input: Options = {
        modelId: 'fixture-image',
        config: {
          provider: 'workflow-fixture',
          url: ({ modelId, path }) => {
            urlCalls += 1;
            expect(modelId).toBe('fixture-image');
            return baseURL + path;
          },
          headers: () => {
            headerCalls += 1;
            return { 'x-fixture': 'preserved' };
          },
          fetch: (url, options) => {
            fetchCalls += 1;
            expect(String(url)).toBe(baseURL + '/images/generations');
            expect(new Headers(options?.headers).get('x-fixture')).toBe(
              'preserved',
            );
            return runNative(
              Effect.succeed(Response.json({ data: [{ b64_json: 'AQID' }] })),
            );
          },
        },
      };
      const model = yield* deserialize(input);
      expect([urlCalls, headerCalls, fetchCalls]).toEqual([0, 0, 0]);

      const absent = Option.getOrUndefined(Option.none());
      const generation = {
        prompt: 'fixture',
        n: 1,
        size: absent,
        aspectRatio: absent,
        seed: absent,
        files: absent,
        mask: absent,
        providerOptions: {},
      };
      const result = yield* model.doGenerate(generation);
      expect(result.images).toEqual(['AQID']);
      expect([urlCalls, headerCalls, fetchCalls]).toEqual([1, 1, 1]);

      const snapshot = serialize(model);
      expect(headerCalls).toBe(1);
      const payload = yield* snapshot;
      expect(headerCalls).toBe(2);
      expect(payload).toEqual({
        modelId: 'fixture-image',
        config: {
          provider: 'workflow-fixture',
          headers: { 'x-fixture': 'preserved' },
        },
      });

      // The native Workflow reviver passes the raw payload to the constructor.
      const replayed = yield* deserialize(payload as unknown as Options);
      const failure = yield* Effect.flip(replayed.doGenerate(generation));
      expect(failure._tag).toBe('AiSdkError');
      const native = unwrapImageModel(replayed);
      if (!native) return yield* Effect.die('Expected a registered image');
      yield* runRequest('fixture.workflow.nativeFailure', {}, () =>
        expect(native.doGenerate(generation)).rejects.toThrow(
          'this.config.url is not a function',
        ),
      );
      expect(fetchCalls).toBe(1);
      expect(unconfiguredFetch).not.toHaveBeenCalled();

      const other = yield* byteDance.image('seedream-4-5-251128');
      const mismatch = yield* Effect.flip(serialize(other));
      expect(mismatch._tag).toBe('AiSdkError');
    }),
);
