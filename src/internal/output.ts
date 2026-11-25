import { Output as sdkOutput, type OutputInterface } from 'ai';
import { Effect, type Scope } from 'effect';
import type { FlexibleSchema } from '../core-schema.js';
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
  readonly name: string;
  readonly responseFormat: Effect.Effect<
    Awaited<OutputInterface['responseFormat']>,
    AiSdkError,
    Services
  >;
  readonly parseCompleteOutput: (
    ...args: Parameters<OutputInterface['parseCompleteOutput']>
  ) => Effect.Effect<Complete, AiSdkError, Services>;
  readonly parsePartialOutput: (
    ...args: Parameters<OutputInterface['parsePartialOutput']>
  ) => Effect.Effect<{ partial: Partial } | undefined, AiSdkError, Services>;
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

type Owner<R> = Effect.Success<ReturnType<typeof openOperation<R>>>;
type Binding<A, P, I, R> = (owner: Owner<R>) => OutputInterface<A, P, I>;

const outputs = new WeakMap<object, unknown>();
const nativeOutputs = new WeakMap<object, unknown>();

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

type NamedOutput = { readonly name?: string; readonly description?: string };

/** Construct the SDK's output modes without exposing the SDK parser. */
export const Output = {
  text: () => runSync('Output.text', () => wrapOutput(sdkOutput.text())),
  json: (options?: NamedOutput) =>
    runSync('Output.json', () => wrapOutput(sdkOutput.json(options))),
  choice: <Choice extends string>(
    options: NamedOutput & { readonly options: Array<Choice> },
  ) => runSync('Output.choice', () => wrapOutput(sdkOutput.choice(options))),
  object: <A, R = never>({
    schema,
    ...options
  }: NamedOutput & { readonly schema: FlexibleSchema<A, R> }) =>
    Effect.succeed(
      makeOutput('object', (owner: Owner<R>) =>
        sdkOutput.object({
          ...options,
          schema: bindLazySchema(schema, owner, 'Output.object.schema'),
        }),
      ),
    ),
  array: <A, R = never>({
    element,
    ...options
  }: NamedOutput & {
    readonly element: FlexibleSchema<A, R>;
    readonly minItems?: number;
    readonly maxItems?: number;
  }) =>
    Effect.succeed(
      makeOutput('array', (owner: Owner<R>) =>
        sdkOutput.array({
          ...options,
          element: bindLazySchema(element, owner, 'Output.array.element'),
        }),
      ),
    ),
};
