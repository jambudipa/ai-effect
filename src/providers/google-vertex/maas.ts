import {
  createGoogleVertexMaas as sdkCreateGoogleVertexMaas,
  googleVertexMaas as sdkGoogleVertexMaas,
} from '@ai-sdk/google-vertex/maas';
import type { GoogleVertexMaasModelId } from '@ai-sdk/google-vertex/maas';
import { adaptProviderFactory } from '../../internal/provider-settings.js';
import type { EffectProviderSettings } from '../../internal/provider-settings.js';
import type { GoogleVertexMaasProviderSettings as SdkSettings } from '@ai-sdk/google-vertex/maas';
import { wrapOpenAICompatibleProvider } from '../../internal/provider-openai-compatible.js';
import type { OpenAICompatibleProvider } from '../../internal/provider-openai-compatible.js';

export type { GoogleVertexMaasModelId } from '@ai-sdk/google-vertex/maas';

export type GoogleVertexMaasProvider =
  OpenAICompatibleProvider<GoogleVertexMaasModelId>;

export type GoogleVertexMaasProviderSettings<
  E = never,
  R = never,
> = EffectProviderSettings<SdkSettings, 'headers', E, R>;

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
export const createVertexMaas = createGoogleVertexMaas;
export const googleVertexMaas: GoogleVertexMaasProvider =
  wrapOpenAICompatibleProvider('googleVertexMaas', sdkGoogleVertexMaas);
export const vertexMaas = googleVertexMaas;
