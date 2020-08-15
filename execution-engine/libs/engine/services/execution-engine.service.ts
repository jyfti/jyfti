import { empty, Observable, of } from "rxjs";
import { flatMap, startWith, map } from "rxjs/operators";

import { Workflow } from "../types/workflow.type";
import { EvaluationResolvementService } from "./evaluation-resolvement.service";
import { Evaluation } from "./execution.service";
import { PathAdvancementService } from "./path-advancement.service";
import { SingleStepService } from "./single-step.service";
import { StepResolvementService } from "./step-resolvement.service";
import { PathedEvaluation } from "libs/engine/types/pathed-evaluation.type";
import { State } from "libs/engine/types/state.type";

export class ExecutionEngineService {
  constructor(
    private singleStepService: SingleStepService,
    private evaluationResolvementService: EvaluationResolvementService,
    private pathAdvancementService: PathAdvancementService,
    private stepResolvementService: StepResolvementService
  ) {}

  executeWorkflow(workflow: Workflow): Observable<PathedEvaluation> {
    return this.executeStepFrom(workflow, { path: [0], evaluations: [] });
  }

  executeStepFrom(
    workflow: Workflow,
    state: State
  ): Observable<PathedEvaluation> {
    return this.executeStep(workflow, state).pipe(
      flatMap((pathedEvaluation) => {
        const nextState = this.nextState(
          workflow,
          state,
          pathedEvaluation.evaluation
        );
        const continuingSteps =
          nextState.path.length == 0
            ? empty()
            : this.executeStepFrom(workflow, nextState);
        return continuingSteps.pipe(startWith(pathedEvaluation));
      })
    );
  }

  executeStep(workflow: Workflow, state: State): Observable<PathedEvaluation> {
    return this.nextStep(workflow, state).pipe(
      map((evaluation) => ({ path: state.path, evaluation }))
    );
  }

  nextState(workflow: Workflow, state: State, evaluation: Evaluation): State {
    const nextPath = this.pathAdvancementService.advancePath(
      workflow,
      state.path,
      this.singleStepService.toVariableMap(workflow.steps, state.evaluations)
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
    return this.singleStepService.executeStep(
      this.stepResolvementService.resolveStep(workflow, state.path),
      this.evaluationResolvementService.resolveEvaluation(
        state.evaluations,
        state.path
      ),
      this.singleStepService.toVariableMap(workflow.steps, state.evaluations)
    );
  }
}
