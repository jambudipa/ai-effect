// Generated from @ai-sdk/harness-grok-build in @ai-sdk/harness-grok-build@1.0.132. Do not edit.
// Original license: harness.LICENSE.
// Normalize Zod v4 declarations for the Zod 3.25.76 bridge.
import {
  HarnessV1,
  HarnessV1BuiltinTool,
  HarnessV1CredentialForwarding,
  HarnessV1MintBridgeTokenCallback,
  HarnessV1PortEndpoint,
} from './harness.js';
import { SandboxChannelReconnectOptions } from './harness-utils.js';
import { ACPAuthenticationMode } from './harness-acp.js';
import { JSONObject } from '@ai-sdk/provider';
type GrokBuildAuthenticationMode = ACPAuthenticationMode;
type GrokBuildHarnessSettings = {
  readonly auth?: GrokBuildAuthenticationMode;
  readonly credentialForwarding?: HarnessV1CredentialForwarding;
  readonly reasoningEffort?:
    'none' | 'minimal' | 'low' | 'medium' | 'high' | 'xhigh' | 'max';
  readonly port?: number;
  readonly portEndpoint?: HarnessV1PortEndpoint;
  readonly startupTimeoutMs?: number;
  readonly hostDisconnectTimeoutMs?: number;
  readonly reconnect?: SandboxChannelReconnectOptions;
  readonly keepAliveMs?: number;
  readonly mcpServers?: Record<string, unknown>;
  readonly mintBridgeToken?: HarnessV1MintBridgeTokenCallback;
};
declare const GROK_BUILD_BUILTIN_TOOLS: {
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
      },
    any
  >;
  readonly bash: HarnessV1BuiltinTool<
    {
      [x: string]: unknown;
      command: string;
      timeout?: number | null | undefined;
      description?: string | undefined;
      background?: boolean | undefined;
    },
    unknown
  >;
  readonly edit: HarnessV1BuiltinTool<
    {
      [x: string]: unknown;
      file_path: string;
      old_string: string;
      new_string: string;
      replace_all?: boolean | undefined;
    },
    unknown
  >;
  readonly grep: HarnessV1BuiltinTool<
    {
      [x: string]: unknown;
      pattern: string;
      path?: string | null | undefined;
      glob?: string | null | undefined;
      '-B'?: number | undefined;
      '-A'?: number | undefined;
      '-C'?: number | undefined;
      '-i'?: boolean | undefined;
      type?: string | null | undefined;
      head_limit?: number | undefined;
      multiline?: boolean | undefined;
    },
    unknown
  >;
  readonly webSearch: HarnessV1BuiltinTool<
    {
      [x: string]: unknown;
      query: string;
      allowed_domains?: string[] | null | undefined;
    },
    unknown
  >;
  readonly write: HarnessV1BuiltinTool<
    {
      [x: string]: unknown;
      file_path: string;
      content: string;
    },
    unknown
  >;
  readonly read_file:
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          target_file: string;
          offset?: number | undefined;
          limit?: number | undefined;
          pages?: string | null | undefined;
          format?: string | null | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                target_file: string;
                offset?: number | undefined;
                limit?: number | undefined;
                pages?: string | null | undefined;
                format?: string | null | undefined;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  target_file: string;
                  offset?: number | undefined;
                  limit?: number | undefined;
                  pages?: string | null | undefined;
                  format?: string | null | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                target_file: string;
                offset?: number | undefined;
                limit?: number | undefined;
                pages?: string | null | undefined;
                format?: string | null | undefined;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?: never;
        readonly description?:
          | string
          | ((options: {
              context: any;
              experimental_sandbox?: import('@ai-sdk/provider-utils').Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                [x: string]: unknown;
                target_file: string;
                offset?: number | undefined;
                limit?: number | undefined;
                pages?: string | null | undefined;
                format?: string | null | undefined;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type?: undefined | 'function';
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          target_file: string;
          offset?: number | undefined;
          limit?: number | undefined;
          pages?: string | null | undefined;
          format?: string | null | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                target_file: string;
                offset?: number | undefined;
                limit?: number | undefined;
                pages?: string | null | undefined;
                format?: string | null | undefined;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  target_file: string;
                  offset?: number | undefined;
                  limit?: number | undefined;
                  pages?: string | null | undefined;
                  format?: string | null | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                target_file: string;
                offset?: number | undefined;
                limit?: number | undefined;
                pages?: string | null | undefined;
                format?: string | null | undefined;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?:
          | import('@ai-sdk/provider-utils').ToolExecuteFunction<
              {
                [x: string]: unknown;
                target_file: string;
                offset?: number | undefined;
                limit?: number | undefined;
                pages?: string | null | undefined;
                format?: string | null | undefined;
              },
              any,
              any
            >
          | undefined;
        readonly description?:
          | string
          | ((options: {
              context: any;
              experimental_sandbox?: import('@ai-sdk/provider-utils').Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                [x: string]: unknown;
                target_file: string;
                offset?: number | undefined;
                limit?: number | undefined;
                pages?: string | null | undefined;
                format?: string | null | undefined;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type?: undefined | 'function';
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          target_file: string;
          offset?: number | undefined;
          limit?: number | undefined;
          pages?: string | null | undefined;
          format?: string | null | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                target_file: string;
                offset?: number | undefined;
                limit?: number | undefined;
                pages?: string | null | undefined;
                format?: string | null | undefined;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  target_file: string;
                  offset?: number | undefined;
                  limit?: number | undefined;
                  pages?: string | null | undefined;
                  format?: string | null | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                target_file: string;
                offset?: number | undefined;
                limit?: number | undefined;
                pages?: string | null | undefined;
                format?: string | null | undefined;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?: never;
        readonly description?:
          | string
          | ((options: {
              context: any;
              experimental_sandbox?: import('@ai-sdk/provider-utils').Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                [x: string]: unknown;
                target_file: string;
                offset?: number | undefined;
                limit?: number | undefined;
                pages?: string | null | undefined;
                format?: string | null | undefined;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type: 'dynamic';
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          target_file: string;
          offset?: number | undefined;
          limit?: number | undefined;
          pages?: string | null | undefined;
          format?: string | null | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                target_file: string;
                offset?: number | undefined;
                limit?: number | undefined;
                pages?: string | null | undefined;
                format?: string | null | undefined;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  target_file: string;
                  offset?: number | undefined;
                  limit?: number | undefined;
                  pages?: string | null | undefined;
                  format?: string | null | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                target_file: string;
                offset?: number | undefined;
                limit?: number | undefined;
                pages?: string | null | undefined;
                format?: string | null | undefined;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?:
          | import('@ai-sdk/provider-utils').ToolExecuteFunction<
              {
                [x: string]: unknown;
                target_file: string;
                offset?: number | undefined;
                limit?: number | undefined;
                pages?: string | null | undefined;
                format?: string | null | undefined;
              },
              any,
              any
            >
          | undefined;
        readonly description?:
          | string
          | ((options: {
              context: any;
              experimental_sandbox?: import('@ai-sdk/provider-utils').Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                [x: string]: unknown;
                target_file: string;
                offset?: number | undefined;
                limit?: number | undefined;
                pages?: string | null | undefined;
                format?: string | null | undefined;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type: 'dynamic';
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          target_file: string;
          offset?: number | undefined;
          limit?: number | undefined;
          pages?: string | null | undefined;
          format?: string | null | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                target_file: string;
                offset?: number | undefined;
                limit?: number | undefined;
                pages?: string | null | undefined;
                format?: string | null | undefined;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  target_file: string;
                  offset?: number | undefined;
                  limit?: number | undefined;
                  pages?: string | null | undefined;
                  format?: string | null | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                target_file: string;
                offset?: number | undefined;
                limit?: number | undefined;
                pages?: string | null | undefined;
                format?: string | null | undefined;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?: never;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: false;
        readonly supportsDeferredResults?: never;
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          target_file: string;
          offset?: number | undefined;
          limit?: number | undefined;
          pages?: string | null | undefined;
          format?: string | null | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                target_file: string;
                offset?: number | undefined;
                limit?: number | undefined;
                pages?: string | null | undefined;
                format?: string | null | undefined;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  target_file: string;
                  offset?: number | undefined;
                  limit?: number | undefined;
                  pages?: string | null | undefined;
                  format?: string | null | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                target_file: string;
                offset?: number | undefined;
                limit?: number | undefined;
                pages?: string | null | undefined;
                format?: string | null | undefined;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?:
          | import('@ai-sdk/provider-utils').ToolExecuteFunction<
              {
                [x: string]: unknown;
                target_file: string;
                offset?: number | undefined;
                limit?: number | undefined;
                pages?: string | null | undefined;
                format?: string | null | undefined;
              },
              any,
              any
            >
          | undefined;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: false;
        readonly supportsDeferredResults?: never;
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          target_file: string;
          offset?: number | undefined;
          limit?: number | undefined;
          pages?: string | null | undefined;
          format?: string | null | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                target_file: string;
                offset?: number | undefined;
                limit?: number | undefined;
                pages?: string | null | undefined;
                format?: string | null | undefined;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  target_file: string;
                  offset?: number | undefined;
                  limit?: number | undefined;
                  pages?: string | null | undefined;
                  format?: string | null | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                target_file: string;
                offset?: number | undefined;
                limit?: number | undefined;
                pages?: string | null | undefined;
                format?: string | null | undefined;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?: never;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: true;
        readonly supportsDeferredResults?: boolean;
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          target_file: string;
          offset?: number | undefined;
          limit?: number | undefined;
          pages?: string | null | undefined;
          format?: string | null | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                target_file: string;
                offset?: number | undefined;
                limit?: number | undefined;
                pages?: string | null | undefined;
                format?: string | null | undefined;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  target_file: string;
                  offset?: number | undefined;
                  limit?: number | undefined;
                  pages?: string | null | undefined;
                  format?: string | null | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                target_file: string;
                offset?: number | undefined;
                limit?: number | undefined;
                pages?: string | null | undefined;
                format?: string | null | undefined;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?:
          | import('@ai-sdk/provider-utils').ToolExecuteFunction<
              {
                [x: string]: unknown;
                target_file: string;
                offset?: number | undefined;
                limit?: number | undefined;
                pages?: string | null | undefined;
                format?: string | null | undefined;
              },
              any,
              any
            >
          | undefined;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: true;
        readonly supportsDeferredResults?: boolean;
      };
  readonly list_dir:
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          target_directory: string;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                target_directory: string;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  target_directory: string;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                target_directory: string;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?: never;
        readonly description?:
          | string
          | ((options: {
              context: any;
              experimental_sandbox?: import('@ai-sdk/provider-utils').Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                [x: string]: unknown;
                target_directory: string;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type?: undefined | 'function';
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          target_directory: string;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                target_directory: string;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  target_directory: string;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                target_directory: string;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?:
          | import('@ai-sdk/provider-utils').ToolExecuteFunction<
              {
                [x: string]: unknown;
                target_directory: string;
              },
              any,
              any
            >
          | undefined;
        readonly description?:
          | string
          | ((options: {
              context: any;
              experimental_sandbox?: import('@ai-sdk/provider-utils').Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                [x: string]: unknown;
                target_directory: string;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type?: undefined | 'function';
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          target_directory: string;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                target_directory: string;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  target_directory: string;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                target_directory: string;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?: never;
        readonly description?:
          | string
          | ((options: {
              context: any;
              experimental_sandbox?: import('@ai-sdk/provider-utils').Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                [x: string]: unknown;
                target_directory: string;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type: 'dynamic';
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          target_directory: string;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                target_directory: string;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  target_directory: string;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                target_directory: string;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?:
          | import('@ai-sdk/provider-utils').ToolExecuteFunction<
              {
                [x: string]: unknown;
                target_directory: string;
              },
              any,
              any
            >
          | undefined;
        readonly description?:
          | string
          | ((options: {
              context: any;
              experimental_sandbox?: import('@ai-sdk/provider-utils').Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                [x: string]: unknown;
                target_directory: string;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type: 'dynamic';
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          target_directory: string;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                target_directory: string;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  target_directory: string;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                target_directory: string;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?: never;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: false;
        readonly supportsDeferredResults?: never;
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          target_directory: string;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                target_directory: string;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  target_directory: string;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                target_directory: string;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?:
          | import('@ai-sdk/provider-utils').ToolExecuteFunction<
              {
                [x: string]: unknown;
                target_directory: string;
              },
              any,
              any
            >
          | undefined;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: false;
        readonly supportsDeferredResults?: never;
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          target_directory: string;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                target_directory: string;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  target_directory: string;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                target_directory: string;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?: never;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: true;
        readonly supportsDeferredResults?: boolean;
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          target_directory: string;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                target_directory: string;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  target_directory: string;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                target_directory: string;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?:
          | import('@ai-sdk/provider-utils').ToolExecuteFunction<
              {
                [x: string]: unknown;
                target_directory: string;
              },
              any,
              any
            >
          | undefined;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: true;
        readonly supportsDeferredResults?: boolean;
      };
  readonly kill_command_or_subagent: import('@ai-sdk/provider-utils').Tool<
    {
      [x: string]: unknown;
      task_id: string;
    },
    any,
    any
  >;
  readonly todo_write: import('@ai-sdk/provider-utils').Tool<
    {
      [x: string]: unknown;
      todos: {
        [x: string]: unknown;
        id: string;
        content?: string | null | undefined;
        status?:
          | 'pending'
          | 'in_progress'
          | 'completed'
          | 'cancelled'
          | null
          | undefined;
      }[];
      merge?: boolean | undefined;
    },
    any,
    any
  >;
  readonly get_command_or_subagent_output:
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          task_ids?: string[] | undefined;
          timeout_ms?: number | null | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                task_ids?: string[] | undefined;
                timeout_ms?: number | null | undefined;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  task_ids?: string[] | undefined;
                  timeout_ms?: number | null | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                task_ids?: string[] | undefined;
                timeout_ms?: number | null | undefined;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?: never;
        readonly description?:
          | string
          | ((options: {
              context: any;
              experimental_sandbox?: import('@ai-sdk/provider-utils').Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                [x: string]: unknown;
                task_ids?: string[] | undefined;
                timeout_ms?: number | null | undefined;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type?: undefined | 'function';
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          task_ids?: string[] | undefined;
          timeout_ms?: number | null | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                task_ids?: string[] | undefined;
                timeout_ms?: number | null | undefined;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  task_ids?: string[] | undefined;
                  timeout_ms?: number | null | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                task_ids?: string[] | undefined;
                timeout_ms?: number | null | undefined;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?:
          | import('@ai-sdk/provider-utils').ToolExecuteFunction<
              {
                [x: string]: unknown;
                task_ids?: string[] | undefined;
                timeout_ms?: number | null | undefined;
              },
              any,
              any
            >
          | undefined;
        readonly description?:
          | string
          | ((options: {
              context: any;
              experimental_sandbox?: import('@ai-sdk/provider-utils').Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                [x: string]: unknown;
                task_ids?: string[] | undefined;
                timeout_ms?: number | null | undefined;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type?: undefined | 'function';
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          task_ids?: string[] | undefined;
          timeout_ms?: number | null | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                task_ids?: string[] | undefined;
                timeout_ms?: number | null | undefined;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  task_ids?: string[] | undefined;
                  timeout_ms?: number | null | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                task_ids?: string[] | undefined;
                timeout_ms?: number | null | undefined;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?: never;
        readonly description?:
          | string
          | ((options: {
              context: any;
              experimental_sandbox?: import('@ai-sdk/provider-utils').Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                [x: string]: unknown;
                task_ids?: string[] | undefined;
                timeout_ms?: number | null | undefined;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type: 'dynamic';
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          task_ids?: string[] | undefined;
          timeout_ms?: number | null | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                task_ids?: string[] | undefined;
                timeout_ms?: number | null | undefined;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  task_ids?: string[] | undefined;
                  timeout_ms?: number | null | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                task_ids?: string[] | undefined;
                timeout_ms?: number | null | undefined;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?:
          | import('@ai-sdk/provider-utils').ToolExecuteFunction<
              {
                [x: string]: unknown;
                task_ids?: string[] | undefined;
                timeout_ms?: number | null | undefined;
              },
              any,
              any
            >
          | undefined;
        readonly description?:
          | string
          | ((options: {
              context: any;
              experimental_sandbox?: import('@ai-sdk/provider-utils').Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                [x: string]: unknown;
                task_ids?: string[] | undefined;
                timeout_ms?: number | null | undefined;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type: 'dynamic';
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          task_ids?: string[] | undefined;
          timeout_ms?: number | null | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                task_ids?: string[] | undefined;
                timeout_ms?: number | null | undefined;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  task_ids?: string[] | undefined;
                  timeout_ms?: number | null | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                task_ids?: string[] | undefined;
                timeout_ms?: number | null | undefined;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?: never;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: false;
        readonly supportsDeferredResults?: never;
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          task_ids?: string[] | undefined;
          timeout_ms?: number | null | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                task_ids?: string[] | undefined;
                timeout_ms?: number | null | undefined;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  task_ids?: string[] | undefined;
                  timeout_ms?: number | null | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                task_ids?: string[] | undefined;
                timeout_ms?: number | null | undefined;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?:
          | import('@ai-sdk/provider-utils').ToolExecuteFunction<
              {
                [x: string]: unknown;
                task_ids?: string[] | undefined;
                timeout_ms?: number | null | undefined;
              },
              any,
              any
            >
          | undefined;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: false;
        readonly supportsDeferredResults?: never;
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          task_ids?: string[] | undefined;
          timeout_ms?: number | null | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                task_ids?: string[] | undefined;
                timeout_ms?: number | null | undefined;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  task_ids?: string[] | undefined;
                  timeout_ms?: number | null | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                task_ids?: string[] | undefined;
                timeout_ms?: number | null | undefined;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?: never;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: true;
        readonly supportsDeferredResults?: boolean;
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          task_ids?: string[] | undefined;
          timeout_ms?: number | null | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                task_ids?: string[] | undefined;
                timeout_ms?: number | null | undefined;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  task_ids?: string[] | undefined;
                  timeout_ms?: number | null | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                task_ids?: string[] | undefined;
                timeout_ms?: number | null | undefined;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?:
          | import('@ai-sdk/provider-utils').ToolExecuteFunction<
              {
                [x: string]: unknown;
                task_ids?: string[] | undefined;
                timeout_ms?: number | null | undefined;
              },
              any,
              any
            >
          | undefined;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: true;
        readonly supportsDeferredResults?: boolean;
      };
  readonly spawn_subagent: import('@ai-sdk/provider-utils').Tool<
    {
      [x: string]: unknown;
      prompt: string;
      description: string;
      subagent_type?: string | undefined;
      background?: boolean | undefined;
      capability_mode?:
        'execute' | 'read-only' | 'read-write' | 'all' | null | undefined;
      isolation?: 'none' | 'worktree' | null | undefined;
      resume_from?: string | null | undefined;
      cwd?: string | null | undefined;
      model?: string | null | undefined;
    },
    any,
    any
  >;
  readonly scheduler_create: import('@ai-sdk/provider-utils').Tool<
    {
      [x: string]: unknown;
      task_id?: string | null | undefined;
      interval?: string | null | undefined;
      prompt?: string | null | undefined;
      durable?: boolean | null | undefined;
      foreground?: boolean | null | undefined;
      fire_immediately?: boolean | undefined;
    },
    any,
    any
  >;
  readonly scheduler_delete: import('@ai-sdk/provider-utils').Tool<
    {
      [x: string]: unknown;
      id: string;
    },
    any,
    any
  >;
  readonly scheduler_list:
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?: never;
        readonly description?:
          | string
          | ((options: {
              context: any;
              experimental_sandbox?: import('@ai-sdk/provider-utils').Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                [x: string]: unknown;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type?: undefined | 'function';
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?:
          | import('@ai-sdk/provider-utils').ToolExecuteFunction<
              {
                [x: string]: unknown;
              },
              any,
              any
            >
          | undefined;
        readonly description?:
          | string
          | ((options: {
              context: any;
              experimental_sandbox?: import('@ai-sdk/provider-utils').Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                [x: string]: unknown;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type?: undefined | 'function';
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?: never;
        readonly description?:
          | string
          | ((options: {
              context: any;
              experimental_sandbox?: import('@ai-sdk/provider-utils').Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                [x: string]: unknown;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type: 'dynamic';
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?:
          | import('@ai-sdk/provider-utils').ToolExecuteFunction<
              {
                [x: string]: unknown;
              },
              any,
              any
            >
          | undefined;
        readonly description?:
          | string
          | ((options: {
              context: any;
              experimental_sandbox?: import('@ai-sdk/provider-utils').Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                [x: string]: unknown;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type: 'dynamic';
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?: never;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: false;
        readonly supportsDeferredResults?: never;
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?:
          | import('@ai-sdk/provider-utils').ToolExecuteFunction<
              {
                [x: string]: unknown;
              },
              any,
              any
            >
          | undefined;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: false;
        readonly supportsDeferredResults?: never;
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?: never;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: true;
        readonly supportsDeferredResults?: boolean;
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?:
          | import('@ai-sdk/provider-utils').ToolExecuteFunction<
              {
                [x: string]: unknown;
              },
              any,
              any
            >
          | undefined;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: true;
        readonly supportsDeferredResults?: boolean;
      };
  readonly monitor: import('@ai-sdk/provider-utils').Tool<
    {
      [x: string]: unknown;
      command: string;
      description: string;
      timeout_ms?: number | null | undefined;
      persistent?: boolean | undefined;
    },
    any,
    any
  >;
  readonly search_tool:
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          query: string;
          limit?: number | null | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                query: string;
                limit?: number | null | undefined;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  query: string;
                  limit?: number | null | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                query: string;
                limit?: number | null | undefined;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?: never;
        readonly description?:
          | string
          | ((options: {
              context: any;
              experimental_sandbox?: import('@ai-sdk/provider-utils').Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                [x: string]: unknown;
                query: string;
                limit?: number | null | undefined;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type?: undefined | 'function';
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          query: string;
          limit?: number | null | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                query: string;
                limit?: number | null | undefined;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  query: string;
                  limit?: number | null | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                query: string;
                limit?: number | null | undefined;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?:
          | import('@ai-sdk/provider-utils').ToolExecuteFunction<
              {
                [x: string]: unknown;
                query: string;
                limit?: number | null | undefined;
              },
              any,
              any
            >
          | undefined;
        readonly description?:
          | string
          | ((options: {
              context: any;
              experimental_sandbox?: import('@ai-sdk/provider-utils').Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                [x: string]: unknown;
                query: string;
                limit?: number | null | undefined;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type?: undefined | 'function';
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          query: string;
          limit?: number | null | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                query: string;
                limit?: number | null | undefined;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  query: string;
                  limit?: number | null | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                query: string;
                limit?: number | null | undefined;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?: never;
        readonly description?:
          | string
          | ((options: {
              context: any;
              experimental_sandbox?: import('@ai-sdk/provider-utils').Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                [x: string]: unknown;
                query: string;
                limit?: number | null | undefined;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type: 'dynamic';
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          query: string;
          limit?: number | null | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                query: string;
                limit?: number | null | undefined;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  query: string;
                  limit?: number | null | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                query: string;
                limit?: number | null | undefined;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?:
          | import('@ai-sdk/provider-utils').ToolExecuteFunction<
              {
                [x: string]: unknown;
                query: string;
                limit?: number | null | undefined;
              },
              any,
              any
            >
          | undefined;
        readonly description?:
          | string
          | ((options: {
              context: any;
              experimental_sandbox?: import('@ai-sdk/provider-utils').Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                [x: string]: unknown;
                query: string;
                limit?: number | null | undefined;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type: 'dynamic';
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          query: string;
          limit?: number | null | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                query: string;
                limit?: number | null | undefined;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  query: string;
                  limit?: number | null | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                query: string;
                limit?: number | null | undefined;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?: never;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: false;
        readonly supportsDeferredResults?: never;
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          query: string;
          limit?: number | null | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                query: string;
                limit?: number | null | undefined;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  query: string;
                  limit?: number | null | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                query: string;
                limit?: number | null | undefined;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?:
          | import('@ai-sdk/provider-utils').ToolExecuteFunction<
              {
                [x: string]: unknown;
                query: string;
                limit?: number | null | undefined;
              },
              any,
              any
            >
          | undefined;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: false;
        readonly supportsDeferredResults?: never;
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          query: string;
          limit?: number | null | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                query: string;
                limit?: number | null | undefined;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  query: string;
                  limit?: number | null | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                query: string;
                limit?: number | null | undefined;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?: never;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: true;
        readonly supportsDeferredResults?: boolean;
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          query: string;
          limit?: number | null | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                query: string;
                limit?: number | null | undefined;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  query: string;
                  limit?: number | null | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                query: string;
                limit?: number | null | undefined;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?:
          | import('@ai-sdk/provider-utils').ToolExecuteFunction<
              {
                [x: string]: unknown;
                query: string;
                limit?: number | null | undefined;
              },
              any,
              any
            >
          | undefined;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: true;
        readonly supportsDeferredResults?: boolean;
      };
  readonly use_tool: import('@ai-sdk/provider-utils').Tool<
    {
      [x: string]: unknown;
      tool_name: string;
      tool_input: {
        [x: string]: unknown;
      };
    },
    any,
    any
  >;
  readonly workflow: import('@ai-sdk/provider-utils').Tool<
    {
      [x: string]: unknown;
      agent_budget?: number | null | undefined;
      name?: string | null | undefined;
      script?: string | null | undefined;
      script_path?: string | null | undefined;
      args?: unknown;
      resume_from_run_id?: string | null | undefined;
      validate_only?: boolean | undefined;
    },
    any,
    any
  >;
  readonly enter_plan_mode: import('@ai-sdk/provider-utils').Tool<
    {
      [x: string]: unknown;
    },
    any,
    any
  >;
  readonly exit_plan_mode: import('@ai-sdk/provider-utils').Tool<
    {
      [x: string]: unknown;
    },
    any,
    any
  >;
  readonly image_gen: import('@ai-sdk/provider-utils').Tool<
    {
      [x: string]: unknown;
      prompt: string;
      aspect_ratio?: string | undefined;
    },
    any,
    any
  >;
  readonly image_edit: import('@ai-sdk/provider-utils').Tool<
    {
      [x: string]: unknown;
      prompt: string;
      image: string[];
      aspect_ratio?: string | undefined;
    },
    any,
    any
  >;
  readonly image_to_video: import('@ai-sdk/provider-utils').Tool<
    {
      [x: string]: unknown;
      image: string;
      prompt?: string | null | undefined;
      duration?: number | null | undefined;
      resolution_name?: string | undefined;
    },
    any,
    any
  >;
  readonly reference_to_video: import('@ai-sdk/provider-utils').Tool<
    {
      [x: string]: unknown;
      prompt: string;
      images: string[];
      aspect_ratio: string;
      duration?: number | null | undefined;
      resolution_name?: string | undefined;
    },
    any,
    any
  >;
};
export declare function createGrokBuild(
  settings?: GrokBuildHarnessSettings,
): HarnessV1<typeof GROK_BUILD_BUILTIN_TOOLS>;
export declare const VERSION: string;
export declare const grokBuild: import('./harness.js').HarnessV1<{
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
      },
    any
  >;
  readonly bash: import('./harness.js').HarnessV1BuiltinTool<
    {
      [x: string]: unknown;
      command: string;
      timeout?: number | null | undefined;
      description?: string | undefined;
      background?: boolean | undefined;
    },
    unknown
  >;
  readonly edit: import('./harness.js').HarnessV1BuiltinTool<
    {
      [x: string]: unknown;
      file_path: string;
      old_string: string;
      new_string: string;
      replace_all?: boolean | undefined;
    },
    unknown
  >;
  readonly grep: import('./harness.js').HarnessV1BuiltinTool<
    {
      [x: string]: unknown;
      pattern: string;
      path?: string | null | undefined;
      glob?: string | null | undefined;
      '-B'?: number | undefined;
      '-A'?: number | undefined;
      '-C'?: number | undefined;
      '-i'?: boolean | undefined;
      type?: string | null | undefined;
      head_limit?: number | undefined;
      multiline?: boolean | undefined;
    },
    unknown
  >;
  readonly webSearch: import('./harness.js').HarnessV1BuiltinTool<
    {
      [x: string]: unknown;
      query: string;
      allowed_domains?: string[] | null | undefined;
    },
    unknown
  >;
  readonly write: import('./harness.js').HarnessV1BuiltinTool<
    {
      [x: string]: unknown;
      file_path: string;
      content: string;
    },
    unknown
  >;
  readonly read_file:
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          target_file: string;
          offset?: number | undefined;
          limit?: number | undefined;
          pages?: string | null | undefined;
          format?: string | null | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                target_file: string;
                offset?: number | undefined;
                limit?: number | undefined;
                pages?: string | null | undefined;
                format?: string | null | undefined;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  target_file: string;
                  offset?: number | undefined;
                  limit?: number | undefined;
                  pages?: string | null | undefined;
                  format?: string | null | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                target_file: string;
                offset?: number | undefined;
                limit?: number | undefined;
                pages?: string | null | undefined;
                format?: string | null | undefined;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?: never;
        readonly description?:
          | string
          | ((options: {
              context: any;
              experimental_sandbox?: import('@ai-sdk/provider-utils').Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                [x: string]: unknown;
                target_file: string;
                offset?: number | undefined;
                limit?: number | undefined;
                pages?: string | null | undefined;
                format?: string | null | undefined;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type?: undefined | 'function';
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          target_file: string;
          offset?: number | undefined;
          limit?: number | undefined;
          pages?: string | null | undefined;
          format?: string | null | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                target_file: string;
                offset?: number | undefined;
                limit?: number | undefined;
                pages?: string | null | undefined;
                format?: string | null | undefined;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  target_file: string;
                  offset?: number | undefined;
                  limit?: number | undefined;
                  pages?: string | null | undefined;
                  format?: string | null | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                target_file: string;
                offset?: number | undefined;
                limit?: number | undefined;
                pages?: string | null | undefined;
                format?: string | null | undefined;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?:
          | import('@ai-sdk/provider-utils').ToolExecuteFunction<
              {
                [x: string]: unknown;
                target_file: string;
                offset?: number | undefined;
                limit?: number | undefined;
                pages?: string | null | undefined;
                format?: string | null | undefined;
              },
              any,
              any
            >
          | undefined;
        readonly description?:
          | string
          | ((options: {
              context: any;
              experimental_sandbox?: import('@ai-sdk/provider-utils').Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                [x: string]: unknown;
                target_file: string;
                offset?: number | undefined;
                limit?: number | undefined;
                pages?: string | null | undefined;
                format?: string | null | undefined;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type?: undefined | 'function';
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          target_file: string;
          offset?: number | undefined;
          limit?: number | undefined;
          pages?: string | null | undefined;
          format?: string | null | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                target_file: string;
                offset?: number | undefined;
                limit?: number | undefined;
                pages?: string | null | undefined;
                format?: string | null | undefined;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  target_file: string;
                  offset?: number | undefined;
                  limit?: number | undefined;
                  pages?: string | null | undefined;
                  format?: string | null | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                target_file: string;
                offset?: number | undefined;
                limit?: number | undefined;
                pages?: string | null | undefined;
                format?: string | null | undefined;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?: never;
        readonly description?:
          | string
          | ((options: {
              context: any;
              experimental_sandbox?: import('@ai-sdk/provider-utils').Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                [x: string]: unknown;
                target_file: string;
                offset?: number | undefined;
                limit?: number | undefined;
                pages?: string | null | undefined;
                format?: string | null | undefined;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type: 'dynamic';
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          target_file: string;
          offset?: number | undefined;
          limit?: number | undefined;
          pages?: string | null | undefined;
          format?: string | null | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                target_file: string;
                offset?: number | undefined;
                limit?: number | undefined;
                pages?: string | null | undefined;
                format?: string | null | undefined;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  target_file: string;
                  offset?: number | undefined;
                  limit?: number | undefined;
                  pages?: string | null | undefined;
                  format?: string | null | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                target_file: string;
                offset?: number | undefined;
                limit?: number | undefined;
                pages?: string | null | undefined;
                format?: string | null | undefined;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?:
          | import('@ai-sdk/provider-utils').ToolExecuteFunction<
              {
                [x: string]: unknown;
                target_file: string;
                offset?: number | undefined;
                limit?: number | undefined;
                pages?: string | null | undefined;
                format?: string | null | undefined;
              },
              any,
              any
            >
          | undefined;
        readonly description?:
          | string
          | ((options: {
              context: any;
              experimental_sandbox?: import('@ai-sdk/provider-utils').Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                [x: string]: unknown;
                target_file: string;
                offset?: number | undefined;
                limit?: number | undefined;
                pages?: string | null | undefined;
                format?: string | null | undefined;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type: 'dynamic';
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          target_file: string;
          offset?: number | undefined;
          limit?: number | undefined;
          pages?: string | null | undefined;
          format?: string | null | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                target_file: string;
                offset?: number | undefined;
                limit?: number | undefined;
                pages?: string | null | undefined;
                format?: string | null | undefined;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  target_file: string;
                  offset?: number | undefined;
                  limit?: number | undefined;
                  pages?: string | null | undefined;
                  format?: string | null | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                target_file: string;
                offset?: number | undefined;
                limit?: number | undefined;
                pages?: string | null | undefined;
                format?: string | null | undefined;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?: never;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: false;
        readonly supportsDeferredResults?: never;
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          target_file: string;
          offset?: number | undefined;
          limit?: number | undefined;
          pages?: string | null | undefined;
          format?: string | null | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                target_file: string;
                offset?: number | undefined;
                limit?: number | undefined;
                pages?: string | null | undefined;
                format?: string | null | undefined;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  target_file: string;
                  offset?: number | undefined;
                  limit?: number | undefined;
                  pages?: string | null | undefined;
                  format?: string | null | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                target_file: string;
                offset?: number | undefined;
                limit?: number | undefined;
                pages?: string | null | undefined;
                format?: string | null | undefined;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?:
          | import('@ai-sdk/provider-utils').ToolExecuteFunction<
              {
                [x: string]: unknown;
                target_file: string;
                offset?: number | undefined;
                limit?: number | undefined;
                pages?: string | null | undefined;
                format?: string | null | undefined;
              },
              any,
              any
            >
          | undefined;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: false;
        readonly supportsDeferredResults?: never;
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          target_file: string;
          offset?: number | undefined;
          limit?: number | undefined;
          pages?: string | null | undefined;
          format?: string | null | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                target_file: string;
                offset?: number | undefined;
                limit?: number | undefined;
                pages?: string | null | undefined;
                format?: string | null | undefined;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  target_file: string;
                  offset?: number | undefined;
                  limit?: number | undefined;
                  pages?: string | null | undefined;
                  format?: string | null | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                target_file: string;
                offset?: number | undefined;
                limit?: number | undefined;
                pages?: string | null | undefined;
                format?: string | null | undefined;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?: never;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: true;
        readonly supportsDeferredResults?: boolean;
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          target_file: string;
          offset?: number | undefined;
          limit?: number | undefined;
          pages?: string | null | undefined;
          format?: string | null | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                target_file: string;
                offset?: number | undefined;
                limit?: number | undefined;
                pages?: string | null | undefined;
                format?: string | null | undefined;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  target_file: string;
                  offset?: number | undefined;
                  limit?: number | undefined;
                  pages?: string | null | undefined;
                  format?: string | null | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                target_file: string;
                offset?: number | undefined;
                limit?: number | undefined;
                pages?: string | null | undefined;
                format?: string | null | undefined;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?:
          | import('@ai-sdk/provider-utils').ToolExecuteFunction<
              {
                [x: string]: unknown;
                target_file: string;
                offset?: number | undefined;
                limit?: number | undefined;
                pages?: string | null | undefined;
                format?: string | null | undefined;
              },
              any,
              any
            >
          | undefined;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: true;
        readonly supportsDeferredResults?: boolean;
      };
  readonly list_dir:
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          target_directory: string;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                target_directory: string;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  target_directory: string;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                target_directory: string;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?: never;
        readonly description?:
          | string
          | ((options: {
              context: any;
              experimental_sandbox?: import('@ai-sdk/provider-utils').Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                [x: string]: unknown;
                target_directory: string;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type?: undefined | 'function';
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          target_directory: string;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                target_directory: string;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  target_directory: string;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                target_directory: string;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?:
          | import('@ai-sdk/provider-utils').ToolExecuteFunction<
              {
                [x: string]: unknown;
                target_directory: string;
              },
              any,
              any
            >
          | undefined;
        readonly description?:
          | string
          | ((options: {
              context: any;
              experimental_sandbox?: import('@ai-sdk/provider-utils').Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                [x: string]: unknown;
                target_directory: string;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type?: undefined | 'function';
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          target_directory: string;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                target_directory: string;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  target_directory: string;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                target_directory: string;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?: never;
        readonly description?:
          | string
          | ((options: {
              context: any;
              experimental_sandbox?: import('@ai-sdk/provider-utils').Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                [x: string]: unknown;
                target_directory: string;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type: 'dynamic';
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          target_directory: string;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                target_directory: string;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  target_directory: string;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                target_directory: string;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?:
          | import('@ai-sdk/provider-utils').ToolExecuteFunction<
              {
                [x: string]: unknown;
                target_directory: string;
              },
              any,
              any
            >
          | undefined;
        readonly description?:
          | string
          | ((options: {
              context: any;
              experimental_sandbox?: import('@ai-sdk/provider-utils').Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                [x: string]: unknown;
                target_directory: string;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type: 'dynamic';
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          target_directory: string;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                target_directory: string;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  target_directory: string;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                target_directory: string;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?: never;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: false;
        readonly supportsDeferredResults?: never;
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          target_directory: string;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                target_directory: string;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  target_directory: string;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                target_directory: string;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?:
          | import('@ai-sdk/provider-utils').ToolExecuteFunction<
              {
                [x: string]: unknown;
                target_directory: string;
              },
              any,
              any
            >
          | undefined;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: false;
        readonly supportsDeferredResults?: never;
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          target_directory: string;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                target_directory: string;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  target_directory: string;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                target_directory: string;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?: never;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: true;
        readonly supportsDeferredResults?: boolean;
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          target_directory: string;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                target_directory: string;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  target_directory: string;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                target_directory: string;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?:
          | import('@ai-sdk/provider-utils').ToolExecuteFunction<
              {
                [x: string]: unknown;
                target_directory: string;
              },
              any,
              any
            >
          | undefined;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: true;
        readonly supportsDeferredResults?: boolean;
      };
  readonly kill_command_or_subagent: import('@ai-sdk/provider-utils').Tool<
    {
      [x: string]: unknown;
      task_id: string;
    },
    any,
    any
  >;
  readonly todo_write: import('@ai-sdk/provider-utils').Tool<
    {
      [x: string]: unknown;
      todos: {
        [x: string]: unknown;
        id: string;
        content?: string | null | undefined;
        status?:
          | 'pending'
          | 'in_progress'
          | 'completed'
          | 'cancelled'
          | null
          | undefined;
      }[];
      merge?: boolean | undefined;
    },
    any,
    any
  >;
  readonly get_command_or_subagent_output:
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          task_ids?: string[] | undefined;
          timeout_ms?: number | null | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                task_ids?: string[] | undefined;
                timeout_ms?: number | null | undefined;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  task_ids?: string[] | undefined;
                  timeout_ms?: number | null | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                task_ids?: string[] | undefined;
                timeout_ms?: number | null | undefined;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?: never;
        readonly description?:
          | string
          | ((options: {
              context: any;
              experimental_sandbox?: import('@ai-sdk/provider-utils').Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                [x: string]: unknown;
                task_ids?: string[] | undefined;
                timeout_ms?: number | null | undefined;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type?: undefined | 'function';
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          task_ids?: string[] | undefined;
          timeout_ms?: number | null | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                task_ids?: string[] | undefined;
                timeout_ms?: number | null | undefined;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  task_ids?: string[] | undefined;
                  timeout_ms?: number | null | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                task_ids?: string[] | undefined;
                timeout_ms?: number | null | undefined;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?:
          | import('@ai-sdk/provider-utils').ToolExecuteFunction<
              {
                [x: string]: unknown;
                task_ids?: string[] | undefined;
                timeout_ms?: number | null | undefined;
              },
              any,
              any
            >
          | undefined;
        readonly description?:
          | string
          | ((options: {
              context: any;
              experimental_sandbox?: import('@ai-sdk/provider-utils').Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                [x: string]: unknown;
                task_ids?: string[] | undefined;
                timeout_ms?: number | null | undefined;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type?: undefined | 'function';
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          task_ids?: string[] | undefined;
          timeout_ms?: number | null | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                task_ids?: string[] | undefined;
                timeout_ms?: number | null | undefined;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  task_ids?: string[] | undefined;
                  timeout_ms?: number | null | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                task_ids?: string[] | undefined;
                timeout_ms?: number | null | undefined;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?: never;
        readonly description?:
          | string
          | ((options: {
              context: any;
              experimental_sandbox?: import('@ai-sdk/provider-utils').Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                [x: string]: unknown;
                task_ids?: string[] | undefined;
                timeout_ms?: number | null | undefined;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type: 'dynamic';
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          task_ids?: string[] | undefined;
          timeout_ms?: number | null | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                task_ids?: string[] | undefined;
                timeout_ms?: number | null | undefined;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  task_ids?: string[] | undefined;
                  timeout_ms?: number | null | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                task_ids?: string[] | undefined;
                timeout_ms?: number | null | undefined;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?:
          | import('@ai-sdk/provider-utils').ToolExecuteFunction<
              {
                [x: string]: unknown;
                task_ids?: string[] | undefined;
                timeout_ms?: number | null | undefined;
              },
              any,
              any
            >
          | undefined;
        readonly description?:
          | string
          | ((options: {
              context: any;
              experimental_sandbox?: import('@ai-sdk/provider-utils').Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                [x: string]: unknown;
                task_ids?: string[] | undefined;
                timeout_ms?: number | null | undefined;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type: 'dynamic';
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          task_ids?: string[] | undefined;
          timeout_ms?: number | null | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                task_ids?: string[] | undefined;
                timeout_ms?: number | null | undefined;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  task_ids?: string[] | undefined;
                  timeout_ms?: number | null | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                task_ids?: string[] | undefined;
                timeout_ms?: number | null | undefined;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?: never;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: false;
        readonly supportsDeferredResults?: never;
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          task_ids?: string[] | undefined;
          timeout_ms?: number | null | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                task_ids?: string[] | undefined;
                timeout_ms?: number | null | undefined;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  task_ids?: string[] | undefined;
                  timeout_ms?: number | null | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                task_ids?: string[] | undefined;
                timeout_ms?: number | null | undefined;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?:
          | import('@ai-sdk/provider-utils').ToolExecuteFunction<
              {
                [x: string]: unknown;
                task_ids?: string[] | undefined;
                timeout_ms?: number | null | undefined;
              },
              any,
              any
            >
          | undefined;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: false;
        readonly supportsDeferredResults?: never;
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          task_ids?: string[] | undefined;
          timeout_ms?: number | null | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                task_ids?: string[] | undefined;
                timeout_ms?: number | null | undefined;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  task_ids?: string[] | undefined;
                  timeout_ms?: number | null | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                task_ids?: string[] | undefined;
                timeout_ms?: number | null | undefined;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?: never;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: true;
        readonly supportsDeferredResults?: boolean;
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          task_ids?: string[] | undefined;
          timeout_ms?: number | null | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                task_ids?: string[] | undefined;
                timeout_ms?: number | null | undefined;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  task_ids?: string[] | undefined;
                  timeout_ms?: number | null | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                task_ids?: string[] | undefined;
                timeout_ms?: number | null | undefined;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?:
          | import('@ai-sdk/provider-utils').ToolExecuteFunction<
              {
                [x: string]: unknown;
                task_ids?: string[] | undefined;
                timeout_ms?: number | null | undefined;
              },
              any,
              any
            >
          | undefined;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: true;
        readonly supportsDeferredResults?: boolean;
      };
  readonly spawn_subagent: import('@ai-sdk/provider-utils').Tool<
    {
      [x: string]: unknown;
      prompt: string;
      description: string;
      subagent_type?: string | undefined;
      background?: boolean | undefined;
      capability_mode?:
        'execute' | 'read-only' | 'read-write' | 'all' | null | undefined;
      isolation?: 'none' | 'worktree' | null | undefined;
      resume_from?: string | null | undefined;
      cwd?: string | null | undefined;
      model?: string | null | undefined;
    },
    any,
    any
  >;
  readonly scheduler_create: import('@ai-sdk/provider-utils').Tool<
    {
      [x: string]: unknown;
      task_id?: string | null | undefined;
      interval?: string | null | undefined;
      prompt?: string | null | undefined;
      durable?: boolean | null | undefined;
      foreground?: boolean | null | undefined;
      fire_immediately?: boolean | undefined;
    },
    any,
    any
  >;
  readonly scheduler_delete: import('@ai-sdk/provider-utils').Tool<
    {
      [x: string]: unknown;
      id: string;
    },
    any,
    any
  >;
  readonly scheduler_list:
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?: never;
        readonly description?:
          | string
          | ((options: {
              context: any;
              experimental_sandbox?: import('@ai-sdk/provider-utils').Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                [x: string]: unknown;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type?: undefined | 'function';
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?:
          | import('@ai-sdk/provider-utils').ToolExecuteFunction<
              {
                [x: string]: unknown;
              },
              any,
              any
            >
          | undefined;
        readonly description?:
          | string
          | ((options: {
              context: any;
              experimental_sandbox?: import('@ai-sdk/provider-utils').Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                [x: string]: unknown;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type?: undefined | 'function';
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?: never;
        readonly description?:
          | string
          | ((options: {
              context: any;
              experimental_sandbox?: import('@ai-sdk/provider-utils').Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                [x: string]: unknown;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type: 'dynamic';
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?:
          | import('@ai-sdk/provider-utils').ToolExecuteFunction<
              {
                [x: string]: unknown;
              },
              any,
              any
            >
          | undefined;
        readonly description?:
          | string
          | ((options: {
              context: any;
              experimental_sandbox?: import('@ai-sdk/provider-utils').Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                [x: string]: unknown;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type: 'dynamic';
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?: never;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: false;
        readonly supportsDeferredResults?: never;
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?:
          | import('@ai-sdk/provider-utils').ToolExecuteFunction<
              {
                [x: string]: unknown;
              },
              any,
              any
            >
          | undefined;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: false;
        readonly supportsDeferredResults?: never;
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?: never;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: true;
        readonly supportsDeferredResults?: boolean;
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?:
          | import('@ai-sdk/provider-utils').ToolExecuteFunction<
              {
                [x: string]: unknown;
              },
              any,
              any
            >
          | undefined;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: true;
        readonly supportsDeferredResults?: boolean;
      };
  readonly monitor: import('@ai-sdk/provider-utils').Tool<
    {
      [x: string]: unknown;
      command: string;
      description: string;
      timeout_ms?: number | null | undefined;
      persistent?: boolean | undefined;
    },
    any,
    any
  >;
  readonly search_tool:
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          query: string;
          limit?: number | null | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                query: string;
                limit?: number | null | undefined;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  query: string;
                  limit?: number | null | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                query: string;
                limit?: number | null | undefined;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?: never;
        readonly description?:
          | string
          | ((options: {
              context: any;
              experimental_sandbox?: import('@ai-sdk/provider-utils').Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                [x: string]: unknown;
                query: string;
                limit?: number | null | undefined;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type?: undefined | 'function';
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          query: string;
          limit?: number | null | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                query: string;
                limit?: number | null | undefined;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  query: string;
                  limit?: number | null | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                query: string;
                limit?: number | null | undefined;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?:
          | import('@ai-sdk/provider-utils').ToolExecuteFunction<
              {
                [x: string]: unknown;
                query: string;
                limit?: number | null | undefined;
              },
              any,
              any
            >
          | undefined;
        readonly description?:
          | string
          | ((options: {
              context: any;
              experimental_sandbox?: import('@ai-sdk/provider-utils').Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                [x: string]: unknown;
                query: string;
                limit?: number | null | undefined;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type?: undefined | 'function';
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          query: string;
          limit?: number | null | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                query: string;
                limit?: number | null | undefined;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  query: string;
                  limit?: number | null | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                query: string;
                limit?: number | null | undefined;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?: never;
        readonly description?:
          | string
          | ((options: {
              context: any;
              experimental_sandbox?: import('@ai-sdk/provider-utils').Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                [x: string]: unknown;
                query: string;
                limit?: number | null | undefined;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type: 'dynamic';
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          query: string;
          limit?: number | null | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                query: string;
                limit?: number | null | undefined;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  query: string;
                  limit?: number | null | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                query: string;
                limit?: number | null | undefined;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?:
          | import('@ai-sdk/provider-utils').ToolExecuteFunction<
              {
                [x: string]: unknown;
                query: string;
                limit?: number | null | undefined;
              },
              any,
              any
            >
          | undefined;
        readonly description?:
          | string
          | ((options: {
              context: any;
              experimental_sandbox?: import('@ai-sdk/provider-utils').Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                [x: string]: unknown;
                query: string;
                limit?: number | null | undefined;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type: 'dynamic';
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          query: string;
          limit?: number | null | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                query: string;
                limit?: number | null | undefined;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  query: string;
                  limit?: number | null | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                query: string;
                limit?: number | null | undefined;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?: never;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: false;
        readonly supportsDeferredResults?: never;
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          query: string;
          limit?: number | null | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                query: string;
                limit?: number | null | undefined;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  query: string;
                  limit?: number | null | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                query: string;
                limit?: number | null | undefined;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?:
          | import('@ai-sdk/provider-utils').ToolExecuteFunction<
              {
                [x: string]: unknown;
                query: string;
                limit?: number | null | undefined;
              },
              any,
              any
            >
          | undefined;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: false;
        readonly supportsDeferredResults?: never;
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          query: string;
          limit?: number | null | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                query: string;
                limit?: number | null | undefined;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  query: string;
                  limit?: number | null | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                query: string;
                limit?: number | null | undefined;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?: never;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: true;
        readonly supportsDeferredResults?: boolean;
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          query: string;
          limit?: number | null | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                query: string;
                limit?: number | null | undefined;
              },
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  [x: string]: unknown;
                  query: string;
                  limit?: number | null | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                query: string;
                limit?: number | null | undefined;
              };
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?:
          | import('@ai-sdk/provider-utils').ToolExecuteFunction<
              {
                [x: string]: unknown;
                query: string;
                limit?: number | null | undefined;
              },
              any,
              any
            >
          | undefined;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: true;
        readonly supportsDeferredResults?: boolean;
      };
  readonly use_tool: import('@ai-sdk/provider-utils').Tool<
    {
      [x: string]: unknown;
      tool_name: string;
      tool_input: {
        [x: string]: unknown;
      };
    },
    any,
    any
  >;
  readonly workflow: import('@ai-sdk/provider-utils').Tool<
    {
      [x: string]: unknown;
      agent_budget?: number | null | undefined;
      name?: string | null | undefined;
      script?: string | null | undefined;
      script_path?: string | null | undefined;
      args?: unknown;
      resume_from_run_id?: string | null | undefined;
      validate_only?: boolean | undefined;
    },
    any,
    any
  >;
  readonly enter_plan_mode: import('@ai-sdk/provider-utils').Tool<
    {
      [x: string]: unknown;
    },
    any,
    any
  >;
  readonly exit_plan_mode: import('@ai-sdk/provider-utils').Tool<
    {
      [x: string]: unknown;
    },
    any,
    any
  >;
  readonly image_gen: import('@ai-sdk/provider-utils').Tool<
    {
      [x: string]: unknown;
      prompt: string;
      aspect_ratio?: string | undefined;
    },
    any,
    any
  >;
  readonly image_edit: import('@ai-sdk/provider-utils').Tool<
    {
      [x: string]: unknown;
      prompt: string;
      image: string[];
      aspect_ratio?: string | undefined;
    },
    any,
    any
  >;
  readonly image_to_video: import('@ai-sdk/provider-utils').Tool<
    {
      [x: string]: unknown;
      image: string;
      prompt?: string | null | undefined;
      duration?: number | null | undefined;
      resolution_name?: string | undefined;
    },
    any,
    any
  >;
  readonly reference_to_video: import('@ai-sdk/provider-utils').Tool<
    {
      [x: string]: unknown;
      prompt: string;
      images: string[];
      aspect_ratio: string;
      duration?: number | null | undefined;
      resolution_name?: string | undefined;
    },
    any,
    any
  >;
}>;
export type {
  GrokBuildAuthenticationMode,
  GrokBuildHarnessSettings,
  JSONObject,
};
