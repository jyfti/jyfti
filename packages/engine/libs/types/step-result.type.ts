import { Path } from "./path.type";
import { Evaluation } from "./evaluations.type";

export interface StepSuccess {
  name?: string;
  path: Path;
  evaluation: Evaluation;
}

export interface StepFailure {
  name?: string;
  path: Path;
  error: Error;
}

export type StepResult = StepSuccess | StepFailure;

export function isSuccess(stepResult: StepResult): stepResult is StepSuccess {
  return "evaluation" in stepResult;
}

export function isFailure(stepResult: StepResult): stepResult is StepFailure {
  return "error" in stepResult;
}
