// Event and message data from the pinned Durable Agent dependencies.
// ai@6.0.62, @ai-sdk/provider@3.0.6, @ai-sdk/provider-utils@4.0.11 (Apache-2.0).

/** Serializable provider data shared by durable message and metadata contracts. */
type JSONValue = null | string | number | boolean | JSONObject | JSONArray;
/** Provider JSON object whose individual keys may be absent. */
type JSONObject = { [key: string]: JSONValue | undefined };
/** Ordered JSON values in durable messages or provider data. */
type JSONArray = JSONValue[];

/** Structural tool descriptor that preserves the input and output pair without the executor. */
type Tool<Input = unknown, Output = unknown> = {
  readonly input: Input;
  readonly output: Output;
};

/** Tool descriptors keyed by the names recorded in durable step events. */
type ToolSet = Record<string, Tool>;
/** Recover a known tool's input shape and use `unknown` for an untyped descriptor. */
type InferToolInput<T> = T extends Tool<infer Input, unknown> ? Input : unknown;
/** Recover a known tool's output shape and use `unknown` for an untyped descriptor. */
type InferToolOutput<T> =
  T extends Tool<unknown, infer Output> ? Output : unknown;
/** Carry a tool's input and output pair into UI invocation state. */
type InferUITool<T> = { input: InferToolInput<T>; output: InferToolOutput<T> };

/** Snapshot of a completed durable step, including generated content, usage, and native messages. */
type StepResult<TOOLS extends ToolSet> = {
  readonly content: Array<ContentPart<TOOLS>>;
  readonly text: string;
  readonly reasoning: Array<ReasoningPart>;
  readonly reasoningText: string | undefined;
  readonly files: Array<GeneratedFile>;
  readonly sources: Array<Source>;
  readonly toolCalls: Array<TypedToolCall<TOOLS>>;
  readonly staticToolCalls: Array<StaticToolCall<TOOLS>>;
  readonly dynamicToolCalls: Array<DynamicToolCall>;
  readonly toolResults: Array<TypedToolResult<TOOLS>>;
  readonly staticToolResults: Array<StaticToolResult<TOOLS>>;
  readonly dynamicToolResults: Array<DynamicToolResult>;
  readonly finishReason: FinishReason;
  readonly rawFinishReason: string | undefined;
  readonly usage: LanguageModelUsage;
  readonly warnings: CallWarning[] | undefined;
  readonly request: LanguageModelRequestMetadata;
  readonly response: LanguageModelResponseMetadata & {
    readonly messages: Array<ResponseMessage>;
    body?: unknown;
  };
  readonly providerMetadata: ProviderMetadata | undefined;
};

/** UI message shape carried by the pinned Durable Agent stream contract. */
interface UIMessage<
  METADATA = unknown,
  DATA_PARTS extends UIDataTypes = UIDataTypes,
  TOOLS extends UITools = UITools,
> {
  /** Identifies an individual message as its streamed parts accumulate. */
  id: string;
  /** Controls how a UI message is attributed to the conversation participant. */
  role: 'system' | 'user' | 'assistant';
  /** Application metadata supplied by the stream's start, finish, or metadata event. */
  metadata?: METADATA;
  /** Ordered content, tool, source, and data parts that make up the rendered message. */
  parts: Array<UIMessagePart<DATA_PARTS, TOOLS>>;
}

/** Durable UI stream events used to assemble message parts, tool state, and terminal status. */
type UIMessageChunk<
  METADATA = unknown,
  DATA_TYPES extends UIDataTypes = UIDataTypes,
> =
  | {
      type: 'text-start';
      id: string;
      providerMetadata?: ProviderMetadata;
    }
  | {
      type: 'text-delta';
      delta: string;
      id: string;
      providerMetadata?: ProviderMetadata;
    }
  | {
      type: 'text-end';
      id: string;
      providerMetadata?: ProviderMetadata;
    }
  | {
      type: 'reasoning-start';
      id: string;
      providerMetadata?: ProviderMetadata;
    }
  | {
      type: 'reasoning-delta';
      id: string;
      delta: string;
      providerMetadata?: ProviderMetadata;
    }
  | {
      type: 'reasoning-end';
      id: string;
      providerMetadata?: ProviderMetadata;
    }
  | {
      type: 'error';
      errorText: string;
    }
  | {
      type: 'tool-input-available';
      toolCallId: string;
      toolName: string;
      input: unknown;
      providerExecuted?: boolean;
      providerMetadata?: ProviderMetadata;
      dynamic?: boolean;
      title?: string;
    }
  | {
      type: 'tool-input-error';
      toolCallId: string;
      toolName: string;
      input: unknown;
      providerExecuted?: boolean;
      providerMetadata?: ProviderMetadata;
      dynamic?: boolean;
      errorText: string;
      title?: string;
    }
  | {
      type: 'tool-approval-request';
      approvalId: string;
      toolCallId: string;
    }
  | {
      type: 'tool-output-available';
      toolCallId: string;
      output: unknown;
      providerExecuted?: boolean;
      dynamic?: boolean;
      preliminary?: boolean;
    }
  | {
      type: 'tool-output-error';
      toolCallId: string;
      errorText: string;
      providerExecuted?: boolean;
      dynamic?: boolean;
    }
  | {
      type: 'tool-output-denied';
      toolCallId: string;
    }
  | {
      type: 'tool-input-start';
      toolCallId: string;
      toolName: string;
      providerExecuted?: boolean;
      providerMetadata?: ProviderMetadata;
      dynamic?: boolean;
      title?: string;
    }
  | {
      type: 'tool-input-delta';
      toolCallId: string;
      inputTextDelta: string;
    }
  | {
      type: 'source-url';
      sourceId: string;
      url: string;
      title?: string;
      providerMetadata?: ProviderMetadata;
    }
  | {
      type: 'source-document';
      sourceId: string;
      mediaType: string;
      title: string;
      filename?: string;
      providerMetadata?: ProviderMetadata;
    }
  | {
      type: 'file';
      url: string;
      mediaType: string;
      providerMetadata?: ProviderMetadata;
    }
  | DataUIMessageChunk<DATA_TYPES>
  | {
      type: 'start-step';
    }
  | {
      type: 'finish-step';
    }
  | {
      type: 'start';
      messageId?: string;
      messageMetadata?: METADATA;
    }
  | {
      type: 'finish';
      finishReason?: FinishReason;
      messageMetadata?: METADATA;
    }
  | {
      type: 'abort';
      reason?: string;
    }
  | {
      type: 'message-metadata';
      messageMetadata: METADATA;
    };

/** Model conversation history grouped by role for durable callbacks and stream results. */
type ModelMessage =
  | SystemModelMessage
  | UserModelMessage
  | AssistantModelMessage
  | ToolModelMessage;

/** Token accounting with optional cache and reasoning details from the native response. */
type LanguageModelUsage = {
  inputTokens: number | undefined;
  inputTokenDetails: {
    noCacheTokens: number | undefined;
    cacheReadTokens: number | undefined;
    cacheWriteTokens: number | undefined;
  };
  outputTokens: number | undefined;
  outputTokenDetails: {
    textTokens: number | undefined;
    reasoningTokens: number | undefined;
  };
  totalTokens: number | undefined;
  reasoningTokens?: number | undefined;
  cachedInputTokens?: number | undefined;
  raw?: JSONObject;
};

/** Provider response identity, timestamp, model ID, and any available response headers. */
type LanguageModelResponseMetadata = {
  id: string;
  timestamp: Date;
  modelId: string;
  headers?: Record<string, string>;
};

/** Ordered step output that includes tool results, errors, approvals, and generated content. */
type ContentPart<TOOLS extends ToolSet> =
  | {
      type: 'text';
      text: string;
      providerMetadata?: ProviderMetadata;
    }
  | ReasoningOutput
  | ({
      type: 'source';
    } & Source)
  | {
      type: 'file';
      file: GeneratedFile;
      providerMetadata?: ProviderMetadata;
    }
  | ({
      type: 'tool-call';
    } & TypedToolCall<TOOLS> & {
        providerMetadata?: ProviderMetadata;
      })
  | ({
      type: 'tool-result';
    } & TypedToolResult<TOOLS> & {
        providerMetadata?: ProviderMetadata;
      })
  | ({
      type: 'tool-error';
    } & TypedToolError<TOOLS> & {
        providerMetadata?: ProviderMetadata;
      })
  | ToolApprovalRequestOutput<TOOLS>;

/** Reasoning included as input in assistant message history. */
interface ReasoningPart {
  /** Distinguishes reasoning from regular assistant text content in history. */
  type: 'reasoning';
  /** Reasoning text to pass through to the model. */
  text: string;
  /** Provider-specific input options for this reasoning part. */
  providerOptions?: ProviderOptions;
}

/** Model-generated binary data exposed in both encoded and byte-array forms. */
interface GeneratedFile {
  /** Base64 representation for destinations that accept text only. */
  readonly base64: string;
  /** Decoded bytes for callers handling the generated file directly. */
  readonly uint8Array: Uint8Array;
  /** Media type of both representations of the file. */
  readonly mediaType: string;
}

/** Provider v3 citation data included in the Durable Agent step result. */
type Source = LanguageModelV3Source;

/** Tool invocation with name inference for known tools and unknown input for dynamic tools. */
type TypedToolCall<TOOLS extends ToolSet> =
  StaticToolCall<TOOLS> | DynamicToolCall;

/** Match each registered tool name to the input shape recorded in its call. */
type StaticToolCall<TOOLS extends ToolSet> = ValueOf<{
  [NAME in keyof TOOLS]: BaseToolCall & {
    toolName: NAME & string;
    input: TOOLS[NAME] extends Tool<infer PARAMETERS> ? PARAMETERS : never;
    dynamic?: false | undefined;
    invalid?: false | undefined;
    error?: never;
    title?: string;
  };
}>;

/** Runtime-resolved tool call that can carry an invalid-input marker and error. */
type DynamicToolCall = BaseToolCall & {
  toolName: string;
  input: unknown;
  dynamic: true;
  title?: string;
  invalid?: boolean;
  error?: unknown;
};

/** Tool execution result distinguished by whether the tool was known when the agent was typed. */
type TypedToolResult<TOOLS extends ToolSet> =
  StaticToolResult<TOOLS> | DynamicToolResult;

/** Link a known tool's name, input, and output while preserving preliminary-result state. */
type StaticToolResult<TOOLS extends ToolSet> = ValueOf<{
  [NAME in keyof TOOLS]: {
    type: 'tool-result';
    toolCallId: string;
    toolName: NAME & string;
    input: InferToolInput<TOOLS[NAME]>;
    output: InferToolOutput<TOOLS[NAME]>;
    providerExecuted?: boolean;
    providerMetadata?: ProviderMetadata;
    dynamic?: false | undefined;
    preliminary?: boolean;
    title?: string;
  };
}>;

/** Runtime-resolved result whose input and output need caller-side narrowing. */
type DynamicToolResult = {
  type: 'tool-result';
  toolCallId: string;
  toolName: string;
  input: unknown;
  output: unknown;
  providerExecuted?: boolean;
  providerMetadata?: ProviderMetadata;
  dynamic: true;
  preliminary?: boolean;
  title?: string;
};

/** Normalized reason a model step ended. `rawFinishReason` carries the unnormalized value separately. */
type FinishReason =
  'stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'other';

/** Compatibility or unsupported-feature notices from the pinned provider v3 contract. */
type CallWarning = SharedV3Warning;

/** Request metadata recorded as part of the completed step. */
type LanguageModelRequestMetadata = {
  body?: unknown;
};

/** Assistant and tool messages generated by a model step and available for later calls. */
type ResponseMessage = AssistantModelMessage | ToolModelMessage;

/** Provider-keyed information returned with model content and callbacks. */
type ProviderMetadata = SharedV3ProviderMetadata;

/** Application registry from which custom UI data part names and payloads are inferred. */
type UIDataTypes = Record<string, unknown>;

/** Registration map that links UI tool names to their input and output shapes. */
type UITools = Record<string, UITool>;

/** Renderable durable-message parts, including source citations and runtime tool state. */
type UIMessagePart<DATA_TYPES extends UIDataTypes, TOOLS extends UITools> =
  | TextUIPart
  | ReasoningUIPart
  | ToolUIPart<TOOLS>
  | DynamicToolUIPart
  | SourceUrlUIPart
  | SourceDocumentUIPart
  | FileUIPart
  | DataUIPart<DATA_TYPES>
  | StepStartUIPart;

/** Custom data event with a typed name and a transient flag for events outside message history. */
type DataUIMessageChunk<DATA_TYPES extends UIDataTypes> = ValueOf<{
  [NAME in keyof DATA_TYPES & string]: {
    type: `data-${NAME}`;
    id?: string;
    data: DATA_TYPES[NAME];
    transient?: boolean;
  };
}>;

/** System instructions in the durable model message sequence. */
type SystemModelMessage = {
  role: 'system';
  content: string;
  providerOptions?: ProviderOptions;
};

/** User message with text or multimodal input. */
type UserModelMessage = {
  role: 'user';
  content: UserContent;
  providerOptions?: ProviderOptions;
};

/** Assistant message with text, reasoning, files, tool calls, results, or approval requests. */
type AssistantModelMessage = {
  role: 'assistant';
  content: AssistantContent;
  providerOptions?: ProviderOptions;
};

/** Tool-role message with execution results or approval responses. */
type ToolModelMessage = {
  role: 'tool';
  content: ToolContent;
  providerOptions?: ProviderOptions;
};

/** Reasoning returned by a provider as a generated step content part. */
interface ReasoningOutput {
  /** Tags reasoning output for consumers of the model step's content sequence. */
  type: 'reasoning';
  /** Reasoning text supplied by the provider. */
  text: string;
  /** Provider-specific response metadata for the generated reasoning. */
  providerMetadata?: ProviderMetadata;
}

/** Tool failure that distinguishes known tools from those discovered at runtime. */
type TypedToolError<TOOLS extends ToolSet> =
  StaticToolError<TOOLS> | DynamicToolError;

/** Approval request output containing a typed invocation and the approval identity. */
type ToolApprovalRequestOutput<TOOLS extends ToolSet> = {
  type: 'tool-approval-request';
  approvalId: string;
  toolCall: TypedToolCall<TOOLS>;
};

/** Provider-keyed options carried by requests and individual input parts. */
type ProviderOptions = SharedV3ProviderOptions;

/** URL or document source returned by the pinned provider v3 model contract. */
type LanguageModelV3Source =
  | {
      type: 'source';
      sourceType: 'url';
      id: string;
      url: string;
      title?: string;
      providerMetadata?: SharedV3ProviderMetadata;
    }
  | {
      type: 'source';
      sourceType: 'document';
      id: string;
      mediaType: string;
      title: string;
      filename?: string;
      providerMetadata?: SharedV3ProviderMetadata;
    };

/** Obtain a union of selected property values from a keyed tool or data map. */
type ValueOf<
  ObjectType,
  ValueType extends keyof ObjectType = keyof ObjectType,
> = ObjectType[ValueType];

/** Share call identity and provider execution metadata across static and dynamic invocations. */
type BaseToolCall = {
  type: 'tool-call';
  toolCallId: string;
  providerExecuted?: boolean;
  providerMetadata?: ProviderMetadata;
};

/** Provider notice for unsupported features, compatibility handling, or other warnings. */
type SharedV3Warning =
  | {
      type: 'unsupported';
      feature: string;
      details?: string;
    }
  | {
      type: 'compatibility';
      feature: string;
      details?: string;
    }
  | {
      type: 'other';
      message: string;
    };

/** Namespace native response metadata by provider name and retain JSON-compatible values. */
type SharedV3ProviderMetadata = Record<string, JSONObject>;

/** Client-side tool descriptor. Output can be absent until a result arrives. */
type UITool = {
  input: unknown;
  output: unknown | undefined;
};

/** Visible assistant text with optional progress state and provider metadata. */
type TextUIPart = {
  type: 'text';
  text: string;
  state?: 'streaming' | 'done';
  providerMetadata?: ProviderMetadata;
};

/** Reasoning UI text with a separate progress state from ordinary assistant text. */
type ReasoningUIPart = {
  type: 'reasoning';
  text: string;
  state?: 'streaming' | 'done';
  providerMetadata?: ProviderMetadata;
};

/** Name-specific UI tool part whose discriminator and payload share the same registry key. */
type ToolUIPart<TOOLS extends UITools = UITools> = ValueOf<{
  [NAME in keyof TOOLS & string]: {
    type: `tool-${NAME}`;
  } & UIToolInvocation<TOOLS[NAME]>;
}>;

/** Runtime-resolved UI tool part with states for input, approval, output, and failure. */
type DynamicToolUIPart = {
  type: 'dynamic-tool';
  toolName: string;
  toolCallId: string;
  title?: string;
  providerExecuted?: boolean;
} & (
  | {
      state: 'input-streaming';
      input: unknown | undefined;
      output?: never;
      errorText?: never;
      callProviderMetadata?: ProviderMetadata;
      approval?: never;
    }
  | {
      state: 'input-available';
      input: unknown;
      output?: never;
      errorText?: never;
      callProviderMetadata?: ProviderMetadata;
      approval?: never;
    }
  | {
      state: 'approval-requested';
      input: unknown;
      output?: never;
      errorText?: never;
      callProviderMetadata?: ProviderMetadata;
      approval: {
        id: string;
        approved?: never;
        reason?: never;
      };
    }
  | {
      state: 'approval-responded';
      input: unknown;
      output?: never;
      errorText?: never;
      callProviderMetadata?: ProviderMetadata;
      approval: {
        id: string;
        approved: boolean;
        reason?: string;
      };
    }
  | {
      state: 'output-available';
      input: unknown;
      output: unknown;
      errorText?: never;
      callProviderMetadata?: ProviderMetadata;
      preliminary?: boolean;
      approval?: {
        id: string;
        approved: true;
        reason?: string;
      };
    }
  | {
      state: 'output-error';
      input: unknown;
      output?: never;
      errorText: string;
      callProviderMetadata?: ProviderMetadata;
      approval?: {
        id: string;
        approved: true;
        reason?: string;
      };
    }
  | {
      state: 'output-denied';
      input: unknown;
      output?: never;
      errorText?: never;
      callProviderMetadata?: ProviderMetadata;
      approval: {
        id: string;
        approved: false;
        reason?: string;
      };
    }
);

/** Render a cited URL with its source ID and optional label. */
type SourceUrlUIPart = {
  type: 'source-url';
  sourceId: string;
  url: string;
  title?: string;
  providerMetadata?: ProviderMetadata;
};

/** Render a cited document whose media type, title, and optional filename come from the provider. */
type SourceDocumentUIPart = {
  type: 'source-document';
  sourceId: string;
  mediaType: string;
  title: string;
  filename?: string;
  providerMetadata?: ProviderMetadata;
};

/** Render a file from its URL and associated media type. */
type FileUIPart = {
  type: 'file';
  mediaType: string;
  filename?: string;
  url: string;
  providerMetadata?: ProviderMetadata;
};

/** Persist an application-defined UI data payload under the type that matches its data registry key. */
type DataUIPart<DATA_TYPES extends UIDataTypes> = ValueOf<{
  [NAME in keyof DATA_TYPES & string]: {
    type: `data-${NAME}`;
    id?: string;
    data: DATA_TYPES[NAME];
  };
}>;

/** Mark the beginning of another model step in an ordered UI message. */
type StepStartUIPart = {
  type: 'step-start';
};

/** User prompt content in plain text or ordered text, image, and file parts. */
type UserContent = string | Array<TextPart | ImagePart | FilePart>;

/** Assistant history content with multimodal output, tool activity, reasoning, and approval requests. */
type AssistantContent =
  | string
  | Array<
      | TextPart
      | FilePart
      | ReasoningPart
      | ToolCallPart
      | ToolResultPart
      | ToolApprovalRequest
    >;

/** Tool-role history containing a result or the response to a pending approval. */
type ToolContent = Array<ToolResultPart | ToolApprovalResponse>;

/** Preserve a known tool's typed input alongside a failed execution's cause. */
type StaticToolError<TOOLS extends ToolSet> = ValueOf<{
  [NAME in keyof TOOLS]: {
    type: 'tool-error';
    toolCallId: string;
    toolName: NAME & string;
    input: InferToolInput<TOOLS[NAME]>;
    error: unknown;
    providerExecuted?: boolean;
    providerMetadata?: ProviderMetadata;
    dynamic?: false | undefined;
    title?: string;
  };
}>;

/** Failure for a runtime-resolved tool whose original input needs caller-side validation. */
type DynamicToolError = {
  type: 'tool-error';
  toolCallId: string;
  toolName: string;
  input: unknown;
  error: unknown;
  providerExecuted?: boolean;
  providerMetadata?: ProviderMetadata;
  dynamic: true;
  title?: string;
};

/** Provider-scoped JSON options forwarded with durable model requests. */
type SharedV3ProviderOptions = Record<string, JSONObject>;

/** Track typed tool input while streaming, then approval, output, denial, or error as events arrive. */
type UIToolInvocation<TOOL extends UITool | Tool> = {
  toolCallId: string;
  title?: string;
  providerExecuted?: boolean;
} & (
  | {
      state: 'input-streaming';
      input: DeepPartial<asUITool<TOOL>['input']> | undefined;
      output?: never;
      errorText?: never;
      callProviderMetadata?: ProviderMetadata;
      approval?: never;
    }
  | {
      state: 'input-available';
      input: asUITool<TOOL>['input'];
      output?: never;
      errorText?: never;
      callProviderMetadata?: ProviderMetadata;
      approval?: never;
    }
  | {
      state: 'approval-requested';
      input: asUITool<TOOL>['input'];
      output?: never;
      errorText?: never;
      callProviderMetadata?: ProviderMetadata;
      approval: {
        id: string;
        approved?: never;
        reason?: never;
      };
    }
  | {
      state: 'approval-responded';
      input: asUITool<TOOL>['input'];
      output?: never;
      errorText?: never;
      callProviderMetadata?: ProviderMetadata;
      approval: {
        id: string;
        approved: boolean;
        reason?: string;
      };
    }
  | {
      state: 'output-available';
      input: asUITool<TOOL>['input'];
      output: asUITool<TOOL>['output'];
      errorText?: never;
      callProviderMetadata?: ProviderMetadata;
      preliminary?: boolean;
      approval?: {
        id: string;
        approved: true;
        reason?: string;
      };
    }
  | {
      state: 'output-error';
      input: asUITool<TOOL>['input'] | undefined;
      rawInput?: unknown;
      output?: never;
      errorText: string;
      callProviderMetadata?: ProviderMetadata;
      approval?: {
        id: string;
        approved: true;
        reason?: string;
      };
    }
  | {
      state: 'output-denied';
      input: asUITool<TOOL>['input'];
      output?: never;
      errorText?: never;
      callProviderMetadata?: ProviderMetadata;
      approval: {
        id: string;
        approved: false;
        reason?: string;
      };
    }
);

/** Text sent to the model as a single prompt content part. */
interface TextPart {
  /** Marks the input part as plain text in the ordered prompt sequence. */
  type: 'text';
  /** Text content supplied to the model. */
  text: string;
  /** Provider-specific options for this text input only. */
  providerOptions?: ProviderOptions;
}

/** Image prompt content supplied as data or a URL. */
interface ImagePart {
  /** Distinguishes an image input part from a generic file. */
  type: 'image';
  /** Image bytes, encoded image data, or a URL that identifies the image. */
  image: DataContent | URL;
  /** Optional media type used when the provider needs the format declared. */
  mediaType?: string;
  /** Provider-specific options associated with this image input. */
  providerOptions?: ProviderOptions;
}

/** File content supplied to the model as bytes, encoded data, or a URL. */
interface FilePart {
  /** Distinguishes a generic file input from text and image parts. */
  type: 'file';
  /** File data or location forwarded in the model prompt. */
  data: DataContent | URL;
  /** Original file name, when the caller can supply one. */
  filename?: string;
  /** Media type the model uses to interpret the file data. */
  mediaType: string;
  /** Provider-specific options associated with this file input. */
  providerOptions?: ProviderOptions;
}

/** Tool call included in assistant history for correlation with a later result. */
interface ToolCallPart {
  /** Identifies the part as a tool invocation in the model message. */
  type: 'tool-call';
  /** Correlation key shared with the matching result or approval request. */
  toolCallId: string;
  /** Native tool name selected for the invocation. */
  toolName: string;
  /** Original tool input. Validate it before relying on a concrete shape. */
  input: unknown;
  /** Provider-specific options tied to the recorded call. */
  providerOptions?: ProviderOptions;
  /** Indicates the provider performed the execution itself. */
  providerExecuted?: boolean;
}

/** Tool output in model history, linked to its invocation. */
interface ToolResultPart {
  /** Identifies a response from a tool in the model prompt. */
  type: 'tool-result';
  /** Correlation key of the call that produced this result. */
  toolCallId: string;
  /** Name of the tool that produced the result. */
  toolName: string;
  /** Structured output representation supplied back to the model. */
  output: ToolResultOutput;
  /** Provider-specific options associated with this result part. */
  providerOptions?: ProviderOptions;
}

/** Request an approval for the call with the matching ID before execution continues. */
type ToolApprovalRequest = {
  type: 'tool-approval-request';
  approvalId: string;
  toolCallId: string;
};

/** Supply the approval decision, optionally with a reason, for the pending request ID. */
type ToolApprovalResponse = {
  type: 'tool-approval-response';
  approvalId: string;
  approved: boolean;
  reason?: string;
  providerExecuted?: boolean;
};

/** Permit incomplete values during streamed tool input assembly. */
type DeepPartial<T> = DeepPartialInternal<T>;

/** Convert a native tool descriptor to the input/output pair consumed by the UI contract. */
type asUITool<TOOL extends UITool | Tool> = TOOL extends Tool
  ? InferUITool<TOOL>
  : TOOL;

/** Inline data forms accepted by durable image and file message parts. */
type DataContent = string | Uint8Array | ArrayBuffer;

/** Result shapes the model can receive, including execution denial, typed errors, and media content. */
type ToolResultOutput =
  | {
      type: 'text';
      value: string;
      providerOptions?: ProviderOptions;
    }
  | {
      type: 'json';
      value: JSONValue;
      providerOptions?: ProviderOptions;
    }
  | {
      type: 'execution-denied';
      reason?: string;
      providerOptions?: ProviderOptions;
    }
  | {
      type: 'error-text';
      value: string;
      providerOptions?: ProviderOptions;
    }
  | {
      type: 'error-json';
      value: JSONValue;
      providerOptions?: ProviderOptions;
    }
  | {
      type: 'content';
      value: Array<
        | {
            type: 'text';
            text: string;
            providerOptions?: ProviderOptions;
          }
        | {
            type: 'media';
            data: string;
            mediaType: string;
          }
        | {
            type: 'file-data';
            data: string;
            mediaType: string;
            filename?: string;
            providerOptions?: ProviderOptions;
          }
        | {
            type: 'file-url';
            url: string;
            providerOptions?: ProviderOptions;
          }
        | {
            type: 'file-id';
            fileId: string | Record<string, string>;
            providerOptions?: ProviderOptions;
          }
        | {
            type: 'image-data';
            data: string;
            mediaType: string;
            providerOptions?: ProviderOptions;
          }
        | {
            type: 'image-url';
            url: string;
            providerOptions?: ProviderOptions;
          }
        | {
            type: 'image-file-id';
            fileId: string | Record<string, string>;
            providerOptions?: ProviderOptions;
          }
        | {
            type: 'custom';
            providerOptions?: ProviderOptions;
          }
      >;
    };

/** Recur through collections and records while preserving scalar, date, and callable types. */
type DeepPartialInternal<T> = T extends
  | null
  | undefined
  | string
  | number
  | boolean
  | symbol
  | bigint
  | void
  | Date
  | RegExp
  | ((...arguments_: any[]) => unknown)
  | (new (...arguments_: any[]) => unknown)
  ? T
  : T extends Map<infer KeyType, infer ValueType>
    ? PartialMap<KeyType, ValueType>
    : T extends Set<infer ItemType>
      ? PartialSet<ItemType>
      : T extends ReadonlyMap<infer KeyType, infer ValueType>
        ? PartialReadonlyMap<KeyType, ValueType>
        : T extends ReadonlySet<infer ItemType>
          ? PartialReadonlySet<ItemType>
          : T extends object
            ? T extends ReadonlyArray<infer ItemType>
              ? ItemType[] extends T
                ? readonly ItemType[] extends T
                  ? ReadonlyArray<DeepPartialInternal<ItemType | undefined>>
                  : Array<DeepPartialInternal<ItemType | undefined>>
                : PartialObject<T>
              : PartialObject<T>
            : unknown;

/** Recursively make a mutable map's keys and values partial. */
type PartialMap<KeyType, ValueType> = {} & Map<
  DeepPartialInternal<KeyType>,
  DeepPartialInternal<ValueType>
>;

/** Recursively make elements partial while preserving a mutable set. */
type PartialSet<T> = {} & Set<DeepPartialInternal<T>>;

/** Recursively make a read-only map's keys and values partial. */
type PartialReadonlyMap<KeyType, ValueType> = {} & ReadonlyMap<
  DeepPartialInternal<KeyType>,
  DeepPartialInternal<ValueType>
>;

/** Recursively make elements partial while preserving a read-only set. */
type PartialReadonlySet<T> = {} & ReadonlySet<DeepPartialInternal<T>>;

/** Make each object property optional and apply partial typing to nested property values. */
type PartialObject<ObjectType extends object> = {
  [KeyType in keyof ObjectType]?: DeepPartialInternal<ObjectType[KeyType]>;
};

export type {
  ModelMessage as DurableMessage,
  UIMessage as DurableUIMessage,
  UIMessageChunk as DurableUIMessageChunk,
};
/** Completed-step event shape exposed by the wrapper without requiring consumers to import the pinned SDK. */
export type DurableStepResult = StepResult<ToolSet>;
