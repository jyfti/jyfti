import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Evaluation } from './execution.service';
import { Dataflow } from '../types/dataflow.type';
import { SingleStepService } from './single-step.service';
import { Step } from '../types/step.type';
import { VariableMap } from '../types/variable-map.type';
import { isNil } from 'lodash/fp';
import { map, flatMap, startWith, filter } from 'rxjs/operators';

export type Path = number;

export interface PathedEvaluation {
  path: Path;
  evaluation: Evaluation;
}

@Injectable({
  providedIn: 'root',
})
export class ExecutionEngineService {
  constructor(private singleStepService: SingleStepService) {}

  executeDataflow(dataflow: Dataflow): Observable<PathedEvaluation> {
    return this.executeTicksFrom(dataflow, 0, []);
  }

  executeTicksFrom(
    dataflow: Dataflow,
    path: Path,
    evaluations: Evaluation[]
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
    evaluations: Evaluation[]
  ): Observable<Evaluation> {
    return this.executeStep(
      dataflow.steps[path],
      this.singleStepService.toVariableMap(dataflow.steps, evaluations)
    );
  }

  advancePath(dataflow: Dataflow, path: Path): Path {
    return path + 1 < dataflow.steps.length ? path + 1 : null;
  }

  addEvaluation(
    path: Path,
    evaluations: Evaluation[],
    evaluation: Evaluation
  ): Evaluation[] {
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
