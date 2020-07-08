import { createReducer, on, createFeatureSelector } from '@ngrx/store';
import {
  resetExecution,
  startExecution,
  startStepExecution,
  finishExecution,
} from '../ngrx/dataflow-execution.actions';
import { ExecutionScope } from '../types/execution-scope.type';

export const selectExecution = createFeatureSelector<ExecutionState>(
  'execution'
);

export class ExecutionState {
  scope: ExecutionScope;
}

export const initialState: ExecutionState = null;

const _executionReducer = createReducer(
  initialState,
  on(startExecution, (state) => ({
    scope: {
      stepIndex: null,
    },
  })),
  on(resetExecution, (state) => null),
  on(finishExecution, (state, { scope }) => ({ scope })),
  on(startStepExecution, (state, { scope }) => ({ scope }))
);

export function executionReducer(state, action) {
  return _executionReducer(state, action);
}
