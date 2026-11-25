// Generated from @ai-sdk/tool-web-fetch in @ai-sdk/tool-web-fetch@1.0.31. Do not edit.
// Original license: harness.LICENSE.
// Normalize Zod v4 declarations for the Zod 3.25.76 bridge.
import { FetchFunction } from '@ai-sdk/provider-utils';
import { Tool, ToolExecuteFunction } from 'ai';
import { z } from 'zod/v4';
import * as DefuddleModule from 'defuddle/node';
type WebFetchDefuddleOptions = Omit<
  DefuddleModule.DefuddleOptions,
  | 'debug'
  | 'fetch'
  | 'markdown'
  | 'profile'
  | 'separateMarkdown'
  | 'url'
  | 'useAsync'
>;
declare const inputSchema: z.ZodObject<
  {
    url: z.ZodString;
    offset: z.ZodOptional<z.ZodNumber>;
  },
  z.core.$strip
>;
declare const outputSchema: z.ZodDiscriminatedUnion<
  [
    z.ZodObject<
      {
        type: z.ZodLiteral<'document'>;
        url: z.ZodString;
        finalUrl: z.ZodString;
        contentType: z.ZodString;
        title: z.ZodOptional<z.ZodString>;
        content: z.ZodString;
        offset: z.ZodNumber;
        totalLength: z.ZodNumber;
        nextOffset: z.ZodOptional<z.ZodNumber>;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'error'>;
        url: z.ZodString;
        errorCode: z.ZodEnum<{
          invalid_url: 'invalid_url';
          url_not_allowed: 'url_not_allowed';
          url_not_in_user_message: 'url_not_in_user_message';
          http_error: 'http_error';
          timeout: 'timeout';
          too_large: 'too_large';
          too_many_redirects: 'too_many_redirects';
          unsupported_content_type: 'unsupported_content_type';
          conversion_failed: 'conversion_failed';
          network_error: 'network_error';
        }>;
        message: z.ZodString;
        statusCode: z.ZodOptional<z.ZodNumber>;
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
type WebFetchInput = z.infer<typeof inputSchema>;
type WebFetchOutput = z.infer<typeof outputSchema>;
declare function createWebFetchTool({
  allowedDomains,
  blockedDomains,
  requireUrlInUserMessage,
  maxLength,
  maxBytes,
  timeout,
  fetch,
  defuddleOptions,
}?: {
  allowedDomains?: string[];
  blockedDomains?: string[];
  requireUrlInUserMessage?: boolean;
  maxLength?: number;
  maxBytes?: number;
  timeout?: number;
  fetch?: FetchFunction;
  defuddleOptions?: WebFetchDefuddleOptions;
}): Tool<WebFetchInput, WebFetchOutput, {}> & {
  execute: ToolExecuteFunction<WebFetchInput, WebFetchOutput, {}>;
};
export { createWebFetchTool as experimental_createWebFetchTool };
