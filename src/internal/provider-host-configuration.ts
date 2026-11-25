type HostCallback<T> = T extends (...args: infer Args) => infer A
  ? (...args: Args) => A
  : T;

type HostMethods<T> = {
  [Key in keyof T]: HostCallback<T[Key]>;
};

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

export type ProviderHostConfiguration<Options> = {
  [Key in keyof Options]: ProviderHostOption<Key, Options[Key]>;
};

export type ProviderHostArguments<Args extends unknown[]> = {
  [Index in keyof Args]: Args[Index] extends
    string | number | boolean | bigint | symbol
    ? Args[Index]
    : ProviderHostConfiguration<Args[Index]>;
};
