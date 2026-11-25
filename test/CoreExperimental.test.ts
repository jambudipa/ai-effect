import { describe, expect, it } from '@effect/vitest';
import { Effect, Schema, Stream } from 'effect';
import { expectTypeOf } from 'vitest';
import {
  experimental_decide,
  experimental_decodeRealtimeAudio,
  experimental_encodeRealtimeAudio,
  experimental_getRealtimeToolDefinitions,
  experimental_resampleAudio,
  experimental_getBatchStatus,
  experimental_startBatch,
  experimental_streamSpeech,
} from '../src/core-experimental.js';
import {
  wrapDecisionModel,
  wrapSpeechModel,
} from '../src/internal/provider-model.js';
import {
  wrapBatch,
  wrapFiles,
  wrapSkills,
} from '../src/internal/provider-resource.js';
import { createDownload, uploadFile, uploadSkill } from '../src/core-files.js';
import { tool } from '../src/internal/tool.js';
import { Output, unwrapOutput } from '../src/internal/output.js';
import {
  unwrapTelemetry,
  wrapTelemetryEvent,
} from '../src/integrations/internal/telemetry.js';

describe('experimental Core adapters', () => {
  it.effect('keeps decision criteria in the result type', () =>
    Effect.gen(function* () {
      const model = wrapDecisionModel({
        specificationVersion: 'v4',
        provider: 'fixture',
        modelId: 'decision',
        supportedQuestionTypes: ['choice'],
        doDecide: (options) => {
          expect(options.abortSignal).toBeInstanceOf(AbortSignal);
          return Effect.runPromise(
            Effect.succeed({
              answers: { verdict: { type: 'choice', choice: 'alpha' } },
              warnings: [],
            }),
          );
        },
      });

      const result = yield* experimental_decide({
        model,
        state: 'Fixture state',
        questions: {
          verdict: {
            type: 'choice',
            criteria: { alpha: 'First choice', beta: 'Second choice' },
          },
        },
      });
      expectTypeOf(result.answers.verdict.choice).toEqualTypeOf<
        'alpha' | 'beta'
      >();
      expect(result.answers.verdict.choice).toBe('alpha');
    }),
  );

  it.effect('passes batch operations through a private provider handle', () =>
    Effect.gen(function* () {
      const batch = wrapBatch<{ text: 'batch-model' }>({
        specificationVersion: 'v4',
        provider: 'fixture',
        supportedUrls: {},
        doStartBatch: (options) => {
          expect(options.requests[0]?.modelId).toBe('batch-model');
          return Effect.runPromise(
            Effect.succeed({
              batchId: 'batch-fixture',
              status: 'pending',
              warnings: [],
            }),
          );
        },
        doGetBatchStatus: (options) => {
          expect(options.batchId).toBe('batch-fixture');
          return Effect.runPromise(Effect.succeed({ status: 'completed' }));
        },
        doGetBatchResults: () =>
          Effect.runPromise(
            Effect.succeed(
              new ReadableStream({
                start(controller) {
                  controller.close();
                },
              }),
            ),
          ),
      });

      const start = yield* experimental_startBatch({
        provider: batch,
        requests: [
          {
            type: 'text',
            id: 'request',
            model: 'batch-model',
            prompt: 'Fixture prompt',
          },
        ],
      });
      expect(start.status).toBe('pending');

      const status = yield* experimental_getBatchStatus({
        provider: batch,
        batch: { version: 2, id: 'batch-fixture', provider: 'fixture' },
      });
      expect(status.status).toBe('completed');
    }),
  );

  it.effect(
    'wraps the output and integration handles in telemetry events',
    () =>
      Effect.gen(function* () {
        const output = yield* Output.text();
        const nativeOutput = unwrapOutput(output);
        const nativeTelemetry = { onError: () => {} };
        const event = wrapTelemetryEvent({
          output: nativeOutput,
          integrations: [nativeTelemetry],
        });

        expect(Effect.isEffect(event.output.responseFormat)).toBe(true);
        expect(unwrapOutput(event.output)).toBe(nativeOutput);
        const [integration] = event.integrations;
        expect(integration && unwrapTelemetry(integration)).toBe(
          nativeTelemetry,
        );
      }),
  );

  it.effect('interrupts a speech stream when its scope closes', () =>
    Effect.gen(function* () {
      let callerSignal: AbortSignal | undefined;
      const model = wrapSpeechModel({
        specificationVersion: 'v4',
        provider: 'fixture',
        modelId: 'speech',
        doGenerate: () =>
          Effect.runPromise(Effect.die('Unexpected full speech request.')),
        doStream: (options) => {
          callerSignal = options.abortSignal;
          return Effect.runPromise(
            Effect.succeed({
              stream: new ReadableStream({
                start(controller) {
                  controller.enqueue({
                    type: 'audio',
                    audio: new Uint8Array([1, 2]),
                    audioFormat: { type: 'pcm', rate: 16000 },
                  });
                },
              }),
            }),
          );
        },
      });

      const audio = yield* Effect.scoped(
        Effect.gen(function* () {
          const result = yield* experimental_streamSpeech({
            model,
            text: 'Fixture text',
          });
          return yield* Stream.runCollect(Stream.take(result.audioStream, 1));
        }),
      );
      expect(audio).toEqual([new Uint8Array([1, 2])]);
      expect(callerSignal?.aborted).toBe(true);
    }),
  );

  it.effect('uploads through wrapped file and skill APIs', () =>
    Effect.gen(function* () {
      const files = wrapFiles({
        specificationVersion: 'v4',
        provider: 'fixture',
        uploadFile: (options) => {
          expect(options.mediaType).toBe('text/plain');
          expect(options.abortSignal).toBeInstanceOf(AbortSignal);
          return Effect.runPromise(
            Effect.succeed({
              providerReference: { fixture: 'file-fixture' },
              warnings: [],
            }),
          );
        },
      });
      const skills = wrapSkills({
        specificationVersion: 'v4',
        provider: 'fixture',
        uploadSkill: (options) => {
          expect(options.files[0]?.path).toBe('SKILL.md');
          return Effect.runPromise(
            Effect.succeed({
              providerReference: { fixture: 'skill-fixture' },
              warnings: [],
            }),
          );
        },
      });

      const file = yield* uploadFile({
        api: { files: () => Effect.succeed(files) },
        data: 'Fixture content',
        mediaType: 'text/plain',
      });
      expect(file.providerReference).toEqual({ fixture: 'file-fixture' });

      const skill = yield* uploadSkill({
        api: skills,
        files: [{ path: 'SKILL.md', data: '# Fixture skill' }],
      });
      expect(skill.providerReference).toEqual({ fixture: 'skill-fixture' });
    }),
  );

  it.effect('keeps the single and batch download forms', () =>
    Effect.gen(function* () {
      const download = yield* createDownload({
        fetch: (_url, init) => {
          expect(init?.signal).toBeInstanceOf(AbortSignal);
          return Effect.runPromise(
            Effect.succeed(
              new Response('Fixture content', {
                headers: { 'content-type': 'text/plain' },
              }),
            ),
          );
        },
      });
      const url = new URL('https://fixture.invalid/file.txt');
      const single = yield* download({ url });
      expect(new TextDecoder().decode(single.data)).toBe('Fixture content');

      const batch = yield* download([
        { url, isUrlSupportedByModel: true },
        { url, isUrlSupportedByModel: false },
      ]);
      expect(batch[0]).toBeNull();
      expect(batch[1]).toEqual(single);
    }),
  );

  it.effect('uses Effect tools and audio data in realtime adapters', () =>
    Effect.gen(function* () {
      const echo = tool({
        inputSchema: Schema.Struct({ text: Schema.String }),
        execute: ({ text }) => Effect.succeed(text),
      });
      const definitions = yield* experimental_getRealtimeToolDefinitions({
        tools: { echo },
      });
      expect(definitions.map((definition) => definition.name)).toEqual([
        'echo',
      ]);

      const samples = new Float32Array([0.25, -0.25, 0.25, -0.25]);
      const decoded = experimental_decodeRealtimeAudio(
        experimental_encodeRealtimeAudio(samples),
      );
      expect(decoded[0]).toBeCloseTo(0.25);
      expect(experimental_resampleAudio(decoded, 16000, 8000)).toHaveLength(2);
    }),
  );
});
