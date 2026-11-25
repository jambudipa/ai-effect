import {
  experimental_createSteering as nativeCreateSteering,
  type Experimental_Steering as NativeSteering,
  type Experimental_SteeringOutcome as SteeringOutcome,
  type UserModelMessage,
} from 'ai';
import { Effect } from 'effect';
import { runRequest, runSync, type AiSdkError } from './operation.js';

export interface Steering {
  readonly steer: (
    message: string | UserModelMessage,
    options?: { readonly id?: string; readonly interrupt?: boolean },
  ) => Effect.Effect<SteeringOutcome, AiSdkError>;
  readonly queue: (
    message: string | UserModelMessage,
    options?: { readonly id?: string },
  ) => Effect.Effect<SteeringOutcome, AiSdkError>;
}

const nativeSteering = new WeakMap<Steering, NativeSteering>();

export const unwrapSteering = (handle: Steering) => nativeSteering.get(handle);

/** Create an Effect handle for a single generation's steering queue. */
export const createSteering = () =>
  runSync('createSteering', nativeCreateSteering).pipe(
    Effect.map((native) => {
      const handle: Steering = {
        steer: (message, options) =>
          runRequest('Steering.steer', {}, () =>
            native.steer(message, options),
          ),
        queue: (message, options) =>
          runRequest('Steering.queue', {}, () =>
            native.queue(message, options),
          ),
      };
      nativeSteering.set(handle, native);
      return handle;
    }),
  );
