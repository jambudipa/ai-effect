import { assert } from './shared.mjs';
import {
  generateText,
  Output,
  streamText,
  ToolLoopAgent,
  tool,
} from '@jambudipa/ai-effect/ai';
import {
  MockLanguageModelV4,
  simulateReadableStream,
} from '@jambudipa/ai-effect/ai/test';
import {
  createCerebras,
  type LanguageModelV4,
} from '@jambudipa/ai-effect/cerebras';
import {
  formatDataStreamPart,
  processDataStream,
} from '@jambudipa/ai-effect/ui-utils';
import { mockFetchTextStream } from '@jambudipa/ai-effect/ui-utils/test';
import { Context, Effect, Schema, Stream } from 'effect';
import { createServer } from 'node:http';

class Offset extends Context.Service<Offset, number>()('fixture/Offset') {}

const count = tool({
  inputSchema: Schema.Struct({ count: Schema.Number }),
  execute: (input) =>
    Effect.gen(function* () {
      const offset = yield* Offset;
      return { result: input.count + offset };
    }),
});

const fixture = Effect.gen(function* () {
  const base = yield* createCerebras({ apiKey: 'fixture' });
  const model = yield* base('gpt-oss-120b');
  const same: LanguageModelV4 = yield* base.languageModel('gpt-oss-120b');
  assert(
    model.modelId === same.modelId,
    'both provider selectors preserve model ID',
  );

  const usage = {
    inputTokens: {
      total: 2,
      noCache: 2,
      cacheRead: undefined,
      cacheWrite: undefined,
    },
    outputTokens: { total: 1, text: 1, reasoning: undefined },
  };
  const generated = yield* MockLanguageModelV4({
    doGenerate: [
      {
        content: [
          {
            type: 'tool-call',
            toolCallId: 'count-1',
            toolName: 'count',
            input: '{"count":3}',
          },
        ],
        finishReason: { unified: 'tool-calls', raw: undefined },
        usage,
        warnings: [],
      },
      {
        content: [{ type: 'text', text: '{"answer":5}' }],
        finishReason: { unified: 'stop', raw: undefined },
        usage,
        warnings: [],
      },
    ],
  });
  const output = yield* Output.object({
    schema: Schema.Struct({ answer: Schema.Number }),
  });
  const agent = new ToolLoopAgent({
    model: generated.model,
    tools: { count },
    output,
  });
  const result = yield* agent.generate({
    prompt: 'Call count and return its result',
  });
  const answer: number = result.output.answer;
  assert(answer === 5, 'agent emits the typed structured output');
  const resultPart = result.staticToolResults[0];
  if (!resultPart) throw new Error('agent should retain the tool result');
  const countValue: number = resultPart.output.result;
  assert(countValue === 5, 'the tool uses the current Effect context');
  // @ts-expect-error Tool output inference rejects the wrong field type.
  const wrongToolOutput: string = resultPart.output.result;
  void wrongToolOutput;
  // @ts-expect-error Output schema inference rejects the wrong field type.
  const wrong: string = result.output.answer;
  void wrong;

  const input = yield* simulateReadableStream({
    chunks: [
      new TextEncoder().encode(yield* formatDataStreamPart('text', 'legacy')),
    ],
    chunkDelayInMs: null,
  });
  const received: string[] = [];
  yield* processDataStream({
    stream: input,
    onTextPart: (part) =>
      Effect.sync(() => {
        received.push(part);
      }),
  });
  assert(
    received.join() === 'legacy' && !input.locked,
    'legacy processing unlocks its stream',
  );
  assert(
    typeof mockFetchTextStream === 'function',
    'legacy test subpath resolves',
  );
});

const program = fixture.pipe(Effect.provideService(Offset, 2), Effect.scoped);
await Effect.runPromise(program);

let requests = 0;
const server = createServer((_request, response) => {
  requests++;
  if (requests === 1) {
    response.writeHead(200, { 'content-type': 'application/json' });
    response.end(
      JSON.stringify({
        choices: [
          { message: { content: 'packed JSON' }, finish_reason: 'stop' },
        ],
      }),
    );
    return;
  }
  response.writeHead(200, { 'content-type': 'text/event-stream' });
  response.end(
    `data: ${JSON.stringify({ choices: [{ delta: { content: 'packed SSE' }, finish_reason: 'stop' }] })}\n\ndata: [DONE]\n\n`,
  );
});
await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
try {
  const address = server.address();
  if (!address || typeof address === 'string')
    throw new Error('HTTP fixture has no address');
  await Effect.runPromise(
    Effect.scoped(
      Effect.gen(function* () {
        const provider = yield* createCerebras({
          apiKey: 'fixture',
          baseURL: `http://127.0.0.1:${address.port}/v1`,
        });
        const model = yield* provider('gpt-oss-120b');
        const generated = yield* generateText({ model, prompt: 'JSON' });
        assert(
          generated.text === 'packed JSON',
          'the packed provider reads JSON',
        );
        const agent = new ToolLoopAgent({ model });
        const streamed = yield* agent.stream({ prompt: 'SSE' });
        const deltas = yield* Stream.runCollect(streamed.textStream);
        assert(deltas.join('') === 'packed SSE', 'the packed agent reads SSE');
      }),
    ),
  );
} finally {
  server.close();
  server.closeAllConnections();
}

export function typeFailures(model: LanguageModelV4) {
  // @ts-expect-error Prompt and messages are mutually exclusive.
  generateText({ model, prompt: 'x', messages: [] });
  // @ts-expect-error The model handle requires its wrapped operations.
  streamText({ model: { modelId: 'x' }, prompt: 'x' });
  // @ts-expect-error The wire part type determines the value type.
  formatDataStreamPart('text', ['wrong']);
  return Stream.empty;
}
