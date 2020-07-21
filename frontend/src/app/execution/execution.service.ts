import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jsone from 'json-e';
import { isNil, zip, reduce as _reduce, merge } from 'lodash/fp';
import { from, Observable, of } from 'rxjs';
import {
  catchError,
  filter,
  flatMap,
  map,
  reduce,
  concatAll,
  concatMap,
  toArray,
} from 'rxjs/operators';

import { HttpRequestTemplate } from '../types/http-request-template.type';
import { Step, ForLoop, JsonExpression } from '../types/step.type';
import { VariableMap } from '../types/variable-map.type';
import { Dataflow } from '../types/dataflow.type';
import { SingleStepService } from './single-step.service';

export type Evaluation = any;

@Injectable({
  providedIn: 'root',
})
export class ExecutionService {
  constructor(private singleStepService: SingleStepService) {}

  executeDataflow(dataflow: Dataflow): Observable<Evaluation[]> {
    return this.executeBlock(dataflow.steps, {});
  }

  executeBlock(
    steps: Step[],
    variables: VariableMap
  ): Observable<Evaluation[]> {
    return from(steps).pipe(
      reduce(
        (evaluations$, step) =>
          evaluations$.pipe(
            flatMap((evaluations) =>
              this.executeStep(
                step,
                merge(this.toVariableMap(steps, evaluations), variables)
              ).pipe(map((evaluation) => evaluations.concat([evaluation])))
            )
          ),
        of([])
      ),
      concatAll()
    );
  }

  toVariableMap(steps: Step[], evaluations: Evaluation[]): VariableMap {
    return _reduce(
      (variables: VariableMap, [step, evaluation]) => ({
        ...variables,
        [step.assignTo]: evaluation,
      }),
      {}
    )(zip(steps, evaluations));
  }

  executeLoop(
    forLoop: ForLoop,
    variables: VariableMap
  ): Observable<Evaluation> {
    return from(variables[forLoop.in]).pipe(
      map((loopVariable) => ({ ...variables, [forLoop.const]: loopVariable })),
      concatMap((loopVariables) =>
        this.executeBlock(forLoop.do, loopVariables).pipe(
          map((evaluations) => this.toVariableMap(forLoop.do, evaluations)),
          map((loopStepsVariables) => merge(loopVariables, loopStepsVariables)),
          map((allVariables) => allVariables[forLoop.return])
        )
      ),
      toArray()
    );
  }

  executeStep(step: Step, variables: VariableMap): Observable<Evaluation> {
    if (!isNil(step?.request)) {
      return this.singleStepService.executeRequestStep(step.request, variables);
    } else if (!isNil(step?.expression)) {
      return this.singleStepService.executeExpressionStep(
        step.expression,
        variables
      );
    } else if (!isNil(step?.for)) {
      return this.executeLoop(step.for, variables);
    } else {
      return of({
        error:
          "Step does not contain any of 'request', 'expression' and 'for'.",
      });
    }
  }
}
