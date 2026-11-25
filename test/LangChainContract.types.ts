import type { LangSmithDeploymentTransportOptions as NativeOptions } from '@ai-sdk/langchain';
import type { LangSmithDeploymentTransportOptions } from '../src/integrations/langchain.js';

type Expect<T extends true> = T;
type Same<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;

export type LangSmithOptionsAreExact = Expect<
  Same<NativeOptions, LangSmithDeploymentTransportOptions>
>;
