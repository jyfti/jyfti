import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { filter, map, catchError } from 'rxjs/operators';
import { HttpRequestTemplate } from '../types/http-request-template.type';
import { VariableMap } from '../types/variabe-map.type';
import jsone from 'json-e';
import { Step } from '../types/step.type';

@Injectable({
  providedIn: 'root',
})
export class ExecutionService {
  constructor(private http: HttpClient) {}

  executeStep(step: Step, variables: VariableMap): Observable<any> {
    if (step?.request) {
      return this.request(this.createHttpRequest(step.request, variables)).pipe(
        catchError((response) => of(response))
      );
    } else if (step?.expression) {
      return of(step.expression).pipe(
        map((expression) => jsone(expression, variables)),
        catchError((error) => of({ error: error.toString() }))
      );
    }
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
