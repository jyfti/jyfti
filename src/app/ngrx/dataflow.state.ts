import { Step } from '../types/step.type';

export class GlobalState {
  dataflow: DataFlowState;
}

export class DataFlowState {
  steps: Step[];
}

export const initialState = {
  steps: null,
};
