import chalk from "chalk";
import { StepResult } from "../engine/types/step-result.type";

export function printStepResult(
  verbose: boolean,
  stepResult: StepResult
): string {
  return verbose
    ? JSON.stringify(stepResult, null, 2)
    : "Completed " + chalk.green(stepResult.path);
}
