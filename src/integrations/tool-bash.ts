import { experimental_createBashTool as createNativeTool } from '@ai-sdk/tool-bash';
import { Effect } from 'effect';
import { runRequest, sdkError } from '../internal/operation.js';
import { type SandboxSession, unwrapSandbox } from './internal/sandbox.js';
import { wrapTool } from './internal/sdk-tool.js';

type Options = Omit<Parameters<typeof createNativeTool>[0], 'sandbox'> & {
  readonly sandbox: SandboxSession;
};

/** Create a Bash tool using the caller-owned sandbox. */
export const experimental_createBashTool = (options: Options) =>
  Effect.gen(function* () {
    const sandbox = unwrapSandbox(options.sandbox);
    if (!sandbox) {
      return yield* Effect.fail(
        sdkError('ToolBash.create', 'Invalid sandbox session'),
      );
    }
    const native = yield* runRequest('ToolBash.create', {}, () =>
      createNativeTool({ ...options, sandbox }),
    );
    return wrapTool('ToolBash.tool', native);
  });
