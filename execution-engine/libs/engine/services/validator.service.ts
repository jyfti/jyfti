import Ajv, { ErrorObject } from "ajv";
import { Workflow } from "../types/workflow.type";
import { readWorkflowSchema } from "../../cli/file.service";
import { InputDefinitions } from "../types/input-definitions.type";
import { JsonSchema } from "../types/json-schema.type";
import { Inputs } from "../types/inputs.type";
import { InputErrors } from "../types/input-errors.type";

export async function validateWorkflow(
  workflow: Workflow
): Promise<ErrorObject[]> {
  const ajv = new Ajv({ allErrors: true });
  const validate = await ajv.compileAsync(await readWorkflowSchema());
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
