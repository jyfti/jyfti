import { Step } from '../types/step.type';
import planets from 'src/assets/dataflows/planets.json';

export class GlobalState {
  dataflow: DataFlowState;
}

export class DataFlowState {
  steps: Step[];
  execution: {
    stepIndex: number;
    evaluations: { [stepIndex: number]: any };
  };
}

export const initialState: DataFlowState = {
  steps: planets.steps,
  execution: null,
};
