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
    return this.executeTicksFrom(dataflow, [0], []);
  }

  executeTicksFrom(
    dataflow: Dataflow,
    path: Path,
    evaluations: Evaluations
  ): Observable<PathedEvaluation> {
    return this.tick(dataflow, path, evaluations).pipe(
      flatMap((evaluation) => {
        const newEvaluations = this.evaluationResolvementService.addEvaluation(
          path,
          evaluations,
          evaluation
        );
        const newPath = this.pathAdvancementService.advancePath(
          dataflow,
          path,
          this.singleStepService.toVariableMap(dataflow.steps, evaluations)
        );
        return newPath.length == 0
          ? of({ path, evaluation })
          : this.executeTicksFrom(dataflow, newPath, newEvaluations).pipe(
              startWith({ path, evaluation })
            );
      })
    );
  }

  tick(
    dataflow: Dataflow,
    path: Path,
    evaluations: Evaluations
  ): Observable<Evaluation> {
    return this.singleStepService.executeStep(
      this.stepResolvementService.resolveStep(dataflow, path),
      this.evaluationResolvementService.resolveEvaluation(evaluations, path),
      this.singleStepService.toVariableMap(dataflow.steps, evaluations)
    );
  }
}
