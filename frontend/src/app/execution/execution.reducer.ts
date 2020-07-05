import { createReducer, on, createFeatureSelector } from '@ngrx/store';
import {
  finishStepExecution,
  resetExecution,
  startExecution,
  startStepExecution,
} from '../ngrx/dataflow-execution.actions';

export const selectExecution = createFeatureSelector('execution');

export class ExecutionState {
  stepIndex: number;
  evaluations: { [stepIndex: number]: any };
}

export const initialState: ExecutionState = null;

const _executionReducer = createReducer(
  initialState,
  on(startExecution, (state) => ({
    stepIndex: null,
    evaluations: {},
  })),
  on(resetExecution, (state) => null),
  on(startStepExecution, (state, { stepIndex }) => ({
    ...state,
    stepIndex,
  })),
  on(finishStepExecution, (state, { stepIndex, evaluation }) => ({
    ...state,
    evaluations: {
      ...state.evaluations,
      [stepIndex]: evaluation,
    },
  }))
);

export function executionReducer(state, action) {
  return _executionReducer(state, action);
}
