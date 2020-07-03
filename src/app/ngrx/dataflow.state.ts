import { Step } from '../types/step.type';
import planets from 'src/assets/dataflows/planets.json';
import { DataFlow } from '../types/data-flow.type';

export class GlobalState {
  dataflow: DataFlowState;
}

export class DataFlowState {
  dataflow: DataFlow;
  execution: {
    stepIndex: number;
    evaluations: { [stepIndex: number]: any };
  };
}

export const initialState: DataFlowState = {
  dataflow: planets,
  execution: null,
};
