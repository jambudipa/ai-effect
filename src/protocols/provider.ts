import * as sdk from '@ai-sdk/provider';
import type { JSONArray, JSONObject, JSONValue } from '@ai-sdk/provider';
import { runSync } from '../internal/operation.js';

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
} from '../internal/provider-model.js';

export const getErrorMessage = (error: unknown) =>
  runSync('provider.getErrorMessage', () => sdk.getErrorMessage(error));

export const isJSONArray = (value: unknown): value is JSONArray =>
  sdk.isJSONArray(value);
export const isJSONObject = (value: unknown): value is JSONObject =>
  sdk.isJSONObject(value);
export const isJSONValue = (value: unknown): value is JSONValue =>
  sdk.isJSONValue(value);
