---
title: "Integration API — mcp"
doc-type: reference
sources: [src/integrations/mcp.ts, package.json]
---

# mcp

> **TL;DR:** The `@jambudipa/ai-effect/mcp` entry provides the public declarations listed below.

## Import

`@jambudipa/ai-effect/mcp`

## `auth`

Run native MCP authorization with the supplied Effect OAuth provider.

```text
export declare const auth: <R = never, E = never>(provider: OAuthClientProvider<R, E>, options: Parameters<typeof sdk.auth>[1]) => Effect.Effect<"AUTHORIZED" | "REDIRECT", AiSdkError, Exclude<R, Scope.Scope>>;
```

## `AuthorizationServerMismatchError`

Preserve the native mismatch predicate for a client that resolves a different authorization server.
Tagged failure channel for a native authorization server mismatch.

```text
export declare const AuthorizationServerMismatchError: {
    errorCode: string;
    make: (args_0: {
        message: string;
        cause?: unknown;
    }) => Effect.Effect<AiSdkError, AiSdkError, never>;
    isInstance: (value: unknown) => value is AiSdkError;
};

export type AuthorizationServerMismatchError = AiSdkError;
```

## `CallToolResult`

```text
type CallToolResult = z.infer<typeof CallToolResultSchema>;
```

## `CompleteRequestParams`

```text
type CompleteRequestParams = z.infer<typeof CompleteRequestParamsSchema>;
```

## `CompleteResult`

```text
type CompleteResult = z.infer<typeof CompleteResultSchema>;
```

## `Configuration`

```text
type Configuration = z.infer<typeof ClientOrServerImplementationSchema>;
```

## `createMCPClient`

Own the MCP handshake, callbacks, and client shutdown in the caller's scope.
Acquire a standard client with an exclusive lease on the supplied built-in transport.
Acquire a standard client whose native connection closes with the calling scope.
Accept either event mode and return the corresponding scoped client handle.

```text
export declare function createMCPClient<R = never, E = never>(config: ManagedConfig<R, E>): Effect.Effect<Experimental_ManagedMCPClient<R>, AiSdkError, R | Scope.Scope>;

export declare function createMCPClient<R = never, E = never>(config: BuiltinTransportConfig<R, E>): Effect.Effect<MCPClient<R>, AiSdkError, R | Scope.Scope>;

export declare function createMCPClient<R = never, E = never>(config: StandardConfig<R, E>): Effect.Effect<MCPClient<R>, AiSdkError, R | Scope.Scope>;

export declare function createMCPClient<R = never, E = never>(config: MCPClientConfig<R, E>): Effect.Effect<MCPClient<R> | Experimental_ManagedMCPClient<R>, AiSdkError, R | Scope.Scope>;
```

## `createMCPTools`

Validate native tool definitions for a tool collection whose execution happens outside this client.

```text
export declare const createMCPTools: (definitions: unknown) => Effect.Effect<import("./internal/sdk-tool.js").WrappedTools<Record<string, import("@ai-sdk/provider-utils").DynamicTool & {
    _meta?: Record<string, unknown> | undefined;
}>>, AiSdkError, never>;
```

## `CustomMCPTransport`

A caller-owned transport acquired and closed by the MCP client scope.

```text
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
    readonly start: (options: MCPTransportStartOptions) => Effect.Effect<void, E, R>;
    /** Send one JSON-RPC message using the request's optional resumption settings. */
    readonly send: (message: MCPContract.JSONRPCMessage, options?: MCPTransportSendOptions<never, AiSdkError>) => Effect.Effect<void, E, R>;
    /** Release transport resources. Cleanup can run after the request's signal aborts. */
    readonly close: (options?: MCPContract.MCPTransportCloseOptions) => Effect.Effect<void, E, R>;
    /** Apply a newly negotiated protocol version when the transport needs it for later messages. */
    readonly setProtocolVersion?: (version: string) => Effect.Effect<void, E, R>;
}
```

## `detectMCPAppResourceDrift`

Compare the current resource fingerprint with the prior baseline using native drift semantics.

```text
export declare const detectMCPAppResourceDrift: (current: string, baseline: string) => boolean;
```

## `ElicitationRequest`

```text
type ElicitationRequest = z.infer<typeof ElicitationRequestSchema>;
```

## `ElicitationRequestSchema`

Validate a server request to elicit user input through the native MCP schema.

```text
export declare const ElicitationRequestSchema: {
    validate: (input: unknown) => Effect.Effect<{
        method: "elicitation/create";
        params: {
            [x: string]: unknown;
            message: string;
            requestedSchema: unknown;
            _meta?: {
                [x: string]: unknown;
            } | undefined;
        };
    }, AiSdkError, never>;
};
```

## `ElicitResult`

```text
type ElicitResult = z.infer<typeof ElicitResultSchema>;
```

## `ElicitResultSchema`

Validate the client's elicitation reply before it crosses the MCP boundary.

```text
export declare const ElicitResultSchema: {
    validate: (input: unknown) => Effect.Effect<{
        [x: string]: unknown;
        action: "cancel" | "accept" | "decline";
        _meta?: {
            [x: string]: unknown;
        } | undefined;
        resultType?: string | undefined;
        content?: Record<string, unknown> | undefined;
    }, AiSdkError, never>;
};
```

## `experimental_createMCPClient`

Preserve the SDK's experimental client factory name as an alias of the scoped factory.

```text
export declare const experimental_createMCPClient: typeof createMCPClient;
```

## `experimental_createMCPEventWebhook`

Handle a webhook request with Effect-owned store and delivery callbacks.

```text
export declare const experimental_createMCPEventWebhook: <R = never, E = never>(options: Experimental_MCPEventWebhookOptions<R, E>) => (request: Request) => Effect.Effect<Response, AiSdkError, Exclude<R, Scope.Scope>>;
```

## `Experimental_ListEventsResult`

This entry exports `ListEventsResult` as `Experimental_ListEventsResult`.

```text
type ListEventsResult = z.infer<typeof ListEventsResultSchema>;
```

## `Experimental_ManagedMCPClient`

Scoped MCP client exposing native managed subscription operations.

```text
export type Experimental_ManagedMCPClient<R = never> = ClientShape<R> & {
    readonly experimental_events: Experimental_ManagedMCPEvents;
};
```

## `Experimental_ManagedMCPEvents`

Managed event API with subscription lookup and enumeration in addition to creation and removal.

```text
export type Experimental_ManagedMCPEvents = Extract<ReturnType<typeof wrapEvents>, {
    kind: 'managed';
}>['operations'];
```

## `Experimental_ManagedSubscribeInput`

This entry exports `ManagedSubscribeInput` as `Experimental_ManagedSubscribeInput`.

```text
type ManagedSubscribeInput = {
    name: string;
    arguments: JSONObject;
    context?: JSONObject;
    idempotencyKey: string;
    ttlMs: number | null;
    options?: RequestOptions;
};
```

## `Experimental_ManagedSubscription`

This entry exports `ManagedSubscription` as `Experimental_ManagedSubscription`.

```text
type ManagedSubscription = {
    id: string;
    name: string;
    arguments: JSONObject;
    status: 'pending' | 'active' | 'needs_auth' | 'stopped' | 'expired' | 'failed';
    expiresAt: string | null;
    cleanupStatus?: 'pending' | 'complete' | 'exhausted';
};
```

## `experimental_MCPClient`

Compatibility type for callers using the SDK's experimental client name.

```text
export type experimental_MCPClient<R = never> = MCPClient<R>;
```

## `experimental_MCPClientCapabilities`

This entry exports `ClientCapabilities` as `experimental_MCPClientCapabilities`.

```text
type ClientCapabilities = z.infer<typeof ClientCapabilitiesSchema>;
```

## `experimental_MCPClientConfig`

Compatibility type for callers using the SDK's experimental client configuration name.

```text
export type experimental_MCPClientConfig<R = never, E = never> = MCPClientConfig<R, E>;
```

## `Experimental_MCPEvent`

This entry exports `MCPEvent` as `Experimental_MCPEvent`.

```text
type MCPEvent = z.infer<typeof MCPEventSchema>;
```

## `Experimental_MCPEventAdapter`

Build a managed subscription adapter from the context supplied by the native client.

```text
export interface Experimental_MCPEventAdapter<R = never, E = never> {
    /** Create Effect operations from the native managed-event adapter context. */
    readonly createAdapter: (context: Parameters<MCPContract.Experimental_MCPEventAdapter['createAdapter']>[0]) => Experimental_MCPEventOperations<R, E>;
}
```

## `Experimental_MCPEventControl`

This entry exports `MCPEventControl` as `Experimental_MCPEventControl`.

```text
type MCPEventControl = z.infer<typeof MCPEventControlSchema>;
```

## `Experimental_MCPEventDefinition`

This entry exports `MCPEventDefinition` as `Experimental_MCPEventDefinition`.

```text
type MCPEventDefinition = z.infer<typeof MCPEventDefinitionSchema>;
```

## `Experimental_MCPEventOperations`

Effect version of the SDK's managed subscription operation contract.

```text
export type Experimental_MCPEventOperations<R = never, E = never> = WithEffectCallbacks<MCPContract.Experimental_MCPEventOperations, (typeof managedCallbacks)[number], E, R>;
```

## `Experimental_MCPEvents`

Standard or managed subscription operations selected by the MCP client mode.

```text
export type Experimental_MCPEvents = ReturnType<typeof wrapEvents>['operations'];
```

## `Experimental_MCPEventsConfig`

Select either Effect-backed event storage or a managed event adapter.

```text
export type Experimental_MCPEventsConfig<R = never, E = never> = (Omit<WithEffectCallbacks<NativeStoreEvents, 'validateArguments', E, R>, 'store'> & {
    readonly store: Experimental_MCPEventStore<R, E>;
}) | {
    readonly adapter: Experimental_MCPEventAdapter<R, E>;
    readonly store?: never;
};
```

## `Experimental_MCPEventStore`

Event subscription persistence implemented through Effect store methods.

```text
export type Experimental_MCPEventStore<R = never, E = never> = WithEffectCallbacks<MCPContract.Experimental_MCPEventStore, (typeof storeCallbacks)[number], E, R>;
```

## `Experimental_MCPEventSubscription`

This entry exports `MCPEventSubscription` as `Experimental_MCPEventSubscription`.

```text
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
```

## `Experimental_MCPEventSubscriptionInfo`

This entry exports `MCPEventSubscriptionInfo` as `Experimental_MCPEventSubscriptionInfo`.

```text
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
```

## `Experimental_MCPEventWebhookOptions`

Webhook options with Effect storage, event delivery, payload validation, and error handling.

```text
export type Experimental_MCPEventWebhookOptions<R = never, E = never> = Omit<WithEffectCallbacks<NativeWebhook, (typeof webhookCallbacks)[number], E, R>, 'store' | 'onError'> & {
    readonly store: Experimental_MCPEventStore<R, E>;
    readonly onError?: (error: unknown) => Effect.Effect<void, E, R>;
};
```

## `Experimental_SubscribeEventOptions`

This entry exports `SubscribeEventOptions` as `Experimental_SubscribeEventOptions`.

```text
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
```

## `Experimental_SubscribeEventResult`

This entry exports `SubscribeEventResult` as `Experimental_SubscribeEventResult`.

```text
type SubscribeEventResult = z.infer<typeof SubscribeEventResultSchema>;
```

## `Experimental_WebMCPModelContext`

WebMCP model context with scoped tool listing and execution hooks.

```text
export type Experimental_WebMCPModelContext<R = never, E = never> = WithEffectCallbacks<NativeWebContext, (typeof webCallbacks)[number], E, R>;
```

## `Experimental_WebMCPTool`

This entry exports `WebMCPTool` as `Experimental_WebMCPTool`.

```text
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
```

## `Experimental_WebMCPTransport`

Turn a WebMCP context into a scoped MCP transport.

```text
/** Turn a WebMCP context into a scoped MCP transport. */
export declare class Experimental_WebMCPTransport {
    private constructor();
    /** Construct a WebMCP transport with an Effect model context and optional origin restrictions. */
    static make<R = never, E = never>(options: {
        readonly modelContext: Experimental_WebMCPModelContext<R, E>;
        readonly fromOrigins?: string[];
    }): Effect.Effect<Experimental_WebMCPTransport, AiSdkError, Scope.Scope | R>;
    /** Subscribe to transport events independently of the native client's handlers. */
    get events(): {
        subscribe: <MessageR = never, MessageE = never, CloseR = never, CloseE = never, ErrorR = never, ErrorE = never>(callbacks: import("./internal/mcp-stdio.js").MCPTransportListeners<MessageR, MessageE, CloseR, CloseE, ErrorR, ErrorE>) => Effect.Effect<void, never, Scope.Scope | MessageR | CloseR | ErrorR>;
    };
    /** Start the transport in a scope and close it when that scope ends. */
    get start(): Effect.Effect<void, AiSdkError, Scope.Scope>;
    /** Close the native WebMCP transport before scope exit when requested. */
    get close(): Effect.Effect<void, AiSdkError, never>;
    /** Send a JSON-RPC message with shared cancellation and a scoped resumption-token observer. */
    send<R = never, E = never>(message: MCPContract.JSONRPCMessage, options?: MCPTransportSendOptions<R, E>): Effect.Effect<void, AiSdkError, Exclude<R, Scope.Scope>>;
}
```

## `fingerprintMCPAppResource`

Compute the native fingerprint of an MCP App resource for later drift checks.

```text
export declare const fingerprintMCPAppResource: (resource: MCPContract.MCPAppResource) => Effect.Effect<string, AiSdkError, never>;
```

## `InitializeResult`

```text
type InitializeResult = z.infer<typeof InitializeResultSchema>;
```

## `JSONRPCError`

```text
type JSONRPCError = z.infer<typeof JSONRPCErrorSchema>;
```

## `JSONRPCMessage`

```text
type JSONRPCMessage = z.infer<typeof JSONRPCMessageSchema>;
```

## `JSONRPCNotification`

```text
type JSONRPCNotification = z.infer<typeof JSONRPCNotificationSchema>;
```

## `JSONRPCRequest`

```text
type JSONRPCRequest = z.infer<typeof JSONRPCRequestSchema>;
```

## `JSONRPCResponse`

```text
type JSONRPCResponse = z.infer<typeof JSONRPCResponseSchema>;
```

## `ListToolsResult`

```text
type ListToolsResult = z.infer<typeof ListToolsResultSchema>;
```

## `MCP_APP_MIME_TYPE`

MIME type for resources that carry an MCP App view.

```text
export declare const MCP_APP_MIME_TYPE: "text/html;profile=mcp-app";
```

## `mcpAppClientCapabilities`

Copy the native MCP App capability descriptor so updates do not mutate the SDK's object.

```text
export declare const mcpAppClientCapabilities: {
    readonly extensions: {
        readonly "io.modelcontextprotocol/ui": {
            readonly mimeTypes: readonly ["text/html;profile=mcp-app"];
        };
    };
};
```

## `MCPAppResource`

```text
type MCPAppResource = {
    uri: string;
    mimeType: typeof MCP_APP_MIME_TYPE;
    html: string;
    meta?: MCPAppResourceMeta;
};
```

## `MCPAppResourceCSP`

```text
type MCPAppResourceCSP = {
    connectDomains?: string[];
    resourceDomains?: string[];
    frameDomains?: string[];
    baseUriDomains?: string[];
    [key: string]: unknown;
};
```

## `MCPAppResourceMeta`

```text
type MCPAppResourceMeta = {
    prefersBorder?: boolean;
    csp?: MCPAppResourceCSP;
    permissions?: Record<string, unknown>;
    [key: string]: unknown;
};
```

## `MCPClient`

Standard client with scoped requests and the server-managed standard event operations.

```text
export type MCPClient<R = never> = ClientShape<R> & {
    readonly experimental_events: Exclude<Experimental_MCPEvents, Experimental_ManagedMCPEvents>;
};
```

## `MCPClientCapabilities`

This entry exports `ClientCapabilities` as `MCPClientCapabilities`.

```text
type ClientCapabilities = z.infer<typeof ClientCapabilitiesSchema>;
```

## `MCPClientConfig`

MCP client settings with scoped transport, event storage, and uncaught-error callbacks.

```text
export type MCPClientConfig<R = never, E = never> = Omit<MCPContract.MCPClientConfig, 'transport' | 'onUncaughtError' | 'experimental_events'> & {
    readonly transport: HttpTransport<R, E> | MCPTransport<R, E>;
    readonly experimental_events?: Experimental_MCPEventsConfig<R, E>;
    readonly onUncaughtError?: (error: unknown) => Effect.Effect<void, E, R>;
};
```

## `MCPClientError`

Construct or recognize native MCP client failures through their tagged wrapper.
Tagged error kind returned by the native client boundary.

```text
export declare const MCPClientError: {
    make: (args_0: {
        name?: string;
        message: string;
        cause?: unknown;
        data?: unknown;
        code?: number;
        statusCode?: number;
        url?: string;
        responseBody?: string;
    }) => Effect.Effect<AiSdkError, AiSdkError, never>;
    isInstance: (value: unknown) => value is AiSdkError;
};

export type MCPClientError = AiSdkError;
```

## `MCPClientOAuthError`

Construct or recognize an OAuth failure from native MCP authorization.
Tagged error channel used when the native MCP OAuth flow fails.

```text
export declare const MCPClientOAuthError: {
    make: (args_0: {
        name?: string;
        message: string;
        cause?: unknown;
    }) => Effect.Effect<AiSdkError, AiSdkError, never>;
    isInstance: (value: unknown) => value is AiSdkError;
};

export type MCPClientOAuthError = AiSdkError;
```

## `McpProviderMetadata`

```text
type McpProviderMetadata = {
    clientName?: string;
    title?: string;
    toolName?: string;
    annotations?: McpToolAnnotations;
    app?: JSONObject;
};
```

## `McpToolAnnotations`

```text
type McpToolAnnotations = {
    title?: string;
    readOnlyHint?: boolean;
    destructiveHint?: boolean;
    idempotentHint?: boolean;
    openWorldHint?: boolean;
};
```

## `MCPTransport`

Registered built-in transport or caller-supplied Effect transport accepted by the client.

```text
export type MCPTransport<R = never, E = never> = StdioMCPTransport | Experimental_WebMCPTransport | CustomMCPTransport<R, E>;
```

## `MCPTransportCloseOptions`

```text
type MCPTransportCloseOptions = {
    signal?: AbortSignal;
};
```

## `MCPTransportListeners`

Optional observers that receive one transport's events in delivery order.

```text
export interface MCPTransportListeners<MessageR = never, MessageE = never, CloseR = MessageR, CloseE = MessageE, ErrorR = MessageR, ErrorE = MessageE> {
    /** Consume a parsed JSON-RPC notification or response without replacing the client's handler. */
    readonly onMessage?: (message: JSONRPCMessage) => Effect.Effect<void, MessageE, MessageR>;
    /** Observe normal transport closure once per successful start. */
    readonly onClose?: () => Effect.Effect<void, CloseE, CloseR>;
    /** Observe native transport errors tagged with the operation name. */
    readonly onError?: (error: AiSdkError) => Effect.Effect<void, ErrorE, ErrorR>;
}
```

## `MCPTransportSendOptions`

Native message-send settings with an optional Effect observer for a resumption token.

```text
export type MCPTransportSendOptions<R = never, E = never> = WithEffectCallbacks<MCPContract.MCPTransportSendOptions, 'onresumptiontoken', E, R>;
```

## `MCPTransportStartOptions`

Start a custom transport with client-owned delivery and closure callbacks.

```text
export interface MCPTransportStartOptions {
    /** Signal that aborts on client interruption or transport closure. */
    readonly signal: AbortSignal;
    /** Deliver a parsed JSON-RPC message to the active client while its signal remains live. */
    readonly onMessage: (message: MCPContract.JSONRPCMessage) => Effect.Effect<void, AiSdkError>;
    /** Forward a native transport error to the active client while its signal remains live. */
    readonly onError: (error: Error) => Effect.Effect<void, AiSdkError>;
    /** Notify the native client of transport closure at most once. */
    readonly onClose: Effect.Effect<void, AiSdkError>;
}
```

## `OAuthAuthorizationServerInformation`

```text
interface OAuthAuthorizationServerInformation {
    issuer?: string;
    authorizationServerUrl: string;
    tokenEndpoint: string;
}
```

## `OAuthClientInformation`

```text
type OAuthClientInformation = z.infer<typeof OAuthClientInformationSchema>;
```

## `OAuthClientMetadata`

```text
type OAuthClientMetadata = z.infer<typeof OAuthClientMetadataSchema>;
```

## `OAuthClientProvider`

OAuth client contract with Effect token and authorization hooks, preserving redirect metadata.

```text
export type OAuthClientProvider<R = never, E = never> = WithEffectCallbacks<Omit<MCPContract.OAuthClientProvider, 'redirectUrl' | 'clientMetadata'>, (typeof oauthCallbacks)[number], E, R> & {
    readonly redirectUrl: string | URL;
    readonly clientMetadata: MCPContract.OAuthClientMetadata;
};
```

## `OAuthTokens`

```text
type OAuthTokens = z.infer<typeof OAuthTokensSchema>;
```

## `readMCPAppResource`

Read an MCP App resource using a scoped client callback and a shared request signal.

```text
export declare const readMCPAppResource: <R>(options: {
    readonly client: Pick<MCPClient<R>, "readResource">;
    readonly uri: string;
    readonly options?: RequestOptions;
}) => Effect.Effect<MCPContract.MCPAppResource, AiSdkError, Exclude<R, Scope.Scope>>;
```

## `splitMCPAppTools`

Partition listed tools using the SDK's MCP App metadata rules.

```text
export declare const splitMCPAppTools: (definitions: MCPContract.ListToolsResult) => Effect.Effect<{
    modelVisible: MCPContract.ListToolsResult;
    appVisible: MCPContract.ListToolsResult;
}, AiSdkError, never>;
```

## `UnauthorizedError`

Construct or recognize a native unauthorized MCP failure.
Tagged error channel used when the native server denies authorization.

```text
export declare const UnauthorizedError: {
    make: (message?: string | undefined) => Effect.Effect<AiSdkError, AiSdkError, never>;
    isInstance: (value: unknown) => value is AiSdkError;
};

export type UnauthorizedError = AiSdkError;
```

## `validateJSONRPCMessage`

Validate a JSON-RPC value lazily and tag any native validation failure.

```text
export declare const validateJSONRPCMessage: (message: unknown) => Effect.Effect<{
    jsonrpc: "2.0";
    id: string | number;
    method: string;
    params?: {
        [x: string]: unknown;
        _meta?: {
            [x: string]: unknown;
        } | undefined;
    } | undefined;
} | {
    jsonrpc: "2.0";
    method: string;
    params?: {
        [x: string]: unknown;
        _meta?: {
            [x: string]: unknown;
        } | undefined;
    } | undefined;
} | {
    jsonrpc: "2.0";
    id: string | number;
    result: {
        [x: string]: unknown;
        _meta?: {
            [x: string]: unknown;
        } | undefined;
        resultType?: string | undefined;
    };
} | {
    jsonrpc: "2.0";
    error: {
        code: number;
        message: string;
        data?: unknown;
    };
    id?: string | number | undefined;
}, AiSdkError, never>;
```

