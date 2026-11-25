import { Schema } from 'effect';
import type { Effect } from 'effect';
import {
  createMCPClient,
  type Experimental_MCPEventAdapter,
  type Experimental_MCPEventControl,
  type MCPClient,
  type JSONRPCMessage,
} from '../src/integrations/mcp.js';

type Expect<T extends true> = T;
type Present<T> = [T] extends [never] ? false : true;
type Same<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;

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

declare const client: MCPClient;
const tools = client.tools({
  schemas: {
    known: {
      inputSchema: Schema.Struct({ input: Schema.String }),
      outputSchema: Schema.Struct({ count: Schema.Number }),
    },
  },
});
type KnownTool = Effect.Success<typeof tools>['known'];

export type ToolInputIsPreserved = Expect<
  Same<Parameters<KnownTool['execute']>[0], { readonly input: string }>
>;
type KnownSchema = NonNullable<KnownTool['outputSchema']>;
type KnownOutput = Effect.Success<ReturnType<KnownSchema['validate']>>;

export type ToolOutputIsPreserved = Expect<
  Same<KnownOutput, { readonly count: number }>
>;

declare const adapter: Experimental_MCPEventAdapter;
const transport = { type: 'http', url: 'https://mcp.example.test' } as const;
const standard = createMCPClient({ transport });
const managed = createMCPClient({
  transport,
  experimental_events: { adapter },
});

export type StandardEventsAreExact = Expect<
  'refresh' extends keyof Effect.Success<typeof standard>['experimental_events']
    ? true
    : false
>;
export type ManagedEventsAreExact = Expect<
  'getSubscription' extends keyof Effect.Success<
    typeof managed
  >['experimental_events']
    ? true
    : false
>;
