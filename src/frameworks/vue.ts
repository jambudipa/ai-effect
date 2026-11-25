import * as sdk from '@ai-sdk/vue';
import type { UIMessage } from 'ai';
import { Effect, Schema } from 'effect';
import {
  computed,
  getCurrentScope,
  onScopeDispose,
  toValue,
  type MaybeRefOrGetter,
} from 'vue';
import { toSdkSchema } from '../internal/schema.js';
import {
  HostChat,
  nativeChatOptions,
  type ChatInit,
  type ChatToolOutput,
} from './chat.js';
import { viewError, withLifetime } from './lifetime.js';

export type { UseCompletionOptions } from '@ai-sdk/vue';
export type { ChatInit } from './chat.js';

const disposeWithScope = (cleanup: () => void) => {
  if (getCurrentScope()) onScopeDispose(cleanup);
};

/** @deprecated Use useChat. */
export class Chat<Message extends UIMessage> extends HostChat<Message> {
  constructor(options: ChatInit<Message>) {
    const view = withLifetime(disposeWithScope, () => {
      void native.dispose().catch(() => {});
    });
    const native = new sdk.Chat<Message>(nativeChatOptions(options, view));
    super(native, view);
  }
}

export type UseChatOptions<Message extends UIMessage> = ChatInit<Message> & {
  readonly throttle?: number;
};

type MessageTools<Message> =
  Message extends UIMessage<infer _Meta, infer _Data, infer Tools>
    ? Tools
    : never;

export function useChat<Message extends UIMessage = UIMessage>(
  options?: MaybeRefOrGetter<UseChatOptions<Message>>,
) {
  const view = withLifetime(disposeWithScope, () => {
    void native.stop().catch(() => {});
  });
  const native = sdk.useChat<Message>(() => {
    const { throttle, ...input } = toValue(options) ?? {};
    return {
      ...nativeChatOptions(input, view),
      ...(throttle === undefined ? {} : { throttle }),
    };
  });
  return {
    messages: native.messages,
    status: native.status,
    id: native.id,
    error: computed(() => viewError('useChat', native.error.value)),
    experimental_queuedMessages: native.experimental_queuedMessages,
    sendMessage: (...args: Parameters<typeof native.sendMessage>) =>
      view.command(
        'useChat.sendMessage',
        () => native.sendMessage(...args),
        native.stop,
      ),
    regenerate: (...args: Parameters<typeof native.regenerate>) =>
      view.command(
        'useChat.regenerate',
        () => native.regenerate(...args),
        native.stop,
      ),
    resumeStream: (...args: Parameters<typeof native.resumeStream>) =>
      view.command(
        'useChat.resumeStream',
        () => native.resumeStream(...args),
        native.stop,
      ),
    addToolOutput: <Name extends keyof MessageTools<Message>>(
      options: ChatToolOutput<Message, Name>,
    ) =>
      view.command(
        'useChat.addToolOutput',
        () =>
          native.addToolOutput(
            options as Parameters<typeof native.addToolOutput>[0],
          ),
        native.stop,
      ),
    addToolApprovalResponse: (
      ...args: Parameters<typeof native.addToolApprovalResponse>
    ) =>
      view.command(
        'useChat.addToolApprovalResponse',
        () => native.addToolApprovalResponse(...args),
        native.stop,
      ),
    stop: () => view.command('useChat.stop', native.stop),
    clearError: () => view.action('useChat.clearError', native.clearError),
    experimental_removeQueuedMessage: (
      ...args: Parameters<typeof native.experimental_removeQueuedMessage>
    ) =>
      view.action('useChat.experimental_removeQueuedMessage', () =>
        native.experimental_removeQueuedMessage(...args),
      ),
    experimental_sendQueuedMessageNow: (
      ...args: Parameters<typeof native.experimental_sendQueuedMessageNow>
    ) =>
      view.command(
        'useChat.experimental_sendQueuedMessageNow',
        () => native.experimental_sendQueuedMessageNow(...args),
        native.stop,
      ),
  };
}

export type UseChatHelpers<Message extends UIMessage> = ReturnType<
  typeof useChat<Message>
>;

export function useCompletion<Body extends object = object>(
  options?: Parameters<typeof sdk.useCompletion<Body>>[0],
) {
  const view = withLifetime(disposeWithScope, () => native.stop());
  const native = sdk.useCompletion<Body>({
    ...options,
    fetch: view.fetch(options?.fetch),
    onFinish: (...args) => {
      if (!view.signal.aborted) options?.onFinish?.(...args);
    },
    onError: (cause) => {
      if (!view.signal.aborted)
        options?.onError?.(viewError('useCompletion', cause)!);
    },
  });
  const complete = (...args: Parameters<typeof native.complete>) =>
    view.command(
      'useCompletion.complete',
      () => native.complete(...args),
      native.stop,
    );
  return {
    completion: native.completion,
    input: native.input,
    isLoading: native.isLoading,
    error: computed(() => viewError('useCompletion', native.error.value)),
    setCompletion: (...args: Parameters<typeof native.setCompletion>) =>
      native.setCompletion(...args),
    complete,
    handleSubmit: (event?: { preventDefault?: () => void }) =>
      Effect.suspend(() => {
        event?.preventDefault?.();
        return native.input.value
          ? Effect.asVoid(complete(native.input.value))
          : Effect.void;
      }),
    stop: () => view.action('useCompletion.stop', native.stop),
  };
}

export type UseCompletionHelpers<Body extends object = object> = ReturnType<
  typeof useCompletion<Body>
>;

type Decoder = Schema.ConstraintDecoder<unknown>;
type NativeSchema = ReturnType<typeof toSdkSchema<unknown, never>>;
export type UseObjectOptions<S extends Decoder, Result = S['Type']> = Omit<
  sdk.UseObjectOptions<NativeSchema, Result>,
  'schema'
> & { readonly schema: S };

export function useObject<
  S extends Decoder,
  Result = S['Type'],
  Input = unknown,
>(options: UseObjectOptions<S, Result>) {
  const view = withLifetime(disposeWithScope, () => native.stop());
  const native = sdk.useObject<NativeSchema, Result, Input>({
    ...options,
    schema: toSdkSchema(options.schema),
    fetch: view.fetch(options.fetch),
    onFinish: (event) => {
      if (!view.signal.aborted)
        return options.onFinish?.({
          ...event,
          error: viewError('useObject', event.error),
        });
    },
    onError: (cause) => {
      if (!view.signal.aborted)
        options.onError?.(viewError('useObject', cause)!);
    },
  });
  return {
    object: native.object,
    error: computed(() => viewError('useObject', native.error.value)),
    isLoading: native.isLoading,
    submit: (input: Input) =>
      view.command('useObject.submit', () => native.submit(input), native.stop),
    stop: () => view.action('useObject.stop', native.stop),
    clear: () => view.action('useObject.clear', native.clear),
  };
}

export type UseObjectHelpers<Result, Input> = ReturnType<
  typeof useObject<Decoder, Result, Input>
>;
export const experimental_useObject = useObject;
export type Experimental_UseObjectOptions<
  S extends Decoder,
  Result,
> = UseObjectOptions<S, Result>;
export type Experimental_UseObjectHelpers<Result, Input> = UseObjectHelpers<
  Result,
  Input
>;
