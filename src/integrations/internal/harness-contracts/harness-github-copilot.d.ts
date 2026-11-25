// Generated from @ai-sdk/harness-github-copilot in @ai-sdk/harness-github-copilot@1.0.90. Do not edit.
// Original license: harness.LICENSE.
// Normalize Zod v4 declarations for the Zod 3.25.76 bridge.
import {
  HarnessV1,
  HarnessV1CredentialForwarding,
  HarnessV1MintBridgeTokenCallback,
  HarnessV1PortEndpoint,
} from './harness.js';
import { SandboxChannelReconnectOptions } from './harness-utils.js';
import { ACPAuthenticationMode } from './harness-acp.js';
import { JSONObject } from '@ai-sdk/provider';
type GitHubCopilotAuthenticationMode = ACPAuthenticationMode;
type GitHubCopilotHarnessSettings = {
  readonly auth?: GitHubCopilotAuthenticationMode;
  readonly credentialForwarding?: HarnessV1CredentialForwarding;
  readonly reasoningEffort?:
    'none' | 'minimal' | 'low' | 'medium' | 'high' | 'xhigh' | 'max';
  readonly mcpServers?: Record<string, unknown>;
  readonly port?: number;
  readonly portEndpoint?: HarnessV1PortEndpoint;
  readonly startupTimeoutMs?: number;
  readonly hostDisconnectTimeoutMs?: number;
  readonly reconnect?: SandboxChannelReconnectOptions;
  readonly keepAliveMs?: number;
  readonly mintBridgeToken?: HarnessV1MintBridgeTokenCallback;
};
declare const GITHUB_COPILOT_BUILTIN_TOOLS: {
  readonly bash:
    | {
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          command: string;
          description?: string | undefined;
          shellId?: string | undefined;
          mode?: 'sync' | 'async' | undefined;
          detach?: boolean | undefined;
          initial_wait?: number | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                command: string;
                description?: string | undefined;
                shellId?: string | undefined;
                mode?: 'sync' | 'async' | undefined;
                detach?: boolean | undefined;
                initial_wait?: number | undefined;
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
                  command: string;
                  description?: string | undefined;
                  shellId?: string | undefined;
                  mode?: 'sync' | 'async' | undefined;
                  detach?: boolean | undefined;
                  initial_wait?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                command: string;
                description?: string | undefined;
                shellId?: string | undefined;
                mode?: 'sync' | 'async' | undefined;
                detach?: boolean | undefined;
                initial_wait?: number | undefined;
              };
              output: unknown;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<unknown>;
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
                command: string;
                description?: string | undefined;
                shellId?: string | undefined;
                mode?: 'sync' | 'async' | undefined;
                detach?: boolean | undefined;
                initial_wait?: number | undefined;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type?: undefined | 'function';
        readonly nativeName?: string;
        readonly commonName?: import('./harness.js').HarnessV1BuiltinToolName;
        readonly toolUseKind?: import('./harness.js').HarnessV1BuiltinToolUseKind;
      }
    | {
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          command: string;
          description?: string | undefined;
          shellId?: string | undefined;
          mode?: 'sync' | 'async' | undefined;
          detach?: boolean | undefined;
          initial_wait?: number | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                command: string;
                description?: string | undefined;
                shellId?: string | undefined;
                mode?: 'sync' | 'async' | undefined;
                detach?: boolean | undefined;
                initial_wait?: number | undefined;
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
                  command: string;
                  description?: string | undefined;
                  shellId?: string | undefined;
                  mode?: 'sync' | 'async' | undefined;
                  detach?: boolean | undefined;
                  initial_wait?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                command: string;
                description?: string | undefined;
                shellId?: string | undefined;
                mode?: 'sync' | 'async' | undefined;
                detach?: boolean | undefined;
                initial_wait?: number | undefined;
              };
              output: unknown;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<unknown> | undefined;
        readonly execute: import('@ai-sdk/provider-utils').ToolExecuteFunction<
          {
            [x: string]: unknown;
            command: string;
            description?: string | undefined;
            shellId?: string | undefined;
            mode?: 'sync' | 'async' | undefined;
            detach?: boolean | undefined;
            initial_wait?: number | undefined;
          },
          unknown,
          any
        >;
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
                command: string;
                description?: string | undefined;
                shellId?: string | undefined;
                mode?: 'sync' | 'async' | undefined;
                detach?: boolean | undefined;
                initial_wait?: number | undefined;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type?: undefined | 'function';
        readonly nativeName?: string;
        readonly commonName?: import('./harness.js').HarnessV1BuiltinToolName;
        readonly toolUseKind?: import('./harness.js').HarnessV1BuiltinToolUseKind;
      }
    | {
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          command: string;
          description?: string | undefined;
          shellId?: string | undefined;
          mode?: 'sync' | 'async' | undefined;
          detach?: boolean | undefined;
          initial_wait?: number | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                command: string;
                description?: string | undefined;
                shellId?: string | undefined;
                mode?: 'sync' | 'async' | undefined;
                detach?: boolean | undefined;
                initial_wait?: number | undefined;
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
                  command: string;
                  description?: string | undefined;
                  shellId?: string | undefined;
                  mode?: 'sync' | 'async' | undefined;
                  detach?: boolean | undefined;
                  initial_wait?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                command: string;
                description?: string | undefined;
                shellId?: string | undefined;
                mode?: 'sync' | 'async' | undefined;
                detach?: boolean | undefined;
                initial_wait?: number | undefined;
              };
              output: unknown;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<unknown>;
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
                command: string;
                description?: string | undefined;
                shellId?: string | undefined;
                mode?: 'sync' | 'async' | undefined;
                detach?: boolean | undefined;
                initial_wait?: number | undefined;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type: 'dynamic';
        readonly nativeName?: string;
        readonly commonName?: import('./harness.js').HarnessV1BuiltinToolName;
        readonly toolUseKind?: import('./harness.js').HarnessV1BuiltinToolUseKind;
      }
    | {
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          command: string;
          description?: string | undefined;
          shellId?: string | undefined;
          mode?: 'sync' | 'async' | undefined;
          detach?: boolean | undefined;
          initial_wait?: number | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                command: string;
                description?: string | undefined;
                shellId?: string | undefined;
                mode?: 'sync' | 'async' | undefined;
                detach?: boolean | undefined;
                initial_wait?: number | undefined;
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
                  command: string;
                  description?: string | undefined;
                  shellId?: string | undefined;
                  mode?: 'sync' | 'async' | undefined;
                  detach?: boolean | undefined;
                  initial_wait?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                command: string;
                description?: string | undefined;
                shellId?: string | undefined;
                mode?: 'sync' | 'async' | undefined;
                detach?: boolean | undefined;
                initial_wait?: number | undefined;
              };
              output: unknown;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<unknown> | undefined;
        readonly execute: import('@ai-sdk/provider-utils').ToolExecuteFunction<
          {
            [x: string]: unknown;
            command: string;
            description?: string | undefined;
            shellId?: string | undefined;
            mode?: 'sync' | 'async' | undefined;
            detach?: boolean | undefined;
            initial_wait?: number | undefined;
          },
          unknown,
          any
        >;
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
                command: string;
                description?: string | undefined;
                shellId?: string | undefined;
                mode?: 'sync' | 'async' | undefined;
                detach?: boolean | undefined;
                initial_wait?: number | undefined;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type: 'dynamic';
        readonly nativeName?: string;
        readonly commonName?: import('./harness.js').HarnessV1BuiltinToolName;
        readonly toolUseKind?: import('./harness.js').HarnessV1BuiltinToolUseKind;
      }
    | {
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          command: string;
          description?: string | undefined;
          shellId?: string | undefined;
          mode?: 'sync' | 'async' | undefined;
          detach?: boolean | undefined;
          initial_wait?: number | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                command: string;
                description?: string | undefined;
                shellId?: string | undefined;
                mode?: 'sync' | 'async' | undefined;
                detach?: boolean | undefined;
                initial_wait?: number | undefined;
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
                  command: string;
                  description?: string | undefined;
                  shellId?: string | undefined;
                  mode?: 'sync' | 'async' | undefined;
                  detach?: boolean | undefined;
                  initial_wait?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                command: string;
                description?: string | undefined;
                shellId?: string | undefined;
                mode?: 'sync' | 'async' | undefined;
                detach?: boolean | undefined;
                initial_wait?: number | undefined;
              };
              output: unknown;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<unknown>;
        readonly execute?: never;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: false;
        readonly supportsDeferredResults?: never;
        readonly nativeName?: string;
        readonly commonName?: import('./harness.js').HarnessV1BuiltinToolName;
        readonly toolUseKind?: import('./harness.js').HarnessV1BuiltinToolUseKind;
      }
    | {
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          command: string;
          description?: string | undefined;
          shellId?: string | undefined;
          mode?: 'sync' | 'async' | undefined;
          detach?: boolean | undefined;
          initial_wait?: number | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                command: string;
                description?: string | undefined;
                shellId?: string | undefined;
                mode?: 'sync' | 'async' | undefined;
                detach?: boolean | undefined;
                initial_wait?: number | undefined;
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
                  command: string;
                  description?: string | undefined;
                  shellId?: string | undefined;
                  mode?: 'sync' | 'async' | undefined;
                  detach?: boolean | undefined;
                  initial_wait?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                command: string;
                description?: string | undefined;
                shellId?: string | undefined;
                mode?: 'sync' | 'async' | undefined;
                detach?: boolean | undefined;
                initial_wait?: number | undefined;
              };
              output: unknown;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<unknown> | undefined;
        readonly execute: import('@ai-sdk/provider-utils').ToolExecuteFunction<
          {
            [x: string]: unknown;
            command: string;
            description?: string | undefined;
            shellId?: string | undefined;
            mode?: 'sync' | 'async' | undefined;
            detach?: boolean | undefined;
            initial_wait?: number | undefined;
          },
          unknown,
          any
        >;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: false;
        readonly supportsDeferredResults?: never;
        readonly nativeName?: string;
        readonly commonName?: import('./harness.js').HarnessV1BuiltinToolName;
        readonly toolUseKind?: import('./harness.js').HarnessV1BuiltinToolUseKind;
      }
    | {
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          command: string;
          description?: string | undefined;
          shellId?: string | undefined;
          mode?: 'sync' | 'async' | undefined;
          detach?: boolean | undefined;
          initial_wait?: number | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                command: string;
                description?: string | undefined;
                shellId?: string | undefined;
                mode?: 'sync' | 'async' | undefined;
                detach?: boolean | undefined;
                initial_wait?: number | undefined;
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
                  command: string;
                  description?: string | undefined;
                  shellId?: string | undefined;
                  mode?: 'sync' | 'async' | undefined;
                  detach?: boolean | undefined;
                  initial_wait?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                command: string;
                description?: string | undefined;
                shellId?: string | undefined;
                mode?: 'sync' | 'async' | undefined;
                detach?: boolean | undefined;
                initial_wait?: number | undefined;
              };
              output: unknown;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<unknown>;
        readonly execute?: never;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: true;
        readonly supportsDeferredResults?: boolean;
        readonly nativeName?: string;
        readonly commonName?: import('./harness.js').HarnessV1BuiltinToolName;
        readonly toolUseKind?: import('./harness.js').HarnessV1BuiltinToolUseKind;
      }
    | {
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          command: string;
          description?: string | undefined;
          shellId?: string | undefined;
          mode?: 'sync' | 'async' | undefined;
          detach?: boolean | undefined;
          initial_wait?: number | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                command: string;
                description?: string | undefined;
                shellId?: string | undefined;
                mode?: 'sync' | 'async' | undefined;
                detach?: boolean | undefined;
                initial_wait?: number | undefined;
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
                  command: string;
                  description?: string | undefined;
                  shellId?: string | undefined;
                  mode?: 'sync' | 'async' | undefined;
                  detach?: boolean | undefined;
                  initial_wait?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                command: string;
                description?: string | undefined;
                shellId?: string | undefined;
                mode?: 'sync' | 'async' | undefined;
                detach?: boolean | undefined;
                initial_wait?: number | undefined;
              };
              output: unknown;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<unknown> | undefined;
        readonly execute: import('@ai-sdk/provider-utils').ToolExecuteFunction<
          {
            [x: string]: unknown;
            command: string;
            description?: string | undefined;
            shellId?: string | undefined;
            mode?: 'sync' | 'async' | undefined;
            detach?: boolean | undefined;
            initial_wait?: number | undefined;
          },
          unknown,
          any
        >;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: true;
        readonly supportsDeferredResults?: boolean;
        readonly nativeName?: string;
        readonly commonName?: import('./harness.js').HarnessV1BuiltinToolName;
        readonly toolUseKind?: import('./harness.js').HarnessV1BuiltinToolUseKind;
      };
  readonly read_bash:
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          shellId: string;
          delay: number;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                shellId: string;
                delay: number;
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
                  shellId: string;
                  delay: number;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                shellId: string;
                delay: number;
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
                shellId: string;
                delay: number;
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
          shellId: string;
          delay: number;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                shellId: string;
                delay: number;
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
                  shellId: string;
                  delay: number;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                shellId: string;
                delay: number;
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
                shellId: string;
                delay: number;
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
                shellId: string;
                delay: number;
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
          shellId: string;
          delay: number;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                shellId: string;
                delay: number;
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
                  shellId: string;
                  delay: number;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                shellId: string;
                delay: number;
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
                shellId: string;
                delay: number;
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
          shellId: string;
          delay: number;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                shellId: string;
                delay: number;
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
                  shellId: string;
                  delay: number;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                shellId: string;
                delay: number;
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
                shellId: string;
                delay: number;
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
                shellId: string;
                delay: number;
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
          shellId: string;
          delay: number;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                shellId: string;
                delay: number;
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
                  shellId: string;
                  delay: number;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                shellId: string;
                delay: number;
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
          shellId: string;
          delay: number;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                shellId: string;
                delay: number;
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
                  shellId: string;
                  delay: number;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                shellId: string;
                delay: number;
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
                shellId: string;
                delay: number;
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
          shellId: string;
          delay: number;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                shellId: string;
                delay: number;
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
                  shellId: string;
                  delay: number;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                shellId: string;
                delay: number;
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
          shellId: string;
          delay: number;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                shellId: string;
                delay: number;
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
                  shellId: string;
                  delay: number;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                shellId: string;
                delay: number;
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
                shellId: string;
                delay: number;
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
  readonly stop_bash:
    | {
        readonly toolUseKind: 'bash';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          shellId: string;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                shellId: string;
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
                  shellId: string;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                shellId: string;
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
                shellId: string;
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
        readonly toolUseKind: 'bash';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          shellId: string;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                shellId: string;
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
                  shellId: string;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                shellId: string;
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
                shellId: string;
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
                shellId: string;
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
        readonly toolUseKind: 'bash';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          shellId: string;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                shellId: string;
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
                  shellId: string;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                shellId: string;
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
                shellId: string;
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
        readonly toolUseKind: 'bash';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          shellId: string;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                shellId: string;
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
                  shellId: string;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                shellId: string;
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
                shellId: string;
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
                shellId: string;
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
        readonly toolUseKind: 'bash';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          shellId: string;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                shellId: string;
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
                  shellId: string;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                shellId: string;
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
        readonly toolUseKind: 'bash';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          shellId: string;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                shellId: string;
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
                  shellId: string;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                shellId: string;
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
                shellId: string;
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
        readonly toolUseKind: 'bash';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          shellId: string;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                shellId: string;
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
                  shellId: string;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                shellId: string;
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
        readonly toolUseKind: 'bash';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          shellId: string;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                shellId: string;
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
                  shellId: string;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                shellId: string;
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
                shellId: string;
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
  readonly list_bash:
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
  readonly view:
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          path: string;
          view_range?: number[] | undefined;
          forceReadLargeFiles?: boolean | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                path: string;
                view_range?: number[] | undefined;
                forceReadLargeFiles?: boolean | undefined;
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
                  path: string;
                  view_range?: number[] | undefined;
                  forceReadLargeFiles?: boolean | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                path: string;
                view_range?: number[] | undefined;
                forceReadLargeFiles?: boolean | undefined;
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
                path: string;
                view_range?: number[] | undefined;
                forceReadLargeFiles?: boolean | undefined;
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
          path: string;
          view_range?: number[] | undefined;
          forceReadLargeFiles?: boolean | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                path: string;
                view_range?: number[] | undefined;
                forceReadLargeFiles?: boolean | undefined;
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
                  path: string;
                  view_range?: number[] | undefined;
                  forceReadLargeFiles?: boolean | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                path: string;
                view_range?: number[] | undefined;
                forceReadLargeFiles?: boolean | undefined;
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
                path: string;
                view_range?: number[] | undefined;
                forceReadLargeFiles?: boolean | undefined;
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
                path: string;
                view_range?: number[] | undefined;
                forceReadLargeFiles?: boolean | undefined;
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
          path: string;
          view_range?: number[] | undefined;
          forceReadLargeFiles?: boolean | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                path: string;
                view_range?: number[] | undefined;
                forceReadLargeFiles?: boolean | undefined;
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
                  path: string;
                  view_range?: number[] | undefined;
                  forceReadLargeFiles?: boolean | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                path: string;
                view_range?: number[] | undefined;
                forceReadLargeFiles?: boolean | undefined;
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
                path: string;
                view_range?: number[] | undefined;
                forceReadLargeFiles?: boolean | undefined;
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
          path: string;
          view_range?: number[] | undefined;
          forceReadLargeFiles?: boolean | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                path: string;
                view_range?: number[] | undefined;
                forceReadLargeFiles?: boolean | undefined;
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
                  path: string;
                  view_range?: number[] | undefined;
                  forceReadLargeFiles?: boolean | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                path: string;
                view_range?: number[] | undefined;
                forceReadLargeFiles?: boolean | undefined;
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
                path: string;
                view_range?: number[] | undefined;
                forceReadLargeFiles?: boolean | undefined;
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
                path: string;
                view_range?: number[] | undefined;
                forceReadLargeFiles?: boolean | undefined;
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
          path: string;
          view_range?: number[] | undefined;
          forceReadLargeFiles?: boolean | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                path: string;
                view_range?: number[] | undefined;
                forceReadLargeFiles?: boolean | undefined;
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
                  path: string;
                  view_range?: number[] | undefined;
                  forceReadLargeFiles?: boolean | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                path: string;
                view_range?: number[] | undefined;
                forceReadLargeFiles?: boolean | undefined;
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
          path: string;
          view_range?: number[] | undefined;
          forceReadLargeFiles?: boolean | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                path: string;
                view_range?: number[] | undefined;
                forceReadLargeFiles?: boolean | undefined;
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
                  path: string;
                  view_range?: number[] | undefined;
                  forceReadLargeFiles?: boolean | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                path: string;
                view_range?: number[] | undefined;
                forceReadLargeFiles?: boolean | undefined;
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
                path: string;
                view_range?: number[] | undefined;
                forceReadLargeFiles?: boolean | undefined;
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
          path: string;
          view_range?: number[] | undefined;
          forceReadLargeFiles?: boolean | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                path: string;
                view_range?: number[] | undefined;
                forceReadLargeFiles?: boolean | undefined;
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
                  path: string;
                  view_range?: number[] | undefined;
                  forceReadLargeFiles?: boolean | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                path: string;
                view_range?: number[] | undefined;
                forceReadLargeFiles?: boolean | undefined;
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
          path: string;
          view_range?: number[] | undefined;
          forceReadLargeFiles?: boolean | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                path: string;
                view_range?: number[] | undefined;
                forceReadLargeFiles?: boolean | undefined;
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
                  path: string;
                  view_range?: number[] | undefined;
                  forceReadLargeFiles?: boolean | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                path: string;
                view_range?: number[] | undefined;
                forceReadLargeFiles?: boolean | undefined;
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
                path: string;
                view_range?: number[] | undefined;
                forceReadLargeFiles?: boolean | undefined;
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
  readonly create:
    | {
        readonly toolUseKind: 'edit';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          path: string;
          file_text: string;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                path: string;
                file_text: string;
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
                  path: string;
                  file_text: string;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                path: string;
                file_text: string;
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
                path: string;
                file_text: string;
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
        readonly toolUseKind: 'edit';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          path: string;
          file_text: string;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                path: string;
                file_text: string;
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
                  path: string;
                  file_text: string;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                path: string;
                file_text: string;
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
                path: string;
                file_text: string;
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
                path: string;
                file_text: string;
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
        readonly toolUseKind: 'edit';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          path: string;
          file_text: string;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                path: string;
                file_text: string;
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
                  path: string;
                  file_text: string;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                path: string;
                file_text: string;
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
                path: string;
                file_text: string;
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
        readonly toolUseKind: 'edit';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          path: string;
          file_text: string;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                path: string;
                file_text: string;
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
                  path: string;
                  file_text: string;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                path: string;
                file_text: string;
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
                path: string;
                file_text: string;
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
                path: string;
                file_text: string;
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
        readonly toolUseKind: 'edit';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          path: string;
          file_text: string;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                path: string;
                file_text: string;
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
                  path: string;
                  file_text: string;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                path: string;
                file_text: string;
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
        readonly toolUseKind: 'edit';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          path: string;
          file_text: string;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                path: string;
                file_text: string;
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
                  path: string;
                  file_text: string;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                path: string;
                file_text: string;
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
                path: string;
                file_text: string;
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
        readonly toolUseKind: 'edit';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          path: string;
          file_text: string;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                path: string;
                file_text: string;
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
                  path: string;
                  file_text: string;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                path: string;
                file_text: string;
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
        readonly toolUseKind: 'edit';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          path: string;
          file_text: string;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                path: string;
                file_text: string;
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
                  path: string;
                  file_text: string;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                path: string;
                file_text: string;
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
                path: string;
                file_text: string;
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
  readonly edit:
    | {
        readonly toolUseKind: 'edit';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          path: string;
          new_str: string;
          old_str?: string | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                path: string;
                new_str: string;
                old_str?: string | undefined;
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
                  path: string;
                  new_str: string;
                  old_str?: string | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                path: string;
                new_str: string;
                old_str?: string | undefined;
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
                path: string;
                new_str: string;
                old_str?: string | undefined;
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
        readonly toolUseKind: 'edit';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          path: string;
          new_str: string;
          old_str?: string | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                path: string;
                new_str: string;
                old_str?: string | undefined;
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
                  path: string;
                  new_str: string;
                  old_str?: string | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                path: string;
                new_str: string;
                old_str?: string | undefined;
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
                path: string;
                new_str: string;
                old_str?: string | undefined;
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
                path: string;
                new_str: string;
                old_str?: string | undefined;
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
        readonly toolUseKind: 'edit';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          path: string;
          new_str: string;
          old_str?: string | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                path: string;
                new_str: string;
                old_str?: string | undefined;
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
                  path: string;
                  new_str: string;
                  old_str?: string | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                path: string;
                new_str: string;
                old_str?: string | undefined;
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
                path: string;
                new_str: string;
                old_str?: string | undefined;
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
        readonly toolUseKind: 'edit';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          path: string;
          new_str: string;
          old_str?: string | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                path: string;
                new_str: string;
                old_str?: string | undefined;
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
                  path: string;
                  new_str: string;
                  old_str?: string | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                path: string;
                new_str: string;
                old_str?: string | undefined;
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
                path: string;
                new_str: string;
                old_str?: string | undefined;
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
                path: string;
                new_str: string;
                old_str?: string | undefined;
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
        readonly toolUseKind: 'edit';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          path: string;
          new_str: string;
          old_str?: string | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                path: string;
                new_str: string;
                old_str?: string | undefined;
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
                  path: string;
                  new_str: string;
                  old_str?: string | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                path: string;
                new_str: string;
                old_str?: string | undefined;
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
        readonly toolUseKind: 'edit';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          path: string;
          new_str: string;
          old_str?: string | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                path: string;
                new_str: string;
                old_str?: string | undefined;
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
                  path: string;
                  new_str: string;
                  old_str?: string | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                path: string;
                new_str: string;
                old_str?: string | undefined;
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
                path: string;
                new_str: string;
                old_str?: string | undefined;
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
        readonly toolUseKind: 'edit';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          path: string;
          new_str: string;
          old_str?: string | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                path: string;
                new_str: string;
                old_str?: string | undefined;
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
                  path: string;
                  new_str: string;
                  old_str?: string | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                path: string;
                new_str: string;
                old_str?: string | undefined;
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
        readonly toolUseKind: 'edit';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          path: string;
          new_str: string;
          old_str?: string | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                path: string;
                new_str: string;
                old_str?: string | undefined;
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
                  path: string;
                  new_str: string;
                  old_str?: string | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                path: string;
                new_str: string;
                old_str?: string | undefined;
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
                path: string;
                new_str: string;
                old_str?: string | undefined;
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
  readonly web_fetch:
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          url: string;
          max_length?: number | undefined;
          start_index?: number | undefined;
          raw?: boolean | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                url: string;
                max_length?: number | undefined;
                start_index?: number | undefined;
                raw?: boolean | undefined;
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
                  url: string;
                  max_length?: number | undefined;
                  start_index?: number | undefined;
                  raw?: boolean | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                url: string;
                max_length?: number | undefined;
                start_index?: number | undefined;
                raw?: boolean | undefined;
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
                url: string;
                max_length?: number | undefined;
                start_index?: number | undefined;
                raw?: boolean | undefined;
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
          url: string;
          max_length?: number | undefined;
          start_index?: number | undefined;
          raw?: boolean | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                url: string;
                max_length?: number | undefined;
                start_index?: number | undefined;
                raw?: boolean | undefined;
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
                  url: string;
                  max_length?: number | undefined;
                  start_index?: number | undefined;
                  raw?: boolean | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                url: string;
                max_length?: number | undefined;
                start_index?: number | undefined;
                raw?: boolean | undefined;
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
                url: string;
                max_length?: number | undefined;
                start_index?: number | undefined;
                raw?: boolean | undefined;
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
                url: string;
                max_length?: number | undefined;
                start_index?: number | undefined;
                raw?: boolean | undefined;
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
          url: string;
          max_length?: number | undefined;
          start_index?: number | undefined;
          raw?: boolean | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                url: string;
                max_length?: number | undefined;
                start_index?: number | undefined;
                raw?: boolean | undefined;
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
                  url: string;
                  max_length?: number | undefined;
                  start_index?: number | undefined;
                  raw?: boolean | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                url: string;
                max_length?: number | undefined;
                start_index?: number | undefined;
                raw?: boolean | undefined;
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
                url: string;
                max_length?: number | undefined;
                start_index?: number | undefined;
                raw?: boolean | undefined;
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
          url: string;
          max_length?: number | undefined;
          start_index?: number | undefined;
          raw?: boolean | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                url: string;
                max_length?: number | undefined;
                start_index?: number | undefined;
                raw?: boolean | undefined;
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
                  url: string;
                  max_length?: number | undefined;
                  start_index?: number | undefined;
                  raw?: boolean | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                url: string;
                max_length?: number | undefined;
                start_index?: number | undefined;
                raw?: boolean | undefined;
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
                url: string;
                max_length?: number | undefined;
                start_index?: number | undefined;
                raw?: boolean | undefined;
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
                url: string;
                max_length?: number | undefined;
                start_index?: number | undefined;
                raw?: boolean | undefined;
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
          url: string;
          max_length?: number | undefined;
          start_index?: number | undefined;
          raw?: boolean | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                url: string;
                max_length?: number | undefined;
                start_index?: number | undefined;
                raw?: boolean | undefined;
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
                  url: string;
                  max_length?: number | undefined;
                  start_index?: number | undefined;
                  raw?: boolean | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                url: string;
                max_length?: number | undefined;
                start_index?: number | undefined;
                raw?: boolean | undefined;
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
          url: string;
          max_length?: number | undefined;
          start_index?: number | undefined;
          raw?: boolean | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                url: string;
                max_length?: number | undefined;
                start_index?: number | undefined;
                raw?: boolean | undefined;
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
                  url: string;
                  max_length?: number | undefined;
                  start_index?: number | undefined;
                  raw?: boolean | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                url: string;
                max_length?: number | undefined;
                start_index?: number | undefined;
                raw?: boolean | undefined;
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
                url: string;
                max_length?: number | undefined;
                start_index?: number | undefined;
                raw?: boolean | undefined;
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
          url: string;
          max_length?: number | undefined;
          start_index?: number | undefined;
          raw?: boolean | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                url: string;
                max_length?: number | undefined;
                start_index?: number | undefined;
                raw?: boolean | undefined;
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
                  url: string;
                  max_length?: number | undefined;
                  start_index?: number | undefined;
                  raw?: boolean | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                url: string;
                max_length?: number | undefined;
                start_index?: number | undefined;
                raw?: boolean | undefined;
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
          url: string;
          max_length?: number | undefined;
          start_index?: number | undefined;
          raw?: boolean | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                url: string;
                max_length?: number | undefined;
                start_index?: number | undefined;
                raw?: boolean | undefined;
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
                  url: string;
                  max_length?: number | undefined;
                  start_index?: number | undefined;
                  raw?: boolean | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                url: string;
                max_length?: number | undefined;
                start_index?: number | undefined;
                raw?: boolean | undefined;
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
                url: string;
                max_length?: number | undefined;
                start_index?: number | undefined;
                raw?: boolean | undefined;
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
  readonly skill: import('@ai-sdk/provider-utils').Tool<
    {
      [x: string]: unknown;
      skill: string;
    },
    any,
    any
  >;
  readonly sql: import('@ai-sdk/provider-utils').Tool<
    {
      [x: string]: unknown;
      description: string;
      query: string;
      database?: 'session' | 'session_store' | undefined;
    },
    any,
    any
  >;
  readonly read_agent:
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          agent_id: string;
          wait?: boolean | undefined;
          timeout?: number | undefined;
          since_turn?: number | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                agent_id: string;
                wait?: boolean | undefined;
                timeout?: number | undefined;
                since_turn?: number | undefined;
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
                  agent_id: string;
                  wait?: boolean | undefined;
                  timeout?: number | undefined;
                  since_turn?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                agent_id: string;
                wait?: boolean | undefined;
                timeout?: number | undefined;
                since_turn?: number | undefined;
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
                agent_id: string;
                wait?: boolean | undefined;
                timeout?: number | undefined;
                since_turn?: number | undefined;
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
          agent_id: string;
          wait?: boolean | undefined;
          timeout?: number | undefined;
          since_turn?: number | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                agent_id: string;
                wait?: boolean | undefined;
                timeout?: number | undefined;
                since_turn?: number | undefined;
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
                  agent_id: string;
                  wait?: boolean | undefined;
                  timeout?: number | undefined;
                  since_turn?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                agent_id: string;
                wait?: boolean | undefined;
                timeout?: number | undefined;
                since_turn?: number | undefined;
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
                agent_id: string;
                wait?: boolean | undefined;
                timeout?: number | undefined;
                since_turn?: number | undefined;
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
                agent_id: string;
                wait?: boolean | undefined;
                timeout?: number | undefined;
                since_turn?: number | undefined;
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
          agent_id: string;
          wait?: boolean | undefined;
          timeout?: number | undefined;
          since_turn?: number | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                agent_id: string;
                wait?: boolean | undefined;
                timeout?: number | undefined;
                since_turn?: number | undefined;
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
                  agent_id: string;
                  wait?: boolean | undefined;
                  timeout?: number | undefined;
                  since_turn?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                agent_id: string;
                wait?: boolean | undefined;
                timeout?: number | undefined;
                since_turn?: number | undefined;
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
                agent_id: string;
                wait?: boolean | undefined;
                timeout?: number | undefined;
                since_turn?: number | undefined;
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
          agent_id: string;
          wait?: boolean | undefined;
          timeout?: number | undefined;
          since_turn?: number | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                agent_id: string;
                wait?: boolean | undefined;
                timeout?: number | undefined;
                since_turn?: number | undefined;
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
                  agent_id: string;
                  wait?: boolean | undefined;
                  timeout?: number | undefined;
                  since_turn?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                agent_id: string;
                wait?: boolean | undefined;
                timeout?: number | undefined;
                since_turn?: number | undefined;
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
                agent_id: string;
                wait?: boolean | undefined;
                timeout?: number | undefined;
                since_turn?: number | undefined;
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
                agent_id: string;
                wait?: boolean | undefined;
                timeout?: number | undefined;
                since_turn?: number | undefined;
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
          agent_id: string;
          wait?: boolean | undefined;
          timeout?: number | undefined;
          since_turn?: number | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                agent_id: string;
                wait?: boolean | undefined;
                timeout?: number | undefined;
                since_turn?: number | undefined;
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
                  agent_id: string;
                  wait?: boolean | undefined;
                  timeout?: number | undefined;
                  since_turn?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                agent_id: string;
                wait?: boolean | undefined;
                timeout?: number | undefined;
                since_turn?: number | undefined;
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
          agent_id: string;
          wait?: boolean | undefined;
          timeout?: number | undefined;
          since_turn?: number | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                agent_id: string;
                wait?: boolean | undefined;
                timeout?: number | undefined;
                since_turn?: number | undefined;
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
                  agent_id: string;
                  wait?: boolean | undefined;
                  timeout?: number | undefined;
                  since_turn?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                agent_id: string;
                wait?: boolean | undefined;
                timeout?: number | undefined;
                since_turn?: number | undefined;
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
                agent_id: string;
                wait?: boolean | undefined;
                timeout?: number | undefined;
                since_turn?: number | undefined;
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
          agent_id: string;
          wait?: boolean | undefined;
          timeout?: number | undefined;
          since_turn?: number | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                agent_id: string;
                wait?: boolean | undefined;
                timeout?: number | undefined;
                since_turn?: number | undefined;
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
                  agent_id: string;
                  wait?: boolean | undefined;
                  timeout?: number | undefined;
                  since_turn?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                agent_id: string;
                wait?: boolean | undefined;
                timeout?: number | undefined;
                since_turn?: number | undefined;
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
          agent_id: string;
          wait?: boolean | undefined;
          timeout?: number | undefined;
          since_turn?: number | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                agent_id: string;
                wait?: boolean | undefined;
                timeout?: number | undefined;
                since_turn?: number | undefined;
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
                  agent_id: string;
                  wait?: boolean | undefined;
                  timeout?: number | undefined;
                  since_turn?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                agent_id: string;
                wait?: boolean | undefined;
                timeout?: number | undefined;
                since_turn?: number | undefined;
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
                agent_id: string;
                wait?: boolean | undefined;
                timeout?: number | undefined;
                since_turn?: number | undefined;
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
  readonly list_agents:
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          include_completed?: boolean | undefined;
          scope?: 'siblings' | 'children' | 'all' | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                include_completed?: boolean | undefined;
                scope?: 'siblings' | 'children' | 'all' | undefined;
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
                  include_completed?: boolean | undefined;
                  scope?: 'siblings' | 'children' | 'all' | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                include_completed?: boolean | undefined;
                scope?: 'siblings' | 'children' | 'all' | undefined;
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
                include_completed?: boolean | undefined;
                scope?: 'siblings' | 'children' | 'all' | undefined;
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
          include_completed?: boolean | undefined;
          scope?: 'siblings' | 'children' | 'all' | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                include_completed?: boolean | undefined;
                scope?: 'siblings' | 'children' | 'all' | undefined;
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
                  include_completed?: boolean | undefined;
                  scope?: 'siblings' | 'children' | 'all' | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                include_completed?: boolean | undefined;
                scope?: 'siblings' | 'children' | 'all' | undefined;
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
                include_completed?: boolean | undefined;
                scope?: 'siblings' | 'children' | 'all' | undefined;
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
                include_completed?: boolean | undefined;
                scope?: 'siblings' | 'children' | 'all' | undefined;
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
          include_completed?: boolean | undefined;
          scope?: 'siblings' | 'children' | 'all' | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                include_completed?: boolean | undefined;
                scope?: 'siblings' | 'children' | 'all' | undefined;
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
                  include_completed?: boolean | undefined;
                  scope?: 'siblings' | 'children' | 'all' | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                include_completed?: boolean | undefined;
                scope?: 'siblings' | 'children' | 'all' | undefined;
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
                include_completed?: boolean | undefined;
                scope?: 'siblings' | 'children' | 'all' | undefined;
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
          include_completed?: boolean | undefined;
          scope?: 'siblings' | 'children' | 'all' | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                include_completed?: boolean | undefined;
                scope?: 'siblings' | 'children' | 'all' | undefined;
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
                  include_completed?: boolean | undefined;
                  scope?: 'siblings' | 'children' | 'all' | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                include_completed?: boolean | undefined;
                scope?: 'siblings' | 'children' | 'all' | undefined;
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
                include_completed?: boolean | undefined;
                scope?: 'siblings' | 'children' | 'all' | undefined;
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
                include_completed?: boolean | undefined;
                scope?: 'siblings' | 'children' | 'all' | undefined;
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
          include_completed?: boolean | undefined;
          scope?: 'siblings' | 'children' | 'all' | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                include_completed?: boolean | undefined;
                scope?: 'siblings' | 'children' | 'all' | undefined;
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
                  include_completed?: boolean | undefined;
                  scope?: 'siblings' | 'children' | 'all' | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                include_completed?: boolean | undefined;
                scope?: 'siblings' | 'children' | 'all' | undefined;
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
          include_completed?: boolean | undefined;
          scope?: 'siblings' | 'children' | 'all' | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                include_completed?: boolean | undefined;
                scope?: 'siblings' | 'children' | 'all' | undefined;
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
                  include_completed?: boolean | undefined;
                  scope?: 'siblings' | 'children' | 'all' | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                include_completed?: boolean | undefined;
                scope?: 'siblings' | 'children' | 'all' | undefined;
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
                include_completed?: boolean | undefined;
                scope?: 'siblings' | 'children' | 'all' | undefined;
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
          include_completed?: boolean | undefined;
          scope?: 'siblings' | 'children' | 'all' | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                include_completed?: boolean | undefined;
                scope?: 'siblings' | 'children' | 'all' | undefined;
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
                  include_completed?: boolean | undefined;
                  scope?: 'siblings' | 'children' | 'all' | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                include_completed?: boolean | undefined;
                scope?: 'siblings' | 'children' | 'all' | undefined;
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
          include_completed?: boolean | undefined;
          scope?: 'siblings' | 'children' | 'all' | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                include_completed?: boolean | undefined;
                scope?: 'siblings' | 'children' | 'all' | undefined;
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
                  include_completed?: boolean | undefined;
                  scope?: 'siblings' | 'children' | 'all' | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                include_completed?: boolean | undefined;
                scope?: 'siblings' | 'children' | 'all' | undefined;
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
                include_completed?: boolean | undefined;
                scope?: 'siblings' | 'children' | 'all' | undefined;
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
  readonly write_agent: import('@ai-sdk/provider-utils').Tool<
    {
      [x: string]: unknown;
      message: string;
      agent_id?: string | undefined;
      agent_ids?: string[] | undefined;
      scope?: 'siblings' | 'children' | undefined;
    },
    any,
    any
  >;
  readonly grep:
    | {
        readonly title: 'Searching for ';
        readonly deferLoading?: boolean;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          pattern: string;
          path?: string | undefined;
          paths?: string[] | undefined;
          glob?: string | undefined;
          output_mode?: 'content' | 'files_with_matches' | 'count' | undefined;
          case_insensitive?: boolean | undefined;
          multiline?: boolean | undefined;
          head_limit?: number | undefined;
          context?: number | undefined;
          before_context?: number | undefined;
          after_context?: number | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                pattern: string;
                path?: string | undefined;
                paths?: string[] | undefined;
                glob?: string | undefined;
                output_mode?:
                  'content' | 'files_with_matches' | 'count' | undefined;
                case_insensitive?: boolean | undefined;
                multiline?: boolean | undefined;
                head_limit?: number | undefined;
                context?: number | undefined;
                before_context?: number | undefined;
                after_context?: number | undefined;
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
                  pattern: string;
                  path?: string | undefined;
                  paths?: string[] | undefined;
                  glob?: string | undefined;
                  output_mode?:
                    'content' | 'files_with_matches' | 'count' | undefined;
                  case_insensitive?: boolean | undefined;
                  multiline?: boolean | undefined;
                  head_limit?: number | undefined;
                  context?: number | undefined;
                  before_context?: number | undefined;
                  after_context?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                pattern: string;
                path?: string | undefined;
                paths?: string[] | undefined;
                glob?: string | undefined;
                output_mode?:
                  'content' | 'files_with_matches' | 'count' | undefined;
                case_insensitive?: boolean | undefined;
                multiline?: boolean | undefined;
                head_limit?: number | undefined;
                context?: number | undefined;
                before_context?: number | undefined;
                after_context?: number | undefined;
              };
              output: unknown;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<unknown>;
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
                pattern: string;
                path?: string | undefined;
                paths?: string[] | undefined;
                glob?: string | undefined;
                output_mode?:
                  'content' | 'files_with_matches' | 'count' | undefined;
                case_insensitive?: boolean | undefined;
                multiline?: boolean | undefined;
                head_limit?: number | undefined;
                context?: number | undefined;
                before_context?: number | undefined;
                after_context?: number | undefined;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type?: undefined | 'function';
        readonly nativeName?: string;
        readonly commonName?: import('./harness.js').HarnessV1BuiltinToolName;
        readonly toolUseKind?: import('./harness.js').HarnessV1BuiltinToolUseKind;
      }
    | {
        readonly title: 'Searching for ';
        readonly deferLoading?: boolean;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          pattern: string;
          path?: string | undefined;
          paths?: string[] | undefined;
          glob?: string | undefined;
          output_mode?: 'content' | 'files_with_matches' | 'count' | undefined;
          case_insensitive?: boolean | undefined;
          multiline?: boolean | undefined;
          head_limit?: number | undefined;
          context?: number | undefined;
          before_context?: number | undefined;
          after_context?: number | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                pattern: string;
                path?: string | undefined;
                paths?: string[] | undefined;
                glob?: string | undefined;
                output_mode?:
                  'content' | 'files_with_matches' | 'count' | undefined;
                case_insensitive?: boolean | undefined;
                multiline?: boolean | undefined;
                head_limit?: number | undefined;
                context?: number | undefined;
                before_context?: number | undefined;
                after_context?: number | undefined;
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
                  pattern: string;
                  path?: string | undefined;
                  paths?: string[] | undefined;
                  glob?: string | undefined;
                  output_mode?:
                    'content' | 'files_with_matches' | 'count' | undefined;
                  case_insensitive?: boolean | undefined;
                  multiline?: boolean | undefined;
                  head_limit?: number | undefined;
                  context?: number | undefined;
                  before_context?: number | undefined;
                  after_context?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                pattern: string;
                path?: string | undefined;
                paths?: string[] | undefined;
                glob?: string | undefined;
                output_mode?:
                  'content' | 'files_with_matches' | 'count' | undefined;
                case_insensitive?: boolean | undefined;
                multiline?: boolean | undefined;
                head_limit?: number | undefined;
                context?: number | undefined;
                before_context?: number | undefined;
                after_context?: number | undefined;
              };
              output: unknown;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<unknown> | undefined;
        readonly execute: import('@ai-sdk/provider-utils').ToolExecuteFunction<
          {
            [x: string]: unknown;
            pattern: string;
            path?: string | undefined;
            paths?: string[] | undefined;
            glob?: string | undefined;
            output_mode?:
              'content' | 'files_with_matches' | 'count' | undefined;
            case_insensitive?: boolean | undefined;
            multiline?: boolean | undefined;
            head_limit?: number | undefined;
            context?: number | undefined;
            before_context?: number | undefined;
            after_context?: number | undefined;
          },
          unknown,
          any
        >;
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
                pattern: string;
                path?: string | undefined;
                paths?: string[] | undefined;
                glob?: string | undefined;
                output_mode?:
                  'content' | 'files_with_matches' | 'count' | undefined;
                case_insensitive?: boolean | undefined;
                multiline?: boolean | undefined;
                head_limit?: number | undefined;
                context?: number | undefined;
                before_context?: number | undefined;
                after_context?: number | undefined;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type?: undefined | 'function';
        readonly nativeName?: string;
        readonly commonName?: import('./harness.js').HarnessV1BuiltinToolName;
        readonly toolUseKind?: import('./harness.js').HarnessV1BuiltinToolUseKind;
      }
    | {
        readonly title: 'Searching for ';
        readonly deferLoading?: boolean;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          pattern: string;
          path?: string | undefined;
          paths?: string[] | undefined;
          glob?: string | undefined;
          output_mode?: 'content' | 'files_with_matches' | 'count' | undefined;
          case_insensitive?: boolean | undefined;
          multiline?: boolean | undefined;
          head_limit?: number | undefined;
          context?: number | undefined;
          before_context?: number | undefined;
          after_context?: number | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                pattern: string;
                path?: string | undefined;
                paths?: string[] | undefined;
                glob?: string | undefined;
                output_mode?:
                  'content' | 'files_with_matches' | 'count' | undefined;
                case_insensitive?: boolean | undefined;
                multiline?: boolean | undefined;
                head_limit?: number | undefined;
                context?: number | undefined;
                before_context?: number | undefined;
                after_context?: number | undefined;
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
                  pattern: string;
                  path?: string | undefined;
                  paths?: string[] | undefined;
                  glob?: string | undefined;
                  output_mode?:
                    'content' | 'files_with_matches' | 'count' | undefined;
                  case_insensitive?: boolean | undefined;
                  multiline?: boolean | undefined;
                  head_limit?: number | undefined;
                  context?: number | undefined;
                  before_context?: number | undefined;
                  after_context?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                pattern: string;
                path?: string | undefined;
                paths?: string[] | undefined;
                glob?: string | undefined;
                output_mode?:
                  'content' | 'files_with_matches' | 'count' | undefined;
                case_insensitive?: boolean | undefined;
                multiline?: boolean | undefined;
                head_limit?: number | undefined;
                context?: number | undefined;
                before_context?: number | undefined;
                after_context?: number | undefined;
              };
              output: unknown;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<unknown>;
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
                pattern: string;
                path?: string | undefined;
                paths?: string[] | undefined;
                glob?: string | undefined;
                output_mode?:
                  'content' | 'files_with_matches' | 'count' | undefined;
                case_insensitive?: boolean | undefined;
                multiline?: boolean | undefined;
                head_limit?: number | undefined;
                context?: number | undefined;
                before_context?: number | undefined;
                after_context?: number | undefined;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type: 'dynamic';
        readonly nativeName?: string;
        readonly commonName?: import('./harness.js').HarnessV1BuiltinToolName;
        readonly toolUseKind?: import('./harness.js').HarnessV1BuiltinToolUseKind;
      }
    | {
        readonly title: 'Searching for ';
        readonly deferLoading?: boolean;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          pattern: string;
          path?: string | undefined;
          paths?: string[] | undefined;
          glob?: string | undefined;
          output_mode?: 'content' | 'files_with_matches' | 'count' | undefined;
          case_insensitive?: boolean | undefined;
          multiline?: boolean | undefined;
          head_limit?: number | undefined;
          context?: number | undefined;
          before_context?: number | undefined;
          after_context?: number | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                pattern: string;
                path?: string | undefined;
                paths?: string[] | undefined;
                glob?: string | undefined;
                output_mode?:
                  'content' | 'files_with_matches' | 'count' | undefined;
                case_insensitive?: boolean | undefined;
                multiline?: boolean | undefined;
                head_limit?: number | undefined;
                context?: number | undefined;
                before_context?: number | undefined;
                after_context?: number | undefined;
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
                  pattern: string;
                  path?: string | undefined;
                  paths?: string[] | undefined;
                  glob?: string | undefined;
                  output_mode?:
                    'content' | 'files_with_matches' | 'count' | undefined;
                  case_insensitive?: boolean | undefined;
                  multiline?: boolean | undefined;
                  head_limit?: number | undefined;
                  context?: number | undefined;
                  before_context?: number | undefined;
                  after_context?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                pattern: string;
                path?: string | undefined;
                paths?: string[] | undefined;
                glob?: string | undefined;
                output_mode?:
                  'content' | 'files_with_matches' | 'count' | undefined;
                case_insensitive?: boolean | undefined;
                multiline?: boolean | undefined;
                head_limit?: number | undefined;
                context?: number | undefined;
                before_context?: number | undefined;
                after_context?: number | undefined;
              };
              output: unknown;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<unknown> | undefined;
        readonly execute: import('@ai-sdk/provider-utils').ToolExecuteFunction<
          {
            [x: string]: unknown;
            pattern: string;
            path?: string | undefined;
            paths?: string[] | undefined;
            glob?: string | undefined;
            output_mode?:
              'content' | 'files_with_matches' | 'count' | undefined;
            case_insensitive?: boolean | undefined;
            multiline?: boolean | undefined;
            head_limit?: number | undefined;
            context?: number | undefined;
            before_context?: number | undefined;
            after_context?: number | undefined;
          },
          unknown,
          any
        >;
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
                pattern: string;
                path?: string | undefined;
                paths?: string[] | undefined;
                glob?: string | undefined;
                output_mode?:
                  'content' | 'files_with_matches' | 'count' | undefined;
                case_insensitive?: boolean | undefined;
                multiline?: boolean | undefined;
                head_limit?: number | undefined;
                context?: number | undefined;
                before_context?: number | undefined;
                after_context?: number | undefined;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type: 'dynamic';
        readonly nativeName?: string;
        readonly commonName?: import('./harness.js').HarnessV1BuiltinToolName;
        readonly toolUseKind?: import('./harness.js').HarnessV1BuiltinToolUseKind;
      }
    | {
        readonly title: 'Searching for ';
        readonly deferLoading?: boolean;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          pattern: string;
          path?: string | undefined;
          paths?: string[] | undefined;
          glob?: string | undefined;
          output_mode?: 'content' | 'files_with_matches' | 'count' | undefined;
          case_insensitive?: boolean | undefined;
          multiline?: boolean | undefined;
          head_limit?: number | undefined;
          context?: number | undefined;
          before_context?: number | undefined;
          after_context?: number | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                pattern: string;
                path?: string | undefined;
                paths?: string[] | undefined;
                glob?: string | undefined;
                output_mode?:
                  'content' | 'files_with_matches' | 'count' | undefined;
                case_insensitive?: boolean | undefined;
                multiline?: boolean | undefined;
                head_limit?: number | undefined;
                context?: number | undefined;
                before_context?: number | undefined;
                after_context?: number | undefined;
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
                  pattern: string;
                  path?: string | undefined;
                  paths?: string[] | undefined;
                  glob?: string | undefined;
                  output_mode?:
                    'content' | 'files_with_matches' | 'count' | undefined;
                  case_insensitive?: boolean | undefined;
                  multiline?: boolean | undefined;
                  head_limit?: number | undefined;
                  context?: number | undefined;
                  before_context?: number | undefined;
                  after_context?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                pattern: string;
                path?: string | undefined;
                paths?: string[] | undefined;
                glob?: string | undefined;
                output_mode?:
                  'content' | 'files_with_matches' | 'count' | undefined;
                case_insensitive?: boolean | undefined;
                multiline?: boolean | undefined;
                head_limit?: number | undefined;
                context?: number | undefined;
                before_context?: number | undefined;
                after_context?: number | undefined;
              };
              output: unknown;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<unknown>;
        readonly execute?: never;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: false;
        readonly supportsDeferredResults?: never;
        readonly nativeName?: string;
        readonly commonName?: import('./harness.js').HarnessV1BuiltinToolName;
        readonly toolUseKind?: import('./harness.js').HarnessV1BuiltinToolUseKind;
      }
    | {
        readonly title: 'Searching for ';
        readonly deferLoading?: boolean;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          pattern: string;
          path?: string | undefined;
          paths?: string[] | undefined;
          glob?: string | undefined;
          output_mode?: 'content' | 'files_with_matches' | 'count' | undefined;
          case_insensitive?: boolean | undefined;
          multiline?: boolean | undefined;
          head_limit?: number | undefined;
          context?: number | undefined;
          before_context?: number | undefined;
          after_context?: number | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                pattern: string;
                path?: string | undefined;
                paths?: string[] | undefined;
                glob?: string | undefined;
                output_mode?:
                  'content' | 'files_with_matches' | 'count' | undefined;
                case_insensitive?: boolean | undefined;
                multiline?: boolean | undefined;
                head_limit?: number | undefined;
                context?: number | undefined;
                before_context?: number | undefined;
                after_context?: number | undefined;
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
                  pattern: string;
                  path?: string | undefined;
                  paths?: string[] | undefined;
                  glob?: string | undefined;
                  output_mode?:
                    'content' | 'files_with_matches' | 'count' | undefined;
                  case_insensitive?: boolean | undefined;
                  multiline?: boolean | undefined;
                  head_limit?: number | undefined;
                  context?: number | undefined;
                  before_context?: number | undefined;
                  after_context?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                pattern: string;
                path?: string | undefined;
                paths?: string[] | undefined;
                glob?: string | undefined;
                output_mode?:
                  'content' | 'files_with_matches' | 'count' | undefined;
                case_insensitive?: boolean | undefined;
                multiline?: boolean | undefined;
                head_limit?: number | undefined;
                context?: number | undefined;
                before_context?: number | undefined;
                after_context?: number | undefined;
              };
              output: unknown;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<unknown> | undefined;
        readonly execute: import('@ai-sdk/provider-utils').ToolExecuteFunction<
          {
            [x: string]: unknown;
            pattern: string;
            path?: string | undefined;
            paths?: string[] | undefined;
            glob?: string | undefined;
            output_mode?:
              'content' | 'files_with_matches' | 'count' | undefined;
            case_insensitive?: boolean | undefined;
            multiline?: boolean | undefined;
            head_limit?: number | undefined;
            context?: number | undefined;
            before_context?: number | undefined;
            after_context?: number | undefined;
          },
          unknown,
          any
        >;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: false;
        readonly supportsDeferredResults?: never;
        readonly nativeName?: string;
        readonly commonName?: import('./harness.js').HarnessV1BuiltinToolName;
        readonly toolUseKind?: import('./harness.js').HarnessV1BuiltinToolUseKind;
      }
    | {
        readonly title: 'Searching for ';
        readonly deferLoading?: boolean;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          pattern: string;
          path?: string | undefined;
          paths?: string[] | undefined;
          glob?: string | undefined;
          output_mode?: 'content' | 'files_with_matches' | 'count' | undefined;
          case_insensitive?: boolean | undefined;
          multiline?: boolean | undefined;
          head_limit?: number | undefined;
          context?: number | undefined;
          before_context?: number | undefined;
          after_context?: number | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                pattern: string;
                path?: string | undefined;
                paths?: string[] | undefined;
                glob?: string | undefined;
                output_mode?:
                  'content' | 'files_with_matches' | 'count' | undefined;
                case_insensitive?: boolean | undefined;
                multiline?: boolean | undefined;
                head_limit?: number | undefined;
                context?: number | undefined;
                before_context?: number | undefined;
                after_context?: number | undefined;
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
                  pattern: string;
                  path?: string | undefined;
                  paths?: string[] | undefined;
                  glob?: string | undefined;
                  output_mode?:
                    'content' | 'files_with_matches' | 'count' | undefined;
                  case_insensitive?: boolean | undefined;
                  multiline?: boolean | undefined;
                  head_limit?: number | undefined;
                  context?: number | undefined;
                  before_context?: number | undefined;
                  after_context?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                pattern: string;
                path?: string | undefined;
                paths?: string[] | undefined;
                glob?: string | undefined;
                output_mode?:
                  'content' | 'files_with_matches' | 'count' | undefined;
                case_insensitive?: boolean | undefined;
                multiline?: boolean | undefined;
                head_limit?: number | undefined;
                context?: number | undefined;
                before_context?: number | undefined;
                after_context?: number | undefined;
              };
              output: unknown;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<unknown>;
        readonly execute?: never;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: true;
        readonly supportsDeferredResults?: boolean;
        readonly nativeName?: string;
        readonly commonName?: import('./harness.js').HarnessV1BuiltinToolName;
        readonly toolUseKind?: import('./harness.js').HarnessV1BuiltinToolUseKind;
      }
    | {
        readonly title: 'Searching for ';
        readonly deferLoading?: boolean;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          pattern: string;
          path?: string | undefined;
          paths?: string[] | undefined;
          glob?: string | undefined;
          output_mode?: 'content' | 'files_with_matches' | 'count' | undefined;
          case_insensitive?: boolean | undefined;
          multiline?: boolean | undefined;
          head_limit?: number | undefined;
          context?: number | undefined;
          before_context?: number | undefined;
          after_context?: number | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                pattern: string;
                path?: string | undefined;
                paths?: string[] | undefined;
                glob?: string | undefined;
                output_mode?:
                  'content' | 'files_with_matches' | 'count' | undefined;
                case_insensitive?: boolean | undefined;
                multiline?: boolean | undefined;
                head_limit?: number | undefined;
                context?: number | undefined;
                before_context?: number | undefined;
                after_context?: number | undefined;
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
                  pattern: string;
                  path?: string | undefined;
                  paths?: string[] | undefined;
                  glob?: string | undefined;
                  output_mode?:
                    'content' | 'files_with_matches' | 'count' | undefined;
                  case_insensitive?: boolean | undefined;
                  multiline?: boolean | undefined;
                  head_limit?: number | undefined;
                  context?: number | undefined;
                  before_context?: number | undefined;
                  after_context?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                pattern: string;
                path?: string | undefined;
                paths?: string[] | undefined;
                glob?: string | undefined;
                output_mode?:
                  'content' | 'files_with_matches' | 'count' | undefined;
                case_insensitive?: boolean | undefined;
                multiline?: boolean | undefined;
                head_limit?: number | undefined;
                context?: number | undefined;
                before_context?: number | undefined;
                after_context?: number | undefined;
              };
              output: unknown;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<unknown> | undefined;
        readonly execute: import('@ai-sdk/provider-utils').ToolExecuteFunction<
          {
            [x: string]: unknown;
            pattern: string;
            path?: string | undefined;
            paths?: string[] | undefined;
            glob?: string | undefined;
            output_mode?:
              'content' | 'files_with_matches' | 'count' | undefined;
            case_insensitive?: boolean | undefined;
            multiline?: boolean | undefined;
            head_limit?: number | undefined;
            context?: number | undefined;
            before_context?: number | undefined;
            after_context?: number | undefined;
          },
          unknown,
          any
        >;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: true;
        readonly supportsDeferredResults?: boolean;
        readonly nativeName?: string;
        readonly commonName?: import('./harness.js').HarnessV1BuiltinToolName;
        readonly toolUseKind?: import('./harness.js').HarnessV1BuiltinToolUseKind;
      };
  readonly glob:
    | {
        readonly title: 'Finding files matching ';
        readonly deferLoading?: boolean;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          pattern: string;
          paths?: string[] | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                pattern: string;
                paths?: string[] | undefined;
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
                  pattern: string;
                  paths?: string[] | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                pattern: string;
                paths?: string[] | undefined;
              };
              output: unknown;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<unknown>;
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
                pattern: string;
                paths?: string[] | undefined;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type?: undefined | 'function';
        readonly nativeName?: string;
        readonly commonName?: import('./harness.js').HarnessV1BuiltinToolName;
        readonly toolUseKind?: import('./harness.js').HarnessV1BuiltinToolUseKind;
      }
    | {
        readonly title: 'Finding files matching ';
        readonly deferLoading?: boolean;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          pattern: string;
          paths?: string[] | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                pattern: string;
                paths?: string[] | undefined;
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
                  pattern: string;
                  paths?: string[] | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                pattern: string;
                paths?: string[] | undefined;
              };
              output: unknown;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<unknown> | undefined;
        readonly execute: import('@ai-sdk/provider-utils').ToolExecuteFunction<
          {
            [x: string]: unknown;
            pattern: string;
            paths?: string[] | undefined;
          },
          unknown,
          any
        >;
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
                pattern: string;
                paths?: string[] | undefined;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type?: undefined | 'function';
        readonly nativeName?: string;
        readonly commonName?: import('./harness.js').HarnessV1BuiltinToolName;
        readonly toolUseKind?: import('./harness.js').HarnessV1BuiltinToolUseKind;
      }
    | {
        readonly title: 'Finding files matching ';
        readonly deferLoading?: boolean;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          pattern: string;
          paths?: string[] | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                pattern: string;
                paths?: string[] | undefined;
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
                  pattern: string;
                  paths?: string[] | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                pattern: string;
                paths?: string[] | undefined;
              };
              output: unknown;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<unknown>;
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
                pattern: string;
                paths?: string[] | undefined;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type: 'dynamic';
        readonly nativeName?: string;
        readonly commonName?: import('./harness.js').HarnessV1BuiltinToolName;
        readonly toolUseKind?: import('./harness.js').HarnessV1BuiltinToolUseKind;
      }
    | {
        readonly title: 'Finding files matching ';
        readonly deferLoading?: boolean;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          pattern: string;
          paths?: string[] | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                pattern: string;
                paths?: string[] | undefined;
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
                  pattern: string;
                  paths?: string[] | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                pattern: string;
                paths?: string[] | undefined;
              };
              output: unknown;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<unknown> | undefined;
        readonly execute: import('@ai-sdk/provider-utils').ToolExecuteFunction<
          {
            [x: string]: unknown;
            pattern: string;
            paths?: string[] | undefined;
          },
          unknown,
          any
        >;
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
                pattern: string;
                paths?: string[] | undefined;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type: 'dynamic';
        readonly nativeName?: string;
        readonly commonName?: import('./harness.js').HarnessV1BuiltinToolName;
        readonly toolUseKind?: import('./harness.js').HarnessV1BuiltinToolUseKind;
      }
    | {
        readonly title: 'Finding files matching ';
        readonly deferLoading?: boolean;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          pattern: string;
          paths?: string[] | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                pattern: string;
                paths?: string[] | undefined;
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
                  pattern: string;
                  paths?: string[] | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                pattern: string;
                paths?: string[] | undefined;
              };
              output: unknown;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<unknown>;
        readonly execute?: never;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: false;
        readonly supportsDeferredResults?: never;
        readonly nativeName?: string;
        readonly commonName?: import('./harness.js').HarnessV1BuiltinToolName;
        readonly toolUseKind?: import('./harness.js').HarnessV1BuiltinToolUseKind;
      }
    | {
        readonly title: 'Finding files matching ';
        readonly deferLoading?: boolean;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          pattern: string;
          paths?: string[] | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                pattern: string;
                paths?: string[] | undefined;
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
                  pattern: string;
                  paths?: string[] | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                pattern: string;
                paths?: string[] | undefined;
              };
              output: unknown;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<unknown> | undefined;
        readonly execute: import('@ai-sdk/provider-utils').ToolExecuteFunction<
          {
            [x: string]: unknown;
            pattern: string;
            paths?: string[] | undefined;
          },
          unknown,
          any
        >;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: false;
        readonly supportsDeferredResults?: never;
        readonly nativeName?: string;
        readonly commonName?: import('./harness.js').HarnessV1BuiltinToolName;
        readonly toolUseKind?: import('./harness.js').HarnessV1BuiltinToolUseKind;
      }
    | {
        readonly title: 'Finding files matching ';
        readonly deferLoading?: boolean;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          pattern: string;
          paths?: string[] | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                pattern: string;
                paths?: string[] | undefined;
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
                  pattern: string;
                  paths?: string[] | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                pattern: string;
                paths?: string[] | undefined;
              };
              output: unknown;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<unknown>;
        readonly execute?: never;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: true;
        readonly supportsDeferredResults?: boolean;
        readonly nativeName?: string;
        readonly commonName?: import('./harness.js').HarnessV1BuiltinToolName;
        readonly toolUseKind?: import('./harness.js').HarnessV1BuiltinToolUseKind;
      }
    | {
        readonly title: 'Finding files matching ';
        readonly deferLoading?: boolean;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          pattern: string;
          paths?: string[] | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                pattern: string;
                paths?: string[] | undefined;
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
                  pattern: string;
                  paths?: string[] | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                pattern: string;
                paths?: string[] | undefined;
              };
              output: unknown;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<unknown> | undefined;
        readonly execute: import('@ai-sdk/provider-utils').ToolExecuteFunction<
          {
            [x: string]: unknown;
            pattern: string;
            paths?: string[] | undefined;
          },
          unknown,
          any
        >;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: true;
        readonly supportsDeferredResults?: boolean;
        readonly nativeName?: string;
        readonly commonName?: import('./harness.js').HarnessV1BuiltinToolName;
        readonly toolUseKind?: import('./harness.js').HarnessV1BuiltinToolUseKind;
      };
  readonly task: import('@ai-sdk/provider-utils').Tool<
    {
      [x: string]: unknown;
      name: string;
      prompt: string;
      agent_type:
        | 'task'
        | 'explore'
        | 'general-purpose'
        | 'code-review'
        | 'research'
        | 'security-review';
      description: string;
      model?: string | undefined;
      context_tier?: 'default' | 'long_context' | undefined;
      mode?: 'sync' | 'background' | undefined;
    },
    any,
    any
  >;
};
type GitHubCopilotBuiltinTools = typeof GITHUB_COPILOT_BUILTIN_TOOLS;
export declare function createGitHubCopilot(
  settings?: GitHubCopilotHarnessSettings,
): HarnessV1<GitHubCopilotBuiltinTools>;
export declare const VERSION: string;
export declare const githubCopilot: import('./harness.js').HarnessV1<{
  readonly bash:
    | {
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          command: string;
          description?: string | undefined;
          shellId?: string | undefined;
          mode?: 'sync' | 'async' | undefined;
          detach?: boolean | undefined;
          initial_wait?: number | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                command: string;
                description?: string | undefined;
                shellId?: string | undefined;
                mode?: 'sync' | 'async' | undefined;
                detach?: boolean | undefined;
                initial_wait?: number | undefined;
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
                  command: string;
                  description?: string | undefined;
                  shellId?: string | undefined;
                  mode?: 'sync' | 'async' | undefined;
                  detach?: boolean | undefined;
                  initial_wait?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                command: string;
                description?: string | undefined;
                shellId?: string | undefined;
                mode?: 'sync' | 'async' | undefined;
                detach?: boolean | undefined;
                initial_wait?: number | undefined;
              };
              output: unknown;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<unknown>;
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
                command: string;
                description?: string | undefined;
                shellId?: string | undefined;
                mode?: 'sync' | 'async' | undefined;
                detach?: boolean | undefined;
                initial_wait?: number | undefined;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type?: undefined | 'function';
        readonly nativeName?: string;
        readonly commonName?: import('./harness.js').HarnessV1BuiltinToolName;
        readonly toolUseKind?: import('./harness.js').HarnessV1BuiltinToolUseKind;
      }
    | {
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          command: string;
          description?: string | undefined;
          shellId?: string | undefined;
          mode?: 'sync' | 'async' | undefined;
          detach?: boolean | undefined;
          initial_wait?: number | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                command: string;
                description?: string | undefined;
                shellId?: string | undefined;
                mode?: 'sync' | 'async' | undefined;
                detach?: boolean | undefined;
                initial_wait?: number | undefined;
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
                  command: string;
                  description?: string | undefined;
                  shellId?: string | undefined;
                  mode?: 'sync' | 'async' | undefined;
                  detach?: boolean | undefined;
                  initial_wait?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                command: string;
                description?: string | undefined;
                shellId?: string | undefined;
                mode?: 'sync' | 'async' | undefined;
                detach?: boolean | undefined;
                initial_wait?: number | undefined;
              };
              output: unknown;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<unknown> | undefined;
        readonly execute: import('@ai-sdk/provider-utils').ToolExecuteFunction<
          {
            [x: string]: unknown;
            command: string;
            description?: string | undefined;
            shellId?: string | undefined;
            mode?: 'sync' | 'async' | undefined;
            detach?: boolean | undefined;
            initial_wait?: number | undefined;
          },
          unknown,
          any
        >;
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
                command: string;
                description?: string | undefined;
                shellId?: string | undefined;
                mode?: 'sync' | 'async' | undefined;
                detach?: boolean | undefined;
                initial_wait?: number | undefined;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type?: undefined | 'function';
        readonly nativeName?: string;
        readonly commonName?: import('./harness.js').HarnessV1BuiltinToolName;
        readonly toolUseKind?: import('./harness.js').HarnessV1BuiltinToolUseKind;
      }
    | {
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          command: string;
          description?: string | undefined;
          shellId?: string | undefined;
          mode?: 'sync' | 'async' | undefined;
          detach?: boolean | undefined;
          initial_wait?: number | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                command: string;
                description?: string | undefined;
                shellId?: string | undefined;
                mode?: 'sync' | 'async' | undefined;
                detach?: boolean | undefined;
                initial_wait?: number | undefined;
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
                  command: string;
                  description?: string | undefined;
                  shellId?: string | undefined;
                  mode?: 'sync' | 'async' | undefined;
                  detach?: boolean | undefined;
                  initial_wait?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                command: string;
                description?: string | undefined;
                shellId?: string | undefined;
                mode?: 'sync' | 'async' | undefined;
                detach?: boolean | undefined;
                initial_wait?: number | undefined;
              };
              output: unknown;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<unknown>;
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
                command: string;
                description?: string | undefined;
                shellId?: string | undefined;
                mode?: 'sync' | 'async' | undefined;
                detach?: boolean | undefined;
                initial_wait?: number | undefined;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type: 'dynamic';
        readonly nativeName?: string;
        readonly commonName?: import('./harness.js').HarnessV1BuiltinToolName;
        readonly toolUseKind?: import('./harness.js').HarnessV1BuiltinToolUseKind;
      }
    | {
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          command: string;
          description?: string | undefined;
          shellId?: string | undefined;
          mode?: 'sync' | 'async' | undefined;
          detach?: boolean | undefined;
          initial_wait?: number | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                command: string;
                description?: string | undefined;
                shellId?: string | undefined;
                mode?: 'sync' | 'async' | undefined;
                detach?: boolean | undefined;
                initial_wait?: number | undefined;
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
                  command: string;
                  description?: string | undefined;
                  shellId?: string | undefined;
                  mode?: 'sync' | 'async' | undefined;
                  detach?: boolean | undefined;
                  initial_wait?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                command: string;
                description?: string | undefined;
                shellId?: string | undefined;
                mode?: 'sync' | 'async' | undefined;
                detach?: boolean | undefined;
                initial_wait?: number | undefined;
              };
              output: unknown;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<unknown> | undefined;
        readonly execute: import('@ai-sdk/provider-utils').ToolExecuteFunction<
          {
            [x: string]: unknown;
            command: string;
            description?: string | undefined;
            shellId?: string | undefined;
            mode?: 'sync' | 'async' | undefined;
            detach?: boolean | undefined;
            initial_wait?: number | undefined;
          },
          unknown,
          any
        >;
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
                command: string;
                description?: string | undefined;
                shellId?: string | undefined;
                mode?: 'sync' | 'async' | undefined;
                detach?: boolean | undefined;
                initial_wait?: number | undefined;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type: 'dynamic';
        readonly nativeName?: string;
        readonly commonName?: import('./harness.js').HarnessV1BuiltinToolName;
        readonly toolUseKind?: import('./harness.js').HarnessV1BuiltinToolUseKind;
      }
    | {
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          command: string;
          description?: string | undefined;
          shellId?: string | undefined;
          mode?: 'sync' | 'async' | undefined;
          detach?: boolean | undefined;
          initial_wait?: number | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                command: string;
                description?: string | undefined;
                shellId?: string | undefined;
                mode?: 'sync' | 'async' | undefined;
                detach?: boolean | undefined;
                initial_wait?: number | undefined;
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
                  command: string;
                  description?: string | undefined;
                  shellId?: string | undefined;
                  mode?: 'sync' | 'async' | undefined;
                  detach?: boolean | undefined;
                  initial_wait?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                command: string;
                description?: string | undefined;
                shellId?: string | undefined;
                mode?: 'sync' | 'async' | undefined;
                detach?: boolean | undefined;
                initial_wait?: number | undefined;
              };
              output: unknown;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<unknown>;
        readonly execute?: never;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: false;
        readonly supportsDeferredResults?: never;
        readonly nativeName?: string;
        readonly commonName?: import('./harness.js').HarnessV1BuiltinToolName;
        readonly toolUseKind?: import('./harness.js').HarnessV1BuiltinToolUseKind;
      }
    | {
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          command: string;
          description?: string | undefined;
          shellId?: string | undefined;
          mode?: 'sync' | 'async' | undefined;
          detach?: boolean | undefined;
          initial_wait?: number | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                command: string;
                description?: string | undefined;
                shellId?: string | undefined;
                mode?: 'sync' | 'async' | undefined;
                detach?: boolean | undefined;
                initial_wait?: number | undefined;
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
                  command: string;
                  description?: string | undefined;
                  shellId?: string | undefined;
                  mode?: 'sync' | 'async' | undefined;
                  detach?: boolean | undefined;
                  initial_wait?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                command: string;
                description?: string | undefined;
                shellId?: string | undefined;
                mode?: 'sync' | 'async' | undefined;
                detach?: boolean | undefined;
                initial_wait?: number | undefined;
              };
              output: unknown;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<unknown> | undefined;
        readonly execute: import('@ai-sdk/provider-utils').ToolExecuteFunction<
          {
            [x: string]: unknown;
            command: string;
            description?: string | undefined;
            shellId?: string | undefined;
            mode?: 'sync' | 'async' | undefined;
            detach?: boolean | undefined;
            initial_wait?: number | undefined;
          },
          unknown,
          any
        >;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: false;
        readonly supportsDeferredResults?: never;
        readonly nativeName?: string;
        readonly commonName?: import('./harness.js').HarnessV1BuiltinToolName;
        readonly toolUseKind?: import('./harness.js').HarnessV1BuiltinToolUseKind;
      }
    | {
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          command: string;
          description?: string | undefined;
          shellId?: string | undefined;
          mode?: 'sync' | 'async' | undefined;
          detach?: boolean | undefined;
          initial_wait?: number | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                command: string;
                description?: string | undefined;
                shellId?: string | undefined;
                mode?: 'sync' | 'async' | undefined;
                detach?: boolean | undefined;
                initial_wait?: number | undefined;
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
                  command: string;
                  description?: string | undefined;
                  shellId?: string | undefined;
                  mode?: 'sync' | 'async' | undefined;
                  detach?: boolean | undefined;
                  initial_wait?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                command: string;
                description?: string | undefined;
                shellId?: string | undefined;
                mode?: 'sync' | 'async' | undefined;
                detach?: boolean | undefined;
                initial_wait?: number | undefined;
              };
              output: unknown;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<unknown>;
        readonly execute?: never;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: true;
        readonly supportsDeferredResults?: boolean;
        readonly nativeName?: string;
        readonly commonName?: import('./harness.js').HarnessV1BuiltinToolName;
        readonly toolUseKind?: import('./harness.js').HarnessV1BuiltinToolUseKind;
      }
    | {
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          command: string;
          description?: string | undefined;
          shellId?: string | undefined;
          mode?: 'sync' | 'async' | undefined;
          detach?: boolean | undefined;
          initial_wait?: number | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                command: string;
                description?: string | undefined;
                shellId?: string | undefined;
                mode?: 'sync' | 'async' | undefined;
                detach?: boolean | undefined;
                initial_wait?: number | undefined;
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
                  command: string;
                  description?: string | undefined;
                  shellId?: string | undefined;
                  mode?: 'sync' | 'async' | undefined;
                  detach?: boolean | undefined;
                  initial_wait?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                command: string;
                description?: string | undefined;
                shellId?: string | undefined;
                mode?: 'sync' | 'async' | undefined;
                detach?: boolean | undefined;
                initial_wait?: number | undefined;
              };
              output: unknown;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<unknown> | undefined;
        readonly execute: import('@ai-sdk/provider-utils').ToolExecuteFunction<
          {
            [x: string]: unknown;
            command: string;
            description?: string | undefined;
            shellId?: string | undefined;
            mode?: 'sync' | 'async' | undefined;
            detach?: boolean | undefined;
            initial_wait?: number | undefined;
          },
          unknown,
          any
        >;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: true;
        readonly supportsDeferredResults?: boolean;
        readonly nativeName?: string;
        readonly commonName?: import('./harness.js').HarnessV1BuiltinToolName;
        readonly toolUseKind?: import('./harness.js').HarnessV1BuiltinToolUseKind;
      };
  readonly read_bash:
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          shellId: string;
          delay: number;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                shellId: string;
                delay: number;
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
                  shellId: string;
                  delay: number;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                shellId: string;
                delay: number;
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
                shellId: string;
                delay: number;
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
          shellId: string;
          delay: number;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                shellId: string;
                delay: number;
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
                  shellId: string;
                  delay: number;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                shellId: string;
                delay: number;
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
                shellId: string;
                delay: number;
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
                shellId: string;
                delay: number;
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
          shellId: string;
          delay: number;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                shellId: string;
                delay: number;
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
                  shellId: string;
                  delay: number;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                shellId: string;
                delay: number;
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
                shellId: string;
                delay: number;
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
          shellId: string;
          delay: number;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                shellId: string;
                delay: number;
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
                  shellId: string;
                  delay: number;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                shellId: string;
                delay: number;
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
                shellId: string;
                delay: number;
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
                shellId: string;
                delay: number;
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
          shellId: string;
          delay: number;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                shellId: string;
                delay: number;
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
                  shellId: string;
                  delay: number;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                shellId: string;
                delay: number;
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
          shellId: string;
          delay: number;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                shellId: string;
                delay: number;
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
                  shellId: string;
                  delay: number;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                shellId: string;
                delay: number;
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
                shellId: string;
                delay: number;
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
          shellId: string;
          delay: number;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                shellId: string;
                delay: number;
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
                  shellId: string;
                  delay: number;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                shellId: string;
                delay: number;
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
          shellId: string;
          delay: number;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                shellId: string;
                delay: number;
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
                  shellId: string;
                  delay: number;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                shellId: string;
                delay: number;
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
                shellId: string;
                delay: number;
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
  readonly stop_bash:
    | {
        readonly toolUseKind: 'bash';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          shellId: string;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                shellId: string;
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
                  shellId: string;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                shellId: string;
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
                shellId: string;
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
        readonly toolUseKind: 'bash';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          shellId: string;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                shellId: string;
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
                  shellId: string;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                shellId: string;
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
                shellId: string;
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
                shellId: string;
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
        readonly toolUseKind: 'bash';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          shellId: string;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                shellId: string;
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
                  shellId: string;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                shellId: string;
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
                shellId: string;
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
        readonly toolUseKind: 'bash';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          shellId: string;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                shellId: string;
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
                  shellId: string;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                shellId: string;
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
                shellId: string;
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
                shellId: string;
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
        readonly toolUseKind: 'bash';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          shellId: string;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                shellId: string;
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
                  shellId: string;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                shellId: string;
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
        readonly toolUseKind: 'bash';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          shellId: string;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                shellId: string;
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
                  shellId: string;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                shellId: string;
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
                shellId: string;
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
        readonly toolUseKind: 'bash';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          shellId: string;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                shellId: string;
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
                  shellId: string;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                shellId: string;
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
        readonly toolUseKind: 'bash';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          shellId: string;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                shellId: string;
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
                  shellId: string;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                shellId: string;
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
                shellId: string;
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
  readonly list_bash:
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
  readonly view:
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          path: string;
          view_range?: number[] | undefined;
          forceReadLargeFiles?: boolean | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                path: string;
                view_range?: number[] | undefined;
                forceReadLargeFiles?: boolean | undefined;
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
                  path: string;
                  view_range?: number[] | undefined;
                  forceReadLargeFiles?: boolean | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                path: string;
                view_range?: number[] | undefined;
                forceReadLargeFiles?: boolean | undefined;
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
                path: string;
                view_range?: number[] | undefined;
                forceReadLargeFiles?: boolean | undefined;
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
          path: string;
          view_range?: number[] | undefined;
          forceReadLargeFiles?: boolean | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                path: string;
                view_range?: number[] | undefined;
                forceReadLargeFiles?: boolean | undefined;
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
                  path: string;
                  view_range?: number[] | undefined;
                  forceReadLargeFiles?: boolean | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                path: string;
                view_range?: number[] | undefined;
                forceReadLargeFiles?: boolean | undefined;
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
                path: string;
                view_range?: number[] | undefined;
                forceReadLargeFiles?: boolean | undefined;
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
                path: string;
                view_range?: number[] | undefined;
                forceReadLargeFiles?: boolean | undefined;
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
          path: string;
          view_range?: number[] | undefined;
          forceReadLargeFiles?: boolean | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                path: string;
                view_range?: number[] | undefined;
                forceReadLargeFiles?: boolean | undefined;
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
                  path: string;
                  view_range?: number[] | undefined;
                  forceReadLargeFiles?: boolean | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                path: string;
                view_range?: number[] | undefined;
                forceReadLargeFiles?: boolean | undefined;
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
                path: string;
                view_range?: number[] | undefined;
                forceReadLargeFiles?: boolean | undefined;
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
          path: string;
          view_range?: number[] | undefined;
          forceReadLargeFiles?: boolean | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                path: string;
                view_range?: number[] | undefined;
                forceReadLargeFiles?: boolean | undefined;
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
                  path: string;
                  view_range?: number[] | undefined;
                  forceReadLargeFiles?: boolean | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                path: string;
                view_range?: number[] | undefined;
                forceReadLargeFiles?: boolean | undefined;
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
                path: string;
                view_range?: number[] | undefined;
                forceReadLargeFiles?: boolean | undefined;
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
                path: string;
                view_range?: number[] | undefined;
                forceReadLargeFiles?: boolean | undefined;
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
          path: string;
          view_range?: number[] | undefined;
          forceReadLargeFiles?: boolean | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                path: string;
                view_range?: number[] | undefined;
                forceReadLargeFiles?: boolean | undefined;
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
                  path: string;
                  view_range?: number[] | undefined;
                  forceReadLargeFiles?: boolean | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                path: string;
                view_range?: number[] | undefined;
                forceReadLargeFiles?: boolean | undefined;
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
          path: string;
          view_range?: number[] | undefined;
          forceReadLargeFiles?: boolean | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                path: string;
                view_range?: number[] | undefined;
                forceReadLargeFiles?: boolean | undefined;
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
                  path: string;
                  view_range?: number[] | undefined;
                  forceReadLargeFiles?: boolean | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                path: string;
                view_range?: number[] | undefined;
                forceReadLargeFiles?: boolean | undefined;
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
                path: string;
                view_range?: number[] | undefined;
                forceReadLargeFiles?: boolean | undefined;
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
          path: string;
          view_range?: number[] | undefined;
          forceReadLargeFiles?: boolean | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                path: string;
                view_range?: number[] | undefined;
                forceReadLargeFiles?: boolean | undefined;
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
                  path: string;
                  view_range?: number[] | undefined;
                  forceReadLargeFiles?: boolean | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                path: string;
                view_range?: number[] | undefined;
                forceReadLargeFiles?: boolean | undefined;
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
          path: string;
          view_range?: number[] | undefined;
          forceReadLargeFiles?: boolean | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                path: string;
                view_range?: number[] | undefined;
                forceReadLargeFiles?: boolean | undefined;
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
                  path: string;
                  view_range?: number[] | undefined;
                  forceReadLargeFiles?: boolean | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                path: string;
                view_range?: number[] | undefined;
                forceReadLargeFiles?: boolean | undefined;
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
                path: string;
                view_range?: number[] | undefined;
                forceReadLargeFiles?: boolean | undefined;
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
  readonly create:
    | {
        readonly toolUseKind: 'edit';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          path: string;
          file_text: string;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                path: string;
                file_text: string;
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
                  path: string;
                  file_text: string;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                path: string;
                file_text: string;
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
                path: string;
                file_text: string;
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
        readonly toolUseKind: 'edit';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          path: string;
          file_text: string;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                path: string;
                file_text: string;
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
                  path: string;
                  file_text: string;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                path: string;
                file_text: string;
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
                path: string;
                file_text: string;
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
                path: string;
                file_text: string;
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
        readonly toolUseKind: 'edit';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          path: string;
          file_text: string;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                path: string;
                file_text: string;
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
                  path: string;
                  file_text: string;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                path: string;
                file_text: string;
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
                path: string;
                file_text: string;
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
        readonly toolUseKind: 'edit';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          path: string;
          file_text: string;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                path: string;
                file_text: string;
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
                  path: string;
                  file_text: string;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                path: string;
                file_text: string;
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
                path: string;
                file_text: string;
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
                path: string;
                file_text: string;
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
        readonly toolUseKind: 'edit';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          path: string;
          file_text: string;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                path: string;
                file_text: string;
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
                  path: string;
                  file_text: string;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                path: string;
                file_text: string;
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
        readonly toolUseKind: 'edit';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          path: string;
          file_text: string;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                path: string;
                file_text: string;
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
                  path: string;
                  file_text: string;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                path: string;
                file_text: string;
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
                path: string;
                file_text: string;
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
        readonly toolUseKind: 'edit';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          path: string;
          file_text: string;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                path: string;
                file_text: string;
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
                  path: string;
                  file_text: string;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                path: string;
                file_text: string;
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
        readonly toolUseKind: 'edit';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          path: string;
          file_text: string;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                path: string;
                file_text: string;
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
                  path: string;
                  file_text: string;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                path: string;
                file_text: string;
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
                path: string;
                file_text: string;
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
  readonly edit:
    | {
        readonly toolUseKind: 'edit';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          path: string;
          new_str: string;
          old_str?: string | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                path: string;
                new_str: string;
                old_str?: string | undefined;
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
                  path: string;
                  new_str: string;
                  old_str?: string | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                path: string;
                new_str: string;
                old_str?: string | undefined;
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
                path: string;
                new_str: string;
                old_str?: string | undefined;
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
        readonly toolUseKind: 'edit';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          path: string;
          new_str: string;
          old_str?: string | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                path: string;
                new_str: string;
                old_str?: string | undefined;
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
                  path: string;
                  new_str: string;
                  old_str?: string | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                path: string;
                new_str: string;
                old_str?: string | undefined;
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
                path: string;
                new_str: string;
                old_str?: string | undefined;
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
                path: string;
                new_str: string;
                old_str?: string | undefined;
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
        readonly toolUseKind: 'edit';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          path: string;
          new_str: string;
          old_str?: string | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                path: string;
                new_str: string;
                old_str?: string | undefined;
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
                  path: string;
                  new_str: string;
                  old_str?: string | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                path: string;
                new_str: string;
                old_str?: string | undefined;
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
                path: string;
                new_str: string;
                old_str?: string | undefined;
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
        readonly toolUseKind: 'edit';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          path: string;
          new_str: string;
          old_str?: string | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                path: string;
                new_str: string;
                old_str?: string | undefined;
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
                  path: string;
                  new_str: string;
                  old_str?: string | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                path: string;
                new_str: string;
                old_str?: string | undefined;
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
                path: string;
                new_str: string;
                old_str?: string | undefined;
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
                path: string;
                new_str: string;
                old_str?: string | undefined;
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
        readonly toolUseKind: 'edit';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          path: string;
          new_str: string;
          old_str?: string | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                path: string;
                new_str: string;
                old_str?: string | undefined;
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
                  path: string;
                  new_str: string;
                  old_str?: string | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                path: string;
                new_str: string;
                old_str?: string | undefined;
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
        readonly toolUseKind: 'edit';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          path: string;
          new_str: string;
          old_str?: string | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                path: string;
                new_str: string;
                old_str?: string | undefined;
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
                  path: string;
                  new_str: string;
                  old_str?: string | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                path: string;
                new_str: string;
                old_str?: string | undefined;
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
                path: string;
                new_str: string;
                old_str?: string | undefined;
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
        readonly toolUseKind: 'edit';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          path: string;
          new_str: string;
          old_str?: string | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                path: string;
                new_str: string;
                old_str?: string | undefined;
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
                  path: string;
                  new_str: string;
                  old_str?: string | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                path: string;
                new_str: string;
                old_str?: string | undefined;
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
        readonly toolUseKind: 'edit';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          path: string;
          new_str: string;
          old_str?: string | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                path: string;
                new_str: string;
                old_str?: string | undefined;
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
                  path: string;
                  new_str: string;
                  old_str?: string | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                path: string;
                new_str: string;
                old_str?: string | undefined;
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
                path: string;
                new_str: string;
                old_str?: string | undefined;
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
  readonly web_fetch:
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          url: string;
          max_length?: number | undefined;
          start_index?: number | undefined;
          raw?: boolean | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                url: string;
                max_length?: number | undefined;
                start_index?: number | undefined;
                raw?: boolean | undefined;
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
                  url: string;
                  max_length?: number | undefined;
                  start_index?: number | undefined;
                  raw?: boolean | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                url: string;
                max_length?: number | undefined;
                start_index?: number | undefined;
                raw?: boolean | undefined;
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
                url: string;
                max_length?: number | undefined;
                start_index?: number | undefined;
                raw?: boolean | undefined;
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
          url: string;
          max_length?: number | undefined;
          start_index?: number | undefined;
          raw?: boolean | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                url: string;
                max_length?: number | undefined;
                start_index?: number | undefined;
                raw?: boolean | undefined;
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
                  url: string;
                  max_length?: number | undefined;
                  start_index?: number | undefined;
                  raw?: boolean | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                url: string;
                max_length?: number | undefined;
                start_index?: number | undefined;
                raw?: boolean | undefined;
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
                url: string;
                max_length?: number | undefined;
                start_index?: number | undefined;
                raw?: boolean | undefined;
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
                url: string;
                max_length?: number | undefined;
                start_index?: number | undefined;
                raw?: boolean | undefined;
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
          url: string;
          max_length?: number | undefined;
          start_index?: number | undefined;
          raw?: boolean | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                url: string;
                max_length?: number | undefined;
                start_index?: number | undefined;
                raw?: boolean | undefined;
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
                  url: string;
                  max_length?: number | undefined;
                  start_index?: number | undefined;
                  raw?: boolean | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                url: string;
                max_length?: number | undefined;
                start_index?: number | undefined;
                raw?: boolean | undefined;
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
                url: string;
                max_length?: number | undefined;
                start_index?: number | undefined;
                raw?: boolean | undefined;
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
          url: string;
          max_length?: number | undefined;
          start_index?: number | undefined;
          raw?: boolean | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                url: string;
                max_length?: number | undefined;
                start_index?: number | undefined;
                raw?: boolean | undefined;
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
                  url: string;
                  max_length?: number | undefined;
                  start_index?: number | undefined;
                  raw?: boolean | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                url: string;
                max_length?: number | undefined;
                start_index?: number | undefined;
                raw?: boolean | undefined;
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
                url: string;
                max_length?: number | undefined;
                start_index?: number | undefined;
                raw?: boolean | undefined;
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
                url: string;
                max_length?: number | undefined;
                start_index?: number | undefined;
                raw?: boolean | undefined;
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
          url: string;
          max_length?: number | undefined;
          start_index?: number | undefined;
          raw?: boolean | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                url: string;
                max_length?: number | undefined;
                start_index?: number | undefined;
                raw?: boolean | undefined;
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
                  url: string;
                  max_length?: number | undefined;
                  start_index?: number | undefined;
                  raw?: boolean | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                url: string;
                max_length?: number | undefined;
                start_index?: number | undefined;
                raw?: boolean | undefined;
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
          url: string;
          max_length?: number | undefined;
          start_index?: number | undefined;
          raw?: boolean | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                url: string;
                max_length?: number | undefined;
                start_index?: number | undefined;
                raw?: boolean | undefined;
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
                  url: string;
                  max_length?: number | undefined;
                  start_index?: number | undefined;
                  raw?: boolean | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                url: string;
                max_length?: number | undefined;
                start_index?: number | undefined;
                raw?: boolean | undefined;
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
                url: string;
                max_length?: number | undefined;
                start_index?: number | undefined;
                raw?: boolean | undefined;
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
          url: string;
          max_length?: number | undefined;
          start_index?: number | undefined;
          raw?: boolean | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                url: string;
                max_length?: number | undefined;
                start_index?: number | undefined;
                raw?: boolean | undefined;
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
                  url: string;
                  max_length?: number | undefined;
                  start_index?: number | undefined;
                  raw?: boolean | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                url: string;
                max_length?: number | undefined;
                start_index?: number | undefined;
                raw?: boolean | undefined;
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
          url: string;
          max_length?: number | undefined;
          start_index?: number | undefined;
          raw?: boolean | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                url: string;
                max_length?: number | undefined;
                start_index?: number | undefined;
                raw?: boolean | undefined;
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
                  url: string;
                  max_length?: number | undefined;
                  start_index?: number | undefined;
                  raw?: boolean | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                url: string;
                max_length?: number | undefined;
                start_index?: number | undefined;
                raw?: boolean | undefined;
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
                url: string;
                max_length?: number | undefined;
                start_index?: number | undefined;
                raw?: boolean | undefined;
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
  readonly skill: import('@ai-sdk/provider-utils').Tool<
    {
      [x: string]: unknown;
      skill: string;
    },
    any,
    any
  >;
  readonly sql: import('@ai-sdk/provider-utils').Tool<
    {
      [x: string]: unknown;
      description: string;
      query: string;
      database?: 'session' | 'session_store' | undefined;
    },
    any,
    any
  >;
  readonly read_agent:
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          agent_id: string;
          wait?: boolean | undefined;
          timeout?: number | undefined;
          since_turn?: number | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                agent_id: string;
                wait?: boolean | undefined;
                timeout?: number | undefined;
                since_turn?: number | undefined;
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
                  agent_id: string;
                  wait?: boolean | undefined;
                  timeout?: number | undefined;
                  since_turn?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                agent_id: string;
                wait?: boolean | undefined;
                timeout?: number | undefined;
                since_turn?: number | undefined;
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
                agent_id: string;
                wait?: boolean | undefined;
                timeout?: number | undefined;
                since_turn?: number | undefined;
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
          agent_id: string;
          wait?: boolean | undefined;
          timeout?: number | undefined;
          since_turn?: number | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                agent_id: string;
                wait?: boolean | undefined;
                timeout?: number | undefined;
                since_turn?: number | undefined;
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
                  agent_id: string;
                  wait?: boolean | undefined;
                  timeout?: number | undefined;
                  since_turn?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                agent_id: string;
                wait?: boolean | undefined;
                timeout?: number | undefined;
                since_turn?: number | undefined;
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
                agent_id: string;
                wait?: boolean | undefined;
                timeout?: number | undefined;
                since_turn?: number | undefined;
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
                agent_id: string;
                wait?: boolean | undefined;
                timeout?: number | undefined;
                since_turn?: number | undefined;
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
          agent_id: string;
          wait?: boolean | undefined;
          timeout?: number | undefined;
          since_turn?: number | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                agent_id: string;
                wait?: boolean | undefined;
                timeout?: number | undefined;
                since_turn?: number | undefined;
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
                  agent_id: string;
                  wait?: boolean | undefined;
                  timeout?: number | undefined;
                  since_turn?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                agent_id: string;
                wait?: boolean | undefined;
                timeout?: number | undefined;
                since_turn?: number | undefined;
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
                agent_id: string;
                wait?: boolean | undefined;
                timeout?: number | undefined;
                since_turn?: number | undefined;
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
          agent_id: string;
          wait?: boolean | undefined;
          timeout?: number | undefined;
          since_turn?: number | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                agent_id: string;
                wait?: boolean | undefined;
                timeout?: number | undefined;
                since_turn?: number | undefined;
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
                  agent_id: string;
                  wait?: boolean | undefined;
                  timeout?: number | undefined;
                  since_turn?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                agent_id: string;
                wait?: boolean | undefined;
                timeout?: number | undefined;
                since_turn?: number | undefined;
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
                agent_id: string;
                wait?: boolean | undefined;
                timeout?: number | undefined;
                since_turn?: number | undefined;
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
                agent_id: string;
                wait?: boolean | undefined;
                timeout?: number | undefined;
                since_turn?: number | undefined;
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
          agent_id: string;
          wait?: boolean | undefined;
          timeout?: number | undefined;
          since_turn?: number | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                agent_id: string;
                wait?: boolean | undefined;
                timeout?: number | undefined;
                since_turn?: number | undefined;
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
                  agent_id: string;
                  wait?: boolean | undefined;
                  timeout?: number | undefined;
                  since_turn?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                agent_id: string;
                wait?: boolean | undefined;
                timeout?: number | undefined;
                since_turn?: number | undefined;
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
          agent_id: string;
          wait?: boolean | undefined;
          timeout?: number | undefined;
          since_turn?: number | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                agent_id: string;
                wait?: boolean | undefined;
                timeout?: number | undefined;
                since_turn?: number | undefined;
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
                  agent_id: string;
                  wait?: boolean | undefined;
                  timeout?: number | undefined;
                  since_turn?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                agent_id: string;
                wait?: boolean | undefined;
                timeout?: number | undefined;
                since_turn?: number | undefined;
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
                agent_id: string;
                wait?: boolean | undefined;
                timeout?: number | undefined;
                since_turn?: number | undefined;
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
          agent_id: string;
          wait?: boolean | undefined;
          timeout?: number | undefined;
          since_turn?: number | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                agent_id: string;
                wait?: boolean | undefined;
                timeout?: number | undefined;
                since_turn?: number | undefined;
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
                  agent_id: string;
                  wait?: boolean | undefined;
                  timeout?: number | undefined;
                  since_turn?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                agent_id: string;
                wait?: boolean | undefined;
                timeout?: number | undefined;
                since_turn?: number | undefined;
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
          agent_id: string;
          wait?: boolean | undefined;
          timeout?: number | undefined;
          since_turn?: number | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                agent_id: string;
                wait?: boolean | undefined;
                timeout?: number | undefined;
                since_turn?: number | undefined;
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
                  agent_id: string;
                  wait?: boolean | undefined;
                  timeout?: number | undefined;
                  since_turn?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                agent_id: string;
                wait?: boolean | undefined;
                timeout?: number | undefined;
                since_turn?: number | undefined;
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
                agent_id: string;
                wait?: boolean | undefined;
                timeout?: number | undefined;
                since_turn?: number | undefined;
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
  readonly list_agents:
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          include_completed?: boolean | undefined;
          scope?: 'siblings' | 'children' | 'all' | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                include_completed?: boolean | undefined;
                scope?: 'siblings' | 'children' | 'all' | undefined;
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
                  include_completed?: boolean | undefined;
                  scope?: 'siblings' | 'children' | 'all' | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                include_completed?: boolean | undefined;
                scope?: 'siblings' | 'children' | 'all' | undefined;
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
                include_completed?: boolean | undefined;
                scope?: 'siblings' | 'children' | 'all' | undefined;
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
          include_completed?: boolean | undefined;
          scope?: 'siblings' | 'children' | 'all' | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                include_completed?: boolean | undefined;
                scope?: 'siblings' | 'children' | 'all' | undefined;
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
                  include_completed?: boolean | undefined;
                  scope?: 'siblings' | 'children' | 'all' | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                include_completed?: boolean | undefined;
                scope?: 'siblings' | 'children' | 'all' | undefined;
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
                include_completed?: boolean | undefined;
                scope?: 'siblings' | 'children' | 'all' | undefined;
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
                include_completed?: boolean | undefined;
                scope?: 'siblings' | 'children' | 'all' | undefined;
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
          include_completed?: boolean | undefined;
          scope?: 'siblings' | 'children' | 'all' | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                include_completed?: boolean | undefined;
                scope?: 'siblings' | 'children' | 'all' | undefined;
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
                  include_completed?: boolean | undefined;
                  scope?: 'siblings' | 'children' | 'all' | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                include_completed?: boolean | undefined;
                scope?: 'siblings' | 'children' | 'all' | undefined;
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
                include_completed?: boolean | undefined;
                scope?: 'siblings' | 'children' | 'all' | undefined;
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
          include_completed?: boolean | undefined;
          scope?: 'siblings' | 'children' | 'all' | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                include_completed?: boolean | undefined;
                scope?: 'siblings' | 'children' | 'all' | undefined;
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
                  include_completed?: boolean | undefined;
                  scope?: 'siblings' | 'children' | 'all' | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                include_completed?: boolean | undefined;
                scope?: 'siblings' | 'children' | 'all' | undefined;
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
                include_completed?: boolean | undefined;
                scope?: 'siblings' | 'children' | 'all' | undefined;
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
                include_completed?: boolean | undefined;
                scope?: 'siblings' | 'children' | 'all' | undefined;
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
          include_completed?: boolean | undefined;
          scope?: 'siblings' | 'children' | 'all' | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                include_completed?: boolean | undefined;
                scope?: 'siblings' | 'children' | 'all' | undefined;
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
                  include_completed?: boolean | undefined;
                  scope?: 'siblings' | 'children' | 'all' | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                include_completed?: boolean | undefined;
                scope?: 'siblings' | 'children' | 'all' | undefined;
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
          include_completed?: boolean | undefined;
          scope?: 'siblings' | 'children' | 'all' | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                include_completed?: boolean | undefined;
                scope?: 'siblings' | 'children' | 'all' | undefined;
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
                  include_completed?: boolean | undefined;
                  scope?: 'siblings' | 'children' | 'all' | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                include_completed?: boolean | undefined;
                scope?: 'siblings' | 'children' | 'all' | undefined;
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
                include_completed?: boolean | undefined;
                scope?: 'siblings' | 'children' | 'all' | undefined;
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
          include_completed?: boolean | undefined;
          scope?: 'siblings' | 'children' | 'all' | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                include_completed?: boolean | undefined;
                scope?: 'siblings' | 'children' | 'all' | undefined;
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
                  include_completed?: boolean | undefined;
                  scope?: 'siblings' | 'children' | 'all' | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                include_completed?: boolean | undefined;
                scope?: 'siblings' | 'children' | 'all' | undefined;
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
          include_completed?: boolean | undefined;
          scope?: 'siblings' | 'children' | 'all' | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                include_completed?: boolean | undefined;
                scope?: 'siblings' | 'children' | 'all' | undefined;
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
                  include_completed?: boolean | undefined;
                  scope?: 'siblings' | 'children' | 'all' | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                include_completed?: boolean | undefined;
                scope?: 'siblings' | 'children' | 'all' | undefined;
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
                include_completed?: boolean | undefined;
                scope?: 'siblings' | 'children' | 'all' | undefined;
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
  readonly write_agent: import('@ai-sdk/provider-utils').Tool<
    {
      [x: string]: unknown;
      message: string;
      agent_id?: string | undefined;
      agent_ids?: string[] | undefined;
      scope?: 'siblings' | 'children' | undefined;
    },
    any,
    any
  >;
  readonly grep:
    | {
        readonly title: 'Searching for ';
        readonly deferLoading?: boolean;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          pattern: string;
          path?: string | undefined;
          paths?: string[] | undefined;
          glob?: string | undefined;
          output_mode?: 'content' | 'files_with_matches' | 'count' | undefined;
          case_insensitive?: boolean | undefined;
          multiline?: boolean | undefined;
          head_limit?: number | undefined;
          context?: number | undefined;
          before_context?: number | undefined;
          after_context?: number | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                pattern: string;
                path?: string | undefined;
                paths?: string[] | undefined;
                glob?: string | undefined;
                output_mode?:
                  'content' | 'files_with_matches' | 'count' | undefined;
                case_insensitive?: boolean | undefined;
                multiline?: boolean | undefined;
                head_limit?: number | undefined;
                context?: number | undefined;
                before_context?: number | undefined;
                after_context?: number | undefined;
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
                  pattern: string;
                  path?: string | undefined;
                  paths?: string[] | undefined;
                  glob?: string | undefined;
                  output_mode?:
                    'content' | 'files_with_matches' | 'count' | undefined;
                  case_insensitive?: boolean | undefined;
                  multiline?: boolean | undefined;
                  head_limit?: number | undefined;
                  context?: number | undefined;
                  before_context?: number | undefined;
                  after_context?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                pattern: string;
                path?: string | undefined;
                paths?: string[] | undefined;
                glob?: string | undefined;
                output_mode?:
                  'content' | 'files_with_matches' | 'count' | undefined;
                case_insensitive?: boolean | undefined;
                multiline?: boolean | undefined;
                head_limit?: number | undefined;
                context?: number | undefined;
                before_context?: number | undefined;
                after_context?: number | undefined;
              };
              output: unknown;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<unknown>;
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
                pattern: string;
                path?: string | undefined;
                paths?: string[] | undefined;
                glob?: string | undefined;
                output_mode?:
                  'content' | 'files_with_matches' | 'count' | undefined;
                case_insensitive?: boolean | undefined;
                multiline?: boolean | undefined;
                head_limit?: number | undefined;
                context?: number | undefined;
                before_context?: number | undefined;
                after_context?: number | undefined;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type?: undefined | 'function';
        readonly nativeName?: string;
        readonly commonName?: import('./harness.js').HarnessV1BuiltinToolName;
        readonly toolUseKind?: import('./harness.js').HarnessV1BuiltinToolUseKind;
      }
    | {
        readonly title: 'Searching for ';
        readonly deferLoading?: boolean;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          pattern: string;
          path?: string | undefined;
          paths?: string[] | undefined;
          glob?: string | undefined;
          output_mode?: 'content' | 'files_with_matches' | 'count' | undefined;
          case_insensitive?: boolean | undefined;
          multiline?: boolean | undefined;
          head_limit?: number | undefined;
          context?: number | undefined;
          before_context?: number | undefined;
          after_context?: number | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                pattern: string;
                path?: string | undefined;
                paths?: string[] | undefined;
                glob?: string | undefined;
                output_mode?:
                  'content' | 'files_with_matches' | 'count' | undefined;
                case_insensitive?: boolean | undefined;
                multiline?: boolean | undefined;
                head_limit?: number | undefined;
                context?: number | undefined;
                before_context?: number | undefined;
                after_context?: number | undefined;
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
                  pattern: string;
                  path?: string | undefined;
                  paths?: string[] | undefined;
                  glob?: string | undefined;
                  output_mode?:
                    'content' | 'files_with_matches' | 'count' | undefined;
                  case_insensitive?: boolean | undefined;
                  multiline?: boolean | undefined;
                  head_limit?: number | undefined;
                  context?: number | undefined;
                  before_context?: number | undefined;
                  after_context?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                pattern: string;
                path?: string | undefined;
                paths?: string[] | undefined;
                glob?: string | undefined;
                output_mode?:
                  'content' | 'files_with_matches' | 'count' | undefined;
                case_insensitive?: boolean | undefined;
                multiline?: boolean | undefined;
                head_limit?: number | undefined;
                context?: number | undefined;
                before_context?: number | undefined;
                after_context?: number | undefined;
              };
              output: unknown;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<unknown> | undefined;
        readonly execute: import('@ai-sdk/provider-utils').ToolExecuteFunction<
          {
            [x: string]: unknown;
            pattern: string;
            path?: string | undefined;
            paths?: string[] | undefined;
            glob?: string | undefined;
            output_mode?:
              'content' | 'files_with_matches' | 'count' | undefined;
            case_insensitive?: boolean | undefined;
            multiline?: boolean | undefined;
            head_limit?: number | undefined;
            context?: number | undefined;
            before_context?: number | undefined;
            after_context?: number | undefined;
          },
          unknown,
          any
        >;
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
                pattern: string;
                path?: string | undefined;
                paths?: string[] | undefined;
                glob?: string | undefined;
                output_mode?:
                  'content' | 'files_with_matches' | 'count' | undefined;
                case_insensitive?: boolean | undefined;
                multiline?: boolean | undefined;
                head_limit?: number | undefined;
                context?: number | undefined;
                before_context?: number | undefined;
                after_context?: number | undefined;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type?: undefined | 'function';
        readonly nativeName?: string;
        readonly commonName?: import('./harness.js').HarnessV1BuiltinToolName;
        readonly toolUseKind?: import('./harness.js').HarnessV1BuiltinToolUseKind;
      }
    | {
        readonly title: 'Searching for ';
        readonly deferLoading?: boolean;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          pattern: string;
          path?: string | undefined;
          paths?: string[] | undefined;
          glob?: string | undefined;
          output_mode?: 'content' | 'files_with_matches' | 'count' | undefined;
          case_insensitive?: boolean | undefined;
          multiline?: boolean | undefined;
          head_limit?: number | undefined;
          context?: number | undefined;
          before_context?: number | undefined;
          after_context?: number | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                pattern: string;
                path?: string | undefined;
                paths?: string[] | undefined;
                glob?: string | undefined;
                output_mode?:
                  'content' | 'files_with_matches' | 'count' | undefined;
                case_insensitive?: boolean | undefined;
                multiline?: boolean | undefined;
                head_limit?: number | undefined;
                context?: number | undefined;
                before_context?: number | undefined;
                after_context?: number | undefined;
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
                  pattern: string;
                  path?: string | undefined;
                  paths?: string[] | undefined;
                  glob?: string | undefined;
                  output_mode?:
                    'content' | 'files_with_matches' | 'count' | undefined;
                  case_insensitive?: boolean | undefined;
                  multiline?: boolean | undefined;
                  head_limit?: number | undefined;
                  context?: number | undefined;
                  before_context?: number | undefined;
                  after_context?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                pattern: string;
                path?: string | undefined;
                paths?: string[] | undefined;
                glob?: string | undefined;
                output_mode?:
                  'content' | 'files_with_matches' | 'count' | undefined;
                case_insensitive?: boolean | undefined;
                multiline?: boolean | undefined;
                head_limit?: number | undefined;
                context?: number | undefined;
                before_context?: number | undefined;
                after_context?: number | undefined;
              };
              output: unknown;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<unknown>;
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
                pattern: string;
                path?: string | undefined;
                paths?: string[] | undefined;
                glob?: string | undefined;
                output_mode?:
                  'content' | 'files_with_matches' | 'count' | undefined;
                case_insensitive?: boolean | undefined;
                multiline?: boolean | undefined;
                head_limit?: number | undefined;
                context?: number | undefined;
                before_context?: number | undefined;
                after_context?: number | undefined;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type: 'dynamic';
        readonly nativeName?: string;
        readonly commonName?: import('./harness.js').HarnessV1BuiltinToolName;
        readonly toolUseKind?: import('./harness.js').HarnessV1BuiltinToolUseKind;
      }
    | {
        readonly title: 'Searching for ';
        readonly deferLoading?: boolean;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          pattern: string;
          path?: string | undefined;
          paths?: string[] | undefined;
          glob?: string | undefined;
          output_mode?: 'content' | 'files_with_matches' | 'count' | undefined;
          case_insensitive?: boolean | undefined;
          multiline?: boolean | undefined;
          head_limit?: number | undefined;
          context?: number | undefined;
          before_context?: number | undefined;
          after_context?: number | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                pattern: string;
                path?: string | undefined;
                paths?: string[] | undefined;
                glob?: string | undefined;
                output_mode?:
                  'content' | 'files_with_matches' | 'count' | undefined;
                case_insensitive?: boolean | undefined;
                multiline?: boolean | undefined;
                head_limit?: number | undefined;
                context?: number | undefined;
                before_context?: number | undefined;
                after_context?: number | undefined;
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
                  pattern: string;
                  path?: string | undefined;
                  paths?: string[] | undefined;
                  glob?: string | undefined;
                  output_mode?:
                    'content' | 'files_with_matches' | 'count' | undefined;
                  case_insensitive?: boolean | undefined;
                  multiline?: boolean | undefined;
                  head_limit?: number | undefined;
                  context?: number | undefined;
                  before_context?: number | undefined;
                  after_context?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                pattern: string;
                path?: string | undefined;
                paths?: string[] | undefined;
                glob?: string | undefined;
                output_mode?:
                  'content' | 'files_with_matches' | 'count' | undefined;
                case_insensitive?: boolean | undefined;
                multiline?: boolean | undefined;
                head_limit?: number | undefined;
                context?: number | undefined;
                before_context?: number | undefined;
                after_context?: number | undefined;
              };
              output: unknown;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<unknown> | undefined;
        readonly execute: import('@ai-sdk/provider-utils').ToolExecuteFunction<
          {
            [x: string]: unknown;
            pattern: string;
            path?: string | undefined;
            paths?: string[] | undefined;
            glob?: string | undefined;
            output_mode?:
              'content' | 'files_with_matches' | 'count' | undefined;
            case_insensitive?: boolean | undefined;
            multiline?: boolean | undefined;
            head_limit?: number | undefined;
            context?: number | undefined;
            before_context?: number | undefined;
            after_context?: number | undefined;
          },
          unknown,
          any
        >;
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
                pattern: string;
                path?: string | undefined;
                paths?: string[] | undefined;
                glob?: string | undefined;
                output_mode?:
                  'content' | 'files_with_matches' | 'count' | undefined;
                case_insensitive?: boolean | undefined;
                multiline?: boolean | undefined;
                head_limit?: number | undefined;
                context?: number | undefined;
                before_context?: number | undefined;
                after_context?: number | undefined;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type: 'dynamic';
        readonly nativeName?: string;
        readonly commonName?: import('./harness.js').HarnessV1BuiltinToolName;
        readonly toolUseKind?: import('./harness.js').HarnessV1BuiltinToolUseKind;
      }
    | {
        readonly title: 'Searching for ';
        readonly deferLoading?: boolean;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          pattern: string;
          path?: string | undefined;
          paths?: string[] | undefined;
          glob?: string | undefined;
          output_mode?: 'content' | 'files_with_matches' | 'count' | undefined;
          case_insensitive?: boolean | undefined;
          multiline?: boolean | undefined;
          head_limit?: number | undefined;
          context?: number | undefined;
          before_context?: number | undefined;
          after_context?: number | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                pattern: string;
                path?: string | undefined;
                paths?: string[] | undefined;
                glob?: string | undefined;
                output_mode?:
                  'content' | 'files_with_matches' | 'count' | undefined;
                case_insensitive?: boolean | undefined;
                multiline?: boolean | undefined;
                head_limit?: number | undefined;
                context?: number | undefined;
                before_context?: number | undefined;
                after_context?: number | undefined;
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
                  pattern: string;
                  path?: string | undefined;
                  paths?: string[] | undefined;
                  glob?: string | undefined;
                  output_mode?:
                    'content' | 'files_with_matches' | 'count' | undefined;
                  case_insensitive?: boolean | undefined;
                  multiline?: boolean | undefined;
                  head_limit?: number | undefined;
                  context?: number | undefined;
                  before_context?: number | undefined;
                  after_context?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                pattern: string;
                path?: string | undefined;
                paths?: string[] | undefined;
                glob?: string | undefined;
                output_mode?:
                  'content' | 'files_with_matches' | 'count' | undefined;
                case_insensitive?: boolean | undefined;
                multiline?: boolean | undefined;
                head_limit?: number | undefined;
                context?: number | undefined;
                before_context?: number | undefined;
                after_context?: number | undefined;
              };
              output: unknown;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<unknown>;
        readonly execute?: never;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: false;
        readonly supportsDeferredResults?: never;
        readonly nativeName?: string;
        readonly commonName?: import('./harness.js').HarnessV1BuiltinToolName;
        readonly toolUseKind?: import('./harness.js').HarnessV1BuiltinToolUseKind;
      }
    | {
        readonly title: 'Searching for ';
        readonly deferLoading?: boolean;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          pattern: string;
          path?: string | undefined;
          paths?: string[] | undefined;
          glob?: string | undefined;
          output_mode?: 'content' | 'files_with_matches' | 'count' | undefined;
          case_insensitive?: boolean | undefined;
          multiline?: boolean | undefined;
          head_limit?: number | undefined;
          context?: number | undefined;
          before_context?: number | undefined;
          after_context?: number | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                pattern: string;
                path?: string | undefined;
                paths?: string[] | undefined;
                glob?: string | undefined;
                output_mode?:
                  'content' | 'files_with_matches' | 'count' | undefined;
                case_insensitive?: boolean | undefined;
                multiline?: boolean | undefined;
                head_limit?: number | undefined;
                context?: number | undefined;
                before_context?: number | undefined;
                after_context?: number | undefined;
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
                  pattern: string;
                  path?: string | undefined;
                  paths?: string[] | undefined;
                  glob?: string | undefined;
                  output_mode?:
                    'content' | 'files_with_matches' | 'count' | undefined;
                  case_insensitive?: boolean | undefined;
                  multiline?: boolean | undefined;
                  head_limit?: number | undefined;
                  context?: number | undefined;
                  before_context?: number | undefined;
                  after_context?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                pattern: string;
                path?: string | undefined;
                paths?: string[] | undefined;
                glob?: string | undefined;
                output_mode?:
                  'content' | 'files_with_matches' | 'count' | undefined;
                case_insensitive?: boolean | undefined;
                multiline?: boolean | undefined;
                head_limit?: number | undefined;
                context?: number | undefined;
                before_context?: number | undefined;
                after_context?: number | undefined;
              };
              output: unknown;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<unknown> | undefined;
        readonly execute: import('@ai-sdk/provider-utils').ToolExecuteFunction<
          {
            [x: string]: unknown;
            pattern: string;
            path?: string | undefined;
            paths?: string[] | undefined;
            glob?: string | undefined;
            output_mode?:
              'content' | 'files_with_matches' | 'count' | undefined;
            case_insensitive?: boolean | undefined;
            multiline?: boolean | undefined;
            head_limit?: number | undefined;
            context?: number | undefined;
            before_context?: number | undefined;
            after_context?: number | undefined;
          },
          unknown,
          any
        >;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: false;
        readonly supportsDeferredResults?: never;
        readonly nativeName?: string;
        readonly commonName?: import('./harness.js').HarnessV1BuiltinToolName;
        readonly toolUseKind?: import('./harness.js').HarnessV1BuiltinToolUseKind;
      }
    | {
        readonly title: 'Searching for ';
        readonly deferLoading?: boolean;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          pattern: string;
          path?: string | undefined;
          paths?: string[] | undefined;
          glob?: string | undefined;
          output_mode?: 'content' | 'files_with_matches' | 'count' | undefined;
          case_insensitive?: boolean | undefined;
          multiline?: boolean | undefined;
          head_limit?: number | undefined;
          context?: number | undefined;
          before_context?: number | undefined;
          after_context?: number | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                pattern: string;
                path?: string | undefined;
                paths?: string[] | undefined;
                glob?: string | undefined;
                output_mode?:
                  'content' | 'files_with_matches' | 'count' | undefined;
                case_insensitive?: boolean | undefined;
                multiline?: boolean | undefined;
                head_limit?: number | undefined;
                context?: number | undefined;
                before_context?: number | undefined;
                after_context?: number | undefined;
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
                  pattern: string;
                  path?: string | undefined;
                  paths?: string[] | undefined;
                  glob?: string | undefined;
                  output_mode?:
                    'content' | 'files_with_matches' | 'count' | undefined;
                  case_insensitive?: boolean | undefined;
                  multiline?: boolean | undefined;
                  head_limit?: number | undefined;
                  context?: number | undefined;
                  before_context?: number | undefined;
                  after_context?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                pattern: string;
                path?: string | undefined;
                paths?: string[] | undefined;
                glob?: string | undefined;
                output_mode?:
                  'content' | 'files_with_matches' | 'count' | undefined;
                case_insensitive?: boolean | undefined;
                multiline?: boolean | undefined;
                head_limit?: number | undefined;
                context?: number | undefined;
                before_context?: number | undefined;
                after_context?: number | undefined;
              };
              output: unknown;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<unknown>;
        readonly execute?: never;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: true;
        readonly supportsDeferredResults?: boolean;
        readonly nativeName?: string;
        readonly commonName?: import('./harness.js').HarnessV1BuiltinToolName;
        readonly toolUseKind?: import('./harness.js').HarnessV1BuiltinToolUseKind;
      }
    | {
        readonly title: 'Searching for ';
        readonly deferLoading?: boolean;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          pattern: string;
          path?: string | undefined;
          paths?: string[] | undefined;
          glob?: string | undefined;
          output_mode?: 'content' | 'files_with_matches' | 'count' | undefined;
          case_insensitive?: boolean | undefined;
          multiline?: boolean | undefined;
          head_limit?: number | undefined;
          context?: number | undefined;
          before_context?: number | undefined;
          after_context?: number | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                pattern: string;
                path?: string | undefined;
                paths?: string[] | undefined;
                glob?: string | undefined;
                output_mode?:
                  'content' | 'files_with_matches' | 'count' | undefined;
                case_insensitive?: boolean | undefined;
                multiline?: boolean | undefined;
                head_limit?: number | undefined;
                context?: number | undefined;
                before_context?: number | undefined;
                after_context?: number | undefined;
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
                  pattern: string;
                  path?: string | undefined;
                  paths?: string[] | undefined;
                  glob?: string | undefined;
                  output_mode?:
                    'content' | 'files_with_matches' | 'count' | undefined;
                  case_insensitive?: boolean | undefined;
                  multiline?: boolean | undefined;
                  head_limit?: number | undefined;
                  context?: number | undefined;
                  before_context?: number | undefined;
                  after_context?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                pattern: string;
                path?: string | undefined;
                paths?: string[] | undefined;
                glob?: string | undefined;
                output_mode?:
                  'content' | 'files_with_matches' | 'count' | undefined;
                case_insensitive?: boolean | undefined;
                multiline?: boolean | undefined;
                head_limit?: number | undefined;
                context?: number | undefined;
                before_context?: number | undefined;
                after_context?: number | undefined;
              };
              output: unknown;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<unknown> | undefined;
        readonly execute: import('@ai-sdk/provider-utils').ToolExecuteFunction<
          {
            [x: string]: unknown;
            pattern: string;
            path?: string | undefined;
            paths?: string[] | undefined;
            glob?: string | undefined;
            output_mode?:
              'content' | 'files_with_matches' | 'count' | undefined;
            case_insensitive?: boolean | undefined;
            multiline?: boolean | undefined;
            head_limit?: number | undefined;
            context?: number | undefined;
            before_context?: number | undefined;
            after_context?: number | undefined;
          },
          unknown,
          any
        >;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: true;
        readonly supportsDeferredResults?: boolean;
        readonly nativeName?: string;
        readonly commonName?: import('./harness.js').HarnessV1BuiltinToolName;
        readonly toolUseKind?: import('./harness.js').HarnessV1BuiltinToolUseKind;
      };
  readonly glob:
    | {
        readonly title: 'Finding files matching ';
        readonly deferLoading?: boolean;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          pattern: string;
          paths?: string[] | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                pattern: string;
                paths?: string[] | undefined;
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
                  pattern: string;
                  paths?: string[] | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                pattern: string;
                paths?: string[] | undefined;
              };
              output: unknown;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<unknown>;
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
                pattern: string;
                paths?: string[] | undefined;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type?: undefined | 'function';
        readonly nativeName?: string;
        readonly commonName?: import('./harness.js').HarnessV1BuiltinToolName;
        readonly toolUseKind?: import('./harness.js').HarnessV1BuiltinToolUseKind;
      }
    | {
        readonly title: 'Finding files matching ';
        readonly deferLoading?: boolean;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          pattern: string;
          paths?: string[] | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                pattern: string;
                paths?: string[] | undefined;
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
                  pattern: string;
                  paths?: string[] | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                pattern: string;
                paths?: string[] | undefined;
              };
              output: unknown;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<unknown> | undefined;
        readonly execute: import('@ai-sdk/provider-utils').ToolExecuteFunction<
          {
            [x: string]: unknown;
            pattern: string;
            paths?: string[] | undefined;
          },
          unknown,
          any
        >;
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
                pattern: string;
                paths?: string[] | undefined;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type?: undefined | 'function';
        readonly nativeName?: string;
        readonly commonName?: import('./harness.js').HarnessV1BuiltinToolName;
        readonly toolUseKind?: import('./harness.js').HarnessV1BuiltinToolUseKind;
      }
    | {
        readonly title: 'Finding files matching ';
        readonly deferLoading?: boolean;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          pattern: string;
          paths?: string[] | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                pattern: string;
                paths?: string[] | undefined;
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
                  pattern: string;
                  paths?: string[] | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                pattern: string;
                paths?: string[] | undefined;
              };
              output: unknown;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<unknown>;
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
                pattern: string;
                paths?: string[] | undefined;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type: 'dynamic';
        readonly nativeName?: string;
        readonly commonName?: import('./harness.js').HarnessV1BuiltinToolName;
        readonly toolUseKind?: import('./harness.js').HarnessV1BuiltinToolUseKind;
      }
    | {
        readonly title: 'Finding files matching ';
        readonly deferLoading?: boolean;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          pattern: string;
          paths?: string[] | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                pattern: string;
                paths?: string[] | undefined;
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
                  pattern: string;
                  paths?: string[] | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                pattern: string;
                paths?: string[] | undefined;
              };
              output: unknown;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<unknown> | undefined;
        readonly execute: import('@ai-sdk/provider-utils').ToolExecuteFunction<
          {
            [x: string]: unknown;
            pattern: string;
            paths?: string[] | undefined;
          },
          unknown,
          any
        >;
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
                pattern: string;
                paths?: string[] | undefined;
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type: 'dynamic';
        readonly nativeName?: string;
        readonly commonName?: import('./harness.js').HarnessV1BuiltinToolName;
        readonly toolUseKind?: import('./harness.js').HarnessV1BuiltinToolUseKind;
      }
    | {
        readonly title: 'Finding files matching ';
        readonly deferLoading?: boolean;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          pattern: string;
          paths?: string[] | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                pattern: string;
                paths?: string[] | undefined;
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
                  pattern: string;
                  paths?: string[] | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                pattern: string;
                paths?: string[] | undefined;
              };
              output: unknown;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<unknown>;
        readonly execute?: never;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: false;
        readonly supportsDeferredResults?: never;
        readonly nativeName?: string;
        readonly commonName?: import('./harness.js').HarnessV1BuiltinToolName;
        readonly toolUseKind?: import('./harness.js').HarnessV1BuiltinToolUseKind;
      }
    | {
        readonly title: 'Finding files matching ';
        readonly deferLoading?: boolean;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          pattern: string;
          paths?: string[] | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                pattern: string;
                paths?: string[] | undefined;
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
                  pattern: string;
                  paths?: string[] | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                pattern: string;
                paths?: string[] | undefined;
              };
              output: unknown;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<unknown> | undefined;
        readonly execute: import('@ai-sdk/provider-utils').ToolExecuteFunction<
          {
            [x: string]: unknown;
            pattern: string;
            paths?: string[] | undefined;
          },
          unknown,
          any
        >;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: false;
        readonly supportsDeferredResults?: never;
        readonly nativeName?: string;
        readonly commonName?: import('./harness.js').HarnessV1BuiltinToolName;
        readonly toolUseKind?: import('./harness.js').HarnessV1BuiltinToolUseKind;
      }
    | {
        readonly title: 'Finding files matching ';
        readonly deferLoading?: boolean;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          pattern: string;
          paths?: string[] | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                pattern: string;
                paths?: string[] | undefined;
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
                  pattern: string;
                  paths?: string[] | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                pattern: string;
                paths?: string[] | undefined;
              };
              output: unknown;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<unknown>;
        readonly execute?: never;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: true;
        readonly supportsDeferredResults?: boolean;
        readonly nativeName?: string;
        readonly commonName?: import('./harness.js').HarnessV1BuiltinToolName;
        readonly toolUseKind?: import('./harness.js').HarnessV1BuiltinToolUseKind;
      }
    | {
        readonly title: 'Finding files matching ';
        readonly deferLoading?: boolean;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          [x: string]: unknown;
          pattern: string;
          paths?: string[] | undefined;
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                [x: string]: unknown;
                pattern: string;
                paths?: string[] | undefined;
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
                  pattern: string;
                  paths?: string[] | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                [x: string]: unknown;
                pattern: string;
                paths?: string[] | undefined;
              };
              output: unknown;
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<unknown> | undefined;
        readonly execute: import('@ai-sdk/provider-utils').ToolExecuteFunction<
          {
            [x: string]: unknown;
            pattern: string;
            paths?: string[] | undefined;
          },
          unknown,
          any
        >;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: true;
        readonly supportsDeferredResults?: boolean;
        readonly nativeName?: string;
        readonly commonName?: import('./harness.js').HarnessV1BuiltinToolName;
        readonly toolUseKind?: import('./harness.js').HarnessV1BuiltinToolUseKind;
      };
  readonly task: import('@ai-sdk/provider-utils').Tool<
    {
      [x: string]: unknown;
      name: string;
      prompt: string;
      agent_type:
        | 'task'
        | 'explore'
        | 'general-purpose'
        | 'code-review'
        | 'research'
        | 'security-review';
      description: string;
      model?: string | undefined;
      context_tier?: 'default' | 'long_context' | undefined;
      mode?: 'sync' | 'background' | undefined;
    },
    any,
    any
  >;
}>;
export type {
  GitHubCopilotAuthenticationMode,
  GitHubCopilotBuiltinTools,
  GitHubCopilotHarnessSettings,
  JSONObject,
};
