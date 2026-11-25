import {
  generateText as sdkGenerateText,
  NoSuchModelError,
  streamText as sdkStreamText,
  ToolLoopAgent as SdkToolLoopAgent,
  type LanguageModel as SdkLanguageModel,
  type OutputInterface,
  type ToolLoopAgentSettings,
} from 'ai';

export { makeChatTransport } from './internal/chat-transport.js';
export * from './core-data.js';
export * from './core-errors.js';
export * from './core-models.js';
export * from './internal/sdk-data/core.js';
export { simulateReadableStream } from './internal/simulate-readable.js';
export type {
  ChatReconnectOptions,
  ChatSendOptions,
  ChatTransport,
  ChatTransportHandlers,
} from './internal/chat-transport.js';
import { Effect } from 'effect';
import {
  unwrapLanguageModel,
  type LanguageModelV4,
} from './internal/language-model.js';
import { unwrapLegacyModel } from './internal/legacy-model.js';
import { registerNativeAgent } from './internal/native-agent.js';
import { openOperation, runRequest, runSync } from './internal/operation.js';
import { unwrapOutput, type OutputSpecification } from './internal/output.js';
import { wrapTextStream } from './internal/text-stream.js';
import {
  bindTools,
  type BoundTools,
  type EffectTools,
  type ToolServices,
} from './internal/tool.js';
import type { LanguageModelV2, LanguageModelV3 } from './protocols/provider.js';

export { Output, type OutputSpecification } from './internal/output.js';
export { tool, type EffectToolOptions } from './internal/tool.js';
export type { LanguageModelV4 } from './internal/language-model.js';
export type { ModelMessage, TextPart, UIMessage } from 'ai';

export type LanguageModel =
  | Extract<SdkLanguageModel, string>
  | LanguageModelV2
  | LanguageModelV3
  | LanguageModelV4;
type Model = LanguageModel;
type RuntimeContext = Record<string, unknown>;
type BoundOutput<A, P, I> = OutputInterface<A, P, I>;
type Owner<R> = Effect.Success<ReturnType<typeof openOperation<R>>>;
type Settings<Tools, Complete, Partial, Element> = {
  readonly model: Model;
  readonly tools?: Tools;
  readonly output?: OutputSpecification<Complete, Partial, Element>;
};

type ReplaceSettings<Options> = Options extends unknown
  ? Omit<Options, 'model' | 'tools' | 'output'>
  : never;

const bindSettings = <
  Tools extends EffectTools,
  A,
  P,
  I,
  Options extends Settings<Tools, A, P, I>,
>(
  settings: Options,
  owner: Owner<ToolServices<Tools>>,
) => {
  const { model, tools, output, ...options } = settings;
  const native =
    typeof model === 'string'
      ? model
      : model.specificationVersion === 'v4'
        ? unwrapLanguageModel(model)
        : unwrapLegacyModel<
            Exclude<SdkLanguageModel, string | { specificationVersion: 'v4' }>
          >(model);
  if (!native) {
    throw new NoSuchModelError({
      modelId: typeof model === 'string' ? model : model.modelId,
      modelType: 'languageModel',
    });
  }
  return {
    ...options,
    model: native,
    ...(tools ? { tools: bindTools(tools, owner) } : {}),
    ...(output ? { output: unwrapOutput(output) } : {}),
  };
};

type GenerateOptions<
  T extends EffectTools,
  R extends RuntimeContext,
  A,
  P,
  I,
> = ReplaceSettings<
  Parameters<typeof sdkGenerateText<BoundTools<T>, R, BoundOutput<A, P, I>>>[0]
> &
  Settings<T, A, P, I>;

/** Generate text or structured output with Effect-owned tool callbacks. */
export const generateText = <
  T extends EffectTools = {},
  R extends RuntimeContext = RuntimeContext,
  A = string,
  P = A,
  I = never,
>(
  options: GenerateOptions<T, R, A, P, I>,
) =>
  Effect.scoped(
    Effect.gen(function* () {
      const owner = yield* openOperation<ToolServices<T>>(options.abortSignal);
      return yield* runRequest(
        'generateText',
        { abortSignal: owner.signal },
        (abortSignal) =>
          sdkGenerateText<BoundTools<T>, R, BoundOutput<A, P, I>>({
            ...bindSettings<T, A, P, I, typeof options>(options, owner),
            abortSignal,
          } as unknown as Parameters<
            typeof sdkGenerateText<BoundTools<T>, R, BoundOutput<A, P, I>>
          >[0]),
      );
    }),
  );

type StreamOptions<
  T extends EffectTools,
  R extends RuntimeContext,
  A,
  P,
  I,
> = ReplaceSettings<
  Parameters<typeof sdkStreamText<BoundTools<T>, R, BoundOutput<A, P, I>>>[0]
> &
  Settings<T, A, P, I>;

/** Acquire a text stream and release its request when the scope closes. */
export const streamText = <
  T extends EffectTools = {},
  R extends RuntimeContext = RuntimeContext,
  A = string,
  P = A,
  I = never,
>(
  options: StreamOptions<T, R, A, P, I>,
) =>
  Effect.gen(function* () {
    const owner = yield* openOperation<ToolServices<T>>(options.abortSignal);
    return yield* runSync('streamText', () =>
      wrapTextStream(
        'streamText',
        sdkStreamText<BoundTools<T>, R, BoundOutput<A, P, I>>({
          ...bindSettings<T, A, P, I, typeof options>(options, owner),
          abortSignal: owner.signal,
          onError: options.onError ?? (() => {}),
        } as unknown as Parameters<
          typeof sdkStreamText<BoundTools<T>, R, BoundOutput<A, P, I>>
        >[0]),
        owner.markComplete,
      ),
    );
  });

type AgentSettings<
  C,
  T extends EffectTools,
  R extends RuntimeContext,
  A,
  P,
  I,
> = ReplaceSettings<
  ToolLoopAgentSettings<C, BoundTools<T>, R, BoundOutput<A, P, I>>
> &
  Settings<T, A, P, I>;

/** A tool loop that creates a private SDK agent for each execution. */
export class ToolLoopAgent<
  C = never,
  T extends EffectTools = {},
  R extends RuntimeContext = RuntimeContext,
  A = string,
  P = A,
  I = never,
> {
  readonly version = 'agent-v1';
  readonly #settings: AgentSettings<C, T, R, A, P, I>;

  constructor(settings: AgentSettings<C, T, R, A, P, I>) {
    this.#settings = settings;
    registerNativeAgent(this, (owner: Owner<ToolServices<T>>) =>
      this.#agent(owner),
    );
  }

  get id() {
    return this.#settings.id;
  }

  get tools() {
    return this.#settings.tools ?? ({} as T);
  }

  #agent(owner: Owner<ToolServices<T>>) {
    const settings = this.#settings;
    return new SdkToolLoopAgent<C, BoundTools<T>, R, BoundOutput<A, P, I>>(
      bindSettings<T, A, P, I, typeof settings>(
        settings,
        owner,
      ) as unknown as ToolLoopAgentSettings<
        C,
        BoundTools<T>,
        R,
        BoundOutput<A, P, I>
      >,
    );
  }

  generate(
    options: Parameters<
      SdkToolLoopAgent<C, BoundTools<T>, R, BoundOutput<A, P, I>>['generate']
    >[0],
  ) {
    return Effect.scoped(
      Effect.gen({ self: this }, function* () {
        const operation = 'ToolLoopAgent.generate';
        const owner = yield* openOperation<ToolServices<T>>(
          options.abortSignal,
        );
        return yield* runRequest(
          operation,
          { abortSignal: owner.signal },
          (abortSignal) =>
            this.#agent(owner).generate(
              Object.assign({}, options, { abortSignal }),
            ),
        );
      }),
    );
  }

  stream(
    options: Parameters<
      SdkToolLoopAgent<C, BoundTools<T>, R, BoundOutput<A, P, I>>['stream']
    >[0],
  ) {
    return Effect.gen({ self: this }, function* () {
      const operation = 'ToolLoopAgent.stream';
      const owner = yield* openOperation<ToolServices<T>>(options.abortSignal);
      const result = yield* runRequest(
        operation,
        { abortSignal: owner.signal },
        (abortSignal) =>
          this.#agent(owner).stream(
            Object.assign({}, options, { abortSignal }),
          ),
      );
      return wrapTextStream(operation, result, owner.markComplete);
    });
  }
}
