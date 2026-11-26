import type { LanguageModelV4 as SdkLanguageModel } from '@ai-sdk/provider';
import {
  WORKFLOW_DESERIALIZE,
  WORKFLOW_SERIALIZE,
} from '@ai-sdk/provider-utils';
import { Effect } from 'effect';
import { withLanguageModel } from './derived-language-model.js';
import type { LanguageModelV4 } from './language-model.js';
import { runSync, sdkError } from './operation.js';
import type { AiSdkError } from './operation.js';

interface SdkOptions {
  model: SdkLanguageModel;
}

type WrappedOptions<Options extends SdkOptions> = Omit<Options, 'model'> & {
  readonly model: LanguageModelV4;
};

interface SdkWorkflowClass<
  Options extends SdkOptions,
  Native,
  Payload extends SdkOptions,
  Input extends SdkOptions,
> {
  new (options: Options): Native;
  [WORKFLOW_SERIALIZE](model: Native): Payload;
  [WORKFLOW_DESERIALIZE](input: Input): Native;
}

export type WrappedWorkflowLanguageConstructor<
  Constructor extends SdkWorkflowClass<never, unknown, SdkOptions, never>,
  Model,
> = {
  (
    options: WrappedOptions<ConstructorParameters<Constructor>[0]>,
  ): Effect.Effect<Model, AiSdkError>;
  [WORKFLOW_SERIALIZE](
    model: Model,
  ): Effect.Effect<
    WrappedOptions<ReturnType<Constructor[typeof WORKFLOW_SERIALIZE]>>,
    AiSdkError
  >;
  [WORKFLOW_DESERIALIZE](
    input: WrappedOptions<
      Parameters<Constructor[typeof WORKFLOW_DESERIALIZE]>[0]
    >,
  ): Effect.Effect<Model, AiSdkError>;
};

export function adaptWorkflowLanguageConstructor<
  Options extends SdkOptions,
  Native,
  Payload extends SdkOptions,
  Input extends SdkOptions,
  Model extends object,
>(
  operation: string,
  ModelClass: SdkWorkflowClass<Options, Native, Payload, Input>,
  wrap: (model: Native) => Model,
  unwrap: (model: Model) => unknown,
) {
  const languageModels = new WeakMap<Model, LanguageModelV4>();

  const make = <Config extends SdkOptions>(
    step: string,
    options: WrappedOptions<Config>,
    create: (options: Config) => Native,
  ) =>
    Effect.flatMap(
      runSync(step, () => options.model),
      (language) =>
        withLanguageModel(step, language, (model) => {
          const native = create({ ...options, model } as Config);
          const wrapped = wrap(native);
          languageModels.set(wrapped, language);
          return wrapped;
        }),
    );

  return Object.assign(
    (options: WrappedOptions<Options>) =>
      make(operation, options, (config) => new ModelClass(config)),
    {
      [WORKFLOW_SERIALIZE]: (model: Model) =>
        Effect.suspend(() => {
          const step = `${operation}.workflowSerialize`;
          const language = languageModels.get(model);
          const native = unwrap(model);
          return language && native instanceof ModelClass
            ? runSync(step, () => ({
                ...ModelClass[WORKFLOW_SERIALIZE](native),
                model: language,
              }))
            : Effect.fail(sdkError(step, `Expected a registered ${operation}`));
        }),
      [WORKFLOW_DESERIALIZE]: (input: WrappedOptions<Input>) =>
        make(`${operation}.workflowDeserialize`, input, (config) =>
          ModelClass[WORKFLOW_DESERIALIZE](config),
        ),
    },
  );
}
