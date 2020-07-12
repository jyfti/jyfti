import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import jsone from 'json-e';
import { isNil } from 'lodash';
import { mapKeys } from 'lodash/fp';
import { empty, Observable, of, range } from 'rxjs';
import {
  catchError,
  concatAll,
  concatMap,
  expand,
  filter,
  map,
  scan,
  share,
} from 'rxjs/operators';
import {
  finishExecution,
  stepExecution,
} from '../ngrx/dataflow-execution.actions';
import { Dataflow } from '../types/dataflow.type';
import { ExecutionScope } from '../types/execution-scope.type';
import { HttpRequestTemplate } from '../types/http-request-template.type';
import { Step } from '../types/step.type';
import { VariableMap } from '../types/variabe-map.type';

@Injectable({
  providedIn: 'root',
})
export class ExecutionService {
  constructor(private http: HttpClient) {}

  executeDataflow(dataflow: Dataflow): Observable<Action> {
    return range(0, dataflow.steps.length).pipe(
      scan(
        (acc, index) =>
          acc.pipe(
            share(),
            ofType(stepExecution),
            filter((action) => action.scope.stepIndex === index),
            concatMap((action) => this.executeStep(action.scope)(action.scope))
          ),
        of(
          stepExecution({
            scope: {
              steps: dataflow.steps,
              stepIndex: 0,
              variables: {},
            },
          })
        )
      ),
      concatAll()
    );
  }

  executeStep(scope: ExecutionScope): (ExecutionScope) => Observable<Action> {
    const step = scope.steps[scope.stepIndex];
    if (!isNil(step?.request)) {
      return this.executeRequestStep(step);
    } else if (!isNil(step?.expression)) {
      return this.executeExpressionStep(step);
    } else if (!isNil(step?.for)) {
      return this.executeForLoopStep(step);
    } else {
      return this.executionFailure(step);
    }
  }

  private executeRequestStep(
    step: Step
  ): (ExecutionScope) => Observable<Action> {
    return (scope) =>
      this.request(
        this.createHttpRequest(step.request, this.extractVariableMap(scope))
      ).pipe(
        catchError((response) => of(response)),
        map((evaluation) => this.addEvaluationToScope(scope, evaluation)),
        map((newScope) => this.createNextStep(newScope))
      );
  }

  private executeExpressionStep(
    step: Step
  ): (ExecutionScope) => Observable<Action> {
    return (scope) =>
      of(step.expression).pipe(
        map((expression) => jsone(expression, this.extractVariableMap(scope))),
        catchError((error) => of({ error: error.toString() })),
        map((evaluation) => this.addEvaluationToScope(scope, evaluation)),
        map((newScope) => this.createNextStep(newScope))
      );
  }

  private executeForLoopStep(
    step: Step
  ): (ExecutionScope) => Observable<Action> {
    return (scope) =>
      range(0, step.for.do.length).pipe(
        scan(
          (acc, index) =>
            acc.pipe(
              share(),
              ofType(stepExecution),
              filter((action) => action.scope.stepIndex === index),
              concatMap((action) => this.executeStep(action.scope)(action.scope))
            ),
          of(
            stepExecution({
              scope: {
                stepIndex: 0,
                steps: step.for.do,
                variables: {},
              },
            })
          )
        ),
        concatAll(),
        map((action) => {
          if (action.type === finishExecution.type) {
            // TODO: Evaluate `return` and add to scope
            return this.createNextStep(scope);
          } else if (action.type === stepExecution.type) {
            return stepExecution({
              scope: {
                ...scope,
                subScope: (action as any).scope,
              },
            });
          }
        })
      );
  }

  private executionFailure(step: Step): (ExecutionScope) => Observable<Action> {
    return (scope) =>
      of({
        error:
          "Step does not contain any of 'request', 'expression' and 'for'.",
      }).pipe(
        map((evaluation) => this.addEvaluationToScope(scope, evaluation)),
        map((newScope) => this.createNextStep(newScope))
      );
  }

  addEvaluationToScope(scope: ExecutionScope, evaluation: any): ExecutionScope {
    return {
      ...scope,
      variables: {
        ...scope.variables,
        [scope.stepIndex]: evaluation,
      },
    };
  }

  extractVariableMap(scope: ExecutionScope): VariableMap {
    // TODO: This does not consider subscopes yet
    return mapKeys(
      (stepIndex) => scope.steps[stepIndex].assignTo,
      scope.variables
    );
  }

  createNextStep(scope: ExecutionScope): Action {
    return scope.stepIndex + 1 === scope.steps.length
      ? finishExecution({ scope })
      : stepExecution({
          scope: {
            ...scope,
            stepIndex: scope.stepIndex + 1,
          },
        });
  }

  private interpolate(variables: VariableMap, str: string) {
    const identifiers = Object.keys(variables);
    const values = Object.values(variables);
    return new Function(...identifiers, `return \`${str}\`;`)(...values);
  }

  createHttpRequest(template: HttpRequestTemplate, variables: VariableMap) {
    return new HttpRequest(
      template.method as any,
      this.interpolate(variables, template.url),
      jsone(JSON.parse(template.body), variables),
      { headers: jsone(JSON.parse(template.headers), variables) }
    );
  }

  request(httpRequest: HttpRequest<any>): Observable<HttpResponse<any>> {
    return this.http.request(httpRequest).pipe(
      filter((httpEvent) => httpEvent instanceof HttpResponse),
      map((httpEvent) => httpEvent as HttpResponse<any>)
    );
  }
}
