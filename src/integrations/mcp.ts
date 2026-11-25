import * as sdk from '@ai-sdk/mcp';
import type { Experimental_ManagedMCPClient as NativeManagedClient } from '@ai-sdk/mcp';
import { Effect } from 'effect';
import {
  openOperation,
  runRequest,
  runSync,
  sdkError,
} from '../internal/operation.js';
import { transports } from './internal/mcp-stdio.js';
import type { StdioMCPTransport } from './mcp/mcp-stdio.js';

export type {
  CallToolResult,
  CompleteRequestParams,
  CompleteResult,
  Configuration,
  ElicitResult,
  ElicitationRequest,
  Experimental_ListEventsResult,
  Experimental_MCPEvent,
  Experimental_MCPEventControl,
  Experimental_MCPEventDefinition,
  Experimental_MCPEventSubscription,
  Experimental_MCPEventSubscriptionInfo,
  Experimental_ManagedSubscribeInput,
  Experimental_ManagedSubscription,
  Experimental_SubscribeEventOptions,
  Experimental_SubscribeEventResult,
  InitializeResult,
  JSONRPCError,
  JSONRPCMessage,
  JSONRPCNotification,
  JSONRPCRequest,
  JSONRPCResponse,
  ListToolsResult,
  MCPAppResource,
  MCPAppResourceCSP,
  MCPAppResourceMeta,
  MCPClientCapabilities,
  McpProviderMetadata,
  McpToolAnnotations,
  OAuthAuthorizationServerInformation,
  OAuthClientInformation,
  OAuthClientMetadata,
  OAuthTokens,
  experimental_MCPClientCapabilities,
} from '@ai-sdk/mcp';

export const MCP_APP_MIME_TYPE = sdk.MCP_APP_MIME_TYPE;
export const mcpAppClientCapabilities = sdk.mcpAppClientCapabilities;

export const validateJSONRPCMessage = (message: unknown) =>
  runSync('MCP.validateJSONRPCMessage', () =>
    sdk.validateJSONRPCMessage(message),
  );

export const ElicitationRequestSchema = {
  validate: (input: unknown) =>
    runSync('MCP.ElicitationRequestSchema.validate', () =>
      sdk.ElicitationRequestSchema.parse(input),
    ),
};

export const ElicitResultSchema = {
  validate: (input: unknown) =>
    runSync('MCP.ElicitResultSchema.validate', () =>
      sdk.ElicitResultSchema.parse(input),
    ),
};

export const fingerprintMCPAppResource = (resource: sdk.MCPAppResource) =>
  runRequest('MCP.fingerprintMCPAppResource', {}, () =>
    sdk.fingerprintMCPAppResource(resource),
  );

export const detectMCPAppResourceDrift = (current: string, baseline: string) =>
  sdk.detectMCPAppResourceDrift(current, baseline);

export const splitMCPAppTools = (definitions: sdk.ListToolsResult) =>
  runSync('MCP.splitMCPAppTools', () => sdk.splitMCPAppTools(definitions));

type RequestOptions = NonNullable<
  NonNullable<Parameters<sdk.MCPClient['listTools']>[0]>['options']
>;

type RequestArguments = { options?: RequestOptions };

const request = <A extends RequestArguments, B>(
  operation: string,
  invoke: (input: A) => Promise<B>,
  input: A,
) =>
  runRequest(
    operation,
    { ...(input.options?.signal && { abortSignal: input.options.signal }) },
    (signal) => invoke({ ...input, options: { ...input.options, signal } }),
  );

const effects =
  <A extends RequestArguments, B>(
    operation: string,
    invoke: (input: A) => Promise<B>,
  ) =>
  (input: A) =>
    request(operation, invoke, input);

const optional =
  <A extends RequestArguments, B>(
    operation: string,
    invoke: (input?: A) => Promise<B>,
  ) =>
  (input?: A) =>
    request(operation, invoke, input ?? {});

const wrapEvents = (
  events: sdk.Experimental_MCPEvents | sdk.Experimental_ManagedMCPEvents,
) => {
  const list = optional('MCP.events.list', events.list.bind(events));
  if ('getSubscription' in events) {
    return {
      list,
      subscribe: effects('MCP.events.subscribe', events.subscribe.bind(events)),
      unsubscribe: effects(
        'MCP.events.unsubscribe',
        events.unsubscribe.bind(events),
      ),
      getSubscription: effects(
        'MCP.events.getSubscription',
        events.getSubscription.bind(events),
      ),
      listSubscriptions: optional(
        'MCP.events.listSubscriptions',
        events.listSubscriptions.bind(events),
      ),
    };
  }
  return {
    list,
    subscribe: effects('MCP.events.subscribe', events.subscribe.bind(events)),
    refresh: effects('MCP.events.refresh', events.refresh.bind(events)),
    unsubscribe: effects(
      'MCP.events.unsubscribe',
      events.unsubscribe.bind(events),
    ),
  };
};

const wrapClient = <R>(
  native: sdk.MCPClient | NativeManagedClient,
  owner: Effect.Success<ReturnType<typeof openOperation<R>>>,
  close: Effect.Effect<void, import('../internal/operation.js').AiSdkError>,
) => ({
  serverInfo: native.serverInfo,
  initializeResult: native.initializeResult,
  instructions: native.instructions,
  experimental_events: wrapEvents(native.experimental_events),
  listTools: optional('MCP.listTools', native.listTools.bind(native)),
  callTool: effects('MCP.callTool', native.callTool.bind(native)),
  listResources: optional(
    'MCP.listResources',
    native.listResources.bind(native),
  ),
  readResource: effects('MCP.readResource', native.readResource.bind(native)),
  listResourceTemplates: optional(
    'MCP.listResourceTemplates',
    native.listResourceTemplates.bind(native),
  ),
  listPrompts: optional('MCP.listPrompts', native.listPrompts.bind(native)),
  getPrompt: effects('MCP.getPrompt', native.getPrompt.bind(native)),
  experimental_listPrompts: optional(
    'MCP.experimental_listPrompts',
    native.experimental_listPrompts.bind(native),
  ),
  experimental_getPrompt: effects(
    'MCP.experimental_getPrompt',
    native.experimental_getPrompt.bind(native),
  ),
  complete: effects('MCP.complete', native.complete.bind(native)),
  onElicitationRequest: <E>(
    handler: (
      input: sdk.ElicitationRequest,
    ) => Effect.Effect<sdk.ElicitResult, E, R>,
  ) =>
    runSync('MCP.onElicitationRequest', () =>
      native.onElicitationRequest(sdk.ElicitationRequestSchema, (input) =>
        owner.runCallback(handler(input)),
      ),
    ),
  close,
});

type HttpTransport = Extract<
  sdk.MCPClientConfig['transport'],
  { type: 'http' | 'sse' }
>;

export type MCPClientConfig<R = never, E = never> = Omit<
  sdk.MCPClientConfig,
  'transport' | 'onUncaughtError' | 'experimental_events'
> & {
  readonly transport: HttpTransport | StdioMCPTransport;
  readonly onUncaughtError?: (error: unknown) => Effect.Effect<void, E, R>;
};

export type MCPClient<R = never> = ReturnType<typeof wrapClient<R>>;
export type experimental_MCPClient = MCPClient;
export type experimental_MCPClientConfig = MCPClientConfig;

/** Own the MCP handshake, callbacks, and client shutdown in the caller's scope. */
export const createMCPClient = <R = never, E = never>(
  config: MCPClientConfig<R, E>,
) =>
  Effect.gen(function* () {
    const operation = 'MCP.createMCPClient';
    const { transport, onUncaughtError, initializationOptions, ...opts } =
      config;
    const owner = yield* openOperation<R>(initializationOptions?.signal);
    const nativeTransport =
      'type' in transport ? transport : transports.get(transport);
    if (!nativeTransport) {
      return yield* Effect.fail(sdkError(operation, 'Invalid MCP transport'));
    }
    const opened = yield* Effect.acquireRelease(
      runRequest(operation, { abortSignal: owner.signal }, (signal) =>
        sdk.createMCPClient({
          ...opts,
          transport: nativeTransport,
          initializationOptions: { ...initializationOptions, signal },
          ...(onUncaughtError && {
            onUncaughtError: (error) => {
              void owner.runCallback(
                onUncaughtError(error).pipe(
                  Effect.catch((callbackError) =>
                    Effect.logWarning('MCP callback failed', callbackError),
                  ),
                ),
              );
            },
          }),
        }),
      ),
      (native) =>
        runRequest('MCP.close', {}, () => native.close()).pipe(
          Effect.catchTag('AiSdkError', (error) =>
            Effect.logWarning('MCP close failed', error),
          ),
        ),
      { interruptible: true },
    );
    return wrapClient(
      opened,
      owner,
      runRequest('MCP.close', {}, () => opened.close()),
    );
  });

export const experimental_createMCPClient = createMCPClient;
