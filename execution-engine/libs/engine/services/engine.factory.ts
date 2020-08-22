import { ExecutionService } from "./execution.service";
import { EvaluationResolvementService } from "./evaluation-resolvement.service";
import { PathAdvancementService } from "./path-advancement.service";
import { StepResolvementService } from "./step-resolvement.service";
import { Engine } from "./engine";
import { Workflow } from "../types";

export function createEngine(workflow: Workflow): Engine {
  const executionService = new ExecutionService(
    new EvaluationResolvementService(),
    new PathAdvancementService(),
    new StepResolvementService()
  );
  return new Engine(workflow, executionService);
}
