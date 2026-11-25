// Generated from @ai-sdk/harness-opencode in @ai-sdk/harness-opencode@1.0.196. Do not edit.
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
type OpenCodeAuthenticationMode = HarnessV1Authentication<
  'direct' | 'anthropic' | 'openai'
>;
type OpenCodeHarnessSettings = {
  readonly auth?: OpenCodeAuthenticationMode;
  readonly credentialForwarding?: HarnessV1CredentialForwarding;
  readonly openCodeConfig?: Record<string, unknown>;
  readonly mcpServers?: Record<string, unknown>;
  readonly provider?: string;
  readonly reasoningVariant?: string;
  readonly port?: number;
  readonly portEndpoint?: HarnessV1PortEndpoint;
  readonly startupTimeoutMs?: number;
  readonly hostDisconnectTimeoutMs?: number;
  readonly reconnect?: SandboxChannelReconnectOptions;
  readonly keepAliveMs?: number;
  readonly mintBridgeToken?: HarnessV1MintBridgeTokenCallback;
};
declare const OPENCODE_BUILTIN_TOOLS: {
  readonly askUserQuestions:
    | {
        readonly nativeName: 'question';
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
              experimental_sandbox?: Experimental_SandboxSession;
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
        readonly nativeName: 'question';
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
              experimental_sandbox?: Experimental_SandboxSession;
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
  readonly read: HarnessV1BuiltinTool<
    {
      [x: string]: unknown;
      file_path?: string | undefined;
      path?: string | undefined;
    },
    unknown
  >;
  readonly write: HarnessV1BuiltinTool<
    {
      [x: string]: unknown;
      file_path?: string | undefined;
      path?: string | undefined;
      content?: string | undefined;
    },
    unknown
  >;
  readonly edit: HarnessV1BuiltinTool<
    {
      [x: string]: unknown;
      file_path?: string | undefined;
      path?: string | undefined;
      old_string?: string | undefined;
      new_string?: string | undefined;
    },
    unknown
  >;
  readonly bash: HarnessV1BuiltinTool<
    {
      [x: string]: unknown;
      command?: string | undefined;
    },
    unknown
  >;
  readonly glob: HarnessV1BuiltinTool<
    {
      [x: string]: unknown;
      pattern?: string | undefined;
      path?: string | undefined;
    },
    unknown
  >;
  readonly grep: HarnessV1BuiltinTool<
    {
      [x: string]: unknown;
      pattern?: string | undefined;
      path?: string | undefined;
    },
    unknown
  >;
  readonly ls: import('@ai-sdk/provider-utils').Tool<
    {
      [x: string]: unknown;
      path?: string | undefined;
    },
    any,
    any
  >;
  readonly webfetch: import('@ai-sdk/provider-utils').Tool<
    {
      [x: string]: unknown;
      url?: string | undefined;
      prompt?: string | undefined;
    },
    any,
    any
  >;
  readonly skill: import('@ai-sdk/provider-utils').Tool<
    {
      [x: string]: unknown;
      name?: string | undefined;
    },
    any,
    any
  >;
  readonly todowrite: import('@ai-sdk/provider-utils').Tool<
    {
      [x: string]: unknown;
      todos?:
        | {
            [x: string]: unknown;
            content?: string | undefined;
            status?: string | undefined;
            priority?: string | undefined;
          }[]
        | undefined;
    },
    any,
    any
  >;
  readonly agent: import('@ai-sdk/provider-utils').Tool<
    {
      [x: string]: unknown;
      agent?: string | undefined;
      prompt?: string | undefined;
      description?: string | undefined;
      metadata?: Record<string, unknown> | undefined;
    },
    any,
    any
  >;
};
export declare function createOpenCode(
  settings?: OpenCodeHarnessSettings,
): HarnessV1<typeof OPENCODE_BUILTIN_TOOLS>;
export declare const VERSION: string;
export declare const openCode: import('./harness.js').HarnessV1<{
  readonly askUserQuestions:
    | {
        readonly nativeName: 'question';
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
        readonly nativeName: 'question';
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
  readonly read: import('./harness.js').HarnessV1BuiltinTool<
    {
      [x: string]: unknown;
      file_path?: string | undefined;
      path?: string | undefined;
    },
    unknown
  >;
  readonly write: import('./harness.js').HarnessV1BuiltinTool<
    {
      [x: string]: unknown;
      file_path?: string | undefined;
      path?: string | undefined;
      content?: string | undefined;
    },
    unknown
  >;
  readonly edit: import('./harness.js').HarnessV1BuiltinTool<
    {
      [x: string]: unknown;
      file_path?: string | undefined;
      path?: string | undefined;
      old_string?: string | undefined;
      new_string?: string | undefined;
    },
    unknown
  >;
  readonly bash: import('./harness.js').HarnessV1BuiltinTool<
    {
      [x: string]: unknown;
      command?: string | undefined;
    },
    unknown
  >;
  readonly glob: import('./harness.js').HarnessV1BuiltinTool<
    {
      [x: string]: unknown;
      pattern?: string | undefined;
      path?: string | undefined;
    },
    unknown
  >;
  readonly grep: import('./harness.js').HarnessV1BuiltinTool<
    {
      [x: string]: unknown;
      pattern?: string | undefined;
      path?: string | undefined;
    },
    unknown
  >;
  readonly ls: import('@ai-sdk/provider-utils').Tool<
    {
      [x: string]: unknown;
      path?: string | undefined;
    },
    any,
    any
  >;
  readonly webfetch: import('@ai-sdk/provider-utils').Tool<
    {
      [x: string]: unknown;
      url?: string | undefined;
      prompt?: string | undefined;
    },
    any,
    any
  >;
  readonly skill: import('@ai-sdk/provider-utils').Tool<
    {
      [x: string]: unknown;
      name?: string | undefined;
    },
    any,
    any
  >;
  readonly todowrite: import('@ai-sdk/provider-utils').Tool<
    {
      [x: string]: unknown;
      todos?:
        | {
            [x: string]: unknown;
            content?: string | undefined;
            status?: string | undefined;
            priority?: string | undefined;
          }[]
        | undefined;
    },
    any,
    any
  >;
  readonly agent: import('@ai-sdk/provider-utils').Tool<
    {
      [x: string]: unknown;
      agent?: string | undefined;
      prompt?: string | undefined;
      description?: string | undefined;
      metadata?: Record<string, unknown> | undefined;
    },
    any,
    any
  >;
}>;
export type { JSONObject, OpenCodeAuthenticationMode, OpenCodeHarnessSettings };
