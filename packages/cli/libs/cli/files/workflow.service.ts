import { Config } from "../types/config";
import { Workflow, Inputs, JsonSchema, VariableMap } from "@jyfti/engine";
import * as http from "./workflow-http.service";
import * as file from "./workflow-file.service";
import {
  printAllInputErrors as printAllErrors,
  printValidationErrors,
  printError,
} from "../print.service";
import { validateSchemaMap, validate } from "../../engine/services/validator";
import { isUrl } from "./workflow.util";

export function readWorkflowOrTerminate(
  config: Config,
  name: string
): Promise<Workflow> {
  const readWorkflowOrTerminate = isUrl(name)
    ? http.readWorkflowOrTerminate
    : file.readWorkflowOrTerminate;
  return readWorkflowOrTerminate(config, name);
}

export function validateWorkflowOrTerminate(
  workflow: Workflow,
  schema: JsonSchema
): void {
  const errors = validate(workflow, schema);
  if (errors.length !== 0) {
    console.error(printError("The workflow is invalid."));
    console.error(printValidationErrors(errors));
    process.exit(1);
  }
}

export function validateInputsOrTerminate(
  workflow: Workflow,
  inputs: Inputs
): void {
  const inputErrors = validateSchemaMap(workflow.inputs || {}, inputs);
  if (Object.keys(inputErrors).length !== 0) {
    const message =
      printError(
        "The workflow can not be started because some inputs are invalid.\n\n"
      ) + printAllErrors(inputErrors, inputs);
    console.error(message);
    process.exit(1);
  }
}

export function validateEnvironmentOrTerminate(
  workflow: Workflow,
  environment: VariableMap
): void {
  const environmentErrors = validateSchemaMap(workflow.env || {}, environment);
  if (Object.keys(environmentErrors).length !== 0) {
    const message =
      printError(
        "The workflow can not be started because the environment does not meet the requirements.\n\n"
      ) + printAllErrors(environmentErrors, environment);
    console.error(message);
    process.exit(1);
  }
}
