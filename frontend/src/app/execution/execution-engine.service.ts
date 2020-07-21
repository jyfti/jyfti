import { Injectable } from '@angular/core';
import { isNil, last, dropRight, concat } from 'lodash/fp';
import { Observable, of } from 'rxjs';
import { flatMap, startWith } from 'rxjs/operators';

import { Dataflow } from '../types/dataflow.type';
import { Step } from '../types/step.type';
import { VariableMap } from '../types/variable-map.type';
import { Evaluation } from './execution.service';
import { SingleStepService } from './single-step.service';

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
  constructor(private singleStepService: SingleStepService) {}

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
        const newPath = this.advancePath(dataflow, path);
        const newEvaluations = this.addEvaluation(
          path,
          evaluations,
          evaluation
        );
        return !newPath
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
    return this.executeStep(
      dataflow.steps[last(path)],
      this.singleStepService.toVariableMap(dataflow.steps, evaluations)
    );
  }

  // TODO: Advance path recursively
  advancePath(dataflow: Dataflow, path: Path): Path {
    return last(path) + 1 < dataflow.steps.length
      ? concat(dropRight(1)(path), [last(path) + 1])
      : null;
  }

  addEvaluation(
    path: Path,
    evaluations: Evaluations,
    evaluation: Evaluation
  ): Evaluations {
    return evaluations.concat([evaluation]);
  }

  executeStep(step: Step, variables: VariableMap): Observable<Evaluation> {
    if (!isNil(step?.request)) {
      return this.singleStepService.executeRequestStep(step.request, variables);
    } else if (!isNil(step?.expression)) {
      return this.singleStepService.executeExpressionStep(
        step.expression,
        variables
      );
    } else {
      return of({
        error:
          "Step does not contain any of 'request', 'expression' and 'for'.",
      });
    }
  }
}
