import { Step, JsonExpression } from "./step.type";
import { Dictionary } from "lodash";
import { JsonSchema } from "./json-schema.type";
import { InputDefinitions } from "./input-definitions.type";

export interface Workflow {
  $schema?: string;
  name: string;
  inputs?: InputDefinitions;
  output?: JsonExpression;
  steps: Step[];
}
