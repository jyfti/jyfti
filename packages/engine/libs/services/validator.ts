import Ajv, { ErrorObject } from "ajv";
import { JsonSchema } from "../types";

export function hasErrors(result: Record<string, ErrorObject[]>): boolean {
  return Object.keys(result).length !== 0;
}

export function validateWorkflow(
  workflow: unknown,
  schema: JsonSchema
): ErrorObject[] {
  return validate(workflow, schema);
}

export function validateInputs(
  inputs: Record<string, unknown>,
  schema: Record<string, JsonSchema>
): Record<string, ErrorObject[]> {
  return validateAll(inputs, schema);
}

export function validateEnvironment(
  environment: Record<string, unknown>,
  schema: Record<string, JsonSchema>
): Record<string, ErrorObject[]> {
  return validateAll(environment, schema);
}

function validate(object: unknown, schema: JsonSchema): ErrorObject[] {
  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema);
  validate(object);
  return validate.errors || [];
}

function validateAll(
  objects: Record<string, unknown>,
  schemaMap: Record<string, JsonSchema>
): Record<string, ErrorObject[]> {
  const results = Object.keys(schemaMap)
    .map((fieldName) => ({
      fieldName,
      errors: validate(objects[fieldName], schemaMap[fieldName]),
    }))
    .filter((result) => result.errors.length != 0);
  return results.reduce(
    (acc, result) => ({ ...acc, [result.fieldName]: result.errors }),
    {}
  );
}
