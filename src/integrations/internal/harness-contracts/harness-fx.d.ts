// Generated from @ai-sdk/harness-fx in @ai-sdk/harness-fx@1.0.110. Do not edit.
// Original license: harness.LICENSE.
// Normalize Zod v4 declarations for the Zod 3.25.76 bridge.
import { HarnessV1, HarnessV1Authentication } from './harness.js';
import { z } from 'zod/v4';
import { JSONObject } from '@ai-sdk/provider';
type FxAuthenticationMode = HarnessV1Authentication;
interface FxSessionStorageEntry {
  entryId: string;
  parentEntryId?: string;
  data: JSONObject;
}
interface FxSessionStorage {
  append(options: {
    sessionId: string;
    entry: FxSessionStorageEntry;
  }): PromiseLike<void>;
  read(options: {
    sessionId: string;
    leafId: string;
    abortSignal?: AbortSignal;
  }): PromiseLike<ReadonlyArray<FxSessionStorageEntry>>;
}
type FxHarnessSettings = {
  readonly auth?: FxAuthenticationMode;
  readonly mcpServers?: Record<string, unknown>;
  readonly headers?: Record<string, string>;
  readonly effort?: string;
  readonly serviceTier?: 'default' | 'fast' | 'ultrafast';
  readonly backend?: 'auto' | 'native' | 'wasm';
  readonly sessionStorage?: FxSessionStorage;
};
declare const FX_BUILTIN_TOOLS: {
  readonly read: import('./harness.js').HarnessV1BuiltinTool<
    {
      file_path: string;
    },
    unknown
  >;
  readonly write: import('./harness.js').HarnessV1BuiltinTool<
    {
      file_path: string;
      content: string;
    },
    unknown
  >;
  readonly edit: import('./harness.js').HarnessV1BuiltinTool<
    {
      file_path: string;
      old_string: string;
      new_string: string;
    },
    unknown
  >;
  readonly bash: import('./harness.js').HarnessV1BuiltinTool<
    {
      command: string;
      timeout?: number | undefined;
    },
    unknown
  >;
  readonly grep: import('./harness.js').HarnessV1BuiltinTool<
    {
      pattern: string;
      path?: string | undefined;
      glob?: string | undefined;
      ignoreCase?: boolean | undefined;
      literal?: boolean | undefined;
      context?: number | undefined;
      limit?: number | undefined;
    },
    unknown
  >;
  readonly glob: import('./harness.js').HarnessV1BuiltinTool<
    {
      pattern: string;
      path?: string | undefined;
      limit?: number | undefined;
    },
    unknown
  >;
  readonly ls:
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          path?: string | undefined;
          limit?: number | undefined;
        }>;
        readonly contextSchema?:
          | import('@ai-sdk/provider-utils').FlexibleSchema<
              import('@ai-sdk/provider-utils').Context
            >
          | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                path?: string | undefined;
                limit?: number | undefined;
              },
              NoInfer<import('@ai-sdk/provider-utils').Context>
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<
                NoInfer<import('@ai-sdk/provider-utils').Context>
              >,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<
                NoInfer<import('@ai-sdk/provider-utils').Context>
              >,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  path?: string | undefined;
                  limit?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<
                NoInfer<import('@ai-sdk/provider-utils').Context>
              >,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                path?: string | undefined;
                limit?: number | undefined;
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
              context: NoInfer<import('@ai-sdk/provider-utils').Context>;
              experimental_sandbox?: import('@ai-sdk/provider-utils').Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                path?: string | undefined;
                limit?: number | undefined;
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
          path?: string | undefined;
          limit?: number | undefined;
        }>;
        readonly contextSchema?:
          | import('@ai-sdk/provider-utils').FlexibleSchema<
              import('@ai-sdk/provider-utils').Context
            >
          | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                path?: string | undefined;
                limit?: number | undefined;
              },
              NoInfer<import('@ai-sdk/provider-utils').Context>
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<
                NoInfer<import('@ai-sdk/provider-utils').Context>
              >,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<
                NoInfer<import('@ai-sdk/provider-utils').Context>
              >,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  path?: string | undefined;
                  limit?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<
                NoInfer<import('@ai-sdk/provider-utils').Context>
              >,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                path?: string | undefined;
                limit?: number | undefined;
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
            path?: string | undefined;
            limit?: number | undefined;
          },
          unknown,
          NoInfer<import('@ai-sdk/provider-utils').Context>
        >;
        readonly description?:
          | string
          | ((options: {
              context: NoInfer<import('@ai-sdk/provider-utils').Context>;
              experimental_sandbox?: import('@ai-sdk/provider-utils').Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                path?: string | undefined;
                limit?: number | undefined;
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
          path?: string | undefined;
          limit?: number | undefined;
        }>;
        readonly contextSchema?:
          | import('@ai-sdk/provider-utils').FlexibleSchema<
              import('@ai-sdk/provider-utils').Context
            >
          | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                path?: string | undefined;
                limit?: number | undefined;
              },
              NoInfer<import('@ai-sdk/provider-utils').Context>
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<
                NoInfer<import('@ai-sdk/provider-utils').Context>
              >,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<
                NoInfer<import('@ai-sdk/provider-utils').Context>
              >,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  path?: string | undefined;
                  limit?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<
                NoInfer<import('@ai-sdk/provider-utils').Context>
              >,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                path?: string | undefined;
                limit?: number | undefined;
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
              context: NoInfer<import('@ai-sdk/provider-utils').Context>;
              experimental_sandbox?: import('@ai-sdk/provider-utils').Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                path?: string | undefined;
                limit?: number | undefined;
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
          path?: string | undefined;
          limit?: number | undefined;
        }>;
        readonly contextSchema?:
          | import('@ai-sdk/provider-utils').FlexibleSchema<
              import('@ai-sdk/provider-utils').Context
            >
          | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                path?: string | undefined;
                limit?: number | undefined;
              },
              NoInfer<import('@ai-sdk/provider-utils').Context>
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<
                NoInfer<import('@ai-sdk/provider-utils').Context>
              >,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<
                NoInfer<import('@ai-sdk/provider-utils').Context>
              >,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  path?: string | undefined;
                  limit?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<
                NoInfer<import('@ai-sdk/provider-utils').Context>
              >,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                path?: string | undefined;
                limit?: number | undefined;
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
            path?: string | undefined;
            limit?: number | undefined;
          },
          unknown,
          NoInfer<import('@ai-sdk/provider-utils').Context>
        >;
        readonly description?:
          | string
          | ((options: {
              context: NoInfer<import('@ai-sdk/provider-utils').Context>;
              experimental_sandbox?: import('@ai-sdk/provider-utils').Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                path?: string | undefined;
                limit?: number | undefined;
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
          path?: string | undefined;
          limit?: number | undefined;
        }>;
        readonly contextSchema?:
          | import('@ai-sdk/provider-utils').FlexibleSchema<
              import('@ai-sdk/provider-utils').Context
            >
          | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                path?: string | undefined;
                limit?: number | undefined;
              },
              NoInfer<import('@ai-sdk/provider-utils').Context>
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<
                NoInfer<import('@ai-sdk/provider-utils').Context>
              >,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<
                NoInfer<import('@ai-sdk/provider-utils').Context>
              >,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  path?: string | undefined;
                  limit?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<
                NoInfer<import('@ai-sdk/provider-utils').Context>
              >,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                path?: string | undefined;
                limit?: number | undefined;
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
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          path?: string | undefined;
          limit?: number | undefined;
        }>;
        readonly contextSchema?:
          | import('@ai-sdk/provider-utils').FlexibleSchema<
              import('@ai-sdk/provider-utils').Context
            >
          | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                path?: string | undefined;
                limit?: number | undefined;
              },
              NoInfer<import('@ai-sdk/provider-utils').Context>
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<
                NoInfer<import('@ai-sdk/provider-utils').Context>
              >,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<
                NoInfer<import('@ai-sdk/provider-utils').Context>
              >,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  path?: string | undefined;
                  limit?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<
                NoInfer<import('@ai-sdk/provider-utils').Context>
              >,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                path?: string | undefined;
                limit?: number | undefined;
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
            path?: string | undefined;
            limit?: number | undefined;
          },
          unknown,
          NoInfer<import('@ai-sdk/provider-utils').Context>
        >;
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
          path?: string | undefined;
          limit?: number | undefined;
        }>;
        readonly contextSchema?:
          | import('@ai-sdk/provider-utils').FlexibleSchema<
              import('@ai-sdk/provider-utils').Context
            >
          | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                path?: string | undefined;
                limit?: number | undefined;
              },
              NoInfer<import('@ai-sdk/provider-utils').Context>
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<
                NoInfer<import('@ai-sdk/provider-utils').Context>
              >,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<
                NoInfer<import('@ai-sdk/provider-utils').Context>
              >,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  path?: string | undefined;
                  limit?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<
                NoInfer<import('@ai-sdk/provider-utils').Context>
              >,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                path?: string | undefined;
                limit?: number | undefined;
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
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          path?: string | undefined;
          limit?: number | undefined;
        }>;
        readonly contextSchema?:
          | import('@ai-sdk/provider-utils').FlexibleSchema<
              import('@ai-sdk/provider-utils').Context
            >
          | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                path?: string | undefined;
                limit?: number | undefined;
              },
              NoInfer<import('@ai-sdk/provider-utils').Context>
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<
                NoInfer<import('@ai-sdk/provider-utils').Context>
              >,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<
                NoInfer<import('@ai-sdk/provider-utils').Context>
              >,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  path?: string | undefined;
                  limit?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<
                NoInfer<import('@ai-sdk/provider-utils').Context>
              >,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                path?: string | undefined;
                limit?: number | undefined;
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
            path?: string | undefined;
            limit?: number | undefined;
          },
          unknown,
          NoInfer<import('@ai-sdk/provider-utils').Context>
        >;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: true;
        readonly supportsDeferredResults?: boolean;
      };
  readonly askUserQuestions:
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
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
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
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
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
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
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
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
              };
              output: NoInfer<
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
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          | import('@ai-sdk/provider-utils').FlexibleSchema<
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
            >
          | undefined;
        readonly execute: import('@ai-sdk/provider-utils').ToolExecuteFunction<
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
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
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
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
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
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
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
              };
              output: NoInfer<
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
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<
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
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type?: undefined | 'function';
      };
};
export declare function createFx(
  settings?: FxHarnessSettings,
): HarnessV1<typeof FX_BUILTIN_TOOLS>;
export declare const VERSION: string;
export declare const fx: import('./harness.js').HarnessV1<{
  readonly read: import('./harness.js').HarnessV1BuiltinTool<
    {
      file_path: string;
    },
    unknown
  >;
  readonly write: import('./harness.js').HarnessV1BuiltinTool<
    {
      file_path: string;
      content: string;
    },
    unknown
  >;
  readonly edit: import('./harness.js').HarnessV1BuiltinTool<
    {
      file_path: string;
      old_string: string;
      new_string: string;
    },
    unknown
  >;
  readonly bash: import('./harness.js').HarnessV1BuiltinTool<
    {
      command: string;
      timeout?: number | undefined;
    },
    unknown
  >;
  readonly grep: import('./harness.js').HarnessV1BuiltinTool<
    {
      pattern: string;
      path?: string | undefined;
      glob?: string | undefined;
      ignoreCase?: boolean | undefined;
      literal?: boolean | undefined;
      context?: number | undefined;
      limit?: number | undefined;
    },
    unknown
  >;
  readonly glob: import('./harness.js').HarnessV1BuiltinTool<
    {
      pattern: string;
      path?: string | undefined;
      limit?: number | undefined;
    },
    unknown
  >;
  readonly ls:
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          path?: string | undefined;
          limit?: number | undefined;
        }>;
        readonly contextSchema?:
          | import('@ai-sdk/provider-utils').FlexibleSchema<
              import('@ai-sdk/provider-utils').Context
            >
          | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                path?: string | undefined;
                limit?: number | undefined;
              },
              NoInfer<import('@ai-sdk/provider-utils').Context>
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<
                NoInfer<import('@ai-sdk/provider-utils').Context>
              >,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<
                NoInfer<import('@ai-sdk/provider-utils').Context>
              >,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  path?: string | undefined;
                  limit?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<
                NoInfer<import('@ai-sdk/provider-utils').Context>
              >,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                path?: string | undefined;
                limit?: number | undefined;
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
              context: NoInfer<import('@ai-sdk/provider-utils').Context>;
              experimental_sandbox?: import('@ai-sdk/provider-utils').Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                path?: string | undefined;
                limit?: number | undefined;
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
          path?: string | undefined;
          limit?: number | undefined;
        }>;
        readonly contextSchema?:
          | import('@ai-sdk/provider-utils').FlexibleSchema<
              import('@ai-sdk/provider-utils').Context
            >
          | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                path?: string | undefined;
                limit?: number | undefined;
              },
              NoInfer<import('@ai-sdk/provider-utils').Context>
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<
                NoInfer<import('@ai-sdk/provider-utils').Context>
              >,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<
                NoInfer<import('@ai-sdk/provider-utils').Context>
              >,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  path?: string | undefined;
                  limit?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<
                NoInfer<import('@ai-sdk/provider-utils').Context>
              >,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                path?: string | undefined;
                limit?: number | undefined;
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
            path?: string | undefined;
            limit?: number | undefined;
          },
          unknown,
          NoInfer<import('@ai-sdk/provider-utils').Context>
        >;
        readonly description?:
          | string
          | ((options: {
              context: NoInfer<import('@ai-sdk/provider-utils').Context>;
              experimental_sandbox?: import('@ai-sdk/provider-utils').Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                path?: string | undefined;
                limit?: number | undefined;
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
          path?: string | undefined;
          limit?: number | undefined;
        }>;
        readonly contextSchema?:
          | import('@ai-sdk/provider-utils').FlexibleSchema<
              import('@ai-sdk/provider-utils').Context
            >
          | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                path?: string | undefined;
                limit?: number | undefined;
              },
              NoInfer<import('@ai-sdk/provider-utils').Context>
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<
                NoInfer<import('@ai-sdk/provider-utils').Context>
              >,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<
                NoInfer<import('@ai-sdk/provider-utils').Context>
              >,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  path?: string | undefined;
                  limit?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<
                NoInfer<import('@ai-sdk/provider-utils').Context>
              >,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                path?: string | undefined;
                limit?: number | undefined;
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
              context: NoInfer<import('@ai-sdk/provider-utils').Context>;
              experimental_sandbox?: import('@ai-sdk/provider-utils').Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                path?: string | undefined;
                limit?: number | undefined;
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
          path?: string | undefined;
          limit?: number | undefined;
        }>;
        readonly contextSchema?:
          | import('@ai-sdk/provider-utils').FlexibleSchema<
              import('@ai-sdk/provider-utils').Context
            >
          | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                path?: string | undefined;
                limit?: number | undefined;
              },
              NoInfer<import('@ai-sdk/provider-utils').Context>
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<
                NoInfer<import('@ai-sdk/provider-utils').Context>
              >,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<
                NoInfer<import('@ai-sdk/provider-utils').Context>
              >,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  path?: string | undefined;
                  limit?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<
                NoInfer<import('@ai-sdk/provider-utils').Context>
              >,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                path?: string | undefined;
                limit?: number | undefined;
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
            path?: string | undefined;
            limit?: number | undefined;
          },
          unknown,
          NoInfer<import('@ai-sdk/provider-utils').Context>
        >;
        readonly description?:
          | string
          | ((options: {
              context: NoInfer<import('@ai-sdk/provider-utils').Context>;
              experimental_sandbox?: import('@ai-sdk/provider-utils').Experimental_SandboxSession;
            }) => string)
          | undefined;
        readonly strict?: boolean;
        readonly inputExamples?:
          | {
              input: NoInfer<{
                path?: string | undefined;
                limit?: number | undefined;
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
          path?: string | undefined;
          limit?: number | undefined;
        }>;
        readonly contextSchema?:
          | import('@ai-sdk/provider-utils').FlexibleSchema<
              import('@ai-sdk/provider-utils').Context
            >
          | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                path?: string | undefined;
                limit?: number | undefined;
              },
              NoInfer<import('@ai-sdk/provider-utils').Context>
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<
                NoInfer<import('@ai-sdk/provider-utils').Context>
              >,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<
                NoInfer<import('@ai-sdk/provider-utils').Context>
              >,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  path?: string | undefined;
                  limit?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<
                NoInfer<import('@ai-sdk/provider-utils').Context>
              >,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                path?: string | undefined;
                limit?: number | undefined;
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
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          path?: string | undefined;
          limit?: number | undefined;
        }>;
        readonly contextSchema?:
          | import('@ai-sdk/provider-utils').FlexibleSchema<
              import('@ai-sdk/provider-utils').Context
            >
          | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                path?: string | undefined;
                limit?: number | undefined;
              },
              NoInfer<import('@ai-sdk/provider-utils').Context>
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<
                NoInfer<import('@ai-sdk/provider-utils').Context>
              >,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<
                NoInfer<import('@ai-sdk/provider-utils').Context>
              >,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  path?: string | undefined;
                  limit?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<
                NoInfer<import('@ai-sdk/provider-utils').Context>
              >,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                path?: string | undefined;
                limit?: number | undefined;
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
            path?: string | undefined;
            limit?: number | undefined;
          },
          unknown,
          NoInfer<import('@ai-sdk/provider-utils').Context>
        >;
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
          path?: string | undefined;
          limit?: number | undefined;
        }>;
        readonly contextSchema?:
          | import('@ai-sdk/provider-utils').FlexibleSchema<
              import('@ai-sdk/provider-utils').Context
            >
          | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                path?: string | undefined;
                limit?: number | undefined;
              },
              NoInfer<import('@ai-sdk/provider-utils').Context>
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<
                NoInfer<import('@ai-sdk/provider-utils').Context>
              >,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<
                NoInfer<import('@ai-sdk/provider-utils').Context>
              >,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  path?: string | undefined;
                  limit?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<
                NoInfer<import('@ai-sdk/provider-utils').Context>
              >,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                path?: string | undefined;
                limit?: number | undefined;
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
      }
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
          path?: string | undefined;
          limit?: number | undefined;
        }>;
        readonly contextSchema?:
          | import('@ai-sdk/provider-utils').FlexibleSchema<
              import('@ai-sdk/provider-utils').Context
            >
          | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
              {
                path?: string | undefined;
                limit?: number | undefined;
              },
              NoInfer<import('@ai-sdk/provider-utils').Context>
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<
                NoInfer<import('@ai-sdk/provider-utils').Context>
              >,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<
                NoInfer<import('@ai-sdk/provider-utils').Context>
              >,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
                  path?: string | undefined;
                  limit?: number | undefined;
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<
                NoInfer<import('@ai-sdk/provider-utils').Context>
              >,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
                path?: string | undefined;
                limit?: number | undefined;
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
            path?: string | undefined;
            limit?: number | undefined;
          },
          unknown,
          NoInfer<import('@ai-sdk/provider-utils').Context>
        >;
        readonly type: 'provider';
        readonly id: `${string}.${string}`;
        readonly args: Record<string, unknown>;
        readonly description?: never;
        readonly strict?: never;
        readonly inputExamples?: never;
        readonly isProviderExecuted: true;
        readonly supportsDeferredResults?: boolean;
      };
  readonly askUserQuestions:
    | {
        readonly toolUseKind: 'readonly';
        readonly deferLoading?: boolean;
        readonly title?: string;
        readonly providerOptions?: import('@ai-sdk/provider-utils').ProviderOptions;
        readonly metadata?: import('@ai-sdk/provider').JSONObject;
        readonly inputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<{
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
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
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
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
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
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
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
              };
              output: NoInfer<
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
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema?:
          | import('@ai-sdk/provider-utils').FlexibleSchema<
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
            >
          | undefined;
        readonly execute: import('@ai-sdk/provider-utils').ToolExecuteFunction<
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
        }>;
        readonly contextSchema?:
          import('@ai-sdk/provider-utils').FlexibleSchema<any> | undefined;
        readonly needsApproval?:
          | boolean
          | import('@ai-sdk/provider-utils').ToolNeedsApprovalFunction<
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
              any
            >
          | undefined;
        readonly onInputStart?:
          | ((
              options: import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputDelta?:
          | ((
              options: {
                inputTextDelta: string;
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly onInputAvailable?:
          | ((
              options: {
                input: {
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
                };
              } & import('@ai-sdk/provider-utils').ToolExecutionOptions<any>,
            ) => void | PromiseLike<void>)
          | undefined;
        readonly toModelOutput?:
          | ((options: {
              toolCallId: string;
              input: {
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
              };
              output: NoInfer<
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
            }) =>
              | import('@ai-sdk/provider-utils').ToolResultOutput
              | PromiseLike<import('@ai-sdk/provider-utils').ToolResultOutput>)
          | undefined;
        readonly outputSchema: import('@ai-sdk/provider-utils').FlexibleSchema<
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
              }>;
            }[]
          | undefined;
        readonly id?: never;
        readonly isProviderExecuted?: never;
        readonly args?: never;
        readonly supportsDeferredResults?: never;
        readonly type?: undefined | 'function';
      };
}>;
export type { FxAuthenticationMode, FxHarnessSettings, FxSessionStorage };
