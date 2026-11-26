import { experimental_createWebFetchTool as native } from '@ai-sdk/tool-web-fetch';
import type { experimental_createWebFetchTool as Contract } from './internal/harness-contracts/tool-web-fetch.js';
import { runSync } from '../internal/operation.js';
import { wrapTool } from './internal/sdk-tool.js';

/** Bind the native fetch tool factory to its pinned contract before adapting its tools. */
const createNativeTool = native as unknown as typeof Contract;

/** Create a tool that fetches documents with the SDK's URL restrictions. */
export const experimental_createWebFetchTool = (
  ...args: Parameters<typeof createNativeTool>
) =>
  runSync('ToolWebFetch.create', () =>
    wrapTool('ToolWebFetch.tool', createNativeTool(...args)),
  );
