import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { flatMap, startWith } from 'rxjs/operators';

import { Dataflow } from '../types/dataflow.type';
import { EvaluationResolvementService } from './evaluation-resolvement.service';
import { Evaluation } from './execution.service';
import { PathAdvancementService } from './path-advancement.service';
import { SingleStepService } from './single-step.service';
import { StepResolvementService } from './step-resolvement.service';

export type Path = number[];

export interface PathedEvaluation {
  path: Path;
  evaluation: Evaluation;
}

export type Evaluations = (Evaluation | Evaluations)[];

interface TickState {
  dataflow: Dataflow;
  path: Path;
  evaluations: Evaluations;
}

@Injectable({
  providedIn: 'root',
})
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
    return this.nextStep(tickState).pipe(
      flatMap((evaluation) => {
        const newEvaluations = this.evaluationResolvementService.addEvaluation(
          tickState.path,
          tickState.evaluations,
          evaluation
        );
        const newPath = this.pathAdvancementService.advancePath(
          tickState.dataflow,
          tickState.path,
          this.singleStepService.toVariableMap(
            tickState.dataflow.steps,
            tickState.evaluations
          )
        );
        return newPath.length == 0
          ? of({ path: tickState.path, evaluation })
          : this.executeTicksFrom({
              dataflow: tickState.dataflow,
              path: newPath,
              evaluations: newEvaluations,
            }).pipe(startWith({ path: tickState.path, evaluation }));
      })
    );
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
