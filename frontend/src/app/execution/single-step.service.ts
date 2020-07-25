import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jsone from 'json-e';
import {
  filter as _filter,
  flow,
  isArray,
  isNil,
  reduce as _reduce,
  zip,
} from 'lodash/fp';
import { Observable, of } from 'rxjs';
import { catchError, filter, flatMap, map } from 'rxjs/operators';

import { HttpRequestTemplate } from '../types/http-request-template.type';
import { JsonExpression, Step } from '../types/step.type';
import { VariableMap } from '../types/variable-map.type';
import { Evaluations } from './execution-engine.service';
import { Evaluation } from './execution.service';

@Injectable({
  providedIn: 'root',
})
export class SingleStepService {
  constructor(private http: HttpClient) {}

  executeStep(
    step: Step,
    localEvaluations: Evaluation | Evaluations,
    variables: VariableMap
  ): Observable<Evaluation> {
    if (!isNil(step?.request)) {
      return this.executeRequestStep(step.request, variables);
    } else if (!isNil(step?.expression)) {
      return this.executeExpressionStep(step.expression, variables);
    } else if (!isNil(step?.for)) {
      return this.evaluateLoopReturn(localEvaluations, step);
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
        this.toVariableMap(step.for.do, loopIterationEvaluation)
      )
      .map((loopIterationVariables) => loopIterationVariables[step.for.return]);
    return of(loopReturn);
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

  toVariableMap(steps: Step[], evaluations: Evaluation[]): VariableMap {
    return flow(
      _filter(([step, evaluation]) => !isNil(step) && !isNil(evaluation)),
      _reduce(
        (variables: VariableMap, [step, evaluation]) => ({
          ...variables,
          [step.assignTo]: evaluation,
        }),
        {}
      )
    )(zip(steps, evaluations));
  }
}
