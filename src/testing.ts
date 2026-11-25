import {
  MockLanguageModelV4 as SdkMockLanguageModelV4,
  simulateReadableStream as sdkSimulateReadableStream,
} from 'ai/test';
import { wrapLanguageModel } from './internal/language-model.js';
import { runSync } from './internal/operation.js';

type SdkMockOptions = NonNullable<
  ConstructorParameters<typeof SdkMockLanguageModelV4>[0]
>;

type FixtureResponse<Value> = Exclude<Value, (...args: never[]) => unknown>;

export type MockLanguageModelV4Options = {
  readonly provider?: string;
  readonly modelId?: string;
  readonly supportedUrls?: Record<string, RegExp[]>;
  readonly doGenerate?: FixtureResponse<SdkMockOptions['doGenerate']>;
  readonly doStream?: FixtureResponse<SdkMockOptions['doStream']>;
};

/** Build a fixture that exposes a wrapped model and records the SDK calls. */
export const MockLanguageModelV4 = (options?: MockLanguageModelV4Options) =>
  runSync('MockLanguageModelV4', () => {
    const mock = new SdkMockLanguageModelV4(options as SdkMockOptions);
    return {
      model: wrapLanguageModel(mock),
      get doGenerateCalls() {
        return mock.doGenerateCalls.slice();
      },
      get doStreamCalls() {
        return mock.doStreamCalls.slice();
      },
    };
  });

/** Create an HTTP-compatible stream for a test fixture. */
export const simulateReadableStream = <A>(
  options: Omit<
    Parameters<typeof sdkSimulateReadableStream<A>>[0],
    '_internal'
  >,
) =>
  runSync('simulateReadableStream', () => sdkSimulateReadableStream(options));
