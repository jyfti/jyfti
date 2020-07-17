import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import jsone from 'json-e';
import { isNil } from 'lodash';
import { mapKeys } from 'lodash/fp';
import { from, Observable, of, range, empty } from 'rxjs';
import {
  catchError,
  concatAll,
  concatMap,
  filter,
  map,
  scan,
  shareReplay,
  switchMap,
  last,
  reduce,
  tap,
} from 'rxjs/operators';
import { stepExecution } from '../ngrx/dataflow-execution.actions';
import { Dataflow } from '../types/dataflow.type';
import { ExecutionScope } from '../types/execution-scope.type';
import { HttpRequestTemplate } from '../types/http-request-template.type';
import { Step } from '../types/step.type';
import { VariableMap } from '../types/variable-map.type';
import { TypedAction } from '@ngrx/store/src/models';

type StepAction = TypedAction<'[Execution] Step'> & {
  scope: ExecutionScope;
};

class ExecutionResult {
  constructor(
    public byproduct: Observable<StepAction>,
    public initiator?: StepAction
  ) {}
}

@Injectable({
  providedIn: 'root',
})
export class ExecutionService {
  constructor(private http: HttpClient) {}

  executeDataflow(dataflow: Dataflow): Observable<StepAction> {
    const initialScope = {
      steps: dataflow.steps,
      stepIndex: 0,
      parentVariables: {},
      localVariables: {},
    };
    return this.executeSteps(initialScope).pipe(
      concatMap((result) => result.byproduct)
    );
  }

  private executeSteps(scope: ExecutionScope): Observable<ExecutionResult> {
    const actions = range(0, scope.steps.length).pipe(
      scan(
        (acc, index) =>
          acc.pipe(
            filter((result) => !!result.initiator),
            map((result) => result.initiator.scope),
            filter((scope) => scope.stepIndex === index),
            switchMap((scope) => {
              const step = scope.steps[scope.stepIndex];
              return this.executeStep(step)(scope);
            }),
            shareReplay()
          ),
        of(new ExecutionResult(empty(), stepExecution({ scope })))
      ),
      concatAll()
    );
    return actions.pipe(
      reduce(
        (acc, result) =>
          new ExecutionResult(
            of(acc.byproduct, result.byproduct).pipe(concatAll()),
            result.initiator
          )
      )
    );
  }

  executeStep(step: Step): (ExecutionScope) => Observable<ExecutionResult> {
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
  ): (ExecutionScope) => Observable<ExecutionResult> {
    return (scope) => {
      const actions = this.request(
        this.createHttpRequest(step.request, this.extractVariableMap(scope))
      ).pipe(
        catchError((response) => of(response)),
        map((evaluation) => this.addEvaluationToScope(scope, evaluation))
      );
      return actions.pipe(
        map(
          (scope) =>
            new ExecutionResult(
              of(stepExecution({ scope })),
              this.createNextStep(scope)
            )
        )
      );
    };
  }

  private executeExpressionStep(
    step: Step
  ): (ExecutionScope) => Observable<ExecutionResult> {
    return (scope) => {
      const actions = of(step.expression).pipe(
        map((expression) => jsone(expression, this.extractVariableMap(scope))),
        catchError((error) => of({ error: error.toString() })),
        map((evaluation) => this.addEvaluationToScope(scope, evaluation))
      );
      return actions.pipe(
        map(
          (scope) =>
            new ExecutionResult(
              of(stepExecution({ scope })),
              this.createNextStep(scope)
            )
        )
      );
    };
  }

  private executeForLoop(
    step: Step
  ): (ExecutionScope) => Observable<ExecutionResult> {
    return (scope) => {
      const parentVariables = this.extractVariableMap(scope);
      const results = from(parentVariables[step.for.in]).pipe(
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
        concatMap((initialScope) => this.executeSteps(initialScope))
      );
      return results.pipe(
        last(),
        tap(console.log),
        map(
          (result) =>
            new ExecutionResult(
              results.pipe(
                map((result) => result.initiator),
                map((action) => this.liftToParentScope(scope, action))
              ),
              result.initiator.scope.loopIndex + 1 ===
                parentVariables[step.for.in].length &&
              result.initiator.scope.stepIndex + 1 === step.for.do.length
                ? this.createNextStep(scope)
                : null
            )
        )
      );
    };
  }

  private liftToParentScope(parentScope: any, action: any): StepAction {
    return stepExecution({
      scope: {
        ...parentScope,
        subScope: action.scope,
      },
    });
  }

  private executionFailure(): (ExecutionScope) => Observable<ExecutionResult> {
    return (scope) => {
      const actions = of({
        error:
          "Step does not contain any of 'request', 'expression' and 'for'.",
      }).pipe(
        map((evaluation) => this.addEvaluationToScope(scope, evaluation))
      );
      return actions.pipe(
        map(
          (scope) =>
            new ExecutionResult(
              of(stepExecution({ scope })),
              this.createNextStep(scope)
            )
        )
      );
    };
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

  createNextStep(scope: ExecutionScope): StepAction {
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
