import Ajv from "ajv";
import { Workflow } from "../engine/types/workflow.type";
import { readWorkflowSchema } from "./file.service";

export async function validateWorkflow(
  workflow: Workflow
): Promise<Ajv.ErrorObject[]> {
  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(await readWorkflowSchema());
  const valid = validate(workflow);
  return validate.errors || [];
}
