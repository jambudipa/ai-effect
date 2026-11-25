import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';
import {
  findPrivateSdkImports,
  findSdkOperations,
} from '../scripts/sdk-declaration-graph.mjs';

function inspect(declarations, dependencies = []) {
  const root = mkdtempSync(join(tmpdir(), 'ai-effect-declaration-graph-'));
  try {
    const sdk = join(root, 'node_modules/ai/index.d.ts');
    const wrapper = join(root, 'node_modules/@jambudipa/ai-effect/index.d.ts');
    for (const [file, contents] of [
      [
        sdk,
        `
        export interface Data { readonly id: string }
        export declare class RawOperation { run(): Promise<Data> }
      `,
      ],
      [wrapper, declarations],
      ...dependencies.map(([file, contents]) => [join(root, file), contents]),
    ]) {
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, contents);
    }
    const program = ts.createProgram([wrapper], {
      module: ts.ModuleKind.NodeNext,
      lib: ['lib.es5.d.ts'],
      strict: true,
      types: [],
    });
    const checker = program.getTypeChecker();
    const source = program.getSourceFile(wrapper);
    const namespace = checker.getSymbolAtLocation(source);
    return {
      operations: findSdkOperations(
        checker,
        checker.getExportsOfModule(namespace),
      ),
      privateImports: findPrivateSdkImports(
        program,
        new Set(['ai', 'ai/test']),
      ),
    };
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

describe('packed declaration graph', () => {
  it('uses the output members of an adapter mapped from an SDK type', () => {
    const { operations } = inspect(`
      import type { RawOperation } from 'ai';
      type Adapt<Native> = { [Member in keyof Native]: () => { readonly result: string } };
      export type Consumer = Adapt<RawOperation>;
    `);
    expect(operations).toEqual([]);
  });

  it('checks selected members of an SDK declaration through Pick', () => {
    const { operations } = inspect(`
      import type { RawOperation } from 'ai';
      export type PublicData = Pick<RawOperation, never>;
      export type PublicCall = Pick<RawOperation, 'run'>;
    `);
    expect(operations.map(({ path }) => path)).toEqual(['PublicCall.run']);
  });

  it('finds an SDK method inside the return of a nested callback', () => {
    const { operations } = inspect(`
      import type { RawOperation } from 'ai';
      export interface Consumer {
        config: { callbacks: { factory: () => ReadonlyArray<RawOperation> } };
      }
    `);
    expect(operations.map(({ path }) => path)).toContain(
      'Consumer.config.callbacks.factory return.run',
    );
  });

  it('checks the nearest package owner of a declaration', () => {
    const { operations, privateImports } = inspect(
      `
        export type { HostSchema } from '../../ai/node_modules/zod/index.js';
        export type { NestedSdk } from '../../ai/node_modules/@ai-sdk/provider/index.js';
        export type { WrappedDependency } from './node_modules/host/index.js';
      `,
      [
        [
          'node_modules/ai/node_modules/zod/index.d.ts',
          'export interface HostSchema { parse(input: unknown): string }',
        ],
        [
          'node_modules/ai/node_modules/@ai-sdk/provider/index.d.ts',
          'export interface NestedSdk { run(): Promise<string> }',
        ],
        [
          'node_modules/@jambudipa/ai-effect/node_modules/host/index.d.ts',
          "export type WrappedDependency = import('ai/internal').Hidden;",
        ],
      ],
    );
    expect(operations.map(({ path }) => path)).toEqual(['NestedSdk.run']);
    expect(privateImports).toEqual([]);
  });

  it('finds a private SDK path and permits a public data type', () => {
    const { operations, privateImports } = inspect(`
      import type { Data } from 'ai';
      export interface Consumer { decode: (data: Data) => Data }
      export type Hidden = import('ai/internal').Hidden;
    `);
    expect(operations).toEqual([]);
    expect(privateImports.map(({ specifier }) => specifier)).toEqual([
      'ai/internal',
    ]);
  });
});
