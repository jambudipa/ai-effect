import * as sdk from 'ai';
import type {
  Experimental_DecisionModelV4 as NativeDecisionModel,
  Experimental_VideoModelV3 as NativeLegacyVideo,
} from '@ai-sdk/provider';
import { Effect } from 'effect';
import type {
  Experimental_VideoModelV3,
  ProviderV2,
  ProviderV3,
  ProviderV4,
} from '../protocols/provider.js';
import { wrapLanguageModel, unwrapLanguageModel } from './language-model.js';
import { unwrapLegacyModel } from './legacy-model.js';
import { AiSdkError, runSync, sdkError } from './operation.js';
import type { Owner } from './experimental-callbacks.js';
import {
  type DecisionModelV4,
  type ExtractionModelV4,
  type VideoModelV4,
  unwrapDecisionModel,
  unwrapImageModel,
  unwrapVideoModel,
  wrapDecisionModel,
  wrapEmbeddingModel,
  wrapEvaluationModel,
  wrapExtractionModel,
  wrapImageModel,
  wrapRerankingModel,
  wrapSpeechModel,
  wrapTranscriptionModel,
  wrapVideoModel,
} from './provider-model.js';

export type LegacyProvider<R> = ProviderV2<R> | ProviderV3<R>;
type LegacyIdentity = {
  readonly specificationVersion: 'v2' | 'v3';
  readonly provider: string;
  readonly modelId: string;
};
type Selector<Model, R = never> = (
  modelId: string,
) => Effect.Effect<Model, AiSdkError, R>;

type LegacyExtensions<R> = {
  readonly videoModel?: Selector<Experimental_VideoModelV3 | VideoModelV4, R>;
  readonly decisionModel?: Selector<DecisionModelV4, R>;
  readonly evaluationModel?: Selector<DecisionModelV4, R>;
  readonly extractionModel?: Selector<ExtractionModelV4, R>;
};

export type ProviderFacade = ProviderV4 & {
  readonly videoModel?: Selector<VideoModelV4>;
  readonly decisionModel?: Selector<DecisionModelV4>;
  readonly evaluationModel?: Selector<ReturnType<typeof wrapEvaluationModel>>;
  readonly extractionModel?: Selector<ExtractionModelV4>;
};
export type ProviderMiddleware = Pick<
  Parameters<typeof sdk.wrapProvider>[0],
  'imageModelMiddleware'
> & {
  readonly languageModelMiddleware?:
    sdk.LanguageModelMiddleware | sdk.LanguageModelMiddleware[];
};

const facadeIdentity = Symbol('ai-effect/legacyProvider');
const facades = new WeakSet<object>();

export const isProviderFacade = (value: object): value is ProviderFacade => {
  const token = (value as { [facadeIdentity]?: object })[facadeIdentity];
  return Boolean(token && facades.has(token));
};

const rememberFacade = <Provider extends ProviderFacade>(
  provider: Provider,
): Provider => {
  const token = {};
  facades.add(token);
  return Object.defineProperty(provider, facadeIdentity, {
    value: token,
    enumerable: true,
  });
};

export const isLegacyProviderV3 = <R>(
  provider: LegacyProvider<R> | { readonly specificationVersion: 'v4' },
): provider is ProviderV3<R> =>
  'specificationVersion' in provider && provider.specificationVersion === 'v3';

const unavailableResource = (): undefined => {};

const resolve =
  <Model, R>(
    operation: string,
    select: Selector<Model, R>,
    owner: Owner<R>,
  ): Selector<Model> =>
  (modelId) =>
    Effect.tryPromise({
      try: (signal) =>
        owner.runCallback(
          Effect.suspend(() => select(modelId)),
          signal,
        ),
      catch: (cause) =>
        cause instanceof AiSdkError ? cause : sdkError(operation, cause),
    });

const adaptLegacy =
  <Native extends LegacyIdentity, R, Model>(
    name: string,
    select: Selector<LegacyIdentity, R>,
    owner: Owner<R>,
    adapt: (native: Native, modelId: string) => Model,
  ): Selector<Model> =>
  (modelId) =>
    resolve(
      name,
      select,
      owner,
    )(modelId).pipe(
      Effect.flatMap((model) => {
        const native = unwrapLegacyModel<Native>(model);
        return native
          ? runSync(name, () => adapt(native, modelId))
          : Effect.fail(sdkError(name, 'Expected a registered legacy model.'));
      }),
    );

type LegacyLanguage = Exclude<sdk.LanguageModel, string> & LegacyIdentity;
type LegacyEmbedding = Exclude<sdk.EmbeddingModel, string> & LegacyIdentity;
type LegacyImage = Exclude<sdk.ImageModel, string> & LegacyIdentity;
type LegacySpeech = Exclude<sdk.SpeechModel, string> & LegacyIdentity;
type LegacyTranscription = Exclude<sdk.TranscriptionModel, string> &
  LegacyIdentity;
type LegacyReranking = Exclude<sdk.RerankingModel, string> & LegacyIdentity;

const adaptExtensions = <R>(
  provider: LegacyProvider<R> & LegacyExtensions<R>,
  owner: Owner<R>,
) => {
  const video = provider.videoModel?.bind(provider);
  const decision = (provider.decisionModel ?? provider.evaluationModel)?.bind(
    provider,
  );
  const extraction = provider.extractionModel?.bind(provider);
  const selectDecision =
    decision && resolve('legacyProvider.decisionModel', decision, owner);
  return {
    ...(video
      ? {
          videoModel: (modelId: string) =>
            resolve(
              'legacyProvider.videoModel',
              video,
              owner,
            )(modelId).pipe(
              Effect.flatMap((model) => {
                const native =
                  model.specificationVersion === 'v4'
                    ? unwrapVideoModel(model)
                    : unwrapLegacyModel<NativeLegacyVideo>(model);
                return native
                  ? runSync('legacyProvider.videoModel', () =>
                      wrapVideoModel(
                        sdk
                          .customProvider({
                            videoModels: { [modelId]: native },
                          })
                          .videoModel(modelId),
                      ),
                    )
                  : Effect.fail(
                      sdkError(
                        'legacyProvider.videoModel',
                        'Expected a registered video model.',
                      ),
                    );
              }),
            ),
        }
      : {}),
    ...(selectDecision
      ? {
          decisionModel: selectDecision,
          evaluationModel: (modelId: string) =>
            selectDecision(modelId).pipe(
              Effect.flatMap((model) => {
                const native: NativeDecisionModel | undefined =
                  unwrapDecisionModel(model);
                return native
                  ? runSync('legacyProvider.evaluationModel', () =>
                      wrapEvaluationModel(
                        sdk
                          .customProvider({
                            decisionModels: { [modelId]: native },
                          })
                          .evaluationModel(modelId),
                      ),
                    )
                  : Effect.fail(
                      sdkError(
                        'legacyProvider.evaluationModel',
                        'Expected a registered decision model.',
                      ),
                    );
              }),
            ),
        }
      : {}),
    ...(extraction
      ? {
          extractionModel: resolve(
            'legacyProvider.extractionModel',
            extraction,
            owner,
          ),
        }
      : {}),
  };
};

export const wrapLegacyProvider = <R>(
  provider: LegacyProvider<R>,
  owner: Owner<R>,
  retainExtensions: boolean,
): ProviderFacade => {
  const embedding = isLegacyProviderV3(provider)
    ? provider.embeddingModel.bind(provider)
    : provider.textEmbeddingModel.bind(provider);
  const speech = provider.speechModel?.bind(provider);
  const transcription = provider.transcriptionModel?.bind(provider);
  const reranking =
    isLegacyProviderV3(provider) && provider.rerankingModel?.bind(provider);
  const wrapped = {
    specificationVersion: 'v4' as const,
    languageModel: adaptLegacy(
      'legacyProvider.languageModel',
      provider.languageModel.bind(provider),
      owner,
      (model: LegacyLanguage, id) =>
        wrapLanguageModel(
          sdk
            .customProvider({ languageModels: { [id]: model } })
            .languageModel(id),
        ),
    ),
    embeddingModel: adaptLegacy(
      'legacyProvider.embeddingModel',
      embedding,
      owner,
      (model: LegacyEmbedding, id) =>
        wrapEmbeddingModel(
          sdk
            .customProvider({ embeddingModels: { [id]: model } })
            .embeddingModel(id),
        ),
    ),
    imageModel: adaptLegacy(
      'legacyProvider.imageModel',
      provider.imageModel.bind(provider),
      owner,
      (model: LegacyImage, id) =>
        wrapImageModel(
          sdk.customProvider({ imageModels: { [id]: model } }).imageModel(id),
        ),
    ),
    speechModel:
      speech &&
      adaptLegacy(
        'legacyProvider.speechModel',
        speech,
        owner,
        (model: LegacySpeech, id) =>
          wrapSpeechModel(
            sdk
              .customProvider({ speechModels: { [id]: model } })
              .speechModel(id),
          ),
      ),
    transcriptionModel:
      transcription &&
      adaptLegacy(
        'legacyProvider.transcriptionModel',
        transcription,
        owner,
        (model: LegacyTranscription, id) =>
          wrapTranscriptionModel(
            sdk
              .customProvider({ transcriptionModels: { [id]: model } })
              .transcriptionModel(id),
          ),
      ),
    rerankingModel: reranking
      ? adaptLegacy(
          'legacyProvider.rerankingModel',
          reranking,
          owner,
          (model: LegacyReranking, id) =>
            wrapRerankingModel(
              sdk
                .customProvider({ rerankingModels: { [id]: model } })
                .rerankingModel(id),
            ),
        )
      : unavailableResource(),
    files: unavailableResource(),
    skills: unavailableResource(),
    ...(retainExtensions ? adaptExtensions(provider, owner) : {}),
  };
  return rememberFacade(wrapped);
};

export const applyProviderMiddleware = (
  provider: ProviderFacade,
  options: ProviderMiddleware,
  retainExtensions: boolean,
): ProviderFacade => {
  const { languageModelMiddleware, imageModelMiddleware } = options;
  const wrapped: ProviderFacade = {
    ...(retainExtensions ? provider : {}),
    specificationVersion: 'v4',
    languageModel: languageModelMiddleware
      ? (id) =>
          provider.languageModel(id).pipe(
            Effect.flatMap((model) => {
              const native = unwrapLanguageModel(model);
              return native
                ? runSync('legacyProvider.wrapLanguageModel', () =>
                    wrapLanguageModel(
                      sdk.wrapLanguageModel({
                        model: native,
                        middleware: languageModelMiddleware,
                      }),
                    ),
                  )
                : Effect.fail(
                    sdkError(
                      'legacyProvider.wrapLanguageModel',
                      'Expected a registered language model.',
                    ),
                  );
            }),
          )
      : provider.languageModel,
    embeddingModel: provider.embeddingModel,
    imageModel: imageModelMiddleware
      ? (id) =>
          provider.imageModel(id).pipe(
            Effect.flatMap((model) => {
              const native = unwrapImageModel(model);
              return native
                ? runSync('legacyProvider.wrapImageModel', () =>
                    wrapImageModel(
                      sdk.wrapImageModel({
                        model: native,
                        middleware: imageModelMiddleware,
                      }),
                    ),
                  )
                : Effect.fail(
                    sdkError(
                      'legacyProvider.wrapImageModel',
                      'Expected a registered image model.',
                    ),
                  );
            }),
          )
      : provider.imageModel,
    transcriptionModel: provider.transcriptionModel,
    speechModel: provider.speechModel,
    rerankingModel: provider.rerankingModel,
    files: provider.files,
    skills: provider.skills,
  };
  return rememberFacade(wrapped);
};
