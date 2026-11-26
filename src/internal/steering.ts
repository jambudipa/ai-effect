import {
  experimental_createSteering as nativeCreateSteering,
  type Experimental_Steering as NativeSteering,
  type Experimental_SteeringOutcome as SteeringOutcome,
  type UserModelMessage,
} from 'ai';
import { Effect } from 'effect';
import { runRequest, runSync, type AiSdkError } from './operation.js';

/** Expose SDK steering operations for an active generation or stream. */
export interface Steering {
  /** Submit a message for the next decision point with optional current-step interruption. */
  readonly steer: (
    message: string | UserModelMessage,
    options?: { readonly id?: string; readonly interrupt?: boolean },
  ) => Effect.Effect<SteeringOutcome, AiSdkError>;
  /** Queue a message for processing without requesting an immediate interruption. */
  readonly queue: (
    message: string | UserModelMessage,
    options?: { readonly id?: string },
  ) => Effect.Effect<SteeringOutcome, AiSdkError>;
}

/** Retain the native steering object for each registered public handle. */
const nativeSteering = new WeakMap<Steering, NativeSteering>();

/** Recover a native steering object when forwarding the handle into an SDK call. */
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
