import type { TextStreamPart } from 'ai';
import { Effect, Stream } from 'effect';
import {
  unwrapSmoothStream,
  type SmoothStream,
} from '../core-stream-operations.js';
import type { Owner } from './experimental-callbacks.js';
import { runRequest, sdkError, type AiSdkError } from './operation.js';
import type { BoundTools, EffectTools } from './tool.js';

export type StreamTextTransform<
  Tools extends EffectTools,
  R = never,
> = (options: {
  readonly tools: Tools;
  readonly stopStream: Effect.Effect<void>;
}) => (
  source: Stream.Stream<TextStreamPart<BoundTools<Tools>>, AiSdkError>,
) => Stream.Stream<TextStreamPart<BoundTools<Tools>>, unknown, R>;

export type TransformValue<Tools extends object, R> =
  SmoothStream | StreamTextTransform<Extract<Tools, EffectTools>, R>;

export type TransformServices<Value> = Value extends (
  ...args: never[]
) => (...args: never[]) => Stream.Stream<unknown, unknown, infer R>
  ? R
  : Value extends readonly (infer Item)[]
    ? TransformServices<Item>
    : never;

export function bindTransform<R>(
  value: TransformValue<EffectTools, R>,
  owner: Owner<R>,
  tools: EffectTools | undefined,
) {
  if (typeof value !== 'function') return unwrapSmoothStream(value, owner);

  const operation = 'streamText.experimental_transform';
  type Part = TextStreamPart<BoundTools<EffectTools>>;
  const fromReadable = (readable: ReadableStream<Part>) =>
    Stream.fromReadableStream({
      evaluate: () => readable,
      onError: (cause) => sdkError(operation, cause),
      releaseLockOnEnd: true,
    });

  return ({ stopStream }: { readonly stopStream: () => void }) => {
    const { readable, writable } = new TransformStream<Part, Part>();
    const transformed = Effect.suspend(() => {
      const transform = value({
        stopStream: Effect.sync(stopStream),
        tools: tools ?? {},
      });
      return Stream.toReadableStreamEffect(transform(fromReadable(readable)));
    });
    const owned = Stream.unwrap(
      runRequest(operation, { abortSignal: owner.signal }, () =>
        owner.runCallback(transformed),
      ).pipe(Effect.map(fromReadable)),
    );
    return {
      readable: Stream.toReadableStream(owned),
      writable,
    };
  };
}
