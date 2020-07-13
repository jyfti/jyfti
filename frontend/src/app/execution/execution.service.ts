import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import jsone from 'json-e';
import { isNil } from 'lodash';
import { mapKeys } from 'lodash/fp';
import { from, Observable, of, range } from 'rxjs';
import {
  catchError,
  concatAll,
  concatMap,
  filter,
  map,
  scan,
  shareReplay,
  switchMap,
} from 'rxjs/operators';
import { stepExecution } from '../ngrx/dataflow-execution.actions';
import { Dataflow } from '../types/dataflow.type';
import { ExecutionScope } from '../types/execution-scope.type';
import { HttpRequestTemplate } from '../types/http-request-template.type';
import { Step } from '../types/step.type';
import { VariableMap } from '../types/variable-map.type';

export function createExecution(http: HttpClient) {
  function executeDataflow(dataflow: Dataflow): Observable<Action> {
    const initialScope = {
      steps: dataflow.steps,
      stepIndex: 0,
      parentVariables: {},
      localVariables: {},
    };
    return executeSteps(initialScope);
  }

  function executeSteps(scope: ExecutionScope): Observable<Action> {
    return range(0, scope.steps.length).pipe(
      scan(
        (acc, index) =>
          acc.pipe(
            filter((action) => action.scope.stepIndex === index),
            switchMap((action) => {
              const step = action.scope.steps[action.scope.stepIndex];
              return executeStep(step)(action.scope);
            }),
            shareReplay()
          ),
        of(stepExecution({ scope }))
      ),
      concatAll()
    );
  }

  function executeStep(step: Step): (ExecutionScope) => Observable<Action> {
    if (!isNil(step?.request)) {
      return executeRequestStep(step);
    } else if (!isNil(step?.expression)) {
      return executeExpressionStep(step);
    } else if (!isNil(step?.for)) {
      return executeForLoop(step);
    } else {
      return executionFailure();
    }
  }

  function executeRequestStep(
    step: Step
  ): (ExecutionScope) => Observable<Action> {
    return (scope) =>
      request(createHttpRequest(step.request, extractVariableMap(scope))).pipe(
        catchError((response) => of(response)),
        map((evaluation) => addEvaluationToScope(scope, evaluation)),
        map((newScope) => createNextStep(newScope))
      );
  }

  function executeExpressionStep(
    step: Step
  ): (ExecutionScope) => Observable<Action> {
    return (scope) =>
      of(step.expression).pipe(
        map((expression) => jsone(expression, extractVariableMap(scope))),
        catchError((error) => of({ error: error.toString() })),
        map((evaluation) => addEvaluationToScope(scope, evaluation)),
        map((newScope) => createNextStep(newScope))
      );
  }

  function executeForLoop(step: Step): (ExecutionScope) => Observable<Action> {
    return (scope) => {
      const parentVariables = extractVariableMap(scope);
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
        concatMap((initialScope) => executeSteps(initialScope)),
        map((action) => liftToParentScope(scope, action)),
        concatMap((action) =>
          action.scope.subScope.loopIndex + 1 ===
            parentVariables[step.for.in].length &&
          action.scope.subScope.stepIndex + 1 === step.for.do.length
            ? of(action, createNextStep(action.scope))
            : of(action)
        )
      );
    };
  }

  function liftToParentScope(parentScope: any, action: any) {
    return stepExecution({
      scope: {
        ...parentScope,
        subScope: action.scope,
      },
    });
  }

  function executionFailure(): (ExecutionScope) => Observable<Action> {
    return (scope) =>
      of({
        error:
          "Step does not contain any of 'request', 'expression' and 'for'.",
      }).pipe(
        map((evaluation) => addEvaluationToScope(scope, evaluation)),
        map((newScope) => createNextStep(newScope))
      );
  }

  function addEvaluationToScope(
    scope: ExecutionScope,
    evaluation: any
  ): ExecutionScope {
    return {
      ...scope,
      localVariables: {
        ...scope.localVariables,
        [scope.stepIndex]: evaluation,
      },
    };
  }

  function extractVariableMap(scope: ExecutionScope): VariableMap {
    return {
      ...scope.parentVariables,
      ...extractLocalVariableMap(scope),
    };
  }

  function extractLocalVariableMap(scope: ExecutionScope): VariableMap {
    return mapKeys(
      (stepIndex) => scope.steps[stepIndex].assignTo,
      scope.localVariables
    );
  }

  function createNextStep(scope: ExecutionScope): Action {
    return stepExecution({
      scope: {
        ...scope,
        stepIndex: scope.stepIndex + 1,
      },
    });
  }

  function interpolate(variables: VariableMap, str: string) {
    const identifiers = Object.keys(variables);
    const values = Object.values(variables);
    return new Function(...identifiers, `return \`${str}\`;`)(...values);
  }

  function createHttpRequest(
    template: HttpRequestTemplate,
    variables: VariableMap
  ) {
    return new HttpRequest(
      template.method as any,
      interpolate(variables, template.url),
      jsone(JSON.parse(template.body), variables),
      { headers: jsone(JSON.parse(template.headers), variables) }
    );
  }

  function request(
    httpRequest: HttpRequest<any>
  ): Observable<HttpResponse<any>> {
    return http.request(httpRequest).pipe(
      filter((httpEvent) => httpEvent instanceof HttpResponse),
      map((httpEvent) => httpEvent as HttpResponse<any>)
    );
  }

  return { executeDataflow };
}
