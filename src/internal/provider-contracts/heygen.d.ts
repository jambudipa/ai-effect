// Generated from @ai-sdk/heygen@3.0.27. Do not edit.
// Original license: openai.LICENSE.
// Preserve discriminator literals with the Zod 3.25.76 bridge.
/* eslint-disable effect/no-zod-use-schema -- Pinned SDK declaration types use Zod. */
import {
  Experimental_DecisionModelV4,
  Experimental_VideoModelV4,
  ProviderV4,
} from '@ai-sdk/provider';
import { FetchFunction, Resolvable } from '@ai-sdk/provider-utils';
import { z } from 'zod/v4';
declare const videoModelIds: readonly ['heygen-video-1'];
declare const decisionModelIds: readonly [
  'heygen-decision-1',
  'heygen-decision-1-turbo',
];
type HeyGenModelIds = {
  decision: (typeof decisionModelIds)[number];
  video: (typeof videoModelIds)[number];
};
type HeyGenDecisionModelId = HeyGenModelIds['decision'] | (string & {});
type HeyGenDecisionModelOptions = Record<string, never>;
type HeyGenVideoModelId = HeyGenModelIds['video'] | (string & {});
interface HeyGenProviderSettings {
  apiKey?: Resolvable<string>;
  baseURL?: string;
  headers?: Record<string, string>;
  fetch?: FetchFunction;
}
interface HeyGenProvider extends ProviderV4 {
  video(modelId: HeyGenVideoModelId): Experimental_VideoModelV4;
  videoModel(modelId: HeyGenVideoModelId): Experimental_VideoModelV4;
  decisionModel(modelId: HeyGenDecisionModelId): Experimental_DecisionModelV4;
}
export declare function createHeyGen(
  options?: HeyGenProviderSettings,
): HeyGenProvider;
export declare const heygen: HeyGenProvider;
declare const heygenVideoAssetSchema: () => z.ZodDiscriminatedUnion<
  [
    z.ZodObject<
      {
        type: z.ZodLiteral<'url'>;
        url: z.ZodURL;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'asset_id'>;
        assetId: z.ZodString;
      },
      z.core.$strip
    >,
    z.ZodObject<
      {
        type: z.ZodLiteral<'base64'>;
        mediaType: z.ZodString;
        data: z.ZodString;
      },
      z.core.$strip
    >,
  ]
> & {
  def: {
    discriminator: 'type';
  };
  _zod: {
    def: {
      discriminator: 'type';
    };
  };
};
type HeyGenVideoAsset = z.infer<ReturnType<typeof heygenVideoAssetSchema>>;
declare const heygenVideoOptions: () => z.ZodObject<
  {
    mode: z.ZodOptional<
      z.ZodEnum<{
        text_to_video: 'text_to_video';
        image_to_video: 'image_to_video';
        reference_to_video: 'reference_to_video';
      }>
    >;
    resolution: z.ZodOptional<
      z.ZodEnum<{
        '480p': '480p';
        '768p': '768p';
        '1080p': '1080p';
        '2k': '2k';
      }>
    >;
    promptEnhancement: z.ZodOptional<
      z.ZodEnum<{
        turbo: 'turbo';
        quality: 'quality';
        ultraquality: 'ultraquality';
        disabled: 'disabled';
      }>
    >;
    image: z.ZodOptional<
      z.ZodDiscriminatedUnion<
        [
          z.ZodObject<
            {
              type: z.ZodLiteral<'url'>;
              url: z.ZodURL;
            },
            z.core.$strip
          >,
          z.ZodObject<
            {
              type: z.ZodLiteral<'asset_id'>;
              assetId: z.ZodString;
            },
            z.core.$strip
          >,
          z.ZodObject<
            {
              type: z.ZodLiteral<'base64'>;
              mediaType: z.ZodString;
              data: z.ZodString;
            },
            z.core.$strip
          >,
        ]
      > & {
        def: {
          discriminator: 'type';
        };
        _zod: {
          def: {
            discriminator: 'type';
          };
        };
      }
    >;
    referenceImages: z.ZodOptional<
      z.ZodArray<
        z.ZodDiscriminatedUnion<
          [
            z.ZodObject<
              {
                type: z.ZodLiteral<'url'>;
                url: z.ZodURL;
              },
              z.core.$strip
            >,
            z.ZodObject<
              {
                type: z.ZodLiteral<'asset_id'>;
                assetId: z.ZodString;
              },
              z.core.$strip
            >,
            z.ZodObject<
              {
                type: z.ZodLiteral<'base64'>;
                mediaType: z.ZodString;
                data: z.ZodString;
              },
              z.core.$strip
            >,
          ]
        > & {
          def: {
            discriminator: 'type';
          };
          _zod: {
            def: {
              discriminator: 'type';
            };
          };
        }
      >
    >;
    referenceVideos: z.ZodOptional<
      z.ZodArray<
        z.ZodDiscriminatedUnion<
          [
            z.ZodObject<
              {
                type: z.ZodLiteral<'url'>;
                url: z.ZodURL;
              },
              z.core.$strip
            >,
            z.ZodObject<
              {
                type: z.ZodLiteral<'asset_id'>;
                assetId: z.ZodString;
              },
              z.core.$strip
            >,
            z.ZodObject<
              {
                type: z.ZodLiteral<'base64'>;
                mediaType: z.ZodString;
                data: z.ZodString;
              },
              z.core.$strip
            >,
          ]
        > & {
          def: {
            discriminator: 'type';
          };
          _zod: {
            def: {
              discriminator: 'type';
            };
          };
        }
      >
    >;
    referenceAudio: z.ZodOptional<
      z.ZodArray<
        z.ZodDiscriminatedUnion<
          [
            z.ZodObject<
              {
                type: z.ZodLiteral<'url'>;
                url: z.ZodURL;
              },
              z.core.$strip
            >,
            z.ZodObject<
              {
                type: z.ZodLiteral<'asset_id'>;
                assetId: z.ZodString;
              },
              z.core.$strip
            >,
            z.ZodObject<
              {
                type: z.ZodLiteral<'base64'>;
                mediaType: z.ZodString;
                data: z.ZodString;
              },
              z.core.$strip
            >,
          ]
        > & {
          def: {
            discriminator: 'type';
          };
          _zod: {
            def: {
              discriminator: 'type';
            };
          };
        }
      >
    >;
  },
  z.core.$strip
>;
type HeyGenVideoModelOptions = z.infer<ReturnType<typeof heygenVideoOptions>>;
export declare const VERSION: string;
export type {
  HeyGenDecisionModelId,
  HeyGenDecisionModelOptions,
  HeyGenProvider,
  HeyGenProviderSettings,
  HeyGenVideoAsset,
  HeyGenVideoModelId,
  HeyGenVideoModelOptions,
};
