import { Dataflow } from '../types/dataflow.type';
import { DataflowPreview } from '../types/dataflow-preview.type';
import { RouterReducerState } from '@ngrx/router-store';

export class GlobalState {
  dataflow: DataflowState;
  router: RouterReducerState<any>;
}

export class DataflowState {
  dataflowPreviews: DataflowPreview[];
  dataflow: Dataflow;
  stepIndex: number;
  execution: {
    stepIndex: number;
    evaluations: { [stepIndex: number]: any };
  };
}

export const initialState: DataflowState = {
  dataflowPreviews: [],
  dataflow: {
    id: '',
    name: '',
    steps: [],
  },
  stepIndex: 0,
  execution: null,
};
