import Ajv from "ajv";
import { Workflow } from "../types/workflow.type";
import { readWorkflowSchema } from "../../cli/file.service";
import { InputDefinitions } from "../types/input-definitions.type";
import { JsonSchema } from "../types/json-schema.type";

export async function validateWorkflow(
  workflow: Workflow
): Promise<Ajv.ErrorObject[]> {
  const ajv = new Ajv({ allErrors: true });
  const validate = await ajv.compileAsync(await readWorkflowSchema());
  const valid = validate(workflow);
  return validate.errors || [];
}

export function validateInputs(
  inputDefinitions: InputDefinitions,
  inputs: { [fieldName: string]: any }
): { [fieldName: string]: Ajv.ErrorObject[] } {
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

export function validateInput(
  schema: JsonSchema,
  input: any
): Ajv.ErrorObject[] {
  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema);
  const valid = validate(input);
  return validate.errors || [];
}
