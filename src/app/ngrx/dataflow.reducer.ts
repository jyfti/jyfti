import { createReducer, on } from '@ngrx/store';

import {
  startExecution,
  startStepExecution,
  finishStepExecution,
  resetExecution,
  saveDataflow,
  saveStep,
  loadStep,
} from './dataflow.actions';
import { initialState } from './dataflow.state';
import { set } from 'lodash/fp';
import { loadedDataflowPreviews } from './dataflow-preview.actions';

const dataflowReducer = createReducer(
  initialState,
  on(startExecution, (state, { dataflow }) => ({
    ...state,
    dataflow,
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
  on(saveDataflow, (state, { dataflow }) => ({
    ...state,
    dataflow,
  })),
  on(saveStep, (state, { step }) => ({
    ...state,
    dataflow: {
      ...state.dataflow,
      steps: set(state.stepIndex, step)(state.dataflow.steps),
    },
  })),
  on(loadStep, (state, { stepIndex }) => ({
    ...state,
    stepIndex,
  })),
  on(loadedDataflowPreviews, (state, { dataflowPreviews }) => ({
    ...state,
    dataflowPreviews: dataflowPreviews,
  }))
);

export function reducer(state, action) {
  return dataflowReducer(state, action);
}
