import chalk from "chalk";
import logSymbols from "log-symbols";
import { ErrorObject } from "ajv";
import { StepResult, Inputs, isSuccess, Step } from "@jyfti/engine";

export function printOutput(output: unknown): string {
  return typeof output === "string" ? output : printJson(output);
}

export function printJson(json: unknown): string {
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

export function printStepResult(step: Step, stepResult: StepResult): string {
  if (isSuccess(stepResult)) {
    return (
      logSymbols.success +
      " " +
      JSON.stringify(stepResult.path, null, 0) +
      (step.name ? " " + step.name : "")
    );
  } else {
    return (
      logSymbols.error +
      " " +
      JSON.stringify(stepResult.path, null, 0) +
      (step.name ? " " + step.name : "") +
      " " +
      printError(stepResult.error)
    );
  }
}

export function printAllErrors(
  errorMap: Record<string, ErrorObject[]>,
  inputs: Inputs
): string {
  return Object.keys(errorMap)
    .map((fieldName) =>
      printInputErrors(fieldName, inputs[fieldName], errorMap[fieldName])
    )
    .join("\n\n");
}

export function printInputErrors(
  fieldName: string,
  value: unknown,
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
