import * as sdk from '@ai-sdk/durable-agent';
import { Effect, Stream } from 'effect';
import {
  type AiSdkError,
  openOperation,
  runRequest,
  runSync,
} from '../internal/operation.js';
import {
  Output,
  type OutputSpecification as EffectOutput,
} from '../internal/output.js';
import {
  bindTools,
  type EffectTools,
  type ToolServices,
} from '../internal/tool.js';
import {
  bindCallbacks,
  type WithEffectCallbacks,
} from './internal/callbacks.js';

export { Output };
export type {
  GenerationSettings,
  PrepareStepInfo,
  PrepareStepResult,
  ProviderOptions,
  TelemetrySettings,
} from '@ai-sdk/durable-agent';

type NativeModel = sdk.CompatibleLanguageModel;
type StreamInput = Parameters<NativeModel['doStream']>[0];
type StreamResult = Awaited<ReturnType<NativeModel['doStream']>>;
type Part = StreamResult['stream'] extends ReadableStream<infer A> ? A : never;

export interface CompatibleLanguageModel<R = never, E = never> {
  readonly specificationVersion: NativeModel['specificationVersion'];
  readonly provider: string;
  readonly modelId: string;
  readonly doStream: (options: StreamInput) => Effect.Effect<
    Omit<StreamResult, 'stream'> & {
      readonly stream: Stream.Stream<Part, E, R>;
    },
    E,
    R
  >;
}

export type DurableAgentOptions<
  T extends EffectTools = {},
  R = never,
  E = never,
> = Omit<sdk.DurableAgentOptions, 'model' | 'tools'> & {
  readonly model:
    string | (() => Effect.Effect<CompatibleLanguageModel<R, E>, E, R>);
  readonly tools?: T;
};

const callbacks = [
  'onStepFinish',
  'onError',
  'onFinish',
  'onAbort',
  'prepareStep',
  'experimental_repairToolCall',
  'experimental_download',
] as const;

type NativeStreamOptions<A, P> = sdk.DurableAgentStreamOptions<
  NonNullable<sdk.DurableAgentOptions['tools']>,
  A,
  P
>;

export type OutputSpecification<A, P = A> = EffectOutput<A, P>;

export type DurableAgentStreamOptions<
  A = never,
  P = A,
  E = never,
  R = never,
> = Omit<
  WithEffectCallbacks<
    NativeStreamOptions<A, P>,
    (typeof callbacks)[number],
    E,
    R
  >,
  'stopWhen' | 'experimental_transform' | 'experimental_output'
> & {
  readonly experimental_output?: OutputSpecification<A, P>;
};

export type DurableAgentStreamResult<A = never> = sdk.DurableAgentStreamResult<
  NonNullable<sdk.DurableAgentOptions['tools']>,
  A
>;

type NativeOutput<A, P> = sdk.OutputSpecification<A, P>;

const bindOutput = <A, P, R>(
  output: OutputSpecification<A, P>,
  owner: Effect.Success<ReturnType<typeof openOperation<R>>>,
) =>
  Effect.gen(function* () {
    const responseFormat = yield* output.responseFormat;
    return {
      type: output.name === 'text' ? 'text' : 'object',
      responseFormat,
      parsePartial: (
        input: Parameters<NativeOutput<A, P>['parsePartial']>[0],
      ) => owner.runCallback(output.parsePartialOutput(input)),
      parseOutput: (...args: Parameters<NativeOutput<A, P>['parseOutput']>) =>
        owner.runCallback(
          output.parseCompleteOutput(
            ...(args as unknown as Parameters<
              typeof output.parseCompleteOutput
            >),
          ),
        ),
    } as unknown as NativeOutput<A, P>;
  });

/** An Effect boundary for the pinned, legacy DurableAgent. */
export class DurableAgent {
  static make<T extends EffectTools = {}, R = never, E = never>(
    settings: DurableAgentOptions<T, R, E>,
  ) {
    return Effect.gen(function* () {
      const { model, tools, ...rest } = settings;
      const owner = yield* openOperation<R | ToolServices<T>>();
      const modelFactory =
        typeof model === 'string'
          ? model
          : () =>
              owner.runCallback(
                Effect.map(
                  model(),
                  (resolved): NativeModel =>
                    ({
                      ...resolved,
                      doStream: (options: StreamInput) =>
                        owner.runCallback(
                          Effect.gen(function* () {
                            const { stream, ...metadata } =
                              yield* resolved.doStream(options);
                            return {
                              ...metadata,
                              stream:
                                yield* Stream.toReadableStreamEffect(stream),
                            };
                          }),
                          options.abortSignal,
                        ),
                    }) as NativeModel,
                ),
              );
      return yield* runSync(
        'DurableAgent.make',
        () =>
          new DurableAgent(
            new sdk.DurableAgent({
              ...rest,
              model: modelFactory,
              ...(tools && {
                tools: bindTools(tools, owner) as unknown as NonNullable<
                  sdk.DurableAgentOptions['tools']
                >,
              }),
            }),
          ),
      );
    });
  }

  private constructor(private readonly native: sdk.DurableAgent) {}

  generate() {
    return runSync('DurableAgent.generate', () => this.native.generate());
  }

  stream<A = never, P = A, E = never, R = never>(
    options: DurableAgentStreamOptions<A, P, E, R>,
  ): Effect.Effect<DurableAgentStreamResult<A>, AiSdkError, R> {
    const agent = this;
    return Effect.scoped(
      Effect.gen(function* () {
        const owner = yield* openOperation<R>(options.abortSignal);
        const { experimental_output, ...rest } = options;
        const output =
          experimental_output &&
          (yield* bindOutput(experimental_output, owner));
        const bound = bindCallbacks<
          NativeStreamOptions<A, P>,
          typeof callbacks,
          E,
          R
        >(rest, callbacks, owner);
        return yield* runRequest(
          'DurableAgent.stream',
          { abortSignal: owner.signal },
          (abortSignal) =>
            agent.native.stream({
              ...bound,
              abortSignal,
              ...(output && { experimental_output: output }),
            }),
        );
      }),
    );
  }
}

export type DownloadFunction<E = never, R = never> = NonNullable<
  DurableAgentStreamOptions<never, never, E, R>['experimental_download']
>;
export type PrepareStepCallback<E = never, R = never> = NonNullable<
  DurableAgentStreamOptions<never, never, E, R>['prepareStep']
>;
export type StreamTextOnAbortCallback<E = never, R = never> = NonNullable<
  DurableAgentStreamOptions<never, never, E, R>['onAbort']
>;
export type StreamTextOnErrorCallback<E = never, R = never> = NonNullable<
  DurableAgentStreamOptions<never, never, E, R>['onError']
>;
export type StreamTextOnFinishCallback<
  A = never,
  E = never,
  R = never,
> = NonNullable<DurableAgentStreamOptions<A, never, E, R>['onFinish']>;
export type ToolCallRepairFunction<E = never, R = never> = NonNullable<
  DurableAgentStreamOptions<never, never, E, R>['experimental_repairToolCall']
>;
