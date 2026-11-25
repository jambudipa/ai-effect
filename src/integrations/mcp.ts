import * as sdk from '@ai-sdk/mcp';
import type { Experimental_ManagedMCPClient as NativeManagedClient } from '@ai-sdk/mcp';
import { Effect } from 'effect';
import {
  type AiSdkError,
  openOperation,
  runRequest,
  runSync,
  sdkError,
} from '../internal/operation.js';
import {
  bindCallbacks,
  type WithEffectCallbacks,
} from './internal/callbacks.js';
import { wrapError } from './internal/error.js';
import { wrapTools } from './internal/sdk-tool.js';
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
    request(operation, invoke, input ?? ({} as A));

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
  tools: () =>
    runRequest('MCP.tools', {}, () => native.tools()).pipe(
      Effect.map((tools) => wrapTools('MCP.tools', tools)),
    ),
  toolsFromDefinitions: (definitions: sdk.ListToolsResult) =>
    runSync('MCP.toolsFromDefinitions', () =>
      wrapTools('MCP.tools', native.toolsFromDefinitions(definitions)),
    ),
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

type NativeHttpTransport = Extract<
  sdk.MCPClientConfig['transport'],
  { type: 'http' | 'sse' }
>;

export type MCPClientConfig<R = never, E = never> = Omit<
  sdk.MCPClientConfig,
  'transport' | 'onUncaughtError' | 'experimental_events'
> & {
  readonly transport: HttpTransport<R, E> | MCPTransport;
  readonly experimental_events?: Experimental_MCPEventsConfig<R, E>;
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
    const {
      transport,
      onUncaughtError,
      initializationOptions,
      experimental_events,
      ...opts
    } = config;
    const owner = yield* openOperation<R>(initializationOptions?.signal);
    const nativeTransport =
      'type' in transport
        ? bindHttpTransport(transport, owner)
        : transports.get(transport);
    if (!nativeTransport) {
      return yield* Effect.fail(sdkError(operation, 'Invalid MCP transport'));
    }
    const opened = yield* Effect.acquireRelease(
      runRequest(operation, { abortSignal: owner.signal }, (signal) =>
        sdk.createMCPClient({
          ...opts,
          transport: nativeTransport,
          ...(experimental_events && {
            experimental_events: bindEvents(experimental_events, owner),
          }),
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

export const MCPClientError = wrapError(
  'MCP.MCPClientError',
  sdk.MCPClientError,
);
export type MCPClientError = AiSdkError;
export const MCPClientOAuthError = wrapError(
  'MCP.MCPClientOAuthError',
  sdk.MCPClientOAuthError,
);
export type MCPClientOAuthError = AiSdkError;
export const AuthorizationServerMismatchError = {
  ...wrapError(
    'MCP.AuthorizationServerMismatchError',
    sdk.AuthorizationServerMismatchError,
  ),
  errorCode: sdk.AuthorizationServerMismatchError.errorCode,
};
export type AuthorizationServerMismatchError = AiSdkError;
export const UnauthorizedError = wrapError(
  'MCP.UnauthorizedError',
  sdk.UnauthorizedError,
);
export type UnauthorizedError = AiSdkError;

export const createMCPTools = (definitions: unknown) =>
  runSync('MCP.createTools', () =>
    wrapTools('MCP.tools', sdk.createMCPTools(definitions)),
  );

export const readMCPAppResource = <R>(options: {
  readonly client: Pick<MCPClient<R>, 'readResource'>;
  readonly uri: string;
  readonly options?: RequestOptions;
}) =>
  Effect.scoped(
    Effect.gen(function* () {
      const owner = yield* openOperation<R>(options.options?.signal);
      return yield* runRequest(
        'MCP.readAppResource',
        { abortSignal: owner.signal },
        (signal) =>
          sdk.readMCPAppResource({
            uri: options.uri,
            options: { ...options.options, signal },
            client: {
              readResource: (input) =>
                owner.runCallback(options.client.readResource(input), signal),
            },
          }),
      );
    }),
  );

const oauthCallbacks = [
  'tokens',
  'saveTokens',
  'redirectToAuthorization',
  'saveCodeVerifier',
  'codeVerifier',
  'addClientAuthentication',
  'invalidateCredentials',
  'clientInformation',
  'isClientInformationDynamicallyRegistered',
  'saveClientInformation',
  'authorizationServerInformation',
  'saveAuthorizationServerInformation',
  'validateAuthorizationServerURL',
  'state',
  'saveState',
  'storedState',
  'validateResourceURL',
] as const;

export type OAuthClientProvider<R = never, E = never> = WithEffectCallbacks<
  sdk.OAuthClientProvider,
  (typeof oauthCallbacks)[number],
  E,
  R
>;

type HttpTransport<R, E> = Omit<NativeHttpTransport, 'authProvider'> & {
  readonly authProvider?: OAuthClientProvider<R, E>;
};

type McpOwner<R> = Effect.Success<ReturnType<typeof openOperation<R>>>;

const bindHttpTransport = <R, E>(
  input: HttpTransport<R, E>,
  owner: McpOwner<R>,
): NativeHttpTransport => {
  const { authProvider, ...rest } = input;
  return {
    ...rest,
    ...(authProvider && {
      authProvider: bindCallbacks<
        sdk.OAuthClientProvider,
        typeof oauthCallbacks,
        E,
        R
      >(authProvider, oauthCallbacks, owner),
    }),
  };
};

export const auth = <R = never, E = never>(
  provider: OAuthClientProvider<R, E>,
  options: Parameters<typeof sdk.auth>[1],
) =>
  Effect.scoped(
    Effect.gen(function* () {
      const owner = yield* openOperation<R>();
      const native = bindCallbacks<
        sdk.OAuthClientProvider,
        typeof oauthCallbacks,
        E,
        R
      >(provider, oauthCallbacks, owner);
      return yield* runRequest('MCP.auth', { abortSignal: owner.signal }, () =>
        sdk.auth(native, options),
      );
    }),
  );

type NativeWebContext = sdk.Experimental_WebMCPModelContext;
type NativeWebTransport = InstanceType<typeof sdk.Experimental_WebMCPTransport>;

const webCallbacks = ['getTools', 'executeTool'] as const;

export type Experimental_WebMCPModelContext<
  R = never,
  E = never,
> = WithEffectCallbacks<NativeWebContext, (typeof webCallbacks)[number], E, R>;

export type {
  Experimental_WebMCPTool,
  MCPTransportCloseOptions,
  MCPTransportSendOptions,
} from '@ai-sdk/mcp';

/** Turn a WebMCP context into a scoped MCP transport. */
export class Experimental_WebMCPTransport {
  static make<R = never, E = never>(options: {
    readonly modelContext: Experimental_WebMCPModelContext<R, E>;
    readonly fromOrigins?: string[];
  }) {
    return Effect.gen(function* () {
      const owner = yield* openOperation<R>();
      const modelContext = bindCallbacks<
        NativeWebContext,
        typeof webCallbacks,
        E,
        R
      >(options.modelContext, webCallbacks, owner);
      return yield* runSync('WebMCPTransport.make', () => {
        const native = new sdk.Experimental_WebMCPTransport({
          ...options,
          modelContext,
        });
        const transport = new Experimental_WebMCPTransport(native);
        transports.set(transport, native);
        return transport;
      });
    });
  }

  private constructor(private readonly native: NativeWebTransport) {}

  get start() {
    return Effect.acquireRelease(
      runRequest('WebMCPTransport.start', {}, () => this.native.start()),
      () =>
        this.close.pipe(
          Effect.catchTag('AiSdkError', (error) =>
            Effect.logWarning('WebMCP transport release failed', error),
          ),
        ),
    );
  }

  get close() {
    return runRequest('WebMCPTransport.close', {}, () => this.native.close());
  }

  send(message: sdk.JSONRPCMessage, options?: sdk.MCPTransportSendOptions) {
    return runRequest(
      'WebMCPTransport.send',
      { ...(options?.signal && { abortSignal: options.signal }) },
      (signal) => this.native.send(message, { ...options, signal }),
    );
  }
}

export type MCPTransport = StdioMCPTransport | Experimental_WebMCPTransport;

type NativeWebhook = sdk.Experimental_MCPEventWebhookOptions;
const webhookCallbacks = [
  'validatePayload',
  'onEvent',
  'onGap',
  'onTerminated',
] as const;
const storeCallbacks = ['get', 'getById', 'set', 'update', 'delete'] as const;

export type Experimental_MCPEventStore<
  R = never,
  E = never,
> = WithEffectCallbacks<
  sdk.Experimental_MCPEventStore,
  (typeof storeCallbacks)[number],
  E,
  R
>;

export type Experimental_MCPEventWebhookOptions<R = never, E = never> = Omit<
  WithEffectCallbacks<NativeWebhook, (typeof webhookCallbacks)[number], E, R>,
  'store'
> & {
  readonly store: Experimental_MCPEventStore<R, E>;
};

/** Handle a webhook request with Effect-owned store and delivery callbacks. */
export const experimental_createMCPEventWebhook =
  <R = never, E = never>(options: Experimental_MCPEventWebhookOptions<R, E>) =>
  (request: Request) =>
    Effect.scoped(
      Effect.gen(function* () {
        const owner = yield* openOperation<R>(request.signal);
        const { store, ...callbacks } = options;
        const nativeStore = bindCallbacks<
          sdk.Experimental_MCPEventStore,
          typeof storeCallbacks,
          E,
          R
        >(store, storeCallbacks, owner);
        const bound = bindCallbacks<
          NativeWebhook,
          typeof webhookCallbacks,
          E,
          R
        >({ ...callbacks, store: nativeStore }, webhookCallbacks, owner);
        return yield* runRequest(
          'MCP.eventWebhook',
          { abortSignal: owner.signal },
          () => sdk.experimental_createMCPEventWebhook(bound)(request),
        );
      }),
    );

export type Experimental_MCPEvents = ReturnType<typeof wrapEvents>;
export type Experimental_ManagedMCPClient<R = never> = MCPClient<R>;
export type Experimental_ManagedMCPEvents = Extract<
  ReturnType<typeof wrapEvents>,
  { getSubscription: unknown }
>;

const managedCallbacks = [
  'subscribe',
  'getSubscription',
  'listSubscriptions',
  'unsubscribe',
] as const;

export type Experimental_MCPEventOperations<
  R = never,
  E = never,
> = WithEffectCallbacks<
  sdk.Experimental_MCPEventOperations,
  (typeof managedCallbacks)[number],
  E,
  R
>;

export interface Experimental_MCPEventAdapter<R = never, E = never> {
  readonly createAdapter: (
    context: Parameters<sdk.Experimental_MCPEventAdapter['createAdapter']>[0],
  ) => Experimental_MCPEventOperations<R, E>;
}

type NativeEvents = sdk.Experimental_MCPEventsConfig;
type NativeStoreEvents = Extract<NativeEvents, { store: object }>;

export type Experimental_MCPEventsConfig<R = never, E = never> =
  | (Omit<
      WithEffectCallbacks<NativeStoreEvents, 'validateArguments', E, R>,
      'store'
    > & {
      readonly store: Experimental_MCPEventStore<R, E>;
    })
  | {
      readonly adapter: Experimental_MCPEventAdapter<R, E>;
      readonly store?: never;
    };

const bindEvents = <R, E>(
  config: Experimental_MCPEventsConfig<R, E>,
  owner: McpOwner<R>,
): NativeEvents => {
  if (config.adapter) {
    const adapter = config.adapter;
    return {
      adapter: {
        createAdapter: (context) =>
          bindCallbacks<
            sdk.Experimental_MCPEventOperations,
            typeof managedCallbacks,
            E,
            R
          >(adapter.createAdapter(context), managedCallbacks, owner),
      },
    };
  }
  const { store, validateArguments } = config;
  return {
    store: bindCallbacks<
      sdk.Experimental_MCPEventStore,
      typeof storeCallbacks,
      E,
      R
    >(store, storeCallbacks, owner),
    ...(validateArguments && {
      validateArguments: (input) => owner.runCallback(validateArguments(input)),
    }),
  };
};
