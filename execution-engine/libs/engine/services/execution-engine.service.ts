import {
  empty,
  Observable,
  MonoTypeOperatorFunction,
  OperatorFunction,
} from "rxjs";
import { flatMap, startWith, map, scan } from "rxjs/operators";

import { Workflow } from "../types/workflow.type";
import { EvaluationResolvementService } from "./evaluation-resolvement.service";
import { PathAdvancementService } from "./path-advancement.service";
import { SingleStepService } from "./single-step.service";
import { StepResolvementService } from "./step-resolvement.service";
import { PathedEvaluation } from "libs/engine/types/pathed-evaluation.type";
import { State } from "libs/engine/types/state.type";
import { Evaluation } from "../types/evaluations.type";

export class ExecutionEngine {
  constructor(
    private singleStepService: SingleStepService,
    private evaluationResolvementService: EvaluationResolvementService,
    private pathAdvancementService: PathAdvancementService,
    private stepResolvementService: StepResolvementService
  ) {}

  run(workflow: Workflow): Observable<PathedEvaluation> {
    return this.complete(workflow, { path: [0], evaluations: [] });
  }

  complete(workflow: Workflow, state: State): Observable<PathedEvaluation> {
    return this.step(workflow, state).pipe(
      flatMap((pathedEvaluation) => {
        const nextState = this.nextState(
          workflow,
          state,
          pathedEvaluation.evaluation
        );
        const continuingSteps =
          nextState.path.length == 0
            ? empty()
            : this.complete(workflow, nextState);
        return continuingSteps.pipe(startWith(pathedEvaluation));
      })
    );
  }

  step(workflow: Workflow, state: State): Observable<PathedEvaluation> {
    return this.nextStep(workflow, state).pipe(
      map((evaluation) => ({ path: state.path, evaluation }))
    );
  }

  toStates(workflow: Workflow): OperatorFunction<PathedEvaluation, State> {
    return (pathedEvaluation$) =>
      pathedEvaluation$.pipe(
        scan<PathedEvaluation, State>(
          (state, pathedEvaluation) =>
            this.nextState(workflow, state, pathedEvaluation.evaluation),
          { path: [0], evaluations: [] }
        )
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
