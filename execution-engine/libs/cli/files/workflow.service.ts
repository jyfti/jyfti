import { Config } from "../types/config";
import { Workflow, Inputs, JsonSchema } from "../../engine/types";
import * as http from "./workflow-http.service";
import * as file from "./workflow-file.service";
import chalk from "chalk";
import { printAllInputErrors, printValidationErrors } from "../print.service";
import {
  validateInputs,
  validateWorkflow,
} from "../../engine/services/validator.service";

export function isUrl(name: string): boolean {
  return name.startsWith("http://") || name.startsWith("https://");
}

export function extractWorkflowName(name: string): string {
  return isUrl(name) ? http.extractWorkflowName(name) : name;
}

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
  const errors = validateWorkflow(workflow, schema);
  if (errors.length !== 0) {
    console.error(chalk.red("The workflow is invalid."));
    console.error(printValidationErrors(errors));
    process.exit(1);
  }
}

export function validateInputsOrTerminate(
  workflow: Workflow,
  inputs: Inputs
): void {
  const inputErrors = validateInputs(workflow.inputs || {}, inputs);
  if (Object.keys(inputErrors).length !== 0) {
    const message =
      chalk.red(
        "The workflow can not be started because some inputs are invalid.\n\n"
      ) + printAllInputErrors(inputErrors, inputs);
    console.error(message);
    process.exit(1);
  }
}

export function createInputs(workflow: Workflow, inputList: string[]): Inputs {
  return Object.keys(workflow?.inputs || {}).reduce(
    (inputs, inputName, index) => ({
      ...inputs,
      [inputName]: inputList[index],
    }),
    {}
  );
}
