import { createReducer, on } from '@ngrx/store';

import {
  startExecution,
  startStepExecution,
  finishStepExecution,
} from './dataflow.actions';
import { initialState } from './dataflow.state';

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
  on(startStepExecution, (state, { stepIndex }) => ({
    ...state,
    execution: {
      ...state.execution,
      stepIndex,
    },
  })),
  on(finishStepExecution, (state, { stepExecution }) => ({
    ...state,
    execution: {
      ...state.execution,
      evaluations: {
        ...state.execution.evaluations,
        [stepExecution.stepIndex]: stepExecution.httpResponse,
      },
    },
  }))
);

export function reducer(state, action) {
  return dataflowReducer(state, action);
}
