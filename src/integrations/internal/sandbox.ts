import type {
  HarnessV1NetworkSandboxSession as NativeNetworkSandbox,
  HarnessV1SandboxProvider as NativeProvider,
  HarnessV1SandboxTemplate as NativeTemplate,
} from './harness-contracts/harness.js';
import { Effect } from 'effect';
import {
  openOperation,
  runRequest,
  runSync,
} from '../../internal/operation.js';
import {
  registerSandbox,
  scopedResource,
  type SandboxSession,
  type WithAbort,
  wrapSandbox,
} from './sandbox-base.js';

export {
  invoke,
  type Process,
  type SandboxSession,
  scopedResource,
  unwrapProcess,
  unwrapSandbox,
  wrapSandbox,
} from './sandbox-base.js';

/** Add native network capabilities to the basic session and register the combined handle. */
export const wrapNetworkSandbox = (native: NativeNetworkSandbox) => {
  const getPortEndpoint = (
    options: Parameters<NativeNetworkSandbox['getPortEndpoint']>[0],
  ) =>
    runRequest('Sandbox.getPortEndpoint', {}, () =>
      native.getPortEndpoint(options),
    );

  const getPortUrl = (
    options: Parameters<NativeNetworkSandbox['getPortUrl']>[0],
  ) => runRequest('Sandbox.getPortUrl', {}, () => native.getPortUrl(options));

  const wrapOptional = <A>(
    name: string,
    method: ((input: A) => PromiseLike<void>) | undefined,
  ) =>
    method &&
    ((input: A) => runRequest(name, {}, () => method.call(native, input)));

  const setPorts = native.setPorts?.bind(native);

  const sandbox = {
    ...wrapSandbox(native),
    id: native.id,
    defaultWorkingDirectory: native.defaultWorkingDirectory,
    ports: native.ports,
    getPortEndpoint,
    getPortUrl,
    stop: runRequest('Sandbox.stop', {}, () => native.stop()),
    destroy: runRequest('Sandbox.destroy', {}, () => native.destroy()),
    setNetworkPolicy: wrapOptional(
      'Sandbox.setNetworkPolicy',
      native.setNetworkPolicy,
    ),
    setRequestTransformations: wrapOptional(
      'Sandbox.setRequestTransformations',
      native.setRequestTransformations,
    ),
    addRequestTransformations: wrapOptional(
      'Sandbox.addRequestTransformations',
      native.addRequestTransformations,
    ),
    ...(setPorts && {
      setPorts: (ports: ReadonlyArray<number>, options: WithAbort = {}) =>
        runRequest('Sandbox.setPorts', options, (abortSignal) =>
          setPorts(ports, { ...options, abortSignal }),
        ),
    }),
    restricted: runSync('Sandbox.restricted', () =>
      wrapSandbox(native.restricted()),
    ),
  };

  registerSandbox(sandbox, native);
  return sandbox;
};

/** Effect session handle including network endpoints and explicit stop and destroy operations. */
export type NetworkSandboxSession = ReturnType<typeof wrapNetworkSandbox>;

/** Settings accepted by the SDK when creating a new session, after optionality is resolved. */
type NativeProviderCreateOptions = NonNullable<
  Parameters<NativeProvider['createSession']>[0]
>;
/** Settings accepted when reconnecting to a session if the native provider supports resumption. */
type NativeProviderResumeOptions = Parameters<
  NonNullable<NativeProvider['resumeSession']>
>[0];

/** Creation settings with an Effect bootstrap callback that receives the initial session and signal. */
export type SandboxProviderCreateOptions<R = never, E = never> = Omit<
  NativeProviderCreateOptions,
  'onFirstCreate'
> & {
  readonly onFirstCreate?: (
    session: SandboxSession,
    options: WithAbort,
  ) => Effect.Effect<void, E, R>;
};

/** Keep native sandbox providers available to callers that require SDK identity. */
const providers = new WeakMap<object, NativeProvider>();

/** Resolve a wrapped provider before passing it to a native harness or SDK operation. */
export const unwrapSandboxProvider = (provider: object) =>
  providers.get(provider);

/** Scope new sessions to destruction and resumed sessions to stopping, preserving native capability detection. */
export const wrapSandboxProvider = (native: NativeProvider) => {
  const resumeSession = native.resumeSession?.bind(native);
  const provider = {
    specificationVersion: native.specificationVersion,
    providerId: native.providerId,
    createSession: <R = never, E = never>(
      options: SandboxProviderCreateOptions<R, E> = {},
    ) =>
      Effect.gen(function* () {
        const { onFirstCreate, ...rest } = options;
        const owner = yield* openOperation<R>(options.abortSignal);
        const session = yield* scopedResource(
          'SandboxProvider.createSession',
          { abortSignal: owner.signal },
          (abortSignal) =>
            native.createSession({
              ...rest,
              abortSignal,
              ...(onFirstCreate && {
                onFirstCreate: (session, opts) =>
                  owner.runCallback(
                    onFirstCreate(wrapSandbox(session), opts),
                    opts.abortSignal,
                  ),
              }),
            }),
          (session) => session.destroy(),
        );
        return wrapNetworkSandbox(session);
      }),
    ...(resumeSession && {
      resumeSession: (options: NativeProviderResumeOptions) =>
        Effect.map(
          scopedResource(
            'SandboxProvider.resumeSession',
            options,
            (abortSignal) => resumeSession({ ...options, abortSignal }),
            (session) => session.stop(),
          ),
          wrapNetworkSandbox,
        ),
    }),
  };
  providers.set(provider, native);
  return provider;
};

/** Named preparation routine for initializing a sandbox through Effect operations. */
export type SandboxTemplate<R = never, E = never> = {
  readonly identity: string;
  readonly prepare: (
    options: WithAbort & { session: SandboxSession },
  ) => Effect.Effect<void, E, R>;
};

/** Operation context that owns the native template callback and captures its services. */
type Owner<R> = Effect.Success<ReturnType<typeof openOperation<R>>>;

/** Wrap the session before running preparation in the scope that supplied the template. */
export const bindTemplate = <R, E>(
  template: SandboxTemplate<R, E>,
  owner: Owner<R>,
): NativeTemplate => ({
  identity: template.identity,
  prepare: ({ session, abortSignal }) =>
    owner.runCallback(
      template.prepare({
        session: wrapSandbox(session),
        ...(abortSignal && { abortSignal }),
      }),
      abortSignal,
    ),
});
