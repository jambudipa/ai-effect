import type {
  AbstractChat,
  ChatInit as NativeInit,
  ChatRequestOptions,
  UIMessage,
} from 'ai';
import {
  runRequest,
  sdkError,
  type AiSdkError,
} from '../internal/operation.js';
import {
  type ChatTransport,
  unwrapChatTransport,
} from '../internal/chat-transport.js';
import { ViewLifetime, viewError, type HostResult } from './lifetime.js';
import { nativeSchema, type HostSchema } from './options.js';

/** Derive the named data parts from the message type for schema selection. */
type MessageData<Message> =
  Message extends UIMessage<infer _Meta, infer Data> ? Data : never;

/** Use the SDK callback payload for the selected chat event. */
type ChatEvent<
  Message extends UIMessage,
  K extends 'onToolCall' | 'onFinish' | 'onData',
> = Parameters<NonNullable<NativeInit<Message>[K]>>[0];

/**
 * Configure typed chat state, an adapted transport, and callbacks owned by the host view.
 */
export type ChatInit<Message extends UIMessage> = {
  readonly id?: string;
  readonly messageMetadataSchema?: HostSchema<Message['metadata']>;
  readonly dataPartSchemas?: {
    [K in keyof MessageData<Message>]: HostSchema<MessageData<Message>[K]>;
  };
  readonly messages?: Message[];
  readonly generateId?: () => string;
  readonly transport?: ChatTransport<Message>;
  readonly onError?: (error: AiSdkError) => HostResult<void>;
  readonly onToolCall?: (
    event: ChatEvent<Message, 'onToolCall'>,
  ) => HostResult<void>;
  readonly onFinish?: (
    event: ChatEvent<Message, 'onFinish'>,
  ) => HostResult<void>;
  readonly onData?: (event: ChatEvent<Message, 'onData'>) => HostResult<void>;
  readonly sendAutomaticallyWhen?: (options: {
    messages: Message[];
  }) => HostResult<boolean>;
  readonly experimental_queue?: boolean;
};

/** Derive available tool names and output types from the message contract. */
type MessageTools<Message> =
  Message extends UIMessage<infer _Meta, infer _Data, infer Tools>
    ? Tools
    : never;

/**
 * Associate the tool result with a call ID. A success carries the typed output, and a
 * failure carries error text.
 */
export type ChatToolOutput<
  Message,
  Name extends keyof MessageTools<Message>,
> = {
  readonly tool: Name;
  readonly toolCallId: string;
  readonly options?: ChatRequestOptions;
} & (
  | {
      readonly state?: 'output-available';
      readonly output: MessageTools<Message>[Name]['output'];
      readonly errorText?: never;
    }
  | {
      readonly state: 'output-error';
      readonly output?: never;
      readonly errorText: string;
    }
);

/**
 * Unwrap the transport, adapt schemas, and bind value-returning and notification callbacks
 * to the view lifetime.
 */
export const nativeChatOptions = <Message extends UIMessage>(
  {
    transport,
    messageMetadataSchema,
    dataPartSchemas,
    onError,
    onToolCall,
    onFinish,
    onData,
    sendAutomaticallyWhen,
    ...init
  }: ChatInit<Message>,
  view: ViewLifetime,
): NativeInit<Message> => {
  const native = transport ? unwrapChatTransport(transport) : undefined;
  if (transport && !native)
    throw sdkError('Chat', 'Invalid chat transport handle');
  const schedule =
    <A>(callback: (event: A) => HostResult<void>) =>
    (event: A) =>
      view.notify('Chat.callback', callback, event);
  const awaitResult =
    <Event, A>(callback: (event: Event) => HostResult<A>, fallback: A) =>
    (event: Event) =>
      view.signal.aborted
        ? fallback
        : view.callback('Chat.callback', () => callback(event));
  return {
    ...init,
    ...(native ? { transport: native } : {}),
    ...(messageMetadataSchema
      ? { messageMetadataSchema: nativeSchema(messageMetadataSchema) }
      : {}),
    ...(dataPartSchemas
      ? {
          dataPartSchemas: Object.fromEntries(
            Object.entries(dataPartSchemas).map(([name, input]) => [
              name,
              nativeSchema(input as HostSchema<unknown>),
            ]),
          ) as NonNullable<NativeInit<Message>['dataPartSchemas']>,
        }
      : {}),
    ...(onError
      ? {
          onError: (cause: Error) => schedule(onError)(sdkError('Chat', cause)),
        }
      : {}),
    ...(onToolCall ? { onToolCall: awaitResult(onToolCall, undefined) } : {}),
    ...(onFinish ? { onFinish: schedule(onFinish) } : {}),
    ...(onData ? { onData: schedule(onData) } : {}),
    ...(sendAutomaticallyWhen
      ? { sendAutomaticallyWhen: awaitResult(sendAutomaticallyWhen, false) }
      : {}),
  };
};

/** Adapt the common members of the host-specific SDK chat classes. */
export class HostChat<Message extends UIMessage> {
  /** Keep this handle paired with one native chat and its reactive state. */
  readonly #sdk: AbstractChat<Message>;
  /** Own callback cancellation and prevent new view commands after disposal. */
  readonly #view: ViewLifetime;

  /**
   * Require the native chat and its associated lifetime so subclasses can bind host
   * cleanup.
   */
  protected constructor(sdk: AbstractChat<Message>, view: ViewLifetime) {
    this.#sdk = sdk;
    this.#view = view;
  }

  /** Read the native conversation ID. */
  get id() {
    return this.#sdk.id;
  }
  /** Read the native chat status for UI state updates. */
  get status() {
    return this.#sdk.status;
  }
  /** Read the latest native chat failure as `AiSdkError`. */
  get error() {
    return viewError('Chat', this.#sdk.error);
  }
  /** Read the SDK conversation array used by the native framework store. */
  get messages() {
    return this.#sdk.messages;
  }
  /** Replace the native conversation array without sending a message. */
  set messages(messages: Message[]) {
    this.#sdk.messages = messages;
  }
  /** Read the native tail message when the conversation contains one. */
  get lastMessage() {
    return this.#sdk.lastMessage;
  }
  /** Read the current native queue for messages awaiting delivery. */
  get experimental_queuedMessages() {
    return this.#sdk.experimental_queuedMessages;
  }

  /** Generate a message ID lazily with the configured native generator. */
  readonly generateId = () =>
    this.#view.action('Chat.generateId', () => this.#sdk.generateId());
  /** Send a chat message when the Effect runs. Interruption stops the native stream. */
  readonly sendMessage = (
    ...args: Parameters<AbstractChat<Message>['sendMessage']>
  ) =>
    this.#view.command(
      'Chat.sendMessage',
      () => this.#sdk.sendMessage(...args),
      this.#sdk.stop,
    );
  /**
   * Repeat native response generation at the chosen message. Interruption stops the
   * stream.
   */
  readonly regenerate = (
    ...args: Parameters<AbstractChat<Message>['regenerate']>
  ) =>
    this.#view.command(
      'Chat.regenerate',
      () => this.#sdk.regenerate(...args),
      this.#sdk.stop,
    );
  /** Resume an existing native response stream without creating a new message. */
  readonly resumeStream = (
    ...args: Parameters<AbstractChat<Message>['resumeStream']>
  ) =>
    this.#view.command(
      'Chat.resumeStream',
      () => this.#sdk.resumeStream(...args),
      this.#sdk.stop,
    );
  /** Ask the native queue to send the chosen message immediately when the Effect runs. */
  readonly experimental_sendQueuedMessageNow = (
    ...args: Parameters<
      AbstractChat<Message>['experimental_sendQueuedMessageNow']
    >
  ) =>
    this.#view.command(
      'Chat.experimental_sendQueuedMessageNow',
      () => this.#sdk.experimental_sendQueuedMessageNow(...args),
      this.#sdk.stop,
    );
  /** Remove a queued message through the native queue action. */
  readonly experimental_removeQueuedMessage = (
    ...args: Parameters<
      AbstractChat<Message>['experimental_removeQueuedMessage']
    >
  ) =>
    this.#view.action('Chat.experimental_removeQueuedMessage', () =>
      this.#sdk.experimental_removeQueuedMessage(...args),
    );
  /** Reset the native chat error from a view-bound Effect action. */
  readonly clearError = () =>
    this.#view.action('Chat.clearError', this.#sdk.clearError);
  /** Provide a tool approval decision with the SDK call options when the Effect runs. */
  readonly addToolApprovalResponse = (
    ...args: Parameters<AbstractChat<Message>['addToolApprovalResponse']>
  ) =>
    this.#view.command(
      'Chat.addToolApprovalResponse',
      () => this.#sdk.addToolApprovalResponse(...args),
      this.#sdk.stop,
    );
  /**
   * Attach a typed tool result to its native call ID and run any follow-up work in the
   * view lifetime.
   */
  readonly addToolOutput = <Name extends keyof MessageTools<Message>>(
    options: ChatToolOutput<Message, Name>,
  ) =>
    this.#view.command(
      'Chat.addToolOutput',
      () =>
        this.#sdk.addToolOutput(
          options as Parameters<AbstractChat<Message>['addToolOutput']>[0],
        ),
      this.#sdk.stop,
    );
  /** Alias the typed tool output operation for SDK compatibility. */
  readonly addToolResult = this.addToolOutput;
  /** Stop the native chat request through the Effect request bridge. */
  readonly stop = () => runRequest('Chat.stop', {}, this.#sdk.stop);
  /**
   * Abort the view lifetime and dispose of the native chat so it releases owned state.
   */
  readonly dispose = () =>
    runRequest('Chat.dispose', {}, () => {
      this.#view.dispose();
      return this.#sdk.dispose();
    });
}
