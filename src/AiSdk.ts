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

/** Open the scoped text result on stream consumption and expose its full event stream. */
const streamText = <
  Tools extends EffectTools = {},
  Runtime extends Record<string, unknown> = Record<string, unknown>,
  Output = string,
  Partial = Output,
  Item = never,
  Hook = never,
  Provided extends object = {},
>(
  options: Parameters<
    typeof openTextStream<Tools, Runtime, Output, Partial, Item, Hook, Provided>
  >[0],
) =>
  Stream.unwrap(
    openTextStream<Tools, Runtime, Output, Partial, Item, Hook, Provided>(
      options,
    ).pipe(Effect.map((result) => result.stream)),
  );

/** Core operations that a caller can replace through an Effect layer. */
interface AiSdkShape {
  /** Run a complete tool loop and collect its final text and step results. */
  readonly generateText: typeof generateText;
  /** Consume full generation events under the scope of the stream consumer. */
  readonly streamText: typeof streamText;
  /** Resolve one embedding without requiring the caller to construct a batch. */
  readonly embed: typeof embed;
  /** Resolve a batch of embeddings while retaining the input order. */
  readonly embedMany: typeof embedMany;
  /** Score and rank supplied documents against a query. */
  readonly rerank: typeof rerank;
  /** Request image bytes and provider metadata through the configured model. */
  readonly generateImage: typeof generateImage;
  /** Synthesize audio and keep its binary and text encodings available to the caller. */
  readonly generateSpeech: typeof generateSpeech;
  /** Produce text and timing information from the supplied audio. */
  readonly transcribe: typeof transcribe;
}

/** Effect service for the Core SDK calls. */
export class AiSdk extends Context.Service<AiSdk, AiSdkShape>()(
  '@jambudipa/ai-effect/AiSdk',
) {
  /** Install the built-in Core operations as the default implementation. */
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

/** Service interface for applications that supply a replacement layer. */
export type AiSdkService = AiSdk['Service'];
