import type { ProviderV4 } from '@ai-sdk/provider';
import type { Effect } from 'effect';
import type { AiSdkError } from './operation.js';
import type { ProviderHostArguments } from './provider-host-configuration.js';
import { wrapLanguageModel } from './language-model.js';
import { runSync } from './operation.js';
import {
  wrapEmbeddingModel,
  wrapImageModel,
  wrapRerankingModel,
  wrapSpeechModel,
  wrapTranscriptionModel,
} from './provider-model.js';
import type { SdkImageModelInput } from './provider-model.js';
import { wrapFiles, wrapSkills } from './provider-resource.js';

export const adaptMethod =
  <Args extends unknown[], SDKResult, Result>(
    operation: string,
    method: (...args: Args) => SDKResult,
    wrap: (result: SDKResult) => Result,
  ) =>
  (...args: Args) =>
    runSync(operation, () => wrap(method(...args)));

const adaptOptionalMethod = <Args extends unknown[], SDKResult, Result>(
  operation: string,
  method: ((...args: Args) => SDKResult) | undefined,
  wrap: (result: SDKResult) => Result,
) => (!method ? method : adaptMethod(operation, method, wrap));

const identity = <A>(value: A): A => value;

export const adaptUnsupportedMethod = <Args extends unknown[]>(
  operation: string,
  method: (...args: Args) => never,
) => adaptMethod(operation, method, identity<never>);

type Provider = Omit<ProviderV4, 'imageModel'> & {
  imageModel(modelId: string): SdkImageModelInput;
};

export const wrapProviderBase = (name: string, sdk: Provider) => ({
  specificationVersion: sdk.specificationVersion,
  languageModel: adaptMethod(
    `${name}.languageModel`,
    sdk.languageModel.bind(sdk),
    wrapLanguageModel,
  ),
  embeddingModel: adaptMethod(
    `${name}.embeddingModel`,
    sdk.embeddingModel.bind(sdk),
    wrapEmbeddingModel,
  ),
  imageModel: adaptMethod(
    `${name}.imageModel`,
    sdk.imageModel.bind(sdk),
    wrapImageModel,
  ),
  transcriptionModel: adaptOptionalMethod(
    `${name}.transcriptionModel`,
    sdk.transcriptionModel?.bind(sdk),
    wrapTranscriptionModel,
  ),
  speechModel: adaptOptionalMethod(
    `${name}.speechModel`,
    sdk.speechModel?.bind(sdk),
    wrapSpeechModel,
  ),
  rerankingModel: adaptOptionalMethod(
    `${name}.rerankingModel`,
    sdk.rerankingModel?.bind(sdk),
    wrapRerankingModel,
  ),
  files: adaptOptionalMethod(`${name}.files`, sdk.files?.bind(sdk), wrapFiles),
  skills: adaptOptionalMethod(
    `${name}.skills`,
    sdk.skills?.bind(sdk),
    wrapSkills,
  ),
});

export const wrapLegacySpeech = (legacy: {
  speech: Parameters<typeof wrapSpeechModel>[0];
}) => ({
  speech: wrapSpeechModel(legacy.speech),
});

export const wrapLegacyTranscription = (legacy: {
  transcription: Parameters<typeof wrapTranscriptionModel>[0];
}) => ({
  transcription: wrapTranscriptionModel(legacy.transcription),
});

export const adaptModelConstructor =
  <Args extends unknown[], SDKResult, Result>(
    operation: string,
    Model: new (...args: Args) => SDKResult,
    wrap: (model: SDKResult) => Result,
  ) =>
  (...args: Args) =>
    runSync(operation, () => wrap(new Model(...args)));

export type AdaptedMethod<
  Method extends (...args: never[]) => unknown,
  Result,
> = (...args: Parameters<Method>) => Effect.Effect<Result, AiSdkError>;

export type AdaptedConstructor<
  Constructor extends abstract new (...args: never[]) => unknown,
  Model,
> = (
  ...args: ProviderHostArguments<ConstructorParameters<Constructor>>
) => Effect.Effect<Model, AiSdkError>;
