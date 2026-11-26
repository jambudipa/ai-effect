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

/** Native sampling contract used by the durable generator to select span recording and propagation. */
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

/** Resolve the native durable generator only for registered wrapper identities. */
const generators = new WeakMap<
  OpenTelemetryIdGenerator,
  sdk.OpenTelemetryIdGenerator
>();

/** Access the durable telemetry identifier generator through Effect. */
export class OpenTelemetryIdGenerator {
  /** Construct a generator for durable telemetry and register it for integration setup. */
  static make(options?: { readonly sampler?: Sampler }) {
    return runSync('OpenTelemetryIdGenerator.make', () => {
      const native = new sdk.OpenTelemetryIdGenerator(options);
      const wrapped = new OpenTelemetryIdGenerator(native);
      generators.set(wrapped, native);
      return wrapped;
    });
  }

  /** Keep native ID generation behind the tagged Effect boundary. */
  private constructor(private readonly native: sdk.OpenTelemetryIdGenerator) {}

  /** Generate a fresh trace ID when the Effect runs. */
  get generateTraceId() {
    return runSync('OpenTelemetryIdGenerator.generateTraceId', () =>
      this.native.generateTraceId(),
    );
  }

  /** Generate a fresh span ID when the Effect runs. */
  get generateSpanId() {
    return runSync('OpenTelemetryIdGenerator.generateSpanId', () =>
      this.native.generateSpanId(),
    );
  }

  /** Apply the native generator's sampler to the supplied span context. */
  shouldSample(
    ...args: Parameters<sdk.OpenTelemetryIdGenerator['shouldSample']>
  ) {
    return runSync('OpenTelemetryIdGenerator.shouldSample', () =>
      this.native.shouldSample(...args),
    );
  }

  /** Capture the native durable telemetry context associated with the current call. */
  captureContext(
    ...args: Parameters<sdk.OpenTelemetryIdGenerator['captureContext']>
  ) {
    return runSync('OpenTelemetryIdGenerator.captureContext', () =>
      this.native.captureContext(...args),
    );
  }

  /** Start work with the supplied native trace and span IDs for the duration of the callback. */
  withIds<A>(
    ids: Parameters<sdk.OpenTelemetryIdGenerator['withIds']>[0],
    startSpan: () => A,
  ) {
    return runSync('OpenTelemetryIdGenerator.withIds', () =>
      this.native.withIds(ids, startSpan),
    );
  }

  /** Return the native identifier generator's string representation. */
  toString() {
    return this.native.toString();
  }
}

/** Configure telemetry with an optional registered durable generator and synchronous span enrichment. */
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

/** Construct a modern telemetry integration and reject an unregistered durable generator. */
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
/** Effect telemetry with all hooks supported by the modern native class available. */
export type OpenTelemetry = Required<
  Pick<ReturnType<typeof wrapTelemetry>, keyof sdk.OpenTelemetry>
>;

/** Construct the native legacy telemetry integration through the Effect boundary. */
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
/** Effect telemetry with every hook supported by the legacy class available. */
export type LegacyOpenTelemetry = Required<
  Pick<ReturnType<typeof wrapTelemetry>, keyof sdk.LegacyOpenTelemetry>
>;

/** Format input messages for native OpenTelemetry attributes. */
export const formatInputMessages = (
  ...args: Parameters<typeof sdk.formatInputMessages>
) =>
  runSync('OpenTelemetry.formatInputMessages', () =>
    sdk.formatInputMessages(...args),
  );

/** Format model messages using the SDK's trace representation. */
export const formatModelMessages = (
  ...args: Parameters<typeof sdk.formatModelMessages>
) =>
  runSync('OpenTelemetry.formatModelMessages', () =>
    sdk.formatModelMessages(...args),
  );

/** Format structured output messages for telemetry recording. */
export const formatObjectOutputMessages = (
  ...args: Parameters<typeof sdk.formatObjectOutputMessages>
) =>
  runSync('OpenTelemetry.formatObjectOutputMessages', () =>
    sdk.formatObjectOutputMessages(...args),
  );

/** Format response content using the native telemetry content representation. */
export const formatOutputContent = (
  ...args: Parameters<typeof sdk.formatOutputContent>
) =>
  runSync('OpenTelemetry.formatOutputContent', () =>
    sdk.formatOutputContent(...args),
  );

/** Format response messages for native telemetry recording. */
export const formatOutputMessages = (
  ...args: Parameters<typeof sdk.formatOutputMessages>
) =>
  runSync('OpenTelemetry.formatOutputMessages', () =>
    sdk.formatOutputMessages(...args),
  );

/** Format system instructions using the SDK's native telemetry representation. */
export const formatSystemInstructions = (
  ...args: Parameters<typeof sdk.formatSystemInstructions>
) =>
  runSync('OpenTelemetry.formatSystemInstructions', () =>
    sdk.formatSystemInstructions(...args),
  );
