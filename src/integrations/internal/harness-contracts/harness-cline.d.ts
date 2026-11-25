// Generated from @ai-sdk/harness-cline in @ai-sdk/harness-cline@1.0.121. Do not edit.
// Original license: harness.LICENSE.
// Normalize Zod v4 declarations for the Zod 3.25.76 bridge.
import {
  HarnessV1,
  HarnessV1Authentication,
  HarnessV1BuiltinTool,
} from './harness.js';
import '@ai-sdk/provider-utils';
type ClineAuthenticationMode = HarnessV1Authentication;
type ClineReasoningEffort =
  'none' | 'minimal' | 'low' | 'medium' | 'high' | 'xhigh' | 'max';
type ClineHarnessSettings = {
  readonly auth?: ClineAuthenticationMode;
  readonly mcpServers?: Record<string, unknown>;
  readonly providerId?: string;
  readonly apiKey?: string;
  readonly baseUrl?: string;
  readonly headers?: Record<string, string>;
  readonly reasoningEffort?: ClineReasoningEffort;
  readonly maxIterations?: number;
};
declare const CLINE_BUILTIN_TOOLS: {
  readonly askUserQuestions:
    | {
        readonly nativeName: 'ask_question';
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
        readonly nativeName: 'ask_question';
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
  readonly read: HarnessV1BuiltinTool<
    {
      file_path: string;
    },
    unknown
  >;
  readonly write: HarnessV1BuiltinTool<
    {
      file_path: string;
      content: string;
    },
    unknown
  >;
  readonly edit: HarnessV1BuiltinTool<
    {
      file_path: string;
      old_string: string;
      new_string: string;
    },
    unknown
  >;
  readonly bash: HarnessV1BuiltinTool<
    {
      command: string;
      timeout?: number | undefined;
    },
    unknown
  >;
  readonly grep: HarnessV1BuiltinTool<
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
  readonly glob: HarnessV1BuiltinTool<
    {
      pattern: string;
      path?: string | undefined;
      limit?: number | undefined;
    },
    unknown
  >;
  readonly ls: HarnessV1BuiltinTool;
  readonly skills: HarnessV1BuiltinTool;
};
export declare function createCline(
  settings?: ClineHarnessSettings,
): HarnessV1<typeof CLINE_BUILTIN_TOOLS>;
export declare const VERSION: string;
export declare const cline: import('./harness.js').HarnessV1<{
  readonly askUserQuestions:
    | {
        readonly nativeName: 'ask_question';
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
        readonly nativeName: 'ask_question';
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
  readonly ls: import('./harness.js').HarnessV1BuiltinTool;
  readonly skills: import('./harness.js').HarnessV1BuiltinTool;
}>;
export type { ClineAuthenticationMode, ClineHarnessSettings };
