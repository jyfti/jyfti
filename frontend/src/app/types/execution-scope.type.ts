import { Step } from './step.type';

export interface ExecutionScope {
  stepIndex: number;
  steps: Step[];
  localVariables: { [stepIndex: number]: any };
  subScope?: ExecutionScope;
}
