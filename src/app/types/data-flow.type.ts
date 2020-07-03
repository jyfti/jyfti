import { Step } from './step.type';

export interface DataFlow {
  id: string;
  name: string;
  steps: Step[];
}
