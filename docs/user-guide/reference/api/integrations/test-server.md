---
title: "Integration API — test-server"
doc-type: reference
sources: [src/integrations/test-server.ts, package.json]
---

# test-server

> **TL;DR:** The `@jambudipa/ai-effect/test-server` entry provides the public declarations listed below.

## Import

`@jambudipa/ai-effect/test-server`

## `createTestServer`

Create an HTTP fixture whose server lifetime belongs to the current scope.

```text
export declare const createTestServer: <URLS extends Routes>(routes: URLS) => Effect.Effect<{
    urls: UrlHandlers<URLS>;
    calls: Effect.Effect<{
        requestBodyJson: Effect.Effect<unknown, import("../internal/operation.js").AiSdkError, never>;
        requestBodyMultipart: Effect.Effect<Record<string, unknown> | null, import("../internal/operation.js").AiSdkError, never>;
        requestCredentials: RequestCredentials;
        requestHeaders: Record<string, string>;
        requestUserAgent: string | undefined;
        requestUrlSearchParams: URLSearchParams;
        requestUrl: string;
        requestMethod: string;
    }[], never, never>;
    server: {
        start: Effect.Effect<void, import("../internal/operation.js").AiSdkError, import("effect/Scope").Scope>;
        stop: Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>;
        reset: Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>;
    };
}, import("../internal/operation.js").AiSdkError, never>;
```

## `TestResponseController`

An Effect handle for a controlled HTTP response fixture.

```text
/** An Effect handle for a controlled HTTP response fixture. */
export declare class TestResponseController {
    private constructor();
    /** Allocate a new controlled response stream for each execution of this Effect. */
    static readonly make: Effect.Effect<TestResponseController, import("../internal/operation.js").AiSdkError, never>;
    /** Read the native fixture stream as an Effect stream. */
    get stream(): import("effect/Stream").Stream<any, import("../internal/operation.js").AiSdkError, never>;
    /** Deliver a string chunk to the active fixture response at a test-controlled point. */
    write(chunk: string): Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>;
    /** Terminate the fixture response stream with the supplied error. */
    error(error: Error): Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>;
    /** Finish the fixture response stream and signal end of input to readers. */
    get close(): Effect.Effect<void, import("../internal/operation.js").AiSdkError, never>;
}
```

## `UrlHandler`

Read or replace the response definition for one configured URL.

```text
export interface UrlHandler {
    /** Read the current wrapper response, including an Effect controller when configured. */
    readonly response: Effect.Effect<ResponseParameter>;
    /** Replace the response for later requests without replacing the route or starting a new server. */
    readonly setResponse: (response: ResponseParameter) => Effect.Effect<void>;
}
```

## `UrlHandlers`

Preserve the fixture's URL keys for route access in type-checked tests.

```text
export type UrlHandlers<URLS extends Routes> = {
    readonly [K in keyof URLS]: UrlHandler;
};
```

## `UrlResponse`

An HTTP response, optionally controlled with a fixture stream.

```text
export type UrlResponse = Exclude<SdkUrlResponse, {
    type: 'controlled-stream';
}> | (Omit<Extract<SdkUrlResponse, {
    type: 'controlled-stream';
}>, 'controller'> & {
    controller: TestResponseController;
});
```
