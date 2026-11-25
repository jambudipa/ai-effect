import type { Effect, Stream } from 'effect';
import type { Scope } from 'effect/Scope';
import type { createCodex } from '../src/integrations/harness-codex.js';
import type { HarnessV1CredentialForwarding } from '../src/integrations/harness.js';
import type { harnessV1StreamPartSchema } from '../src/integrations/internal/harness-contracts/harness.js';
import type { createJustBashNetworkSandboxSession } from '../src/integrations/sandbox-just-bash.js';

type Expect<T extends true> = T;
type Same<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;

export type HarnessStreamDiscriminatorIsLiteral = Expect<
  Same<(typeof harnessV1StreamPartSchema)['def']['discriminator'], 'type'>
>;

type Codex = Effect.Success<ReturnType<typeof createCodex>>;
type Bash = Codex['builtinTools']['bash'];
type BashInput = Effect.Success<ReturnType<Bash['inputSchema']['validate']>>;
export type PreservedCodexBashInput = Expect<
  Same<BashInput, { command: string }>
>;

type Start = ReturnType<Codex['doStart']>;
type Session = Effect.Success<Start>;
type Turn = Effect.Success<ReturnType<Session['doPromptTurn']>>;
export type TurnCompletionIsEffect = Expect<
  Same<Effect.Success<Turn['done']>, void>
>;
export type CredentialForwarderIsEffect = Expect<
  Same<Effect.Success<ReturnType<HarnessV1CredentialForwarding>>, string>
>;

type Sandbox = Effect.Success<
  ReturnType<typeof createJustBashNetworkSandboxSession>
>;
type ReadFile = NonNullable<Effect.Success<ReturnType<Sandbox['readFile']>>>;
export type SandboxReadIsStream = Expect<
  Same<Stream.Success<ReadFile>, Uint8Array>
>;
export type SandboxSpawnRequiresScope = Expect<
  Same<Effect.Services<ReturnType<Sandbox['spawn']>>, Scope>
>;
