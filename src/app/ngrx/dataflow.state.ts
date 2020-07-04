import { DataFlow } from '../types/data-flow.type';
import { DataflowPreview } from '../types/dataflow-preview.type';

export class GlobalState {
  dataflow: DataFlowState;
}

export class DataFlowState {
  dataflowPreviews: DataflowPreview[];
  dataflow: DataFlow;
  execution: {
    stepIndex: number;
    evaluations: { [stepIndex: number]: any };
  };
}

export const initialState: DataFlowState = {
  dataflowPreviews: [],
  dataflow: {
    id: "",
    name: "",
    steps: []
  },
  execution: null,
};
