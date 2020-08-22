import Ajv, { ErrorObject } from "ajv";
import {
  InputErrors,
  Inputs,
  Workflow,
  InputDefinitions,
  JsonSchema,
} from "../types";

export function validateWorkflow(
  workflow: Workflow,
  schema: JsonSchema
): ErrorObject[] {
  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema);
  const valid = validate(workflow);
  return validate.errors || [];
}

export function validateInputs(
  inputDefinitions: InputDefinitions,
  inputs: Inputs
): InputErrors {
  const results = Object.keys(inputDefinitions)
    .map((fieldName) => ({
      fieldName,
      errors: validateInput(inputDefinitions[fieldName], inputs[fieldName]),
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
