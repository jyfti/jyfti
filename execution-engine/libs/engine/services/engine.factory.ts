import { ExecutionEngineService } from "./execution-engine.service";
import { SingleStepService } from "./single-step.service";
import { HttpService } from "./http.service";
import { EvaluationResolvementService } from "./evaluation-resolvement.service";
import { PathAdvancementService } from "./path-advancement.service";
import { StepResolvementService } from "./step-resolvement.service";

export function createExecutionEngine(): ExecutionEngineService {
  return new ExecutionEngineService(
    new SingleStepService(new HttpService()),
    new EvaluationResolvementService(),
    new PathAdvancementService(),
    new StepResolvementService()
  );
}
