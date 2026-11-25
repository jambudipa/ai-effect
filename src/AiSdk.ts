import {
  embed as sdkEmbed,
  embedMany as sdkEmbedMany,
  generateImage as sdkGenerateImage,
  generateSpeech as sdkGenerateSpeech,
  generateText as sdkGenerateText,
  rerank as sdkRerank,
  streamText as sdkStreamText,
  transcribe as sdkTranscribe,
} from 'ai';
import type {
  GenerateTextResult,
  OutputInterface,
  TextStreamPart,
  ToolSet,
} from 'ai';
import { Context, Effect, Layer, Ref, Schema, Stream } from 'effect';

type RuntimeContext = Record<string, unknown>;
type RerankDocument = Parameters<typeof sdkRerank>[0]['documents'][number];

type GenerateTextOptions<
  Tools extends ToolSet,
  Runtime extends RuntimeContext,
  Output extends OutputInterface,
> = Parameters<typeof sdkGenerateText<Tools, Runtime, Output>>[0];

type StreamTextOptions<
  Tools extends ToolSet,
  Runtime extends RuntimeContext,
  Output extends OutputInterface,
> = Parameters<typeof sdkStreamText<Tools, Runtime, Output>>[0];

type TextEvent<Tools extends ToolSet> = TextStreamPart<Tools> & {
  type: Exclude<TextStreamPart<ToolSet>['type'], 'error' | 'abort'>;
};

/** An AI SDK failure with the operation name and the original cause. */
export class AiSdkError extends Schema.TaggedError<AiSdkError>()('AiSdkError', {
  operation: Schema.Literals([
    'generateText',
    'streamText',
    'embed',
    'embedMany',
    'rerank',
    'generateImage',
    'generateSpeech',
    'transcribe',
  ]),
  cause: Schema.Defect(),
}) {}

/** The SDK ended a text stream in response to an abort signal. */
export class AiSdkStreamAborted extends Schema.TaggedError<AiSdkStreamAborted>()(
  'AiSdkStreamAborted',
  { reason: Schema.optionalKey(Schema.String) },
) {}

const combineSignals = (signal: AbortSignal, callerSignal?: AbortSignal) =>
  callerSignal ? AbortSignal.any([signal, callerSignal]) : signal;

const runRequest = <A>(
  operation: AiSdkError['operation'],
  options: { abortSignal?: AbortSignal },
  request: (signal: AbortSignal) => PromiseLike<A>,
): Effect.Effect<A, AiSdkError> =>
  Effect.tryPromise({
    try: (signal) => request(combineSignals(signal, options.abortSignal)),
    catch: (cause) => new AiSdkError({ operation, cause }),
  });

const streamError = (cause: unknown) =>
  new AiSdkError({ operation: 'streamText', cause });

const generateText = <
  Tools extends ToolSet,
  Runtime extends RuntimeContext = RuntimeContext,
  Output extends OutputInterface = OutputInterface<string, string>,
>(
  options: GenerateTextOptions<Tools, Runtime, Output>,
): Effect.Effect<GenerateTextResult<Tools, Runtime, Output>, AiSdkError> =>
  runRequest('generateText', options, (abortSignal) =>
    sdkGenerateText<Tools, Runtime, Output>(
      Object.assign({}, options, { abortSignal }),
    ),
  );

const streamText = <
  Tools extends ToolSet,
  Runtime extends RuntimeContext = RuntimeContext,
  Output extends OutputInterface = OutputInterface<string, string, never>,
>(
  options: StreamTextOptions<Tools, Runtime, Output>,
): Stream.Stream<TextEvent<Tools>, AiSdkError | AiSdkStreamAborted> =>
  Stream.unwrap(
    Effect.gen(function* () {
      const completed = yield* Ref.make(false);
      const controller = yield* Effect.acquireRelease(
        Effect.sync(() => new AbortController()),
        (controller) =>
          Ref.get(completed).pipe(
            Effect.flatMap((done) =>
              done ? Effect.void : Effect.sync(() => controller.abort()),
            ),
          ),
      );
      const readable = yield* Effect.try({
        try: () =>
          sdkStreamText<Tools, Runtime, Output>(
            Object.assign({}, options, {
              abortSignal: combineSignals(
                controller.signal,
                options.abortSignal,
              ),
              onError: options.onError ?? (() => {}),
            }),
          ).stream,
        catch: streamError,
      });

      return Stream.fromReadableStream({
        evaluate: () => readable,
        onError: streamError,
        // The SDK tees the source for replay. Cancel the request through its
        // signal, so cancelling one branch cannot wait on the unused branch.
        releaseLockOnEnd: true,
      }).pipe(
        Stream.mapEffect(
          Effect.fnUntraced(function* (part: TextStreamPart<Tools>) {
            if (part.type === 'error') {
              return yield* streamError(part.error);
            }
            if (part.type === 'abort') {
              return yield* new AiSdkStreamAborted(part);
            }
            return part;
          }),
        ),
        Stream.onEnd(Ref.set(completed, true)),
      );
    }),
  );

const embed = <Runtime extends RuntimeContext = RuntimeContext>(
  options: Parameters<typeof sdkEmbed<Runtime>>[0],
) =>
  runRequest('embed', options, (abortSignal) =>
    sdkEmbed<Runtime>({ ...options, abortSignal }),
  );

const embedMany = <Runtime extends RuntimeContext = RuntimeContext>(
  options: Parameters<typeof sdkEmbedMany<Runtime>>[0],
) =>
  runRequest('embedMany', options, (abortSignal) =>
    sdkEmbedMany<Runtime>({ ...options, abortSignal }),
  );

const rerank = <
  Document extends RerankDocument,
  Runtime extends RuntimeContext = RuntimeContext,
>(
  options: Parameters<typeof sdkRerank<Document, Runtime>>[0],
) =>
  runRequest('rerank', options, (abortSignal) =>
    sdkRerank<Document, Runtime>({ ...options, abortSignal }),
  );

const generateImage = (options: Parameters<typeof sdkGenerateImage>[0]) =>
  runRequest('generateImage', options, (abortSignal) =>
    sdkGenerateImage({ ...options, abortSignal }),
  );

const generateSpeech = (options: Parameters<typeof sdkGenerateSpeech>[0]) =>
  runRequest('generateSpeech', options, (abortSignal) =>
    sdkGenerateSpeech({ ...options, abortSignal }),
  );

const transcribe = (options: Parameters<typeof sdkTranscribe>[0]) =>
  runRequest('transcribe', options, (abortSignal) =>
    sdkTranscribe({ ...options, abortSignal }),
  );

interface AiSdkShape {
  /** Generate text or structured data with the supplied model and tools. */
  readonly generateText: typeof generateText;
  /** Emit SDK text, tool, and lifecycle events from a scoped request. */
  readonly streamText: typeof streamText;
  /** Embed one string. */
  readonly embed: typeof embed;
  /** Embed multiple strings in input order. */
  readonly embedMany: typeof embedMany;
  /** Rerank documents against a query. */
  readonly rerank: typeof rerank;
  /** Generate images from an SDK image prompt. */
  readonly generateImage: typeof generateImage;
  /** Generate audio from text. */
  readonly generateSpeech: typeof generateSpeech;
  /** Transcribe audio into text. */
  readonly transcribe: typeof transcribe;
}

/** An injectable Effect service for Vercel AI SDK Core requests. */
export class AiSdk extends Context.Service<AiSdk, AiSdkShape>()(
  '@jambudipa/ai-effect/AiSdk',
) {
  /** The live implementation backed by the installed AI SDK. */
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

/** The service contract for application code and test layers. */
export type AiSdkService = AiSdk['Service'];
