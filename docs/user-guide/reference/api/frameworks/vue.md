---
title: '@jambudipa/ai-effect/vue API'
doc-type: reference
sources: [src/frameworks, src/internal, src/core-chat.ts, package.json]
---

# @jambudipa/ai-effect/vue API

> **TL;DR:** This reference lists the public declarations for this entry. Signatures and descriptions come from the package declarations.

Import path: `@jambudipa/ai-effect/vue`. Conditions: `types`.

## `Chat`

The public declaration does not include a description.

**@deprecated**: Use useChat.

```text
export declare class Chat<Message extends UIMessage> extends HostChat<Message> {
    /** Create the native Vue chat and register its disposal when a Vue scope is active. */
    constructor(options: ChatInit<Message>);
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

## `experimental_useObject`

Keep the previous Vue hook name for structured object generation.

```text
experimental_useObject: typeof useObject
```

## `Experimental_UseObjectHelpers`

Preserve the former Vue result and input helper type name.

```text
export type Experimental_UseObjectHelpers<Result, Input> = UseObjectHelpers<Result, Input>;
```

## `Experimental_UseObjectOptions`

Preserve the former Vue schema-derived options type name.

```text
export type Experimental_UseObjectOptions<S extends Decoder, Result> = UseObjectOptions<S, Result>;
```

## `useChat`

Expose Vue refs and view-owned chat commands. Accept plain options, a ref, or a getter.

```text
export declare function useChat<Message extends UIMessage = UIMessage>(options?: MaybeRefOrGetter<UseChatOptions<Message>>): {
    messages: import("vue").ShallowRef<Message[]>;
    status: import("vue").ShallowRef<import("ai").ChatStatus>;
    id: import("vue").ComputedRef<string>;
    error: import("vue").ComputedRef<import("../AiSdk.js").AiSdkError | undefined>;
    experimental_queuedMessages: import("vue").ShallowRef<Message[]>;
    sendMessage: (message?: (Omit<Message, "id" | "role"> & {
        id?: Message["id"];
        role?: Message["role"];
    } & {
        text?: never;
        files?: never;
        messageId?: string;
    }) | {
        text: string;
        files?: FileList | import("ai").FileUIPart[];
        metadata?: Message extends UIMessage<infer METADATA, import("ai").UIDataTypes, import("ai").UITools> ? METADATA : unknown;
        parts?: never;
        messageId?: string;
    } | {
        files: FileList | import("ai").FileUIPart[];
        metadata?: Message extends UIMessage<infer METADATA, import("ai").UIDataTypes, import("ai").UITools> ? METADATA : unknown;
        parts?: never;
        messageId?: string;
    } | undefined, options?: import("ai").ChatRequestOptions | undefined) => Effect.Effect<void, import("../AiSdk.js").AiSdkError, never>;
    regenerate: (args_0?: ({
        messageId?: string;
    } & import("ai").ChatRequestOptions) | undefined) => Effect.Effect<void, import("../AiSdk.js").AiSdkError, never>;
    resumeStream: (options?: import("ai").ChatRequestOptions | undefined) => Effect.Effect<void, import("../AiSdk.js").AiSdkError, never>;
    addToolOutput: <Name extends keyof MessageTools<Message>>(options: ChatToolOutput<Message, Name>) => Effect.Effect<void, import("../AiSdk.js").AiSdkError, never>;
    addToolApprovalResponse: (args_0: {
        id: string;
        approved: boolean;
        reason?: string;
        options?: import("ai").ChatRequestOptions;
    }) => Effect.Effect<void, import("../AiSdk.js").AiSdkError, never>;
    stop: () => Effect.Effect<void, import("../AiSdk.js").AiSdkError, never>;
    clearError: () => Effect.Effect<void, import("../AiSdk.js").AiSdkError, never>;
    experimental_removeQueuedMessage: (id: string) => Effect.Effect<void, import("../AiSdk.js").AiSdkError, never>;
    experimental_sendQueuedMessageNow: (id: string) => Effect.Effect<void, import("../AiSdk.js").AiSdkError, never>;
};
```

## `UseChatHelpers`

Keep typed Vue message and status refs alongside Effect chat operations.

```text
export type UseChatHelpers<Message extends UIMessage> = ReturnType<typeof useChat<Message>>;
```

## `UseChatOptions`

Preserve the typed chat configuration and optional Vue subscription throttle.

```text
export type UseChatOptions<Message extends UIMessage> = ChatInit<Message> & {
    readonly throttle?: number;
};
```

## `useCompletion`

Expose native Vue completion refs and lazy request commands bound to the Vue scope.

```text
export declare function useCompletion<Body extends object = object>(options?: CompletionOptions<NoInfer<Body>>): {
    completion: import("vue").Ref<string, string>;
    input: import("vue").Ref<string, string>;
    isLoading: import("vue").Ref<boolean | undefined, boolean | undefined>;
    error: import("vue").ComputedRef<import("../AiSdk.js").AiSdkError | undefined>;
    setCompletion: (completion: string) => void;
    complete: (prompt: string, options?: import("ai").CompletionRequestOptions<Body> | undefined) => Effect.Effect<string | null | undefined, import("../AiSdk.js").AiSdkError, never>;
    handleSubmit: (event?: {
        preventDefault?: () => void;
    }) => Effect.Effect<void, import("../AiSdk.js").AiSdkError, never>;
    stop: () => Effect.Effect<void, import("../AiSdk.js").AiSdkError, never>;
};
```

## `UseCompletionHelpers`

Expose Vue completion state and Effect controls with the configured request body type.

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

Expose Vue partial object state and bind structured request controls to the active Vue
scope.

```text
export declare function useObject<S extends Decoder, Result = DecodedSchema<S>, Input = unknown>(options: UseObjectOptions<S, Result>): {
    object: import("vue").Ref<import("ai").DeepPartial<Result> | undefined, import("ai").DeepPartial<Result> | undefined>;
    error: import("vue").ComputedRef<import("../AiSdk.js").AiSdkError | undefined>;
    isLoading: import("vue").Ref<boolean | undefined, boolean | undefined>;
    submit: (input: Input) => Effect.Effect<void, import("../AiSdk.js").AiSdkError, never>;
    stop: () => Effect.Effect<void, import("../AiSdk.js").AiSdkError, never>;
    clear: () => Effect.Effect<void, import("../AiSdk.js").AiSdkError, never>;
};
```

## `UseObjectHelpers`

Carry the inferred result and request types on Vue structured output controls.

```text
export type UseObjectHelpers<Result, Input> = ReturnType<typeof useObject<Decoder, Result, Input>>;
```

## `UseObjectOptions`

Configure a Vue structured request endpoint and infer its result from the decoder.

```text
export type UseObjectOptions<S extends Decoder, Result = DecodedSchema<S>> = ObjectOptions<S, Result>;
```
