import { of, Observable } from "rxjs";
import { VariableMap, StepResult } from "../../types";
import { map } from "rxjs/operators";

const state = { path: [0], inputs: {}, evaluations: [] };

let variableMap: VariableMap = {};

export function __setVariableMap(pVariableMap: VariableMap): void {
  variableMap = pVariableMap;
}

let stepResult: StepResult = { path: [], evaluation: "a" };

export function __setStepResult(pStepResult: StepResult): void {
  stepResult = pStepResult;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createEngine(): any {
  return {
    complete: () => of(stepResult),
    isComplete: () => stepResult.path.length === 0,
    getOutput: () => ({ myOutput: "output" }),
    getVariableMap: () => variableMap,
    init: () => state,
    step: () => of(stepResult),
    transition: () => state,
    transitionFrom: () => (stepResult$: Observable<StepResult>) =>
      stepResult$.pipe(map(() => state)),
    validate: () => ({}),
  };
}
