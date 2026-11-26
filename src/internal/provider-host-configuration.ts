/** Keep the argument and return types of a platform callback intact. */
type HostCallback<T> = T extends (...args: infer Args) => infer A
  ? (...args: Args) => A
  : T;

/** Preserve the native method shape on a host-supplied platform object. */
type HostMethods<T> = {
  [Key in keyof T]: HostCallback<T[Key]>;
};

/** Retain platform socket constructor arguments and public instance methods. */
type HostSocket<T> = T extends new (...args: infer Args) => infer Socket
  ? new (...args: Args) => HostMethods<Socket>
  : T;

/** Synchronous host hooks use the platform's callback and constructor contracts. */
export type ProviderHostOption<Key, T> = Key extends 'webSocket'
  ? HostSocket<T>
  : Key extends 'headers' | 'url' | 'generateId' | 'currentDate'
    ? HostCallback<T>
    : Key extends '_internal'
      ? ProviderHostConfiguration<T>
      : T;

/** Apply platform callback and constructor contracts to supported host settings. */
export type ProviderHostConfiguration<Options> = {
  [Key in keyof Options]: ProviderHostOption<Key, Options[Key]>;
};

/** Preserve positional primitive arguments and adapt the host configuration arguments. */
export type ProviderHostArguments<Args extends unknown[]> = {
  [Index in keyof Args]: Args[Index] extends
    string | number | boolean | bigint | symbol
    ? Args[Index]
    : ProviderHostConfiguration<Args[Index]>;
};
