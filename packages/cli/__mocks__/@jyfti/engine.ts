import { of } from "rxjs";
import { map } from "rxjs/operators";

const state = { path: [0], inputs: {}, evaluations: [] };

let variableMap = {};

export function __setVariableMap(pVariableMap: any): void {
  variableMap = pVariableMap;
}

let stepResult = { path: [], evaluation: "a" };

export function __setStepResult(pStepResult: any): void {
  stepResult = pStepResult;
}

export function createEngine() {
  return {
    complete: () => of(stepResult),
    isComplete: () => stepResult.path.length === 0,
    getOutput: () => ({ myOutput: "output" }),
    getVariableMap: () => variableMap,
    init: () => state,
    step: () => of(stepResult),
    toState: () => state,
    toStates: () => (stepResult$: any) => stepResult$.pipe(map(() => state)),
    validate: () => ({}),
  };
}
