import { Step } from './step.type';

export interface Dataflow {
  id: string;
  name: string;
  steps: Step[];
}
