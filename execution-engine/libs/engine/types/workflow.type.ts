import { Step } from "./step.type";

export interface Workflow {
  name: string;
  steps: Step[];
}
