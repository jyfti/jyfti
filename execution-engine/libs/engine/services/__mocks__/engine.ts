import { Engine } from "../engine";
import { empty } from "rxjs";
import { Workflow, VariableMap } from "../../../engine/types";

const state = { path: [0], inputs: {}, evaluations: [] };

export function createEngine(
  workflow: Workflow,
  environment: VariableMap
): Engine {
  return new EngineStub(workflow, environment);
}

class EngineStub extends Engine {
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
    return {};
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
