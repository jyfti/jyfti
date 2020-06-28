import { Step } from '../types/step.type';

export class GlobalState {
  dataflow: DataFlowState;
}

export class DataFlowState {
  steps: Step[];
  execution: {
    stepIndex: number;
  };
}

export const initialState: DataFlowState = {
  steps: null,
  execution: null,
};
