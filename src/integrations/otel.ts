import * as sdk from '@ai-sdk/otel';
import type {
  Attributes,
  Context,
  Link,
  SpanKind,
  TraceState,
} from '@opentelemetry/api';
import { Effect } from 'effect';
import { runSync, sdkError } from '../internal/operation.js';
import { wrapTelemetry } from './internal/telemetry.js';

export type {
  OpenTelemetrySpanType,
  SemConvInputMessage,
  SemConvOutputMessage,
  SemConvPart,
  SemConvSystemInstruction,
} from '@ai-sdk/otel';

/** Add attributes synchronously when the OpenTelemetry host creates a span. */
export type EnrichSpan = (options: {
  spanType: sdk.OpenTelemetrySpanType;
  operationId: string;
  callId: string;
  runtimeContext: Record<string, unknown> | undefined;
}) => Attributes | undefined;

type Sampler = {
  shouldSample(
    parentContext: Context,
    traceId: string,
    spanName: string,
    spanKind: SpanKind,
    attributes: Attributes,
    links: Link[],
  ): {
    decision: 0 | 1 | 2;
    traceState?: TraceState;
    attributes?: Attributes;
  };
};

const generators = new WeakMap<
  OpenTelemetryIdGenerator,
  sdk.OpenTelemetryIdGenerator
>();

/** Access the durable telemetry identifier generator through Effect. */
export class OpenTelemetryIdGenerator {
  static make(options?: { readonly sampler?: Sampler }) {
    return runSync('OpenTelemetryIdGenerator.make', () => {
      const native = new sdk.OpenTelemetryIdGenerator(options);
      const wrapped = new OpenTelemetryIdGenerator(native);
      generators.set(wrapped, native);
      return wrapped;
    });
  }

  private constructor(private readonly native: sdk.OpenTelemetryIdGenerator) {}

  get generateTraceId() {
    return runSync('OpenTelemetryIdGenerator.generateTraceId', () =>
      this.native.generateTraceId(),
    );
  }

  get generateSpanId() {
    return runSync('OpenTelemetryIdGenerator.generateSpanId', () =>
      this.native.generateSpanId(),
    );
  }

  shouldSample(
    ...args: Parameters<sdk.OpenTelemetryIdGenerator['shouldSample']>
  ) {
    return runSync('OpenTelemetryIdGenerator.shouldSample', () =>
      this.native.shouldSample(...args),
    );
  }

  captureContext(
    ...args: Parameters<sdk.OpenTelemetryIdGenerator['captureContext']>
  ) {
    return runSync('OpenTelemetryIdGenerator.captureContext', () =>
      this.native.captureContext(...args),
    );
  }

  withIds<A>(
    ids: Parameters<sdk.OpenTelemetryIdGenerator['withIds']>[0],
    startSpan: () => A,
  ) {
    return runSync('OpenTelemetryIdGenerator.withIds', () =>
      this.native.withIds(ids, startSpan),
    );
  }

  toString() {
    return this.native.toString();
  }
}

export type OpenTelemetryOptions = Omit<
  sdk.OpenTelemetryOptions,
  'durable' | 'agentSpanName' | 'enrichSpan'
> & {
  readonly durable?: OpenTelemetryIdGenerator;
  readonly agentSpanName?:
    | 'modelId'
    | 'functionId'
    | ((options: {
        modelId: string;
        functionId: string | undefined;
      }) => string | undefined);
  readonly enrichSpan?: EnrichSpan;
};

export const OpenTelemetry = {
  make: (options: OpenTelemetryOptions = {}) =>
    Effect.gen(function* () {
      const { durable, ...rest } = options;
      const nativeDurable = durable && generators.get(durable);
      if (durable && !nativeDurable) {
        return yield* Effect.fail(
          sdkError('OpenTelemetry.make', 'Invalid telemetry ID generator'),
        );
      }
      return yield* runSync('OpenTelemetry.make', () => {
        const telemetry = wrapTelemetry(
          'OpenTelemetry',
          new sdk.OpenTelemetry({
            ...rest,
            ...(nativeDurable && { durable: nativeDurable }),
          }),
        );
        // The modern class provides all its hooks and its durable descriptor.
        return telemetry as OpenTelemetry;
      });
    }),
};
export type OpenTelemetry = Required<
  Pick<ReturnType<typeof wrapTelemetry>, keyof sdk.OpenTelemetry>
>;

export const LegacyOpenTelemetry = {
  make: (options?: ConstructorParameters<typeof sdk.LegacyOpenTelemetry>[0]) =>
    runSync('LegacyOpenTelemetry.make', () => {
      const telemetry = wrapTelemetry(
        'LegacyOpenTelemetry',
        new sdk.LegacyOpenTelemetry(options),
      );
      // The legacy class provides every hook in its declared interface.
      return telemetry as LegacyOpenTelemetry;
    }),
};
export type LegacyOpenTelemetry = Required<
  Pick<ReturnType<typeof wrapTelemetry>, keyof sdk.LegacyOpenTelemetry>
>;

export const formatInputMessages = (
  ...args: Parameters<typeof sdk.formatInputMessages>
) =>
  runSync('OpenTelemetry.formatInputMessages', () =>
    sdk.formatInputMessages(...args),
  );

export const formatModelMessages = (
  ...args: Parameters<typeof sdk.formatModelMessages>
) =>
  runSync('OpenTelemetry.formatModelMessages', () =>
    sdk.formatModelMessages(...args),
  );

export const formatObjectOutputMessages = (
  ...args: Parameters<typeof sdk.formatObjectOutputMessages>
) =>
  runSync('OpenTelemetry.formatObjectOutputMessages', () =>
    sdk.formatObjectOutputMessages(...args),
  );

export const formatOutputContent = (
  ...args: Parameters<typeof sdk.formatOutputContent>
) =>
  runSync('OpenTelemetry.formatOutputContent', () =>
    sdk.formatOutputContent(...args),
  );

export const formatOutputMessages = (
  ...args: Parameters<typeof sdk.formatOutputMessages>
) =>
  runSync('OpenTelemetry.formatOutputMessages', () =>
    sdk.formatOutputMessages(...args),
  );

export const formatSystemInstructions = (
  ...args: Parameters<typeof sdk.formatSystemInstructions>
) =>
  runSync('OpenTelemetry.formatSystemInstructions', () =>
    sdk.formatSystemInstructions(...args),
  );
