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

/** Defer a native provider factory call and adapt the returned model or capability. */
export const adaptMethod =
  <Args extends unknown[], SDKResult, Result>(
    operation: string,
    method: (...args: Args) => SDKResult,
    wrap: (result: SDKResult) => Result,
  ) =>
  (...args: Args) =>
    runSync(operation, () => wrap(method(...args)));

/** Wrap a native factory only when the provider implements that optional capability. */
const adaptOptionalMethod = <Args extends unknown[], SDKResult, Result>(
  operation: string,
  method: ((...args: Args) => SDKResult) | undefined,
  wrap: (result: SDKResult) => Result,
) => (!method ? method : adaptMethod(operation, method, wrap));

/** Use the native result directly as the Effect success value. */
const identity = <A>(value: A): A => value;

/** Preserve a native unsupported-method failure on the lazy Effect error channel. */
export const adaptUnsupportedMethod = <Args extends unknown[]>(
  operation: string,
  method: (...args: Args) => never,
) => adaptMethod(operation, method, identity<never>);

/** Permit image models whose optional input support getters explicitly return `undefined`. */
type Provider = Omit<ProviderV4, 'imageModel'> & {
  imageModel(modelId: string): SdkImageModelInput;
};

/** Identify the private native provider token for wrapped provider objects. */
const providerIdentity = Symbol('provider identity');
/** Associate private provider tokens with native version 4 providers. */
const nativeProviders = new WeakMap<object, ProviderV4>();

/** Recover the registered SDK provider from its private token, when present. */
export const unwrapProvider = (value: object): ProviderV4 | undefined => {
  const token: unknown = Reflect.get(value, providerIdentity);
  if (!token || typeof token !== 'object') return;
  return nativeProviders.get(token);
};
/** Expose the registered provider's supported capabilities as lazy model and resource methods. */
export const wrapProviderBase = (name: string, sdk: Provider) => {
  const wrapped = {
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
    files: adaptOptionalMethod(
      `${name}.files`,
      sdk.files?.bind(sdk),
      wrapFiles,
    ),
    skills: adaptOptionalMethod(
      `${name}.skills`,
      sdk.skills?.bind(sdk),
      wrapSkills,
    ),
  };
  const identity = {};
  nativeProviders.set(identity, sdk as ProviderV4);
  return Object.defineProperty(wrapped, providerIdentity, {
    value: identity,
    enumerable: true,
  });
};

/** Adapt a legacy provider's speech capability to the public nested model shape. */
export const wrapLegacySpeech = (legacy: {
  speech: Parameters<typeof wrapSpeechModel>[0];
}) => ({
  speech: wrapSpeechModel(legacy.speech),
});

/** Adapt a legacy provider's transcription capability to the public nested model shape. */
export const wrapLegacyTranscription = (legacy: {
  transcription: Parameters<typeof wrapTranscriptionModel>[0];
}) => ({
  transcription: wrapTranscriptionModel(legacy.transcription),
});

/** Defer construction of a native model instance and adapt the resulting handle. */
export const adaptModelConstructor =
  <Args extends unknown[], SDKResult, Result>(
    operation: string,
    Model: new (...args: Args) => SDKResult,
    wrap: (model: SDKResult) => Result,
  ) =>
  (...args: Args) =>
    runSync(operation, () => wrap(new Model(...args)));

/** Retain native method arguments while replacing the return value with an Effect result. */
export type AdaptedMethod<
  Method extends (...args: never[]) => unknown,
  Result,
> = (...args: Parameters<Method>) => Effect.Effect<Result, AiSdkError>;

/** Retain native constructor argument types while returning a lazy model handle effect. */
export type AdaptedConstructor<
  Constructor extends abstract new (...args: never[]) => unknown,
  Model,
> = (
  ...args: ProviderHostArguments<ConstructorParameters<Constructor>>
) => Effect.Effect<Model, AiSdkError>;
