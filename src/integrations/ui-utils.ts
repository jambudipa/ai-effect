import * as sdk from '@ai-sdk/ui-utils';
import { Effect } from 'effect';
import { guardedFetch } from '../internal/fetch.js';
import {
  abortable,
  openOperation,
  runRequest,
  runSync,
  sdkError,
  type AiSdkError,
} from '../internal/operation.js';
import { ownReadable } from '../internal/readable.js';

export type {
  AssistantMessage,
  AssistantStatus,
  AssistantStreamString,
  Attachment,
  ChatRequest,
  ChatRequestOptions,
  CreateMessage,
  DataMessage,
  DataStreamString,
  DeepPartial,
  FileUIPart,
  JSONValue,
  Message,
  ReasoningUIPart,
  RequestOptions,
  SourceUIPart,
  StepStartUIPart,
  TextUIPart,
  ToolInvocation,
  ToolInvocationUIPart,
  UIMessage,
} from '@ai-sdk/ui-utils';

/** Generic callable type used to infer each native stream callback's argument list. */
type LegacyCallback = (...args: never[]) => unknown;
/** Extract native parser callbacks separately from the input byte stream. */
type Callbacks<Options> = Omit<Options, 'stream'>;
/** Preserve each native callback's argument list and make it return an Effect. */
type EffectCallbacks<Options, Services> = {
  [K in keyof Callbacks<Options>]: (
    ...args: Parameters<Extract<Callbacks<Options>[K], LegacyCallback>>
  ) => Effect.Effect<void, unknown, Services>;
};
/** Provide a native byte stream, cancellation signal, and Effect delivery callbacks for one reader. */
type ProcessOptions<Options, Services> = EffectCallbacks<Options, Services> & {
  readonly stream: ReadableStream<Uint8Array>;
  readonly abortSignal?: AbortSignal;
};

/** Parsed event union for the legacy AI SDK data stream protocol. */
type DataPart = ReturnType<typeof sdk.parseDataStreamPart>;
/** Parsed event union for the legacy AI SDK assistant stream protocol. */
type AssistantPart = ReturnType<typeof sdk.parseAssistantStreamPart>;
/** Match a legacy data event discriminator to its parsed payload. */
type DataValue<Kind extends DataPart['type']> = Extract<
  DataPart,
  { type: Kind }
>['value'];
/** Match a legacy assistant event discriminator to its parsed payload. */
type AssistantValue<Kind extends AssistantPart['type']> = Extract<
  AssistantPart,
  { type: Kind }
>['value'];
/** Handle one decoded payload with the services of the stream's owning scope. */
type StreamCallback<Value, R> = (
  part: Value,
) => Effect.Effect<void, unknown, R>;
/** Shared input byte stream and optional cancellation signal for legacy protocol readers. */
type StreamInput = {
  readonly stream: ReadableStream<Uint8Array>;
  readonly abortSignal?: AbortSignal;
};

/** Data protocol input with optional Effect callbacks keyed by event payload type. */
type DataStreamOptions<R> = StreamInput & {
  readonly onTextPart?: StreamCallback<DataValue<'text'>, R>;
  readonly onReasoningPart?: StreamCallback<DataValue<'reasoning'>, R>;
  readonly onReasoningSignaturePart?: StreamCallback<
    DataValue<'reasoning_signature'>,
    R
  >;
  readonly onRedactedReasoningPart?: StreamCallback<
    DataValue<'redacted_reasoning'>,
    R
  >;
  readonly onSourcePart?: StreamCallback<DataValue<'source'>, R>;
  readonly onFilePart?: StreamCallback<DataValue<'file'>, R>;
  readonly onDataPart?: StreamCallback<DataValue<'data'>, R>;
  readonly onErrorPart?: StreamCallback<DataValue<'error'>, R>;
  readonly onToolCallStreamingStartPart?: StreamCallback<
    DataValue<'tool_call_streaming_start'>,
    R
  >;
  readonly onToolCallDeltaPart?: StreamCallback<
    DataValue<'tool_call_delta'>,
    R
  >;
  readonly onToolCallPart?: StreamCallback<DataValue<'tool_call'>, R>;
  readonly onToolResultPart?: StreamCallback<DataValue<'tool_result'>, R>;
  readonly onMessageAnnotationsPart?: StreamCallback<
    DataValue<'message_annotations'>,
    R
  >;
  readonly onFinishMessagePart?: StreamCallback<DataValue<'finish_message'>, R>;
  readonly onFinishStepPart?: StreamCallback<DataValue<'finish_step'>, R>;
  readonly onStartStepPart?: StreamCallback<DataValue<'start_step'>, R>;
};

/** Assistant protocol input with optional Effect callbacks for assistant and control messages. */
type AssistantStreamOptions<R> = StreamInput & {
  readonly onTextPart?: StreamCallback<AssistantValue<'text'>, R>;
  readonly onErrorPart?: StreamCallback<AssistantValue<'error'>, R>;
  readonly onAssistantMessagePart?: StreamCallback<
    AssistantValue<'assistant_message'>,
    R
  >;
  readonly onAssistantControlDataPart?: StreamCallback<
    AssistantValue<'assistant_control_data'>,
    R
  >;
  readonly onDataMessagePart?: StreamCallback<
    AssistantValue<'data_message'>,
    R
  >;
};

/** Own the stream reader, bind native parser callbacks, and cancel processing when the scope closes. */
const processStream = <
  Options extends { stream: ReadableStream<Uint8Array> },
  Services,
>(
  operation: string,
  process: (options: Options) => Promise<void>,
  options: ProcessOptions<Options, Services>,
) =>
  Effect.scoped(
    Effect.gen(function* () {
      const { stream, abortSignal, ...callbacks } = options;
      const owner = yield* openOperation<Services>(abortSignal);
      const readable = yield* ownReadable(operation, stream);
      const adapted = Object.fromEntries(
        Object.entries(callbacks).map(([name, callback]) => [
          name,
          (...args: unknown[]) =>
            owner.runCallback(
              Effect.suspend(() =>
                (
                  callback as (
                    ...args: unknown[]
                  ) => Effect.Effect<void, unknown, Services>
                )(...args),
              ),
            ),
        ]),
      );
      return yield* abortable(
        operation,
        owner.signal,
        runRequest(operation, {}, () =>
          process({ ...adapted, stream: readable } as Options),
        ),
      );
    }),
  );

/** Process the ordered AI SDK 4 data stream with a scoped reader. */
export const processDataStream = <R = never>(options: DataStreamOptions<R>) =>
  processStream<Parameters<typeof sdk.processDataStream>[0], R>(
    'legacy.processDataStream',
    sdk.processDataStream,
    options,
  );

/** Process the ordered AI SDK 4 assistant stream with a scoped reader. */
export const processAssistantStream = <R = never>(
  options: AssistantStreamOptions<R>,
) =>
  processStream<Parameters<typeof sdk.processAssistantStream>[0], R>(
    'legacy.processAssistantStream',
    sdk.processAssistantStream,
    options,
  );

/** Process the legacy text stream with a scoped reader. */
export const processTextStream = <R = never>(
  options: StreamInput & { readonly onTextPart: StreamCallback<string, R> },
) =>
  processStream<Parameters<typeof sdk.processTextStream>[0], R>(
    'legacy.processTextStream',
    sdk.processTextStream,
    options,
  );

/** Describe the wire code, event name, parser, and formatter for a legacy data part. */
export type DataStreamPart<Code extends string, Name extends string, Value> = {
  readonly code: Code;
  readonly name: Name;
  readonly parse: (
    input: sdk.JSONValue,
  ) => Effect.Effect<{ type: Name; value: Value }, AiSdkError>;
};

/** Legacy assistant part descriptor with its wire code, name, and corresponding payload type. */
export type AssistantStreamPart<
  Code extends string,
  Name extends string,
  Value,
> = DataStreamPart<Code, Name, Value>;
/** Synchronous ID factory used by legacy host and message helpers. */
export type IdGenerator = () => string;

/** Encode a typed data part in the legacy wire format through the native formatter. */
export const formatDataStreamPart = <Kind extends DataPart['type']>(
  ...args: Parameters<typeof sdk.formatDataStreamPart<Kind>>
) =>
  runSync('legacy.formatDataStreamPart', () =>
    sdk.formatDataStreamPart<Kind>(...args),
  );

/** Encode a typed assistant part in the legacy wire format through the native formatter. */
export const formatAssistantStreamPart = <Kind extends AssistantPart['type']>(
  ...args: Parameters<typeof sdk.formatAssistantStreamPart<Kind>>
) =>
  runSync('legacy.formatAssistantStreamPart', () =>
    sdk.formatAssistantStreamPart<Kind>(...args),
  );

/** Parse a legacy data stream line and return a tagged failure for invalid native input. */
export const parseDataStreamPart = (
  line: string,
): Effect.Effect<DataPart, AiSdkError> =>
  runSync('legacy.parseDataStreamPart', () => sdk.parseDataStreamPart(line));

/** Parse a legacy assistant stream line through the native parser's tagged boundary. */
export const parseAssistantStreamPart = (line: string) =>
  runSync('legacy.parseAssistantStreamPart', () =>
    sdk.parseAssistantStreamPart(line),
  );

/** Create an SDK-compatible ID when the Effect runs. */
export const generateId = (...args: Parameters<typeof sdk.generateId>) =>
  runSync('legacy.generateId', () => sdk.generateId(...args));

/** Find the highest tool invocation step in the supplied legacy message sequence. */
export const extractMaxToolInvocationStep = (
  ...args: Parameters<typeof sdk.extractMaxToolInvocationStep>
) =>
  runSync('legacy.extractMaxToolInvocationStep', () =>
    sdk.extractMaxToolInvocationStep(...args),
  );

/** Populate legacy message parts from the stored message fields through the SDK helper. */
export const fillMessageParts = (
  ...args: Parameters<typeof sdk.fillMessageParts>
) => runSync('legacy.fillMessageParts', () => sdk.fillMessageParts(...args));

/** Derive the legacy parts representation of a message through the native conversion rules. */
export const getMessageParts = (
  ...args: Parameters<typeof sdk.getMessageParts>
) => runSync('legacy.getMessageParts', () => sdk.getMessageParts(...args));

/** Decode text from a data URL using the native helper's accepted formats. */
export const getTextFromDataUrl = (
  ...args: Parameters<typeof sdk.getTextFromDataUrl>
) =>
  runSync('legacy.getTextFromDataUrl', () => sdk.getTextFromDataUrl(...args));

/** Check whether an assistant message's tool calls have their required results. */
export const isAssistantMessageWithCompletedToolCalls = (
  ...args: Parameters<typeof sdk.isAssistantMessageWithCompletedToolCalls>
) =>
  runSync('legacy.isAssistantMessageWithCompletedToolCalls', () =>
    sdk.isAssistantMessageWithCompletedToolCalls(...args),
  );

/** Compare legacy data by the SDK's deep equality rules. */
export const isDeepEqualData = (
  ...args: Parameters<typeof sdk.isDeepEqualData>
) => runSync('legacy.isDeepEqualData', () => sdk.isDeepEqualData(...args));

/** Parse streamed JSON that may still be incomplete using the legacy SDK's parser. */
export const parsePartialJson = (
  ...args: Parameters<typeof sdk.parsePartialJson>
): Effect.Effect<ReturnType<typeof sdk.parsePartialJson>, AiSdkError> =>
  runSync('legacy.parsePartialJson', () => sdk.parsePartialJson(...args));

/** Convert request attachments through the native asynchronous file helper. */
export const prepareAttachmentsForRequest = (
  ...args: Parameters<typeof sdk.prepareAttachmentsForRequest>
) =>
  runRequest('legacy.prepareAttachmentsForRequest', {}, () =>
    sdk.prepareAttachmentsForRequest(...args),
  );

/** Apply native legacy chat rules to decide whether to submit messages again. */
export const shouldResubmitMessages = (
  ...args: Parameters<typeof sdk.shouldResubmitMessages>
) =>
  runSync('legacy.shouldResubmitMessages', () =>
    sdk.shouldResubmitMessages(...args),
  );

/** Insert a tool result into the matching invocation using the SDK's message update rules. */
export const updateToolCallResult = (
  ...args: Parameters<typeof sdk.updateToolCallResult>
) =>
  runSync('legacy.updateToolCallResult', () =>
    sdk.updateToolCallResult(...args),
  );

/** JSON Schema representation accepted by the legacy constructor. */
type LegacyJsonSchema = Parameters<typeof sdk.jsonSchema>[0];
/** Validation outcome that distinguishes decoded data from an ordinary validation failure. */
type Validated<A> =
  { success: true; value: A } | { success: false; error: Error };
/** Zod schema input supported by the legacy SDK's adapter. */
type LegacyZodSchema<A> = Parameters<typeof sdk.zodSchema<A>>[0];

/** Type-only brand that keeps legacy schemas distinct from other SDK schema families. */
declare const schemaFamily: unique symbol;

/** A schema for the legacy AI SDK 4 protocol. */
export type Schema<A = unknown, R = never> = {
  readonly [schemaFamily]: A;
  readonly jsonSchema: LegacyJsonSchema;
  readonly validate?: (
    value: unknown,
  ) => Effect.Effect<Validated<A>, AiSdkError, R>;
};

/** Preserve native JSON Schema and expose any validator through the tagged Effect boundary. */
const wrapSchema = <A>(schema: sdk.Schema<A>): Schema<A> => {
  const validate = schema.validate;
  return {
    jsonSchema: schema.jsonSchema,
    ...(validate
      ? {
          validate: (value: unknown) =>
            runSync('legacy.Schema.validate', () => {
              const result = validate(value);
              return result.success
                ? result
                : {
                    success: false,
                    error: sdkError('legacy.Schema.validate', result.error),
                  };
            }),
        }
      : {}),
  } as Schema<A>;
};

/** Build a legacy schema with an optional Effect validator supplied by the caller. */
export const jsonSchema = <A = unknown, R = never>(
  definition: LegacyJsonSchema,
  options?: {
    readonly validate?: (
      value: unknown,
    ) => Effect.Effect<Validated<A>, AiSdkError, R>;
  },
): Effect.Effect<Schema<A, R>, AiSdkError> =>
  runSync('legacy.jsonSchema', () => {
    const schema = sdk.jsonSchema<A>(definition);
    return {
      ...wrapSchema(schema),
      ...(options?.validate ? { validate: options.validate } : {}),
    };
  });

/** Adapt a supported Zod schema to the legacy protocol with deferred validation. */
export const zodSchema = <A>(...args: Parameters<typeof sdk.zodSchema<A>>) =>
  runSync('legacy.zodSchema', () => wrapSchema(sdk.zodSchema<A>(...args)));

/** Reuse an existing legacy schema or adapt a supported Zod schema through the SDK. */
export const asSchema = <A, R = never>(
  schema: LegacyZodSchema<A> | Schema<A, R>,
): Effect.Effect<Schema<A, R>, AiSdkError> =>
  runSync('legacy.asSchema', () =>
    'jsonSchema' in schema ? schema : wrapSchema(sdk.asSchema(schema)),
  );

/** Capture services and cancellation for response and tool callbacks on one legacy HTTP request. */
type RequestOwner<R> = Effect.Success<ReturnType<typeof openOperation<R>>>;
/** Native chat request options used to preserve update callback and message types. */
type ChatOptions = Parameters<typeof sdk.callChatApi>[0];
/** Host callback result accepted by the legacy framework-facing options. */
type HostResult<A> = A | PromiseLike<A> | Effect.Effect<A, unknown>;
/** Preserve the parameter order of the native chat finish callback. */
type ChatFinish = Parameters<NonNullable<sdk.UseChatOptions['onFinish']>>;
/** Native notification payload for a tool call received by the active chat host. */
type ToolCall = Parameters<NonNullable<sdk.UseChatOptions['onToolCall']>>[0];
/** Native chat update payload retained for host state changes. */
type ChatUpdate = Parameters<ChatOptions['onUpdate']>[0];

/** Shared transport settings for legacy hosts with a tagged error callback. */
type FetchSettings = {
  readonly credentials?: RequestCredentials;
  readonly headers?: Record<string, string> | Headers;
  readonly fetch?: typeof globalThis.fetch;
  readonly onError?: (error: AiSdkError) => HostResult<void>;
};
/** Shared text-host setup for endpoint selection, protocol, and response observation. */
type TextSettings = FetchSettings & {
  readonly api?: string;
  readonly id?: string;
  readonly initialInput?: string;
  readonly streamProtocol?: 'data' | 'text';
  readonly onResponse?: (response: Response) => HostResult<void>;
};

/** Legacy chat host options with native message state and optional client tool callbacks. */
export type UseChatOptions = TextSettings & {
  readonly initialMessages?: sdk.Message[];
  readonly onToolCall?: (call: ToolCall) => HostResult<unknown>;
  readonly onFinish?: (...args: ChatFinish) => HostResult<void>;
  readonly generateId?: IdGenerator;
  readonly body?: object;
  readonly sendExtraMessageFields?: boolean;
};

/** Legacy completion host options with initial output and optional finish handling. */
export type UseCompletionOptions = TextSettings & {
  readonly initialCompletion?: string;
  readonly onFinish?: (prompt: string, completion: string) => HostResult<void>;
  readonly body?: object;
};

/** Legacy assistant host settings for the endpoint, thread, and request payload. */
export type UseAssistantOptions = FetchSettings & {
  readonly api: string;
  readonly threadId?: string;
  readonly body?: object;
};

/** Common request settings for the legacy HTTP helpers and their scoped response callbacks. */
type HttpRequest<R> = {
  readonly api: string;
  readonly body: Record<string, unknown>;
  readonly streamProtocol: 'data' | 'text' | undefined;
  readonly credentials: RequestCredentials | undefined;
  readonly headers: HeadersInit | undefined;
  readonly onResponse:
    ((response: Response) => Effect.Effect<void, unknown, R>) | undefined;
  readonly fetch: typeof globalThis.fetch | undefined;
  readonly abortSignal?: AbortSignal;
};

/** Chat request with UI state updates, restore-on-failure behavior, and optional tool handling. */
type ChatRequestOptions<R> = HttpRequest<R> & {
  readonly abortController: (() => AbortController | null) | undefined;
  readonly restoreMessagesOnFailure: () => void;
  readonly onUpdate: (update: ChatUpdate) => void;
  readonly onFinish: ((...args: ChatFinish) => void) | undefined;
  readonly onToolCall:
    ((call: ToolCall) => Effect.Effect<unknown, unknown, R>) | undefined;
  readonly generateId: IdGenerator;
  readonly lastMessage: sdk.UIMessage | undefined;
  readonly requestType?: 'generate' | 'resume';
};

/** Completion request with text, loading, error, and abort state callbacks owned by the UI. */
type CompletionRequestOptions<R> = HttpRequest<R> & {
  readonly prompt: string;
  readonly setCompletion: (completion: string) => void;
  readonly setLoading: (loading: boolean) => void;
  readonly setError: (error: AiSdkError | undefined) => void;
  readonly setAbortController: (controller: AbortController | null) => void;
  readonly onFinish: ((prompt: string, completion: string) => void) | undefined;
  readonly onError: ((cause: AiSdkError) => void) | undefined;
  readonly onData: ((data: sdk.JSONValue[]) => void) | undefined;
};

/** Run the legacy HTTP request in a scope and connect its supplied abort signal to interruption. */
const scopedRequest = <A, R>(
  operation: string,
  signal: AbortSignal | undefined,
  request: (owner: RequestOwner<R>) => Promise<A>,
) =>
  Effect.scoped(
    Effect.gen(function* () {
      const owner = yield* openOperation<R>(signal);
      return yield* abortable(
        operation,
        owner.signal,
        runRequest(operation, {}, () => request(owner)),
      );
    }),
  );

/** Send or resume a legacy chat request while guarding UI updates after cancellation. */
export const callChatApi = <R = never>(options: ChatRequestOptions<R>) =>
  scopedRequest<void, R>('legacy.callChatApi', options.abortSignal, (owner) => {
    const { abortSignal, onResponse, onToolCall, ...request } = options;
    return sdk.callChatApi({
      ...request,
      fetch: guardedFetch(owner.signal, request.fetch),
      onUpdate: (update) => {
        if (!owner.signal.aborted) request.onUpdate(update);
      },
      onFinish:
        request.onFinish &&
        ((...args) => {
          if (!owner.signal.aborted) request.onFinish?.(...args);
        }),
      restoreMessagesOnFailure: () => {
        if (!owner.signal.aborted) request.restoreMessagesOnFailure();
      },
      onResponse:
        onResponse &&
        ((response) =>
          owner.runCallback(Effect.suspend(() => onResponse(response)))),
      onToolCall:
        onToolCall &&
        ((toolCall) =>
          owner.runCallback(Effect.suspend(() => onToolCall(toolCall)))),
    });
  });

/** Send a legacy text completion request and map native errors to tagged values for the host. */
export const callCompletionApi = <R = never>(
  options: CompletionRequestOptions<R>,
) =>
  scopedRequest<string | null | undefined, R>(
    'legacy.callCompletionApi',
    options.abortSignal,
    (owner) => {
      const { abortSignal, onResponse, ...request } = options;
      return sdk.callCompletionApi({
        ...request,
        fetch: guardedFetch(owner.signal, request.fetch),
        setCompletion: (value) => {
          if (!owner.signal.aborted) request.setCompletion(value);
        },
        onData:
          request.onData &&
          ((value) => {
            if (!owner.signal.aborted) request.onData?.(value);
          }),
        onFinish:
          request.onFinish &&
          ((...args) => {
            if (!owner.signal.aborted) request.onFinish?.(...args);
          }),
        onResponse:
          onResponse &&
          ((response) =>
            owner.runCallback(Effect.suspend(() => onResponse(response)))),
        setError: (cause) => {
          if (!owner.signal.aborted)
            request.setError(
              cause && sdkError('legacy.callCompletionApi', cause),
            );
        },
        onError:
          request.onError &&
          ((cause) => {
            if (!owner.signal.aborted)
              request.onError?.(sdkError('legacy.callCompletionApi', cause));
          }),
      });
    },
  );
