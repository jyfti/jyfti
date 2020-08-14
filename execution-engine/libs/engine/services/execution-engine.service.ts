import { empty, Observable, of } from "rxjs";
import { flatMap, startWith, map } from "rxjs/operators";

import { Workflow } from "../types/workflow.type";
import { EvaluationResolvementService } from "./evaluation-resolvement.service";
import { Evaluation } from "./execution.service";
import { PathAdvancementService } from "./path-advancement.service";
import { SingleStepService } from "./single-step.service";
import { StepResolvementService } from "./step-resolvement.service";
import { PathedEvaluation } from "libs/engine/types/pathed-evaluation.type";
import { TickState } from "libs/engine/types/tick-state.type";

export class ExecutionEngineService {
  constructor(
    private singleStepService: SingleStepService,
    private evaluationResolvementService: EvaluationResolvementService,
    private pathAdvancementService: PathAdvancementService,
    private stepResolvementService: StepResolvementService
  ) {}

  executeWorkflow(workflow: Workflow): Observable<PathedEvaluation> {
    return this.executeTicksFrom(workflow, { path: [0], evaluations: [] });
  }

  executeTicksFrom(
    workflow: Workflow,
    tickState: TickState
  ): Observable<PathedEvaluation> {
    return this.executeTick(workflow, tickState).pipe(
      flatMap((pathedEvaluation) => {
        const nextTickState = this.nextTickState(
          workflow,
          tickState,
          pathedEvaluation.evaluation
        );
        const continuingTicks =
          nextTickState.path.length == 0
            ? empty()
            : this.executeTicksFrom(workflow, nextTickState);
        return continuingTicks.pipe(startWith(pathedEvaluation));
      })
    );
  }

  executeTick(
    workflow: Workflow,
    tickState: TickState
  ): Observable<PathedEvaluation> {
    return this.nextStep(workflow, tickState).pipe(
      map((evaluation) => ({ path: tickState.path, evaluation }))
    );
  }

  nextTickState(
    workflow: Workflow,
    tickState: TickState,
    evaluation: Evaluation
  ): TickState {
    const nextPath = this.pathAdvancementService.advancePath(
      workflow,
      tickState.path,
      this.singleStepService.toVariableMap(
        workflow.steps,
        tickState.evaluations
      )
    );
    const nextEvaluations = this.evaluationResolvementService.addEvaluation(
      tickState.path,
      tickState.evaluations,
      evaluation
    );
    return {
      path: nextPath,
      evaluations: nextEvaluations,
    };
  }

  nextStep(workflow: Workflow, tickState: TickState): Observable<Evaluation> {
    return this.singleStepService.executeStep(
      this.stepResolvementService.resolveStep(workflow, tickState.path),
      this.evaluationResolvementService.resolveEvaluation(
        tickState.evaluations,
        tickState.path
      ),
      this.singleStepService.toVariableMap(
        workflow.steps,
        tickState.evaluations
      )
    );
  }
}
