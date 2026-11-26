---
title: '@jambudipa/ai-effect/react API'
doc-type: reference
sources: [src/frameworks, src/internal, src/core-chat.ts, package.json]
---

# @jambudipa/ai-effect/react API

> **TL;DR:** This reference lists the public declarations for this entry. Signatures and descriptions come from the package declarations.

Import path: `@jambudipa/ai-effect/react`. Conditions: `types`.

## `Chat`

Expose a reusable React chat handle with native state subscriptions and Effect commands.

```text
export declare class Chat<Message extends UIMessage> extends HostChat<Message> {
    #private;
    /**
     * Build the native chat with view-bound callbacks and register its wrapper for React
     * hooks.
     */
    constructor(options: ChatInit<Message>);
    /** Subscribe to native message changes and preserve the SDK throttle option. */
    readonly '~registerMessagesCallback': (callback: () => void, throttle?: number) => Effect.Effect<Effect.Effect<void, never, never>, AiSdkError, import("effect/Scope").Scope>;
    /** Subscribe to native status changes for React state updates. */
    readonly '~registerStatusCallback': (callback: () => void) => Effect.Effect<Effect.Effect<void, never, never>, AiSdkError, import("effect/Scope").Scope>;
    /** Subscribe to native error changes for React state updates. */
    readonly '~registerErrorCallback': (callback: () => void) => Effect.Effect<Effect.Effect<void, never, never>, AiSdkError, import("effect/Scope").Scope>;
    /** Subscribe to changes in the native queued message state. */
    readonly '~registerQueuedMessagesCallback': (callback: () => void) => Effect.Effect<Effect.Effect<void, never, never>, AiSdkError, import("effect/Scope").Scope>;
}
```

## `ChatInit`

Configure typed chat state, an adapted transport, and callbacks owned by the host view.

```text
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
    readonly onToolCall?: (event: ChatEvent<Message, 'onToolCall'>) => HostResult<void>;
    readonly onFinish?: (event: ChatEvent<Message, 'onFinish'>) => HostResult<void>;
    readonly onData?: (event: ChatEvent<Message, 'onData'>) => HostResult<void>;
    readonly sendAutomaticallyWhen?: (options: {
        messages: Message[];
    }) => HostResult<boolean>;
    readonly experimental_queue?: boolean;
};
```

## `CreateUIMessage`

The public declaration does not include a description.

```text
type CreateUIMessage<UI_MESSAGE extends UIMessage> = Omit<UI_MESSAGE, 'id' | 'role'> & {
  id?: UI_MESSAGE['id'];
  role?: UI_MESSAGE['role'];
};
```

## `experimental_MCPAppRenderer`

Retain the former experimental name for the same MCP app renderer.

```text
experimental_MCPAppRenderer: typeof MCPAppRenderer
```

## `Experimental_RealtimeStatus`

The public declaration does not include a description.

```text
type RealtimeStatus = 'disconnected' | 'connecting' | 'connected' | 'closing' | 'error';
```

## `experimental_useObject`

Keep the former experimental export name for the structured output hook.

```text
experimental_useObject: typeof useObject
```

## `Experimental_UseObjectHelpers`

Retain the older React helpers type name and preserve its request and result types.

```text
export type Experimental_UseObjectHelpers<Result, Input> = UseObjectHelpers<Result, Input>;
```

## `Experimental_UseObjectOptions`

Retain the older React options type name for schema-driven object generation.

```text
export type Experimental_UseObjectOptions<S extends Decoder, Result> = UseObjectOptions<S, Result>;
```

## `experimental_useRealtime`

Bind realtime callbacks to the React view. The native hook owns transport cleanup on
unmount.

```text
export declare function experimental_useRealtime(options: Experimental_UseRealtimeOptions): Experimental_UseRealtimeReturn;
```

## `Experimental_UseRealtimeOptions`

Keep native session options, require an Effect model handle, and allow view-owned
callbacks.

```text
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
```

## `Experimental_UseRealtimeReturn`

Expose native session state with Effect commands for connection, events, tools, and
audio.

```text
export type Experimental_UseRealtimeReturn = {
    readonly status: Experimental_RealtimeStatus;
    readonly messages: UIMessage[];
    readonly events: Experimental_RealtimeServerEvent[];
    readonly isCapturing: boolean;
    readonly isPlaying: boolean;
    readonly session: Experimental_RealtimeSessionState | undefined;
    readonly connect: {
        (): Effect.Effect<void, AiSdkError>;
        (options: RealtimeConnectOptions): Effect.Effect<void, AiSdkError>;
    };
    readonly close: Command<[options?: {
        eventId?: string;
    }]>;
    readonly resumePlayback: Command;
    readonly resumeAudioCapture: Command;
    readonly disconnect: Command;
    readonly addToolOutput: Command<[callId: string, result: unknown]>;
    readonly sendEvent: Command<[event: Experimental_RealtimeClientEvent]>;
    readonly sendTextMessage: Command<[text: string]>;
    readonly sendAudio: Command<[base64Audio: string]>;
    readonly commitAudio: Command;
    readonly clearAudioBuffer: Command;
    readonly requestResponse: Command<[options?: {
        modalities?: string[];
    }]>;
    readonly cancelResponse: Command;
    readonly startAudioCapture: Command<[stream: MediaStream]>;
    readonly stopAudioCapture: Command;
    readonly stopPlayback: Command;
};
```

## `MCPAppBridgeHandlers`

Provide the native app bridge callbacks with view-owned Effect outcomes and an optional
tool allowlist.

```text
export type MCPAppBridgeHandlers = {
    readonly allowedTools?: string[];
    readonly callTool?: (request: ToolCall) => HostResult<unknown>;
    readonly readResource?: (request: {
        uri: string;
    }) => HostResult<unknown>;
    readonly listResources?: (request?: unknown) => HostResult<unknown>;
    readonly openLink?: (request: {
        url: string;
    }) => HostResult<unknown>;
    readonly sendMessage?: (request: unknown) => HostResult<unknown>;
    readonly updateModelContext?: (request: unknown) => HostResult<unknown>;
    readonly requestDisplayMode?: (request: {
        mode: DisplayMode;
    }) => HostResult<{
        mode: DisplayMode;
    }>;
    readonly onSizeChange?: (change: Size) => HostResult<void>;
    readonly onInitialized?: () => HostResult<void>;
    readonly onRequestTeardown?: (event: unknown) => HostResult<void>;
    readonly onLog?: (event: unknown) => HostResult<void>;
    readonly onError?: (error: AiSdkError) => HostResult<void>;
};
```

## `MCPAppMetadata`

Identify the UI resource and its declared model or app visibility for lazy loading.

```text
export type MCPAppMetadata = {
    resourceUri: string;
    mimeType: MCPAppResource['mimeType'];
    visibility?: Array<'model' | 'app'>;
};
```

## `MCPAppPermission`

Identify the browser capabilities an MCP app sandbox can request from the host.

```text
export type MCPAppPermission = 'camera' | 'microphone' | 'geolocation' | 'clipboardWrite';
```

## `MCPAppRenderer`

Render the native app component and bind resource and bridge requests to the React view
lifetime.

```text
export declare function MCPAppRenderer({ loadResource, handlers, ...props }: MCPAppRendererProps): ReactElement;
```

## `MCPAppRendererProps`

Supply the tool UI part, sandbox settings, and static resource or view-owned loader.

```text
export type MCPAppRendererProps = {
    readonly part: ToolUIPart<UITools> | DynamicToolUIPart;
    readonly sandbox: MCPAppSandboxConfig;
    readonly resource?: MCPAppResource;
    readonly loadResource?: (app: MCPAppMetadata) => HostResult<MCPAppResource>;
    readonly handlers?: MCPAppBridgeHandlers;
    readonly hostInfo?: {
        name: string;
        version: string;
    };
    readonly hostContext?: {
        theme?: 'light' | 'dark';
        displayMode?: DisplayMode;
        availableDisplayModes?: DisplayMode[];
        [key: string]: unknown;
    };
    readonly fallback?: ReactNode;
};
```

## `MCPAppResource`

Provide an HTML app resource and its declared sandbox resource metadata.

```text
export type MCPAppResource = {
    uri: string;
    mimeType: 'text/html;profile=mcp-app';
    html: string;
    meta?: {
        prefersBorder?: boolean;
        csp?: {
            connectDomains?: string[];
            resourceDomains?: string[];
            frameDomains?: string[];
            baseUriDomains?: string[];
            [key: string]: unknown;
        };
        permissions?: Record<string, unknown>;
        [key: string]: unknown;
    };
};
```

## `MCPAppSandboxConfig`

Configure the native sandbox URL, target origin, and explicitly allowed permissions.

```text
export type MCPAppSandboxConfig = {
    url: string | URL;
    title?: string;
    className?: string;
    style?: CSSProperties;
    targetOrigin?: string;
    outerSandbox?: string;
    innerSandbox?: string;
    allowedPermissions?: MCPAppPermission[];
};
```

## `UIMessage`

AI SDK UI Messages. They are used in the client and to communicate between the frontend and the API routes.

```text
interface UIMessage<METADATA = unknown, DATA_PARTS extends UIDataTypes = UIDataTypes, TOOLS extends UITools = UITools> {
  /**
   * A unique identifier for the message.
   */
  id: string;
  /**
   * The role of the message.
   */
  role: 'system' | 'user' | 'assistant';
  /**
   * The metadata of the message.
   */
  metadata?: METADATA;
  /**
   * The parts of the message. Use this for rendering the message in the UI.
   *
   * System messages should be avoided (set the system prompt on the server instead).
   * They can have text parts.
   *
   * User messages can have text parts and file parts.
   *
   * Assistant messages can have text, reasoning, tool invocation, and file parts.
   */
  parts: Array<UIMessagePart<DATA_PARTS, TOOLS>>;
}
```

## `useChat`

Keep the native hook synchronous and give its commands the view lifetime.

```text
export declare function useChat<Message extends UIMessage = UIMessage>(options?: UseChatOptions<Message>): UseChatHelpers<Message>;
```

## `UseChatHelpers`

Expose native React chat state alongside view-owned Effect commands.

```text
export type UseChatHelpers<Message extends UIMessage> = Pick<HostChat<Message>, 'id' | 'status' | 'messages' | 'experimental_queuedMessages' | 'error' | 'sendMessage' | 'regenerate' | 'resumeStream' | 'stop' | 'clearError' | 'addToolApprovalResponse' | 'addToolOutput' | 'addToolResult' | 'experimental_removeQueuedMessage' | 'experimental_sendQueuedMessageNow'> & {
    readonly setMessages: (messages: Message[] | ((previous: Message[]) => Message[])) => void;
};
```

## `UseChatOptions`

Accept either an existing Effect chat handle or its setup options with React controls.

```text
export type UseChatOptions<Message extends UIMessage> = ({
    readonly chat: Chat<Message>;
} | ChatInit<Message>) & ChatControls;
```

## `useCompletion`

Expose native text state and lazy completion commands. Unmount stops work owned by the
current view.

```text
export declare function useCompletion<Body extends object = object>(options?: CompletionOptions<NoInfer<Body>> & Pick<ChatControls, 'throttle' | 'experimental_throttle'>): {
    completion: string;
    error: AiSdkError | undefined;
    input: string;
    isLoading: boolean;
    setCompletion: (completion: string) => void;
    setInput: (value: import("react").SetStateAction<string>) => void;
    handleInputChange: (event: import("react").ChangeEvent<HTMLInputElement, Element> | import("react").ChangeEvent<HTMLTextAreaElement, Element>) => void;
    handleSubmit: (event?: {
        preventDefault?: () => void;
    }) => Effect.Effect<void, AiSdkError, never>;
    complete: (prompt: string, options?: import("ai").CompletionRequestOptions<Body> | undefined) => Effect.Effect<string | null | undefined, AiSdkError, never>;
    stop: () => Effect.Effect<void, AiSdkError, never>;
};
```

## `UseCompletionHelpers`

Expose text state and Effect control operations returned by the React completion hook.

```text
export type UseCompletionHelpers<Body extends object = object> = ReturnType<typeof useCompletion<Body>>;
```

## `UseCompletionOptions`

Configure text completion state, request body, and a finish notification in the host
view.

```text
export type CompletionOptions<Body extends object = object> = FetchOptions & {
    readonly initialCompletion?: string;
    readonly initialInput?: string;
    readonly onFinish?: (prompt: string, completion: string) => HostResult<void>;
    readonly body?: Body;
    readonly streamProtocol?: 'data' | 'text';
};
```

## `useObject`

Expose React partial object state and view-owned submit, stop, and clear Effects.

```text
export declare function useObject<S extends Decoder, Result = DecodedSchema<S>, Input = unknown>(options: UseObjectOptions<S, Result>): {
    object: import("ai").DeepPartial<Result> | undefined;
    error: AiSdkError | undefined;
    isLoading: boolean;
    submit: (input: Input) => Effect.Effect<void, AiSdkError, never>;
    stop: () => Effect.Effect<void, AiSdkError, never>;
    clear: () => Effect.Effect<void, AiSdkError, never>;
};
```

## `UseObjectHelpers`

Keep the decoded result and request input types on React structured output helpers.

```text
export type UseObjectHelpers<Result, Input> = ReturnType<typeof useObject<Decoder, Result, Input>>;
```

## `UseObjectOptions`

Configure the React endpoint and schema while preserving the inferred decoded result
type.

```text
export type UseObjectOptions<S extends Decoder, Result = DecodedSchema<S>> = ObjectOptions<S, Result>;
```
