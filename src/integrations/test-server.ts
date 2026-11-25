import {
  TestResponseController as SdkTestResponseController,
  createTestServer as sdkCreateTestServer,
} from '@ai-sdk/test-server';
import type { UrlResponse as SdkUrlResponse } from '@ai-sdk/test-server';
import { Effect } from 'effect';
import { runRequest, runSync } from '../internal/operation.js';
import { runValue } from './internal/operation.js';
import { fromReadable } from './internal/stream.js';

const controllers = new WeakMap<
  TestResponseController,
  SdkTestResponseController
>();

/** An Effect handle for a controlled HTTP response fixture. */
export class TestResponseController {
  static readonly make = runSync('TestResponseController.make', () => {
    const native = new SdkTestResponseController();
    const wrapped = new TestResponseController(native);
    controllers.set(wrapped, native);
    return wrapped;
  });

  private constructor(private readonly native: SdkTestResponseController) {}

  get stream() {
    return fromReadable(
      'TestResponseController.stream',
      runSync('TestResponseController.stream', () => this.native.stream),
    );
  }

  write(chunk: string) {
    return runRequest('TestResponseController.write', {}, () =>
      this.native.write(chunk),
    );
  }

  error(error: Error) {
    return runRequest('TestResponseController.error', {}, () =>
      this.native.error(error),
    );
  }

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

type ResponseParameter =
  | UrlResponse
  | Array<UrlResponse>
  | ((options: { callNumber: number }) => UrlResponse);

type Routes = Record<string, { response?: ResponseParameter }>;

export interface UrlHandler {
  readonly response: Effect.Effect<ResponseParameter>;
  readonly setResponse: (response: ResponseParameter) => Effect.Effect<void>;
}

export type UrlHandlers<URLS extends Routes> = {
  readonly [K in keyof URLS]: UrlHandler;
};

const toNativeResponse = (response: UrlResponse): SdkUrlResponse => {
  if (response?.type !== 'controlled-stream') return response;
  const controller = controllers.get(response.controller);
  return controller && { ...response, controller };
};

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
