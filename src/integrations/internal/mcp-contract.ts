// Generated from @ai-sdk/mcp@2.0.104. Do not edit by hand.
// SPDX-License-Identifier: Apache-2.0
// See mcp-contract.LICENSE for the upstream license.
// The runtime SDK remains the authority for protocol behavior.
import type {
  DynamicTool,
  FetchFunction,
  FlexibleSchema,
  Tool,
  ToolExecutionOptions,
} from '@ai-sdk/provider-utils';
import type { z } from 'zod/v4';
import type { AISDKError, JSONObject } from '@ai-sdk/provider';
declare const JSONRPCRequestSchema: z.ZodObject<
  {
    jsonrpc: z.ZodLiteral<'2.0'>;
    id: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
    method: z.ZodString;
    params: z.ZodOptional<
      z.ZodObject<
        {
          _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
        },
        z.core.$loose
      >
    >;
  },
  z.core.$strict
>;
type JSONRPCRequest = z.infer<typeof JSONRPCRequestSchema>;
declare const JSONRPCResponseSchema: z.ZodObject<
  {
    jsonrpc: z.ZodLiteral<'2.0'>;
    id: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
    result: z.ZodObject<
      {
        _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
        resultType: z.ZodOptional<z.ZodString>;
      },
      z.core.$loose
    >;
  },
  z.core.$strict
>;
type JSONRPCResponse = z.infer<typeof JSONRPCResponseSchema>;
declare const JSONRPCErrorSchema: z.ZodObject<
  {
    jsonrpc: z.ZodLiteral<'2.0'>;
    id: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    error: z.ZodObject<
      {
        code: z.ZodNumber;
        message: z.ZodString;
        data: z.ZodOptional<z.ZodUnknown>;
      },
      z.core.$strip
    >;
  },
  z.core.$strict
>;
type JSONRPCError = z.infer<typeof JSONRPCErrorSchema>;
declare const JSONRPCNotificationSchema: z.ZodObject<
  {
    jsonrpc: z.ZodLiteral<'2.0'>;
    method: z.ZodString;
    params: z.ZodOptional<
      z.ZodObject<
        {
          _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
        },
        z.core.$loose
      >
    >;
  },
  z.core.$strict
>;
type JSONRPCNotification = z.infer<typeof JSONRPCNotificationSchema>;
declare const JSONRPCMessageSchema: z.ZodUnion<
  readonly [
    z.ZodObject<
      {
        jsonrpc: z.ZodLiteral<'2.0'>;
        id: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
        method: z.ZodString;
        params: z.ZodOptional<
          z.ZodObject<
            {
              _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
            },
            z.core.$loose
          >
        >;
      },
      z.core.$strict
    >,
    z.ZodObject<
      {
        jsonrpc: z.ZodLiteral<'2.0'>;
        method: z.ZodString;
        params: z.ZodOptional<
          z.ZodObject<
            {
              _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
            },
            z.core.$loose
          >
        >;
      },
      z.core.$strict
    >,
    z.ZodObject<
      {
        jsonrpc: z.ZodLiteral<'2.0'>;
        id: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
        result: z.ZodObject<
          {
            _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
            resultType: z.ZodOptional<z.ZodString>;
          },
          z.core.$loose
        >;
      },
      z.core.$strict
    >,
    z.ZodObject<
      {
        jsonrpc: z.ZodLiteral<'2.0'>;
        id: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
        error: z.ZodObject<
          {
            code: z.ZodNumber;
            message: z.ZodString;
            data: z.ZodOptional<z.ZodUnknown>;
          },
          z.core.$strip
        >;
      },
      z.core.$strict
    >,
  ]
>;
type JSONRPCMessage = z.infer<typeof JSONRPCMessageSchema>;
export declare function validateJSONRPCMessage(
  message: unknown,
): JSONRPCMessage;
type McpProviderMetadata = {
  clientName?: string;
  title?: string;
  toolName?: string;
  annotations?: McpToolAnnotations;
  app?: JSONObject;
};
type McpToolAnnotations = {
  title?: string;
  readOnlyHint?: boolean;
  destructiveHint?: boolean;
  idempotentHint?: boolean;
  openWorldHint?: boolean;
};
declare const ToolMetaSchema: z.ZodOptional<
  z.ZodRecord<z.ZodString, z.ZodUnknown>
>;
type ToolMeta = z.infer<typeof ToolMetaSchema>;
type ToolSchemas =
  | Record<
      string,
      {
        inputSchema: FlexibleSchema<JSONObject | unknown>;
        outputSchema?: FlexibleSchema<JSONObject | unknown>;
      }
    >
  | 'automatic'
  | undefined;
type McpToolBase<INPUT = unknown, OUTPUT = CallToolResult> = Tool<
  INPUT,
  OUTPUT
> & {
  execute: (
    input: INPUT,
    options?: ToolExecutionOptions<{}>,
  ) => ReturnType<NonNullable<Tool<INPUT, OUTPUT>['execute']>>;
  _meta?: ToolMeta;
};
type McpToolSet<TOOL_SCHEMAS extends ToolSchemas = 'automatic'> =
  TOOL_SCHEMAS extends Record<
    string,
    {
      inputSchema: FlexibleSchema<any>;
      outputSchema?: FlexibleSchema<any>;
    }
  >
    ? {
        [K in keyof TOOL_SCHEMAS]: TOOL_SCHEMAS[K] extends {
          inputSchema: FlexibleSchema<infer INPUT>;
          outputSchema: FlexibleSchema<infer OUTPUT>;
        }
          ? McpToolBase<INPUT, OUTPUT>
          : TOOL_SCHEMAS[K] extends {
                inputSchema: FlexibleSchema<infer INPUT>;
              }
            ? McpToolBase<INPUT, CallToolResult>
            : never;
      }
    : Record<string, McpToolBase<unknown, CallToolResult>>;
declare const ClientOrServerImplementationSchema: z.ZodObject<
  {
    name: z.ZodString;
    version: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
  },
  z.core.$loose
>;
type Configuration = z.infer<typeof ClientOrServerImplementationSchema>;
declare const BaseParamsSchema: z.ZodObject<
  {
    _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
  },
  z.core.$loose
>;
type BaseParams = z.infer<typeof BaseParamsSchema>;
declare const RequestSchema: z.ZodObject<
  {
    method: z.ZodString;
    params: z.ZodOptional<
      z.ZodObject<
        {
          _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
        },
        z.core.$loose
      >
    >;
  },
  z.core.$strip
>;
type Request$1 = z.infer<typeof RequestSchema>;
type RequestOptions = {
  signal?: AbortSignal;
  timeout?: number;
  maxTotalTimeout?: number;
};
declare const ClientCapabilitiesSchema: z.ZodObject<
  {
    elicitation: z.ZodOptional<
      z.ZodObject<
        {
          applyDefaults: z.ZodOptional<z.ZodBoolean>;
        },
        z.core.$loose
      >
    >;
  },
  z.core.$loose
>;
type ClientCapabilities = z.infer<typeof ClientCapabilitiesSchema>;
declare const InitializeResultSchema: z.ZodObject<
  {
    _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
    resultType: z.ZodOptional<z.ZodString>;
    protocolVersion: z.ZodString;
    capabilities: z.ZodObject<
      {
        events: z.ZodOptional<
          z.ZodNullable<
            z.ZodObject<
              {
                listChanged: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
              },
              z.core.$loose
            >
          >
        >;
        experimental: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
        logging: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
        completions: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
        prompts: z.ZodOptional<
          z.ZodObject<
            {
              listChanged: z.ZodOptional<z.ZodBoolean>;
            },
            z.core.$loose
          >
        >;
        resources: z.ZodOptional<
          z.ZodObject<
            {
              subscribe: z.ZodOptional<z.ZodBoolean>;
              listChanged: z.ZodOptional<z.ZodBoolean>;
            },
            z.core.$loose
          >
        >;
        tools: z.ZodOptional<
          z.ZodObject<
            {
              listChanged: z.ZodOptional<z.ZodBoolean>;
            },
            z.core.$loose
          >
        >;
        elicitation: z.ZodOptional<
          z.ZodObject<
            {
              applyDefaults: z.ZodOptional<z.ZodBoolean>;
            },
            z.core.$loose
          >
        >;
      },
      z.core.$loose
    >;
    serverInfo: z.ZodObject<
      {
        name: z.ZodString;
        version: z.ZodString;
        title: z.ZodOptional<z.ZodString>;
      },
      z.core.$loose
    >;
    instructions: z.ZodOptional<z.ZodString>;
  },
  z.core.$loose
>;
type InitializeResult = z.infer<typeof InitializeResultSchema>;
type PaginatedRequest = Request$1 & {
  params?: BaseParams & {
    cursor?: string;
  };
};
declare const ListToolsResultSchema: z.ZodObject<
  {
    _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
    resultType: z.ZodOptional<z.ZodString>;
    nextCursor: z.ZodOptional<z.ZodString>;
    tools: z.ZodArray<
      z.ZodObject<
        {
          name: z.ZodString;
          title: z.ZodOptional<z.ZodString>;
          description: z.ZodOptional<z.ZodString>;
          inputSchema: z.ZodObject<
            {
              type: z.ZodOptional<z.ZodUnknown>;
              properties: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
            },
            z.core.$loose
          >;
          outputSchema: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
          annotations: z.ZodOptional<
            z.ZodObject<
              {
                title: z.ZodOptional<z.ZodString>;
                readOnlyHint: z.ZodOptional<z.ZodBoolean>;
                destructiveHint: z.ZodOptional<z.ZodBoolean>;
                idempotentHint: z.ZodOptional<z.ZodBoolean>;
                openWorldHint: z.ZodOptional<z.ZodBoolean>;
              },
              z.core.$loose
            >
          >;
          _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        },
        z.core.$loose
      >
    >;
  },
  z.core.$loose
>;
type ListToolsResult = z.infer<typeof ListToolsResultSchema>;
declare const ListResourcesResultSchema: z.ZodObject<
  {
    _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
    resultType: z.ZodOptional<z.ZodString>;
    nextCursor: z.ZodOptional<z.ZodString>;
    resources: z.ZodArray<
      z.ZodObject<
        {
          uri: z.ZodString;
          name: z.ZodString;
          title: z.ZodOptional<z.ZodString>;
          description: z.ZodOptional<z.ZodString>;
          mimeType: z.ZodOptional<z.ZodString>;
          size: z.ZodOptional<z.ZodNumber>;
        },
        z.core.$loose
      >
    >;
  },
  z.core.$loose
>;
type ListResourcesResult = z.infer<typeof ListResourcesResultSchema>;
declare const CallToolResultSchema: z.ZodUnion<
  [
    z.ZodUnion<
      [
        z.ZodObject<
          {
            _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
            resultType: z.ZodOptional<z.ZodString>;
            content: z.ZodArray<
              z.ZodUnion<
                readonly [
                  z.ZodObject<
                    {
                      type: z.ZodLiteral<'text'>;
                      text: z.ZodString;
                    },
                    z.core.$loose
                  >,
                  z.ZodObject<
                    {
                      type: z.ZodLiteral<'image'>;
                      data: z.ZodBase64;
                      mimeType: z.ZodString;
                    },
                    z.core.$loose
                  >,
                  z.ZodObject<
                    {
                      type: z.ZodLiteral<'resource'>;
                      resource: z.ZodUnion<
                        readonly [
                          z.ZodObject<
                            {
                              uri: z.ZodString;
                              name: z.ZodOptional<z.ZodString>;
                              title: z.ZodOptional<z.ZodString>;
                              mimeType: z.ZodOptional<z.ZodString>;
                              text: z.ZodString;
                            },
                            z.core.$loose
                          >,
                          z.ZodObject<
                            {
                              uri: z.ZodString;
                              name: z.ZodOptional<z.ZodString>;
                              title: z.ZodOptional<z.ZodString>;
                              mimeType: z.ZodOptional<z.ZodString>;
                              blob: z.ZodBase64;
                            },
                            z.core.$loose
                          >,
                        ]
                      >;
                    },
                    z.core.$loose
                  >,
                  z.ZodObject<
                    {
                      type: z.ZodLiteral<'resource_link'>;
                      uri: z.ZodString;
                      name: z.ZodString;
                      description: z.ZodOptional<z.ZodString>;
                      mimeType: z.ZodOptional<z.ZodString>;
                    },
                    z.core.$loose
                  >,
                  z.ZodObject<
                    {
                      type: z.ZodString;
                    },
                    z.core.$loose
                  >,
                ]
              >
            >;
            structuredContent: z.ZodOptional<z.ZodUnknown>;
            isError: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
          },
          z.core.$loose
        >,
        z.ZodPipe<
          z.ZodPipe<
            z.ZodObject<
              {
                _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
                resultType: z.ZodOptional<z.ZodString>;
                content: z.ZodOptional<z.ZodNever>;
                structuredContent: z.ZodJSONSchema;
                isError: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
              },
              z.core.$loose
            >,
            z.ZodTransform<
              {
                [x: string]: unknown;
                content: (
                  | {
                      [x: string]: unknown;
                      type: string;
                    }
                  | {
                      [x: string]: unknown;
                      type: 'text';
                      text: string;
                    }
                  | {
                      [x: string]: unknown;
                      type: 'image';
                      data: string;
                      mimeType: string;
                    }
                  | {
                      [x: string]: unknown;
                      type: 'resource';
                      resource:
                        | {
                            [x: string]: unknown;
                            uri: string;
                            text: string;
                            name?: string | undefined;
                            title?: string | undefined;
                            mimeType?: string | undefined;
                          }
                        | {
                            [x: string]: unknown;
                            uri: string;
                            blob: string;
                            name?: string | undefined;
                            title?: string | undefined;
                            mimeType?: string | undefined;
                          };
                    }
                  | {
                      [x: string]: unknown;
                      type: 'resource_link';
                      uri: string;
                      name: string;
                      description?: string | undefined;
                      mimeType?: string | undefined;
                    }
                )[];
                _meta?:
                  | {
                      [x: string]: unknown;
                    }
                  | undefined;
                resultType?: string | undefined;
                structuredContent?: unknown;
                isError?: boolean | undefined;
              },
              {
                [x: string]: unknown;
                structuredContent: z.core.util.JSONType;
                _meta?:
                  | {
                      [x: string]: unknown;
                    }
                  | undefined;
                resultType?: string | undefined;
                content?: undefined;
                isError?: boolean | undefined;
              }
            >
          >,
          z.ZodObject<
            {
              _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
              resultType: z.ZodOptional<z.ZodString>;
              content: z.ZodArray<
                z.ZodUnion<
                  readonly [
                    z.ZodObject<
                      {
                        type: z.ZodLiteral<'text'>;
                        text: z.ZodString;
                      },
                      z.core.$loose
                    >,
                    z.ZodObject<
                      {
                        type: z.ZodLiteral<'image'>;
                        data: z.ZodBase64;
                        mimeType: z.ZodString;
                      },
                      z.core.$loose
                    >,
                    z.ZodObject<
                      {
                        type: z.ZodLiteral<'resource'>;
                        resource: z.ZodUnion<
                          readonly [
                            z.ZodObject<
                              {
                                uri: z.ZodString;
                                name: z.ZodOptional<z.ZodString>;
                                title: z.ZodOptional<z.ZodString>;
                                mimeType: z.ZodOptional<z.ZodString>;
                                text: z.ZodString;
                              },
                              z.core.$loose
                            >,
                            z.ZodObject<
                              {
                                uri: z.ZodString;
                                name: z.ZodOptional<z.ZodString>;
                                title: z.ZodOptional<z.ZodString>;
                                mimeType: z.ZodOptional<z.ZodString>;
                                blob: z.ZodBase64;
                              },
                              z.core.$loose
                            >,
                          ]
                        >;
                      },
                      z.core.$loose
                    >,
                    z.ZodObject<
                      {
                        type: z.ZodLiteral<'resource_link'>;
                        uri: z.ZodString;
                        name: z.ZodString;
                        description: z.ZodOptional<z.ZodString>;
                        mimeType: z.ZodOptional<z.ZodString>;
                      },
                      z.core.$loose
                    >,
                    z.ZodObject<
                      {
                        type: z.ZodString;
                      },
                      z.core.$loose
                    >,
                  ]
                >
              >;
              structuredContent: z.ZodOptional<z.ZodUnknown>;
              isError: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
            },
            z.core.$loose
          >
        >,
      ]
    >,
    z.ZodObject<
      {
        _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
        resultType: z.ZodOptional<z.ZodString>;
        toolResult: z.ZodNonOptional<z.ZodUnknown>;
      },
      z.core.$loose
    >,
  ]
>;
type CallToolResult = z.infer<typeof CallToolResultSchema>;
declare const ListResourceTemplatesResultSchema: z.ZodObject<
  {
    _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
    resultType: z.ZodOptional<z.ZodString>;
    resourceTemplates: z.ZodArray<
      z.ZodObject<
        {
          uriTemplate: z.ZodString;
          name: z.ZodString;
          title: z.ZodOptional<z.ZodString>;
          description: z.ZodOptional<z.ZodString>;
          mimeType: z.ZodOptional<z.ZodString>;
        },
        z.core.$loose
      >
    >;
  },
  z.core.$loose
>;
type ListResourceTemplatesResult = z.infer<
  typeof ListResourceTemplatesResultSchema
>;
declare const ReadResourceResultSchema: z.ZodObject<
  {
    _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
    resultType: z.ZodOptional<z.ZodString>;
    contents: z.ZodArray<
      z.ZodUnion<
        readonly [
          z.ZodObject<
            {
              uri: z.ZodString;
              name: z.ZodOptional<z.ZodString>;
              title: z.ZodOptional<z.ZodString>;
              mimeType: z.ZodOptional<z.ZodString>;
              text: z.ZodString;
            },
            z.core.$loose
          >,
          z.ZodObject<
            {
              uri: z.ZodString;
              name: z.ZodOptional<z.ZodString>;
              title: z.ZodOptional<z.ZodString>;
              mimeType: z.ZodOptional<z.ZodString>;
              blob: z.ZodBase64;
            },
            z.core.$loose
          >,
        ]
      >
    >;
  },
  z.core.$loose
>;
type ReadResourceResult = z.infer<typeof ReadResourceResultSchema>;
declare const CompleteRequestParamsSchema: z.ZodObject<
  {
    _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
    ref: z.ZodUnion<
      readonly [
        z.ZodObject<
          {
            type: z.ZodLiteral<'ref/prompt'>;
            name: z.ZodString;
          },
          z.core.$loose
        >,
        z.ZodObject<
          {
            type: z.ZodLiteral<'ref/resource'>;
            uri: z.ZodString;
          },
          z.core.$loose
        >,
      ]
    >;
    argument: z.ZodObject<
      {
        name: z.ZodString;
        value: z.ZodString;
      },
      z.core.$loose
    >;
    context: z.ZodOptional<
      z.ZodObject<
        {
          arguments: z.ZodRecord<z.ZodString, z.ZodString>;
        },
        z.core.$loose
      >
    >;
  },
  z.core.$loose
>;
type CompleteRequestParams = z.infer<typeof CompleteRequestParamsSchema>;
declare const CompleteResultSchema: z.ZodObject<
  {
    _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
    resultType: z.ZodOptional<z.ZodString>;
    completion: z.ZodObject<
      {
        values: z.ZodArray<z.ZodString>;
        total: z.ZodOptional<z.ZodNumber>;
        hasMore: z.ZodOptional<z.ZodBoolean>;
      },
      z.core.$loose
    >;
  },
  z.core.$loose
>;
type CompleteResult = z.infer<typeof CompleteResultSchema>;
declare const ListPromptsResultSchema: z.ZodObject<
  {
    _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
    resultType: z.ZodOptional<z.ZodString>;
    nextCursor: z.ZodOptional<z.ZodString>;
    prompts: z.ZodArray<
      z.ZodObject<
        {
          name: z.ZodString;
          title: z.ZodOptional<z.ZodString>;
          description: z.ZodOptional<z.ZodString>;
          arguments: z.ZodOptional<
            z.ZodArray<
              z.ZodObject<
                {
                  name: z.ZodString;
                  description: z.ZodOptional<z.ZodString>;
                  required: z.ZodOptional<z.ZodBoolean>;
                },
                z.core.$loose
              >
            >
          >;
        },
        z.core.$loose
      >
    >;
  },
  z.core.$loose
>;
type ListPromptsResult = z.infer<typeof ListPromptsResultSchema>;
declare const GetPromptResultSchema: z.ZodObject<
  {
    _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
    resultType: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    messages: z.ZodArray<
      z.ZodObject<
        {
          role: z.ZodUnion<
            readonly [z.ZodLiteral<'user'>, z.ZodLiteral<'assistant'>]
          >;
          content: z.ZodUnion<
            readonly [
              z.ZodObject<
                {
                  type: z.ZodLiteral<'text'>;
                  text: z.ZodString;
                },
                z.core.$loose
              >,
              z.ZodObject<
                {
                  type: z.ZodLiteral<'image'>;
                  data: z.ZodBase64;
                  mimeType: z.ZodString;
                },
                z.core.$loose
              >,
              z.ZodObject<
                {
                  type: z.ZodLiteral<'resource'>;
                  resource: z.ZodUnion<
                    readonly [
                      z.ZodObject<
                        {
                          uri: z.ZodString;
                          name: z.ZodOptional<z.ZodString>;
                          title: z.ZodOptional<z.ZodString>;
                          mimeType: z.ZodOptional<z.ZodString>;
                          text: z.ZodString;
                        },
                        z.core.$loose
                      >,
                      z.ZodObject<
                        {
                          uri: z.ZodString;
                          name: z.ZodOptional<z.ZodString>;
                          title: z.ZodOptional<z.ZodString>;
                          mimeType: z.ZodOptional<z.ZodString>;
                          blob: z.ZodBase64;
                        },
                        z.core.$loose
                      >,
                    ]
                  >;
                },
                z.core.$loose
              >,
              z.ZodObject<
                {
                  type: z.ZodLiteral<'resource_link'>;
                  uri: z.ZodString;
                  name: z.ZodString;
                  description: z.ZodOptional<z.ZodString>;
                  mimeType: z.ZodOptional<z.ZodString>;
                },
                z.core.$loose
              >,
            ]
          >;
        },
        z.core.$loose
      >
    >;
  },
  z.core.$loose
>;
type GetPromptResult = z.infer<typeof GetPromptResultSchema>;
export declare const ElicitationRequestSchema: z.ZodObject<
  {
    method: z.ZodLiteral<'elicitation/create'>;
    params: z.ZodObject<
      {
        _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
        message: z.ZodString;
        requestedSchema: z.ZodUnknown;
      },
      z.core.$loose
    >;
  },
  z.core.$strip
>;
type ElicitationRequest = z.infer<typeof ElicitationRequestSchema>;
export declare const ElicitResultSchema: z.ZodObject<
  {
    _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
    resultType: z.ZodOptional<z.ZodString>;
    action: z.ZodUnion<
      readonly [
        z.ZodLiteral<'accept'>,
        z.ZodLiteral<'decline'>,
        z.ZodLiteral<'cancel'>,
      ]
    >;
    content: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  },
  z.core.$loose
>;
type ElicitResult = z.infer<typeof ElicitResultSchema>;
export declare function createMCPTools(definitions: unknown): Record<
  string,
  DynamicTool & {
    _meta?: ToolMeta;
  }
>;
declare const MCPEventDefinitionSchema: z.ZodObject<
  {
    name: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    delivery: z.ZodArray<
      z.ZodEnum<{
        webhook: 'webhook';
        poll: 'poll';
        push: 'push';
      }>
    >;
    inputSchema: z.ZodUnion<
      readonly [z.ZodBoolean, z.ZodRecord<z.ZodString, z.ZodUnknown>]
    >;
    payloadSchema: z.ZodUnion<
      readonly [z.ZodBoolean, z.ZodRecord<z.ZodString, z.ZodUnknown>]
    >;
  },
  z.core.$loose
>;
type MCPEventDefinition = z.infer<typeof MCPEventDefinitionSchema>;
declare const ListEventsResultSchema: z.ZodObject<
  {
    _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
    resultType: z.ZodOptional<z.ZodString>;
    events: z.ZodArray<
      z.ZodObject<
        {
          name: z.ZodString;
          description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
          delivery: z.ZodArray<
            z.ZodEnum<{
              webhook: 'webhook';
              poll: 'poll';
              push: 'push';
            }>
          >;
          inputSchema: z.ZodUnion<
            readonly [z.ZodBoolean, z.ZodRecord<z.ZodString, z.ZodUnknown>]
          >;
          payloadSchema: z.ZodUnion<
            readonly [z.ZodBoolean, z.ZodRecord<z.ZodString, z.ZodUnknown>]
          >;
        },
        z.core.$loose
      >
    >;
    nextCursor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
  },
  z.core.$loose
>;
type ListEventsResult = z.infer<typeof ListEventsResultSchema>;
declare const SubscribeEventResultSchema: z.ZodObject<
  {
    _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
    resultType: z.ZodOptional<z.ZodString>;
    id: z.ZodString;
    refreshBefore: z.ZodNullable<z.ZodISODateTime>;
    cursor: z.ZodPipe<
      z.ZodOptional<z.ZodNullable<z.ZodString>>,
      z.ZodTransform<string | null, string | null | undefined>
    >;
    truncated: z.ZodBoolean;
  },
  z.core.$loose
>;
type SubscribeEventResult = z.infer<typeof SubscribeEventResultSchema>;
declare const MCPEventSchema: z.ZodObject<
  {
    eventId: z.ZodString;
    name: z.ZodString;
    timestamp: z.ZodISODateTime;
    data: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    cursor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
  },
  z.core.$loose
>;
type MCPEvent = z.infer<typeof MCPEventSchema>;
declare const MCPEventControlSchema: z.ZodPipe<
  z.ZodDiscriminatedUnion<
    [
      z.ZodObject<
        {
          type: z.ZodLiteral<'gap'>;
          cursor: z.ZodString;
        },
        z.core.$loose
      >,
      z.ZodObject<
        {
          type: z.ZodLiteral<'terminated'>;
          error: z.ZodObject<
            {
              code: z.ZodNumber;
              message: z.ZodString;
              data: z.ZodOptional<z.ZodNullable<z.ZodUnknown>>;
            },
            z.core.$loose
          >;
        },
        z.core.$loose
      >,
    ]
  >,
  z.ZodTransform<
    | {
        [x: string]: unknown;
        type: 'terminated';
        error: {
          [x: string]: unknown;
          code: number;
          message: string;
          data?: unknown;
        };
      }
    | {
        truncated: true;
        type: 'gap';
        cursor: string;
      },
    | {
        [x: string]: unknown;
        type: 'gap';
        cursor: string;
      }
    | {
        [x: string]: unknown;
        type: 'terminated';
        error: {
          [x: string]: unknown;
          code: number;
          message: string;
          data?: unknown;
        };
      }
  >
>;
type MCPEventControl = z.infer<typeof MCPEventControlSchema>;
type MCPEventSubscription = {
  key: string;
  id?: string;
  name: string;
  arguments: JSONObject;
  definition: MCPEventDefinition;
  delivery: {
    mode: 'webhook';
    url: string;
    secret: string;
  };
  refreshBefore?: string | null;
  cursor: string | null;
  truncated: boolean;
  ttlMs?: number | null;
  maxAgeMs?: number;
  status: 'pending' | 'active';
};
type MCPEventSubscriptionInfo = {
  id: string;
  name: string;
  arguments: JSONObject;
  delivery: {
    mode: 'webhook';
    url: string;
  };
  refreshBefore: string | null;
};
interface MCPEventStore {
  get(key: string): Promise<MCPEventSubscription | undefined>;
  getById(id: string): Promise<MCPEventSubscription | undefined>;
  set(subscription: MCPEventSubscription): Promise<void>;
  update(key: string, patch: Partial<MCPEventSubscription>): Promise<void>;
  delete(key: string): Promise<void>;
}
type MCPEventsConfig =
  | {
      store: MCPEventStore;
      adapter?: never;
      validateArguments?: (args: {
        definition: MCPEventDefinition;
        arguments: JSONObject;
      }) => void | PromiseLike<void>;
    }
  | {
      adapter: MCPEventAdapter;
      store?: never;
      validateArguments?: never;
    };
type SubscribeEventOptions = {
  name: string;
  arguments?: JSONObject;
  delivery: {
    mode: 'webhook';
    url: string;
    allowInsecureLocalhost?: boolean;
    secret?: string;
  };
  cursor?: string | null;
  ttlMs?: number | null;
  maxAgeMs?: number;
  options?: RequestOptions;
};
type MCPEventSubscriptionOptions = (
  | {
      id: string;
      key?: never;
    }
  | {
      key: string;
      id?: never;
    }
) & {
  options?: RequestOptions;
};
interface MCPEvents {
  list(options?: {
    params?: {
      cursor?: string;
    };
    options?: RequestOptions;
  }): Promise<ListEventsResult>;
  subscribe(options: SubscribeEventOptions): Promise<SubscribeEventResult>;
  refresh(options: MCPEventSubscriptionOptions): Promise<SubscribeEventResult>;
  unsubscribe(options: MCPEventSubscriptionOptions): Promise<void>;
}
type ManagedSubscription = {
  id: string;
  name: string;
  arguments: JSONObject;
  status:
    'pending' | 'active' | 'needs_auth' | 'stopped' | 'expired' | 'failed';
  expiresAt: string | null;
  cleanupStatus?: 'pending' | 'complete' | 'exhausted';
};
type ManagedSubscribeInput = {
  name: string;
  arguments: JSONObject;
  context?: JSONObject;
  idempotencyKey: string;
  ttlMs: number | null;
  options?: RequestOptions;
};
interface MCPEventOperations {
  subscribe(input: ManagedSubscribeInput): Promise<ManagedSubscription>;
  getSubscription(input: {
    id: string;
    options?: RequestOptions;
  }): Promise<ManagedSubscription>;
  listSubscriptions(input?: {
    cursor?: string;
    limit?: number;
    status?: ManagedSubscription['status'];
    options?: RequestOptions;
  }): Promise<{
    subscriptions: ManagedSubscription[];
    nextCursor?: string;
  }>;
  unsubscribe(input: {
    id: string;
    options?: RequestOptions;
  }): Promise<ManagedSubscription>;
}
interface MCPEventAdapter {
  createAdapter(context: {
    transport:
      | {
          type: 'http' | 'sse';
          url: string;
        }
      | {
          type: 'custom';
        };
  }): MCPEventOperations;
}
interface ManagedMCPEvents extends MCPEventOperations {
  list: MCPEvents['list'];
}
declare const OAuthTokensSchema: z.ZodObject<
  {
    access_token: z.ZodString;
    id_token: z.ZodOptional<z.ZodString>;
    token_type: z.ZodString;
    expires_in: z.ZodOptional<z.ZodNumber>;
    scope: z.ZodOptional<z.ZodString>;
    refresh_token: z.ZodOptional<z.ZodString>;
    issuer: z.ZodOptional<z.ZodString>;
    authorization_server: z.ZodOptional<z.ZodString>;
    token_endpoint: z.ZodOptional<z.ZodString>;
  },
  z.core.$strip
>;
declare const OAuthMetadataSchema: z.ZodObject<
  {
    issuer: z.ZodString;
    authorization_endpoint: z.ZodString;
    token_endpoint: z.ZodString;
    registration_endpoint: z.ZodOptional<z.ZodString>;
    authorization_response_iss_parameter_supported: z.ZodOptional<z.ZodBoolean>;
    client_id_metadata_document_supported: z.ZodOptional<z.ZodBoolean>;
    scopes_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
    response_types_supported: z.ZodArray<z.ZodString>;
    grant_types_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
    code_challenge_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
    token_endpoint_auth_methods_supported: z.ZodOptional<
      z.ZodArray<z.ZodString>
    >;
    token_endpoint_auth_signing_alg_values_supported: z.ZodOptional<
      z.ZodArray<z.ZodString>
    >;
  },
  z.core.$loose
>;
declare const OpenIdProviderDiscoveryMetadataSchema: z.ZodObject<
  {
    issuer: z.ZodString;
    authorization_endpoint: z.ZodString;
    token_endpoint: z.ZodString;
    userinfo_endpoint: z.ZodOptional<z.ZodString>;
    jwks_uri: z.ZodString;
    registration_endpoint: z.ZodOptional<z.ZodString>;
    authorization_response_iss_parameter_supported: z.ZodOptional<z.ZodBoolean>;
    client_id_metadata_document_supported: z.ZodOptional<z.ZodBoolean>;
    scopes_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
    response_types_supported: z.ZodArray<z.ZodString>;
    grant_types_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
    subject_types_supported: z.ZodArray<z.ZodString>;
    id_token_signing_alg_values_supported: z.ZodArray<z.ZodString>;
    claims_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
    token_endpoint_auth_methods_supported: z.ZodOptional<
      z.ZodArray<z.ZodString>
    >;
    code_challenge_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  },
  z.core.$loose
>;
declare const OAuthClientInformationSchema: z.ZodObject<
  {
    client_id: z.ZodString;
    client_secret: z.ZodOptional<z.ZodString>;
    client_id_issued_at: z.ZodOptional<z.ZodNumber>;
    client_secret_expires_at: z.ZodOptional<z.ZodNumber>;
    issuer: z.ZodOptional<z.ZodString>;
    authorization_server: z.ZodOptional<z.ZodString>;
    token_endpoint: z.ZodOptional<z.ZodString>;
  },
  z.core.$strip
>;
declare const OAuthClientMetadataSchema: z.ZodObject<
  {
    redirect_uris: z.ZodArray<z.ZodString>;
    application_type: z.ZodOptional<
      z.ZodUnion<readonly [z.ZodLiteral<'native'>, z.ZodLiteral<'web'>]>
    >;
    token_endpoint_auth_method: z.ZodOptional<z.ZodString>;
    grant_types: z.ZodOptional<z.ZodArray<z.ZodString>>;
    response_types: z.ZodOptional<z.ZodArray<z.ZodString>>;
    client_name: z.ZodOptional<z.ZodString>;
    client_uri: z.ZodOptional<z.ZodString>;
    logo_uri: z.ZodOptional<z.ZodString>;
    scope: z.ZodOptional<z.ZodString>;
    contacts: z.ZodOptional<z.ZodArray<z.ZodString>>;
    tos_uri: z.ZodOptional<z.ZodString>;
    policy_uri: z.ZodOptional<z.ZodString>;
    jwks_uri: z.ZodOptional<z.ZodString>;
    jwks: z.ZodOptional<z.ZodAny>;
    software_id: z.ZodOptional<z.ZodString>;
    software_version: z.ZodOptional<z.ZodString>;
    software_statement: z.ZodOptional<z.ZodString>;
  },
  z.core.$strip
>;
type OAuthMetadata = z.infer<typeof OAuthMetadataSchema>;
type OpenIdProviderDiscoveryMetadata = z.infer<
  typeof OpenIdProviderDiscoveryMetadataSchema
>;
type OAuthTokens = z.infer<typeof OAuthTokensSchema>;
type OAuthClientInformation = z.infer<typeof OAuthClientInformationSchema>;
type AuthorizationServerMetadata =
  OAuthMetadata | OpenIdProviderDiscoveryMetadata;
type OAuthClientMetadata = z.infer<typeof OAuthClientMetadataSchema>;
declare const symbol$1: unique symbol;
export declare class MCPClientOAuthError extends AISDKError {
  private readonly [symbol$1];
  constructor({
    name,
    message,
    cause,
  }: {
    name?: string;
    message: string;
    cause?: unknown;
  });
  static isInstance(error: unknown): error is MCPClientOAuthError;
}
declare const mismatchSymbol: unique symbol;
export declare class AuthorizationServerMismatchError extends MCPClientOAuthError {
  private readonly [mismatchSymbol];
  static errorCode: string;
  constructor({ message, cause }: { message: string; cause?: unknown });
  static isInstance(error: unknown): error is AuthorizationServerMismatchError;
}
type AuthResult = 'AUTHORIZED' | 'REDIRECT';
interface OAuthAuthorizationServerInformation {
  issuer?: string;
  authorizationServerUrl: string;
  tokenEndpoint: string;
}
interface OAuthClientProvider {
  tokens(): OAuthTokens | undefined | Promise<OAuthTokens | undefined>;
  saveTokens(tokens: OAuthTokens): void | Promise<void>;
  redirectToAuthorization(authorizationUrl: URL): void | Promise<void>;
  saveCodeVerifier(codeVerifier: string): void | Promise<void>;
  codeVerifier(): string | Promise<string>;
  addClientAuthentication?(
    headers: Headers,
    params: URLSearchParams,
    url: string | URL,
    metadata?: AuthorizationServerMetadata,
  ): void | Promise<void>;
  invalidateCredentials?(
    scope: 'all' | 'client' | 'tokens' | 'verifier',
    context?: {
      tokens: OAuthTokens;
    },
  ): void | Promise<void>;
  get redirectUrl(): string | URL;
  get clientMetadata(): OAuthClientMetadata;
  clientInformation():
    | OAuthClientInformation
    | undefined
    | Promise<OAuthClientInformation | undefined>;
  isClientInformationDynamicallyRegistered?(): boolean | Promise<boolean>;
  saveClientInformation?(
    clientInformation: OAuthClientInformation,
  ): void | Promise<void>;
  authorizationServerInformation?():
    | OAuthAuthorizationServerInformation
    | undefined
    | Promise<OAuthAuthorizationServerInformation | undefined>;
  saveAuthorizationServerInformation?(
    authorizationServerInformation: OAuthAuthorizationServerInformation,
  ): void | Promise<void>;
  validateAuthorizationServerURL?(
    serverUrl: string | URL,
    authorizationServerUrl: string | URL,
  ): void | Promise<void>;
  state?(): string | Promise<string>;
  saveState?(state: string): void | Promise<void>;
  storedState?(): string | undefined | Promise<string | undefined>;
  validateResourceURL?(
    serverUrl: string | URL,
    resource?: string,
  ): Promise<URL | undefined>;
}
export declare class UnauthorizedError extends Error {
  constructor(message?: string);
}
export declare function auth(
  provider: OAuthClientProvider,
  options: {
    serverUrl: string | URL;
    authorizationCode?: string;
    callbackState?: string;
    callbackIssuer?: string;
    scope?: string;
    resourceMetadataUrl?: URL;
    fetchFn?: FetchFunction;
  },
): Promise<AuthResult>;
type MCPTransportSendOptions = {
  signal?: AbortSignal;
  headers?: Record<string, string>;
  relatedRequestId?: string | number;
  resumptionToken?: string;
  onresumptiontoken?: (token: string) => void;
};
type MCPTransportCloseOptions = {
  signal?: AbortSignal;
};
interface MCPTransport {
  supportsProtocolVersionDiscovery?: boolean;
  waitsForProtocolVersionDiscovery?: boolean;
  supportsMcpToolParameterHeaders?: boolean;
  start(): Promise<void>;
  send(
    message: JSONRPCMessage,
    options?: MCPTransportSendOptions,
  ): Promise<void>;
  close(options?: MCPTransportCloseOptions): Promise<void>;
  onclose?: () => void;
  onerror?: (error: Error) => void;
  onmessage?: (message: JSONRPCMessage) => void;
  protocolVersion?: string;
  setProtocolVersion?(version: string): void;
}
type MCPTransportConfig = {
  type: 'sse' | 'http';
  url: string;
  headers?: Record<string, string>;
  authProvider?: OAuthClientProvider;
  redirect?: 'follow' | 'error';
  initialSessionId?: string;
  initialProtocolVersion?: string;
  onSessionIdChange?: (sessionId: string | undefined) => void;
  onSessionExpired?: (sessionId: string) => void;
  terminateSessionOnClose?: boolean;
  fetch?: FetchFunction;
};
interface MCPClientConfig {
  experimental_events?: MCPEventsConfig;
  transport: MCPTransportConfig | MCPTransport;
  protocolVersionDiscovery?: boolean;
  initializationOptions?: RequestOptions;
  onUncaughtError?: (error: unknown) => void;
  maxRetries?: number;
  initialInitializeResult?: InitializeResult;
  clientName?: string;
  name?: string;
  version?: string;
  capabilities?: ClientCapabilities;
}
type ManagedMCPClient = Omit<MCPClient, 'experimental_events'> & {
  readonly experimental_events: ManagedMCPEvents;
};
export declare function createMCPClient(
  config: MCPClientConfig & {
    experimental_events: {
      adapter: MCPEventAdapter;
    };
  },
): Promise<ManagedMCPClient>;
export declare function createMCPClient(
  config: MCPClientConfig & {
    experimental_events?: {
      adapter?: never;
    };
  },
): Promise<MCPClient>;
export declare function createMCPClient(
  config: MCPClientConfig,
): Promise<MCPClient | ManagedMCPClient>;
interface MCPClient {
  readonly experimental_events: MCPEvents;
  readonly serverInfo: Configuration;
  readonly initializeResult: InitializeResult;
  readonly instructions?: string;
  tools<TOOL_SCHEMAS extends ToolSchemas = 'automatic'>(options?: {
    schemas?: TOOL_SCHEMAS;
  }): Promise<McpToolSet<TOOL_SCHEMAS>>;
  listTools(options?: {
    params?: PaginatedRequest['params'];
    options?: RequestOptions;
  }): Promise<ListToolsResult>;
  callTool(args: {
    name: string;
    arguments?: Record<string, unknown>;
    options?: RequestOptions;
  }): Promise<CallToolResult>;
  toolsFromDefinitions<TOOL_SCHEMAS extends ToolSchemas = 'automatic'>(
    definitions: ListToolsResult,
    options?: {
      schemas?: TOOL_SCHEMAS;
    },
  ): McpToolSet<TOOL_SCHEMAS>;
  listResources(options?: {
    params?: PaginatedRequest['params'];
    options?: RequestOptions;
  }): Promise<ListResourcesResult>;
  readResource(args: {
    uri: string;
    options?: RequestOptions;
  }): Promise<ReadResourceResult>;
  listResourceTemplates(options?: {
    options?: RequestOptions;
  }): Promise<ListResourceTemplatesResult>;
  listPrompts(options?: {
    params?: PaginatedRequest['params'];
    options?: RequestOptions;
  }): Promise<ListPromptsResult>;
  getPrompt(args: {
    name: string;
    arguments?: Record<string, unknown>;
    options?: RequestOptions;
  }): Promise<GetPromptResult>;
  experimental_listPrompts(options?: {
    params?: PaginatedRequest['params'];
    options?: RequestOptions;
  }): Promise<ListPromptsResult>;
  experimental_getPrompt(args: {
    name: string;
    arguments?: Record<string, unknown>;
    options?: RequestOptions;
  }): Promise<GetPromptResult>;
  complete(
    args: CompleteRequestParams & {
      options?: RequestOptions;
    },
  ): Promise<CompleteResult>;
  onElicitationRequest(
    schema: typeof ElicitationRequestSchema,
    handler: (
      request: ElicitationRequest,
    ) => Promise<ElicitResult> | ElicitResult,
  ): void;
  close: () => Promise<void>;
}
export declare const MCP_APP_MIME_TYPE: 'text/html;profile=mcp-app';
export declare const mcpAppClientCapabilities: {
  readonly extensions: {
    readonly 'io.modelcontextprotocol/ui': {
      readonly mimeTypes: readonly ['text/html;profile=mcp-app'];
    };
  };
};
type MCPAppResourceCSP = {
  connectDomains?: string[];
  resourceDomains?: string[];
  frameDomains?: string[];
  baseUriDomains?: string[];
  [key: string]: unknown;
};
type MCPAppResourceMeta = {
  prefersBorder?: boolean;
  csp?: MCPAppResourceCSP;
  permissions?: Record<string, unknown>;
  [key: string]: unknown;
};
type MCPAppResource = {
  uri: string;
  mimeType: typeof MCP_APP_MIME_TYPE;
  html: string;
  meta?: MCPAppResourceMeta;
};
export declare function splitMCPAppTools(definitions: ListToolsResult): {
  modelVisible: ListToolsResult;
  appVisible: ListToolsResult;
};
export declare function readMCPAppResource({
  client,
  uri,
  options,
}: {
  client: Pick<MCPClient, 'readResource'>;
  uri: string;
  options?: RequestOptions;
}): Promise<MCPAppResource>;
export declare function fingerprintMCPAppResource(
  resource: MCPAppResource,
): Promise<string>;
export declare function detectMCPAppResourceDrift(
  current: string,
  baseline: string,
): boolean;
declare const symbol: unique symbol;
export declare class MCPClientError extends AISDKError {
  private readonly [symbol];
  readonly data?: unknown;
  readonly code?: number;
  readonly statusCode?: number;
  readonly url?: string;
  readonly responseBody?: string;
  constructor({
    name,
    message,
    cause,
    data,
    code,
    statusCode,
    url,
    responseBody,
  }: {
    name?: string;
    message: string;
    cause?: unknown;
    data?: unknown;
    code?: number;
    statusCode?: number;
    url?: string;
    responseBody?: string;
  });
  static isInstance(error: unknown): error is MCPClientError;
}
interface WebMCPTool {
  name: string;
  title?: string;
  description: string;
  inputSchema?: object;
  outputSchema?: object;
  origin: string;
  window: unknown;
  annotations?: {
    readOnlyHint?: boolean;
    untrustedContentHint?: boolean;
    consequentialHint?: boolean;
    debugging?: boolean;
  };
}
interface WebMCPModelContext {
  getTools(options?: { fromOrigins?: string[] }): Promise<WebMCPTool[]>;
  executeTool(
    tool: WebMCPTool,
    inputObject?: object,
    options?: {
      signal?: AbortSignal;
    },
  ): Promise<string>;
}
declare class WebMCPTransport implements MCPTransport {
  private readonly modelContext;
  private readonly fromOrigins?;
  private controller?;
  private tools;
  private readonly aliases;
  private readonly reservedNames;
  private readonly registrationCounts;
  private hasListedTools;
  onmessage?: (message: JSONRPCMessage) => void;
  onclose?: () => void;
  onerror?: (error: Error) => void;
  constructor({
    modelContext,
    fromOrigins,
  }: {
    modelContext: WebMCPModelContext;
    fromOrigins?: string[];
  });
  start(): Promise<void>;
  send(
    message: JSONRPCMessage,
    options?: MCPTransportSendOptions,
  ): Promise<void>;
  close(): Promise<void>;
  private handleRequest;
  private listTools;
}
type MCPEventWebhookOptions = {
  store: MCPEventStore;
  validatePayload?: (args: {
    definition: MCPEventDefinition;
    data: MCPEvent['data'];
  }) => void | PromiseLike<void>;
  onEvent: (args: {
    subscription: MCPEventSubscriptionInfo;
    event: MCPEvent;
  }) => Promise<void>;
  onGap?: (args: {
    subscription: MCPEventSubscriptionInfo;
    messageId: string;
    gap: Extract<
      MCPEventControl,
      {
        type: 'gap';
      }
    >;
  }) => Promise<void>;
  onTerminated?: (args: {
    subscription: MCPEventSubscriptionInfo;
    messageId: string;
    termination: Extract<
      MCPEventControl,
      {
        type: 'terminated';
      }
    >;
  }) => Promise<void>;
  onError?: (error: unknown) => void;
};
declare function createMCPEventWebhook({
  store,
  validatePayload,
  onEvent,
  onGap,
  onTerminated,
  onError,
}: MCPEventWebhookOptions): (request: Request) => Promise<Response>;
export {
  type CallToolResult,
  type CompleteRequestParams,
  type CompleteResult,
  type Configuration,
  type ElicitResult,
  type ElicitationRequest,
  type ListEventsResult as Experimental_ListEventsResult,
  type MCPEvent as Experimental_MCPEvent,
  type MCPEventAdapter as Experimental_MCPEventAdapter,
  type MCPEventControl as Experimental_MCPEventControl,
  type MCPEventDefinition as Experimental_MCPEventDefinition,
  type MCPEventOperations as Experimental_MCPEventOperations,
  type MCPEventStore as Experimental_MCPEventStore,
  type MCPEventSubscription as Experimental_MCPEventSubscription,
  type MCPEventSubscriptionInfo as Experimental_MCPEventSubscriptionInfo,
  type MCPEventWebhookOptions as Experimental_MCPEventWebhookOptions,
  type MCPEvents as Experimental_MCPEvents,
  type MCPEventsConfig as Experimental_MCPEventsConfig,
  type ManagedMCPClient as Experimental_ManagedMCPClient,
  type ManagedMCPEvents as Experimental_ManagedMCPEvents,
  type ManagedSubscribeInput as Experimental_ManagedSubscribeInput,
  type ManagedSubscription as Experimental_ManagedSubscription,
  type SubscribeEventOptions as Experimental_SubscribeEventOptions,
  type SubscribeEventResult as Experimental_SubscribeEventResult,
  type WebMCPModelContext as Experimental_WebMCPModelContext,
  type WebMCPTool as Experimental_WebMCPTool,
  WebMCPTransport as Experimental_WebMCPTransport,
  type InitializeResult,
  type JSONRPCError,
  type JSONRPCMessage,
  type JSONRPCNotification,
  type JSONRPCRequest,
  type JSONRPCResponse,
  type ListToolsResult,
  type MCPAppResource,
  type MCPAppResourceCSP,
  type MCPAppResourceMeta,
  type MCPClient,
  type MCPClient as experimental_MCPClient,
  type ClientCapabilities as MCPClientCapabilities,
  type ClientCapabilities as experimental_MCPClientCapabilities,
  type MCPClientConfig,
  type MCPClientConfig as experimental_MCPClientConfig,
  type MCPTransport,
  type MCPTransportCloseOptions,
  type MCPTransportSendOptions,
  type McpProviderMetadata,
  type McpToolAnnotations,
  type OAuthAuthorizationServerInformation,
  type OAuthClientInformation,
  type OAuthClientMetadata,
  type OAuthClientProvider,
  type OAuthTokens,
  createMCPClient as experimental_createMCPClient,
  createMCPEventWebhook as experimental_createMCPEventWebhook,
};
