import Ajv, { ErrorObject } from "ajv";
import { InputErrors, Workflow, SchemaMap, JsonSchema } from "../types";

export function validateWorkflow(
  workflow: Workflow,
  schema: JsonSchema
): ErrorObject[] {
  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema);
  const valid = validate(workflow);
  return validate.errors || [];
}

export function validateSchemaMap(
  schemaMap: SchemaMap,
  inputs: { [name: string]: any }
): InputErrors {
  const results = Object.keys(schemaMap)
    .map((fieldName) => ({
      fieldName,
      errors: validateInput(schemaMap[fieldName], inputs[fieldName]),
    }))
    .filter((result) => result.errors.length != 0);
  return results.reduce(
    (acc, result) => ({ ...acc, [result.fieldName]: result.errors }),
    {}
  );
}

export function validateInput(schema: JsonSchema, input: any): ErrorObject[] {
  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema);
  const valid = validate(input);
  return validate.errors || [];
}
