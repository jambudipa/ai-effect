import { describe, expect, it } from 'vitest';
import {
  WORKFLOW_DESERIALIZE,
  WORKFLOW_SERIALIZE,
} from '../src/protocols/provider-utils.js';

interface WorkflowModel {
  [WORKFLOW_SERIALIZE](): string;
  [WORKFLOW_DESERIALIZE](data: string): WorkflowModel;
}

describe('Workflow serialization symbols', () => {
  it('retains the shared runtime keys and accepts computed members', () => {
    const model: WorkflowModel = {
      [WORKFLOW_SERIALIZE]: () => 'fixture',
      [WORKFLOW_DESERIALIZE]: () => model,
    };

    expect(WORKFLOW_SERIALIZE).toBe(Symbol.for('workflow-serialize'));
    expect(WORKFLOW_DESERIALIZE).toBe(Symbol.for('workflow-deserialize'));
    expect(model[WORKFLOW_DESERIALIZE](model[WORKFLOW_SERIALIZE]())).toBe(
      model,
    );
  });
});
