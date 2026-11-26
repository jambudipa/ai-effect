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

export const MCP_APP_MIME_TYPE = sdk.MCP_APP_MIME_TYPE;
export const mcpAppClientCapabilities = structuredClone(
  sdk.mcpAppClientCapabilities,
);

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

export const fingerprintMCPAppResource = (
  resource: MCPContract.MCPAppResource,
) =>
  runRequest('MCP.fingerprintMCPAppResource', {}, () =>
    sdk.fingerprintMCPAppResource(resource),
  );

export const detectMCPAppResourceDrift = (current: string, baseline: string) =>
  sdk.detectMCPAppResourceDrift(current, baseline);

export const splitMCPAppTools = (definitions: MCPContract.ListToolsResult) =>
  runSync('MCP.splitMCPAppTools', () => sdk.splitMCPAppTools(definitions));

type RequestOptions = NonNullable<
  NonNullable<Parameters<MCPContract.MCPClient['listTools']>[0]>['options']
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

type ToolSchemas = Readonly<
  Record<
    string,
    {
      readonly inputSchema: Schema.ConstraintDecoder<unknown>;
      readonly outputSchema?: Schema.ConstraintDecoder<unknown>;
    }
  >
>;

type Client = MCPContract.MCPClient | NativeManagedClient;
type SchemaSelection = { readonly schemas?: ToolSchemas | 'automatic' };

type ToolDefinition<Input, Output> = ReturnType<
  typeof wrapTool<Input, Output, unknown>
>;
type ExecutableTool<Input, Output> = ToolDefinition<Input, Output> & {
  readonly execute: NonNullable<ToolDefinition<Input, Output>['execute']>;
};

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

type NativeHttpTransport = Extract<
  MCPContract.MCPClientConfig['transport'],
  { type: 'http' | 'sse' }
>;

export type MCPClientConfig<R = never, E = never> = Omit<
  MCPContract.MCPClientConfig,
  'transport' | 'onUncaughtError' | 'experimental_events'
> & {
  readonly transport: HttpTransport<R, E> | MCPTransport<R, E>;
  readonly experimental_events?: Experimental_MCPEventsConfig<R, E>;
  readonly onUncaughtError?: (error: unknown) => Effect.Effect<void, E, R>;
};

type ClientShape<R> = Omit<
  ReturnType<typeof wrapClient<R>>,
  'experimental_events'
>;

export type MCPClient<R = never> = ClientShape<R> & {
  readonly experimental_events: Exclude<
    Experimental_MCPEvents,
    Experimental_ManagedMCPEvents
  >;
};

export type experimental_MCPClient<R = never> = MCPClient<R>;
export type experimental_MCPClientConfig<
  R = never,
  E = never,
> = MCPClientConfig<R, E>;

type ManagedConfig<R, E> = MCPClientConfig<R, E> & {
  readonly experimental_events: {
    readonly adapter: Experimental_MCPEventAdapter<R, E>;
  };
};

type StandardConfig<R, E> = MCPClientConfig<R, E> & {
  readonly experimental_events?: Extract<
    Experimental_MCPEventsConfig<R, E>,
    { store: object }
  >;
};

type BuiltinTransportConfig<R, E> = Omit<StandardConfig<R, E>, 'transport'> & {
  readonly transport: StdioMCPTransport | Experimental_WebMCPTransport;
};

/** Own the MCP handshake, callbacks, and client shutdown in the caller's scope. */
export function createMCPClient<R = never, E = never>(
  config: ManagedConfig<R, E>,
): Effect.Effect<Experimental_ManagedMCPClient<R>, AiSdkError, R | Scope.Scope>;
export function createMCPClient<R = never, E = never>(
  config: BuiltinTransportConfig<R, E>,
): Effect.Effect<MCPClient<R>, AiSdkError, R | Scope.Scope>;
export function createMCPClient<R = never, E = never>(
  config: StandardConfig<R, E>,
): Effect.Effect<MCPClient<R>, AiSdkError, R | Scope.Scope>;
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
  Omit<MCPContract.OAuthClientProvider, 'redirectUrl' | 'clientMetadata'>,
  (typeof oauthCallbacks)[number],
  E,
  R
> & {
  readonly redirectUrl: string | URL;
  readonly clientMetadata: MCPContract.OAuthClientMetadata;
};

const sessionCallbacks = ['onSessionIdChange', 'onSessionExpired'] as const;
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

type McpOwner<R> = Effect.Success<ReturnType<typeof openOperation<R>>>;

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

type NativeWebContext = MCPContract.Experimental_WebMCPModelContext;
type NativeWebTransport = InstanceType<typeof sdk.Experimental_WebMCPTransport>;

const webCallbacks = ['getTools', 'executeTool'] as const;

export type Experimental_WebMCPModelContext<
  R = never,
  E = never,
> = WithEffectCallbacks<NativeWebContext, (typeof webCallbacks)[number], E, R>;

export type {
  Experimental_WebMCPTool,
  MCPTransportCloseOptions,
} from './internal/mcp-contract.js';
export type MCPTransportSendOptions<R = never, E = never> = WithEffectCallbacks<
  MCPContract.MCPTransportSendOptions,
  'onresumptiontoken',
  E,
  R
>;

/** Turn a WebMCP context into a scoped MCP transport. */
export class Experimental_WebMCPTransport {
  private readonly registered: ReturnType<typeof registerTransport>;

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

  private constructor(private readonly native: NativeWebTransport) {
    this.registered = registerTransport(this, native, 'WebMCPTransport');
  }

  get events() {
    return this.registered.events;
  }

  get start() {
    return Effect.acquireRelease(this.registered.start, () =>
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

export interface MCPTransportStartOptions {
  readonly signal: AbortSignal;
  readonly onMessage: (
    message: MCPContract.JSONRPCMessage,
  ) => Effect.Effect<void, AiSdkError>;
  readonly onError: (error: Error) => Effect.Effect<void, AiSdkError>;
  readonly onClose: Effect.Effect<void, AiSdkError>;
}

/** A caller-owned transport acquired and closed by the MCP client scope. */
export interface CustomMCPTransport<R = never, E = never> {
  readonly supportsProtocolVersionDiscovery?: boolean;
  readonly waitsForProtocolVersionDiscovery?: boolean;
  readonly supportsMcpToolParameterHeaders?: boolean;
  readonly protocolVersion?: string;
  readonly start: (
    options: MCPTransportStartOptions,
  ) => Effect.Effect<void, E, R>;
  readonly send: (
    message: MCPContract.JSONRPCMessage,
    options?: MCPTransportSendOptions<never, AiSdkError>,
  ) => Effect.Effect<void, E, R>;
  readonly close: (
    options?: MCPContract.MCPTransportCloseOptions,
  ) => Effect.Effect<void, E, R>;
  readonly setProtocolVersion?: (version: string) => Effect.Effect<void, E, R>;
}

export type MCPTransport<R = never, E = never> =
  StdioMCPTransport | Experimental_WebMCPTransport | CustomMCPTransport<R, E>;

const isCustomTransport = <R, E>(
  transport: MCPTransport<R, E>,
): transport is CustomMCPTransport<R, E> =>
  typeof transport.start === 'function';

const observeTransportPromise = <A>(promise: Promise<A>): Promise<A> => {
  // An already-aborted SDK request can skip awaiting the transport promise.
  void promise.catch(() => {});
  return promise;
};

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

type NativeWebhook = MCPContract.Experimental_MCPEventWebhookOptions;
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
  MCPContract.Experimental_MCPEventStore,
  (typeof storeCallbacks)[number],
  E,
  R
>;

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

export type Experimental_MCPEvents = ReturnType<
  typeof wrapEvents
>['operations'];
export type Experimental_ManagedMCPClient<R = never> = ClientShape<R> & {
  readonly experimental_events: Experimental_ManagedMCPEvents;
};
export type Experimental_ManagedMCPEvents = Extract<
  ReturnType<typeof wrapEvents>,
  { kind: 'managed' }
>['operations'];

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
  MCPContract.Experimental_MCPEventOperations,
  (typeof managedCallbacks)[number],
  E,
  R
>;

export interface Experimental_MCPEventAdapter<R = never, E = never> {
  readonly createAdapter: (
    context: Parameters<
      MCPContract.Experimental_MCPEventAdapter['createAdapter']
    >[0],
  ) => Experimental_MCPEventOperations<R, E>;
}

type NativeEvents = MCPContract.Experimental_MCPEventsConfig;
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
