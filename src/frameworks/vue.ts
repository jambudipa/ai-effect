import * as sdk from '@ai-sdk/vue';
import type { UIMessage } from 'ai';
import { Effect } from 'effect';
import {
  computed,
  getCurrentScope,
  onScopeDispose,
  toValue,
  type MaybeRefOrGetter,
} from 'vue';
import {
  HostChat,
  nativeChatOptions,
  type ChatInit,
  type ChatToolOutput,
} from './chat.js';
import { viewError, withLifetime } from './lifetime.js';
import {
  nativeCompletionOptions,
  nativeObjectOptions,
  nativeSchema,
  type CompletionOptions,
  type DecodedSchema,
  type HostSchema,
  type ObjectOptions,
} from './options.js';

export type { CompletionOptions as UseCompletionOptions } from './options.js';
export type { ChatInit } from './chat.js';

/** Register native cleanup when Vue exposes a current scope. */
const disposeWithScope = (cleanup: () => void) => {
  if (getCurrentScope()) onScopeDispose(cleanup);
};

/** @deprecated Use useChat. */
export class Chat<Message extends UIMessage> extends HostChat<Message> {
  /** Create the native Vue chat and register its disposal when a Vue scope is active. */
  constructor(options: ChatInit<Message>) {
    const view = withLifetime(disposeWithScope, () => {
      void native.dispose().catch(() => {});
    });
    const native = new sdk.Chat<Message>(nativeChatOptions(options, view));
    super(native, view);
  }
}

/** Preserve the typed chat configuration and optional Vue subscription throttle. */
export type UseChatOptions<Message extends UIMessage> = ChatInit<Message> & {
  readonly throttle?: number;
};

/** Infer tool names and output types from the message type passed to the Vue hook. */
type MessageTools<Message> =
  Message extends UIMessage<infer _Meta, infer _Data, infer Tools>
    ? Tools
    : never;

/**
 * Expose Vue refs and view-owned chat commands. Accept plain options, a ref, or a getter.
 */
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

/** Keep typed Vue message and status refs alongside Effect chat operations. */
export type UseChatHelpers<Message extends UIMessage> = ReturnType<
  typeof useChat<Message>
>;

/** Expose native Vue completion refs and lazy request commands bound to the Vue scope. */
export function useCompletion<Body extends object = object>(
  options?: CompletionOptions<NoInfer<Body>>,
) {
  const view = withLifetime(disposeWithScope, () => native.stop());
  const native = sdk.useCompletion<Body>(
    nativeCompletionOptions(view, options),
  );
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

/**
 * Expose Vue completion state and Effect controls with the configured request body type.
 */
export type UseCompletionHelpers<Body extends object = object> = ReturnType<
  typeof useCompletion<Body>
>;

/** Restrict structured output options to schemas supported by the native host bridge. */
type Decoder = HostSchema<unknown>;
/** Use the converted schema shape accepted by the native Vue hook. */
type NativeSchema = ReturnType<typeof nativeSchema<unknown>>;
/** Configure a Vue structured request endpoint and infer its result from the decoder. */
export type UseObjectOptions<
  S extends Decoder,
  Result = DecodedSchema<S>,
> = ObjectOptions<S, Result>;

/**
 * Expose Vue partial object state and bind structured request controls to the active Vue
 * scope.
 */
export function useObject<
  S extends Decoder,
  Result = DecodedSchema<S>,
  Input = unknown,
>(options: UseObjectOptions<S, Result>) {
  const view = withLifetime(disposeWithScope, () => native.stop());
  const native = sdk.useObject<NativeSchema, Result, Input>(
    nativeObjectOptions(view, options),
  );
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

/** Carry the inferred result and request types on Vue structured output controls. */
export type UseObjectHelpers<Result, Input> = ReturnType<
  typeof useObject<Decoder, Result, Input>
>;
/** Keep the previous Vue hook name for structured object generation. */
export const experimental_useObject = useObject;
/** Preserve the former Vue schema-derived options type name. */
export type Experimental_UseObjectOptions<
  S extends Decoder,
  Result,
> = UseObjectOptions<S, Result>;
/** Preserve the former Vue result and input helper type name. */
export type Experimental_UseObjectHelpers<Result, Input> = UseObjectHelpers<
  Result,
  Input
>;
