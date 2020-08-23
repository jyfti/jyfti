import { empty } from "rxjs";
import { VariableMap } from "libs/engine/types";

const state = { path: [0], inputs: {}, evaluations: [] };

let variableMap: VariableMap = {};

export function __setVariableMap(pVariableMap: VariableMap): void {
  variableMap = pVariableMap;
}

export function createEngine() {
  return new EngineStub();
}

class EngineStub {
  complete() {
    return empty();
  }
  isComplete() {
    return true;
  }
  getOutput() {
    return {};
  }
  getVariableMap() {
    return variableMap;
  }
  init() {
    return state;
  }
  step() {
    return empty();
  }
  toState() {
    return state;
  }
  toStates() {
    return () => empty();
  }
  validate() {
    return {};
  }
}
