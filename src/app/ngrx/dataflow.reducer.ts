import { createReducer, on } from '@ngrx/store';
import { initialState } from './dataflow.state';
import { startExecution, finishStepExecution } from './dataflow.actions';

const dataflowReducer = createReducer(
  initialState,
  on(startExecution, (state, { steps }) => ({
    ...state,
    steps,
    execution: {
      stepIndex: null,
    },
  })),
  on(finishStepExecution, (state, { stepExecution }) => ({
    ...state,
    execution: {
      stepIndex: stepExecution.stepIndex,
    },
  }))
);

export function reducer(state, action) {
  return dataflowReducer(state, action);
}
