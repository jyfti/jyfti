import chalk from "chalk";
import { PathedEvaluation } from "../engine/types/pathed-evaluation.type";

export function printPathedEvaluation(
  verbose: boolean,
  pathedEvaluation: PathedEvaluation
): string {
  return verbose
    ? JSON.stringify(pathedEvaluation, null, 2)
    : "Completed " + chalk.green(pathedEvaluation.path);
}
