import { Context, Effect, Layer, Stream } from 'effect';
import { generateText, streamText as openTextStream } from './core.js';
import {
  embed,
  embedMany,
  generateImage,
  generateSpeech,
  rerank,
  transcribe,
} from './core-models.js';
import type { EffectTools } from './internal/tool.js';

export { AiSdkError } from './internal/operation.js';
export { AiSdkStreamAborted } from './internal/stream-aborted.js';

const streamText = <
  Tools extends EffectTools = {},
  Runtime extends Record<string, unknown> = Record<string, unknown>,
  Output = string,
  Partial = Output,
  Item = never,
>(
  options: Parameters<
    typeof openTextStream<Tools, Runtime, Output, Partial, Item>
  >[0],
) =>
  Stream.unwrap(
    openTextStream<Tools, Runtime, Output, Partial, Item>(options).pipe(
      Effect.map((result) => result.stream),
    ),
  );

interface AiSdkShape {
  readonly generateText: typeof generateText;
  readonly streamText: typeof streamText;
  readonly embed: typeof embed;
  readonly embedMany: typeof embedMany;
  readonly rerank: typeof rerank;
  readonly generateImage: typeof generateImage;
  readonly generateSpeech: typeof generateSpeech;
  readonly transcribe: typeof transcribe;
}

/** Effect service for the Core SDK calls. */
export class AiSdk extends Context.Service<AiSdk, AiSdkShape>()(
  '@jambudipa/ai-effect/AiSdk',
) {
  static readonly layer = Layer.succeed(
    this,
    AiSdk.of({
      generateText,
      streamText,
      embed,
      embedMany,
      rerank,
      generateImage,
      generateSpeech,
      transcribe,
    }),
  );
}

export type AiSdkService = AiSdk['Service'];
