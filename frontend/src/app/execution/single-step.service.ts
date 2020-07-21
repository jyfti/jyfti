import { Injectable } from '@angular/core';
import { HttpRequestTemplate } from '../types/http-request-template.type';
import { VariableMap } from '../types/variable-map.type';
import { Observable, of } from 'rxjs';
import { Evaluation } from './execution.service';
import { flatMap, catchError, map, filter } from 'rxjs/operators';
import { JsonExpression } from '../types/step.type';
import jsone from 'json-e';
import { isNil } from 'lodash';
import { HttpRequest, HttpResponse, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SingleStepService {
  constructor(private http: HttpClient) {}

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
