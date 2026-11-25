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

type LegacyCallback = (...args: never[]) => unknown;
type Callbacks<Options> = Omit<Options, 'stream'>;
type EffectCallbacks<Options, Services> = {
  [K in keyof Callbacks<Options>]: (
    ...args: Parameters<Extract<Callbacks<Options>[K], LegacyCallback>>
  ) => Effect.Effect<void, unknown, Services>;
};
type ProcessOptions<Options, Services> = EffectCallbacks<Options, Services> & {
  readonly stream: ReadableStream<Uint8Array>;
  readonly abortSignal?: AbortSignal;
};

type DataPart = ReturnType<typeof sdk.parseDataStreamPart>;
type AssistantPart = ReturnType<typeof sdk.parseAssistantStreamPart>;
type DataValue<Kind extends DataPart['type']> = Extract<
  DataPart,
  { type: Kind }
>['value'];
type AssistantValue<Kind extends AssistantPart['type']> = Extract<
  AssistantPart,
  { type: Kind }
>['value'];
type StreamCallback<Value, R> = (
  part: Value,
) => Effect.Effect<void, unknown, R>;
type StreamInput = {
  readonly stream: ReadableStream<Uint8Array>;
  readonly abortSignal?: AbortSignal;
};

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
  processStream('legacy.processDataStream', sdk.processDataStream, options);

/** Process the ordered AI SDK 4 assistant stream with a scoped reader. */
export const processAssistantStream = <R = never>(
  options: AssistantStreamOptions<R>,
) =>
  processStream(
    'legacy.processAssistantStream',
    sdk.processAssistantStream,
    options,
  );

/** Process the legacy text stream with a scoped reader. */
export const processTextStream = <R = never>(
  options: StreamInput & { readonly onTextPart: StreamCallback<string, R> },
) => processStream('legacy.processTextStream', sdk.processTextStream, options);

export type DataStreamPart<Code extends string, Name extends string, Value> = {
  readonly code: Code;
  readonly name: Name;
  readonly parse: (
    input: sdk.JSONValue,
  ) => Effect.Effect<{ type: Name; value: Value }, AiSdkError>;
};

export type AssistantStreamPart<
  Code extends string,
  Name extends string,
  Value,
> = DataStreamPart<Code, Name, Value>;
export type IdGenerator = () => string;

export const formatDataStreamPart = <Kind extends DataPart['type']>(
  ...args: Parameters<typeof sdk.formatDataStreamPart<Kind>>
) =>
  runSync('legacy.formatDataStreamPart', () =>
    sdk.formatDataStreamPart<Kind>(...args),
  );

export const formatAssistantStreamPart = <Kind extends AssistantPart['type']>(
  ...args: Parameters<typeof sdk.formatAssistantStreamPart<Kind>>
) =>
  runSync('legacy.formatAssistantStreamPart', () =>
    sdk.formatAssistantStreamPart<Kind>(...args),
  );

export const parseDataStreamPart = (
  line: string,
): Effect.Effect<DataPart, AiSdkError> =>
  runSync('legacy.parseDataStreamPart', () => sdk.parseDataStreamPart(line));

export const parseAssistantStreamPart = (line: string) =>
  runSync('legacy.parseAssistantStreamPart', () =>
    sdk.parseAssistantStreamPart(line),
  );

export const generateId = (...args: Parameters<typeof sdk.generateId>) =>
  runSync('legacy.generateId', () => sdk.generateId(...args));

export const extractMaxToolInvocationStep = (
  ...args: Parameters<typeof sdk.extractMaxToolInvocationStep>
) =>
  runSync('legacy.extractMaxToolInvocationStep', () =>
    sdk.extractMaxToolInvocationStep(...args),
  );

export const fillMessageParts = (
  ...args: Parameters<typeof sdk.fillMessageParts>
) => runSync('legacy.fillMessageParts', () => sdk.fillMessageParts(...args));

export const getMessageParts = (
  ...args: Parameters<typeof sdk.getMessageParts>
) => runSync('legacy.getMessageParts', () => sdk.getMessageParts(...args));

export const getTextFromDataUrl = (
  ...args: Parameters<typeof sdk.getTextFromDataUrl>
) =>
  runSync('legacy.getTextFromDataUrl', () => sdk.getTextFromDataUrl(...args));

export const isAssistantMessageWithCompletedToolCalls = (
  ...args: Parameters<typeof sdk.isAssistantMessageWithCompletedToolCalls>
) =>
  runSync('legacy.isAssistantMessageWithCompletedToolCalls', () =>
    sdk.isAssistantMessageWithCompletedToolCalls(...args),
  );

export const isDeepEqualData = (
  ...args: Parameters<typeof sdk.isDeepEqualData>
) => runSync('legacy.isDeepEqualData', () => sdk.isDeepEqualData(...args));

export const parsePartialJson = (
  ...args: Parameters<typeof sdk.parsePartialJson>
): Effect.Effect<ReturnType<typeof sdk.parsePartialJson>, AiSdkError> =>
  runSync('legacy.parsePartialJson', () => sdk.parsePartialJson(...args));

export const prepareAttachmentsForRequest = (
  ...args: Parameters<typeof sdk.prepareAttachmentsForRequest>
) =>
  runRequest('legacy.prepareAttachmentsForRequest', {}, () =>
    sdk.prepareAttachmentsForRequest(...args),
  );

export const shouldResubmitMessages = (
  ...args: Parameters<typeof sdk.shouldResubmitMessages>
) =>
  runSync('legacy.shouldResubmitMessages', () =>
    sdk.shouldResubmitMessages(...args),
  );

export const updateToolCallResult = (
  ...args: Parameters<typeof sdk.updateToolCallResult>
) =>
  runSync('legacy.updateToolCallResult', () =>
    sdk.updateToolCallResult(...args),
  );

type LegacyJsonSchema = Parameters<typeof sdk.jsonSchema>[0];
type Validated<A> =
  { success: true; value: A } | { success: false; error: Error };
type LegacyZodSchema<A> = Parameters<typeof sdk.zodSchema<A>>[0];

declare const schemaFamily: unique symbol;

/** A schema for the legacy AI SDK 4 protocol. */
export type Schema<A = unknown, R = never> = {
  readonly [schemaFamily]: A;
  readonly jsonSchema: LegacyJsonSchema;
  readonly validate?: (
    value: unknown,
  ) => Effect.Effect<Validated<A>, AiSdkError, R>;
};

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

export const zodSchema = <A>(...args: Parameters<typeof sdk.zodSchema<A>>) =>
  runSync('legacy.zodSchema', () => wrapSchema(sdk.zodSchema<A>(...args)));

export const asSchema = <A, R = never>(
  schema: LegacyZodSchema<A> | Schema<A, R>,
): Effect.Effect<Schema<A, R>, AiSdkError> =>
  runSync('legacy.asSchema', () =>
    'jsonSchema' in schema ? schema : wrapSchema(sdk.asSchema(schema)),
  );

type RequestOwner<R> = Effect.Success<ReturnType<typeof openOperation<R>>>;
type ChatOptions = Parameters<typeof sdk.callChatApi>[0];
type HostResult<A> = A | PromiseLike<A> | Effect.Effect<A, unknown>;
type ChatFinish = Parameters<NonNullable<sdk.UseChatOptions['onFinish']>>;
type ToolCall = Parameters<NonNullable<sdk.UseChatOptions['onToolCall']>>[0];
type ChatUpdate = Parameters<ChatOptions['onUpdate']>[0];

type FetchSettings = {
  readonly credentials?: RequestCredentials;
  readonly headers?: Record<string, string> | Headers;
  readonly fetch?: typeof globalThis.fetch;
  readonly onError?: (error: AiSdkError) => HostResult<void>;
};
type TextSettings = FetchSettings & {
  readonly api?: string;
  readonly id?: string;
  readonly initialInput?: string;
  readonly streamProtocol?: 'data' | 'text';
  readonly onResponse?: (response: Response) => HostResult<void>;
};

export type UseChatOptions = TextSettings & {
  readonly initialMessages?: sdk.Message[];
  readonly onToolCall?: (call: ToolCall) => HostResult<unknown>;
  readonly onFinish?: (...args: ChatFinish) => HostResult<void>;
  readonly generateId?: IdGenerator;
  readonly body?: object;
  readonly sendExtraMessageFields?: boolean;
};

export type UseCompletionOptions = TextSettings & {
  readonly initialCompletion?: string;
  readonly onFinish?: (prompt: string, completion: string) => HostResult<void>;
  readonly body?: object;
};

export type UseAssistantOptions = FetchSettings & {
  readonly api: string;
  readonly threadId?: string;
  readonly body?: object;
};

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
