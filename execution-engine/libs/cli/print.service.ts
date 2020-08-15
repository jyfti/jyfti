import chalk from "chalk";
import { StepResult } from "../engine/types/step-result.type";
import ajv from "ajv";

export function printStepResult(
  verbose: boolean,
  stepResult: StepResult
): string {
  return verbose
    ? JSON.stringify(stepResult, null, 2)
    : "Completed " + chalk.green(stepResult.path);
}

export function printValidationErrors(errors: ajv.ErrorObject[]): string {
  return JSON.stringify(errors, null, 2);
}
