// Generated from @ai-sdk/harness-codex in @ai-sdk/harness-codex@1.0.195. Do not edit.
// Original license: harness.LICENSE.
// Normalize Zod v4 declarations for the Zod 3.25.76 bridge.
import {
  HarnessV1,
  HarnessV1Authentication,
  HarnessV1BuiltinTool,
  HarnessV1CredentialForwarding,
  HarnessV1MintBridgeTokenCallback,
  HarnessV1PortEndpoint,
} from './harness.js';
import { SandboxChannelReconnectOptions } from './harness-utils.js';
import { Experimental_SandboxSession } from '@ai-sdk/provider-utils';
import { JSONObject } from '@ai-sdk/provider';
type CodexAuthenticationMode = HarnessV1Authentication;
type CodexHarnessSettings = {
  readonly auth?: CodexAuthenticationMode;
  readonly credentialForwarding?: HarnessV1CredentialForwarding;
  readonly codexConfig?: Record<string, unknown>;
  readonly mcpServers?: Record<string, unknown>;
  readonly reasoningEffort?: 'low' | 'medium' | 'high' | 'xhigh' | 'max';
  readonly webSearch?: boolean;
  readonly port?: number;
  readonly portEndpoint?: HarnessV1PortEndpoint;
  readonly startupTimeoutMs?: number;
  readonly hostDisconnectTimeoutMs?: number;
  readonly reconnect?: SandboxChannelReconnectOptions;
  readonly keepAliveMs?: number;
  readonly mintBridgeToken?: HarnessV1MintBridgeTokenCallback;
};
declare const CODEX_BUILTIN_TOOLS: {
  readonly bash: HarnessV1BuiltinTool<
    {
      command: string;
    },
    unknown
  >;
  readonly webSearch: HarnessV1BuiltinTool<
    {
      query: string;
    },
    unknown
  >;
  readonly apply_patch:
    | {
        readonly toolUseKind: 'edit';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<string>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              string,
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
                input: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: string;
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
              experimental_sandbox?: Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: string;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type?: undefined | 'function';
      }
    | {
        readonly toolUseKind: 'edit';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<string>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              string,
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
                input: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: string;
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?:
          | import('@ai-sdk/provider-utils').ToolExecuteFunction<
              string,
              any,
              any
            >
          | undefined;
        readonly description?:
          | string
          | ((options: {
              context: any;
              experimental_sandbox?: Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: string;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type?: undefined | 'function';
      }
    | {
        readonly toolUseKind: 'edit';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<string>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              string,
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
                input: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: string;
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
              experimental_sandbox?: Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: string;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type: 'dynamic';
      }
    | {
        readonly toolUseKind: 'edit';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<string>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              string,
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
                input: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: string;
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?:
          | import('@ai-sdk/provider-utils').ToolExecuteFunction<
              string,
              any,
              any
            >
          | undefined;
        readonly description?:
          | string
          | ((options: {
              context: any;
              experimental_sandbox?: Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: string;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type: 'dynamic';
      }
    | {
        readonly toolUseKind: 'edit';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<string>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              string,
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
                input: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: string;
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
        readonly toolUseKind: 'edit';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<string>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              string,
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
                input: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: string;
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?:
          | import('@ai-sdk/provider-utils').ToolExecuteFunction<
              string,
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
        readonly toolUseKind: 'edit';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<string>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              string,
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
                input: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: string;
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
        readonly toolUseKind: 'edit';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<string>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              string,
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
                input: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: string;
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?:
          | import('@ai-sdk/provider-utils').ToolExecuteFunction<
              string,
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
  readonly view_image:
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          path: string;
          detail?: 'high' | 'original' | undefined;
          environment_id?: string | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                path: string;
                detail?: 'high' | 'original' | undefined;
                environment_id?: string | undefined;
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
                  path: string;
                  detail?: 'high' | 'original' | undefined;
                  environment_id?: string | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                path: string;
                detail?: 'high' | 'original' | undefined;
                environment_id?: string | undefined;
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
              experimental_sandbox?: Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                path: string;
                detail?: 'high' | 'original' | undefined;
                environment_id?: string | undefined;
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
          path: string;
          detail?: 'high' | 'original' | undefined;
          environment_id?: string | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                path: string;
                detail?: 'high' | 'original' | undefined;
                environment_id?: string | undefined;
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
                  path: string;
                  detail?: 'high' | 'original' | undefined;
                  environment_id?: string | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                path: string;
                detail?: 'high' | 'original' | undefined;
                environment_id?: string | undefined;
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
                path: string;
                detail?: 'high' | 'original' | undefined;
                environment_id?: string | undefined;
              },
              any,
              any
            >
          | undefined;
        readonly description?:
          | string
          | ((options: {
              context: any;
              experimental_sandbox?: Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                path: string;
                detail?: 'high' | 'original' | undefined;
                environment_id?: string | undefined;
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
          path: string;
          detail?: 'high' | 'original' | undefined;
          environment_id?: string | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                path: string;
                detail?: 'high' | 'original' | undefined;
                environment_id?: string | undefined;
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
                  path: string;
                  detail?: 'high' | 'original' | undefined;
                  environment_id?: string | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                path: string;
                detail?: 'high' | 'original' | undefined;
                environment_id?: string | undefined;
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
              experimental_sandbox?: Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                path: string;
                detail?: 'high' | 'original' | undefined;
                environment_id?: string | undefined;
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
          path: string;
          detail?: 'high' | 'original' | undefined;
          environment_id?: string | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                path: string;
                detail?: 'high' | 'original' | undefined;
                environment_id?: string | undefined;
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
                  path: string;
                  detail?: 'high' | 'original' | undefined;
                  environment_id?: string | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                path: string;
                detail?: 'high' | 'original' | undefined;
                environment_id?: string | undefined;
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
                path: string;
                detail?: 'high' | 'original' | undefined;
                environment_id?: string | undefined;
              },
              any,
              any
            >
          | undefined;
        readonly description?:
          | string
          | ((options: {
              context: any;
              experimental_sandbox?: Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                path: string;
                detail?: 'high' | 'original' | undefined;
                environment_id?: string | undefined;
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
          path: string;
          detail?: 'high' | 'original' | undefined;
          environment_id?: string | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                path: string;
                detail?: 'high' | 'original' | undefined;
                environment_id?: string | undefined;
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
                  path: string;
                  detail?: 'high' | 'original' | undefined;
                  environment_id?: string | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                path: string;
                detail?: 'high' | 'original' | undefined;
                environment_id?: string | undefined;
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
          path: string;
          detail?: 'high' | 'original' | undefined;
          environment_id?: string | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                path: string;
                detail?: 'high' | 'original' | undefined;
                environment_id?: string | undefined;
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
                  path: string;
                  detail?: 'high' | 'original' | undefined;
                  environment_id?: string | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                path: string;
                detail?: 'high' | 'original' | undefined;
                environment_id?: string | undefined;
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
                path: string;
                detail?: 'high' | 'original' | undefined;
                environment_id?: string | undefined;
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
          path: string;
          detail?: 'high' | 'original' | undefined;
          environment_id?: string | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                path: string;
                detail?: 'high' | 'original' | undefined;
                environment_id?: string | undefined;
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
                  path: string;
                  detail?: 'high' | 'original' | undefined;
                  environment_id?: string | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                path: string;
                detail?: 'high' | 'original' | undefined;
                environment_id?: string | undefined;
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
          path: string;
          detail?: 'high' | 'original' | undefined;
          environment_id?: string | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                path: string;
                detail?: 'high' | 'original' | undefined;
                environment_id?: string | undefined;
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
                  path: string;
                  detail?: 'high' | 'original' | undefined;
                  environment_id?: string | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                path: string;
                detail?: 'high' | 'original' | undefined;
                environment_id?: string | undefined;
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
                path: string;
                detail?: 'high' | 'original' | undefined;
                environment_id?: string | undefined;
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
};
export declare function createCodex(
  settings?: CodexHarnessSettings,
): HarnessV1<typeof CODEX_BUILTIN_TOOLS>;
export declare const VERSION: string;
export declare const codex: import('./harness.js').HarnessV1<{
  readonly bash: import('./harness.js').HarnessV1BuiltinTool<
    {
      command: string;
    },
    unknown
  >;
  readonly webSearch: import('./harness.js').HarnessV1BuiltinTool<
    {
      query: string;
    },
    unknown
  >;
  readonly apply_patch:
    | {
        readonly toolUseKind: 'edit';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<string>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              string,
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
                input: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: string;
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
              input: string;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type?: undefined | 'function';
      }
    | {
        readonly toolUseKind: 'edit';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<string>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              string,
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
                input: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: string;
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?:
          | import('@ai-sdk/provider-utils').ToolExecuteFunction<
              string,
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
              input: string;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type?: undefined | 'function';
      }
    | {
        readonly toolUseKind: 'edit';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<string>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              string,
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
                input: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: string;
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
              input: string;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type: 'dynamic';
      }
    | {
        readonly toolUseKind: 'edit';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<string>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              string,
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
                input: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: string;
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?:
          | import('@ai-sdk/provider-utils').ToolExecuteFunction<
              string,
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
              input: string;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type: 'dynamic';
      }
    | {
        readonly toolUseKind: 'edit';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<string>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              string,
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
                input: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: string;
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
        readonly toolUseKind: 'edit';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<string>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              string,
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
                input: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: string;
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?:
          | import('@ai-sdk/provider-utils').ToolExecuteFunction<
              string,
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
        readonly toolUseKind: 'edit';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<string>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              string,
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
                input: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: string;
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
        readonly toolUseKind: 'edit';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<string>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              string,
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
                input: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: string;
              output: any;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly execute?:
          | import('@ai-sdk/provider-utils').ToolExecuteFunction<
              string,
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
  readonly view_image:
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          path: string;
          detail?: 'high' | 'original' | undefined;
          environment_id?: string | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                path: string;
                detail?: 'high' | 'original' | undefined;
                environment_id?: string | undefined;
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
                  path: string;
                  detail?: 'high' | 'original' | undefined;
                  environment_id?: string | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                path: string;
                detail?: 'high' | 'original' | undefined;
                environment_id?: string | undefined;
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
                path: string;
                detail?: 'high' | 'original' | undefined;
                environment_id?: string | undefined;
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
          path: string;
          detail?: 'high' | 'original' | undefined;
          environment_id?: string | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                path: string;
                detail?: 'high' | 'original' | undefined;
                environment_id?: string | undefined;
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
                  path: string;
                  detail?: 'high' | 'original' | undefined;
                  environment_id?: string | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                path: string;
                detail?: 'high' | 'original' | undefined;
                environment_id?: string | undefined;
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
                path: string;
                detail?: 'high' | 'original' | undefined;
                environment_id?: string | undefined;
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
                path: string;
                detail?: 'high' | 'original' | undefined;
                environment_id?: string | undefined;
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
          path: string;
          detail?: 'high' | 'original' | undefined;
          environment_id?: string | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                path: string;
                detail?: 'high' | 'original' | undefined;
                environment_id?: string | undefined;
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
                  path: string;
                  detail?: 'high' | 'original' | undefined;
                  environment_id?: string | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                path: string;
                detail?: 'high' | 'original' | undefined;
                environment_id?: string | undefined;
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
                path: string;
                detail?: 'high' | 'original' | undefined;
                environment_id?: string | undefined;
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
          path: string;
          detail?: 'high' | 'original' | undefined;
          environment_id?: string | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                path: string;
                detail?: 'high' | 'original' | undefined;
                environment_id?: string | undefined;
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
                  path: string;
                  detail?: 'high' | 'original' | undefined;
                  environment_id?: string | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                path: string;
                detail?: 'high' | 'original' | undefined;
                environment_id?: string | undefined;
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
                path: string;
                detail?: 'high' | 'original' | undefined;
                environment_id?: string | undefined;
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
                path: string;
                detail?: 'high' | 'original' | undefined;
                environment_id?: string | undefined;
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
          path: string;
          detail?: 'high' | 'original' | undefined;
          environment_id?: string | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                path: string;
                detail?: 'high' | 'original' | undefined;
                environment_id?: string | undefined;
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
                  path: string;
                  detail?: 'high' | 'original' | undefined;
                  environment_id?: string | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                path: string;
                detail?: 'high' | 'original' | undefined;
                environment_id?: string | undefined;
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
          path: string;
          detail?: 'high' | 'original' | undefined;
          environment_id?: string | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                path: string;
                detail?: 'high' | 'original' | undefined;
                environment_id?: string | undefined;
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
                  path: string;
                  detail?: 'high' | 'original' | undefined;
                  environment_id?: string | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                path: string;
                detail?: 'high' | 'original' | undefined;
                environment_id?: string | undefined;
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
                path: string;
                detail?: 'high' | 'original' | undefined;
                environment_id?: string | undefined;
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
          path: string;
          detail?: 'high' | 'original' | undefined;
          environment_id?: string | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                path: string;
                detail?: 'high' | 'original' | undefined;
                environment_id?: string | undefined;
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
                  path: string;
                  detail?: 'high' | 'original' | undefined;
                  environment_id?: string | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                path: string;
                detail?: 'high' | 'original' | undefined;
                environment_id?: string | undefined;
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
          path: string;
          detail?: 'high' | 'original' | undefined;
          environment_id?: string | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                path: string;
                detail?: 'high' | 'original' | undefined;
                environment_id?: string | undefined;
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
                  path: string;
                  detail?: 'high' | 'original' | undefined;
                  environment_id?: string | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                path: string;
                detail?: 'high' | 'original' | undefined;
                environment_id?: string | undefined;
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
                path: string;
                detail?: 'high' | 'original' | undefined;
                environment_id?: string | undefined;
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
}>;
export type { CodexAuthenticationMode, CodexHarnessSettings, JSONObject };
