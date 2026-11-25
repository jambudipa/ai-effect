'use client';

import * as sdk from '@ai-sdk/react';
import type { UIMessage } from 'ai';
import { Effect } from 'effect';
import { createElement, useEffect, useMemo, type ReactElement } from 'react';
import { runSync, sdkError, type AiSdkError } from '../internal/operation.js';
import {
  unwrapRealtimeModel,
  type RealtimeModelV4,
} from '../internal/provider-realtime.js';
import {
  HostChat,
  nativeChatOptions,
  type ChatInit,
  type ChatToolOutput,
} from './chat.js';
import { ViewLifetime, viewError, type HostResult } from './lifetime.js';
import {
  nativeCompletionOptions,
  nativeObjectOptions,
  nativeSchema,
  type CompletionOptions,
  type DecodedSchema,
  type HostSchema,
  type ObjectOptions,
} from './options.js';

export type {
  CreateUIMessage,
  Experimental_RealtimeStatus,
  MCPAppMetadata,
  MCPAppPermission,
  MCPAppSandboxConfig,
  MCPAppResource,
  UIMessage,
} from '@ai-sdk/react';
export type { ChatInit } from './chat.js';
export type { CompletionOptions as UseCompletionOptions } from './options.js';

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
    callback: () => void,
    throttle?: number,
  ) =>
    this.#subscription(() =>
      this.#native['~registerMessagesCallback'](callback, throttle),
    );
  readonly '~registerStatusCallback' = (callback: () => void) =>
    this.#subscription(() => this.#native['~registerStatusCallback'](callback));
  readonly '~registerErrorCallback' = (callback: () => void) =>
    this.#subscription(() => this.#native['~registerErrorCallback'](callback));
  readonly '~registerQueuedMessagesCallback' = (callback: () => void) =>
    this.#subscription(() =>
      this.#native['~registerQueuedMessagesCallback'](callback),
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
    setMessages: (messages: Message[] | ((previous: Message[]) => Message[])) =>
      native.setMessages(messages),
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
  options?: CompletionOptions<NoInfer<Body>> &
    Pick<ChatControls, 'throttle' | 'experimental_throttle'>,
) {
  const { view, stop } = useLifetime(options?.id);
  const native = sdk.useCompletion<Body>({
    ...nativeCompletionOptions(view, options),
    ...(options?.throttle === undefined ? {} : { throttle: options.throttle }),
    ...(options?.experimental_throttle === undefined
      ? {}
      : { experimental_throttle: options.experimental_throttle }),
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

type Decoder = HostSchema<unknown>;
type NativeSchema = ReturnType<typeof nativeSchema<unknown>>;
export type UseObjectOptions<
  S extends Decoder,
  Result = DecodedSchema<S>,
> = ObjectOptions<S, Result>;

export function useObject<
  S extends Decoder,
  Result = DecodedSchema<S>,
  Input = unknown,
>(options: UseObjectOptions<S, Result>) {
  const { view, stop } = useLifetime(options.id);
  const native = sdk.useObject<NativeSchema, Result, Input>(
    nativeObjectOptions(view, options),
  );
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
type RealtimeEvent = Parameters<
  NonNullable<NativeRealtimeOptions['onEvent']>
>[0];
export type Experimental_UseRealtimeOptions = {
  readonly model: RealtimeModelV4;
  readonly api: NativeRealtimeOptions['api'];
  readonly sessionConfig?: NonNullable<NativeRealtimeOptions['sessionConfig']>;
  readonly sampleRate?: number;
  readonly maxEvents?: number;
  readonly startupTimeoutMs?: number;
  readonly closeTimeoutMs?: number;
  readonly rtcDisconnectTimeoutMs?: number;
  readonly maxPlaybackBufferSeconds?: number;
  readonly onToolCall?: (event: RealtimeToolCall) => HostResult<unknown>;
  readonly onEvent?: (event: RealtimeEvent) => HostResult<void>;
  readonly onError?: (error: AiSdkError) => HostResult<void>;
};
export function experimental_useRealtime(
  options: Experimental_UseRealtimeOptions,
) {
  const { view, stop } = useLifetime();
  const model = unwrapRealtimeModel(options.model);
  if (!model) throw sdkError('useRealtime', 'Invalid realtime model handle');
  const { onToolCall, onError, onEvent, ...settings } = options;
  const native = sdk.experimental_useRealtime({
    ...settings,
    model,
    ...(onToolCall
      ? {
          onToolCall: (event: RealtimeToolCall) =>
            view.callback('useRealtime.onToolCall', () => onToolCall(event)),
        }
      : {}),
    ...(onError
      ? {
          onError: (error: Error) =>
            view.notify(
              'useRealtime.onError',
              onError,
              sdkError('useRealtime', error),
            ),
        }
      : {}),
    ...(onEvent
      ? {
          onEvent: (event: RealtimeEvent) =>
            view.notify('useRealtime.onEvent', onEvent, event),
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

type DisplayMode = NonNullable<
  NonNullable<sdk.MCPAppRendererProps['hostContext']>['displayMode']
>;
type ToolCall = { name: string; arguments?: Record<string, unknown> };
type Size = { width?: number; height?: number };

export type MCPAppBridgeHandlers = {
  readonly allowedTools?: string[];
  readonly callTool?: (request: ToolCall) => HostResult<unknown>;
  readonly readResource?: (request: { uri: string }) => HostResult<unknown>;
  readonly listResources?: (request?: unknown) => HostResult<unknown>;
  readonly openLink?: (request: { url: string }) => HostResult<unknown>;
  readonly sendMessage?: (request: unknown) => HostResult<unknown>;
  readonly updateModelContext?: (request: unknown) => HostResult<unknown>;
  readonly requestDisplayMode?: (request: {
    mode: DisplayMode;
  }) => HostResult<{ mode: DisplayMode }>;
  readonly onSizeChange?: (change: Size) => HostResult<void>;
  readonly onInitialized?: () => HostResult<void>;
  readonly onRequestTeardown?: (event: unknown) => HostResult<void>;
  readonly onLog?: (event: unknown) => HostResult<void>;
  readonly onError?: (error: AiSdkError) => HostResult<void>;
};

export type MCPAppRendererProps = {
  readonly part: sdk.MCPAppRendererProps['part'];
  readonly sandbox: sdk.MCPAppSandboxConfig;
  readonly resource?: sdk.MCPAppResource;
  readonly loadResource?: (
    app: sdk.MCPAppMetadata,
  ) => HostResult<sdk.MCPAppResource>;
  readonly handlers?: MCPAppBridgeHandlers;
  readonly hostInfo?: NonNullable<sdk.MCPAppRendererProps['hostInfo']>;
  readonly hostContext?: NonNullable<sdk.MCPAppRendererProps['hostContext']>;
  readonly fallback?: sdk.MCPAppRendererProps['fallback'];
};

export function MCPAppRenderer({
  loadResource,
  handlers,
  ...props
}: MCPAppRendererProps): ReactElement {
  const { view } = useLifetime();
  const bind =
    <Args extends unknown[], A>(
      name: string,
      callback: (...args: Args) => HostResult<A>,
    ) =>
    (...args: Args) =>
      view.callback(name, () => callback(...args));
  const nativeHandlers = handlers
    ? {
        ...(handlers.allowedTools
          ? { allowedTools: handlers.allowedTools }
          : {}),
        ...(handlers.callTool
          ? { callTool: bind('MCPApp.callTool', handlers.callTool) }
          : {}),
        ...(handlers.readResource
          ? { readResource: bind('MCPApp.readResource', handlers.readResource) }
          : {}),
        ...(handlers.listResources
          ? {
              listResources: bind(
                'MCPApp.listResources',
                handlers.listResources,
              ),
            }
          : {}),
        ...(handlers.openLink
          ? { openLink: bind('MCPApp.openLink', handlers.openLink) }
          : {}),
        ...(handlers.sendMessage
          ? { sendMessage: bind('MCPApp.sendMessage', handlers.sendMessage) }
          : {}),
        ...(handlers.updateModelContext
          ? {
              updateModelContext: bind(
                'MCPApp.updateModelContext',
                handlers.updateModelContext,
              ),
            }
          : {}),
        ...(handlers.requestDisplayMode
          ? {
              requestDisplayMode: bind(
                'MCPApp.requestDisplayMode',
                handlers.requestDisplayMode,
              ),
            }
          : {}),
        onSizeChange: (size: Size) =>
          view.notify('MCPApp.onSizeChange', handlers.onSizeChange, size),
        onInitialized: () =>
          view.notify('MCPApp.onInitialized', handlers.onInitialized),
        onRequestTeardown: (event: unknown) =>
          view.notify(
            'MCPApp.onRequestTeardown',
            handlers.onRequestTeardown,
            event,
          ),
        onLog: (event: unknown) =>
          view.notify('MCPApp.onLog', handlers.onLog, event),
        onError: (error: Error) =>
          view.notify(
            'MCPApp.onError',
            handlers.onError,
            sdkError('MCPApp', error),
          ),
      }
    : undefined;
  return createElement(sdk.MCPAppRenderer, {
    ...props,
    ...(nativeHandlers ? { handlers: nativeHandlers } : {}),
    ...(loadResource
      ? { loadResource: bind('MCPApp.loadResource', loadResource) }
      : {}),
  });
}

export const experimental_MCPAppRenderer = MCPAppRenderer;
