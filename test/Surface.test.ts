import { describe, expect, it } from '@effect/vitest';
import { MockLanguageModelV4 } from 'ai/test';
import {
  Context,
  Deferred,
  Effect,
  Fiber,
  Redacted,
  Schema,
  Stream,
} from 'effect';
import { createServer, type RequestListener } from 'node:http';
import { inspect } from 'node:util';
import { expectTypeOf } from 'vitest';
import {
  generateText,
  Output,
  streamText,
  ToolLoopAgent,
  tool,
} from '../src/core.js';
import {
  asSchema,
  callCompletionApi,
  formatDataStreamPart,
  jsonSchema,
  processDataStream,
} from '../src/integrations/ui-utils.js';
import {
  AiSdkError,
  openOperation,
  sdkError,
} from '../src/internal/operation.js';
import { wrapLanguageModel } from '../src/internal/language-model.js';
import { cerebras, createCerebras } from '../src/providers/cerebras.js';

const serve = (listener: RequestListener) => {
  const server = createServer(listener);
  return Effect.acquireRelease(
    Effect.callback<string>((resume) => {
      server.listen(0, '127.0.0.1', () => {
        const address = server.address();
        if (address && typeof address === 'object') {
          resume(Effect.succeed(`http://127.0.0.1:${address.port}/v1`));
        }
      });
    }),
    () =>
      Effect.callback<void>((resume) => {
        server.close(() => resume(Effect.void));
        server.closeAllConnections();
      }),
  );
};

const completion = (content: string) =>
  JSON.stringify({
    id: 'fixture',
    model: 'gpt-oss-120b',
    choices: [
      { message: { role: 'assistant', content }, finish_reason: 'stop' },
    ],
    usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
  });

const delta = (content: string) =>
  `data: ${JSON.stringify({ id: 'fixture', choices: [{ delta: { content } }] })}\n\n`;

describe('Cerebras', () => {
  it.effect('runs a callable provider and preserves schema inference', () =>
    Effect.gen(function* () {
      let requests = 0;
      const baseURL = yield* serve((_request, response) => {
        requests++;
        response.writeHead(200, { 'content-type': 'application/json' });
        response.end(completion('{"answer":42}'));
      });
      const provider = yield* createCerebras({ baseURL, apiKey: 'test' });
      const model = yield* provider('gpt-oss-120b');
      const sameModel = yield* provider.chat('gpt-oss-120b');
      expect(sameModel.modelId).toBe(model.modelId);
      expect(provider.specificationVersion).toBe('v4');
      expect(yield* cerebras.languageModel('gemma-4-31b')).not.toBe(cerebras);
      const output = yield* Output.object({
        schema: Schema.Struct({ answer: Schema.Number }),
      });
      const request = generateText({
        model,
        prompt: 'Return an answer',
        output,
      });
      expect(requests).toBe(0);
      const result = yield* request;
      expectTypeOf(result.output).toEqualTypeOf<{ readonly answer: number }>();
      expect(result.output).toEqual({ answer: 42 });
      expect(requests).toBe(1);
    }),
  );

  it.effect(
    'retains the tagged provider failure without publishing credentials',
    () =>
      Effect.gen(function* () {
        const secret = 'ai-effect-fixture-secret';
        const baseURL = yield* serve((_request, response) => {
          response.writeHead(401, {
            'content-type': 'application/json',
            'x-request-id': 'fixture-401',
          });
          response.end(
            JSON.stringify({
              error: {
                message: secret,
                type: 'auth',
                param: 'key',
                code: 'invalid',
              },
            }),
          );
        });
        const provider = yield* createCerebras({ baseURL, apiKey: secret });
        const model = yield* provider('gpt-oss-120b');
        const error = yield* Effect.flip(
          generateText({ model, prompt: 'Hello', maxRetries: 0 }),
        );
        expect(error.category).toBe('AI_APICallError');
        expect(error.status).toBe(401);
        expect(error.requestId).toBe('fixture-401');
        expect(
          [String(error), inspect(error), JSON.stringify(error)].join(' '),
        ).not.toContain(secret);
        expect(inspect(Redacted.value(error.cause))).toContain(secret);
        const reported = yield* Deferred.make<AiSdkError | undefined>();
        const stream = yield* streamText({
          model,
          prompt: 'Hello',
          maxRetries: 0,
          onError: ({ error }) =>
            Deferred.succeed(reported, error).pipe(Effect.asVoid),
        });
        yield* Effect.exit(Stream.runDrain(stream.fullStream));
        const streamError = yield* Deferred.await(reported);
        expect(streamError).toBeInstanceOf(AiSdkError);
        expect(streamError).toMatchObject({
          category: 'AI_APICallError',
          status: 401,
          requestId: 'fixture-401',
        });
        expect(
          [inspect(streamError), JSON.stringify(streamError)].join(' '),
        ).not.toContain(secret);
        const unsupported = yield* Effect.flip(
          provider.textEmbeddingModel('unknown'),
        );
        expect(unsupported.category).toBe('AI_NoSuchModelError');
      }),
  );

  it.effect(
    'closes local HTTP when a scoped agent stream stops after a delta',
    () =>
      Effect.gen(function* () {
        const closed = yield* Deferred.make<void>();
        const baseURL = yield* serve((_request, response) => {
          response.on('close', () => Deferred.doneUnsafe(closed, Effect.void));
          response.writeHead(200, { 'content-type': 'text/event-stream' });
          response.write(delta('hello'));
        });
        const provider = yield* createCerebras({ baseURL, apiKey: 'test' });
        const model = yield* provider('gpt-oss-120b');
        const agent = new ToolLoopAgent({ model });
        const emitted = yield* Effect.scoped(
          Effect.gen(function* () {
            const stream = yield* agent.stream({ prompt: 'Hello' });
            return yield* stream.textStream.pipe(
              Stream.take(1),
              Stream.runCollect,
            );
          }),
        );
        expect(emitted).toEqual(['hello']);
        yield* Deferred.await(closed);
      }),
  );
});

class RunName extends Context.Service<RunName, string>()(
  'ai-effect/test/RunName',
) {}

describe('tool callback scope', () => {
  it.effect(
    'keeps overlapping tool contexts separate and rejects late callbacks',
    () =>
      Effect.gen(function* () {
        const firstReady = yield* Deferred.make<void>();
        const secondReady = yield* Deferred.make<void>();
        const allowSecond = yield* Deferred.make<void>();
        const contexts: string[] = [];
        const releases: string[] = [];
        const shared = tool({
          inputSchema: Schema.Struct({ count: Schema.Number }),
          execute: ({ count }) =>
            Effect.gen(function* () {
              const name = yield* RunName;
              contexts.push(name);
              yield* Effect.addFinalizer(() =>
                Effect.sync(() => {
                  releases.push(name);
                }),
              );
              if (name === 'first') {
                yield* Deferred.succeed(firstReady, undefined);
                return yield* Effect.never;
              } else {
                yield* Deferred.succeed(secondReady, undefined);
                yield* Deferred.await(allowSecond);
              }
              return { count };
            }).pipe(Effect.scoped),
        });
        const createInvocation = (name: string) =>
          Effect.scoped(
            Effect.gen(function* () {
              const owner = yield* openOperation<RunName>();
              const invoke = () =>
                owner.runCallback(
                  shared.execute(
                    { count: 3 },
                    { context: {}, messages: [], toolCallId: name },
                  ),
                );
              const first = yield* Effect.tryPromise({
                try: invoke,
                catch: (cause) => sdkError('test.invoke', cause),
              });
              return { first, invoke };
            }),
          ).pipe(Effect.provideService(RunName, name));
        const first = yield* Effect.forkChild(createInvocation('first'));
        yield* Deferred.await(firstReady);
        const second = yield* Effect.forkChild(createInvocation('second'));
        yield* Deferred.await(secondReady);
        yield* Fiber.interrupt(first);
        expect(releases).toEqual(['first']);
        yield* Deferred.succeed(allowSecond, undefined);
        const result = yield* Fiber.join(second);
        expect(result.first).toEqual({ count: 3 });
        const late = yield* Effect.flip(
          Effect.tryPromise({
            try: result.invoke,
            catch: (cause) => sdkError('test.invoke', cause),
          }),
        );
        expect(late._tag).toBe('AiSdkError');
        expect(contexts).toEqual(['first', 'second']);
        expect(releases).toEqual(['first', 'second']);
      }),
  );
});

describe('provider stream scope', () => {
  it.effect(
    'cancels a stream that resolves after acquisition is interrupted',
    () =>
      Effect.gen(function* () {
        type Result = { stream: ReadableStream<never> };
        let resolveLate: (result: Result) => void = () => {};
        const late = new Promise<Result>((resolve) => {
          resolveLate = resolve;
        });
        const acquiring = yield* Deferred.make<void>();
        const canceled = yield* Deferred.make<void>();
        const source = new ReadableStream<never>({
          cancel() {
            Deferred.doneUnsafe(canceled, Effect.void);
          },
        });
        const model = wrapLanguageModel(
          new MockLanguageModelV4({
            doStream: () => {
              Deferred.doneUnsafe(acquiring, Effect.void);
              return late;
            },
          }),
        );
        const fiber = yield* Effect.forkChild(
          Effect.scoped(model.doStream({ prompt: [] })),
        );
        yield* Deferred.await(acquiring);
        yield* Fiber.interrupt(fiber);
        resolveLate({ stream: source });
        yield* Deferred.await(canceled);
        expect(source.locked).toBe(false);
      }),
  );

  it.effect('cancels and unlocks a handle released before its first read', () =>
    Effect.gen(function* () {
      let reads = 0;
      let cancellations = 0;
      const source = new ReadableStream<never>(
        {
          pull() {
            reads++;
          },
          cancel() {
            cancellations++;
          },
        },
        { highWaterMark: 0 },
      );
      const model = wrapLanguageModel(
        new MockLanguageModelV4({
          doStream: { stream: source },
        }),
      );
      yield* Effect.scoped(
        Effect.gen(function* () {
          const result = yield* model.doStream({ prompt: [] });
          expect(Stream.isStream(result.stream)).toBe(true);
          expect(source.locked).toBe(true);
          expect(reads).toBe(0);
        }),
      );
      expect(reads).toBe(0);
      expect(cancellations).toBe(1);
      expect(source.locked).toBe(false);
    }),
  );
});

describe('legacy stream', () => {
  it.effect(
    'runs the completion response callback with the current Effect context',
    () =>
      Effect.gen(function* () {
        const bytes = yield* formatDataStreamPart('text', 'ready');
        const events: string[] = [];
        const request = callCompletionApi({
          api: 'https://fixture.invalid/completion',
          prompt: 'fixture',
          body: {},
          streamProtocol: 'data',
          credentials: undefined,
          headers: undefined,
          setCompletion: (completion) => {
            events.push(completion);
          },
          setLoading: () => {},
          setError: () => {},
          setAbortController: () => {},
          onFinish: (_prompt, completion) => {
            events.push(`done: ${completion}`);
          },
          onError: undefined,
          onData: undefined,
          onResponse: () =>
            Effect.gen(function* () {
              events.push(yield* RunName);
            }),
          fetch: () => Promise.resolve(new Response(bytes)),
        });
        expectTypeOf<
          Effect.Services<typeof request>
        >().toEqualTypeOf<RunName>();
        expect(
          yield* request.pipe(Effect.provideService(RunName, 'response')),
        ).toBe('ready');
        expect(events).toEqual(['', 'response', 'ready', 'done: ready']);
      }),
  );

  it.effect('keeps validation on the wrapped legacy schema', () =>
    Effect.gen(function* () {
      const schema = yield* jsonSchema<number>(
        { type: 'number' },
        { validate: () => Effect.succeed({ success: true, value: 42 }) },
      );
      expect(yield* asSchema(schema)).toBe(schema);
      expect(yield* schema.validate!('test')).toEqual({
        success: true,
        value: 42,
      });
    }),
  );

  it.effect(
    'dispatches legacy callbacks in wire order and unlocks at completion',
    () =>
      Effect.gen(function* () {
        const text = yield* formatDataStreamPart('text', 'first');
        const data = yield* formatDataStreamPart('data', ['middle']);
        const tail = yield* formatDataStreamPart('text', 'last');
        const encoder = new TextEncoder();
        const input = new ReadableStream<Uint8Array>({
          start(controller) {
            controller.enqueue(encoder.encode(text.slice(0, 4)));
            controller.enqueue(encoder.encode(text.slice(4) + data + tail));
            controller.close();
          },
        });
        const observed: unknown[] = [];
        yield* processDataStream({
          stream: input,
          onTextPart: (value) =>
            Effect.sync(() => {
              observed.push(value);
            }),
          onDataPart: (value) =>
            Effect.sync(() => {
              observed.push(value);
            }),
        });
        expect(observed).toEqual(['first', ['middle'], 'last']);
        expect(input.locked).toBe(false);
      }),
  );

  it.effect(
    'cancels and unlocks a legacy reader interrupted during a read',
    () =>
      Effect.gen(function* () {
        const reading = yield* Deferred.make<void>();
        let cancellations = 0;
        const input = new ReadableStream<Uint8Array>(
          {
            pull() {
              Deferred.doneUnsafe(reading, Effect.void);
            },
            cancel() {
              cancellations++;
            },
          },
          { highWaterMark: 0 },
        );
        const fiber = yield* Effect.forkChild(
          processDataStream({ stream: input }),
        );
        yield* Deferred.await(reading);
        expect(input.locked).toBe(true);
        yield* Fiber.interrupt(fiber);
        expect(input.locked).toBe(false);
        expect(cancellations).toBe(1);
      }),
  );
});
