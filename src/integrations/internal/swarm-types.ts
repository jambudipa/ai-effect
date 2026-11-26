// Data from the pinned Swarm dependencies ai@4.1.39 and @ai-sdk/provider@1.0.7.
// The upstream packages use the Apache-2.0 license.
import type { JSONSchema7 } from '@ai-sdk/provider';

/** Serializable model-provider data accepted in the pinned Swarm contract. */
type JSONValue = null | string | number | boolean | JSONObject | JSONArray;
/** Named provider data whose values can be represented in JSON. */
type JSONObject = { [key: string]: JSONValue };
/** Ordered provider data whose elements can be represented in JSON. */
type JSONArray = JSONValue[];

/** Tool definitions keyed by their names in the Swarm configuration and events. */
type ToolSet = Record<string, unknown>;

/** Tool invocations recorded during a step. The pinned SDK leaves argument types open. */
type ToolCallArray<_Tools> = Array<{
  type: 'tool-call';
  toolCallId: string;
  toolName: string;
  args: unknown;
}>;

/** Tool executions with their original arguments and results linked by call ID. */
type ToolResultArray<_Tools> = Array<{
  type: 'tool-result';
  toolCallId: string;
  toolName: string;
  args: unknown;
  result: unknown;
}>;

/** URL citation emitted by the pinned v1 language model contract. */
type LanguageModelV1Source = {
  sourceType: 'url';
  id: string;
  url: string;
  title?: string;
  providerMetadata?: LanguageModelV1ProviderMetadata;
};

/** Native v1 generation and streaming contract required by Swarm's pinned SDK. */
type LanguageModelV1 = {
  readonly specificationVersion: 'v1';
  readonly provider: string;
  readonly modelId: string;
  readonly defaultObjectGenerationMode: LanguageModelV1ObjectGenerationMode;
  readonly supportsImageUrls?: boolean;
  readonly supportsStructuredOutputs?: boolean;
  supportsUrl?(url: URL): boolean;
  doGenerate(options: LanguageModelV1CallOptions): PromiseLike<{
    text?: string;
    reasoning?: string;
    toolCalls?: Array<LanguageModelV1FunctionToolCall>;
    finishReason: LanguageModelV1FinishReason;
    usage: {
      promptTokens: number;
      completionTokens: number;
    };
    rawCall: {
      rawPrompt: unknown;
      rawSettings: Record<string, unknown>;
    };
    rawResponse?: {
      headers?: Record<string, string>;
    };
    request?: {
      body?: string;
    };
    response?: {
      id?: string;
      timestamp?: Date;
      modelId?: string;
    };
    warnings?: LanguageModelV1CallWarning[];
    providerMetadata?: LanguageModelV1ProviderMetadata;
    logprobs?: LanguageModelV1LogProbs;
  }>;
  doStream(options: LanguageModelV1CallOptions): PromiseLike<{
    stream: ReadableStream<LanguageModelV1StreamPart>;
    rawCall: {
      rawPrompt: unknown;
      rawSettings: Record<string, unknown>;
    };
    rawResponse?: {
      headers?: Record<string, string>;
    };
    request?: {
      body?: string;
    };
    warnings?: Array<LanguageModelV1CallWarning>;
  }>;
};

/** SDK v4 message history grouped by role for the next Swarm call. */
type CoreMessage =
  CoreSystemMessage | CoreUserMessage | CoreAssistantMessage | CoreToolMessage;

/** Completed Swarm step including continuation state, reported usage, and native response messages. */
type StepResult<TOOLS extends ToolSet> = {
  readonly text: string;
  readonly reasoning: string | undefined;
  readonly sources: Source[];
  readonly toolCalls: ToolCallArray<TOOLS>;
  readonly toolResults: ToolResultArray<TOOLS>;
  readonly finishReason: FinishReason;
  readonly usage: LanguageModelUsage;
  readonly warnings: CallWarning[] | undefined;
  readonly logprobs: LogProbs | undefined;
  readonly request: LanguageModelRequestMetadata;
  readonly response: LanguageModelResponseMetadata & {
    readonly messages: Array<ResponseMessage>;
  };
  readonly providerMetadata: ProviderMetadata | undefined;
  readonly experimental_providerMetadata: ProviderMetadata | undefined;
  readonly stepType: 'initial' | 'continue' | 'tool-result';
  readonly isContinued: boolean;
};

/** Provider's default method for producing a structured object, when one is available. */
type LanguageModelV1ObjectGenerationMode = 'json' | 'tool' | undefined;

/** Versioned model input with mode-specific tools or schema, normalized prompt, and call settings. */
type LanguageModelV1CallOptions = LanguageModelV1CallSettings & {
  inputFormat: 'messages' | 'prompt';
  mode:
    | {
        type: 'regular';
        tools?: Array<
          LanguageModelV1FunctionTool | LanguageModelV1ProviderDefinedTool
        >;
        toolChoice?: LanguageModelV1ToolChoice;
      }
    | {
        type: 'object-json';
        schema?: JSONSchema7;
        name?: string;
        description?: string;
      }
    | {
        type: 'object-tool';
        tool: LanguageModelV1FunctionTool;
      };
  prompt: LanguageModelV1Prompt;
  providerMetadata?: LanguageModelV1ProviderMetadata;
};

/** Native function call with arguments still encoded as a string. */
type LanguageModelV1FunctionToolCall = {
  toolCallType: 'function';
  toolCallId: string;
  toolName: string;
  args: string;
};

/** Normalized finish reason from the pinned model contract, including an unknown-provider fallback. */
type LanguageModelV1FinishReason =
  | 'stop'
  | 'length'
  | 'content-filter'
  | 'tool-calls'
  | 'error'
  | 'other'
  | 'unknown';

/** Nonfatal provider warnings for unsupported settings, tools, and other conditions. */
type LanguageModelV1CallWarning =
  | {
      type: 'unsupported-setting';
      setting: keyof LanguageModelV1CallSettings;
      details?: string;
    }
  | {
      type: 'unsupported-tool';
      tool: LanguageModelV1FunctionTool | LanguageModelV1ProviderDefinedTool;
      details?: string;
    }
  | {
      type: 'other';
      message: string;
    };

/** Response data grouped by provider and restricted to serializable values. */
type LanguageModelV1ProviderMetadata = Record<
  string,
  Record<string, JSONValue>
>;

/** Token log probabilities and alternative tokens reported by a model when requested and available. */
type LanguageModelV1LogProbs = Array<{
  token: string;
  logprob: number;
  topLogprobs: Array<{
    token: string;
    logprob: number;
  }>;
}>;

/** Native v1 stream events including text, tool input, metadata, failure, and final usage. */
type LanguageModelV1StreamPart =
  | {
      type: 'text-delta';
      textDelta: string;
    }
  | {
      type: 'reasoning';
      textDelta: string;
    }
  | ({
      type: 'tool-call';
    } & LanguageModelV1FunctionToolCall)
  | {
      type: 'tool-call-delta';
      toolCallType: 'function';
      toolCallId: string;
      toolName: string;
      argsTextDelta: string;
    }
  | {
      type: 'response-metadata';
      id?: string;
      timestamp?: Date;
      modelId?: string;
    }
  | {
      type: 'finish';
      finishReason: LanguageModelV1FinishReason;
      providerMetadata?: LanguageModelV1ProviderMetadata;
      usage: {
        promptTokens: number;
        completionTokens: number;
      };
      logprobs?: LanguageModelV1LogProbs;
    }
  | {
      type: 'error';
      error: unknown;
    };

/** System message containing instructions for the Swarm model. */
type CoreSystemMessage = {
  role: 'system';
  content: string;
  providerOptions?: ProviderOptions;
  experimental_providerMetadata?: ProviderMetadata;
};

/** User message with optional provider settings and multimodal prompt content. */
type CoreUserMessage = {
  role: 'user';
  content: UserContent;
  providerOptions?: ProviderOptions;
  experimental_providerMetadata?: ProviderMetadata;
};

/** Assistant history with text or tool calls for the next model step. */
type CoreAssistantMessage = {
  role: 'assistant';
  content: AssistantContent;
  providerOptions?: ProviderOptions;
  experimental_providerMetadata?: ProviderMetadata;
};

/** Tool-role message carrying results back to the model. */
type CoreToolMessage = {
  role: 'tool';
  content: ToolContent;
  providerOptions?: ProviderOptions;
  experimental_providerMetadata?: ProviderMetadata;
};

/** Model source citation in a Swarm step result. */
type Source = LanguageModelV1Source;

/** Completion reason carried from the native v1 model into the step result. */
type FinishReason = LanguageModelV1FinishReason;

/** Counts prompt, completion, and total tokens for one Swarm model step. */
type LanguageModelUsage = {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
};

/** Native nonfatal warning retained with a completed step. */
type CallWarning = LanguageModelV1CallWarning;

/** Optional per-token probabilities retained from the native model response. */
type LogProbs = LanguageModelV1LogProbs;

/** Native request metadata, including the serialized request body when available. */
type LanguageModelRequestMetadata = {
  body?: string;
};

/** Native response identity, model ID, timestamp, and any available headers. */
type LanguageModelResponseMetadata = {
  id: string;
  timestamp: Date;
  modelId: string;
  headers?: Record<string, string>;
};

/** Assistant or tool response message with the ID used in Swarm history. */
type ResponseMessage = (CoreAssistantMessage | CoreToolMessage) & {
  id: string;
};

/** Provider-specific response metadata retained on step and message contracts. */
type ProviderMetadata = LanguageModelV1ProviderMetadata;

/** Limits, sampling settings, response format, headers, and cancellation passed to the model call. */
type LanguageModelV1CallSettings = {
  maxTokens?: number;
  temperature?: number;
  stopSequences?: string[];
  topP?: number;
  topK?: number;
  presencePenalty?: number;
  frequencyPenalty?: number;
  responseFormat?:
    | {
        type: 'text';
      }
    | {
        type: 'json';
        schema?: JSONSchema7;
        name?: string;
        description?: string;
      };
  seed?: number;
  abortSignal?: AbortSignal;
  headers?: Record<string, string | undefined>;
};

/** Function tool identified by name with a JSON Schema for its arguments. */
type LanguageModelV1FunctionTool = {
  type: 'function';
  name: string;
  description?: string;
  parameters: JSONSchema7;
};

/** Provider-specific tool identified by a qualified ID and provider arguments. */
type LanguageModelV1ProviderDefinedTool = {
  type: 'provider-defined';
  id: `${string}.${string}`;
  name: string;
  args: Record<string, unknown>;
};

/** Select whether a native call can invoke tools or must invoke a specific named tool. */
type LanguageModelV1ToolChoice =
  | {
      type: 'auto';
    }
  | {
      type: 'none';
    }
  | {
      type: 'required';
    }
  | {
      type: 'tool';
      toolName: string;
    };

/** Normalized role-based prompt entries passed to the v1 model implementation. */
type LanguageModelV1Prompt = Array<LanguageModelV1Message>;

/** Provider-scoped options typed using the pinned provider's JSON value shape. */
type ProviderOptions = LanguageModelV1ProviderMetadata;

/** Plain text or ordered text, image, and file parts in user history. */
type UserContent = string | Array<TextPart | ImagePart | FilePart>;

/** Plain text or text and tool calls in assistant history. */
type AssistantContent = string | Array<TextPart | ToolCallPart>;

/** Results for tool invocations previously emitted by the assistant. */
type ToolContent = Array<ToolResultPart>;

/** Normalize each conversation role to the representation accepted by the v1 model. */
type LanguageModelV1Message = (
  | {
      role: 'system';
      content: string;
    }
  | {
      role: 'user';
      content: Array<
        | LanguageModelV1TextPart
        | LanguageModelV1ImagePart
        | LanguageModelV1FilePart
      >;
    }
  | {
      role: 'assistant';
      content: Array<LanguageModelV1TextPart | LanguageModelV1ToolCallPart>;
    }
  | {
      role: 'tool';
      content: Array<LanguageModelV1ToolResultPart>;
    }
) & {
  providerMetadata?: LanguageModelV1ProviderMetadata;
};

/** Plain text input in the Swarm message contract. */
interface TextPart {
  /** Identifies a text part among multimodal user or assistant content. */
  type: 'text';
  /** Text supplied to the model in this part. */
  text: string;
  /** Provider-specific options attached to a text part. */
  providerOptions?: ProviderOptions;
  /** Legacy provider metadata field retained for SDK v4 compatibility. */
  experimental_providerMetadata?: ProviderMetadata;
}

/** User input image supplied inline or at a URL. */
interface ImagePart {
  /** Identifies an image part distinct from other files. */
  type: 'image';
  /** Inline image content or a URL passed in the user message. */
  image: DataContent | URL;
  /** MIME type for an image whose format the caller can identify. */
  mimeType?: string;
  /** Provider-specific options attached to this image. */
  providerOptions?: ProviderOptions;
  /** Legacy metadata field accepted on SDK v4 image parts. */
  experimental_providerMetadata?: ProviderMetadata;
}

/** User input file with an explicit MIME type. */
interface FilePart {
  /** Identifies generic file content in a multipart user message. */
  type: 'file';
  /** Inline file data or a URL supplied for model input. */
  data: DataContent | URL;
  /** MIME type the model uses to interpret the file data. */
  mimeType: string;
  /** Provider-specific options attached to this file. */
  providerOptions?: ProviderOptions;
  /** Legacy metadata field accepted on SDK v4 file parts. */
  experimental_providerMetadata?: ProviderMetadata;
}

/** Tool invocation carried in assistant history. */
interface ToolCallPart {
  /** Identifies a tool call among assistant message parts. */
  type: 'tool-call';
  /** Correlates the invocation with its result in the next tool message. */
  toolCallId: string;
  /** Name of the tool the assistant requested. */
  toolName: string;
  /** Original arguments from the call. Narrow their shape before use. */
  args: unknown;
  /** Provider-specific options tied to this invocation. */
  providerOptions?: ProviderOptions;
  /** Legacy metadata field accepted on SDK v4 tool calls. */
  experimental_providerMetadata?: ProviderMetadata;
}

/** Execution result carried in a tool-role message. */
interface ToolResultPart {
  /** Identifies a tool result among model conversation parts. */
  type: 'tool-result';
  /** ID of the invocation whose result this part supplies. */
  toolCallId: string;
  /** Name of the tool that supplied the result. */
  toolName: string;
  /** Original result value before conversion to model-facing media. */
  result: unknown;
  /** Experimental text or image representation of the result. */
  experimental_content?: ToolResultContent;
  /** Marks a tool error delivered as a result part. */
  isError?: boolean;
  /** Provider-specific options tied to this result. */
  providerOptions?: ProviderOptions;
  /** Legacy metadata field accepted on SDK v4 tool results. */
  experimental_providerMetadata?: ProviderMetadata;
}

/** Text input part in the normalized v1 model prompt. */
interface LanguageModelV1TextPart {
  /** Tells the native provider to treat this part as text. */
  type: 'text';
  /** Prompt text passed to the v1 provider. */
  text: string;
  /** Provider-scoped data accompanying this text input. */
  providerMetadata?: LanguageModelV1ProviderMetadata;
}

/** Image input in the native model representation. */
interface LanguageModelV1ImagePart {
  /** Tells the native provider to treat this part as an image. */
  type: 'image';
  /** Image bytes or a URL the native model supports. */
  image: Uint8Array | URL;
  /** Optional MIME type for the native image representation. */
  mimeType?: string;
  /** Provider-scoped data accompanying this image input. */
  providerMetadata?: LanguageModelV1ProviderMetadata;
}

/** File input in the native model representation. */
interface LanguageModelV1FilePart {
  /** Tells the native provider to treat this part as a file. */
  type: 'file';
  /** Encoded file data or a URL passed into the native model. */
  data: string | URL;
  /** Required MIME type for the native file representation. */
  mimeType: string;
  /** Provider-scoped data accompanying this file input. */
  providerMetadata?: LanguageModelV1ProviderMetadata;
}

/** Prior tool call in the v1 model prompt. */
interface LanguageModelV1ToolCallPart {
  /** Identifies the assistant prompt part as a tool call. */
  type: 'tool-call';
  /** Correlates the prompt call with a later tool result. */
  toolCallId: string;
  /** Name selected for the native tool invocation. */
  toolName: string;
  /** Decoded arguments carried into the assistant prompt. */
  args: unknown;
  /** Provider-scoped data accompanying this tool call. */
  providerMetadata?: LanguageModelV1ProviderMetadata;
}

/** Prior tool result in the v1 model prompt. */
interface LanguageModelV1ToolResultPart {
  /** Identifies the native tool message part as a result. */
  type: 'tool-result';
  /** References the invocation that produced the result. */
  toolCallId: string;
  /** Name of the native tool that produced the result. */
  toolName: string;
  /** Result value available to the model in the native prompt. */
  result: unknown;
  /** Distinguishes failed execution from a successful tool result. */
  isError?: boolean;
  /** Optional content representation for passing text or images back to the model. */
  content?: Array<
    | {
        type: 'text';
        text: string;
      }
    | {
        type: 'image';
        data: string;
        mimeType?: string;
      }
  >;
  /** Provider-scoped data accompanying this tool result. */
  providerMetadata?: LanguageModelV1ProviderMetadata;
}

/** Inline data representations accepted by the pinned SDK message contract. */
type DataContent = string | Uint8Array | ArrayBuffer;

/** SDK v4 content form for delivering tool results as text or image parts. */
type ToolResultContent = Array<
  | {
      type: 'text';
      text: string;
    }
  | {
      type: 'image';
      data: string;
      mimeType?: string;
    }
>;

export type {
  LanguageModelV1 as SwarmModelContract,
  CoreMessage as SwarmMessage,
};
/** Step event exposed by the Swarm wrapper without a dependency on the pinned SDK's type import. */
export type SwarmStepResult = StepResult<ToolSet>;
