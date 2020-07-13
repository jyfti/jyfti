import { Step } from './step.type';
import { VariableMap } from './variable-map.type';

export interface ExecutionScope {
  stepIndex: number;
  loopIndex?: number;
  steps: Step[];
  localVariables: { [stepIndex: number]: any };
  parentVariables: VariableMap;
  subScope?: ExecutionScope;
}
