---
title: '@jambudipa/ai-effect/svelte API'
doc-type: reference
sources: [src/frameworks, src/internal, src/core-chat.ts, package.json]
---

# @jambudipa/ai-effect/svelte API

> **TL;DR:** This reference lists the public declarations for this entry. Signatures and descriptions come from the package declarations.

Import path: `@jambudipa/ai-effect/svelte`. Conditions: `types`.

## `Chat`

Bind a chat to the current Svelte component.

```text
export declare class Chat<Message extends UIMessage = UIMessage> extends HostChat<Message> {
    /**
     * Bind chat to the current Svelte component so destruction disposes the native
     * conversation handle.
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

Bind a completion to the current Svelte component.

```text
export declare class Completion<Body extends object = object> {
    #private;
    /**
     * Register completion cancellation with the current Svelte component and adapt native
     * options.
     */
    constructor(options?: CompletionOptions<NoInfer<Body>>);
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
    /** Stop the active completion through its view-bound Effect action. */
    readonly stop: () => import("effect/Effect").Effect<void, import("../AiSdk.js").AiSdkError, never>;
    /** Start a completion when the Effect runs. Interruption stops the native request. */
    readonly complete: (...args: Parameters<SdkCompletion<Body>["complete"]>) => import("effect/Effect").Effect<string | null | undefined, import("../AiSdk.js").AiSdkError, never>;
    /**
     * Use the native form submit contract inside an Effect with interruptible completion.
     */
    readonly handleSubmit: (event?: {
        preventDefault?: () => void;
    }) => import("effect/Effect").Effect<void, import("../AiSdk.js").AiSdkError, never>;
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

## `createAIContext`

Create the AI SDK stores for the current component and its children.

```text
export declare function createAIContext(): void;
```

## `CreateUIMessage`

The public declaration does not include a description.

```text
type CreateUIMessage<UI_MESSAGE extends UIMessage> = Omit<UI_MESSAGE, 'id' | 'role'> & {
  id?: UI_MESSAGE['id'];
  role?: UI_MESSAGE['role'];
};
```

## `Experimental_StructuredObject`

Retain the legacy type name for the schema-aware `StructuredObject` controller.

**@deprecated**: Use StructuredObject.

```text
Experimental_StructuredObject: typeof StructuredObject
```

```text
export type Experimental_StructuredObject<S extends HostSchema<unknown>, R = DecodedSchema<S>, I = unknown> = StructuredObject<S, R, I>;
```

## `Experimental_StructuredObjectOptions`

The public declaration does not include a description.

**@deprecated**: Use StructuredObjectOptions.

```text
export type Experimental_StructuredObjectOptions<S extends HostSchema<unknown>, R = DecodedSchema<S>> = StructuredObjectOptions<S, R>;
```

## `StructuredObject`

Bind a structured object to the current Svelte component.

```text
export declare class StructuredObject<S extends HostSchema<unknown>, Result = DecodedSchema<S>, Input = unknown> {
    #private;
    /** Adapt the schema and callbacks in the current Svelte component lifecycle. */
    constructor(options: StructuredObjectOptions<S, Result>);
    /** Read the current partial structured result during generation. */
    get object(): import("ai").DeepPartial<Result> | undefined;
    /**
     * Read the current structured generation failure through the shared `AiSdkError`
     * wrapper.
     */
    get error(): import("../AiSdk.js").AiSdkError | undefined;
    /** Read the native request loading state. */
    get loading(): boolean;
    /** Stop the active structured request through its view-bound Effect action. */
    readonly stop: () => import("effect/Effect").Effect<void, import("../AiSdk.js").AiSdkError, never>;
    /** Clear the current structured result through the native host action. */
    readonly clear: () => import("effect/Effect").Effect<void, import("../AiSdk.js").AiSdkError, never>;
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
