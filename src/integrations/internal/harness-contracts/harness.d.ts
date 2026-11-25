// Generated from @ai-sdk/harness in @ai-sdk/harness@1.0.193. Do not edit.
// Original license: harness.LICENSE.
// Normalize Zod v4 declarations for the Zod 3.25.76 bridge.
import {
  Experimental_SandboxSession,
  FlexibleSchema,
  FunctionTool,
  ProviderOptions,
  Tool,
  ToolResultPart,
  ToolSet,
  UserModelMessage,
} from '@ai-sdk/provider-utils';
import { z } from 'zod/v4';
import {
  AISDKError,
  JSONSchema7,
  JSONValue,
  LanguageModelV4CustomPart,
  LanguageModelV4FilePart,
  LanguageModelV4FinishReason,
  LanguageModelV4ReasoningFilePart,
  LanguageModelV4ReasoningPart,
  LanguageModelV4StreamPart,
  LanguageModelV4TextPart,
  LanguageModelV4ToolApprovalRequest,
  LanguageModelV4ToolApprovalResponsePart,
  LanguageModelV4ToolCall,
  LanguageModelV4ToolCallPart,
  LanguageModelV4ToolResult,
  LanguageModelV4ToolResultOutput,
  LanguageModelV4ToolResultPart,
  LanguageModelV4Usage,
  SharedV4ProviderMetadata,
} from '@ai-sdk/provider';
interface HarnessV1BootstrapFile {
  readonly path: string;
  readonly content: string;
}
interface HarnessV1BootstrapCommand {
  readonly command: string;
}
interface HarnessV1Bootstrap {
  readonly harnessId: string;
  readonly bootstrapDir: string;
  readonly files: ReadonlyArray<HarnessV1BootstrapFile>;
  readonly commands: ReadonlyArray<HarnessV1BootstrapCommand>;
}
type HarnessV1PortEndpoint = {
  readonly url: string;
  readonly headers?: Readonly<Record<string, string>>;
};
export declare function harnessStateDirectoryPath({
  sandboxHomeDir,
}: {
  sandboxHomeDir: string;
}): string;
interface HarnessV1NetworkSandboxSession extends Experimental_SandboxSession {
  readonly id: string;
  readonly defaultWorkingDirectory: string;
  readonly ports: ReadonlyArray<number>;
  readonly getPortEndpoint: (options: {
    port: number;
    protocol?: 'http' | 'https' | 'ws';
  }) => PromiseLike<HarnessV1PortEndpoint>;
  readonly getPortUrl: (options: {
    port: number;
    protocol?: 'http' | 'https' | 'ws';
  }) => PromiseLike<string>;
  readonly stop: () => PromiseLike<void>;
  readonly destroy: () => PromiseLike<void>;
  readonly setNetworkPolicy?: (
    policy: HarnessV1NetworkPolicy,
  ) => PromiseLike<void>;
  readonly setRequestTransformations?: (
    transformations: ReadonlyArray<HarnessV1RequestTransformation>,
  ) => PromiseLike<void>;
  readonly addRequestTransformations?: (
    transformations: ReadonlyArray<HarnessV1RequestTransformation>,
  ) => PromiseLike<void>;
  readonly setPorts?: (
    ports: ReadonlyArray<number>,
    options?: {
      abortSignal?: AbortSignal;
    },
  ) => PromiseLike<void>;
  readonly restricted: () => Experimental_SandboxSession;
}
type HarnessV1NetworkPolicy =
  | {
      mode: 'allow-all';
    }
  | {
      mode: 'deny-all';
    }
  | {
      mode: 'custom';
      allowedHosts: ReadonlyArray<string>;
      allowedCIDRs?: ReadonlyArray<string>;
      deniedCIDRs?: ReadonlyArray<string>;
    }
  | {
      mode: 'custom';
      allowedHosts?: ReadonlyArray<string>;
      allowedCIDRs: ReadonlyArray<string>;
      deniedCIDRs?: ReadonlyArray<string>;
    };
type HarnessV1RequestTransformationPathMatcher =
  | {
      exact: string;
    }
  | {
      startsWith: string;
    }
  | {
      regex: string;
    };
type HarnessV1RequestTransformationKeyValuePartMatcher =
  | {
      exact: string;
    }
  | {
      startsWith: string;
    }
  | {
      regex: string;
    };
type HarnessV1RequestTransformationKeyValueMatcher = {
  readonly key?: HarnessV1RequestTransformationKeyValuePartMatcher;
  readonly value?: HarnessV1RequestTransformationKeyValuePartMatcher;
};
type HarnessV1RequestTransformation = {
  readonly match: {
    readonly host: string;
    readonly path?: HarnessV1RequestTransformationPathMatcher;
    readonly method?: ReadonlyArray<string>;
    readonly queryString?: ReadonlyArray<HarnessV1RequestTransformationKeyValueMatcher>;
    readonly headers?: ReadonlyArray<HarnessV1RequestTransformationKeyValueMatcher>;
  };
  readonly transform: {
    readonly headers: Readonly<Record<string, string>>;
  };
};
type HarnessV1RequestTransformationSources<AuthenticationMode> = {
  env: Record<string, string>;
  sandboxEnv: Record<string, string>;
  auth: AuthenticationMode;
};
export declare const harnessV1DebugLevelSchema: z.ZodEnum<{
  error: 'error';
  warn: 'warn';
  info: 'info';
  debug: 'debug';
  trace: 'trace';
}>;
type HarnessV1DebugLevel = z.infer<typeof harnessV1DebugLevelSchema>;
export declare const harnessV1DebugConfigSchema: z.ZodObject<
  {
    enabled: z.ZodOptional<z.ZodBoolean>;
    level: z.ZodOptional<
      z.ZodEnum<{
        error: 'error';
        warn: 'warn';
        info: 'info';
        debug: 'debug';
        trace: 'trace';
      }>
    >;
    subsystems: z.ZodOptional<z.ZodArray<z.ZodString>>;
  },
  z.core.$strip
>;
type HarnessV1DebugConfig = z.infer<typeof harnessV1DebugConfigSchema>;
type HarnessV1Diagnostic = {
  readonly level: HarnessV1DebugLevel;
  readonly message: string;
  readonly subsystem: string;
  readonly kind: 'log' | 'event';
  readonly source?: string;
  readonly stream?: 'stdout' | 'stderr';
  readonly attrs?: Record<string, unknown>;
  readonly error?: {
    name?: string;
    message: string;
    stack?: string;
  };
  readonly sessionId?: string;
  readonly timestamp: number;
};
type HarnessV1Observability = {
  readonly debug?: HarnessV1DebugConfig;
  readonly report?: (diagnostic: HarnessV1Diagnostic) => void;
};
type HarnessV1PermissionMode = 'allow-reads' | 'allow-edits' | 'allow-all';
type HarnessV1Prompt = string | UserModelMessage;
type HarnessV1PromptControl = {
  submitToolResult(input: {
    toolCallId: string;
    output: unknown;
    isError?: boolean;
    toolResult?: ToolResultPart;
  }): PromiseLike<void>;
  submitToolApproval?(input: {
    approvalId: string;
    approved: boolean;
    reason?: string;
  }): PromiseLike<void>;
  submitUserMessage?(text: string): PromiseLike<void>;
  readonly done: PromiseLike<void>;
};
type HarnessV1JSONValue =
  null | boolean | number | string | HarnessV1JSONArray | HarnessV1JSONObject;
interface HarnessV1JSONArray extends Array<HarnessV1JSONValue> {}
interface HarnessV1JSONObject {
  [key: string]: HarnessV1JSONValue | undefined;
}
type HarnessV1JSONSchema = HarnessV1JSONObject;
type HarnessV1ResponseFormat =
  | {
      readonly type: 'text';
    }
  | {
      readonly type: 'json';
      readonly schema?: HarnessV1JSONSchema;
      readonly name?: string;
      readonly description?: string;
    };
type HarnessV1Skill = {
  readonly name: string;
  readonly description: string;
  readonly content: string;
  readonly files?: ReadonlyArray<HarnessV1SkillFile>;
};
type HarnessV1SkillFile = {
  readonly path: string;
  readonly content: string;
};
type HarnessV1ToolSpec = {
  readonly name: string;
  readonly description?: string;
  readonly inputSchema?: JSONSchema7;
};
type HarnessV1PendingToolApproval = {
  readonly approvalId: string;
  readonly toolCallId: string;
  readonly toolName: string;
  readonly input: string;
  readonly kind: 'builtin' | 'custom';
  readonly providerExecuted?: boolean;
  readonly nativeName?: string;
};
type HarnessV1PendingToolResult = {
  readonly toolCallId: string;
  readonly toolName: string;
  readonly input: string;
  readonly providerOptions?: ProviderOptions;
  readonly completedResult?: {
    readonly output: unknown;
    readonly isError?: boolean;
    readonly toolResult?: ToolResultPart;
  };
};
type HarnessV1TurnSettings = {
  readonly model?: string;
  readonly skills: ReadonlyArray<HarnessV1Skill>;
  readonly instructions?: string;
  readonly tools: ReadonlyArray<HarnessV1ToolSpec>;
};
type HarnessV1LifecycleStateBase = {
  readonly harnessId: string;
  readonly specificationVersion: 'harness-v1';
  readonly data: JSONValue;
};
type HarnessV1ResumeSessionState = HarnessV1LifecycleStateBase & {
  readonly type: 'resume-session';
  readonly continueFrom?: HarnessV1ContinueTurnState;
};
type HarnessV1ContinueTurnState = HarnessV1LifecycleStateBase & {
  readonly type: 'continue-turn';
  readonly pendingToolApprovals?: readonly HarnessV1PendingToolApproval[];
  readonly pendingToolResults?: readonly HarnessV1PendingToolResult[];
  readonly turnSettings?: HarnessV1TurnSettings;
};
type HarnessV1LifecycleState =
  HarnessV1ResumeSessionState | HarnessV1ContinueTurnState;
type HarnessV1CallWarning =
  | {
      type: 'unsupported-setting';
      setting: string;
      details?: string;
    }
  | {
      type: 'unsupported-tool';
      tool: string;
      details?: string;
    }
  | {
      type: 'other';
      message: string;
    };
declare module 'ai' {
  interface CallWarningRegistry {
    harnessV1: HarnessV1CallWarning;
  }
}
type HarnessV1Metadata = Record<string, Record<string, JSONValue>>;
type HarnessV1StreamPart =
  | {
      type: 'stream-start';
      warnings?: ReadonlyArray<HarnessV1CallWarning>;
      modelId?: string;
    }
  | {
      type: 'text-start';
      id: string;
      harnessMetadata?: HarnessV1Metadata;
    }
  | {
      type: 'text-delta';
      id: string;
      delta: string;
      harnessMetadata?: HarnessV1Metadata;
    }
  | {
      type: 'text-end';
      id: string;
      harnessMetadata?: HarnessV1Metadata;
    }
  | {
      type: 'reasoning-start';
      id: string;
      harnessMetadata?: HarnessV1Metadata;
    }
  | {
      type: 'reasoning-delta';
      id: string;
      delta: string;
      harnessMetadata?: HarnessV1Metadata;
    }
  | {
      type: 'reasoning-end';
      id: string;
      harnessMetadata?: HarnessV1Metadata;
    }
  | Extract<
      LanguageModelV4StreamPart,
      {
        type: 'tool-input-start';
      }
    >
  | Extract<
      LanguageModelV4StreamPart,
      {
        type: 'tool-input-delta';
      }
    >
  | Extract<
      LanguageModelV4StreamPart,
      {
        type: 'tool-input-end';
      }
    >
  | (LanguageModelV4ToolCall & {
      nativeName?: string;
    })
  | LanguageModelV4ToolApprovalRequest
  | LanguageModelV4ToolResult
  | {
      type: 'finish-step';
      finishReason: LanguageModelV4FinishReason;
      usage: LanguageModelV4Usage;
      harnessMetadata?: HarnessV1Metadata;
    }
  | {
      type: 'finish';
      finishReason: LanguageModelV4FinishReason;
      totalUsage: LanguageModelV4Usage;
      harnessMetadata?: HarnessV1Metadata;
    }
  | {
      type: 'file-change';
      event: 'create' | 'modify' | 'delete';
      path: string;
      harnessMetadata?: HarnessV1Metadata;
    }
  | {
      type: 'compaction';
      trigger: 'manual' | 'auto';
      summary: string;
      tokensBefore?: number;
      tokensAfter?: number;
      harnessMetadata?: HarnessV1Metadata;
    }
  | {
      type: 'error';
      error: unknown;
    }
  | {
      type: 'raw';
      rawValue: unknown;
    };
export declare const harnessV1StreamStartPartSchema: z.ZodObject<
  {
    type: z.ZodLiteral<'stream-start'>;
    warnings: z.ZodOptional<
      z.ZodReadonly<
        z.ZodArray<
          z.ZodType<
            HarnessV1CallWarning,
            unknown,
            z.core.$ZodTypeInternals<HarnessV1CallWarning, unknown>
          >
        >
      >
    >;
    modelId: z.ZodOptional<z.ZodString>;
  },
  z.core.$strip
>;
export declare const harnessV1TextStartPartSchema: z.ZodObject<
  {
    type: z.ZodLiteral<'text-start'>;
    id: z.ZodString;
    harnessMetadata: z.ZodOptional<
      z.ZodType<
        HarnessV1Metadata,
        unknown,
        z.core.$ZodTypeInternals<HarnessV1Metadata, unknown>
      >
    >;
  },
  z.core.$strip
>;
export declare const harnessV1TextDeltaPartSchema: z.ZodObject<
  {
    type: z.ZodLiteral<'text-delta'>;
    id: z.ZodString;
    delta: z.ZodString;
    harnessMetadata: z.ZodOptional<
      z.ZodType<
        HarnessV1Metadata,
        unknown,
        z.core.$ZodTypeInternals<HarnessV1Metadata, unknown>
      >
    >;
  },
  z.core.$strip
>;
export declare const harnessV1TextEndPartSchema: z.ZodObject<
  {
    type: z.ZodLiteral<'text-end'>;
    id: z.ZodString;
    harnessMetadata: z.ZodOptional<
      z.ZodType<
        HarnessV1Metadata,
        unknown,
        z.core.$ZodTypeInternals<HarnessV1Metadata, unknown>
      >
    >;
  },
  z.core.$strip
>;
export declare const harnessV1ReasoningStartPartSchema: z.ZodObject<
  {
    type: z.ZodLiteral<'reasoning-start'>;
    id: z.ZodString;
    harnessMetadata: z.ZodOptional<
      z.ZodType<
        HarnessV1Metadata,
        unknown,
        z.core.$ZodTypeInternals<HarnessV1Metadata, unknown>
      >
    >;
  },
  z.core.$strip
>;
export declare const harnessV1ReasoningDeltaPartSchema: z.ZodObject<
  {
    type: z.ZodLiteral<'reasoning-delta'>;
    id: z.ZodString;
    delta: z.ZodString;
    harnessMetadata: z.ZodOptional<
      z.ZodType<
        HarnessV1Metadata,
        unknown,
        z.core.$ZodTypeInternals<HarnessV1Metadata, unknown>
      >
    >;
  },
  z.core.$strip
>;
export declare const harnessV1ReasoningEndPartSchema: z.ZodObject<
  {
    type: z.ZodLiteral<'reasoning-end'>;
    id: z.ZodString;
    harnessMetadata: z.ZodOptional<
      z.ZodType<
        HarnessV1Metadata,
        unknown,
        z.core.$ZodTypeInternals<HarnessV1Metadata, unknown>
      >
    >;
  },
  z.core.$strip
>;
export declare const harnessV1ToolCallPartSchema: z.ZodObject<
  {
    type: z.ZodLiteral<'tool-call'>;
    toolCallId: z.ZodString;
    toolName: z.ZodString;
    input: z.ZodString;
    providerExecuted: z.ZodOptional<z.ZodBoolean>;
    dynamic: z.ZodOptional<z.ZodBoolean>;
    providerMetadata: z.ZodOptional<
      z.ZodType<
        SharedV4ProviderMetadata,
        unknown,
        z.core.$ZodTypeInternals<SharedV4ProviderMetadata, unknown>
      >
    >;
    nativeName: z.ZodOptional<z.ZodString>;
  },
  z.core.$strip
>;
export declare const harnessV1ToolApprovalRequestPartSchema: z.ZodObject<
  {
    type: z.ZodLiteral<'tool-approval-request'>;
    approvalId: z.ZodString;
    toolCallId: z.ZodString;
    providerMetadata: z.ZodOptional<
      z.ZodType<
        SharedV4ProviderMetadata,
        unknown,
        z.core.$ZodTypeInternals<SharedV4ProviderMetadata, unknown>
      >
    >;
  },
  z.core.$strip
>;
export declare const harnessV1ToolResultPartSchema: z.ZodObject<
  {
    type: z.ZodLiteral<'tool-result'>;
    toolCallId: z.ZodString;
    toolName: z.ZodString;
    result: z.ZodType<
      NonNullable<JSONValue>,
      unknown,
      z.core.$ZodTypeInternals<NonNullable<JSONValue>, unknown>
    >;
    isError: z.ZodOptional<z.ZodBoolean>;
    preliminary: z.ZodOptional<z.ZodBoolean>;
    dynamic: z.ZodOptional<z.ZodBoolean>;
    providerMetadata: z.ZodOptional<
      z.ZodType<
        SharedV4ProviderMetadata,
        unknown,
        z.core.$ZodTypeInternals<SharedV4ProviderMetadata, unknown>
      >
    >;
  },
  z.core.$strip
>;
export declare const harnessV1FinishStepPartSchema: z.ZodObject<
  {
    type: z.ZodLiteral<'finish-step'>;
    finishReason: z.ZodType<
      LanguageModelV4FinishReason,
      unknown,
      z.core.$ZodTypeInternals<LanguageModelV4FinishReason, unknown>
    >;
    usage: z.ZodType<
      LanguageModelV4Usage,
      unknown,
      z.core.$ZodTypeInternals<LanguageModelV4Usage, unknown>
    >;
    harnessMetadata: z.ZodOptional<
      z.ZodType<
        HarnessV1Metadata,
        unknown,
        z.core.$ZodTypeInternals<HarnessV1Metadata, unknown>
      >
    >;
  },
  z.core.$strip
>;
export declare const harnessV1FinishPartSchema: z.ZodObject<
  {
    type: z.ZodLiteral<'finish'>;
    finishReason: z.ZodType<
      LanguageModelV4FinishReason,
      unknown,
      z.core.$ZodTypeInternals<LanguageModelV4FinishReason, unknown>
    >;
    totalUsage: z.ZodType<
      LanguageModelV4Usage,
      unknown,
      z.core.$ZodTypeInternals<LanguageModelV4Usage, unknown>
    >;
    harnessMetadata: z.ZodOptional<
      z.ZodType<
        HarnessV1Metadata,
        unknown,
        z.core.$ZodTypeInternals<HarnessV1Metadata, unknown>
      >
    >;
  },
  z.core.$strip
>;
export declare const harnessV1FileChangePartSchema: z.ZodObject<
  {
    type: z.ZodLiteral<'file-change'>;
    event: z.ZodEnum<{
      create: 'create';
      modify: 'modify';
      delete: 'delete';
    }>;
    path: z.ZodString;
    harnessMetadata: z.ZodOptional<
      z.ZodType<
        HarnessV1Metadata,
        unknown,
        z.core.$ZodTypeInternals<HarnessV1Metadata, unknown>
      >
    >;
  },
  z.core.$strip
>;
export declare const harnessV1ErrorPartSchema: z.ZodObject<
  {
    type: z.ZodLiteral<'error'>;
    error: z.ZodUnknown;
  },
  z.core.$strip
>;
export declare const harnessV1RawPartSchema: z.ZodObject<
  {
    type: z.ZodLiteral<'raw'>;
    rawValue: z.ZodUnknown;
  },
  z.core.$strip
>;
export declare const harnessV1StreamPartSchema: z.ZodDiscriminatedUnion<
  [
    z.ZodObject<
      {
        type: z.ZodLiteral<'stream-start'>;
        warnings: z.ZodOptional<
          z.ZodReadonly<
            z.ZodArray<
              z.ZodType<
                HarnessV1CallWarning,
                unknown,
                z.core.$ZodTypeInternals<HarnessV1CallWarning, unknown>
              >
            >
          >
        >;
        modelId: z.ZodOptional<z.ZodString>;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'text-start'>;
        id: z.ZodString;
        harnessMetadata: z.ZodOptional<
          z.ZodType<
            HarnessV1Metadata,
            unknown,
            z.core.$ZodTypeInternals<HarnessV1Metadata, unknown>
          >
        >;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'text-delta'>;
        id: z.ZodString;
        delta: z.ZodString;
        harnessMetadata: z.ZodOptional<
          z.ZodType<
            HarnessV1Metadata,
            unknown,
            z.core.$ZodTypeInternals<HarnessV1Metadata, unknown>
          >
        >;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'text-end'>;
        id: z.ZodString;
        harnessMetadata: z.ZodOptional<
          z.ZodType<
            HarnessV1Metadata,
            unknown,
            z.core.$ZodTypeInternals<HarnessV1Metadata, unknown>
          >
        >;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'reasoning-start'>;
        id: z.ZodString;
        harnessMetadata: z.ZodOptional<
          z.ZodType<
            HarnessV1Metadata,
            unknown,
            z.core.$ZodTypeInternals<HarnessV1Metadata, unknown>
          >
        >;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'reasoning-delta'>;
        id: z.ZodString;
        delta: z.ZodString;
        harnessMetadata: z.ZodOptional<
          z.ZodType<
            HarnessV1Metadata,
            unknown,
            z.core.$ZodTypeInternals<HarnessV1Metadata, unknown>
          >
        >;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'reasoning-end'>;
        id: z.ZodString;
        harnessMetadata: z.ZodOptional<
          z.ZodType<
            HarnessV1Metadata,
            unknown,
            z.core.$ZodTypeInternals<HarnessV1Metadata, unknown>
          >
        >;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'tool-input-start'>;
        id: z.ZodString;
        toolName: z.ZodString;
        providerMetadata: z.ZodOptional<
          z.ZodType<
            SharedV4ProviderMetadata,
            unknown,
            z.core.$ZodTypeInternals<SharedV4ProviderMetadata, unknown>
          >
        >;
        providerExecuted: z.ZodOptional<z.ZodBoolean>;
        dynamic: z.ZodOptional<z.ZodBoolean>;
        title: z.ZodOptional<z.ZodString>;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'tool-input-delta'>;
        id: z.ZodString;
        delta: z.ZodString;
        providerMetadata: z.ZodOptional<
          z.ZodType<
            SharedV4ProviderMetadata,
            unknown,
            z.core.$ZodTypeInternals<SharedV4ProviderMetadata, unknown>
          >
        >;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'tool-input-end'>;
        id: z.ZodString;
        providerMetadata: z.ZodOptional<
          z.ZodType<
            SharedV4ProviderMetadata,
            unknown,
            z.core.$ZodTypeInternals<SharedV4ProviderMetadata, unknown>
          >
        >;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'tool-call'>;
        toolCallId: z.ZodString;
        toolName: z.ZodString;
        input: z.ZodString;
        providerExecuted: z.ZodOptional<z.ZodBoolean>;
        dynamic: z.ZodOptional<z.ZodBoolean>;
        providerMetadata: z.ZodOptional<
          z.ZodType<
            SharedV4ProviderMetadata,
            unknown,
            z.core.$ZodTypeInternals<SharedV4ProviderMetadata, unknown>
          >
        >;
        nativeName: z.ZodOptional<z.ZodString>;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'tool-approval-request'>;
        approvalId: z.ZodString;
        toolCallId: z.ZodString;
        providerMetadata: z.ZodOptional<
          z.ZodType<
            SharedV4ProviderMetadata,
            unknown,
            z.core.$ZodTypeInternals<SharedV4ProviderMetadata, unknown>
          >
        >;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'tool-result'>;
        toolCallId: z.ZodString;
        toolName: z.ZodString;
        result: z.ZodType<
          NonNullable<JSONValue>,
          unknown,
          z.core.$ZodTypeInternals<NonNullable<JSONValue>, unknown>
        >;
        isError: z.ZodOptional<z.ZodBoolean>;
        preliminary: z.ZodOptional<z.ZodBoolean>;
        dynamic: z.ZodOptional<z.ZodBoolean>;
        providerMetadata: z.ZodOptional<
          z.ZodType<
            SharedV4ProviderMetadata,
            unknown,
            z.core.$ZodTypeInternals<SharedV4ProviderMetadata, unknown>
          >
        >;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'finish-step'>;
        finishReason: z.ZodType<
          LanguageModelV4FinishReason,
          unknown,
          z.core.$ZodTypeInternals<LanguageModelV4FinishReason, unknown>
        >;
        usage: z.ZodType<
          LanguageModelV4Usage,
          unknown,
          z.core.$ZodTypeInternals<LanguageModelV4Usage, unknown>
        >;
        harnessMetadata: z.ZodOptional<
          z.ZodType<
            HarnessV1Metadata,
            unknown,
            z.core.$ZodTypeInternals<HarnessV1Metadata, unknown>
          >
        >;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'finish'>;
        finishReason: z.ZodType<
          LanguageModelV4FinishReason,
          unknown,
          z.core.$ZodTypeInternals<LanguageModelV4FinishReason, unknown>
        >;
        totalUsage: z.ZodType<
          LanguageModelV4Usage,
          unknown,
          z.core.$ZodTypeInternals<LanguageModelV4Usage, unknown>
        >;
        harnessMetadata: z.ZodOptional<
          z.ZodType<
            HarnessV1Metadata,
            unknown,
            z.core.$ZodTypeInternals<HarnessV1Metadata, unknown>
          >
        >;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'file-change'>;
        event: z.ZodEnum<{
          create: 'create';
          modify: 'modify';
          delete: 'delete';
        }>;
        path: z.ZodString;
        harnessMetadata: z.ZodOptional<
          z.ZodType<
            HarnessV1Metadata,
            unknown,
            z.core.$ZodTypeInternals<HarnessV1Metadata, unknown>
          >
        >;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'compaction'>;
        trigger: z.ZodEnum<{
          manual: 'manual';
          auto: 'auto';
        }>;
        summary: z.ZodString;
        tokensBefore: z.ZodOptional<z.ZodNumber>;
        tokensAfter: z.ZodOptional<z.ZodNumber>;
        harnessMetadata: z.ZodOptional<
          z.ZodType<
            HarnessV1Metadata,
            unknown,
            z.core.$ZodTypeInternals<HarnessV1Metadata, unknown>
          >
        >;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'error'>;
        error: z.ZodUnknown;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'raw'>;
        rawValue: z.ZodUnknown;
      },
      z.core.$strip
    >,
  ]
> & {
  def: {
    discriminator: 'type';
  };
  _zod: {
    def: {
      discriminator: 'type';
    };
  };
};
type LanguageModelV4ToolResultContentPart = Extract<
  LanguageModelV4ToolResultOutput,
  {
    type: 'content';
  }
>['value'][number];
type HarnessV1TextPart = Omit<LanguageModelV4TextPart, 'providerOptions'>;
type HarnessV1FilePart = Omit<LanguageModelV4FilePart, 'providerOptions'>;
type HarnessV1CustomPart = Omit<LanguageModelV4CustomPart, 'providerOptions'>;
type HarnessV1ReasoningPart = Omit<
  LanguageModelV4ReasoningPart,
  'providerOptions'
>;
type HarnessV1ReasoningFilePart = Omit<
  LanguageModelV4ReasoningFilePart,
  'providerOptions'
>;
type HarnessV1ToolCallPart = Omit<
  LanguageModelV4ToolCallPart,
  'providerOptions'
> & {
  nativeName?: string;
};
type HarnessV1ToolResultOutput =
  | Omit<
      Extract<
        LanguageModelV4ToolResultOutput,
        {
          type: 'text';
        }
      >,
      'providerOptions'
    >
  | Omit<
      Extract<
        LanguageModelV4ToolResultOutput,
        {
          type: 'json';
        }
      >,
      'providerOptions'
    >
  | Omit<
      Extract<
        LanguageModelV4ToolResultOutput,
        {
          type: 'execution-denied';
        }
      >,
      'providerOptions'
    >
  | Omit<
      Extract<
        LanguageModelV4ToolResultOutput,
        {
          type: 'error-text';
        }
      >,
      'providerOptions'
    >
  | Omit<
      Extract<
        LanguageModelV4ToolResultOutput,
        {
          type: 'error-json';
        }
      >,
      'providerOptions'
    >
  | {
      type: 'content';
      value: Array<
        | Omit<
            Extract<
              LanguageModelV4ToolResultContentPart,
              {
                type: 'text';
              }
            >,
            'providerOptions'
          >
        | Omit<
            Extract<
              LanguageModelV4ToolResultContentPart,
              {
                type: 'file';
              }
            >,
            'providerOptions'
          >
        | Omit<
            Extract<
              LanguageModelV4ToolResultContentPart,
              {
                type: 'custom';
              }
            >,
            'providerOptions'
          >
      >;
    };
type HarnessV1ToolResultPart = Omit<
  LanguageModelV4ToolResultPart,
  'output' | 'providerOptions'
> & {
  output: HarnessV1ToolResultOutput;
};
type HarnessV1ToolApprovalResponsePart = Omit<
  LanguageModelV4ToolApprovalResponsePart,
  'providerOptions'
>;
type HarnessV1MessagePart =
  | HarnessV1TextPart
  | HarnessV1FilePart
  | HarnessV1CustomPart
  | HarnessV1ReasoningPart
  | HarnessV1ReasoningFilePart
  | HarnessV1ToolCallPart
  | HarnessV1ToolResultPart
  | HarnessV1ToolApprovalResponsePart;
type HarnessV1UserMessage = {
  readonly role: 'user';
  readonly content: Array<HarnessV1TextPart | HarnessV1FilePart>;
  readonly at?: string;
  readonly harnessMetadata?: HarnessV1Metadata;
};
type HarnessV1AssistantMessage = {
  readonly role: 'assistant';
  readonly content: Array<
    | HarnessV1TextPart
    | HarnessV1FilePart
    | HarnessV1CustomPart
    | HarnessV1ReasoningPart
    | HarnessV1ReasoningFilePart
    | HarnessV1ToolCallPart
    | HarnessV1ToolResultPart
  >;
  readonly at?: string;
  readonly harnessMetadata?: HarnessV1Metadata;
};
type HarnessV1ToolMessage = {
  readonly role: 'tool';
  readonly content: Array<
    HarnessV1ToolResultPart | HarnessV1ToolApprovalResponsePart
  >;
  readonly at?: string;
  readonly harnessMetadata?: HarnessV1Metadata;
};
type HarnessV1Message =
  HarnessV1UserMessage | HarnessV1AssistantMessage | HarnessV1ToolMessage;
type HarnessV1BuiltinToolFiltering =
  | {
      mode: 'allow';
      toolNames: string[];
    }
  | {
      mode: 'deny';
      toolNames: string[];
    };
export declare function isHarnessV1BuiltinToolIncluded(input: {
  toolName: string;
  toolFiltering: HarnessV1BuiltinToolFiltering | undefined;
}): boolean;
export declare function getHarnessV1BuiltinToolFilteringDenialReason(input: {
  toolName: string;
}): string;
type HarnessV1StartOptions = {
  readonly headers?: Readonly<Record<string, string>>;
  readonly sessionId: string;
  readonly resumeFrom?: HarnessV1ResumeSessionState;
  readonly continueFrom?: HarnessV1ContinueTurnState;
  readonly permissionMode?: HarnessV1PermissionMode;
  readonly builtinToolFiltering?: HarnessV1BuiltinToolFiltering;
  readonly abortSignal?: AbortSignal;
  readonly observability?: HarnessV1Observability;
  readonly sandboxSession:
    HarnessV1NetworkSandboxSession | Experimental_SandboxSession;
  readonly sessionWorkDir: string;
};
type HarnessV1ReadHistoryResult = {
  readonly messages: ReadonlyArray<HarnessV1Message>;
  readonly cursor: string;
};
type HarnessV1PromptTurnOptions = HarnessV1TurnSettings & {
  readonly prompt: HarnessV1Prompt;
  readonly responseFormat?: HarnessV1ResponseFormat;
  readonly abortSignal?: AbortSignal;
  readonly emit: (event: HarnessV1StreamPart) => void;
};
type HarnessV1ContinueTurnOptions = HarnessV1TurnSettings & {
  readonly responseFormat?: HarnessV1ResponseFormat;
  readonly abortSignal?: AbortSignal;
  readonly emit: (event: HarnessV1StreamPart) => void;
};
type HarnessV1Session = {
  readonly sessionId: string;
  readonly isResume: boolean;
  doPromptTurn(
    options: HarnessV1PromptTurnOptions,
  ): PromiseLike<HarnessV1PromptControl>;
  doCompact(customInstructions?: string): PromiseLike<void>;
  doReadHistory?(options: {
    readonly since?: string;
  }): PromiseLike<HarnessV1ReadHistoryResult>;
  doContinueTurn(
    options: HarnessV1ContinueTurnOptions,
  ): PromiseLike<HarnessV1PromptControl>;
  doSuspendTurn(): PromiseLike<HarnessV1ContinueTurnState>;
  doDetach(): PromiseLike<HarnessV1ResumeSessionState>;
  doStop(): PromiseLike<HarnessV1ResumeSessionState>;
  doDestroy(): PromiseLike<void>;
};
type HarnessV1<TBuiltinTools extends ToolSet = ToolSet> = {
  readonly specificationVersion: 'harness-v1';
  readonly harnessId: string;
  readonly builtinTools: TBuiltinTools;
  readonly supportsBuiltinToolApprovals?: boolean;
  readonly supportsBuiltinToolFiltering?: boolean;
  readonly lifecycleStateSchema?: FlexibleSchema<unknown>;
  readonly getBootstrap?: (options?: {
    abortSignal?: AbortSignal;
  }) => PromiseLike<HarnessV1Bootstrap>;
  doStart(options: HarnessV1StartOptions): PromiseLike<HarnessV1Session>;
};
type HarnessV1AuthenticationEnvironment = Readonly<Record<string, string>>;
type HarnessV1Authentication<ADAPTER_CHOICES extends string = 'direct'> = [
  ADAPTER_CHOICES,
] extends [never]
  ? never
  : string extends ADAPTER_CHOICES
    ? never
    : | 'auto'
      | 'ai-gateway'
      | ADAPTER_CHOICES
      | HarnessV1AuthenticationEnvironment;
type HarnessV1CredentialForwarding = (options: {
  readonly credential: string;
  readonly environmentVariableName: string;
}) => string | PromiseLike<string>;
type HarnessV1MintBridgeTokenCallback =
  import('../../harness.js').HarnessV1MintBridgeTokenCallback;
export declare const HARNESS_V1_BUILTIN_TOOLS: {
  readonly read: Tool<
    {
      file_path: string;
    },
    unknown,
    import('@ai-sdk/provider-utils').Context
  >;
  readonly write: Tool<
    {
      file_path: string;
      content: string;
    },
    unknown,
    import('@ai-sdk/provider-utils').Context
  >;
  readonly edit: Tool<
    {
      file_path: string;
      old_string: string;
      new_string: string;
    },
    unknown,
    import('@ai-sdk/provider-utils').Context
  >;
  readonly bash: Tool<
    {
      command: string;
    },
    unknown,
    import('@ai-sdk/provider-utils').Context
  >;
  readonly grep: Tool<
    {
      pattern: string;
    },
    unknown,
    import('@ai-sdk/provider-utils').Context
  >;
  readonly glob: Tool<
    {
      pattern: string;
    },
    unknown,
    import('@ai-sdk/provider-utils').Context
  >;
  readonly webSearch: Tool<
    {
      query: string;
    },
    unknown,
    import('@ai-sdk/provider-utils').Context
  >;
  readonly askUserQuestions: import('@ai-sdk/provider-utils').FunctionTool<
    {
      allowPartialAnswers: boolean;
      questions: {
        id: string;
        question: string;
        header?: string | undefined;
        options?:
          | {
              id: string;
              label: string;
              description?: string | undefined;
              preview?: string | undefined;
            }[]
          | undefined;
        allowMultiple?: boolean | undefined;
        allowFreeForm?:
          | boolean
          | {
              secret: boolean;
            }
          | undefined;
      }[];
    },
    | {
        action: 'answered';
        answers: Record<
          string,
          {
            optionIds: string[];
            freeform?: string | undefined;
          }
        >;
      }
    | {
        action: 'partially-answered';
        answers: Record<
          string,
          {
            optionIds: string[];
            freeform?: string | undefined;
          }
        >;
      }
    | {
        action: 'declined';
      }
    | {
        action: 'cancelled';
      }
  >;
};
type HarnessV1BuiltinToolName = keyof typeof HARNESS_V1_BUILTIN_TOOLS;
export declare const HARNESS_V1_BUILTIN_TOOL_NAMES: ReadonlyArray<HarnessV1BuiltinToolName>;
type HarnessV1BuiltinToolUseKind = 'readonly' | 'edit' | 'bash';
type HarnessV1BuiltinTool<INPUT = unknown, OUTPUT = unknown> = Tool<
  INPUT,
  OUTPUT,
  any
> & {
  readonly nativeName?: string;
  readonly commonName?: HarnessV1BuiltinToolName;
  readonly toolUseKind?: HarnessV1BuiltinToolUseKind;
};
type InputOf<T> = T extends Tool<infer I, any, any> ? I : never;
type StandardInputOf<N extends HarnessV1BuiltinToolName> = InputOf<
  (typeof HARNESS_V1_BUILTIN_TOOLS)[N]
>;
type SupersetCheck<TStandard, TAdapter, TOk> = TStandard extends TAdapter
  ? TOk
  : [
      'ERROR: adapter input schema must be a superset of the standard schema',
      {
        expected: TStandard;
        got: TAdapter;
      },
    ];
export declare function commonTool<
  TName extends HarnessV1BuiltinToolName,
  TInput,
>(
  commonName: TName,
  opts: {
    readonly nativeName: string;
    readonly toolUseKind?: HarnessV1BuiltinToolUseKind;
    readonly description?: string;
    readonly inputSchema: FlexibleSchema<TInput>;
  },
): SupersetCheck<StandardInputOf<TName>, TInput, HarnessV1BuiltinTool<TInput>>;
export declare const harnessV1QuestionsToolInputSchema: z.ZodObject<
  {
    allowPartialAnswers: z.ZodBoolean;
    questions: z.ZodArray<
      z.ZodObject<
        {
          id: z.ZodString;
          question: z.ZodString;
          header: z.ZodOptional<z.ZodString>;
          options: z.ZodOptional<
            z.ZodArray<
              z.ZodObject<
                {
                  id: z.ZodString;
                  label: z.ZodString;
                  description: z.ZodOptional<z.ZodString>;
                  preview: z.ZodOptional<z.ZodString>;
                },
                z.core.$strip
              >
            >
          >;
          allowMultiple: z.ZodOptional<z.ZodBoolean>;
          allowFreeForm: z.ZodOptional<
            z.ZodUnion<
              readonly [
                z.ZodBoolean,
                z.ZodObject<
                  {
                    secret: z.ZodBoolean;
                  },
                  z.core.$strip
                >,
              ]
            >
          >;
        },
        z.core.$strip
      >
    >;
  },
  z.core.$strip
>;
export declare const harnessV1QuestionsToolOutputSchema: z.ZodDiscriminatedUnion<
  [
    z.ZodObject<
      {
        action: z.ZodLiteral<'answered'>;
        answers: z.ZodRecord<
          z.ZodString,
          z.ZodObject<
            {
              optionIds: z.ZodArray<z.ZodString>;
              freeform: z.ZodOptional<z.ZodString>;
            },
            z.core.$strip
          >
        >;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        action: z.ZodLiteral<'partially-answered'>;
        answers: z.ZodRecord<
          z.ZodString,
          z.ZodObject<
            {
              optionIds: z.ZodArray<z.ZodString>;
              freeform: z.ZodOptional<z.ZodString>;
            },
            z.core.$strip
          >
        >;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        action: z.ZodLiteral<'declined'>;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        action: z.ZodLiteral<'cancelled'>;
      },
      z.core.$strip
    >,
  ]
> & {
  def: {
    discriminator: 'action';
  };
  _zod: {
    def: {
      discriminator: 'action';
    };
  };
};
type HarnessV1QuestionsToolInput = z.infer<
  typeof harnessV1QuestionsToolInputSchema
>;
type HarnessV1QuestionsToolOutput = z.infer<
  typeof harnessV1QuestionsToolOutputSchema
>;
declare const harnessV1QuestionsTool: FunctionTool<
  HarnessV1QuestionsToolInput,
  HarnessV1QuestionsToolOutput
>;
type HarnessV1QuestionsTool = typeof harnessV1QuestionsTool;
interface HarnessV1SandboxProvider {
  readonly specificationVersion: 'harness-sandbox-v1';
  readonly providerId: string;
  readonly createSession: (options?: {
    sessionId?: string;
    abortSignal?: AbortSignal;
    identity?: string;
    onFirstCreate?: (
      session: Experimental_SandboxSession,
      opts: {
        abortSignal?: AbortSignal;
      },
    ) => Promise<void>;
  }) => PromiseLike<HarnessV1NetworkSandboxSession>;
  readonly resumeSession?: (options: {
    sessionId: string;
    abortSignal?: AbortSignal;
  }) => PromiseLike<HarnessV1NetworkSandboxSession>;
}
type HarnessV1SandboxTemplate = {
  readonly identity: string;
  readonly prepare: (options: {
    readonly session: Experimental_SandboxSession;
    readonly abortSignal?: AbortSignal;
  }) => Promise<void>;
};
type HarnessV1SandboxSessionCreateOptions<TProviderOptions extends object> =
  TProviderOptions & {
    readonly sandboxId?: string;
    readonly template?: HarnessV1SandboxTemplate;
    readonly abortSignal?: AbortSignal;
  };
type HarnessV1SandboxSessionResumeOptions<TProviderOptions extends object> =
  TProviderOptions & {
    readonly sandboxId: string;
    readonly abortSignal?: AbortSignal;
  };
export declare function harnessSessionDataDirectoryPath({
  stateDirectory,
  sessionId,
}: {
  stateDirectory: string;
  sessionId: string;
}): string;
export declare const harnessV1BridgeToolWireSchema: z.ZodObject<
  {
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    inputSchema: z.ZodOptional<z.ZodUnknown>;
  },
  z.core.$strip
>;
type HarnessV1BridgeToolWire = z.infer<typeof harnessV1BridgeToolWireSchema>;
export declare const harnessV1BridgePermissionModeSchema: z.ZodEnum<{
  'allow-reads': 'allow-reads';
  'allow-edits': 'allow-edits';
  'allow-all': 'allow-all';
}>;
export declare const harnessV1BridgeBuiltinToolFilteringSchema: z.ZodDiscriminatedUnion<
  [
    z.ZodObject<
      {
        mode: z.ZodLiteral<'allow'>;
        toolNames: z.ZodArray<z.ZodString>;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        mode: z.ZodLiteral<'deny'>;
        toolNames: z.ZodArray<z.ZodString>;
      },
      z.core.$strip
    >,
  ]
> & {
  def: {
    discriminator: 'mode';
  };
  _zod: {
    def: {
      discriminator: 'mode';
    };
  };
};
export declare const harnessV1BridgeResponseFormatSchema: z.ZodType<HarnessV1ResponseFormat>;
export declare const harnessV1BridgeStartBaseSchema: z.ZodObject<
  {
    type: z.ZodLiteral<'start'>;
    startId: z.ZodOptional<z.ZodString>;
    prompt: z.ZodString;
    tools: z.ZodOptional<
      z.ZodArray<
        z.ZodObject<
          {
            name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            inputSchema: z.ZodOptional<z.ZodUnknown>;
          },
          z.core.$strip
        >
      >
    >;
    model: z.ZodOptional<z.ZodString>;
    debug: z.ZodOptional<
      z.ZodObject<
        {
          enabled: z.ZodOptional<z.ZodBoolean>;
          level: z.ZodOptional<
            z.ZodEnum<{
              error: 'error';
              warn: 'warn';
              info: 'info';
              debug: 'debug';
              trace: 'trace';
            }>
          >;
          subsystems: z.ZodOptional<z.ZodArray<z.ZodString>>;
        },
        z.core.$strip
      >
    >;
    permissionMode: z.ZodOptional<
      z.ZodEnum<{
        'allow-reads': 'allow-reads';
        'allow-edits': 'allow-edits';
        'allow-all': 'allow-all';
      }>
    >;
    builtinToolFiltering: z.ZodOptional<
      z.ZodDiscriminatedUnion<
        [
          z.ZodObject<
            {
              mode: z.ZodLiteral<'allow'>;
              toolNames: z.ZodArray<z.ZodString>;
            },
            z.core.$strip
          >,
          z.ZodObject<
            {
              mode: z.ZodLiteral<'deny'>;
              toolNames: z.ZodArray<z.ZodString>;
            },
            z.core.$strip
          >,
        ]
      > & {
        def: {
          discriminator: 'mode';
        };
        _zod: {
          def: {
            discriminator: 'mode';
          };
        };
      }
    >;
    responseFormat: z.ZodOptional<
      z.ZodType<
        HarnessV1ResponseFormat,
        unknown,
        z.core.$ZodTypeInternals<HarnessV1ResponseFormat, unknown>
      >
    >;
  },
  z.core.$strip
>;
export declare const harnessV1BridgeHelloSchema: z.ZodObject<
  {
    type: z.ZodLiteral<'bridge-hello'>;
    state: z.ZodOptional<z.ZodString>;
    lastSeq: z.ZodOptional<z.ZodNumber>;
    capabilities: z.ZodOptional<
      z.ZodObject<
        {
          idempotentStart: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
          experimental_userMessageResponses: z.ZodOptional<z.ZodBoolean>;
        },
        z.core.$strip
      >
    >;
  },
  z.core.$strip
>;
export declare const experimental_harnessV1BridgeUserMessageResponseSchema: z.ZodObject<
  {
    type: z.ZodLiteral<'user-message-response'>;
    messageId: z.ZodString;
    accepted: z.ZodBoolean;
    error: z.ZodOptional<
      z.ZodObject<
        {
          message: z.ZodString;
        },
        z.core.$strip
      >
    >;
  },
  z.core.$strip
>;
export declare const harnessV1BridgeStopSchema: z.ZodObject<
  {
    type: z.ZodLiteral<'bridge-stop'>;
    data: z.ZodUnknown;
  },
  z.core.$strip
>;
export declare const harnessV1BridgeThreadSchema: z.ZodObject<
  {
    type: z.ZodLiteral<'bridge-thread'>;
    threadId: z.ZodString;
  },
  z.core.$strip
>;
export declare const harnessV1BridgeSandboxLogSchema: z.ZodObject<
  {
    type: z.ZodLiteral<'sandbox-log'>;
    source: z.ZodString;
    stream: z.ZodEnum<{
      stdout: 'stdout';
      stderr: 'stderr';
    }>;
    line: z.ZodString;
  },
  z.core.$strip
>;
export declare const harnessV1BridgeDebugEventSchema: z.ZodObject<
  {
    type: z.ZodLiteral<'debug-event'>;
    level: z.ZodEnum<{
      error: 'error';
      warn: 'warn';
      info: 'info';
      debug: 'debug';
      trace: 'trace';
    }>;
    subsystem: z.ZodString;
    message: z.ZodString;
    attrs: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    error: z.ZodOptional<
      z.ZodObject<
        {
          name: z.ZodOptional<z.ZodString>;
          message: z.ZodString;
          stack: z.ZodOptional<z.ZodString>;
        },
        z.core.$strip
      >
    >;
  },
  z.core.$strip
>;
export declare const harnessV1BridgeOutboundMessageSchema: z.ZodDiscriminatedUnion<
  [
    z.ZodObject<
      {
        type: z.ZodLiteral<'stream-start'>;
        warnings: z.ZodOptional<
          z.ZodReadonly<
            z.ZodArray<
              z.ZodType<
                HarnessV1CallWarning,
                unknown,
                z.core.$ZodTypeInternals<HarnessV1CallWarning, unknown>
              >
            >
          >
        >;
        modelId: z.ZodOptional<z.ZodString>;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'text-start'>;
        id: z.ZodString;
        harnessMetadata: z.ZodOptional<
          z.ZodType<
            HarnessV1Metadata,
            unknown,
            z.core.$ZodTypeInternals<HarnessV1Metadata, unknown>
          >
        >;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'text-delta'>;
        id: z.ZodString;
        delta: z.ZodString;
        harnessMetadata: z.ZodOptional<
          z.ZodType<
            HarnessV1Metadata,
            unknown,
            z.core.$ZodTypeInternals<HarnessV1Metadata, unknown>
          >
        >;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'text-end'>;
        id: z.ZodString;
        harnessMetadata: z.ZodOptional<
          z.ZodType<
            HarnessV1Metadata,
            unknown,
            z.core.$ZodTypeInternals<HarnessV1Metadata, unknown>
          >
        >;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'reasoning-start'>;
        id: z.ZodString;
        harnessMetadata: z.ZodOptional<
          z.ZodType<
            HarnessV1Metadata,
            unknown,
            z.core.$ZodTypeInternals<HarnessV1Metadata, unknown>
          >
        >;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'reasoning-delta'>;
        id: z.ZodString;
        delta: z.ZodString;
        harnessMetadata: z.ZodOptional<
          z.ZodType<
            HarnessV1Metadata,
            unknown,
            z.core.$ZodTypeInternals<HarnessV1Metadata, unknown>
          >
        >;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'reasoning-end'>;
        id: z.ZodString;
        harnessMetadata: z.ZodOptional<
          z.ZodType<
            HarnessV1Metadata,
            unknown,
            z.core.$ZodTypeInternals<HarnessV1Metadata, unknown>
          >
        >;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'tool-input-start'>;
        id: z.ZodString;
        toolName: z.ZodString;
        providerMetadata: z.ZodOptional<
          z.ZodType<
            import('@ai-sdk/provider').SharedV4ProviderMetadata,
            unknown,
            z.core.$ZodTypeInternals<
              import('@ai-sdk/provider').SharedV4ProviderMetadata,
              unknown
            >
          >
        >;
        providerExecuted: z.ZodOptional<z.ZodBoolean>;
        dynamic: z.ZodOptional<z.ZodBoolean>;
        title: z.ZodOptional<z.ZodString>;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'tool-input-delta'>;
        id: z.ZodString;
        delta: z.ZodString;
        providerMetadata: z.ZodOptional<
          z.ZodType<
            import('@ai-sdk/provider').SharedV4ProviderMetadata,
            unknown,
            z.core.$ZodTypeInternals<
              import('@ai-sdk/provider').SharedV4ProviderMetadata,
              unknown
            >
          >
        >;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'tool-input-end'>;
        id: z.ZodString;
        providerMetadata: z.ZodOptional<
          z.ZodType<
            import('@ai-sdk/provider').SharedV4ProviderMetadata,
            unknown,
            z.core.$ZodTypeInternals<
              import('@ai-sdk/provider').SharedV4ProviderMetadata,
              unknown
            >
          >
        >;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'tool-call'>;
        toolCallId: z.ZodString;
        toolName: z.ZodString;
        input: z.ZodString;
        providerExecuted: z.ZodOptional<z.ZodBoolean>;
        dynamic: z.ZodOptional<z.ZodBoolean>;
        providerMetadata: z.ZodOptional<
          z.ZodType<
            import('@ai-sdk/provider').SharedV4ProviderMetadata,
            unknown,
            z.core.$ZodTypeInternals<
              import('@ai-sdk/provider').SharedV4ProviderMetadata,
              unknown
            >
          >
        >;
        nativeName: z.ZodOptional<z.ZodString>;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'tool-approval-request'>;
        approvalId: z.ZodString;
        toolCallId: z.ZodString;
        providerMetadata: z.ZodOptional<
          z.ZodType<
            import('@ai-sdk/provider').SharedV4ProviderMetadata,
            unknown,
            z.core.$ZodTypeInternals<
              import('@ai-sdk/provider').SharedV4ProviderMetadata,
              unknown
            >
          >
        >;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'tool-result'>;
        toolCallId: z.ZodString;
        toolName: z.ZodString;
        result: z.ZodType<
          NonNullable<import('@ai-sdk/provider').JSONValue>,
          unknown,
          z.core.$ZodTypeInternals<
            NonNullable<import('@ai-sdk/provider').JSONValue>,
            unknown
          >
        >;
        isError: z.ZodOptional<z.ZodBoolean>;
        preliminary: z.ZodOptional<z.ZodBoolean>;
        dynamic: z.ZodOptional<z.ZodBoolean>;
        providerMetadata: z.ZodOptional<
          z.ZodType<
            import('@ai-sdk/provider').SharedV4ProviderMetadata,
            unknown,
            z.core.$ZodTypeInternals<
              import('@ai-sdk/provider').SharedV4ProviderMetadata,
              unknown
            >
          >
        >;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'finish-step'>;
        finishReason: z.ZodType<
          import('@ai-sdk/provider').LanguageModelV4FinishReason,
          unknown,
          z.core.$ZodTypeInternals<
            import('@ai-sdk/provider').LanguageModelV4FinishReason,
            unknown
          >
        >;
        usage: z.ZodType<
          import('@ai-sdk/provider').LanguageModelV4Usage,
          unknown,
          z.core.$ZodTypeInternals<
            import('@ai-sdk/provider').LanguageModelV4Usage,
            unknown
          >
        >;
        harnessMetadata: z.ZodOptional<
          z.ZodType<
            HarnessV1Metadata,
            unknown,
            z.core.$ZodTypeInternals<HarnessV1Metadata, unknown>
          >
        >;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'finish'>;
        finishReason: z.ZodType<
          import('@ai-sdk/provider').LanguageModelV4FinishReason,
          unknown,
          z.core.$ZodTypeInternals<
            import('@ai-sdk/provider').LanguageModelV4FinishReason,
            unknown
          >
        >;
        totalUsage: z.ZodType<
          import('@ai-sdk/provider').LanguageModelV4Usage,
          unknown,
          z.core.$ZodTypeInternals<
            import('@ai-sdk/provider').LanguageModelV4Usage,
            unknown
          >
        >;
        harnessMetadata: z.ZodOptional<
          z.ZodType<
            HarnessV1Metadata,
            unknown,
            z.core.$ZodTypeInternals<HarnessV1Metadata, unknown>
          >
        >;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'file-change'>;
        event: z.ZodEnum<{
          create: 'create';
          modify: 'modify';
          delete: 'delete';
        }>;
        path: z.ZodString;
        harnessMetadata: z.ZodOptional<
          z.ZodType<
            HarnessV1Metadata,
            unknown,
            z.core.$ZodTypeInternals<HarnessV1Metadata, unknown>
          >
        >;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'compaction'>;
        trigger: z.ZodEnum<{
          manual: 'manual';
          auto: 'auto';
        }>;
        summary: z.ZodString;
        tokensBefore: z.ZodOptional<z.ZodNumber>;
        tokensAfter: z.ZodOptional<z.ZodNumber>;
        harnessMetadata: z.ZodOptional<
          z.ZodType<
            HarnessV1Metadata,
            unknown,
            z.core.$ZodTypeInternals<HarnessV1Metadata, unknown>
          >
        >;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'error'>;
        error: z.ZodUnknown;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'raw'>;
        rawValue: z.ZodUnknown;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'bridge-hello'>;
        state: z.ZodOptional<z.ZodString>;
        lastSeq: z.ZodOptional<z.ZodNumber>;
        capabilities: z.ZodOptional<
          z.ZodObject<
            {
              idempotentStart: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
              experimental_userMessageResponses: z.ZodOptional<z.ZodBoolean>;
            },
            z.core.$strip
          >
        >;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'user-message-response'>;
        messageId: z.ZodString;
        accepted: z.ZodBoolean;
        error: z.ZodOptional<
          z.ZodObject<
            {
              message: z.ZodString;
            },
            z.core.$strip
          >
        >;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'bridge-stop'>;
        data: z.ZodUnknown;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'bridge-thread'>;
        threadId: z.ZodString;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'sandbox-log'>;
        source: z.ZodString;
        stream: z.ZodEnum<{
          stdout: 'stdout';
          stderr: 'stderr';
        }>;
        line: z.ZodString;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'debug-event'>;
        level: z.ZodEnum<{
          error: 'error';
          warn: 'warn';
          info: 'info';
          debug: 'debug';
          trace: 'trace';
        }>;
        subsystem: z.ZodString;
        message: z.ZodString;
        attrs: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        error: z.ZodOptional<
          z.ZodObject<
            {
              name: z.ZodOptional<z.ZodString>;
              message: z.ZodString;
              stack: z.ZodOptional<z.ZodString>;
            },
            z.core.$strip
          >
        >;
      },
      z.core.$strip
    >,
  ]
> & {
  def: {
    discriminator: 'type';
  };
  _zod: {
    def: {
      discriminator: 'type';
    };
  };
};
type HarnessV1BridgeOutboundMessage = z.infer<
  typeof harnessV1BridgeOutboundMessageSchema
>;
type Experimental_HarnessV1BridgeUserMessageResponse = z.infer<
  typeof experimental_harnessV1BridgeUserMessageResponseSchema
>;
type HarnessV1BridgeSandboxLog = z.infer<
  typeof harnessV1BridgeSandboxLogSchema
>;
type HarnessV1BridgeDebugEvent = z.infer<
  typeof harnessV1BridgeDebugEventSchema
>;
export declare function harnessV1DiagnosticFromBridgeFrame(
  frame: HarnessV1BridgeSandboxLog | HarnessV1BridgeDebugEvent,
  context: {
    sessionId?: string;
    timestamp: number;
  },
): HarnessV1Diagnostic;
export declare const harnessV1BridgeToolResultInboundSchema: z.ZodObject<
  {
    type: z.ZodLiteral<'tool-result'>;
    toolCallId: z.ZodString;
    output: z.ZodUnknown;
    isError: z.ZodOptional<z.ZodBoolean>;
    toolResult: z.ZodOptional<z.ZodUnknown>;
  },
  z.core.$strip
>;
export declare const harnessV1BridgeToolApprovalResponseInboundSchema: z.ZodObject<
  {
    type: z.ZodLiteral<'tool-approval-response'>;
    approvalId: z.ZodString;
    approved: z.ZodBoolean;
    reason: z.ZodOptional<z.ZodString>;
  },
  z.core.$strip
>;
export declare const harnessV1BridgeUserMessageInboundSchema: z.ZodObject<
  {
    type: z.ZodLiteral<'user-message'>;
    messageId: z.ZodOptional<z.ZodString>;
    text: z.ZodString;
  },
  z.core.$strip
>;
export declare const experimental_harnessV1BridgeUserMessageInboundSchema: z.ZodObject<
  {
    type: z.ZodLiteral<'user-message'>;
    text: z.ZodString;
    messageId: z.ZodString;
  },
  z.core.$strip
>;
export declare const harnessV1BridgeAbortInboundSchema: z.ZodObject<
  {
    type: z.ZodLiteral<'abort'>;
  },
  z.core.$strip
>;
export declare const harnessV1BridgeDestroyInboundSchema: z.ZodObject<
  {
    type: z.ZodLiteral<'destroy'>;
  },
  z.core.$strip
>;
export declare const harnessV1BridgeResumeInboundSchema: z.ZodObject<
  {
    type: z.ZodLiteral<'resume'>;
    lastSeenEventId: z.ZodNumber;
  },
  z.core.$strip
>;
export declare const harnessV1BridgeStopInboundSchema: z.ZodObject<
  {
    type: z.ZodLiteral<'stop'>;
  },
  z.core.$strip
>;
export declare const harnessV1BridgeInboundCommandSchemas: readonly [
  z.ZodObject<
    {
      type: z.ZodLiteral<'tool-result'>;
      toolCallId: z.ZodString;
      output: z.ZodUnknown;
      isError: z.ZodOptional<z.ZodBoolean>;
      toolResult: z.ZodOptional<z.ZodUnknown>;
    },
    z.core.$strip
  >,
  z.ZodObject<
    {
      type: z.ZodLiteral<'tool-approval-response'>;
      approvalId: z.ZodString;
      approved: z.ZodBoolean;
      reason: z.ZodOptional<z.ZodString>;
    },
    z.core.$strip
  >,
  z.ZodObject<
    {
      type: z.ZodLiteral<'user-message'>;
      messageId: z.ZodOptional<z.ZodString>;
      text: z.ZodString;
    },
    z.core.$strip
  >,
  z.ZodObject<
    {
      type: z.ZodLiteral<'abort'>;
    },
    z.core.$strip
  >,
  z.ZodObject<
    {
      type: z.ZodLiteral<'destroy'>;
    },
    z.core.$strip
  >,
  z.ZodObject<
    {
      type: z.ZodLiteral<'resume'>;
      lastSeenEventId: z.ZodNumber;
    },
    z.core.$strip
  >,
  z.ZodObject<
    {
      type: z.ZodLiteral<'stop'>;
    },
    z.core.$strip
  >,
];
export declare const harnessV1BridgeReadySchema: z.ZodObject<
  {
    type: z.ZodLiteral<'bridge-ready'>;
    port: z.ZodNumber;
  },
  z.core.$strip
>;
type HarnessV1BridgeReady = z.infer<typeof harnessV1BridgeReadySchema>;
declare const symbol$3: unique symbol;
export declare class HarnessError extends AISDKError {
  private readonly [symbol$3];
  constructor({ message, cause }: { message: string; cause?: unknown });
  static isInstance(error: unknown): error is HarnessError;
}
declare const symbol$2: unique symbol;
export declare class HarnessCapabilityUnsupportedError extends HarnessError {
  private readonly [symbol$2];
  readonly harnessId?: string;
  constructor({
    message,
    harnessId,
    cause,
  }: {
    message: string;
    harnessId?: string;
    cause?: unknown;
  });
  static isInstance(error: unknown): error is HarnessCapabilityUnsupportedError;
}
declare const symbol$1: unique symbol;
export declare class HarnessHistoryUnavailableError extends HarnessError {
  private readonly [symbol$1];
  readonly harnessId?: string;
  constructor({
    message,
    harnessId,
    cause,
  }: {
    message: string;
    harnessId?: string;
    cause?: unknown;
  });
  static isInstance(error: unknown): error is HarnessHistoryUnavailableError;
}
declare const symbol: unique symbol;
export declare class HarnessSandboxAuthenticationError extends HarnessError {
  private readonly [symbol];
  readonly sandboxProviderId: string;
  constructor({
    message,
    sandboxProviderId,
    cause,
  }: {
    message: string;
    sandboxProviderId: string;
    cause?: unknown;
  });
  static isInstance(error: unknown): error is HarnessSandboxAuthenticationError;
}
export type {
  Experimental_HarnessV1BridgeUserMessageResponse,
  HarnessV1,
  HarnessV1AssistantMessage,
  HarnessV1Authentication,
  HarnessV1AuthenticationEnvironment,
  HarnessV1Bootstrap,
  HarnessV1BootstrapCommand,
  HarnessV1BootstrapFile,
  HarnessV1BridgeDebugEvent,
  HarnessV1BridgeOutboundMessage,
  HarnessV1BridgeReady,
  HarnessV1BridgeSandboxLog,
  HarnessV1BridgeToolWire,
  HarnessV1BuiltinTool,
  HarnessV1BuiltinToolFiltering,
  HarnessV1BuiltinToolName,
  HarnessV1BuiltinToolUseKind,
  HarnessV1CallWarning,
  HarnessV1ContinueTurnOptions,
  HarnessV1ContinueTurnState,
  HarnessV1CredentialForwarding,
  HarnessV1CustomPart,
  HarnessV1DebugConfig,
  HarnessV1DebugLevel,
  HarnessV1Diagnostic,
  HarnessV1FilePart,
  HarnessV1JSONArray,
  HarnessV1JSONObject,
  HarnessV1JSONSchema,
  HarnessV1JSONValue,
  HarnessV1LifecycleState,
  HarnessV1Message,
  HarnessV1MessagePart,
  HarnessV1Metadata,
  HarnessV1MintBridgeTokenCallback,
  HarnessV1NetworkPolicy,
  HarnessV1NetworkSandboxSession,
  HarnessV1Observability,
  HarnessV1PendingToolApproval,
  HarnessV1PendingToolResult,
  HarnessV1PermissionMode,
  HarnessV1PortEndpoint,
  HarnessV1Prompt,
  HarnessV1PromptControl,
  HarnessV1PromptTurnOptions,
  HarnessV1QuestionsTool,
  HarnessV1QuestionsToolInput,
  HarnessV1QuestionsToolOutput,
  HarnessV1ReadHistoryResult,
  HarnessV1ReasoningFilePart,
  HarnessV1ReasoningPart,
  HarnessV1RequestTransformation,
  HarnessV1RequestTransformationSources,
  HarnessV1ResponseFormat,
  HarnessV1ResumeSessionState,
  HarnessV1SandboxProvider,
  HarnessV1SandboxSessionCreateOptions,
  HarnessV1SandboxSessionResumeOptions,
  HarnessV1SandboxTemplate,
  HarnessV1Session,
  HarnessV1Skill,
  HarnessV1StartOptions,
  HarnessV1StreamPart,
  HarnessV1TextPart,
  HarnessV1ToolApprovalResponsePart,
  HarnessV1ToolCallPart,
  HarnessV1ToolMessage,
  HarnessV1ToolResultOutput,
  HarnessV1ToolResultPart,
  HarnessV1ToolSpec,
  HarnessV1TurnSettings,
  HarnessV1UserMessage,
};
