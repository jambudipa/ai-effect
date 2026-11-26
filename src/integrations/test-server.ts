import {
  TestResponseController as SdkTestResponseController,
  createTestServer as sdkCreateTestServer,
} from '@ai-sdk/test-server';
import type { UrlResponse as SdkUrlResponse } from '@ai-sdk/test-server';
import { Effect } from 'effect';
import { runRequest, runSync } from '../internal/operation.js';
import { runValue } from './internal/operation.js';
import { fromReadable } from './internal/stream.js';

/** Map fixture controllers to native stream handles without extending fixture lifetimes. */
const controllers = new WeakMap<
  TestResponseController,
  SdkTestResponseController
>();

/** An Effect handle for a controlled HTTP response fixture. */
export class TestResponseController {
  /** Allocate a new controlled response stream for each execution of this Effect. */
  static readonly make = runSync('TestResponseController.make', () => {
    const native = new SdkTestResponseController();
    const wrapped = new TestResponseController(native);
    controllers.set(wrapped, native);
    return wrapped;
  });

  /** Keep the native controller private so callers write through the Effect boundary. */
  private constructor(private readonly native: SdkTestResponseController) {}

  /** Read the native fixture stream as an Effect stream. */
  get stream() {
    return fromReadable(
      'TestResponseController.stream',
      runSync('TestResponseController.stream', () => this.native.stream),
    );
  }

  /** Deliver a string chunk to the active fixture response at a test-controlled point. */
  write(chunk: string) {
    return runRequest('TestResponseController.write', {}, () =>
      this.native.write(chunk),
    );
  }

  /** Terminate the fixture response stream with the supplied error. */
  error(error: Error) {
    return runRequest('TestResponseController.error', {}, () =>
      this.native.error(error),
    );
  }

  /** Finish the fixture response stream and signal end of input to readers. */
  get close() {
    return runRequest('TestResponseController.close', {}, () =>
      this.native.close(),
    );
  }
}

/** An HTTP response, optionally controlled with a fixture stream. */
export type UrlResponse =
  | Exclude<SdkUrlResponse, { type: 'controlled-stream' }>
  | (Omit<
      Extract<SdkUrlResponse, { type: 'controlled-stream' }>,
      'controller'
    > & {
      controller: TestResponseController;
    });

/** Choose a fixed response, a response sequence, or a function that receives the call number. */
type ResponseParameter =
  | UrlResponse
  | Array<UrlResponse>
  | ((options: { callNumber: number }) => UrlResponse);

/** Initial response definitions keyed by URL. A route can receive its first response later. */
type Routes = Record<string, { response?: ResponseParameter }>;

/** Read or replace the response definition for one configured URL. */
export interface UrlHandler {
  /** Read the current wrapper response, including an Effect controller when configured. */
  readonly response: Effect.Effect<ResponseParameter>;
  /** Replace the response for later requests without replacing the route or starting a new server. */
  readonly setResponse: (response: ResponseParameter) => Effect.Effect<void>;
}

/** Preserve the fixture's URL keys for route access in type-checked tests. */
export type UrlHandlers<URLS extends Routes> = {
  readonly [K in keyof URLS]: UrlHandler;
};

/** Resolve a controlled stream handle at the SDK boundary and preserve ordinary responses. */
const toNativeResponse = (response: UrlResponse): SdkUrlResponse => {
  if (response?.type !== 'controlled-stream') return response;
  const controller = controllers.get(response.controller);
  return controller && { ...response, controller };
};

/** Convert controlled controllers in every response form, including values returned on request. */
const toNativeResponseParameter = (response: ResponseParameter) => {
  if (typeof response === 'function') {
    return (options: { callNumber: number }) =>
      toNativeResponse(response(options));
  }
  return Array.isArray(response)
    ? response.map(toNativeResponse)
    : toNativeResponse(response);
};

/** Create an HTTP fixture whose server lifetime belongs to the current scope. */
export const createTestServer = <URLS extends Routes>(routes: URLS) =>
  runSync('TestServer.createTestServer', () => {
    const initialResponses = Object.entries(routes).map(
      ([url, handler]) => [url, handler.response] as const,
    );
    // Upstream clones the routes at creation. Controllers and callback
    // functions are valid responses, yet cannot pass structuredClone.
    const native = sdkCreateTestServer(
      Object.fromEntries(initialResponses.map(([url]) => [url, {}])),
    );
    const currentResponses = Object.fromEntries(initialResponses);
    const update = (url: string, response: ResponseParameter) => {
      const handler = native.urls[url];
      if (handler) {
        handler.response = toNativeResponseParameter(response);
        currentResponses[url] = response;
      }
    };
    const restoreResponses = () => {
      for (const [url, response] of initialResponses) update(url, response);
    };
    restoreResponses();

    const start = runSync('TestServer.start', native.server.start);
    const stop = runSync('TestServer.stop', native.server.stop);
    const reset = runSync('TestServer.reset', () => {
      native.server.reset();
      restoreResponses();
    });
    const urls = Object.fromEntries(
      initialResponses.map(([url]) => [
        url,
        {
          response: Effect.sync(() => currentResponses[url]),
          setResponse: (response: ResponseParameter) =>
            Effect.sync(() => update(url, response)),
        },
      ]),
    ) as UrlHandlers<URLS>;
    const calls = Effect.sync(() =>
      native.calls.map((call) => ({
        requestBodyJson: runRequest<unknown>(
          'TestServer.requestBodyJson',
          {},
          () => call.requestBodyJson,
        ),
        requestBodyMultipart: runValue<Record<string, unknown> | null>(
          'TestServer.requestBodyMultipart',
          () => call.requestBodyMultipart,
        ),
        requestCredentials: call.requestCredentials,
        requestHeaders: call.requestHeaders,
        requestUserAgent: call.requestUserAgent,
        requestUrlSearchParams: call.requestUrlSearchParams,
        requestUrl: call.requestUrl,
        requestMethod: call.requestMethod,
      })),
    );
    return {
      urls,
      calls,
      server: {
        start: Effect.acquireRelease(start, () =>
          stop.pipe(
            Effect.tapError((error) =>
              Effect.logWarning('Test server stop failed', error),
            ),
            Effect.orDie,
          ),
        ),
        stop,
        reset,
      },
    };
  });
