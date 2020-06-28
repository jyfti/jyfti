import { createReducer, on } from '@ngrx/store';

import {
  startExecution,
  startStepExecution,
  finishStepExecution,
  resetExecution,
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
  }))
);

export function reducer(state, action) {
  return dataflowReducer(state, action);
}
