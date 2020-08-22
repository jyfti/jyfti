import { Engine } from "./engine";
import { Workflow } from "../types";

export function createEngine(workflow: Workflow): Engine {
  return new Engine(workflow);
}
