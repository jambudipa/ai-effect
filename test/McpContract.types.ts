import type {
  Experimental_MCPEventControl,
  JSONRPCMessage,
} from '../src/integrations/mcp.js';

type Expect<T extends true> = T;
type Present<T> = [T] extends [never] ? false : true;

type Gap = Extract<Experimental_MCPEventControl, { type: 'gap' }>;
type Terminated = Extract<Experimental_MCPEventControl, { type: 'terminated' }>;

/** The normalized union must retain its transformed discriminator branches. */
export type GapBranchIsPresent = Expect<Present<Gap>>;
export type TerminationBranchIsPresent = Expect<Present<Terminated>>;
export type ControlGap = Expect<
  Gap extends { readonly cursor: string; readonly truncated: true }
    ? true
    : false
>;
export type ControlTermination = Expect<
  Terminated extends {
    readonly error: { readonly code: number; readonly message: string };
  }
    ? true
    : false
>;

/** Preserve the JSON-RPC request identifier as a string or number. */
export type RequestIdentifiers = Expect<
  'request-1' | 1 extends Extract<
    JSONRPCMessage,
    { method: string; id: string | number }
  >['id']
    ? true
    : false
>;
