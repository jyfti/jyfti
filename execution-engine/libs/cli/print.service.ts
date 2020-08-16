import chalk from "chalk";
import ajv from "ajv";
import { StepResult, InputErrors, Inputs } from "../engine/types";

export function printJson(json: any): string {
  return JSON.stringify(json, null, 2);
}

export function printStepResult(
  verbose: boolean,
  stepResult: StepResult
): string {
  return verbose
    ? printJson(stepResult)
    : "Completed " + chalk.green(stepResult.path);
}

export function printAllInputErrors(
  inputErrors: InputErrors,
  inputs: Inputs
): string {
  return Object.keys(inputErrors)
    .map((fieldName) =>
      printInputErrors(fieldName, inputs[fieldName], inputErrors[fieldName])
    )
    .join("\n\n");
}

export function printInputErrors(
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
  return error.dataPath !== "" ? printJson(error) : "It " + error.message;
}
