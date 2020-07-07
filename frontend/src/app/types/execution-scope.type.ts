import { Step } from './step.type';
import { VariableMap } from './variabe-map.type';

export interface ExecutionScope {
  stepIndex: number;
  steps: Step[];
  variables: VariableMap;
  subScope?: ExecutionScope;
}
