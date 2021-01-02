import { Path } from "./path.type";
import { Evaluation } from "./evaluations.type";
import { JsonSchema } from "./json-schema.type";

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

export interface StepRequire {
  name?: string;
  path: Path;
  require: Record<string, JsonSchema>;
}

export type StepResult = StepSuccess | StepFailure | StepRequire;

export function isSuccess(stepResult: StepResult): stepResult is StepSuccess {
  return "evaluation" in stepResult;
}

export function isFailure(stepResult: StepResult): stepResult is StepFailure {
  return "error" in stepResult;
}

export function isRequire(stepResult: StepResult): stepResult is StepRequire {
  return "require" in stepResult;
}
