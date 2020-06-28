import { createReducer, on } from '@ngrx/store';

import { startExecution, startStepExecution } from './dataflow.actions';
import { initialState } from './dataflow.state';

const dataflowReducer = createReducer(
  initialState,
  on(startExecution, (state, { steps }) => ({
    ...state,
    steps,
    execution: {
      stepIndex: null,
    },
  })),
  on(startStepExecution, (state, { stepIndex }) => ({
    ...state,
    execution: {
      ...state.execution,
      stepIndex,
    },
  }))
);

export function reducer(state, action) {
  return dataflowReducer(state, action);
}
