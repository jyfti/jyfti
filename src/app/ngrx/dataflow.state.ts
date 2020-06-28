import { HttpRequestStep } from '../types/step.type';

export class GlobalState {
  dataflow: DataFlowState;
}

export class DataFlowState {
  steps: HttpRequestStep[];
  execution: {
    stepIndex: number;
    evaluations: { [stepIndex: number]: any };
  };
}

export const initialState: DataFlowState = {
  steps: null,
  execution: null,
};
