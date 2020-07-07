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
  on(startStepExecution, (state, { scope }) => ({
    ...state,
    stepIndex: scope.stepIndex,
  })),
  on(finishStepExecution, (state, { scope, evaluation }) => ({
    ...state,
    evaluations: {
      ...state.evaluations,
      [scope.stepIndex]: evaluation,
    },
  }))
);

export function executionReducer(state, action) {
  return _executionReducer(state, action);
}
