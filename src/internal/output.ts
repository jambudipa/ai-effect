import { Output as sdkOutput, type OutputInterface } from 'ai';
import type { Effect, Schema } from 'effect';
import { runRequest, runSync, type AiSdkError } from './operation.js';
import { toSdkSchema } from './schema.js';

/** An output format with Effect operations for its parser and lazy values. */
export interface OutputSpecification<
  Complete,
  Partial = Complete,
  Element = never,
> {
  readonly name: string;
  readonly responseFormat: Effect.Effect<
    Awaited<OutputInterface['responseFormat']>,
    AiSdkError
  >;
  readonly parseCompleteOutput: (
    ...args: Parameters<OutputInterface['parseCompleteOutput']>
  ) => Effect.Effect<Complete, AiSdkError>;
  readonly parsePartialOutput: (
    ...args: Parameters<OutputInterface['parsePartialOutput']>
  ) => Effect.Effect<{ partial: Partial } | undefined, AiSdkError>;
  readonly createElementStreamTransform: () => Effect.Effect<
    ReturnType<
      OutputInterface<
        Complete,
        Partial,
        Element
      >['createElementStreamTransform']
    >,
    AiSdkError
  >;
}

const outputs = new WeakMap<object, OutputInterface>();

const wrapOutput = <Complete, Partial, Element>(
  sdk: OutputInterface<Complete, Partial, Element>,
): OutputSpecification<Complete, Partial, Element> => {
  const output: OutputSpecification<Complete, Partial, Element> = {
    name: sdk.name,
    responseFormat: runRequest(
      'Output.responseFormat',
      {},
      () => sdk.responseFormat,
    ),
    parseCompleteOutput: (...args) =>
      runRequest('Output.parseCompleteOutput', {}, () =>
        sdk.parseCompleteOutput(...args),
      ),
    parsePartialOutput: (...args) =>
      runRequest('Output.parsePartialOutput', {}, () =>
        sdk.parsePartialOutput(...args),
      ),
    createElementStreamTransform: () =>
      runSync('Output.createElementStreamTransform', () =>
        sdk.createElementStreamTransform(),
      ),
  };
  outputs.set(output, sdk);
  return output;
};

export const unwrapOutput = <Complete, Partial, Element>(
  output: OutputSpecification<Complete, Partial, Element>,
) => outputs.get(output) as OutputInterface<Complete, Partial, Element>;

type NamedOutput = { readonly name?: string; readonly description?: string };

/** Construct the SDK's output modes without exposing the SDK parser. */
export const Output = {
  text: () => runSync('Output.text', () => wrapOutput(sdkOutput.text())),
  json: (options?: NamedOutput) =>
    runSync('Output.json', () => wrapOutput(sdkOutput.json(options))),
  choice: <Choice extends string>(
    options: NamedOutput & { readonly options: Array<Choice> },
  ) => runSync('Output.choice', () => wrapOutput(sdkOutput.choice(options))),
  object: <A>(
    options: NamedOutput & { readonly schema: Schema.ConstraintDecoder<A> },
  ) =>
    runSync('Output.object', () =>
      wrapOutput(
        sdkOutput.object({ ...options, schema: toSdkSchema(options.schema) }),
      ),
    ),
  array: <A>(
    options: NamedOutput & {
      readonly element: Schema.ConstraintDecoder<A>;
      readonly minItems?: number;
      readonly maxItems?: number;
    },
  ) =>
    runSync('Output.array', () =>
      wrapOutput(
        sdkOutput.array({ ...options, element: toSdkSchema(options.element) }),
      ),
    ),
};
