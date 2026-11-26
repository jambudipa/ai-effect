import {
  type DeepPartial,
  Output as sdkOutput,
  type OutputInterface,
} from 'ai';
import { Effect, type Schema as EffectSchema, type Scope } from 'effect';
import type { InferSchema } from '../core-contracts.js';
import type { FlexibleSchema, LazySchema, Schema } from '../core-schema.js';
import { bindLazySchema } from './lazy-schema.js';
import { openOperation, runSync, type AiSdkError } from './operation.js';
import { lazyValue } from './provider-model.js';

/** An output format with Effect operations for its parser and lazy values. */
export interface OutputSpecification<
  Complete,
  Partial = Complete,
  Element = never,
  Services = never,
> {
  /** Identify the output strategy by the name the SDK uses when parsing a response. */
  readonly name: string;
  /** Resolve the provider response format in the caller's Effect context. */
  readonly responseFormat: Effect.Effect<
    Awaited<OutputInterface['responseFormat']>,
    AiSdkError,
    Services
  >;
  /** Parse a completed native response and map adapter failure to `AiSdkError`. */
  readonly parseCompleteOutput: (
    ...args: Parameters<OutputInterface['parseCompleteOutput']>
  ) => Effect.Effect<Complete, AiSdkError, Services>;
  /** Parse the current response prefix and preserve the native indication that it is incomplete. */
  readonly parsePartialOutput: (
    ...args: Parameters<OutputInterface['parsePartialOutput']>
  ) => Effect.Effect<{ partial: Partial } | undefined, AiSdkError, Services>;
  /** Create the optional native transform that emits complete elements during streaming. */
  readonly createElementStreamTransform: () => Effect.Effect<
    ReturnType<
      OutputInterface<
        Complete,
        Partial,
        Element
      >['createElementStreamTransform']
    >,
    AiSdkError,
    Scope.Scope | Services
  >;
}

/** Supply context and cancellation to native output parsing callbacks. */
type Owner<R> = Effect.Success<ReturnType<typeof openOperation<R>>>;
/** Build the native parser in the scope that will consume its result. */
type Binding<A, P, I, R> = (owner: Owner<R>) => OutputInterface<A, P, I>;

/** Register the factory for an Effect output handle without exposing its native binding. */
const outputs = new WeakMap<object, unknown>();
/** Retain native output identity when a handle wraps an already configured SDK parser. */
const nativeOutputs = new WeakMap<object, unknown>();

/** Expose lazy format and parse operations and register the native output factory. */
const makeOutput = <A, P, I, R>(
  name: string,
  bind: Binding<A, P, I, R>,
): OutputSpecification<A, P, I, R> => {
  const open = (operation: string) =>
    Effect.gen(function* () {
      const owner = yield* openOperation<R>();
      return yield* runSync(operation, () => bind(owner));
    });
  const use = <Value>(
    operation: string,
    read: (output: OutputInterface<A, P, I>) => Value | PromiseLike<Value>,
  ) =>
    Effect.scoped(
      open(operation).pipe(
        Effect.flatMap((native) => lazyValue(operation, () => read(native))),
      ),
    );
  const output: OutputSpecification<A, P, I, R> = {
    name,
    responseFormat: use(
      'Output.responseFormat',
      (native) => native.responseFormat,
    ),
    parseCompleteOutput: (...args) =>
      use('Output.parseCompleteOutput', (native) =>
        native.parseCompleteOutput(...args),
      ),
    parsePartialOutput: (...args) =>
      use('Output.parsePartialOutput', (native) =>
        native.parsePartialOutput(...args),
      ),
    createElementStreamTransform: () =>
      open('Output.createElementStreamTransform').pipe(
        Effect.flatMap((native) =>
          runSync('Output.createElementStreamTransform', () =>
            native.createElementStreamTransform(),
          ),
        ),
      ),
  };
  outputs.set(output, bind);
  return output;
};

/** Remember the identity of an SDK output that appears in a callback. */
export const wrapOutput = <A, P, I>(
  native: OutputInterface<A, P, I>,
): OutputSpecification<A, P, I> => {
  const output = makeOutput<A, P, I, never>(native.name, () => native);
  nativeOutputs.set(output, native);
  return output;
};

/** Recover a previously registered native parser when the handle stores one directly. */
export const unwrapOutput = <A, P, I, R = never>(
  output: OutputSpecification<A, P, I, R>,
) => nativeOutputs.get(output) as OutputInterface<A, P, I> | undefined;

/** Bind a format and its schema callbacks to the active request. */
export const bindOutput = <A, P, I, R>(
  output: OutputSpecification<A, P, I, R>,
  owner: Owner<R>,
): OutputInterface<A, P, I> | undefined => {
  const bind = outputs.get(output) as Binding<A, P, I, R> | undefined;
  return bind?.(owner);
};

/** Give a provider optional context about the requested structured response. */
type NamedOutput = { readonly name?: string; readonly description?: string };
/** Select an object schema or an array element schema at the output boundary. */
type StructuredOutputKind = 'object' | 'array';
/** Require a supported schema input and reject `any` from structured output inference. */
type ValidatedSchema<S> = 0 extends 1 & S
  ? never
  : [S] extends [FlexibleSchema<unknown, unknown>]
    ? S
    : never;
/** Use an explicit output type when supplied or infer it from the schema. */
type OutputValue<A, S> = [A] extends [never] ? InferSchema<S> : A;
/** Infer the Effect services required to resolve or decode the supplied schema. */
type SchemaServices<S> = S extends
  | Schema<unknown, infer R>
  | EffectSchema.ConstraintDecoder<unknown, infer R>
  | LazySchema<unknown, infer R>
  ? R
  : never;
/** Require an object schema or an array element schema according to the selected output mode. */
type StructuredOptions<Kind, S> = NamedOutput &
  (Kind extends 'object'
    ? { readonly schema: S }
    : {
        readonly element: S;
        readonly minItems?: number;
        readonly maxItems?: number;
      });
/** Infer complete output, deep partial output, and streamed elements for the selected mode. */
type StructuredResult<Kind, A, R> = Effect.Effect<
  Kind extends 'object'
    ? OutputSpecification<A, DeepPartial<A>, never, R>
    : OutputSpecification<A[], A[], A, R>
>;
/** Build a structured parser with output and context types inferred from the caller's schema. */
interface StructuredOutput<Kind extends StructuredOutputKind> {
  <A = never, S = FlexibleSchema<A>>(
    options: StructuredOptions<Kind, ValidatedSchema<S>>,
  ): StructuredResult<Kind, OutputValue<A, S>, SchemaServices<S>>;
  <A, R = never>(
    options: StructuredOptions<Kind, FlexibleSchema<A, R>>,
  ): StructuredResult<Kind, A, R>;
}

/** Construct the SDK's output modes without exposing the SDK parser. */
export const Output = {
  text: () => runSync('Output.text', () => wrapOutput(sdkOutput.text())),
  json: (options?: NamedOutput) =>
    runSync('Output.json', () => wrapOutput(sdkOutput.json(options))),
  choice: <Choice extends string>(
    options: NamedOutput & { readonly options: Array<Choice> },
  ) => runSync('Output.choice', () => wrapOutput(sdkOutput.choice(options))),
  object: (<A, R = never>({
    schema,
    ...options
  }: StructuredOptions<'object', FlexibleSchema<A, R>>) =>
    Effect.succeed(
      makeOutput('object', (owner: Owner<R>) =>
        sdkOutput.object({
          ...options,
          schema: bindLazySchema(schema, owner, 'Output.object.schema'),
        }),
      ),
    )) as StructuredOutput<'object'>,
  array: (<A, R = never>({
    element,
    ...options
  }: StructuredOptions<'array', FlexibleSchema<A, R>>) =>
    Effect.succeed(
      makeOutput('array', (owner: Owner<R>) =>
        sdkOutput.array({
          ...options,
          element: bindLazySchema(element, owner, 'Output.array.element'),
        }),
      ),
    )) as StructuredOutput<'array'>,
};
