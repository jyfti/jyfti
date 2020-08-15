import { Step } from "./step.type";
import { Dictionary } from "lodash";
import { JsonSchema } from "./json-schema.type";
import { InputDefinitions } from "./input-definitions.type";

export interface Workflow {
  name: string;
  inputs: InputDefinitions;
  steps: Step[];
}
