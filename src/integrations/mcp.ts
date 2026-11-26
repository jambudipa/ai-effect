import * as runtime from '@ai-sdk/mcp';
import type * as MCPContract from './internal/mcp-contract.js';
import type { Experimental_ManagedMCPClient as NativeManagedClient } from './internal/mcp-contract.js';
import { Cause, Deferred, Effect, Exit, type Schema, type Scope } from 'effect';
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
import { wrapTool, wrapTools } from './internal/sdk-tool.js';
import { toSdkSchema } from '../internal/schema.js';
import { registerTransport, transports } from './internal/mcp-stdio.js';
import type { StdioMCPTransport } from './mcp/mcp-stdio.js';

// Use the normalized declarations with the pinned native runtime.
/** Use the pinned MCP contract to keep runtime SDK calls private to this adapter. */
const sdk = runtime as unknown as typeof MCPContract;

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
} from './internal/mcp-contract.js';
export type { MCPTransportListeners } from './internal/mcp-stdio.js';

/** MIME type for resources that carry an MCP App view. */
export const MCP_APP_MIME_TYPE = sdk.MCP_APP_MIME_TYPE;
/** Copy the native MCP App capability descriptor so updates do not mutate the SDK's object. */
export const mcpAppClientCapabilities = structuredClone(
  sdk.mcpAppClientCapabilities,
);

/** Validate a JSON-RPC value lazily and tag any native validation failure. */
export const validateJSONRPCMessage = (message: unknown) =>
  runSync('MCP.validateJSONRPCMessage', () =>
    sdk.validateJSONRPCMessage(message),
  );

/** Validate a server request to elicit user input through the native MCP schema. */
export const ElicitationRequestSchema = {
  validate: (input: unknown) =>
    runSync('MCP.ElicitationRequestSchema.validate', () =>
      sdk.ElicitationRequestSchema.parse(input),
    ),
};

/** Validate the client's elicitation reply before it crosses the MCP boundary. */
export const ElicitResultSchema = {
  validate: (input: unknown) =>
    runSync('MCP.ElicitResultSchema.validate', () =>
      sdk.ElicitResultSchema.parse(input),
    ),
};

/** Compute the native fingerprint of an MCP App resource for later drift checks. */
export const fingerprintMCPAppResource = (
  resource: MCPContract.MCPAppResource,
) =>
  runRequest('MCP.fingerprintMCPAppResource', {}, () =>
    sdk.fingerprintMCPAppResource(resource),
  );

/** Compare the current resource fingerprint with the prior baseline using native drift semantics. */
export const detectMCPAppResourceDrift = (current: string, baseline: string) =>
  sdk.detectMCPAppResourceDrift(current, baseline);

/** Partition listed tools using the SDK's MCP App metadata rules. */
export const splitMCPAppTools = (definitions: MCPContract.ListToolsResult) =>
  runSync('MCP.splitMCPAppTools', () => sdk.splitMCPAppTools(definitions));

/** Native request options preserved alongside the combined cancellation signal. */
type RequestOptions = NonNullable<
  NonNullable<Parameters<MCPContract.MCPClient['listTools']>[0]>['options']
>;

/** Common input shape for native MCP operations with optional request settings. */
type RequestArguments = { options?: RequestOptions };

/** Forward native request settings and combine the supplied signal with Effect interruption. */
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

/** Bind a native operation whose input is required to the shared cancellable request boundary. */
const effects =
  <A extends RequestArguments, B>(
    operation: string,
    invoke: (input: A) => Promise<B>,
  ) =>
  (input: A) =>
    request(operation, invoke, input);

/** Bind a native operation that permits no input, while still supplying an interruption signal. */
const optional =
  <A extends RequestArguments, B>(
    operation: string,
    invoke: (input?: A) => Promise<B>,
  ) =>
  (input?: A) =>
    request(operation, invoke, input ?? ({} as A));

/** Preserve standard and managed event modes and adapt each available subscription operation. */
const wrapEvents = (
  events:
    | MCPContract.Experimental_MCPEvents
    | MCPContract.Experimental_ManagedMCPEvents,
) => {
  const list = optional('MCP.events.list', events.list.bind(events));
  if ('getSubscription' in events) {
    return {
      kind: 'managed' as const,
      operations: {
        list,
        subscribe: effects(
          'MCP.events.subscribe',
          events.subscribe.bind(events),
        ),
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
      },
    };
  }
  return {
    kind: 'standard' as const,
    operations: {
      list,
      subscribe: effects('MCP.events.subscribe', events.subscribe.bind(events)),
      refresh: effects('MCP.events.refresh', events.refresh.bind(events)),
      unsubscribe: effects(
        'MCP.events.unsubscribe',
        events.unsubscribe.bind(events),
      ),
    },
  };
};

/** Optional caller-provided decoder pair keyed by the native MCP tool name. */
type ToolSchemas = Readonly<
  Record<
    string,
    {
      readonly inputSchema: Schema.ConstraintDecoder<unknown>;
      readonly outputSchema?: Schema.ConstraintDecoder<unknown>;
    }
  >
>;

/** Native client kinds that share the same core operations and tool construction. */
type Client = MCPContract.MCPClient | NativeManagedClient;
/** Choose native schema discovery or supply Effect decoders for selected tools. */
type SchemaSelection = { readonly schemas?: ToolSchemas | 'automatic' };

/** Wrapped tool whose input and output types follow the selected decoders. */
type ToolDefinition<Input, Output> = ReturnType<
  typeof wrapTool<Input, Output, unknown>
>;
/** Tool obtained from an MCP server with a required call operation. */
type ExecutableTool<Input, Output> = ToolDefinition<Input, Output> & {
  readonly execute: NonNullable<ToolDefinition<Input, Output>['execute']>;
};

/** Infer result shapes from caller-supplied decoders, otherwise retain the native tool result. */
type AdaptedTools<S> = S extends ToolSchemas
  ? {
      readonly [K in keyof S]: ExecutableTool<
        S[K]['inputSchema']['Type'],
        S[K] extends {
          readonly outputSchema: Schema.ConstraintDecoder<infer A>;
        }
          ? A
          : MCPContract.CallToolResult
      >;
    }
  : Record<string, ExecutableTool<unknown, MCPContract.CallToolResult>>;

/** Convert supplied decoders at the native boundary or preserve automatic schema discovery. */
const toNativeToolSchemas = (options?: SchemaSelection) => {
  const schemas = options?.schemas;
  return schemas === 'automatic' || !schemas
    ? 'automatic'
    : Object.fromEntries(
        Object.entries(schemas).map(([name, { inputSchema, outputSchema }]) => [
          name,
          {
            inputSchema: toSdkSchema(inputSchema),
            ...(outputSchema && { outputSchema: toSdkSchema(outputSchema) }),
          },
        ]),
      );
};

/** Construct wrapped executable tools from the server's definitions or from supplied definitions. */
const mcpTools = (native: Client) => {
  function tools<S extends ToolSchemas>(options: {
    readonly schemas: S;
  }): Effect.Effect<AdaptedTools<S>, AiSdkError>;
  function tools(options?: {
    readonly schemas?: 'automatic';
  }): Effect.Effect<AdaptedTools<'automatic'>, AiSdkError>;
  function tools(
    options?: SchemaSelection,
  ): Effect.Effect<unknown, AiSdkError> {
    return runRequest('MCP.tools', {}, () =>
      native.tools({ schemas: toNativeToolSchemas(options) }),
    ).pipe(Effect.map((definitions) => wrapTools('MCP.tools', definitions)));
  }

  function toolsFromDefinitions<S extends ToolSchemas>(
    definitions: MCPContract.ListToolsResult,
    options: { readonly schemas: S },
  ): Effect.Effect<AdaptedTools<S>, AiSdkError>;
  function toolsFromDefinitions(
    definitions: MCPContract.ListToolsResult,
    options?: { readonly schemas?: 'automatic' },
  ): Effect.Effect<AdaptedTools<'automatic'>, AiSdkError>;
  function toolsFromDefinitions(
    definitions: MCPContract.ListToolsResult,
    options?: SchemaSelection,
  ): Effect.Effect<unknown, AiSdkError> {
    return runSync('MCP.toolsFromDefinitions', () =>
      wrapTools(
        'MCP.tools',
        native.toolsFromDefinitions(definitions, {
          schemas: toNativeToolSchemas(options),
        }),
      ),
    );
  }

  return { tools, toolsFromDefinitions };
};

/** Preserve MCP server metadata and expose scoped requests, elicitation, and shutdown as Effects. */
const wrapClient = <R>(
  native: MCPContract.MCPClient | NativeManagedClient,
  owner: Effect.Success<ReturnType<typeof openOperation<R>>>,
  close: Effect.Effect<void, import('../internal/operation.js').AiSdkError>,
) => ({
  serverInfo: native.serverInfo,
  initializeResult: native.initializeResult,
  instructions: native.instructions,
  experimental_events: wrapEvents(native.experimental_events),
  listTools: optional('MCP.listTools', native.listTools.bind(native)),
  ...mcpTools(native),
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
      input: MCPContract.ElicitationRequest,
    ) => Effect.Effect<MCPContract.ElicitResult, E, R>,
  ) =>
    runSync('MCP.onElicitationRequest', () =>
      native.onElicitationRequest(sdk.ElicitationRequestSchema, (input) =>
        owner.runCallback(handler(input)),
      ),
    ),
  close,
});

/** Native transport branch with HTTP session and authentication settings. */
type NativeHttpTransport = Extract<
  MCPContract.MCPClientConfig['transport'],
  { type: 'http' | 'sse' }
>;

/** MCP client settings with scoped transport, event storage, and uncaught-error callbacks. */
export type MCPClientConfig<R = never, E = never> = Omit<
  MCPContract.MCPClientConfig,
  'transport' | 'onUncaughtError' | 'experimental_events'
> & {
  readonly transport: HttpTransport<R, E> | MCPTransport<R, E>;
  readonly experimental_events?: Experimental_MCPEventsConfig<R, E>;
  readonly onUncaughtError?: (error: unknown) => Effect.Effect<void, E, R>;
};

/** Shared client operations before selecting the standard or managed event API. */
type ClientShape<R> = Omit<
  ReturnType<typeof wrapClient<R>>,
  'experimental_events'
>;

/** Standard client with scoped requests and the server-managed standard event operations. */
export type MCPClient<R = never> = ClientShape<R> & {
  readonly experimental_events: Exclude<
    Experimental_MCPEvents,
    Experimental_ManagedMCPEvents
  >;
};

/** Compatibility type for callers using the SDK's experimental client name. */
export type experimental_MCPClient<R = never> = MCPClient<R>;
/** Compatibility type for callers using the SDK's experimental client configuration name. */
export type experimental_MCPClientConfig<
  R = never,
  E = never,
> = MCPClientConfig<R, E>;

/** Require a managed event adapter to select the managed event operation result type. */
type ManagedConfig<R, E> = MCPClientConfig<R, E> & {
  readonly experimental_events: {
    readonly adapter: Experimental_MCPEventAdapter<R, E>;
  };
};

/** Standard client configuration with an optional event store and argument validator. */
type StandardConfig<R, E> = MCPClientConfig<R, E> & {
  readonly experimental_events?: Extract<
    Experimental_MCPEventsConfig<R, E>,
    { store: object }
  >;
};

/** Standard client configuration for registered stdio or WebMCP transports. */
type BuiltinTransportConfig<R, E> = Omit<StandardConfig<R, E>, 'transport'> & {
  readonly transport: StdioMCPTransport | Experimental_WebMCPTransport;
};

/** Own the MCP handshake, callbacks, and client shutdown in the caller's scope. */
export function createMCPClient<R = never, E = never>(
  config: ManagedConfig<R, E>,
): Effect.Effect<Experimental_ManagedMCPClient<R>, AiSdkError, R | Scope.Scope>;
/** Acquire a standard client with an exclusive lease on the supplied built-in transport. */
export function createMCPClient<R = never, E = never>(
  config: BuiltinTransportConfig<R, E>,
): Effect.Effect<MCPClient<R>, AiSdkError, R | Scope.Scope>;
/** Acquire a standard client whose native connection closes with the calling scope. */
export function createMCPClient<R = never, E = never>(
  config: StandardConfig<R, E>,
): Effect.Effect<MCPClient<R>, AiSdkError, R | Scope.Scope>;
/** Accept either event mode and return the corresponding scoped client handle. */
export function createMCPClient<R = never, E = never>(
  config: MCPClientConfig<R, E>,
): Effect.Effect<
  MCPClient<R> | Experimental_ManagedMCPClient<R>,
  AiSdkError,
  R | Scope.Scope
>;
export function createMCPClient<R = never, E = never>(
  config: MCPClientConfig<R, E>,
): Effect.Effect<
  MCPClient<R> | Experimental_ManagedMCPClient<R>,
  AiSdkError,
  R | Scope.Scope
> {
  // The Effect diagnostic compares the overload's R with the implementation's R.
  // @effect-diagnostics-next-line effect/missingEffectContext:off
  return Effect.gen(function* () {
    const operation = 'MCP.createMCPClient';
    const {
      transport,
      onUncaughtError,
      initializationOptions,
      experimental_events,
      ...opts
    } = config;
    const owner = yield* openOperation<R>(initializationOptions?.signal);
    const registration = transports.get(transport);
    const lease = registration && (yield* registration);
    const detach = lease?.detach ?? Effect.void;
    let nativeTransport =
      'type' in transport
        ? bindHttpTransport(transport, owner)
        : lease?.transport;
    if (
      !nativeTransport &&
      !('type' in transport) &&
      isCustomTransport(transport)
    ) {
      nativeTransport = yield* bindCustomTransport(transport, owner);
    }
    if (!nativeTransport) {
      return yield* Effect.fail(sdkError(operation, 'Invalid MCP transport'));
    }
    const close = (native: MCPContract.MCPClient | NativeManagedClient) =>
      runRequest('MCP.close', {}, () => native.close()).pipe(
        Effect.ensuring(detach),
      );
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
      ).pipe(
        Effect.onExit((exit) => (Exit.isFailure(exit) ? detach : Effect.void)),
      ),
      (native) =>
        close(native).pipe(
          Effect.catchTag('AiSdkError', (error) =>
            Effect.logWarning('MCP close failed', error),
          ),
        ),
      { interruptible: true },
    );
    const { experimental_events: events, ...client } = wrapClient(
      opened,
      owner,
      close(opened),
    );
    if (events.kind === 'managed') {
      return {
        ...client,
        experimental_events: events.operations,
      } satisfies Experimental_ManagedMCPClient<R>;
    }
    return {
      ...client,
      experimental_events: events.operations,
    } satisfies MCPClient<R>;
  });
}

/** Preserve the SDK's experimental client factory name as an alias of the scoped factory. */
export const experimental_createMCPClient = createMCPClient;

/** Construct or recognize native MCP client failures through their tagged wrapper. */
export const MCPClientError = wrapError(
  'MCP.MCPClientError',
  sdk.MCPClientError,
);
/** Tagged error kind returned by the native client boundary. */
export type MCPClientError = AiSdkError;
/** Construct or recognize an OAuth failure from native MCP authorization. */
export const MCPClientOAuthError = wrapError(
  'MCP.MCPClientOAuthError',
  sdk.MCPClientOAuthError,
);
/** Tagged error channel used when the native MCP OAuth flow fails. */
export type MCPClientOAuthError = AiSdkError;
/** Preserve the native mismatch predicate for a client that resolves a different authorization server. */
export const AuthorizationServerMismatchError = {
  ...wrapError(
    'MCP.AuthorizationServerMismatchError',
    sdk.AuthorizationServerMismatchError,
  ),
  errorCode: sdk.AuthorizationServerMismatchError.errorCode,
};
/** Tagged failure channel for a native authorization server mismatch. */
export type AuthorizationServerMismatchError = AiSdkError;
/** Construct or recognize a native unauthorized MCP failure. */
export const UnauthorizedError = wrapError(
  'MCP.UnauthorizedError',
  sdk.UnauthorizedError,
);
/** Tagged error channel used when the native server denies authorization. */
export type UnauthorizedError = AiSdkError;

/** Validate native tool definitions for a tool collection whose execution happens outside this client. */
export const createMCPTools = (definitions: unknown) =>
  runSync('MCP.createTools', () =>
    wrapTools('MCP.tools', sdk.createMCPTools(definitions)),
  );

/** Read an MCP App resource using a scoped client callback and a shared request signal. */
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

/** Native OAuth hooks adapted through the scoped callback runner. */
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

/** OAuth client contract with Effect token and authorization hooks, preserving redirect metadata. */
export type OAuthClientProvider<R = never, E = never> = WithEffectCallbacks<
  Omit<MCPContract.OAuthClientProvider, 'redirectUrl' | 'clientMetadata'>,
  (typeof oauthCallbacks)[number],
  E,
  R
> & {
  readonly redirectUrl: string | URL;
  readonly clientMetadata: MCPContract.OAuthClientMetadata;
};

/** Native session notifications whose handlers run in the client scope. */
const sessionCallbacks = ['onSessionIdChange', 'onSessionExpired'] as const;
/** HTTP transport settings with Effect authorization and session observers. */
type HttpTransport<R, E> = Omit<
  WithEffectCallbacks<
    NativeHttpTransport,
    (typeof sessionCallbacks)[number],
    E,
    R
  >,
  'authProvider'
> & {
  readonly authProvider?: OAuthClientProvider<R, E>;
};

/** Run a native void notification in the owning scope and log its tagged failure. */
const bindNotification =
  <Args extends unknown[], R, E>(
    operation: string,
    callback: (...args: Args) => Effect.Effect<void, E, R>,
    owner: McpOwner<R>,
  ) =>
  (...args: Args) => {
    void owner
      .runCallback(
        Effect.suspend(() => callback(...args)).pipe(
          Effect.catchCause((cause) =>
            Effect.logWarning(
              operation,
              sdkError(operation, Cause.squash(cause)),
            ),
          ),
        ),
      )
      .catch(() => {});
  };

/** Captures the services and cancellation signal required by native MCP callbacks. */
type McpOwner<R> = Effect.Success<ReturnType<typeof openOperation<R>>>;

/** Restore native HTTP settings and bind authorization and session callbacks to the MCP owner. */
const bindHttpTransport = <R, E>(
  input: HttpTransport<R, E>,
  owner: McpOwner<R>,
): NativeHttpTransport => {
  const { authProvider, onSessionIdChange, onSessionExpired, ...rest } = input;
  return {
    ...rest,
    ...(onSessionIdChange && {
      onSessionIdChange: bindNotification(
        'MCP.onSessionIdChange',
        onSessionIdChange,
        owner,
      ),
    }),
    ...(onSessionExpired && {
      onSessionExpired: bindNotification(
        'MCP.onSessionExpired',
        onSessionExpired,
        owner,
      ),
    }),
    ...(authProvider && {
      authProvider: bindCallbacks<
        MCPContract.OAuthClientProvider,
        typeof oauthCallbacks,
        E,
        R
      >(authProvider, oauthCallbacks, owner),
    }),
  };
};

/** Run native MCP authorization with the supplied Effect OAuth provider. */
export const auth = <R = never, E = never>(
  provider: OAuthClientProvider<R, E>,
  options: Parameters<typeof sdk.auth>[1],
) =>
  Effect.scoped(
    Effect.gen(function* () {
      const owner = yield* openOperation<R>();
      const native = bindCallbacks<
        MCPContract.OAuthClientProvider,
        typeof oauthCallbacks,
        E,
        R
      >(provider, oauthCallbacks, owner);
      return yield* runRequest('MCP.auth', { abortSignal: owner.signal }, () =>
        sdk.auth(native, options),
      );
    }),
  );

/** Model context expected by the native WebMCP transport before adapting its callbacks. */
type NativeWebContext = MCPContract.Experimental_WebMCPModelContext;
/** Native WebMCP transport retained behind the registered Effect handle. */
type NativeWebTransport = InstanceType<typeof sdk.Experimental_WebMCPTransport>;

/** Names of the native model-context functions that must be bound to Effect. */
const webCallbacks = ['getTools', 'executeTool'] as const;

/** WebMCP model context with scoped tool listing and execution hooks. */
export type Experimental_WebMCPModelContext<
  R = never,
  E = never,
> = WithEffectCallbacks<NativeWebContext, (typeof webCallbacks)[number], E, R>;

export type {
  Experimental_WebMCPTool,
  MCPTransportCloseOptions,
} from './internal/mcp-contract.js';
/** Native message-send settings with an optional Effect observer for a resumption token. */
export type MCPTransportSendOptions<R = never, E = never> = WithEffectCallbacks<
  MCPContract.MCPTransportSendOptions,
  'onresumptiontoken',
  E,
  R
>;

/** Turn a WebMCP context into a scoped MCP transport. */
export class Experimental_WebMCPTransport {
  /** Store the exclusive native transport registration and its ordered event source. */
  private readonly registered: ReturnType<typeof registerTransport>;

  /** Construct a WebMCP transport with an Effect model context and optional origin restrictions. */
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
        return new Experimental_WebMCPTransport(native);
      });
    });
  }

  /** Register native events before allowing the caller or a client to start the transport. */
  private constructor(private readonly native: NativeWebTransport) {
    this.registered = registerTransport(this, native, 'WebMCPTransport');
  }

  /** Subscribe to transport events independently of the native client's handlers. */
  get events() {
    return this.registered.events;
  }

  /** Start the transport in a scope and close it when that scope ends. */
  get start() {
    return Effect.acquireRelease(this.registered.start, () =>
      this.close.pipe(
        Effect.catchTag('AiSdkError', (error) =>
          Effect.logWarning('WebMCP transport release failed', error),
        ),
      ),
    );
  }

  /** Close the native WebMCP transport before scope exit when requested. */
  get close() {
    return runRequest('WebMCPTransport.close', {}, () => this.native.close());
  }

  /** Send a JSON-RPC message with shared cancellation and a scoped resumption-token observer. */
  send<R = never, E = never>(
    message: MCPContract.JSONRPCMessage,
    options?: MCPTransportSendOptions<R, E>,
  ) {
    return Effect.scoped(
      Effect.gen({ self: this }, function* () {
        const { onresumptiontoken, ...settings } = options ?? {};
        const owner = yield* openOperation<R>(settings.signal);
        return yield* runRequest(
          'WebMCPTransport.send',
          { abortSignal: owner.signal },
          (signal) =>
            this.native.send(message, {
              ...settings,
              signal,
              ...(onresumptiontoken && {
                onresumptiontoken: bindNotification(
                  'WebMCPTransport.onResumptionToken',
                  onresumptiontoken,
                  owner,
                ),
              }),
            }),
        );
      }),
    );
  }
}

/** Start a custom transport with client-owned delivery and closure callbacks. */
export interface MCPTransportStartOptions {
  /** Signal that aborts on client interruption or transport closure. */
  readonly signal: AbortSignal;
  /** Deliver a parsed JSON-RPC message to the active client while its signal remains live. */
  readonly onMessage: (
    message: MCPContract.JSONRPCMessage,
  ) => Effect.Effect<void, AiSdkError>;
  /** Forward a native transport error to the active client while its signal remains live. */
  readonly onError: (error: Error) => Effect.Effect<void, AiSdkError>;
  /** Notify the native client of transport closure at most once. */
  readonly onClose: Effect.Effect<void, AiSdkError>;
}

/** A caller-owned transport acquired and closed by the MCP client scope. */
export interface CustomMCPTransport<R = never, E = never> {
  /** Tell the native client whether the transport supports protocol version discovery. */
  readonly supportsProtocolVersionDiscovery?: boolean;
  /** Tell the native client whether calls must wait for protocol version discovery. */
  readonly waitsForProtocolVersionDiscovery?: boolean;
  /** Tell the native client whether the transport supports MCP tool parameter headers. */
  readonly supportsMcpToolParameterHeaders?: boolean;
  /** Initial protocol version advertised to the SDK when already known. */
  readonly protocolVersion?: string;
  /** Start the transport using the supplied client signal and delivery callbacks. */
  readonly start: (
    options: MCPTransportStartOptions,
  ) => Effect.Effect<void, E, R>;
  /** Send one JSON-RPC message using the request's optional resumption settings. */
  readonly send: (
    message: MCPContract.JSONRPCMessage,
    options?: MCPTransportSendOptions<never, AiSdkError>,
  ) => Effect.Effect<void, E, R>;
  /** Release transport resources. Cleanup can run after the request's signal aborts. */
  readonly close: (
    options?: MCPContract.MCPTransportCloseOptions,
  ) => Effect.Effect<void, E, R>;
  /** Apply a newly negotiated protocol version when the transport needs it for later messages. */
  readonly setProtocolVersion?: (version: string) => Effect.Effect<void, E, R>;
}

/** Registered built-in transport or caller-supplied Effect transport accepted by the client. */
export type MCPTransport<R = never, E = never> =
  StdioMCPTransport | Experimental_WebMCPTransport | CustomMCPTransport<R, E>;

/** Identify transports that require the custom Effect-to-native lifecycle bridge. */
const isCustomTransport = <R, E>(
  transport: MCPTransport<R, E>,
): transport is CustomMCPTransport<R, E> =>
  typeof transport.start === 'function';

/** Preserve promise rejection for the SDK while observing it if cancellation skips the SDK wait. */
const observeTransportPromise = <A>(promise: Promise<A>): Promise<A> => {
  // An already-aborted SDK request can skip awaiting the transport promise.
  void promise.catch(() => {});
  return promise;
};

/** Bind a custom transport to client cancellation and coordinate one shared close across native and scope cleanup. */
const bindCustomTransport = <R, E>(
  transport: CustomMCPTransport<R, E>,
  owner: McpOwner<R>,
) =>
  Effect.gen(function* () {
    const released = yield* Deferred.make<void, E>();
    // The SDK can close the transport after the initialization signal aborts.
    const closeInContext = Effect.runPromiseWith(yield* Effect.context<R>());
    const controller = new AbortController();
    const signal = AbortSignal.any([controller.signal, owner.signal]);
    const invoke = <A, Failure>(
      effect: Effect.Effect<A, Failure, R>,
      operationSignal = signal,
    ) => observeTransportPromise(owner.runCallback(effect, operationSignal));
    let closing = false;
    let notified = false;
    const notifyClose = () => {
      if (notified) return;
      notified = true;
      controller.abort();
      native.onclose?.();
    };
    const close = (options?: MCPContract.MCPTransportCloseOptions) =>
      Effect.uninterruptible(
        Effect.gen(function* () {
          if (!closing) {
            closing = true;
            controller.abort();
            yield* Deferred.complete(
              released,
              Effect.suspend(() =>
                options?.signal?.aborted
                  ? transport.close()
                  : transport.close(options),
              ).pipe(Effect.ensuring(Effect.sync(notifyClose))),
            );
          }
          return yield* Deferred.await(released);
        }),
      );
    const setVersion =
      transport.setProtocolVersion &&
      bindNotification(
        'MCP.transport.setProtocolVersion',
        transport.setProtocolVersion.bind(transport),
        owner,
      );
    const native: MCPContract.MCPTransport = {
      start: () =>
        invoke(
          Effect.suspend(() =>
            transport.start({
              signal,
              onMessage: (message) =>
                runSync('MCP.transport.onMessage', () => {
                  if (!signal.aborted) native.onmessage?.(message);
                }),
              onError: (error) =>
                runSync('MCP.transport.onError', () => {
                  if (!signal.aborted) native.onerror?.(error);
                }),
              onClose: runSync('MCP.transport.onClose', notifyClose),
            }),
          ),
        ),
      send: (message, options) => {
        const { onresumptiontoken, ...settings } = options ?? {};
        return invoke(
          Effect.suspend(() =>
            transport.send(
              message,
              options && {
                ...settings,
                ...(onresumptiontoken && {
                  onresumptiontoken: (token: string) =>
                    runSync('MCP.transport.onResumptionToken', () =>
                      onresumptiontoken(token),
                    ),
                }),
              },
            ),
          ),
          options?.signal ? AbortSignal.any([signal, options.signal]) : signal,
        );
      },
      close: (options) =>
        observeTransportPromise(closeInContext(close(options))),
      setProtocolVersion: (version) => {
        native.protocolVersion = version;
        setVersion?.(version);
      },
    };
    for (const flag of [
      'supportsProtocolVersionDiscovery',
      'waitsForProtocolVersionDiscovery',
      'supportsMcpToolParameterHeaders',
    ] as const) {
      const value = transport[flag];
      if (value !== undefined) native[flag] = value;
    }
    if (transport.protocolVersion !== undefined)
      native.protocolVersion = transport.protocolVersion;
    yield* Effect.addFinalizer(() =>
      close().pipe(
        Effect.catchCause((cause) =>
          Effect.logWarning(
            'MCP transport release failed',
            sdkError('MCP.transport.close', Cause.squash(cause)),
          ),
        ),
      ),
    );
    return native;
  });

/** Native webhook contract before adapting store and delivery callbacks. */
type NativeWebhook = MCPContract.Experimental_MCPEventWebhookOptions;
/** Delivery and validation hooks bound to the current webhook request's Effect context. */
const webhookCallbacks = [
  'validatePayload',
  'onEvent',
  'onGap',
  'onTerminated',
] as const;
/** Native event store operations adapted through the scoped callback runner. */
const storeCallbacks = ['get', 'getById', 'set', 'update', 'delete'] as const;

/** Event subscription persistence implemented through Effect store methods. */
export type Experimental_MCPEventStore<
  R = never,
  E = never,
> = WithEffectCallbacks<
  MCPContract.Experimental_MCPEventStore,
  (typeof storeCallbacks)[number],
  E,
  R
>;

/** Webhook options with Effect storage, event delivery, payload validation, and error handling. */
export type Experimental_MCPEventWebhookOptions<R = never, E = never> = Omit<
  WithEffectCallbacks<NativeWebhook, (typeof webhookCallbacks)[number], E, R>,
  'store' | 'onError'
> & {
  readonly store: Experimental_MCPEventStore<R, E>;
  readonly onError?: (error: unknown) => Effect.Effect<void, E, R>;
};

/** Handle a webhook request with Effect-owned store and delivery callbacks. */
export const experimental_createMCPEventWebhook =
  <R = never, E = never>(options: Experimental_MCPEventWebhookOptions<R, E>) =>
  (request: Request) =>
    Effect.scoped(
      Effect.gen(function* () {
        const owner = yield* openOperation<R>(request.signal);
        const { store, onError, ...callbacks } = options;
        let reported: readonly unknown[] = [];
        const nativeStore = bindCallbacks<
          MCPContract.Experimental_MCPEventStore,
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
        const response = yield* runRequest(
          'MCP.eventWebhook',
          { abortSignal: owner.signal },
          () =>
            sdk.experimental_createMCPEventWebhook({
              ...bound,
              ...(onError && {
                onError: (error) => {
                  reported = [...reported, error];
                },
              }),
            })(request),
        );
        if (onError) {
          yield* Effect.forEach(reported, (error) =>
            Effect.suspend(() => onError(error)).pipe(
              Effect.mapError((cause) =>
                sdkError('MCP.eventWebhook.onError', cause),
              ),
            ),
          );
        }
        return response;
      }),
    );

/** Standard or managed subscription operations selected by the MCP client mode. */
export type Experimental_MCPEvents = ReturnType<
  typeof wrapEvents
>['operations'];
/** Scoped MCP client exposing native managed subscription operations. */
export type Experimental_ManagedMCPClient<R = never> = ClientShape<R> & {
  readonly experimental_events: Experimental_ManagedMCPEvents;
};
/** Managed event API with subscription lookup and enumeration in addition to creation and removal. */
export type Experimental_ManagedMCPEvents = Extract<
  ReturnType<typeof wrapEvents>,
  { kind: 'managed' }
>['operations'];

/** Managed event operations that run through the caller's captured Effect context. */
const managedCallbacks = [
  'subscribe',
  'getSubscription',
  'listSubscriptions',
  'unsubscribe',
] as const;

/** Effect version of the SDK's managed subscription operation contract. */
export type Experimental_MCPEventOperations<
  R = never,
  E = never,
> = WithEffectCallbacks<
  MCPContract.Experimental_MCPEventOperations,
  (typeof managedCallbacks)[number],
  E,
  R
>;

/** Build a managed subscription adapter from the context supplied by the native client. */
export interface Experimental_MCPEventAdapter<R = never, E = never> {
  /** Create Effect operations from the native managed-event adapter context. */
  readonly createAdapter: (
    context: Parameters<
      MCPContract.Experimental_MCPEventAdapter['createAdapter']
    >[0],
  ) => Experimental_MCPEventOperations<R, E>;
}

/** Native event mode configuration accepted by the SDK before callback binding. */
type NativeEvents = MCPContract.Experimental_MCPEventsConfig;
/** Native event mode whose subscription persistence is provided by a store. */
type NativeStoreEvents = Extract<NativeEvents, { store: object }>;

/** Select either Effect-backed event storage or a managed event adapter. */
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

/** Adapt the selected event mode and keep managed request cancellation in its bound callbacks. */
const bindEvents = <R, E>(
  config: Experimental_MCPEventsConfig<R, E>,
  owner: McpOwner<R>,
): NativeEvents => {
  if (config.adapter) {
    const adapter = config.adapter;
    return {
      adapter: {
        createAdapter: (context) => {
          const operations = adapter.createAdapter(context);
          return {
            subscribe: (input) =>
              owner.runCallback(
                operations.subscribe(input),
                input.options?.signal,
              ),
            getSubscription: (input) =>
              owner.runCallback(
                operations.getSubscription(input),
                input.options?.signal,
              ),
            listSubscriptions: (input) =>
              owner.runCallback(
                operations.listSubscriptions(input),
                input?.options?.signal,
              ),
            unsubscribe: (input) =>
              owner.runCallback(
                operations.unsubscribe(input),
                input.options?.signal,
              ),
          };
        },
      },
    };
  }
  const { store, validateArguments } = config;
  return {
    store: bindCallbacks<
      MCPContract.Experimental_MCPEventStore,
      typeof storeCallbacks,
      E,
      R
    >(store, storeCallbacks, owner),
    ...(validateArguments && {
      validateArguments: (
        input: Parameters<
          NonNullable<NativeStoreEvents['validateArguments']>
        >[0],
      ) => owner.runCallback(validateArguments(input)),
    }),
  };
};
