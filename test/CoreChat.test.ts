import { describe, expect, it } from '@effect/vitest';
import type { LanguageModelV4StreamPart } from '@ai-sdk/provider';
import { MockLanguageModelV4 } from 'ai/test';
import {
  Context,
  Deferred,
  Effect,
  Fiber,
  Option,
  Schema,
  Stream,
} from 'effect';
import type { UIMessage, UIMessageChunk } from 'ai';
import {
  AbstractChat,
  convertToModelMessages,
  createAgentUIStream,
  createUIMessageStream,
  createUIMessageStreamResponse,
  DefaultChatTransport,
  DirectChatTransport,
  HttpChatTransport,
  readUIMessageStream,
  safeValidateWebSocketChatTransportRequest,
  TextStreamChatTransport,
  validateUIMessages,
  WebSocketChatTransport,
  type ChatState,
} from '../src/core-chat.js';
import { ToolLoopAgent } from '../src/core.js';
import { makeChatTransport } from '../src/internal/chat-transport.js';
import { wrapLanguageModel } from '../src/internal/language-model.js';
import { AiSdkError } from '../src/internal/operation.js';

class RequestToken extends Context.Service<RequestToken, string>()(
  '@jambudipa/ai-effect/test/RequestToken',
) {}

const request = {
  chatId: 'chat',
  trigger: 'submit-message',
  messages: [],
  messageId: void 0,
  abortSignal: void 0,
} as const;

const chunks: readonly UIMessageChunk[] = [
  { type: 'start', messageId: 'assistant' },
  { type: 'text-start', id: 'text' },
  { type: 'text-delta', id: 'text', delta: 'hello' },
  { type: 'text-end', id: 'text' },
  { type: 'finish' },
];

describe('Core chat', () => {
  it.effect('sends typed UI messages through the native SSE protocol', () =>
    Effect.gen(function* () {
      const token = yield* RequestToken;
      let sent = false;
      let ended = false;
      const source = createUIMessageStream({
        execute: ({ writer }) =>
          Effect.forEach(chunks, writer.write, { discard: true }),
        onEnd: () =>
          Effect.gen(function* () {
            expect(yield* RequestToken).toBe(token);
            ended = true;
          }),
      });
      const response = yield* createUIMessageStreamResponse({
        stream: source,
        status: 202,
      });
      const transport = yield* DefaultChatTransport({
        prepareSendMessagesRequest: (input) =>
          RequestToken.pipe(
            Effect.map((value) => ({
              body: { id: input.id, messages: input.messages },
              headers: { 'x-test-token': value },
            })),
          ),
        fetch: (_input, init) => {
          expect(new Headers(init?.headers).get('x-test-token')).toBe(token);
          expect(init?.method).toBe('POST');
          sent = true;
          return Effect.runPromise(Effect.succeed(response));
        },
      });
      expect(sent).toBe(false);
      const stream = yield* transport.sendMessages({
        ...request,
        messages: [],
      });
      const messages = yield* Stream.runCollect(
        readUIMessageStream({ stream }),
      );
      expect(messages.at(-1)).toMatchObject({
        id: 'assistant',
        role: 'assistant',
        parts: [{ type: 'text', text: 'hello' }],
      });
      expect(response.status).toBe(202);
      expect(ended).toBe(true);
    }).pipe(Effect.provideService(RequestToken, 'token')),
  );

  it.effect(
    'decodes Web responses and interrupts an extended HTTP decoder',
    () =>
      Effect.gen(function* () {
        const text = yield* TextStreamChatTransport({
          fetch: () =>
            Effect.runPromise(Effect.sync(() => new Response('hello'))),
        });
        const textStream = yield* text.sendMessages({
          ...request,
          messages: [],
        });
        const received = yield* Stream.runCollect(textStream);
        expect(received).toContainEqual({
          type: 'text-delta',
          id: 'text-1',
          delta: 'hello',
        });

        const opened = yield* Deferred.make<void>();
        const closed = yield* Deferred.make<void>();
        const transport = yield* HttpChatTransport({
          fetch: () =>
            Effect.runPromise(Effect.sync(() => new Response('test'))),
          processResponseStream: () =>
            Stream.unwrap(
              Effect.acquireRelease(
                Deferred.succeed(opened, void 0).pipe(Effect.as(Stream.never)),
                () => Deferred.succeed(closed, void 0),
              ),
            ),
        });
        const read = yield* Effect.forkScoped(
          Effect.scoped(
            transport
              .sendMessages({ ...request, messages: [] })
              .pipe(Effect.flatMap(Stream.runDrain)),
          ),
        );
        yield* Deferred.await(opened);
        yield* Fiber.interrupt(read);
        yield* Deferred.await(closed);
      }),
  );

  it.effect('extends chat with host state and an Effect transport', () =>
    Effect.gen(function* () {
      const state: ChatState<UIMessage> = {
        status: 'ready',
        error: void 0,
        messages: [],
        pushMessage(message) {
          state.messages = [...state.messages, message];
        },
        popMessage() {
          state.messages = state.messages.slice(0, -1);
        },
        replaceMessage(index, message) {
          state.messages = state.messages.map((current, position) =>
            position === index ? message : current,
          );
        },
        snapshot: (value) => structuredClone(value),
      };
      const transport = makeChatTransport({
        sendMessages: () => Effect.succeed(Stream.fromIterable(chunks)),
        reconnectToStream: () => Effect.succeed(Option.none()),
      });
      const chat = yield* AbstractChat({ state, transport });
      yield* chat.sendMessage({ text: 'prompt' });
      expect(state.status).toBe('ready');
      expect(state.messages).toHaveLength(2);
      expect(state.messages.at(-1)?.parts).toMatchObject([
        { type: 'text', text: 'hello' },
      ]);
    }),
  );

  it.effect('aborts an HTTP preparation callback with its send request', () =>
    Effect.gen(function* () {
      const started = yield* Deferred.make<void>();
      const stopped = yield* Deferred.make<void>();
      const transport = yield* DefaultChatTransport({
        prepareSendMessagesRequest: () =>
          Deferred.succeed(started, void 0).pipe(
            Effect.andThen(Effect.never),
            Effect.ensuring(Deferred.succeed(stopped, void 0)),
          ),
      });
      const sending = yield* Effect.forkScoped(
        Effect.scoped(transport.sendMessages({ ...request, messages: [] })),
      );
      yield* Deferred.await(started);
      yield* Fiber.interrupt(sending);
      yield* Deferred.await(stopped);
    }),
  );

  it.effect('converts local agent output through both chat entry points', () =>
    Effect.gen(function* () {
      const createModel = () =>
        wrapLanguageModel(
          new MockLanguageModelV4({
            doStream: {
              stream: new ReadableStream<LanguageModelV4StreamPart>({
                start(controller) {
                  controller.enqueue({ type: 'text-start', id: 'result' });
                  controller.enqueue({
                    type: 'text-delta',
                    id: 'result',
                    delta: 'hello',
                  });
                  controller.enqueue({ type: 'text-end', id: 'result' });
                  controller.enqueue({
                    type: 'finish',
                    finishReason: { unified: 'stop', raw: void 0 },
                    usage: {
                      inputTokens: {
                        total: 1,
                        noCache: 1,
                        cacheRead: 0,
                        cacheWrite: 0,
                      },
                      outputTokens: { total: 1, text: 1, reasoning: 0 },
                    },
                  });
                  controller.close();
                },
              }),
            },
          }),
        );
      const messages = [
        { id: 'user', role: 'user', parts: [{ type: 'text', text: 'Hello' }] },
      ] satisfies UIMessage[];
      const transport = yield* DirectChatTransport({
        agent: new ToolLoopAgent({ model: createModel() }),
      });
      const stream = yield* transport.sendMessages({ ...request, messages });
      const direct = yield* Stream.runCollect(stream);
      expect(direct).toContainEqual({
        type: 'text-delta',
        id: 'result',
        delta: 'hello',
      });

      const result = yield* Stream.runCollect(
        createAgentUIStream({
          agent: new ToolLoopAgent({ model: createModel() }),
          uiMessages: messages,
          onUIMessageStepEnd: ({ responseMessage }) =>
            Effect.gen(function* () {
              expect(yield* RequestToken).toBe('agent');
              expect(responseMessage.parts).toContainEqual({
                type: 'text',
                text: 'hello',
                state: 'done',
              });
            }),
        }),
      );
      expect(result).toContainEqual({
        type: 'text-delta',
        id: 'result',
        delta: 'hello',
      });
    }).pipe(Effect.provideService(RequestToken, 'agent')),
  );

  it.effect('validates typed metadata and converts the messages', () =>
    Effect.gen(function* () {
      type Message = UIMessage<string>;
      const messages = [
        {
          id: 'user',
          role: 'user',
          metadata: 'validated',
          parts: [{ type: 'text', text: 'hello' }],
        },
      ];
      const valid = yield* validateUIMessages<Message>({
        messages,
        metadataSchema: Schema.String,
      });
      expect(valid[0]?.metadata).toBe('validated');
      expect(yield* convertToModelMessages(valid)).toEqual([
        {
          role: 'user',
          content: [{ type: 'text', text: 'hello' }],
        },
      ]);
      const invalid = yield* Effect.flip(
        validateUIMessages<Message>({
          messages: [{ ...messages[0], metadata: 42 }],
          metadataSchema: Schema.String,
        }),
      );
      expect(invalid).toBeInstanceOf(AiSdkError);
    }),
  );

  it.effect('validates socket frames and tags invalid input', () =>
    Effect.gen(function* () {
      const value = { type: 'abort', requestId: 'request' };
      expect(
        yield* safeValidateWebSocketChatTransportRequest({ value }),
      ).toEqual({
        success: true,
        data: value,
      });
      const invalid = yield* safeValidateWebSocketChatTransportRequest({
        value: false,
      });
      expect(invalid.success ? invalid.data : invalid.error).toBeInstanceOf(
        AiSdkError,
      );
    }),
  );

  it.effect('closes the scoped WebSocket after reading correlated chunks', () =>
    Effect.gen(function* () {
      let closed = false;
      const noListener = Option.getOrNull(Option.none<never>());
      class Socket {
        readyState = 0;
        onopen: ((event: unknown) => void) | null = noListener;
        onmessage: ((event: { data: unknown }) => void) | null = noListener;
        onerror: ((event: unknown) => void) | null = noListener;
        onclose: ((event: unknown) => void) | null = noListener;

        constructor() {
          queueMicrotask(() => {
            this.readyState = 1;
            this.onopen?.({});
          });
        }

        send(data: string | Uint8Array | ArrayBuffer) {
          if (typeof data !== 'string') return;
          const id = /"requestId":"([^"]+)"/u.exec(data)?.[1];
          if (!id) return;
          this.onmessage?.({
            data: `{"type":"chunk","requestId":"${id}","sequence":0,"chunk":{"type":"text-delta","id":"text","delta":"hello"}}`,
          });
          this.onmessage?.({ data: `{"type":"end","requestId":"${id}"}` });
        }

        close() {
          this.readyState = 3;
          closed = true;
        }
      }

      const received = yield* Effect.scoped(
        Effect.gen(function* () {
          const transport = yield* WebSocketChatTransport({
            url: 'ws://example.test',
            webSocket: Socket,
          });
          const stream = yield* transport.sendMessages({
            ...request,
            messages: [],
          });
          expect(closed).toBe(false);
          return yield* Stream.runCollect(stream);
        }),
      );
      expect(received).toEqual([
        { type: 'text-delta', id: 'text', delta: 'hello' },
      ]);
      expect(closed).toBe(true);
    }),
  );
});
