---
title: "Integration API — ui-utils"
doc-type: reference
sources: [src/integrations/ui-utils.ts, package.json]
---

# ui-utils

> **TL;DR:** The `@jambudipa/ai-effect/ui-utils` entry provides the public declarations listed below.

## Import

`@jambudipa/ai-effect/ui-utils`

## `asSchema`

Reuse an existing legacy schema or adapt a supported Zod schema through the SDK.

```text
export declare const asSchema: <A, R = never>(schema: LegacyZodSchema<A> | Schema<A, R>) => Effect.Effect<Schema<A, R>, AiSdkError>;
```

## `AssistantMessage`

```text
type AssistantMessage = {
    id: string;
    role: 'assistant';
    content: Array<{
        type: 'text';
        text: {
            value: string;
        };
    }>;
};
```

## `AssistantStatus`

```text
type AssistantStatus = 'in_progress' | 'awaiting_message';
```

## `AssistantStreamPart`

Legacy assistant part descriptor with its wire code, name, and corresponding payload type.

```text
export type AssistantStreamPart<Code extends string, Name extends string, Value> = DataStreamPart<Code, Name, Value>;
```

## `AssistantStreamString`

```text
type AssistantStreamString = `${(typeof StreamStringPrefixes)[keyof typeof StreamStringPrefixes]}:${string}\n`;
```

## `Attachment`

An attachment that can be sent along with a message.

```text
interface Attachment {
    /**
     * The name of the attachment, usually the file name.
     */
    name?: string;
    /**
     * A string indicating the [media type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type).
     * By default, it's extracted from the pathname's extension.
     */
    contentType?: string;
    /**
     * The URL of the attachment. It can either be a URL to a hosted file or a [Data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs).
     */
    url: string;
}
```

## `callChatApi`

Send or resume a legacy chat request while guarding UI updates after cancellation.

```text
export declare const callChatApi: <R = never>(options: ChatRequestOptions<R>) => Effect.Effect<void, AiSdkError, Exclude<R, import("effect/Scope").Scope>>;
```

## `callCompletionApi`

Send a legacy text completion request and map native errors to tagged values for the host.

```text
export declare const callCompletionApi: <R = never>(options: CompletionRequestOptions<R>) => Effect.Effect<string | null | undefined, AiSdkError, Exclude<R, import("effect/Scope").Scope>>;
```

## `ChatRequest`

```text
type ChatRequest = {
    /**
  An optional object of headers to be passed to the API endpoint.
   */
    headers?: Record<string, string> | Headers;
    /**
  An optional object to be passed to the API endpoint.
  */
    body?: object;
    /**
  The messages of the chat.
     */
    messages: Message[];
    /**
  Additional data to be sent to the server.
     */
    data?: JSONValue;
};
```

## `ChatRequestOptions`

```text
type ChatRequestOptions = {
    /**
  Additional headers that should be to be passed to the API endpoint.
   */
    headers?: Record<string, string> | Headers;
    /**
  Additional body JSON properties that should be sent to the API endpoint.
   */
    body?: object;
    /**
  Additional data to be sent to the API endpoint.
     */
    data?: JSONValue;
    /**
     * Additional files to be sent to the server.
     */
    experimental_attachments?: FileList | Array<Attachment>;
    /**
     * Allow submitting an empty message. Defaults to `false`.
     */
    allowEmptySubmit?: boolean;
};
```

## `CreateMessage`

```text
type CreateMessage = Omit<Message, 'id'> & {
    id?: Message['id'];
};
```

## `DataMessage`

```text
type DataMessage = {
    id?: string;
    role: 'data';
    data: JSONValue;
};
```

## `DataStreamPart`

Describe the wire code, event name, parser, and formatter for a legacy data part.

```text
export type DataStreamPart<Code extends string, Name extends string, Value> = {
    readonly code: Code;
    readonly name: Name;
    readonly parse: (input: sdk.JSONValue) => Effect.Effect<{
        type: Name;
        value: Value;
    }, AiSdkError>;
};
```

## `DataStreamString`

```text
type DataStreamString = `${(typeof DataStreamStringPrefixes)[keyof typeof DataStreamStringPrefixes]}:${string}\n`;
```

## `DeepPartial`

Create a type from an object with all keys and nested keys set to optional.
The helper supports normal objects and Zod schemas (which are resolved automatically).
It always recurses into arrays.

Adopted from [type-fest](https://github.com/sindresorhus/type-fest/tree/main) PartialDeep.

```text
type DeepPartial<T> = T extends z.ZodTypeAny ? DeepPartialInternal<z.infer<T>> : DeepPartialInternal<T>;
```

## `extractMaxToolInvocationStep`

Find the highest tool invocation step in the supplied legacy message sequence.

```text
export declare const extractMaxToolInvocationStep: (...args: Parameters<typeof sdk.extractMaxToolInvocationStep>) => Effect.Effect<number | undefined, AiSdkError, never>;
```

## `FileUIPart`

A file part of a message.

```text
type FileUIPart = {
    type: 'file';
    mimeType: string;
    data: string;
};
```

## `fillMessageParts`

Populate legacy message parts from the stored message fields through the SDK helper.

```text
export declare const fillMessageParts: (...args: Parameters<typeof sdk.fillMessageParts>) => Effect.Effect<sdk.UIMessage[], AiSdkError, never>;
```

## `formatAssistantStreamPart`

Encode a typed assistant part in the legacy wire format through the native formatter.

```text
export declare const formatAssistantStreamPart: <Kind extends AssistantPart["type"]>(...args: Parameters<typeof sdk.formatAssistantStreamPart<Kind>>) => Effect.Effect<`0:${string}
` | `3:${string}
` | `4:${string}
` | `5:${string}
` | `6:${string}
`, AiSdkError, never>;
```

## `formatDataStreamPart`

Encode a typed data part in the legacy wire format through the native formatter.

```text
export declare const formatDataStreamPart: <Kind extends DataPart["type"]>(...args: Parameters<typeof sdk.formatDataStreamPart<Kind>>) => Effect.Effect<`0:${string}
` | `2:${string}
` | `3:${string}
` | `8:${string}
` | `9:${string}
` | `a:${string}
` | `b:${string}
` | `i:${string}
` | `g:${string}
` | `c:${string}
` | `d:${string}
` | `e:${string}
` | `f:${string}
` | `h:${string}
` | `j:${string}
` | `k:${string}
`, AiSdkError, never>;
```

## `generateId`

Create an SDK-compatible ID when the Effect runs.

```text
export declare const generateId: (...args: Parameters<typeof sdk.generateId>) => Effect.Effect<string, AiSdkError, never>;
```

## `getMessageParts`

Derive the legacy parts representation of a message through the native conversion rules.

```text
export declare const getMessageParts: (...args: Parameters<typeof sdk.getMessageParts>) => Effect.Effect<(sdk.TextUIPart | sdk.ReasoningUIPart | sdk.ToolInvocationUIPart | sdk.SourceUIPart | sdk.FileUIPart | sdk.StepStartUIPart)[], AiSdkError, never>;
```

## `getTextFromDataUrl`

Decode text from a data URL using the native helper's accepted formats.

```text
export declare const getTextFromDataUrl: (...args: Parameters<typeof sdk.getTextFromDataUrl>) => Effect.Effect<string, AiSdkError, never>;
```

## `IdGenerator`

Synchronous ID factory used by legacy host and message helpers.

```text
export type IdGenerator = () => string;
```

## `isAssistantMessageWithCompletedToolCalls`

Check whether an assistant message's tool calls have their required results.

```text
export declare const isAssistantMessageWithCompletedToolCalls: (...args: Parameters<typeof sdk.isAssistantMessageWithCompletedToolCalls>) => Effect.Effect<boolean, AiSdkError, never>;
```

## `isDeepEqualData`

Compare legacy data by the SDK's deep equality rules.

```text
export declare const isDeepEqualData: (...args: Parameters<typeof sdk.isDeepEqualData>) => Effect.Effect<boolean, AiSdkError, never>;
```

## `jsonSchema`

Build a legacy schema with an optional Effect validator supplied by the caller.

```text
export declare const jsonSchema: <A = unknown, R = never>(definition: LegacyJsonSchema, options?: {
    readonly validate?: (value: unknown) => Effect.Effect<Validated<A>, AiSdkError, R>;
}) => Effect.Effect<Schema<A, R>, AiSdkError>;
```

## `JSONValue`

A JSON value can be a string, number, boolean, object, array, or null.
JSON values can be serialized and deserialized by the JSON.stringify and JSON.parse methods.

```text
type JSONValue = null | string | number | boolean | {
    [value: string]: JSONValue;
} | Array<JSONValue>;
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

## `parseAssistantStreamPart`

Parse a legacy assistant stream line through the native parser's tagged boundary.

```text
export declare const parseAssistantStreamPart: (line: string) => Effect.Effect<{
    type: "text";
    value: string;
} | {
    type: "error";
    value: string;
} | {
    type: "assistant_message";
    value: sdk.AssistantMessage;
} | {
    type: "assistant_control_data";
    value: {
        threadId: string;
        messageId: string;
    };
} | {
    type: "data_message";
    value: sdk.DataMessage;
}, AiSdkError, never>;
```

## `parseDataStreamPart`

Parse a legacy data stream line and return a tagged failure for invalid native input.

```text
export declare const parseDataStreamPart: (line: string) => Effect.Effect<DataPart, AiSdkError>;
```

## `parsePartialJson`

Parse streamed JSON that may still be incomplete using the legacy SDK's parser.

```text
export declare const parsePartialJson: (...args: Parameters<typeof sdk.parsePartialJson>) => Effect.Effect<ReturnType<typeof sdk.parsePartialJson>, AiSdkError>;
```

## `prepareAttachmentsForRequest`

Convert request attachments through the native asynchronous file helper.

```text
export declare const prepareAttachmentsForRequest: (...args: Parameters<typeof sdk.prepareAttachmentsForRequest>) => Effect.Effect<sdk.Attachment[], AiSdkError, never>;
```

## `processAssistantStream`

Process the ordered AI SDK 4 assistant stream with a scoped reader.

```text
export declare const processAssistantStream: <R = never>(options: AssistantStreamOptions<R>) => Effect.Effect<void, AiSdkError, Exclude<R, import("effect/Scope").Scope>>;
```

## `processDataStream`

Process the ordered AI SDK 4 data stream with a scoped reader.

```text
export declare const processDataStream: <R = never>(options: DataStreamOptions<R>) => Effect.Effect<void, AiSdkError, Exclude<R, import("effect/Scope").Scope>>;
```

## `processTextStream`

Process the legacy text stream with a scoped reader.

```text
export declare const processTextStream: <R = never>(options: StreamInput & {
    readonly onTextPart: StreamCallback<string, R>;
}) => Effect.Effect<void, AiSdkError, Exclude<R, import("effect/Scope").Scope>>;
```

## `ReasoningUIPart`

A reasoning part of a message.

```text
type ReasoningUIPart = {
    type: 'reasoning';
    /**
     * The reasoning text.
     */
    reasoning: string;
    details: Array<{
        type: 'text';
        text: string;
        signature?: string;
    } | {
        type: 'redacted';
        data: string;
    }>;
};
```

## `RequestOptions`

```text
type RequestOptions = {
    /**
  An optional object of headers to be passed to the API endpoint.
   */
    headers?: Record<string, string> | Headers;
    /**
  An optional object to be passed to the API endpoint.
     */
    body?: object;
};
```

## `Schema`

A schema for the legacy AI SDK 4 protocol.

```text
export type Schema<A = unknown, R = never> = {
    readonly [schemaFamily]: A;
    readonly jsonSchema: LegacyJsonSchema;
    readonly validate?: (value: unknown) => Effect.Effect<Validated<A>, AiSdkError, R>;
};
```

## `shouldResubmitMessages`

Apply native legacy chat rules to decide whether to submit messages again.

```text
export declare const shouldResubmitMessages: (...args: Parameters<typeof sdk.shouldResubmitMessages>) => Effect.Effect<boolean, AiSdkError, never>;
```

## `SourceUIPart`

A source part of a message.

```text
type SourceUIPart = {
    type: 'source';
    /**
     * The source.
     */
    source: LanguageModelV1Source;
};
```

## `StepStartUIPart`

A step boundary part of a message.

```text
type StepStartUIPart = {
    type: 'step-start';
};
```

## `TextUIPart`

A text part of a message.

```text
type TextUIPart = {
    type: 'text';
    /**
     * The text content.
     */
    text: string;
};
```

## `ToolInvocation`

Tool invocations are either tool calls or tool results. For each assistant tool call,
there is one tool invocation. While the call is in progress, the invocation is a tool call.
Once the call is complete, the invocation is a tool result.

The step is used to track how to map an assistant UI message with many tool invocations
back to a sequence of LLM assistant/tool result message pairs.
It is optional for backwards compatibility.

```text
type ToolInvocation = ({
    state: 'partial-call';
    step?: number;
} & ToolCall<string, any>) | ({
    state: 'call';
    step?: number;
} & ToolCall<string, any>) | ({
    state: 'result';
    step?: number;
} & ToolResult<string, any, any>);
```

## `ToolInvocationUIPart`

A tool invocation part of a message.

```text
type ToolInvocationUIPart = {
    type: 'tool-invocation';
    /**
     * The tool invocation.
     */
    toolInvocation: ToolInvocation;
};
```

## `UIMessage`

```text
type UIMessage = Message & {
    /**
     * The parts of the message. Use this for rendering the message in the UI.
     *
     * Assistant messages can have text, reasoning and tool invocation parts.
     * User messages can have text parts.
     */
    parts: Array<TextUIPart | ReasoningUIPart | ToolInvocationUIPart | SourceUIPart | FileUIPart | StepStartUIPart>;
};
```

## `updateToolCallResult`

Insert a tool result into the matching invocation using the SDK's message update rules.

```text
export declare const updateToolCallResult: (...args: Parameters<typeof sdk.updateToolCallResult>) => Effect.Effect<void, AiSdkError, never>;
```

## `UseAssistantOptions`

Legacy assistant host settings for the endpoint, thread, and request payload.

```text
export type UseAssistantOptions = FetchSettings & {
    readonly api: string;
    readonly threadId?: string;
    readonly body?: object;
};
```

## `UseChatOptions`

Legacy chat host options with native message state and optional client tool callbacks.

```text
export type UseChatOptions = TextSettings & {
    readonly initialMessages?: sdk.Message[];
    readonly onToolCall?: (call: ToolCall) => HostResult<unknown>;
    readonly onFinish?: (...args: ChatFinish) => HostResult<void>;
    readonly generateId?: IdGenerator;
    readonly body?: object;
    readonly sendExtraMessageFields?: boolean;
};
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

## `zodSchema`

Adapt a supported Zod schema to the legacy protocol with deferred validation.

```text
export declare const zodSchema: <A>(...args: Parameters<typeof sdk.zodSchema<A>>) => Effect.Effect<Schema<A, never>, AiSdkError, never>;
```
