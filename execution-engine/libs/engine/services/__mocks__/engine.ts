import { empty, of } from "rxjs";
import { VariableMap, StepResult } from "libs/engine/types";

const state = { path: [0], inputs: {}, evaluations: [] };

let variableMap: VariableMap = {};

export function __setVariableMap(pVariableMap: VariableMap): void {
  variableMap = pVariableMap;
}

let stepResult: StepResult = { path: [], evaluation: "a" };

export function __setStepResult(pStepResult: StepResult): void {
  stepResult = pStepResult;
}

export function createEngine() {
  return {
    complete: () => empty(),
    isComplete: () => stepResult.path.length === 0,
    getOutput: () => ({}),
    getVariableMap: () => variableMap,
    init: () => state,
    step: () => of(stepResult),
    toState: () => state,
    toStates: () => empty(),
    validate: () => ({}),
  };
}
