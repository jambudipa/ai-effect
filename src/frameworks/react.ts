'use client';

import * as sdk from '@ai-sdk/react';
import type { UIMessage } from 'ai';
import { Effect, Schema } from 'effect';
import { createElement, useEffect, useMemo } from 'react';
import { runSync, sdkError } from '../internal/operation.js';
import {
  unwrapRealtimeModel,
  type RealtimeModelV4,
} from '../internal/provider-realtime.js';
import { toSdkSchema } from '../internal/schema.js';
import {
  HostChat,
  nativeChatOptions,
  type ChatInit,
  type ChatToolOutput,
} from './chat.js';
import { ViewLifetime, viewError } from './lifetime.js';

export type {
  CreateUIMessage,
  Experimental_RealtimeStatus,
  MCPAppBridgeHandlers,
  MCPAppMetadata,
  MCPAppPermission,
  MCPAppRendererProps,
  MCPAppSandboxConfig,
} from '@ai-sdk/react';
export type { ChatInit } from './chat.js';

const nativeChats = new WeakMap<object, unknown>();

export class Chat<Message extends UIMessage> extends HostChat<Message> {
  readonly #native: sdk.Chat<Message>;

  constructor(options: ChatInit<Message>) {
    const view = new ViewLifetime();
    const native = new sdk.Chat<Message>(nativeChatOptions(options, view));
    super(native, view);
    this.#native = native;
    nativeChats.set(this, native);
  }

  #subscription(register: () => () => void) {
    return Effect.acquireRelease(
      runSync('Chat.subscribe', () => {
        const unregister = register();
        let active = true;
        return Effect.sync(() => {
          if (active) {
            active = false;
            unregister();
          }
        });
      }),
      (release) => release,
    );
  }

  readonly '~registerMessagesCallback' = (
    ...args: Parameters<sdk.Chat<Message>['~registerMessagesCallback']>
  ) =>
    this.#subscription(() =>
      this.#native['~registerMessagesCallback'](...args),
    );
  readonly '~registerStatusCallback' = (
    ...args: Parameters<sdk.Chat<Message>['~registerStatusCallback']>
  ) =>
    this.#subscription(() => this.#native['~registerStatusCallback'](...args));
  readonly '~registerErrorCallback' = (
    ...args: Parameters<sdk.Chat<Message>['~registerErrorCallback']>
  ) =>
    this.#subscription(() => this.#native['~registerErrorCallback'](...args));
  readonly '~registerQueuedMessagesCallback' = (
    ...args: Parameters<sdk.Chat<Message>['~registerQueuedMessagesCallback']>
  ) =>
    this.#subscription(() =>
      this.#native['~registerQueuedMessagesCallback'](...args),
    );
}

const useLifetime = (key?: unknown) => {
  const { view, stop } = useMemo(
    () => ({
      view: new ViewLifetime(),
      stop: { current: undefined as (() => unknown) | undefined },
    }),
    [key],
  );
  useEffect(() => {
    view.activate();
    return () => {
      view.dispose();
      void Promise.resolve(stop.current?.()).catch(() => {});
    };
  }, [view]);
  return { view, stop };
};

type ChatControls = Readonly<{
  throttle?: number;
  experimental_throttle?: number;
  resume?: boolean;
}>;

export type UseChatOptions<Message extends UIMessage> = (
  { readonly chat: Chat<Message> } | ChatInit<Message>
) &
  ChatControls;

type MessageTools<Message> =
  Message extends UIMessage<infer _Meta, infer _Data, infer Tools>
    ? Tools
    : never;

/** Keep the native hook synchronous and give its commands the view lifetime. */
export function useChat<Message extends UIMessage = UIMessage>(
  options?: UseChatOptions<Message>,
) {
  const { throttle, experimental_throttle, resume } = options ?? {};
  const controls = {
    ...(throttle === undefined ? {} : { throttle }),
    ...(experimental_throttle === undefined ? {} : { experimental_throttle }),
    ...(resume === undefined ? {} : { resume }),
  };
  const existing = options && 'chat' in options ? options.chat : undefined;
  const key = options && 'id' in options ? options.id : existing;
  const { view, stop } = useLifetime(key);
  const native = sdk.useChat<Message>(
    existing
      ? { ...controls, chat: nativeChats.get(existing) as sdk.Chat<Message> }
      : {
          ...controls,
          ...nativeChatOptions((options ?? {}) as ChatInit<Message>, view),
        },
  );
  stop.current = native.stop;
  return {
    id: native.id,
    status: native.status,
    messages: native.messages,
    experimental_queuedMessages: native.experimental_queuedMessages,
    error: viewError('useChat', native.error),
    setMessages: (...args: Parameters<typeof native.setMessages>) =>
      native.setMessages(...args),
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
    stop: () => view.command('useChat.stop', native.stop),
    clearError: () => view.action('useChat.clearError', native.clearError),
    addToolApprovalResponse: (
      ...args: Parameters<typeof native.addToolApprovalResponse>
    ) =>
      view.command(
        'useChat.addToolApprovalResponse',
        () => native.addToolApprovalResponse(...args),
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
    addToolResult: <Name extends keyof MessageTools<Message>>(
      options: ChatToolOutput<Message, Name>,
    ) =>
      view.command(
        'useChat.addToolResult',
        () =>
          native.addToolResult(
            options as Parameters<typeof native.addToolResult>[0],
          ),
        native.stop,
      ),
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
  const { view, stop } = useLifetime(options?.id);
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
  stop.current = native.stop;
  const complete = (...args: Parameters<typeof native.complete>) =>
    view.command(
      'useCompletion.complete',
      () => native.complete(...args),
      native.stop,
    );
  return {
    completion: native.completion,
    error: viewError('useCompletion', native.error),
    input: native.input,
    isLoading: native.isLoading,
    setCompletion: (...args: Parameters<typeof native.setCompletion>) =>
      native.setCompletion(...args),
    setInput: (...args: Parameters<typeof native.setInput>) =>
      native.setInput(...args),
    handleInputChange: (...args: Parameters<typeof native.handleInputChange>) =>
      native.handleInputChange(...args),
    handleSubmit: (event?: { preventDefault?: () => void }) =>
      Effect.suspend(() => {
        event?.preventDefault?.();
        return native.input
          ? Effect.asVoid(complete(native.input))
          : Effect.void;
      }),
    complete,
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
  const { view, stop } = useLifetime(options.id);
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
  stop.current = native.stop;
  return {
    object: native.object,
    error: viewError('useObject', native.error),
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

type NativeRealtimeOptions = Parameters<typeof sdk.experimental_useRealtime>[0];
type RealtimeToolCall = Parameters<
  NonNullable<NativeRealtimeOptions['onToolCall']>
>[0];
export type Experimental_UseRealtimeOptions = Omit<
  NativeRealtimeOptions,
  'model' | 'onToolCall'
> & {
  readonly model: RealtimeModelV4;
  readonly onToolCall?: (
    event: RealtimeToolCall,
  ) => Effect.Effect<unknown, unknown>;
};
export function experimental_useRealtime(
  options: Experimental_UseRealtimeOptions,
) {
  const { view, stop } = useLifetime();
  const model = unwrapRealtimeModel(options.model);
  if (!model) throw sdkError('useRealtime', 'Invalid realtime model handle');
  const { onToolCall, ...settings } = options;
  const native = sdk.experimental_useRealtime({
    ...settings,
    model,
    ...(onToolCall
      ? {
          onToolCall: (event: RealtimeToolCall) =>
            Effect.runPromise(
              Effect.suspend(() => onToolCall(event)),
              { signal: view.signal },
            ),
        }
      : {}),
  });
  stop.current = native.disconnect;
  return {
    status: native.status,
    messages: native.messages,
    events: native.events,
    isCapturing: native.isCapturing,
    isPlaying: native.isPlaying,
    session: native.session,
    connect: (...args: Parameters<typeof native.connect>) =>
      view.command(
        'useRealtime.connect',
        () => native.connect(...args),
        native.disconnect,
      ),
    close: (...args: Parameters<typeof native.close>) =>
      view.command('useRealtime.close', () => native.close(...args)),
    resumePlayback: () =>
      view.command('useRealtime.resumePlayback', native.resumePlayback),
    resumeAudioCapture: () =>
      view.command('useRealtime.resumeAudioCapture', native.resumeAudioCapture),
    disconnect: () => view.action('useRealtime.disconnect', native.disconnect),
    addToolOutput: (...args: Parameters<typeof native.addToolOutput>) =>
      view.action('useRealtime.addToolOutput', () =>
        native.addToolOutput(...args),
      ),
    sendEvent: (...args: Parameters<typeof native.sendEvent>) =>
      view.action('useRealtime.sendEvent', () => native.sendEvent(...args)),
    sendTextMessage: (...args: Parameters<typeof native.sendTextMessage>) =>
      view.action('useRealtime.sendTextMessage', () =>
        native.sendTextMessage(...args),
      ),
    sendAudio: (...args: Parameters<typeof native.sendAudio>) =>
      view.action('useRealtime.sendAudio', () => native.sendAudio(...args)),
    commitAudio: () =>
      view.action('useRealtime.commitAudio', native.commitAudio),
    clearAudioBuffer: () =>
      view.action('useRealtime.clearAudioBuffer', native.clearAudioBuffer),
    requestResponse: (...args: Parameters<typeof native.requestResponse>) =>
      view.action('useRealtime.requestResponse', () =>
        native.requestResponse(...args),
      ),
    cancelResponse: () =>
      view.action('useRealtime.cancelResponse', native.cancelResponse),
    startAudioCapture: (...args: Parameters<typeof native.startAudioCapture>) =>
      view.action('useRealtime.startAudioCapture', () =>
        native.startAudioCapture(...args),
      ),
    stopAudioCapture: () =>
      view.action('useRealtime.stopAudioCapture', native.stopAudioCapture),
    stopPlayback: () =>
      view.action('useRealtime.stopPlayback', native.stopPlayback),
  };
}

export type Experimental_UseRealtimeReturn = ReturnType<
  typeof experimental_useRealtime
>;

export function MCPAppRenderer(props: sdk.MCPAppRendererProps) {
  return createElement(sdk.MCPAppRenderer, props);
}

export const experimental_MCPAppRenderer = MCPAppRenderer;
