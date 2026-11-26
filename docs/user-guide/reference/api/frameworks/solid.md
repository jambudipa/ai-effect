---
title: '@jambudipa/ai-effect/solid API'
doc-type: reference
sources: [src/frameworks, src/internal, src/core-chat.ts, package.json]
---

# @jambudipa/ai-effect/solid API

> **TL;DR:** This reference lists the public declarations for this entry. Signatures and descriptions come from the package declarations.

Import path: `@jambudipa/ai-effect/solid`. Conditions: `import → types`.

## `CreateMessage`

The public declaration does not include a description.

```text
type CreateMessage = Omit<Message, 'id'> & {
    id?: Message['id'];
};
```

## `experimental_useObject`

Stream structured results into Solid accessors and validate with the supplied Effect
decoder.

```text
export declare function experimental_useObject<Result, Input = unknown>(options: Experimental_UseObjectOptions<Result> | Accessor<Experimental_UseObjectOptions<Result>>): {
    object: () => import("@ai-sdk/ui-utils").DeepPartial<Result> | undefined;
    error: () => import("../AiSdk.js").AiSdkError | undefined;
    isLoading: () => boolean;
    submit: (input: Input) => Effect.Effect<void, import("../AiSdk.js").AiSdkError, never>;
    stop: () => Effect.Effect<void, import("../AiSdk.js").AiSdkError, never>;
};
```

## `Experimental_UseObjectHelpers`

Retain the structured result and request types on Solid accessors and Effect commands.

```text
export type Experimental_UseObjectHelpers<Result, Input> = ReturnType<typeof experimental_useObject<Result, Input>>;
```

## `Experimental_UseObjectOptions`

Supply the endpoint, Effect schema, and callback settings for Solid structured
generation.

```text
export type Experimental_UseObjectOptions<Result, S extends Decoder = Schema.ConstraintDecoder<Result>> = {
    readonly api: string;
    readonly schema: S;
    readonly id?: string;
    readonly initialValue?: Exclude<sdk.Experimental_UseObjectOptions<Result>['initialValue'], undefined>;
    readonly fetch?: typeof globalThis.fetch;
    readonly onFinish?: (event: {
        object: Result | undefined;
        error: ReturnType<typeof viewError>;
    }) => HostResult<void>;
    readonly onError?: NonNullable<UseAssistantOptions['onError']>;
    readonly headers?: Record<string, string> | Headers;
    readonly credentials?: RequestCredentials;
};
```

## `Message`

AI SDK UI Messages. They are used in the client and to communicate between the frontend and the API routes.

```text
interface Message {
    /**
  A unique identifier for the message.
     */
    id: string;
    /**
  The timestamp of the message.
     */
    createdAt?: Date;
    /**
  Text content of the message. Use parts when possible.
     */
    content: string;
    /**
  Reasoning for the message.

  @deprecated Use `parts` instead.
     */
    reasoning?: string;
    /**
     * Additional attachments to be sent along with the message.
     */
    experimental_attachments?: Attachment[];
    /**
  The 'data' role is deprecated.
     */
    role: 'system' | 'user' | 'assistant' | 'data';
    /**
  For data messages.

  @deprecated Data messages will be removed.
     */
    data?: JSONValue;
    /**
     * Additional message-specific information added on the server via StreamData
     */
    annotations?: JSONValue[] | undefined;
    /**
  Tool invocations (that can be tool calls or tool results, depending on whether or not the invocation has finished)
  that the assistant made as part of this message.

  @deprecated Use `parts` instead.
     */
    toolInvocations?: Array<ToolInvocation>;
    /**
     * The parts of the message. Use this for rendering the message in the UI.
     *
     * Assistant messages can have text, reasoning and tool invocation parts.
     * User messages can have text parts.
     */
    parts?: Array<TextUIPart | ReasoningUIPart | ToolInvocationUIPart | SourceUIPart | FileUIPart | StepStartUIPart>;
}
```

## `useAssistant`

Expose native assistant thread state and view-owned message commands with interruption
handling.

```text
export declare function useAssistant(options: UseAssistantOptions | Accessor<UseAssistantOptions>): {
    messages: sdk.Message[];
    input: () => string;
    threadId: () => string | undefined;
    status: () => import("@ai-sdk/ui-utils").AssistantStatus;
    error: () => import("../AiSdk.js").AiSdkError | undefined;
    setInput: import("solid-js").Setter<string>;
    setMessages: import("solid-js/store").SetStoreFunction<sdk.Message[]>;
    setThreadId: (threadId: string | undefined) => void;
    handleInputChange: InputChangeHandler;
    append: (message: sdk.Message | sdk.CreateMessage, requestOptions?: {
        data?: Record<string, string>;
    } | undefined) => Effect.Effect<void, import("../AiSdk.js").AiSdkError, never>;
    submitMessage: (event?: SubmitEvent | undefined, requestOptions?: {
        data?: Record<string, string>;
    } | undefined) => Effect.Effect<void, import("../AiSdk.js").AiSdkError, never>;
    stop: () => Effect.Effect<void, import("../AiSdk.js").AiSdkError, never>;
};
```

## `UseAssistantHelpers`

Expose the Solid assistant thread accessors and Effect request controls.

```text
export type UseAssistantHelpers = ReturnType<typeof useAssistant>;
```

## `useChat`

Provide Solid chat state and Effect commands, with active requests stopped when the
owner releases the view.

```text
export declare function useChat(options?: UseChatOptions | Accessor<UseChatOptions>): {
    id: string;
    messages: () => import("@ai-sdk/ui-utils").UIMessage[];
    error: () => import("../AiSdk.js").AiSdkError | undefined;
    input: () => string;
    data: () => import("@ai-sdk/ui-utils").JSONValue[] | undefined;
    status: () => "error" | "streaming" | "submitted" | "ready";
    isLoading: () => boolean;
    setInput: import("solid-js").Setter<string>;
    setMessages: (messages: Message[] | ((previous: Message[]) => Message[])) => void;
    setData: (data: import("@ai-sdk/ui-utils").JSONValue[] | ((data: import("@ai-sdk/ui-utils").JSONValue[] | undefined) => import("@ai-sdk/ui-utils").JSONValue[] | undefined) | undefined) => void;
    handleInputChange: InputChangeHandler;
    fetch: typeof fetch;
    append: (message: sdk.Message | sdk.CreateMessage, chatRequestOptions?: import("@ai-sdk/ui-utils").ChatRequestOptions | undefined) => Effect.Effect<string | null | undefined, import("../AiSdk.js").AiSdkError, never>;
    reload: (chatRequestOptions?: import("@ai-sdk/ui-utils").ChatRequestOptions | undefined) => Effect.Effect<string | null | undefined, import("../AiSdk.js").AiSdkError, never>;
    stop: () => Effect.Effect<void, import("../AiSdk.js").AiSdkError, never>;
    handleSubmit: (event?: {
        preventDefault?: () => void;
    } | undefined, chatRequestOptions?: import("@ai-sdk/ui-utils").ChatRequestOptions | undefined) => Effect.Effect<void, import("../AiSdk.js").AiSdkError, never>;
    addToolResult: (args_0: {
        toolCallId: string;
        result: any;
    }) => Effect.Effect<void, import("../AiSdk.js").AiSdkError, never>;
};
```

## `UseChatHelpers`

Expose Solid accessors for chat state and scoped Effects for requests.

```text
export type UseChatHelpers = ReturnType<typeof useChat>;
```

## `UseChatOptions`

Keep native chat settings with Effect-capable lifecycle and response callbacks.

```text
export type UseChatOptions = LegacyChatOptions & {
    readonly maxSteps?: number;
    readonly experimental_prepareRequestBody?: (data: Parameters<NonNullable<sdk.UseChatOptions['experimental_prepareRequestBody']>>[0]) => unknown;
};
```

## `useCompletion`

Keep native completion signals and run completion requests through the owning view
lifetime.

```text
export declare function useCompletion(options?: UseCompletionOptions | Accessor<UseCompletionOptions>): {
    completion: () => string;
    error: () => import("../AiSdk.js").AiSdkError | undefined;
    input: () => string;
    data: () => import("@ai-sdk/ui-utils").JSONValue[] | undefined;
    isLoading: () => boolean;
    setInput: import("solid-js").Setter<string>;
    setCompletion: (completion: string) => void;
    handleInputChange: InputChangeHandler;
    fetch: typeof fetch;
    complete: (prompt: string, options?: import("@ai-sdk/ui-utils").RequestOptions | undefined) => Effect.Effect<string | null | undefined, import("../AiSdk.js").AiSdkError, never>;
    handleSubmit: (event?: {
        preventDefault?: () => void;
    }) => Effect.Effect<void, import("../AiSdk.js").AiSdkError, never>;
    stop: () => Effect.Effect<void, import("../AiSdk.js").AiSdkError, never>;
};
```

## `UseCompletionHelpers`

Expose Solid text and input accessors with Effect completion controls.

```text
export type UseCompletionHelpers = ReturnType<typeof useCompletion>;
```

## `UseCompletionOptions`

Legacy completion host options with initial output and optional finish handling.

```text
export type UseCompletionOptions = TextSettings & {
    readonly initialCompletion?: string;
    readonly onFinish?: (prompt: string, completion: string) => HostResult<void>;
    readonly body?: object;
};
```
