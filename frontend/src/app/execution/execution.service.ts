import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import jsone from 'json-e';
import { isNil } from 'lodash';
import { mapKeys } from 'lodash/fp';
import { empty, Observable, of } from 'rxjs';
import { catchError, expand, filter, map, flatMap } from 'rxjs/operators';
import {
  finishExecution,
  startStepExecution,
  stepExecution,
} from '../ngrx/dataflow-execution.actions';
import { Dataflow } from '../types/dataflow.type';
import { ExecutionScope } from '../types/execution-scope.type';
import { HttpRequestTemplate } from '../types/http-request-template.type';
import { Step } from '../types/step.type';
import { VariableMap } from '../types/variabe-map.type';
import { ofType } from '@ngrx/effects';

@Injectable({
  providedIn: 'root',
})
export class ExecutionService {
  constructor(private http: HttpClient) {}

  executeDataflow(dataflow: Dataflow): Observable<Action> {
    return of<Action>(
      startStepExecution({
        scope: {
          steps: dataflow.steps,
          stepIndex: 0,
          variables: {},
        },
      })
    ).pipe(
      expand((action) =>
        of(action).pipe(
          ofType(startStepExecution),
          flatMap((a) => this.executeStep(a.scope))
        )
      )
    );
  }

  executeStep(scope: ExecutionScope): Observable<Action> {
    const step = scope.steps[scope.stepIndex];
    if (!isNil(step?.request)) {
      return this.executeRequestStep(step, scope);
    } else if (!isNil(step?.expression)) {
      return this.executeExpressionStep(step, scope);
    } else if (!isNil(step?.for)) {
      return this.executeForLoopStep(step, scope);
    } else {
      return of({
        error:
          "Step does not contain any of 'request', 'expression' and 'for'.",
      }).pipe(
        map((evaluation) => this.addEvaluationToScope(scope, evaluation)),
        map((newScope) => this.createNextStep(newScope))
      );
    }
  }

  private executeRequestStep(
    step: Step,
    scope: ExecutionScope
  ): Observable<Action> {
    return this.request(
      this.createHttpRequest(step.request, this.extractVariableMap(scope))
    ).pipe(
      catchError((response) => of(response)),
      map((evaluation) => this.addEvaluationToScope(scope, evaluation)),
      map((newScope) => this.createNextStep(newScope))
    );
  }

  private executeExpressionStep(
    step: Step,
    scope: ExecutionScope
  ): Observable<Action> {
    return of(step.expression).pipe(
      map((expression) => jsone(expression, this.extractVariableMap(scope))),
      catchError((error) => of({ error: error.toString() })),
      map((evaluation) => this.addEvaluationToScope(scope, evaluation)),
      map((newScope) => this.createNextStep(newScope))
    );
  }

  private executeForLoopStep(
    step: Step,
    scope: ExecutionScope
  ): Observable<Action> {
    const subScope = {
      stepIndex: 0,
      steps: step.for.do,
      variables: {},
    };
    return of(stepExecution({ scope: subScope })).pipe(
      expand((action) =>
        action.type === stepExecution.type
          ? this.executeStep(action.scope).pipe(
              map((a) => {
                if (a.type === stepExecution.type) {
                  return a;
                } else if (a.type === startStepExecution.type) {
                  return stepExecution({ scope: (a as any).scope });
                } else {
                  return a;
                }
              })
            )
          : empty()
      ),
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
      : startStepExecution({
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
