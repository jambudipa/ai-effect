---
title: '@jambudipa/ai-effect/angular API'
doc-type: reference
sources: [src/frameworks, src/internal, src/core-chat.ts, package.json]
---

# @jambudipa/ai-effect/angular API

> **TL;DR:** This reference lists the public declarations for this entry. Signatures and descriptions come from the package declarations.

Import path: `@jambudipa/ai-effect/angular`. Conditions: `types`.

## `Chat`

Bind chat commands to the Angular view lifecycle when created in an injection context.

```text
export declare class Chat<Message extends UIMessage = UIMessage> extends HostChat<Message> {
    /**
     * Bind the native chat and its cleanup to the Angular injection context when one is
     * active.
     */
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

## `Completion`

Keep completion state in the Angular host and expose generation and stop operations as
Effects.

```text
export declare class Completion<Body extends object = object> {
    #private;
    /**
     * Adapt completion options and callbacks before constructing the native Angular
     * controller.
     */
    constructor(options?: CompletionOptions<NoInfer<Body>>);
    /** Read the native ID used to identify completion state. */
    get id(): string;
    /** Read the URL used for native completion requests. */
    get api(): string;
    /** Read the selected SDK response protocol for completion requests. */
    get streamProtocol(): "text" | "data";
    /** Read current completion text as the host updates it. */
    get completion(): string;
    /** Replace the native displayed completion text without a request. */
    set completion(value: string);
    /** Read the current form input from the native completion state. */
    get input(): string;
    /** Update native form input without starting generation. */
    set input(value: string);
    /** Read the current completion failure through the shared `AiSdkError` wrapper. */
    get error(): import("../AiSdk.js").AiSdkError | undefined;
    /** Read the native request loading state. */
    get loading(): boolean;
    /** Start a completion when the Effect runs. Interruption stops the native request. */
    readonly complete: (...args: Parameters<NativeCompletion<Body>["complete"]>) => import("effect/Effect").Effect<string | null | undefined, import("../AiSdk.js").AiSdkError, never>;
    /**
     * Use the native form submit contract inside an Effect with interruptible completion.
     */
    readonly handleSubmit: (event?: {
        preventDefault?: () => void;
    }) => import("effect/Effect").Effect<void, import("../AiSdk.js").AiSdkError, never>;
    /** Stop the active completion through its view-bound Effect action. */
    readonly stop: () => import("effect/Effect").Effect<void, import("../AiSdk.js").AiSdkError, never>;
}
```

## `CompletionOptions`

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

## `StructuredObject`

Keep structured generation in the Angular host and validate the final result through the
supplied schema.

```text
export declare class StructuredObject<S extends HostSchema<unknown>, A = DecodedSchema<S>, Input = unknown> {
    #private;
    /** Keep the original structured generation options available to Angular consumers. */
    readonly options: StructuredObjectOptions<S, A>;
    /**
     * Bind the decoder and structured response callbacks to the Angular controller lifetime.
     */
    constructor(options: StructuredObjectOptions<S, A>);
    /** Read the native ID used to identify structured generation state. */
    get id(): string;
    /** Read the current partial structured result during generation. */
    get object(): import("ai").DeepPartial<A> | undefined;
    /**
     * Read the current structured generation failure through the shared `AiSdkError`
     * wrapper.
     */
    get error(): import("../AiSdk.js").AiSdkError | undefined;
    /** Read the native request loading state. */
    get loading(): boolean;
    /** Stop the active structured request through its view-bound Effect action. */
    readonly stop: () => import("effect/Effect").Effect<void, import("../AiSdk.js").AiSdkError, never>;
    /**
     * Send the typed structured request when the Effect runs. Interruption stops the native
     * request.
     */
    readonly submit: (input: Input) => import("effect/Effect").Effect<void, import("../AiSdk.js").AiSdkError, never>;
}
```

## `StructuredObjectOptions`

Configure the endpoint and output schema, with a final value type inferred from the
decoder.

```text
export type StructuredObjectOptions<S extends HostSchema<unknown>, A = DecodedSchema<S>> = ObjectOptions<S, A>;
```
