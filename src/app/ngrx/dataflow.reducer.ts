import { createReducer, on } from '@ngrx/store';
import { initialState } from './dataflow.state';
import { startExecution } from './dataflow.actions';

const dataflowReducer = createReducer(
  initialState,
  on(startExecution, (state, { steps }) => ({
    ...state,
    steps,
  }))
);

export function reducer(state, action) {
  return dataflowReducer(state, action);
}
