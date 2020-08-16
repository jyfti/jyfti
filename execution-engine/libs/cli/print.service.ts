import chalk from "chalk";
import { StepResult } from "../engine/types/step-result.type";
import ajv from "ajv";
import { Inputs } from "../engine/types/inputs.type";
import { InputErrors } from "../engine/types/input-errors.type";

export function printStepResult(
  verbose: boolean,
  stepResult: StepResult
): string {
  return verbose
    ? JSON.stringify(stepResult, null, 2)
    : "Completed " + chalk.green(stepResult.path);
}

export function printAllFieldErrors(
  inputErrors: InputErrors,
  inputs: Inputs
): string {
  return Object.keys(inputErrors)
    .map((fieldName) =>
      printFieldErrors(fieldName, inputs[fieldName], inputErrors[fieldName])
    )
    .join("\n\n");
}

export function printFieldErrors(
  fieldName: string,
  value: any,
  errors: ajv.ErrorObject[]
): string {
  return (
    `Input: ${chalk.yellow(fieldName)}\n` +
    `Value: ${chalk.yellow(value)}\n` +
    `${printValidationErrors(errors)}`
  );
}

export function printValidationErrors(errors: ajv.ErrorObject[]): string {
  return errors.map(printValidationError).join("\n");
}

export function printValidationError(error: ajv.ErrorObject): string {
  return error.dataPath !== ""
    ? JSON.stringify(error, null, 2)
    : "It " + error.message;
}
