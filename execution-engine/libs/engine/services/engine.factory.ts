import { ExecutionService } from "./execution.service";
import { Engine } from "./engine";
import { Workflow } from "../types";

export function createEngine(workflow: Workflow): Engine {
  const executionService = new ExecutionService();
  return new Engine(workflow, executionService);
}
