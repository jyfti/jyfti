import { Injectable } from '@angular/core';
import { isNil, last, has, tail, concat } from 'lodash/fp';
import { Observable, of } from 'rxjs';
import { flatMap, startWith } from 'rxjs/operators';

import { Dataflow } from '../types/dataflow.type';
import { Step } from '../types/step.type';
import { VariableMap } from '../types/variable-map.type';
import { Evaluation } from './execution.service';
import { SingleStepService } from './single-step.service';
import { ExecutionPathService } from './execution-path.service';
import { isArray } from 'lodash';
import { PathAdvancementService } from './path-advancement.service';

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
    private executionPathService: ExecutionPathService,
    private pathAdvancementService: PathAdvancementService
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
        const newEvaluations = this.executionPathService.addEvaluation(
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
    return this.executeStep(
      this.executionPathService.resolveStep(dataflow, path),
      this.executionPathService.resolveEvaluation(evaluations, path),
      this.singleStepService.toVariableMap(dataflow.steps, evaluations)
    );
  }

  executeStep(
    step: Step,
    localEvaluations: Evaluation | Evaluations,
    variables: VariableMap
  ): Observable<Evaluation> {
    if (!isNil(step?.request)) {
      return this.singleStepService.executeRequestStep(step.request, variables);
    } else if (!isNil(step?.expression)) {
      return this.singleStepService.executeExpressionStep(
        step.expression,
        variables
      );
    } else if (!isNil(step?.for)) {
      return this.evaluateLoopReturn(localEvaluations, step);
    } else {
      return of({
        error:
          "Step does not contain any of 'request', 'expression' and 'for'.",
      });
    }
  }

  private evaluateLoopReturn(
    localEvaluations: Evaluation | Evaluations,
    step: Step
  ): Observable<Evaluation[]> {
    if (!isNil(localEvaluations) && !isArray(localEvaluations)) {
      throw new Error(
        'Expected list of loop iteration evaluations, but got a single evaluation'
      );
    }
    const loopReturn: Evaluation[] = (localEvaluations || [])
      .map((loopIterationEvaluation) =>
        this.singleStepService.toVariableMap(
          step.for.do,
          loopIterationEvaluation
        )
      )
      .map((loopIterationVariables) => loopIterationVariables[step.for.return]);
    return of(loopReturn);
  }
}
