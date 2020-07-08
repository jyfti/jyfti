import { Step } from './step.type';

export interface ExecutionScope {
  stepIndex: number;
  steps: Step[];
  variables: { [stepIndex: number]: any };
  subScope?: ExecutionScope;
}
