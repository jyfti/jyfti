import { ExecutionEngine } from "./execution-engine.service";
import { StepExecutionService } from "./step-execution.service";
import { HttpService } from "./http.service";
import { EvaluationResolvementService } from "./evaluation-resolvement.service";
import { PathAdvancementService } from "./path-advancement.service";
import { StepResolvementService } from "./step-resolvement.service";

export function createEngine(): ExecutionEngine {
  return new ExecutionEngine(
    new StepExecutionService(new HttpService()),
    new EvaluationResolvementService(),
    new PathAdvancementService(),
    new StepResolvementService()
  );
}
