import { Step, JsonExpression } from "./step.type";
import { SchemaMap } from "./schema-map.type";

export interface Workflow {
  $schema?: string;
  name: string;
  env?: SchemaMap;
  inputs?: SchemaMap;
  output?: JsonExpression;
  steps: Step[];
}
