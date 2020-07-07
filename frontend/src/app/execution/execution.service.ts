import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import jsone from 'json-e';
import { isNil } from 'lodash';
import { Observable, of } from 'rxjs';
import { catchError, filter, map } from 'rxjs/operators';
import { finishStepExecution } from '../ngrx/dataflow-execution.actions';
import { ExecutionScope } from '../types/execution-scope.type';
import { HttpRequestTemplate } from '../types/http-request-template.type';
import { VariableMap } from '../types/variabe-map.type';

@Injectable({
  providedIn: 'root',
})
export class ExecutionService {
  constructor(private http: HttpClient) {}

  executeStep(scope: ExecutionScope): Observable<Action> {
    const step = scope.steps[scope.stepIndex];
    if (!isNil(step?.request)) {
      return this.request(
        this.createHttpRequest(step.request, scope.variables)
      ).pipe(
        catchError((response) => of(response)),
        map((evaluation) =>
          finishStepExecution({
            scope: this.addEvaluationToScope(scope, evaluation),
            evaluation,
          })
        )
      );
    } else if (!isNil(step?.expression)) {
      return of(step.expression).pipe(
        map((expression) => jsone(expression, scope.variables)),
        catchError((error) => of({ error: error.toString() })),
        map((evaluation) =>
          finishStepExecution({
            scope: this.addEvaluationToScope(scope, evaluation),
            evaluation,
          })
        )
      );
    } else if (!isNil(step?.for)) {
      return of({ error: 'Not yet implemented' }).pipe(
        map((evaluation) =>
          finishStepExecution({
            scope: this.addEvaluationToScope(scope, evaluation),
            evaluation,
          })
        )
      );
    } else {
      return of({
        error:
          "Step does not contain any of 'request', 'expression' and 'for'.",
      }).pipe(
        map((evaluation) =>
          finishStepExecution({
            scope: this.addEvaluationToScope(scope, evaluation),
            evaluation,
          })
        )
      );
    }
  }

  addEvaluationToScope(scope: ExecutionScope, evaluation: any): ExecutionScope {
    return {
      ...scope,
      variables: {
        ...scope.variables,
        [scope.steps[scope.stepIndex].assignTo]: evaluation,
      },
    };
  }

  private interpolate(variables, str: string) {
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
