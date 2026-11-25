import { experimental_createWebFetchTool as createNativeTool } from '@ai-sdk/tool-web-fetch';
import { runSync } from '../internal/operation.js';
import { wrapTool } from './internal/sdk-tool.js';

/** Create a tool that fetches documents with the SDK's URL restrictions. */
export const experimental_createWebFetchTool = (
  ...args: Parameters<typeof createNativeTool>
) =>
  runSync('ToolWebFetch.create', () =>
    wrapTool('ToolWebFetch.tool', createNativeTool(...args)),
  );
