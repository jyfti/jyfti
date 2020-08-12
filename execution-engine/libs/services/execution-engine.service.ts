import { empty, Observable, of } from "rxjs";
import { flatMap, startWith, map } from "rxjs/operators";

import { Dataflow } from "../types/dataflow.type";
import { EvaluationResolvementService } from "./evaluation-resolvement.service";
import { Evaluation } from "./execution.service";
import { PathAdvancementService } from "./path-advancement.service";
import { SingleStepService } from "./single-step.service";
import { StepResolvementService } from "./step-resolvement.service";
import { PathedEvaluation } from "libs/types/pathed-evaluation.type";
import { TickState } from "libs/types/tick-state.type";

export class ExecutionEngineService {
  constructor(
    private singleStepService: SingleStepService,
    private evaluationResolvementService: EvaluationResolvementService,
    private pathAdvancementService: PathAdvancementService,
    private stepResolvementService: StepResolvementService
  ) {}

  executeDataflow(dataflow: Dataflow): Observable<PathedEvaluation> {
    return this.executeTicksFrom({ dataflow, path: [0], evaluations: [] });
  }

  executeTicksFrom(tickState: TickState): Observable<PathedEvaluation> {
    return this.executeTick(tickState).pipe(
      flatMap((pathedEvaluation) => {
        const nextTickState = this.nextTickState(
          tickState,
          pathedEvaluation.evaluation
        );
        const continuingTicks =
          nextTickState.path.length == 0
            ? empty()
            : this.executeTicksFrom(nextTickState);
        return continuingTicks.pipe(startWith(pathedEvaluation));
      })
    );
  }

  executeTick(tickState: TickState): Observable<PathedEvaluation> {
    return this.nextStep(tickState).pipe(
      map((evaluation) => ({ path: tickState.path, evaluation }))
    );
  }

  nextTickState(tickState: TickState, evaluation: Evaluation): TickState {
    const nextPath = this.pathAdvancementService.advancePath(
      tickState.dataflow,
      tickState.path,
      this.singleStepService.toVariableMap(
        tickState.dataflow.steps,
        tickState.evaluations
      )
    );
    const nextEvaluations = this.evaluationResolvementService.addEvaluation(
      tickState.path,
      tickState.evaluations,
      evaluation
    );
    return {
      dataflow: tickState.dataflow,
      path: nextPath,
      evaluations: nextEvaluations,
    };
  }

  nextStep(tickState: TickState): Observable<Evaluation> {
    return this.singleStepService.executeStep(
      this.stepResolvementService.resolveStep(
        tickState.dataflow,
        tickState.path
      ),
      this.evaluationResolvementService.resolveEvaluation(
        tickState.evaluations,
        tickState.path
      ),
      this.singleStepService.toVariableMap(
        tickState.dataflow.steps,
        tickState.evaluations
      )
    );
  }
}
