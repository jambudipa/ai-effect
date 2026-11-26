import {
  createGoogleVertexMaas as sdkCreateGoogleVertexMaas,
  googleVertexMaas as sdkGoogleVertexMaas,
} from '@ai-sdk/google-vertex/maas/edge';
import type { GoogleVertexMaasModelId } from '@ai-sdk/google-vertex/maas/edge';
import { adaptProviderFactory } from '../../../internal/provider-settings.js';
import type { EffectProviderSettings } from '../../../internal/provider-settings.js';
import type { GoogleVertexMaasProviderSettings as SdkSettings } from '@ai-sdk/google-vertex/maas/edge';
import { wrapOpenAICompatibleProvider } from '../../../internal/provider-openai-compatible.js';
import type { OpenAICompatibleProvider } from '../../../internal/provider-openai-compatible.js';

export type { GoogleVertexMaasModelId } from '@ai-sdk/google-vertex/maas/edge';

/**
 * OpenAI-compatible model selectors for the edge Vertex MaaS SDK, with native model IDs
 * preserved.
 */
export type GoogleVertexMaasProvider =
  OpenAICompatibleProvider<GoogleVertexMaasModelId>;

/**
 * Keep the native Vertex AI MaaS options and allow `headers` to resolve through Effect
 * when the SDK requests the value.
 */
export type GoogleVertexMaasProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, 'headers', E, R>;

/**
 * Construct the Vertex AI MaaS provider inside an Effect. Keep the scope open when using an
 * Effect resolver for `headers`.
 */
export const createGoogleVertexMaas = adaptProviderFactory<
  SdkSettings,
  'headers',
  GoogleVertexMaasProvider
>('createGoogleVertexMaas', ['headers'], (settings) =>
  wrapOpenAICompatibleProvider(
    'googleVertexMaas',
    sdkCreateGoogleVertexMaas(settings),
  ),
);
/**
 * Expose the same Vertex AI MaaS factory as `createGoogleVertexMaas` under the SDK alias.
 */
export const createVertexMaas = createGoogleVertexMaas;
/**
 * Adapt the preconfigured provider from the edge Vertex AI MaaS SDK. Use the factory to
 * supply explicit settings.
 */
export const googleVertexMaas: GoogleVertexMaasProvider =
  wrapOpenAICompatibleProvider('googleVertexMaas', sdkGoogleVertexMaas);
/** Expose the same Vertex AI MaaS provider as `googleVertexMaas` under the SDK alias. */
export const vertexMaas = googleVertexMaas;
