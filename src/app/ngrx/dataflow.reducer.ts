import { createReducer, on } from '@ngrx/store';
import { initialState } from './dataflow.state';
import { startExecution } from './dataflow.actions';

const dataflowReducer = createReducer(
  initialState,
  on(startExecution, (state, { httpRequests }) => ({
    ...state,
    httpRequests,
  }))
);

export function reducer(state, action) {
  return dataflowReducer(state, action);
}
