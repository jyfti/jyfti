import chalk from "chalk";
import { ErrorObject } from "ajv";
import { StepResult, InputErrors, Inputs } from "../engine/types";

export function printOutput(output: any): string {
  return typeof output === "string" ? output : printJson(output);
}

export function printJson(json: any): string {
  return JSON.stringify(json, null, 2);
}

export function printValue(message: string | undefined): string {
  return chalk.yellow(message);
}

export function printError(message: string | undefined): string {
  return chalk.red(message);
}

export function printSuccess(message: string | undefined): string {
  return chalk.green(message);
}

export function printStepResult(
  verbose: boolean,
  stepResult: StepResult
): string {
  return verbose
    ? printJson(stepResult)
    : "Completed " + printSuccess(JSON.stringify(stepResult.path, null, 0));
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
  errors: ErrorObject[]
): string {
  return (
    `Input: ${printValue(fieldName)}\n` +
    `Value: ${printValue(JSON.stringify(value, null, 0))}\n` +
    `${printValidationErrors(errors)}`
  );
}

export function printValidationErrors(errors: ErrorObject[]): string {
  return errors.map(printValidationError).join("\n");
}

export function printValidationError(error: ErrorObject): string {
  return error.dataPath !== "" ? printJson(error) : "It " + error.message;
}
