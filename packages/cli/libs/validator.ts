import {
  validateEnvironment,
  Workflow,
  JsonSchema,
  validateWorkflow,
  Inputs,
  validateInputs,
  VariableMap,
} from "@jyfti/engine";
import {
  printError,
  printAllErrors,
  printValidationErrors,
} from "./print.service";

export function validateWorkflowOrTerminate(
  workflow: Workflow,
  schema: JsonSchema
): void {
  const errors = validateWorkflow(workflow, schema);
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
  const inputErrors = validateInputs(inputs, workflow.inputs || {});
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
  const environmentErrors = validateEnvironment(
    environment,
    workflow.env || {}
  );
  if (Object.keys(environmentErrors).length !== 0) {
    const message =
      printError(
        "The workflow can not be started because the environment does not meet the requirements.\n\n"
      ) + printAllErrors(environmentErrors, environment);
    console.error(message);
    process.exit(1);
  }
}
