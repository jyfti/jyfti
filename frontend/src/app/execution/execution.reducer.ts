import { createFeatureSelector, createReducer, on } from '@ngrx/store';

import {
  resetExecution,
  startExecution,
  stepExecution,
} from '../ngrx/dataflow-execution.actions';
import { PathedEvaluation } from './execution-engine.service';
import { Evaluation } from './execution.service';

export const selectExecution = createFeatureSelector<ExecutionState>(
  'execution'
);

export class ExecutionState {
  evaluations: Evaluation[];
  executionLog: PathedEvaluation[];
}

export const initialState: ExecutionState = {
  evaluations: [],
  executionLog: [],
};

const _executionReducer = createReducer(
  initialState,
  on(startExecution, (state) => ({
    ...state,
    executionLog: [],
  })),
  on(resetExecution, (state) => ({ ...state, executionLog: [] })),
  on(stepExecution, (state, { pathedEvaluation }) => ({
    ...state,
    executionLog: state.executionLog.concat([pathedEvaluation]),
  }))
);

export function executionReducer(state, action) {
  return _executionReducer(state, action);
}
