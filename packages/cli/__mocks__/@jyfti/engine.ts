import { of, throwError } from "rxjs";
import { map } from "rxjs/operators";
import { VariableMap, StepResult, Engine } from "@jyfti/engine";
import { Observable } from "rxjs";

const state = { path: [0], inputs: {}, evaluations: [] };

let variableMap: VariableMap = {};

export function __setVariableMap(pVariableMap: VariableMap): void {
  variableMap = pVariableMap;
}

let stepResult: StepResult = { path: [], evaluation: "a" };

export function __setStepResult(pStepResult: StepResult): void {
  stepResult = pStepResult;
}

export function createEngine(): Partial<Engine> {
  return {
    complete: () =>
      stepResult ? of(stepResult) : throwError("Something went wrong."),
    isComplete: () => stepResult?.path?.length === 0,
    getOutput: () => ({ myOutput: "output" }),
    getVariableMap: () => variableMap,
    init: () => state,
    step: () =>
      stepResult ? of(stepResult) : throwError("Something went wrong."),
    transition: () => state,
    transitionFrom: () => (stepResult$: Observable<StepResult>) =>
      stepResult$.pipe(map(() => state)),
    validate: () => ({}),
  };
}
