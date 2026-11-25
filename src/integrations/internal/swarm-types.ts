// Data from the pinned Swarm dependencies ai@4.1.39 and @ai-sdk/provider@1.0.7.
// The upstream packages use the Apache-2.0 license.
import type { JSONSchema7 } from '@ai-sdk/provider';

type JSONValue = null | string | number | boolean | JSONObject | JSONArray;
type JSONObject = { [key: string]: JSONValue };
type JSONArray = JSONValue[];

type ToolSet = Record<string, unknown>;

type ToolCallArray<_Tools> = Array<{
  type: 'tool-call';
  toolCallId: string;
  toolName: string;
  args: unknown;
}>;

type ToolResultArray<_Tools> = Array<{
  type: 'tool-result';
  toolCallId: string;
  toolName: string;
  args: unknown;
  result: unknown;
}>;

type LanguageModelV1Source = {
  sourceType: 'url';
  id: string;
  url: string;
  title?: string;
  providerMetadata?: LanguageModelV1ProviderMetadata;
};

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

type CoreMessage =
  CoreSystemMessage | CoreUserMessage | CoreAssistantMessage | CoreToolMessage;

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

type LanguageModelV1ObjectGenerationMode = 'json' | 'tool' | undefined;

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

type LanguageModelV1FunctionToolCall = {
  toolCallType: 'function';
  toolCallId: string;
  toolName: string;
  args: string;
};

type LanguageModelV1FinishReason =
  | 'stop'
  | 'length'
  | 'content-filter'
  | 'tool-calls'
  | 'error'
  | 'other'
  | 'unknown';

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

type LanguageModelV1ProviderMetadata = Record<
  string,
  Record<string, JSONValue>
>;

type LanguageModelV1LogProbs = Array<{
  token: string;
  logprob: number;
  topLogprobs: Array<{
    token: string;
    logprob: number;
  }>;
}>;

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

type CoreSystemMessage = {
  role: 'system';
  content: string;
  providerOptions?: ProviderOptions;
  experimental_providerMetadata?: ProviderMetadata;
};

type CoreUserMessage = {
  role: 'user';
  content: UserContent;
  providerOptions?: ProviderOptions;
  experimental_providerMetadata?: ProviderMetadata;
};

type CoreAssistantMessage = {
  role: 'assistant';
  content: AssistantContent;
  providerOptions?: ProviderOptions;
  experimental_providerMetadata?: ProviderMetadata;
};

type CoreToolMessage = {
  role: 'tool';
  content: ToolContent;
  providerOptions?: ProviderOptions;
  experimental_providerMetadata?: ProviderMetadata;
};

type Source = LanguageModelV1Source;

type FinishReason = LanguageModelV1FinishReason;

type LanguageModelUsage = {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
};

type CallWarning = LanguageModelV1CallWarning;

type LogProbs = LanguageModelV1LogProbs;

type LanguageModelRequestMetadata = {
  body?: string;
};

type LanguageModelResponseMetadata = {
  id: string;
  timestamp: Date;
  modelId: string;
  headers?: Record<string, string>;
};

type ResponseMessage = (CoreAssistantMessage | CoreToolMessage) & {
  id: string;
};

type ProviderMetadata = LanguageModelV1ProviderMetadata;

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

type LanguageModelV1FunctionTool = {
  type: 'function';
  name: string;
  description?: string;
  parameters: JSONSchema7;
};

type LanguageModelV1ProviderDefinedTool = {
  type: 'provider-defined';
  id: `${string}.${string}`;
  name: string;
  args: Record<string, unknown>;
};

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

type LanguageModelV1Prompt = Array<LanguageModelV1Message>;

type ProviderOptions = LanguageModelV1ProviderMetadata;

type UserContent = string | Array<TextPart | ImagePart | FilePart>;

type AssistantContent = string | Array<TextPart | ToolCallPart>;

type ToolContent = Array<ToolResultPart>;

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

interface TextPart {
  type: 'text';
  text: string;
  providerOptions?: ProviderOptions;
  experimental_providerMetadata?: ProviderMetadata;
}

interface ImagePart {
  type: 'image';
  image: DataContent | URL;
  mimeType?: string;
  providerOptions?: ProviderOptions;
  experimental_providerMetadata?: ProviderMetadata;
}

interface FilePart {
  type: 'file';
  data: DataContent | URL;
  mimeType: string;
  providerOptions?: ProviderOptions;
  experimental_providerMetadata?: ProviderMetadata;
}

interface ToolCallPart {
  type: 'tool-call';
  toolCallId: string;
  toolName: string;
  args: unknown;
  providerOptions?: ProviderOptions;
  experimental_providerMetadata?: ProviderMetadata;
}

interface ToolResultPart {
  type: 'tool-result';
  toolCallId: string;
  toolName: string;
  result: unknown;
  experimental_content?: ToolResultContent;
  isError?: boolean;
  providerOptions?: ProviderOptions;
  experimental_providerMetadata?: ProviderMetadata;
}

interface LanguageModelV1TextPart {
  type: 'text';
  text: string;
  providerMetadata?: LanguageModelV1ProviderMetadata;
}

interface LanguageModelV1ImagePart {
  type: 'image';
  image: Uint8Array | URL;
  mimeType?: string;
  providerMetadata?: LanguageModelV1ProviderMetadata;
}

interface LanguageModelV1FilePart {
  type: 'file';
  data: string | URL;
  mimeType: string;
  providerMetadata?: LanguageModelV1ProviderMetadata;
}

interface LanguageModelV1ToolCallPart {
  type: 'tool-call';
  toolCallId: string;
  toolName: string;
  args: unknown;
  providerMetadata?: LanguageModelV1ProviderMetadata;
}

interface LanguageModelV1ToolResultPart {
  type: 'tool-result';
  toolCallId: string;
  toolName: string;
  result: unknown;
  isError?: boolean;
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
  providerMetadata?: LanguageModelV1ProviderMetadata;
}

type DataContent = string | Uint8Array | ArrayBuffer;

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
export type SwarmStepResult = StepResult<ToolSet>;
