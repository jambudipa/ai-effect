import type {
  Experimental_RealtimeFactoryV4 as SdkRealtimeFactory,
  Experimental_RealtimeModelV4 as SdkRealtimeModel,
  Experimental_RealtimeModelV4Transport as SdkTransport,
  Experimental_RealtimeModelV4TransportOptions as SdkTransportOptions,
} from '@ai-sdk/provider';
import { Effect } from 'effect';
import { openOperation, runRequest, runSync } from './operation.js';
import { adaptMethod } from './provider-adapter.js';
import { requestMethod } from './provider-model.js';

/** Defer the native operation and map either a thrown error or promise rejection to `AiSdkError`. */
const asyncMethod =
  <Args extends unknown[], A>(
    operation: string,
    method: (...args: Args) => A | PromiseLike<A>,
  ) =>
  (...args: Args) =>
    runRequest(operation, {}, () => Promise.resolve(method(...args)));

/** Defer a synchronous native operation and label its typed failure. */
const syncMethod =
  <Args extends unknown[], A>(
    operation: string,
    method: (...args: Args) => A,
  ) =>
  (...args: Args) =>
    runSync(operation, () => method(...args));

/** Expose a synchronous Effect operation only when the native method exists. */
const optionalSync = <Args extends unknown[], A>(
  operation: string,
  method: ((...args: Args) => A) | undefined,
) => (!method ? method : syncMethod(operation, method));

/** Expose an asynchronous Effect operation only when the native method exists. */
const optionalAsync = <Args extends unknown[], A>(
  operation: string,
  method: ((...args: Args) => A | PromiseLike<A>) | undefined,
) => (!method ? method : asyncMethod(operation, method));

/** Let native realtime lifecycle events invoke caller effects within the transport scope. */
export type RealtimeTransportOptions<E, R> = {
  readonly onEvent: (
    ...args: Parameters<SdkTransportOptions['onEvent']>
  ) => Effect.Effect<void, E, R>;
  readonly onError: (
    ...args: Parameters<SdkTransportOptions['onError']>
  ) => Effect.Effect<void, E, R>;
  readonly onFatalError: (
    error: Error,
    drain?: Effect.Effect<void, import('./operation.js').AiSdkError>,
  ) => Effect.Effect<void, E, R>;
  readonly onClose: (
    ...args: Parameters<SdkTransportOptions['onClose']>
  ) => Effect.Effect<void, E, R>;
  readonly onCapturing: (
    ...args: Parameters<SdkTransportOptions['onCapturing']>
  ) => Effect.Effect<void, E, R>;
  readonly onPlaying: (
    ...args: Parameters<SdkTransportOptions['onPlaying']>
  ) => Effect.Effect<void, E, R>;
};

/** Expose public transport operations and share idempotent disposal with the scope finalizer. */
const transportHandle = (transport: SdkTransport, dispose: () => void) => ({
  connect: (
    options: Omit<Parameters<SdkTransport['connect']>[0], 'abortSignal'> & {
      readonly abortSignal?: AbortSignal;
    },
  ) =>
    runRequest('RealtimeTransport.connect', options, (abortSignal) =>
      transport.connect({ ...options, abortSignal }),
    ),
  sendEvent: asyncMethod(
    'RealtimeTransport.sendEvent',
    transport.sendEvent.bind(transport),
  ),
  startCapture: asyncMethod(
    'RealtimeTransport.startCapture',
    transport.startCapture.bind(transport),
  ),
  stopCapture: asyncMethod(
    'RealtimeTransport.stopCapture',
    transport.stopCapture.bind(transport),
  ),
  stopPlayback: syncMethod(
    'RealtimeTransport.stopPlayback',
    transport.stopPlayback.bind(transport),
  ),
  resumePlayback: asyncMethod(
    'RealtimeTransport.resumePlayback',
    transport.resumePlayback.bind(transport),
  ),
  finish: asyncMethod(
    'RealtimeTransport.finish',
    transport.finish.bind(transport),
  ),
  close: asyncMethod(
    'RealtimeTransport.close',
    transport.close.bind(transport),
  ),
  dispose: syncMethod('RealtimeTransport.dispose', dispose),
});

/** Use the Effect handle for realtime transport actions after scoped acquisition. */
export type RealtimeTransport = ReturnType<typeof transportHandle>;

/** Acquire and dispose of a native transport once while binding its listeners to the same owner. */
const scopedTransport =
  (create: NonNullable<SdkRealtimeModel['createTransport']>) =>
  <E, R>(options: RealtimeTransportOptions<E, R>) =>
    Effect.gen(function* () {
      const owner = yield* openOperation<R>();
      const emit =
        <Args extends unknown[]>(
          listener: (...args: Args) => Effect.Effect<void, E, R>,
        ) =>
        (...args: Args) =>
          owner.runCallback(Effect.suspend(() => listener(...args)));
      const notify =
        <Args extends unknown[]>(
          listener: (...args: Args) => Effect.Effect<void, E, R>,
        ) =>
        (...args: Args) => {
          void emit(listener)(...args).catch(() => {});
        };
      const { transport, dispose } = yield* Effect.acquireRelease(
        runSync('RealtimeModelV4.createTransport', () => {
          const transport = create({
            onEvent: emit(options.onEvent),
            onError: notify(options.onError),
            onFatalError: (error, drain) => {
              const wait =
                drain && runRequest('RealtimeTransport.drain', {}, () => drain);
              notify(options.onFatalError)(error, wait);
            },
            onClose: notify(options.onClose),
            onCapturing: notify(options.onCapturing),
            onPlaying: notify(options.onPlaying),
          });
          let disposed = false;
          const dispose = () => {
            if (disposed) return;
            disposed = true;
            transport.dispose();
          };
          return { transport, dispose };
        }),
        ({ dispose }) =>
          runSync('RealtimeTransport.dispose', dispose).pipe(
            Effect.catch((error) =>
              Effect.logWarning('Realtime transport disposal failed', error),
            ),
          ),
      );
      return transportHandle(transport, dispose);
    });

/** Associate each public realtime model with the SDK instance that implements its native capabilities. */
const sdkModels = new WeakMap<object, SdkRealtimeModel>();
/** Adapt realtime model operations and register the native model behind its public handle. */
export const wrapRealtimeModel = (model: SdkRealtimeModel) => {
  const createTransport = model.createTransport?.bind(model);
  const createWebRTC = model.doCreateWebRTCSession?.bind(model);
  const createParser = model.createServerEventParser?.bind(model);
  const wrapped = {
    specificationVersion: model.specificationVersion,
    provider: model.provider,
    modelId: model.modelId,
    capabilities: model.capabilities,
    createTransport: !createTransport
      ? createTransport
      : scopedTransport(createTransport),
    getWebRTCConfig: optionalSync(
      'RealtimeModelV4.getWebRTCConfig',
      model.getWebRTCConfig?.bind(model),
    ),
    doCreateWebRTCSession: !createWebRTC
      ? createWebRTC
      : requestMethod('RealtimeModelV4.doCreateWebRTCSession', createWebRTC),
    doCreateClientSecret: optionalAsync(
      'RealtimeModelV4.doCreateClientSecret',
      model.doCreateClientSecret?.bind(model),
    ),
    getWebSocketConfig: optionalSync(
      'RealtimeModelV4.getWebSocketConfig',
      model.getWebSocketConfig?.bind(model),
    ),
    parseServerEvent: syncMethod(
      'RealtimeModelV4.parseServerEvent',
      model.parseServerEvent.bind(model),
    ),
    createServerEventParser: !createParser
      ? createParser
      : adaptMethod(
          'RealtimeModelV4.createServerEventParser',
          createParser,
          (parse) => syncMethod('RealtimeModelV4.serverEventParser', parse),
        ),
    serializeClientEvent: asyncMethod(
      'RealtimeModelV4.serializeClientEvent',
      model.serializeClientEvent.bind(model),
    ),
    buildSessionConfig: syncMethod(
      'RealtimeModelV4.buildSessionConfig',
      model.buildSessionConfig.bind(model),
    ),
    getServerWebSocketConfig: optionalAsync(
      'RealtimeModelV4.getServerWebSocketConfig',
      model.getServerWebSocketConfig?.bind(model),
    ),
    getHealthCheckResponse: optionalSync(
      'RealtimeModelV4.getHealthCheckResponse',
      model.getHealthCheckResponse?.bind(model),
    ),
  };
  sdkModels.set(wrapped, model);
  return wrapped;
};

/** Expose a provider's realtime factory as a lazy call while preserving its factory members. */
export const wrapRealtimeFactory = (name: string, sdk: SdkRealtimeFactory) =>
  Object.assign(adaptMethod(name, sdk, wrapRealtimeModel), {
    getToken: asyncMethod(`${name}.getToken`, sdk.getToken.bind(sdk)),
  });

/** Use the registered Effect model handle for a version 4 realtime session. */
export type RealtimeModelV4 = ReturnType<typeof wrapRealtimeModel>;

/** Recover the native realtime model only for previously registered handles. */
export const unwrapRealtimeModel = (model: RealtimeModelV4) =>
  sdkModels.get(model);

/** Preserve provider-specific realtime method arguments and map the result to Effect. */
type AdaptedRealtimeMethod<T> = T extends (...args: infer Args) => infer A
  ? (
      ...args: Args
    ) => Effect.Effect<Awaited<A>, import('./operation.js').AiSdkError>
  : T;

/** Retain the native parser's concrete event type while adapting its callbacks and result. */
type AdaptedEventParser<T> = T extends (...args: infer Args) => infer Parser
  ? (
      ...args: Args
    ) => Effect.Effect<
      AdaptedRealtimeMethod<Parser>,
      import('./operation.js').AiSdkError
    >
  : T;

/** Keep concrete provider signatures for the optional methods on the public realtime handle. */
type RefinedRealtimeMembers<Native extends SdkRealtimeModel> = {
  [
    Key in keyof Native as Key extends Exclude<
      keyof RealtimeModelV4,
      'provider'
    >
      ? Key
      : never
  ]: Key extends 'createTransport'
    ? RealtimeModelV4['createTransport']
    : Key extends 'createServerEventParser'
      ? AdaptedEventParser<Native[Key]>
      : AdaptedRealtimeMethod<Native[Key]>;
};

/** Realtime subclasses keep their concrete capabilities and implemented methods. */
export type TypedRealtimeModel<Native extends SdkRealtimeModel> =
  RefinedRealtimeMembers<Native> & RealtimeModelV4;

/** Register the realtime model and retain provider-specific signatures on the returned handle. */
export const wrapTypedRealtimeModel = <Native extends SdkRealtimeModel>(
  model: Native,
) => wrapRealtimeModel(model) as TypedRealtimeModel<Native>;
