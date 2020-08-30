import { Step, JsonExpression } from "./step.type";
import { JsonSchema } from "./json-schema.type";

export interface Workflow {
  $schema?: string;
  name: string;
  env?: Record<string, JsonSchema>;
  inputs?: Record<string, JsonSchema>;
  output?: JsonExpression;
  steps: Step[];
}
