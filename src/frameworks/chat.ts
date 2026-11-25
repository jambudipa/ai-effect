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

type MessageData<Message> =
  Message extends UIMessage<infer _Meta, infer Data> ? Data : never;

type ChatEvent<
  Message extends UIMessage,
  K extends 'onToolCall' | 'onFinish' | 'onData',
> = Parameters<NonNullable<NativeInit<Message>[K]>>[0];

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

type MessageTools<Message> =
  Message extends UIMessage<infer _Meta, infer _Data, infer Tools>
    ? Tools
    : never;

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
  readonly #sdk: AbstractChat<Message>;
  readonly #view: ViewLifetime;

  protected constructor(sdk: AbstractChat<Message>, view: ViewLifetime) {
    this.#sdk = sdk;
    this.#view = view;
  }

  get id() {
    return this.#sdk.id;
  }
  get status() {
    return this.#sdk.status;
  }
  get error() {
    return viewError('Chat', this.#sdk.error);
  }
  get messages() {
    return this.#sdk.messages;
  }
  set messages(messages: Message[]) {
    this.#sdk.messages = messages;
  }
  get lastMessage() {
    return this.#sdk.lastMessage;
  }
  get experimental_queuedMessages() {
    return this.#sdk.experimental_queuedMessages;
  }

  readonly generateId = () =>
    this.#view.action('Chat.generateId', () => this.#sdk.generateId());
  readonly sendMessage = (
    ...args: Parameters<AbstractChat<Message>['sendMessage']>
  ) =>
    this.#view.command(
      'Chat.sendMessage',
      () => this.#sdk.sendMessage(...args),
      this.#sdk.stop,
    );
  readonly regenerate = (
    ...args: Parameters<AbstractChat<Message>['regenerate']>
  ) =>
    this.#view.command(
      'Chat.regenerate',
      () => this.#sdk.regenerate(...args),
      this.#sdk.stop,
    );
  readonly resumeStream = (
    ...args: Parameters<AbstractChat<Message>['resumeStream']>
  ) =>
    this.#view.command(
      'Chat.resumeStream',
      () => this.#sdk.resumeStream(...args),
      this.#sdk.stop,
    );
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
  readonly experimental_removeQueuedMessage = (
    ...args: Parameters<
      AbstractChat<Message>['experimental_removeQueuedMessage']
    >
  ) =>
    this.#view.action('Chat.experimental_removeQueuedMessage', () =>
      this.#sdk.experimental_removeQueuedMessage(...args),
    );
  readonly clearError = () =>
    this.#view.action('Chat.clearError', this.#sdk.clearError);
  readonly addToolApprovalResponse = (
    ...args: Parameters<AbstractChat<Message>['addToolApprovalResponse']>
  ) =>
    this.#view.command(
      'Chat.addToolApprovalResponse',
      () => this.#sdk.addToolApprovalResponse(...args),
      this.#sdk.stop,
    );
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
  readonly addToolResult = this.addToolOutput;
  readonly stop = () => runRequest('Chat.stop', {}, this.#sdk.stop);
  readonly dispose = () =>
    runRequest('Chat.dispose', {}, () => {
      this.#view.dispose();
      return this.#sdk.dispose();
    });
}
