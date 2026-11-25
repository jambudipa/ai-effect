// Generated from just-bash@2.14.5. Do not edit.
// Original license: just-bash/LICENSE.
import type { Bash } from '../Bash.js';
export interface OutputMessage {
  type: 'stdout' | 'stderr';
  data: string;
  timestamp: Date;
}
export declare class Command {
  readonly cmdId: string;
  readonly cwd: string;
  readonly startedAt: Date;
  exitCode: number | undefined;
  constructor(
    bashEnv: Bash,
    cmdLine: string,
    cwd: string,
    env?: Record<string, string>,
    explicitCwd?: boolean,
    signal?: AbortSignal,
    timeoutMs?: number,
  );
  logs(): AsyncGenerator<OutputMessage, void, unknown>;
  wait(): Promise<CommandFinished>;
  output(): Promise<string>;
  stdout(): Promise<string>;
  stderr(): Promise<string>;
  kill(): Promise<void>;
}
export interface CommandFinished extends Command {
  exitCode: number;
}
