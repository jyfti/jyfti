import { Observable, OperatorFunction } from "rxjs";
import { scan } from "rxjs/operators";

import { Workflow } from "../types/workflow.type";
import { EvaluationResolvementService } from "./evaluation-resolvement.service";
import { PathAdvancementService } from "./path-advancement.service";
import { StepExecutionService } from "./step-execution.service";
import { StepResolvementService } from "./step-resolvement.service";
import { StepResult } from "libs/engine/types/step-result.type";
import { State } from "libs/engine/types/state.type";
import { Evaluation } from "../types/evaluations.type";

export class ExecutionService {
  constructor(
    private stepExecutionService: StepExecutionService,
    private evaluationResolvementService: EvaluationResolvementService,
    private pathAdvancementService: PathAdvancementService,
    private stepResolvementService: StepResolvementService
  ) {}

  nextState(workflow: Workflow, state: State, evaluation: Evaluation): State {
    const nextPath = this.pathAdvancementService.advancePath(
      workflow,
      state.path,
      this.stepExecutionService.toVariableMap(workflow.steps, state.evaluations)
    );
    const nextEvaluations = this.evaluationResolvementService.addEvaluation(
      state.path,
      state.evaluations,
      evaluation
    );
    return {
      path: nextPath,
      evaluations: nextEvaluations,
    };
  }

  nextStep(workflow: Workflow, state: State): Observable<Evaluation> {
    return this.stepExecutionService.executeStep(
      this.stepResolvementService.resolveStep(workflow, state.path),
      this.evaluationResolvementService.resolveEvaluation(
        state.evaluations,
        state.path
      ),
      this.stepExecutionService.toVariableMap(workflow.steps, state.evaluations)
    );
  }
}
