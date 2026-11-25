import { describe, expect, it } from '@effect/vitest';
import { Context, Effect, Layer, Stream } from 'effect';
import { expectTypeOf } from 'vitest';
import { wrapLegacyModel } from '../src/internal/legacy-model.js';
import { openOperation, sdkError } from '../src/internal/operation.js';
import { readMethod } from '../src/internal/provider-model.js';
import type { ProviderToolHandle } from '../src/internal/provider-tool.js';
import { anthropic } from '../src/providers/anthropic.js';
import { bindProviderTool } from '../src/internal/provider-tool.js';
import { createCerebras } from '../src/providers/cerebras.js';
import type { HeyGenVideoAsset } from '../src/providers/heygen.js';
import type { OpenAIComputerAction } from '../src/providers/openai.js';
import { openai } from '../src/providers/openai.js';
import { createOpenAICompatible } from '../src/providers/openai-compatible.js';

class ToolOutput extends Context.Service<ToolOutput, string>()(
  '@jambudipa/ai-effect/test/ToolOutput',
) {}

describe('provider adapters', () => {
  it('preserves the pinned Zod union discriminators', () => {
    expectTypeOf<HeyGenVideoAsset['type']>().toEqualTypeOf<
      'url' | 'asset_id' | 'base64'
    >();
    expectTypeOf<
      Extract<OpenAIComputerAction, { type: 'type' }>['text']
    >().toEqualTypeOf<string>();
    expectTypeOf<
      Extract<OpenAIComputerAction, { type: 'screenshot' }>
    >().toEqualTypeOf<{ type: 'screenshot' }>();
  });

  it.effect('keeps model selection and embedding requests lazy', () =>
    Effect.gen(function* () {
      let requests = 0;
      const provider = yield* createOpenAICompatible<
        'chat-fixture',
        'completion-fixture',
        'embedding-fixture',
        'image-fixture'
      >({
        name: 'fixture',
        baseURL: 'https://fixture.invalid/v1',
        fetch: (request, init) => {
          requests += 1;
          expect(String(request)).toBe('https://fixture.invalid/v1/embeddings');
          expect(init?.signal).toBeInstanceOf(AbortSignal);
          return Effect.runPromise(
            Effect.succeed(
              Response.json({
                data: [{ embedding: [0.25, 0.75] }],
                usage: { prompt_tokens: 2 },
              }),
            ),
          );
        },
      });

      expectTypeOf<
        Parameters<typeof provider.embeddingModel>[0]
      >().toEqualTypeOf<'embedding-fixture'>();
      const model = yield* provider.embeddingModel('embedding-fixture');
      const request = model.doEmbed({ values: ['fixture'] });
      expect(requests).toBe(0);

      const result = yield* request;
      expect(result.embeddings).toEqual([[0.25, 0.75]]);
      expect(result.usage).toEqual({ tokens: 2 });
      expect(requests).toBe(1);
    }),
  );

  it.effect('resolves a new credential for each SDK request', () =>
    Effect.gen(function* () {
      let resolutions = 0;
      const provider = yield* createCerebras({
        apiKey: Effect.sync(() => `fixture-${++resolutions}`),
        baseURL: 'https://fixture.invalid/v1',
        fetch: (_request, init) => {
          expect(new Headers(init?.headers).get('authorization')).toBe(
            `Bearer fixture-${resolutions}`,
          );
          return Effect.runPromise(
            Effect.succeed(
              Response.json({
                id: 'fixture',
                model: 'gpt-oss-120b',
                choices: [
                  {
                    message: { role: 'assistant', content: 'result' },
                    finish_reason: 'stop',
                  },
                ],
                usage: {
                  prompt_tokens: 1,
                  completion_tokens: 1,
                  total_tokens: 2,
                },
              }),
            ),
          );
        },
      });

      const model = yield* provider.chat('gpt-oss-120b');
      const request = model.doGenerate({
        prompt: [{ role: 'user', content: [{ type: 'text', text: 'test' }] }],
      });
      expect(resolutions).toBe(0);
      yield* request;
      yield* request;
      expect(resolutions).toBe(2);
    }),
  );

  it.effect('runs a custom metadata extractor in the provider scope', () =>
    Effect.gen(function* () {
      const provider = yield* createOpenAICompatible({
        name: 'fixture',
        baseURL: 'https://fixture.invalid/v1',
        metadataExtractor: {
          extractMetadata: () =>
            Effect.gen(function* () {
              return { fixture: { label: yield* ToolOutput } };
            }),
          createStreamExtractor: () => ({
            processChunk: () => {},
            buildMetadata: () => ({ fixture: {} }),
          }),
        },
        fetch: () =>
          Effect.runPromise(
            Effect.succeed(
              Response.json({
                id: 'fixture',
                model: 'chat-fixture',
                choices: [
                  {
                    message: { role: 'assistant', content: 'result' },
                    finish_reason: 'stop',
                  },
                ],
                usage: {
                  prompt_tokens: 1,
                  completion_tokens: 1,
                  total_tokens: 2,
                },
              }),
            ),
          ),
      });
      const model = yield* provider('chat-fixture');
      const result = yield* model.doGenerate({
        prompt: [{ role: 'user', content: [{ type: 'text', text: 'test' }] }],
      });
      expect(result.providerMetadata?.fixture).toEqual({
        label: 'scope label',
      });
    }).pipe(Effect.provide(Layer.succeed(ToolOutput, 'scope label'))),
  );

  it.effect('binds tool callbacks to the request owner', () =>
    Effect.gen(function* () {
      const tool = yield* openai.tools.applyPatch({
        execute: (input) =>
          Effect.gen(function* () {
            const prefix = yield* ToolOutput;
            return {
              status: 'completed' as const,
              output: prefix + input.callId,
            };
          }),
      });
      const owner = yield* openOperation<ToolOutput>();
      const execute = bindProviderTool(tool, owner).execute;
      expect(typeof execute).toBe('function');
      const result = yield* Effect.tryPromise({
        try: () =>
          Effect.runPromise(
            Effect.succeed(
              execute?.(
                {
                  callId: '1',
                  operation: { type: 'delete_file', path: 'fixture.txt' },
                },
                { toolCallId: '1', messages: [], context: {} },
              ),
            ),
          ),
        catch: (cause) => sdkError('test.providerTool', cause),
      });
      expect(result).toEqual({ status: 'completed', output: 'run 1' });

      const inferred = yield* anthropic.tools.bash_20241022({
        execute: () => Effect.succeed({ echoed: 'fixture' }),
      });
      type ToolOutputValue<T> =
        T extends ProviderToolHandle<unknown, infer A, unknown> ? A : never;
      expectTypeOf<ToolOutputValue<typeof inferred>>().toEqualTypeOf<{
        echoed: string;
      }>();
      expect(inferred.isProviderExecuted).toBe(false);
    }).pipe(Effect.provide(Layer.succeed(ToolOutput, 'run '))),
  );

  it.effect('retains the concrete capabilities of a realtime overload', () =>
    Effect.gen(function* () {
      const model = yield* openai.experimental_realtime('fixture-model', {
        api: 'live',
      });
      expectTypeOf(
        model.capabilities.conversation,
      ).toEqualTypeOf<'continuous'>();
      expectTypeOf(model.doCreateWebRTCSession).toBeFunction();
      expect(model.capabilities.conversation).toBe('continuous');
    }),
  );

  it.effect('resolves a legacy model limit only when the Effect runs', () =>
    Effect.gen(function* () {
      let reads = 0;
      const model = wrapLegacyModel({
        specificationVersion: 'v3',
        provider: 'fixture',
        modelId: 'image-fixture',
        get maxImagesPerCall() {
          reads++;
          return (options: { modelId: string }) =>
            Effect.runPromise(
              Effect.succeed(options.modelId === this.modelId ? 4 : 1),
            );
        },
      });

      const readLimit = model.maxImagesPerCall({ modelId: 'image-fixture' });
      expect(reads).toBe(0);
      expect(yield* readLimit).toBe(4);
      expect(reads).toBe(1);
    }),
  );

  it.effect('releases the provider stream on early exit', () =>
    Effect.gen(function* () {
      let cancellations = 0;
      const source = new ReadableStream<number>({
        start(controller) {
          controller.enqueue(1);
          controller.enqueue(2);
        },
        cancel() {
          cancellations += 1;
        },
      });

      const received = yield* Effect.scoped(
        Effect.gen(function* () {
          const result = yield* readMethod(
            'test.providerStream',
            (_options: { readonly abortSignal?: AbortSignal }) =>
              Effect.runPromise(Effect.succeed({ source, token: 'fixture' })),
            ({ source, token }) => [source, { token }],
          )({});
          expect(result.metadata).toEqual({ token: 'fixture' });
          return yield* Stream.runCollect(Stream.take(result.stream, 1));
        }),
      );
      expect(received).toEqual([1]);
      expect(cancellations).toBe(1);
      expect(source.locked).toBe(false);
    }),
  );
});
