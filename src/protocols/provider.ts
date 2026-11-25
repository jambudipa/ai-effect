import * as sdk from '@ai-sdk/provider';
import type { JSONArray, JSONObject, JSONValue } from '@ai-sdk/provider';
import type { LegacyModel } from '../internal/legacy-model.js';
import { runSync } from '../internal/operation.js';
import type { wrapProviderBase } from '../internal/provider-adapter.js';

export * from './provider-errors.js';
export * from '../internal/sdk-data/provider.js';

export type { LanguageModelV4 } from '../internal/language-model.js';
export type {
  DecisionModelV4 as Experimental_DecisionModelV4,
  EmbeddingModelV4,
  ExtractionModelV4 as Experimental_ExtractionModelV4,
  ImageModelV4,
  RerankingModelV4,
  SpeechModelV4,
  SpeechTranslationModelV4 as Experimental_SpeechTranslationModelV4,
  TranscriptionModelV4,
  VideoModelV4,
  VideoModelV4 as Experimental_VideoModelV4,
} from '../internal/provider-model.js';

export type EmbeddingModelV2<Value> = LegacyModel<sdk.EmbeddingModelV2<Value>>;
export type EmbeddingModelV3 = LegacyModel<sdk.EmbeddingModelV3>;
export type ImageModelV2 = LegacyModel<sdk.ImageModelV2>;
export type ImageModelV3 = LegacyModel<sdk.ImageModelV3>;
export type LanguageModelV2 = LegacyModel<sdk.LanguageModelV2>;
export type LanguageModelV3 = LegacyModel<sdk.LanguageModelV3>;
export type RerankingModelV3 = LegacyModel<sdk.RerankingModelV3>;
export type SpeechModelV2 = LegacyModel<sdk.SpeechModelV2>;
export type SpeechModelV3 = LegacyModel<sdk.SpeechModelV3>;
export type TranscriptionModelV2 = LegacyModel<sdk.TranscriptionModelV2>;
export type TranscriptionModelV3 = LegacyModel<sdk.TranscriptionModelV3>;
export type Experimental_VideoModelV3 =
  LegacyModel<sdk.Experimental_VideoModelV3>;
export type ProviderV4 = ReturnType<typeof wrapProviderBase>;

export const getErrorMessage = (error: unknown) =>
  runSync('provider.getErrorMessage', () => sdk.getErrorMessage(error));

export const isJSONArray = (value: unknown): value is JSONArray =>
  sdk.isJSONArray(value);
export const isJSONObject = (value: unknown): value is JSONObject =>
  sdk.isJSONObject(value);
export const isJSONValue = (value: unknown): value is JSONValue =>
  sdk.isJSONValue(value);
