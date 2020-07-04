import { createReducer, on } from '@ngrx/store';
import { set } from 'lodash/fp';
import { finishStepExecution, resetExecution, startExecution, startStepExecution } from './dataflow-execution.actions';
import { loadedDataflowPreviews } from './dataflow-preview.actions';
import { loadedDataflow, loadStep, saveStep, showDataflow } from './dataflow.actions';
import { initialState } from './dataflow.state';

const _dataflowReducer = createReducer(
  initialState,
  on(startExecution, (state) => ({
    ...state,
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
  on(loadedDataflow, (state, { dataflow }) => ({
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
  on(showDataflow, (state, { id }) => ({
    ...state,
    dataflowId: id,
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

export function dataflowReducer(state, action) {
  return _dataflowReducer(state, action);
}
