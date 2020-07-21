import { createReducer, on, createFeatureSelector } from '@ngrx/store';
import {
  resetExecution,
  startExecution,
  stepExecution,
  finishExecution,
} from '../ngrx/dataflow-execution.actions';
import { Evaluation } from './execution.service';

export const selectExecution = createFeatureSelector<ExecutionState>(
  'execution'
);

export class ExecutionState {
  evaluations: Evaluation[];
}

export const initialState: ExecutionState = {
  evaluations: [],
};

const _executionReducer = createReducer(
  initialState,
  on(startExecution, (state) => ({
    evaluations: [],
  })),
  on(resetExecution, (state) => ({ evaluations: [] })),
  on(finishExecution, (state, { evaluations }) => ({ evaluations }))
);

export function executionReducer(state, action) {
  return _executionReducer(state, action);
}
