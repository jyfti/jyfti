import { Injectable } from '@angular/core';
import { HttpRequest, HttpClient, HttpResponse } from '@angular/common/http';
import { VariableMap } from '../types/variable-map.type';
import { isNil } from 'lodash';
import jsone from 'json-e';
import { HttpRequestTemplate } from '../types/http-request-template.type';
import { Observable, of } from 'rxjs';
import { filter, map, catchError, flatMap } from 'rxjs/operators';
import { Step, JsonExpression } from '../types/step.type';

export type Evaluation = any;

@Injectable({
  providedIn: 'root',
})
export class ExecutionNewService {
  constructor(private http: HttpClient) {}

  executeStep(step: Step, variables: VariableMap): Observable<Evaluation> {
    if (!isNil(step?.request)) {
      return this.executeRequestStep(step, variables);
    } else if (!isNil(step?.expression)) {
      return this.executeExpressionStep(step, variables);
    } else {
      return of({
        error:
          "Step does not contain any of 'request', 'expression' and 'for'.",
      });
    }
  }

  executeRequestStep(
    step: Step,
    variables: VariableMap
  ): Observable<Evaluation> {
    return of(this.createHttpRequest(step.request, variables)).pipe(
      flatMap((request) => this.request(request)),
      catchError((response) => of(response))
    );
  }

  executeExpressionStep(
    step: Step,
    variables: VariableMap
  ): Observable<Evaluation> {
    return of(step.expression).pipe(
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
