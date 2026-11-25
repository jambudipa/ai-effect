import {
  createAgentUIStream as nativeCreateAgentUIStream,
  type Agent,
  type DataUIPart,
  type FilePart,
  type GenerateTextStepEndEvent,
  type InferUITools,
  type OutputInterface,
  type TextPart,
  type TextStreamPart,
  type UIDataTypes,
  type UIMessage,
} from 'ai';
import { Effect, Stream } from 'effect';
import type { ServerResponse } from 'node:http';
import type { TimeoutConfiguration } from '../core-data.js';
import {
  unwrapSmoothStream,
  type SmoothStream,
} from '../core-stream-operations.js';
import type { ToolLoopAgent } from '../core.js';
import {
  unwrapSandbox,
  type SandboxSession,
} from '../integrations/internal/sandbox-base.js';
import { invoke, type CallbackResult } from './chat-boundary.js';
import {
  bindUiOptions,
  createUIMessageStreamResponse,
  pipeUIMessageStreamToResponse,
  scopedStream,
  type UIMessageStreamOptions,
  type UiHostOptions,
} from './chat-ui-stream.js';
import type { MessageData } from './chat-validation.js';
import { bindNativeAgent } from './native-agent.js';
import { openOperation, runRequest, runSync, sdkError } from './operation.js';
import { unwrapSteering, type Steering } from './steering.js';
import type { BoundTools, EffectTools, ToolServices } from './tool.js';

type Runtime = Record<string, unknown>;
type AgentMessage<Tools extends EffectTools> = UIMessage<
  unknown,
  UIDataTypes,
  InferUITools<BoundTools<Tools>>
>;
type GenerationStep<Tools extends EffectTools, Services> = (
  event: GenerateTextStepEndEvent<BoundTools<Tools>>,
) => CallbackResult<void, Services>;
type AgentTransform<Tools extends EffectTools> = (options: {
  readonly tools: Tools;
  readonly stopStream: () => Effect.Effect<void>;
}) => TransformStream<
  TextStreamPart<BoundTools<Tools>>,
  TextStreamPart<BoundTools<Tools>>
>;
type Transform<Tools extends EffectTools> =
  AgentTransform<Tools> | SmoothStream;

export type AgentUIMessageStreamOptions<
  CallOptions,
  Tools extends EffectTools,
  Context extends Runtime,
  Output,
  Partial,
  Element,
  Message extends AgentMessage<Tools>,
  Services = never,
> = Omit<
  UIMessageStreamOptions<Message, Services>,
  'onStepEnd' | 'onStepFinish'
> & {
  readonly agent: ToolLoopAgent<
    CallOptions,
    Tools,
    Context,
    Output,
    Partial,
    Element
  >;
  readonly uiMessages: unknown[];
  readonly convertDataPart?: (
    part: DataUIPart<MessageData<Message>>,
  ) => TextPart | FilePart | undefined;
  readonly abortSignal?: AbortSignal;
  readonly timeout?: TimeoutConfiguration<Tools>;
  readonly experimental_sandbox?: SandboxSession;
  readonly experimental_steering?: Steering;
  readonly experimental_transform?:
    Transform<Tools> | readonly Transform<Tools>[];
  readonly options?: CallOptions;
  readonly onStepEnd?: GenerationStep<Tools, Services>;
  readonly onStepFinish?: GenerationStep<Tools, Services>;
  readonly onUIMessageStepEnd?: NonNullable<
    UIMessageStreamOptions<Message, Services>['onStepEnd']
  >;
};

const openAgentStream = <
  C = never,
  T extends EffectTools = {},
  R extends Runtime = Runtime,
  A = string,
  P = A,
  I = never,
  Message extends AgentMessage<T> = AgentMessage<T>,
  Services = never,
>({
  agent,
  uiMessages,
  convertDataPart,
  abortSignal,
  timeout,
  options,
  experimental_sandbox,
  experimental_steering,
  experimental_transform,
  onStepEnd,
  onStepFinish,
  onUIMessageStepEnd,
  ...uiOptions
}: AgentUIMessageStreamOptions<C, T, R, A, P, I, Message, Services>) =>
  Effect.gen(function* () {
    const operation = 'createAgentUIStream';
    const owner = yield* openOperation<ToolServices<T> | Services>(abortSignal);
    const native = yield* runSync(operation, () =>
      bindNativeAgent<
        Agent<C, BoundTools<T>, R, OutputInterface<A, P, I>>,
        ToolServices<T>
      >(agent, owner),
    );
    if (!native)
      return yield* Effect.fail(sdkError(operation, 'Unknown agent handle'));
    const sandbox = experimental_sandbox && unwrapSandbox(experimental_sandbox);
    const steering =
      experimental_steering && unwrapSteering(experimental_steering);
    if (
      (experimental_sandbox && !sandbox) ||
      (experimental_steering && !steering)
    ) {
      return yield* Effect.fail(
        sdkError(operation, 'Unknown agent option handle'),
      );
    }
    const bindStep =
      (name: string, callback: GenerationStep<T, Services>) =>
      (event: GenerateTextStepEndEvent<BoundTools<T>>) =>
        owner.runCallback(
          invoke(`${operation}.${name}`, () => callback(event)),
        );
    const bindTransform =
      (transform: AgentTransform<T>) =>
      ({ stopStream }: { stopStream: () => void }) =>
        transform({
          tools: agent.tools,
          stopStream: () => Effect.sync(stopStream),
        });
    const transformList = experimental_transform
      ? Array.isArray(experimental_transform)
        ? (experimental_transform as readonly Transform<T>[])
        : [experimental_transform as Transform<T>]
      : [];
    const transforms = yield* Effect.forEach(transformList, (transform) =>
      Effect.gen(function* () {
        if (typeof transform === 'function') return bindTransform(transform);
        const smooth = yield* runSync(operation, () =>
          unwrapSmoothStream<BoundTools<T>>(transform, owner),
        );
        return smooth
          ? smooth
          : yield* Effect.fail(sdkError(operation, 'Unknown stream transform'));
      }),
    );
    const ui = bindUiOptions(operation, owner, {
      ...uiOptions,
      ...(onUIMessageStepEnd ? { onStepEnd: onUIMessageStepEnd } : {}),
    });
    const { onStepEnd: uiStepEnd, onStepFinish: _unused, ...rest } = ui;
    const source = yield* runRequest(
      operation,
      { abortSignal: owner.signal },
      (signal) =>
        nativeCreateAgentUIStream<
          C,
          BoundTools<T>,
          R,
          OutputInterface<A, P, I>,
          unknown,
          Message
        >({
          ...rest,
          agent: native,
          uiMessages,
          abortSignal: signal,
          ...(options === undefined ? {} : { options }),
          ...(convertDataPart ? { convertDataPart } : {}),
          ...(timeout === undefined ? {} : { timeout }),
          ...(sandbox ? { experimental_sandbox: sandbox } : {}),
          ...(steering ? { experimental_steering: steering } : {}),
          ...(transforms.length ? { experimental_transform: transforms } : {}),
          ...(onStepEnd ? { onStepEnd: bindStep('onStepEnd', onStepEnd) } : {}),
          ...(onStepFinish
            ? { onStepFinish: bindStep('onStepFinish', onStepFinish) }
            : {}),
          ...(uiStepEnd ? { onUIMessageStepEnd: uiStepEnd } : {}),
        }),
    );
    const stream = yield* scopedStream(operation, source);
    return stream.pipe(Stream.onEnd(owner.markComplete));
  });

export const createAgentUIStream = <
  C = never,
  T extends EffectTools = {},
  R extends Runtime = Runtime,
  A = string,
  P = A,
  I = never,
  Message extends AgentMessage<T> = AgentMessage<T>,
  Services = never,
>(
  options: AgentUIMessageStreamOptions<C, T, R, A, P, I, Message, Services>,
) => Stream.unwrap(openAgentStream(options));

export const createAgentUIStreamResponse = <
  C = never,
  T extends EffectTools = {},
  R extends Runtime = Runtime,
  A = string,
  P = A,
  I = never,
  Message extends AgentMessage<T> = AgentMessage<T>,
  Services = never,
>({
  headers,
  status,
  statusText,
  keepAliveMs,
  consumeSseStream,
  ...options
}: AgentUIMessageStreamOptions<C, T, R, A, P, I, Message, Services> &
  Omit<UiHostOptions<never, Services>, 'stream'>) =>
  Effect.flatMap(openAgentStream(options), (stream) => {
    const settings = {
      stream,
      ...(headers ? { headers } : {}),
      ...(status === undefined ? {} : { status }),
      ...(statusText === undefined ? {} : { statusText }),
      ...(keepAliveMs === undefined ? {} : { keepAliveMs }),
    };
    return consumeSseStream
      ? createUIMessageStreamResponse({ ...settings, consumeSseStream })
      : createUIMessageStreamResponse(settings);
  });

export const pipeAgentUIStreamToResponse = <
  C = never,
  T extends EffectTools = {},
  R extends Runtime = Runtime,
  A = string,
  P = A,
  I = never,
  Message extends AgentMessage<T> = AgentMessage<T>,
  Services = never,
>({
  response,
  headers,
  status,
  statusText,
  keepAliveMs,
  consumeSseStream,
  ...options
}: AgentUIMessageStreamOptions<C, T, R, A, P, I, Message, Services> &
  Omit<UiHostOptions<never, Services>, 'stream'> & {
    readonly response: ServerResponse;
  }) =>
  Effect.scoped(
    Effect.flatMap(openAgentStream(options), (stream) =>
      pipeUIMessageStreamToResponse({
        response,
        stream,
        ...(headers ? { headers } : {}),
        ...(status === undefined ? {} : { status }),
        ...(statusText === undefined ? {} : { statusText }),
        ...(keepAliveMs === undefined ? {} : { keepAliveMs }),
        ...(consumeSseStream ? { consumeSseStream } : {}),
      }),
    ),
  );
