import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import jsone from 'json-e';
import { isNil } from 'lodash';
import { mapKeys } from 'lodash/fp';
import { Observable, of, range, from } from 'rxjs';
import {
  catchError,
  concatAll,
  endWith,
  filter,
  map,
  scan,
  share,
  switchMap,
  concatMap,
  tap,
  shareReplay,
} from 'rxjs/operators';
import { stepExecution } from '../ngrx/dataflow-execution.actions';
import { Dataflow } from '../types/dataflow.type';
import { ExecutionScope } from '../types/execution-scope.type';
import { HttpRequestTemplate } from '../types/http-request-template.type';
import { Step } from '../types/step.type';
import { VariableMap } from '../types/variable-map.type';

@Injectable({
  providedIn: 'root',
})
export class ExecutionService {
  constructor(private http: HttpClient) {}

  executeDataflow(dataflow: Dataflow): Observable<Action> {
    const initialScope = {
      steps: dataflow.steps,
      stepIndex: 0,
      parentVariables: {},
      localVariables: {},
    };
    return this.executeSteps(initialScope);
  }

  private executeSteps(scope: ExecutionScope): Observable<Action> {
    return range(0, scope.steps.length).pipe(
      scan(
        (acc, index) =>
          acc.pipe(
            filter((action) => action.scope.stepIndex === index),
            switchMap((action) => {
              const step = action.scope.steps[action.scope.stepIndex];
              return this.executeStep(step)(action.scope);
            }),
            shareReplay()
          ),
        of(stepExecution({ scope }))
      ),
      concatAll()
    );
  }

  executeStep(step: Step): (ExecutionScope) => Observable<Action> {
    if (!isNil(step?.request)) {
      return this.executeRequestStep(step);
    } else if (!isNil(step?.expression)) {
      return this.executeExpressionStep(step);
    } else if (!isNil(step?.for)) {
      return this.executeForLoop(step);
    } else {
      return this.executionFailure();
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

  private executeForLoop(step: Step): (ExecutionScope) => Observable<Action> {
    return (scope) => {
      const parentVariables = this.extractVariableMap(scope);
      return from(parentVariables[step.for.in]).pipe(
        map((loopVariableValue, loopIndex) => ({
          stepIndex: 0,
          loopIndex,
          steps: step.for.do,
          parentVariables: {
            ...parentVariables,
            [step.for.const]: loopVariableValue,
          },
          localVariables: {},
        })),
        concatMap((initialScope) => this.executeSteps(initialScope)),
        map((action) => this.liftToParentScope(scope, action)),
        concatMap((action) =>
          action.scope.subScope.loopIndex + 1 ===
            parentVariables[step.for.in].length &&
          action.scope.subScope.stepIndex + 1 === step.for.do.length
            ? of(action, this.createNextStep(action.scope))
            : of(action)
        )
      );
    };
  }

  private liftToParentScope(parentScope: any, action: any) {
    return stepExecution({
      scope: {
        ...parentScope,
        subScope: action.scope,
      },
    });
  }

  private executionFailure(): (ExecutionScope) => Observable<Action> {
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
      localVariables: {
        ...scope.localVariables,
        [scope.stepIndex]: evaluation,
      },
    };
  }

  extractVariableMap(scope: ExecutionScope): VariableMap {
    return {
      ...scope.parentVariables,
      ...this.extractLocalVariableMap(scope),
    };
  }

  extractLocalVariableMap(scope: ExecutionScope): VariableMap {
    return mapKeys(
      (stepIndex) => scope.steps[stepIndex].assignTo,
      scope.localVariables
    );
  }

  createNextStep(scope: ExecutionScope): Action {
    return stepExecution({
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
