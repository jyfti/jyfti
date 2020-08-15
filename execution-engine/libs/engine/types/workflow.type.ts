import { Step } from "./step.type";
import { Dictionary } from "lodash";

export interface Workflow {
  name: string;
  inputs: Dictionary<{ type: string }>;
  steps: Step[];
}
