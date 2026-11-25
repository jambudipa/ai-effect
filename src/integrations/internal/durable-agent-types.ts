// Event and message data from the pinned Durable Agent dependencies.
// ai@6.0.62, @ai-sdk/provider@3.0.6, @ai-sdk/provider-utils@4.0.11 (Apache-2.0).

type JSONValue = null | string | number | boolean | JSONObject | JSONArray;
type JSONObject = { [key: string]: JSONValue | undefined };
type JSONArray = JSONValue[];

type Tool<Input = unknown, Output = unknown> = {
  readonly input: Input;
  readonly output: Output;
};

type ToolSet = Record<string, Tool>;
type InferToolInput<T> = T extends Tool<infer Input, unknown> ? Input : unknown;
type InferToolOutput<T> =
  T extends Tool<unknown, infer Output> ? Output : unknown;
type InferUITool<T> = { input: InferToolInput<T>; output: InferToolOutput<T> };

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

interface UIMessage<
  METADATA = unknown,
  DATA_PARTS extends UIDataTypes = UIDataTypes,
  TOOLS extends UITools = UITools,
> {
  id: string;
  role: 'system' | 'user' | 'assistant';
  metadata?: METADATA;
  parts: Array<UIMessagePart<DATA_PARTS, TOOLS>>;
}

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

type ModelMessage =
  | SystemModelMessage
  | UserModelMessage
  | AssistantModelMessage
  | ToolModelMessage;

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

type LanguageModelResponseMetadata = {
  id: string;
  timestamp: Date;
  modelId: string;
  headers?: Record<string, string>;
};

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

interface ReasoningPart {
  type: 'reasoning';
  text: string;
  providerOptions?: ProviderOptions;
}

interface GeneratedFile {
  readonly base64: string;
  readonly uint8Array: Uint8Array;
  readonly mediaType: string;
}

type Source = LanguageModelV3Source;

type TypedToolCall<TOOLS extends ToolSet> =
  StaticToolCall<TOOLS> | DynamicToolCall;

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

type DynamicToolCall = BaseToolCall & {
  toolName: string;
  input: unknown;
  dynamic: true;
  title?: string;
  invalid?: boolean;
  error?: unknown;
};

type TypedToolResult<TOOLS extends ToolSet> =
  StaticToolResult<TOOLS> | DynamicToolResult;

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

type FinishReason =
  'stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'other';

type CallWarning = SharedV3Warning;

type LanguageModelRequestMetadata = {
  body?: unknown;
};

type ResponseMessage = AssistantModelMessage | ToolModelMessage;

type ProviderMetadata = SharedV3ProviderMetadata;

type UIDataTypes = Record<string, unknown>;

type UITools = Record<string, UITool>;

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

type DataUIMessageChunk<DATA_TYPES extends UIDataTypes> = ValueOf<{
  [NAME in keyof DATA_TYPES & string]: {
    type: `data-${NAME}`;
    id?: string;
    data: DATA_TYPES[NAME];
    transient?: boolean;
  };
}>;

type SystemModelMessage = {
  role: 'system';
  content: string;
  providerOptions?: ProviderOptions;
};

type UserModelMessage = {
  role: 'user';
  content: UserContent;
  providerOptions?: ProviderOptions;
};

type AssistantModelMessage = {
  role: 'assistant';
  content: AssistantContent;
  providerOptions?: ProviderOptions;
};

type ToolModelMessage = {
  role: 'tool';
  content: ToolContent;
  providerOptions?: ProviderOptions;
};

interface ReasoningOutput {
  type: 'reasoning';
  text: string;
  providerMetadata?: ProviderMetadata;
}

type TypedToolError<TOOLS extends ToolSet> =
  StaticToolError<TOOLS> | DynamicToolError;

type ToolApprovalRequestOutput<TOOLS extends ToolSet> = {
  type: 'tool-approval-request';
  approvalId: string;
  toolCall: TypedToolCall<TOOLS>;
};

type ProviderOptions = SharedV3ProviderOptions;

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

type ValueOf<
  ObjectType,
  ValueType extends keyof ObjectType = keyof ObjectType,
> = ObjectType[ValueType];

type BaseToolCall = {
  type: 'tool-call';
  toolCallId: string;
  providerExecuted?: boolean;
  providerMetadata?: ProviderMetadata;
};

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

type SharedV3ProviderMetadata = Record<string, JSONObject>;

type UITool = {
  input: unknown;
  output: unknown | undefined;
};

type TextUIPart = {
  type: 'text';
  text: string;
  state?: 'streaming' | 'done';
  providerMetadata?: ProviderMetadata;
};

type ReasoningUIPart = {
  type: 'reasoning';
  text: string;
  state?: 'streaming' | 'done';
  providerMetadata?: ProviderMetadata;
};

type ToolUIPart<TOOLS extends UITools = UITools> = ValueOf<{
  [NAME in keyof TOOLS & string]: {
    type: `tool-${NAME}`;
  } & UIToolInvocation<TOOLS[NAME]>;
}>;

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

type SourceUrlUIPart = {
  type: 'source-url';
  sourceId: string;
  url: string;
  title?: string;
  providerMetadata?: ProviderMetadata;
};

type SourceDocumentUIPart = {
  type: 'source-document';
  sourceId: string;
  mediaType: string;
  title: string;
  filename?: string;
  providerMetadata?: ProviderMetadata;
};

type FileUIPart = {
  type: 'file';
  mediaType: string;
  filename?: string;
  url: string;
  providerMetadata?: ProviderMetadata;
};

type DataUIPart<DATA_TYPES extends UIDataTypes> = ValueOf<{
  [NAME in keyof DATA_TYPES & string]: {
    type: `data-${NAME}`;
    id?: string;
    data: DATA_TYPES[NAME];
  };
}>;

type StepStartUIPart = {
  type: 'step-start';
};

type UserContent = string | Array<TextPart | ImagePart | FilePart>;

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

type ToolContent = Array<ToolResultPart | ToolApprovalResponse>;

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

type SharedV3ProviderOptions = Record<string, JSONObject>;

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

interface TextPart {
  type: 'text';
  text: string;
  providerOptions?: ProviderOptions;
}

interface ImagePart {
  type: 'image';
  image: DataContent | URL;
  mediaType?: string;
  providerOptions?: ProviderOptions;
}

interface FilePart {
  type: 'file';
  data: DataContent | URL;
  filename?: string;
  mediaType: string;
  providerOptions?: ProviderOptions;
}

interface ToolCallPart {
  type: 'tool-call';
  toolCallId: string;
  toolName: string;
  input: unknown;
  providerOptions?: ProviderOptions;
  providerExecuted?: boolean;
}

interface ToolResultPart {
  type: 'tool-result';
  toolCallId: string;
  toolName: string;
  output: ToolResultOutput;
  providerOptions?: ProviderOptions;
}

type ToolApprovalRequest = {
  type: 'tool-approval-request';
  approvalId: string;
  toolCallId: string;
};

type ToolApprovalResponse = {
  type: 'tool-approval-response';
  approvalId: string;
  approved: boolean;
  reason?: string;
  providerExecuted?: boolean;
};

type DeepPartial<T> = DeepPartialInternal<T>;

type asUITool<TOOL extends UITool | Tool> = TOOL extends Tool
  ? InferUITool<TOOL>
  : TOOL;

type DataContent = string | Uint8Array | ArrayBuffer;

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

type PartialMap<KeyType, ValueType> = {} & Map<
  DeepPartialInternal<KeyType>,
  DeepPartialInternal<ValueType>
>;

type PartialSet<T> = {} & Set<DeepPartialInternal<T>>;

type PartialReadonlyMap<KeyType, ValueType> = {} & ReadonlyMap<
  DeepPartialInternal<KeyType>,
  DeepPartialInternal<ValueType>
>;

type PartialReadonlySet<T> = {} & ReadonlySet<DeepPartialInternal<T>>;

type PartialObject<ObjectType extends object> = {
  [KeyType in keyof ObjectType]?: DeepPartialInternal<ObjectType[KeyType]>;
};

export type {
  ModelMessage as DurableMessage,
  UIMessage as DurableUIMessage,
  UIMessageChunk as DurableUIMessageChunk,
};
export type DurableStepResult = StepResult<ToolSet>;
