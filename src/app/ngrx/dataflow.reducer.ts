import { createReducer, on } from '@ngrx/store';

import {
  startExecution,
  startStepExecution,
  finishStepExecution,
  resetExecution,
  saveDataflow,
  saveStep,
} from './dataflow.actions';
import { initialState } from './dataflow.state';
import { set } from 'lodash/fp';

const dataflowReducer = createReducer(
  initialState,
  on(startExecution, (state, { steps }) => ({
    ...state,
    steps,
    execution: {
      stepIndex: null,
      evaluations: {},
    },
  })),
  on(resetExecution, (state) => ({
    ...state,
    execution: null,
  })),
  on(startStepExecution, (state, { stepIndex }) => ({
    ...state,
    execution: {
      ...state.execution,
      stepIndex,
    },
  })),
  on(finishStepExecution, (state, { stepIndex, evaluation }) => ({
    ...state,
    execution: {
      ...state.execution,
      evaluations: {
        ...state.execution.evaluations,
        [stepIndex]: evaluation,
      },
    },
  })),
  on(saveDataflow, (state, { steps }) => ({
    ...state,
    steps,
  })),
  on(saveStep, (state, { stepIndex, step }) => ({
    ...state,
    dataflow: {
      ...state.dataflow,
      steps: set(stepIndex, step)(state.dataflow.steps),
    },
  }))
);

export function reducer(state, action) {
  return dataflowReducer(state, action);
}
