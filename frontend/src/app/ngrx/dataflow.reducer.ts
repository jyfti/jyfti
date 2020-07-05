import { createReducer, on } from '@ngrx/store';
import { set } from 'lodash/fp';
import { loadedDataflowPreviews } from './dataflow-preview.actions';
import { loadedDataflow, loadStep, saveStep, showDataflow, persistDataflow } from './dataflow.actions';
import { initialState } from './dataflow.state';

const _dataflowReducer = createReducer(
  initialState,
  on(loadedDataflow, (state, { dataflow }) => ({
    ...state,
    dataflow,
  })),
  on(persistDataflow, (state, { dataflow }) => ({
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
