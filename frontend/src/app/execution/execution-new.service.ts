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

export type Evaluation = any;

@Injectable({
  providedIn: 'root',
})
export class ExecutionNewService {
  constructor(private http: HttpClient) {}

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
      return this.executeRequestStep(step.request, variables);
    } else if (!isNil(step?.expression)) {
      return this.executeExpressionStep(step.expression, variables);
    } else if (!isNil(step?.for)) {
      return this.executeLoop(step.for, variables);
    } else {
      return of({
        error:
          "Step does not contain any of 'request', 'expression' and 'for'.",
      });
    }
  }

  executeRequestStep(
    request: HttpRequestTemplate,
    variables: VariableMap
  ): Observable<Evaluation> {
    return of(this.createHttpRequest(request, variables)).pipe(
      flatMap((request) => this.request(request)),
      catchError((response) => of(response))
    );
  }

  executeExpressionStep(
    expression: JsonExpression,
    variables: VariableMap
  ): Observable<Evaluation> {
    return of(expression).pipe(
      map((expression) => jsone(expression, variables)),
      catchError((error) => of({ error: error.toString() }))
    );
  }

  private interpolate(variables: VariableMap, str: string) {
    const identifiers = Object.keys(variables);
    const values = Object.values(variables);
    return new Function(...identifiers, `return \`${str}\`;`)(...values);
  }

  private evaluate(variables: VariableMap, expression: string) {
    return isNil(expression) ? null : jsone(JSON.parse(expression), variables);
  }

  createHttpRequest(template: HttpRequestTemplate, variables: VariableMap) {
    return new HttpRequest(
      template.method as any,
      this.interpolate(variables, template.url),
      this.evaluate(variables, template.body),
      { headers: this.evaluate(variables, template.headers) }
    );
  }

  request(httpRequest: HttpRequest<any>): Observable<HttpResponse<any>> {
    return this.http.request(httpRequest).pipe(
      filter((httpEvent) => httpEvent instanceof HttpResponse),
      map((httpEvent) => httpEvent as HttpResponse<any>)
    );
  }
}
